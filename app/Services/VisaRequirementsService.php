<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\Client;
use App\Models\Country;
use App\Models\ServiceBooking;
use App\Models\User;
use App\Models\Visa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Data for the "Travel Visa Requirements" search, shared by the public page
 * and the agency/admin page so both behave the same.
 */
class VisaRequirementsService
{
    public function __construct(
        protected VisaService $visaService,
        protected CountryService $countryService,
        protected ContactInfoService $contactInfoService,
        protected VisaPricingService $pricingService,
    ) {
    }

    /**
     * $firstStep: the search page opened directly (not the fallback after
     * Check Requirements). When "Edit" opens it, the countries are only
     * pre-chosen; the visas found belong to the next step, so none are listed.
     */
    public function pageData(Request $request, bool $firstStep = false): array
    {
        $request->validate([
            'from' => 'nullable|string|exists:countries,uid',
            'to' => 'nullable|string|exists:countries,uid',
        ]);

        $from = $this->countryByUid($request->query('from'));
        $to = $this->countryByUid($request->query('to'));
        $editing = $this->bookingBeingEdited($request);
        $searched = ($from !== null || $to !== null) && ! ($firstStep && $editing);

        return [
            'countries' => $this->countryService->all(),
            'filters' => ['from' => $from?->uid, 'to' => $to?->uid],
            'searched' => $searched,
            'visas' => $searched ? $this->visaService->search($from?->id, $to?->id) : [],
            'contact' => $this->contactInfoService->getInfo()?->only(['phone', 'email']),
            'currency' => config('currency'),
            // Set while "Edit" on a booking walks through the steps again
            'editing' => $this->editingSummary($editing),
        ];
    }

    /**
     * The results page: visas for a route (from = citizenship, to = destination),
     * each with its cost rows taxed and converted for the "Living In" country
     * (the citizenship country when none is chosen).
     * Unknown uids fail validation; the controller turns that into a 404.
     */
    public function resultData(Request $request): array
    {
        $request->validate([
            'from' => 'required|string|exists:countries,uid',
            'to' => 'required|string|exists:countries,uid',
            'living_in' => 'nullable|string|exists:countries,uid',
            'visa' => 'nullable|string|exists:visas,uid',
        ]);

        $from = $this->countryByUid($request->query('from'));
        $to = $this->countryByUid($request->query('to'));
        $livingIn = $this->countryByUid($request->query('living_in'));

        $pricing = $this->pricingContext($livingIn ?? $from);
        $visas = $this->visaService->search($from->id, $to->id);

        // The admin Preview button opens a specific visa, first in the list and
        // therefore selected, even if it is inactive. Only the superadmin may.
        $previewUid = $request->query('visa');
        $preview = $previewUid && Auth::guard('web')->check()
            ? $this->visaService->preview($previewUid, $from->id, $to->id)
            : null;
        if ($preview) {
            $visas = $visas->reject(fn ($visa) => $visa->id === $preview->id)->prepend($preview)->values();
        }

        $visas->each(fn ($visa) => $visa->setAttribute('priced_costs', $this->pricingService->priceRows($visa, $pricing)));

        return [
            'countries' => $this->countryService->all(),
            'filters' => ['from' => $from->uid, 'to' => $to->uid, 'living_in' => $livingIn?->uid],
            'visas' => $visas->values(),
            'pricing' => $pricing,
            'contact' => $this->contactInfoService->getInfo()?->only(['phone', 'email']),
            // True when this page was opened from the admin visa list's Preview button.
            'isPreview' => (bool) $preview,
            'editing' => $this->editingSummary($this->bookingBeingEdited($request)),
        ];
    }

    /**
     * The "GET STARTED" screen for one visa: its priced cost rows (same
     * pricing context as the results page), the Date of Entry step, and the
     * current agency's/superadmin's own clients for the existing/new
     * client picker.
     */
    public function applyData(Request $request): array
    {
        $request->validate([
            'visa' => 'required|string|exists:visas,uid',
            'from' => 'required|string|exists:countries,uid',
            'to' => 'required|string|exists:countries,uid',
            'living_in' => 'nullable|string|exists:countries,uid',
            'cost' => 'nullable|integer',
        ]);

        $from = $this->countryByUid($request->query('from'));
        $to = $this->countryByUid($request->query('to'));
        $livingIn = $this->countryByUid($request->query('living_in'));

        $owner = $this->contactInfoService->currentOwner();
        $pricing = $this->pricingContext($livingIn ?? $from);

        // Every visa on this route, so the Visa Category can be switched on
        // this screen. The one picked on the results page is always included
        // (it may be an inactive one opened through the admin Preview).
        $visa = Visa::where('uid', $request->query('visa'))->firstOrFail();
        $visas = $this->visaService->search($from->id, $to->id);
        if (! $visas->contains('id', $visa->id)) {
            $visas->prepend($visa);
        }

        $visas = $visas->map(fn ($row) => [
            'uid' => $row->uid,
            'name' => $row->name,
            'title' => $row->title,
            'priced_costs' => $this->pricingService->priceRows($row, $pricing),
        ])->values();

        // The existing/new client picker needs the same permission as the
        // Clients page; without it the list isn't sent at all.
        // Each client comes with what the passenger step pre-fills: their own
        // details (Self) and their family members.
        $canSelectClient = $this->canViewClients();
        $clients = $canSelectClient
            ? $this->ownedClients($owner)
                ->with(['passport:id,client_id,passport_number', 'familyMembers:id,client_id,name,relation,passport_number'])
                ->orderBy('name')
                ->get()
                ->map(fn (Client $client) => [
                    'uid' => $client->uid,
                    'name' => $client->name,
                    'first_name' => $client->first_name ?: $this->splitName($client->name)[0],
                    'last_name' => $client->last_name ?: $this->splitName($client->name)[1],
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'nationality' => $client->nationality,
                    'passport_number' => $client->passport?->passport_number,
                    'family' => $client->familyMembers->map(fn ($member) => [
                        'id' => $member->id,
                        'first_name' => $this->splitName($member->name)[0],
                        'last_name' => $this->splitName($member->name)[1],
                        'relation' => $member->relation,
                        'passport_number' => $member->passport_number,
                    ])->values(),
                ])
            : [];

        // While editing, the booking's own visa type is picked again (if it's still this visa)
        $editing = $this->bookingBeingEdited($request);
        $costId = $request->query('cost') ? (int) $request->query('cost') : null;
        if ($editing && ($editing->details['visa_uid'] ?? null) === $visa->uid && ! empty($editing->details['visa_cost_id'])) {
            $costId = (int) $editing->details['visa_cost_id'];
        }

        return [
            'filters' => ['from' => $from->uid, 'to' => $to->uid, 'living_in' => $livingIn?->uid],
            'visas' => $visas,
            'visaUid' => $visa->uid,
            'costId' => $costId,
            'booking' => $editing ? $this->bookingPrefill($editing) : null,
            'destinationName' => $to->countryName,
            'destinationFlag' => $to->flag_url,
            'pricing' => $pricing,
            'clients' => $clients,
            'canSelectClient' => $canSelectClient,
        ];
    }

    /**
     * "Edit" on a visa booking starts at the first step, the country search,
     * with the booking's own countries chosen. The booking's uid then rides
     * along (?booking=) through Results and Apply, where saving updates it.
     */
    public function editStartParams(ServiceBooking $booking): array
    {
        $d = $booking->details ?? [];
        $visa = Visa::where('uid', $d['visa_uid'] ?? null)->first();

        // Bookings made before the country uids were stored fall back to the
        // visa's own route and the Living In country's name
        return array_filter([
            'from' => $d['origin_uid'] ?? ($visa ? Country::find($visa->origin_country_id)?->uid : null),
            'to' => $d['destination_uid'] ?? ($visa ? Country::find($visa->destination_country_id)?->uid : null),
            'living_in' => $d['living_in_uid']
                ?? (! empty($d['living_in']) ? Country::where('countryName', $d['living_in'])->value('uid') : null),
            'booking' => $booking->uid,
        ]);
    }

    /** The visa booking named by ?booking=, if it's this owner's own; null otherwise. */
    public function bookingBeingEdited(Request $request): ?ServiceBooking
    {
        $uid = $request->query('booking');
        if (! is_string($uid) || $uid === '') {
            return null;
        }
        $owner = $this->contactInfoService->currentOwner();

        return ServiceBooking::where('uid', $uid)
            ->where('service', 'visa')
            ->where('owner_type', $owner ? get_class($owner) : null)
            ->where('owner_id', $owner?->id)
            ->first();
    }

    /** The banner on Search / Results while editing: which booking, and what it was booked with. */
    private function editingSummary(?ServiceBooking $booking): ?array
    {
        return $booking ? [
            'uid' => $booking->uid,
            'invoice_number' => $booking->invoice_number,
            'visa_uid' => $booking->details['visa_uid'] ?? null,
            // Same lookup as the Edit redirect (older bookings only stored the name)
            'living_in' => $this->editStartParams($booking)['living_in'] ?? null,
        ] : null;
    }

    /** Everything the Apply page fills back in from the booking being edited. */
    private function bookingPrefill(ServiceBooking $booking): array
    {
        $booking->loadMissing('applications', 'client:id,uid');

        return [
            'uid' => $booking->uid,
            'invoice_number' => $booking->invoice_number,
            'date_of_entry' => $booking->service_date?->toDateString(),
            'client' => $booking->client?->uid,
            'passengers' => $booking->applications->map(fn ($a) => [
                'relation' => $a->relation,
                'family_member_id' => $a->client_family_member_id,
                'first_name' => $a->first_name,
                'last_name' => $a->last_name ?? '',
                'email' => $a->email ?? '',
                'passport_number' => $a->passport_number ?? '',
                'nationality' => $a->nationality ?? '',
                'phone' => $a->phone ?? '',
            ])->values(),
        ];
    }

    /**
     * Books the visa from the Apply page: one service booking (with its
     * invoice number) and one application per passenger. Prices are worked
     * out again here from the chosen cost row, never taken from the form.
     * With $existing (the Edit flow) that booking is updated instead, keeping
     * its invoice number, and its applications are replaced.
     */
    public function storeApplication(Request $request, ?ServiceBooking $existing = null): ServiceBooking
    {
        // An edited booking may keep a date of entry that's now in the past
        $keepsDate = $existing && $request->input('date_of_entry') === $existing->service_date?->toDateString();

        $validated = $request->validate([
            'visa' => 'required|string|exists:visas,uid',
            'cost' => 'required|integer',
            'from' => 'required|string|exists:countries,uid',
            'to' => 'required|string|exists:countries,uid',
            'living_in' => 'nullable|string|exists:countries,uid',
            'date_of_entry' => $keepsDate ? 'required|date' : 'required|date|after_or_equal:today',
            'client' => 'nullable|string',
            'passengers' => 'required|array|min:1',
            'passengers.*.relation' => 'required|string|max:50',
            'passengers.*.family_member_id' => 'nullable|integer',
            'passengers.*.first_name' => 'required|string|max:255',
            'passengers.*.last_name' => 'required|string|max:255',
            'passengers.*.email' => 'nullable|email|max:255',
            'passengers.*.passport_number' => 'nullable|string|max:50',
            'passengers.*.nationality' => 'nullable|string|max:100',
            'passengers.*.phone' => 'nullable|string|max:50',
        ], [], [
            'passengers.*.first_name' => 'first name',
            'passengers.*.last_name' => 'last name',
            'passengers.*.email' => 'email',
        ]);

        $from = $this->countryByUid($validated['from']);
        $to = $this->countryByUid($validated['to']);
        $livingIn = $this->countryByUid($validated['living_in'] ?? null);
        $owner = $this->contactInfoService->currentOwner();

        $visa = Visa::where('uid', $validated['visa'])->firstOrFail();
        $pricing = $this->pricingContext($livingIn ?? $from);
        $cost = collect($this->pricingService->priceRows($visa, $pricing))->firstWhere('id', (int) $validated['cost']);
        if (! $cost) {
            throw ValidationException::withMessages(['cost' => 'The chosen visa type is no longer available.']);
        }

        // Only this owner's own clients, and only with the Clients permission
        $client = null;
        if (! empty($validated['client'])) {
            abort_unless($this->canViewClients(), 403);
            $client = $this->ownedClients($owner)->where('uid', $validated['client'])->firstOrFail();
        }
        $familyIds = $client ? $client->familyMembers()->pluck('id')->all() : [];

        $count = count($validated['passengers']);

        return DB::transaction(function () use ($validated, $existing, $owner, $client, $familyIds, $visa, $cost, $pricing, $from, $to, $livingIn, $count) {
            $attributes = [
                'client_id' => $client?->id,
                'service_date' => $validated['date_of_entry'],
                'passengers' => $count,
                'currency_code' => $pricing['code'],
                'currency_symbol' => $pricing['symbol'],
                'base_amount' => $cost['embassy_fee'] * $count,
                'service_fee' => $cost['service_fee'] * $count,
                'tax_amount' => $cost['tax_fee'] * $count,
                'total_amount' => $cost['total_cost'] * $count,
                'details' => [
                    'visa_uid' => $visa->uid,
                    'visa_name' => $visa->name ?: $visa->title,
                    'visa_cost_id' => $cost['id'],
                    'visa_type' => $cost['type'],
                    'validity' => $cost['validation_process'],
                    'processing_time' => $cost['processing_time'],
                    'origin' => $from->countryName,
                    'origin_uid' => $from->uid,
                    'destination' => $to->countryName,
                    'destination_uid' => $to->uid,
                    'destination_flag' => $to->flag_url,
                    'living_in' => $livingIn?->countryName,
                    'living_in_uid' => $livingIn?->uid,
                    // Per passenger, as priced
                    'embassy_fee' => $cost['embassy_fee'],
                    'service_fee' => $cost['service_fee'],
                    'tax_fee' => $cost['tax_fee'],
                    'taxes' => $pricing['taxes'],
                ],
            ];

            if ($existing) {
                $existing->update($attributes);
                $existing->applications()->delete();
                $booking = $existing;
            } else {
                $booking = ServiceBooking::create($attributes + [
                    'service' => 'visa',
                    'owner_type' => $owner ? get_class($owner) : null,
                    'owner_id' => $owner?->id,
                ]);
            }

            foreach ($validated['passengers'] as $passenger) {
                $memberId = isset($passenger['family_member_id']) ? (int) $passenger['family_member_id'] : null;

                $booking->applications()->create([
                    'client_family_member_id' => in_array($memberId, $familyIds, true) ? $memberId : null,
                    'relation' => $passenger['relation'],
                    'first_name' => $passenger['first_name'],
                    'last_name' => $passenger['last_name'],
                    'email' => $passenger['email'] ?? null,
                    'passport_number' => $passenger['passport_number'] ?? null,
                    'nationality' => $passenger['nationality'] ?? null,
                    'phone' => $passenger['phone'] ?? null,
                    'amount' => $cost['total_cost'],
                ]);
            }

            return $booking;
        });
    }

    /** Clients belonging to the given agency / superadmin (null: unowned). */
    private function ownedClients(Agency|User|null $owner)
    {
        return Client::where('owner_type', $owner ? get_class($owner) : null)->where('owner_id', $owner?->id);
    }

    /** "AMARJIT KAUR" -> ["AMARJIT", "KAUR"]; the last word is the last name. */
    private function splitName(?string $name): array
    {
        $parts = preg_split('/\s+/', trim((string) $name)) ?: [];
        if (count($parts) < 2) {
            return [$parts[0] ?? '', ''];
        }
        $last = array_pop($parts);

        return [implode(' ', $parts), $last];
    }

    /**
     * Tax is shown only when the signed-in agency's Tax Status is Active, and
     * the agency's own visa commission is added to the service fee. The
     * superadmin has no agency, so is not restricted and adds no commission.
     * Which tax applies follows the given (Living In) country.
     */
    private function pricingContext(Country $country): array
    {
        $owner = $this->contactInfoService->currentOwner();

        if (! $owner instanceof Agency) {
            return $this->pricingService->context($country);
        }

        return $this->pricingService->context(
            $country,
            (int) $owner->tax_status === 1,
            $owner->commissions()->where('service_name', 'visa')->first(),
        );
    }

    /**
     * Same rule as the sidebar's Clients link: an agency owner has what the
     * superadmin granted the agency, staff and admin users what their roles grant.
     */
    private function canViewClients(): bool
    {
        $agencyUser = Auth::guard('agency')->user();

        if ($agencyUser) {
            return $agencyUser->is_owner
                ? $agencyUser->agency->permissions->contains('name', 'client.view')
                : $agencyUser->getAllPermissions()->contains('name', 'client.view');
        }

        $user = Auth::guard('web')->user();

        return $user !== null && $user->getAllPermissions()->contains('name', 'client.view');
    }

    private function countryByUid(?string $uid): ?Country
    {
        return $uid ? Country::where('uid', $uid)->first() : null;
    }
}

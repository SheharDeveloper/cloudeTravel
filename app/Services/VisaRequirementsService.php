<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function pageData(Request $request): array
    {
        $request->validate([
            'from' => 'nullable|string|exists:countries,uid',
            'to' => 'nullable|string|exists:countries,uid',
        ]);

        $from = $this->countryByUid($request->query('from'));
        $to = $this->countryByUid($request->query('to'));
        $searched = $from !== null || $to !== null;

        return [
            'countries' => $this->countryService->all(),
            'filters' => ['from' => $from?->uid, 'to' => $to?->uid],
            'searched' => $searched,
            'visas' => $searched ? $this->visaService->search($from?->id, $to?->id) : [],
            'contact' => $this->contactInfoService->getInfo()?->only(['phone', 'email']),
            'currency' => config('currency'),
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

        // Tax is shown only when the signed-in agency's Tax Status is Active (the
        // superadmin has no agency, so is not restricted). Which tax applies
        // follows Living In, which defaults to the citizenship country.
        $owner = $this->contactInfoService->currentOwner();
        $taxEnabled = $owner instanceof Agency ? (int) $owner->tax_status === 1 : true;

        $pricing = $this->pricingService->context($livingIn ?? $from, $taxEnabled);
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
        ];
    }

    private function countryByUid(?string $uid): ?Country
    {
        return $uid ? Country::where('uid', $uid)->first() : null;
    }
}

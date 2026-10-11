<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\Client;
use App\Models\Domain;
use App\Models\ServiceBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Client Login: a client signs in on their agency's own domain with their
 * email and the password the agency set for them, and sees their profile.
 * A client only ever signs in on the domain of the agency they belong to —
 * never on another agency's domain, nor on the superadmin's.
 */
class ClientPortalService
{
    /** The agency whose domain this request is on (null on the superadmin domain). */
    public function agencyFor(Request $request): ?Agency
    {
        $tenant = $request->attributes->get('tenant');

        return $tenant ? Agency::where('tenant_id', $tenant->id)->first() : null;
    }

    /**
     * Signs the client in: one of this agency's active clients, with a
     * password set, whose password matches.
     *
     * @throws ValidationException
     */
    public function login(Agency $agency, string $email, string $password, bool $remember): Client
    {
        $client = Client::where('owner_type', Agency::class)
            ->where('owner_id', $agency->id)
            ->where('email', $email)
            ->whereNotNull('password')
            ->get()
            ->first(fn (Client $c) => Hash::check($password, $c->password));

        if (! $client) {
            throw ValidationException::withMessages(['email' => 'These credentials do not match our records.']);
        }
        if ($client->status !== 'active') {
            throw ValidationException::withMessages(['email' => 'Your account is inactive. Please contact the agency.']);
        }

        Auth::guard('client')->login($client, $remember);
        $client->forceFill(['last_login_at' => now()])->save();

        return $client;
    }

    /**
     * The signed-in client, if they belong to the agency of this domain and
     * can still sign in (active, password set); otherwise null.
     */
    public function currentClient(Request $request): ?Client
    {
        $client = Auth::guard('client')->user();
        $agency = $this->agencyFor($request);

        if (! $client instanceof Client || ! $agency) {
            return null;
        }

        $belongs = $client->owner_type === Agency::class && (int) $client->owner_id === (int) $agency->id;

        return $belongs && $client->canLogIn() ? $client : null;
    }

    public function logout(Request $request): void
    {
        Auth::guard('client')->logout();
        $request->session()->regenerateToken();
    }

    /** The client's own bookings with this agency, newest first. */
    private function ownBookings(Client $client)
    {
        return ServiceBooking::where('client_id', $client->id)
            ->where('owner_type', $client->owner_type)
            ->where('owner_id', $client->owner_id);
    }

    /** My Bookings: each booking with its travellers and their application status. */
    public function bookings(Client $client): array
    {
        return $this->ownBookings($client)->with('applications')->latest('id')->get()
            ->map(fn (ServiceBooking $b) => [
                'uid' => $b->uid,
                'invoice_number' => $b->invoice_number,
                'service' => $b->service,
                'visa_name' => $b->details['visa_name'] ?? null,
                'visa_type' => $b->details['visa_type'] ?? null,
                'origin' => $b->details['origin'] ?? null,
                'destination' => $b->details['destination'] ?? null,
                'service_date' => $b->service_date?->toDateString(),
                'passengers' => $b->passengers,
                'currency_symbol' => $b->currency_symbol,
                'total_amount' => $b->total_amount,
                'status' => $b->status,
                'booked_on' => $b->created_at?->toIso8601String(),
                'travellers' => $b->applications->map(fn ($a) => [
                    'name' => trim("{$a->first_name} {$a->last_name}"),
                    'application_number' => $a->application_number,
                    'status' => $a->status,
                ])->values()->all(),
            ])->all();
    }

    /** Invoices: one per booking, with whether it is signed and where to view / sign it. */
    public function invoices(Client $client, DocumentSignService $signService): array
    {
        return $this->ownBookings($client)->with('signature')->latest('id')->get()
            ->map(function (ServiceBooking $b) use ($signService) {
                $signature = $b->signature;
                $signed = $b->status === ServiceBooking::STATUS_SIGNED || $signature?->signed_at;

                return [
                    'uid' => $b->uid,
                    'invoice_number' => $b->invoice_number,
                    'visa_name' => $b->details['visa_name'] ?? null,
                    'date' => $b->created_at?->toIso8601String(),
                    'currency_symbol' => $b->currency_symbol,
                    'total_amount' => $b->total_amount,
                    'signed' => (bool) $signed,
                    'signed_at' => $signature?->signed_at?->toIso8601String(),
                    // Still waiting for the client's signature: the signing page
                    'sign_url' => ! $signed && $signature && ! $signature->isExpired() ? $signService->url($signature) : null,
                ];
            })->all();
    }

    /** One of the client's own bookings (for viewing its invoice). */
    public function findBooking(Client $client, string $uid): ServiceBooking
    {
        return $this->ownBookings($client)->where('uid', $uid)->firstOrFail();
    }

    /** What the client sees on My Profile. */
    public function profile(Client $client): array
    {
        $client->loadMissing('address', 'passport', 'familyMembers', 'owner');

        return [
            'cid' => $client->cid,
            'name' => $client->name,
            'first_name' => $client->first_name,
            'last_name' => $client->last_name,
            'email' => $client->email,
            'phone' => $client->phone,
            'nationality' => $client->nationality,
            'gender' => $client->gender,
            'dob' => $client->dob?->toDateString(),
            'status' => $client->status,
            'last_login_at' => $client->last_login_at?->toIso8601String(),
            'agency' => $client->owner instanceof Agency ? $client->owner->agency_name : null,
            'address' => $client->address ? [
                'address' => $client->address->address,
                'city' => $client->address->city,
                'state' => $client->address->state,
                'country' => $client->address->country,
                'zip_code' => $client->address->zip_code,
            ] : null,
            'passport' => $client->passport ? collect($client->passport->only([
                'passport_number', 'place_of_issue', 'date_of_issue', 'expiry_date', 'visa_type', 'visa_number', 'visa_expiry_date',
            ]))->map(fn ($v) => $v instanceof \DateTimeInterface ? $v->format('Y-m-d') : $v)->all() : null,
            'family_members' => $client->familyMembers->map(fn ($m) => [
                'name' => $m->name,
                'relation' => $m->relation,
                'dob' => $m->dob instanceof \DateTimeInterface ? $m->dob->format('Y-m-d') : $m->dob,
                'passport_number' => $m->passport_number,
            ])->values()->all(),
        ];
    }

    /**
     * Gives every client with an email but no password the default one (their
     * email). Returns how many clients got it.
     */
    public function giveDefaultPasswords(): int
    {
        $clients = Client::whereNull('password')->whereNotNull('email')->where('email', '!=', '')->get();
        $clients->each(fn (Client $c) => $this->setPassword($c, $c->email));

        return $clients->count();
    }

    /** Back to the default password: the client's email. */
    public function resetToDefault(Client $client): void
    {
        $this->setPassword($client, $client->email);
    }

    /**
     * Admin side (Client page → Client Login): set or change the client's
     * password, or remove it so they can no longer sign in.
     */
    public function setPassword(Client $client, ?string $password): void
    {
        $client->forceFill([
            'password' => $password, // hashed by the model
            'remember_token' => null,
        ])->save();
    }

    /** Admin side: whether the client can sign in, and where. */
    public function loginInfo(Client $client): array
    {
        $client->loadMissing('owner');
        $agency = $client->owner instanceof Agency ? $client->owner : null;

        return [
            'enabled' => $client->password !== null,
            // Still the default password (the client's email), not one the agency chose
            'default_password' => $client->hasDefaultPassword(),
            'has_email' => (bool) $client->email,
            'last_login_at' => $client->last_login_at?->toIso8601String(),
            // Clients sign in on their agency's domain; superadmin clients have none
            'agency_owned' => (bool) $agency,
            'login_url' => $agency ? $this->loginUrl($agency) : null,
        ];
    }

    /**
     * The agency's Client Login page, on its own (primary) domain: a
     * subdomain or custom domain (test.example.com/agency/client-login), or a
     * path on the main site (example.com/test/agency/client-login).
     */
    private function loginUrl(Agency $agency): ?string
    {
        $domain = $agency->tenant_id
            ? Domain::where('tenant_id', $agency->tenant_id)->orderByDesc('is_primary')->first()
            : null;
        if (! $domain) {
            return null;
        }

        $appUrl = config('app.url');
        $scheme = parse_url($appUrl, PHP_URL_SCHEME) ?: 'http';
        $port = parse_url($appUrl, PHP_URL_PORT);
        $origin = fn (string $host) => "{$scheme}://{$host}" . ($port ? ":{$port}" : '');

        $appHost = (string) parse_url($appUrl, PHP_URL_HOST);
        if ($domain->isPath()) {
            return $origin($appHost) . '/' . trim($domain->domain, '/') . '/agency/client-login';
        }
        // A subdomain saved as just its label ("hsgroup") lives under the main host
        $host = $domain->isSubdomain() && ! str_contains($domain->domain, '.') ? "{$domain->domain}.{$appHost}" : $domain->domain;

        return $origin($host) . '/agency/client-login';
    }
}

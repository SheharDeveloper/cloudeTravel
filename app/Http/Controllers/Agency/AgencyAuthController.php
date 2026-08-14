<?php

namespace App\Http\Controllers\Agency;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AgencyAuthController extends Controller
{
    /**
     * Resolve the agency that owns the current domain.
     * Returns null on the admin domain / any unregistered host.
     */
    private function resolveAgency(Request $request): ?Agency
    {
        // ResolveTenantFromDomain has already matched the host against the
        // domains table and put the tenant on the request. No tenant means
        // this is the admin domain, so there is no agency to log into.
        $tenant = $request->attributes->get('tenant');

        if (!$tenant) {
            return null;
        }

        return Agency::where('tenant_id', $tenant->id)->first();
    }

    /**
     * Branding + agency passed to the login screens.
     */
    private function branding(Agency $agency): array
    {
        return [
            'agencyName' => $agency->agency_name,
            'logo' => $agency->logo,
        ];
    }

    public function showLogin(Request $request)
    {
        // Already signed in on this domain -> no reason to show the form.
        if (Auth::guard('agency')->check()) {
            return redirect()->intended('/dashboard');
        }

        $agency = $this->resolveAgency($request);

        // No agency for this host -> this is the superadmin domain.
        if (!$agency) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/agency-login', $this->branding($agency) + [
            'status' => $request->session()->get('status'),
            'isClient' => false,
        ]);
    }

    public function showClientLogin(Request $request)
    {
        if (Auth::guard('agency')->check()) {
            return redirect()->intended('/dashboard');
        }

        $agency = $this->resolveAgency($request);

        if (!$agency) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/agency-login', $this->branding($agency) + [
            'status' => $request->session()->get('status'),
            'isClient' => true,
        ]);
    }

    public function login(Request $request)
    {
        return $this->attemptLogin($request);
    }

    public function clientLogin(Request $request)
    {
        return $this->attemptLogin($request);
    }

    /**
     * Authenticate against agency_users, scoped to this domain's agency so
     * one agency's user cannot sign in on another agency's domain.
     */
    private function attemptLogin(Request $request)
    {
        $agency = $this->resolveAgency($request);

        if (!$agency) {
            return redirect()->route('login');
        }

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $ok = Auth::guard('agency')->attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
            'agency_id' => $agency->id,
            'status' => 'active',
        ], $request->boolean('remember'));

        if (!$ok) {
            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }

    public function logout(Request $request)
    {
        Auth::guard('agency')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('agency.login');
    }
}

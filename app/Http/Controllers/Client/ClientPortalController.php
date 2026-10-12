<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Services\ClientPortalService;
use App\Services\DocumentSignService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** The signed-in client's own pages, on their agency's domain. */
class ClientPortalController extends Controller
{
    public function __construct(protected ClientPortalService $portal)
    {
    }

    /** My Profile */
    public function profile(Request $request)
    {
        $client = $this->portal->currentClient($request);

        return Inertia::render('Client/Profile', $this->layout($request) + [
            'profile' => $this->portal->profile($client),
        ]);
    }

    /** Profile Settings: edit the profile and change the password, on one page */
    public function settings(Request $request)
    {
        return Inertia::render('Client/Settings', $this->layout($request) + [
            'profile' => $this->portal->profile($this->portal->currentClient($request)),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'nationality' => 'nullable|string|max:100',
            'gender' => 'nullable|in:male,female,other',
            'dob' => \App\Services\ClientService::dobRules(), // 18+ only
            'address' => 'nullable|array',
            'address.address' => 'nullable|string|max:500',
            'address.city' => 'nullable|string|max:255',
            'address.state' => 'nullable|string|max:255',
            'address.country' => 'nullable|string|max:255',
            'address.zip_code' => 'nullable|string|max:20',
        ]);

        $this->portal->updateProfile($this->portal->currentClient($request), $validated);

        return back()->with('success', 'Your profile has been updated.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|max:100|confirmed',
        ]);

        $this->portal->changePassword($this->portal->currentClient($request), $validated['current_password'], $validated['password']);

        return back()->with('success', 'Your password has been changed.');
    }

    /** My Bookings */
    public function bookings(Request $request)
    {
        return Inertia::render('Client/Bookings', $this->layout($request) + [
            'bookings' => $this->portal->bookings($this->portal->currentClient($request)),
        ]);
    }

    /** Invoices */
    public function invoices(Request $request, DocumentSignService $signService)
    {
        return Inertia::render('Client/Invoices', $this->layout($request) + [
            'invoices' => $this->portal->invoices($this->portal->currentClient($request), $signService),
        ]);
    }

    /** One invoice, printable — the same invoice the agency sends for signing */
    public function invoice(Request $request, string $uid, DocumentSignService $signService)
    {
        $booking = $this->portal->findBooking($this->portal->currentClient($request), $uid);

        return view('documents.invoice', $signService->invoiceData($booking));
    }

    public function logout(Request $request)
    {
        $this->portal->logout($request);

        return redirect()->route('agency.client-login');
    }

    /** What every client page's layout shows: the agency's branding and the client's name. */
    private function layout(Request $request): array
    {
        $agency = $this->portal->agencyFor($request);
        $client = $this->portal->currentClient($request);

        return [
            'portal' => [
                'agencyName' => $agency?->agency_name,
                'logo' => $agency?->logo,
                'clientName' => $client?->name,
                'clientEmail' => $client?->email,
            ],
        ];
    }
}

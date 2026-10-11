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

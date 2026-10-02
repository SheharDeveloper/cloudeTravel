<?php

namespace App\Http\Controllers;

use App\Models\BookingSignature;
use App\Services\ContactInfoService;
use App\Services\DocumentSignService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * The public Document Signing Portal, opened through the secret link in the
 * "Doc Sign" email: no login, the link's token is the only key.
 */
class DocumentSignController extends Controller
{
    public function __construct(
        protected DocumentSignService $signService,
        protected ContactInfoService $contactInfoService,
    ) {
    }

    public function show(string $token)
    {
        $signature = $this->find($token);
        $booking = $signature->booking;
        $booking->loadMissing('client');
        $d = $booking->details ?? [];

        return Inertia::render('Public/DocumentSign', [
            'brand' => $this->signService->branding($booking),
            'document' => [
                'id' => 'DOC-' . strtoupper(substr($booking->service, 0, 3)) . '-' . $signature->id,
                'invoice_number' => $booking->invoice_number,
                'service' => ucfirst($booking->service),
                'visa_name' => trim(($d['visa_name'] ?? '') . (! empty($d['visa_type']) ? " ({$d['visa_type']})" : '')),
                'destination' => $d['destination'] ?? null,
                'date_issued' => $signature->created_at->toDateString(),
                'date_of_entry' => $booking->service_date?->toDateString(),
                'passengers' => $booking->passengers,
                'total' => $booking->currency_symbol . number_format($booking->total_amount, 2),
            ],
            'signer' => [
                'name' => $signature->signer_name,
                'email' => $signature->signer_email,
                'member_id' => $booking->client?->cid,
                'member_since' => $booking->client?->created_at?->toDateString(),
            ],
            'status' => [
                'value' => $signature->status,
                'expired' => $signature->isExpired(),
                'deadline' => $signature->expires_at?->toDateString(),
                'updated_at' => $signature->updated_at?->toIso8601String(),
                'signed_at' => $signature->signed_at?->toIso8601String(),
            ],
            // Only the signer's own signature, and only once it's done
            'signatureImage' => $signature->isSigned() ? $signature->signature_data : null,
            'invoiceUrl' => route('documents.invoice', $token),
            'submitUrl' => route('documents.sign.submit', $token),
            'terms' => config('document_sign.terms'),
        ]);
    }

    /** The invoice itself, shown in the portal's preview frame (and printable). */
    public function invoice(string $token)
    {
        $signature = $this->find($token);

        return view('documents.invoice', $this->signService->invoiceData($signature->booking));
    }

    public function submit(Request $request, string $token)
    {
        $signature = $this->find($token);
        $validated = $request->validate([
            'accept_terms' => 'accepted',
            'signature_data' => 'required|string',
        ], [
            'accept_terms.accepted' => 'Please confirm you have reviewed the document and accepted the terms.',
            'signature_data.required' => 'Please provide your signature before submitting.',
        ]);

        $this->signService->sign($signature, $validated['signature_data'], $request->ip(), $request->userAgent());

        // Signed while logged in as the agency (or superadmin) that owns the
        // booking: back to its booking page. A client stays on the portal.
        $booking = $signature->booking;
        $owner = $this->contactInfoService->currentOwner();
        if ($owner && $booking->owner_type === get_class($owner) && (int) $booking->owner_id === (int) $owner->id) {
            return redirect()->route('admin.service-bookings.show', $booking->uid)
                ->with('success', "Booking {$booking->invoice_number} has been signed.");
        }

        return back()->with('success', 'Thank you! Your document has been signed and is being processed.');
    }

    private function find(string $token): BookingSignature
    {
        return BookingSignature::with('booking')->where('signing_token', $token)->firstOrFail();
    }
}

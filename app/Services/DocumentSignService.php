<?php

namespace App\Services;

use App\Mail\DocumentSignRequest;
use App\Models\Agency;
use App\Models\BookingSignature;
use App\Models\ContactInfo;
use App\Models\ServiceBooking;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * "Doc Sign" for a booking: the client gets a secret link to the public
 * Document Signing Portal, reviews the booking's invoice, accepts the terms
 * and signs it. The link is emailed (and can be resent or copied).
 */
class DocumentSignService
{
    /** Largest signature image accepted, as a data URL. */
    private const MAX_SIGNATURE_BYTES = 600_000;

    /**
     * Creates the signing request for a booking (or returns the one it has)
     * and emails the link. Signing goes to the client, or to the lead
     * passenger when the booking has no client.
     */
    public function generate(ServiceBooking $booking): BookingSignature
    {
        $signature = $booking->signature;

        if (! $signature) {
            [$name, $email] = $this->signerFor($booking);
            $signature = $booking->signature()->create([
                'signer_name' => $name,
                'signer_email' => $email,
                'expires_at' => now()->addDays(BookingSignature::VALID_DAYS),
            ]);
        }

        if (! $signature->isSigned()) {
            $this->sendEmail($signature);
        }

        return $signature->refresh();
    }

    /** Sends the link again and gives the signer a fresh deadline. */
    public function resend(BookingSignature $signature): BookingSignature
    {
        if ($signature->isSigned()) {
            throw ValidationException::withMessages(['signature' => 'This document has already been signed.']);
        }

        $signature->update(['expires_at' => now()->addDays(BookingSignature::VALID_DAYS)]);
        $this->sendEmail($signature);

        return $signature->refresh();
    }

    /** The public link the signer opens, on the agency's own site. */
    public function url(BookingSignature $signature): string
    {
        return route('documents.sign', $signature->signing_token);
    }

    /**
     * Saves the drawn signature. The image must be a PNG data URL of a sane
     * size; the terms must have been accepted.
     */
    public function sign(BookingSignature $signature, string $dataUrl, ?string $ip, ?string $userAgent): void
    {
        if ($signature->isSigned()) {
            throw ValidationException::withMessages(['signature_data' => 'This document has already been signed.']);
        }
        if ($signature->isExpired()) {
            throw ValidationException::withMessages(['signature_data' => 'This signing link has expired. Please ask for a new one.']);
        }

        if (strlen($dataUrl) > self::MAX_SIGNATURE_BYTES
            || ! preg_match('#^data:image/png;base64,([A-Za-z0-9+/=]+)$#', $dataUrl, $match)
            || ! ($binary = base64_decode($match[1], true))
            || ! str_starts_with($binary, "\x89PNG\r\n\x1a\n")) {
            throw ValidationException::withMessages(['signature_data' => 'The signature could not be read. Please sign again.']);
        }

        DB::transaction(function () use ($signature, $dataUrl, $ip, $userAgent) {
            $signature->update([
                'status' => BookingSignature::STATUS_SIGNED,
                'signature_data' => $dataUrl,
                'terms_accepted_at' => now(),
                'signed_at' => now(),
                'signed_ip' => $ip,
                'signed_user_agent' => $userAgent ? mb_substr($userAgent, 0, 255) : null,
            ]);

            // Signed: the booking is no longer pending (moves to Visa Applications)
            $signature->booking()->where('status', 'pending')->update(['status' => ServiceBooking::STATUS_SIGNED]);
        });
    }

    /**
     * Name, logo and contact details of the agency (or superadmin) that made
     * the booking, for the portal, the invoice and the email.
     */
    public function branding(ServiceBooking $booking): array
    {
        $owner = $booking->owner;
        $contact = $owner
            ? ContactInfo::where('owner_type', get_class($owner))->where('owner_id', $owner->id)->first()
            : null;

        if ($owner instanceof Agency) {
            return [
                'name' => $owner->agency_name,
                'logo' => $contact?->logo ?: $owner->logo,
                'email' => $contact?->email ?: $owner->email,
                'phone' => $contact?->phone ?: $owner->phone_number,
                'address' => $contact?->address ?: $owner->address,
            ];
        }

        return [
            'name' => config('app.name'),
            'logo' => $contact?->logo,
            'email' => $contact?->email,
            'phone' => $contact?->phone,
            'address' => $contact?->address,
        ];
    }

    /** Everything the invoice shows, in one place for the portal and the invoice page. */
    public function invoiceData(ServiceBooking $booking): array
    {
        $booking->loadMissing('applications', 'client.address', 'signature');
        $d = $booking->details ?? [];
        $count = max($booking->passengers, 1);
        $brand = $this->branding($booking);

        // "To": the client and their address, else the lead passenger
        $lead = $booking->applications->firstWhere('relation', 'self') ?? $booking->applications->first();
        $address = $booking->client?->address;
        $to = [
            'name' => $booking->client?->name ?? trim(($lead?->first_name ?? '') . ' ' . ($lead?->last_name ?? '')),
            'lines' => array_values(array_filter([
                $address?->address, $address?->city, $address?->state, $address?->zip_code, $address?->country ?? $booking->client?->nationality,
            ])),
        ];

        // "Issued By": the agency's own address fields, else the contact info address split on commas
        $owner = $booking->owner;
        $issuedLines = $owner instanceof Agency
            ? [$owner->address, $owner->city, $owner->state, $owner->postal_code, $owner->country]
            : array_map('trim', explode(',', (string) $brand['address']));

        return [
            'booking' => $booking,
            'details' => $d,
            'brand' => $brand,
            'to' => $to,
            'issuedBy' => [
                'lines' => array_values(array_filter($issuedLines)),
                'phone' => $brand['phone'],
                'email' => $brand['email'],
            ],
            'clientId' => $booking->client?->cid,
            'perPerson' => [
                'base' => $booking->base_amount / $count,
                'service' => $booking->service_fee / $count,
                'tax' => $booking->tax_amount / $count,
                'total' => $booking->total_amount / $count,
            ],
            'taxLabel' => collect($d['taxes'] ?? [])->map(fn ($t) => "{$t['name']} {$t['percent']}%")->implode(' + ') ?: 'Tax',
            'signature' => $booking->signature,
        ];
    }

    /** [name, email] of whoever signs: the client, else the lead passenger. */
    private function signerFor(ServiceBooking $booking): array
    {
        $booking->loadMissing('client', 'applications');

        if ($booking->client) {
            return [$booking->client->name, $booking->client->email];
        }

        $lead = $booking->applications->firstWhere('relation', 'self') ?? $booking->applications->first();

        return [$lead ? trim("{$lead->first_name} {$lead->last_name}") : null, $lead?->email];
    }

    /** Emails the link when there's an address; the link can still be copied without one. */
    private function sendEmail(BookingSignature $signature): void
    {
        if (! $signature->signer_email) {
            return;
        }

        $booking = $signature->booking;
        Mail::to($signature->signer_email, $signature->signer_name)
            ->send(new DocumentSignRequest($signature, $this->url($signature), $this->branding($booking)));

        $signature->update([
            'email_sent_at' => now(),
            'email_count' => $signature->email_count + 1,
        ]);
    }
}

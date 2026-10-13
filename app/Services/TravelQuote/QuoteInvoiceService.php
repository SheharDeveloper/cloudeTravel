<?php

namespace App\Services\TravelQuote;

use App\Models\ServiceBooking;
use App\Models\TravelQuote;
use App\Models\TravelQuoteFeedback;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * "Generate Invoice" on a quote's Invoice tab: an invoice for a customer who
 * accepted the quote, made from the quote and the details they gave when
 * accepting (name, email, phone). It belongs to the quote only — no client
 * record is made. It's kept as a "package" booking so it gets an invoice
 * number and the same printable invoice as every other booking.
 */
class QuoteInvoiceService
{
    public const SERVICE = 'package';

    /** The invoice for this accepted response; generated once per quote and customer email. */
    public function generate(TravelQuote $quote, TravelQuoteFeedback $feedback): ServiceBooking
    {
        return DB::transaction(function () use ($quote, $feedback) {
            $existing = $this->invoiceFor($quote, (string) $feedback->email);
            if ($existing) {
                return $existing;
            }

            // Quotes are made by the superadmin, so the invoice is theirs
            $owner = User::role('superadmin')->orderBy('id')->first() ?? User::orderBy('id')->firstOrFail();

            $summary = $quote->price_summary ?? [];
            $travellers = max(1, (int) ($summary['total_persons'] ?? 0)
                ?: ((int) $quote->adults + (int) $quote->children + (int) $quote->infants));
            $total = (float) $quote->total_price;
            $tax = (float) ($summary['tax_amount'] ?? 0);
            $discount = (float) ($summary['discount'] ?? 0);

            return ServiceBooking::create([
                'service' => self::SERVICE,
                'owner_type' => User::class,
                'owner_id' => $owner->id,
                'client_id' => null,
                'service_date' => $quote->check_in_date,
                'passengers' => $travellers,
                'currency_code' => config('currency.code', 'GBP'),
                'currency_symbol' => config('currency.symbol', '£'),
                // Before discount and tax (what the quote calls the subtotal)
                'base_amount' => (float) ($summary['subtotal'] ?? ($total - $tax + $discount)),
                'service_fee' => 0,
                'tax_amount' => $tax,
                'total_amount' => $total,
                'status' => 'pending',
                // A copy of the quote as accepted: later edits to the quote don't change the invoice
                'details' => [
                    'title' => $quote->display_name,
                    'travel_quote_uid' => $quote->uid,
                    'feedback_id' => $feedback->id,
                    'accepted_at' => $feedback->created_at?->toIso8601String(),
                    'customer' => [
                        'name' => $feedback->name,
                        'email' => $feedback->email,
                        'phone' => $feedback->phone_number,
                    ],
                    'check_in_date' => $quote->check_in_date?->toDateString(),
                    'checkout_date' => $quote->checkout_date?->toDateString(),
                    'nights' => $quote->night,
                    'board' => $quote->half_board,
                    'adults' => (int) $quote->adults,
                    'children' => (int) $quote->children,
                    'infants' => (int) $quote->infants,
                    'per_person_pricing' => (bool) $quote->per_person_pricing,
                    'price_per_person' => (float) ($summary['price_per_person'] ?? 0),
                    'manual_price' => $summary['manual_price'] ?? null,
                    'discount' => $discount,
                    'tax_percent' => (float) ($summary['tax_percent'] ?? 0),
                    'hotels' => $quote->hotel_details ?? [],
                    'flights' => $quote->flight_details ?? [],
                    'visas' => $quote->visa_details ?? [],
                    'transports' => $quote->travel_details ?? [],
                ],
            ]);
        });
    }

    /**
     * The quote's Invoice tab: every customer who accepted it, each with the
     * invoice generated for them — or null until "Generate Invoice" is clicked.
     */
    public function invoicesFor(TravelQuote $quote): array
    {
        return $quote->feedback()
            ->where('status', 'accept')
            ->whereNotNull('email')
            ->latest()
            ->get()
            ->unique(fn (TravelQuoteFeedback $feedback) => strtolower($feedback->email))
            ->map(function (TravelQuoteFeedback $feedback) use ($quote) {
                $booking = $this->invoiceFor($quote, $feedback->email);

                return [
                    'feedback_id' => $feedback->id,
                    'name' => $feedback->name,
                    'email' => $feedback->email,
                    'phone' => $feedback->phone_number,
                    'accepted_at' => $feedback->created_at?->toIso8601String(),
                    'invoice' => $booking ? [
                        'uid' => $booking->uid,
                        'invoice_number' => $booking->invoice_number,
                        'total' => $booking->currency_symbol . number_format($booking->total_amount, 2),
                        'created_at' => $booking->created_at->toIso8601String(),
                        'invoice_url' => route('admin.service-bookings.invoice', $booking->uid),
                    ] : null,
                ];
            })
            ->values()
            ->all();
    }

    /** The invoice already generated from this quote for this customer email, if any. */
    private function invoiceFor(TravelQuote $quote, string $email): ?ServiceBooking
    {
        return ServiceBooking::where('service', self::SERVICE)
            ->where('details->travel_quote_uid', $quote->uid)
            ->get()
            ->first(fn (ServiceBooking $booking) => strcasecmp((string) ($booking->details['customer']['email'] ?? ''), $email) === 0);
    }
}

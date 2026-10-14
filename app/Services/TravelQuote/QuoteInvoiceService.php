<?php

namespace App\Services\TravelQuote;

use App\Models\ServiceBooking;
use App\Models\TravelQuote;
use App\Models\TravelQuoteFeedback;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * The Invoice tab of a quote: an invoice for a customer who accepted the
 * quote, made from the quote and the customer's details (name, email, phone
 * and address — filled in, and editable, in the invoice form). It belongs to
 * the quote only — no client record is made. It's kept as a "package"
 * booking so it gets an invoice number and the same printable invoice as
 * every other booking.
 *
 * When the customer's response is changed to Reject, their invoice is
 * rejected; once accepted again, a new invoice is generated.
 */
class QuoteInvoiceService
{
    public const SERVICE = 'package';
    public const STATUS_REJECTED = 'rejected';

    /** What the invoice form edits: the "To" part of the invoice. */
    public const CUSTOMER_FIELDS = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip_code', 'country'];

    /**
     * "Generate Invoice" for an accepted response, with the details from the
     * invoice form. One live invoice per quote and customer email.
     */
    public function generate(TravelQuote $quote, TravelQuoteFeedback $feedback, array $customer): ServiceBooking
    {
        if ($feedback->status !== 'accept') {
            throw ValidationException::withMessages(['invoice' => 'Only an accepted response can be invoiced.']);
        }

        return DB::transaction(function () use ($quote, $feedback, $customer) {
            $existing = $this->activeInvoice($quote, (string) $feedback->email);
            if ($existing) {
                return $this->updateCustomer($existing, $customer);
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
                    // The response's email: which customer this invoice is for (even if the invoice email is edited)
                    'response_email' => strtolower((string) $feedback->email),
                    'accepted_at' => $feedback->created_at?->toIso8601String(),
                    'customer' => $this->cleanCustomer($customer),
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

    /** "Edit Invoice": changes the customer's details (name, address…) on a live invoice. */
    public function updateCustomer(ServiceBooking $invoice, array $customer): ServiceBooking
    {
        if ($invoice->status === self::STATUS_REJECTED) {
            throw ValidationException::withMessages(['invoice' => 'A rejected invoice cannot be changed. Generate a new one.']);
        }

        $details = $invoice->details ?? [];
        $details['customer'] = $this->cleanCustomer($customer);
        $invoice->update(['details' => $details]);

        return $invoice;
    }

    /** The response was changed to Reject: the customer's live invoice for this quote is rejected. */
    public function rejectFor(TravelQuote $quote, string $email): void
    {
        $this->activeInvoice($quote, $email)?->update(['status' => self::STATUS_REJECTED]);
    }

    /** An invoice of this quote (by its uid), for "Edit Invoice". */
    public function findInvoice(TravelQuote $quote, string $uid): ServiceBooking
    {
        return ServiceBooking::where('service', self::SERVICE)
            ->where('details->travel_quote_uid', $quote->uid)
            ->where('uid', $uid)
            ->firstOrFail();
    }

    /**
     * The quote's Invoice tab: every customer who responded (their latest
     * response), with their live invoice — or null until "Generate Invoice"
     * is clicked — and the invoices rejected before.
     */
    public function invoicesFor(TravelQuote $quote): array
    {
        $invoices = $this->quoteInvoices($quote);

        return $quote->feedback()
            ->whereIn('status', ['accept', 'reject'])
            ->whereNotNull('email')
            ->latest()
            ->latest('id')
            ->get()
            ->unique(fn (TravelQuoteFeedback $feedback) => strtolower($feedback->email))
            ->map(function (TravelQuoteFeedback $feedback) use ($invoices) {
                $mine = $invoices->filter(fn (ServiceBooking $b) => $this->responseEmail($b) === strtolower($feedback->email));
                $live = $mine->first(fn (ServiceBooking $b) => $b->status !== self::STATUS_REJECTED);

                return [
                    'feedback_id' => $feedback->id,
                    'response_status' => $feedback->status,
                    'name' => $feedback->name,
                    'email' => $feedback->email,
                    'phone' => $feedback->phone_number,
                    'accepted_at' => $feedback->created_at?->toIso8601String(),
                    'invoice' => $live ? $this->invoiceRow($live) : null,
                    'rejected_invoices' => $mine->filter(fn (ServiceBooking $b) => $b->status === self::STATUS_REJECTED)
                        ->map(fn (ServiceBooking $b) => $this->invoiceRow($b))
                        ->values()
                        ->all(),
                ];
            })
            ->values()
            ->all();
    }

    private function invoiceRow(ServiceBooking $booking): array
    {
        return [
            'uid' => $booking->uid,
            'invoice_number' => $booking->invoice_number,
            'status' => $booking->status,
            'total' => $booking->currency_symbol . number_format($booking->total_amount, 2),
            'created_at' => $booking->created_at->toIso8601String(),
            'customer' => array_merge(array_fill_keys(self::CUSTOMER_FIELDS, ''), $booking->details['customer'] ?? []),
            'invoice_url' => route('admin.service-bookings.invoice', $booking->uid),
        ];
    }

    /** The customer's live (not rejected) invoice from this quote, if any. */
    private function activeInvoice(TravelQuote $quote, string $email): ?ServiceBooking
    {
        return $this->quoteInvoices($quote)
            ->first(fn (ServiceBooking $b) => $b->status !== self::STATUS_REJECTED && $this->responseEmail($b) === strtolower($email));
    }

    /** Every invoice made from this quote, newest first. */
    private function quoteInvoices(TravelQuote $quote)
    {
        return ServiceBooking::where('service', self::SERVICE)
            ->where('details->travel_quote_uid', $quote->uid)
            ->latest('id')
            ->get();
    }

    /** Which customer an invoice is for: the response's email (older invoices: the customer's email). */
    private function responseEmail(ServiceBooking $booking): string
    {
        return strtolower((string) ($booking->details['response_email'] ?? $booking->details['customer']['email'] ?? ''));
    }

    private function cleanCustomer(array $customer): array
    {
        return collect(self::CUSTOMER_FIELDS)
            ->mapWithKeys(fn (string $field) => [$field => trim((string) ($customer[$field] ?? '')) ?: null])
            ->all();
    }
}

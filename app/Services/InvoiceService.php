<?php

namespace App\Services;

use App\Models\ServiceBooking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

/**
 * Invoices: one per booking — the agency's (or superadmin's) invoice to its
 * client. Filters (service, date range by invoice or travel date, search),
 * the client's confirmation (e-signed, or confirmed on a paper print) and the
 * Excel / CSV export.
 */
class InvoiceService
{
    // Every invoice type (Create Invoice), plus the travel packages made from accepted quotes
    public const SERVICES = InvoiceTypeService::TYPES_LABELS + ['package' => 'Travel Package'];
    public const DATE_TYPES = ['invoice' => 'Invoice Date', 'travel' => 'Travel Date'];
    public const PER_PAGE = [10, 25, 50, 100];
    // "Pay": the ways a client can pay (an invoice can be split across them)
    public const PAYMENT_MODES = ['credit_card' => 'Credit card', 'debit_card' => 'Debit card', 'cash' => 'Cash', 'bank_transfer' => 'Bank Transfer'];

    public function __construct(protected ContactInfoService $contactInfoService)
    {
    }

    /**
     * @param  array{search?: string, service?: string, date_type?: string, start?: string, end?: string}  $filters
     */
    public function list(array $filters, int $perPage = 25): LengthAwarePaginator
    {
        return $this->query($filters)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (ServiceBooking $b) => $this->row($b));
    }

    /** Every invoice matching the filters, for the Excel / CSV export. */
    public function exportRows(array $filters): array
    {
        $rows = [['Invoice No.', 'Invoice Date', 'Service Name', 'Receiver Name', 'Client ID', 'Travel Date', 'Return Travel Date', 'Booking Date', 'Total', 'Status', 'Confirmation']];

        foreach ($this->query($filters)->get() as $b) {
            $r = $this->row($b);
            $rows[] = [
                $r['invoice_number'],
                $this->date($r['invoice_date']),
                $r['service_name'],
                $r['receiver']['name'] ?? '',
                $r['receiver']['cid'] ?? '',
                $this->date($r['travel_date']),
                $this->date($r['return_date']),
                $this->date($r['booking_date']),
                $r['total'],
                ['paid' => 'Paid', 'partial' => 'Partially Paid', 'unpaid' => 'Unpaid', 'refunded' => 'Refunded'][$r['payment_status']],
                $r['confirmation_label'],
            ];
        }

        return $rows;
    }

    /** One invoice of the current owner, for the in-app View page. */
    public function findForView(string $uid): array
    {
        return $this->row($this->owned()->with('client:id,uid,cid,name,email,phone', 'client.address', 'signature', 'applications:id,service_booking_id,first_name,last_name')->where('uid', $uid)->firstOrFail());
    }

    /**
     * "Pay": records a payment — one or more methods with their amounts
     * (credit card, debit card, cash, bank transfer) and the card's last 4
     * digits. Several payments add up; the invoice is Paid once they cover
     * the total, Partially Paid before that.
     *
     * @param  array<string, float>  $methods  mode => amount
     */
    public function addPayment(string $uid, array $methods, ?string $cardLast4): ServiceBooking
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        if (in_array($booking->status, ['rejected', 'cancelled'], true)) {
            throw ValidationException::withMessages(['invoice' => 'A rejected or cancelled invoice cannot be paid.']);
        }

        if (! empty($booking->details['refund'])) {
            throw ValidationException::withMessages(['invoice' => 'A refunded invoice cannot be paid.']);
        }

        $methods = collect($methods)
            ->filter(fn ($amount, $mode) => isset(self::PAYMENT_MODES[$mode]) && (float) $amount > 0)
            ->map(fn ($amount) => round((float) $amount, 2));
        $amount = round($methods->sum(), 2);
        $pending = round((float) $booking->total_amount - $this->paidAmount($booking->details ?? []), 2);

        if ($amount <= 0) {
            throw ValidationException::withMessages(['methods' => 'Tick a payment method and enter its amount.']);
        }
        if ($amount > $pending + 0.005) {
            throw ValidationException::withMessages(['methods' => 'The payment is more than the pending amount (' . $booking->currency_symbol . number_format(max($pending, 0), 2) . ').']);
        }
        $usesCard = $methods->has('credit_card') || $methods->has('debit_card');

        $details = $booking->details ?? [];
        $details['payments'][] = [
            'methods' => $methods->all(),
            'amount' => $amount,
            'card_last4' => $usesCard ? $cardLast4 : null,
            'paid_on' => now()->toDateString(),
            'recorded_at' => now()->toIso8601String(),
        ];
        $booking->update(['details' => $details]);

        return $booking;
    }

    /** What an edit of the booking must not lose: payments, the paper confirmation, the edit / amendment history and the original number. */
    public const KEPT_ON_EDIT = ['payments', 'payment', 'paper_confirmed_at', 'edits', 'amendments', 'base_invoice_number', 'refund'];

    /** Refund: the charges kept back from what the client paid. */
    public const REFUND_CHARGES = [
        'safi' => 'SAFI',
        'atol' => 'ATOL',
        'credit_charge' => 'Credit Charge 1%',
        'service_charges' => 'Service Charges',
        'penalty_charges' => 'Penalty Charges',
        'admin_charges' => 'Admin Charges',
        'other_charges' => 'Other Miscellaneous Charges',
    ];

    /**
     * "Refund": gives back what the client paid, less the charges. The refund
     * amount is worked out here (paid − charges), not taken from the form.
     * The invoice is then Refunded and renumbered INV… → INVR…; it can't be
     * paid, edited, amended or refunded again.
     */
    public function refund(string $uid, array $charges, ?string $remarks, string $mode = 'bank_transfer'): ServiceBooking
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        $details = $booking->details ?? [];
        if (! empty($details['refund'])) {
            throw ValidationException::withMessages(['refund' => 'This invoice has already been refunded.']);
        }
        $paid = $this->paidAmount($details);
        if ($paid <= 0) {
            throw ValidationException::withMessages(['refund' => 'Nothing has been paid on this invoice, so there is nothing to refund.']);
        }

        $charges = collect(self::REFUND_CHARGES)->keys()
            ->mapWithKeys(fn ($key) => [$key => round(max((float) ($charges[$key] ?? 0), 0), 2)])
            ->all();
        $totalCharges = round(array_sum($charges), 2);
        if ($totalCharges > $paid + 0.005) {
            throw ValidationException::withMessages(['charges' => 'The charges (' . $booking->currency_symbol . number_format($totalCharges, 2) . ') are more than the amount paid (' . $booking->currency_symbol . number_format($paid, 2) . ').']);
        }

        $by = \Illuminate\Support\Facades\Auth::guard('agency')->user() ?? \Illuminate\Support\Facades\Auth::guard('web')->user();
        $details['base_invoice_number'] ??= $booking->invoice_number;
        $details['refund'] = [
            'paid_amount' => $paid,
            'charges' => $charges,
            'total_charges' => $totalCharges,
            'refund_amount' => round($paid - $totalCharges, 2),
            'remarks' => trim((string) $remarks) ?: null,
            // How the money went back to the client
            'mode' => isset(self::PAYMENT_MODES[$mode]) ? $mode : 'bank_transfer',
            // The CANCELLATION part of the invoice: shown to the client only once "Display" is chosen
            'show_to_client' => false,
            'number_before' => $booking->invoice_number,
            'at' => now()->toIso8601String(),
            'by' => $by?->name,
        ];
        $booking->update(['details' => $details, 'invoice_number' => $this->changedNumber($details)]);

        return $booking;
    }

    /** Edit or Amendment: which one was clicked, remembered until the edit is saved. */
    public const CHANGE_MODES = ['edit' => 'edits', 'amend' => 'amendments'];

    public function rememberChangeMode(string $uid, string $mode): void
    {
        $this->owned()->where('uid', $uid)->firstOrFail();
        session()->put("invoice_change.{$uid}", isset(self::CHANGE_MODES[$mode]) ? $mode : 'edit');
    }

    public function pullChangeMode(string $uid): string
    {
        return (string) session()->pull("invoice_change.{$uid}", 'edit');
    }

    /** What the invoice says, for comparing before and after an edit. */
    public function snapshot(ServiceBooking $b): array
    {
        $d = $b->details ?? [];

        return [
            'Total' => $b->currency_symbol . number_format((float) $b->total_amount, 2),
            'Travellers' => (string) $b->passengers,
            'Applicants' => $b->applications->map(fn ($a) => trim("{$a->first_name} {$a->last_name}"))->implode(', '),
            'Travel Date' => $b->service_date?->format('d/m/Y') ?? '',
            'Visa' => trim(implode(' · ', array_filter([$d['visa_name'] ?? null, $d['visa_type'] ?? null]))),
            'Route' => trim(implode(' → ', array_filter([$d['origin'] ?? null, $d['destination'] ?? null]))),
        ];
    }

    /**
     * After Edit or Amendment is saved: puts back what the edit must not lose
     * and, when anything on the invoice changed, records it (when, who,
     * old → new) as an edit or an amendment, and renumbers the invoice:
     * INV000013 → INVE000013 once edited, INVA000013 once amended.
     */
    public function recordChange(ServiceBooking $b, array $before, array $kept, string $mode = 'edit'): void
    {
        $list = self::CHANGE_MODES[$mode] ?? 'edits';
        $after = $this->snapshot($b);
        $changes = collect($after)
            ->filter(fn ($new, $field) => ($before[$field] ?? '') !== $new)
            ->map(fn ($new, $field) => ['field' => $field, 'old' => $before[$field] ?? '', 'new' => $new])
            ->values()
            ->all();

        $details = array_merge($b->details ?? [], $kept);
        $attributes = [];
        if ($changes) {
            $actor = $this->contactInfoService->currentOwner();
            $by = \Illuminate\Support\Facades\Auth::guard('agency')->user() ?? \Illuminate\Support\Facades\Auth::guard('web')->user();
            $details['base_invoice_number'] ??= $b->invoice_number;
            $details[$list][] = [
                'at' => now()->toIso8601String(),
                'by' => $by?->name ?? ($actor?->agency_name ?? $actor?->name),
                'number_before' => $b->invoice_number,
                'changes' => $changes,
            ];
            $attributes['invoice_number'] = $this->changedNumber($details);
        }
        $b->update($attributes + ['details' => $details]);
    }

    /** INV000013 → INVE000013 (edited) or INVA000013 (amended — an amendment outranks an edit). */
    private function changedNumber(array $details): string
    {
        $base = (string) $details['base_invoice_number'];
        $letter = ! empty($details['refund']) ? 'R' : (! empty($details['amendments']) ? 'A' : 'E');

        return str_starts_with($base, 'INV') ? 'INV' . $letter . substr($base, 3) : $letter . $base;
    }

    /** "Display / UnDisplay Refund Info To Client": whether the client's invoice shows the CANCELLATION part. */
    public function setRefundDisplay(string $uid, bool $show): ServiceBooking
    {
        $booking = $this->owned()->where('uid', $uid)->firstOrFail();
        $details = $booking->details ?? [];
        if (empty($details['refund'])) {
            throw ValidationException::withMessages(['refund' => 'This invoice has not been refunded.']);
        }
        $details['refund']['show_to_client'] = $show;
        $booking->update(['details' => $details]);

        return $booking;
    }

    /** Every payment on the invoice (including one recorded before split payments existed). */
    private function payments(array $details): array
    {
        $payments = $details['payments'] ?? [];
        if (! empty($details['payment']['paid_on'])) {
            array_unshift($payments, [
                'methods' => [$details['payment']['mode'] => (float) ($details['payment']['amount'] ?? 0)],
                'amount' => (float) ($details['payment']['amount'] ?? 0),
                'card_last4' => null,
                'paid_on' => $details['payment']['paid_on'],
            ]);
        }

        return $payments;
    }

    private function paidAmount(array $details): float
    {
        return round(collect($this->payments($details))->sum('amount'), 2);
    }

    /** "Confirm Via Paper-Print": the client confirmed the printed invoice instead of e-signing it. */
    public function confirmViaPaper(string $uid): ServiceBooking
    {
        $booking = $this->owned()->with('signature')->where('uid', $uid)->firstOrFail();
        if ($booking->signature?->isSigned() || ! empty($booking->details['paper_confirmed_at'])) {
            throw ValidationException::withMessages(['invoice' => 'This invoice is already confirmed by the client.']);
        }
        if ($booking->status === 'rejected') {
            throw ValidationException::withMessages(['invoice' => 'A rejected invoice cannot be confirmed.']);
        }

        $details = $booking->details ?? [];
        $details['paper_confirmed_at'] = now()->toIso8601String();
        // Confirmed like a signed invoice: no longer pending (a visa booking moves to Visa Applications)
        $booking->update([
            'details' => $details,
            'status' => $booking->status === 'pending' ? ServiceBooking::STATUS_SIGNED : $booking->status,
        ]);

        return $booking;
    }

    /** The current owner's bookings, with the filters, newest first. */
    private function query(array $filters): Builder
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $service = (string) ($filters['service'] ?? '');
        $dateColumn = ($filters['date_type'] ?? '') === 'travel' ? 'service_date' : 'created_at';

        return $this->owned()
            ->with('client:id,uid,cid,name,email,phone', 'client.address', 'signature', 'applications:id,service_booking_id,first_name,last_name')
            // Refunded invoices have their own list (Refunded Invoices); the Invoices list leaves them out
            ->when(($filters['scope'] ?? '') === 'refunded',
                fn ($q) => $q->whereNotNull('details->refund'),
                fn ($q) => $q->whereNull('details->refund'))
            ->when(isset(self::SERVICES[$service]), fn ($q) => $q->where('service', $service))
            ->when(! empty($filters['start']), fn ($q) => $q->whereDate($dateColumn, '>=', $filters['start']))
            ->when(! empty($filters['end']), fn ($q) => $q->whereDate($dateColumn, '<=', $filters['end']))
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                        ->orWhere('details->base_invoice_number', 'like', "%{$search}%")
                        ->orWhere('details->customer->name', 'like', "%{$search}%")
                        ->orWhereHas('client', fn ($c) => $c->where('name', 'like', "%{$search}%")
                            ->orWhere('cid', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%"))
                        ->orWhereHas('applications', fn ($a) => $a->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%"));
                });
            })
            ->latest('id');
    }

    private function owned(): Builder
    {
        $owner = $this->contactInfoService->currentOwner();

        return ServiceBooking::where('owner_type', $owner ? get_class($owner) : null)
            ->where('owner_id', $owner?->id);
    }

    private function row(ServiceBooking $b): array
    {
        $d = $b->details ?? [];
        $signature = $b->signature;
        $customer = $d['customer'] ?? null;
        $paperAt = $d['paper_confirmed_at'] ?? null;

        // Doc Sign: none yet, pending, expired, or signed
        $sign = ! $signature ? 'none' : ($signature->isSigned() ? 'signed' : ($signature->isExpired() ? 'expired' : 'pending'));
        $confirmed = $sign === 'signed' ? 'esign' : ($paperAt ? 'paper' : null);

        $status = $b->status === 'rejected' ? 'rejected'
            : ($b->status === 'cancelled' ? 'cancelled'
                : ($confirmed ? 'confirmed' : ($sign === 'none' ? 'not_sent' : ($sign === 'expired' ? 'expired' : 'awaiting'))));

        return [
            'uid' => $b->uid,
            'invoice_number' => $b->invoice_number,
            'invoice_date' => $b->created_at?->toIso8601String(),
            'service' => $b->service,
            'service_name' => self::SERVICES[$b->service] ?? ucfirst($b->service),
            'description' => match ($b->service) {
                'visa' => trim(implode(' · ', array_filter([$d['visa_name'] ?? null, $d['visa_type'] ?? null]))),
                default => $d['title'] ?? null,
            },
            // The client, else (a travel-quote invoice) the customer who accepted the quote
            'receiver' => $b->client
                ? ['uid' => $b->client->uid, 'cid' => $b->client->cid, 'name' => $b->client->name, 'phone' => $b->client->phone]
                : ($customer ? ['uid' => null, 'cid' => null, 'name' => $customer['name'] ?? null, 'phone' => $customer['phone'] ?? null] : null),
            // Every application on the booking: one invoice covers them all
            'applicants' => $b->applications->map(fn ($a) => trim("{$a->first_name} {$a->last_name}"))->values()->all(),
            'travel_date' => $b->service_date?->toDateString(),
            'return_date' => $d['checkout_date'] ?? null,
            'booking_date' => $b->created_at?->toIso8601String(),
            'total' => $b->currency_symbol . number_format($b->total_amount, 2),
            'status' => $status,
            'status_label' => [
                'confirmed' => 'Confirmed', 'awaiting' => 'Awaiting signature', 'expired' => 'Link expired',
                'not_sent' => 'Not sent', 'rejected' => 'Rejected', 'cancelled' => 'Cancelled',
            ][$status],
            'sign' => $sign,
            'confirmed_via' => $confirmed,
            'confirmed_at' => $confirmed === 'esign' ? $signature->signed_at?->toIso8601String() : $paperAt,
            'confirmation_label' => $confirmed === 'esign' ? 'Confirmed By Client (e-signed)'
                : ($confirmed === 'paper' ? 'Confirmed Via Paper-Print' : 'Not Yet Confirmed By Client'),
            // Pay: the amounts, what has been paid so far, and how
            'currency_symbol' => $b->currency_symbol,
            'subtotal' => round((float) $b->total_amount + (float) ($d['discount'] ?? 0), 2),
            'discount' => round((float) ($d['discount'] ?? 0), 2),
            'total_amount' => round((float) $b->total_amount, 2),
            'paid_amount' => $paid = $this->paidAmount($d),
            'pending_amount' => max(round((float) $b->total_amount - $paid, 2), 0),
            'payment_status' => ! empty($d['refund']) ? 'refunded'
                : ($paid <= 0 ? 'unpaid' : ($paid + 0.005 >= (float) $b->total_amount ? 'paid' : 'partial')),
            // Refund: what was given back, and the charges kept
            'refund' => ! empty($d['refund']) ? $d['refund'] + [
                'mode_label' => self::PAYMENT_MODES[$d['refund']['mode'] ?? 'bank_transfer'] ?? 'Bank Transfer',
                'charge_lines' => collect($d['refund']['charges'] ?? [])->filter(fn ($v) => (float) $v > 0)
                    ->map(fn ($v, $k) => ['label' => self::REFUND_CHARGES[$k] ?? $k, 'amount' => (float) $v])->values()->all(),
                // Fully refunded when nothing was kept back
                'full' => (float) ($d['refund']['refund_amount'] ?? 0) + 0.005 >= (float) ($d['refund']['paid_amount'] ?? 0),
            ] : null,
            'refunded' => ! empty($d['refund']),
            'card_paid_amount' => round(collect($this->payments($d))->sum(fn ($p) => ($p['methods']['credit_card'] ?? 0) + ($p['methods']['debit_card'] ?? 0)), 2),
            'paid' => $paid > 0 && $paid + 0.005 >= (float) $b->total_amount,
            'payment' => ($last = collect($this->payments($d))->last()) ? [
                'mode' => collect(array_keys($last['methods'] ?? []))->map(fn ($m) => self::PAYMENT_MODES[$m] ?? ucfirst(str_replace('_', ' ', $m)))->implode(' + '),
                'paid_on' => $last['paid_on'],
            ] : null,
            'address' => $this->address($b),
            // Amendment: every edit that changed the invoice (newest last)
            'amendments' => array_values($d['amendments'] ?? []),
            // Edit: each edit that changed the invoice (counted apart from amendments)
            'edits' => array_values($d['edits'] ?? []),
            // The number it was first issued with (before INVE / INVA)
            'base_invoice_number' => $d['base_invoice_number'] ?? null,
            'signed_url' => $sign === 'signed' ? route('documents.invoice', $signature->signing_token) : null,
            'can_edit' => $b->service === 'visa',
            'invoice_url' => route('admin.service-bookings.invoice', $b->uid),
            'booking_url' => route('admin.service-bookings.show', $b->uid),
        ];
    }

    /** The receiver's address: the client's, else the address on a quote invoice. */
    private function address(ServiceBooking $b): ?string
    {
        $a = $b->client?->address;
        $c = $b->details['customer'] ?? [];
        $parts = $a
            ? [$a->address, $a->city, $a->state, $a->zip_code, $a->country]
            : [$c['address'] ?? null, $c['city'] ?? null, $c['state'] ?? null, $c['zip_code'] ?? null, $c['country'] ?? null];

        return implode(', ', array_filter($parts)) ?: null;
    }

    private function date(?string $value): string
    {
        return $value ? \Illuminate\Support\Carbon::parse($value)->format('d/m/Y') : 'N/A';
    }
}

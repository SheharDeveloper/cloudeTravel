<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\InvoiceService;
use App\Support\SimpleXlsx;
use Illuminate\Http\Request;
use Inertia\Inertia;

/** Invoices: the invoice of every booking, from the agency (or superadmin) to its client. */
class InvoiceController extends Controller
{
    public function __construct(
        protected InvoiceService $invoices,
        protected \App\Services\InvoiceTypeService $access,
    ) {
    }

    /** Stops here unless the session has this invoice permission (the superadmin always has). */
    private function authorizeInvoice(string $action): void
    {
        abort_unless($this->access->can($action), 403, 'You do not have permission for this invoice action.');
    }

    public function index(Request $request)
    {
        return $this->listPage($request, 'invoices');
    }

    /** Refunded Invoices: the invoices that were refunded (they leave the Invoices list). */
    public function refunded(Request $request)
    {
        return $this->listPage($request, 'refunded');
    }

    private function listPage(Request $request, string $scope)
    {
        $this->authorizeInvoice('list');
        $filters = $this->filters($request) + ['scope' => $scope];
        $perPage = in_array((int) $request->query('per_page'), InvoiceService::PER_PAGE, true) ? (int) $request->query('per_page') : 25;

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $this->invoices->list($filters, $perPage),
            'filters' => $filters + ['per_page' => $perPage],
            'services' => InvoiceService::SERVICES,
            'dateTypes' => InvoiceService::DATE_TYPES,
            'perPageOptions' => InvoiceService::PER_PAGE,
            'paymentModes' => InvoiceService::PAYMENT_MODES,
            'refundCharges' => InvoiceService::REFUND_CHARGES,
            // Create Invoice: the types this session may create (empty: no button)
            'createTypes' => $this->access->allowedTypes(),
            // What this session may do: list, view, create, edit, amendment, cancel, refund, pay
            'can' => $this->access->abilities(),
        ]);
    }

    /** View: the invoice inside the admin (with the sidebar), and Back to the list. */
    public function show(string $uid)
    {
        $this->authorizeInvoice('view');
        return Inertia::render('Admin/Invoices/Show', [
            'invoice' => $this->invoices->findForView($uid),
        ]);
    }

    /** Export to Excel (.xlsx) or CSV: every invoice matching the filters. */
    public function export(Request $request, string $format)
    {
        $this->authorizeInvoice('list');
        abort_unless(in_array($format, ['xlsx', 'csv'], true), 404);
        $rows = $this->invoices->exportRows($this->filters($request) + ['scope' => $request->query('scope') === 'refunded' ? 'refunded' : 'invoices']);
        $name = 'invoices-' . now()->format('Y-m-d');

        if ($format === 'xlsx') {
            return response()->download(SimpleXlsx::write($rows, 'Invoices'), "{$name}.xlsx", [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])->deleteFileAfterSend();
        }

        return response()->streamDownload(function () use ($rows) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // UTF-8 BOM, so Excel reads £ / ₹ correctly
            foreach ($rows as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        }, "{$name}.csv", ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /** Edit / Amendment: remembers which was clicked, then opens the booking's edit screens. */
    public function change(string $uid, string $mode)
    {
        $this->authorizeInvoice($mode === 'amend' ? 'amendment' : 'edit');
        return redirect()->route('admin.service-bookings.edit', ['uid' => $uid] + ($mode === 'amend' ? ['mode' => 'amend'] : []));
    }

    /** "Refund": gives back what was paid, less the charges. */
    public function refund(Request $request, string $uid)
    {
        $this->authorizeInvoice('refund');
        $validated = $request->validate([
            'charges' => 'nullable|array',
            'charges.*' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string|max:2000',
            'mode' => ['nullable', \Illuminate\Validation\Rule::in(array_keys(InvoiceService::PAYMENT_MODES))],
        ]);
        $booking = $this->invoices->refund($uid, $validated['charges'] ?? [], $validated['remarks'] ?? null, $validated['mode'] ?? 'bank_transfer');

        return back()->with('success', "Invoice refunded — now {$booking->invoice_number}.");
    }

    /** "Display / UnDisplay Refund Info To Client" */
    public function refundDisplay(Request $request, string $uid)
    {
        $this->authorizeInvoice('refund');
        $show = $request->boolean('show');
        $booking = $this->invoices->setRefundDisplay($uid, $show);

        return back()->with('success', $show
            ? "Refund info on {$booking->invoice_number} is now shown to the client."
            : "Refund info on {$booking->invoice_number} is now hidden from the client.");
    }

    /** "Pay": records the client's payment. */
    public function pay(Request $request, string $uid)
    {
        $this->authorizeInvoice('pay');
        $validated = $request->validate([
            'methods' => 'required|array',
            'methods.*' => 'nullable|numeric|min:0',
            'card_last4' => 'nullable|digits:4',
        ], [
            'card_last4.digits' => 'Enter the last 4 digits of the card.',
        ]);
        $booking = $this->invoices->addPayment($uid, $validated['methods'], $validated['card_last4'] ?? null);

        return back()->with('success', "Payment recorded for invoice {$booking->invoice_number}.");
    }

    /** "Confirm Via Paper-Print": the client confirmed the printed invoice. */
    public function confirmPaper(string $uid)
    {
        $booking = $this->invoices->confirmViaPaper($uid);

        return back()->with('success', "Invoice {$booking->invoice_number} confirmed via paper print.");
    }

    private function filters(Request $request): array
    {
        $date = fn ($v) => is_string($v) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $v) ? $v : '';

        return [
            'search' => trim((string) $request->query('search', '')),
            'service' => array_key_exists((string) $request->query('service'), InvoiceService::SERVICES) ? (string) $request->query('service') : '',
            'date_type' => array_key_exists((string) $request->query('date_type'), InvoiceService::DATE_TYPES) ? (string) $request->query('date_type') : '',
            'start' => $date($request->query('start')),
            'end' => $date($request->query('end')),
        ];
    }
}

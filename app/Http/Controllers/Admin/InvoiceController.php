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
    public function __construct(protected InvoiceService $invoices)
    {
    }

    public function index(Request $request)
    {
        $filters = $this->filters($request);
        $perPage = in_array((int) $request->query('per_page'), InvoiceService::PER_PAGE, true) ? (int) $request->query('per_page') : 25;

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $this->invoices->list($filters, $perPage),
            'filters' => $filters + ['per_page' => $perPage],
            'services' => InvoiceService::SERVICES,
            'dateTypes' => InvoiceService::DATE_TYPES,
            'perPageOptions' => InvoiceService::PER_PAGE,
            'paymentModes' => InvoiceService::PAYMENT_MODES,
        ]);
    }

    /** View: the invoice inside the admin (with the sidebar), and Back to the list. */
    public function show(string $uid)
    {
        return Inertia::render('Admin/Invoices/Show', [
            'invoice' => $this->invoices->findForView($uid),
        ]);
    }

    /** Export to Excel (.xlsx) or CSV: every invoice matching the filters. */
    public function export(Request $request, string $format)
    {
        abort_unless(in_array($format, ['xlsx', 'csv'], true), 404);
        $rows = $this->invoices->exportRows($this->filters($request));
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
        $this->invoices->rememberChangeMode($uid, $mode);

        return redirect()->route('admin.service-bookings.edit', $uid);
    }

    /** "Pay": records the client's payment. */
    public function pay(Request $request, string $uid)
    {
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

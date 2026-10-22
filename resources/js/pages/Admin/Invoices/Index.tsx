import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import DatePicker from '@/components/DatePicker';

interface InvoiceRow {
    uid: string;
    invoice_number: string;
    invoice_date: string | null;
    service: string;
    service_name: string;
    description: string | null;
    receiver: { uid: string | null; cid: string | null; name: string | null; phone: string | null } | null;
    // Every application on the booking (one invoice covers them all)
    applicants: string[];
    travel_date: string | null;
    return_date: string | null;
    booking_date: string | null;
    total: string;
    status: 'confirmed' | 'awaiting' | 'expired' | 'not_sent' | 'rejected' | 'cancelled';
    status_label: string;
    // Doc Sign: none yet / pending / expired / signed
    sign: 'none' | 'pending' | 'expired' | 'signed';
    confirmed_via: 'esign' | 'paper' | null;
    confirmed_at: string | null;
    confirmation_label: string;
    can_edit: boolean;
    // Pay: the amounts and what has been paid so far
    currency_symbol: string;
    subtotal: number;
    discount: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    payment_status: 'paid' | 'partial' | 'unpaid' | 'refunded';
    // Refund: what was given back and the charges kept (once refunded)
    refunded: boolean;
    refund: {
        paid_amount: number; total_charges: number; refund_amount: number; remarks: string | null; at: string; by?: string | null;
        mode_label: string; charge_lines: { label: string; amount: number }[]; full: boolean; show_to_client?: boolean;
    } | null;
    card_paid_amount: number;
    paid: boolean;
    payment: { mode: string; paid_on: string } | null;
    address: string | null;
    // Edit / Amendment: each saved change (newest last), counted apart; and the number it was first issued with
    edits: InvoiceChange[];
    amendments: InvoiceChange[];
    base_invoice_number: string | null;
    // The e-signed copy, once the client signed
    signed_url: string | null;
    invoice_url: string;
    booking_url: string;
}

type InvoiceChange = { at: string; by: string | null; number_before?: string; changes: { field: string; old: string; new: string }[] };

type Filters = { search: string; service: string; date_type: string; start: string; end: string; per_page: number; scope?: 'invoices' | 'refunded' };

interface Props {
    invoices: {
        data: InvoiceRow[];
        current_page: number;
        from: number | null;
        to: number | null;
        total: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: Filters;
    services: Record<string, string>;
    dateTypes: Record<string, string>;
    perPageOptions: number[];
    paymentModes: Record<string, string>;
    // Refund: the charges kept back (key => label)
    refundCharges: Record<string, string>;
    // Create Invoice: the invoice types this session may create (empty: no button)
    createTypes: Record<string, string>;
    // What this session may do with invoices
    can: Record<'list' | 'view' | 'create' | 'edit' | 'amendment' | 'cancel' | 'refund' | 'pay', boolean>;
    flash?: { success?: string | null };
}


const fmtDate = (value: string | null) =>
    value ? new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString('en-GB') : 'N/A';
const fmtDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '') : 'N/A';

/** The query string for the current filters (for the export links and paging). */
const toQuery = (f: Partial<Filters>) =>
    new URLSearchParams(Object.entries(f).filter(([, v]) => v !== '' && v !== undefined && v !== null).map(([k, v]) => [k, String(v)])).toString();

/**
 * Invoices: every booking's invoice, from the agency (or superadmin) to its
 * client — filters, export, an Action menu, and the client's confirmation
 * (e-signed, or confirmed on a paper print).
 */
export default function InvoicesIndex() {
    const { invoices, filters, services, dateTypes, perPageOptions, paymentModes, refundCharges, createTypes, can, flash } = usePage().props as unknown as Props;
    // Refund: confirm first, then the charges and amount
    const [refundAsk, setRefundAsk] = useState<InvoiceRow | null>(null);
    const [refunding, setRefunding] = useState<InvoiceRow | null>(null);
    const [refundDetailsOf, setRefundDetailsOf] = useState<InvoiceRow | null>(null);
    const toggleRefundDisplay = (inv: InvoiceRow) => {
        setBusy(`display-${inv.uid}`);
        router.post(`/admin/invoices/${inv.uid}/refund-display`, { show: !inv.refund?.show_to_client }, {
            preserveScroll: true,
            onError: (errs) => toast.error(Object.values(errs)[0] ?? 'Something went wrong'),
            onFinish: () => setBusy(null),
        });
    };
    const saveRefund = (charges: Record<string, number>, remarks: string, mode: string) => {
        if (!refunding) return;
        setBusy(`refund-${refunding.uid}`);
        router.post(`/admin/invoices/${refunding.uid}/refund`, { charges, remarks, mode }, {
            preserveScroll: true,
            onSuccess: () => setRefunding(null),
            onError: (errs) => toast.error(Object.values(errs)[0] ?? 'Something went wrong'),
            onFinish: () => setBusy(null),
        });
    };
    // Create Invoice: pick the service type first
    const [creating, setCreating] = useState(false);
    const [createType, setCreateType] = useState('');
    // Invoices, or Refunded Invoices (same page, its own list)
    const refundedList = filters.scope === 'refunded';
    const listPath = refundedList ? '/admin/invoices/refunded' : '/admin/invoices';
    const canCreate = !refundedList && Object.keys(createTypes ?? {}).length > 0;
    const [form, setForm] = useState<Filters>(filters);
    // The open Action menu, pinned to the screen under its button (the table scrolls sideways)
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    // The button the menu belongs to, and the menu itself: it opens upward when there's no room below
    const [anchor, setAnchor] = useState<DOMRect | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!openMenu || !anchor || !menuRef.current) return;
        const height = menuRef.current.offsetHeight;
        const below = window.innerHeight - anchor.bottom - 8;
        const above = anchor.top - 8;
        const top = height <= below || below >= above
            ? anchor.bottom + 4
            : Math.max(8, anchor.top - height - 4);
        setMenuPos({ top, left: Math.max(8, Math.min(anchor.right - 170, window.innerWidth - 178)) });
    }, [openMenu, anchor]);
    const [busy, setBusy] = useState<string | null>(null);
    const [comingSoon, setComingSoon] = useState<string | null>(null);
    const [confirming, setConfirming] = useState<InvoiceRow | null>(null);
    // Pay: the payment mode and date
    const [paying, setPaying] = useState<InvoiceRow | null>(null);
    // Change history: the invoice's edits and amendments
    const [amendmentOf, setAmendmentOf] = useState<InvoiceRow | null>(null);
    // Edit → INVE…, Amendment → INVA… (the same edit screens; the mode decides how it's counted)
    const editInvoice = (inv: InvoiceRow, mode: 'edit' | 'amend') =>
        router.visit(inv.can_edit ? `/admin/invoices/${inv.uid}/${mode}` : inv.booking_url);
    const savePayment = (methods: Record<string, number>, cardLast4: string) => {
        if (!paying) return;
        setBusy(`pay-${paying.uid}`);
        router.post(`/admin/invoices/${paying.uid}/pay`, { methods, card_last4: cardLast4 || null }, {
            preserveScroll: true,
            onSuccess: () => setPaying(null),
            onError: (errs) => toast.error(Object.values(errs)[0] ?? 'Something went wrong'),
            onFinish: () => setBusy(null),
        });
    };
    const openMenuAt = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setAnchor(rect);
        setMenuPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 170) });
        setOpenMenu(openMenu === key ? null : key);
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: `${flash.success}-${Date.now()}` });
    }, [flash?.success]);

    // Close the Action menu on any outside click
    useEffect(() => {
        if (!openMenu) return;
        const close = () => setOpenMenu(null);
        document.addEventListener('click', close);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            document.removeEventListener('click', close);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [openMenu]);

    const search = (patch: Partial<Filters> = {}) => {
        const next = { ...form, ...patch };
        setForm(next);
        router.get(listPath, Object.fromEntries(new URLSearchParams(toQuery({ ...next, scope: undefined }))), { preserveState: true, replace: true });
    };
    const clearFilters = () => search({ search: '', service: '', date_type: '', start: '', end: '' });

    const post = (key: string, url: string, done?: () => void) => {
        setBusy(key);
        router.post(url, {}, {
            preserveScroll: true,
            onSuccess: () => done?.(),
            onError: (errs) => toast.error(Object.values(errs)[0] ?? 'Something went wrong'),
            onFinish: () => setBusy(null),
        });
    };

    // Send Reminder: the signing link — generated, emailed again, or regenerated when it expired
    const sendReminder = (inv: InvoiceRow) => {
        const path = inv.sign === 'none' ? 'doc-sign' : inv.sign === 'expired' ? 'doc-sign/regenerate' : 'doc-sign/resend';
        post(`remind-${inv.uid}`, `/admin/service-bookings/${inv.uid}/${path}`);
    };

    const exportQuery = toQuery({ ...filters, per_page: undefined, scope: refundedList ? 'refunded' : undefined });
    const hasFilters = !!(filters.search || filters.service || filters.date_type || filters.start || filters.end);

    const menuItem = (label: string, className: string, onClick: () => void, disabled = false) => (
        <button type="button" className={`btn btn-sm w-100 text-white mb-1 ${className}`} style={{ borderRadius: 4 }} onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );

    return (
        <ProtectedRoute>
            <Head title="Invoices" />

            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>{refundedList ? 'Refunded Invoices' : 'Invoice'}</h1></li>
                        <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                        {refundedList && <li className="breadcrumb-item"><a href="/admin/invoices">Invoice</a></li>}
                        <li className="breadcrumb-item active">{refundedList ? 'Refunded Invoices' : 'Invoice'}</li>
                    </ol>
                </nav>
                {canCreate && (
                    <button
                        type="button"
                        className="btn btn-sm text-white"
                        style={{ background: '#7cc22b' }}
                        onClick={() => { setCreateType(''); setCreating(true); }}
                    >
                        <i className="fa fa-plus me-2"></i>Create Invoice
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="card h-auto mb-3">
                <div className="card-body">
                    <form onSubmit={(e) => { e.preventDefault(); search(); }}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small text-muted">Service Type</label>
                                <select className="form-select" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                                    <option value="">--Select Service--</option>
                                    {Object.entries(services).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </div>
                            <div className="col-md-8">
                                <label className="form-label small text-muted">Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by invoice no, name, client ID, phone..."
                                    value={form.search}
                                    onChange={(e) => setForm({ ...form, search: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Date Type</label>
                                <select className="form-select" value={form.date_type} onChange={(e) => setForm({ ...form, date_type: e.target.value })}>
                                    <option value="">--Select Date Type--</option>
                                    {Object.entries(dateTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Start Date</label>
                                <DatePicker value={form.start} onChange={(v) => setForm({ ...form, start: v })} maxDate={form.end || undefined} autoSelect={true} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">End Date</label>
                                <DatePicker value={form.end} onChange={(v) => setForm({ ...form, end: v })} minDate={form.start || undefined} autoSelect={true} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small text-muted">Items per page</label>
                                <select className="form-select" value={form.per_page} onChange={(e) => search({ per_page: Number(e.target.value) })}>
                                    {perPageOptions.map((n) => <option key={n} value={n}>{n} items</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            {hasFilters && <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>Clear</button>}
                            <button type="submit" className="btn btn-primary"><i className="fa fa-search me-1"></i>Search</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Totals and paging */}
            <div className="card h-auto mb-3">
                <div className="card-body py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div><strong>Total Records:</strong> {invoices.total} <strong className="ms-2">Showing:</strong> {invoices.from ?? 0} - {invoices.to ?? 0}</div>
                    <div><strong>Page:</strong> {invoices.current_page} of {Math.max(invoices.last_page, 1)}</div>
                    {invoices.last_page > 1 && (
                        <ul className="pagination pagination-sm mb-0">
                            {invoices.links.map((link, idx) => (
                                <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${link.url ? '' : 'disabled'}`}>
                                    <button
                                        type="button"
                                        className="page-link"
                                        onClick={() => link.url && router.visit(link.url, { preserveState: true, preserveScroll: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="d-flex gap-2 mb-3">
                <a href={`/admin/invoices/export/xlsx${exportQuery ? `?${exportQuery}` : ''}`} className="btn btn-success btn-sm">
                    <i className="fa fa-file-excel me-2"></i>Export to Excel
                </a>
                <a href={`/admin/invoices/export/csv${exportQuery ? `?${exportQuery}` : ''}`} className="btn btn-info btn-sm text-white">
                    <i className="fa fa-file-csv me-2"></i>Export to CSV
                </a>
            </div>

            <div className="card h-auto">
                <div className="card-body p-0">
                    {invoices.data.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fa fa-file-invoice d-block mb-2" style={{ fontSize: 40, color: '#ccc' }}></i>
                            {hasFilters ? 'No invoices match the filters.' : 'No invoices yet. Every booking gets an invoice here.'}
                        </div>
                    ) : (
                        <>
                        {refundedList ? (
                            <RefundedInvoicesTable
                                rows={invoices.data}
                                canRefund={can.refund}
                                busy={busy}
                                onView={(inv) => router.visit(`/admin/invoices/${inv.uid}`)}
                                onDetails={setRefundDetailsOf}
                                onToggle={toggleRefundDisplay}
                            />
                        ) : (
                        <div className="table-responsive">
                            <style>{`
                                .inv-table { font-size: 13px; }
                                .inv-table th { font-weight: 700; color: #212529; white-space: nowrap; background: #fff; }
                                .inv-table td { vertical-align: top; color: #333; }
                                .inv-table .inv-btn { min-width: 100px; font-size: 13px; }
                            `}</style>
                            <table className="table table-bordered table-striped inv-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Invoice No.</th>
                                        <th>Invoice Date</th>
                                        <th>Service Name</th>
                                        <th>Receiver Name</th>
                                        <th>Travel Date</th>
                                        <th>Return Travel Date</th>
                                        <th>Booking Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th className="text-center">Action</th>
                                        <th>Confirmation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.data.map((inv) => (
                                        <tr key={inv.uid}>
                                            <td className="text-nowrap">
                                                {inv.invoice_number}
                                                {inv.edits.length > 0 && (
                                                    <span
                                                        className="badge bg-info text-white d-block mt-1"
                                                        style={{ width: 'fit-content', cursor: 'pointer' }}
                                                        title="See what was changed"
                                                        onClick={() => setAmendmentOf(inv)}
                                                    >
                                                        Edited{inv.edits.length > 1 ? ` ×${inv.edits.length}` : ''}
                                                    </span>
                                                )}
                                                {inv.amendments.length > 0 && (
                                                    <span
                                                        className="badge bg-warning text-dark d-block mt-1"
                                                        style={{ width: 'fit-content', cursor: 'pointer' }}
                                                        title="See what was changed"
                                                        onClick={() => setAmendmentOf(inv)}
                                                    >
                                                        Amended{inv.amendments.length > 1 ? ` ×${inv.amendments.length}` : ''}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-nowrap">{fmtDate(inv.invoice_date)}</td>
                                            <td className="text-nowrap">
                                                {inv.service_name}
                                                {inv.applicants.length > 1 && (
                                                    <small className="d-block text-muted">{inv.applicants.length} applications</small>
                                                )}
                                            </td>
                                            <td className="text-uppercase">
                                                {inv.receiver?.uid
                                                    ? <a href={`/admin/clients/${inv.receiver.uid}`} className="text-reset">{inv.receiver.name}</a>
                                                    : (inv.receiver?.name ?? 'N/A')}
                                                {/* All the applicants on this booking's invoice */}
                                                {inv.applicants.length > 1 && (
                                                    <ul className="list-unstyled small text-muted mb-0 mt-1" style={{ textTransform: 'none' }}>
                                                        {inv.applicants.map((name, i) => <li key={i}>{i + 1}. {name}</li>)}
                                                    </ul>
                                                )}
                                            </td>
                                            <td className="text-nowrap">{fmtDate(inv.travel_date)}</td>
                                            <td className="text-nowrap">{fmtDate(inv.return_date)}</td>
                                            <td className="text-nowrap">{fmtDateTime(inv.booking_date)}</td>
                                            <td className="text-nowrap">{inv.total}</td>
                                            <td className={inv.payment_status === 'refunded' ? 'text-primary' : inv.payment_status === 'paid' ? 'text-success' : inv.payment_status === 'partial' ? 'text-warning' : 'text-danger'}>
                                                {inv.payment_status === 'refunded' ? 'Refunded' : inv.payment_status === 'paid' ? 'Paid' : inv.payment_status === 'partial' ? 'Partially Paid' : 'Unpaid'}
                                                {inv.refund && (
                                                    <small className="d-block text-muted">{inv.currency_symbol}{inv.refund.refund_amount.toFixed(2)} back · {fmtDate(inv.refund.at)}</small>
                                                )}
                                                {inv.payment_status === 'partial' && (
                                                    <small className="d-block text-muted">{inv.currency_symbol}{inv.paid_amount.toFixed(2)} of {inv.total}</small>
                                                )}
                                                {inv.payment && <small className="d-block text-muted">{inv.payment.mode} · {fmtDate(inv.payment.paid_on)}</small>}
                                            </td>
                                            <td className="text-center">
                                                {/* Certificates: the invoice and its copies */}
                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-white dropdown-toggle inv-btn d-block mx-auto mb-2"
                                                    style={{ background: '#6c757d' }}
                                                    onClick={(e) => openMenuAt(`cert:${inv.uid}`, e)}
                                                >
                                                    Certificates
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-info btn-sm text-white dropdown-toggle inv-btn d-block mx-auto"
                                                    onClick={(e) => openMenuAt(`action:${inv.uid}`, e)}
                                                    disabled={busy !== null}
                                                >
                                                    {busy?.endsWith(inv.uid) ? 'Working…' : 'Action'}
                                                </button>
                                                {openMenu === `cert:${inv.uid}` && (
                                                    <div
                                                        className="position-fixed bg-white border rounded shadow p-2 text-start"
                                                        ref={menuRef}
                                                        style={{ zIndex: 1050, top: menuPos.top, left: menuPos.left, width: 170, maxHeight: 'calc(100vh - 16px)', overflowY: 'auto' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {can.view && menuItem('Invoice', 'btn-info', () => router.visit(`/admin/invoices/${inv.uid}`))}
                                                        {inv.signed_url && menuItem('E-Signed Invoice', 'btn-success', () => window.open(inv.signed_url!, '_blank'))}
                                                        {menuItem('Payment Receipt', 'btn-secondary', () => setComingSoon('Payment Receipt'))}
                                                    </div>
                                                )}
                                                {openMenu === `action:${inv.uid}` && (
                                                    <div
                                                        className="position-fixed bg-white border rounded shadow p-2"
                                                        ref={menuRef}
                                                        style={{ zIndex: 1050, top: menuPos.top, left: menuPos.left, width: 170, maxHeight: 'calc(100vh - 16px)', overflowY: 'auto' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {can.view && menuItem('View', 'btn-info', () => router.visit(`/admin/invoices/${inv.uid}`))}
                                                        {can.edit && !inv.refunded && menuItem(inv.edits.length ? `Edit (${inv.edits.length})` : 'Edit', 'btn-primary', () => editInvoice(inv, 'edit'))}
                                                        {can.amendment && !inv.refunded && menuItem(inv.amendments.length ? `Amendment (${inv.amendments.length})` : 'Amendment', 'btn-danger', () => editInvoice(inv, 'amend'))}
                                                        {can.cancel && menuItem('Cancel', 'btn-danger', () => setComingSoon('Cancel'))}
                                                        {can.pay && !inv.refunded && inv.pending_amount > 0 && !['rejected', 'cancelled'].includes(inv.status) &&
                                                            menuItem('Pay', 'btn-success', () => {
                                                                setOpenMenu(null);
                                                                setPaying(inv);
                                                            })}
                                                        {can.refund && !inv.refunded && inv.paid_amount > 0 &&
                                                            menuItem('Refund', 'btn-success', () => { setOpenMenu(null); setRefundAsk(inv); })}
                                                        {inv.sign !== 'signed' && !['rejected', 'cancelled'].includes(inv.status) &&
                                                            menuItem(
                                                                inv.sign === 'expired' ? 'Send Reminder (new link)' : 'Send Reminder',
                                                                'btn-danger',
                                                                () => { setOpenMenu(null); sendReminder(inv); },
                                                            )}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ minWidth: 190 }}>
                                                {inv.confirmed_via ? (
                                                    <>
                                                        <span className="text-success fw-bold">{inv.confirmation_label}</span>
                                                        <small className="d-block text-muted">{fmtDateTime(inv.confirmed_at)}</small>
                                                    </>
                                                ) : ['rejected', 'cancelled'].includes(inv.status) ? (
                                                    <span className="text-muted">{inv.status_label}</span>
                                                ) : (
                                                    <>
                                                        <span className="text-danger fw-bold d-block">{inv.confirmation_label}</span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-white mt-1"
                                                            style={{ background: '#7cc22b', fontSize: 13 }}
                                                            onClick={() => setConfirming(inv)}
                                                            disabled={busy !== null}
                                                        >
                                                            Confirm Via Paper-Print
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}
                        </>
                    )}
                </div>
            </div>

            {/* Change history: the invoice's edits and amendments */}
            {amendmentOf && (() => {
                const history = [
                    ...amendmentOf.edits.map((c) => ({ ...c, kind: 'Edit' as const })),
                    ...amendmentOf.amendments.map((c) => ({ ...c, kind: 'Amendment' as const })),
                ].sort((a, b) => b.at.localeCompare(a.at));
                return (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setAmendmentOf(null)}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Changes — {amendmentOf.invoice_number}</h5>
                                    <button type="button" className="btn-close" onClick={() => setAmendmentOf(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex flex-wrap gap-2 mb-3 small">
                                        {amendmentOf.base_invoice_number && <span className="badge bg-light text-dark border">First issued as {amendmentOf.base_invoice_number}</span>}
                                        <span className="badge bg-info">Edits: {amendmentOf.edits.length}</span>
                                        <span className="badge bg-warning text-dark">Amendments: {amendmentOf.amendments.length}</span>
                                    </div>
                                    {history.length === 0 ? (
                                        <div className="text-center py-4">
                                            <i className="fa fa-check-circle text-success d-block mb-2" style={{ fontSize: 36 }}></i>
                                            <p className="fw-semibold mb-1">This invoice has not been edited or amended.</p>
                                            <p className="text-muted small mb-0">It is still as it was first issued on {fmtDate(amendmentOf.invoice_date)}.</p>
                                        </div>
                                    ) : history.map((h, i) => (
                                        <div key={i} className="border rounded p-3 mb-3">
                                            <div className="d-flex justify-content-between small mb-2">
                                                <strong>
                                                    <span className={`badge ${h.kind === 'Edit' ? 'bg-info' : 'bg-warning text-dark'} me-2`}>{h.kind}</span>
                                                    {h.number_before && <span className="text-muted fw-normal">was {h.number_before}</span>}
                                                </strong>
                                                <span className="text-muted">{fmtDateTime(h.at)}{h.by ? ` · by ${h.by}` : ''}</span>
                                            </div>
                                            <table className="table table-sm table-bordered mb-0 small">
                                                <thead className="table-light">
                                                    <tr><th style={{ width: 140 }}>Field</th><th>Before</th><th>After</th></tr>
                                                </thead>
                                                <tbody>
                                                    {h.changes.map((c, j) => (
                                                        <tr key={j}>
                                                            <td className="fw-semibold">{c.field}</td>
                                                            <td className="text-danger">{c.old || '—'}</td>
                                                            <td className="text-success">{c.new || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setAmendmentOf(null)}>Close</button>
                                    {!['rejected', 'cancelled'].includes(amendmentOf.status) && (
                                        <>
                                            <button type="button" className="btn btn-primary" onClick={() => editInvoice(amendmentOf, 'edit')}>
                                                <i className="fa fa-pen me-2"></i>Edit
                                            </button>
                                            <button type="button" className="btn btn-danger" onClick={() => editInvoice(amendmentOf, 'amend')}>
                                                <i className="fa fa-file-signature me-2"></i>Amendment
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Create Invoice: choose the service type */}
            {creating && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setCreating(false)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create Invoice</h5>
                                <button type="button" className="btn-close" onClick={() => setCreating(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Service Type</label>
                                <select className="form-select" value={createType} onChange={(e) => setCreateType(e.target.value)}>
                                    <option value="">--Select Service--</option>
                                    {Object.entries(createTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                                {createType === 'visa' && (
                                    <div className="alert alert-info small mt-3 mb-0">
                                        Visa invoices are made from a visa booking: choose the countries and visa, then the client — the invoice is created with the booking.
                                    </div>
                                )}
                                {createType && createType !== 'visa' && (
                                    <div className="alert alert-warning small mt-3 mb-0">
                                        <i className="fa fa-clock me-1"></i>The <strong>{createTypes[createType]}</strong> invoice form is coming next.
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={createType !== 'visa'}
                                    onClick={() => router.visit('/admin/visa-search')}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Details ("View Now") */}
            {refundDetailsOf && <RefundDetailsModal invoice={refundDetailsOf} onClose={() => setRefundDetailsOf(null)} />}

            {/* Refund: confirm, then the Refund Invoice form */}
            {refundAsk && (
                <RefundConfirm
                    invoice={refundAsk}
                    onNo={() => setRefundAsk(null)}
                    onYes={() => { setRefunding(refundAsk); setRefundAsk(null); }}
                />
            )}
            {refunding && (
                <RefundInvoiceModal
                    invoice={refunding}
                    charges={refundCharges}
                    modes={paymentModes}
                    busy={busy !== null}
                    onClose={() => setRefunding(null)}
                    onRefund={saveRefund}
                />
            )}

            {/* Pay Invoice */}
            {paying && (
                <PayInvoiceModal
                    invoice={paying}
                    modes={paymentModes}
                    busy={busy !== null}
                    onClose={() => setPaying(null)}
                    onPay={savePayment}
                />
            )}

            {/* Confirm Via Paper-Print */}
            {confirming && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => busy === null && setConfirming(null)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Via Paper-Print</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirming(null)}></button>
                            </div>
                            <div className="modal-body">
                                Mark invoice <strong>{confirming.invoice_number}</strong> for <strong>{confirming.receiver?.name}</strong> as
                                confirmed by the client on a printed copy? It then counts as confirmed, like an e-signed invoice.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirming(null)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    disabled={busy !== null}
                                    onClick={() => post(`paper-${confirming.uid}`, `/admin/invoices/${confirming.uid}/confirm-paper`, () => setConfirming(null))}
                                >
                                    {busy ? 'Confirming…' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Amendment / Cancel / Pay / Refund: not live yet */}
            {comingSoon && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setComingSoon(null)}>
                    <div className="modal-dialog modal-dialog-centered modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content text-center">
                            <div className="modal-body py-4">
                                <i className="fa fa-clock text-primary d-block mb-3" style={{ fontSize: 40 }}></i>
                                <h5 className="mb-2">{comingSoon} — Coming Soon</h5>
                                <p className="text-muted mb-0">This option will be available very soon.</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => setComingSoon(null)}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

/** "Pay Invoice": who it's for, the amounts, and the payment split across methods. */
function PayInvoiceModal({ invoice, modes, busy, onClose, onPay }: {
    invoice: InvoiceRow;
    modes: Record<string, string>;
    busy: boolean;
    onClose: () => void;
    onPay: (methods: Record<string, number>, cardLast4: string) => void;
}) {
    const money = (n: number) => `${invoice.currency_symbol} ${n.toFixed(2)}`;
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [cardLast4, setCardLast4] = useState('');

    const paying = Object.keys(modes).reduce((sum, m) => sum + (checked[m] ? Number(amounts[m]) || 0 : 0), 0);
    const paidAfter = invoice.paid_amount + paying;
    const pendingAfter = Math.max(invoice.total_amount - paidAfter, 0);
    const tooMuch = paying > invoice.pending_amount + 0.005;
    const usesCard = !!(checked.credit_card || checked.debit_card);
    const cardInvalid = usesCard && !/^\d{4}$/.test(cardLast4);

    // Ticking a method fills it with what is still pending
    const toggle = (mode: string, on: boolean) => {
        setChecked({ ...checked, [mode]: on });
        if (on && !Number(amounts[mode])) {
            const left = Math.max(invoice.pending_amount - paying, 0);
            setAmounts({ ...amounts, [mode]: left.toFixed(2) });
        }
    };

    const submit = () => {
        const methods = Object.fromEntries(Object.keys(modes).filter((m) => checked[m] && Number(amounts[m]) > 0).map((m) => [m, Number(amounts[m])]));
        onPay(methods, cardLast4);
    };

    const box = { background: '#f8f9fb', borderRadius: 8, padding: '16px 18px' } as const;
    const readOnly = { background: '#f1f3f5' } as const;
    const highlight = { background: '#eef5ff', color: '#1d4ed8', fontWeight: 600 } as const;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => !busy && onClose()}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title d-flex align-items-center gap-2" style={{ fontSize: 16 }}>
                            <span className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }}>$</span>
                            Pay Invoice
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={busy}></button>
                    </div>
                    <div className="modal-body" style={{ fontSize: 13 }}>
                        {/* To, Receiver (Bill To) */}
                        <div className="row g-3 mb-3" style={box}>
                            <div className="col-md-6">
                                <div className="fw-semibold mb-2">To, RECEIVER (BILL TO)</div>
                                <label className="form-label small text-muted mb-1">Receiver Name</label>
                                <input className="form-control form-control-sm mb-2 text-uppercase" style={readOnly} value={invoice.receiver?.name ?? 'N/A'} readOnly />
                                <label className="form-label small text-muted mb-1">Address</label>
                                <textarea className="form-control form-control-sm" style={readOnly} rows={3} value={invoice.address ?? 'N/A'} readOnly />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted mb-1">Invoice Number</label>
                                <input className="form-control form-control-sm mb-2" style={highlight} value={invoice.invoice_number} readOnly />
                                <label className="form-label small text-muted mb-1">Invoice Date</label>
                                <input className="form-control form-control-sm" style={highlight} value={fmtDate(invoice.invoice_date)} readOnly />
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="mb-3" style={box}>
                            <div className="fw-semibold mb-3">Financial Summary</div>
                            {[
                                ['SubTotal:', invoice.subtotal, readOnly],
                                ['Discount:', invoice.discount, readOnly],
                                ['Total:', invoice.total_amount, highlight],
                            ].map(([label, value, style]) => (
                                <div key={label as string} className="d-flex justify-content-between align-items-center mb-2">
                                    <span>{label as string}</span>
                                    <input className="form-control form-control-sm text-end" style={{ ...(style as object), width: 140 }} value={money(value as number)} readOnly />
                                </div>
                            ))}
                        </div>

                        {/* Payment Methods */}
                        <div style={box}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-semibold">Payment Methods</span>
                                <span className="small">
                                    <span className="text-success me-3">Paid: {money(paidAfter)}</span>
                                    <span className="text-danger">Pending Amount: {money(pendingAfter)}</span>
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span>Card Last 4 Digit:{usesCard && <span className="text-danger"> *</span>}</span>
                                <input
                                    className={`form-control form-control-sm ${usesCard && cardLast4 && cardInvalid ? 'is-invalid' : ''}`}
                                    style={{ width: 140 }}
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="1234"
                                    value={cardLast4}
                                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                />
                            </div>
                            {Object.entries(modes).map(([mode, label]) => (
                                <div key={mode} className="d-flex align-items-center gap-2 mb-2">
                                    <input
                                        id={`pay-${mode}`}
                                        type="checkbox"
                                        className="form-check-input m-0"
                                        checked={!!checked[mode]}
                                        onChange={(e) => toggle(mode, e.target.checked)}
                                        disabled={invoice.pending_amount <= 0}
                                    />
                                    <label htmlFor={`pay-${mode}`} className="mb-0" style={{ minWidth: 95 }}>{label}:</label>
                                    <div className="input-group input-group-sm" style={{ width: 150 }}>
                                        <span className="input-group-text">{invoice.currency_symbol}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="form-control"
                                            placeholder="0.00"
                                            value={amounts[mode] ?? ''}
                                            disabled={!checked[mode]}
                                            onChange={(e) => setAmounts({ ...amounts, [mode]: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ))}
                            {tooMuch && <div className="text-danger small mt-2">The payment is more than the pending amount ({money(invoice.pending_amount)}).</div>}
                            {usesCard && cardInvalid && <div className="text-danger small mt-1">Enter the card's last 4 digits.</div>}
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button
                            type="button"
                            className="btn btn-success px-4"
                            onClick={submit}
                            disabled={busy || paying <= 0 || tooMuch || cardInvalid}
                        >
                            {busy ? 'Saving…' : 'Pay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Refund, step 1: are you sure? */
function RefundConfirm({ invoice, onNo, onYes }: { invoice: InvoiceRow; onNo: () => void; onYes: () => void }) {
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.55)' }} onClick={onNo}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 14 }}>
                    <div className="modal-body text-center px-4 pt-4 pb-3">
                        <div
                            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
                            style={{ width: 64, height: 64, fontSize: 28 }}
                        >
                            <i className="fa-solid fa-rotate-left"></i>
                        </div>
                        <h5 className="fw-bold mb-2">Refund this invoice?</h5>
                        <p className="text-muted mb-1">
                            Invoice <strong className="text-dark">{invoice.invoice_number}</strong> for <strong className="text-dark">{invoice.receiver?.name}</strong>
                        </p>
                        <p className="text-muted small mb-0">
                            Paid so far: <strong className="text-dark">{invoice.currency_symbol}{invoice.paid_amount.toFixed(2)}</strong>.
                            A refund can't be undone — the invoice becomes <strong>INVR…</strong> and can no longer be paid, edited or amended.
                        </p>
                    </div>
                    <div className="modal-footer border-0 justify-content-center gap-2 pb-4">
                        <button type="button" className="btn btn-light px-4" onClick={onNo}>No, keep it</button>
                        <button type="button" className="btn btn-primary px-4" onClick={onYes}>Yes, refund</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Refund, step 2: the charges kept back, the amount to refund, and remarks — in the theme's modal style. */
function RefundInvoiceModal({ invoice, charges, modes, busy, onClose, onRefund }: {
    invoice: InvoiceRow;
    charges: Record<string, string>;
    modes: Record<string, string>;
    busy: boolean;
    onClose: () => void;
    onRefund: (charges: Record<string, number>, remarks: string, mode: string) => void;
}) {
    // How the money goes back to the client
    const [mode, setMode] = useState(modes.bank_transfer ? 'bank_transfer' : Object.keys(modes)[0]);
    const symbol = invoice.currency_symbol;
    const money = (n: number) => `${symbol}${n.toFixed(2)}`;
    // The credit card charge starts at 1% of what was paid by card
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(Object.keys(charges).map((k) => [k, k === 'credit_charge' ? (invoice.card_paid_amount * 0.01).toFixed(2) : '0.00'])),
    );
    const [remarks, setRemarks] = useState('');
    const [calculated, setCalculated] = useState<number | null>(null);

    const totalCharges = Object.values(values).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const tooMuch = totalCharges > invoice.paid_amount + 0.005;
    const calculate = () => setCalculated(Math.max(invoice.paid_amount - totalCharges, 0));
    // Changing a charge needs a new calculation
    const setCharge = (key: string, value: string) => {
        setValues({ ...values, [key]: value });
        setCalculated(null);
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => !busy && onClose()}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title d-flex align-items-center gap-2">
                            <span
                                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary"
                                style={{ width: 36, height: 36 }}
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                            </span>
                            Refund Invoice
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={busy}></button>
                    </div>
                    <div className="modal-body">
                        {/* The invoice */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Invoice No</label>
                                <input className="form-control" value={invoice.invoice_number} readOnly disabled />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Total Paid</label>
                                <input className="form-control" value={money(invoice.paid_amount)} readOnly disabled />
                            </div>
                        </div>

                        {/* The charges kept back */}
                        <h6 className="mb-2">Charges</h6>
                        <div className="row g-3 mb-3">
                            {Object.entries(charges).map(([key, name]) => (
                                <div key={key} className="col-md-6">
                                    <label className="form-label">{name}</label>
                                    <div className="input-group">
                                        <span className="input-group-text">{symbol}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="form-control"
                                            value={values[key]}
                                            onChange={(e) => setCharge(key, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paid − charges = refund */}
                        <div className="border rounded p-3 mb-3" style={{ background: 'var(--rgba-primary-1, #f5f3ff)' }}>
                            <div className="d-flex justify-content-between small mb-1">
                                <span className="text-muted">Total Paid</span><span>{money(invoice.paid_amount)}</span>
                            </div>
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-muted">Total Charges</span><span>- {money(totalCharges)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                <span className="fw-semibold">Amount To Refund</span>
                                <span className={`fw-bold fs-5 ${calculated === null ? 'text-muted' : 'text-primary'}`}>
                                    {calculated === null ? '—' : money(calculated)}
                                </span>
                            </div>
                            <div className="text-end mt-2">
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={calculate} disabled={tooMuch}>
                                    <i className="fa-solid fa-calculator me-2"></i>Calculate Final Refund Amount
                                </button>
                            </div>
                        </div>
                        {tooMuch && (
                            <div className="alert alert-danger py-2 small">
                                The charges ({money(totalCharges)}) are more than the amount paid ({money(invoice.paid_amount)}).
                            </div>
                        )}

                        <label className="form-label">Refund Mode</label>
                        <select className="form-select mb-3" value={mode} onChange={(e) => setMode(e.target.value)}>
                            {Object.entries(modes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>

                        <label className="form-label">Remarks</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Reason for the refund"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            maxLength={2000}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" onClick={onClose} disabled={busy}>Close</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={busy || calculated === null || tooMuch}
                            title={calculated === null ? 'Calculate the refund amount first' : undefined}
                            onClick={() => onRefund(Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Number(v) || 0])), remarks, mode)}
                        >
                            <i className="fa-solid fa-rotate-left me-2"></i>{busy ? 'Refunding…' : 'Refund'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Refunded Invoices: what was paid, what went back, and whether the client sees it. */
function RefundedInvoicesTable({ rows, canRefund, busy, onView, onDetails, onToggle }: {
    rows: InvoiceRow[];
    canRefund: boolean;
    busy: string | null;
    onView: (inv: InvoiceRow) => void;
    onDetails: (inv: InvoiceRow) => void;
    onToggle: (inv: InvoiceRow) => void;
}) {
    return (
        <div className="table-responsive">
            <style>{`
                .rf-table { font-size: 13px; }
                .rf-table th { font-weight: 700; color: #212529; white-space: nowrap; background: #f8f9fb; }
                .rf-table td { vertical-align: middle; color: #333; }
            `}</style>
            <table className="table table-bordered table-striped rf-table mb-0">
                <thead>
                    <tr>
                        <th>Invoice No.</th>
                        <th>Invoice Date</th>
                        <th>Receiver Name</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Total Refunded Amount</th>
                        <th>Refunded Status</th>
                        <th className="text-center">Refund Details</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                        <th className="text-center">Display Refund Info To Client</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((inv) => {
                        const r = inv.refund!;
                        return (
                            <tr key={inv.uid}>
                                <td className="text-nowrap">{inv.invoice_number}</td>
                                <td className="text-nowrap">{fmtDate(inv.invoice_date)}</td>
                                <td className="text-uppercase">{inv.receiver?.name ?? 'N/A'}</td>
                                <td className="text-nowrap">{inv.total}</td>
                                <td className="text-nowrap">{inv.currency_symbol}{r.paid_amount.toFixed(2)}</td>
                                <td className="text-nowrap">{inv.currency_symbol}{r.refund_amount.toFixed(2)}</td>
                                {/* The money went back to the client when the refund was made */}
                                <td className="text-success fw-bold">Paid</td>
                                <td className="text-center">
                                    <button type="button" className="btn btn-info btn-sm text-white" onClick={() => onDetails(inv)}>View Now</button>
                                </td>
                                <td className="text-danger fw-bold text-nowrap">{r.full ? 'Fully Refunded' : 'Partially Refunded'}</td>
                                <td className="text-center">
                                    <button type="button" className="btn btn-info btn-sm text-white" title="View invoice" onClick={() => onView(inv)}>
                                        <i className="fa fa-eye"></i>
                                    </button>
                                </td>
                                <td className="text-center">
                                    {canRefund ? (
                                        <button
                                            type="button"
                                            className={`btn btn-sm text-white ${r.show_to_client ? '' : 'btn-secondary'}`}
                                            style={r.show_to_client ? { background: '#7cc22b' } : undefined}
                                            onClick={() => onToggle(inv)}
                                            disabled={busy !== null}
                                            title={r.show_to_client ? 'The client sees the refund — click to hide it' : 'Hidden from the client — click to show it'}
                                        >
                                            {busy === `display-${inv.uid}` ? '…' : r.show_to_client ? 'UnDisplay' : 'Display'}
                                        </button>
                                    ) : (
                                        <span className="small text-muted">{r.show_to_client ? 'Shown' : 'Hidden'}</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/** Refund Details ("View Now"): the charges kept and the amount given back. */
function RefundDetailsModal({ invoice, onClose }: { invoice: InvoiceRow; onClose: () => void }) {
    const r = invoice.refund!;
    const money = (n: number) => `${invoice.currency_symbol}${n.toFixed(2)}`;
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: 36, height: 36 }}>
                                <i className="fa-solid fa-receipt"></i>
                            </span>
                            Refund Details — {invoice.invoice_number}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-sm mb-3">
                            <tbody>
                                <tr><td className="text-muted">Amount Paid</td><td className="text-end">{money(r.paid_amount)}</td></tr>
                                {r.charge_lines.map((c) => (
                                    <tr key={c.label}><td className="text-muted">Less: {c.label}</td><td className="text-end text-danger">- {money(c.amount)}</td></tr>
                                ))}
                                <tr className="fw-bold"><td>Refund Amount</td><td className="text-end text-primary">{money(r.refund_amount)}</td></tr>
                            </tbody>
                        </table>
                        <div className="row g-2 small">
                            <div className="col-6"><span className="text-muted">Refund Mode:</span> {r.mode_label}</div>
                            <div className="col-6"><span className="text-muted">Refunded On:</span> {fmtDateTime(r.at)}</div>
                            {r.by && <div className="col-6"><span className="text-muted">By:</span> {r.by}</div>}
                            <div className="col-6"><span className="text-muted">Status:</span> {r.full ? 'Fully Refunded' : 'Partially Refunded'}</div>
                            <div className="col-12"><span className="text-muted">Shown to the client:</span> {r.show_to_client ? 'Yes' : 'No'}</div>
                            {r.remarks && <div className="col-12"><span className="text-muted">Remarks:</span> {r.remarks}</div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

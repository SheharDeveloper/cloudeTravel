import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

interface BookingRow {
    uid: string;
    invoice_number: string;
    service: string;
    service_date: string | null;
    passengers: number;
    currency_symbol: string;
    total_amount: number;
    status: string;
    created_at: string;
    details: Record<string, any> | null;
    client: { uid: string; name: string; email: string } | null;
}

interface Props {
    bookings: {
        data: BookingRow[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { service: string; status: string; search: string };
}

const SERVICES = [
    { id: '', label: 'All services' },
    { id: 'visa', label: 'Visa' },
    { id: 'flight', label: 'Flight' },
    { id: 'hotel', label: 'Hotel' },
];

const STATUSES = [
    { id: '', label: 'All statuses' },
    { id: 'pending', label: 'Pending' },
    { id: 'not_pending', label: 'Not pending' },
    { id: 'signed', label: 'Signed' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
];

/**
 * "Pending Visa Applications" for ?service=visa&status=pending, "Visa
 * Applications" for the not-pending list, "Service Bookings" with no filters.
 */
const pageTitle = (filters: Props['filters']) => {
    const status = STATUSES.find((s) => s.id === filters.status && !['', 'not_pending'].includes(s.id))?.label;
    const service = SERVICES.find((s) => s.id === filters.service && s.id !== '')?.label;
    const base = service ? `${service} Applications` : 'Service Bookings';
    return status ? `${status} ${base}` : base;
};

export const statusBadge = (status: string) =>
    ({
        pending: 'bg-warning',
        signed: 'bg-success',
        confirmed: 'bg-success',
        cancelled: 'bg-danger',
        // Visa application statuses (Processing)
        submitted: 'bg-info',
        in_process: 'bg-primary',
        update_done: 'bg-secondary',
        approved: 'bg-success',
        rejected: 'bg-danger',
    } as Record<string, string>)[status] ?? 'bg-secondary';

/** "update_done" → "update done" (shown capitalised by the badge) */
export const statusLabel = (status: string) => status.replace(/_/g, ' ');

export const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/** What was booked, in one line: "Transit Visa · United Kingdom" for a visa. */
const summary = (booking: BookingRow) => {
    const d = booking.details ?? {};
    if (booking.service === 'visa') return [d.visa_name, d.visa_type, d.destination].filter(Boolean).join(' · ');
    return d.title ?? '—';
};

export default function ServiceBookingsIndex() {
    const { bookings, filters } = usePage().props as unknown as Props;
    const [search, setSearch] = useState(filters.search);

    // Empty filters are left out of the URL, so the sidebar links match it
    const apply = (changes: Partial<Props['filters']>) => {
        const next = { ...filters, search, ...changes };
        const query = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== ''));
        router.get('/admin/service-bookings', query, { preserveState: true, replace: true });
    };
    const title = pageTitle(filters);
    // The visa lists (Visa / Pending Applications) show fewer columns and the actions
    const visaList = filters.service === 'visa';

    return (
        <ProtectedRoute>
            <Head title={title} />

            <div className="page-title mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>{title}</h1></li>
                        <li className="breadcrumb-item"><a href="/dashboard"><i className="fa fa-home me-2"></i>Dashboard</a></li>
                        {title !== 'Service Bookings' && (
                            <li className="breadcrumb-item"><a href="/admin/service-bookings">Service Bookings</a></li>
                        )}
                        <li className="breadcrumb-item active">{title}</li>
                    </ol>
                </nav>
            </div>

            <div className="card" style={{ height: 'auto' }}>
                <div className="card-body">
                    <form
                        className="row g-2 mb-3"
                        onSubmit={(e) => { e.preventDefault(); apply({}); }}
                    >
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search invoice number, client or passenger..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" value={filters.service} onChange={(e) => apply({ service: e.target.value })}>
                                {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" value={filters.status} onChange={(e) => apply({ status: e.target.value })}>
                                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">Search</button>
                        </div>
                    </form>

                    {bookings.data.length === 0 ? (
                        <p className="text-muted text-center py-5 mb-0">
                            {filters.service || filters.status || filters.search
                                ? `No ${title.toLowerCase()} found.`
                                : 'No bookings yet. Book a visa from Services → Visa, and it will show up here.'}
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Invoice No.</th>
                                        {!visaList && <th>Service</th>}
                                        {!visaList && <th>Booked For</th>}
                                        {!visaList && <th>Client</th>}
                                        <th>{visaList ? 'Date of Entry' : 'Date'}</th>
                                        <th className="text-center">Applications</th>
                                        <th className="text-end">Total</th>
                                        {!visaList && <th>Status</th>}
                                        <th>Booked On</th>
                                        {visaList && <th className="text-end">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.data.map((b) => (
                                        <tr key={b.uid} style={{ cursor: 'pointer' }} onClick={() => router.visit(`/admin/service-bookings/${b.uid}`)}>
                                            <td className="fw-semibold">
                                                <a href={`/admin/service-bookings/${b.uid}`}>{b.invoice_number}</a>
                                            </td>
                                            {!visaList && <td className="text-capitalize">{b.service}</td>}
                                            {!visaList && <td>{summary(b)}</td>}
                                            {!visaList && <td>{b.client?.name ?? '—'}</td>}
                                            <td>{formatDate(b.service_date)}</td>
                                            <td className="text-center">{b.passengers}</td>
                                            <td className="text-end fw-semibold">{b.currency_symbol}{b.total_amount.toFixed(2)}</td>
                                            {!visaList && <td><span className={`badge ${statusBadge(b.status)} text-capitalize`}>{b.status}</span></td>}
                                            <td>{formatDate(b.created_at)}</td>
                                            {visaList && (
                                                <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                                                    {/* Edit: the Apply steps again; Continue: the booking's last screen */}
                                                    <a href={`/admin/service-bookings/${b.uid}/edit`} className="btn btn-sm btn-outline-primary me-2">
                                                        <i className="fa-regular fa-pen-to-square me-1"></i>Edit
                                                    </a>
                                                    <a href={`/admin/service-bookings/${b.uid}`} className="btn btn-sm btn-primary">
                                                        Continue<i className="fa-solid fa-arrow-right ms-1"></i>
                                                    </a>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {bookings.last_page > 1 && (
                        <nav>
                            <ul className="pagination justify-content-center mb-0">
                                {bookings.links.map((link, i) => (
                                    <li key={i} className={`page-item ${link.active ? 'active' : ''} ${link.url ? '' : 'disabled'}`}>
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

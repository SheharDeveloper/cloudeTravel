import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { formatDate, statusBadge } from './Index';

interface ApplicationRow {
    uid: string;
    application_number: string;
    name: string;
    relation: string;
    email: string | null;
    phone: string | null;
    visa_name: string | null;
    visa_type: string | null;
    origin: string | null;
    destination: string | null;
    amount: number;
    currency_symbol: string;
    booked_on: string | null;
    document_status: string;
    status: string;
    booking_uid: string;
    invoice_number: string;
}

interface Props {
    applications: {
        data: ApplicationRow[];
        from: number | null;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { service: string; status: string; search: string };
}

/**
 * "Visa Applications": every application (one per passenger) of the visa
 * bookings that are past pending, each with its own application number.
 * Laid out like the Clients list.
 */
export default function VisaApplications() {
    const { applications, filters } = usePage().props as unknown as Props;
    const [search, setSearch] = useState(filters.search);

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/service-bookings',
            { service: 'visa', status: 'not_pending', ...(search.trim() && { search: search.trim() }) },
            { preserveState: true, replace: true },
        );
    };

    return (
        <ProtectedRoute>
            <Head title="Visa Applications" />

            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Visa Management</h1></li>
                        <li className="breadcrumb-item active">Visa Applications</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card h-auto">
                        <div className="card-body">
                            <form className="row mb-3 d-flex justify-content-between align-items-center" onSubmit={submitSearch}>
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by application number, name, email, passport or invoice..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 text-end">
                                    <button type="submit" className="btn btn-primary">
                                        <i className="fa fa-search"></i> Search
                                    </button>
                                </div>
                            </form>

                            {applications.data.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Application Number</th>
                                                    <th>Client Details</th>
                                                    <th>Visa</th>
                                                    <th>Visa To</th>
                                                    <th>Total</th>
                                                    <th>Booking Date</th>
                                                    <th>Document Submit</th>
                                                    <th>Application Status</th>
                                                    <th>Update Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applications.data.map((a, index) => (
                                                    <tr key={a.uid}>
                                                        <td><small className="text-muted">{(applications.from ?? 1) + index}</small></td>
                                                        <td><small className="text-muted">{a.application_number}</small></td>
                                                        <td>
                                                            <strong>{a.name}</strong>
                                                            {a.email && <><br /><small>{a.email}</small></>}
                                                            {a.phone && <><br /><small>{a.phone}</small></>}
                                                        </td>
                                                        <td>
                                                            <small>{a.visa_name ?? 'N/A'}</small>
                                                            {a.visa_type && <><br /><small className="text-muted">{a.visa_type}</small></>}
                                                        </td>
                                                        <td><small>{a.origin ?? 'N/A'} To {a.destination ?? 'N/A'}</small></td>
                                                        <td><small>{a.currency_symbol}{a.amount.toFixed(2)}</small></td>
                                                        <td><small className="text-muted">{formatDate(a.booked_on)}</small></td>
                                                        <td><span className={`badge ${statusBadge(a.document_status)} text-capitalize`}>{a.document_status}</span></td>
                                                        <td><span className={`badge ${statusBadge(a.status)} text-capitalize`}>{a.status}</span></td>
                                                        <td>
                                                            <span className={`badge ${statusBadge(a.status)} text-capitalize`}>
                                                                <i className="fa fa-clock me-1"></i>{a.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <a
                                                                    href={`/admin/visa-applications/${a.uid}`}
                                                                    className="btn btn-sm btn-primary"
                                                                    title="View Application"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {applications.last_page > 1 && (
                                        <nav>
                                            <ul className="pagination justify-content-end">
                                                {applications.links.map((link, i) => (
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
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-passport" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                    <p className="text-muted mt-3">
                                        {filters.search
                                            ? 'No applications found'
                                            : 'No visa applications yet. A booking\'s applications show here once its invoice has been signed.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

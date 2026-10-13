import { useState } from 'react';
import { router } from '@inertiajs/react';
import ClientLayout from '@/layouts/client/ClientLayout';
import { formatDate, statusBadge, statusLabel } from '@/pages/Admin/ServiceBookings/Index';

interface ApplicationRow {
    uid: string;
    application_number: string;
    name: string;
    email: string | null;
    phone: string | null;
    visa_name: string | null;
    visa_type: string | null;
    origin: string | null;
    destination: string | null;
    amount: number;
    currency_symbol: string;
    booked_on: string | null;
    // "submitted" when every requested document is uploaded, otherwise "pending"
    document_status: 'submitted' | 'pending';
    documents_requested: number;
    documents_uploaded: number;
    status: string;
    // The latest status comment (the reason, when rejected), and when the status last changed
    status_comment: string | null;
    status_updated_at: string | null;
}

interface Props {
    applications: {
        data: ApplicationRow[];
        from: number | null;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search: string };
}

/**
 * My Bookings: the client's visa applications (one per traveller), laid out
 * like the agency's Visa Applications. View opens the application to fill
 * the form and upload the requested documents.
 */
export default function ClientBookings({ applications, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/client/bookings', search.trim() ? { search: search.trim() } : {}, { preserveState: true, replace: true });
    };

    return (
        <ClientLayout title="My Bookings">
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
                                                        <td>
                                                            {a.document_status === 'submitted' ? (
                                                                <span className="badge bg-success"><i className="fa fa-check-circle me-1"></i>Submitted</span>
                                                            ) : (
                                                                <span className="badge bg-warning text-dark"><i className="fa fa-clock me-1"></i>Pending</span>
                                                            )}
                                                            {/* How many of the requested documents are uploaded */}
                                                            {a.documents_requested > 0 && (
                                                                <small className="d-block text-muted mt-1">{a.documents_uploaded}/{a.documents_requested} uploaded</small>
                                                            )}
                                                        </td>
                                                        <td style={{ maxWidth: 220 }}>
                                                            <span className={`badge ${statusBadge(a.status)} text-capitalize`}>
                                                                <i className="fa fa-clock me-1"></i>{statusLabel(a.status)}
                                                            </span>
                                                            {/* The latest comment; for a rejection, the reason */}
                                                            {a.status_comment && (
                                                                <small
                                                                    className={`d-block mt-1 ${a.status === 'rejected' ? 'text-danger' : 'text-muted'}`}
                                                                    title={a.status_comment}
                                                                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                                                >
                                                                    <i className="fa fa-comment-dots me-1"></i>
                                                                    {a.status === 'rejected' && 'Reason: '}{a.status_comment}
                                                                </small>
                                                            )}
                                                            {a.status_updated_at && <small className="d-block text-muted">{formatDate(a.status_updated_at)}</small>}
                                                        </td>
                                                        <td>
                                                            <a href={`/client/applications/${a.uid}`} className="btn btn-sm btn-primary" title="View Application">
                                                                <i className="fa fa-eye"></i>
                                                            </a>
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
                                            : 'No visa applications yet. Your applications show here once your invoice has been signed.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}

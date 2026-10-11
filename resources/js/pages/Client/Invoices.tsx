import ClientLayout from '@/layouts/client/ClientLayout';
import { formatDate } from '@/pages/Admin/ServiceBookings/Index';

interface Invoice {
    uid: string;
    invoice_number: string;
    visa_name: string | null;
    date: string | null;
    currency_symbol: string;
    total_amount: number;
    signed: boolean;
    signed_at: string | null;
    // Waiting for the client's signature: the signing page
    sign_url: string | null;
}

/** Invoices: one per booking, to view or print, and to sign if still waiting. */
export default function ClientInvoices({ invoices }: { invoices: Invoice[] }) {
    return (
        <ClientLayout title="Invoices">
            <div className="card h-auto">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Invoices</h6>
                    <span className="badge bg-primary">{invoices.length}</span>
                </div>
                <div className="card-body p-0">
                    {invoices.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fa fa-file-invoice" style={{ fontSize: 40, color: '#ccc' }}></i>
                            <p className="mt-3 mb-0">You have no invoices yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Invoice No.</th>
                                        <th>For</th>
                                        <th>Date</th>
                                        <th className="text-end">Amount</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv) => (
                                        <tr key={inv.uid}>
                                            <td><strong>{inv.invoice_number}</strong></td>
                                            <td>{inv.visa_name ?? '—'}</td>
                                            <td>{formatDate(inv.date)}</td>
                                            <td className="text-end fw-semibold">{inv.currency_symbol}{Number(inv.total_amount).toFixed(2)}</td>
                                            <td>
                                                {inv.signed ? (
                                                    <span className="badge bg-success"><i className="fa fa-check-circle me-1"></i>Signed</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark"><i className="fa fa-clock me-1"></i>Not signed</span>
                                                )}
                                                {inv.signed_at && <small className="d-block text-muted">{formatDate(inv.signed_at)}</small>}
                                            </td>
                                            <td className="text-end text-nowrap">
                                                <a className="btn btn-sm btn-outline-primary" href={`/client/invoices/${inv.uid}`} target="_blank" rel="noreferrer">
                                                    <i className="fa fa-eye me-1"></i>View
                                                </a>
                                                {inv.sign_url && (
                                                    <a className="btn btn-sm btn-primary ms-1" href={inv.sign_url} target="_blank" rel="noreferrer">
                                                        <i className="fa fa-signature me-1"></i>Sign
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}

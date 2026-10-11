import ClientLayout from '@/layouts/client/ClientLayout';
import { formatDate, statusBadge, statusLabel } from '@/pages/Admin/ServiceBookings/Index';

interface Booking {
    uid: string;
    invoice_number: string;
    service: string;
    visa_name: string | null;
    visa_type: string | null;
    origin: string | null;
    destination: string | null;
    service_date: string | null;
    passengers: number;
    currency_symbol: string;
    total_amount: number;
    status: string;
    booked_on: string | null;
    travellers: { name: string; application_number: string; status: string }[];
}

/** My Bookings: the client's bookings with this agency, newest first. */
export default function ClientBookings({ bookings }: { bookings: Booking[] }) {
    return (
        <ClientLayout title="My Bookings">
            <div className="card h-auto">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Bookings</h6>
                    <span className="badge bg-primary">{bookings.length}</span>
                </div>
                <div className="card-body p-0">
                    {bookings.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fa fa-suitcase-rolling" style={{ fontSize: 40, color: '#ccc' }}></i>
                            <p className="mt-3 mb-0">You have no bookings yet.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Invoice</th>
                                        <th>Booking</th>
                                        <th>Travel Date</th>
                                        <th>Travellers</th>
                                        <th className="text-end">Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b.uid}>
                                            <td>
                                                <strong>{b.invoice_number}</strong>
                                                <small className="d-block text-muted">Booked {formatDate(b.booked_on)}</small>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-capitalize">{b.visa_name ?? b.service}</div>
                                                {b.visa_type && <small className="d-block text-muted">{b.visa_type}</small>}
                                                {(b.origin || b.destination) && <small className="d-block text-muted">{b.origin ?? '—'} → {b.destination ?? '—'}</small>}
                                            </td>
                                            <td>{formatDate(b.service_date)}</td>
                                            <td>
                                                {b.travellers.length === 0 ? `${b.passengers}` : b.travellers.map((t) => (
                                                    <div key={t.application_number} className="d-flex align-items-center gap-2 mb-1">
                                                        <span>{t.name}</span>
                                                        <span className={`badge ${statusBadge(t.status)} text-capitalize`} style={{ fontSize: 10 }}>{statusLabel(t.status)}</span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-end fw-semibold">{b.currency_symbol}{Number(b.total_amount).toFixed(2)}</td>
                                            <td><span className={`badge ${statusBadge(b.status)} text-capitalize`}>{b.status === 'signed' ? 'Invoice Signed' : statusLabel(b.status)}</span></td>
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

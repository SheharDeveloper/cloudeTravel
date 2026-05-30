interface Props {
    agency: any;
}

export default function AgencyBooking({ agency }: Props) {
    const bookings = [
        { id: 1, bookingId: 'BK001', type: 'Flight', status: 'Confirmed', date: '2024-01-15', amount: '$2,500' },
        { id: 2, bookingId: 'BK002', type: 'Hotel', status: 'Pending', date: '2024-01-16', amount: '$1,800' },
        { id: 3, bookingId: 'BK003', type: 'Flight', status: 'Completed', date: '2024-01-10', amount: '$3,200' },
        { id: 4, bookingId: 'BK004', type: 'Tour', status: 'Cancelled', date: '2024-01-12', amount: '$950' },
    ];

    return (
        <div className="row g-4 px-4">
            <div className="col-lg-12">
                <h5 className="mb-3">Bookings</h5>

                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th className="text-end pe-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.bookingId}</td>
                                            <td>{booking.type}</td>
                                            <td>
                                                <span className={`badge badge-sm ${
                                                    booking.status === 'Confirmed' ? 'badge-success' :
                                                    booking.status === 'Pending' ? 'badge-warning' :
                                                    booking.status === 'Cancelled' ? 'badge-danger' :
                                                    'badge-info'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>{booking.date}</td>
                                            <td className="fw-semibold">{booking.amount}</td>
                                            <td className="text-end pe-3">
                                                <button className="btn btn-primary btn-xs">
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

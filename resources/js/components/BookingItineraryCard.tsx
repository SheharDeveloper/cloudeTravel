interface BookingItineraryCardProps {
    booking: any;
}

export default function BookingItineraryCard({ booking }: BookingItineraryCardProps) {
    const formatDate = (date: string | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const calculateNights = (checkIn: string | undefined, checkOut: string | undefined) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="card" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {/* Hotel Image & Rating */}
            {booking.hotel_data?.image && (
                <div style={{ position: 'relative', height: '200px', background: '#f0f0f0' }}>
                    <img
                        src={booking.hotel_data.image}
                        alt="Hotel"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {booking.hotel_data?.name && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            padding: '12px 16px',
                        }}>
                            <h6 className="mb-1">{booking.hotel_data.name}</h6>
                            {booking.hotel_data?.rating && (
                                <small>{'★'.repeat(Math.floor(booking.hotel_data.rating))} ({booking.hotel_data.rating})</small>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="card-body">
                {/* Accommodation Section */}
                {(booking.check_in_date || booking.hotel_city) && (
                    <div className="mb-4 pb-3 border-bottom">
                        <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '12px', color: '#666' }}>
                            <i className="fa fa-bed me-2"></i> Accommodation
                        </h6>
                        <div className="row">
                            <div className="col-4">
                                <small className="text-muted d-block">CHECK-IN</small>
                                <strong>{formatDate(booking.check_in_date)}</strong>
                            </div>
                            <div className="col-4">
                                <small className="text-muted d-block">CHECK-OUT</small>
                                <strong>{formatDate(booking.check_out_date)}</strong>
                            </div>
                            <div className="col-4">
                                <small className="text-muted d-block">NIGHTS</small>
                                <strong>{calculateNights(booking.check_in_date, booking.check_out_date)}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flights Section */}
                {(booking.from_city || booking.to_city) && (
                    <div className="mb-4 pb-3 border-bottom">
                        <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '12px', color: '#666' }}>
                            <i className="fa fa-plane me-2"></i> Flights
                        </h6>

                        {/* Outbound */}
                        <div className="mb-3">
                            <small className="text-muted d-block mb-2">OUTBOUND JOURNEY</small>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{booking.from_city?.substring(0, 3).toUpperCase() || 'N/A'}</div>
                                    <small className="text-muted">{formatDate(booking.travel_date)}</small>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <i className="fa fa-arrow-right" style={{ fontSize: '20px', color: '#0066cc' }}></i>
                                </div>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{booking.to_city?.substring(0, 3).toUpperCase() || 'N/A'}</div>
                                    <small className="text-muted">{booking.travel_class || 'Economy'}</small>
                                </div>
                            </div>
                        </div>

                        {/* Return Flight */}
                        {booking.trip_type === 'roundtrip' && booking.return_date && (
                            <div>
                                <small className="text-muted d-block mb-2">INBOUND JOURNEY</small>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{booking.to_city?.substring(0, 3).toUpperCase() || 'N/A'}</div>
                                        <small className="text-muted">{formatDate(booking.return_date)}</small>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <i className="fa fa-arrow-right" style={{ fontSize: '20px', color: '#0066cc' }}></i>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{booking.from_city?.substring(0, 3).toUpperCase() || 'N/A'}</div>
                                        <small className="text-muted">{booking.travel_class || 'Economy'}</small>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Transfers Section */}
                {booking.airport_transport_data && (
                    <div className="mb-4 pb-3 border-bottom">
                        <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '12px', color: '#666' }}>
                            <i className="fa fa-car me-2"></i> Transfers
                        </h6>
                        <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <strong>Airport ↔ Hotel</strong>
                                    <small className="text-muted d-block">Private Sedan</small>
                                </div>
                                {booking.airport_transport_data?.price && (
                                    <strong style={{ color: '#0066cc', fontSize: '16px' }}>
                                        £{booking.airport_transport_data.price}
                                    </strong>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Price Section */}
                <div className="mb-3">
                    <div style={{
                        background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <small>TOTAL PRICE</small>
                            <div style={{ fontSize: '14px', opacity: 0.9 }}>per person</div>
                        </div>
                        <strong style={{ fontSize: '24px' }}>
                            £{booking.total_price || booking.package_data?.price || '0.00'}
                        </strong>
                    </div>
                </div>

                {/* Additional Information */}
                {booking.notes && (
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '6px' }}>
                        <h6 className="fw-bold mb-2" style={{ fontSize: '12px' }}>ADDITIONAL INFORMATION</h6>
                        <small className="text-muted">{booking.notes}</small>
                    </div>
                )}
            </div>
        </div>
    );
}

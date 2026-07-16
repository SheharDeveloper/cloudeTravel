interface Booking {
    id: number;
    uid: string;
    type: string;
    first_name: string;
    last_name?: string;
    email: string;
    phone: string;
    country_code: string;
    status: string;
    total_members?: number;
    travel_date?: string;
    created_at: string;
    updated_at: string;
    flight_data?: any;
    hotel_data?: any;
    visa_data?: any;
    package_data?: any;
    airport_transport_data?: any;
    notes?: string;
}

interface BookingDetailsProps {
    booking: Booking;
    onCancelClick?: () => void;
}

export default function BookingDetails({ booking, onCancelClick }: BookingDetailsProps) {
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'confirmed': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            case 'completed': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const canCancel = booking.status !== 'cancelled' && booking.status !== 'completed';

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Booking Details</h5>
                <span className={`badge ${getStatusBadgeColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </div>

            <div className="card-body">
                {/* Personal Information */}
                <div className="row mb-4">
                    <div className="col-12">
                        <h6 className="text-muted text-uppercase mb-3">Personal Information</h6>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Name</label>
                        <p className="text-muted">{booking.first_name} {booking.last_name || ''}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <p className="text-muted">{booking.email}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <p className="text-muted">{booking.country_code} {booking.phone}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Booking Type</label>
                        <p className="text-muted">{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}</p>
                    </div>
                </div>

                {/* Booking Information */}
                <div className="row mb-4">
                    <div className="col-12">
                        <h6 className="text-muted text-uppercase mb-3">Booking Information</h6>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Booking ID</label>
                        <p className="text-muted">{booking.uid}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Members</label>
                        <p className="text-muted">{booking.total_members || 1}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Booked Date</label>
                        <p className="text-muted">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Travel Date</label>
                        <p className="text-muted">
                            {booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Service Specific Details */}
                {booking.flight_data && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <h6 className="text-muted text-uppercase mb-3">✈️ Flight Details</h6>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">From</label>
                            <p className="text-muted">{booking.flight_data.fromCity || booking.flight_data.from || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">To</label>
                            <p className="text-muted">{booking.flight_data.toCity || booking.flight_data.to || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Departure</label>
                            <p className="text-muted">{booking.flight_data.departureDate || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Return</label>
                            <p className="text-muted">{booking.flight_data.returnDate || 'N/A'}</p>
                        </div>
                    </div>
                )}

                {booking.hotel_data && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <h6 className="text-muted text-uppercase mb-3">🏨 Hotel Details</h6>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Country</label>
                            <p className="text-muted">{booking.hotel_data.hotelCountry || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">City</label>
                            <p className="text-muted">{booking.hotel_data.hotelCity || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Check-in</label>
                            <p className="text-muted">{booking.hotel_data.checkInDate || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Check-out</label>
                            <p className="text-muted">{booking.hotel_data.checkOutDate || 'N/A'}</p>
                        </div>
                    </div>
                )}

                {booking.visa_data && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <h6 className="text-muted text-uppercase mb-3">🛂 Visa Details</h6>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Destination</label>
                            <p className="text-muted">{booking.visa_data.destinationCountry || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Visa Type</label>
                            <p className="text-muted">{booking.visa_data.visaType || 'N/A'}</p>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {booking.notes && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <h6 className="text-muted text-uppercase mb-3">Notes</h6>
                            <p className="text-muted">{booking.notes}</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {canCancel && (
                    <div className="row">
                        <div className="col-12">
                            <button
                                className="btn btn-danger"
                                onClick={onCancelClick}
                            >
                                <i className="fa fa-times me-2"></i>Request Cancellation
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

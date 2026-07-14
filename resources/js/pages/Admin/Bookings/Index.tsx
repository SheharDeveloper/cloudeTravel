import { router } from '@inertiajs/react';
import { useBookings } from '@/hooks/useBookings';

export default function BookingsIndex() {
    const { bookings, currentPage, lastPage, filters, loading, handleFilterChange, handlePageChange, handleReset } = useBookings();

    const getServiceBadgeColor = (type: string | undefined) => {
        switch (type) {
            case 'flight':
                return 'bg-primary';
            case 'hotel':
                return 'bg-success';
            case 'visa':
                return 'bg-warning';
            case 'package':
                return 'bg-info';
            case 'transport':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-warning';
            case 'confirmed':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const getServiceDetails = (booking: any) => {
        if (booking.type === 'flight') {
            const flightData = booking.flight_data || {};
            return `${flightData.from || flightData.fromCity || 'N/A'} → ${flightData.to || flightData.toCity || 'N/A'}`;
        } else if (booking.type === 'hotel') {
            const hotelData = booking.hotel_data || {};
            return `${hotelData.hotelCountry || 'N/A'} - ${hotelData.hotelCity || 'N/A'}`;
        } else if (booking.type === 'visa') {
            const visaData = booking.visa_data || {};
            return visaData.destinationCountry || 'N/A';
        } else if (booking.type === 'package') {
            const packageData = booking.package_data || {};
            return packageData.selectedCountry || 'N/A';
        } else if (booking.type === 'transport') {
            const transportData = booking.airport_transport_data || {};
            return `${transportData.pickupAirport || 'N/A'} → ${transportData.destinationLocation || 'N/A'}`;
        }
        return 'N/A';
    };

    const getTravelDate = (booking: any) => {
        if (booking.type === 'flight') {
            const flightData = booking.flight_data || {};
            return flightData.departureDate || booking.travel_date;
        } else if (booking.type === 'hotel') {
            const hotelData = booking.hotel_data || {};
            return hotelData.checkInDate || booking.check_in_date;
        } else if (booking.type === 'visa') {
            const visaData = booking.visa_data || {};
            return visaData.travelDate || booking.travel_date;
        } else if (booking.type === 'package') {
            const packageData = booking.package_data || {};
            return packageData.checkInDate || booking.check_in_date;
        } else if (booking.type === 'transport') {
            const transportData = booking.airport_transport_data || {};
            return transportData.pickupDate || booking.travel_date;
        }
        return booking.travel_date;
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Bookings</h1></li>
                        <li className="breadcrumb-item active">All Bookings</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            {/* Filter Section */}
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name or email..."
                                        value={filters.search || ''}
                                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={filters.service || ''}
                                        onChange={(e) => handleFilterChange({ service: e.target.value })}
                                    >
                                        <option value="">All Services</option>
                                        <option value="flight">Flight</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="visa">Visa</option>
                                        <option value="package">Package</option>
                                        <option value="transport">Airport Transfer</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        className="form-control"
                                        value={filters.status || ''}
                                        onChange={(e) => handleFilterChange({ status: e.target.value })}
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-outline-secondary w-100"
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : bookings.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Service</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Details</th>
                                                    <th>Members</th>
                                                    <th>Travel Date</th>
                                                    <th>Status</th>
                                                    <th>Submitted</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.map((booking) => (
                                                    <tr key={booking.id}>
                                                        <td>
                                                            <strong>#{booking.id}</strong>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getServiceBadgeColor(booking.type || booking.service || 'unknown')}`}>
                                                                {(booking.type || booking.service || 'unknown').charAt(0).toUpperCase() + (booking.type || booking.service || 'unknown').slice(1)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <strong>{booking.first_name || booking.name || 'N/A'}</strong>
                                                        </td>
                                                        <td>
                                                            <small>{booking.email}</small>
                                                            {booking.phone && (
                                                                <div>
                                                                    <small className="text-muted">{booking.phone}</small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <small>{getServiceDetails(booking)}</small>
                                                        </td>
                                                        <td>
                                                            <small>{booking.total_members}</small>
                                                        </td>
                                                        <td>
                                                            <small>
                                                                {getTravelDate(booking) ? formatDate(getTravelDate(booking)) : 'N/A'}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadgeColor(booking.status)}`}>
                                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {formatDate(booking.created_at)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                title="View Details"
                                                                onClick={() => router.visit(`/admin/bookings/${booking.uid}`)}
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {lastPage > 1 && (
                                        <nav aria-label="Page navigation" className="mt-4">
                                            <ul className="pagination justify-content-center">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </button>
                                                </li>

                                                {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
                                                    <li
                                                        key={page}
                                                        className={`page-item ${page === currentPage ? 'active' : ''}`}
                                                    >
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === lastPage}
                                                    >
                                                        Next
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    <i className="fa fa-info-circle"></i> No bookings found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

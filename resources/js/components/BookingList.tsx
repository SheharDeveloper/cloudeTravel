import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Booking {
    id: number;
    uid: string;
    type: string;
    first_name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
    total_members?: number;
    travel_date?: string;
    flight_data?: any;
    hotel_data?: any;
    visa_data?: any;
}

interface BookingListProps {
    onSelectBooking?: (booking: Booking) => void;
}

export default function BookingList({ onSelectBooking }: BookingListProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
    });

    useEffect(() => {
        fetchBookings();
    }, [filters]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let url = '/api/bookings?per_page=10';
            if (filters.status) url += `&status=${filters.status}`;
            if (filters.search) url += `&search=${filters.search}`;

            const response = await apiFetch(url, { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setBookings(data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-warning';
            case 'confirmed': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            case 'completed': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    const getServiceIcon = (type: string) => {
        const icons: Record<string, string> = {
            flight: '✈️',
            hotel: '🏨',
            visa: '🛂',
            package: '📦',
            transport: '🚗',
        };
        return icons[type] || '📋';
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">My Bookings</h5>
            </div>
            <div className="card-body">
                {/* Filters */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or email..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-control"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Type</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>
                                            <span>{getServiceIcon(booking.type)} {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}</span>
                                        </td>
                                        <td>{booking.first_name}</td>
                                        <td>{booking.email}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadgeColor(booking.status)}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => onSelectBooking?.(booking)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        No bookings found
                    </div>
                )}
            </div>
        </div>
    );
}

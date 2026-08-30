import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import BookingDetails from '@/components/BookingDetails';
import CancelRequestModal from '@/components/CancelRequestModal';

interface Booking {
    id: number;
    uid: string;
    type: string;
    first_name: string;
    email: string;
    phone: string;
    country_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

interface Stats {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
}

export default function Dashboard() {
    const { auth, stats, bookings } = usePage().props as unknown as {
        auth: { user: any };
        stats: Stats;
        bookings: Booking[];
    };
    const user = auth?.user;
    const userName = user?.name || user?.email || 'Admin';

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleOpenCancelModal = () => {
        if (selectedBooking) {
            setShowCancelModal(true);
        }
    };

    const handleCancelSuccess = () => {
        setSelectedBooking(null);
        router.reload({ only: ['stats', 'bookings'] });
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
        <MasterLayout title="Dashboard">
            {/* Page Title */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Dashboard</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard">
                                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Home
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                {/* Congratulations */}
                <div className="col-xl-12">
                    <div className="card overflow-hidden">
                        <div className="card-body">
                            <div>
                                <h4 className="fs-16 mb-0">Welcome back, <strong>{userName}!</strong></h4>
                                <span>Here's your booking management dashboard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase mb-2">Total Bookings</h6>
                            <h3 className="m-0">{stats?.total ?? 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase mb-2">Confirmed</h6>
                            <h3 className="m-0">{stats?.confirmed ?? 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase mb-2">Pending</h6>
                            <h3 className="m-0">{stats?.pending ?? 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase mb-2">Cancelled</h6>
                            <h3 className="m-0">{stats?.cancelled ?? 0}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Bookings Section */}
            <div className="row mt-4">
                {/* Bookings List - Left Side */}
                <div className="col-lg-7">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Recent Bookings</h5>
                        </div>
                        <div className="card-body">
                            {bookings && bookings.length > 0 ? (
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
                                                            onClick={() => setSelectedBooking(booking)}
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
                </div>

                {/* Booking Details - Right Side */}
                <div className="col-lg-5">
                    {selectedBooking ? (
                        <>
                            <BookingDetails
                                booking={selectedBooking}
                                onCancelClick={handleOpenCancelModal}
                            />

                            {/* Quick Actions */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h6 className="card-title mb-0">Quick Actions</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => window.print()}
                                                >
                                                    <i className="fa fa-print me-2"></i>Print Booking
                                                </button>
                                                <button
                                                    className="btn btn-info"
                                                    onClick={() => {
                                                        const subject = `Booking ${selectedBooking.uid} - ${selectedBooking.type}`;
                                                        const body = `I have a query regarding my booking.\n\nBooking ID: ${selectedBooking.uid}\nType: ${selectedBooking.type}\n\nPlease help me with...`;
                                                        window.location.href = `mailto:support@cloudtravel.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                                    }}
                                                >
                                                    <i className="fa fa-envelope me-2"></i>Contact Support
                                                </button>
                                                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={handleOpenCancelModal}
                                                    >
                                                        <i className="fa fa-times me-2"></i>Cancel Booking
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <i className="fa fa-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                <h6 className="mt-3 text-muted">Select a booking to view details</h6>
                                <p className="text-muted small">Click on any booking from the list to see more information</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Request Modal */}
            <CancelRequestModal
                booking={selectedBooking}
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onCancelSuccess={handleCancelSuccess}
            />
        </MasterLayout>
    );
}

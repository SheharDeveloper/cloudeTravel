import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import BookingList from '@/components/BookingList';
import BookingDetails from '@/components/BookingDetails';
import CancelRequestModal from '@/components/CancelRequestModal';

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
    [key: string]: any;
}

export default function BookingDashboard() {
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSelectBooking = (booking: Booking) => {
        setSelectedBooking(booking);
    };

    const handleOpenCancelModal = () => {
        if (selectedBooking) {
            setShowCancelModal(true);
        }
    };

    const handleCancelSuccess = () => {
        setRefreshKey(prev => prev + 1);
        setSelectedBooking(null);
    };

    return (
        <MasterLayout title="Booking Dashboard">
            <Head title="Booking Dashboard" />

            {/* Page Title */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Booking Dashboard</h1></li>
                        <li className="breadcrumb-item active">Manage Your Bookings</li>
                    </ol>
                </nav>
            </div>

            {/* Main Content */}
            <div className="row">
                {/* Bookings List - Left Side */}
                <div className="col-lg-7">
                    <BookingList
                        key={refreshKey}
                        onSelectBooking={handleSelectBooking}
                    />
                </div>

                {/* Booking Details - Right Side */}
                <div className="col-lg-5">
                    {selectedBooking ? (
                        <>
                            <BookingDetails
                                booking={selectedBooking}
                                onCancelClick={handleOpenCancelModal}
                            />

                            {/* Action Cards */}
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

            {/* Statistics Cards - Full Width */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase">Total Bookings</h6>
                            <h3 className="m-0 mt-2">—</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase">Confirmed</h6>
                            <h3 className="m-0 mt-2">—</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase">Pending</h6>
                            <h3 className="m-0 mt-2">—</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-danger text-white">
                        <div className="card-body">
                            <h6 className="text-uppercase">Cancelled</h6>
                            <h3 className="m-0 mt-2">—</h3>
                        </div>
                    </div>
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

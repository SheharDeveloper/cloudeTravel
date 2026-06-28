import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { usePage } from '@inertiajs/react';

interface Booking {
    id: number;
    uid: string;
    service: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    total_members: number;
    travel_date?: string;
    from_city?: string;
    to_city?: string;
    trip_type?: string;
    return_date?: string;
    travel_class?: string;
    destination?: string;
    passport_country?: string;
    visa_type?: string;
    hotel_city?: string;
    check_in_date?: string;
    check_out_date?: string;
    rooms?: number;
    guests?: number;
    notes?: string;
    status: string;
    created_at: string;
}

interface BookingNote {
    id: number;
    booking_id: number;
    note: string;
    user_name?: string;
    user_email?: string;
    created_at: string;
    updated_at: string;
}

export default function BookingShow() {
    const page = usePage();
    const bookingUid = (page.url.match(/\/admin\/bookings\/([a-f0-9-]+)/) || [])[1];
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState<BookingNote[]>([]);
    const [newNoteText, setNewNoteText] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [addingNote, setAddingNote] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);

    useEffect(() => {
        if (bookingUid) {
            fetchBooking();
            fetchNotes();
        }
    }, [bookingUid]);

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/bookings/${bookingUid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBooking(data.booking);
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch(`/api/bookings/${bookingUid}/notes`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotes(data.notes || []);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleAddNote = async () => {
        if (!newNoteText.trim() || !booking) return;

        setAddingNote(true);
        try {
            const response = await fetch(`/api/bookings/${booking.id}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    note: newNoteText,
                    user_name: 'Admin',
                    user_email: 'admin@example.com',
                }),
            });

            if (response.ok) {
                setNewNoteText('');
                setShowNoteModal(false);
                fetchNotes();
            }
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setAddingNote(false);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        if (!booking) return;

        try {
            const response = await fetch(`/api/bookings/${booking.id}/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                fetchNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const getServiceBadgeColor = (service: string) => {
        switch (service) {
            case 'flight':
                return 'bg-primary';
            case 'hotel':
                return 'bg-success';
            case 'visa':
                return 'bg-warning';
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

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!booking) {
        return (
            <ProtectedRoute>
                <div className="alert alert-danger">Booking not found</div>
            </ProtectedRoute>
        );
    }

    const getFieldLabel = (key: string) => {
        const labels: Record<string, string> = {
            from_city: 'From City',
            to_city: 'To City',
            trip_type: 'Trip Type',
            travel_date: 'Travel Date',
            return_date: 'Return Date',
            travel_class: 'Travel Class',
            hotel_city: 'Hotel City',
            check_in_date: 'Check-in Date',
            check_out_date: 'Check-out Date',
            destination: 'Destination',
            passport_country: 'Passport Country',
            total_members: 'Total Members',
            rooms: 'Rooms',
            guests: 'Guests',
        };
        return labels[key] || key.replace(/_/g, ' ').toUpperCase();
    };

    return (
        <ProtectedRoute>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Booking Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/bookings">Bookings</a></li>
                        <li className="breadcrumb-item active">#{booking.id}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h3 className="fw-semibold mb-1">{booking.name}</h3>
                            <ul className="d-flex flex-wrap align-items-center">
                                <li className="me-3 d-inline-flex align-items-center">
                                    <i className="las la-envelope me-1"></i>
                                    <a href={`mailto:${booking.email}`}>{booking.email}</a>
                                </li>
                                {booking.phone && (
                                    <li className="me-3 d-inline-flex align-items-center">
                                        <i className="las la-phone me-1"></i>
                                        {booking.phone}
                                    </li>
                                )}
                                <li className="me-3 d-inline-flex align-items-center">
                                    <span className={`badge ${getServiceBadgeColor(booking.service)} me-2`}>
                                        {booking.service.charAt(0).toUpperCase() + booking.service.slice(1)}
                                    </span>
                                    <span className={`badge ${getStatusBadgeColor(booking.status)}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="text-end">
                            <small className="text-muted d-block">Submitted on</small>
                            <strong>{formatDate(booking.created_at)}</strong>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="card-footer py-0 d-flex flex-wrap justify-content-between align-items-center">
                    <ul className="nav nav-underline gap-3 nav-scroll px-3 px-sm-0" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                                role="tab"
                            >
                                Overview
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'notes' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notes')}
                                role="tab"
                            >
                                Notes
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'form' ? 'active' : ''}`}
                                onClick={() => setActiveTab('form')}
                                role="tab"
                            >
                                Form
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container-fluid">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">
                                        {booking.service === 'flight' && '✈️ Flight Details'}
                                        {booking.service === 'hotel' && '🏨 Hotel Details'}
                                        {booking.service === 'visa' && '🛂 Visa Details'}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {booking.service === 'flight' && (
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">From</label>
                                                <p className="fw-semibold">{booking.from_city || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">To</label>
                                                <p className="fw-semibold">{booking.to_city || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Departure Date</label>
                                                <p className="fw-semibold">{formatDate(booking.travel_date)}</p>
                                            </div>
                                            {booking.trip_type === 'roundtrip' && (
                                                <div className="col-md-6 mb-3">
                                                    <label className="text-muted small">Return Date</label>
                                                    <p className="fw-semibold">{formatDate(booking.return_date)}</p>
                                                </div>
                                            )}
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Trip Type</label>
                                                <p className="fw-semibold">{booking.trip_type ? booking.trip_type.charAt(0).toUpperCase() + booking.trip_type.slice(1) : 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Travel Class</label>
                                                <p className="fw-semibold">{booking.travel_class || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Travelers</label>
                                                <p className="fw-semibold">{booking.total_members}</p>
                                            </div>
                                        </div>
                                    )}

                                    {booking.service === 'hotel' && (
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">City</label>
                                                <p className="fw-semibold">{booking.hotel_city || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Check-in Date</label>
                                                <p className="fw-semibold">{formatDate(booking.check_in_date)}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Check-out Date</label>
                                                <p className="fw-semibold">{formatDate(booking.check_out_date)}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Country</label>
                                                <p className="fw-semibold">{booking.country || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Rooms</label>
                                                <p className="fw-semibold">{booking.rooms || 1}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Guests</label>
                                                <p className="fw-semibold">{booking.guests || booking.total_members}</p>
                                            </div>
                                        </div>
                                    )}

                                    {booking.service === 'visa' && (
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Destination</label>
                                                <p className="fw-semibold">{booking.destination || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Passport Country</label>
                                                <p className="fw-semibold">{booking.passport_country || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Visa Type</label>
                                                <p className="fw-semibold">{booking.visa_type || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Number of Travelers</label>
                                                <p className="fw-semibold">{booking.total_members}</p>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="text-muted small">Travel Date</label>
                                                <p className="fw-semibold">{formatDate(booking.travel_date)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div className="row">
                        <div className="col-lg-12">
                            {/* Notes Table */}
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">📝 Notes History ({notes.length})</h5>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setShowNoteModal(true)}
                                    >
                                        <i className="fa fa-plus me-1"></i> Add Note
                                    </button>
                                </div>
                                <div className="card-body">
                                    {notes.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>User</th>
                                                        <th>Note</th>
                                                        <th>Date</th>
                                                        <th style={{ width: '80px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {notes.map((note) => (
                                                        <tr key={note.id}>
                                                            <td>
                                                                <div>
                                                                    <strong>{note.user_name || 'Admin'}</strong>
                                                                    {note.user_email && (
                                                                        <div><small className="text-muted">{note.user_email}</small></div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td style={{ maxWidth: '300px' }}>
                                                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                                    {note.note}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">{formatDate(note.created_at)}</small>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => handleDeleteNote(note.id)}
                                                                    title="Delete Note"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="alert alert-info mb-0">
                                            <i className="fa fa-info-circle me-2"></i>
                                            No notes yet. Click "Add Note" button to create your first note.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Note Modal */}
                {showNoteModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Note</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShowNoteModal(false);
                                            setNewNoteText('');
                                        }}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <textarea
                                        className="form-control"
                                        rows={5}
                                        value={newNoteText}
                                        onChange={(e) => setNewNoteText(e.target.value)}
                                        placeholder="Enter your note here..."
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowNoteModal(false);
                                            setNewNoteText('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddNote}
                                        disabled={addingNote || !newNoteText.trim()}
                                    >
                                        {addingNote ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-save me-1"></i> Add Note
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Tab */}
                {activeTab === 'form' && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">📋 Form Fields</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '35%' }} className="fw-semibold text-muted">Name</td>
                                                    <td>{booking.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-semibold text-muted">Email</td>
                                                    <td>{booking.email}</td>
                                                </tr>
                                                {booking.phone && (
                                                    <tr>
                                                        <td className="fw-semibold text-muted">Phone</td>
                                                        <td>{booking.phone}</td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td className="fw-semibold text-muted">Service</td>
                                                    <td><span className={`badge ${getServiceBadgeColor(booking.service)}`}>{booking.service}</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-semibold text-muted">Status</td>
                                                    <td><span className={`badge ${getStatusBadgeColor(booking.status)}`}>{booking.status}</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-semibold text-muted">Total Members</td>
                                                    <td>{booking.total_members}</td>
                                                </tr>
                                                {booking.service === 'flight' && (
                                                    <>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">From City</td>
                                                            <td>{booking.from_city || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">To City</td>
                                                            <td>{booking.to_city || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Departure Date</td>
                                                            <td>{formatDate(booking.travel_date)}</td>
                                                        </tr>
                                                        {booking.trip_type === 'roundtrip' && (
                                                            <tr>
                                                                <td className="fw-semibold text-muted">Return Date</td>
                                                                <td>{formatDate(booking.return_date)}</td>
                                                            </tr>
                                                        )}
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Trip Type</td>
                                                            <td>{booking.trip_type || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Travel Class</td>
                                                            <td>{booking.travel_class || 'N/A'}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                {booking.service === 'hotel' && (
                                                    <>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Hotel City</td>
                                                            <td>{booking.hotel_city || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Check-in Date</td>
                                                            <td>{formatDate(booking.check_in_date)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Check-out Date</td>
                                                            <td>{formatDate(booking.check_out_date)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Country</td>
                                                            <td>{booking.country || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Rooms</td>
                                                            <td>{booking.rooms || 1}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Guests</td>
                                                            <td>{booking.guests || booking.total_members}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                {booking.service === 'visa' && (
                                                    <>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Destination</td>
                                                            <td>{booking.destination || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Passport Country</td>
                                                            <td>{booking.passport_country || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Visa Type</td>
                                                            <td>{booking.visa_type || 'N/A'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Number of Travelers</td>
                                                            <td>{booking.total_members}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-semibold text-muted">Travel Date</td>
                                                            <td>{formatDate(booking.travel_date)}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                <tr>
                                                    <td className="fw-semibold text-muted">Submitted Date</td>
                                                    <td>{formatDate(booking.created_at)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

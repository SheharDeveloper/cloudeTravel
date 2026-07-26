import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import TravelQuoteFormWizard from '@/components/TravelQuoteFormWizard';

interface TravelQuote {
    id: number;
    uid: string;
    display_name: string;
    check_in_date: string;
    checkout_date: string;
    night: number;
    hotel_details?: any;
    flight_details?: any;
    visa_details?: any;
    travel_details?: any;
    images?: string[];
    image_urls?: string[];
}

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        // Handle both string and object formats
        let dateStr = typeof dateString === 'string' ? dateString : '';
        if (!dateStr) return 'N/A';

        // Remove time portion if exists and add T if needed
        if (dateStr.includes('T')) {
            dateStr = dateStr.split('T')[0];
        }

        const date = new Date(dateStr + 'T00:00:00Z');
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
        console.error('Date formatting error:', error, dateString);
        return 'N/A';
    }
};

export default function TravelQuoteIndex({
    travelQuotes,
    currencySymbol = '£',
    currencyCode = 'GBP'
}: {
    travelQuotes: TravelQuote[],
    currencySymbol?: string,
    currencyCode?: string
}) {
    const [showModal, setShowModal] = useState(false);
    const [editingQuote, setEditingQuote] = useState<TravelQuote | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const handleModalClose = () => {
        setShowModal(false);
        setTimeout(() => setEditingQuote(null), 300);
    };

    const handleSuccess = () => {
        router.reload();
    };

    const handleEdit = (quote: TravelQuote) => {
        setEditingQuote(quote);
        setShowModal(true);
    };

    const handleDeleteClick = (id: number) => {
        setConfirmId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!confirmId) return;

        try {
            const response = await fetch(`/api/travel-quote/${confirmId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                setShowConfirm(false);
                setConfirmId(null);
                router.reload();
            } else {
                alert('Failed to delete quote');
                setShowConfirm(false);
                setConfirmId(null);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting quote');
            setShowConfirm(false);
            setConfirmId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setConfirmId(null);
    };

    return (
        <ProtectedRoute>
            {/* Page Title */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Travel Quotes</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard">
                                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Home
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Travel Quotes</li>
                    </ol>
                </nav>
            </div>

            {/* Travel Quotes Table */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header border-0 d-flex align-items-center justify-content-between">
                            <h5 className="card-title mb-0">All Travel Quotes</h5>
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn btn-primary btn-sm"
                            >
                                <i className="fa-solid fa-plus me-1"></i> Add Quote
                            </button>
                        </div>

                        <div className="card-body p-0">
                            {travelQuotes.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">#</th>
                                                <th>Image</th>
                                                <th>Display Name</th>
                                                <th>Check-in</th>
                                                <th>Check-out</th>
                                                <th>Nights</th>
                                                <th className="text-end pe-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {travelQuotes.map((quote, i) => (
                                                <tr key={quote.id}>
                                                    <td className="ps-3">{i + 1}</td>
                                                    <td>
                                                        {quote.image_urls && quote.image_urls.length > 0 ? (
                                                            <img
                                                                src={quote.image_urls[0]}
                                                                alt={quote.display_name}
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    borderRadius: '8px',
                                                                    objectFit: 'cover',
                                                                    border: '1px solid #e5e7eb'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    borderRadius: '8px',
                                                                    background: '#f3f4f6',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    border: '1px solid #e5e7eb',
                                                                    color: '#9ca3af',
                                                                    fontSize: '20px'
                                                                }}
                                                            >
                                                                📷
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="fw-bold">{quote.display_name}</td>
                                                    <td>
                                                        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                                                            📅 {formatDate(quote.check_in_date)}
                                                        </span>
                                                        {!quote.check_in_date && (
                                                            <div style={{ fontSize: '11px', color: '#ef4444' }}>Missing</div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                                                            📅 {formatDate(quote.checkout_date)}
                                                        </span>
                                                        {!quote.checkout_date && (
                                                            <div style={{ fontSize: '11px', color: '#ef4444' }}>Missing</div>
                                                        )}
                                                    </td>
                                                    <td><span className="badge bg-primary">{quote.night} nights</span></td>
                                                    <td className="text-end pe-3">
                                                        <div className="d-flex gap-2 justify-content-end">
                                                            <Link
                                                                href={`/admin/travel-quote/${quote.uid}`}
                                                                className="btn btn-primary btn-xs light"
                                                                title="View"
                                                            >
                                                                <i className="fa-solid fa-eye"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleEdit(quote)}
                                                                className="btn btn-warning btn-xs light"
                                                                title="Edit"
                                                            >
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(quote.id)}
                                                                className="btn btn-danger btn-xs light"
                                                                title="Delete"
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted">
                                    <i className="fa fa-inbox" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px', display: 'block' }}></i>
                                    <p className="mb-0">No travel quotes yet. <Link href="/admin/travel-quote/create" className="btn btn-link p-0">Create one</Link></p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Travel Quote Form Wizard */}
            <TravelQuoteFormWizard
                show={showModal}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                currencySymbol={currencySymbol}
                initialData={editingQuote}
            />

            {/* Confirm Delete Dialog */}
            {showConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1200,
                        padding: '20px'
                    }}
                    onClick={handleCancelDelete}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            padding: '32px',
                            maxWidth: '420px',
                            width: '100%',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginBottom: '16px'
                        }}>
                            ⚠️
                        </div>

                        {/* Title */}
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#1f2937',
                            margin: '0 0 8px',
                            lineHeight: 1.4
                        }}>
                            Delete Record
                        </h3>

                        {/* Message */}
                        <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            margin: '0 0 24px',
                            lineHeight: 1.6
                        }}>
                            Are you sure what to delete the record? This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleCancelDelete}
                                style={{
                                    padding: '10px 20px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#e5e7eb';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#f3f4f6';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                style={{
                                    padding: '10px 20px',
                                    background: '#dc2626',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#b91c1c';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#dc2626';
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </ProtectedRoute>
    );
}

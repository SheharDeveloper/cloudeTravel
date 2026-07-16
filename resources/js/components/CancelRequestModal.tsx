import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Booking {
    id: number;
    uid: string;
    type: string;
    first_name: string;
    email: string;
    status: string;
    created_at: string;
}

interface CancelRequestModalProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onCancelSuccess?: () => void;
}

export default function CancelRequestModal({ booking, isOpen, onClose, onCancelSuccess }: CancelRequestModalProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiFetch(`/api/bookings/${booking?.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: 'cancelled',
                    cancellation_reason: reason,
                }),
            });

            if (response.ok) {
                setSuccess('Booking cancellation requested successfully!');
                setTimeout(() => {
                    onClose();
                    onCancelSuccess?.();
                    setReason('');
                    setSuccess('');
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to cancel booking');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Cancel error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !booking) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cancel Booking</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        ></button>
                    </div>

                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError('')}
                                ></button>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {success}
                            </div>
                        )}

                        {!success && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Booking Details</label>
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <p className="mb-1">
                                                <strong>Name:</strong> {booking.first_name}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Type:</strong> {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Status:</strong> <span className="badge bg-warning">{booking.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Reason for Cancellation</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            placeholder="Please provide reason for cancellation..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            required
                                        ></textarea>
                                        <small className="form-text text-muted">
                                            This will help us improve our services
                                        </small>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                            disabled={loading || !reason.trim()}
                                        >
                                            {loading ? 'Processing...' : 'Confirm Cancellation'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={onClose}
                                            disabled={loading}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

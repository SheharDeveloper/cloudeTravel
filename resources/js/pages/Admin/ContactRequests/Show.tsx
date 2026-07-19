import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { router } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';

interface ContactRequest {
    id: number;
    uid: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

export default function ContactRequestShow({ contact: initialContact }: { contact: ContactRequest }) {
    const [contact, setContact] = useState<ContactRequest>(initialContact);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendReply = () => {
        if (!replyMessage.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setSending(true);
        router.post(`/api/contact-requests/${contact.uid}/reply`, {
            message: replyMessage,
        }, {
            onSuccess: () => {
                toast.success('Reply sent successfully!');
                setReplyMessage('');
                setShowReplyModal(false);
            },
            onError: () => {
                toast.error('Failed to send reply');
            },
            onFinish: () => {
                setSending(false);
            },
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <ProtectedRoute>
                {/* Page Title */}
                <div className="page-title">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Contact Request Details</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/admin/contact-requests">Contact Requests</a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Details</li>
                        </ol>
                    </nav>
                </div>

                {contact ? (
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Message from {contact.name}</h5>
                                </div>
                                <div className="card-body">
                                    <div style={{ marginBottom: '24px' }}>
                                        <h6 style={{ color: '#666', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Name</h6>
                                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>{contact.name}</p>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h6 style={{ color: '#666', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Email</h6>
                                        <a href={`mailto:${contact.email}`} style={{ fontSize: '15px', fontWeight: 600, color: '#0066cc', textDecoration: 'none' }}>
                                            {contact.email}
                                        </a>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h6 style={{ color: '#666', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Subject</h6>
                                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>{contact.subject}</p>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h6 style={{ color: '#666', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Message</h6>
                                        <div style={{
                                            background: '#f9f9f9',
                                            padding: '16px',
                                            borderRadius: '6px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            color: '#333',
                                            whiteSpace: 'pre-wrap',
                                            wordWrap: 'break-word'
                                        }}>
                                            {contact.message}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <h6 style={{ color: '#666', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Received Date</h6>
                                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{formatDate(contact.created_at)}</p>
                                    </div>
                                </div>

                                <div className="card-footer d-flex gap-2">
                                    <button
                                        onClick={() => setShowReplyModal(true)}
                                        className="btn btn-primary"
                                    >
                                        <i className="fa fa-envelope me-2"></i> Reply
                                    </button>
                                    <a href="/admin/contact-requests" className="btn btn-secondary">
                                        <i className="fa fa-arrow-left me-2"></i> Back to List
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title mb-0">Contact Info</h6>
                                </div>
                                <div className="card-body">
                                    <div style={{ marginBottom: '20px' }}>
                                        <small style={{ color: '#666', fontWeight: 600 }}>Status</small>
                                        <p style={{ margin: '8px 0 0 0' }}>
                                            <span className="badge bg-info">New</span>
                                        </p>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <small style={{ color: '#666', fontWeight: 600 }}>Request ID</small>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontFamily: 'monospace', color: '#333' }}>{contact.uid}</p>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this contact request?')) {
                                                    fetch(`/api/contact-requests/${contact.uid}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                    }).then(res => {
                                                        if (res.ok) {
                                                            window.location.href = '/admin/contact-requests';
                                                        }
                                                    });
                                                }
                                            }}
                                            className="btn btn-danger w-100"
                                        >
                                            <i className="fa fa-trash me-2"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-danger" role="alert">
                        <i className="fa fa-exclamation-triangle me-2"></i> Contact request not found
                    </div>
                )}

                {/* Reply Modal */}
                {showReplyModal && (
                    <div
                        className="modal d-block"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1050,
                        }}
                        onClick={() => !sending && setShowReplyModal(false)}
                    >
                        <div
                            className="modal-dialog"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1050,
                                width: '90%',
                                maxWidth: '900px',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fa fa-envelope me-2"></i>
                                        Reply to {contact.name}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => !sending && setShowReplyModal(false)}
                                        disabled={sending}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <strong>To:</strong>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={contact.email}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            <strong>Subject:</strong>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={`Re: ${contact.subject}`}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            <strong>Message:</strong>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={6}
                                            placeholder="Type your reply here..."
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            disabled={sending}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowReplyModal(false)}
                                        disabled={sending}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSendReply}
                                        disabled={sending}
                                    >
                                        {sending ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-send me-2"></i>
                                                Send Reply
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Notifications */}
                <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

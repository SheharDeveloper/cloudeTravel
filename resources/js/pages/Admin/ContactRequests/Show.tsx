import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

interface ContactRequest {
    id: number;
    uid: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

export default function ContactRequestShow() {
    const uid = window.location.pathname.split('/').pop() || '';
    const [contact, setContact] = useState<ContactRequest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContact();
    }, [uid]);

    const fetchContact = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/contact-requests/${uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setContact(data.data);
            } else {
                alert('Failed to load contact request');
            }
        } catch (error) {
            console.error('Error fetching contact:', error);
            alert('Error loading contact request');
        } finally {
            setLoading(false);
        }
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

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : contact ? (
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
                                    <a href={`mailto:${contact.email}`} className="btn btn-primary">
                                        <i className="fa fa-envelope me-2"></i> Reply via Email
                                    </a>
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
        </ProtectedRoute>
    );
}

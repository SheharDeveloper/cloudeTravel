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

export default function ContactRequestsIndex() {
    const [contacts, setContacts] = useState<ContactRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, [currentPage]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                per_page: '15',
            });

            const response = await fetch(`/api/contact-requests?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setContacts(data.data || []);
                setTotalPages(data.last_page || 1);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = async (uid: string) => {
        if (confirm('Are you sure you want to delete this contact request?')) {
            try {
                const response = await fetch(`/api/contact-requests/${uid}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (response.ok) {
                    setContacts(contacts.filter(c => c.uid !== uid));
                    alert('Contact request deleted successfully');
                } else {
                    alert('Failed to delete contact request');
                }
            } catch (error) {
                console.error('Error deleting contact:', error);
                alert('Error deleting contact request');
            }
        }
    };

    return (
        <ProtectedRoute>
                {/* Page Title */}
                <div className="page-title">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Contact Requests</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Contact Requests</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">All Contact Requests</h5>
                                <span className="badge bg-primary">{contacts.length} Total</span>
                            </div>

                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : contacts.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted">No contact requests found</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr className="border-bottom">
                                                    <th className="p-3">Name</th>
                                                    <th className="p-3">Email</th>
                                                    <th className="p-3">Subject</th>
                                                    <th className="p-3">Message</th>
                                                    <th className="p-3">Date</th>
                                                    <th className="p-3">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.map((contact) => (
                                                    <tr key={contact.id} className="border-bottom">
                                                        <td className="p-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar avatar-sm bg-primary rounded-circle me-2" style={{ minWidth: '32px' }}>
                                                                    <span className="text-white fw-bold">{contact.name?.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0">{contact.name}</h6>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <a href={`mailto:${contact.email}`} style={{ textDecoration: 'none', color: '#0066cc' }}>
                                                                {contact.email}
                                                            </a>
                                                        </td>
                                                        <td className="p-3">
                                                            <small style={{ fontWeight: 600, color: '#333' }}>{contact.subject}</small>
                                                        </td>
                                                        <td className="p-3">
                                                            <small style={{ color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {contact.message.substring(0, 100)}...
                                                            </small>
                                                        </td>
                                                        <td className="p-3">
                                                            <small style={{ color: '#666' }}>{formatDate(contact.created_at)}</small>
                                                        </td>
                                                        <td className="p-3">
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    onClick={() => window.open(`/admin/contact-requests/${contact.uid}`, '_blank')}
                                                                    className="btn btn-sm btn-info"
                                                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(contact.uid)}
                                                                    className="btn btn-sm btn-danger"
                                                                    style={{ padding: '4px 12px', fontSize: '12px' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="card-footer d-flex justify-content-center">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </ProtectedRoute>
    );
}

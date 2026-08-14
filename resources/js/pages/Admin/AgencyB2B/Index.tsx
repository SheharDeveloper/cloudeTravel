import { router } from '@inertiajs/react';
import { useAgenciesB2B } from '@/hooks/useAgenciesB2B';
import { useState } from 'react';

export default function AgencyB2BIndex() {

    const { agencies, currentPage, lastPage, filters, loading, handleFilterChange, handlePageChange, handleReset } = useAgenciesB2B();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const handleDelete = (uid: string) => {
        router.delete(`/admin/agency-b2b/${uid}`, {
            onSuccess: () => {
                setShowDeleteConfirm(null);
            },
        });
    };

    const handleToggleStatus = (uid: string) => {
        router.post(`/admin/agency-b2b/${uid}/toggle-status`, {}, {
            onSuccess: () => {
                // Refresh the page
                router.reload();
            },
        });
    };

    return (
        
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Agency Management</h1></li>
                        <li className="breadcrumb-item active">All Agencies</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            {/* Header with Action Button */}
                            <div className="row mb-3 d-flex justify-content-between align-items-center">
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by agency name, email, or phone..."
                                        value={filters.search || ''}
                                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4 text-end">
                                    <button
                                        className="btn btn-outline-secondary me-2"
                                        onClick={handleReset}
                                    >
                                        <i className="fa fa-redo"></i> Reset
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => router.visit('/admin/agency-b2b/create')}
                                    >
                                        <i className="fa fa-plus"></i> Add New Agency
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
                            ) : agencies.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Logo</th>
                                                    <th>Agency Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Service</th>
                                                    <th>Status</th>
                                                    <th>Created Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {agencies.map((agency) => (
                                                    <tr key={agency.id}>
                                                        <td>
                                                            {agency.logo ? (
                                                                <img src={agency.logo} alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                                                            ) : (
                                                                <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, borderRadius: 4 }}>
                                                                    <span className="text-muted fs-12">{agency.agency_name?.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <strong>{agency.agency_name}</strong>
                                                            {agency.legal_name && (
                                                                <div>
                                                                    <small className="text-muted">{agency.legal_name}</small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <small>{agency.email}</small>
                                                        </td>
                                                        <td>
                                                            <small>{agency.phone_number}</small>
                                                            {agency.alternate_phone && (
                                                                <div>
                                                                    <small className="text-muted">{agency.alternate_phone}</small>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {agency.agency_services && agency.agency_services.length > 0 ? (
                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {agency.agency_services.map((service: any, idx: number) => (
                                                                        <span key={idx} className="badge bg-info">{service.service_name}</span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <small className="text-muted">N/A</small>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <label
                                                                className="toggle-switch"
                                                                title={agency.status ? "Click to deactivate agency" : "Click to activate agency"}
                                                                style={{
                                                                    display: 'inline-block',
                                                                    position: 'relative',
                                                                    width: '52px',
                                                                    height: '28px',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={agency.status}
                                                                    onChange={() => handleToggleStatus(agency.uid)}
                                                                    style={{
                                                                        opacity: 0,
                                                                        width: 0,
                                                                        height: 0,
                                                                    }}
                                                                />
                                                                <span
                                                                    style={{
                                                                        position: 'absolute',
                                                                        cursor: 'pointer',
                                                                        top: 0,
                                                                        left: 0,
                                                                        right: 0,
                                                                        bottom: 0,
                                                                        backgroundColor: agency.status ? '#28a745' : '#9ca3af',
                                                                        transition: 'background-color 0.3s ease',
                                                                        borderRadius: '14px',
                                                                        border: '2px solid transparent',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            position: 'absolute',
                                                                            content: '""',
                                                                            height: '22px',
                                                                            width: '22px',
                                                                            left: agency.status ? '24px' : '2px',
                                                                            bottom: '2px',
                                                                            backgroundColor: 'white',
                                                                            transition: 'left 0.3s ease',
                                                                            borderRadius: '50%',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                        }}
                                                                    />
                                                                </span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {formatDate(agency.created_at)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="btn-group" role="group">
                                                                <button
                                                                    className="btn btn-sm btn-info"
                                                                    title="View Details"
                                                                    onClick={() => router.visit(`/admin/agency-b2b/${agency.uid}`)}
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    title="Edit"
                                                                    onClick={() => router.visit(`/admin/agency-b2b/${agency.uid}/edit`)}
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    title="Delete"
                                                                    onClick={() => setShowDeleteConfirm(agency.uid)}
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
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
                                    <i className="fa fa-info-circle"></i> No agencies found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteConfirm(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this agency? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteConfirm(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { router } from '@inertiajs/react';
import { useStaff } from '@/hooks/useStaff';
import { useState } from 'react';

export default function StaffIndex() {
    const { staff, currentPage, lastPage, filters, loading, presentToday, totalStaff, handleFilterChange, handlePageChange, handleReset } = useStaff();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [showImpersonateConfirm, setShowImpersonateConfirm] = useState<string | null>(null);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const handleDelete = (uid: string) => {
        router.delete(`/admin/staff/${uid}`, {
            onSuccess: () => {
                setShowDeleteConfirm(null);
            },
        });
    };

    const handleToggleStatus = (uid: string) => {
        router.post(`/admin/staff/${uid}/toggle-status`, {}, {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const handleImpersonate = (uid: string) => {
        router.post(`/admin/staff/${uid}/impersonate`, {}, {
            onSuccess: () => setShowImpersonateConfirm(null),
        });
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Staff Management</h1></li>
                        <li className="breadcrumb-item active">All Staff</li>
                    </ol>
                </nav>
            </div>

            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h6 className="mb-1">Present Today</h6>
                                <span className="fs-24 fw-bold text-success">{presentToday}</span>
                                <span className="text-muted"> / {totalStaff}</span>
                            </div>
                            <a href="/admin/attendance" className="btn btn-outline-primary">
                                <i className="fa fa-calendar-check me-2"></i>View Attendance
                            </a>
                        </div>
                    </div>
                </div>
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
                                        placeholder="Search by name, email, or phone..."
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
                                        onClick={() => router.visit('/admin/staff/create')}
                                    >
                                        <i className="fa fa-plus"></i> Add New Staff
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
                            ) : staff.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Photo</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>Created Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {staff.map((member: any) => (
                                                    <tr key={member.id}>
                                                        <td>
                                                            {member.profile_pic ? (
                                                                <img
                                                                    src={member.profile_image_url || member.profile_pic}
                                                                    alt={member.name}
                                                                    style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="bg-light d-flex align-items-center justify-content-center"
                                                                    style={{ width: 40, height: 40, borderRadius: 4 }}
                                                                >
                                                                    <span className="text-muted fs-12">
                                                                        {member.name?.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <strong>{member.name}</strong>
                                                        </td>
                                                        <td>
                                                            <small>{member.email}</small>
                                                        </td>
                                                        <td>
                                                            <small>{member.phone || 'N/A'}</small>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-info">{member.type}</span>
                                                        </td>
                                                        <td>
                                                            <label
                                                                className="toggle-switch"
                                                                title={member.status ? "Click to deactivate" : "Click to activate"}
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
                                                                    checked={member.status}
                                                                    onChange={() => handleToggleStatus(member.uid)}
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
                                                                        backgroundColor: member.status ? '#28a745' : '#ccc',
                                                                        transition: '.4s',
                                                                        borderRadius: '28px',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            height: '22px',
                                                                            width: '22px',
                                                                            left: member.status ? '26px' : '3px',
                                                                            bottom: '3px',
                                                                            backgroundColor: '#fff',
                                                                            transition: '.4s',
                                                                            borderRadius: '50%',
                                                                        }}
                                                                    />
                                                                </span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">{formatDate(member.created_at)}</small>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => router.visit(`/admin/staff/${member.uid}`)}
                                                                    title="View"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    onClick={() => router.visit(`/admin/staff/${member.uid}/edit`)}
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => setShowDeleteConfirm(member.uid)}
                                                                    title="Delete"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-dark"
                                                                    onClick={() => setShowImpersonateConfirm(member.uid)}
                                                                    title="Impersonate"
                                                                >
                                                                    <i className="fa fa-user-secret"></i>
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
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination justify-content-end">
                                                {currentPage > 1 && (
                                                    <li className="page-item">
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>
                                                )}
                                                {currentPage < lastPage && (
                                                    <li className="page-item">
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-users" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                    <p className="text-muted mt-3">No staff members found</p>
                                </div>
                            )}

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
                                                Are you sure you want to delete this staff member?
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

                            {/* Impersonate Confirmation Modal */}
                            {showImpersonateConfirm && (
                                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">
                                                    <i className="fa fa-user-secret me-2"></i>Impersonate Staff
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => setShowImpersonateConfirm(null)}
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                Log in as this staff member? You can return to your own account from the banner at the top of the page.
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setShowImpersonateConfirm(null)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-dark"
                                                    onClick={() => handleImpersonate(showImpersonateConfirm)}
                                                >
                                                    <i className="fa fa-user-secret me-2"></i>Impersonate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

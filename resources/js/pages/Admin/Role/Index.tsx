import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function RoleIndex() {
    const { roles, filters } = usePage().props as any;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [viewRole, setViewRole] = useState<any | null>(null);
    const [permSearch, setPermSearch] = useState('');

    const viewPermissions = (viewRole?.permissions || []).filter((p: any) =>
        p.name.toLowerCase().includes(permSearch.trim().toLowerCase())
    );

    const list = roles?.data || [];

    const handleSearch = (search: string) => {
        router.visit('/admin/roles', { data: { search, page: 1 }, preserveScroll: true, preserveState: true });
    };

    const handleDelete = (uid: string) => {
        router.delete(`/admin/roles/${uid}`, { onSuccess: () => setShowDeleteConfirm(null) });
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Role Management</h1></li>
                        <li className="breadcrumb-item active">All Roles</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card h-auto">
                        <div className="card-body">
                            <div className="row mb-3 d-flex justify-content-between align-items-center">
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by role name..."
                                        defaultValue={filters?.search || ''}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 text-end">
                                    <button className="btn btn-primary" onClick={() => router.visit('/admin/roles/create')}>
                                        <i className="fa fa-plus"></i> Add New Role
                                    </button>
                                </div>
                            </div>

                            {list.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Role</th>
                                                <th>Permissions</th>
                                                <th>Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list.map((role: any) => (
                                                <tr key={role.id}>
                                                    <td>
                                                        <strong className="text-capitalize">{role.name}</strong>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: 520 }}>
                                                            {(role.permissions || []).slice(0, 6).map((p: any) => (
                                                                <span key={p.id} className="badge bg-info">{p.name}</span>
                                                            ))}
                                                            {(role.permissions || []).length > 6 && (
                                                                <button
                                                                    type="button"
                                                                    className="badge bg-secondary border-0"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => setViewRole(role)}
                                                                >
                                                                    +{role.permissions.length - 6} more
                                                                </button>
                                                            )}
                                                            {(role.permissions || []).length === 0 && (
                                                                <small className="text-muted">No permissions</small>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">{role.permissions_count ?? 0}</span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-warning"
                                                                onClick={() => router.visit(`/admin/roles/${role.uid}/edit`)}
                                                                title="Edit"
                                                            >
                                                                <i className="fa fa-edit"></i>
                                                            </button>
                                                            {role.name !== 'superadmin' && (
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => setShowDeleteConfirm(role.uid)}
                                                                    title="Delete"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-user-shield" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                    <p className="text-muted mt-3">No roles found</p>
                                </div>
                            )}

                            {viewRole && (
                                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title text-capitalize">
                                                    {viewRole.name} &mdash; {(viewRole.permissions || []).length} permissions
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => { setViewRole(null); setPermSearch(''); }}
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <input
                                                    type="text"
                                                    className="form-control mb-3"
                                                    placeholder="Search permissions..."
                                                    value={permSearch}
                                                    onChange={(e) => setPermSearch(e.target.value)}
                                                    autoFocus
                                                />

                                                {viewPermissions.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {viewPermissions.map((p: any) => (
                                                            <span key={p.id} className="badge bg-info">{p.name}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted mb-0">No permissions match that search.</p>
                                                )}
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => { setViewRole(null); setPermSearch(''); }}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showDeleteConfirm && (
                                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Confirm Delete</h5>
                                                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(null)}></button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure you want to delete this role? Users holding it will lose its permissions.
                                            </div>
                                            <div className="modal-footer">
                                                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>Delete</button>
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

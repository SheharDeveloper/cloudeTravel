import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ClientIndex() {
    const { clients, filters } = usePage().props as any;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const list = clients?.data || [];
    const currentPage = clients?.current_page || 1;
    const lastPage = clients?.last_page || 1;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
    };

    const handleSearch = (search: string) => {
        router.visit('/admin/clients', { data: { search, page: 1 }, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.visit('/admin/clients', { data: { search: filters?.search || '', page }, preserveScroll: true, preserveState: true });
    };

    const handleDelete = (uid: string) => {
        router.delete(`/admin/clients/${uid}`, { onSuccess: () => setShowDeleteConfirm(null) });
    };

    const handleToggleStatus = (uid: string) => {
        router.post(`/admin/clients/${uid}/toggle-status`, {}, { onSuccess: () => router.reload() });
    };

    return (
        <div>
            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Client Management</h1></li>
                        <li className="breadcrumb-item active">All Clients</li>
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
                                        placeholder="Search by name, email, or phone..."
                                        defaultValue={filters?.search || ''}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 text-end">
                                    <button className="btn btn-primary" onClick={() => router.visit('/admin/clients/create')}>
                                        <i className="fa fa-plus"></i> Add New Client
                                    </button>
                                </div>
                            </div>

                            {list.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Nationality</th>
                                                    <th>Status</th>
                                                    <th>Created Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.map((client: any) => (
                                                    <tr key={client.id}>
                                                        <td>
                                                            <strong>{client.name}</strong>
                                                        </td>
                                                        <td><small>{client.email || 'N/A'}</small></td>
                                                        <td><small>{client.phone || 'N/A'}</small></td>
                                                        <td><small>{client.nationality || 'N/A'}</small></td>
                                                        <td>
                                                            <label
                                                                className="toggle-switch"
                                                                title={client.status === 'active' ? 'Click to deactivate' : 'Click to activate'}
                                                                style={{ display: 'inline-block', position: 'relative', width: '52px', height: '28px', cursor: 'pointer' }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={client.status === 'active'}
                                                                    onChange={() => handleToggleStatus(client.uid)}
                                                                    style={{ opacity: 0, width: 0, height: 0 }}
                                                                />
                                                                <span
                                                                    style={{
                                                                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                                                        backgroundColor: client.status === 'active' ? '#28a745' : '#ccc',
                                                                        transition: '.4s', borderRadius: '28px',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            position: 'absolute', height: '22px', width: '22px',
                                                                            left: client.status === 'active' ? '26px' : '3px', bottom: '3px',
                                                                            backgroundColor: '#fff', transition: '.4s', borderRadius: '50%',
                                                                        }}
                                                                    />
                                                                </span>
                                                            </label>
                                                        </td>
                                                        <td><small className="text-muted">{formatDate(client.created_at)}</small></td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => router.visit(`/admin/clients/${client.uid}`)}
                                                                    title="View"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-warning"
                                                                    onClick={() => router.visit(`/admin/clients/${client.uid}/edit`)}
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => setShowDeleteConfirm(client.uid)}
                                                                    title="Delete"
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

                                    {lastPage > 1 && (
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination justify-content-end">
                                                {currentPage > 1 && (
                                                    <li className="page-item">
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                                    </li>
                                                )}
                                                {currentPage < lastPage && (
                                                    <li className="page-item">
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-address-book" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                    <p className="text-muted mt-3">No clients found</p>
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
                                                Are you sure you want to delete this client? This also removes their address, passport, and family details.
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
                                                <button type="button" className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>Delete</button>
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

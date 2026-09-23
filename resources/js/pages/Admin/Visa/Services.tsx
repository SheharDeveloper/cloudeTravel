import { useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { formatDate, type Visa } from '@/services/visaService';

type StatusFilter = 'active' | 'inactive' | 'all';

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function VisaServiceIndex() {
    const { visas, filters, counts } = usePage().props as unknown as {
        visas: Paginated<Visa>;
        filters: { status: StatusFilter; search: string };
        counts: { all: number; active: number; inactive: number };
    };

    const [searchTerm, setSearchTerm] = useState(filters.search);
    const statusFilter = filters.status;
    const currentVisas = visas.data;
    const currentPage = visas.current_page;
    const totalPages = visas.last_page;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);

    // Every filter, search and page change is a server request.
    const applyFilters = (next: { status?: StatusFilter; search?: string; page?: number }) => {
        router.get(
            '/admin/visa-services',
            {
                status: next.status ?? statusFilter,
                search: next.search ?? searchTerm,
                page: next.page ?? 1,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Search waits for a pause in typing so it doesn't request on every key.
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timer = setTimeout(() => applyFilters({ search: searchTerm }), 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleDelete = () => {
        if (!selectedVisa) return;

        router.delete(`/admin/visa-services/${selectedVisa.uid}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedVisa(null);
            },
        });
    };

    const handleStatusToggle = (visa: Visa) => {
        router.patch(
            `/admin/visa-services/${visa.uid}/status`,
            { status: Number(visa.status) === 1 ? 0 : 1 },
            { preserveScroll: true },
        );
    };

    const handlePrevPage = () => {
        if (currentPage > 1) applyFilters({ page: currentPage - 1 });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) applyFilters({ page: currentPage + 1 });
    };

    return (
        <ProtectedRoute>
                {/* Page Header */}
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Visas</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <i className="fa fa-home me-2"></i>Dashboard
                                </a>
                            </li>
                            <li className="breadcrumb-item active">Visas</li>
                        </ol>
                    </nav>
                </div>

                {/* Main Content Card */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">All Visa Services</h5>
                                <a href="/admin/visa-services/create" className="btn btn-primary btn-sm">
                                    <i className="fa fa-plus me-2"></i>Add New Visa
                                </a>
                            </div>

                            <div className="card-body">
                                {/* Search Bar */}
                                <div className="row g-2 mb-4">
                                    <div className="col-sm-4 col-md-3 col-lg-2">
                                        <select
                                            className="form-select form-select-sm"
                                            value={statusFilter}
                                            onChange={(e) => applyFilters({ status: e.target.value as StatusFilter })}
                                            aria-label="Filter by status"
                                        >
                                            <option value="active">Active ({counts.active})</option>
                                            <option value="inactive">Inactive ({counts.inactive})</option>
                                            <option value="all">All statuses ({counts.all})</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-8 col-md-9 col-lg-10">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Search visa name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {currentVisas.length === 0 ? (
                                    <div className="alert alert-info text-center py-5">
                                        <i className="fa fa-info-circle me-2"></i>
                                        {searchTerm || statusFilter !== 'all' ? `No ${statusFilter === 'all' ? '' : statusFilter + ' '}visas found` : 'No visas available. Click "Add New Visa" to create one!'}
                                        {!searchTerm && statusFilter !== 'all' && counts.all > 0 && (
                                            <div className="mt-2">
                                                {counts.all} visa{counts.all === 1 ? '' : 's'} exist with another status.{' '}
                                                <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => applyFilters({ status: 'all' })}>
                                                    Show all statuses
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Name</th>
                                                        <th>Type</th>
                                                        <th>Category</th>
                                                        <th>Origin</th>
                                                        <th>Destination</th>
                                                        <th>Featured</th>
                                                        <th>Status</th>
                                                        <th>Created</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentVisas.map((visa) => (
                                                        <tr key={visa.id}>
                                                            <td>
                                                                {visa.image ? (
                                                                    <img
                                                                        src={visa.image}
                                                                        alt={visa.name || visa.title}
                                                                        style={{
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '4px',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span className="badge bg-secondary">No Image</span>
                                                                )}
                                                            </td>
                                                            <td><strong>{visa.name || visa.title}</strong></td>
                                                            <td>{visa.visa_type?.name || <span className="text-muted">—</span>}</td>
                                                            <td>{visa.category?.name || <span className="text-muted">—</span>}</td>
                                                            <td>{visa.origin_country?.countryName || <span className="text-muted">—</span>}</td>
                                                            <td>{visa.destination_country?.countryName || <span className="text-muted">—</span>}</td>
                                                            <td>
                                                                <span className={`badge ${visa.is_featured ? 'bg-warning' : 'bg-light text-dark'}`}>
                                                                    <i className={`fa fa-star me-1`}></i>
                                                                    {visa.is_featured ? 'Featured' : 'Regular'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className={`badge ${Number(visa.status) === 1 ? 'bg-success' : 'bg-danger'}`}
                                                                    onClick={() => handleStatusToggle(visa)}
                                                                    style={{ cursor: 'pointer', border: 'none' }}
                                                                >
                                                                    {Number(visa.status) === 1 ? 'Active' : 'Inactive'}
                                                                </button>
                                                            </td>
                                                            <td><small>{formatDate(visa.created_at)}</small></td>
                                                            <td>
                                                                <div className="btn-group btn-group-sm">
                                                                    {visa.origin_country?.uid && visa.destination_country?.uid ? (
                                                                        <a
                                                                            href={`/admin/visa-search/result?from=${visa.origin_country.uid}&to=${visa.destination_country.uid}&visa=${visa.uid}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="btn btn-success"
                                                                            title="Preview how this visa appears in the search results"
                                                                        >
                                                                            <i className="fa fa-magnifying-glass"></i>
                                                                        </a>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-success"
                                                                            disabled
                                                                            title="Set both the origin and destination country to preview this visa"
                                                                        >
                                                                            <i className="fa fa-magnifying-glass"></i>
                                                                        </button>
                                                                    )}

                                                                    <a
                                                                        href={`/admin/visa-services/${visa.uid}`}
                                                                        className="btn btn-info"
                                                                        title="View visa details"
                                                                    >
                                                                        <i className="fa fa-eye"></i>
                                                                    </a>

                                                                    <a
                                                                        href={`/admin/visa-services/${visa.uid}/edit`}
                                                                        className="btn btn-warning"
                                                                        title="Edit visa information"
                                                                    >
                                                                        <i className="fa fa-edit"></i>
                                                                    </a>

                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => {
                                                                            setSelectedVisa(visa);
                                                                            setShowDeleteModal(true);
                                                                        }}
                                                                        title="Delete visa"
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

                                        {totalPages > 1 && (
                                            <nav className="mt-4">
                                                <ul className="pagination justify-content-center">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={handlePrevPage}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => applyFilters({ page })}
                                                            >
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={handleNextPage}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && selectedVisa && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }} tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="fa fa-trash me-2"></i>Delete Visa
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowDeleteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete <strong>{selectedVisa.name}</strong>?</p>
                                    <p className="text-muted small">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                    >
                                        <i className="fa fa-trash me-2"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </ProtectedRoute>
    );
}

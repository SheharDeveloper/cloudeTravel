import { useState, useEffect } from 'react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import {
    fetchAllPackages,
    deletePackage,
    formatDate,
    type Package,
} from '@/services/packageService';
import PackageFormModal from './PackageFormModal';

export default function PackageIndex() {
    // State management
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Modal states
    const [showFormModal, setShowFormModal] = useState(false);
    const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
    const [selectedPackageForForm, setSelectedPackageForForm] = useState<Package | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

    const loadPackages = async () => {
        try {
            setLoading(true);
            const data = await fetchAllPackages();
            setPackages(data);
        } catch (error) {
            console.error('Error fetching packages:', error);
            alert('Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPackages();
    }, []);

    const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination_country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

    const handleAdd = () => {
        setFormModalMode('create');
        setSelectedPackageForForm(null);
        setShowFormModal(true);
    };

    const handleEdit = (pkg: Package) => {
        setFormModalMode('edit');
        setSelectedPackageForForm(pkg);
        setShowFormModal(true);
    };

    const handleDelete = async () => {
        if (!selectedPackage) return;

        try {
            const response = await deletePackage(selectedPackage.id);

            if (response.ok) {
                alert('Package deleted successfully');
                setShowDeleteModal(false);
                setSelectedPackage(null);
                loadPackages();
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            alert('Error deleting package');
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <ProtectedRoute>
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Package Management</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <i className="fa fa-home me-2"></i>Dashboard
                                </a>
                            </li>
                            <li className="breadcrumb-item active">Packages</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">All Packages</h5>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAdd}
                                >
                                    <i className="fa fa-plus me-2"></i>Add New Package
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search package name or destination..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>

                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : currentPackages.length === 0 ? (
                                    <div className="alert alert-info text-center py-5">
                                        <i className="fa fa-info-circle me-2"></i>
                                        {searchTerm ? 'No packages found' : 'No packages available. Click "Add New Package" to create one!'}
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Name</th>
                                                        <th>Route</th>
                                                        <th>Price</th>
                                                        <th>Hotel / Stars</th>
                                                        <th>Duration</th>
                                                        <th>Services</th>
                                                        <th>Featured</th>
                                                        <th>Created</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentPackages.map((pkg) => (
                                                        <tr key={pkg.id}>
                                                            <td>
                                                                {pkg.image ? (
                                                                    <img
                                                                        src={pkg.image}
                                                                        alt={pkg.name}
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
                                                            <td><strong>{pkg.name}</strong></td>
                                                            <td>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
                                                                    <span>{pkg.origin_country || 'India'}</span>
                                                                    <span style={{ color: '#ff6b35', fontWeight: 700 }}>→</span>
                                                                    <span>{pkg.destination_country}</span>
                                                                </div>
                                                            </td>
                                                            <td><strong>{pkg.currency} {parseFloat(String(pkg.price)).toFixed(2)}</strong></td>
                                                            <td>
                                                                {pkg.hotel_name && (
                                                                    <div>
                                                                        <div style={{ fontSize: '12px' }}>{pkg.hotel_name}</div>
                                                                        <span className="badge bg-info">
                                                                            {[...Array(pkg.hotel_stars)].map((_, i) => (
                                                                                <span key={i}>★</span>
                                                                            ))}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td>{pkg.duration_days} days</td>
                                                            <td>
                                                                <div style={{ fontSize: '11px' }}>
                                                                    {pkg.travel_export_included && (
                                                                        <div><span className="badge bg-success">Travel Export</span></div>
                                                                    )}
                                                                    {pkg.visa_service_included && (
                                                                        <div><span className="badge bg-primary">Visa Service</span></div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {pkg.is_featured && (
                                                                    <span className="badge bg-warning">
                                                                        <i className="fa fa-star me-1"></i>Featured
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td><small>{formatDate(pkg.created_at)}</small></td>
                                                            <td>
                                                                <div className="btn-group btn-group-sm">
                                                                    <button
                                                                        className="btn btn-warning"
                                                                        onClick={() => handleEdit(pkg)}
                                                                        title="Edit package"
                                                                    >
                                                                        <i className="fa fa-edit"></i>
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => {
                                                                            setSelectedPackage(pkg);
                                                                            setShowDeleteModal(true);
                                                                        }}
                                                                        title="Delete package"
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
                                                                onClick={() => setCurrentPage(page)}
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

                {/* FORM MODAL */}
                <PackageFormModal
                    mode={formModalMode}
                    package={selectedPackageForForm}
                    isOpen={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    onSuccess={loadPackages}
                />

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && selectedPackage && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }} tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="fa fa-trash me-2"></i>Delete Package
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowDeleteModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete <strong>{selectedPackage.name}</strong>?</p>
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

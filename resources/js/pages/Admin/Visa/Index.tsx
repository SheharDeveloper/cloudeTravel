import { useState, useEffect } from 'react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import {
    fetchAllVisas,
    deleteVisa,
    toggleVisaStatus,
    formatDate,
    type Visa,
} from '@/services/visaService';
import VisaFormModal from './VisaFormModal';

export default function VisaIndex() {
    // State management
    const [visas, setVisas] = useState<Visa[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Modal states
    const [showFormModal, setShowFormModal] = useState(false);
    const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
    const [selectedVisaForForm, setSelectedVisaForForm] = useState<Visa | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);

    /**
     * Fetch all visas from API on component load
     * Called on component mount to populate the list
     */
    const loadVisas = async () => {
        try {
            setLoading(true);
            const data = await fetchAllVisas();
            setVisas(data);
        } catch (error) {
            console.error('Error fetching visas:', error);
            alert('Failed to load visas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVisas();
    }, []);

    // Filter visas based on search input
    const filteredVisas = visas.filter(visa =>
        visa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visa.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVisas = filteredVisas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVisas.length / itemsPerPage);

    /**
     * VIEW FUNCTION - Display visa details
     * @param visaId - ID of the visa to view
     * Opens a modal showing full visa information (read-only)
     */
    const handleView = (visa: Visa) => {
        setSelectedVisa(visa);
        // Open view modal (you can add a viewModal state if needed)
        alert(`Visa: ${visa.name}\nTitle: ${visa.title}\nStatus: ${visa.status === 1 ? 'Active' : 'Inactive'}`);
    };

    /**
     * ADD FUNCTION - Open create visa modal
     * Opens the create form modal where user can enter new visa information
     * Form is empty and ready for new data
     */
    const handleAdd = () => {
        setFormModalMode('create');
        setSelectedVisaForForm(null);
        setShowFormModal(true);
    };

    /**
     * EDIT FUNCTION - Open edit visa modal
     * @param visa - The visa object to edit
     * Opens the edit form modal pre-filled with current visa data
     * Allows user to update name, title, description, and image
     */
    const handleEdit = (visa: Visa) => {
        setFormModalMode('edit');
        setSelectedVisaForForm(visa);
        setShowFormModal(true);
    };


    // Delete visa
    const handleDelete = async () => {
        if (!selectedVisa) return;

        try {
            const response = await deleteVisa(selectedVisa.id);

            if (response.ok) {
                alert('Visa deleted successfully');
                setShowDeleteModal(false);
                setSelectedVisa(null);
                loadVisas();
            }
        } catch (error) {
            console.error('Error deleting visa:', error);
            alert('Error deleting visa');
        }
    };

    // Toggle visa status
    const handleStatusToggle = async (visa: Visa) => {
        try {
            const response = await toggleVisaStatus(visa.id, visa.status === 1 ? 0 : 1);

            if (response.ok) {
                loadVisas();
            }
        } catch (error) {
            console.error('Error updating visa status:', error);
        }
    };

    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <ProtectedRoute>
                {/* Page Header */}
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Visa Management</h1></li>
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
                            {/* Card Header */}
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">All Visa Services</h5>
                                {/* ADD BUTTON - Opens create modal */}
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAdd}
                                >
                                    <i className="fa fa-plus me-2"></i>Add New Visa
                                </button>
                            </div>

                            {/* Card Body */}
                            <div className="card-body">
                                {/* Search Bar */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search visa name or title..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : currentVisas.length === 0 ? (
                                    <div className="alert alert-info text-center py-5">
                                        <i className="fa fa-info-circle me-2"></i>
                                        {searchTerm ? 'No visas found' : 'No visas available. Click "Add New Visa" to create one!'}
                                    </div>
                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Name</th>
                                                        <th>Title</th>
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
                                                                        alt={visa.name}
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
                                                            <td><strong>{visa.name}</strong></td>
                                                            <td>{visa.title}</td>
                                                            <td>
                                                                <span className={`badge ${visa.is_featured ? 'bg-warning' : 'bg-light text-dark'}`}>
                                                                    <i className={`fa fa-star me-1`}></i>
                                                                    {visa.is_featured ? 'Featured' : 'Regular'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className={`badge ${visa.status === 1 ? 'bg-success' : 'bg-danger'}`}
                                                                    onClick={() => handleStatusToggle(visa)}
                                                                    style={{ cursor: 'pointer', border: 'none' }}
                                                                >
                                                                    {visa.status === 1 ? 'Active' : 'Inactive'}
                                                                </button>
                                                            </td>
                                                            <td><small>{formatDate(visa.created_at)}</small></td>
                                                            <td>
                                                                <div className="btn-group btn-group-sm">
                                                                    {/* VIEW BUTTON - Opens view modal */}
                                                                    <button
                                                                        className="btn btn-info"
                                                                        onClick={() => handleView(visa)}
                                                                        title="View visa details"
                                                                    >
                                                                        <i className="fa fa-eye"></i>
                                                                    </button>

                                                                    {/* EDIT BUTTON - Opens edit modal */}
                                                                    <button
                                                                        className="btn btn-warning"
                                                                        onClick={() => handleEdit(visa)}
                                                                        title="Edit visa information"
                                                                    >
                                                                        <i className="fa fa-edit"></i>
                                                                    </button>

                                                                    {/* DELETE BUTTON - Opens delete confirmation modal */}
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

                                        {/* Pagination */}
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

                {/* FORM MODAL - Handles both Create and Edit */}
                <VisaFormModal
                    mode={formModalMode}
                    visa={selectedVisaForForm}
                    isOpen={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    onSuccess={loadVisas}
                />

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

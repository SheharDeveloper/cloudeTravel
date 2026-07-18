import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

interface Document {
    id: number;
    title: string;
    document_path: string;
    display_url: string;
    status: 'active' | 'inactive';
    created_at: string;
}

interface UploadModalState {
    show: boolean;
    isEdit: boolean;
    documentId: number | null;
}

export default function DocumentsIndex({ documents }: { documents: Document[] }) {
    const { errors } = usePage().props as any;
    const [uploading, setUploading] = useState(false);
    const [uploadModal, setUploadModal] = useState<UploadModalState>({
        show: false,
        isEdit: false,
        documentId: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; documentId: number | null; title: string }>({
        show: false,
        documentId: null,
        title: '',
    });
    const [formData, setFormData] = useState({
        title: '',
        document_file: null as File | null,
        status: 'active',
    });

    const getStatusBadge = (status: string) => {
        if (status === 'active') {
            return <span className="badge bg-success">Active</span>;
        }
        return <span className="badge bg-danger">Inactive</span>;
    };

    const openDocument = (displayUrl: string) => {
        window.open(displayUrl, '_blank');
    };

    const openUploadModal = () => {
        setFormData({ title: '', document_file: null, status: 'active' });
        setUploadModal({ show: true, isEdit: false, documentId: null });
    };

    const openEditModal = (doc: Document) => {
        setFormData({ title: doc.title, document_file: null, status: doc.status });
        setUploadModal({ show: true, isEdit: true, documentId: doc.id });
    };

    const closeUploadModal = () => {
        setUploadModal({ show: false, isEdit: false, documentId: null });
        setFormData({ title: '', document_file: null, status: 'active' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, document_file: file });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadModal.isEdit) {
            // Edit mode - file is optional
            setUploading(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('status', formData.status);
            if (formData.document_file) {
                data.append('document_file', formData.document_file);
            }
            data.append('_method', 'PUT');

            router.post(`/admin/documents/${uploadModal.documentId}`, data, {
                onSuccess: () => {
                    setUploading(false);
                    closeUploadModal();
                    toast.success('Document updated successfully!');
                },
                onError: () => {
                    setUploading(false);
                    toast.error('Failed to update document');
                },
            });
        } else {
            // Upload mode - file is required
            if (!formData.document_file) {
                toast.error('Please select a PDF file');
                return;
            }

            setUploading(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('document_file', formData.document_file);
            data.append('status', formData.status);

            router.post('/admin/documents', data, {
                onSuccess: () => {
                    setUploading(false);
                    closeUploadModal();
                    toast.success('Document uploaded successfully!');
                },
                onError: () => {
                    setUploading(false);
                    toast.error('Failed to upload document');
                },
            });
        }
    };

    const openDeleteModal = (documentId: number, title: string) => {
        setDeleteModal({ show: true, documentId, title });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ show: false, documentId: null, title: '' });
    };

    const confirmDelete = () => {
        if (deleteModal.documentId) {
            router.delete(`/admin/documents/${deleteModal.documentId}`, {
                onSuccess: () => {
                    closeDeleteModal();
                    toast.success('Document deleted successfully!', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to delete document', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        }
    };

    return (
        <>
            <Head title="Public Documents" />

            {/* Page Title */}
            <div className="page-title mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Public Documents</h1></li>
                        <li className="breadcrumb-item active">Manage all documents</li>
                    </ol>
                </nav>
            </div>

            {/* Upload Button */}
            <div className="mb-3">
                <button className="btn btn-primary" onClick={openUploadModal}>
                    <i className="fa fa-cloud-upload me-2"></i>Upload New Document
                </button>
            </div>

            {/* Documents Table */}
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">All Documents ({documents.length})</h5>
                </div>
                <div className="card-body">
                    {documents.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '5%' }}>#</th>
                                        <th style={{ width: '35%' }}>Title</th>
                                        <th style={{ width: '30%' }}>File Path</th>
                                        <th style={{ width: '15%' }}>Status</th>
                                        <th style={{ width: '15%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, index) => (
                                        <tr key={doc.id}>
                                            <td>{index + 1}</td>
                                            <td className="fw-bold">{doc.title}</td>
                                            <td>
                                                <small className="text-muted text-truncate d-block" style={{ maxWidth: '250px' }}>
                                                    {doc.document_path}
                                                </small>
                                            </td>
                                            <td>{getStatusBadge(doc.status)}</td>
                                            <td>
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => openDocument(doc.display_url)}
                                                        title="View document"
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-info"
                                                        onClick={() => openEditModal(doc)}
                                                        title="Edit document"
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => openDeleteModal(doc.id, doc.title)}
                                                        title="Delete document"
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
                    ) : (
                        <div className="text-center py-5">
                            <i className="fa fa-file" style={{ fontSize: '48px', color: '#ccc' }}></i>
                            <h6 className="mt-3 text-muted">No documents uploaded yet</h6>
                            <p className="text-muted small">Click "Upload New Document" to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload/Edit Modal */}
            {uploadModal.show && (
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
                    onClick={closeUploadModal}
                >
                    <div
                        className="modal-dialog modal-lg"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1050,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className={`fa ${uploadModal.isEdit ? 'fa-edit' : 'fa-cloud-upload'} me-2`}></i>
                                    {uploadModal.isEdit ? 'Edit Document' : 'Upload New Document'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeUploadModal}
                                    disabled={uploading}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Document Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors?.title ? 'is-invalid' : ''}`}
                                            placeholder="e.g., Terms & Conditions"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            disabled={uploading}
                                        />
                                        {errors?.title && (
                                            <div className="invalid-feedback d-block">{errors.title}</div>
                                        )}
                                    </div>

                                    {!uploadModal.isEdit && (
                                        <div className="mb-3">
                                            <label className="form-label">Select PDF File (Max 10MB)</label>
                                            <div className="form-control-wrapper">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className={`form-control ${errors?.document_file ? 'is-invalid' : ''}`}
                                                    onChange={handleFileChange}
                                                    required
                                                    disabled={uploading}
                                                />
                                                {formData.document_file && (
                                                    <small className="text-success d-block mt-2">
                                                        <i className="fa fa-check me-2"></i>
                                                        {formData.document_file.name}
                                                    </small>
                                                )}
                                                {errors?.document_file && (
                                                    <div className="invalid-feedback d-block">{errors.document_file}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {uploadModal.isEdit && (
                                        <div className="mb-3">
                                            <label className="form-label">Replace PDF File (Optional)</label>
                                            <div className="alert alert-info mb-2">
                                                <small>Leave empty to keep the current file</small>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className={`form-control ${errors?.document_file ? 'is-invalid' : ''}`}
                                                onChange={handleFileChange}
                                                disabled={uploading}
                                            />
                                            {formData.document_file && (
                                                <small className="text-success d-block mt-2">
                                                    <i className="fa fa-check me-2"></i>
                                                    {formData.document_file.name}
                                                </small>
                                            )}
                                            {errors?.document_file && (
                                                <div className="invalid-feedback d-block">{errors.document_file}</div>
                                            )}
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-control"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            disabled={uploading}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeUploadModal}
                                            disabled={uploading}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={uploading}>
                                            {uploading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    {uploadModal.isEdit ? 'Updating...' : 'Uploading...'}
                                                </>
                                            ) : (
                                                <>
                                                    <i className={`fa ${uploadModal.isEdit ? 'fa-save' : 'fa-upload'} me-2`}></i>
                                                    {uploadModal.isEdit ? 'Update Document' : 'Upload Document'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                show={deleteModal.show}
                title={deleteModal.title}
                message="This document and its file will be permanently deleted and cannot be recovered."
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                isDeleting={false}
            />

            {/* Toast Notifications */}
            <Toaster position="top-right" />
        </>
    );
}

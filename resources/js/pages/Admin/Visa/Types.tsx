import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import VisaTypeFormModal, { type VisaType } from './VisaTypeFormModal';

export default function VisaTypeIndex() {
    const { visaTypes } = usePage().props as unknown as { visaTypes: VisaType[] };

    const [showTypeModal, setShowTypeModal] = useState(false);
    const [typeModalMode, setTypeModalMode] = useState<'create' | 'edit'>('create');
    const [selectedTypeForForm, setSelectedTypeForForm] = useState<VisaType | null>(null);
    const [deleteTypeTarget, setDeleteTypeTarget] = useState<VisaType | null>(null);

    const addVisaType = () => {
        setTypeModalMode('create');
        setSelectedTypeForForm(null);
        setShowTypeModal(true);
    };

    const editVisaType = (visaType: VisaType) => {
        setTypeModalMode('edit');
        setSelectedTypeForForm(visaType);
        setShowTypeModal(true);
    };

    const deleteVisaType = () => {
        if (!deleteTypeTarget) return;
        router.delete(`/admin/visa-types/${deleteTypeTarget.id}`, {
            preserveScroll: true,
            preserveState: true,
            only: ['visaTypes'],
            onSuccess: () => setDeleteTypeTarget(null),
        });
    };

    return (
        <ProtectedRoute>
                {/* Page Header */}
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Visa Type</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <i className="fa fa-home me-2"></i>Dashboard
                                </a>
                            </li>
                            <li className="breadcrumb-item active">Visa Type</li>
                        </ol>
                    </nav>
                </div>

                {/* Visa Types */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">Visa Types</h5>
                                <button className="btn btn-primary btn-sm" onClick={addVisaType}>
                                    <i className="fa fa-plus me-2"></i>Add Visa Type
                                </button>
                            </div>
                            <div className="card-body">
                                {visaTypes.length === 0 ? (
                                    <div className="alert alert-info text-center py-4">
                                        <i className="fa fa-info-circle me-2"></i>
                                        No visa types yet. Click "Add Visa Type" to create one!
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visaTypes.map((visaType) => (
                                                    <tr key={visaType.id}>
                                                        <td><strong>{visaType.name}</strong></td>
                                                        <td>{visaType.description || <span className="text-muted">—</span>}</td>
                                                        <td>
                                                            <div className="btn-group btn-group-sm">
                                                                <button
                                                                    className="btn btn-warning"
                                                                    onClick={() => editVisaType(visaType)}
                                                                    title="Edit visa type"
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => setDeleteTypeTarget(visaType)}
                                                                    title="Delete visa type"
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* VISA TYPE FORM MODAL - Handles both Create and Edit */}
                <VisaTypeFormModal
                    mode={typeModalMode}
                    visaType={selectedTypeForForm}
                    isOpen={showTypeModal}
                    onClose={() => setShowTypeModal(false)}
                />

                {/* VISA TYPE DELETE CONFIRMATION MODAL */}
                {deleteTypeTarget && (
                    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }} tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="fa fa-trash me-2"></i>Delete Visa Type
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setDeleteTypeTarget(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete <strong>{deleteTypeTarget.name}</strong>?</p>
                                    <p className="text-muted small">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteTypeTarget(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={deleteVisaType}
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

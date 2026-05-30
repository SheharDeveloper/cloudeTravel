import { useState } from 'react';

interface DeleteConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmModal({
    show,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    if (!show) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                tabIndex={-1}
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header border-danger">
                            <h5 className="modal-title text-danger">
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                {title}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onCancel}
                                disabled={isLoading}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p className="mb-0">{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-trash me-2"></i>
                                        {confirmText}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

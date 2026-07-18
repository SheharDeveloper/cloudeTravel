import toast from 'react-hot-toast';

interface DeleteConfirmModalProps {
    show: boolean;
    title: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export default function DeleteConfirmModal({
    show,
    title,
    message = 'This action cannot be undone.',
    onConfirm,
    onCancel,
    isDeleting = false,
}: DeleteConfirmModalProps) {
    if (!show) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal d-block"
                style={{
                    display: show ? 'block' : 'none',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1050,
                }}
                onClick={onCancel}
            >
                {/* Modal Dialog */}
                <div
                    className="modal-dialog"
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
                        {/* Modal Header */}
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">
                                <i className="fa fa-exclamation-triangle me-2"></i>
                                Confirm Delete
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onCancel}
                                disabled={isDeleting}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body py-4">
                            <div className="text-center mb-4">
                                <div
                                    style={{
                                        fontSize: '64px',
                                        color: '#dc2626',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <i className="fa fa-trash"></i>
                                </div>
                            </div>

                            <h6 className="text-center mb-2">Delete "{title}"?</h6>
                            <p className="text-center text-muted mb-0">{message}</p>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-trash me-2"></i>
                                        Delete
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

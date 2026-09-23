import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export interface VisaType {
    id: number;
    name: string;
    description: string | null;
}

interface VisaTypeFormModalProps {
    mode: 'create' | 'edit';
    visaType?: VisaType | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function VisaTypeFormModal({ mode, visaType, isOpen, onClose }: VisaTypeFormModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setName(mode === 'edit' && visaType ? visaType.name : '');
            setDescription(mode === 'edit' && visaType ? visaType.description || '' : '');
            setErrors({});
        }
    }, [isOpen, mode, visaType]);

    const handleClose = () => {
        setName('');
        setDescription('');
        setErrors({});
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setErrors({ name: 'Visa type name is required' });
            return;
        }

        setProcessing(true);
        const data = { name: name.trim(), description: description.trim() };
        const options = {
            preserveScroll: true,
            preserveState: true,
            only: ['visaTypes'],
            onSuccess: () => handleClose(),
            onError: (err: Record<string, string>) => setErrors(err),
            onFinish: () => setProcessing(false),
        };

        if (mode === 'create') {
            router.post('/admin/visa-types', data, options);
        } else if (visaType) {
            router.put(`/admin/visa-types/${visaType.id}`, data, options);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className={`fa ${mode === 'create' ? 'fa-plus' : 'fa-edit'} me-2`}></i>
                            {mode === 'create' ? 'Add Visa Type' : 'Edit Visa Type'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">
                                    Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }); }}
                                    placeholder="e.g. Tourist Visa"
                                />
                                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter visa type description..."
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={processing}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'Saving...' : mode === 'create' ? 'Add Visa Type' : 'Update Visa Type'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

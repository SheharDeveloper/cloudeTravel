import { useState, useEffect } from 'react';
import {
    validateVisaForm,
    createVisa,
    updateVisa,
    type Visa,
    type VisaFormData,
} from '@/services/visaService';

interface VisaFormModalProps {
    mode: 'create' | 'edit';
    visa?: Visa | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function VisaFormModal({
    mode,
    visa,
    isOpen,
    onClose,
    onSuccess,
}: VisaFormModalProps) {
    // Form states
    const [formData, setFormData] = useState<VisaFormData>({
        name: '',
        title: '',
        description: '',
        image: null,
        status: 1,
        is_featured: true,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * INITIALIZE FORM - Set form data when modal opens
     * Pre-fills form with existing data for edit mode
     */
    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                setFormData({
                    name: '',
                    title: '',
                    description: '',
                    image: null,
                    status: 1,
                    is_featured: true,
                });
                setPreview(null);
            } else if (visa) {
                setFormData({
                    name: visa.name,
                    title: visa.title,
                    description: visa.description || '',
                    image: null,
                    status: visa.status,
                    is_featured: visa.is_featured,
                });
                setPreview(visa.image || null);
            }
            setErrors({});
        }
    }, [isOpen, mode, visa]);

    /**
     * HANDLE INPUT CHANGE - Update form fields as user types
     * @param e - Input change event
     * Updates form state in real-time and clears field errors
     */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    /**
     * HANDLE IMAGE CHANGE - Update visa image for create/edit
     * @param e - File input change event
     * Validates file type and creates preview
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file',
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            setErrors(prev => ({
                ...prev,
                image: '',
            }));
        }
    };

    /**
     * VALIDATE FORM - Check all required fields
     * Returns true if form is valid
     */
    const validateForm = () => {
        const newErrors = validateVisaForm(formData, mode === 'create');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * HANDLE FORM SUBMIT - Create or update visa
     * @param e - Form submit event
     * Submits form data to API for creating or updating visa
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setFormLoading(true);

            let response;
            if (mode === 'create') {
                response = await createVisa(formData);
            } else {
                response = await updateVisa(visa?.id || 0, formData);
            }

            if (response.ok) {
                alert(mode === 'create' ? 'Visa added successfully!' : 'Visa updated successfully!');
                onClose();
                onSuccess();
            } else {
                const error = await response.json();
                setErrors({ form: error.message || 'Failed to save visa' });
            }
        } catch (error) {
            console.error('Error saving visa:', error);
            setErrors({ form: 'Error saving visa. Please try again.' });
        } finally {
            setFormLoading(false);
        }
    };

    /**
     * HANDLE MODAL CLOSE - Close form modal
     * Clears form data and resets state
     */
    const handleCloseModal = () => {
        setFormData({
            name: '',
            title: '',
            description: '',
            image: null,
            status: 1,
            is_featured: false,
        });
        setPreview(null);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {mode === 'create' ? (
                                <>
                                    <i className="fa fa-plus me-2"></i>Add New Visa
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-edit me-2"></i>Edit Visa
                                </>
                            )}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleCloseModal}
                        ></button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Form Errors */}
                            {errors.form && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="fa fa-exclamation-circle me-2"></i>
                                    {errors.form}
                                </div>
                            )}

                            <div className="row">
                                <div className="col-md-8">
                                    {/* Visa Name */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Visa Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Schengen Visa"
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">{errors.name}</div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Title <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., European Travel Document"
                                        />
                                        {errors.title && (
                                            <div className="invalid-feedback d-block">{errors.title}</div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter visa description..."
                                        ></textarea>
                                    </div>

                                    {/* Status */}
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>

                                    {/* Featured Toggle */}
                                    <div className="mb-3">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="isFeatured"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        is_featured: e.target.checked,
                                                    }));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="isFeatured">
                                                <i className="fa fa-star me-2"></i>Featured Visa
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    {/* Image Preview */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Image {mode === 'create' && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {errors.image && (
                                            <div className="invalid-feedback d-block">{errors.image}</div>
                                        )}
                                    </div>

                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginTop: '10px',
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCloseModal}
                                disabled={formLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={formLoading}
                            >
                                {formLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        {mode === 'create' ? 'Adding...' : 'Updating...'}
                                    </>
                                ) : (
                                    <>
                                        <i className={`fa ${mode === 'create' ? 'fa-plus' : 'fa-save'} me-2`}></i>
                                        {mode === 'create' ? 'Add Visa' : 'Update Visa'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

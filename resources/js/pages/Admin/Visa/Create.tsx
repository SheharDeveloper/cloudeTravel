import { useState } from 'react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { apiFetch } from '@/lib/api';

export default function VisaCreate() {
    // Form state management
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        image: null as File | null,
        status: 1,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * HANDLE INPUT CHANGE - Update form fields
     * @param e - Input change event
     * Updates the form state when user types in input fields
     * Validates required fields in real-time
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    /**
     * HANDLE IMAGE CHANGE - Handle image file upload
     * @param e - File input change event
     * When user selects an image:
     * 1. Stores the file in formData
     * 2. Creates a preview URL for immediate display
     * 3. Validates file type (only images allowed)
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file',
                }));
                return;
            }
            // Store file and create preview
            setFormData(prev => ({
                ...prev,
                image: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            // Clear any previous image error
            setErrors(prev => ({
                ...prev,
                image: '',
            }));
        }
    };

    /**
     * VALIDATE FORM - Check if all required fields are filled
     * Returns true if form is valid, false otherwise
     * Shows error messages for each missing required field
     */
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Visa name is required';
        }
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.image && !preview) {
            newErrors.image = 'Image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * HANDLE SUBMIT - Create new visa
     * @param e - Form submit event
     * When user clicks "Add Visa" button:
     * 1. Validates form data
     * 2. Creates FormData object with file upload support
     * 3. Sends POST request to API
     * 4. Redirects to visa list on success
     * 5. Shows error message on failure
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Create FormData for file upload
            const data = new FormData();
            data.append('name', formData.name);
            data.append('title', formData.title);
            data.append('description', formData.description);
            if (formData.image) {
                data.append('image', formData.image);
            }
            data.append('status', String(formData.status));

            // Send POST request to create new visa
            const response = await apiFetch('/api/visas', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                alert('Visa added successfully!');
                // Redirect to visa list after successful creation
                window.location.href = '/admin/visa-services';
            } else {
                const error = await response.json();
                setErrors({ form: error.message || 'Failed to add visa' });
            }
        } catch (error) {
            console.error('Error adding visa:', error);
            setErrors({ form: 'Error adding visa. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    /**
     * HANDLE CANCEL - Return to visa list without saving
     * Navigates back to the visa management page
     */
    const handleCancel = () => {
        if (window.confirm('Are you sure? Any unsaved changes will be lost.')) {
            window.location.href = '/admin/visa-services';
        }
    };

    return (
        <ProtectedRoute>
            <MasterLayout title="Add New Visa">
                {/* Page Header */}
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Add New Visa</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <i className="fa fa-home me-2"></i>Dashboard
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/admin/visa-services">Visas</a>
                            </li>
                            <li className="breadcrumb-item active">Add New</li>
                        </ol>
                    </nav>
                </div>

                {/* Form Container */}
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Add New Visa Service</h5>
                            </div>
                            <div className="card-body">
                                {/* Form Error Messages */}
                                {errors.form && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <i className="fa fa-exclamation-circle me-2"></i>
                                        {errors.form}
                                        <button type="button" className="btn-close" onClick={() => setErrors({})}></button>
                                    </div>
                                )}

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Visa Name Field */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Visa Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            name="name"
                                            placeholder="e.g., Schengen Visa, India Visa"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">{errors.name}</div>
                                        )}
                                        <small className="form-text text-muted">The name of the visa type</small>
                                    </div>

                                    {/* Visa Title Field */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Title <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            name="title"
                                            placeholder="e.g., European Travel Document"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                        {errors.title && (
                                            <div className="invalid-feedback d-block">{errors.title}</div>
                                        )}
                                        <small className="form-text text-muted">Brief description or title of the visa</small>
                                    </div>

                                    {/* Description Field */}
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={4}
                                            placeholder="Detailed information about this visa type..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                        <small className="form-text text-muted">Additional details about the visa</small>
                                    </div>

                                    {/* Image Upload Field */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Image <span className="text-danger">*</span>
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
                                        <small className="form-text text-muted">Upload a visa image (JPG, PNG, etc.)</small>
                                    </div>

                                    {/* Status Field */}
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
                                        <small className="form-text text-muted">Set whether this visa is active or inactive</small>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="mb-0">
                                        <button
                                            type="submit"
                                            className="btn btn-primary me-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save me-2"></i>Add Visa
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                            disabled={loading}
                                        >
                                            <i className="fa fa-times me-2"></i>Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Image Preview Sidebar */}
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Image Preview</h5>
                            </div>
                            <div className="card-body text-center">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '8px',
                                            border: '2px dashed #ccc',
                                        }}
                                    >
                                        <div>
                                            <i className="fa fa-image" style={{ fontSize: '48px', color: '#999' }}></i>
                                            <p className="text-muted mt-2">No image selected</p>
                                        </div>
                                    </div>
                                )}
                                <small className="text-muted d-block mt-3">
                                    Upload an image to preview it here
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        </ProtectedRoute>
    );
}

import { useState, useEffect } from 'react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { apiFetch } from '@/lib/api';

// Visa data interface
interface Visa {
    id: number;
    name: string;
    title: string;
    description?: string;
    image?: string;
    status: number;
}

export default function VisaEdit() {
    // Get visa ID from URL path (e.g., /admin/visa-services/123/edit)
    const visaId = window.location.pathname.split('/')[4];

    // Form state management
    const [formData, setFormData] = useState<Visa | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * FETCH VISA DATA - Load existing visa information from API
     * Called on component mount to populate the form with current data
     * Uses the visa ID from URL to fetch specific visa details
     */
    useEffect(() => {
        const fetchVisa = async () => {
            try {
                setLoading(true);
                const response = await apiFetch(`/api/visas/${visaId}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(data.data || data);
                    if (data.image) {
                        setPreview(data.image);
                    }
                } else {
                    alert('Failed to load visa data');
                }
            } catch (error) {
                console.error('Error fetching visa:', error);
                alert('Error loading visa');
            } finally {
                setLoading(false);
            }
        };

        fetchVisa();
    }, [visaId]);

    /**
     * HANDLE INPUT CHANGE - Update form fields as user types
     * @param e - Input change event
     * Updates the form state when user modifies input fields
     * Real-time validation by clearing field errors when user starts typing
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!formData) return;

        const { name, value } = e.target;
        setFormData(prev => prev ? {
            ...prev,
            [name]: value,
        } : null);

        // Clear error for this field when user starts editing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    /**
     * HANDLE IMAGE CHANGE - Update visa image
     * @param e - File input change event
     * When user selects a new image:
     * 1. Validates that it's an image file
     * 2. Stores the file for upload
     * 3. Creates preview URL for immediate display
     * Allows user to replace the existing image
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type is image
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file',
                }));
                return;
            }

            // Store new image file
            setImageFile(file);

            // Create preview of new image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Clear any previous image errors
            setErrors(prev => ({
                ...prev,
                image: '',
            }));
        }
    };

    /**
     * VALIDATE FORM - Check all required fields are filled
     * Returns true if valid, false if errors found
     * Shows error messages for empty required fields
     */
    const validateForm = () => {
        if (!formData) return false;

        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Visa name is required';
        }
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * HANDLE SUBMIT - Update existing visa
     * @param e - Form submit event
     * When user clicks "Update Visa" button:
     * 1. Validates all form fields
     * 2. Creates FormData with updated information
     * 3. Includes new image if user selected one
     * 4. Sends PUT request to API to update visa
     * 5. Redirects to visa list on success
     * 6. Shows error on failure
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData || !validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            // Create FormData for file upload support
            const data = new FormData();
            data.append('name', formData.name);
            data.append('title', formData.title);
            data.append('description', formData.description || '');

            // Only include image if a new one was selected
            if (imageFile) {
                data.append('image', imageFile);
            }

            data.append('status', String(formData.status));

            // Send PUT request to update visa
            const response = await apiFetch(`/api/visas/${visaId}`, {
                method: 'PUT',
                body: data,
            });

            if (response.ok) {
                alert('Visa updated successfully!');
                // Redirect to visa list after successful update
                window.location.href = '/admin/visa-services';
            } else {
                const error = await response.json();
                setErrors({ form: error.message || 'Failed to update visa' });
            }
        } catch (error) {
            console.error('Error updating visa:', error);
            setErrors({ form: 'Error updating visa. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * HANDLE CANCEL - Return to visa list without saving
     * Navigates back to visa management page
     * Prompts for confirmation if form was modified
     */
    const handleCancel = () => {
        if (window.confirm('Are you sure? Any unsaved changes will be lost.')) {
            window.location.href = '/admin/visa-services';
        }
    };

    // Loading state - show spinner while fetching visa data
    if (loading) {
        return (
            <ProtectedRoute>
                <MasterLayout title="Edit Visa">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </MasterLayout>
            </ProtectedRoute>
        );
    }

    // No visa data found
    if (!formData) {
        return (
            <ProtectedRoute>
                <MasterLayout title="Edit Visa">
                    <div className="alert alert-danger">
                        <i className="fa fa-exclamation-circle me-2"></i>
                        Visa not found. <a href="/admin/visa-services">Go back to list</a>
                    </div>
                </MasterLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <MasterLayout title={`Edit Visa - ${formData.name}`}>
                {/* Page Header */}
                <div className="page-title mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li><h1>Edit Visa</h1></li>
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    <i className="fa fa-home me-2"></i>Dashboard
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <a href="/admin/visa-services">Visas</a>
                            </li>
                            <li className="breadcrumb-item active">Edit</li>
                        </ol>
                    </nav>
                </div>

                {/* Form Container */}
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Edit Visa: {formData.name}</h5>
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
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback d-block">{errors.name}</div>
                                        )}
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
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                        {errors.title && (
                                            <div className="invalid-feedback d-block">{errors.title}</div>
                                        )}
                                    </div>

                                    {/* Description Field */}
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={4}
                                            value={formData.description || ''}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    {/* Image Upload Field */}
                                    <div className="mb-3">
                                        <label className="form-label">Image</label>
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
                                        <small className="form-text text-muted">Leave empty to keep current image</small>
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
                                    </div>

                                    {/* Form Actions */}
                                    <div className="mb-0">
                                        <button
                                            type="submit"
                                            className="btn btn-primary me-2"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save me-2"></i>Update Visa
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                            disabled={submitting}
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
                                            <p className="text-muted mt-2">No image</p>
                                        </div>
                                    </div>
                                )}
                                <small className="text-muted d-block mt-3">
                                    Upload a new image to replace current one
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        </ProtectedRoute>
    );
}

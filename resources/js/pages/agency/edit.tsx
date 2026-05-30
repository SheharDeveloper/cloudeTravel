import MasterLayout from '@/layouts/backend/MasterLayout';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

interface Agency {
    id: number;
    agency_name: string;
    legal_name: string;
    email: string;
    phone_number: string;
    alternate_phone?: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    registration_number?: string;
    gst_number?: string;
    pan_number?: string;
    account_number?: string;
    ifsc_code?: string;
    note?: string;
    tax_status: number;
}

interface Props {
    agency: Agency;
}

export default function AgencyEdit({ agency: initialAgency }: Props) {
    // State management
    const [agency, setAgency] = useState(initialAgency); // Store agency data
    const [processing, setProcessing] = useState(false); // Loading state for submit/delete
    const [errors, setErrors] = useState<Record<string, string>>({}); // Form validation errors
    const [successMessage, setSuccessMessage] = useState(''); // Success message after update
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Show/hide delete confirmation modal

    /**
     * Handle form field changes
     * Updates the agency state and clears any existing error for that field
     */
    const handleChange = (field: keyof Agency, value: any) => {
        setAgency({ ...agency, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    /**
     * Handle form submission (Update Agency)
     * Sends PATCH request to /api/agencies/{id} with updated data
     * Shows error or success message based on response
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await apiFetch(`/api/agencies/${agency.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agency_name: agency.agency_name,
                    legal_name: agency.legal_name,
                    email: agency.email,
                    phone_number: agency.phone_number,
                    alternate_phone: agency.alternate_phone,
                    website: agency.website,
                    country: agency.country,
                    state: agency.state,
                    city: agency.city,
                    postal_code: agency.postal_code,
                    address: agency.address,
                    registration_number: agency.registration_number,
                    gst_number: agency.gst_number,
                    pan_number: agency.pan_number,
                    account_number: agency.account_number,
                    ifsc_code: agency.ifsc_code,
                    note: agency.note,
                    tax_status: agency.tax_status,
                }),
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    const error = await response.json();
                    setErrors(error.errors || { submit: error.message || 'Failed to update agency' });
                } else {
                    setErrors({ submit: 'Failed to update agency' });
                }
                setProcessing(false);
                return;
            }

            const result = await response.json();
            setSuccessMessage('✅ Agency updated successfully!');
            setProcessing(false);

            setTimeout(() => {
                window.location.href = '/agency';
            }, 1500);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error updating agency:', errorMsg);
            setErrors({ submit: errorMsg });
            setProcessing(false);
        }
    };

    /**
     * Show delete confirmation modal when delete button is clicked
     */
    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    /**
     * Handle delete confirmation
     * Sends DELETE request to /api/agencies/{id}
     * Redirects to agency list on success
     */
    const handleConfirmDelete = async () => {
        setProcessing(true);
        setErrors({});

        try {
            const response = await apiFetch(`/api/agencies/${agency.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Failed to delete agency' }));
                setErrors({ submit: error.message || 'Failed to delete agency' });
                setProcessing(false);
                setShowDeleteConfirm(false);
                return;
            }

            setSuccessMessage('✅ Agency deleted successfully!');
            setTimeout(() => {
                window.location.href = '/agency';
            }, 1500);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error deleting agency:', errorMsg);
            setErrors({ submit: errorMsg });
            setProcessing(false);
            setShowDeleteConfirm(false);
        }
    };

    /**
     * Cancel delete operation and hide confirmation modal
     */
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <MasterLayout title="Edit Agency">
            {/* Breadcrumb */}
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Edit Agency</h1></li>
                        <li className="breadcrumb-item">
                            <a href="/dashboard">Home</a>
                        </li>
                        <li className="breadcrumb-item"><a href="/agency">Agency</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Edit</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                {/* Left — Agency Card */}
                <div className="col-xl-3">
                    <div className="card h-auto">
                        <div className="card-body py-sm-5">
                            <div className="text-center">
                                <div className="avatar avatar-xl avatar-preview rounded-circle position-relative mx-auto">
                                    <div
                                        className="w-100 h-100 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{ width: 80, height: 80 }}
                                    >
                                        <span className="text-primary fw-bold fs-24">
                                            {agency.agency_name ? agency.agency_name.charAt(0).toUpperCase() : 'A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="clearfix mt-3">
                                    <h6 className="mb-0">{agency.agency_name || 'Agency Name'}</h6>
                                    <span className="text-muted">{agency.city || 'City'}, {agency.country || 'Country'}</span>
                                </div>
                            </div>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Email</span>
                                <span className="text-truncate ms-2" style={{ maxWidth: 140 }}>{agency.email || '—'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Phone</span>
                                <span>{agency.phone_number || '—'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Status</span>
                                <span className={`badge light ${agency.tax_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                                    {agency.tax_status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </li>
                        </ul>
                        <div className="card-footer p-4 d-grid gap-2">
                            <a href={`/agency/${agency?.id}`} className="btn btn-outline-primary">
                                View Profile
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right — Edit Form */}
                <div className="col-xl-9">
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {errors.submit && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="card-title mb-0">Agency Information</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Agency Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.agency_name ? 'is-invalid' : ''}`}
                                            value={agency.agency_name}
                                            onChange={(e) => handleChange('agency_name', e.target.value)}
                                        />
                                        {errors.agency_name && <div className="invalid-feedback d-block">{errors.agency_name}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Legal Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.legal_name ? 'is-invalid' : ''}`}
                                            value={agency.legal_name}
                                            onChange={(e) => handleChange('legal_name', e.target.value)}
                                        />
                                        {errors.legal_name && <div className="invalid-feedback d-block">{errors.legal_name}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            value={agency.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Phone <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                            value={agency.phone_number}
                                            onChange={(e) => handleChange('phone_number', e.target.value)}
                                        />
                                        {errors.phone_number && <div className="invalid-feedback d-block">{errors.phone_number}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Alternate Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.alternate_phone || ''}
                                            onChange={(e) => handleChange('alternate_phone', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Website</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.website || ''}
                                            onChange={(e) => handleChange('website', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Country <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                            value={agency.country}
                                            onChange={(e) => handleChange('country', e.target.value)}
                                        />
                                        {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">State <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                            value={agency.state}
                                            onChange={(e) => handleChange('state', e.target.value)}
                                        />
                                        {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">City <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            value={agency.city}
                                            onChange={(e) => handleChange('city', e.target.value)}
                                        />
                                        {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Postal Code <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.postal_code ? 'is-invalid' : ''}`}
                                            value={agency.postal_code}
                                            onChange={(e) => handleChange('postal_code', e.target.value)}
                                        />
                                        {errors.postal_code && <div className="invalid-feedback d-block">{errors.postal_code}</div>}
                                    </div>

                                    <div className="col-sm-12 mb-4">
                                        <label className="form-label">Address <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            value={agency.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                        />
                                        {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                                    </div>

                                    <div className="col-sm-4 mb-4">
                                        <label className="form-label">Registration Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.registration_number || ''}
                                            onChange={(e) => handleChange('registration_number', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-4 mb-4">
                                        <label className="form-label">GST Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.gst_number || ''}
                                            onChange={(e) => handleChange('gst_number', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-4 mb-4">
                                        <label className="form-label">PAN Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.pan_number || ''}
                                            onChange={(e) => handleChange('pan_number', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Account Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.account_number || ''}
                                            onChange={(e) => handleChange('account_number', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">IFSC Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={agency.ifsc_code || ''}
                                            onChange={(e) => handleChange('ifsc_code', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-12 mb-2">
                                        <label className="form-label">Notes</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={agency.note || ''}
                                            onChange={(e) => handleChange('note', e.target.value)}
                                        />
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            value={agency.tax_status}
                                            onChange={(e) => handleChange('tax_status', parseInt(e.target.value))}
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer d-flex justify-content-between gap-2">
                                <div>
                                    <button className="btn btn-primary me-2" type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'UPDATE'}
                                    </button>
                                    <a href="/agency" className="btn btn-light">Cancel</a>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteClick}
                                    disabled={processing}
                                >
                                    <i className="fa-solid fa-trash me-2"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmModal
                        show={showDeleteConfirm}
                        title="Delete Agency"
                        message="Are you sure you want to delete this agency? This action will permanently remove this agency and all associated data and cannot be undone."
                        confirmText="Delete Agency"
                        cancelText="Cancel"
                        isLoading={processing}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                </div>
            </div>
        </MasterLayout>
    );
}

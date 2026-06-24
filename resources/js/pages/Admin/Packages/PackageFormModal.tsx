import { useState, useEffect } from 'react';
import {
    validatePackageForm,
    createPackage,
    updatePackage,
    type Package,
    type PackageFormData,
} from '@/services/packageService';

interface PackageFormModalProps {
    mode: 'create' | 'edit';
    package?: Package | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PackageFormModal({
    mode,
    package: pkg,
    isOpen,
    onClose,
    onSuccess,
}: PackageFormModalProps) {
    const [formData, setFormData] = useState<PackageFormData>({
        name: '',
        title: '',
        description: '',
        image: null,
        price: '',
        currency: 'USD',
        origin_country: '',
        destination_country: '',
        hotel_name: '',
        hotel_stars: 0,
        duration_days: 0,
        travel_export_included: false,
        visa_service_included: false,
        status: 1,
        is_featured: true,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                setFormData({
                    name: '',
                    title: '',
                    description: '',
                    image: null,
                    price: '',
                    currency: 'USD',
                    origin_country: '',
                    destination_country: '',
                    hotel_name: '',
                    hotel_stars: 0,
                    duration_days: 0,
                    travel_export_included: false,
                    visa_service_included: false,
                    status: 1,
                    is_featured: false,
                });
                setPreview(null);
            } else if (pkg) {
                setFormData({
                    name: pkg.name,
                    title: pkg.title,
                    description: pkg.description || '',
                    image: null,
                    price: String(pkg.price),
                    currency: pkg.currency,
                    origin_country: pkg.origin_country || '',
                    destination_country: pkg.destination_country,
                    hotel_name: pkg.hotel_name || '',
                    hotel_stars: pkg.hotel_stars,
                    duration_days: pkg.duration_days,
                    travel_export_included: pkg.travel_export_included,
                    visa_service_included: pkg.visa_service_included,
                    status: pkg.status,
                    is_featured: pkg.is_featured,
                });
                setPreview(pkg.image || null);
            }
            setErrors({});
        }
    }, [isOpen, mode, pkg]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const fieldValue = type === 'number' ? (value ? parseInt(value) : 0) : value;

        setFormData(prev => ({
            ...prev,
            [name]: fieldValue,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

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

    const validateForm = () => {
        const newErrors = validatePackageForm(formData, mode === 'create');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setFormLoading(true);

            let response;
            if (mode === 'create') {
                response = await createPackage(formData);
            } else {
                response = await updatePackage(pkg?.id || 0, formData);
            }

            if (response.ok) {
                alert(mode === 'create' ? 'Package added successfully!' : 'Package updated successfully!');
                onClose();
                onSuccess();
            } else {
                const error = await response.json();
                setErrors({ form: error.message || 'Failed to save package' });
            }
        } catch (error) {
            console.error('Error saving package:', error);
            setErrors({ form: 'Error saving package. Please try again.' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleCloseModal = () => {
        setFormData({
            name: '',
            title: '',
            description: '',
            image: null,
            price: '',
            currency: 'USD',
            origin_country: '',
            destination_country: '',
            hotel_name: '',
            hotel_stars: 0,
            duration_days: 0,
            travel_export_included: false,
            visa_service_included: false,
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
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {mode === 'create' ? (
                                <>
                                    <i className="fa fa-plus me-2"></i>Add New Package
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-edit me-2"></i>Edit Package
                                </>
                            )}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleCloseModal}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {errors.form && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="fa fa-exclamation-circle me-2"></i>
                                    {errors.form}
                                </div>
                            )}

                            <div className="row">
                                <div className="col-md-8">
                                    {/* Package Name */}
                                    <div className="mb-3">
                                        <label className="form-label">Package Name <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            name="name" value={formData.name} onChange={handleInputChange}
                                            placeholder="e.g., Europe Tour Package" />
                                        {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                                    </div>

                                    {/* Title */}
                                    <div className="mb-3">
                                        <label className="form-label">Title <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            name="title" value={formData.title} onChange={handleInputChange}
                                            placeholder="e.g., Best Europe Tour" />
                                        {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                                    </div>

                                    {/* Price and Currency */}
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label className="form-label">Price <span className="text-danger">*</span></label>
                                                <input type="number" step="0.01" className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                                    name="price" value={formData.price} onChange={handleInputChange}
                                                    placeholder="0.00" />
                                                {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Currency</label>
                                                <select className="form-control" name="currency" value={formData.currency} onChange={handleInputChange}>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                    <option value="INR">INR</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Origin and Destination */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Origin Country</label>
                                                <input type="text" className="form-control" name="origin_country"
                                                    value={formData.origin_country} onChange={handleInputChange}
                                                    placeholder="e.g., India" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Destination Country <span className="text-danger">*</span></label>
                                                <input type="text" className={`form-control ${errors.destination_country ? 'is-invalid' : ''}`}
                                                    name="destination_country" value={formData.destination_country} onChange={handleInputChange}
                                                    placeholder="e.g., Switzerland" />
                                                {errors.destination_country && <div className="invalid-feedback d-block">{errors.destination_country}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hotel Details */}
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label className="form-label">Hotel Name</label>
                                                <input type="text" className="form-control" name="hotel_name"
                                                    value={formData.hotel_name} onChange={handleInputChange}
                                                    placeholder="e.g., Grand Hotel" />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Hotel Stars</label>
                                                <select className="form-control" name="hotel_stars" value={formData.hotel_stars} onChange={handleInputChange}>
                                                    <option value="0">Select Stars</option>
                                                    <option value="1">1 Star</option>
                                                    <option value="2">2 Stars</option>
                                                    <option value="3">3 Stars</option>
                                                    <option value="4">4 Stars</option>
                                                    <option value="5">5 Stars</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="mb-3">
                                        <label className="form-label">Duration (Days)</label>
                                        <input type="number" className="form-control" name="duration_days"
                                            value={formData.duration_days} onChange={handleInputChange}
                                            placeholder="Number of days" />
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" name="description" rows={3}
                                            value={formData.description} onChange={handleInputChange}
                                            placeholder="Package description..."></textarea>
                                    </div>

                                    {/* Services and Status */}
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="travelExport"
                                                name="travel_export_included" checked={formData.travel_export_included}
                                                onChange={handleCheckboxChange} />
                                            <label className="form-check-label" htmlFor="travelExport">
                                                <i className="fa fa-passport me-2"></i>Travel Export Included
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="visaService"
                                                name="visa_service_included" checked={formData.visa_service_included}
                                                onChange={handleCheckboxChange} />
                                            <label className="form-check-label" htmlFor="visaService">
                                                <i className="fa fa-bookmark me-2"></i>Visa Service Included
                                            </label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Status</label>
                                                <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                                                    <option value={1}>Active</option>
                                                    <option value={0}>Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="isFeatured"
                                                        name="is_featured" checked={formData.is_featured}
                                                        onChange={handleCheckboxChange} />
                                                    <label className="form-check-label" htmlFor="isFeatured">
                                                        <i className="fa fa-star me-2"></i>Featured Package
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <label className="form-label">Image</label>
                                        <input type="file" className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            name="image" accept="image/*" onChange={handleImageChange} />
                                        {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}
                                    </div>

                                    {preview && (
                                        <img src={preview} alt="Preview" style={{
                                            maxWidth: '100%', maxHeight: '200px', objectFit: 'cover',
                                            borderRadius: '8px', marginTop: '10px',
                                        }} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={formLoading}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                {formLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        {mode === 'create' ? 'Adding...' : 'Updating...'}
                                    </>
                                ) : (
                                    <>
                                        <i className={`fa ${mode === 'create' ? 'fa-plus' : 'fa-save'} me-2`}></i>
                                        {mode === 'create' ? 'Add Package' : 'Update Package'}
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

import { useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

type AgencyDocument = {
    document_name: string;
    document_type: string;
    file: File | null;
};

export default function AgencyB2BCreate() {
    const { services, zipCodes, addressData } = usePage().props as any;
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    const [data, setData] = useState({
        agency_name: '',
        legal_name: '',
        email: '',
        phone_number: '',
        tax_status: 1,
        registration_number: '',
        gst_number: '',
        pan_number: '',
        account_number: '',
        ifsc_code: '',
        note: '',
        services: [] as string[],
        logo: null as File | null,
        has_domain: false,
        domain_name: '',
        zip_code_id: '',
        address_id: '',
        street_id: '',
        city: '',
        county: '',
        country: '',
        address_name: '',
        street_name: '',
        documents: [
            {
                document_name: '',
                document_type: '',
                file: null,
            },
        ] as AgencyDocument[],
    });

    const addDocument = () => {
        setData({
            ...data,
            documents: [
                ...data.documents,
                {
                    document_name: '',
                    document_type: '',
                    file: null,
                },
            ],
        });
    };

    const removeDocument = (index: number) => {
        setData({
            ...data,
            documents: data.documents.filter((_, i) => i !== index),
        });
    };

    const updateDocument = (index: number, field: keyof AgencyDocument, value: any) => {
        const updatedDocuments = [...data.documents];
        updatedDocuments[index] = {
            ...updatedDocuments[index],
            [field]: value,
        };
        setData({
            ...data,
            documents: updatedDocuments,
        });
    };

    const validateForm = (): boolean => {
        const requiredFields = ['agency_name', 'legal_name', 'email', 'phone_number'];
        const newErrors: Record<string, string> = {};
        const phoneRegex = /^[0-9\-\+\s]+$/;

        requiredFields.forEach((field) => {
            const value = data[field as keyof typeof data];
            if (!value || (typeof value === 'string' && !value.trim())) {
                const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                newErrors[field] = `${fieldName} is required`;
            }
        });

        if (data.phone_number && !phoneRegex.test(data.phone_number)) {
            newErrors.phone_number = 'Phone number can only contain digits, hyphens, plus signs, and spaces';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        return true;
    };

    const handleNext = async () => {
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('step', step.toString());

        // Add only step-specific data fields to FormData
        if (step === 1) {
            // Step 1 fields
            formData.append('agency_name', data.agency_name);
            formData.append('legal_name', data.legal_name);
            formData.append('email', data.email);
            formData.append('phone_number', data.phone_number);
            if (data.logo) {
                formData.append('logo', data.logo);
            }
            formData.append('has_domain', data.has_domain ? '1' : '0');
            if (data.has_domain) {
                formData.append('domain_name', data.domain_name);
            }
        } else if (step === 2) {
            // Step 2 fields
            formData.append('country', data.country);
            formData.append('zip_code_id', data.zip_code_id);
            formData.append('address_id', data.address_id);
            formData.append('street_id', data.street_id);
            formData.append('county', data.county);
        } else if (step === 3) {
            // Step 3 fields
            data.services.forEach((service: string) => {
                formData.append('services[]', service);
            });
        }

        try {
            const response = await axios.post('/admin/agency-b2b/validate-step', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                setStep(step + 1);
                setErrors({});
            }
        } catch (error: any) {
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors || {};
                const formattedErrors: Record<string, string> = {};
                Object.keys(backendErrors).forEach(key => {
                    if (Array.isArray(backendErrors[key])) {
                        formattedErrors[key] = backendErrors[key][0];
                    } else {
                        formattedErrors[key] = backendErrors[key];
                    }
                });
                setErrors(formattedErrors);
            } else {
                setErrors({ submit: 'An error occurred during validation' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const submit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            const formData = new FormData();

            formData.append('agency_name', data.agency_name);
            formData.append('legal_name', data.legal_name);
            formData.append('email', data.email);
            formData.append('phone_number', data.phone_number);
            formData.append('country', data.country);
            formData.append('state', data.county || '');
            formData.append('city', data.city || '');
            formData.append('registration_number', data.registration_number);
            formData.append('gst_number', data.gst_number);
            formData.append('pan_number', data.pan_number);
            formData.append('account_number', data.account_number);
            formData.append('ifsc_code', data.ifsc_code);
            formData.append('note', data.note);
            formData.append('address', data.address_name || '');
            data.services.forEach((service: string) => {
                formData.append('services[]', service);
            });
            formData.append('has_domain', data.has_domain ? '1' : '0');
            formData.append('zip_code_id', data.zip_code_id);
            formData.append('address_id', data.address_id);
            formData.append('street_id', data.street_id);
            formData.append('tax_status', data.tax_status.toString());

            if (data.has_domain && data.domain_name) {
                formData.append('domain_name', data.domain_name);
            }
            if (data.logo) {
                formData.append('logo', data.logo);
            }

            // Add documents
            data.documents.forEach((doc, index) => {
                if (doc.file) {
                    formData.append(`documents[${index}][file]`, doc.file);
                }
                if (doc.document_name) {
                    formData.append(`documents[${index}][document_name]`, doc.document_name);
                }
                if (doc.document_type) {
                    formData.append(`documents[${index}][document_type]`, doc.document_type);
                }
            });

            router.post('/admin/agency-b2b', formData, {
                onSuccess: () => {
                    setSuccessMessage('Agency created successfully!');
                    setTimeout(() => {
                        router.visit('/admin/agency-b2b');
                    }, 1500);
                },
                onError: (errors) => {
                    console.log(errors);
                    setErrors(errors);
                    setProcessing(false);
                },
            });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            setErrors({ submit: errorMsg });
            setProcessing(false);
        }
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Add Agency</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/agency-b2b">Agency Management</a></li>
                        <li className="breadcrumb-item active">Add New</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-xl-3">
                    <div className="card h-auto">
                        <div className="card-body py-sm-5">
                            <div className="text-center">
                                {data.logo ? (
                                    <img
                                        src={URL.createObjectURL(data.logo)}
                                        alt="Agency Logo"
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            border: '2px solid #ddd',
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="w-100 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto"
                                        style={{ width: 80, height: 80 }}
                                    >
                                        <span className="text-primary fw-bold fs-24">
                                            {data.agency_name ? data.agency_name.charAt(0).toUpperCase() : 'A'}
                                        </span>
                                    </div>
                                )}

                                <div className="clearfix mt-3">
                                    <h6 className="mb-0">{data.agency_name || 'Agency Name'}</h6>
                                    <span className="text-muted">
                                        {data.city || 'City'}, {data.country || 'Country'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Email</span>
                                <span className="text-truncate ms-2" style={{ maxWidth: 140 }}>
                                    {data.email || '—'}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Phone</span>
                                <span>{data.phone_number || '—'}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between py-3">
                                <span className="text-muted">Tax Status</span>
                                <span className={`badge light ${data.tax_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                                    {data.tax_status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </li>
                        </ul>

                        <div className="card-footer p-4">
                            <a href="/admin/agency-b2b" className="btn btn-outline-primary w-100">
                                Back To List
                            </a>
                        </div>
                    </div>
                </div>

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
                    <form onSubmit={submit}>
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="card-title mb-0">Agency Setup</h6>
                            </div>

                            <div className="card-body">
                                <div className="d-flex gap-2 mb-4">
                                    <span className={`badge ${step === 1 ? 'bg-primary' : 'bg-light text-dark'}`}>
                                        1. Basic
                                    </span>
                                    <span className={`badge ${step === 2 ? 'bg-primary' : 'bg-light text-dark'}`}>
                                        2. Address
                                    </span>
                                    <span className={`badge ${step === 3 ? 'bg-primary' : 'bg-light text-dark'}`}>
                                        3. Other Info
                                    </span>
                                    <span className={`badge ${step === 4 ? 'bg-primary' : 'bg-light text-dark'}`}>
                                        4. Documents
                                    </span>
                                </div>

                                {step === 1 && (
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Agency Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.agency_name ? 'is-invalid' : ''}`}
                                                value={data.agency_name}
                                                onChange={(e) => {
                                                    setData({ ...data, agency_name: e.target.value });
                                                    if (errors.agency_name) {
                                                        const newErrors = { ...errors };
                                                        delete newErrors.agency_name;
                                                        setErrors(newErrors);
                                                    }
                                                }}
                                            />
                                            {errors.agency_name && <div className="invalid-feedback">{errors.agency_name}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Legal Name </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.legal_name ? 'is-invalid' : ''}`}
                                                value={data.legal_name}
                                                onChange={(e) => setData({ ...data, legal_name: e.target.value })}
                                            />
                                            {errors.legal_name && <div className="invalid-feedback">{errors.legal_name}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Email </label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                value={data.email}
                                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                            />
                                            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Phone </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                                value={data.phone_number}
                                                onChange={(e) => setData({ ...data, phone_number: e.target.value })}
                                            />
                                            {errors.phone_number && <div className="invalid-feedback d-block">{errors.phone_number}</div>}
                                        </div>

                                        <div className="col-12 col-sm-6 mb-4">
                                            <label className="form-label">Agency Logo </label>
                                            <input
                                                type="file"
                                                className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
                                                accept="image/*"
                                                onChange={(e) => {
                                                    setData({ ...data, logo: e.target.files ? e.target.files[0] : null });
                                                    if (errors.logo) {
                                                        const newErrors = { ...errors };
                                                        delete newErrors.logo;
                                                        setErrors(newErrors);
                                                    }
                                                }}
                                            />
                                            {data.logo && (
                                                <small className="text-muted d-block mt-1">{data.logo.name}</small>
                                            )}
                                            {errors.logo && <div className="invalid-feedback d-block">{errors.logo}</div>}
                                        </div>

                                        <div className="col-12 col-sm-6 mb-4">
                                            <div className="form-check mt-4">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="has_domain"
                                                    checked={data.has_domain}
                                                    onChange={(e) => setData({ ...data, has_domain: e.target.checked, domain_name: '' })}
                                                />
                                                <label className="form-check-label" htmlFor="has_domain">
                                                    Do you have a Domain?
                                                </label>
                                            </div>
                                        </div>

                                        {data.has_domain && (
                                            <div className="col-12 col-sm-6 mb-4">
                                                <label className="form-label">Domain </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.domain_name ? 'is-invalid' : ''}`}
                                                    placeholder="Enter domain name"
                                                    value={data.domain_name}
                                                    onChange={(e) => {
                                                        setData({ ...data, domain_name: e.target.value });
                                                        if (errors.domain_name) {
                                                            const newErrors = { ...errors };
                                                            delete newErrors.domain_name;
                                                            setErrors(newErrors);
                                                        }
                                                    }}
                                                />
                                                {errors.domain_name && <div className="invalid-feedback d-block">{errors.domain_name}</div>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="row">
                                        {/* Zip Code Selection */}
                                        <div className="col-12 col-sm-6 mb-4">
                                            <label className="form-label">Zip Code </label>
                                            <select
                                                className="form-select"
                                                value={data.zip_code_id}
                                                onChange={(e) => {
                                                    const zipId = e.target.value;
                                                    // Get zip code data from addressData
                                                    const zipCodeObj = addressData && addressData.find((z: any) => z.id === zipId);

                                                    if (zipId && zipCodeObj) {
                                                        // Auto-fill country, county, and city from zip code data
                                                        setData({
                                                            ...data,
                                                            zip_code_id: zipId,
                                                            address_id: '',
                                                            street_id: '',
                                                            country: zipCodeObj.country || 'United Kingdom',
                                                            county: zipCodeObj.county || '',
                                                            city: zipCodeObj.city || '',
                                                        });
                                                    } else {
                                                        setData({
                                                            ...data,
                                                            zip_code_id: '',
                                                            address_id: '',
                                                            street_id: '',
                                                            country: '',
                                                            county: '',
                                                        });
                                                    }
                                                }}
                                            >
                                                <option value="">-- Select Zip Code --</option>
                                                {zipCodes && Object.entries(zipCodes).map(([id, name]: [string, any]) => (
                                                    <option key={id} value={id}>{String(name)}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Address Selection - Only show if Zip Code is selected */}
                                        {data.zip_code_id && (
                                            <div className="col-sm-6 mb-4">
                                                <label className="form-label">Address</label>
                                                <select
                                                    className={`form-select ${errors.address_id ? 'is-invalid' : ''}`}
                                                    value={data.address_id}
                                                    onChange={(e) => {
                                                        setData({ ...data, address_id: e.target.value, street_id: '', address_name: e.target.options[e.target.selectedIndex].text });
                                                        if (errors.address_id) {
                                                            const newErrors = { ...errors };
                                                            delete newErrors.address_id;
                                                            setErrors(newErrors);
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Select Address --</option>
                                                    {addressData && (() => {
                                                        const zipCodeObj = addressData.find((z: any) => z.id === data.zip_code_id);
                                                        return zipCodeObj?.addresses.map((addr: any) => (
                                                            <option key={addr.id} value={addr.id}>{addr.name}</option>
                                                        ));
                                                    })()}
                                                </select>
                                                {errors.address_id && <div className="invalid-feedback d-block">{errors.address_id}</div>}
                                            </div>
                                        )}

                                        {/* Street Selection - Only show if Address is selected */}
                                        {data.address_id && (
                                            <div className="col-sm-6 mb-4">
                                                <label className="form-label">Street</label>
                                                <select
                                                    className={`form-select ${errors.street_id ? 'is-invalid' : ''}`}
                                                    value={data.street_id}
                                                    onChange={(e) => {
                                                        setData({ ...data, street_id: e.target.value, street_name: e.target.options[e.target.selectedIndex].text });
                                                        if (errors.street_id) {
                                                            const newErrors = { ...errors };
                                                            delete newErrors.street_id;
                                                            setErrors(newErrors);
                                                        }
                                                    }}
                                                >
                                                    <option value="">-- Select Street --</option>
                                                    {addressData && (() => {
                                                        const zipCodeObj = addressData.find((z: any) => z.id === data.zip_code_id);
                                                        const addressObj = zipCodeObj?.addresses.find((a: any) => a.id === data.address_id);
                                                        return addressObj?.streets.map((street: any) => (
                                                            <option key={street.id} value={street.id}>{street.name}</option>
                                                        ));
                                                    })()}
                                                </select>
                                                {errors.street_id && <div className="invalid-feedback d-block">{errors.street_id}</div>}
                                            </div>
                                        )}

                                        {/* Auto-filled Country */}
                                        <div className="col-12 col-sm-6 mb-4">
                                            <label className="form-label">Country</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                                value={data.country}
                                                disabled
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                            {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                        </div>

                                        {/* Auto-filled County */}
                                        <div className="col-12 col-sm-6 mb-4">
                                            <label className="form-label">County</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.county}
                                                disabled
                                                style={{ backgroundColor: '#e9ecef' }}
                                            />
                                        </div>

                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="row">
                                        <div className="col-sm-12 mb-4">
                                            <label className="form-label">Services</label>
                                            <div>
                                                {data.services.length > 0 && (
                                                    <div className="mb-2 d-flex flex-wrap gap-2">
                                                        {data.services.map((serviceId: string) => {
                                                            const service = services?.find((s: any) => s?.id === serviceId);
                                                            return (
                                                                <span key={serviceId} className="badge bg-primary">
                                                                    {service?.name || serviceId}
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close btn-close-white ms-2"
                                                                        style={{ padding: '2px 6px' }}
                                                                        onClick={() => {
                                                                            setData({
                                                                                ...data,
                                                                                services: data.services.filter((s: string) => s !== serviceId),
                                                                            });
                                                                            if (errors.services) {
                                                                                const newErrors = { ...errors };
                                                                                delete newErrors.services;
                                                                                setErrors(newErrors);
                                                                            }
                                                                        }}
                                                                    />
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                <div className={`dropdown ${errors.services ? 'is-invalid' : ''}`} style={{ borderRadius: '4px', border: errors.services ? '1px solid #dc3545' : 'none' }}>
                                                    <button
                                                        className={`form-select text-start ${errors.services ? 'is-invalid' : ''}`}
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        style={{ textAlign: 'left' }}
                                                    >
                                                        {data.services.length === 0 ? 'Select Services...' : `${data.services.length} service(s) selected`}
                                                    </button>
                                                    <ul className="dropdown-menu w-100">
                                                        <li className="px-3 py-2">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm"
                                                                placeholder="Search services..."
                                                                id="serviceSearch"
                                                                onChange={(e) => {
                                                                    const searchTerm = e.target.value.toLowerCase();
                                                                    const items = document.querySelectorAll('[data-service-item]');
                                                                    items.forEach((item) => {
                                                                        const text = item.textContent?.toLowerCase() || '';
                                                                        if (text.includes(searchTerm)) {
                                                                            (item as HTMLElement).style.display = '';
                                                                        } else {
                                                                            (item as HTMLElement).style.display = 'none';
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </li>
                                                        <li>
                                                            <hr className="dropdown-divider m-0" />
                                                        </li>
                                                        {services && Array.isArray(services) && services.map((service: any) => (
                                                            <li key={service?.id} data-service-item>
                                                                <label className="dropdown-item d-flex align-items-center py-2 px-3 mb-0" style={{ cursor: 'pointer' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input me-2"
                                                                        checked={data.services.includes(service?.id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setData({
                                                                                    ...data,
                                                                                    services: [...data.services, service?.id],
                                                                                });
                                                                            } else {
                                                                                setData({
                                                                                    ...data,
                                                                                    services: data.services.filter((s: string) => s !== service?.id),
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    {service?.name || ''}
                                                                </label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {errors.services && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '4px' }}>{errors.services}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-lg-4 mb-4">
                                            <label className="form-label">Tax Status</label>
                                            <select
                                                className={`form-select ${errors.tax_status ? 'is-invalid' : ''}`}
                                                value={data.tax_status}
                                                onChange={(e) => {
                                                    setData({ ...data, tax_status: parseInt(e.target.value) });
                                                    if (errors.tax_status) {
                                                        const newErrors = { ...errors };
                                                        delete newErrors.tax_status;
                                                        setErrors(newErrors);
                                                    }
                                                }}
                                            >
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </select>
                                            {errors.tax_status && <div className="invalid-feedback d-block">{errors.tax_status}</div>}
                                        </div>

                                        <div className="col-12 col-lg-4 mb-4">
                                            <label className="form-label">Registration Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.registration_number ? 'is-invalid' : ''}`}
                                                value={data.registration_number}
                                                onChange={(e) => setData({ ...data, registration_number: e.target.value })}
                                            />
                                            {errors.registration_number && <div className="invalid-feedback d-block">{errors.registration_number}</div>}
                                        </div>

                                        <div className="col-12 col-lg-4 mb-4">
                                            <label className="form-label">GST Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.gst_number ? 'is-invalid' : ''}`}
                                                value={data.gst_number}
                                                onChange={(e) => setData({ ...data, gst_number: e.target.value })}
                                            />
                                            {errors.gst_number && <div className="invalid-feedback d-block">{errors.gst_number}</div>}
                                        </div>

                                        <div className="col-12 col-lg-4 mb-4">
                                            <label className="form-label">PAN Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.pan_number ? 'is-invalid' : ''}`}
                                                value={data.pan_number}
                                                onChange={(e) => setData({ ...data, pan_number: e.target.value })}
                                            />
                                            {errors.pan_number && <div className="invalid-feedback d-block">{errors.pan_number}</div>}
                                        </div>

                                        <div className="col-12 col-lg-4 mb-4">
                                            <label className="form-label">Account Number</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.account_number ? 'is-invalid' : ''}`}
                                                value={data.account_number}
                                                onChange={(e) => setData({ ...data, account_number: e.target.value })}
                                            />
                                            {errors.account_number && <div className="invalid-feedback d-block">{errors.account_number}</div>}
                                        </div>

                                        <div className="col-12 col-lg-4 mb-4">
                                            <label className="form-label">IFSC Code</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.ifsc_code ? 'is-invalid' : ''}`}
                                                value={data.ifsc_code}
                                                onChange={(e) => setData({ ...data, ifsc_code: e.target.value })}
                                            />
                                            {errors.ifsc_code && <div className="invalid-feedback d-block">{errors.ifsc_code}</div>}
                                        </div>

                                        <div className="col-sm-12 mb-2">
                                            <label className="form-label">Notes</label>
                                            <textarea
                                                className={`form-control ${errors.note ? 'is-invalid' : ''}`}
                                                rows={4}
                                                value={data.note}
                                                onChange={(e) => setData({ ...data, note: e.target.value })}
                                            />
                                            {errors.note && <div className="invalid-feedback d-block">{errors.note}</div>}
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Agency Documents</h6>
                                            <button type="button" className="btn btn-sm btn-primary" onClick={addDocument}>
                                                <i className="fa fa-plus me-1"></i>Add More
                                            </button>
                                        </div>

                                        {data.documents.map((document, index) => (
                                            <div className="border-2 rounded p-4 mb-3" key={index} style={{ borderColor: '#dee2e6', borderWidth: '2px' }}>
                                                <div className="row">
                                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                                        <label className="form-label">Document Name</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors[`document_name_${index}`] ? 'is-invalid' : ''}`}
                                                            placeholder="GST, PAN, License"
                                                            value={document.document_name}
                                                            onChange={(e) => updateDocument(index, 'document_name', e.target.value)}
                                                        />
                                                        {errors[`document_name_${index}`] && <div className="invalid-feedback d-block">{errors[`document_name_${index}`]}</div>}
                                                    </div>

                                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                                        <label className="form-label">Document Type</label>
                                                        <select
                                                            className={`form-select ${errors[`document_type_${index}`] ? 'is-invalid' : ''}`}
                                                            value={document.document_type}
                                                            onChange={(e) => updateDocument(index, 'document_type', e.target.value)}
                                                        >
                                                            <option value="">Select Type</option>
                                                            <option value="gst">GST</option>
                                                            <option value="pan">PAN</option>
                                                            <option value="license">License</option>
                                                            <option value="agreement">Agreement</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                        {errors[`document_type_${index}`] && <div className="invalid-feedback d-block">{errors[`document_type_${index}`]}</div>}
                                                    </div>

                                                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                                                        <label className="form-label">Upload File/Image</label>
                                                        <input
                                                            type="file"
                                                            className={`form-control ${errors[`document_file_${index}`] ? 'is-invalid' : ''}`}
                                                            accept="image/*,.pdf,.doc,.docx"
                                                            onChange={(e) => updateDocument(index, 'file', e.target.files ? e.target.files[0] : null)}
                                                        />
                                                        {document.file && (
                                                            <small className="text-muted d-block mt-1">{document.file.name}</small>
                                                        )}
                                                        {errors[`document_file_${index}`] && <div className="invalid-feedback d-block">{errors[`document_file_${index}`]}</div>}
                                                    </div>

                                                    <div className="col-12 col-md-6 col-lg-3 mb-3 d-flex align-items-end">
                                                        {data.documents.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger w-100"
                                                                onClick={() => removeDocument(index)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {document.file && document.file.type.startsWith('image/') && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={URL.createObjectURL(document.file)}
                                                            alt="Preview"
                                                            style={{
                                                                width: 120,
                                                                height: 90,
                                                                objectFit: 'cover',
                                                                borderRadius: 8,
                                                                border: '1px solid #ddd',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="card-footer d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    disabled={step === 1}
                                    onClick={() => setStep(step - 1)}
                                >
                                    Previous
                                </button>

                                {step < 4 ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleNext}
                                        disabled={processing}
                                    >
                                        {processing ? 'Validating...' : 'Next'}
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'SAVE'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

import MasterLayout from '@/layouts/backend/MasterLayout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

type AgencyDocument = {
    document_name: string;
    document_type: string;
    file: File | null;
};

export default function AgencyCreate() {
    const { auth } = usePage().props;
    const userId = auth?.user?.id || 1;

    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    const [data, setData] = useState({
        agency_name: '',
        legal_name: '',
        email: '',
        phone_number: '',
        alternate_phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        tax_status: 1,
        registration_number: '',
        gst_number: '',
        pan_number: '',
        account_number: '',
        ifsc_code: '',
        note: '',
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
        const requiredFields = [
            'agency_name',
            'legal_name',
            'email',
            'phone_number',
            'country',
            'state',
            'city',
            'postal_code',
            'address',
        ];

        const newErrors: Record<string, string> = {};
        const phoneRegex = /^[0-9\-\+\s]+$/;

        requiredFields.forEach((field) => {
            const value = data[field as keyof typeof data];
            if (!value || (typeof value === 'string' && !value.trim())) {
                const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                newErrors[field] = `${fieldName} is required`;
            }
        });

        // Validate phone number format
        if (data.phone_number && !phoneRegex.test(data.phone_number)) {
            newErrors.phone_number = 'Phone number can only contain digits, hyphens, plus signs, and spaces';
        }

        // Validate alternate phone format if provided
        if (data.alternate_phone && !phoneRegex.test(data.alternate_phone)) {
            newErrors.alternate_phone = 'Alternate phone can only contain digits, hyphens, plus signs, and spaces';
        }

        // Validate email format
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

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setProcessing(true);
        setErrors({});

        try {
            const formData = new FormData();

            console.log('=== SUBMITTING AGENCY DATA ===');
            console.log('User ID:', userId);

            // Add agency data
            formData.append('user_id', userId.toString());
            formData.append('agency_name', data.agency_name);
            formData.append('legal_name', data.legal_name);
            formData.append('email', data.email);
            formData.append('phone_number', data.phone_number);
            formData.append('alternate_phone', data.alternate_phone);
            formData.append('website', data.website || '');
            formData.append('country', data.country);
            formData.append('state', data.state);
            formData.append('city', data.city);
            formData.append('postal_code', data.postal_code);
            formData.append('address', data.address);
            formData.append('registration_number', data.registration_number);
            formData.append('gst_number', data.gst_number);
            formData.append('pan_number', data.pan_number);
            formData.append('account_number', data.account_number);
            formData.append('ifsc_code', data.ifsc_code);
            formData.append('note', data.note);
            formData.append('tax_status', data.tax_status.toString());

            // Add document files
            data.documents.forEach((doc, index) => {
                if (doc.file) {
                    formData.append(`documents[${index}][name]`, doc.document_name);
                    formData.append(`documents[${index}][type]`, doc.document_type);
                    formData.append(`documents[${index}][file]`, doc.file);
                }
            });

            const response = await apiFetch('/api/agencies', {
                method: 'POST',
                body: formData,
            });

            const contentType = response.headers.get('content-type');
            let responseData: any = null;

            try {
                if (contentType?.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    const text = await response.text();
                    console.error('Non-JSON response received. Status:', response.status);
                    console.error('Response text:', text.substring(0, 500));

                    // If response is HTML with validation errors, extract them
                    if (text.includes('errors')) {
                        try {
                            const match = text.match(/"errors"\s*:\s*({[^}]*})/);
                            if (match) {
                                const errorsStr = match[1];
                                const errorsObj = JSON.parse(errorsStr);
                                setErrors(errorsObj);
                                setProcessing(false);
                                return;
                            }
                        } catch (e) {
                            console.error('Failed to extract errors from HTML:', e);
                        }
                    }

                    throw new Error(`Server error: Invalid response format. Status: ${response.status}`);
                }
            } catch (e) {
                console.error('Failed to parse response:', e);
                const errorMsg = e instanceof Error ? e.message : 'Failed to parse server response';
                setErrors({ submit: errorMsg });
                setProcessing(false);
                return;
            }

            if (!response.ok) {
                const errorObj = responseData.errors || { submit: responseData.message || 'Failed to create agency' };
                setErrors(errorObj);
                setProcessing(false);
                return;
            }

            const result = responseData;
            console.log('✅ Agency created successfully!');
            console.log('Response:', result);
            setSuccessMessage('✅ Agency created successfully! User account created with password: agency');
            setProcessing(false);

            // Reset form to add another agency
            setStep(1);
            setData({
                agency_name: '',
                legal_name: '',
                email: '',
                phone_number: '',
                alternate_phone: '',
                website: '',
                address: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
                tax_status: 1,
                registration_number: '',
                gst_number: '',
                pan_number: '',
                account_number: '',
                ifsc_code: '',
                note: '',
                documents: [
                    {
                        document_name: '',
                        document_type: '',
                        file: null,
                    },
                ],
            });

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            console.error('❌ Error submitting agency:', errorMsg);
            setErrors({ submit: errorMsg });
            setProcessing(false);
            setSuccessMessage('');
        }
    };

    return (
        <MasterLayout title="Add Agency">
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li>
                            <h1>Add Agency</h1>
                        </li>

                        <li className="breadcrumb-item">
                            <a href="/dashboard">Home</a>
                        </li>

                        <li className="breadcrumb-item">
                            <a href="/agency">Agency</a>
                        </li>

                        <li className="breadcrumb-item active">Add</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
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
                                            {data.agency_name ? data.agency_name.charAt(0).toUpperCase() : 'A'}
                                        </span>
                                    </div>

                                    <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="btn btn-square btn-primary btn-sm position-absolute bottom-0 end-0 shadow-sm rounded-circle border-2 border-white"
                                    >
                                        <i className="fa fa-camera"></i>
                                    </a>
                                </div>

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

                                <span
                                    className={`badge light ${
                                        data.tax_status === 1
                                            ? 'badge-success'
                                            : 'badge-danger'
                                    }`}
                                >
                                    {data.tax_status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </li>
                        </ul>

                        <div className="card-footer p-4">
                            <a href="/agency" className="btn btn-outline-primary w-100">
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
                                        2. Business
                                    </span>
                                    <span className={`badge ${step === 3 ? 'bg-primary' : 'bg-light text-dark'}`}>
                                        3. Documents
                                    </span>
                                </div>

                                {step === 1 && (
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Agency Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.agency_name ? 'is-invalid' : ''}`}
                                                value={data.agency_name}
                                                onChange={(e) => setData({ ...data, agency_name: e.target.value })}
                                            />
                                            {errors.agency_name && <div className="invalid-feedback">{errors.agency_name}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Legal Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.legal_name}
                                                onChange={(e) => setData({ ...data, legal_name: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Email <span className="text-danger">*</span></label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                value={data.email}
                                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                            />
                                            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Phone <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                                value={data.phone_number}
                                                onChange={(e) => setData({ ...data, phone_number: e.target.value })}
                                            />
                                            {errors.phone_number && <div className="invalid-feedback d-block">{errors.phone_number}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Alternate Phone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.alternate_phone}
                                                onChange={(e) => setData({ ...data, alternate_phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Website</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.website || ''}
                                                onChange={(e) => setData({ ...data, website: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Tax Status</label>
                                            <select
                                                className="form-select"
                                                value={data.tax_status}
                                                onChange={(e) => setData({ ...data, tax_status: parseInt(e.target.value) })}
                                            >
                                                <option value={1}>Active</option>
                                                <option value={0}>Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Country <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                                value={data.country}
                                                onChange={(e) => setData({ ...data, country: e.target.value })}
                                            />
                                            {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">State <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                value={data.state}
                                                onChange={(e) => setData({ ...data, state: e.target.value })}
                                            />
                                            {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">City <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                value={data.city}
                                                onChange={(e) => setData({ ...data, city: e.target.value })}
                                            />
                                            {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Postal Code <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.postal_code ? 'is-invalid' : ''}`}
                                                value={data.postal_code}
                                                onChange={(e) => setData({ ...data, postal_code: e.target.value })}
                                            />
                                            {errors.postal_code && <div className="invalid-feedback d-block">{errors.postal_code}</div>}
                                        </div>

                                        <div className="col-sm-12 mb-4">
                                            <label className="form-label">Address <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                value={data.address}
                                                onChange={(e) => setData({ ...data, address: e.target.value })}
                                            />
                                            {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                                        </div>

                                        <div className="col-sm-4 mb-4">
                                            <label className="form-label">Registration Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.registration_number}
                                                onChange={(e) => setData({ ...data, registration_number: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-4 mb-4">
                                            <label className="form-label">GST Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.gst_number}
                                                onChange={(e) => setData({ ...data, gst_number: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-4 mb-4">
                                            <label className="form-label">PAN Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.pan_number}
                                                onChange={(e) => setData({ ...data, pan_number: e.target.value })}
                                            />
                                        </div>


                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">Account Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.account_number}
                                                onChange={(e) => setData({ ...data, account_number: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-6 mb-4">
                                            <label className="form-label">IFSC Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={data.ifsc_code}
                                                onChange={(e) => setData({ ...data, ifsc_code: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-sm-12 mb-2">
                                            <label className="form-label">Notes</label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={data.note}
                                                onChange={(e) => setData({ ...data, note: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">Agency Documents</h6>

                                            <button type="button" className="btn btn-sm btn-primary" onClick={addDocument}>
                                                <i className="fa fa-plus me-1"></i>
                                                Add More
                                            </button>
                                        </div>

                                        {data.documents.map((document, index) => (
                                            <div className="border rounded p-3 mb-3" key={index}>
                                                <div className="row align-items-end">
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Document Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="GST, PAN, License"
                                                            value={document.document_name}
                                                            onChange={(e) =>
                                                                updateDocument(index, 'document_name', e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-md-3 mb-3">
                                                        <label className="form-label">Document Type</label>
                                                        <select
                                                            className="form-select"
                                                            value={document.document_type}
                                                            onChange={(e) =>
                                                                updateDocument(index, 'document_type', e.target.value)
                                                            }
                                                        >
                                                            <option value="">Select Type</option>
                                                            <option value="gst">GST</option>
                                                            <option value="pan">PAN</option>
                                                            <option value="license">License</option>
                                                            <option value="agreement">Agreement</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label">Upload File/Image</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/*,.pdf,.doc,.docx"
                                                            onChange={(e) =>
                                                                updateDocument(
                                                                    index,
                                                                    'file',
                                                                    e.target.files ? e.target.files[0] : null
                                                                )
                                                            }
                                                        />

                                                        {document.file && (
                                                            <small className="text-muted d-block mt-1">
                                                                {document.file.name}
                                                            </small>
                                                        )}
                                                    </div>

                                                    <div className="col-md-1 mb-3">
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setStep(step - 1);
                                        }}
                                    >
                                        Previous
                                    </button>

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setStep(step + 1);
                                            }}
                                        >
                                            Next
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
        </MasterLayout>
    );
}
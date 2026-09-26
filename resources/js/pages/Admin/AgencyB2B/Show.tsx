import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ContactInfoForm from '../ContactInfo/Form';
import { ContactInfo } from '@/services/contactInfoService';

export default function AgencyB2BShow() {
    const { agency, permissionGroups } = usePage().props as any;
    const [activeTab, setActiveTab] = useState('overview');

    const [selectedPerms, setSelectedPerms] = useState<string[]>(
        (agency?.permissions || []).map((p: any) => p.name)
    );
    const [permSearch, setPermSearch] = useState('');
    const [savingPerms, setSavingPerms] = useState(false);

    const [contactData, setContactData] = useState<ContactInfo>({
        email: agency?.contact_info?.email || '',
        phone: agency?.contact_info?.phone || '',
        location: agency?.contact_info?.location || '',
        address: agency?.contact_info?.address || '',
        about_text: agency?.contact_info?.about_text || '',
        facebook_url: agency?.contact_info?.facebook_url || '',
        instagram_url: agency?.contact_info?.instagram_url || '',
        twitter_url: agency?.contact_info?.twitter_url || '',
        linkedin_url: agency?.contact_info?.linkedin_url || '',
        logo: agency?.contact_info?.logo || '',
        get_in_touch_image: agency?.contact_info?.get_in_touch_image || '',
        loader_video: agency?.contact_info?.loader_video || '',
    });
    const [contactLogoFile, setContactLogoFile] = useState<File | null>(null);
    const [contactTouchImageFile, setContactTouchImageFile] = useState<File | null>(null);
    const [contactLoaderVideoFile, setContactLoaderVideoFile] = useState<File | null>(null);
    const [contactLogoPreview, setContactLogoPreview] = useState('');
    const [contactTouchImagePreview, setContactTouchImagePreview] = useState('');
    const [contactLoaderVideoPreview, setContactLoaderVideoPreview] = useState('');
    const [savingContact, setSavingContact] = useState(false);

    const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContactData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactFileChange = (fieldName: string, file: File) => {
        if (fieldName === 'logo') {
            setContactLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setContactLogoPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else if (fieldName === 'get_in_touch_image') {
            setContactTouchImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setContactTouchImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else if (fieldName === 'loader_video') {
            setContactLoaderVideoFile(file);
            setContactLoaderVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSavingContact(true);

        const formData = new FormData();
        Object.entries(contactData).forEach(([key, value]) => {
            if (key !== 'logo' && key !== 'get_in_touch_image' && key !== 'loader_video') {
                formData.append(key, (value as string) || '');
            }
        });
        if (contactLogoFile) formData.append('logo', contactLogoFile);
        if (contactTouchImageFile) formData.append('get_in_touch_image', contactTouchImageFile);
        if (contactLoaderVideoFile) formData.append('loader_video', contactLoaderVideoFile);

        router.put(`/admin/agency-b2b/${agency.uid}/contact-info`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Contact information updated successfully!');
                setContactLogoFile(null);
                setContactTouchImageFile(null);
                setContactLoaderVideoFile(null);
                setContactLogoPreview('');
                setContactTouchImagePreview('');
                setContactLoaderVideoPreview('');
            },
            onError: () => {
                toast.error('Failed to update contact information');
            },
            onFinish: () => setSavingContact(false),
        });
    };

    const permQuery = permSearch.trim().toLowerCase();
    const visiblePermGroups = Object.entries((permissionGroups || {}) as Record<string, any[]>)
        .map(([module, items]) => [
            module,
            permQuery
                ? items.filter((i: any) => i.name.toLowerCase().includes(permQuery) || module.toLowerCase().includes(permQuery))
                : items,
        ] as [string, any[]])
        .filter(([, items]) => items.length > 0);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        });
    };

    const Field = ({ label, value, col = 'col-md-6', last = false }: { label: string; value: React.ReactNode; col?: string; last?: boolean }) => (
        <div className={`${col} ${last ? 'mb-0' : 'mb-3'}`}>
            <label className="text-muted small">{label}</label>
            <p className="fw-semibold mb-0">{value ?? 'N/A'}</p>
        </div>
    );

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Agency Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/agency-b2b">Agency Management</a></li>
                        <li className="breadcrumb-item active">{agency?.agency_name}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            {/* Logo */}
                            <div>
                                {agency?.logo ? (
                                    <img
                                        src={agency.logo}
                                        alt="Agency Logo"
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: 'contain',
                                            borderRadius: 8,
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 8,
                                        }}
                                    >
                                        <span className="text-primary fw-bold fs-24">
                                            {agency?.agency_name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Header Info */}
                            <div>
                                <h3 className="fw-semibold mb-1">{agency?.agency_name}</h3>
                                <p className="text-muted small mb-2">{agency?.legal_name}</p>
                                <ul className="d-flex flex-wrap align-items-center gap-3">
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-envelope me-2"></i>
                                        <a href={`mailto:${agency?.email}`}>{agency?.email}</a>
                                    </li>
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-phone me-2"></i>
                                        {agency?.phone_number}
                                    </li>
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-map-marker me-2"></i>
                                        {agency?.city}, {agency?.country}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="text-end">
                            <div className="mb-3">
                                <span className={`badge ${agency?.status ? 'bg-success' : 'bg-danger'}`}>
                                    {agency?.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <small className="text-muted d-block">Created on</small>
                            <strong>{formatDate(agency?.created_at)}</strong>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="card-footer py-0 d-flex flex-wrap justify-content-between align-items-center">
                    <ul className="nav nav-underline gap-3 nav-scroll px-3 px-sm-0" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                                role="tab"
                            >
                                Overview
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'documents' ? 'active' : ''}`}
                                onClick={() => setActiveTab('documents')}
                                role="tab"
                            >
                                Documents
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'bookings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('bookings')}
                                role="tab"
                            >
                                Bookings
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'permissions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('permissions')}
                                role="tab"
                            >
                                Permissions
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'contact-info' ? 'active' : ''}`}
                                onClick={() => setActiveTab('contact-info')}
                                role="tab"
                            >
                                Contact Info
                            </button>
                        </li>
                    </ul>
                    <button
                        onClick={() => router.visit(`/admin/agency-b2b/${agency?.uid}/edit`)}
                        className="btn btn-primary btn-sm me-3"
                    >
                        <i className="fa fa-edit me-2"></i>Edit
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container-fluid">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                    <div className="row">
                        <div className="col-lg-6">
                            {/* Basic Information */}
                            <div className="card mb-4" style={{ height: 'auto' }}>
                                <div className="card-header" style={{ padding: '12px 20px' }}>
                                    <h6 className="card-title mb-0">Basic Information</h6>
                                </div>
                                <div className="card-body" style={{ padding: '18px 20px' }}>
                                    <div className="row">
                                        <Field label="Agency Name" value={agency?.agency_name} />
                                        <Field label="Legal Name" value={agency?.legal_name} />
                                        <Field label="Email" value={agency?.email} />
                                        <Field label="Phone" value={agency?.phone_number} />
                                        <Field label="Alternate Phone" value={agency?.alternate_phone} />
                                        <Field
                                            label="Website"
                                            value={
                                                agency?.website && (
                                                    <a href={agency.website} target="_blank" rel="noopener noreferrer">
                                                        {agency.website}
                                                    </a>
                                                )
                                            }
                                        />
                                        <Field
                                            label="Services"
                                            col="col-md-12"
                                            last
                                            value={
                                                agency?.agency_services?.length > 0 && (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {agency.agency_services.map((service: any, idx: number) => (
                                                            <span key={idx} className="badge bg-primary">
                                                                {service.service_name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            {/* Business Information */}
                            <div className="card mb-4" style={{ height: 'auto' }}>
                                <div className="card-header" style={{ padding: '12px 20px' }}>
                                    <h6 className="card-title mb-0">Business Information</h6>
                                </div>
                                <div className="card-body" style={{ padding: '18px 20px' }}>
                                    <div className="row">
                                        <Field label="Country" value={agency?.country} />
                                        <Field label="State" value={agency?.state} />
                                        <Field label="City" value={agency?.city} />
                                        <Field label="Postal Code" value={agency?.postal_code} />
                                        <Field label="Address" value={agency?.address} col="col-md-12" last />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            {/* Tax & Bank Information */}
                            <div className="card mb-4" style={{ height: 'auto' }}>
                                <div className="card-header" style={{ padding: '12px 20px' }}>
                                    <h6 className="card-title mb-0">Tax & Bank Information</h6>
                                </div>
                                <div className="card-body" style={{ padding: '18px 20px' }}>
                                    <div className="row">
                                        <Field label="Registration Number" value={agency?.registration_number} col="col-md-4" />
                                        <Field label="GST Number" value={agency?.gst_number} col="col-md-4" />
                                        <Field label="PAN Number" value={agency?.pan_number} col="col-md-4" />
                                        <Field label="Account Number" value={agency?.account_number} />
                                        <Field label="IFSC Code" value={agency?.ifsc_code} last />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {agency?.has_domain && (
                            <div className="col-lg-6">
                                {/* Tenant Information */}
                                <div className="card mb-4" style={{ height: 'auto' }}>
                                    <div className="card-header" style={{ padding: '12px 20px' }}>
                                        <h6 className="card-title mb-0">Tenant Information</h6>
                                    </div>
                                    <div className="card-body" style={{ padding: '18px 20px' }}>
                                        <div className="row">
                                            <Field label="Has Tenant Assignment" value={<span className="badge bg-success">Yes</span>} />
                                            <Field label="Tenant ID" value={agency?.tenant_id} />
                                            <Field
                                                label="Website URL"
                                                col="col-md-12"
                                                last
                                                value={
                                                    agency?.tenant_url && (
                                                        <a href={agency.tenant_url} target="_blank" rel="noopener noreferrer">
                                                            {agency.tenant_url}
                                                        </a>
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {agency?.note && (
                            <div className="col-lg-12">
                                {/* Notes */}
                                <div className="card mb-4" style={{ height: 'auto' }}>
                                    <div className="card-header">
                                        <h6 className="card-title mb-0">Notes</h6>
                                    </div>
                                    <div className="card-body">
                                        <p>{agency?.note}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    </>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title mb-0">Documents</h6>
                                </div>
                                <div className="card-body">
                                    {agency?.agency_documents && agency.agency_documents.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Document Name</th>
                                                        <th>Document Type</th>
                                                        <th>Uploaded</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {agency.agency_documents.map((doc: any, idx: number) => (
                                                        <tr key={idx}>
                                                            <td className="fw-semibold">{doc.document_name}</td>
                                                            <td>
                                                                <span className="badge bg-info">{doc.document_type}</span>
                                                            </td>
                                                            <td className="text-muted small">
                                                                {formatDate(doc.created_at)}
                                                            </td>
                                                            <td>
                                                                {doc.file_path && (
                                                                    <a
                                                                        href={doc.file_path}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-sm btn-primary"
                                                                    >
                                                                        <i className="fa fa-download"></i> Download
                                                                    </a>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-file-alt" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                            <p className="text-muted mt-3">No documents uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title mb-0">Bookings</h6>
                                </div>
                                <div className="card-body">
                                    <div className="text-center py-5">
                                        <i className="fas fa-calendar-check" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                        <p className="text-muted mt-3">Booking information coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Permissions Tab */}
                {activeTab === 'permissions' && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="card-title mb-0">Permissions</h6>
                                    <span className="badge bg-primary">
                                        {(agency?.permissions || []).length} granted
                                    </span>
                                </div>
                                <div className="card-body">
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Search permissions..."
                                        value={permSearch}
                                        onChange={(e) => setPermSearch(e.target.value)}
                                    />

                                    {visiblePermGroups.length === 0 && (
                                        <p className="text-muted mb-0">No permissions match that search.</p>
                                    )}

                                    {visiblePermGroups.map(([module, items]) => {
                                        const names = items.map((i: any) => i.name);
                                        const allOn = names.every((n: string) => selectedPerms.includes(n));

                                        return (
                                            <div key={module} className="border rounded p-3 mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="mb-0 text-capitalize">{module.replace(/-/g, ' ')}</h6>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${allOn ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
                                                        onClick={() => setSelectedPerms((prev) =>
                                                            allOn
                                                                ? prev.filter((p) => !names.includes(p))
                                                                : prev.concat(names.filter((n: string) => !prev.includes(n)))
                                                        )}
                                                    >
                                                        {allOn ? 'Clear' : 'Select all'}
                                                    </button>
                                                </div>

                                                <div className="d-flex flex-wrap gap-3">
                                                    {items.map((p: any) => (
                                                        <div className="form-check" key={p.id}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id={`ap-${p.id}`}
                                                                checked={selectedPerms.includes(p.name)}
                                                                onChange={() => setSelectedPerms((prev) =>
                                                                    prev.includes(p.name)
                                                                        ? prev.filter((x) => x !== p.name)
                                                                        : [...prev, p.name]
                                                                )}
                                                            />
                                                            <label className="form-check-label text-capitalize" htmlFor={`ap-${p.id}`}>
                                                                {p.action}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="card-footer">
                                    <button
                                        className="btn btn-primary"
                                        disabled={savingPerms}
                                        onClick={() => {
                                            setSavingPerms(true);
                                            router.post(`/admin/agency-b2b/${agency.uid}/permissions`,
                                                { permissions: selectedPerms },
                                                { onFinish: () => setSavingPerms(false), preserveScroll: true }
                                            );
                                        }}
                                    >
                                        {savingPerms ? 'Saving...' : 'Save Permissions'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Info Tab */}
                {activeTab === 'contact-info' && (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title mb-0">Contact Information</h6>
                                </div>
                                <div className="card-body">
                                    <ContactInfoForm
                                        data={contactData}
                                        onChange={handleContactInputChange}
                                        onFileChange={handleContactFileChange}
                                        logoPreview={contactLogoPreview}
                                        touchImagePreview={contactTouchImagePreview}
                                        loaderVideoPreview={contactLoaderVideoPreview}
                                        onSubmit={handleContactSubmit}
                                        isLoading={savingContact}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Toaster position="top-right" />
        </div>
    );
}

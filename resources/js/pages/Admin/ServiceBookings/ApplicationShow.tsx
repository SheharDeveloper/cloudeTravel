import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import ApplicationFormTab, { type ApplicationFormData } from '@/components/visa/ApplicationFormTab';
import { statusBadge } from './Index';

interface Props {
    application: {
        uid: string;
        application_number: string;
        first_name: string;
        last_name: string | null;
        relation: string;
        email: string | null;
        phone: string | null;
        passport_number: string | null;
        nationality: string | null;
        status: string;
        amount: number;
    };
    booking: {
        uid: string;
        invoice_number: string;
        status: string;
        created_at: string | null;
        signed_at: string | null;
        service_date: string | null;
        passengers: number;
        currency_symbol: string;
        base_amount: number;
        service_fee: number;
        tax_amount: number;
        total_amount: number;
        visa_name: string | null;
        visa_type: string | null;
        validity: string | null;
        processing_time: string | null;
        origin: string | null;
        destination: string | null;
        taxes: { name: string; percent: number }[];
        client_name: string | null;
    };
    members: { uid: string; application_number: string; name: string; relation: string; passport_number: string | null; nationality: string | null; status: string }[];
    form: ApplicationFormData;
    flash?: { success?: string | null };
}

// "overview" is the Payment Receipt; the rest are still to come
const TABS = [
    { id: 'overview', label: 'Payment Receipt', icon: 'fas fa-receipt' },
    { id: 'fill', label: 'Fill Application', icon: 'fas fa-file-signature' },
    { id: 'upload', label: 'Upload Document', icon: 'fas fa-file-upload' },
    { id: 'email', label: 'Send Email', icon: 'fas fa-envelope' },
    { id: 'conversation', label: 'Conversation', icon: 'fas fa-comments' },
    { id: 'log', label: 'Visa Updation Log Data', icon: 'fas fa-history' },
];

const formatDate = (date: string | null, withTime = false) =>
    date
        ? new Date(date).toLocaleString('en-IN', {
            year: 'numeric', month: 'long', day: '2-digit',
            ...(withTime && { hour: '2-digit', minute: '2-digit' }),
        })
        : 'N/A';

/** "View Application": one applicant of a visa booking. Laid out like the Agency Details page. */
export default function VisaApplicationShow() {
    const { application, booking, members, form, flash } = usePage().props as unknown as Props;
    const [activeTab, setActiveTab] = useState('overview');

    // "Application form saved / submitted" after saving
    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: `${flash.success}-${form.updated_at}` });
    }, [flash?.success, form.updated_at]);

    const fullName = `${application.first_name} ${application.last_name ?? ''}`.trim();
    const money = (value: number) => `${booking.currency_symbol}${value.toFixed(2)}`;
    const route = [booking.origin, booking.destination].filter(Boolean).join(' To ');

    // Same breakdown as the booking's Payment Summary
    const count = Math.max(booking.passengers, 1);
    const perPerson = {
        base: booking.base_amount / count,
        service: booking.service_fee / count,
        tax: booking.tax_amount / count,
        total: booking.total_amount / count,
    };
    const additional = count - 1;
    const taxLabel = booking.taxes.map((t) => `${t.name} ${t.percent}%`).join(' + ') || 'Tax';

    const Field = ({ label, value, col = 'col-md-6', last = false }: { label: string; value: React.ReactNode; col?: string; last?: boolean }) => (
        <div className={`${col} ${last ? 'mb-0' : 'mb-3'}`}>
            <label className="text-muted small">{label}</label>
            <p className="fw-semibold mb-0">{value || 'N/A'}</p>
        </div>
    );

    const Row = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => (
        <div className={`d-flex justify-content-between ${strong ? 'fw-bold fs-5' : 'mb-3'}`}>
            <span className={strong ? '' : 'text-muted'}>{label}</span>
            <span className={strong ? 'text-primary' : 'fw-semibold'}>{value}</span>
        </div>
    );

    return (
        <ProtectedRoute>
            <Head title={`Application ${application.application_number}`} />

            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Application Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/service-bookings?service=visa&status=not_pending">Visa Applications</a></li>
                        <li className="breadcrumb-item active">{application.application_number}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div className="d-flex align-items-start gap-3">
                            <div
                                className="bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                style={{ width: 80, height: 80, borderRadius: 8 }}
                            >
                                <span className="text-primary fw-bold fs-24">{fullName.charAt(0).toUpperCase()}</span>
                            </div>

                            <div>
                                <h3 className="fw-semibold mb-1">{fullName}</h3>
                                <p className="text-muted small mb-2">
                                    Visa Application #{application.application_number} · {[booking.visa_name, booking.visa_type].filter(Boolean).join(' · ')}
                                </p>
                                <ul className="d-flex flex-wrap align-items-center gap-3">
                                    {application.email && (
                                        <li className="d-inline-flex align-items-center">
                                            <i className="las la-envelope me-2"></i>
                                            <a href={`mailto:${application.email}`}>{application.email}</a>
                                        </li>
                                    )}
                                    {application.phone && (
                                        <li className="d-inline-flex align-items-center">
                                            <i className="las la-phone me-2"></i>
                                            {application.phone}
                                        </li>
                                    )}
                                    {route && (
                                        <li className="d-inline-flex align-items-center">
                                            <i className="las la-map-marker me-2"></i>
                                            {route}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="text-end">
                            <div className="mb-3">
                                <span className={`badge ${statusBadge(booking.status)} text-capitalize`}>
                                    {booking.status === 'signed' ? 'Invoice Signed' : booking.status}
                                </span>
                            </div>
                            <small className="text-muted d-block">Submitted on</small>
                            <strong>{formatDate(booking.created_at, true)}</strong>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="card-footer py-0 d-flex flex-wrap justify-content-between align-items-center">
                    <ul className="nav nav-underline gap-3 nav-scroll px-3 px-sm-0" role="tablist">
                        {TABS.map((tab) => (
                            <li key={tab.id} className="nav-item" role="presentation">
                                <button
                                    className={`nav-link py-3 px-1 border-3 ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    role="tab"
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => router.visit(`/admin/service-bookings/${booking.uid}`)}
                        className="btn btn-primary btn-sm me-3"
                    >
                        <i className="fa fa-file-invoice me-2"></i>Booking {booking.invoice_number}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="container-fluid">
                {activeTab === 'overview' ? (
                    <>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card mb-4" style={{ height: 'auto' }}>
                                    <div className="card-header" style={{ padding: '12px 20px' }}>
                                        <h6 className="card-title mb-0">Applicant Information</h6>
                                    </div>
                                    <div className="card-body" style={{ padding: '18px 20px' }}>
                                        <div className="row">
                                            <Field label="Full Name" value={fullName} />
                                            <Field label="Relation" value={<span className="text-capitalize">{application.relation}</span>} />
                                            <Field label="Email" value={application.email} />
                                            <Field label="Phone Number" value={application.phone} />
                                            <Field label="Passport Number" value={application.passport_number} />
                                            <Field label="Nationality" value={application.nationality} />
                                            <Field label="Application Number" value={application.application_number} col="col-md-12" last />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card mb-4" style={{ height: 'auto' }}>
                                    <div className="card-header" style={{ padding: '12px 20px' }}>
                                        <h6 className="card-title mb-0">Visa Information</h6>
                                    </div>
                                    <div className="card-body" style={{ padding: '18px 20px' }}>
                                        <div className="row">
                                            <Field label="Visa Category" value={booking.visa_name} />
                                            <Field label="Visa Type" value={booking.visa_type} />
                                            <Field label="From" value={booking.origin} />
                                            <Field label="To" value={booking.destination} />
                                            <Field label="Validity" value={booking.validity} />
                                            <Field label="Processing Time" value={booking.processing_time} />
                                            <Field label="Date of Entry" value={booking.service_date ? formatDate(booking.service_date) : null} col="col-md-12" last />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card mb-4" style={{ height: 'auto' }}>
                                    <div className="card-header" style={{ padding: '12px 20px' }}>
                                        <h6 className="card-title mb-0">Payment Summary</h6>
                                    </div>
                                    <div className="card-body" style={{ padding: '18px 20px' }}>
                                        <Row label="Visa Fee" value={money(perPerson.base)} />
                                        <Row label="Service Fee" value={money(perPerson.service)} />
                                        {perPerson.tax > 0 && <Row label={taxLabel} value={money(perPerson.tax)} />}
                                        {additional > 0 && <Row label={`Additional Members (1 + ${additional})`} value={money(perPerson.total * additional)} />}
                                        <hr />
                                        <Row label="Total Amount" value={money(booking.total_amount)} strong />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card mb-4" style={{ height: 'auto' }}>
                                    <div className="card-header d-flex justify-content-between align-items-center" style={{ padding: '12px 20px' }}>
                                        <h6 className="card-title mb-0">Travel Family Members</h6>
                                        <span className="badge bg-primary">{members.length} member{members.length === 1 ? '' : 's'}</span>
                                    </div>
                                    <div className="card-body" style={{ padding: '18px 20px' }}>
                                        {members.length > 0 ? (
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Application No.</th>
                                                            <th>Name</th>
                                                            <th>Relation</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {members.map((m) => (
                                                            <tr key={m.uid}>
                                                                <td className="text-muted small">{m.application_number}</td>
                                                                <td className="fw-semibold">{m.name}</td>
                                                                <td className="text-capitalize">{m.relation}</td>
                                                                <td><span className={`badge ${statusBadge(m.status)} text-capitalize`}>{m.status}</span></td>
                                                                <td>
                                                                    <a href={`/admin/visa-applications/${m.uid}`} className="btn btn-sm btn-primary" title="View Application">
                                                                        <i className="fa fa-eye"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="fas fa-users" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                                <p className="text-muted mt-3 mb-0">No additional members in this application</p>
                                                <small className="text-muted">Only the main applicant is included</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'fill' ? (
                    <ApplicationFormTab applicationUid={application.uid} form={form} />
                ) : (
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title mb-0">{TABS.find((t) => t.id === activeTab)!.label}</h6>
                                </div>
                                <div className="card-body">
                                    <div className="text-center py-5">
                                        <i className={TABS.find((t) => t.id === activeTab)!.icon} style={{ fontSize: '48px', color: '#ccc' }}></i>
                                        <p className="text-muted mt-3">{TABS.find((t) => t.id === activeTab)!.label} coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

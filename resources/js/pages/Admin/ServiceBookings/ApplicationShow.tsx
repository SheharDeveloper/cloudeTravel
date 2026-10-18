import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import ApplicationFormTab, { type ApplicationFormData } from '@/components/visa/ApplicationFormTab';
import ApplicationDocumentsTab, { type ApplicationDocumentItem } from '@/components/visa/ApplicationDocumentsTab';
import SendEmailTab from '@/components/visa/SendEmailTab';
import ProcessingTab from '@/components/visa/ProcessingTab';
import { statusBadge, statusLabel } from './Index';

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
        client_email: string | null;
    };
    members: { uid: string; application_number: string; name: string; relation: string; passport_number: string | null; nationality: string | null; status: string }[];
    form: ApplicationFormData;
    // Send to Admin (not on the client portal)
    access?: { can_edit: boolean; can_send: boolean; admin_view: boolean };
    sent?: { at: string; agency: string | null; updated_at: string | null } | null;
    // Share Application: a link the applicant opens with their email + OTP (agency's own applications)
    share?: { url: string; email: string | null; email_otp: boolean } | null;
    // Visa Updation Log Data, newest first
    // Upload Document: requested by the superadmin, uploaded by the agency
    documents: ApplicationDocumentItem[];
    canRequestDocuments?: boolean;
    // The superadmin also gets the "Form" and "Processing" tabs
    isSuperadmin?: boolean;
    // Processing: the statuses the superadmin can set (value => label)
    statuses?: Record<string, string>;
    logs?: {
        id: number;
        application_number: string;
        field_name: string;
        section_name: string | null;
        old_value: string | null;
        new_value: string | null;
        // A note with a status change (the reason, for Rejected)
        comment: string | null;
        role: 'agency' | 'admin' | 'client';
        created_at: string;
    }[];
    flash?: { success?: string | null };
}

// "overview" is the Payment Receipt; the rest are still to come
const TABS = [
    { id: 'overview', label: 'Payment Receipt', icon: 'fas fa-receipt' },
    { id: 'fill', label: 'Fill Application', icon: 'fas fa-file-signature' },
    { id: 'upload', label: 'Upload Document', icon: 'fas fa-file-upload' },
    { id: 'email', label: 'Send Email', icon: 'fas fa-envelope', notForClient: true },
    { id: 'conversation', label: 'Conversation', icon: 'fas fa-comments' },
    { id: 'log', label: 'Visa Updation Log Data', icon: 'fas fa-history', notForClient: true },
    // Superadmin only
    { id: 'form', label: 'Form', icon: 'fas fa-file-alt', superadminOnly: true },
    { id: 'processing', label: 'Processing', icon: 'fas fa-cogs', superadminOnly: true },
];

/** Where the page is shown: the agency / superadmin side, or the client portal. */
export type ApplicationPortal = 'admin' | 'client';

/**
 * Share Application: a link the applicant opens to fill the form without
 * logging in — they confirm the application's email with an OTP.
 */
function ShareApplicationCard({ share }: { share: { url: string; email: string | null; email_otp: boolean } }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(share.url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard blocked (e.g. not https): show it so it can be copied by hand
            window.prompt('Copy the application link:', share.url);
        }
    };

    return (
        <div className="card h-auto mb-4">
            <div className="card-body py-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div style={{ minWidth: 0, flex: '1 1 320px' }}>
                        <h6 className="mb-1"><i className="fa fa-share-alt me-2 text-primary"></i>Share Application</h6>
                        {share.email ? (
                            <small className="text-muted d-block">
                                The applicant opens this link and verifies <strong>{share.email}</strong> with an OTP
                                {share.email_otp ? ' (emailed to them)' : ''}, then fills the application — no login needed.
                            </small>
                        ) : (
                            <small className="text-danger d-block">
                                Add an email to the applicant (or the booking's client) — the link opens with that email and an OTP.
                            </small>
                        )}
                    </div>
                    {share.email && (
                        <div className="d-flex gap-2 flex-shrink-0">
                            <button type="button" className="btn btn-primary btn-sm" onClick={copy}>
                                <i className={`fa ${copied ? 'fa-check' : 'fa-copy'} me-2`}></i>{copied ? 'Copied' : 'Copy Link'}
                            </button>
                            <a href={share.url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                                <i className="fa fa-external-link-alt me-2"></i>Open
                            </a>
                        </div>
                    )}
                </div>
                {share.email && (
                    <input type="text" className="form-control form-control-sm mt-2" value={share.url} readOnly onFocus={(e) => e.target.select()} />
                )}
            </div>
        </div>
    );
}

const formatDate = (date: string | null, withTime = false) =>
    date
        ? new Date(date).toLocaleString('en-IN', {
            year: 'numeric', month: 'long', day: '2-digit',
            ...(withTime && { hour: '2-digit', minute: '2-digit' }),
        })
        : 'N/A';

/** "View Application": one applicant of a visa booking. Laid out like the Agency Details page. */
export default function VisaApplicationShow() {
    const { application, access } = usePage().props as unknown as Props;

    return (
        <ProtectedRoute>
            <Head title={`Application ${application.application_number}`} />

            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Application Details</h1></li>
                        <li className="breadcrumb-item">
                            {access?.admin_view
                                ? <a href="/admin/agency-applications">Agency Applications</a>
                                : <a href="/admin/service-bookings?service=visa&status=not_pending">Visa Applications</a>}
                        </li>
                        <li className="breadcrumb-item active">{application.application_number}</li>
                    </ol>
                </nav>
            </div>

            <ApplicationView portal="admin" />

            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

/**
 * The application's header, tabs and tab content — shared by the agency /
 * superadmin page and the client portal. The client gets no Send to Admin,
 * Send Email or log, and fills the form / uploads documents itself.
 */
export function ApplicationView({ portal }: { portal: ApplicationPortal }) {
    const { application, booking, members, form, flash, documents, statuses = {} } = usePage().props as unknown as Props;
    const isClient = portal === 'client';
    const props = usePage().props as unknown as Props;
    // The client portal never sends to the admin or reads the log
    const access = isClient ? { can_edit: true, can_send: false, admin_view: false } : props.access!;
    const sent = isClient ? null : (props.sent ?? null);
    const logs = props.logs ?? [];
    const isSuperadmin = !isClient && !!props.isSuperadmin;
    const canRequestDocuments = !isClient && !!props.canRequestDocuments;
    const baseUrl = isClient ? '/client/applications' : '/admin/visa-applications';
    const [activeTab, setActiveTab] = useState('overview');
    // "Form" and "Processing" are for the superadmin only; the client sees no Send Email or log
    const visibleTabs = TABS.filter((tab) => (!tab.superadminOnly || isSuperadmin) && !(isClient && tab.notForClient));

    // "Application form saved / submitted" after saving (the client portal shows its own message)
    useEffect(() => {
        if (flash?.success && !isClient) toast.success(flash.success, { id: `${flash.success}-${form.updated_at}` });
    }, [flash?.success, form.updated_at, isClient]);

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
        <>
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
                                {sent && (
                                    <span className="badge bg-info ms-2">
                                        <i className="fa fa-paper-plane me-1"></i>Sent to Admin
                                    </span>
                                )}
                                {sent?.updated_at && (
                                    <span className="badge bg-warning text-dark ms-2">
                                        <i className="fa fa-redo me-1"></i>Updated — Resend Pending
                                    </span>
                                )}
                            </div>
                            <small className="text-muted d-block">Submitted on</small>
                            <strong>{formatDate(booking.created_at, true)}</strong>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="card-footer py-0 d-flex flex-wrap justify-content-between align-items-center">
                    <ul className="nav nav-underline gap-3 nav-scroll px-3 px-sm-0" role="tablist">
                        {visibleTabs.map((tab) => (
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
                    {/* The booking page belongs to the agency; the superadmin sees the agency instead; the client gets the invoice */}
                    {isClient ? (
                        <a href={`/client/invoices/${booking.uid}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm me-3">
                            <i className="fa fa-file-invoice me-2"></i>Invoice {booking.invoice_number}
                        </a>
                    ) : access.admin_view ? (
                        <span className="badge bg-primary bg-opacity-10 text-primary me-3">
                            <i className="fa fa-building me-1"></i>{sent?.agency ?? 'Agency'}
                        </span>
                    ) : (
                        <button
                            onClick={() => router.visit(`/admin/service-bookings/${booking.uid}`)}
                            className="btn btn-primary btn-sm me-3"
                        >
                            <i className="fa fa-file-invoice me-2"></i>Booking {booking.invoice_number}
                        </button>
                    )}
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
                                                                <td><span className={`badge ${statusBadge(m.status)} text-capitalize`}>{statusLabel(m.status)}</span></td>
                                                                <td>
                                                                    <a href={`${baseUrl}/${m.uid}`} className="btn btn-sm btn-primary" title="View Application">
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
                    <>
                        {!isClient && props.share && <ShareApplicationCard share={props.share} />}
                        <ApplicationFormTab
                            applicationUid={application.uid}
                            form={form}
                            canEdit={access.can_edit}
                            canSend={access.can_send}
                            sent={sent}
                            baseUrl={baseUrl}
                            allowCopyPaste={isSuperadmin}
                        />
                    </>
                ) : activeTab === 'email' ? (
                    <SendEmailTab
                        to={booking.client_email || application.email}
                        clientName={booking.client_name}
                        applicationNumber={application.application_number}
                    />
                ) : activeTab === 'upload' ? (
                    <ApplicationDocumentsTab
                        applicationUid={application.uid}
                        documents={documents}
                        canRequest={canRequestDocuments}
                        baseUrl={baseUrl}
                    />
                ) : activeTab === 'processing' && isSuperadmin ? (
                    /* Superadmin: change the application's status */
                    <ProcessingTab
                        applicationUid={application.uid}
                        status={application.status}
                        statuses={statuses}
                        history={logs.filter((log) => log.field_name === 'Application Status')}
                    />
                ) : activeTab === 'log' ? (
                    <div className="card" style={{ height: 'auto' }}>
                        <div className="card-header">
                            <h6 className="card-title mb-0">Visa Application Log</h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-bordered mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: 80 }}>Sr. No.</th>
                                            <th>Application Number</th>
                                            <th>New Value</th>
                                            <th>Old Value</th>
                                            <th>Field Name</th>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center text-muted py-5">
                                                    <i className="fas fa-history d-block mb-2" style={{ fontSize: 36, color: '#ccc' }}></i>
                                                    No changes yet. Updates to the submitted application form appear here.
                                                </td>
                                            </tr>
                                        ) : logs.map((log, i) => (
                                            <tr key={log.id}>
                                                <td>{i + 1}</td>
                                                <td>{log.application_number}</td>
                                                <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                    {log.new_value ?? <span className="text-muted">—</span>}
                                                    {log.comment && (
                                                        <small className={`d-block mt-1 ${log.new_value === 'Rejected' ? 'text-danger' : 'text-muted'}`}>
                                                            <i className="fa fa-comment-dots me-1"></i>{log.comment}
                                                        </small>
                                                    )}
                                                </td>
                                                <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{log.old_value ?? <span className="text-muted">—</span>}</td>
                                                <td>{log.field_name}</td>
                                                <td>
                                                    <span className={`badge ${log.role === 'admin' ? 'bg-primary' : log.role === 'client' ? 'bg-secondary' : 'bg-info'}`}>
                                                        {log.role === 'admin' ? 'Superadmin' : log.role === 'client' ? 'Client' : 'Agency'}
                                                    </span>
                                                </td>
                                                <td className="text-nowrap">{new Date(log.created_at).toLocaleDateString('en-GB')}</td>
                                                <td className="text-nowrap">
                                                    {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
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
        </>
    );
}

import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AttendanceCalendar from '@/components/AttendanceCalendar';

const TABS = [
    { key: 'personal', label: 'Personal Information' },
    { key: 'passport', label: 'Passport, Visa & Emergency' },
    { key: 'payment', label: 'Payment' },
    { key: 'education', label: 'Education' },
    { key: 'tax', label: 'Tax & Deduction' },
    { key: 'documents', label: 'Documents' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'log', label: 'Log' },
];

export default function StaffShow() {
    const { staff, availableRoles, authPermissions, errors, attendanceMonth, attendanceHistory } = usePage().props as any;
    const [activeTab, setActiveTab] = useState('personal');

    const handleAttendanceMonthChange = (newMonth: string) => {
        router.get(window.location.pathname, { attendance_month: newMonth }, {
            preserveState: true,
            preserveScroll: true,
            only: ['attendanceMonth', 'attendanceHistory'],
        });
    };

    // Mirrors the sidebar's permission check: null means no restriction
    // (superadmin), otherwise the permission name must be granted.
    const canAssignRole = !authPermissions || authPermissions.includes('role.edit');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showImpersonateModal, setShowImpersonateModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    const profile = staff?.staff_profile;
    const payment = staff?.staff_payment;
    const passport = staff?.staff_passport;
    const emergency = staff?.staff_emergency_contact;
    const educations = staff?.staff_educations || [];
    const taxDeductions = staff?.staff_tax_deductions || [];
    const documents = staff?.staff_documents || [];
    const activityLogs = staff?.staff_activity_logs || [];
    const currentRole = staff?.roles?.[0]?.name || '';

    const submitRole = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/admin/staff/${staff.uid}/assign-role`, { role: selectedRole }, {
            preserveScroll: true,
            onSuccess: () => setShowRoleModal(false),
            onFinish: () => setProcessing(false),
        });
    };

    const submitPasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/admin/staff/${staff.uid}/reset-password`, {
            password: newPassword,
            password_confirmation: confirmPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPasswordModal(false);
                setNewPassword('');
                setConfirmPassword('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const formatDate = (date: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: '2-digit' });
    };

    const formatDateTime = (date: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-IN', {
            year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
        });
    };

    const actionBadge = (action: string) => {
        const map: Record<string, string> = {
            created: 'bg-success',
            updated: 'bg-info',
            status_changed: 'bg-warning',
            role_assigned: 'bg-primary',
            password_reset: 'bg-danger',
            impersonation_started: 'bg-dark',
            impersonation_ended: 'bg-secondary',
        };
        return map[action] || 'bg-secondary';
    };

    const Field = ({ label, value }: { label: string; value: any }) => (
        <div className="col-md-6 mb-3">
            <label className="text-muted small">{label}</label>
            <p className="fw-semibold">{value || 'N/A'}</p>
        </div>
    );

    const EmptyState = ({ icon, text }: { icon: string; text: string }) => (
        <div className="text-center py-5">
            <i className={icon} style={{ fontSize: '48px', color: '#ccc' }}></i>
            <p className="text-muted mt-3">{text}</p>
        </div>
    );

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Staff Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/staff">Staff Management</a></li>
                        <li className="breadcrumb-item active">{staff?.name}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div>
                                {staff?.profile_image_url || staff?.profile_pic ? (
                                    <img
                                        src={staff.profile_image_url || staff.profile_pic}
                                        alt={staff?.name}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                ) : (
                                    <div className="bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{ width: 80, height: 80, borderRadius: 8 }}>
                                        <span className="text-primary fw-bold fs-24">{staff?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="fw-semibold mb-1">{staff?.name}</h3>
                                <p className="text-muted small mb-2">
                                    <span className="badge bg-info">{staff?.type || 'staff'}</span>
                                    {currentRole && (
                                        <span className="badge bg-primary ms-2">
                                            <i className="fa fa-user-shield me-1"></i>{currentRole}
                                        </span>
                                    )}
                                </p>
                                <ul className="d-flex flex-wrap align-items-center gap-3">
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-envelope me-2"></i>
                                        <a href={`mailto:${staff?.email}`}>{staff?.email}</a>
                                    </li>
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-phone me-2"></i>
                                        {staff?.phone || 'N/A'}
                                    </li>
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-map-marker me-2"></i>
                                        {profile?.city || 'N/A'}{profile?.country ? `, ${profile.country}` : ''}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-end">
                            <div className="mb-3">
                                <span className={`badge ${staff?.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                    {staff?.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <small className="text-muted d-block">Joined on</small>
                            <strong>{formatDate(staff?.created_at)}</strong>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="card-footer py-3 d-flex flex-wrap justify-content-end align-items-center">
                    <div className="d-flex gap-2">
                        <button onClick={() => router.visit(`/admin/staff/${staff?.uid}/edit`)} className="btn btn-primary btn-sm">
                            <i className="fa fa-edit me-2"></i>Edit
                        </button>

                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Quick Options
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                {canAssignRole && (
                                    <li>
                                        <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => { setSelectedRole(currentRole); setShowRoleModal(true); }}
                                        >
                                            <i className="fa fa-user-shield me-2"></i>Assign Role
                                        </button>
                                    </li>
                                )}
                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => setShowPasswordModal(true)}
                                    >
                                        <i className="fa fa-key me-2"></i>Reset Password
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => setShowImpersonateModal(true)}
                                    >
                                        <i className="fa fa-user-secret me-2"></i>Impersonate
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Role Modal */}
            {showRoleModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={submitRole}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Assign Role</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {errors?.error && <div className="alert alert-danger">{errors.error}</div>}
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-select"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a role</option>
                                        {(availableRoles || []).map((role: string) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    {(availableRoles || []).length === 0 && (
                                        <small className="text-muted d-block mt-2">
                                            No roles available for this account type yet.
                                        </small>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={processing || !selectedRole}>
                                        {processing ? 'Saving...' : 'Assign'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={submitPasswordReset}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Reset Password</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {errors?.error && <div className="alert alert-danger">{errors.error}</div>}
                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                        {errors?.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? 'Saving...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Impersonate Confirmation Modal */}
            {showImpersonateModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fa fa-user-secret me-2"></i>Impersonate Staff
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowImpersonateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                Log in as {staff?.name}? You can return to your own account from the banner at the top of the page.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowImpersonateModal(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() => router.post(`/admin/staff/${staff.uid}/impersonate`)}
                                >
                                    <i className="fa fa-user-secret me-2"></i>Impersonate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col-lg-3 col-xl-2 mb-4">
                    <div className="card h-auto">
                        <div className="card-body p-2">
                            <ul className="nav nav-pills flex-column gap-1" role="tablist">
                                {TABS.map((tab) => (
                                    <li className="nav-item" role="presentation" key={tab.key}>
                                        <button
                                            className={`nav-link w-100 text-start ${activeTab === tab.key ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.key)}
                                            role="tab"
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-9 col-xl-10">
                {/* ── Personal Information ──────────────────── */}
                {activeTab === 'personal' && (
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card mb-4 h-auto">
                                <div className="card-header"><h6 className="card-title mb-0">Profile Information</h6></div>
                                <div className="card-body">
                                    <div className="row">
                                        <Field label="Full Name" value={staff?.name} />
                                        <Field label="Email" value={staff?.email} />
                                        <Field label="Phone" value={staff?.phone} />
                                        <Field label="Date of Birth" value={profile?.dob ? formatDate(profile.dob) : null} />
                                        <Field label="Joining Date" value={profile?.joining_date ? formatDate(profile.joining_date) : null} />
                                        <Field label="Member Since" value={formatDate(staff?.created_at)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card mb-4 h-auto">
                                <div className="card-header"><h6 className="card-title mb-0">Address</h6></div>
                                <div className="card-body">
                                    <div className="row">
                                        <Field label="Country" value={profile?.country} />
                                        <Field label="County" value={profile?.county} />
                                        <Field label="City" value={profile?.city} />
                                        <Field label="Zip Code" value={profile?.zip_code_id} />
                                        <div className="col-md-12 mb-3">
                                            <label className="text-muted small">Address</label>
                                            <p className="fw-semibold">{profile?.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card mb-4 h-auto">
                                <div className="card-header"><h6 className="card-title mb-0">Skills</h6></div>
                                <div className="card-body">
                                    {profile?.skills?.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {profile.skills.map((skill: string, i: number) => (
                                                <span key={i} className="badge bg-primary">{skill}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">No skills recorded</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Passport, Visa & Emergency ────────────── */}
                {activeTab === 'passport' && (
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card mb-4 h-auto">
                                <div className="card-header"><h6 className="card-title mb-0">Passport &amp; Visa</h6></div>
                                <div className="card-body">
                                    <div className="row">
                                        <Field label="Passport Number" value={passport?.passport_number} />
                                        <Field label="Place of Issue" value={passport?.place_of_issue} />
                                        <Field label="Date of Issue" value={passport?.date_of_issue ? formatDate(passport.date_of_issue) : null} />
                                        <Field label="Expiry Date" value={passport?.expiry_date ? formatDate(passport.expiry_date) : null} />

                                        <div className="col-md-6 mb-3">
                                            <label className="text-muted small">Passport Front</label>
                                            <p className="fw-semibold mb-0">
                                                {passport?.front_image ? (
                                                    <a href={passport.front_image} target="_blank" rel="noopener noreferrer">
                                                        <img src={passport.front_image} alt="Passport front"
                                                            style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                    </a>
                                                ) : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="text-muted small">Passport Back</label>
                                            <p className="fw-semibold mb-0">
                                                {passport?.back_image ? (
                                                    <a href={passport.back_image} target="_blank" rel="noopener noreferrer">
                                                        <img src={passport.back_image} alt="Passport back"
                                                            style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                                                    </a>
                                                ) : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="text-muted small">Foreign National</label>
                                            <p className="fw-semibold">
                                                <span className={`badge ${passport?.is_foreigner ? 'bg-warning' : 'bg-secondary'}`}>
                                                    {passport?.is_foreigner ? 'Yes — visa required' : 'No'}
                                                </span>
                                            </p>
                                        </div>

                                        {passport?.is_foreigner && (
                                            <>
                                                <Field label="Type of Visa" value={passport?.visa_type} />
                                                <Field label="Visa Number" value={passport?.visa_number} />
                                                <Field label="Visa Expiry Date" value={passport?.visa_expiry_date ? formatDate(passport.visa_expiry_date) : null} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card mb-4 h-auto">
                                <div className="card-header"><h6 className="card-title mb-0">Emergency Contact</h6></div>
                                <div className="card-body">
                                    {emergency ? (
                                        <div className="row">
                                            <Field label="Contact Name" value={emergency.contact_name} />
                                            <Field label="Relationship" value={emergency.relationship} />
                                            <Field label="Phone" value={emergency.phone} />
                                            <Field label="Alternate Phone" value={emergency.alternate_phone} />
                                            <div className="col-md-12 mb-3">
                                                <label className="text-muted small">Address</label>
                                                <p className="fw-semibold">{emergency.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <EmptyState icon="fas fa-user-shield" text="No emergency contact recorded" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Payment ──────────────────────────────── */}
                {activeTab === 'payment' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Payment Details</h6></div>
                        <div className="card-body">
                            {payment ? (
                                <div className="row">
                                    <Field label="Salary" value={payment.salary ? `${payment.currency || ''} ${payment.salary}` : null} />
                                    <Field label="Salary Type" value={
                                        payment.salary_type === 'per_day' ? 'Per Day'
                                            : payment.salary_type === 'per_hour' ? 'Per Hour'
                                                : 'Per Month'
                                    } />
                                    <Field label="Currency" value={payment.currency} />
                                    <Field label="Bank Name" value={payment.bank_name} />
                                    <Field label="Account Number" value={payment.account_number} />
                                    <Field label="IFSC Code" value={payment.ifsc_code} />
                                </div>
                            ) : (
                                <EmptyState icon="fas fa-money-bill-wave" text="No payment details recorded" />
                            )}
                        </div>
                    </div>
                )}

                {/* ── Education ────────────────────────────── */}
                {activeTab === 'education' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Education</h6></div>
                        <div className="card-body">
                            {educations.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Photo</th>
                                                <th>Name</th>
                                                <th>Added</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {educations.map((edu: any) => (
                                                <tr key={edu.id}>
                                                    <td>
                                                        {edu.photo ? (
                                                            <a href={edu.photo} target="_blank" rel="noopener noreferrer">
                                                                <img src={edu.photo} alt={edu.name}
                                                                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted small">—</span>
                                                        )}
                                                    </td>
                                                    <td className="fw-semibold">{edu.name}</td>
                                                    <td className="text-muted small">{formatDate(edu.created_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState icon="fas fa-graduation-cap" text="No education records" />
                            )}
                        </div>
                    </div>
                )}

                {/* ── Tax & Deduction ──────────────────────── */}
                {activeTab === 'tax' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Tax &amp; Deduction</h6></div>
                        <div className="card-body">
                            {taxDeductions.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Value</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taxDeductions.map((item: any) => (
                                                <tr key={item.id}>
                                                    <td className="fw-semibold">{item.name}</td>
                                                    <td>{item.value}</td>
                                                    <td>
                                                        <span className={`badge ${item.type === 'tax' ? 'bg-warning' : 'bg-secondary'}`}>
                                                            {item.type === 'tax' ? 'Tax' : 'Deduction'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState icon="fas fa-percent" text="No tax or deduction records" />
                            )}
                        </div>
                    </div>
                )}

                {/* ── Documents ────────────────────────────── */}
                {activeTab === 'documents' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Documents</h6></div>
                        <div className="card-body">
                            {documents.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Document Name</th>
                                                <th>Document Type</th>
                                                <th>File Type</th>
                                                <th>Uploaded</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc: any) => (
                                                <tr key={doc.id}>
                                                    <td className="fw-semibold">{doc.document_name}</td>
                                                    <td><span className="badge bg-info">{doc.document_type || '—'}</span></td>
                                                    <td className="text-uppercase small">{doc.file_type || '—'}</td>
                                                    <td className="text-muted small">{formatDate(doc.created_at)}</td>
                                                    <td>
                                                        {doc.file_path && (
                                                            <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
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
                                <EmptyState icon="fas fa-file-alt" text="No documents uploaded" />
                            )}
                        </div>
                    </div>
                )}

                {/* ── Log ──────────────────────────────────── */}
                {activeTab === 'log' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Activity Log</h6></div>
                        <div className="card-body">
                            {activityLogs.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {activityLogs.map((log: any) => (
                                        <li key={log.id} className="list-group-item d-flex justify-content-between align-items-start px-0">
                                            <div>
                                                <span className={`badge ${actionBadge(log.action)} me-2`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                                <span>{log.description}</span>
                                                {log.causer && (
                                                    <small className="text-muted d-block mt-1">
                                                        by {log.causer.agency_name || log.causer.name || 'System'}
                                                    </small>
                                                )}
                                            </div>
                                            <small className="text-muted text-nowrap ms-3">{formatDateTime(log.created_at)}</small>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <EmptyState icon="fas fa-clock-rotate-left" text="No activity recorded yet" />
                            )}
                        </div>
                    </div>
                )}

                {/* ── Attendance ───────────────────────────── */}
                {activeTab === 'attendance' && (
                    <AttendanceCalendar
                        month={attendanceMonth}
                        history={attendanceHistory || []}
                        staffUid={staff?.uid}
                        canEdit={true}
                        onMonthChange={handleAttendanceMonthChange}
                    />
                )}
                </div>
            </div>
        </div>
    );
}

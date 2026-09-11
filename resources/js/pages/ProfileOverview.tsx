import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MasterLayout from '@/layouts/backend/MasterLayout';
import AttendanceCalendar, { AttendanceEntry } from '@/components/AttendanceCalendar';
import AlertBell from '@/components/AlertBell';
import { isExpiringSoon } from '@/lib/utils';

interface ProfileData {
    name: string;
    email: string;
    phone: string | null;
    profile_image_url: string;
    role: string;
    status: string;
    joined_at: string;
    email_verified: boolean;
    agency_name: string | null;
}

interface PassportInfo {
    passport_number: string | null;
    front_image: string | null;
    back_image: string | null;
    expiry_date: string | null;
    is_foreigner: boolean;
    visa_expiry_date: string | null;
}

interface PaymentInfo {
    salary: number | string | null;
    bank_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
}

interface DocumentEntry {
    id: number;
    document_name: string;
    document_type: string | null;
    file_path: string;
    created_at: string;
}

interface ActivityLogEntry {
    id: number;
    action: string;
    description: string;
    created_at: string;
}

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'new_job' | 'urgent';

interface TaskEntry {
    uid: string;
    title: string;
    priority: TaskPriority;
    status: TaskStatus;
    due_date: string | null;
    created_by_name: string | null;
}

interface LeaveHistoryEntry {
    batch_id: string;
    leave_type: string | null;
    start_date: string;
    end_date: string;
    reason: string | null;
    status: 'pending' | 'approved' | 'rejected';
    applied_at: string;
}

interface LeaveBalanceEntry {
    id: number;
    name: string;
    allowed: number;
    used: number;
    balance: number;
}

interface PageProps {
    profile: ProfileData;
    canEditDetails: boolean;
    passport: PassportInfo | null;
    payment: PaymentInfo | null;
    hasEmergencyContact: boolean;
    documents: DocumentEntry[];
    activityLogs: ActivityLogEntry[];
    tasks: TaskEntry[];
    attendanceMonth: string;
    attendanceHistory: AttendanceEntry[];
    leaveHistory: LeaveHistoryEntry[];
    leaveBalances: LeaveBalanceEntry[];
}

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'leave', label: 'Leave' },
    { key: 'documents', label: 'Documents' },
    { key: 'activity', label: 'Activity' },
];

const TASK_PRIORITY_BADGE: Record<TaskPriority, string> = {
    new_job: 'bg-info bg-opacity-10 text-info-emphasis',
    urgent: 'bg-danger bg-opacity-10 text-danger',
};

const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
    new_job: 'New Job',
    urgent: 'Urgent',
};

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'Progress',
    review: 'Review',
    done: 'Done',
};

const LEAVE_STATUS_BADGE: Record<string, string> = {
    pending: 'bg-warning bg-opacity-10 text-warning-emphasis',
    approved: 'bg-success bg-opacity-10 text-success',
    rejected: 'bg-danger bg-opacity-10 text-danger',
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

const EmptyState = ({ icon, text }: { icon: string; text: string }) => (
    <div className="text-center py-5">
        <i className={icon} style={{ fontSize: '48px', color: '#ccc' }}></i>
        <p className="text-muted mt-3">{text}</p>
    </div>
);

export default function ProfileOverview() {
    const { profile, canEditDetails, passport, payment, hasEmergencyContact, documents, activityLogs, tasks, attendanceMonth, attendanceHistory, leaveHistory, leaveBalances } = usePage().props as unknown as PageProps;
    const [activeTab, setActiveTab] = useState('overview');

    const profileAlerts: string[] = [];
    if (isExpiringSoon(passport?.expiry_date)) profileAlerts.push('Passport expires within 6 months');
    if (passport?.is_foreigner && isExpiringSoon(passport?.visa_expiry_date)) profileAlerts.push('Visa expires within 6 months');
    if (!payment?.salary) profileAlerts.push('Salary is not added');
    if (!payment?.bank_name || !payment?.account_number) profileAlerts.push('Bank account details are missing');
    if (!payment?.ifsc_code) profileAlerts.push('Bank IFSC code is missing');
    if (!passport?.passport_number) profileAlerts.push('Passport number is missing');
    if (!passport?.front_image || !passport?.back_image) profileAlerts.push('Passport photo is missing');
    if (!hasEmergencyContact) profileAlerts.push('Emergency contact details are missing');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const [changingPassword, setChangingPassword] = useState(false);

    const handleAttendanceMonthChange = (newMonth: string) => {
        router.get('/profile/overview', { attendance_month: newMonth }, {
            preserveState: true,
            preserveScroll: true,
            only: ['attendanceMonth', 'attendanceHistory'],
        });
    };

    const formatDueDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    const submitPasswordChange = () => {
        setChangingPassword(true);
        setPasswordErrors({});
        router.put('/password', passwordData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPasswordModal(false);
                setPasswordData({ current_password: '', password: '', password_confirmation: '' });
            },
            onError: (errors) => setPasswordErrors(errors as Record<string, string>),
            onFinish: () => setChangingPassword(false),
        });
    };

    return (
        <MasterLayout title="Profile Overview">
            <Head title="Profile Overview" />

            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Overview</h1></li>
                        <li className="breadcrumb-item"><a href="/profile">Profile</a></li>
                        <li className="breadcrumb-item active">Overview</li>
                    </ol>
                </nav>
            </div>

            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-0 px-md-2 pt-md-2">
                {/* Profile Header */}
                <div className="card-body d-flex py-md-4">
                    <div className="clearfix">
                        <div className="d-inline-block position-relative me-sm-4 me-3 mb-3 mb-lg-0">
                            <img src={profile.profile_image_url} className="avatar avatar-xxl" alt={profile.name} />
                            <span className={`fa fa-circle border border-3 border-white position-absolute bottom-0 end-0 rounded-circle ${profile.status === 'active' ? 'text-success' : 'text-danger'}`}></span>
                        </div>
                    </div>
                    <div className="clearfix d-xl-flex flex-grow-1">
                        <div className="clearfix pe-md-5">
                            <h3 className="fw-semibold mb-1">
                                {profile.name}
                                {profile.email_verified && <i className="fa fa-circle-check text-primary ms-2"></i>}
                            </h3>
                            <ul className="d-flex flex-wrap align-items-center">
                                <li className="me-3 d-inline-flex align-items-center"><i className="las la-user me-1"></i>{profile.role}</li>
                                {profile.agency_name && (
                                    <li className="me-3 d-inline-flex align-items-center"><i className="las la-building me-1"></i>{profile.agency_name}</li>
                                )}
                                <li className="me-3 d-inline-flex align-items-center"><i className="las la-envelope me-1"></i>{profile.email}</li>
                                {profile.phone && (
                                    <li className="me-3 d-inline-flex align-items-center"><i className="las la-phone me-1"></i>{profile.phone}</li>
                                )}
                            </ul>
                            <div className="d-md-flex d-none flex-wrap">
                                <div className="border outline-dashed rounded p-2 d-flex align-items-center me-3 mt-3">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa fa-calendar"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h3 className="mb-0 fw-semibold lh-1">{profile.joined_at}</h3>
                                        <span className="small">Member Since</span>
                                    </div>
                                </div>
                                <div className="border outline-dashed rounded p-2 d-flex align-items-center me-3 mt-3">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa fa-file"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h3 className="mb-0 fw-semibold lh-1">{documents.length}</h3>
                                        <span className="small">Documents</span>
                                    </div>
                                </div>
                                <div className="border outline-dashed rounded p-2 d-flex align-items-center me-3 mt-3">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa fa-clock-rotate-left"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h3 className="mb-0 fw-semibold lh-1">{activityLogs.length}</h3>
                                        <span className="small">Activity Logs</span>
                                    </div>
                                </div>
                                <div className="border outline-dashed rounded p-2 d-flex align-items-center me-3 mt-3">
                                    <div className="avatar avatar-sm avatar-primary">
                                        <i className="fa fa-list-check"></i>
                                    </div>
                                    <div className="clearfix ms-2">
                                        <h3 className="mb-0 fw-semibold lh-1">{tasks.length}</h3>
                                        <span className="small">Assigned Tasks</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix mt-3 mt-xl-0 ms-auto text-end">
                            <div className="mb-3">
                                <AlertBell alerts={profileAlerts} />
                                <span className={`badge ms-2 ${profile.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                    {profile.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <small className="text-muted d-block">Joined on</small>
                            <strong>{profile.joined_at}</strong>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="card-footer py-3 d-flex flex-wrap justify-content-end align-items-center">
                    <div className="d-flex gap-2">
                        {canEditDetails && (
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => router.visit('/profile/edit-details')}>
                                <i className="fa fa-edit me-2"></i>Edit Profile
                            </button>
                        )}
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowPasswordModal(true)}>
                            <i className="fa fa-key me-2"></i>Change Password
                        </button>
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="card-footer py-0 d-flex flex-wrap justify-content-between align-items-center mx-sm-4 px-0">
                    <ul className="nav nav-underline gap-3 nav-scroll nav-scroll-auto-xl px-3 px-sm-0">
                        {TABS.map((tab) => (
                            <li className="nav-item" key={tab.key}>
                                <button
                                    type="button"
                                    className={`nav-link py-3 px-1 border-3 ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container-fluid mt-4 px-0">
                {activeTab === 'overview' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Account Information</h6></div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small">Full Name</label>
                                    <p className="fw-semibold mb-0">{profile.name}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small">Email</label>
                                    <p className="fw-semibold mb-0">{profile.email}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small">Phone</label>
                                    <p className="fw-semibold mb-0">{profile.phone || 'N/A'}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small">Role</label>
                                    <p className="fw-semibold mb-0">{profile.role}</p>
                                </div>
                                {profile.agency_name && (
                                    <div className="col-md-6 mb-3">
                                        <label className="text-muted small">Agency</label>
                                        <p className="fw-semibold mb-0">{profile.agency_name}</p>
                                    </div>
                                )}
                                <div className="col-md-6 mb-3">
                                    <label className="text-muted small">Member Since</label>
                                    <p className="fw-semibold mb-0">{profile.joined_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Assigned Tasks</h6></div>
                        <div className="card-body">
                            {tasks.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Type of Task</th>
                                                <th>Status</th>
                                                <th>Due Date</th>
                                                <th>Assigned By</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map((task) => (
                                                <tr key={task.uid} role="button" onClick={() => router.visit(`/admin/tasks/${task.uid}`)}>
                                                    <td>{task.title}</td>
                                                    <td><span className={`badge ${TASK_PRIORITY_BADGE[task.priority]}`}>{TASK_PRIORITY_LABEL[task.priority]}</span></td>
                                                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{TASK_STATUS_LABEL[task.status]}</span></td>
                                                    <td>{task.due_date ? formatDueDate(task.due_date) : 'N/A'}</td>
                                                    <td>{task.created_by_name ?? 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState icon="fas fa-list-check" text="No tasks assigned yet" />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <AttendanceCalendar
                        month={attendanceMonth}
                        history={attendanceHistory || []}
                        canEdit={false}
                        onMonthChange={handleAttendanceMonthChange}
                    />
                )}

                {activeTab === 'leave' && (
                    <>
                        <div className="row g-3 mb-3">
                            {leaveBalances.map((balance) => (
                                <div className="col-md-4 col-sm-6" key={balance.id}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h6 className="fw-semibold mb-2">{balance.name}</h6>
                                            <p className="mb-0 small text-muted">
                                                {balance.used} used of {balance.allowed} days
                                            </p>
                                            <p className="mb-0 fw-semibold text-success">{balance.balance} remaining</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {leaveBalances.length === 0 && (
                                <div className="col-12">
                                    <div className="text-muted small">No leave types configured</div>
                                </div>
                            )}
                        </div>

                        <div className="card h-auto">
                            <div className="card-header"><h6 className="card-title mb-0">Leave History</h6></div>
                            <div className="card-body">
                                {leaveHistory.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Leave Type</th>
                                                    <th>Dates</th>
                                                    <th>Reason</th>
                                                    <th>Status</th>
                                                    <th>Applied On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaveHistory.map((leave) => (
                                                    <tr key={leave.batch_id}>
                                                        <td>{leave.leave_type ?? 'N/A'}</td>
                                                        <td>{leave.start_date === leave.end_date ? leave.start_date : `${leave.start_date} - ${leave.end_date}`}</td>
                                                        <td>{leave.reason ?? 'N/A'}</td>
                                                        <td><span className={`badge ${LEAVE_STATUS_BADGE[leave.status]}`}>{leave.status}</span></td>
                                                        <td className="text-muted small">{leave.applied_at}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <EmptyState icon="fas fa-calendar-days" text="No leave requests yet" />
                                )}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'documents' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Documents</h6></div>
                        <div className="card-body">
                            {documents.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>Document Name</th>
                                                <th>Document Type</th>
                                                <th>Uploaded</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc) => (
                                                <tr key={doc.id}>
                                                    <td>{doc.document_name}</td>
                                                    <td>{doc.document_type || 'N/A'}</td>
                                                    <td className="text-muted small">{doc.created_at}</td>
                                                    <td className="text-end">
                                                        <a href={doc.file_path} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                                                            <i className="fa fa-eye"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EmptyState icon="fas fa-file" text="No documents uploaded yet" />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="card h-auto">
                        <div className="card-header"><h6 className="card-title mb-0">Activity Log</h6></div>
                        <div className="card-body">
                            {activityLogs.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {activityLogs.map((log) => (
                                        <li key={log.id} className="list-group-item d-flex justify-content-between align-items-start px-0">
                                            <div>
                                                <span className={`badge ${actionBadge(log.action)} me-2`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                                <span>{log.description}</span>
                                            </div>
                                            <small className="text-muted text-nowrap ms-3">{log.created_at}</small>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <EmptyState icon="fas fa-clock-rotate-left" text="No activity recorded yet" />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showPasswordModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Old Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordErrors.current_password ? 'is-invalid' : ''}`}
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    />
                                    {passwordErrors.current_password && <div className="invalid-feedback d-block">{passwordErrors.current_password}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordErrors.password ? 'is-invalid' : ''}`}
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                    />
                                    {passwordErrors.password && <div className="invalid-feedback d-block">{passwordErrors.password}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${passwordErrors.password_confirmation ? 'is-invalid' : ''}`}
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                    />
                                    {passwordErrors.password_confirmation && <div className="invalid-feedback d-block">{passwordErrors.password_confirmation}</div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitPasswordChange}
                                    disabled={changingPassword || !passwordData.current_password || !passwordData.password || !passwordData.password_confirmation}
                                >
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MasterLayout>
    );
}

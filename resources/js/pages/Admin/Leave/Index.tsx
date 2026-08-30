import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import DatePicker from '@/components/DatePicker';

interface StaffOption {
    uid: string;
    name: string;
}

interface LeaveType {
    id: number;
    name: string;
    days: number;
}

interface LeaveEntry {
    batch_id: string;
    staff_uid?: string;
    staff_name?: string;
    leave_type: string | null;
    leave_type_id: number | null;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    applied_at: string;
}

interface LeaveBalance {
    id: number;
    name: string;
    allowed: number;
    used: number;
    balance: number;
}

interface PageProps {
    isStaff: boolean;
    staffOptions: StaffOption[] | null;
    selectedUid: string | null;
    subjectName: string | null;
    canApply: boolean;
    canManageLeaveTypes: boolean;
    leaveTypes: LeaveType[];
    leaveBalances: LeaveBalance[];
    leaves: LeaveEntry[];
    errors: Record<string, string>;
}

const STATUS_BADGE: Record<string, string> = {
    pending: 'bg-warning bg-opacity-10 text-warning-emphasis',
    approved: 'bg-success bg-opacity-10 text-success',
    rejected: 'bg-danger bg-opacity-10 text-danger',
};

export default function LeaveIndex() {
    const { isStaff, staffOptions, selectedUid, subjectName, canApply, canManageLeaveTypes, leaveTypes, leaveBalances, leaves, errors } = usePage().props as unknown as PageProps;

    const [activeTab, setActiveTab] = useState<'history' | 'apply' | 'settings'>('history');

    const [staffSearch, setStaffSearch] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);

    const todayIso = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(todayIso);
    const [endDate, setEndDate] = useState(todayIso);
    const [leaveTypeId, setLeaveTypeId] = useState('');
    const [reason, setReason] = useState('');
    const [applying, setApplying] = useState(false);
    const [processingBatch, setProcessingBatch] = useState<string | null>(null);
    const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
    const [statusField, setStatusField] = useState<'pending' | 'approved' | 'rejected'>('pending');

    // Leave Type settings tab
    const [typeName, setTypeName] = useState('');
    const [typeDays, setTypeDays] = useState('');
    const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
    const [savingType, setSavingType] = useState(false);

    const filteredStaff = (staffOptions ?? []).filter((s) =>
        s.name.toLowerCase().includes(staffSearch.trim().toLowerCase())
    );

    const navigate = (params: Record<string, string | undefined>) => {
        router.get('/admin/leave', { staff: selectedUid ?? undefined, ...params }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setStaffSearch('');
        setPickerOpen(false);
        navigate({ staff: undefined });
    };

    const resetApplyForm = () => {
        setEditingBatchId(null);
        setReason('');
        setLeaveTypeId('');
        setStartDate(todayIso);
        setEndDate(todayIso);
        setStatusField('pending');
    };

    const handleApply = () => {
        setApplying(true);
        const payload: Record<string, string | number | null> = {
            start_date: startDate,
            end_date: endDate,
            reason,
            leave_type_id: leaveTypeId || null,
        };
        if (editingBatchId && !isStaff) {
            payload.status = statusField;
        }
        const onDone = {
            preserveScroll: true,
            onSuccess: () => {
                resetApplyForm();
                setActiveTab('history');
            },
            onFinish: () => setApplying(false),
        };

        if (editingBatchId) {
            router.put(`/admin/attendance/leave/${editingBatchId}`, payload, onDone);
        } else {
            router.post('/admin/attendance/leave', payload, onDone);
        }
    };

    const startEdit = (leave: LeaveEntry) => {
        setEditingBatchId(leave.batch_id);
        setStartDate(leave.start_date);
        setEndDate(leave.end_date);
        setReason(leave.reason);
        setLeaveTypeId(leave.leave_type_id ? String(leave.leave_type_id) : '');
        setStatusField(leave.status);
    };

    const respond = (leave: LeaveEntry, approve: boolean) => {
        const uid = leave.staff_uid ?? selectedUid;
        if (!uid) return;
        setProcessingBatch(leave.batch_id);
        router.post(`/admin/attendance/${uid}/leave-response`, {
            batch_id: leave.batch_id,
            approve,
        }, {
            preserveScroll: true,
            onFinish: () => setProcessingBatch(null),
        });
    };

    const resetTypeForm = () => {
        setEditingTypeId(null);
        setTypeName('');
        setTypeDays('');
    };

    const editType = (type: LeaveType) => {
        setEditingTypeId(type.id);
        setTypeName(type.name);
        setTypeDays(String(type.days));
    };

    const saveType = () => {
        setSavingType(true);
        const payload = { name: typeName, days: typeDays };
        const onDone = {
            onSuccess: () => resetTypeForm(),
            onFinish: () => setSavingType(false),
        };

        if (editingTypeId) {
            router.put(`/admin/leave-types/${editingTypeId}`, payload, { preserveScroll: true, ...onDone });
        } else {
            router.post('/admin/leave-types', payload, { preserveScroll: true, ...onDone });
        }
    };

    const deleteType = (type: LeaveType) => {
        router.delete(`/admin/leave-types/${type.id}`, { preserveScroll: true });
    };

    const formatRange = (start: string, end: string) => {
        if (start === end) return new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        return `${new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    const showStaffColumn = !isStaff && !selectedUid;

    const requestedDays = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
    const selectedBalance = leaveTypeId ? leaveBalances.find((b) => b.id === Number(leaveTypeId)) : undefined;
    const exceedsBalance = !!selectedBalance && requestedDays > selectedBalance.balance;
    const hasPendingLeave = isStaff && leaves.some((l) => l.status === 'pending' && l.batch_id !== editingBatchId);
    const canEditLeave = (leave: LeaveEntry) => !isStaff || leave.status === 'pending';

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Leave</h1></li>
                        <li className="breadcrumb-item active">Leave</li>
                    </ol>
                </nav>
            </div>

            {!isStaff && (
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2" style={{ maxWidth: 360 }}>
                            <label className="form-label fw-semibold mb-0">Staff Member</label>
                            {selectedUid && (
                                <button type="button" className="btn btn-sm btn-link text-decoration-none p-0" onClick={handleReset}>
                                    <i className="fa fa-rotate-left me-1"></i>Reset
                                </button>
                            )}
                        </div>
                        <div
                            className="position-relative"
                            style={{ maxWidth: 360 }}
                            onMouseEnter={() => setPickerOpen(true)}
                            onMouseLeave={() => setPickerOpen(false)}
                        >
                            <div className="position-relative">
                                <i className="fa fa-search position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }}></i>
                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder={subjectName || 'Search staff by name...'}
                                    value={staffSearch}
                                    onChange={(e) => setStaffSearch(e.target.value)}
                                    onFocus={() => setPickerOpen(true)}
                                    onBlur={() => setPickerOpen(false)}
                                />
                            </div>

                            {pickerOpen && (
                                <div
                                    className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
                                    style={{ zIndex: 20, maxHeight: 280, overflowY: 'auto' }}
                                >
                                    {filteredStaff.length > 0 ? (
                                        <div className="list-group list-group-flush">
                                            {filteredStaff.map((s) => {
                                                const active = s.uid === selectedUid;
                                                return (
                                                    <button
                                                        key={s.uid}
                                                        type="button"
                                                        className={`list-group-item list-group-item-action d-flex align-items-center gap-3 border-0 border-bottom rounded-0 ${active ? 'bg-primary bg-opacity-10' : ''}`}
                                                        onMouseDown={(e) => { e.preventDefault(); navigate({ staff: s.uid }); setPickerOpen(false); }}
                                                    >
                                                        <div
                                                            className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${active ? 'bg-primary' : 'bg-secondary bg-opacity-10'}`}
                                                            style={{ width: 36, height: 36 }}
                                                        >
                                                            <span className={`fw-bold ${active ? 'text-white' : 'text-secondary'}`} style={{ fontSize: 14 }}>
                                                                {s.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className={active ? 'fw-semibold text-primary' : ''}>{s.name}</span>
                                                        {active && <i className="fa fa-check text-primary ms-auto"></i>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-muted small p-3">No staff match "{staffSearch}"</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header py-0 d-flex flex-wrap justify-content-between align-items-center">
                    <ul className="nav nav-underline gap-3 nav-scroll px-3 px-sm-0" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                type="button"
                                className={`nav-link py-3 px-1 border-3 ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
                                role="tab"
                            >
                                Leave History
                            </button>
                        </li>
                        {canApply && (
                            <li className="nav-item" role="presentation">
                                <button
                                    type="button"
                                    className={`nav-link py-3 px-1 border-3 ${activeTab === 'apply' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('apply')}
                                    role="tab"
                                >
                                    <i className="fa fa-plane-departure me-2"></i>Apply Leave
                                </button>
                            </li>
                        )}
                        {canManageLeaveTypes && (
                            <li className="nav-item" role="presentation">
                                <button
                                    type="button"
                                    className={`nav-link py-3 px-1 border-3 ${activeTab === 'settings' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('settings')}
                                    role="tab"
                                >
                                    <i className="fa fa-gear me-2"></i>Settings
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                {activeTab === 'history' && (
                    <div className="card-body">
                        {leaves.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            {showStaffColumn && <th>Staff</th>}
                                            <th>Type</th>
                                            <th>Dates</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Applied</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.map((l) => (
                                            <tr key={l.batch_id}>
                                                {showStaffColumn && <td>{l.staff_name ?? <span className="text-muted">—</span>}</td>}
                                                <td>{l.leave_type ?? <span className="text-muted">—</span>}</td>
                                                <td>{formatRange(l.start_date, l.end_date)}</td>
                                                <td className="text-muted">{l.reason}</td>
                                                <td>
                                                    <span className={`badge ${STATUS_BADGE[l.status]}`}>
                                                        {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">{l.applied_at}</td>
                                                <td className="text-end">
                                                    <div className="d-flex gap-2 justify-content-end flex-wrap">
                                                        {!isStaff && l.status !== 'approved' && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => respond(l, true)}
                                                                disabled={processingBatch === l.batch_id}
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {!isStaff && l.status !== 'rejected' && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => respond(l, false)}
                                                                disabled={processingBatch === l.batch_id}
                                                            >
                                                                Reject
                                                            </button>
                                                        )}
                                                        {canEditLeave(l) && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => startEdit(l)}
                                                            >
                                                                Edit
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <i className="fa fa-calendar-xmark d-block mb-2" style={{ fontSize: 32 }}></i>
                                No leave records yet
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'apply' && canApply && (
                    <div className="card-body">
                        <div className="row g-4 align-items-start">
                            <div className="col-lg-7">
                                {hasPendingLeave && !errors?.start_date && (
                                    <div className="alert alert-warning py-2">
                                        You already have a pending leave request. Wait for it to be approved or rejected before applying again.
                                    </div>
                                )}
                                {errors?.start_date && (
                                    <div className="alert alert-danger py-2">{errors.start_date}</div>
                                )}
                                {errors?.leave_type_id && (
                                    <div className="alert alert-danger py-2">{errors.leave_type_id}</div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Leave Type:</label>
                                    <select className="form-select" value={leaveTypeId} onChange={(e) => setLeaveTypeId(e.target.value)}>
                                        <option value="">--SELECT TYPE--</option>
                                        {leaveTypes.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.days}d)</option>
                                        ))}
                                    </select>
                                    {selectedBalance && (
                                        <div className={`form-text ${exceedsBalance ? 'text-danger' : ''}`}>
                                            {selectedBalance.balance} day(s) remaining for {selectedBalance.name} this year.
                                        </div>
                                    )}
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-sm-6">
                                        <DatePicker
                                            label="From:"
                                            value={startDate}
                                            minDate={todayIso}
                                            onChange={(date) => {
                                                setStartDate(date);
                                                if (endDate < date) setEndDate(date);
                                            }}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <DatePicker
                                            label="To:"
                                            value={endDate}
                                            minDate={startDate}
                                            onChange={(date) => setEndDate(date)}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Message:</label>
                                    <textarea
                                        className="form-control"
                                        rows={6}
                                        placeholder="Reason for leave"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleApply}
                                    disabled={applying || !reason.trim() || exceedsBalance || hasPendingLeave}
                                >
                                    {applying ? 'Saving...' : 'Save'}
                                </button>
                            </div>

                            <div className="col-lg-5">
                                <div className="card border">
                                    <div className="card-header py-2 fw-semibold">
                                        Leave Stats {new Date().getFullYear()}
                                    </div>
                                    <div className="table-responsive" style={{ maxHeight: 420, overflowY: 'auto' }}>
                                        <table className="table table-hover align-middle mb-0 text-center">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-start">Leave Type</th>
                                                    <th>Allowed</th>
                                                    <th>Used</th>
                                                    <th>Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaveBalances.map((b) => (
                                                    <tr key={b.id}>
                                                        <td className="text-start">{b.name}</td>
                                                        <td>{b.allowed}</td>
                                                        <td>{b.used}</td>
                                                        <td>{b.balance}</td>
                                                    </tr>
                                                ))}
                                                {leaveBalances.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="text-muted">No leave types configured</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && canManageLeaveTypes && (
                    <div className="card-body">
                        <div className="row g-2 align-items-end mb-4">
                            <div className="col-sm-5">
                                <label className="form-label small">Type Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Sick Leave"
                                    value={typeName}
                                    onChange={(e) => setTypeName(e.target.value)}
                                />
                            </div>
                            <div className="col-sm-3">
                                <label className="form-label small">Days per Year</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={365}
                                    className="form-control"
                                    value={typeDays}
                                    onChange={(e) => setTypeDays(e.target.value)}
                                />
                            </div>
                            <div className="col-sm-2">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={saveType}
                                    disabled={savingType || !typeName.trim() || typeDays === ''}
                                >
                                    {editingTypeId ? 'Update' : 'Add'}
                                </button>
                            </div>
                            {editingTypeId && (
                                <div className="col-sm-2">
                                    <button type="button" className="btn btn-outline-secondary w-100" onClick={resetTypeForm}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {leaveTypes.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Days</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaveTypes.map((t) => (
                                            <tr key={t.id}>
                                                <td>{t.name}</td>
                                                <td>{t.days}</td>
                                                <td className="text-end">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editType(t)}>
                                                            Edit
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteType(t)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <i className="fa fa-list d-block mb-2" style={{ fontSize: 32 }}></i>
                                No leave types configured yet
                            </div>
                        )}
                    </div>
                )}
            </div>

            {editingBatchId && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Leave Request</h5>
                                <button type="button" className="btn-close" onClick={resetApplyForm}></button>
                            </div>
                            <div className="modal-body">
                                {errors?.start_date && (
                                    <div className="alert alert-danger py-2">{errors.start_date}</div>
                                )}
                                {errors?.leave_type_id && (
                                    <div className="alert alert-danger py-2">{errors.leave_type_id}</div>
                                )}
                                {isStaff && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Leave Type:</label>
                                        <select className="form-select" value={leaveTypeId} onChange={(e) => setLeaveTypeId(e.target.value)}>
                                            <option value="">--SELECT TYPE--</option>
                                            {leaveTypes.map((t) => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.days}d)</option>
                                            ))}
                                        </select>
                                        {selectedBalance && (
                                            <div className={`form-text ${exceedsBalance ? 'text-danger' : ''}`}>
                                                {selectedBalance.balance} day(s) remaining for {selectedBalance.name} this year.
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="row g-3 mb-3">
                                    <div className="col-sm-6">
                                        <DatePicker
                                            label="From:"
                                            value={startDate}
                                            onChange={(date) => {
                                                setStartDate(date);
                                                if (endDate < date) setEndDate(date);
                                            }}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <DatePicker
                                            label="To:"
                                            value={endDate}
                                            minDate={startDate}
                                            onChange={(date) => setEndDate(date)}
                                        />
                                    </div>
                                </div>
                                {!isStaff && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Status:</label>
                                        <select
                                            className="form-select"
                                            value={statusField}
                                            onChange={(e) => setStatusField(e.target.value as 'pending' | 'approved' | 'rejected')}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <div className="form-text">
                                            Approved deducts these days from the balance; Rejected or Pending frees them back up.
                                        </div>
                                    </div>
                                )}
                                {isStaff && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Message:</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            placeholder="Reason for leave"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={resetApplyForm}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleApply}
                                    disabled={applying || !reason.trim() || exceedsBalance}
                                >
                                    {applying ? 'Saving...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

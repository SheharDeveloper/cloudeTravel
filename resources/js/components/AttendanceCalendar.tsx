import { useState } from 'react';
import { router } from '@inertiajs/react';

export interface AttendanceEntry {
    date: string;
    status: 'present' | 'half_day' | 'leave' | 'absent' | null;
    work_type: 'office' | 'remote' | 'field' | null;
    checked_in_at: string | null;
    checked_out_at: string | null;
    checked_in_time: string | null;
    checked_out_time: string | null;
    lunch_start_at: string | null;
    lunch_end_at: string | null;
    leave_reason: string | null;
    leave_status: 'pending' | 'approved' | 'rejected' | null;
    leave_batch_id: string | null;
}

interface AttendanceCalendarProps {
    month: string; // 'YYYY-MM'
    history: AttendanceEntry[];
    subjectName?: string | null;
    staffUid?: string | null;
    canEdit?: boolean;
    onMonthChange: (month: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    present: { bg: 'bg-success bg-opacity-10', text: 'text-success', label: 'Present' },
    half_day: { bg: 'bg-warning bg-opacity-10', text: 'text-warning-emphasis', label: 'Half Day' },
    leave: { bg: 'bg-info bg-opacity-10', text: 'text-info-emphasis', label: 'Leave' },
    absent: { bg: 'bg-danger bg-opacity-10', text: 'text-danger', label: 'Absent' },
};

export default function AttendanceCalendar({ month, history, subjectName, staffUid, canEdit, onMonthChange }: AttendanceCalendarProps) {
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');
    const [status, setStatus] = useState('present');
    const [workType, setWorkType] = useState('office');
    const [saving, setSaving] = useState(false);

    const historyByDate = new Map(history.map((h) => [h.date, h]));

    const [year, monthNum] = month.split('-').map(Number);
    const firstOfMonth = new Date(year, monthNum - 1, 1);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const startWeekday = firstOfMonth.getDay();
    const monthLabel = firstOfMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const todayStr = new Date().toISOString().split('T')[0];

    const presentCount = history.filter((h) => h.status === 'present').length;
    const halfDayCount = history.filter((h) => h.status === 'half_day').length;
    const leaveCount = history.filter((h) => h.status === 'leave' && h.leave_status !== 'rejected').length;
    // The backend already backfills every day from the staff member's
    // joining date to today with no record as 'absent' — count those
    // directly instead of inferring from days-elapsed-in-month, which
    // doesn't know when the staff member actually joined.
    const absentCount = history.filter((h) => h.status === 'absent').length;

    const goToMonth = (offset: number) => {
        const d = new Date(year, monthNum - 1 + offset, 1);
        onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };

    const editingEntry = editingDate ? historyByDate.get(editingDate) : undefined;

    const openEdit = (dateStr: string) => {
        if (!canEdit || !staffUid) return;
        const entry = historyByDate.get(dateStr);
        setEditingDate(dateStr);
        setCheckInTime(entry?.checked_in_time ?? '');
        setCheckOutTime(entry?.checked_out_time ?? '');
        setStatus(entry?.status ?? 'present');
        setWorkType(entry?.work_type ?? 'office');
    };

    const closeEdit = () => setEditingDate(null);

    const saveEdit = () => {
        if (!editingDate || !staffUid) return;
        setSaving(true);
        router.patch(`/admin/attendance/${staffUid}/day`, {
            date: editingDate,
            checked_in_time: checkInTime || null,
            checked_out_time: checkOutTime || null,
            status,
            work_type: workType,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSaving(false);
                closeEdit();
            },
        });
    };

    const clearCheckout = () => {
        if (!editingDate || !staffUid) return;
        setSaving(true);
        router.patch(`/admin/attendance/${staffUid}/day`, {
            date: editingDate,
            checked_in_time: checkInTime || null,
            clear_checkout: true,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSaving(false);
                closeEdit();
            },
        });
    };

    const respondLeave = (approve: boolean) => {
        if (!editingDate || !staffUid || !editingEntry?.leave_batch_id) return;
        setSaving(true);
        router.post(`/admin/attendance/${staffUid}/leave-response`, {
            batch_id: editingEntry.leave_batch_id,
            approve,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSaving(false);
                closeEdit();
            },
        });
    };

    const cells: (number | null)[] = [
        ...Array.from({ length: startWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <div className="card">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <button type="button" className="btn btn-sm btn-light" onClick={() => goToMonth(-1)}>
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <h6 className="card-title mb-0">
                        {subjectName ? `${subjectName} — ` : ''}{monthLabel}
                    </h6>
                    <button type="button" className="btn btn-sm btn-light" onClick={() => goToMonth(1)}>
                        <i className="fa fa-chevron-right"></i>
                    </button>
                </div>
                <div className="d-flex justify-content-center flex-wrap gap-3">
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">Present: {presentCount}</span>
                    <span className="badge bg-warning bg-opacity-10 text-warning-emphasis px-3 py-2">Half Day: {halfDayCount}</span>
                    <span className="badge bg-info bg-opacity-10 text-info-emphasis px-3 py-2">Leave: {leaveCount}</span>
                    <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">Absent: {absentCount}</span>
                </div>
            </div>
            <div className="card-body">
                <div className="row g-2 mb-2 text-center fw-semibold text-muted">
                    {WEEKDAYS.map((d) => (
                        <div className="col" key={d}>{d}</div>
                    ))}
                </div>
                <div className="row g-2">
                    {cells.map((day, i) => {
                        if (day === null) {
                            return <div className="col-auto" style={{ width: `${100 / 7}%` }} key={`blank-${i}`} />;
                        }
                        const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const entry = historyByDate.get(dateStr);
                        const isToday = dateStr === todayStr;
                        const style = entry?.status ? STATUS_STYLE[entry.status] : null;

                        return (
                            <div className="col-auto" style={{ width: `${100 / 7}%` }} key={dateStr}>
                                <div
                                    className={`rounded p-2 text-center ${style?.bg ?? ''}`}
                                    style={{
                                        border: isToday ? '2px solid #452B90' : '1px solid #e5e7eb',
                                        minHeight: 70,
                                        cursor: canEdit && staffUid ? 'pointer' : undefined,
                                    }}
                                    onClick={() => openEdit(dateStr)}
                                >
                                    <div className="fw-semibold">{day}</div>
                                    {entry?.status && (
                                        <div className={`small mt-1 ${style?.text ?? ''}`}>
                                            {style?.label}
                                            {entry.status === 'leave' && entry.leave_status === 'pending' && (
                                                <span className="d-block">(pending)</span>
                                            )}
                                            {entry.status !== 'leave' && entry.checked_in_at && (
                                                <>
                                                    <br />{entry.checked_in_at}
                                                    {entry.checked_out_at ? <><br />{entry.checked_out_at}</> : null}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {editingDate && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Attendance — {editingDate}</h5>
                                <button type="button" className="btn-close" onClick={closeEdit}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="present">Present</option>
                                            <option value="half_day">Half Day</option>
                                            <option value="leave">Leave</option>
                                            <option value="absent">Absent</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label className="form-label">Work Type</label>
                                        <select className="form-select" value={workType} onChange={(e) => setWorkType(e.target.value)}>
                                            <option value="office">Office</option>
                                            <option value="remote">Remote</option>
                                            <option value="field">Field</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Check-in Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={checkInTime}
                                        onChange={(e) => setCheckInTime(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Check-out Time</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={checkOutTime}
                                        onChange={(e) => setCheckOutTime(e.target.value)}
                                    />
                                </div>

                                {(editingEntry?.lunch_start_at || editingEntry?.lunch_end_at) && (
                                    <div className="mb-3 small text-muted">
                                        Lunch: {editingEntry?.lunch_start_at ?? '—'} to {editingEntry?.lunch_end_at ?? '—'}
                                    </div>
                                )}

                                {editingEntry?.leave_reason && (
                                    <div className="alert alert-info small">
                                        <strong>Leave reason:</strong> {editingEntry.leave_reason}
                                        {editingEntry.leave_status && <div>Status: {editingEntry.leave_status}</div>}
                                    </div>
                                )}

                                {editingEntry?.status === 'leave' && editingEntry?.leave_status === 'pending' && (
                                    <div className="d-flex gap-2 mb-3">
                                        <button type="button" className="btn btn-sm btn-success" onClick={() => respondLeave(true)} disabled={saving}>
                                            Approve Leave
                                        </button>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => respondLeave(false)} disabled={saving}>
                                            Reject Leave
                                        </button>
                                    </div>
                                )}

                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={clearCheckout} disabled={saving}>
                                    Remove Checkout
                                </button>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

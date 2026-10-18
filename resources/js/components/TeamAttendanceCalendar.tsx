import { useState } from 'react';

/** One member on a day of the team calendar. */
export interface TeamMember {
    uid: string;
    name: string;
    photo: string | null;
    checked_in_at: string | null;
    checked_out_at: string | null;
    work_type: 'office' | 'remote' | 'field' | null;
    leave_status: 'pending' | 'approved' | 'rejected' | null;
}

/** One day of the team calendar: everyone on the team that day, by status. */
export interface TeamDay {
    date: string;
    total: number;
    present: TeamMember[];
    half_day: TeamMember[];
    leave: TeamMember[];
    absent: TeamMember[];
}

interface Props {
    month: string; // 'YYYY-MM'
    days: TeamDay[];
    onMonthChange: (month: string) => void;
    // Opens one member's own calendar
    onSelectStaff: (uid: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GROUPS: { key: 'present' | 'half_day' | 'leave' | 'absent'; label: string; badge: string; text: string }[] = [
    { key: 'present', label: 'Present', badge: 'bg-success', text: 'text-success' },
    { key: 'half_day', label: 'Half Day', badge: 'bg-warning text-dark', text: 'text-warning-emphasis' },
    { key: 'leave', label: 'Leave', badge: 'bg-info text-dark', text: 'text-info-emphasis' },
    { key: 'absent', label: 'Absent', badge: 'bg-danger', text: 'text-danger' },
];

const formatDay = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** The member's photo, or their initial when they have none. */
function Avatar({ member, size = 32 }: { member: TeamMember; size?: number }) {
    return member.photo ? (
        <img src={member.photo} alt={member.name} className="rounded-circle flex-shrink-0" style={{ width: size, height: size, objectFit: 'cover' }} />
    ) : (
        <div
            className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.42 }}
        >
            {member.name.charAt(0).toUpperCase()}
        </div>
    );
}

/** "09:05 AM – 06:10 PM", or the leave state, for one member. */
const memberTime = (m: TeamMember, group: string) => {
    if (group === 'leave') return m.leave_status === 'pending' ? 'Leave (pending)' : 'On leave';
    if (group === 'absent') return 'No check-in';
    if (!m.checked_in_at) return '';
    return m.checked_out_at ? `${m.checked_in_at} – ${m.checked_out_at}` : `In ${m.checked_in_at}`;
};

/**
 * All staff at once: each day shows how many were present out of the team.
 * Hover a day to see who was in (photo and times); click the count for the
 * full list — present, half day, leave and absent.
 */
export default function TeamAttendanceCalendar({ month, days, onMonthChange, onSelectStaff }: Props) {
    const [hovered, setHovered] = useState<string | null>(null);
    const [openDay, setOpenDay] = useState<TeamDay | null>(null);

    const byDate = new Map(days.map((d) => [d.date, d]));
    const [year, monthNum] = month.split('-').map(Number);
    const firstOfMonth = new Date(year, monthNum - 1, 1);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const startWeekday = firstOfMonth.getDay();
    const monthLabel = firstOfMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    const todayStr = new Date().toISOString().split('T')[0];
    const teamSize = days.length ? Math.max(...days.map((d) => d.total)) : 0;

    const goToMonth = (offset: number) => {
        const d = new Date(year, monthNum - 1 + offset, 1);
        onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
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
                    <h6 className="card-title mb-0">All Staff — {monthLabel}</h6>
                    <button type="button" className="btn btn-sm btn-light" onClick={() => goToMonth(1)}>
                        <i className="fa fa-chevron-right"></i>
                    </button>
                </div>
                <div className="d-flex justify-content-center flex-wrap gap-3 small text-muted">
                    <span><i className="fa fa-users me-1"></i>Team: <strong>{teamSize}</strong> members</span>
                    <span>Each day: <strong className="text-success">present</strong> / total · hover for who was in · click the count for details</span>
                </div>
            </div>
            <div className="card-body">
                <div className="row g-2 mb-2 text-center fw-semibold text-muted">
                    {WEEKDAYS.map((d) => <div className="col" key={d}>{d}</div>)}
                </div>
                <div className="row g-2">
                    {cells.map((day, i) => {
                        if (day === null) {
                            return <div className="col-auto" style={{ width: `${100 / 7}%` }} key={`blank-${i}`} />;
                        }
                        const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const entry = byDate.get(dateStr);
                        const isToday = dateStr === todayStr;
                        const column = (startWeekday + day - 1) % 7;
                        const present = entry ? entry.present.length + entry.half_day.length : 0;
                        const showPopup = hovered === dateStr && !!entry && entry.total > 0;

                        return (
                            <div className="col-auto position-relative" style={{ width: `${100 / 7}%` }} key={dateStr}>
                                <div
                                    className="rounded p-2 text-center h-100"
                                    style={{ border: isToday ? '2px solid #452B90' : '1px solid #e5e7eb', minHeight: 84, background: entry && entry.total > 0 ? '#fff' : '#fafafa' }}
                                    onMouseEnter={() => setHovered(dateStr)}
                                    onMouseLeave={() => setHovered((h) => (h === dateStr ? null : h))}
                                >
                                    <div className="fw-semibold">{day}</div>
                                    {entry && entry.total > 0 && (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success bg-opacity-10 border-0 fw-bold mt-1 px-2 py-1"
                                                style={{ background: 'rgba(25,135,84,.12)', color: '#198754', fontSize: 15 }}
                                                onClick={() => setOpenDay(entry)}
                                                title="See who was present, on leave and absent"
                                            >
                                                {present}<span className="text-muted fw-normal" style={{ fontSize: 12 }}> / {entry.total}</span>
                                            </button>
                                            <div className="d-flex justify-content-center gap-1 mt-1" style={{ fontSize: 10 }}>
                                                {entry.leave.length > 0 && <span className="badge bg-info bg-opacity-25 text-info-emphasis">L {entry.leave.length}</span>}
                                                {entry.absent.length > 0 && <span className="badge bg-danger bg-opacity-10 text-danger">A {entry.absent.length}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Hover: who was in, with their photo and times */}
                                {showPopup && (
                                    <div
                                        className="position-absolute bg-white border rounded shadow p-2 text-start"
                                        style={{ zIndex: 30, top: '100%', marginTop: 4, width: 260, ...(column >= 4 ? { right: 0 } : { left: 0 }) }}
                                        onMouseEnter={() => setHovered(dateStr)}
                                        onMouseLeave={() => setHovered(null)}
                                    >
                                        <div className="small fw-semibold mb-2">
                                            {formatDay(dateStr)}
                                            <span className="text-success ms-1">· {present}/{entry!.total} present</span>
                                        </div>
                                        {present === 0 ? (
                                            <div className="small text-muted">Nobody checked in.</div>
                                        ) : (
                                            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                                                {[...entry!.present.map((m) => ['present', m] as const), ...entry!.half_day.map((m) => ['half_day', m] as const)].map(([group, m]) => (
                                                    <div key={m.uid} className="d-flex align-items-center gap-2 py-1">
                                                        <Avatar member={m} />
                                                        <div className="lh-sm" style={{ minWidth: 0 }}>
                                                            <div className="small fw-semibold text-truncate">{m.name}{group === 'half_day' && <span className="text-warning-emphasis fw-normal"> · Half day</span>}</div>
                                                            <div className="text-muted" style={{ fontSize: 11 }}>{memberTime(m, group)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {(entry!.leave.length > 0 || entry!.absent.length > 0) && (
                                            <div className="border-top mt-2 pt-1 text-muted" style={{ fontSize: 11 }}>
                                                {entry!.leave.length > 0 && <>On leave: {entry!.leave.length} · </>}Absent: {entry!.absent.length} — click the count for names
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Click: the full day — counts and everyone, by status */}
            {openDay && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setOpenDay(null)}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Attendance — {formatDay(openDay.date)}</h5>
                                <button type="button" className="btn-close" onClick={() => setOpenDay(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <span className="badge bg-secondary px-3 py-2">Total: {openDay.total}</span>
                                    {GROUPS.map((g) => (
                                        <span key={g.key} className={`badge ${g.badge} px-3 py-2`}>{g.label}: {openDay[g.key].length}</span>
                                    ))}
                                </div>
                                <div className="row">
                                    {GROUPS.filter((g) => openDay[g.key].length > 0).map((g) => (
                                        <div key={g.key} className="col-md-6 mb-3">
                                            <h6 className={`fw-semibold ${g.text}`}>{g.label} ({openDay[g.key].length})</h6>
                                            <div className="list-group">
                                                {openDay[g.key].map((m) => (
                                                    <button
                                                        key={m.uid}
                                                        type="button"
                                                        className="list-group-item list-group-item-action d-flex align-items-center gap-2"
                                                        onClick={() => { setOpenDay(null); onSelectStaff(m.uid); }}
                                                        title={`Open ${m.name}'s calendar`}
                                                    >
                                                        <Avatar member={m} size={34} />
                                                        <div className="lh-sm text-start" style={{ minWidth: 0 }}>
                                                            <div className="fw-semibold text-truncate">{m.name}</div>
                                                            <small className="text-muted">
                                                                {memberTime(m, g.key)}
                                                                {m.work_type && g.key !== 'absent' && g.key !== 'leave' && <> · <span className="text-capitalize">{m.work_type}</span></>}
                                                            </small>
                                                        </div>
                                                        <i className="fa fa-chevron-right text-muted ms-auto small"></i>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

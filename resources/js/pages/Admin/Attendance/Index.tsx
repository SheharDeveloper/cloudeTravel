import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AttendanceCalendar, { AttendanceEntry } from '@/components/AttendanceCalendar';
import TeamAttendanceCalendar, { type TeamDay } from '@/components/TeamAttendanceCalendar';

interface StaffOption {
    uid: string;
    name: string;
}

interface PageProps {
    isStaff: boolean;
    month: string;
    staffOptions: StaffOption[] | null;
    selectedUid: string | null;
    subjectName: string | null;
    today: AttendanceEntry | null;
    canCheckInOut: boolean;
    history: AttendanceEntry[];
    // No staff member picked (owner / superadmin): the whole team's month
    team: TeamDay[] | null;
}

export default function AttendanceIndex() {
    const { isStaff, month, staffOptions, selectedUid, subjectName, today, canCheckInOut, history, team } = usePage().props as unknown as PageProps;
    const [checkingOut, setCheckingOut] = useState(false);
    const [staffSearch, setStaffSearch] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [lunchProcessing, setLunchProcessing] = useState(false);
    const [extending, setExtending] = useState(false);

    const filteredStaff = (staffOptions ?? []).filter((s) =>
        s.name.toLowerCase().includes(staffSearch.trim().toLowerCase())
    );

    const navigate = (params: Record<string, string | undefined>) => {
        router.get('/admin/attendance', { month, staff: selectedUid ?? undefined, ...params }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCheckOut = () => {
        setCheckingOut(true);
        router.post('/admin/attendance/check-out', {}, {
            onFinish: () => setCheckingOut(false),
        });
    };

    const handleLunch = (start: boolean) => {
        setLunchProcessing(true);
        router.post(`/admin/attendance/lunch-${start ? 'start' : 'end'}`, {}, {
            onFinish: () => setLunchProcessing(false),
        });
    };

    // Owner/superadmin: more time today for the selected staff member
    const handleExtend = (minutes: number) => {
        if (!selectedUid) return;
        setExtending(true);
        router.post(`/admin/attendance/${selectedUid}/extend`, { minutes }, {
            preserveScroll: true,
            onFinish: () => setExtending(false),
        });
    };

    const handleReset = () => {
        setStaffSearch('');
        setPickerOpen(false);
        navigate({ staff: undefined });
    };

    const showCalendar = isStaff || !!selectedUid;

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Attendance</h1></li>
                        <li className="breadcrumb-item active">Attendance</li>
                    </ol>
                </nav>
            </div>

            {canCheckInOut && (
                <div className="card mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h6 className="mb-1">Today</h6>
                            {today ? (
                                <span className="text-muted">
                                    Checked in at <strong>{today.checked_in_at}</strong>
                                    {today.checked_out_at ? (
                                        <> &middot; Checked out at <strong>{today.checked_out_at}</strong></>
                                    ) : null}
                                    {today.lunch_start_at && (
                                        <> &middot; Lunch {today.lunch_start_at}{today.lunch_end_at ? ` – ${today.lunch_end_at}` : ' (ongoing)'}</>
                                    )}
                                    {today.time_limit_at && (
                                        <> &middot; Auto check-out at <strong>{today.time_limit_at}</strong></>
                                    )}
                                    {today.auto_checked_out && (
                                        <span className="badge bg-danger ms-2">Checked out automatically</span>
                                    )}
                                </span>
                            ) : (
                                <span className="text-muted">No attendance recorded yet today</span>
                            )}
                        </div>

                        <div className="d-flex gap-2">
                            {today && !today.checked_out_at && (
                                !today.lunch_start_at ? (
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => handleLunch(true)} disabled={lunchProcessing}>
                                        Lunch In
                                    </button>
                                ) : !today.lunch_end_at ? (
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => handleLunch(false)} disabled={lunchProcessing}>
                                        Lunch Out
                                    </button>
                                ) : null
                            )}

                            {today && !today.checked_out_at && (
                                <button type="button" className="btn btn-danger" onClick={handleCheckOut} disabled={checkingOut}>
                                    {checkingOut ? 'Checking out...' : 'Check Out'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

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

            {/* Owner/superadmin: the selected staff member's day today, and more time if they need it */}
            {!isStaff && selectedUid && (
                <div className="card mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h6 className="mb-1">Today — {subjectName}</h6>
                            {today?.checked_in_at ? (
                                <span className="text-muted">
                                    Checked in at <strong>{today.checked_in_at}</strong>
                                    {today.checked_out_at && <> &middot; Checked out at <strong>{today.checked_out_at}</strong></>}
                                    {today.time_limit_at && <> &middot; Auto check-out at <strong>{today.time_limit_at}</strong></>}
                                    {(today.extended_minutes ?? 0) > 0 && <> &middot; Extended +{today.extended_minutes} min</>}
                                    {today.auto_checked_out && <span className="badge bg-danger ms-2">Checked out automatically</span>}
                                </span>
                            ) : (
                                <span className="text-muted">Not checked in today</span>
                            )}
                        </div>
                        {today?.checked_in_at && (today.time_limit_at || today.checked_out_at) && (
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="small text-muted">{today.checked_out_at ? 'Check back in and extend:' : 'Extend time:'}</span>
                                {[30, 60, 120].map((m) => (
                                    <button key={m} type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleExtend(m)} disabled={extending}>
                                        +{m < 60 ? `${m}m` : `${m / 60}h`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showCalendar ? (
                <AttendanceCalendar
                    month={month}
                    history={history}
                    subjectName={!isStaff ? subjectName : null}
                    staffUid={selectedUid}
                    canEdit={!isStaff}
                    onMonthChange={(newMonth) => navigate({ month: newMonth })}
                />
            ) : team ? (
                /* Everyone at once; pick a member (above, or from a day) for their own calendar */
                <TeamAttendanceCalendar
                    month={month}
                    days={team}
                    onMonthChange={(newMonth) => navigate({ month: newMonth })}
                    onSelectStaff={(uid) => navigate({ staff: uid })}
                />
            ) : (
                <div className="card">
                    <div className="card-body text-center text-muted py-5">
                        <i className="fa fa-user-check d-block mb-2" style={{ fontSize: 32 }}></i>
                        Select a staff member above to view their attendance
                    </div>
                </div>
            )}
        </div>
    );
}

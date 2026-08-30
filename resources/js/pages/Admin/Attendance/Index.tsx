import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AttendanceCalendar, { AttendanceEntry } from '@/components/AttendanceCalendar';

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
}

export default function AttendanceIndex() {
    const { isStaff, month, staffOptions, selectedUid, subjectName, today, canCheckInOut, history } = usePage().props as unknown as PageProps;
    const [checkingOut, setCheckingOut] = useState(false);
    const [staffSearch, setStaffSearch] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [lunchProcessing, setLunchProcessing] = useState(false);

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

            {showCalendar ? (
                <AttendanceCalendar
                    month={month}
                    history={history}
                    subjectName={!isStaff ? subjectName : null}
                    staffUid={selectedUid}
                    canEdit={!isStaff}
                    onMonthChange={(newMonth) => navigate({ month: newMonth })}
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

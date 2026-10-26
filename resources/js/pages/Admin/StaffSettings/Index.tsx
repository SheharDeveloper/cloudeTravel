import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { hoursLabel } from '@/components/AttendanceCalendar';

interface StaffRow {
    uid: string;
    name: string;
    email: string;
    photo: string | null;
    salary: number | null;
    salary_type: 'per_hour' | 'per_day' | 'per_month';
    currency: string | null;
    shift_start: string;
    shift_end: string;
    lunch_minutes: number | null;
    working_days: number | null;
    // Today, for Extend: checked in / due out / checked out
    today?: {
        ends_at: string | null;
        // Working hours have ended: can't sign in until extended
        hours_over: boolean;
        checked_in_at: string | null;
        checked_out_at: string | null;
        auto_checked_out: boolean;
        extended_minutes: number;
    } | null;
}

type TimingProps = Pick<StaffRow, 'shift_start' | 'shift_end' | 'lunch_minutes' | 'working_days'>;

interface Timing {
    shift_start: string;
    shift_end: string;
    lunch_minutes: string;
    working_days: string;
}

const FIELDS: (keyof Timing)[] = ['shift_start', 'shift_end', 'lunch_minutes', 'working_days'];

const SALARY_LABEL: Record<StaffRow['salary_type'], string> = { per_hour: '/ hour', per_day: '/ day', per_month: '/ month' };

const toTiming = (s: TimingProps): Timing => ({
    shift_start: s.shift_start,
    shift_end: s.shift_end,
    lunch_minutes: s.lunch_minutes != null ? String(s.lunch_minutes) : '',
    working_days: s.working_days != null ? String(s.working_days) : '',
});

const toPayload = (t: Timing) => ({
    shift_start: t.shift_start || null,
    shift_end: t.shift_end || null,
    lunch_minutes: t.lunch_minutes === '' ? null : Number(t.lunch_minutes),
    working_days: t.working_days === '' ? null : Number(t.working_days),
});

/** A staff member's own value for each field, or the default where they have none — as attendance uses it. */
const effective = (own: Timing, def: Timing): Timing =>
    Object.fromEntries(FIELDS.map((f) => [f, own[f] !== '' ? own[f] : def[f]])) as unknown as Timing;

const isCustom = (t: Timing) => FIELDS.some((f) => t[f] !== '');

/** Shift length minus the lunch allowed, in minutes — what attendance pays for a full day. */
const paidMinutes = (t: Timing) => {
    if (!t.shift_start || !t.shift_end) return null;
    const [sh, sm] = t.shift_start.split(':').map(Number);
    const [eh, em] = t.shift_end.split(':').map(Number);
    const shift = eh * 60 + em - (sh * 60 + sm);
    return shift > 0 ? Math.max(shift - (Number(t.lunch_minutes) || 0), 0) : null;
};

/** Same hourly rate AttendanceService uses for a day's pay. */
const hourlyRate = (s: StaffRow, t: Timing) => {
    if (s.salary == null) return null;
    if (s.salary_type === 'per_hour') return s.salary;
    const paid = paidMinutes(t);
    if (!paid) return null;
    const hours = paid / 60;
    return s.salary_type === 'per_day' ? s.salary / hours : s.salary / ((Number(t.working_days) || 26) * hours);
};

/** "Default 09:00" under an empty field, so it's clear what applies. */
const DefaultHint = ({ value }: { value: string }) =>
    value ? <small className="text-muted d-block mt-1" style={{ fontSize: 11 }}>Default {value}</small> : null;

export default function StaffSettingsIndex({ staff, defaults }: { staff: StaffRow[]; defaults: TimingProps }) {
    const { flash, errors } = usePage().props as unknown as { flash?: { success?: string }; errors: Record<string, string> };
    const [def, setDef] = useState<Timing>(() => toTiming(defaults));
    const [rows, setRows] = useState<Record<string, Timing>>(() => Object.fromEntries(staff.map((s) => [s.uid, toTiming(s)])));
    const [saving, setSaving] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    // Extend by a typed amount, per staff member
    const [customTime, setCustomTime] = useState<Record<string, { h: string; m: string }>>({});
    const setCustom = (uid: string, key: 'h' | 'm', value: string) =>
        setCustomTime((c) => ({ ...c, [uid]: { ...(c[uid] ?? { h: '', m: '' }), [key]: value } }));
    const customMinutes = (uid: string) => (Number(customTime[uid]?.h) || 0) * 60 + (Number(customTime[uid]?.m) || 0);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: flash.success });
    }, [flash?.success]);

    useEffect(() => {
        const first = Object.values(errors ?? {})[0];
        if (first) toast.error(first);
    }, [errors]);

    // The saved default — what staff rows fall back to until a new default is saved
    const savedDef = toTiming(defaults);
    const defDirty = JSON.stringify(def) !== JSON.stringify(savedDef);

    const set = (uid: string, key: keyof Timing, value: string) => setRows((r) => ({ ...r, [uid]: { ...r[uid], [key]: value } }));

    const isDirty = (s: StaffRow) => JSON.stringify(rows[s.uid]) !== JSON.stringify(toTiming(s));

    const put = (url: string, t: Timing, key: string) => {
        setSaving(key);
        router.put(url, toPayload(t), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSaving(null),
        });
    };

    const saveDefault = () => put('/admin/staff-settings/default', def, 'default');

    const save = (s: StaffRow) => put(`/admin/staff-settings/${s.uid}`, rows[s.uid], s.uid);

    // Clears the staff member's own hours, so they go back to the default
    const useDefault = (s: StaffRow) => {
        const blank = { shift_start: '', shift_end: '', lunch_minutes: '', working_days: '' };
        setRows((r) => ({ ...r, [s.uid]: blank }));
        put(`/admin/staff-settings/${s.uid}`, blank, s.uid);
    };

    // More time today: checks them back in if they'd checked out, so they can sign in again
    const extend = (s: StaffRow, minutes: number) => {
        setSaving(`extend-${s.uid}`);
        router.post(`/admin/attendance/${s.uid}/extend`, { minutes }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setSaving(null),
        });
    };

    const shown = staff.filter((s) => `${s.name} ${s.email}`.toLowerCase().includes(search.trim().toLowerCase()));
    const defPaid = paidMinutes(def);

    return (
        <div>
            <Head title="Staff Settings" />
            <Toaster position="top-right" />
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Staff Settings</h1></li>
                        <li className="breadcrumb-item active">Staff Settings</li>
                    </ol>
                </nav>
            </div>

            {/* Default working hours — every staff member uses these unless they have their own */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <h6 className="card-title mb-0">Default Working Hours</h6>
                        <small className="text-muted">Applies to every staff member automatically, including new staff. Set different hours for anyone in the list below.</small>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-6 col-md-2">
                            <label className="form-label">Start</label>
                            <input type="time" className="form-control" value={def.shift_start} onChange={(e) => setDef({ ...def, shift_start: e.target.value })} />
                        </div>
                        <div className="col-6 col-md-2">
                            <label className="form-label">End</label>
                            <input type="time" className="form-control" value={def.shift_end} onChange={(e) => setDef({ ...def, shift_end: e.target.value })} />
                        </div>
                        <div className="col-6 col-md-2">
                            <label className="form-label">Lunch (min)</label>
                            <input type="number" min={0} max={240} className="form-control" placeholder="60" value={def.lunch_minutes} onChange={(e) => setDef({ ...def, lunch_minutes: e.target.value })} />
                        </div>
                        <div className="col-6 col-md-2">
                            <label className="form-label">Days / month</label>
                            <input type="number" min={1} max={31} className="form-control" placeholder="26" value={def.working_days} onChange={(e) => setDef({ ...def, working_days: e.target.value })} />
                        </div>
                        <div className="col-6 col-md-2">
                            <label className="form-label">Paid / day</label>
                            <div className="form-control-plaintext fw-semibold">{defPaid ? hoursLabel(defPaid) : '—'}</div>
                        </div>
                        <div className="col-6 col-md-2 text-end">
                            <button type="button" className="btn btn-primary w-100" onClick={saveDefault} disabled={!defDirty || saving === 'default'}>
                                {saving === 'default' ? 'Saving...' : 'Save Default'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
                    <div>
                        <h6 className="card-title mb-0">Staff Working Hours</h6>
                        <small className="text-muted">Leave a field empty to use the default. Attendance pays for hours actually worked and flags late starts and long lunches.</small>
                    </div>
                    <input
                        type="search"
                        className="form-control form-control-sm"
                        style={{ maxWidth: 240 }}
                        placeholder="Search staff..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="card-body">
                    {shown.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light text-nowrap">
                                    <tr>
                                        <th>Staff</th>
                                        <th>Salary</th>
                                        <th style={{ minWidth: 120 }}>Start</th>
                                        <th style={{ minWidth: 120 }}>End</th>
                                        <th style={{ minWidth: 110 }}>Lunch (min)</th>
                                        <th style={{ minWidth: 110 }}>Days / month</th>
                                        <th>Paid / day</th>
                                        <th>Hourly rate</th>
                                        <th>Today</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shown.map((s) => {
                                        const t = rows[s.uid];
                                        const applied = effective(t, savedDef);
                                        const paid = paidMinutes(applied);
                                        const rate = hourlyRate(s, applied);
                                        const dirty = isDirty(s);
                                        const custom = isCustom(toTiming(s));
                                        return (
                                            <tr key={s.uid}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        {s.photo ? (
                                                            <img src={s.photo} alt="" className="rounded-circle" style={{ width: 34, height: 34, objectFit: 'cover' }} />
                                                        ) : (
                                                            <span className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center fw-semibold" style={{ width: 34, height: 34 }}>
                                                                {s.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                        <div>
                                                            <div className="fw-semibold text-nowrap">
                                                                {s.name}
                                                                <span className={`badge ms-2 ${custom ? 'bg-primary' : 'bg-secondary bg-opacity-25 text-dark'}`} style={{ fontSize: 10 }}>
                                                                    {custom ? 'Custom' : 'Default'}
                                                                </span>
                                                            </div>
                                                            <small className="text-muted">{s.email}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-nowrap">
                                                    {s.salary != null ? <>{s.currency} {s.salary.toFixed(2)} <small className="text-muted">{SALARY_LABEL[s.salary_type]}</small></> : <span className="text-muted">—</span>}
                                                </td>
                                                <td>
                                                    <input type="time" className="form-control form-control-sm" value={t.shift_start} onChange={(e) => set(s.uid, 'shift_start', e.target.value)} />
                                                    {!t.shift_start && <DefaultHint value={savedDef.shift_start} />}
                                                </td>
                                                <td>
                                                    <input type="time" className="form-control form-control-sm" value={t.shift_end} onChange={(e) => set(s.uid, 'shift_end', e.target.value)} />
                                                    {!t.shift_end && <DefaultHint value={savedDef.shift_end} />}
                                                </td>
                                                <td>
                                                    <input type="number" min={0} max={240} className="form-control form-control-sm" placeholder={savedDef.lunch_minutes || '60'} value={t.lunch_minutes} onChange={(e) => set(s.uid, 'lunch_minutes', e.target.value)} />
                                                    {!t.lunch_minutes && <DefaultHint value={savedDef.lunch_minutes} />}
                                                </td>
                                                <td>
                                                    <input type="number" min={1} max={31} className="form-control form-control-sm" placeholder={savedDef.working_days || '26'} value={t.working_days} onChange={(e) => set(s.uid, 'working_days', e.target.value)} />
                                                    {!t.working_days && <DefaultHint value={savedDef.working_days} />}
                                                </td>
                                                <td className="text-nowrap">{paid ? hoursLabel(paid) : <span className="text-muted">—</span>}</td>
                                                <td className="text-nowrap">{rate != null ? `${s.currency ?? ''} ${rate.toFixed(2)}` : <span className="text-muted">—</span>}</td>
                                                <td className="text-nowrap small">
                                                    {!s.today ? (
                                                        <span className="text-muted">Not checked in</span>
                                                    ) : s.today.checked_out_at ? (
                                                        <>
                                                            <span className="badge bg-danger">{s.today.auto_checked_out ? 'Auto checked out' : 'Checked out'}</span>
                                                            <div className="text-muted mt-1">at {s.today.checked_out_at}</div>
                                                        </>
                                                    ) : s.today.checked_in_at ? (
                                                        <>
                                                            <span className="badge bg-success">Checked in {s.today.checked_in_at}</span>
                                                            {s.today.ends_at && <div className="text-muted mt-1">Auto check-out {s.today.ends_at}</div>}
                                                        </>
                                                    ) : s.today.hours_over ? (
                                                        <>
                                                            <span className="badge bg-secondary">Hours ended {s.today.ends_at}</span>
                                                            <div className="text-muted mt-1">Can't sign in until extended</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-muted">Not checked in</span>
                                                            {s.today.ends_at && <div className="text-muted mt-1">Hours end {s.today.ends_at}</div>}
                                                        </>
                                                    )}
                                                    {(s.today?.extended_minutes ?? 0) > 0 && <div className="text-primary">Extended +{s.today?.extended_minutes} min</div>}
                                                </td>
                                                <td className="text-end text-nowrap">
                                                    {s.today?.ends_at && (
                                                        <div className="dropdown d-inline-block me-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-success dropdown-toggle"
                                                                data-bs-toggle="dropdown"
                                                                data-bs-auto-close="outside"
                                                                // Floats over the table instead of being cut off by its scroll area
                                                                data-bs-popper-config='{"strategy":"fixed"}'
                                                                title={s.today.checked_out_at || s.today.hours_over ? 'Give more time so they can sign in again' : 'Give more time past the end of their working hours'}
                                                                disabled={saving === `extend-${s.uid}`}
                                                            >
                                                                <i className="fa-solid fa-clock-rotate-left me-1"></i>
                                                                {saving === `extend-${s.uid}` ? 'Extending...' : 'Extend'}
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                {[30, 60, 120, 240].map((m) => (
                                                                    <li key={m}>
                                                                        <button type="button" className="dropdown-item" onClick={() => extend(s, m)}>
                                                                            +{m < 60 ? `${m} min` : `${m / 60} hour${m > 60 ? 's' : ''}`}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                                {/* Any amount: hours and minutes */}
                                                                <li><hr className="dropdown-divider" /></li>
                                                                <li className="px-3 pb-2" style={{ minWidth: 230 }}>
                                                                    <div className="small text-muted mb-1">Custom time</div>
                                                                    <div className="d-flex gap-2 align-items-center">
                                                                        <div className="input-group input-group-sm">
                                                                            <input
                                                                                type="number"
                                                                                min={0}
                                                                                max={12}
                                                                                className="form-control"
                                                                                placeholder="0"
                                                                                value={customTime[s.uid]?.h ?? ''}
                                                                                onChange={(e) => setCustom(s.uid, 'h', e.target.value)}
                                                                            />
                                                                            <span className="input-group-text">h</span>
                                                                        </div>
                                                                        <div className="input-group input-group-sm">
                                                                            <input
                                                                                type="number"
                                                                                min={0}
                                                                                max={59}
                                                                                className="form-control"
                                                                                placeholder="0"
                                                                                value={customTime[s.uid]?.m ?? ''}
                                                                                onChange={(e) => setCustom(s.uid, 'm', e.target.value)}
                                                                            />
                                                                            <span className="input-group-text">m</span>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-success w-100 mt-2"
                                                                        disabled={customMinutes(s.uid) < 1 || customMinutes(s.uid) > 720}
                                                                        onClick={() => { extend(s, customMinutes(s.uid)); setCustomTime((c) => ({ ...c, [s.uid]: { h: '', m: '' } })); }}
                                                                    >
                                                                        Extend {customMinutes(s.uid) > 0 ? `+${hoursLabel(customMinutes(s.uid))}` : ''}
                                                                    </button>
                                                                    {customMinutes(s.uid) > 720 && <div className="small text-danger mt-1">At most 12 hours at a time</div>}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {custom && !dirty && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary me-2"
                                                            title="Remove this staff member's own hours and use the default"
                                                            onClick={() => useDefault(s)}
                                                            disabled={saving === s.uid}
                                                        >
                                                            Use Default
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => save(s)}
                                                        disabled={!dirty || saving === s.uid}
                                                    >
                                                        {saving === s.uid ? 'Saving...' : 'Save'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <i className="fa-solid fa-user-clock d-block mb-2" style={{ fontSize: 32 }}></i>
                            {staff.length ? 'No staff match your search' : 'No staff yet'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

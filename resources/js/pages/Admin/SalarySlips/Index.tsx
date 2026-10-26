import { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { hoursLabel } from '@/components/AttendanceCalendar';

interface SlipSummary {
    uid: string;
    period_label: string;
    currency: string | null;
    days_present: number;
    worked_minutes: number;
    gross: number;
    total_deductions: number;
    net: number;
    generated_at: string | null;
    staff_name?: string;
}

interface Preview {
    period_label: string;
    currency: string | null;
    days_present: number;
    worked_minutes: number;
    hourly_rate: number | null;
    gross: number;
    total_deductions: number;
    net: number;
}

interface Row {
    uid: string;
    name: string;
    email: string;
    preview: Preview;
    last_slip: SlipSummary | null;
}

interface DayDetail {
    date: string;
    status: string | null;
    checked_in_at: string | null;
    checked_out_at: string | null;
    auto_checked_out: boolean;
    in_progress: boolean;
    lunch_taken_minutes: number | null;
    lunch_over_minutes: number;
    late_minutes: number;
    worked_minutes: number | null;
    day_pay: number | null;
}

interface Detail {
    uid: string;
    name: string;
    summary: Preview & {
        salary: number | null;
        salary_type: string | null;
        shift: string | null;
        days_leave: number;
        days_absent: number;
        deductions: { name: string; type: string; calc: 'percent' | 'fixed'; value: number; amount: number }[];
    };
    days: DayDetail[];
}

interface PageProps {
    isStaff: boolean;
    rows: Row[];
    history: SlipSummary[];
    detail?: Detail | null;
    flash?: { success?: string };
}

const STATUS_BADGE: Record<string, string> = {
    present: 'bg-success', half_day: 'bg-info', leave: 'bg-warning text-dark', absent: 'bg-danger',
};

const SALARY_LABEL: Record<string, string> = { per_hour: 'per hour', per_day: 'per day', per_month: 'per month' };

const money = (currency: string | null, amount: number) => `${currency ?? ''} ${amount.toFixed(2)}`.trim();

export default function SalarySlipsIndex() {
    const { isStaff, rows, history, detail, flash } = usePage().props as unknown as PageProps;
    const [processing, setProcessing] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    // The staff member whose period is open in the Details popup
    const [detailUid, setDetailUid] = useState<string | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: flash.success });
    }, [flash?.success]);

    const shownRows = rows.filter((r) => `${r.name} ${r.email}`.toLowerCase().includes(search.trim().toLowerCase()));

    const generate = (uids: string[], key: string) => {
        if (!confirm(uids.length === 1 ? 'Generate the salary slip up to now? The next one will start from now.' : `Generate salary slips for ${uids.length} staff, up to now?`)) return;
        setProcessing(key);
        router.post('/admin/salary-slips/generate', { uids }, {
            preserveScroll: true,
            onFinish: () => setProcessing(null),
        });
    };

    const openDetail = (uid: string) => {
        setDetailUid(uid);
        setLoadingDetail(true);
        router.reload({ only: ['detail'], data: { detail: uid }, onFinish: () => setLoadingDetail(false) });
    };

    return (
        <div>
            <Head title="Salary Slips" />
            <Toaster position="top-right" />
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Salary Slips</h1></li>
                        <li className="breadcrumb-item active">Salary Slips</li>
                    </ol>
                </nav>
            </div>

            {!isStaff && (
                /* Owner / superadmin: each staff member's pay since their last slip, up to now */
                <div className="card">
                    <div className="card-header d-flex flex-wrap gap-2 align-items-center justify-content-between">
                        <div>
                            <h6 className="card-title mb-0">Generate Salary</h6>
                            <small className="text-muted">From each staff member's last salary slip up to now — minutes worked × hourly rate, less the tax and deductions on their profile.</small>
                        </div>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                style={{ width: 200 }}
                                placeholder="Search staff..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-primary text-nowrap"
                                onClick={() => generate(shownRows.map((r) => r.uid), 'all')}
                                disabled={!shownRows.length || processing !== null}
                            >
                                {processing === 'all' ? 'Generating...' : 'Generate All'}
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {shownRows.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light text-nowrap">
                                        <tr>
                                            <th>Staff</th>
                                            <th>Period (up to now)</th>
                                            <th>Hours Worked</th>
                                            <th>Hourly Rate</th>
                                            <th>Gross</th>
                                            <th>Deductions</th>
                                            <th>Net Pay</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shownRows.map((r) => {
                                            const p = r.preview;
                                            return (
                                                <tr key={r.uid}>
                                                    <td>
                                                        <div className="fw-semibold">{r.name}</div>
                                                        <small className="text-muted">{r.email}</small>
                                                    </td>
                                                    <td className="small">
                                                        <div className="text-nowrap">{p.period_label.split(' – ')[0]}</div>
                                                        <div className="text-nowrap text-muted">to now</div>
                                                        {r.last_slip && <div className="text-muted" style={{ fontSize: 11 }}>Last slip {r.last_slip.generated_at}</div>}
                                                    </td>
                                                    <td className="text-nowrap">{hoursLabel(p.worked_minutes)}</td>
                                                    <td className="text-nowrap">{p.hourly_rate != null ? money(p.currency, p.hourly_rate) : <span className="text-muted" title="Set salary and working hours to calculate">—</span>}</td>
                                                    <td className="text-nowrap">{money(p.currency, p.gross)}</td>
                                                    <td className="text-nowrap text-danger">{money(p.currency, p.total_deductions)}</td>
                                                    <td className="text-nowrap fw-bold text-success">{money(p.currency, p.net)}</td>
                                                    <td className="text-end text-nowrap">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary me-2"
                                                            title="Hours worked each day, pay and deductions"
                                                            onClick={() => openDetail(r.uid)}
                                                        >
                                                            <i className="fa-regular fa-clock me-1"></i>Details
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => generate([r.uid], r.uid)}
                                                            disabled={processing !== null}
                                                        >
                                                            {processing === r.uid ? 'Generating...' : 'Generate'}
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
                                <i className="fa-solid fa-file-invoice-dollar d-block mb-2" style={{ fontSize: 32 }}></i>
                                {rows.length ? 'No staff match your search' : 'No staff yet'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Generated slips (a staff member: their own) */}
            <div className="card">
                <div className="card-header">
                    <h6 className="card-title mb-0">{isStaff ? 'My Salary Slips' : 'Generated Slips'}</h6>
                </div>
                <div className="card-body">
                    {history.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light text-nowrap">
                                    <tr>
                                        {!isStaff && <th>Staff</th>}
                                        <th>Period</th>
                                        <th>Days Present</th>
                                        <th>Hours Worked</th>
                                        <th>Gross</th>
                                        <th>Deductions</th>
                                        <th>Net Pay</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history
                                        .filter((s) => isStaff || (s.staff_name ?? '').toLowerCase().includes(search.trim().toLowerCase()))
                                        .map((s) => (
                                            <tr key={s.uid}>
                                                {!isStaff && <td className="fw-semibold">{s.staff_name}</td>}
                                                <td className="small">{s.period_label}</td>
                                                <td>{s.days_present}</td>
                                                <td className="text-nowrap">{hoursLabel(s.worked_minutes)}</td>
                                                <td className="text-nowrap">{money(s.currency, s.gross)}</td>
                                                <td className="text-nowrap text-danger">{money(s.currency, s.total_deductions)}</td>
                                                <td className="text-nowrap fw-bold text-success">{money(s.currency, s.net)}</td>
                                                <td className="text-end">
                                                    <Link href={`/admin/salary-slips/${s.uid}`} className="btn btn-sm btn-primary">
                                                        <i className="fa fa-eye me-1"></i>View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <i className="fa-solid fa-file-invoice-dollar d-block mb-2" style={{ fontSize: 32 }}></i>
                            No salary slips yet
                        </div>
                    )}
                </div>
            </div>

            {detailUid && (
                <DetailModal
                    detail={detail?.uid === detailUid ? detail : null}
                    loading={loadingDetail}
                    name={rows.find((r) => r.uid === detailUid)?.name ?? ''}
                    onClose={() => setDetailUid(null)}
                />
            )}
        </div>
    );
}

/** One staff member's period so far: each day's minutes and pay, then the totals and deductions. */
function DetailModal({ detail, loading, name, onClose }: { detail: Detail | null; loading: boolean; name: string; onClose: () => void }) {
    const s = detail?.summary;
    const cur = s?.currency ?? null;
    const dayLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });

    return (
        <div className="modal d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <div>
                            <h5 className="modal-title mb-0">{name} — Working Hours &amp; Pay</h5>
                            {s && <small className="text-muted">{s.period_label}{s.shift ? ` · Shift ${s.shift}` : ''}</small>}
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {!detail || !s ? (
                            <div className="text-center text-muted py-5">{loading ? 'Loading...' : 'Could not load this staff member.'}</div>
                        ) : (
                            <>
                                {/* Totals */}
                                <div className="row g-2 mb-3 text-center">
                                    {[
                                        ['Total Working Hours', hoursLabel(s.worked_minutes)],
                                        ['Days Present', String(s.days_present)],
                                        ['Leave / Absent', `${s.days_leave} / ${s.days_absent}`],
                                        ['Hourly Rate', s.hourly_rate != null ? money(cur, s.hourly_rate) : '—'],
                                        ['Salary', s.salary != null ? `${money(cur, s.salary)} ${s.salary_type ? SALARY_LABEL[s.salary_type] ?? '' : ''}` : '—'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="col-6 col-md">
                                            <div className="border rounded py-2 px-1 h-100">
                                                <div className="small text-muted">{label}</div>
                                                <div className="fw-bold">{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Day by day */}
                                <div className="table-responsive mb-3" style={{ maxHeight: 340 }}>
                                    <table className="table table-sm table-hover align-middle mb-0">
                                        <thead className="table-light text-nowrap" style={{ position: 'sticky', top: 0 }}>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Check In</th>
                                                <th>Check Out</th>
                                                <th>Lunch</th>
                                                <th>Time Worked</th>
                                                <th className="text-end">Day's Pay</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail.days.length > 0 ? detail.days.map((d) => (
                                                <tr key={d.date}>
                                                    <td className="text-nowrap">{dayLabel(d.date)}</td>
                                                    <td>{d.status ? <span className={`badge ${STATUS_BADGE[d.status] ?? 'bg-secondary'}`}>{d.status.replace('_', ' ')}</span> : <span className="text-muted">—</span>}</td>
                                                    <td className="text-nowrap">
                                                        {d.checked_in_at ?? '—'}
                                                        {d.late_minutes > 0 && <span className="badge bg-warning text-dark ms-1">Late {hoursLabel(d.late_minutes)}</span>}
                                                    </td>
                                                    <td className="text-nowrap">
                                                        {d.in_progress ? <span className="badge bg-primary">Working now</span> : d.checked_out_at ?? '—'}
                                                        {d.auto_checked_out && <span className="badge bg-secondary ms-1">Auto</span>}
                                                    </td>
                                                    <td className="text-nowrap">
                                                        {d.lunch_taken_minutes != null ? `${d.lunch_taken_minutes} min` : '—'}
                                                        {d.lunch_over_minutes > 0 && <span className="badge bg-danger ms-1">+{d.lunch_over_minutes}m</span>}
                                                    </td>
                                                    <td className="fw-semibold">{d.worked_minutes != null ? hoursLabel(d.worked_minutes) : '—'}</td>
                                                    <td className="text-end text-nowrap">{d.day_pay != null ? money(cur, d.day_pay) : '—'}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={7} className="text-center text-muted py-3">No attendance in this period</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pay: minutes × rate, then deductions by how each is calculated */}
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light"><tr><th>Earnings</th><th className="text-end">Amount</th></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td>Pay for time worked<div className="small text-muted">{hoursLabel(s.worked_minutes)} ({s.worked_minutes} min){s.hourly_rate != null ? ` × ${money(cur, s.hourly_rate)}/hour` : ''}</div></td>
                                                    <td className="text-end">{money(cur, s.gross)}</td>
                                                </tr>
                                                <tr className="fw-bold"><td>Gross</td><td className="text-end">{money(cur, s.gross)}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <table className="table table-sm mb-0">
                                            <thead className="table-light"><tr><th>Deductions</th><th className="text-end">Amount</th></tr></thead>
                                            <tbody>
                                                {s.deductions.length > 0 ? s.deductions.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>
                                                            {d.name} <span className={`badge ${d.type === 'tax' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{d.type === 'tax' ? 'Tax' : 'Deduction'}</span>
                                                            <div className="small text-muted">{d.calc === 'percent' ? `${d.value}% of ${money(cur, s.gross)}` : 'Fixed amount'}</div>
                                                        </td>
                                                        <td className="text-end text-danger">{money(cur, d.amount)}</td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan={2} className="text-muted">No tax or deductions set on this staff member</td></tr>
                                                )}
                                                <tr className="fw-bold"><td>Total Deductions</td><td className="text-end text-danger">{money(cur, s.total_deductions)}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3 p-3 rounded" style={{ background: 'rgba(69, 43, 144, 0.08)' }}>
                                    <span className="fw-semibold fs-5">Net Pay <small className="text-muted fs-6">so far</small></span>
                                    <span className="fw-bold fs-4" style={{ color: '#452B90' }}>{money(cur, s.net)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

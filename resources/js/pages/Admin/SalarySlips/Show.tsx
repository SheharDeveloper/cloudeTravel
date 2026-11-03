import { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { hoursLabel } from '@/components/AttendanceCalendar';

interface Deduction {
    name: string;
    type: 'tax' | 'deduction';
    calc?: 'percent' | 'fixed';
    value: number;
    amount: number;
}

interface PageProps {
    slip: {
        uid: string;
        period_label: string;
        currency: string | null;
        salary: number | null;
        salary_type: string | null;
        shift: string | null;
        days_present: number;
        days_leave: number;
        days_absent: number;
        paid_leave_days?: number;
        unpaid_leave_days?: number;
        paid_leave_pay?: number;
        worked_minutes: number;
        hourly_rate: number | null;
        gross: number;
        deductions: Deduction[];
        total_deductions: number;
        net: number;
        generated_by: string | null;
        generated_at: string | null;
    };
    staff: {
        name: string;
        number: string | null;
        email: string | null;
        phone: string | null;
        joining_date: string | null;
        address_lines: string[];
    };
    company: { name: string; legal_name: string | null; logo: string | null; email: string | null; phone: string | null; address: string | null };
    ytd: { year: number; slips: number; gross: number; deductions: Record<string, number>; total_deductions: number; net: number; worked_minutes: number };
    period: { start: string | null; end: string | null; pay_date: string | null; days: number | null };
    canRecalculate?: boolean;
    flash?: { success?: string };
}

const SALARY_LABEL: Record<string, string> = { per_hour: 'per hour', per_day: 'per day', per_month: 'per month' };

// The payslip's colours: navy headings, pale blue panels
const NAVY = '#1f3a5f';
const PALE = '#eaf2fb';

/** Salary slip, laid out like a standard payslip: company header, payments, deductions, totals, net pay. */
export default function SalarySlipShow() {
    const { slip, staff, company, ytd, period, canRecalculate, flash } = usePage().props as unknown as PageProps;
    // Recalculate: the same period again with the staff member's current salary settings
    const [askRecalc, setAskRecalc] = useState(false);
    const [recalculating, setRecalculating] = useState(false);
    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: flash.success });
    }, [flash?.success]);
    const recalculate = () => {
        setRecalculating(true);
        router.post(`/admin/salary-slips/${slip.uid}/recalculate`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setRecalculating(false);
                setAskRecalc(false);
            },
        });
    };
    const cur = slip.currency ?? '';
    const money = (amount: number) => amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const paidLeavePay = slip.paid_leave_pay ?? 0;
    const timePay = slip.gross - paidLeavePay;
    const hours = slip.worked_minutes / 60;

    return (
        <div>
            <Head title="Salary Slip" />
            <Toaster position="top-right" />
            <ConfirmDialog
                isOpen={askRecalc}
                title="Recalculate this slip?"
                message={`Work this slip out again for ${period.start} – ${period.end} using ${staff.name}'s current salary (amount and per hour / day / month), working hours, taxes and deductions.`}
                confirmText="Recalculate"
                loadingText="Recalculating..."
                confirmVariant="primary"
                isLoading={recalculating}
                onConfirm={recalculate}
                onCancel={() => setAskRecalc(false)}
            />
            <style>{`
                #salary-slip { font-size: 13px; color: #1d2733; }
                #salary-slip .ps-panel { border: 1px solid #c9d8ea; border-radius: 6px; overflow: hidden; background: #fff; }
                #salary-slip .ps-head { background: ${NAVY}; color: #fff; font-weight: 600; padding: 7px 12px; }
                #salary-slip table { width: 100%; margin: 0; border-collapse: collapse; }
                #salary-slip th { background: ${PALE}; color: ${NAVY}; font-weight: 600; font-size: 12px; padding: 6px 12px; border-bottom: 1px solid #c9d8ea; }
                #salary-slip td { padding: 7px 12px; border-bottom: 1px solid #edf1f6; }
                #salary-slip .ps-total td { background: ${PALE}; font-weight: 700; color: ${NAVY}; border-bottom: 0; }
                #salary-slip .ps-label { color: #5b6b7d; font-size: 11px; }
                /* Printing: one A4 page, same layout, tighter spacing */
                @page { size: A4 portrait; margin: 8mm; }
                @media print {
                    html, body { height: auto !important; min-height: 0 !important; background: #fff !important; }
                    #main-wrapper > *:not(.content-body) { display: none !important; }
                    #main-wrapper, .content-body, .content-body > .container-fluid { min-height: 0 !important; height: auto !important; margin: 0 !important; padding: 0 !important; }
                    body * { visibility: hidden; }
                    #salary-slip, #salary-slip * { visibility: visible; }
                    #salary-slip { position: absolute; left: 0; top: 0; width: 100%; height: auto !important; max-width: none !important; margin: 0 !important; font-size: 11px; box-shadow: none !important; border: 0 !important; break-inside: avoid; page-break-inside: avoid; }
                    #salary-slip .card-body { padding: 0 !important; }
                    #salary-slip .ps-head, #salary-slip th, #salary-slip .ps-total td, #salary-slip .ps-net { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    /* Paper is narrower than the screen breakpoints: keep the columns side by side */
                    #salary-slip .row { display: flex !important; flex-wrap: nowrap !important; --bs-gutter-x: 8px; --bs-gutter-y: 0; }
                    #salary-slip .col-md-2 { flex: 0 0 16.66% !important; width: 16.66% !important; }
                    #salary-slip .col-md-4 { flex: 0 0 33.33% !important; width: 33.33% !important; }
                    #salary-slip .col-md-5 { flex: 0 0 41.66% !important; width: 41.66% !important; }
                    #salary-slip .col-md-6 { flex: 0 0 50% !important; width: 50% !important; }
                    #salary-slip .col-md-7 { flex: 0 0 58.33% !important; width: 58.33% !important; }
                    #salary-slip .mb-3 { margin-bottom: 6px !important; }
                    #salary-slip .pb-3 { padding-bottom: 6px !important; }
                    #salary-slip .py-2 { padding-top: 3px !important; padding-bottom: 3px !important; }
                    #salary-slip .p-3 { padding: 6px 8px !important; line-height: 1.35 !important; }
                    #salary-slip .ps-head { padding: 3px 8px; }
                    #salary-slip th { padding: 3px 8px; font-size: 10px; }
                    #salary-slip td { padding: 3px 8px; }
                    #salary-slip .ps-label { font-size: 9px; }
                    #salary-slip img { max-height: 44px !important; }
                    #salary-slip .ps-net { padding: 6px 14px !important; }
                    #salary-slip .ps-net span { font-size: 18px !important; }
                    #salary-slip .mt-3 { margin-top: 4px !important; }
                }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <Link href="/admin/salary-slips" className="btn btn-sm btn-outline-secondary">
                    <i className="fa fa-arrow-left me-1"></i>Back
                </Link>
                <div className="d-flex gap-2">
                    {canRecalculate && (
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setAskRecalc(true)} title="Use the staff member's current salary settings">
                            <i className="fa fa-rotate me-1"></i>Recalculate
                        </button>
                    )}
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => window.print()}>
                        <i className="fa fa-print me-1"></i>Print / Save PDF
                    </button>
                </div>
            </div>

            <div id="salary-slip" className="card shadow-sm" style={{ maxWidth: 860, margin: '0 auto' }}>
                <div className="card-body p-4">
                    {/* Company: logo, names, contact details */}
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap pb-3" style={{ borderBottom: `2px solid ${NAVY}` }}>
                        {/* The logo shows the company; its name only when there's no logo */}
                        <div className="d-flex align-items-center gap-3">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} style={{ maxHeight: 64, maxWidth: 160, objectFit: 'contain' }} />
                            ) : (
                                <h3 className="mb-0 fw-bold text-uppercase" style={{ color: NAVY, letterSpacing: 0.5 }}>{company.name}</h3>
                            )}
                        </div>
                        <div className="text-end small" style={{ lineHeight: 1.6 }}>
                            {company.address && <div><i className="fa fa-location-dot me-1 text-muted"></i>{company.address}</div>}
                            {company.email && <div><i className="fa fa-envelope me-1 text-muted"></i>{company.email}</div>}
                            {company.phone && <div><i className="fa fa-phone me-1 text-muted"></i>{company.phone}</div>}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-2 mb-3 small" style={{ borderBottom: '1px solid #c9d8ea' }}>
                        <span className="fw-bold" style={{ color: NAVY, letterSpacing: 1 }}>PAYSLIP</span>
                        <span>
                            <span className="ps-label">Pay Period:</span> <strong>{period.start} – {period.end}</strong>
                            {slip.shift && <><span className="mx-2 text-muted">|</span><span className="ps-label">Shift:</span> <strong>{slip.shift}</strong></>}
                        </span>
                    </div>

                    {/* Employee bar */}
                    <div className="row g-0 mb-3 rounded" style={{ background: PALE, border: '1px solid #c9d8ea' }}>
                        {([
                            ['Employee No.', staff.number ?? '—', 'col-md-2'],
                            ['Employee', staff.name, 'col-md-2'],
                            // Duration: the pay period's start and end dates, and how many days
                            ['Duration', (
                                <>
                                    {period.start} <i className="fa fa-arrow-right mx-1 small text-muted"></i> {period.end}
                                    {period.days != null && <span className="ps-label fw-semibold ms-1">· {period.days} day{period.days === 1 ? '' : 's'}</span>}
                                </>
                            ), 'col-md-4'],
                            ['Pay Date', period.pay_date ?? '—', 'col-md-2'],
                            ['Salary', slip.salary != null ? `${cur} ${money(slip.salary)} ${slip.salary_type ? SALARY_LABEL[slip.salary_type] ?? '' : ''}` : '—', 'col-md-2'],
                        ] as [string, React.ReactNode, string][]).map(([label, value, col], i) => (
                            <div key={label} className={`col-6 ${col} px-3 py-2`} style={{ borderLeft: i ? '1px solid #c9d8ea' : 0 }}>
                                <div className="ps-label fw-semibold">{label}</div>
                                <div className="fw-bold" style={{ fontSize: label === 'Employee' ? 15 : 13, color: NAVY }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="row g-3 mb-3">
                        {/* Payments */}
                        <div className="col-md-7">
                            <div className="ps-panel h-100">
                                <div className="ps-head">Payments</div>
                                <table>
                                    <thead>
                                        <tr><th>Description</th><th className="text-end">Units</th><th className="text-end">Rate</th><th className="text-end">Amount ({cur})</th></tr>
                                    </thead>
                                    <tbody>
                                        {/* Units and rate in the salary's own terms: a day rate shows days × the day rate */}
                                        {slip.salary_type === 'per_day' && slip.salary ? (
                                            <tr>
                                                <td>Basic Pay <div className="ps-label">Time worked · {hoursLabel(slip.worked_minutes)}</div></td>
                                                <td className="text-end">{(timePay / slip.salary).toFixed(2)} d</td>
                                                <td className="text-end">{money(slip.salary)}<div className="ps-label">per day</div></td>
                                                <td className="text-end">{money(timePay)}</td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td>Basic Pay <div className="ps-label">Time worked · {hoursLabel(slip.worked_minutes)}</div></td>
                                                {/* Paid hours (a month salary pays at most a full day a day) */}
                                                <td className="text-end">{(slip.hourly_rate ? timePay / slip.hourly_rate : hours).toFixed(2)} h</td>
                                                <td className="text-end">
                                                    {slip.hourly_rate != null ? money(slip.hourly_rate) : '—'}
                                                    <div className="ps-label">per hour</div>
                                                    {slip.salary_type === 'per_month' && slip.salary != null && <div className="ps-label">from {money(slip.salary)} / month</div>}
                                                </td>
                                                <td className="text-end">{money(timePay)}</td>
                                            </tr>
                                        )}
                                        {(slip.paid_leave_days ?? 0) > 0 && (
                                            <tr>
                                                <td>Paid Leave</td>
                                                <td className="text-end">{slip.paid_leave_days} d</td>
                                                <td className="text-end">{money(paidLeavePay / (slip.paid_leave_days || 1))}</td>
                                                <td className="text-end">{money(paidLeavePay)}</td>
                                            </tr>
                                        )}
                                        {(slip.unpaid_leave_days ?? 0) > 0 && (
                                            <tr>
                                                <td>Unpaid Leave <span className="ps-label">(no pay)</span></td>
                                                <td className="text-end">{slip.unpaid_leave_days} d</td>
                                                <td className="text-end">—</td>
                                                <td className="text-end">0.00</td>
                                            </tr>
                                        )}
                                        <tr className="ps-total"><td colSpan={3}>Total Payments</td><td className="text-end">{money(slip.gross)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div className="col-md-5">
                            <div className="ps-panel h-100">
                                <div className="ps-head">Deductions</div>
                                <table>
                                    <thead>
                                        <tr><th>Description</th><th className="text-end">Amount ({cur})</th></tr>
                                    </thead>
                                    <tbody>
                                        {slip.deductions.length > 0 ? slip.deductions.map((d, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {d.name}
                                                    <span className="ps-label ms-1">
                                                        {(d.calc ?? (d.type === 'tax' ? 'percent' : 'fixed')) === 'percent' ? `(${d.value}%)` : '(fixed)'}
                                                    </span>
                                                </td>
                                                <td className="text-end">{money(d.amount)}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={2} className="text-muted">No deductions</td></tr>
                                        )}
                                        <tr className="ps-total"><td>Total Deductions</td><td className="text-end">{money(slip.total_deductions)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        {/* Employee address */}
                        <div className="col-md-6">
                            <div className="ps-panel h-100">
                                <div className="ps-head">Employee Details</div>
                                <div className="p-3" style={{ lineHeight: 1.6 }}>
                                    <div className="fw-bold">{staff.name}</div>
                                    {staff.address_lines.map((line, i) => <div key={i}>{line}</div>)}
                                    {staff.email && <div className="text-muted">{staff.email}</div>}
                                    {staff.phone && <div className="text-muted">{staff.phone}</div>}
                                    {staff.joining_date && <div className="ps-label mt-1">Joined {staff.joining_date}</div>}
                                </div>
                            </div>
                        </div>

                        {/* This period */}
                        <div className="col-md-6">
                            <div className="ps-panel h-100">
                                <div className="ps-head">Totals This Period</div>
                                <table>
                                    <tbody>
                                        <tr><td>Total Payments</td><td className="text-end fw-bold">{money(slip.gross)}</td></tr>
                                        <tr><td>Total Deductions</td><td className="text-end fw-bold">{money(slip.total_deductions)}</td></tr>
                                        <tr><td>Days Present / Leave / Absent</td><td className="text-end">{slip.days_present} / {slip.days_leave} / {slip.days_absent}</td></tr>
                                        <tr><td>Hours Worked</td><td className="text-end">{hoursLabel(slip.worked_minutes)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Year to date */}
                    <div className="ps-panel mb-3">
                        <div className="ps-head">Totals Year To Date ({ytd.year})</div>
                        <table>
                            <tbody>
                                <tr><td>Gross Pay</td><td className="text-end fw-bold">{money(ytd.gross)}</td></tr>
                                {Object.entries(ytd.deductions).map(([name, amount]) => (
                                    <tr key={name}><td>{name}</td><td className="text-end">{money(amount)}</td></tr>
                                ))}
                                <tr><td>Total Deductions</td><td className="text-end">{money(ytd.total_deductions)}</td></tr>
                                <tr><td>Net Pay</td><td className="text-end">{money(ytd.net)}</td></tr>
                                <tr><td>Hours Worked</td><td className="text-end">{hoursLabel(ytd.worked_minutes)}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Net pay */}
                    <div className="ps-net d-flex justify-content-between align-items-center px-4 py-3 rounded" style={{ background: PALE, border: '1px solid #c9d8ea' }}>
                        <span className="fw-bold" style={{ color: NAVY, fontSize: 26 }}>NET PAY {cur}</span>
                        <span className="fw-bold" style={{ color: NAVY, fontSize: 30, borderLeft: '2px solid #c9d8ea', paddingLeft: 24 }}>{money(slip.net)}</span>
                    </div>

                    <div className="small text-muted mt-3 text-center">
                        Generated {slip.generated_at}{slip.generated_by ? ` by ${slip.generated_by}` : ''} · This is a computer-generated payslip.
                    </div>
                </div>
            </div>
        </div>
    );
}

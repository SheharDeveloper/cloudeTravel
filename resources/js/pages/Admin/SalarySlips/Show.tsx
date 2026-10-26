import { Head, Link, usePage } from '@inertiajs/react';
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
        worked_minutes: number;
        hourly_rate: number | null;
        gross: number;
        deductions: Deduction[];
        total_deductions: number;
        net: number;
        generated_by: string | null;
        generated_at: string | null;
    };
    staff: { name: string; email: string | null; phone: string | null; joining_date: string | null };
    company: { name: string; email: string | null; phone: string | null };
}

const SALARY_LABEL: Record<string, string> = { per_hour: 'per hour', per_day: 'per day', per_month: 'per month' };

export default function SalarySlipShow() {
    const { slip, staff, company } = usePage().props as unknown as PageProps;
    const money = (amount: number) => `${slip.currency ?? ''} ${amount.toFixed(2)}`.trim();

    return (
        <div>
            <Head title="Salary Slip" />
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #salary-slip, #salary-slip * { visibility: visible; }
                    #salary-slip { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: 0 !important; }
                }
            `}</style>

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <Link href="/admin/salary-slips" className="btn btn-sm btn-outline-secondary">
                    <i className="fa fa-arrow-left me-1"></i>Back
                </Link>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => window.print()}>
                    <i className="fa fa-print me-1"></i>Print / Save PDF
                </button>
            </div>

            <div id="salary-slip" className="card" style={{ maxWidth: 820, margin: '0 auto' }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 pb-3 mb-3" style={{ borderBottom: '2px solid #452B90' }}>
                        <div>
                            <h4 className="mb-1" style={{ color: '#452B90' }}>{company.name}</h4>
                            {company.email && <div className="small text-muted">{company.email}</div>}
                            {company.phone && <div className="small text-muted">{company.phone}</div>}
                        </div>
                        <div className="text-end">
                            <h5 className="mb-1">SALARY SLIP</h5>
                            <div className="small fw-semibold">{slip.period_label}</div>
                        </div>
                    </div>

                    <div className="row g-3 mb-4 small">
                        <div className="col-sm-6">
                            <div className="text-muted">Employee</div>
                            <div className="fw-semibold fs-6">{staff.name}</div>
                            {staff.email && <div>{staff.email}</div>}
                            {staff.phone && <div>{staff.phone}</div>}
                        </div>
                        <div className="col-sm-6 text-sm-end">
                            {staff.joining_date && <div><span className="text-muted">Joined:</span> {staff.joining_date}</div>}
                            {slip.salary != null && (
                                <div><span className="text-muted">Salary:</span> {money(slip.salary)} {slip.salary_type ? SALARY_LABEL[slip.salary_type] : ''}</div>
                            )}
                            {slip.shift && <div><span className="text-muted">Shift:</span> {slip.shift}</div>}
                        </div>
                    </div>

                    <div className="row g-2 mb-4 text-center">
                        {[
                            ['Days Present', String(slip.days_present)],
                            ['Leave', String(slip.days_leave)],
                            ['Absent', String(slip.days_absent)],
                            ['Hours Worked', hoursLabel(slip.worked_minutes)],
                            ['Hourly Rate', slip.hourly_rate != null ? money(slip.hourly_rate) : '—'],
                        ].map(([label, value]) => (
                            <div key={label} className="col">
                                <div className="border rounded py-2 px-1 h-100">
                                    <div className="small text-muted">{label}</div>
                                    <div className="fw-bold">{value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <table className="table table-sm mb-0">
                                <thead className="table-light">
                                    <tr><th>Earnings</th><th className="text-end">Amount</th></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Pay for time worked<div className="small text-muted">{hoursLabel(slip.worked_minutes)} ({slip.worked_minutes} min){slip.hourly_rate != null ? ` × ${money(slip.hourly_rate)}/hour` : ''}</div></td>
                                        <td className="text-end">{money(slip.gross)}</td>
                                    </tr>
                                    <tr className="fw-bold"><td>Gross Earnings</td><td className="text-end">{money(slip.gross)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <table className="table table-sm mb-0">
                                <thead className="table-light">
                                    <tr><th>Deductions</th><th className="text-end">Amount</th></tr>
                                </thead>
                                <tbody>
                                    {slip.deductions.length > 0 ? slip.deductions.map((d, i) => (
                                        <tr key={i}>
                                            <td>{d.name} <span className="small text-muted">{(d.calc ?? (d.type === 'tax' ? 'percent' : 'fixed')) === 'percent' ? `(${d.value}% of gross)` : '(fixed)'}</span></td>
                                            <td className="text-end">{money(d.amount)}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={2} className="text-muted">No deductions</td></tr>
                                    )}
                                    <tr className="fw-bold"><td>Total Deductions</td><td className="text-end">{money(slip.total_deductions)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4 p-3 rounded" style={{ background: 'rgba(69, 43, 144, 0.08)' }}>
                        <span className="fw-semibold fs-5">Net Pay</span>
                        <span className="fw-bold fs-4" style={{ color: '#452B90' }}>{money(slip.net)}</span>
                    </div>

                    <div className="small text-muted mt-3 text-center">
                        Generated {slip.generated_at}{slip.generated_by ? ` by ${slip.generated_by}` : ''} · This is a computer-generated slip.
                    </div>
                </div>
            </div>
        </div>
    );
}

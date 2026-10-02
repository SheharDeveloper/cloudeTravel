import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

type CommissionType = 'percentage' | 'fixed';

interface CommissionRow {
    service: string;
    name: string;
    commission_type: CommissionType;
    commission_value: number;
}

interface Props {
    commissions: CommissionRow[];
    currency: { code: string; symbol: string };
}

export default function AgencySettings() {
    const { commissions, currency } = usePage().props as unknown as Props;
    const errors = usePage().props.errors as Record<string, string>;

    const [rows, setRows] = useState(
        commissions.map((row) => ({ ...row, commission_value: String(row.commission_value) })),
    );
    const [saving, setSaving] = useState(false);

    const updateRow = (index: number, changes: Partial<(typeof rows)[number]>) =>
        setRows(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));

    const save = () => {
        setSaving(true);
        router.put(
            '/admin/agency-settings',
            {
                commissions: rows.map((row) => ({
                    service: row.service,
                    commission_type: row.commission_type,
                    commission_value: row.commission_value === '' ? 0 : Number(row.commission_value),
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Commission saved'),
                onError: () => toast.error('Please fix the highlighted fields'),
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <ProtectedRoute>
            <Head title="Settings" />

            <div className="page-title mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Settings</h1></li>
                        <li className="breadcrumb-item"><a href="/dashboard"><i className="fa fa-home me-2"></i>Dashboard</a></li>
                        <li className="breadcrumb-item active">Settings</li>
                    </ol>
                </nav>
            </div>

            <div className="card mb-4" style={{ height: 'auto' }}>
                <div className="card-header">
                    <h6 className="card-title mb-0">Commission</h6>
                </div>
                <div className="card-body">
                    <p className="text-muted">
                        Your commission is added to the service fee of each service you sell, either as a percentage of
                        the service fee or as a fixed amount in {currency.code} ({currency.symbol}).
                    </p>

                    {rows.length === 0 ? (
                        <p className="text-muted mb-0">No services are assigned to your agency yet.</p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Service</th>
                                            <th style={{ width: 220 }}>Commission Type</th>
                                            <th style={{ width: 220 }}>Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => {
                                            const error = errors[`commissions.${index}.commission_value`];
                                            return (
                                                <tr key={row.service}>
                                                    <td className="fw-semibold">{row.name}</td>
                                                    <td>
                                                        <select
                                                            className="form-select"
                                                            value={row.commission_type}
                                                            onChange={(e) => updateRow(index, { commission_type: e.target.value as CommissionType })}
                                                        >
                                                            <option value="percentage">Percentage (%)</option>
                                                            <option value="fixed">Fixed amount ({currency.symbol})</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <div className="input-group">
                                                            {row.commission_type === 'fixed' && <span className="input-group-text">{currency.symbol}</span>}
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={row.commission_type === 'percentage' ? 100 : undefined}
                                                                step="0.01"
                                                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                                                value={row.commission_value}
                                                                onChange={(e) => updateRow(index, { commission_value: e.target.value })}
                                                            />
                                                            {row.commission_type === 'percentage' && <span className="input-group-text">%</span>}
                                                        </div>
                                                        {error && <div className="invalid-feedback d-block">{error}</div>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

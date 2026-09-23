import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Country = {
    id: number;
    countryName: string;
    countryCode: string;
};

type TaxSetupEntry = {
    id: number;
    country_id: number;
    tax_name: string;
    amount: string;
    country: Country | null;
};

export default function TaxSetupIndex() {
    const { taxSetups, countries } = usePage().props as unknown as { taxSetups: TaxSetupEntry[]; countries: Country[] };

    const [editingId, setEditingId] = useState<number | null>(null);
    const [countryId, setCountryId] = useState('');
    const [taxName, setTaxName] = useState('');
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deleteTarget, setDeleteTarget] = useState<TaxSetupEntry | null>(null);
    const [search, setSearch] = useState('');

    const filteredTaxSetups = taxSetups.filter((taxSetup) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
            (taxSetup.country?.countryName || '').toLowerCase().includes(term) ||
            taxSetup.tax_name.toLowerCase().includes(term) ||
            String(taxSetup.amount).toLowerCase().includes(term)
        );
    });

    const resetForm = () => {
        setEditingId(null);
        setCountryId('');
        setTaxName('');
        setAmount('');
        setErrors({});
    };

    const editTaxSetup = (taxSetup: TaxSetupEntry) => {
        setEditingId(taxSetup.id);
        setCountryId(String(taxSetup.country_id));
        setTaxName(taxSetup.tax_name);
        setAmount(String(taxSetup.amount));
        setErrors({});
    };

    const submit = () => {
        if (!countryId || !taxName.trim() || !amount) return;
        setProcessing(true);
        setErrors({});

        const data = { country_id: Number(countryId), tax_name: taxName.trim(), amount: Number(amount) };
        const onDone = {
            preserveScroll: true,
            onSuccess: () => resetForm(),
            onError: (err: Record<string, string>) => setErrors(err),
            onFinish: () => setProcessing(false),
        };

        if (editingId) {
            router.put(`/admin/tax-setups/${editingId}`, data, onDone);
        } else {
            router.post('/admin/tax-setups', data, onDone);
        }
    };

    const deleteTaxSetup = (taxSetup: TaxSetupEntry) => {
        router.delete(`/admin/tax-setups/${taxSetup.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <div>
            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Tax Setup</h1></li>
                        <li className="breadcrumb-item active">All Tax Setups</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card h-auto">
                        <div className="card-header">
                            <h6 className="card-title mb-0">{editingId ? 'Edit Tax Setup' : 'Add Tax Setup'}</h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Country</label>
                                <select
                                    className={`form-select ${errors.country_id ? 'is-invalid' : ''}`}
                                    value={countryId}
                                    onChange={(e) => setCountryId(e.target.value)}
                                >
                                    <option value="">Select country...</option>
                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.countryName}
                                        </option>
                                    ))}
                                </select>
                                {errors.country_id && <div className="invalid-feedback d-block">{errors.country_id}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tax Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.tax_name ? 'is-invalid' : ''}`}
                                    placeholder="e.g. VAT"
                                    value={taxName}
                                    onChange={(e) => setTaxName(e.target.value)}
                                />
                                {errors.tax_name && <div className="invalid-feedback d-block">{errors.tax_name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Amount (%)</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                        placeholder="e.g. 18"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <span className="input-group-text">%</span>
                                </div>
                                {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submit}
                                    disabled={processing || !countryId || !taxName.trim() || !amount}
                                >
                                    {processing ? 'Saving...' : editingId ? 'Update' : 'Add'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8 mb-4">
                    <div className="card h-auto">
                        <div className="card-body">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by country, tax name or amount..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {filteredTaxSetups.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Country</th>
                                                <th>Tax Name</th>
                                                <th>Amount</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTaxSetups.map((taxSetup) => (
                                                <tr key={taxSetup.id}>
                                                    <td>{taxSetup.country?.countryName || <span className="text-muted">—</span>}</td>
                                                    <td>{taxSetup.tax_name}</td>
                                                    <td>{taxSetup.amount}%</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => editTaxSetup(taxSetup)} title="Edit">
                                                                <i className="fa fa-edit"></i>
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(taxSetup)} title="Delete">
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-file-invoice-dollar" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                    <p className="text-muted mt-3">
                                        {search ? 'No tax setups match your search' : 'No tax setups found'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {deleteTarget && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete <strong>{deleteTarget.tax_name}</strong> for{' '}
                                <strong>{deleteTarget.country?.countryName}</strong>?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={() => deleteTaxSetup(deleteTarget)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

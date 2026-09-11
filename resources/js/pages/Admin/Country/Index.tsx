import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type CountryEntry = {
    id: number;
    countryCode: string;
    countryName: string;
    flag_url: string;
};

export default function CountryIndex() {
    const { countries, filters } = usePage().props as any;
    const [editingId, setEditingId] = useState<number | null>(null);
    const [countryCode, setCountryCode] = useState('');
    const [countryName, setCountryName] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deleteTarget, setDeleteTarget] = useState<CountryEntry | null>(null);

    const list: CountryEntry[] = countries?.data || [];
    const currentPage = countries?.current_page || 1;
    const lastPage = countries?.last_page || 1;

    const handleSearch = (search: string) => {
        router.visit('/admin/countries', { data: { search, page: 1 }, preserveScroll: true, preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.visit('/admin/countries', { data: { search: filters?.search || '', page }, preserveScroll: true, preserveState: true });
    };

    const resetForm = () => {
        setEditingId(null);
        setCountryCode('');
        setCountryName('');
        setErrors({});
    };

    const editCountry = (country: CountryEntry) => {
        setEditingId(country.id);
        setCountryCode(country.countryCode);
        setCountryName(country.countryName);
        setErrors({});
    };

    const submit = () => {
        if (!countryCode.trim() || !countryName.trim()) return;
        setProcessing(true);
        setErrors({});

        const data = { countryCode: countryCode.trim(), countryName: countryName.trim() };
        const onDone = {
            preserveScroll: true,
            onSuccess: () => resetForm(),
            onError: (err: Record<string, string>) => setErrors(err),
            onFinish: () => setProcessing(false),
        };

        if (editingId) {
            router.put(`/admin/countries/${editingId}`, data, onDone);
        } else {
            router.post('/admin/countries', data, onDone);
        }
    };

    const deleteCountry = (country: CountryEntry) => {
        router.delete(`/admin/countries/${country.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <div>
            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Countries</h1></li>
                        <li className="breadcrumb-item active">All Countries</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card h-auto">
                        <div className="card-header">
                            <h6 className="card-title mb-0">{editingId ? 'Edit Country' : 'Add Country'}</h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Country Code</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.countryCode ? 'is-invalid' : ''}`}
                                    placeholder="e.g. IN"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                                    maxLength={10}
                                />
                                {errors.countryCode && <div className="invalid-feedback d-block">{errors.countryCode}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Country Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.countryName ? 'is-invalid' : ''}`}
                                    placeholder="e.g. India"
                                    value={countryName}
                                    onChange={(e) => setCountryName(e.target.value)}
                                />
                                {errors.countryName && <div className="invalid-feedback d-block">{errors.countryName}</div>}
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submit}
                                    disabled={processing || !countryCode.trim() || !countryName.trim()}
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
                                    placeholder="Search by name or code..."
                                    defaultValue={filters?.search || ''}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>

                            {list.length > 0 ? (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Flag</th>
                                                    <th>Code</th>
                                                    <th>Name</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.map((country) => (
                                                    <tr key={country.id}>
                                                        <td>
                                                            <img
                                                                src={country.flag_url}
                                                                alt={country.countryName}
                                                                width={32}
                                                                height={24}
                                                                style={{ objectFit: 'cover', borderRadius: 2 }}
                                                                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                                                            />
                                                        </td>
                                                        <td><span className="badge bg-secondary bg-opacity-10 text-secondary">{country.countryCode}</span></td>
                                                        <td>{country.countryName}</td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-sm btn-outline-primary" onClick={() => editCountry(country)} title="Edit">
                                                                    <i className="fa fa-edit"></i>
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(country)} title="Delete">
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {lastPage > 1 && (
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination justify-content-end mb-0">
                                                {currentPage > 1 && (
                                                    <li className="page-item">
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                                                    </li>
                                                )}
                                                {currentPage < lastPage && (
                                                    <li className="page-item">
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-globe" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                    <p className="text-muted mt-3">No countries found</p>
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
                                Are you sure you want to delete <strong>{deleteTarget.countryName}</strong>?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={() => deleteCountry(deleteTarget)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

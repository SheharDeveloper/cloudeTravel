import { router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type CountryEntry = {
    id: number;
    countryCode: string;
    countryName: string;
    currency_code: string | null;
};

type RateEntry = {
    code: string;
    name: string | null;
    symbol: string | null;
    rate: number;
    date: string;
};

/** Countries: the default country, and today's exchange rates against its currency (from the API). */
export default function CountryIndex() {
    const { allCountries, defaultCountryId, rateBase, rates, ratesError, ratesSource } = usePage().props as unknown as {
        allCountries: CountryEntry[];
        defaultCountryId: number | null;
        rateBase: string;
        rates: RateEntry[];
        ratesError: string | null;
        ratesSource: string;
    };

    const [defaultCountry, setDefaultCountry] = useState(defaultCountryId ? String(defaultCountryId) : '');
    const [savingDefault, setSavingDefault] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('search') ?? '');

    const saveDefaultCountry = () => {
        if (!defaultCountry) return;
        setSavingDefault(true);
        router.post('/admin/countries/default-country', { country_id: Number(defaultCountry) }, {
            preserveScroll: true,
            onFinish: () => setSavingDefault(false),
        });
    };

    const refreshRates = () => {
        setRefreshing(true);
        router.post('/admin/countries/refresh-rates', {}, { preserveScroll: true, onFinish: () => setRefreshing(false) });
    };

    // Search by currency code or name, e.g. "INR" or "Indian"
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q === '' ? rates : rates.filter((r) => r.code.toLowerCase().includes(q) || (r.name ?? '').toLowerCase().includes(q));
    }, [rates, search]);
    const rateDate = rates.reduce((latest, r) => (r.date > latest ? r.date : latest), '');

    return (
        <div>
            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Countries</h1></li>
                        <li className="breadcrumb-item active">Exchange Rates</li>
                    </ol>
                </nav>
            </div>

            <div className="card mb-4 h-auto">
                <div className="card-body d-flex flex-wrap align-items-end gap-3">
                    <div style={{ minWidth: 260 }}>
                        <label className="form-label mb-1">
                            <i className="fa fa-globe me-1"></i>Default Country
                        </label>
                        <select
                            className="form-select"
                            value={defaultCountry}
                            onChange={(e) => setDefaultCountry(e.target.value)}
                        >
                            <option value="">Select default country...</option>
                            {allCountries.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.countryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={saveDefaultCountry}
                        disabled={savingDefault || !defaultCountry || Number(defaultCountry) === defaultCountryId}
                    >
                        {savingDefault ? 'Saving...' : 'Save Default Country'}
                    </button>
                </div>
            </div>

            <div className="card h-auto">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h6 className="card-title mb-0">Exchange Rates — 1 {rateBase}</h6>
                        <small className="text-muted">
                            Visa prices are converted with these rates.
                            {rateDate && <> Rates of {new Date(rateDate).toLocaleDateString('en-GB')}</>} · Source: {ratesSource.replace('https://', '')}
                        </small>
                    </div>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={refreshRates} disabled={refreshing}>
                        <i className={`fa fa-sync-alt me-2 ${refreshing ? 'fa-spin' : ''}`}></i>
                        {refreshing ? 'Refreshing...' : 'Refresh Rates'}
                    </button>
                </div>
                <div className="card-body">
                    {ratesError && (
                        <div className="alert alert-warning py-2">
                            <i className="fa fa-exclamation-triangle me-2"></i>{ratesError}
                        </div>
                    )}

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by currency code or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {filtered.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: 70 }}>#</th>
                                        <th>Code</th>
                                        <th>Currency</th>
                                        <th>Symbol</th>
                                        <th className="text-end">Rate (per 1 {rateBase})</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r, i) => (
                                        <tr key={r.code}>
                                            <td>{i + 1}</td>
                                            <td><span className="badge bg-secondary bg-opacity-10 text-secondary">{r.code}</span></td>
                                            <td>{r.name ?? <span className="text-muted">—</span>}</td>
                                            <td>{r.symbol ?? <span className="text-muted">—</span>}</td>
                                            <td className="text-end fw-semibold">{r.rate.toLocaleString('en-US', { maximumFractionDigits: 6 })}</td>
                                            <td className="text-nowrap">{new Date(r.date).toLocaleDateString('en-GB')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-exchange-alt" style={{ fontSize: '48px', color: '#ccc' }}></i>
                            <p className="text-muted mt-3">{rates.length ? 'No currency matches your search' : 'No exchange rates available'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

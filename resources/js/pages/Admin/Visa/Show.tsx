import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { Visa } from '@/services/visaService';
import VisaFieldConfig, { type ConfigSection } from './VisaFieldConfig';
import VisaDocumentConfig, { type VisaDocumentRow } from './VisaDocumentConfig';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'fields', label: 'Assign Field' },
    { key: 'documents', label: 'Assign Document' },
];

type CountryInfo = { id: number; countryName: string; countryCode: string; flag_url?: string } | null | undefined;

export default function VisaShow() {
    const { visa, currency, canConfigureFields, fieldConfig, visaDocuments, initialTab } = usePage().props as unknown as {
        visa: Visa & { origin_country?: CountryInfo; destination_country?: CountryInfo };
        currency: { symbol: string };
        canConfigureFields: boolean;
        fieldConfig: ConfigSection[];
        visaDocuments: VisaDocumentRow[];
        initialTab?: string;
    };
    const [activeTab, setActiveTab] = useState(initialTab ?? 'overview');

    const symbol = currency?.symbol || '£';
    const money = (v: string | number | null | undefined) => `${symbol}${(parseFloat(String(v ?? '')) || 0).toFixed(2)}`;
    const isActive = Number(visa.status) === 1;
    const displayName = visa.name || visa.title;
    const costDetails = visa.cost_details ?? [];
    const grandTotal = costDetails.reduce((sum, row) => sum + (parseFloat(row.total_cost ?? '') || 0), 0);
    const processingTime = costDetails.find(row => row.processing_time)?.processing_time;

    const formatDate = (date?: string) =>
        date ? new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: '2-digit' }) : 'N/A';

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="col-md-6 mb-3">
            <label className="text-muted small">{label}</label>
            <div className="fw-semibold">{children || 'N/A'}</div>
        </div>
    );

    const Country = ({ country }: { country: CountryInfo }) =>
        country ? (
            <span className="d-inline-flex align-items-center gap-2">
                {country.flag_url && (
                    <img
                        src={country.flag_url}
                        alt=""
                        width={22}
                        height={16}
                        style={{ objectFit: 'cover', borderRadius: 2 }}
                        onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                )}
                {country.countryName}
            </span>
        ) : null;

    const EmptyState = ({ icon, title, text }: { icon: string; title: string; text: string }) => (
        <div className="card h-auto">
            <div className="card-body text-center py-5">
                <i className={icon} style={{ fontSize: '48px', color: '#ccc' }}></i>
                <h6 className="mt-3 mb-1">{title}</h6>
                <p className="text-muted mb-0">{text}</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Visa Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/visa-services">Visas</a></li>
                        <li className="breadcrumb-item active">{displayName}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                            <div>
                                {visa.image ? (
                                    <img
                                        src={visa.image}
                                        alt={displayName}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                ) : (
                                    <div
                                        className="bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                        style={{ width: 80, height: 80, borderRadius: 8 }}
                                    >
                                        <i className="fa-solid fa-passport text-primary fs-24"></i>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="fw-semibold mb-1">{displayName}</h3>
                                <p className="text-muted small mb-2">
                                    {visa.visa_type && <span className="badge bg-info">{visa.visa_type.name}</span>}
                                    {visa.category && <span className="badge bg-primary ms-2">{visa.category.name}</span>}
                                    {visa.is_featured && (
                                        <span className="badge bg-warning text-dark ms-2">
                                            <i className="fa-solid fa-star me-1"></i>Featured
                                        </span>
                                    )}
                                </p>
                                <ul className="d-flex flex-wrap align-items-center gap-3">
                                    <li className="d-inline-flex align-items-center">
                                        <i className="las la-map-marker me-2"></i>
                                        {visa.origin_country ? <Country country={visa.origin_country} /> : 'N/A'}
                                        <i className="fa-solid fa-arrow-right mx-2 text-muted" style={{ fontSize: 11 }}></i>
                                        {visa.destination_country ? <Country country={visa.destination_country} /> : 'N/A'}
                                    </li>
                                    {processingTime && (
                                        <li className="d-inline-flex align-items-center">
                                            <i className="las la-clock me-2"></i>{processingTime}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="text-end">
                            <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
                                <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <small className="text-muted d-block">Created on</small>
                            <strong>{formatDate(visa.created_at)}</strong>
                        </div>
                    </div>
                </div>

                <div className="card-footer py-3 d-flex flex-wrap justify-content-end align-items-center">
                    <div className="d-flex gap-2">
                        <a href="/admin/visa-services" className="btn btn-outline-secondary btn-sm">
                            <i className="fa fa-arrow-left me-2"></i>Back
                        </a>
                        <a href={`/admin/visa-services/${visa.uid}/edit`} className="btn btn-primary btn-sm">
                            <i className="fa fa-edit me-2"></i>Edit
                        </a>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-3 col-xl-2 mb-4">
                    <div className="card h-auto">
                        <div className="card-body p-2">
                            <ul className="nav nav-pills flex-column gap-1" role="tablist">
                                {TABS.map((tab) => (
                                    <li className="nav-item" role="presentation" key={tab.key}>
                                        <button
                                            className={`nav-link w-100 text-start ${activeTab === tab.key ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.key)}
                                            role="tab"
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-9 col-xl-10">
                    {activeTab === 'overview' && (
                        <>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="card mb-4 h-auto">
                                        <div className="card-header"><h6 className="card-title mb-0">Visa Information</h6></div>
                                        <div className="card-body">
                                            <div className="row">
                                                <Field label="Title">{visa.title}</Field>
                                                <Field label="Visa Type">{visa.visa_type?.name}</Field>
                                                <Field label="Category">{visa.category?.name}</Field>
                                                <Field label="Featured">{visa.is_featured ? 'Yes' : 'No'}</Field>
                                                <Field label="Status">
                                                    <span className={`badge ${isActive ? 'bg-success' : 'bg-danger'}`}>{isActive ? 'Active' : 'Inactive'}</span>
                                                </Field>
                                                <Field label="Created">{formatDate(visa.created_at)}</Field>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="card mb-4 h-auto">
                                        <div className="card-header"><h6 className="card-title mb-0">Route</h6></div>
                                        <div className="card-body">
                                            <div className="row">
                                                <Field label="Origin Country"><Country country={visa.origin_country} /></Field>
                                                <Field label="Destination Country"><Country country={visa.destination_country} /></Field>
                                                <Field label="Processing Time">{processingTime}</Field>
                                                <Field label="Total Cost">{costDetails.length > 0 ? money(grandTotal) : null}</Field>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-4 h-auto">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="card-title mb-0">Cost Breakdown</h6>
                                    {costDetails.length > 0 && <span className="fw-bold text-primary">Total {money(grandTotal)}</span>}
                                </div>
                                <div className="card-body">
                                    {costDetails.length === 0 ? (
                                        <p className="text-muted mb-0">No cost breakdown added for this visa.</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Validation</th>
                                                        <th>Processing</th>
                                                        <th>Embassy Fee</th>
                                                        <th>Service Fee</th>
                                                        <th>Tax</th>
                                                        <th className="text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {costDetails.map((row) => (
                                                        <tr key={row.id}>
                                                            <td>{row.type || '—'}</td>
                                                            <td>{row.validation_process || '—'}</td>
                                                            <td>{row.processing_time || '—'}</td>
                                                            <td>{money(row.embassy_fee ?? row.credit_amount)}</td>
                                                            <td>{money(row.service_fee)}</td>
                                                            <td>{money(row.tax_fee ?? row.tax_amount)}</td>
                                                            <td className="text-end fw-semibold">{money(row.total_cost)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card mb-4 h-auto">
                                <div className="card-header"><h6 className="card-title mb-0">Description</h6></div>
                                <div className="card-body">
                                    {visa.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: visa.description }} />
                                    ) : (
                                        <p className="text-muted mb-0">No description added.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'fields' && (canConfigureFields ? (
                        <VisaFieldConfig
                            key={visa.uid}
                            visaUid={visa.uid}
                            visaName={displayName}
                            countryLabel={[visa.origin_country?.countryName, visa.destination_country?.countryName].filter(Boolean).join(' → ') || 'N/A'}
                            initial={fieldConfig}
                        />
                    ) : (
                        <EmptyState
                            icon="fa-solid fa-lock"
                            title="Assign Field"
                            text="Only a Super Admin can configure the application fields for a visa."
                        />
                    ))}

                    {activeTab === 'documents' && (canConfigureFields ? (
                        <VisaDocumentConfig
                            key={visa.uid}
                            visaUid={visa.uid}
                            visaName={displayName}
                            initial={visaDocuments}
                        />
                    ) : (
                        <EmptyState
                            icon="fa-solid fa-lock"
                            title="Assign Document"
                            text="Only a Super Admin can assign the required documents for a visa."
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { computeRowTotalCost, emptyCostDetailRow, toastValidationErrors, withFormError, type StepValidation, type StepValidationCallbacks, type VisaCostDetailInput, type VisaFormData } from '@/services/visaService';
import type { VisaType } from './VisaTypeFormModal';
import IdSearchSelect from './IdSearchSelect';
import RichTextEditor from '@/components/RichTextEditor';

interface Country {
    id: number;
    countryName: string;
    countryCode: string;
    flag_url?: string;
}

interface Category {
    id: number;
    name: string;
}

interface VisaWizardProps {
    mode: 'create' | 'edit';
    title: string;
    subtitle: string;
    formData: VisaFormData;
    setFormData: React.Dispatch<React.SetStateAction<VisaFormData>>;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    preview: string | null;
    setPreview: React.Dispatch<React.SetStateAction<string | null>>;
    visaTypes: VisaType[];
    countries: Country[];
    categories: Category[];
    currencySymbol: string;
    submitting: boolean;
    onSubmit: (asDraft: boolean) => void;
    /** Asks the server to validate; `overrides` are values not yet in formData (a file just picked). */
    onValidate: (options: StepValidation, callbacks: StepValidationCallbacks, overrides?: Partial<VisaFormData>) => void;
}

const TOURISM_BUSINESS = 'Tourism & Business';
const WORK_IMMIGRATION = 'Work & Immigration';

const STEPS = [
    { n: 1, label: 'Basic Details' },
    { n: 2, label: 'Cost' },
    { n: 3, label: 'Documents' },
    { n: 4, label: 'Review' },
];

const wizardCss = `
.vw-back{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #e3e6ef;border-radius:8px;padding:6px 14px;font-size:13px;color:#4b5563;text-decoration:none}
.vw-back:hover{color:#4f46e5;border-color:#c7c9f5}
.vw-icon{width:44px;height:44px;border-radius:10px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none}
.vw-stepper{display:flex;align-items:center;padding:14px 20px;background:#fff;border:1px solid #e9ebf3;border-radius:12px}
.vw-step{display:flex;align-items:center;gap:8px;background:none;border:none;padding:0;font-size:13px;font-weight:600;color:#9aa1b5}
.vw-step .dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;border:1.5px solid #d5d9e6;background:#fff;color:#9aa1b5}
.vw-step.active{color:#4f46e5}
.vw-step.active .dot{background:#4f46e5;border-color:#4f46e5;color:#fff}
.vw-step.done{color:#374151}
.vw-step.done .dot{background:#16a34a;border-color:#16a34a;color:#fff}
.vw-line{flex:1;height:1.5px;background:#e3e6ef;margin:0 14px;min-width:20px}
.vw-line.done{background:#16a34a}
.vw-section{background:#fff;border:1px solid #e9ebf3;border-radius:10px;position:relative}
.vw-section-head{border-radius:9px;width:100%;display:flex;align-items:center;gap:10px;padding:11px 16px;background:#f4f6fb;border:none;text-align:left;font-size:13.5px;font-weight:700;color:#1f2937}
.vw-section-head .ic{color:#4f46e5;width:16px;text-align:center}
.vw-section-head .badge-note{font-size:11.5px;font-weight:600;color:#4f46e5}
.vw-section-head .chev{margin-left:auto;color:#6b7280;font-size:11px;transition:transform .15s}
.vw-section-head.closed .chev{transform:rotate(-90deg)}
.vw-section-body{padding:18px 16px}
.vw-breakdown{border:1px solid #e9ebf3;border-radius:10px;background:#fbfbfe}
.vw-breakdown-head{display:flex;justify-content:space-between;align-items:center;padding:8px 14px;border-bottom:1px solid #e9ebf3;font-size:12.5px;font-weight:700;color:#4b5563}
.vw-total{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-top:1px solid #e9ebf3;font-size:13px}
.vw-total strong{color:#4f46e5;font-size:17px}
.vw-drop{border:1.5px dashed #ced4e4;border-radius:10px;background:#fafbff;padding:26px 14px;text-align:center;cursor:pointer;display:block;min-height:170px}
.vw-drop:hover{border-color:#4f46e5;background:#f4f3ff}
.vw-preview{position:sticky;top:88px;background:#fff;border:1px solid #e9ebf3;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(20,20,50,.05)}
.vw-preview-media{position:relative;aspect-ratio:16/9;background:#eef0f8;overflow:hidden}
.vw-preview-media img{width:100%;height:100%;object-fit:cover}
.vw-chip{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.95);color:#4f46e5;font-size:11px;font-weight:700;padding:4px 10px;border-radius:99px}
.vw-clamp{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.vw-review dt{font-size:12px;color:#6b7280;font-weight:600}
.vw-review dd{font-size:13.5px;color:#111827;font-weight:600;margin-bottom:12px}
`;

function Section({
    id, icon, title, note, closed, onToggle, children,
}: {
    id: string; icon: string; title: string; note?: string; closed: boolean;
    onToggle: (id: string) => void; children: React.ReactNode;
}) {
    return (
        <div className="vw-section mb-3">
            <button type="button" className={`vw-section-head ${closed ? 'closed' : ''}`} onClick={() => onToggle(id)}>
                <i className={`fa-solid ${icon} ic`}></i>
                {title}
                {note && <span className="badge-note">— {note}</span>}
                <i className="fa-solid fa-chevron-down chev"></i>
            </button>
            {!closed && <div className="vw-section-body">{children}</div>}
        </div>
    );
}

const toNum = (v: string) => parseFloat(v) || 0;

export default function VisaWizard({
    mode, title, subtitle, formData, setFormData, errors, setErrors, preview, setPreview,
    visaTypes, countries, categories, currencySymbol, submitting, onSubmit, onValidate,
}: VisaWizardProps) {
    const [step, setStep] = useState(1);
    const [checking, setChecking] = useState(false);
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const toggle = (id: string) => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

    useEffect(() => {
        if (formData.visa_service_category_id === null) {
            const defaultCategory = categories.find(c => c.name === TOURISM_BUSINESS);
            if (defaultCategory) {
                setFormData(prev => ({ ...prev, visa_service_category_id: defaultCategory.id }));
            }
        }
    }, [categories, formData.visa_service_category_id, setFormData]);

    const selectedCategory = categories.find(c => c.id === formData.visa_service_category_id);
    const isBusiness = selectedCategory?.name === TOURISM_BUSINESS;
    const isWork = selectedCategory?.name === WORK_IMMIGRATION;
    const selectedType = visaTypes.find(t => t.id === formData.visa_type_id);
    const origin = countries.find(c => c.id === formData.origin_country_id);
    const destination = countries.find(c => c.id === formData.destination_country_id);

    // The server's message for a field, shown right under its input.
    const fieldError = (name: string) =>
        errors[name] ? <div className="invalid-feedback d-block">{errors[name]}</div> : null;
    const clearError = (name: string) => setErrors(prev => (prev[name] ? { ...prev, [name]: '' } : prev));

    const money = (n: number) => `${currencySymbol}${n.toFixed(2)}`;
    const grandTotal = formData.cost_details.reduce((acc, r) => acc + computeRowTotalCost(r), 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const file = input.files?.[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
        setErrors(prev => ({ ...prev, image: '' }));

        // The server says whether it is acceptable (type, size); a rejected file is dropped.
        onValidate({ through: 3, only: 'image' }, {
            onValid: () => undefined,
            onInvalid: (serverErrors) => {
                setErrors(prev => ({ ...prev, ...serverErrors }));
                setFormData(prev => ({ ...prev, image: null }));
                setPreview(null);
                input.value = '';
                toastValidationErrors(serverErrors);
            },
        }, { image: file });
    };

    const updateCostRow = (index: number, changes: Partial<VisaCostDetailInput>) => {
        setFormData(prev => ({ ...prev, cost_details: prev.cost_details.map((r, i) => (i === index ? { ...r, ...changes } : r)) }));
        Object.keys(changes).forEach(key => clearError(`cost_details.${index}.${key}`));
    };
    const addCostRow = () => setFormData(prev => ({ ...prev, cost_details: [...prev.cost_details, emptyCostDetailRow()] }));
    const removeCostRow = (index: number) =>
        setFormData(prev => ({ ...prev, cost_details: prev.cost_details.filter((_, i) => i !== index) }));

    // Nothing is validated here: the server checks the form and its errors come back as a toast and under the fields.
    // Moving forward asks the server to validate the steps being left; going back is free.
    const goTo = (target: number) => {
        if (target <= step) {
            setStep(target);
            return;
        }
        if (checking) return;
        setChecking(true);
        setErrors({});
        onValidate({ through: target - 1 }, {
            onValid: () => setStep(target),
            onInvalid: (serverErrors) => {
                setErrors(withFormError(serverErrors));
                toastValidationErrors(serverErrors);
            },
            onFinish: () => setChecking(false),
        });
    };

    const submit = (asDraft: boolean) => onSubmit(asDraft);

    // A rejected save: go to the step that holds the problem (image on 3, costs on 2, the rest on 1).
    useEffect(() => {
        if (!errors.form) return;
        const keys = Object.keys(errors).filter(key => key !== 'form' && errors[key]);
        if (keys.some(key => key === 'title' || !(key === 'image' || key.startsWith('cost_details')))) setStep(1);
        else if (keys.some(key => key.startsWith('cost_details'))) setStep(2);
        else if (keys.includes('image')) setStep(3);
    }, [errors.form]);

    const isLast = step === 4;
    const primaryLabel = isLast ? (mode === 'create' ? 'Add Visa' : 'Update Visa') : 'Next';

    const flag = (c?: Country) =>
        c?.flag_url ? <img src={c.flag_url} alt="" width={22} height={16} style={{ objectFit: 'cover', borderRadius: 2 }} onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} /> : <i className="fa-solid fa-location-dot text-muted"></i>;

    return (
        <>
            <Toaster position="top-right" />
            <style>{wizardCss}</style>

            <div className="mb-3">
                <a href="/admin/visa-services" className="vw-back">
                    <i className="fa-solid fa-chevron-left" style={{ fontSize: 11 }}></i>Back to Visa List
                </a>
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div className="d-flex align-items-center gap-3">
                    <span className="vw-icon"><i className="fa-solid fa-passport"></i></span>
                    <div>
                        <h4 className="mb-0 fw-bold">{title}</h4>
                        <div className="text-muted small">{subtitle}</div>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {mode === 'create' && (
                        <button type="button" className="btn btn-outline-secondary" disabled={submitting} onClick={() => submit(true)}>
                            <i className="fa-regular fa-floppy-disk me-2"></i>Save Draft
                        </button>
                    )}
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={submitting}
                        onClick={() => (isLast ? submit(false) : goTo(step + 1))}
                    >
                        {submitting ? 'Saving...' : primaryLabel}
                        {!isLast && <i className="fa-solid fa-arrow-right ms-2"></i>}
                    </button>
                </div>
            </div>

            <div className="vw-stepper mb-3">
                {STEPS.map((s, i) => (
                    <div key={s.n} className="d-flex align-items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                        <button
                            type="button"
                            className={`vw-step ${step === s.n ? 'active' : step > s.n ? 'done' : ''}`}
                            onClick={() => goTo(s.n)}
                        >
                            <span className="dot">{step > s.n ? <i className="fa-solid fa-check" style={{ fontSize: 10 }}></i> : s.n}</span>
                            {s.label}
                        </button>
                        {i < STEPS.length - 1 && <span className={`vw-line ${step > s.n ? 'done' : ''}`}></span>}
                    </div>
                ))}
            </div>

            <div className="row g-3 align-items-start">
                <div className="col-xl-8">
                    {step === 1 && (
                        <>

                            <Section id="classification" icon="fa-tags" title="Classification" closed={!!collapsed.classification} onToggle={toggle}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <IdSearchSelect
                                            label="Visa Type"
                                            value={formData.visa_type_id}
                                            placeholder="Search visa type..."
                                            options={visaTypes.map(vt => ({ id: vt.id, label: vt.name }))}
                                            onChange={(id) => { setFormData(prev => ({ ...prev, visa_type_id: id })); clearError('visa_type_id'); }}
                                        />
                                        {fieldError('visa_type_id')}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Title <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., European Travel Document"
                                        />
                                        {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                                    </div>
                                </div>
                            </Section>

                            <Section id="route" icon="fa-location-dot" title="Route" closed={!!collapsed.route} onToggle={toggle}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <IdSearchSelect
                                            label="Origin Country"
                                            value={formData.origin_country_id}
                                            placeholder="Search origin country..."
                                            options={countries.map(c => ({ id: c.id, label: c.countryName, sublabel: c.countryCode, flag: c.flag_url }))}
                                            onChange={(id) => { setFormData(prev => ({ ...prev, origin_country_id: id })); clearError('origin_country_id'); }}
                                        />
                                        {fieldError('origin_country_id')}
                                    </div>
                                    <div className="col-md-6">
                                        <IdSearchSelect
                                            label="Destination Country"
                                            value={formData.destination_country_id}
                                            placeholder="Search destination country..."
                                            options={countries.map(c => ({ id: c.id, label: c.countryName, sublabel: c.countryCode, flag: c.flag_url }))}
                                            onChange={(id) => { setFormData(prev => ({ ...prev, destination_country_id: id })); clearError('destination_country_id'); }}
                                        />
                                        {fieldError('destination_country_id')}
                                    </div>
                                </div>
                            </Section>

                            <Section id="description" icon="fa-align-left" title="Description" closed={!!collapsed.description} onToggle={toggle}>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(value) => { setFormData(prev => ({ ...prev, description: value })); clearError('description'); }}
                                    placeholder="Enter visa description..."
                                />
                                {fieldError('description')}
                            </Section>
                        </>
                    )}

                    {step === 2 && (
                        <Section
                            id="cost" icon="fa-coins" title="Cost Details" note={selectedCategory?.name}
                            closed={!!collapsed.cost} onToggle={toggle}
                        >
                            {!isBusiness && !isWork ? (
                                <div className="alert alert-info mb-0">
                                    Choose a category in <strong>Basic Details</strong> to enter the cost breakdown for this visa.
                                </div>
                            ) : (
                                <>
                                    {formData.cost_details.map((row, index) => (
                                        <div key={index} className="vw-breakdown mb-3">
                                            <div className="vw-breakdown-head">
                                                <span>Breakdown {index + 1}</span>
                                                {formData.cost_details.length > 1 && (
                                                    <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => removeCostRow(index)}>
                                                        <i className="fa-solid fa-trash-can me-1"></i>Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">{isBusiness ? 'Type of Business' : 'Processing Type'}</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors[`cost_details.${index}.type`] ? 'is-invalid' : ''}`}
                                                            value={row.type}
                                                            onChange={(e) => updateCostRow(index, { type: e.target.value })}
                                                            placeholder={isBusiness ? 'e.g., Retail, Consulting...' : 'e.g., Work Permit, PR case...'}
                                                        />
                                                        {fieldError(`cost_details.${index}.type`)}
                                                    </div>
                                                    {isBusiness && (
                                                        <div className="col-md-6">
                                                            <label className="form-label">Validation Process</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${errors[`cost_details.${index}.validation_process`] ? 'is-invalid' : ''}`}
                                                                value={row.validation_process}
                                                                onChange={(e) => updateCostRow(index, { validation_process: e.target.value })}
                                                                placeholder="e.g., Document verification"
                                                            />
                                                            {fieldError(`cost_details.${index}.validation_process`)}
                                                        </div>
                                                    )}
                                                    {isBusiness && (
                                                        <div className="col-md-6">
                                                            <label className="form-label">Processing Time</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${errors[`cost_details.${index}.processing_time`] ? 'is-invalid' : ''}`}
                                                                value={row.processing_time}
                                                                onChange={(e) => updateCostRow(index, { processing_time: e.target.value })}
                                                                placeholder="e.g., 10-15 business days"
                                                            />
                                                            {fieldError(`cost_details.${index}.processing_time`)}
                                                        </div>
                                                    )}
                                                    {(isBusiness
                                                        ? ([['embassy_fee', 'Embassy Fee'], ['service_fee', 'Service Fee'], ['tax_fee', 'Tax Fee']] as const)
                                                        : ([['credit_amount', 'Credit Amount'], ['tax_amount', 'Tax Amount']] as const)
                                                    ).map(([key, label]) => (
                                                        <div key={key} className="col-md-6">
                                                            <label className="form-label">{label}</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">{currencySymbol}</span>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    className={`form-control ${errors[`cost_details.${index}.${key}`] ? 'is-invalid' : ''}`}
                                                                    value={key.startsWith('tax') ? '' : row[key]}
                                                                    onChange={(e) => updateCostRow(index, { [key]: e.target.value })}
                                                                    placeholder={key.startsWith('tax') ? 'Tax is calculated automatically' : '0.00'}
                                                                    disabled={key.startsWith('tax')}
                                                                />
                                                            </div>
                                                            {fieldError(`cost_details.${index}.${key}`)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="vw-total">
                                                <span className="text-muted fw-semibold">Total Cost</span>
                                                <strong>{money(computeRowTotalCost(row))}</strong>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={addCostRow}>
                                        <i className="fa-solid fa-plus me-2"></i>Add Another Breakdown
                                    </button>
                                </>
                            )}
                        </Section>
                    )}

                    {step === 3 && (
                        <>
                            <Section id="media" icon="fa-image" title="Media" closed={!!collapsed.media} onToggle={toggle}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="visaImageInput"
                                            className="vw-drop"
                                            style={errors.image ? { borderColor: '#dc3545' } : undefined}
                                        >
                                            <i className="fa-solid fa-cloud-arrow-up fa-2x text-muted mb-2"></i>
                                            <div className="fw-semibold small">Click to upload an image</div>
                                            <div className="text-muted" style={{ fontSize: 12 }}>PNG, JPG or GIF &bull; Max 5 MB</div>
                                            <input id="visaImageInput" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                                        </label>
                                        {errors.image && <div className="text-danger small mt-1">{errors.image}</div>}
                                        {mode === 'create' && !errors.image && <div className="form-text">Image is required for a new visa.</div>}
                                    </div>
                                    <div className="col-md-6">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="rounded border w-100" style={{ maxHeight: 170, objectFit: 'cover' }} />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center rounded text-muted small h-100" style={{ minHeight: 170, background: '#f7f8fc', border: '1px dashed #dfe3ef' }}>
                                                No image selected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <Section id="visibility" icon="fa-eye" title="Visibility" closed={!!collapsed.visibility} onToggle={toggle}>
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-6">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check form-switch mt-md-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="isFeatured"
                                                checked={formData.is_featured}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                                            />
                                            <label className="form-check-label" htmlFor="isFeatured">
                                                <i className="fa-solid fa-star me-2 text-warning"></i>Featured Visa
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            <Section id="summary" icon="fa-clipboard-check" title="Review Summary" closed={!!collapsed.summary} onToggle={toggle}>
                                <dl className="vw-review row mb-0">
                                                                        <div className="col-md-6"><dt>Title</dt><dd>{formData.title || '—'}</dd></div>
                                    <div className="col-md-6"><dt>Visa Type</dt><dd>{selectedType?.name || '—'}</dd></div>
                                    <div className="col-md-6"><dt>Category</dt><dd>{selectedCategory?.name || '—'}</dd></div>
                                    <div className="col-md-6">
                                        <dt>Route</dt>
                                        <dd>{origin?.countryName || '—'} <i className="fa-solid fa-arrow-right mx-1 text-muted"></i> {destination?.countryName || '—'}</dd>
                                    </div>
                                    <div className="col-md-6"><dt>Total Cost</dt><dd>{money(grandTotal)}</dd></div>
                                    <div className="col-md-6"><dt>Status</dt><dd>{Number(formData.status) === 1 ? 'Active' : 'Inactive'}</dd></div>
                                    <div className="col-md-6"><dt>Featured</dt><dd>{formData.is_featured ? 'Yes' : 'No'}</dd></div>
                                    <div className="col-md-6"><dt>Image</dt><dd>{preview ? 'Uploaded' : 'Missing'}</dd></div>
                                </dl>
                            </Section>
                        </>
                    )}

                    <div className="d-flex justify-content-between mt-3">
                        <button type="button" className="btn btn-outline-secondary" style={{ visibility: step === 1 ? 'hidden' : 'visible' }} onClick={() => setStep(step - 1)}>
                            <i className="fa-solid fa-arrow-left me-2"></i>Back
                        </button>
                        <button type="button" className="btn btn-primary" disabled={submitting || checking} onClick={() => (isLast ? submit(false) : goTo(step + 1))}>
                            {submitting ? 'Saving...' : primaryLabel}
                            {!isLast && <i className="fa-solid fa-arrow-right ms-2"></i>}
                        </button>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="vw-preview">
                        <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom small fw-bold">
                            <i className="fa-regular fa-eye text-primary"></i>Visa Preview
                        </div>
                        <div className="vw-preview-media">
                            {preview ? (
                                <img src={preview} alt="Visa" />
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                    <i className="fa-regular fa-image fa-2x"></i>
                                </div>
                            )}
                            {selectedCategory && <span className="vw-chip">{selectedCategory.name}</span>}
                        </div>
                        <div className="p-3">
                            <div className="fw-bold" style={{ fontSize: 17 }}>{formData.name || formData.title || 'Visa name'}</div>
                            <div className="text-primary small mb-3">{formData.title || 'Visa title'}</div>

                            <div className="d-flex align-items-center gap-2 mb-2 small">
                                {flag(origin)}
                                <div><div className="text-muted" style={{ fontSize: 11 }}>Origin Country</div><div className="fw-semibold">{origin?.countryName || '—'}</div></div>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2 small">
                                {flag(destination)}
                                <div><div className="text-muted" style={{ fontSize: 11 }}>Destination Country</div><div className="fw-semibold">{destination?.countryName || '—'}</div></div>
                            </div>

                            {formData.cost_details[0]?.processing_time && (
                                <div className="small mb-2"><span className="text-muted">Processing:</span> <span className="fw-semibold">{formData.cost_details[0].processing_time}</span></div>
                            )}

                            <div className="small fw-bold mb-1"><i className="fa-regular fa-file-lines text-primary me-2"></i>Description</div>
                            <div className="text-muted small vw-clamp">
                                {formData.description.replace(/<[^>]+>/g, '').trim() || 'No description added yet.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

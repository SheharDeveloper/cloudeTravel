import { useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from '@/components/DatePicker';

export interface FormField {
    id: number;
    name: string;
    slug: string;
    required: boolean;
    input: string; // text | textarea | date | email | tel | select | heading | (a field type set on the field)
    options?: string[];
}

export interface FormSection {
    id: number;
    name: string;
    step: 1 | 2;
    fields: FormField[];
}

export interface ApplicationFormData {
    sections: FormSection[];
    answers: Record<string, string>;
    status: 'draft' | 'submitted' | null;
    submitted_at: string | null;
    updated_at: string | null;
    visa_configured: boolean;
}

// Four fields to a row on wide screens, two on tablets, one on phones
const FIELD_COL = 'col-12 col-md-6 col-xl-3';

const STEPS = [
    { step: 1, label: 'Personal Info' },
    { step: 2, label: 'Travel Details' },
    { step: 3, label: 'Verify Application' },
] as const;

/** "1980-06-15" → "Jun 15, 1980", as the date picker shows it */
const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

/**
 * "Fill Application" as a three-step form: 1 Personal Info and 2 Travel
 * Details show one section at a time (Next goes to the next section, then
 * the next step); 3 Verify Application shows everything to check before
 * submitting. Moving on saves a draft quietly, so nothing is lost.
 */
export default function ApplicationFormTab({ applicationUid, form, canEdit = true, canSend = false, sent = null }: {
    applicationUid: string;
    form: ApplicationFormData;
    // false: the review only
    canEdit?: boolean;
    // An agency's own application, not yet sent (or changed since): "Send / Resend to Admin" after submitting
    canSend?: boolean;
    // updated_at: the agency changed the application after sending it, so it has to be resent
    sent?: { at: string; agency: string | null; updated_at?: string | null } | null;
}) {
    const resend = !!sent;
    // "Send to Admin": confirm, then hand the application to the superadmin
    const [confirmSend, setConfirmSend] = useState(false);
    const [sending, setSending] = useState(false);
    const sendToAdmin = () => {
        setSending(true);
        router.post(`/admin/visa-applications/${applicationUid}/send-to-admin`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setSending(false);
                setConfirmSend(false);
            },
        });
    };
    const errors = usePage().props.errors as Record<string, string>;
    // Messages shown under fields when Next / Submit finds them empty
    const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
    const [answers, setAnswers] = useState<Record<string, string>>(() => ({ ...form.answers }));
    const [saving, setSaving] = useState<'draft' | 'submit' | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    // Every stop in order: each section of step 1, each of step 2, then the review
    const stops = useMemo(() => {
        const ordered = [...form.sections].sort((a, b) => a.step - b.step);
        return [
            ...ordered.map((section) => ({ step: section.step as number, section })),
            { step: 3, section: null as FormSection | null },
        ];
    }, [form.sections]);
    // A submitted form opens on its review (Verify Application); a new or draft one at the start
    const reviewIndex = stops.length - 1;
    const [position, setPosition] = useState(() => (form.status === 'submitted' || !canEdit ? reviewIndex : 0));
    // Set by "Edit" on the review: Next saves that one section and returns to the review
    const [editingFromReview, setEditingFromReview] = useState(false);
    const current = stops[position];
    const next = editingFromReview ? stops[reviewIndex] : stops[position + 1];

    const fieldsOf = (section: FormSection) => section.fields.filter((f) => f.input !== 'heading');
    const filled = (f: FormField) =>
        f.input === 'children' ? childrenComplete(answers[f.id])
            : f.input === 'checkbox' ? parseList(answers[f.id]).length > 0
                : (answers[f.id] ?? '').trim() !== '';
    const allFields = form.sections.flatMap(fieldsOf);
    const required = allFields.filter((f) => f.required);

    const goTo = (index: number) => {
        setPosition(index);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const persist = (submit: boolean, quiet: boolean, onSuccess?: () => void) => {
        if (!quiet) setSaving(submit ? 'submit' : 'draft');
        router.put(
            `/admin/visa-applications/${applicationUid}/form`,
            { answers, submit, quiet },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess,
                onError: (errs) => {
                    // The messages show under their fields: open the first section with one
                    const fieldId = Number(Object.keys(errs)[0]?.split('.')[1]);
                    const index = stops.findIndex((s) => s.section?.fields.some((f) => f.id === fieldId));
                    if (index !== -1) goTo(index);
                },
                onFinish: () => setSaving(null),
            },
        );
    };

    // Marks every empty required field among these with a message under it (and a
    // "Yes" to children with an unnamed child, required or not); returns them
    const flagMissing = (fields: FormField[]) => {
        const missing = fields.filter((f) =>
            f.input === 'children'
                ? (f.required && !filled(f)) || parseChildren(answers[f.id]).has === 'yes' && !filled(f)
                : f.required && !filled(f),
        );
        setFieldErrors((prev) => ({
            ...prev,
            ...Object.fromEntries(missing.map((f) => [
                f.id,
                f.input === 'children' && parseChildren(answers[f.id]).has === 'yes'
                    ? 'Enter the name of each child, or choose No.'
                    : `${f.name} is required.`,
            ])),
        }));
        return missing;
    };

    const goNext = () => {
        if (current.section) {
            const missing = flagMissing(fieldsOf(current.section));
            if (missing.length) {
                document.getElementById(`field-${missing[0].id}`)?.focus();
                return;
            }
        }
        persist(false, true);
        if (editingFromReview) {
            setEditingFromReview(false);
            goTo(reviewIndex);
        } else {
            goTo(position + 1);
        }
    };

    const submit = () => {
        const missing = flagMissing(allFields);
        if (missing.length) {
            // Open the first section with an empty required field
            const index = stops.findIndex((s) => s.section?.fields.some((f) => f.id === missing[0].id));
            if (index !== -1) goTo(index);
            return;
        }
        persist(true, false);
    };

    if (!form.visa_configured || form.sections.length === 0) {
        return (
            <div className="card">
                <div className="card-header"><h6 className="card-title mb-0">Fill Application</h6></div>
                <div className="card-body">
                    <div className="text-center py-5">
                        <i className="fas fa-file-signature" style={{ fontSize: '48px', color: '#ccc' }}></i>
                        <p className="text-muted mt-3 mb-0">No application fields are set up for this visa yet.</p>
                        <small className="text-muted">They are chosen on the visa's page under Visas → Assign Field.</small>
                    </div>
                </div>
            </div>
        );
    }

    // Where we are within the current step ("Section 2 of 6")
    const stepStops = stops.filter((s) => s.step === current.step && s.section);
    const indexInStep = stepStops.findIndex((s) => s.section?.id === current.section?.id);

    return (
        <div ref={topRef} style={{ scrollMarginTop: 90 }}>
            <style>{STYLES}</style>

            {sent && (
                <div className={`alert ${sent.updated_at ? 'alert-warning' : 'alert-info'} d-flex align-items-center gap-2 mb-4`}>
                    <i className={`fa ${sent.updated_at ? 'fa-exclamation-triangle' : 'fa-paper-plane'}`}></i>
                    <span>
                        Sent to the admin on <strong>{formatDateTime(sent.at)}</strong>
                        {sent.agency && <> by <strong>{sent.agency}</strong></>}.
                        {sent.updated_at && (
                            canSend
                                ? <> You updated it on <strong>{formatDateTime(sent.updated_at)}</strong> — resend it to the admin.</>
                                : <> The agency updated it on <strong>{formatDateTime(sent.updated_at)}</strong> and has not resent it yet.</>
                        )}
                    </span>
                </div>
            )}

            {/* Status + stepper */}
            <div className="card mb-4" style={{ height: 'auto' }}>
                <div className="card-body" style={{ padding: '18px 20px' }}>
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div className="af-stepper">
                            {STEPS.map(({ step, label }, i) => {
                                const firstStop = stops.findIndex((s) => s.step === step);
                                const state = current.step === step ? 'active' : current.step > step ? 'done' : '';
                                return (
                                    <div key={step} className="af-step-wrap">
                                        {i > 0 && <span className={`af-line ${current.step >= step ? 'done' : ''}`} />}
                                        <button
                                            type="button"
                                            className={`af-step ${state}`}
                                            onClick={() => {
                                                if (firstStop === -1) return;
                                                // Moving with the stepper goes back to the normal order
                                                setEditingFromReview(false);
                                                goTo(firstStop);
                                            }}
                                            disabled={firstStop === -1 || !canEdit}
                                        >
                                            <span className="af-circle">{state === 'done' ? <i className="fa fa-check"></i> : step}</span>
                                            <span className="af-label">{label}</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <span className={`badge ${form.status === 'submitted' ? 'bg-success' : form.status === 'draft' ? 'bg-warning' : 'bg-secondary'}`}>
                                {form.status === 'submitted' ? 'Submitted' : form.status === 'draft' ? 'Draft' : 'Not started'}
                            </span>
                            <div className="text-end">
                                <small className="text-muted d-block">Required</small>
                                <strong>{required.filter(filled).length} / {required.length}</strong>
                            </div>
                            <div className="text-end">
                                <small className="text-muted d-block">Filled</small>
                                <strong>{allFields.filter(filled).length} / {allFields.length}</strong>
                            </div>
                        </div>
                    </div>
                    <small className="text-muted d-block mt-2">
                        {form.status === 'submitted'
                            ? `Submitted on ${formatDateTime(form.submitted_at)}`
                            : form.status === 'draft'
                                ? `Draft · last saved ${formatDateTime(form.updated_at)}`
                                : 'Details already on record for this applicant have been filled in.'}
                    </small>
                </div>
            </div>

            {current.section ? (
                /* Steps 1 and 2: one section at a time */
                <div className="card mb-4" style={{ height: 'auto' }}>
                    <div className="card-header d-flex justify-content-between align-items-center" style={{ padding: '12px 20px' }}>
                        <div>
                            <h6 className="card-title mb-0">{current.section.name}</h6>
                            <small className="text-muted">
                                {STEPS[current.step - 1].label} · Section {indexInStep + 1} of {stepStops.length}
                            </small>
                        </div>
                        <span className="badge bg-primary">
                            {fieldsOf(current.section).filter(filled).length} / {fieldsOf(current.section).length}
                        </span>
                    </div>
                    <div className="card-body" style={{ padding: '18px 20px' }}>
                        <div className="row">
                            {current.section.fields.map((field) => (
                                <FieldInput
                                    key={field.id}
                                    applicationUid={applicationUid}
                                    field={field}
                                    value={answers[field.id] ?? ''}
                                    error={fieldErrors[field.id] ?? errors[`answers.${field.id}`]}
                                    onChange={(value) => {
                                        setAnswers((prev) => ({ ...prev, [field.id]: value }));
                                        // Typing clears that field's message
                                        if (fieldErrors[field.id]) {
                                            setFieldErrors(({ [field.id]: _cleared, ...rest }) => rest);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ padding: '14px 20px' }}>
                        <div className="d-flex gap-2">
                            {editingFromReview ? (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => { setEditingFromReview(false); goTo(reviewIndex); }}
                                >
                                    <i className="fa fa-arrow-left me-2"></i>Back to Verify
                                </button>
                            ) : position > 0 && (
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => goTo(position - 1)}>
                                    <i className="fa fa-arrow-left me-2"></i>Back
                                </button>
                            )}
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => persist(false, false)} disabled={saving !== null}>
                                <i className="fa fa-save me-2"></i>{saving === 'draft' ? 'Saving…' : 'Save Draft'}
                            </button>
                        </div>
                        <button type="button" className="af-next" onClick={goNext}>
                            Next: {next?.section ? next.section.name : 'Verify Application'} <i className="fa fa-arrow-right ms-2"></i>
                        </button>
                    </div>
                </div>
            ) : (
                /* Step 3: review everything */
                <>
                    {stops.filter((s) => s.section).map(({ section }) => (
                        <div key={section!.id} className="card mb-4" style={{ height: 'auto' }}>
                            <div className="card-header d-flex justify-content-between align-items-center" style={{ padding: '12px 20px' }}>
                                <h6 className="card-title mb-0">{section!.name}</h6>
                                {canEdit && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => {
                                            setEditingFromReview(true);
                                            goTo(stops.findIndex((s) => s.section?.id === section!.id));
                                        }}
                                    >
                                        <i className="fa fa-edit me-2"></i>Edit
                                    </button>
                                )}
                            </div>
                            <div className="card-body" style={{ padding: '18px 20px' }}>
                                <div className="row">
                                    {section!.fields.map((field) =>
                                        field.input === 'heading' ? (
                                            <div key={field.id} className="col-12 mb-2 mt-1">
                                                <h6 className="text-primary border-bottom pb-2 mb-0">{field.name.replace(/\s*section$/i, '')}</h6>
                                            </div>
                                        ) : (
                                            <div key={field.id} className={`${field.input === 'children' ? 'col-12' : FIELD_COL} mb-3`}>
                                                <label className="text-muted small">
                                                    {field.input === 'children' ? 'Children' : field.name}
                                                    {field.required && <span className="text-danger"> *</span>}
                                                </label>
                                                <div className={`fw-semibold mb-0 ${filled(field) ? '' : 'text-muted'}`} style={{ whiteSpace: 'pre-line' }}>
                                                    {field.input === 'children' && parseChildren(answers[field.id]).has
                                                        ? <ChildrenSummary value={answers[field.id]} />
                                                        : filled(field)
                                                            ? field.input === 'date' ? formatDate(answers[field.id])
                                                                : field.input === 'checkbox' ? parseList(answers[field.id]).join(', ')
                                                                    : field.input === 'file' ? <FileLink applicationUid={applicationUid} value={answers[field.id]} />
                                                                        : answers[field.id]
                                                            : (field.required ? <span className="text-danger">Required — not filled</span> : 'N/A')}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {canEdit && (
                        <div className="card mb-4" style={{ height: 'auto' }}>
                            <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ padding: '14px 20px' }}>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => goTo(position - 1)}>
                                        <i className="fa fa-arrow-left me-2"></i>Back
                                    </button>
                                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => persist(false, false)} disabled={saving !== null}>
                                        <i className="fa fa-save me-2"></i>{saving === 'draft' ? 'Saving…' : 'Save Draft'}
                                    </button>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-primary btn-sm" onClick={submit} disabled={saving !== null || sending}>
                                        <i className="fa fa-paper-plane me-2"></i>
                                        {saving === 'submit' ? 'Submitting…' : form.status === 'submitted' ? 'Update Submission' : 'Submit Application'}
                                    </button>
                                    {/* After submitting, the agency hands the application to the admin (again, after changing it) */}
                                    {canSend && form.status === 'submitted' && (
                                        <button type="button" className="btn btn-success btn-sm" onClick={() => setConfirmSend(true)} disabled={saving !== null || sending}>
                                            <i className="fa fa-share-square me-2"></i>{sending ? 'Sending…' : resend ? 'Resend to Admin' : 'Send to Admin'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {confirmSend && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true" onClick={() => setConfirmSend(false)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{resend ? 'Resend to Admin' : 'Send to Admin'}</h5>
                                <button type="button" className="btn-close" onClick={() => setConfirmSend(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-2">
                                    {resend
                                        ? 'Are you sure you want to resend the updated application to the admin?'
                                        : 'Are you sure you want to send this application to the admin?'}
                                </p>
                                <small className="text-muted">
                                    <i className="fa fa-info-circle me-1"></i>
                                    If you change the application after sending it, it has to be resent.
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setConfirmSend(false)}>Cancel</button>
                                <button type="button" className="btn btn-success" onClick={sendToAdmin} disabled={sending}>
                                    <i className="fa fa-share-square me-2"></i>{sending ? 'Sending…' : resend ? 'Yes, Resend' : 'Yes, Send'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FieldInput({ applicationUid, field, value, error, onChange }: { applicationUid: string; field: FormField; value: string; error?: string; onChange: (value: string) => void }) {
    // "Father Section", "Mother Section"…: a sub-heading inside the card
    if (field.input === 'heading') {
        return (
            <div className="col-12 mb-3 mt-1">
                <h6 className="text-primary border-bottom pb-2 mb-0">{field.name.replace(/\s*section$/i, '')}</h6>
            </div>
        );
    }

    // "Children Section": Do you have a child? Yes/No, then one entry per child
    if (field.input === 'children') {
        return <ChildrenInput field={field} value={value} error={error} onChange={onChange} />;
    }

    const id = `field-${field.id}`;
    const className = `form-control ${error ? 'is-invalid' : ''}`;

    return (
        <div className={`${FIELD_COL} mb-3`}>
            <label htmlFor={id} className="text-muted small mb-1">
                {field.name}
                {field.required && <span className="text-danger"> *</span>}
            </label>
            {field.input === 'date' ? (
                // Same date picker as Staff → Create; birth dates can't be in the future
                <DatePicker
                    value={value}
                    onChange={onChange}
                    maxDate={/birth|dob/i.test(field.name) ? new Date().toISOString().split('T')[0] : undefined}
                    autoSelect={true}
                    inputStyle={error ? { borderColor: '#dc3545' } : undefined}
                />
            ) : field.input === 'textarea' ? (
                // One line tall like the other inputs, so rows line up; it can be dragged taller
                <textarea id={id} className={className} rows={1} value={value} onChange={(e) => onChange(e.target.value)} />
            ) : field.input === 'radio' ? (
                <div className="d-flex flex-wrap gap-3 pt-1">
                    {field.options?.map((option) => (
                        <div key={option} className="form-check mb-0">
                            <input
                                className={`form-check-input ${error ? 'is-invalid' : ''}`}
                                type="radio"
                                id={`${id}-${option}`}
                                name={id}
                                checked={value === option}
                                onChange={() => onChange(option)}
                            />
                            <label className="form-check-label" htmlFor={`${id}-${option}`}>{option}</label>
                        </div>
                    ))}
                </div>
            ) : field.input === 'checkbox' ? (
                <div className="d-flex flex-wrap gap-3 pt-1">
                    {field.options?.map((option) => {
                        const ticked = parseList(value);
                        return (
                            <div key={option} className="form-check mb-0">
                                <input
                                    className={`form-check-input ${error ? 'is-invalid' : ''}`}
                                    type="checkbox"
                                    id={`${id}-${option}`}
                                    checked={ticked.includes(option)}
                                    onChange={(e) => {
                                        const next = e.target.checked ? [...ticked, option] : ticked.filter((o) => o !== option);
                                        onChange(next.length ? JSON.stringify(next) : '');
                                    }}
                                />
                                <label className="form-check-label" htmlFor={`${id}-${option}`}>{option}</label>
                            </div>
                        );
                    })}
                </div>
            ) : field.input === 'file' ? (
                <FileInput applicationUid={applicationUid} id={id} value={value} invalid={!!error} onChange={onChange} />
            ) : field.input === 'select' ? (
                <select id={id} className={`form-select ${error ? 'is-invalid' : ''}`} value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">Select</option>
                    {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    {value && !field.options?.includes(value) && <option value={value}>{value}</option>}
                </select>
            ) : (
                <input
                    id={id}
                    type={['email', 'tel', 'number'].includes(field.input) ? field.input : 'text'}
                    className={className}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    );
}

// ─── Checkboxes and files ─────────────────────────────────────────────────────

/** Checkbox answers are a JSON list of the ticked options */
function parseList(value: string | undefined): string[] {
    try {
        const list = JSON.parse(value || '[]');
        return Array.isArray(list) ? list.map(String) : [];
    } catch {
        return [];
    }
}

/** File answers are JSON {path, name}, the path being one uploaded for this application */
function parseFile(value: string | undefined): { path: string; name: string } | null {
    try {
        const data = JSON.parse(value || '');
        return data && typeof data.path === 'string' ? { path: data.path, name: String(data.name || 'File') } : null;
    } catch {
        return null;
    }
}

function FileLink({ applicationUid, value }: { applicationUid: string; value: string }) {
    const file = parseFile(value);
    if (!file) return <>N/A</>;
    const href = `/admin/visa-applications/${applicationUid}/form/file?path=${encodeURIComponent(file.path)}&name=${encodeURIComponent(file.name)}`;
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <i className="fa fa-paperclip me-1"></i>{file.name}
        </a>
    );
}

function FileInput({ applicationUid, id, value, invalid, onChange }: {
    applicationUid: string; id: string; value: string; invalid: boolean; onChange: (value: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const file = parseFile(value);

    const upload = async (picked: File | undefined) => {
        if (!picked) return;
        setUploading(true);
        setUploadError(null);
        const body = new FormData();
        body.append('file', picked);
        try {
            const response = await axios.post(`/admin/visa-applications/${applicationUid}/form/files`, body);
            onChange(response.data.value);
        } catch (error: any) {
            setUploadError(error?.response?.data?.errors?.file?.[0] ?? 'The file could not be uploaded.');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div>
            {file ? (
                <div className={`d-flex align-items-center justify-content-between gap-2 form-control ${invalid ? 'is-invalid' : ''}`} style={{ minHeight: 42 }}>
                    <span className="text-truncate"><FileLink applicationUid={applicationUid} value={value} /></span>
                    <span className="d-flex gap-2 flex-shrink-0">
                        <button type="button" className="btn btn-link btn-sm p-0" onClick={() => inputRef.current?.click()} disabled={uploading}>Replace</button>
                        <button type="button" className="btn btn-link btn-sm p-0 text-danger" onClick={() => onChange('')}>Remove</button>
                    </span>
                </div>
            ) : (
                <button
                    type="button"
                    id={id}
                    className={`form-control text-start text-muted ${invalid ? 'is-invalid' : ''}`}
                    style={{ minHeight: 42 }}
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                >
                    <i className="fa fa-upload me-2"></i>{uploading ? 'Uploading…' : 'Choose a file (PDF, image or Word, max 10 MB)'}
                </button>
            )}
            <input
                ref={inputRef}
                type="file"
                className="d-none"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={(e) => upload(e.target.files?.[0])}
            />
            {uploadError && <div className="invalid-feedback d-block">{uploadError}</div>}
        </div>
    );
}

// ─── Children ("Do you have a child?") ────────────────────────────────────────

interface Child { name: string; dob: string; nationality: string; address: string }
interface ChildrenAnswer { has: '' | 'yes' | 'no'; children: Child[] }

const EMPTY_CHILD: Child = { name: '', dob: '', nationality: '', address: '' };

/** The saved answer is JSON: {"has": "yes"|"no", "children": [...]} */
function parseChildren(value: string | undefined): ChildrenAnswer {
    try {
        const data = JSON.parse(value || '');
        if (data && (data.has === 'yes' || data.has === 'no')) {
            return { has: data.has, children: Array.isArray(data.children) ? data.children.map((c: Partial<Child>) => ({ ...EMPTY_CHILD, ...c })) : [] };
        }
    } catch {
        // not answered yet
    }
    return { has: '', children: [] };
}

/** Answered: "No", or "Yes" with at least one child and every child named */
function childrenComplete(value: string | undefined): boolean {
    const { has, children } = parseChildren(value);
    return has === 'no' || (has === 'yes' && children.length > 0 && children.every((c) => c.name.trim() !== ''));
}

function ChildrenInput({ field, value, error, onChange }: { field: FormField; value: string; error?: string; onChange: (value: string) => void }) {
    const data = parseChildren(value);
    const save = (next: ChildrenAnswer) => onChange(JSON.stringify(next));

    const choose = (has: 'yes' | 'no') =>
        save({ has, children: has === 'yes' ? (data.children.length ? data.children : [{ ...EMPTY_CHILD }]) : [] });
    const update = (index: number, changes: Partial<Child>) =>
        save({ ...data, children: data.children.map((c, i) => (i === index ? { ...c, ...changes } : c)) });
    const remove = (index: number) => {
        const children = data.children.filter((_, i) => i !== index);
        // Removing the last child means no children
        save(children.length ? { ...data, children } : { has: 'no', children: [] });
    };

    return (
        <div className="col-12 mb-3">
            <label className="d-block fw-semibold mb-2" style={{ fontSize: 14 }}>
                Do you have a child?{field.required && <span className="text-danger"> *</span>}
            </label>
            <div className="d-flex gap-4 mb-3">
                {(['yes', 'no'] as const).map((option) => (
                    <div key={option} className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id={`field-${field.id}-${option}`}
                            name={`field-${field.id}`}
                            checked={data.has === option}
                            onChange={() => choose(option)}
                        />
                        <label className="form-check-label" htmlFor={`field-${field.id}-${option}`}>
                            {option === 'yes' ? 'Yes' : 'No'}
                        </label>
                    </div>
                ))}
            </div>

            {data.has === 'yes' && (
                <>
                    {data.children.map((child, index) => (
                        <div key={index} className="af-child">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted">Child {index + 1}</small>
                                <button type="button" className="af-remove" onClick={() => remove(index)}>Remove</button>
                            </div>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="small fw-semibold mb-1">Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error && !child.name.trim() ? 'is-invalid' : ''}`}
                                        value={child.name}
                                        onChange={(e) => update(index, { name: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="small fw-semibold mb-1">Date of Birth</label>
                                    <DatePicker
                                        value={child.dob}
                                        onChange={(dob) => update(index, { dob })}
                                        maxDate={new Date().toISOString().split('T')[0]}
                                        autoSelect={true}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="small fw-semibold mb-1">Nationality</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={child.nationality}
                                        onChange={(e) => update(index, { nationality: e.target.value })}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="small fw-semibold mb-1">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={child.address}
                                        onChange={(e) => update(index, { address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="af-add" onClick={() => save({ ...data, children: [...data.children, { ...EMPTY_CHILD }] })}>
                        Add More
                    </button>
                </>
            )}

            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    );
}

/** The children answer in the Verify step */
function ChildrenSummary({ value }: { value: string }) {
    const { has, children } = parseChildren(value);
    if (has !== 'yes') return <>No</>;

    return (
        <div className="table-responsive mt-1">
            <table className="table table-sm mb-0">
                <thead>
                    <tr><th>#</th><th>Name</th><th>Date of Birth</th><th>Nationality</th><th>Address</th></tr>
                </thead>
                <tbody>
                    {children.map((c, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{c.name || <span className="text-danger">Not filled</span>}</td>
                            <td>{c.dob ? formatDate(c.dob) : 'N/A'}</td>
                            <td>{c.nationality || 'N/A'}</td>
                            <td>{c.address || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const STYLES = `
.af-child { margin-bottom: 14px; padding: 14px 18px; border: 1px solid #bae6fd; border-radius: 6px; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .06); }
.af-remove { padding: 2px 10px; border: 1px solid #ef4444; border-radius: 4px; background: #fff; color: #ef4444; font-size: 12px; }
.af-remove:hover { background: #fef2f2; }
.af-add { padding: 7px 18px; border: 1.5px solid #38bdf8; border-radius: 6px; background: #bae6fd; color: #0f172a; font-size: 14px; font-weight: 700; }
.af-add:hover { background: #7dd3fc; }
.af-stepper { display: flex; align-items: flex-start; }
.af-step-wrap { display: flex; align-items: flex-start; }
.af-step { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 96px; padding: 0; border: 0; background: none; }
.af-step:disabled { opacity: .5; }
.af-circle { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: #e2e8f0; color: #475569; font-weight: 700; font-size: 15px; transition: background .2s; }
.af-label { font-size: 13px; color: #475569; white-space: nowrap; }
.af-step.active .af-circle, .af-step.done .af-circle { background: #3b82f6; color: #fff; }
.af-step.active .af-label { color: #3b82f6; font-weight: 600; }
.af-line { width: 56px; height: 2px; margin-top: 16px; background: #d1d5db; }
.af-line.done { background: #3b82f6; }
.af-next { display: inline-flex; align-items: center; padding: 7px 16px; border: 1.5px solid #38bdf8; border-radius: 6px; background: #bae6fd; color: #0f172a; font-size: 14px; font-weight: 700; }
.af-next:hover { background: #7dd3fc; }
@media (max-width: 575px) { .af-step { min-width: 76px; } .af-line { width: 24px; } .af-label { font-size: 11px; } }
`;

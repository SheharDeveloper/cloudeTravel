import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export interface ConfigField {
    id: number;
    field_name: string;
    field_type: string;
    options: string[];
    // Yes / No: the follow-up section the chosen answer opens (e.g. "Reason")
    follow_up?: FollowUp | null;
    // Declaration: the text the applicant accepts with a tick
    declaration?: string | null;
    // The field's own section; it's "moved" for this visa when listed elsewhere
    home_section_id: number;
    enabled: boolean;
    required: boolean;
}

// Types whose answers come from a list of options
const CHOICE_TYPES = ['select', 'radio', 'checkbox'];

export interface FollowUpField {
    name: string;
    type: string;
    required: boolean;
}

export interface FollowUp {
    show_when: 'Yes' | 'No';
    fields: FollowUpField[];
}

/** The Add / Edit field popup: name, type and (for choice types) options. */
type FieldDraft = { mode: 'add'; sectionId: number } | { mode: 'edit'; field: ConfigField };

export interface ConfigSection {
    id: number;
    section_name: string;
    enabled: boolean;
    fields: ConfigField[];
}

interface Props {
    visaUid: string;
    visaName: string;
    countryLabel: string;
    initial: ConfigSection[];
    fieldTypes: Record<string, string>;
    followUpTypes: Record<string, string>;
}

type DragItem = { kind: 'section'; id: number } | { kind: 'field'; sectionId: number; id: number };

const moveBefore = <T extends { id: number }>(list: T[], dragId: number, targetId: number): T[] => {
    if (dragId === targetId) return list;
    const dragged = list.find((item) => item.id === dragId);
    if (!dragged) return list;
    const rest = list.filter((item) => item.id !== dragId);
    const at = rest.findIndex((item) => item.id === targetId);
    if (at < 0) return list;
    rest.splice(at, 0, dragged);
    return rest;
};

export default function VisaFieldConfig({ visaUid, visaName, countryLabel, initial, fieldTypes, followUpTypes }: Props) {
    const [sections, setSections] = useState<ConfigSection[]>(initial);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
    const dragging = useRef<DragItem | null>(null);
    const [overKey, setOverKey] = useState<string | null>(null);

    const term = search.trim().toLowerCase();
    const searching = term !== '';

    const update = (next: ConfigSection[]) => {
        setSections(next);
        setDirty(true);
        setMessage(null);
    };

    const patchSection = (sectionId: number, patch: (section: ConfigSection) => ConfigSection) =>
        update(sections.map((section) => (section.id === sectionId ? patch(section) : section)));

    const toggleExpanded = (sectionId: number) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });

    const setAll = (enabled: boolean) =>
        update(
            sections.map((section) => ({
                ...section,
                enabled,
                fields: section.fields.map((field) => ({ ...field, enabled, required: enabled ? field.required : false })),
            })),
        );

    const toggleField = (sectionId: number, fieldId: number, enabled: boolean) =>
        patchSection(sectionId, (section) => ({
            ...section,
            // Choosing a field switches its section on; otherwise it would never be saved.
            enabled: enabled ? true : section.enabled,
            fields: section.fields.map((field) =>
                field.id === fieldId ? { ...field, enabled, required: enabled ? field.required : false } : field,
            ),
        }));

    const setSectionFields = (sectionId: number, enabled: boolean) =>
        patchSection(sectionId, (section) => ({
            ...section,
            enabled: enabled ? true : section.enabled,
            fields: section.fields.map((field) => ({ ...field, enabled, required: enabled ? field.required : false })),
        }));

    // ---- move a field to another section (for this visa only) ----
    const moveField = (fromId: number, fieldId: number, toId: number) => {
        if (fromId === toId) return;
        const field = sections.find((s) => s.id === fromId)?.fields.find((f) => f.id === fieldId);
        if (!field) return;
        update(
            sections.map((section) => {
                if (section.id === fromId) return { ...section, fields: section.fields.filter((f) => f.id !== fieldId) };
                if (section.id === toId) {
                    // An enabled field switches its new section on, so it's saved there
                    return { ...section, enabled: field.enabled ? true : section.enabled, fields: [...section.fields, field] };
                }
                return section;
            }),
        );
        setExpanded((prev) => new Set(prev).add(toId));
    };

    // ---- add / edit a field (saved straight away; Save keeps it on this visa) ----
    const [draft, setDraft] = useState<FieldDraft | null>(null);

    const onFieldSaved = (saved: ConfigField) => {
        if (draft?.mode === 'add') {
            // New: switched on at the end of its section (Save keeps it on)
            update(sections.map((section) =>
                section.id === draft.sectionId
                    ? { ...section, enabled: true, fields: [...section.fields, saved] }
                    : section,
            ));
            setExpanded((prev) => new Set(prev).add(draft.sectionId));
            setMessage({ type: 'success', text: `“${saved.field_name}” added. Click Save to keep it on this visa.` });
        } else {
            // Edited: same field, wherever it is listed; keep this visa's choices
            setSections((prev) => prev.map((section) => ({
                ...section,
                fields: section.fields.map((f) =>
                    f.id === saved.id ? { ...f, field_name: saved.field_name, field_type: saved.field_type, options: saved.options, follow_up: saved.follow_up, declaration: saved.declaration } : f,
                ),
            })));
            setMessage({ type: 'success', text: `“${saved.field_name}” updated.` });
        }
        setDraft(null);
    };

    const sectionName = (id: number) => sections.find((s) => s.id === id)?.section_name ?? '';

    // ---- drag and drop (handle-initiated, native HTML5) ----
    const startDrag = (item: DragItem) => (e: React.DragEvent) => {
        dragging.current = item;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(item.id));
        // Show the whole row (the handle's parent) as the drag image.
        const row = (e.currentTarget as HTMLElement).parentElement;
        if (row) e.dataTransfer.setDragImage(row, 16, 16);
    };

    const endDrag = () => {
        dragging.current = null;
        setOverKey(null);
    };

    const dragOverSection = (sectionId: number) => (e: React.DragEvent) => {
        if (dragging.current?.kind !== 'section') return;
        e.preventDefault();
        setOverKey(`s${sectionId}`);
    };

    const dropOnSection = (sectionId: number) => (e: React.DragEvent) => {
        const item = dragging.current;
        if (item?.kind !== 'section') return;
        e.preventDefault();
        update(moveBefore(sections, item.id, sectionId));
        endDrag();
    };

    const dragOverField = (sectionId: number, fieldId: number) => (e: React.DragEvent) => {
        const item = dragging.current;
        if (item?.kind !== 'field' || item.sectionId !== sectionId) return;
        e.preventDefault();
        setOverKey(`f${fieldId}`);
    };

    const dropOnField = (sectionId: number, fieldId: number) => (e: React.DragEvent) => {
        const item = dragging.current;
        if (item?.kind !== 'field' || item.sectionId !== sectionId) return;
        e.preventDefault();
        patchSection(sectionId, (section) => ({ ...section, fields: moveBefore(section.fields, item.id, fieldId) }));
        endDrag();
    };

    // ---- search ----
    const visibleSections = useMemo(() => {
        if (!searching) return sections.map((section) => ({ section, fields: section.fields }));
        return sections
            .map((section) => ({
                section,
                fields: section.section_name.toLowerCase().includes(term)
                    ? section.fields
                    : section.fields.filter((field) => field.field_name.toLowerCase().includes(term)),
            }))
            .filter(({ fields }) => fields.length > 0);
    }, [sections, term, searching]);

    const enabledSections = sections.filter((section) => section.enabled).length;
    const enabledFields = sections.reduce(
        (sum, section) => sum + (section.enabled ? section.fields.filter((field) => field.enabled).length : 0),
        0,
    );

    const save = () => {
        const payload = sections
            .filter((section) => section.enabled)
            .map((section) => ({
                visa_section_id: section.id,
                fields: section.fields
                    .filter((field) => field.enabled)
                    .map((field) => ({ visa_field_id: field.id, is_required: field.required })),
            }));

        setSaving(true);
        router.put(
            `/admin/visa-services/${visaUid}/fields`,
            { sections: payload },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setDirty(false);
                    setMessage({ type: 'success', text: 'Field configuration saved.' });
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0];
                    setMessage({ type: 'danger', text: first || 'Could not save the field configuration.' });
                },
                onFinish: () => setSaving(false),
            },
        );
    };

    const dropTarget = (key: string) => (overKey === key ? { outline: '2px dashed #0d6efd', outlineOffset: -2 } : undefined);

    return (
        <div className="card h-auto">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                    <h6 className="card-title mb-1">Section Configuration</h6>
                    <div className="small text-muted">
                        <span className="me-3">Visa Name: <strong className="text-body">{visaName}</strong></span>
                        <span>Country: <strong className="text-body">{countryLabel}</strong></span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">{enabledSections} sections · {enabledFields} fields</small>
                    <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving || !dirty}>
                        <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'} me-2`}></i>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="card-body">
                {message && (
                    <div className={`alert alert-${message.type} py-2`} role="alert">
                        <i className={`fa ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                        {message.text}
                    </div>
                )}

                <div className="row g-2 mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search sections or fields…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 d-flex flex-wrap justify-content-md-end gap-2">
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setAll(true)}>
                            Select All
                        </button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setAll(false)}>
                            Clear All
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setExpanded(expanded.size > 0 ? new Set() : new Set(sections.map((s) => s.id)))}
                        >
                            {expanded.size > 0 ? 'Collapse All' : 'Expand All'}
                        </button>
                    </div>
                </div>

                {visibleSections.length === 0 && <p className="text-muted mb-0">Nothing matches “{search}”.</p>}

                <div className="d-flex flex-column gap-2">
                    {visibleSections.map(({ section, fields }) => {
                        const isOpen = searching || expanded.has(section.id);
                        const selected = section.fields.filter((field) => field.enabled).length;
                
                        return (
                            <div
                                key={section.id}
                                className="border rounded"
                                style={dropTarget(`s${section.id}`)}
                                onDragOver={dragOverSection(section.id)}
                                onDrop={dropOnSection(section.id)}
                            >
                                <div className="d-flex align-items-center gap-2 px-3 py-2 bg-light rounded-top">
                                    <span
                                        draggable={!searching}
                                        onDragStart={startDrag({ kind: 'section', id: section.id })}
                                        onDragEnd={endDrag}
                                        title={searching ? 'Clear the search to reorder' : 'Drag to reorder'}
                                        style={{ cursor: searching ? 'not-allowed' : 'grab', opacity: searching ? 0.4 : 1 }}
                                    >
                                        <i className="fa fa-grip-vertical text-muted"></i>
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="form-check-input mt-0"
                                        checked={section.enabled}
                                        onChange={(e) => patchSection(section.id, (s) => ({ ...s, enabled: e.target.checked }))}
                                        aria-label={`Enable ${section.section_name}`}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-link text-start text-decoration-none p-0 flex-grow-1 fw-semibold text-body"
                                        onClick={() => toggleExpanded(section.id)}
                                    >
                                        {section.section_name}
                                        <small className="text-muted fw-normal ms-2">
                                            {selected}/{section.fields.length} fields
                                        </small>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-link btn-sm p-0"
                                        onClick={() => toggleExpanded(section.id)}
                                        aria-label={isOpen ? 'Collapse' : 'Expand'}
                                    >
                                        <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                                    </button>
                                </div>

                                {isOpen && (
                                    <div className="p-3 border-top">
                                        <div className="d-flex gap-2 mb-2">
                                            <button type="button" className="btn btn-outline-secondary btn-sm py-0" onClick={() => setSectionFields(section.id, true)}>
                                                Select all fields
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary btn-sm py-0" onClick={() => setSectionFields(section.id, false)}>
                                                Clear
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm py-0 ms-auto"
                                                onClick={() => setDraft({ mode: 'add', sectionId: section.id })}
                                            >
                                                <i className="fa fa-plus me-1"></i>Add Field
                                            </button>
                                        </div>

                                        <ul className="list-unstyled mb-0">
                                            {fields.map((field) => {
                                                return (
                                                    <li
                                                        key={field.id}
                                                        className="d-flex align-items-center gap-2 py-1 px-2 rounded"
                                                        style={dropTarget(`f${field.id}`)}
                                                        onDragOver={dragOverField(section.id, field.id)}
                                                        onDrop={dropOnField(section.id, field.id)}
                                                    >
                                                        <span
                                                            draggable={!searching}
                                                            onDragStart={startDrag({ kind: 'field', sectionId: section.id, id: field.id })}
                                                            onDragEnd={endDrag}
                                                            title={searching ? 'Clear the search to reorder' : 'Drag to reorder'}
                                                            style={{ cursor: searching ? 'not-allowed' : 'grab', opacity: searching ? 0.4 : 1 }}
                                                        >
                                                            <i className="fa fa-grip-vertical text-muted"></i>
                                                        </span>
                                                        <label className="d-flex align-items-center gap-2 flex-grow-1 mb-0" style={{ cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input mt-0"
                                                                checked={field.enabled}
                                                                onChange={(e) => toggleField(section.id, field.id, e.target.checked)}
                                                            />
                                                            {field.field_name}
                                                            <span className="badge bg-light text-muted border fw-normal">
                                                                {fieldTypes[field.field_type] ?? field.field_type}
                                                                {CHOICE_TYPES.includes(field.field_type) && field.options.length > 0 && ` · ${field.options.length}`}
                                                            </span>
                                                            {field.follow_up && (
                                                                <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border fw-normal" title={`On "${field.follow_up.show_when}": ${field.follow_up.fields.map((f) => f.name).join(', ')}`}>
                                                                    {field.follow_up.show_when} → {field.follow_up.fields.length} more field{field.follow_up.fields.length === 1 ? '' : 's'}
                                                                </span>
                                                            )}
                                                            {field.home_section_id !== section.id && (
                                                                <span className="badge bg-info bg-opacity-10 text-info fw-normal" title="Moved for this visa only">
                                                                    from {sectionName(field.home_section_id)}
                                                                </span>
                                                            )}
                                                        </label>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ width: 230 }}
                                                            value={section.id}
                                                            onChange={(e) => moveField(section.id, field.id, Number(e.target.value))}
                                                            title="Move to another section (this visa only)"
                                                            aria-label={`Move ${field.field_name} to section`}
                                                        >
                                                            {sections.map((s) => (
                                                                <option key={s.id} value={s.id}>
                                                                    {s.id === section.id ? `✓ ${s.section_name}` : `→ ${s.section_name}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link btn-sm p-0 text-muted"
                                                            onClick={() => setDraft({ mode: 'edit', field })}
                                                            title="Edit name, type and options"
                                                            aria-label={`Edit ${field.field_name}`}
                                                        >
                                                            <i className="fa fa-pen"></i>
                                                        </button>
                                                        <label
                                                            className="d-flex align-items-center gap-1 mb-0 small text-muted"
                                                            style={{ cursor: field.enabled ? 'pointer' : 'not-allowed' }}
                                                        >
                                                            Required
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input mt-0"
                                                                checked={field.required}
                                                                disabled={!field.enabled}
                                                                onChange={(e) =>
                                                                    patchSection(section.id, (s) => ({
                                                                        ...s,
                                                                        fields: s.fields.map((f) => (f.id === field.id ? { ...f, required: e.target.checked } : f)),
                                                                    }))
                                                                }
                                                            />
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {draft && (
                <FieldEditor
                    visaUid={visaUid}
                    draft={draft}
                    sectionName={draft.mode === 'add' ? sectionName(draft.sectionId) : sectionName(draft.field.home_section_id)}
                    fieldTypes={fieldTypes}
                    followUpTypes={followUpTypes}
                    onClose={() => setDraft(null)}
                    onSaved={onFieldSaved}
                />
            )}
        </div>
    );
}

function FieldEditor({ visaUid, draft, sectionName, fieldTypes, followUpTypes, onClose, onSaved }: {
    visaUid: string;
    draft: FieldDraft;
    sectionName: string;
    fieldTypes: Record<string, string>;
    followUpTypes: Record<string, string>;
    onClose: () => void;
    onSaved: (field: ConfigField) => void;
}) {
    const editing = draft.mode === 'edit' ? draft.field : null;
    const [name, setName] = useState(editing?.field_name ?? '');
    const [type, setType] = useState(editing?.field_type ?? 'text');
    const [optionsText, setOptionsText] = useState((editing?.options ?? []).join('\n'));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const needsOptions = CHOICE_TYPES.includes(type);

    // Yes / No: "Ask for more details" opens a follow-up section on the chosen answer
    const [askMore, setAskMore] = useState(!!editing?.follow_up);
    const [showWhen, setShowWhen] = useState<'Yes' | 'No'>(editing?.follow_up?.show_when ?? 'Yes');
    const [followFields, setFollowFields] = useState<FollowUpField[]>(
        editing?.follow_up?.fields?.length ? editing.follow_up.fields : [{ name: 'Reason', type: 'textarea', required: true }],
    );
    // Declaration: what the applicant accepts
    const [declarationText, setDeclarationText] = useState(
        editing?.declaration ?? 'I hereby declare that the information given in this application is true and correct to the best of my knowledge.',
    );
    const patchFollow = (index: number, patch: Partial<FollowUpField>) =>
        setFollowFields((list) => list.map((f, i) => (i === index ? { ...f, ...patch } : f)));

    const save = async () => {
        setSaving(true);
        setErrors({});
        const body = {
            field_name: name.trim(),
            field_type: type,
            options: needsOptions ? optionsText.split('\n').map((o) => o.trim()).filter(Boolean) : [],
            follow_up: type === 'yesno' && askMore
                ? { show_when: showWhen, fields: followFields.map((f) => ({ ...f, name: f.name.trim() })) }
                : null,
            declaration_text: type === 'declaration' ? declarationText.trim() : null,
            ...(draft.mode === 'add' && { visa_section_id: draft.sectionId }),
        };
        try {
            const response = draft.mode === 'add'
                ? await axios.post(`/admin/visa-services/${visaUid}/fields/new`, body)
                : await axios.put(`/admin/visa-services/${visaUid}/fields/${draft.field.id}/definition`, body);
            onSaved(response.data.field);
        } catch (error: any) {
            const found = error?.response?.data?.errors as Record<string, string[]> | undefined;
            setErrors(found
                ? Object.fromEntries(Object.entries(found).map(([key, messages]) => [key.split('.')[0], messages[0]]))
                : { field_name: 'Could not save the field. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true" onClick={onClose}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{draft.mode === 'add' ? `Add Field to ${sectionName}` : 'Edit Field'}</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Field Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.field_name ? 'is-invalid' : ''}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Previous Name"
                                autoFocus
                            />
                            {errors.field_name && <div className="invalid-feedback d-block">{errors.field_name}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Field Type</label>
                            <select className={`form-select ${errors.field_type ? 'is-invalid' : ''}`} value={type} onChange={(e) => setType(e.target.value)}>
                                {Object.entries(fieldTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                            {errors.field_type && <div className="invalid-feedback d-block">{errors.field_type}</div>}
                        </div>
                        {needsOptions && (
                            <div className="mb-3">
                                <label className="form-label">Options <small className="text-muted">(one per line)</small></label>
                                <textarea
                                    className={`form-control ${errors.options ? 'is-invalid' : ''}`}
                                    rows={4}
                                    value={optionsText}
                                    onChange={(e) => setOptionsText(e.target.value)}
                                    placeholder={'Option 1\nOption 2'}
                                />
                                {errors.options && <div className="invalid-feedback d-block">{errors.options}</div>}
                            </div>
                        )}
                        {type === 'declaration' && (
                            <div className="mb-3">
                                <label className="form-label">Declaration text</label>
                                <textarea
                                    className={`form-control ${errors.declaration_text ? 'is-invalid' : ''}`}
                                    rows={4}
                                    maxLength={5000}
                                    value={declarationText}
                                    onChange={(e) => setDeclarationText(e.target.value)}
                                    placeholder="I hereby declare that…"
                                />
                                {errors.declaration_text && <div className="invalid-feedback d-block">{errors.declaration_text}</div>}
                                <small className="text-muted d-block mt-1">
                                    <i className="fa fa-info-circle me-1"></i>
                                    The applicant reads this and ticks "I accept". Mark the field Required so the form can't be submitted without it.
                                </small>
                            </div>
                        )}
                        {type === 'country' && (
                            <small className="text-muted d-block mb-3">
                                <i className="fa fa-globe me-1"></i>
                                The applicant picks from the country list (Countries), with flags.
                            </small>
                        )}
                        {type === 'yesno' && (
                            <div className="mb-3 border rounded p-3" style={{ background: '#f8f9fc' }}>
                                <div className="form-check form-switch mb-0">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="follow-up-switch"
                                        checked={askMore}
                                        onChange={(e) => setAskMore(e.target.checked)}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="follow-up-switch">Ask for more details (e.g. a reason)</label>
                                </div>
                                {askMore && (
                                    <>
                                        <div className="d-flex align-items-center gap-2 mt-3 mb-3 small">
                                            <span>Show these fields when the answer is</span>
                                            <select className="form-select form-select-sm" style={{ width: 110 }} value={showWhen} onChange={(e) => setShowWhen(e.target.value as 'Yes' | 'No')}>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="d-flex flex-column gap-2">
                                            {followFields.map((f, index) => (
                                                <div key={index} className="d-flex gap-2 align-items-center">
                                                    <input
                                                        type="text"
                                                        className={`form-control form-control-sm ${errors.follow_up && !f.name.trim() ? 'is-invalid' : ''}`}
                                                        placeholder="Field name, e.g. Reason"
                                                        value={f.name}
                                                        maxLength={255}
                                                        onChange={(e) => patchFollow(index, { name: e.target.value })}
                                                    />
                                                    <select className="form-select form-select-sm" style={{ width: 160, flexShrink: 0 }} value={f.type} onChange={(e) => patchFollow(index, { type: e.target.value })}>
                                                        {Object.entries(followUpTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                                    </select>
                                                    <label className="d-flex align-items-center gap-1 mb-0 small text-muted text-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input mt-0"
                                                            checked={f.required}
                                                            onChange={(e) => patchFollow(index, { required: e.target.checked })}
                                                        />
                                                        Required
                                                    </label>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => setFollowFields((list) => list.filter((_, i) => i !== index))}
                                                        disabled={followFields.length === 1}
                                                        title="Remove field"
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm px-0 mt-2"
                                            onClick={() => setFollowFields((list) => [...list, { name: '', type: 'text', required: false }])}
                                            disabled={followFields.length >= 20}
                                        >
                                            <i className="fa fa-plus me-1"></i>Add another field
                                        </button>
                                        {errors.follow_up && <div className="invalid-feedback d-block">{errors.follow_up}</div>}
                                    </>
                                )}
                            </div>
                        )}
                        {editing && (
                            <small className="text-muted d-block">
                                <i className="fa fa-info-circle me-1"></i>
                                Fields are shared: the new name and type apply to every visa that uses this field.
                            </small>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                            {saving ? 'Saving…' : draft.mode === 'add' ? 'Add Field' : 'Save Field'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

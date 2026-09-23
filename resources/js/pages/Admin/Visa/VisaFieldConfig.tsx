import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export interface ConfigField {
    id: number;
    field_name: string;
    enabled: boolean;
    required: boolean;
}

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

export default function VisaFieldConfig({ visaUid, visaName, countryLabel, initial }: Props) {
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
                                                        </label>
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
        </div>
    );
}

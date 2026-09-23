import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';

export interface VisaDocumentRow {
    id: number | null;
    name: string;
    description: string | null;
    is_required: boolean | number;
}

interface Row {
    key: number;
    id: number | null;
    name: string;
    description: string;
    is_required: boolean;
}

interface Props {
    visaUid: string;
    visaName: string;
    initial: VisaDocumentRow[];
}

export default function VisaDocumentConfig({ visaUid, visaName, initial }: Props) {
    const nextKey = useRef(0);
    const newKey = () => ++nextKey.current;

    const [rows, setRows] = useState<Row[]>(() =>
        initial.map((doc) => ({
            key: newKey(),
            id: doc.id,
            name: doc.name,
            description: doc.description ?? '',
            is_required: Boolean(doc.is_required),
        })),
    );
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
    const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
    const dragKey = useRef<number | null>(null);
    const [overKey, setOverKey] = useState<number | null>(null);

    const change = (next: Row[]) => {
        setRows(next);
        setDirty(true);
        setMessage(null);
        setRowErrors({});
    };

    const patch = (key: number, values: Partial<Row>) =>
        change(rows.map((row) => (row.key === key ? { ...row, ...values } : row)));

    const add = () =>
        change([...rows, { key: newKey(), id: null, name: '', description: '', is_required: true }]);

    const remove = (key: number) => change(rows.filter((row) => row.key !== key));

    const drop = (targetKey: number) => (e: React.DragEvent) => {
        const dragged = rows.find((row) => row.key === dragKey.current);
        if (!dragged || dragged.key === targetKey) return;
        e.preventDefault();
        const rest = rows.filter((row) => row.key !== dragged.key);
        rest.splice(rest.findIndex((row) => row.key === targetKey), 0, dragged);
        change(rest);
        dragKey.current = null;
        setOverKey(null);
    };

    const save = () => {
        const blank = rows.findIndex((row) => row.name.trim() === '');
        if (blank >= 0) {
            setRowErrors({ [rows[blank].key]: 'Enter a document name.' });
            setMessage({ type: 'danger', text: 'Every document needs a name.' });
            return;
        }

        setSaving(true);
        router.put(
            `/admin/visa-services/${visaUid}/documents`,
            {
                documents: rows.map((row) => ({
                    id: row.id,
                    name: row.name.trim(),
                    description: row.description.trim() || null,
                    is_required: row.is_required,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDirty(false);
                    setMessage({ type: 'success', text: 'Documents saved.' });
                },
                onError: (errors) => {
                    // Keys look like "documents.2.name"; attach each message to its row.
                    const perRow: Record<number, string> = {};
                    Object.entries(errors).forEach(([field, text]) => {
                        const index = Number(field.split('.')[1]);
                        if (!Number.isNaN(index) && rows[index]) perRow[rows[index].key] = text;
                    });
                    setRowErrors(perRow);
                    setMessage({ type: 'danger', text: Object.values(errors)[0] || 'Could not save the documents.' });
                },
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <div className="card h-auto">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                    <h6 className="card-title mb-1">Assign Document</h6>
                    <div className="small text-muted">
                        Documents required for <strong className="text-body">{visaName}</strong>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">
                        {rows.length} document{rows.length === 1 ? '' : 's'} · {rows.filter((r) => r.is_required).length} required
                    </small>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={add}>
                        <i className="fa fa-plus me-2"></i>Add
                    </button>
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

                {rows.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <i className="fa-solid fa-file-circle-plus" style={{ fontSize: 40, color: '#ccc' }}></i>
                        <p className="mt-3 mb-3">No documents assigned to this visa yet.</p>
                        <button type="button" className="btn btn-primary btn-sm" onClick={add}>
                            <i className="fa fa-plus me-2"></i>Add Document
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="d-none d-md-flex gap-2 px-2 pb-1 small text-muted fw-semibold">
                            <span style={{ width: 20 }}></span>
                            <span style={{ flex: 3 }}>Document Name</span>
                            <span style={{ flex: 3 }}>Description (optional)</span>
                            <span style={{ width: 90 }} className="text-center">Required</span>
                            <span style={{ width: 38 }}></span>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            {rows.map((row) => (
                                <div
                                    key={row.key}
                                    className="d-flex flex-wrap flex-md-nowrap align-items-start gap-2 border rounded p-2"
                                    style={overKey === row.key ? { outline: '2px dashed #0d6efd', outlineOffset: -2 } : undefined}
                                    onDragOver={(e) => {
                                        if (dragKey.current === null) return;
                                        e.preventDefault();
                                        setOverKey(row.key);
                                    }}
                                    onDrop={drop(row.key)}
                                >
                                    <span
                                        draggable
                                        onDragStart={(e) => {
                                            dragKey.current = row.key;
                                            e.dataTransfer.effectAllowed = 'move';
                                            e.dataTransfer.setData('text/plain', String(row.key));
                                            const parent = (e.currentTarget as HTMLElement).parentElement;
                                            if (parent) e.dataTransfer.setDragImage(parent, 16, 16);
                                        }}
                                        onDragEnd={() => {
                                            dragKey.current = null;
                                            setOverKey(null);
                                        }}
                                        title="Drag to reorder"
                                        className="pt-2"
                                        style={{ width: 20, cursor: 'grab' }}
                                    >
                                        <i className="fa fa-grip-vertical text-muted"></i>
                                    </span>

                                    <div style={{ flex: 3, minWidth: 180 }}>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${rowErrors[row.key] ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Passport copy"
                                            value={row.name}
                                            maxLength={255}
                                            onChange={(e) => patch(row.key, { name: e.target.value })}
                                        />
                                        {rowErrors[row.key] && <div className="invalid-feedback d-block">{rowErrors[row.key]}</div>}
                                    </div>

                                    <div style={{ flex: 3, minWidth: 180 }}>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="e.g. Valid for at least 6 months"
                                            value={row.description}
                                            maxLength={1000}
                                            onChange={(e) => patch(row.key, { description: e.target.value })}
                                        />
                                    </div>

                                    <label className="d-flex align-items-center justify-content-center gap-1 pt-1 mb-0" style={{ width: 90, cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input mt-0"
                                            checked={row.is_required}
                                            onChange={(e) => patch(row.key, { is_required: e.target.checked })}
                                        />
                                        <span className="small">Required</span>
                                    </label>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        style={{ width: 38 }}
                                        onClick={() => remove(row.key)}
                                        title="Remove document"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" className="btn btn-link btn-sm px-0 mt-3" onClick={add}>
                            <i className="fa fa-plus me-2"></i>Add another document
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

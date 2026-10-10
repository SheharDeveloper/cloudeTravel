import { useRef, useState } from 'react';
import { router, usePoll } from '@inertiajs/react';

export interface ApplicationDocumentItem {
    id: number;
    name: string;
    description: string | null;
    is_required: boolean;
    file: {
        name: string;
        size: number | null;
        mime_type: string | null;
        uploaded_at: string | null;
        uploaded_by: 'agency' | 'admin' | null;
    } | null;
    // The superadmin's review of the file; null while waiting for review
    review: {
        status: 'approved' | 'rejected';
        note: string | null;
        reviewed_at: string | null;
    } | null;
}

interface Row {
    key: number;
    id: number | null;
    name: string;
    description: string;
    is_required: boolean;
}

const formatSize = (bytes: number | null) =>
    !bytes ? '' : bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatDateTime = (date: string | null) =>
    date ? new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

/**
 * "Upload Document": the superadmin requests documents for this application;
 * the agency uploads a file for each; the superadmin sees the files (and can
 * upload too), then approves each one or rejects it with the reason.
 */
export default function ApplicationDocumentsTab({ applicationUid, documents, canRequest }: {
    applicationUid: string;
    documents: ApplicationDocumentItem[];
    // Superadmin: can request / change the documents
    canRequest: boolean;
}) {
    const base = `/admin/visa-applications/${applicationUid}/documents`;

    // Refresh: fetch the latest requests and uploads (the other side may have changed them),
    // and again by itself every 30 seconds while this tab is open
    const [refreshing, setRefreshing] = useState(false);
    const [refreshedAt, setRefreshedAt] = useState(() => new Date());
    const refresh = () => {
        setRefreshing(true);
        router.reload({
            only: ['documents'],
            onSuccess: () => setRefreshedAt(new Date()),
            onFinish: () => setRefreshing(false),
        });
    };
    usePoll(30000, { only: ['documents'], onSuccess: () => setRefreshedAt(new Date()) });
    const uploaded = documents.filter((d) => d.file).length;
    const approved = documents.filter((d) => d.review?.status === 'approved').length;
    const rejected = documents.filter((d) => d.review?.status === 'rejected').length;

    return (
        <>
            {canRequest && <RequestEditor base={base} documents={documents} />}

            <div className="card h-auto">
                <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                        <h6 className="card-title mb-1">Documents</h6>
                        <div className="small text-muted">
                            {canRequest ? 'Documents requested from the agency for this application' : 'Upload the documents requested for this application'}
                        </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                    {documents.length > 0 && (
                        <div className="d-flex gap-2 flex-wrap">
                            <span className={`badge ${uploaded === documents.length ? 'bg-info' : 'bg-warning text-dark'}`}>
                                {uploaded} of {documents.length} uploaded
                            </span>
                            <span className={`badge ${approved === documents.length ? 'bg-success' : 'bg-light text-dark border'}`}>
                                {approved} approved
                            </span>
                            {rejected > 0 && <span className="badge bg-danger">{rejected} rejected</span>}
                        </div>
                    )}
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={refresh}
                            disabled={refreshing}
                            title={`Last updated ${refreshedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · refreshes every 30 seconds`}
                        >
                            <i className={`fa fa-sync-alt me-1 ${refreshing ? 'fa-spin' : ''}`}></i>
                            {refreshing ? 'Refreshing…' : 'Refresh'}
                        </button>
                    </div>
                </div>
                <div className="card-body p-0">
                    {documents.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fas fa-file-upload" style={{ fontSize: 40, color: '#ccc' }}></i>
                            <p className="mt-3 mb-0">
                                {canRequest ? 'No documents requested yet. Request them above.' : 'No documents have been requested for this application yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: 60 }}>#</th>
                                        <th>Document</th>
                                        <th>Status</th>
                                        <th>File</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc, i) => (
                                        <DocumentRow key={doc.id} index={i} doc={doc} base={base} canReview={canRequest} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/** The document's status: not uploaded, waiting for review, approved, or rejected. */
function StatusBadge({ doc }: { doc: ApplicationDocumentItem }) {
    if (!doc.file) {
        return <span className={`badge ${doc.is_required ? 'bg-warning text-dark' : 'bg-secondary'}`}>{doc.is_required ? 'Pending' : 'Optional'}</span>;
    }
    if (doc.review?.status === 'approved') {
        return <span className="badge bg-success"><i className="fa fa-check-circle me-1"></i>Approved</span>;
    }
    if (doc.review?.status === 'rejected') {
        return <span className="badge bg-danger"><i className="fa fa-times-circle me-1"></i>Rejected</span>;
    }
    return <span className="badge bg-info"><i className="fa fa-hourglass-half me-1"></i>Waiting for review</span>;
}

/** One requested document: its status, the file, Upload / Replace / Remove, and (superadmin) Approve / Reject. */
function DocumentRow({ index, doc, base, canReview }: { index: number; doc: ApplicationDocumentItem; base: string; canReview: boolean }) {
    const input = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmRemove, setConfirmRemove] = useState(false);
    // Reject: the reason the document is not correct
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState('');

    const review = (status: 'approved' | 'rejected') => {
        if (status === 'rejected' && reason.trim() === '') {
            setError('Tell the agency why the document is not correct.');
            return;
        }
        setBusy(true);
        setError(null);
        router.post(`${base}/${doc.id}/review`, { status, note: status === 'rejected' ? reason.trim() : null }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejecting(false);
                setReason('');
            },
            onError: (errors) => setError(errors.note || errors.status || Object.values(errors)[0] || 'The review could not be saved.'),
            onFinish: () => setBusy(false),
        });
    };

    const upload = (file: File) => {
        setBusy(true);
        setError(null);
        router.post(`${base}/${doc.id}/upload`, { file }, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => setError(errors.file || Object.values(errors)[0] || 'The file could not be uploaded.'),
            onFinish: () => {
                setBusy(false);
                if (input.current) input.current.value = '';
            },
        });
    };

    const remove = () => {
        setBusy(true);
        router.delete(`${base}/${doc.id}/file`, {
            preserveScroll: true,
            onFinish: () => {
                setBusy(false);
                setConfirmRemove(false);
            },
        });
    };

    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                <div className="fw-semibold">
                    {doc.name}
                    {doc.is_required && <span className="text-danger ms-1" title="Required">*</span>}
                </div>
                {doc.description && <small className="text-muted">{doc.description}</small>}
            </td>
            <td style={{ maxWidth: 260 }}>
                <StatusBadge doc={doc} />
                {doc.review?.status === 'rejected' && doc.review.note && (
                    <div className="small text-danger mt-1" style={{ whiteSpace: 'pre-wrap' }}>
                        <i className="fa fa-comment-dots me-1"></i>{doc.review.note}
                    </div>
                )}
                {doc.review?.reviewed_at && <small className="d-block text-muted mt-1">{formatDateTime(doc.review.reviewed_at)}</small>}
            </td>
            <td>
                {doc.file ? (
                    <>
                        <a href={`${base}/${doc.id}/file`} target="_blank" rel="noreferrer" className="d-inline-flex align-items-center gap-1">
                            <i className="fa fa-file-alt"></i>
                            <span className="text-break">{doc.file.name}</span>
                        </a>
                        <small className="d-block text-muted">
                            {formatSize(doc.file.size)}
                            {doc.file.uploaded_at && <> · {formatDateTime(doc.file.uploaded_at)}</>}
                            {doc.file.uploaded_by && <> · by {doc.file.uploaded_by === 'admin' ? 'Superadmin' : 'Agency'}</>}
                        </small>
                    </>
                ) : (
                    <small className="text-muted">Not uploaded yet</small>
                )}
                {error && <div className="invalid-feedback d-block">{error}</div>}
            </td>
            <td className="text-end text-nowrap">
                <input
                    ref={input}
                    type="file"
                    className="d-none"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                />
                {confirmRemove ? (
                    <>
                        <small className="text-muted me-2">Remove the file?</small>
                        <button type="button" className="btn btn-danger btn-sm me-1" onClick={remove} disabled={busy}>Yes</button>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmRemove(false)} disabled={busy}>No</button>
                    </>
                ) : rejecting ? (
                    /* Superadmin: why the document is not correct */
                    <div className="d-flex flex-column align-items-end gap-1 ms-auto" style={{ maxWidth: 280 }}>
                        <textarea
                            className="form-control form-control-sm"
                            rows={2}
                            maxLength={1000}
                            placeholder="Why is this document not correct?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            autoFocus
                        />
                        <div>
                            <button type="button" className="btn btn-danger btn-sm me-1" onClick={() => review('rejected')} disabled={busy}>
                                <i className="fa fa-times me-1"></i>Reject
                            </button>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setRejecting(false); setError(null); }} disabled={busy}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => input.current?.click()} disabled={busy}>
                                <i className={`fa ${busy ? 'fa-spinner fa-spin' : 'fa-upload'} me-2`}></i>
                                {busy ? 'Working…' : !doc.file ? 'Upload' : doc.review?.status === 'rejected' ? 'Upload Again' : 'Replace'}
                            </button>
                            {/* Only the superadmin can delete an uploaded file */}
                            {canReview && doc.file && (
                                <button type="button" className="btn btn-outline-danger btn-sm ms-1" onClick={() => setConfirmRemove(true)} disabled={busy} title="Remove file">
                                    <i className="fa fa-trash"></i>
                                </button>
                            )}
                        </div>
                        {/* Superadmin: is the uploaded document correct? */}
                        {canReview && doc.file && (
                            <div className="mt-1">
                                {doc.review?.status !== 'approved' && (
                                    <button type="button" className="btn btn-success btn-sm" onClick={() => review('approved')} disabled={busy}>
                                        <i className="fa fa-check me-1"></i>Approve
                                    </button>
                                )}
                                {doc.review?.status !== 'rejected' && (
                                    <button type="button" className="btn btn-outline-danger btn-sm ms-1" onClick={() => { setRejecting(true); setError(null); }} disabled={busy}>
                                        <i className="fa fa-times me-1"></i>Reject
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </td>
        </tr>
    );
}

/** Superadmin: the documents requested for this application (name, description, required). */
function RequestEditor({ base, documents }: {
    base: string;
    documents: ApplicationDocumentItem[];
}) {
    const nextKey = useRef(0);
    const newKey = () => ++nextKey.current;
    const toRows = () => documents.map((d) => ({ key: newKey(), id: d.id, name: d.name, description: d.description ?? '', is_required: d.is_required }));

    const [rows, setRows] = useState<Row[]>(toRows);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
    const [rowErrors, setRowErrors] = useState<Record<number, string>>({});

    const change = (next: Row[]) => {
        setRows(next);
        setDirty(true);
        setMessage(null);
        setRowErrors({});
    };
    const patch = (key: number, values: Partial<Row>) => change(rows.map((r) => (r.key === key ? { ...r, ...values } : r)));
    const add = () => change([...rows, { key: newKey(), id: null, name: '', description: '', is_required: true }]);
    const remove = (key: number) => change(rows.filter((r) => r.key !== key));

    const save = () => {
        const blank = rows.find((r) => r.name.trim() === '');
        if (blank) {
            setRowErrors({ [blank.key]: 'Enter a document name.' });
            setMessage({ type: 'danger', text: 'Every document needs a name.' });
            return;
        }

        setSaving(true);
        router.put(base, {
            documents: rows.map((r) => ({ id: r.id, name: r.name.trim(), description: r.description.trim() || null, is_required: r.is_required })),
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Saved requests now have ids: start again from the server's list
                const saved = (page.props as unknown as { documents: ApplicationDocumentItem[] }).documents;
                setRows(saved.map((d) => ({ key: newKey(), id: d.id, name: d.name, description: d.description ?? '', is_required: d.is_required })));
                setDirty(false);
                setMessage({ type: 'success', text: 'Requested documents saved. The agency can now upload them.' });
            },
            onError: (errors) => {
                const perRow: Record<number, string> = {};
                Object.entries(errors).forEach(([field, text]) => {
                    const i = Number(field.split('.')[1]);
                    if (!Number.isNaN(i) && rows[i]) perRow[rows[i].key] = text;
                });
                setRowErrors(perRow);
                setMessage({ type: 'danger', text: Object.values(errors)[0] || 'Could not save the documents.' });
            },
            onFinish: () => setSaving(false),
        });
    };

    const removingUploaded = documents.some((d) => d.file && !rows.some((r) => r.id === d.id));

    return (
        <div className="card h-auto mb-4">
            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                    <h6 className="card-title mb-1">Request Documents</h6>
                    <div className="small text-muted">Documents the agency has to upload for this application</div>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={add}>
                        <i className="fa fa-plus me-2"></i>Add
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving || !dirty}>
                        <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-paper-plane'} me-2`}></i>
                        {saving ? 'Saving…' : 'Request Documents'}
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
                {removingUploaded && (
                    <div className="alert alert-warning py-2">
                        <i className="fa fa-exclamation-triangle me-2"></i>
                        A removed document already has an uploaded file; saving deletes that file too.
                    </div>
                )}

                {rows.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        <i className="fa-solid fa-file-circle-plus" style={{ fontSize: 40, color: '#ccc' }}></i>
                        <p className="mt-3 mb-3">No documents requested for this application yet.</p>
                        <button type="button" className="btn btn-primary btn-sm" onClick={add}>
                            <i className="fa fa-plus me-2"></i>Add Document
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="d-none d-md-flex gap-2 px-2 pb-1 small text-muted fw-semibold">
                            <span style={{ flex: 3 }}>Document Name</span>
                            <span style={{ flex: 3 }}>Description (optional)</span>
                            <span style={{ width: 90 }} className="text-center">Required</span>
                            <span style={{ width: 38 }}></span>
                        </div>
                        <div className="d-flex flex-column gap-2">
                            {rows.map((row) => (
                                <div key={row.key} className="d-flex flex-wrap flex-md-nowrap align-items-start gap-2 border rounded p-2">
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
                                    <button type="button" className="btn btn-outline-danger btn-sm" style={{ width: 38 }} onClick={() => remove(row.key)} title="Remove document">
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

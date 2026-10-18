import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import DatePicker from '@/components/DatePicker';

/** A document received from a client (Client Documents). */
export interface ReceivedDocumentRow {
    uid: string;
    document_name: string;
    received_at: string | null;
    remarks: string | null;
    returned_at: string | null;
    return_remarks: string | null;
    notified_at: string | null;
    notification_count: number;
    client: { uid: string; cid: string; name: string; phone: string | null; has_email: boolean } | null;
}

export interface ReceivedDocumentClient {
    uid: string;
    cid: string;
    name: string;
    phone: string | null;
}

interface Props {
    documents: ReceivedDocumentRow[];
    // Numbering of the first row (the register is paginated)
    startIndex?: number;
    // The register: pick the client when adding. The client page: the client is fixed.
    clients?: ReceivedDocumentClient[];
    fixedClient?: ReceivedDocumentClient;
    // Shown between the header and the table (the register's search)
    toolbar?: React.ReactNode;
    footer?: React.ReactNode;
    emptyText?: string;
}

/** "18/10/2026 04:09" — as the register shows it */
export const formatDocDateTime = (value: string | null) =>
    value
        ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
        : 'N/A';

/** Now, as "YYYY-MM-DDTHH:mm" in local time */
const nowLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
};

/** The theme's calendar for the date, with a time box beside it ("YYYY-MM-DDTHH:mm"). */
function DateTimeField({ id, value, onChange, error }: { id: string; value: string; onChange: (value: string) => void; error?: string }) {
    const [date, time] = [value.slice(0, 10), value.slice(11, 16) || '00:00'];
    return (
        <>
            <div className="row g-2">
                <div className="col-7">
                    <DatePicker value={date} onChange={(d) => onChange(`${d}T${time}`)} autoSelect={true} />
                </div>
                <div className="col-5">
                    <input
                        id={id}
                        type="time"
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        value={time}
                        onChange={(e) => onChange(`${date}T${e.target.value || '00:00'}`)}
                    />
                </div>
            </div>
            {error && <div className="invalid-feedback d-block">{error}</div>}
        </>
    );
}

/**
 * Client Documents: the table with Delete / Return Document / Send
 * Notification, and the Add Document and Return Document popups — used on
 * the register page and on a client's page.
 */
export default function ReceivedDocumentsPanel({ documents, startIndex = 1, clients = [], fixedClient, toolbar, footer, emptyText }: Props) {
    const errors = usePage().props.errors as Record<string, string>;
    const showClient = !fixedClient;

    // Add Document
    const emptyForm = () => ({ client_uid: fixedClient?.uid ?? '', document_name: '', received_at: nowLocal(), remarks: '' });
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [clientSearch, setClientSearch] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const selectedClient = fixedClient ?? clients.find((c) => c.uid === form.client_uid);
    const matchingClients = clients.filter((c) =>
        `${c.name} ${c.cid} ${c.phone ?? ''}`.toLowerCase().includes(clientSearch.trim().toLowerCase()),
    );

    const openAdd = () => {
        setForm(emptyForm());
        setClientSearch('');
        setAdding(true);
    };
    const saveDocument = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post('/admin/received-documents', form, {
            preserveScroll: true,
            onSuccess: () => setAdding(false),
            onFinish: () => setSaving(false),
        });
    };

    // Return Document (when, and a message) / Delete — confirmed in a popup
    const [returning, setReturning] = useState<ReceivedDocumentRow | null>(null);
    const [returnForm, setReturnForm] = useState({ returned_at: nowLocal(), return_remarks: '' });
    const [deleting, setDeleting] = useState<ReceivedDocumentRow | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    // "Send Notification" — coming soon
    const [comingSoon, setComingSoon] = useState(false);

    const action = (key: string, method: 'post' | 'delete', url: string, data: Record<string, string> = {}, done?: () => void) => {
        setBusy(key);
        const options = {
            preserveScroll: true,
            onSuccess: () => done?.(),
            onError: (errs: Record<string, string>) => toast.error(Object.values(errs)[0] ?? 'Something went wrong'),
            onFinish: () => setBusy(null),
        };
        if (method === 'delete') router.delete(url, options);
        else router.post(url, data, options);
    };

    return (
        <>
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h6 className="card-title mb-0">{fixedClient ? 'Client Documents' : 'Documents received from clients'}</h6>
                <button type="button" className="btn btn-primary btn-sm" onClick={openAdd}>
                    <i className="fa fa-plus me-2"></i>Add Document
                </button>
            </div>
            <div className="card-body">
                {toolbar}

                {documents.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <i className="fa fa-folder-open d-block mb-2" style={{ fontSize: 40, color: '#ccc' }}></i>
                        {emptyText ?? 'No documents yet. Click "Add Document" when a client hands one over.'}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    {showClient && <th>Client</th>}
                                    {showClient && <th>Phone</th>}
                                    <th>Document</th>
                                    <th>Received On</th>
                                    <th>Returned On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((d, i) => (
                                    <tr key={d.uid}>
                                        <td>{startIndex + i}</td>
                                        {showClient && (
                                            <td>
                                                {d.client ? (
                                                    <>
                                                        <a href={`/admin/clients/${d.client.uid}`} className="fw-semibold text-uppercase">{d.client.name}</a>
                                                        <small className="d-block text-muted">{d.client.cid}</small>
                                                    </>
                                                ) : 'N/A'}
                                            </td>
                                        )}
                                        {showClient && <td>{d.client?.phone || 'N/A'}</td>}
                                        <td className="text-uppercase">{d.document_name}</td>
                                        <td style={{ maxWidth: 280 }}>
                                            {formatDocDateTime(d.received_at)}
                                            {d.remarks && <div className="text-uppercase small" style={{ whiteSpace: 'pre-wrap' }}>{d.remarks}</div>}
                                        </td>
                                        <td style={{ maxWidth: 260 }}>
                                            {d.returned_at ? (
                                                <>
                                                    <span className="badge bg-success">{formatDocDateTime(d.returned_at)}</span>
                                                    {d.return_remarks && <div className="small mt-1" style={{ whiteSpace: 'pre-wrap' }}>{d.return_remarks}</div>}
                                                </>
                                            ) : 'N/A'}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column align-items-start gap-1">
                                                {/* Returned: kept as the record of the return, so no Delete */}
                                                {!d.returned_at && (
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(d)} disabled={busy !== null}>
                                                        Delete
                                                    </button>
                                                )}
                                                {!d.returned_at && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-info btn-sm text-white"
                                                        onClick={() => { setReturnForm({ returned_at: nowLocal(), return_remarks: '' }); setReturning(d); }}
                                                        disabled={busy !== null}
                                                    >
                                                        Return Document
                                                    </button>
                                                )}
                                                {/* Notifications are not live yet: "Coming soon" */}
                                                <button
                                                    type="button"
                                                    className="btn btn-info btn-sm text-white"
                                                    onClick={() => setComingSoon(true)}
                                                    disabled={busy !== null}
                                                >
                                                    Send Notification
                                                </button>
                                                {d.notified_at && (
                                                    <small className="text-muted">Notified {formatDocDateTime(d.notified_at)}{d.notification_count > 1 ? ` (${d.notification_count}×)` : ''}</small>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {footer}
            </div>

            {/* Add Document */}
            {adding && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => !saving && setAdding(false)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <form className="modal-content" onSubmit={saveDocument}>
                            <div className="modal-header text-white" style={{ background: 'linear-gradient(90deg, #1e6fbf 0%, #3aa0dc 60%, #6ec1e4 100%)' }}>
                                <h5 className="modal-title text-white">Add Document</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setAdding(false)} disabled={saving}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3 position-relative">
                                    <label className="form-label">{fixedClient ? 'Client' : 'Select Client'}</label>
                                    {fixedClient ? (
                                        <input type="text" className="form-control" value={`${fixedClient.name} (${fixedClient.cid})`} disabled />
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.client_uid ? 'is-invalid' : ''}`}
                                                placeholder={selectedClient ? `${selectedClient.name} (${selectedClient.cid})` : 'Select Client.....'}
                                                value={clientSearch}
                                                onChange={(e) => { setClientSearch(e.target.value); setPickerOpen(true); }}
                                                onFocus={() => setPickerOpen(true)}
                                                onBlur={() => window.setTimeout(() => setPickerOpen(false), 150)}
                                            />
                                            {selectedClient && !clientSearch && (
                                                <small className="text-success d-block mt-1">
                                                    <i className="fa fa-check me-1"></i>{selectedClient.name} · {selectedClient.cid}{selectedClient.phone ? ` · ${selectedClient.phone}` : ''}
                                                </small>
                                            )}
                                            {pickerOpen && (
                                                <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 20, maxHeight: 240, overflowY: 'auto' }}>
                                                    {matchingClients.length === 0 ? (
                                                        <div className="small text-muted p-2">No client matches.</div>
                                                    ) : matchingClients.map((c) => (
                                                        <button
                                                            key={c.uid}
                                                            type="button"
                                                            className="dropdown-item d-flex justify-content-between gap-2 py-2"
                                                            onMouseDown={(e) => { e.preventDefault(); setForm({ ...form, client_uid: c.uid }); setClientSearch(''); setPickerOpen(false); }}
                                                        >
                                                            <span className="text-truncate">{c.name}</span>
                                                            <small className="text-muted flex-shrink-0">{c.cid}{c.phone ? ` · ${c.phone}` : ''}</small>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {errors.client_uid && <div className="invalid-feedback d-block">{errors.client_uid}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="rd-name">Document</label>
                                    <input
                                        id="rd-name"
                                        type="text"
                                        className={`form-control ${errors.document_name ? 'is-invalid' : ''}`}
                                        placeholder="Document Name"
                                        value={form.document_name}
                                        onChange={(e) => setForm({ ...form, document_name: e.target.value })}
                                        maxLength={255}
                                    />
                                    {errors.document_name && <div className="invalid-feedback d-block">{errors.document_name}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="rd-received">Received On</label>
                                    <DateTimeField id="rd-received" value={form.received_at} onChange={(v) => setForm({ ...form, received_at: v })} error={errors.received_at} />
                                </div>
                                <div className="mb-0">
                                    <label className="form-label" htmlFor="rd-remarks">Remarks</label>
                                    <textarea
                                        id="rd-remarks"
                                        className="form-control"
                                        rows={2}
                                        placeholder="REMARKS"
                                        value={form.remarks}
                                        onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                        maxLength={2000}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setAdding(false)} disabled={saving}>Close</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding…' : 'Add Document'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Return Document: when it was handed back, and a message */}
            {returning && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => busy === null && setReturning(null)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header text-white" style={{ background: 'linear-gradient(90deg, #1e6fbf 0%, #3aa0dc 60%, #6ec1e4 100%)' }}>
                                <h5 className="modal-title text-white">Return Document</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setReturning(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-3">
                                    Return <strong>{returning.document_name}</strong> to <strong>{returning.client?.name}</strong>.
                                </p>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="rd-returned">Returned On</label>
                                    <DateTimeField id="rd-returned" value={returnForm.returned_at} onChange={(v) => setReturnForm({ ...returnForm, returned_at: v })} />
                                </div>
                                <div className="mb-0">
                                    <label className="form-label" htmlFor="rd-return-msg">Message</label>
                                    <textarea
                                        id="rd-return-msg"
                                        className="form-control"
                                        rows={3}
                                        placeholder="e.g. Returned to the client in person / sent by post"
                                        value={returnForm.return_remarks}
                                        onChange={(e) => setReturnForm({ ...returnForm, return_remarks: e.target.value })}
                                        maxLength={2000}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setReturning(null)}>Close</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={busy !== null}
                                    onClick={() => action(`return-${returning.uid}`, 'post', `/admin/received-documents/${returning.uid}/return`, returnForm, () => setReturning(null))}
                                >
                                    {busy ? 'Saving…' : 'Return Document'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Notification: not live yet */}
            {comingSoon && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setComingSoon(false)}>
                    <div className="modal-dialog modal-dialog-centered modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content text-center">
                            <div className="modal-body py-4">
                                <i className="fa fa-bell text-primary d-block mb-3" style={{ fontSize: 40 }}></i>
                                <h5 className="mb-2">Coming Soon</h5>
                                <p className="text-muted mb-0">Notifications will be available very soon.</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => setComingSoon(false)}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete */}
            {deleting && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => busy === null && setDeleting(null)}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Document</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleting(null)}></button>
                            </div>
                            <div className="modal-body">
                                Delete <strong>{deleting.document_name}</strong> of <strong>{deleting.client?.name}</strong> from the register? This cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    disabled={busy !== null}
                                    onClick={() => action(`delete-${deleting.uid}`, 'delete', `/admin/received-documents/${deleting.uid}`, {}, () => setDeleting(null))}
                                >
                                    {busy ? 'Deleting…' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

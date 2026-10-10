import { useState } from 'react';
import { router } from '@inertiajs/react';
import { statusBadge, statusLabel } from '@/pages/Admin/ServiceBookings/Index';

interface StatusChange {
    id: number;
    old_value: string | null;
    new_value: string | null;
    comment: string | null;
    created_at: string;
}

/**
 * Processing (superadmin): the application's status — In Process, Update
 * Done, Approved… Each change is kept in the Visa Updation Log.
 */
export default function ProcessingTab({ applicationUid, status, statuses, history }: {
    applicationUid: string;
    status: string;
    // value => label, e.g. { in_process: 'In Process', approved: 'Approved' }
    statuses: Record<string, string>;
    // Earlier status changes, newest first
    history: StatusChange[];
}) {
    const [next, setNext] = useState(status in statuses ? status : '');
    // A note with the change; for Rejected it is the (required) reason
    const [comment, setComment] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const rejecting = next === 'rejected';
    // A new status, or the same one with a new comment
    const canSave = !!next && (next !== status || comment.trim() !== '') && (!rejecting || comment.trim() !== '');

    const save = () => {
        if (rejecting && comment.trim() === '') {
            setError('Enter the reason for rejecting the application.');
            return;
        }
        setSaving(true);
        setError(null);
        router.put(`/admin/visa-applications/${applicationUid}/status`, { status: next, comment: comment.trim() || null }, {
            preserveScroll: true,
            onSuccess: () => setComment(''),
            onError: (errors) => setError(errors.comment || errors.status || Object.values(errors)[0] || 'The status could not be changed.'),
            onFinish: () => setSaving(false),
        });
    };

    const formatDateTime = (date: string) =>
        new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="row">
            <div className="col-lg-5 mb-4">
                <div className="card h-auto">
                    <div className="card-header">
                        <h6 className="card-title mb-1">Application Status</h6>
                        <div className="small text-muted">Move the application through processing</div>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <small className="text-muted d-block mb-1">Current status</small>
                            <span className={`badge ${statusBadge(status)} text-capitalize fs-6`}>{statuses[status] ?? statusLabel(status)}</span>
                        </div>

                        <label className="form-label" htmlFor="application-status">Change status to</label>
                        <div className="d-flex flex-column gap-2 mb-3" id="application-status">
                            {Object.entries(statuses).map(([value, label]) => (
                                <label
                                    key={value}
                                    className={`d-flex align-items-center gap-2 border rounded px-3 py-2 mb-0 ${next === value ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <input
                                        type="radio"
                                        className="form-check-input mt-0"
                                        name="application-status"
                                        checked={next === value}
                                        onChange={() => setNext(value)}
                                    />
                                    <span className={`badge ${statusBadge(value)}`}>{label}</span>
                                    {value === status && <small className="text-muted ms-auto">current</small>}
                                </label>
                            ))}
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="status-comment">
                                {rejecting ? <>Reason for rejection <span className="text-danger">*</span></> : <>Comment <small className="text-muted">(optional)</small></>}
                            </label>
                            <textarea
                                id="status-comment"
                                className={`form-control ${error && rejecting && !comment.trim() ? 'is-invalid' : ''}`}
                                rows={3}
                                maxLength={2000}
                                placeholder={rejecting ? 'Why is the application rejected?' : 'e.g. Documents checked, sent to the embassy'}
                                value={comment}
                                onChange={(e) => { setComment(e.target.value); setError(null); }}
                            />
                        </div>
                        {error && <div className="invalid-feedback d-block mb-2">{error}</div>}

                        <button type="button" className={`btn ${rejecting ? 'btn-danger' : 'btn-primary'} w-100`} onClick={save} disabled={saving || !canSave}>
                            <i className={`fa ${saving ? 'fa-spinner fa-spin' : rejecting ? 'fa-times' : 'fa-check'} me-2`}></i>
                            {saving ? 'Saving…' : next === status ? 'Add Comment' : rejecting ? 'Reject Application' : 'Update Status'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-lg-7 mb-4">
                <div className="card h-auto">
                    <div className="card-header">
                        <h6 className="card-title mb-0">Status History</h6>
                    </div>
                    <div className="card-body p-0">
                        {history.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <i className="fas fa-stream" style={{ fontSize: 36, color: '#ccc' }}></i>
                                <p className="mt-3 mb-0">No status changes yet.</p>
                            </div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {history.map((change) => (
                                    <li key={change.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                            <span>
                                                {change.old_value === change.new_value ? (
                                                    <><i className="fa fa-comment-dots text-muted me-2"></i><strong>{change.new_value}</strong> <small className="text-muted">· comment</small></>
                                                ) : (
                                                    <>
                                                        <span className="text-muted">{change.old_value ?? '—'}</span>
                                                        <i className="fa fa-arrow-right mx-2 text-muted small"></i>
                                                        <strong>{change.new_value}</strong>
                                                    </>
                                                )}
                                            </span>
                                            <small className="text-muted">{formatDateTime(change.created_at)}</small>
                                        </div>
                                        {change.comment && (
                                            <div
                                                className={`small mt-1 ${change.new_value === 'Rejected' ? 'text-danger' : 'text-body'}`}
                                                style={{ whiteSpace: 'pre-wrap' }}
                                            >
                                                {change.new_value === 'Rejected' ? 'Reason: ' : ''}{change.comment}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

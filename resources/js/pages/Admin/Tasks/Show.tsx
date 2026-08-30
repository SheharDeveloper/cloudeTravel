import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import DatePicker from '@/components/DatePicker';

interface StaffOption {
    uid: string;
    name: string;
}

interface TaskAttachment {
    id: number;
    file_name: string;
    file_path: string;
    file_type: string | null;
}

interface TaskNote {
    id: number;
    note: string;
    author_name: string | null;
    created_at: string;
}

interface AssignmentHistoryEntry {
    id: number;
    action: 'assigned' | 'unassigned';
    description: string;
    causer_name: string | null;
    created_at: string;
}

type Status = 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface TaskDetail {
    uid: string;
    title: string;
    details: string | null;
    priority: Priority;
    due_date: string | null;
    status: Status;
    remark: string | null;
    assigned_to_uid: string | null;
    assigned_to_name: string | null;
    created_by_name: string | null;
    created_at: string;
    status_updated_at: string | null;
    attachments: TaskAttachment[];
    notes: TaskNote[];
    assignment_history: AssignmentHistoryEntry[];
}

interface PageProps {
    task: TaskDetail;
    isStaff: boolean;
    canManageTasks: boolean;
    currentStaffUid: string | null;
    staffOptions: StaffOption[];
    statuses: Status[];
    priorities: Priority[];
}

const COLUMNS: { key: Status; label: string }[] = [
    { key: 'todo', label: 'To Do' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'review', label: 'Review' },
    { key: 'done', label: 'Done' },
];

const PRIORITY_BADGE: Record<Priority, string> = {
    low: 'bg-secondary bg-opacity-10 text-secondary',
    medium: 'bg-info bg-opacity-10 text-info-emphasis',
    high: 'bg-warning bg-opacity-10 text-warning-emphasis',
    urgent: 'bg-danger bg-opacity-10 text-danger',
};

const STATUS_LABEL: Record<Status, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
};

const TABS = [
    { key: 'details', label: 'Task Details' },
    { key: 'notes', label: 'Notes' },
    { key: 'history', label: 'Assignment History' },
];

const EmptyState = ({ icon, text }: { icon: string; text: string }) => (
    <div className="text-center py-5">
        <i className={icon} style={{ fontSize: '48px', color: '#ccc' }}></i>
        <p className="text-muted mt-3">{text}</p>
    </div>
);

export default function TaskShow() {
    const { task, canManageTasks, currentStaffUid, staffOptions, priorities } = usePage().props as unknown as PageProps;

    const [activeTab, setActiveTab] = useState('details');
    const [showEdit, setShowEdit] = useState(false);
    const [form, setForm] = useState({
        title: task.title,
        details: task.details ?? '',
        priority: task.priority,
        due_date: task.due_date ?? '',
        assigned_to: task.assigned_to_uid ?? '',
    });
    const [formFiles, setFormFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [remarkDraft, setRemarkDraft] = useState(task.remark ?? '');
    const [detailFiles, setDetailFiles] = useState<File[]>([]);
    const [noteDraft, setNoteDraft] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);

    const canTouch = canManageTasks || (!!currentStaffUid && task.assigned_to_uid === currentStaffUid);

    const formatDueDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    const isOverdue = !!task.due_date && task.status !== 'done' && task.due_date < new Date().toISOString().split('T')[0];

    const moveStatus = (status: Status) => {
        router.patch(`/admin/tasks/${task.uid}/status`, { status }, { preserveScroll: true });
    };

    const saveRemark = () => {
        router.patch(`/admin/tasks/${task.uid}/remark`, { remark: remarkDraft }, { preserveScroll: true });
    };

    const uploadAttachment = () => {
        if (detailFiles.length === 0) return;
        const formData = new FormData();
        detailFiles.forEach((f) => formData.append('attachments[]', f));
        router.post(`/admin/tasks/${task.uid}/attachments`, formData, {
            preserveScroll: true,
            onSuccess: () => setDetailFiles([]),
        });
    };

    const deleteAttachment = (attachment: TaskAttachment) => {
        router.delete(`/admin/tasks/${task.uid}/attachments/${attachment.id}`, { preserveScroll: true });
    };

    const assignToMe = () => {
        if (!currentStaffUid) return;
        router.patch(`/admin/tasks/${task.uid}/assign`, { assigned_to: currentStaffUid }, { preserveScroll: true });
    };

    const unassign = () => {
        router.patch(`/admin/tasks/${task.uid}/assign`, { assigned_to: null }, { preserveScroll: true });
    };

    const reassign = (staffUid: string) => {
        router.patch(`/admin/tasks/${task.uid}/assign`, { assigned_to: staffUid || null }, { preserveScroll: true });
    };

    const openEdit = () => {
        setForm({
            title: task.title,
            details: task.details ?? '',
            priority: task.priority,
            due_date: task.due_date ?? '',
            assigned_to: task.assigned_to_uid ?? '',
        });
        setFormFiles([]);
        setErrors({});
        setShowEdit(true);
    };

    const submitEdit = () => {
        setSaving(true);
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('details', form.details);
        formData.append('priority', form.priority);
        if (form.due_date) formData.append('due_date', form.due_date);
        if (form.assigned_to) formData.append('assigned_to', form.assigned_to);
        formFiles.forEach((f) => formData.append('attachments[]', f));

        router.put(`/admin/tasks/${task.uid}`, formData, {
            onSuccess: () => setShowEdit(false),
            onError: (err: Record<string, string>) => setErrors(err),
            onFinish: () => setSaving(false),
        });
    };

    const deleteTask = () => {
        router.delete(`/admin/tasks/${task.uid}`, {
            onSuccess: () => router.visit('/admin/tasks'),
        });
    };

    const submitNote = () => {
        if (!noteDraft.trim()) return;
        setSavingNote(true);
        router.post(`/admin/tasks/${task.uid}/notes`, { note: noteDraft }, {
            preserveScroll: true,
            onSuccess: () => {
                setNoteDraft('');
                setShowAddNote(false);
            },
            onFinish: () => setSavingNote(false),
        });
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Task Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/tasks">Task Board</a></li>
                        <li className="breadcrumb-item active">{task.title}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Card */}
            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                            <h3 className="fw-semibold mb-2">{task.title}</h3>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                <span className={`badge ${PRIORITY_BADGE[task.priority]} text-capitalize`}>{task.priority} priority</span>
                                <span className="badge bg-primary bg-opacity-10 text-primary">{STATUS_LABEL[task.status]}</span>
                                {task.due_date && (
                                    <span className={`badge ${isOverdue ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                        Due {formatDueDate(task.due_date)}
                                    </span>
                                )}
                            </div>
                            <p className="text-muted small mb-0">
                                Created by <strong>{task.created_by_name}</strong> on {task.created_at}
                            </p>
                        </div>

                        {canManageTasks && (
                            <div className="d-flex gap-2">
                                <button onClick={openEdit} className="btn btn-primary btn-sm">
                                    <i className="fa fa-edit me-2"></i>Edit
                                </button>
                                <button onClick={deleteTask} className="btn btn-outline-danger btn-sm">
                                    <i className="fa fa-trash me-2"></i>Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEdit && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Task</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                    {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Details</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        value={form.details}
                                        onChange={(e) => setForm({ ...form, details: e.target.value })}
                                    />
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-sm-6">
                                        <label className="form-label">Priority</label>
                                        <select
                                            className="form-select"
                                            value={form.priority}
                                            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                                        >
                                            {priorities.map((p) => (
                                                <option key={p} value={p} className="text-capitalize">{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">Assign To</label>
                                        <select
                                            className="form-select"
                                            value={form.assigned_to}
                                            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                                        >
                                            <option value="">Unassigned</option>
                                            {staffOptions.map((s) => (
                                                <option key={s.uid} value={s.uid}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <DatePicker
                                        label="Due Date"
                                        value={form.due_date}
                                        onChange={(date) => setForm({ ...form, due_date: date })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Add Attachments</label>
                                    <input
                                        type="file"
                                        multiple
                                        className="form-control"
                                        onChange={(e) => setFormFiles(Array.from(e.target.files ?? []))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitEdit}
                                    disabled={saving || !form.title.trim()}
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showAddNote && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Note</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddNote(false)}></button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    placeholder="Add a note about this task..."
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddNote(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitNote}
                                    disabled={savingNote || !noteDraft.trim()}
                                >
                                    {savingNote ? 'Saving...' : 'Add Note'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    {/* ── Task Details ─────────────────────────── */}
                    {activeTab === 'details' && (
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card mb-4 h-auto">
                                    <div className="card-header"><h6 className="card-title mb-0">Task Message</h6></div>
                                    <div className="card-body">
                                        {task.details ? (
                                            <p className="mb-0">{task.details}</p>
                                        ) : (
                                            <p className="text-muted mb-0">No message provided for this task.</p>
                                        )}
                                    </div>
                                </div>

                                {canTouch && (
                                    <div className="card mb-4 h-auto">
                                        <div className="card-header"><h6 className="card-title mb-0">Move To</h6></div>
                                        <div className="card-body">
                                            <div className="d-flex flex-wrap gap-2">
                                                {COLUMNS.map((col) => (
                                                    <button
                                                        key={col.key}
                                                        type="button"
                                                        className={`btn btn-sm ${task.status === col.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        onClick={() => moveStatus(col.key)}
                                                    >
                                                        {col.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="card mb-4 h-auto">
                                    <div className="card-header"><h6 className="card-title mb-0">Attachments</h6></div>
                                    <div className="card-body">
                                        {task.attachments.length > 0 ? (
                                            <ul className="list-group mb-2">
                                                {task.attachments.map((a) => (
                                                    <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        <a href={a.file_path} target="_blank" rel="noreferrer">
                                                            <i className="fa fa-paperclip me-2"></i>{a.file_name}
                                                        </a>
                                                        {canTouch && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteAttachment(a)}
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted small mb-2">No attachments</p>
                                        )}
                                        {canTouch && (
                                            <div className="d-flex gap-2">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="form-control"
                                                    onChange={(e) => setDetailFiles(Array.from(e.target.files ?? []))}
                                                />
                                                <button type="button" className="btn btn-outline-primary" onClick={uploadAttachment} disabled={detailFiles.length === 0}>
                                                    Upload
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card mb-4 h-auto">
                                    <div className="card-header"><h6 className="card-title mb-0">Remark</h6></div>
                                    <div className="card-body">
                                        {canTouch ? (
                                            <>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    value={remarkDraft}
                                                    onChange={(e) => setRemarkDraft(e.target.value)}
                                                />
                                                <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={saveRemark}>
                                                    Save Remark
                                                </button>
                                            </>
                                        ) : (
                                            <p className="text-muted mb-0">{task.remark || 'No remark yet'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card mb-4 h-auto">
                                    <div className="card-header"><h6 className="card-title mb-0">Assignment</h6></div>
                                    <div className="card-body">
                                        {canManageTasks ? (
                                            <select
                                                className="form-select"
                                                value={task.assigned_to_uid ?? ''}
                                                onChange={(e) => reassign(e.target.value)}
                                            >
                                                <option value="">Unassigned</option>
                                                {staffOptions.map((s) => (
                                                    <option key={s.uid} value={s.uid}>{s.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="d-flex flex-column gap-2 align-items-start">
                                                <span>Assigned to: <strong>{task.assigned_to_name ?? 'Unassigned'}</strong></span>
                                                {!task.assigned_to_uid && (
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={assignToMe}>
                                                        Assign to Me
                                                    </button>
                                                )}
                                                {task.assigned_to_uid === currentStaffUid && (
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={unassign}>
                                                        Unassign
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Notes ─────────────────────────────────── */}
                    {activeTab === 'notes' && (
                        <div className="card h-auto">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="card-title mb-0">Notes</h6>
                                {canTouch && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => { setNoteDraft(''); setShowAddNote(true); }}
                                    >
                                        <i className="fa fa-plus me-2"></i>Add Note
                                    </button>
                                )}
                            </div>
                            <div className="card-body">
                                {task.notes.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {task.notes.map((note) => (
                                            <li key={note.id} className="list-group-item px-0">
                                                <p className="mb-1">{note.note}</p>
                                                <small className="text-muted">
                                                    by {note.author_name || 'Unknown'} on {note.created_at}
                                                </small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState icon="fas fa-note-sticky" text="No notes yet" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Assignment History ───────────────────── */}
                    {activeTab === 'history' && (
                        <div className="card h-auto">
                            <div className="card-header"><h6 className="card-title mb-0">Assignment History</h6></div>
                            <div className="card-body">
                                {task.assignment_history.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {task.assignment_history.map((entry) => (
                                            <li key={entry.id} className="list-group-item d-flex justify-content-between align-items-start px-0">
                                                <div>
                                                    <span className={`badge ${entry.action === 'assigned' ? 'bg-primary' : 'bg-secondary'} me-2`}>
                                                        {entry.action === 'assigned' ? 'Assigned' : 'Unassigned'}
                                                    </span>
                                                    <span>{entry.description}</span>
                                                </div>
                                                <small className="text-muted text-nowrap ms-3">{entry.created_at}</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <EmptyState icon="fas fa-clock-rotate-left" text="No assignment history yet" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

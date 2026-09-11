import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import DatePicker from '@/components/DatePicker';
import ConfirmDialog from '@/components/ConfirmDialog';

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

type Status = 'todo' | 'in_progress' | 'review' | 'done';
type Priority = 'new_job' | 'urgent';

interface TaskEntry {
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
}

interface PageProps {
    isStaff: boolean;
    canManageTasks: boolean;
    currentStaffUid: string | null;
    staffOptions: StaffOption[];
    statuses: Status[];
    priorities: Priority[];
    tasks: TaskEntry[];
    history: TaskEntry[];
}

type BoardColumnKey = 'new_job' | 'urgent' | 'in_progress' | 'review' | 'done';

interface BoardColumn {
    key: BoardColumnKey;
    label: string;
    matches: (task: TaskEntry) => boolean;
    target: { status: Status; priority?: Priority };
}

// The board splits the "todo" status into two columns by priority (New Job /
// Urgent) so triage happens up front; later columns are plain status stages.
const BOARD_COLUMNS: BoardColumn[] = [
    { key: 'new_job', label: 'New Job', matches: (t) => t.status === 'todo' && t.priority === 'new_job', target: { status: 'todo', priority: 'new_job' } },
    { key: 'urgent', label: 'Urgent', matches: (t) => t.status === 'todo' && t.priority === 'urgent', target: { status: 'todo', priority: 'urgent' } },
    { key: 'in_progress', label: 'Progress', matches: (t) => t.status === 'in_progress', target: { status: 'in_progress' } },
    { key: 'review', label: 'Review', matches: (t) => t.status === 'review', target: { status: 'review' } },
    { key: 'done', label: 'Done', matches: (t) => t.status === 'done', target: { status: 'done' } },
];

const PRIORITY_BADGE: Record<Priority, string> = {
    new_job: 'bg-info bg-opacity-10 text-info-emphasis',
    urgent: 'bg-danger bg-opacity-10 text-danger',
};

const PRIORITY_LABEL: Record<Priority, string> = {
    new_job: 'New Job',
    urgent: 'Urgent',
};

const STATUS_LABEL: Record<Status, string> = {
    todo: 'To Do',
    in_progress: 'Progress',
    review: 'Review',
    done: 'Done',
};

const emptyForm = {
    title: '',
    details: '',
    priority: 'new_job' as Priority,
    due_date: '',
    assigned_to: '',
};

export default function TaskBoard() {
    const { canManageTasks, currentStaffUid, staffOptions, priorities, tasks, history } = usePage().props as unknown as PageProps;

    const [form, setForm] = useState(emptyForm);
    const [formFiles, setFormFiles] = useState<File[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskEntry | null>(null);
    const [detailTask, setDetailTask] = useState<TaskEntry | null>(null);
    const [remarkDraft, setRemarkDraft] = useState('');
    const [detailFiles, setDetailFiles] = useState<File[]>([]);
    const [noteDraft, setNoteDraft] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [draggedUid, setDraggedUid] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<BoardColumnKey | null>(null);
    const [view, setView] = useState<'kanban' | 'table'>('kanban');
    const [pendingAssign, setPendingAssign] = useState<{ task: TaskEntry; staffUid: string | null; staffName: string } | null>(null);

    const canTouch = (task: TaskEntry) => canManageTasks || (!!currentStaffUid && task.assigned_to_uid === currentStaffUid);

    const openCreate = () => {
        setForm(emptyForm);
        setFormFiles([]);
        setErrors({});
        setShowCreate(true);
    };

    const openEdit = (task: TaskEntry) => {
        setEditingTask(task);
        setForm({
            title: task.title,
            details: task.details ?? '',
            priority: task.priority,
            due_date: task.due_date ?? '',
            assigned_to: task.assigned_to_uid ?? '',
        });
        setFormFiles([]);
        setErrors({});
        setDetailTask(null);
    };

    const closeForm = () => {
        setShowCreate(false);
        setEditingTask(null);
        setForm(emptyForm);
        setFormFiles([]);
    };

    const submitForm = () => {
        setSaving(true);
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('details', form.details);
        formData.append('priority', form.priority);
        if (form.due_date) formData.append('due_date', form.due_date);
        if (form.assigned_to) formData.append('assigned_to', form.assigned_to);
        formFiles.forEach((f) => formData.append('attachments[]', f));

        const onDone = {
            onSuccess: () => closeForm(),
            onError: (err: Record<string, string>) => setErrors(err),
            onFinish: () => setSaving(false),
        };

        if (editingTask) {
            router.put(`/admin/tasks/${editingTask.uid}`, formData, onDone);
        } else {
            formData.append('status', 'todo');
            router.post('/admin/tasks', formData, onDone);
        }
    };

    const deleteTask = (task: TaskEntry) => {
        router.delete(`/admin/tasks/${task.uid}`, {
            onSuccess: () => setDetailTask(null),
        });
    };

    const openDetail = (task: TaskEntry) => {
        setDetailTask(task);
        setRemarkDraft(task.remark ?? '');
        setDetailFiles([]);
        setNoteDraft('');
        setShowNoteModal(false);
    };

    const moveStatus = (task: TaskEntry, target: { status: Status; priority?: Priority }) => {
        router.patch(
            `/admin/tasks/${task.uid}/status`,
            target.priority ? { status: target.status, priority: target.priority } : { status: target.status },
            { preserveScroll: true },
        );
    };

    const handleDragStart = (task: TaskEntry) => {
        if (!canTouch(task)) return;
        setDraggedUid(task.uid);
    };

    const handleDrop = (col: BoardColumn) => {
        const task = tasks.find((t) => t.uid === draggedUid);
        setDraggedUid(null);
        setDragOverCol(null);
        if (!task || col.matches(task) || !canTouch(task)) return;
        moveStatus(task, col.target);
    };

    const saveRemark = () => {
        if (!detailTask) return;
        router.patch(`/admin/tasks/${detailTask.uid}/remark`, { remark: remarkDraft }, {
            preserveScroll: true,
            onSuccess: () => setDetailTask(null),
        });
    };

    const uploadAttachment = () => {
        if (!detailTask || detailFiles.length === 0) return;
        const formData = new FormData();
        detailFiles.forEach((f) => formData.append('attachments[]', f));
        router.post(`/admin/tasks/${detailTask.uid}/attachments`, formData, {
            preserveScroll: true,
            onSuccess: () => { setDetailFiles([]); setDetailTask(null); },
        });
    };

    const deleteAttachment = (task: TaskEntry, attachment: TaskAttachment) => {
        router.delete(`/admin/tasks/${task.uid}/attachments/${attachment.id}`, {
            preserveScroll: true,
            onSuccess: () => setDetailTask(null),
        });
    };

    const submitNote = () => {
        if (!detailTask || !noteDraft.trim()) return;
        setSavingNote(true);
        router.post(`/admin/tasks/${detailTask.uid}/notes`, { note: noteDraft }, {
            preserveScroll: true,
            onSuccess: () => { setNoteDraft(''); setShowNoteModal(false); setDetailTask(null); },
            onFinish: () => setSavingNote(false),
        });
    };

    const formatDueDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    const isOverdue = (task: TaskEntry) =>
        !!task.due_date && task.status !== 'done' && task.due_date < new Date().toISOString().split('T')[0];

    const assignToMe = (task: TaskEntry) => {
        if (!currentStaffUid) return;
        setPendingAssign({ task, staffUid: currentStaffUid, staffName: 'yourself' });
    };

    const unassign = (task: TaskEntry) => {
        setPendingAssign({ task, staffUid: null, staffName: task.assigned_to_name ?? 'this staff member' });
    };

    const reassign = (task: TaskEntry, staffUid: string) => {
        if (!staffUid) {
            setPendingAssign({ task, staffUid: null, staffName: task.assigned_to_name ?? 'this staff member' });
            return;
        }
        const staffName = staffOptions.find((s) => s.uid === staffUid)?.name ?? 'this staff member';
        setPendingAssign({ task, staffUid, staffName });
    };

    const confirmAssign = () => {
        if (!pendingAssign) return;
        router.patch(`/admin/tasks/${pendingAssign.task.uid}/assign`, { assigned_to: pendingAssign.staffUid }, {
            preserveScroll: true,
            onSuccess: () => setDetailTask(null),
        });
        setPendingAssign(null);
    };

    return (
        <div>
            <div className="page-title d-flex justify-content-between align-items-center flex-wrap gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Task Board</h1></li>
                        <li className="breadcrumb-item active">Tasks</li>
                    </ol>
                </nav>
                <div className="d-flex align-items-center gap-2">
                    <div className="btn-group" role="group" aria-label="View toggle">
                        <button
                            type="button"
                            className={`btn btn-sm ${view === 'kanban' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setView('kanban')}
                        >
                            <i className="fa fa-table-columns me-1"></i>Kanban
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setView('table')}
                        >
                            <i className="fa fa-list me-1"></i>Table
                        </button>
                    </div>
                    {canManageTasks && (
                        <button type="button" className="btn btn-primary" onClick={openCreate}>
                            <i className="fa fa-plus me-2"></i>Add Task
                        </button>
                    )}
                </div>
            </div>

            {view === 'kanban' ? (
            <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5">
                {BOARD_COLUMNS.map((col) => {
                    const colTasks = tasks.filter(col.matches);
                    return (
                        <div className="col" key={col.key}>
                            <div className="card h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">{col.label}</span>
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary">{colTasks.length}</span>
                                </div>
                                <div
                                    className={`card-body d-flex flex-column gap-2 ${dragOverCol === col.key ? 'bg-primary bg-opacity-10' : ''}`}
                                    style={{ minHeight: 160 }}
                                    onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
                                    onDragLeave={() => setDragOverCol((cur) => (cur === col.key ? null : cur))}
                                    onDrop={(e) => { e.preventDefault(); handleDrop(col); }}
                                >
                                    {colTasks.length === 0 && (
                                        <div className="text-muted small text-center py-3">No tasks</div>
                                    )}
                                    {colTasks.map((task) => (
                                        <div
                                            key={task.uid}
                                            className="border rounded p-3"
                                            style={{ minHeight: 100, cursor: canTouch(task) ? 'grab' : 'pointer', opacity: draggedUid === task.uid ? 0.5 : 1 }}
                                            role="button"
                                            draggable={canTouch(task)}
                                            onDragStart={() => handleDragStart(task)}
                                            onDragEnd={() => { setDraggedUid(null); setDragOverCol(null); }}
                                            onClick={() => openDetail(task)}
                                        >
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <span className="fw-semibold">{task.title}</span>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link p-0 text-muted"
                                                        title="View task"
                                                        onClick={(e) => { e.stopPropagation(); router.visit(`/admin/tasks/${task.uid}`); }}
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            {task.details && (
                                                <p className="text-muted small mb-2 mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {task.details}
                                                </p>
                                            )}
                                            <div className="d-flex justify-content-between align-items-center mt-2">
                                                <span className="text-muted small">
                                                    <i className="fa fa-user me-1"></i>
                                                    {task.assigned_to_name ?? 'Unassigned'}
                                                </span>
                                                <span className="text-muted small">
                                                    {task.attachments.length > 0 && (
                                                        <span className="me-2"><i className="fa fa-paperclip me-1"></i>{task.attachments.length}</span>
                                                    )}
                                                    {task.remark && <i className="fa fa-message"></i>}
                                                </span>
                                            </div>
                                            {task.due_date && (
                                                <div className={`small mt-2 pt-2 border-top ${isOverdue(task) ? 'text-danger' : 'text-muted'}`}>
                                                    <i className="fa fa-calendar me-1"></i>
                                                    Due {formatDueDate(task.due_date)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            ) : (
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Type of Task</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Due Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 && (
                                <tr><td colSpan={6} className="text-center text-muted py-4">No tasks</td></tr>
                            )}
                            {tasks.map((task) => (
                                <tr key={task.uid} role="button" onClick={() => openDetail(task)}>
                                    <td>{task.title}</td>
                                    <td><span className={`badge ${PRIORITY_BADGE[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span></td>
                                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{STATUS_LABEL[task.status]}</span></td>
                                    <td>{task.assigned_to_name ?? 'Unassigned'}</td>
                                    <td className={isOverdue(task) ? 'text-danger' : ''}>{task.due_date ? formatDueDate(task.due_date) : '—'}</td>
                                    <td className="text-end">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link p-0 text-muted"
                                            title="View task"
                                            onClick={(e) => { e.stopPropagation(); router.visit(`/admin/tasks/${task.uid}`); }}
                                        >
                                            <i className="fa fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            )}

            {history.length > 0 && (
                <div className="card mt-4">
                    <div className="card-header">
                        <span className="fw-semibold">History</span>
                        <span className="text-muted small ms-2">Tasks completed earlier this month</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Title</th>
                                    <th>Type of Task</th>
                                    <th>Assigned To</th>
                                    <th>Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((task) => (
                                    <tr key={task.uid} role="button" onClick={() => router.visit(`/admin/tasks/${task.uid}`)}>
                                        <td>{task.title}</td>
                                        <td><span className={`badge ${PRIORITY_BADGE[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span></td>
                                        <td>{task.assigned_to_name ?? 'Unassigned'}</td>
                                        <td className="text-muted small">{task.status_updated_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(showCreate || editingTask) && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingTask ? 'Edit Task' : 'Add Task'}</h5>
                                <button type="button" className="btn-close" onClick={closeForm}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                    {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                                </div>

                                <div className="col-sm-6">
                                    <DatePicker
                                        label="Due Date"
                                        value={form.due_date}
                                        onChange={(date) => setForm({ ...form, due_date: date })}
                                        minDate={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
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
                                        <label className="form-label">Type of Task</label>
                                        <select
                                            className="form-select"
                                            value={form.priority}
                                            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                                        >
                                            {priorities.map((p) => (
                                                <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
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
                                    <label className="form-label">Attachments</label>
                                    <input
                                        type="file"
                                        multiple
                                        className="form-control"
                                        onChange={(e) => setFormFiles(Array.from(e.target.files ?? []))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitForm}
                                    disabled={saving || !form.title.trim()}
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {detailTask && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{detailTask.title}</h5>
                                <button type="button" className="btn-close" onClick={() => setDetailTask(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <span className={`badge ${PRIORITY_BADGE[detailTask.priority]}`}>{PRIORITY_LABEL[detailTask.priority]}</span>
                                    <span className="badge bg-primary bg-opacity-10 text-primary">{STATUS_LABEL[detailTask.status]}</span>
                                    {detailTask.due_date && (
                                        <span className={`badge ${isOverdue(detailTask) ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                            Due {formatDueDate(detailTask.due_date)}
                                        </span>
                                    )}
                                </div>

                                {detailTask.details && (
                                    <p className="text-muted">{detailTask.details}</p>
                                )}

                                <div className="row small text-muted mb-3 align-items-center">
                                    <div className="col-sm-6 mb-2 mb-sm-0">Created by: <strong>{detailTask.created_by_name}</strong> on {detailTask.created_at}</div>
                                    <div className="col-sm-6">
                                        {canManageTasks ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <span>Assigned to:</span>
                                                <select
                                                    className="form-select form-select-sm w-auto"
                                                    value={detailTask.assigned_to_uid ?? ''}
                                                    onChange={(e) => reassign(detailTask, e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {staffOptions.map((s) => (
                                                        <option key={s.uid} value={s.uid}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center gap-2">
                                                <span>Assigned to: <strong>{detailTask.assigned_to_name ?? 'Unassigned'}</strong></span>
                                                {!detailTask.assigned_to_uid && (
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => assignToMe(detailTask)}>
                                                        Assign to Me
                                                    </button>
                                                )}
                                                {detailTask.assigned_to_uid === currentStaffUid && (
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => unassign(detailTask)}>
                                                        Unassign
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {canTouch(detailTask) && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold">Move to</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {BOARD_COLUMNS.map((col) => (
                                                <button
                                                    key={col.key}
                                                    type="button"
                                                    className={`btn btn-sm ${col.matches(detailTask) ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    onClick={() => {
                                                        moveStatus(detailTask, col.target);
                                                        setDetailTask({ ...detailTask, status: col.target.status, priority: col.target.priority ?? detailTask.priority });
                                                    }}
                                                >
                                                    {col.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Attachments</label>
                                    {detailTask.attachments.length > 0 ? (
                                        <ul className="list-group mb-2">
                                            {detailTask.attachments.map((a) => (
                                                <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <a href={a.file_path} target="_blank" rel="noreferrer">
                                                        <i className="fa fa-paperclip me-2"></i>{a.file_name}
                                                    </a>
                                                    {canTouch(detailTask) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => deleteAttachment(detailTask, a)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-muted small mb-2">No attachments</div>
                                    )}
                                    {canTouch(detailTask) && (
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

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Remark</label>
                                    {canTouch(detailTask) ? (
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
                                        <p className="text-muted">{detailTask.remark || 'No remark yet'}</p>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">Notes</label>
                                    {detailTask.notes.length > 0 ? (
                                        <ul className="list-group mb-2">
                                            {detailTask.notes.map((n) => (
                                                <li key={n.id} className="list-group-item px-0">
                                                    <p className="mb-1">{n.note}</p>
                                                    <small className="text-muted">by {n.author_name || 'Unknown'} on {n.created_at}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-muted small mb-2">No notes yet</div>
                                    )}
                                    {canTouch(detailTask) && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => { setNoteDraft(''); setShowNoteModal(true); }}
                                        >
                                            <i className="fa fa-plus me-1"></i>Add Note
                                        </button>
                                    )}
                                </div>
                            </div>
                            {canManageTasks && (
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-danger me-auto" onClick={() => deleteTask(detailTask)}>
                                        Delete Task
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => openEdit(detailTask)}>
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showNoteModal && detailTask && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Note</h5>
                                <button type="button" className="btn-close" onClick={() => setShowNoteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    placeholder="Enter your note..."
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNoteModal(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitNote}
                                    disabled={savingNote || !noteDraft.trim()}
                                >
                                    {savingNote ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!pendingAssign}
                title={pendingAssign?.staffUid ? 'Confirm Assignment' : 'Confirm Unassignment'}
                message={
                    pendingAssign?.staffUid
                        ? `Are you sure you want to assign "${pendingAssign.task.title}" to ${pendingAssign.staffName}?`
                        : `Are you sure you want to unassign "${pendingAssign?.task.title ?? ''}" from ${pendingAssign?.staffName ?? ''}?`
                }
                onConfirm={confirmAssign}
                onCancel={() => setPendingAssign(null)}
                confirmText={pendingAssign?.staffUid ? 'Yes, Assign' : 'Yes, Unassign'}
                confirmVariant="primary"
            />
        </div>
    );
}

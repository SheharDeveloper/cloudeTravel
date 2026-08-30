import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import DataTable from 'datatables.net-buttons-bs5';
import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.css';

let dataTableExportsConfigured = false;

// DataTables' Buttons export wiring touches browser globals, so it must
// only ever run client-side — never during Inertia's SSR render pass.
function ensureDataTableExportsConfigured() {
    if (dataTableExportsConfigured || typeof window === 'undefined') return;
    dataTableExportsConfigured = true;
    pdfMake.addVirtualFileSystem(pdfFonts);
    (DataTable as any).Buttons.jszip(JSZip);
    (DataTable as any).Buttons.pdfMake(pdfMake);
}

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'address', label: 'Address' },
    { key: 'passport', label: 'Passport & Visa' },
    { key: 'family', label: 'Family Details' },
    { key: 'documents', label: 'Documents' },
    { key: 'call-history', label: 'Call History' },
];

const formatDocType = (type: string) => {
    if (!type) return 'Other';
    return type
        .replace(/[_-]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

const FILE_TYPE_META: Record<string, { icon: string; bg: string; color: string }> = {
    pdf: { icon: 'fa-file-pdf', bg: '#fdecea', color: '#dc3545' },
    doc: { icon: 'fa-file-word', bg: '#e7f1ff', color: '#0d6efd' },
    docx: { icon: 'fa-file-word', bg: '#e7f1ff', color: '#0d6efd' },
    xls: { icon: 'fa-file-excel', bg: '#e6f7ec', color: '#198754' },
    xlsx: { icon: 'fa-file-excel', bg: '#e6f7ec', color: '#198754' },
    csv: { icon: 'fa-file-csv', bg: '#fde8f3', color: '#d6336c' },
    ppt: { icon: 'fa-file-powerpoint', bg: '#fff1e6', color: '#fd7e14' },
    pptx: { icon: 'fa-file-powerpoint', bg: '#fff1e6', color: '#fd7e14' },
    html: { icon: 'fa-file-code', bg: '#fff1e6', color: '#fd7e14' },
    txt: { icon: 'fa-file-lines', bg: '#eef0f2', color: '#6c757d' },
    mp3: { icon: 'fa-file-audio', bg: '#f1ecfb', color: '#6f42c1' },
    mp4: { icon: 'fa-file-video', bg: '#f1ecfb', color: '#6f42c1' },
    jpg: { icon: 'fa-file-image', bg: '#e6f7ec', color: '#198754' },
    jpeg: { icon: 'fa-file-image', bg: '#e6f7ec', color: '#198754' },
    png: { icon: 'fa-file-image', bg: '#e6f7ec', color: '#198754' },
    gif: { icon: 'fa-file-image', bg: '#e6f7ec', color: '#198754' },
};

const fileTypeMeta = (fileType: string) =>
    FILE_TYPE_META[(fileType || '').toLowerCase()] || { icon: 'fa-file', bg: '#eef0f2', color: '#6c757d' };

const timeAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
};

type ClientFolder = { id: number; parent_id: number | null; name: string };
type DeleteTarget = { type: 'document' | 'folder'; id: number };

const buildBreadcrumbs = (folders: ClientFolder[], currentId: number | null): ClientFolder[] => {
    const trail: ClientFolder[] = [];
    let id = currentId;
    while (id !== null) {
        const folder = folders.find((f) => f.id === id);
        if (!folder) break;
        trail.unshift(folder);
        id = folder.parent_id;
    }
    return trail;
};

function DocumentsGrid({ clientUid, documents, folders }: { clientUid: string; documents: any[]; folders: ClientFolder[] }) {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [documentType, setDocumentType] = useState('other');
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [folderProcessing, setFolderProcessing] = useState(false);
    const [folderError, setFolderError] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const breadcrumbs = buildBreadcrumbs(folders, currentFolderId);
    const subFolders = folders.filter((f) => f.parent_id === currentFolderId);
    const filesInView = documents.filter((d) => (d.folder_id ?? null) === currentFolderId);

    const folderItemCount = (folderId: number) => {
        const folderCount = folders.filter((f) => f.parent_id === folderId).length;
        const fileCount = documents.filter((d) => (d.folder_id ?? null) === folderId).length;
        return folderCount + fileCount;
    };

    const upload = () => {
        if (files.length === 0) return;
        setProcessing(true);
        setError('');

        const formData = new FormData();
        formData.append('document_type', documentType);
        if (currentFolderId !== null) formData.append('folder_id', String(currentFolderId));
        files.forEach((f) => formData.append('files[]', f));

        router.post(`/admin/clients/${clientUid}/documents`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setFiles([]);
                setShowUploadModal(false);
            },
            onError: (err: any) => setError(err.files || err['files.0'] || 'Upload failed'),
            onFinish: () => setProcessing(false),
        });
    };

    const removeDocument = (id: number) => {
        router.delete(`/admin/client-documents/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const removeFolder = (id: number) => {
        router.delete(`/admin/client-folders/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const createFolder = () => {
        if (!folderName.trim()) return;
        setFolderProcessing(true);
        setFolderError('');

        router.post(
            `/admin/clients/${clientUid}/folders`,
            { name: folderName.trim(), parent_id: currentFolderId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFolderName('');
                    setShowFolderModal(false);
                },
                onError: (err: any) => setFolderError(err.name || 'Could not create folder'),
                onFinish: () => setFolderProcessing(false),
            }
        );
    };

    return (
        <div className="card h-auto">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h6 className="card-title mb-0">Documents</h6>
                <div className="d-flex align-items-center gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setShowFolderModal(true)}>
                        <i className="fa fa-folder-plus me-2"></i>Create Folder
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setShowUploadModal(true)}>
                        <i className="fa fa-upload me-2"></i>Upload File
                    </button>
                    <div className="btn-group btn-group-sm" role="group">
                        <button type="button" className={`btn ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setView('list')} title="List view">
                            <i className="fa fa-list"></i>
                        </button>
                        <button type="button" className={`btn ${view === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setView('grid')} title="Grid view">
                            <i className="fa fa-table-cells"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <nav aria-label="folder breadcrumb" className="mb-3">
                    <ol className="breadcrumb mb-0">
                        <li className={`breadcrumb-item ${currentFolderId === null ? 'active' : ''}`}>
                            {currentFolderId === null ? (
                                <span><i className="fa fa-house me-1"></i>Home</span>
                            ) : (
                                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentFolderId(null); }}>
                                    <i className="fa fa-house me-1"></i>Home
                                </a>
                            )}
                        </li>
                        {breadcrumbs.map((folder, idx) => (
                            <li key={folder.id} className={`breadcrumb-item ${idx === breadcrumbs.length - 1 ? 'active' : ''}`}>
                                {idx === breadcrumbs.length - 1 ? (
                                    folder.name
                                ) : (
                                    <a href="#" onClick={(e) => { e.preventDefault(); setCurrentFolderId(folder.id); }}>{folder.name}</a>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <p className="text-muted small mb-3">
                    {subFolders.length} {subFolders.length === 1 ? 'Folder' : 'Folders'}, {filesInView.length} {filesInView.length === 1 ? 'File' : 'Files'}
                </p>

                {subFolders.length === 0 && filesInView.length === 0 ? (
                    <p className="text-muted small mb-0">This folder is empty</p>
                ) : view === 'grid' ? (
                    <div className="row g-3">
                        {subFolders.map((folder) => (
                            <div className="col-sm-6 col-lg-3" key={`folder-${folder.id}`}>
                                <div className="border rounded p-3 h-100 position-relative">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-1"
                                        title="Delete folder"
                                        onClick={() => setDeleteTarget({ type: 'folder', id: folder.id })}
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setCurrentFolderId(folder.id); }} className="text-decoration-none text-body">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded mb-2"
                                            style={{ width: 44, height: 44, backgroundColor: '#fff8e1' }}
                                        >
                                            <i className="fa fa-folder" style={{ color: '#f0ad4e' }}></i>
                                        </div>
                                        <div className="text-truncate fw-semibold" title={folder.name}>{folder.name}</div>
                                        <div className="text-muted small">{folderItemCount(folder.id)} item{folderItemCount(folder.id) === 1 ? '' : 's'}</div>
                                    </a>
                                </div>
                            </div>
                        ))}
                        {filesInView.map((doc) => {
                            const meta = fileTypeMeta(doc.file_type);
                            return (
                                <div className="col-sm-6 col-lg-3" key={`doc-${doc.id}`}>
                                    <div className="border rounded p-3 h-100 position-relative">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-1"
                                            title="Delete"
                                            onClick={() => setDeleteTarget({ type: 'document', id: doc.id })}
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                        <a href={doc.file_path} target="_blank" rel="noreferrer" className="text-decoration-none text-body">
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded mb-2"
                                                style={{ width: 44, height: 44, backgroundColor: meta.bg }}
                                            >
                                                <i className={`fa ${meta.icon}`} style={{ color: meta.color }}></i>
                                            </div>
                                            <div className="text-truncate fw-semibold" title={doc.document_name}>{doc.document_name}</div>
                                            <div className="text-muted small">{timeAgo(doc.created_at)}</div>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {subFolders.map((folder) => (
                            <li key={`folder-${folder.id}`} className="list-group-item d-flex align-items-center justify-content-between px-0">
                                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentFolderId(folder.id); }} className="d-flex align-items-center text-decoration-none text-body">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded me-3 flex-shrink-0"
                                        style={{ width: 36, height: 36, backgroundColor: '#fff8e1' }}
                                    >
                                        <i className="fa fa-folder" style={{ color: '#f0ad4e' }}></i>
                                    </div>
                                    <div>
                                        <div className="fw-semibold">{folder.name}</div>
                                        <div className="text-muted small">{folderItemCount(folder.id)} item{folderItemCount(folder.id) === 1 ? '' : 's'}</div>
                                    </div>
                                </a>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget({ type: 'folder', id: folder.id })}>
                                    <i className="fa fa-trash"></i>
                                </button>
                            </li>
                        ))}
                        {filesInView.map((doc) => {
                            const meta = fileTypeMeta(doc.file_type);
                            return (
                                <li key={`doc-${doc.id}`} className="list-group-item d-flex align-items-center justify-content-between px-0">
                                    <a href={doc.file_path} target="_blank" rel="noreferrer" className="d-flex align-items-center text-decoration-none text-body">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded me-3 flex-shrink-0"
                                            style={{ width: 36, height: 36, backgroundColor: meta.bg }}
                                        >
                                            <i className={`fa ${meta.icon}`} style={{ color: meta.color }}></i>
                                        </div>
                                        <div>
                                            <div className="fw-semibold">{doc.document_name}</div>
                                            <div className="text-muted small">{formatDocType(doc.document_type)} &middot; {timeAgo(doc.created_at)}</div>
                                        </div>
                                    </a>
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget({ type: 'document', id: doc.id })}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {showUploadModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload File</h5>
                                    <button type="button" className="btn-close" onClick={() => { setShowUploadModal(false); setFiles([]); setError(''); }}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small">Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Invoice, Signed Document, Other"
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label small">Files</label>
                                        <input type="file" multiple className="form-control" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
                                    </div>
                                    {error && <small className="text-danger">{error}</small>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowUploadModal(false); setFiles([]); setError(''); }}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={upload} disabled={processing || files.length === 0}>
                                        {processing ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showFolderModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Create Folder</h5>
                                    <button type="button" className="btn-close" onClick={() => { setShowFolderModal(false); setFolderName(''); setFolderError(''); }}></button>
                                </div>
                                <div className="modal-body">
                                    <label className="form-label small">Folder Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={folderName}
                                        autoFocus
                                        onChange={(e) => setFolderName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') createFolder(); }}
                                    />
                                    {folderError && <small className="text-danger">{folderError}</small>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowFolderModal(false); setFolderName(''); setFolderError(''); }}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={createFolder} disabled={folderProcessing || !folderName.trim()}>
                                        {folderProcessing ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {deleteTarget !== null && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)}></button>
                                </div>
                                <div className="modal-body">
                                    {deleteTarget.type === 'folder'
                                        ? 'Are you sure you want to delete this folder? Everything inside it will be deleted too.'
                                        : 'Are you sure you want to delete this file?'}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => (deleteTarget.type === 'folder' ? removeFolder(deleteTarget.id) : removeDocument(deleteTarget.id))}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

type Communication = {
    id: number;
    description: string;
    created_at: string;
    causer: { name: string } | null;
    can_manage: boolean;
};

type CallHistoryRow = { id: number; details: string; description: string; can_manage: boolean };

const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

function CallHistoryTable({ clientUid, communications }: { clientUid: string; communications: Communication[] }) {
    const tableRef = useRef<HTMLTableElement>(null);
    const dtRef = useRef<any>(null);
    const [description, setDescription] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState<{ id: number; description: string } | null>(null);
    const [editDescription, setEditDescription] = useState('');
    const [editProcessing, setEditProcessing] = useState(false);
    const [editError, setEditError] = useState('');

    const { auth } = usePage().props as any;
    const currentEmployeeName = auth?.user?.name ?? 'You';
    const currentEmployeeId = auth?.user?.id ?? '-';

    const rowsFor = (list: Communication[]): CallHistoryRow[] =>
        list.map((c) => ({
            id: c.id,
            details: `<div class="fw-semibold">${escapeHtml(formatDateTime(c.created_at))}</div><div class="text-muted small">${escapeHtml(c.causer?.name ?? 'Unknown')}</div>`,
            description: c.description,
            can_manage: c.can_manage,
        }));

    const submit = () => {
        if (!description.trim()) return;
        setProcessing(true);
        setError('');

        router.post(
            `/admin/clients/${clientUid}/communications`,
            { description: description.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDescription('');
                    setShowAddModal(false);
                },
                onError: (err: any) => setError(err.description || 'Could not add communication'),
                onFinish: () => setProcessing(false),
            }
        );
    };

    const remove = (id: number) => {
        router.delete(`/admin/client-communications/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    const openEdit = (id: number, currentDescription: string) => {
        setEditTarget({ id, description: currentDescription });
        setEditDescription(currentDescription);
        setEditError('');
    };

    const submitEdit = () => {
        if (!editTarget || !editDescription.trim()) return;
        setEditProcessing(true);
        setEditError('');

        router.put(
            `/admin/client-communications/${editTarget.id}`,
            { description: editDescription.trim() },
            {
                preserveScroll: true,
                onSuccess: () => setEditTarget(null),
                onError: (err: any) => setEditError(err.description || 'Could not update communication'),
                onFinish: () => setEditProcessing(false),
            }
        );
    };

    useEffect(() => {
        if (!tableRef.current) return;

        ensureDataTableExportsConfigured();

        const dt = new (DataTable as any)(tableRef.current, {
            data: rowsFor(communications),
            columns: [
                { title: 'Details', data: 'details' },
                { title: 'Description', data: 'description', render: (DataTable as any).render.text() },
                {
                    title: 'Action',
                    data: null,
                    orderable: false,
                    className: 'text-end',
                    render: (_data: unknown, _type: unknown, row: CallHistoryRow) =>
                        row.can_manage
                            ? '<button type="button" class="btn btn-sm btn-outline-primary call-history-edit me-1"><i class="fa fa-pen"></i></button>' +
                              '<button type="button" class="btn btn-sm btn-outline-danger call-history-delete"><i class="fa fa-trash"></i></button>'
                            : '<span class="text-muted small">&mdash;</span>',
                },
            ],
            order: [],
            dom: 'Bfrtip',
            buttons: ['copy', 'excel', 'csv', 'pdf'],
        });

        dtRef.current = dt;

        const handleClick = (e: Event) => {
            const editTrigger = (e.target as HTMLElement).closest('.call-history-edit');
            const deleteTrigger = (e.target as HTMLElement).closest('.call-history-delete');
            const trigger = editTrigger || deleteTrigger;
            if (!trigger) return;
            const row = trigger.closest('tr');
            if (!row) return;
            const rowData = dt.row(row).data() as CallHistoryRow | undefined;
            if (!rowData) return;
            if (editTrigger) {
                openEdit(rowData.id, rowData.description);
            } else {
                setDeleteId(rowData.id);
            }
        };

        tableRef.current.addEventListener('click', handleClick);

        return () => {
            tableRef.current?.removeEventListener('click', handleClick);
            dt.destroy();
            dtRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dtRef.current) return;
        dtRef.current.clear();
        dtRef.current.rows.add(rowsFor(communications)).draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [communications]);

    return (
        <div className="card h-auto">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h6 className="card-title mb-0">Call History</h6>
                <button type="button" className="btn btn-sm btn-success" onClick={() => setShowAddModal(true)}>
                    <i className="fa fa-plus me-2"></i>Add New Communication
                </button>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table ref={tableRef} className="table table-hover w-100"></table>
                </div>
            </div>

            {showAddModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Communication</h5>
                                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setDescription(''); setError(''); }}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-2">
                                    <div className="col-sm-6">
                                        <label className="form-label small">DateTime</label>
                                        <input type="text" className="form-control" value={formatDateTime(new Date().toISOString())} disabled readOnly />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label small">Employee Name</label>
                                        <input type="text" className="form-control" value={currentEmployeeName} disabled readOnly />
                                    </div>
                                    <div className="col-sm-3">
                                        <label className="form-label small">Employee Id</label>
                                        <input type="text" className="form-control" value={currentEmployeeId} disabled readOnly />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={description}
                                            autoFocus
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                    {error && <div className="col-12"><small className="text-danger">{error}</small></div>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowAddModal(false); setDescription(''); setError(''); }}>Cancel</button>
                                <button type="button" className="btn btn-success" onClick={submit} disabled={processing || !description.trim()}>
                                    {processing ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteId !== null && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteId(null)}></button>
                            </div>
                            <div className="modal-body">Are you sure you want to delete this communication?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={() => remove(deleteId)}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editTarget !== null && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Communication</h5>
                                <button type="button" className="btn-close" onClick={() => setEditTarget(null)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label small">Description</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={editDescription}
                                    autoFocus
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                                {editError && <small className="text-danger">{editError}</small>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditTarget(null)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={submitEdit} disabled={editProcessing || !editDescription.trim()}>
                                    {editProcessing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClientShow() {
    const { client } = usePage().props as any;
    const [activeTab, setActiveTab] = useState('overview');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const address = client?.address;
    const passport = client?.passport;
    const familyMembers = client?.family_members || [];
    const documents = client?.documents || [];
    const folders = client?.folders || [];
    const communications = client?.communications || [];

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: '2-digit' });
    };

    const handleDelete = () => {
        router.delete(`/admin/clients/${client.uid}`, {
            onSuccess: () => router.visit('/admin/clients'),
        });
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Client Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/clients">Client Management</a></li>
                        <li className="breadcrumb-item active">{client.name}</li>
                    </ol>
                </nav>
            </div>

            <div className="card border-top-0 border-start-0 border-end-0 rounded-0 h-auto mb-4">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div>
                            <h3 className="fw-semibold mb-2">{client.name}</h3>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                <span className={`badge ${client.status === 'active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'} text-capitalize`}>
                                    {client.status}
                                </span>
                                {client.nationality && (
                                    <span className="badge bg-info bg-opacity-10 text-info-emphasis">{client.nationality}</span>
                                )}
                            </div>
                            <p className="text-muted small mb-0">
                                {client.email || 'No email'} &middot; {client.phone || 'No phone'}
                            </p>
                        </div>

                        <div className="d-flex gap-2">
                            <button onClick={() => router.visit(`/admin/clients/${client.uid}/edit`)} className="btn btn-primary btn-sm">
                                <i className="fa fa-edit me-2"></i>Edit
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-outline-danger btn-sm">
                                <i className="fa fa-trash me-2"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                    {activeTab === 'overview' && (
                        <div className="card h-auto">
                            <div className="card-header"><h6 className="card-title mb-0">Overview</h6></div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-muted small">Full Name</div>
                                        <div>{client.name}</div>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-muted small">Email</div>
                                        <div>{client.email || 'N/A'}</div>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-muted small">Phone</div>
                                        <div>{client.phone || 'N/A'}</div>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-muted small">Nationality</div>
                                        <div>{client.nationality || 'N/A'}</div>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-muted small">Gender</div>
                                        <div className="text-capitalize">{client.gender || 'N/A'}</div>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="text-muted small">Date of Birth</div>
                                        <div>{formatDate(client.dob)}</div>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <div className="text-muted small">Notes</div>
                                        <div>{client.notes || 'No notes'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'address' && (
                        <div className="card h-auto">
                            <div className="card-header"><h6 className="card-title mb-0">Address</h6></div>
                            <div className="card-body">
                                {address ? (
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <div className="text-muted small">Address</div>
                                            <div>{address.address || 'N/A'}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">City</div>
                                            <div>{address.city || 'N/A'}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">State</div>
                                            <div>{address.state || 'N/A'}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Country</div>
                                            <div>{address.country || 'N/A'}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Zip Code</div>
                                            <div>{address.zip_code || 'N/A'}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted mb-0">No address on record</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'passport' && (
                        <div className="card h-auto">
                            <div className="card-header"><h6 className="card-title mb-0">Passport &amp; Visa</h6></div>
                            <div className="card-body">
                                {passport ? (
                                    <div className="row">
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Passport Number</div>
                                            <div>{passport.passport_number || 'N/A'}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Place of Issue</div>
                                            <div>{passport.place_of_issue || 'N/A'}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Date of Issue</div>
                                            <div>{formatDate(passport.date_of_issue)}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Expiry Date</div>
                                            <div>{formatDate(passport.expiry_date)}</div>
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Passport Front</div>
                                            {passport.front_image ? (
                                                <a href={passport.front_image} target="_blank" rel="noreferrer">View File</a>
                                            ) : <div>N/A</div>}
                                        </div>
                                        <div className="col-sm-6 mb-3">
                                            <div className="text-muted small">Passport Back</div>
                                            {passport.back_image ? (
                                                <a href={passport.back_image} target="_blank" rel="noreferrer">View File</a>
                                            ) : <div>N/A</div>}
                                        </div>
                                        <div className="col-12"><hr /></div>
                                        <div className="col-sm-4 mb-3">
                                            <div className="text-muted small">Foreign National</div>
                                            <div>{passport.is_foreigner ? 'Yes' : 'No'}</div>
                                        </div>
                                        {passport.is_foreigner && (
                                            <>
                                                <div className="col-sm-4 mb-3">
                                                    <div className="text-muted small">Visa Type</div>
                                                    <div className="text-capitalize">{passport.visa_type || 'N/A'}</div>
                                                </div>
                                                <div className="col-sm-4 mb-3">
                                                    <div className="text-muted small">Visa Number</div>
                                                    <div>{passport.visa_number || 'N/A'}</div>
                                                </div>
                                                <div className="col-sm-4 mb-3">
                                                    <div className="text-muted small">Visa Expiry</div>
                                                    <div>{formatDate(passport.visa_expiry_date)}</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-muted mb-0">No passport on record</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'family' && (
                        <div className="card h-auto">
                            <div className="card-header"><h6 className="card-title mb-0">Family Details</h6></div>
                            <div className="card-body">
                                {familyMembers.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Relation</th>
                                                    <th>Date of Birth</th>
                                                    <th>Passport Number</th>
                                                    <th>ID Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {familyMembers.map((m: any) => (
                                                    <tr key={m.id}>
                                                        <td>{m.name}</td>
                                                        <td>{m.relation || 'N/A'}</td>
                                                        <td>{formatDate(m.dob)}</td>
                                                        <td>{m.passport_number || 'N/A'}</td>
                                                        <td>{m.id_number || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted mb-0">No family members on record</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <DocumentsGrid clientUid={client.uid} documents={documents} folders={folders} />
                    )}

                    {activeTab === 'call-history' && (
                        <CallHistoryTable clientUid={client.uid} communications={communications} />
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this client? This also removes their address, passport, and family details.
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

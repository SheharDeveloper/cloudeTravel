import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import ReceivedDocumentsPanel, { type ReceivedDocumentClient, type ReceivedDocumentRow } from '@/components/ReceivedDocumentsPanel';

interface Props {
    documents: {
        data: ReceivedDocumentRow[];
        from: number | null;
        to: number | null;
        total: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    clients: ReceivedDocumentClient[];
    filters: { search: string };
    flash?: { success?: string | null };
}

/**
 * Client Documents: the physical documents clients hand over (passport,
 * travel document…) — received on, remarks, returned on — with Add
 * Document, Return Document, Send Notification (email + portal notice) and Delete.
 */
export default function ReceivedDocumentsIndex() {
    const { documents, clients, filters, flash } = usePage().props as unknown as Props;
    const [search, setSearch] = useState(filters.search);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { id: `${flash.success}-${Date.now()}` });
    }, [flash?.success]);

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/received-documents', search.trim() ? { search: search.trim() } : {}, { preserveState: true, replace: true });
    };

    return (
        <ProtectedRoute>
            <Head title="Client Documents" />

            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Client Documents</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/clients">Clients</a></li>
                        <li className="breadcrumb-item active">Client Documents</li>
                    </ol>
                </nav>
            </div>

            <div className="card h-auto">
                <ReceivedDocumentsPanel
                    documents={documents.data}
                    startIndex={documents.from ?? 1}
                    clients={clients}
                    emptyText={filters.search ? 'No documents found' : undefined}
                    toolbar={
                        <form className="row mb-3" onSubmit={submitSearch}>
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by client name, client ID, phone or document..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 text-end">
                                <button type="submit" className="btn btn-primary"><i className="fa fa-search"></i> Search</button>
                            </div>
                        </form>
                    }
                    footer={documents.data.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-top pt-3">
                            <small className="text-muted">Showing {documents.from} to {documents.to} of {documents.total} entries</small>
                            {documents.last_page > 1 && (
                                <ul className="pagination mb-0">
                                    {documents.links.map((link, idx) => (
                                        <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${link.url ? '' : 'disabled'}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => link.url && router.visit(link.url, { preserveState: true, preserveScroll: true })}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                />
            </div>

            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

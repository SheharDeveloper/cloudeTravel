import ClientLayout from '@/layouts/client/ClientLayout';

interface ReceivedDocument {
    uid: string;
    document_name: string;
    received_at: string | null;
    remarks: string | null;
    returned_at: string | null;
    notified_at: string | null;
}

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

/** My Documents: the documents the client handed to the agency, and when they were returned. */
export default function ClientDocuments({ documents }: { documents: ReceivedDocument[] }) {
    // The agency's latest "Send Notification", as a notice at the top
    const latest = documents.filter((d) => d.notified_at).sort((a, b) => (b.notified_at ?? '').localeCompare(a.notified_at ?? ''))[0];

    return (
        <ClientLayout title="My Documents">
            {latest && (
                <div className={`alert ${latest.returned_at ? 'alert-success' : 'alert-info'} d-flex align-items-start gap-2`}>
                    <i className="fa fa-bell mt-1"></i>
                    <div>
                        {latest.returned_at ? (
                            <>Your document <strong>{latest.document_name}</strong> was returned to you on <strong>{formatDateTime(latest.returned_at)}</strong>.</>
                        ) : (
                            <>We received your document <strong>{latest.document_name}</strong> on <strong>{formatDateTime(latest.received_at)}</strong> and are keeping it safe.</>
                        )}
                        <small className="d-block text-muted">Sent {formatDateTime(latest.notified_at)}</small>
                    </div>
                </div>
            )}

            <div className="card h-auto">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Documents with us</h6>
                    <span className="badge bg-primary">{documents.length}</span>
                </div>
                <div className="card-body p-0">
                    {documents.length === 0 ? (
                        <div className="text-center text-muted py-5">
                            <i className="fa fa-folder-open" style={{ fontSize: 40, color: '#ccc' }}></i>
                            <p className="mt-3 mb-0">You have not handed us any documents.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Document</th>
                                        <th>Received On</th>
                                        <th>Remarks</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((d) => (
                                        <tr key={d.uid}>
                                            <td className="fw-semibold">{d.document_name}</td>
                                            <td>{formatDateTime(d.received_at)}</td>
                                            <td style={{ whiteSpace: 'pre-wrap', maxWidth: 320 }}>{d.remarks || '—'}</td>
                                            <td>
                                                {d.returned_at ? (
                                                    <span className="badge bg-success">Returned {formatDateTime(d.returned_at)}</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">With the agency</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}

import { useState } from 'react';
import { router } from '@inertiajs/react';

interface LeaveRequest {
    batch_id: string;
    staff_uid: string;
    staff_name: string;
    start_date: string;
    end_date: string;
    reason: string;
    applied_at: string;
}

export default function LeaveRequestsIndex({ requests }: { requests: LeaveRequest[] }) {
    const [processingBatch, setProcessingBatch] = useState<string | null>(null);

    const respond = (request: LeaveRequest, approve: boolean) => {
        setProcessingBatch(request.batch_id);
        router.post(`/admin/attendance/${request.staff_uid}/leave-response`, {
            batch_id: request.batch_id,
            approve,
        }, {
            preserveScroll: true,
            onFinish: () => setProcessingBatch(null),
        });
    };

    const formatRange = (start: string, end: string) => {
        if (start === end) return new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        return `${new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Leave Requests</h1></li>
                        <li className="breadcrumb-item active">Leave Requests</li>
                    </ol>
                </nav>
            </div>

            <div className="card">
                <div className="card-header">
                    <h6 className="card-title mb-0">Pending Requests</h6>
                </div>
                <div className="card-body">
                    {requests.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Staff</th>
                                        <th>Dates</th>
                                        <th>Reason</th>
                                        <th>Applied</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((r) => (
                                        <tr key={r.batch_id}>
                                            <td className="fw-semibold">{r.staff_name}</td>
                                            <td>{formatRange(r.start_date, r.end_date)}</td>
                                            <td className="text-muted">{r.reason}</td>
                                            <td className="text-muted small">{r.applied_at}</td>
                                            <td className="text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => respond(r, true)}
                                                        disabled={processingBatch === r.batch_id}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => respond(r, false)}
                                                        disabled={processingBatch === r.batch_id}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-muted py-5">
                            <i className="fa fa-check-circle d-block mb-2" style={{ fontSize: 32 }}></i>
                            No pending leave requests
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

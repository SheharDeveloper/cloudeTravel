import type { Agency } from '../types';

const statusBadge: Record<string, string> = {
    Active: 'badge-success',
    Pending: 'badge-warning',
    Suspended: 'badge-danger',
};

interface Props {
    agencies: Agency[];
    onEdit: (agency: Agency) => void;
    onDelete: (id: number) => void;
}

export default function AgencyList({ agencies, onEdit, onDelete }: Props) {
    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Agency Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {agencies.map((a) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="avatar avatar-sm bg-primary bg-opacity-10 rounded-circle me-2">
                                        <i className="fa-solid fa-building text-primary"></i>
                                    </div>
                                    <span className="fw-semibold">{a.name}</span>
                                </div>
                            </td>
                            <td>{a.email}</td>
                            <td>{a.phone}</td>
                            <td>{a.joined}</td>
                            <td>
                                <span className={`badge light ${statusBadge[a.status]}`}>
                                    {a.status}
                                </span>
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-xs" onClick={() => onEdit(a)}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button className="btn btn-danger btn-xs" onClick={() => onDelete(a.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {agencies.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-muted">No agencies found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

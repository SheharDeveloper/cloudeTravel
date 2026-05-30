import type { Agency } from '../types';

const statusColor: Record<string, string> = {
    Active: 'success',
    Pending: 'warning',
    Suspended: 'danger',
};

interface Props {
    agencies: Agency[];
    onEdit: (agency: Agency) => void;
    onDelete: (id: number) => void;
}

export default function AgencyGrid({ agencies, onEdit, onDelete }: Props) {
    if (agencies.length === 0) {
        return <p className="text-center text-muted py-4">No agencies found.</p>;
    }

    return (
        <div className="row g-3">
            {agencies.map((a) => (
                <div key={a.id} className="col-xl-3 col-md-4 col-sm-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center pt-4">
                            <div className="avatar avatar-lg bg-primary bg-opacity-10 rounded-circle mx-auto mb-3">
                                <i className="fa-solid fa-building text-primary fs-22"></i>
                            </div>
                            <h6 className="fw-semibold mb-1">{a.name}</h6>
                            <small className="text-muted d-block mb-1">{a.email}</small>
                            <small className="text-muted d-block mb-3">{a.phone}</small>
                            <span className={`badge light badge-${statusColor[a.status]} mb-3`}>
                                {a.status}
                            </span>
                            <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                                Joined: {a.joined}
                            </p>
                        </div>
                        <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-2 pb-3">
                            <button className="btn btn-primary btn-sm" onClick={() => onEdit(a)}>
                                <i className="fa-solid fa-pen me-1"></i> Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDelete(a.id)}>
                                <i className="fa-solid fa-trash me-1"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

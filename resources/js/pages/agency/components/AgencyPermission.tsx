interface Props {
    agency: any;
}

export default function AgencyPermission({ agency }: Props) {
    const permissions = [
        { id: 1, name: 'View Reports', granted: true },
        { id: 2, name: 'Create Booking', granted: true },
        { id: 3, name: 'Manage Users', granted: false },
        { id: 4, name: 'View Payments', granted: true },
        { id: 5, name: 'Export Data', granted: false },
        { id: 6, name: 'System Settings', granted: false },
    ];

    return (
        <div className="row g-4 px-4">
            <div className="col-lg-12">
                <h5 className="mb-3">Permissions</h5>

                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="col-md-6 mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`permission-${permission.id}`}
                                                checked={permission.granted}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor={`permission-${permission.id}`}>
                                                {permission.name}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <button className="btn btn-primary btn-sm me-2">
                        <i className="fa-solid fa-save me-1"></i> Save Permissions
                    </button>
                </div>
            </div>
        </div>
    );
}

interface Agency {
    id: number;
    agency_name: string;
    legal_name: string;
    email: string;
    phone_number: string;
    alternate_phone?: string;
    website?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    registration_number?: string;
    gst_number?: string;
    pan_number?: string;
    account_number?: string;
    ifsc_code?: string;
    note?: string;
    tax_status: number;
    created_at?: string;
}

interface Props {
    agency: Agency;
}

export default function AgencyDocuments({ agency }: Props) {
    const documents = [
        { id: 1, name: 'Registration Certificate', type: 'PDF', size: '2.4 MB', uploadedDate: '2024-01-15' },
        { id: 2, name: 'GST Certificate', type: 'PDF', size: '1.8 MB', uploadedDate: '2024-01-14' },
        { id: 3, name: 'PAN Document', type: 'PDF', size: '1.2 MB', uploadedDate: '2024-01-13' },
        { id: 4, name: 'Bank Statement', type: 'PDF', size: '3.1 MB', uploadedDate: '2024-01-12' },
    ];

    return (
        <div className="row g-4">
            <div className="col-lg-12 px-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Documents</h5>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-primary btn-sm ms-2">
                            <i className="fa-solid fa-upload me-1"></i> Upload Document
                        </button>
                    </div>
                </div>

                {/* Documents Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Document Name</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Uploaded Date</th>
                                        <th className="text-end pe-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.length > 0 ? (
                                        documents.map((doc) => (
                                            <tr key={doc.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-sm bg-light me-2 rounded">
                                                            <i className="fa-solid fa-file-pdf text-danger"></i>
                                                        </div>
                                                        <span>{doc.name}</span>
                                                    </div>
                                                </td>
                                                <td>{doc.type}</td>
                                                <td>{doc.size}</td>
                                                <td>{doc.uploadedDate}</td>
                                                <td className="text-end pe-3">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <a href="#" className="btn btn-primary btn-xs light" title="Download">
                                                            <i className="fa-solid fa-download"></i>
                                                        </a>
                                                        <button className="btn btn-danger btn-xs light" title="Delete">
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center p-4 text-muted">
                                                No documents found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

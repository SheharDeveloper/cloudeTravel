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

export default function AgencyInformation({ agency }: Props) {
    return (
        <div className="row g-4">
            <div className="col-lg-8 px-4">
                {/* Complete Agency Information */}
                <div className="card">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-circle-info me-2"></i>
                            Agency Details
                        </h6>
                    </div>
                    <div className="card-body py-2 px-3">
                        <div className="row g-2">
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Agency Name</label>
                                <p className="mb-0 fw-semibold small">{agency.agency_name}</p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Legal Name</label>
                                <p className="mb-0 fw-semibold small">{agency.legal_name}</p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Email</label>
                                <p className="mb-0 small">
                                    <a href={`mailto:${agency.email}`}>{agency.email}</a>
                                </p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Phone</label>
                                <p className="mb-0 small">
                                    <a href={`tel:${agency.phone_number}`}>{agency.phone_number}</a>
                                </p>
                            </div>
                            {agency.alternate_phone && (
                                <div className="col-md-6 mb-2">
                                    <label className="form-label text-muted fw-medium small">Alternate Phone</label>
                                    <p className="mb-0 small">
                                        <a href={`tel:${agency.alternate_phone}`}>{agency.alternate_phone}</a>
                                    </p>
                                </div>
                            )}
                            {agency.website && (
                                <div className="col-md-6 mb-2">
                                    <label className="form-label text-muted fw-medium small">Website</label>
                                    <p className="mb-0 small">
                                        <a href={agency.website} target="_blank" rel="noopener noreferrer">
                                            {agency.website}
                                        </a>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tax & Registration Information */}
                <div className="card mt-3">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-file-invoice me-2"></i>
                            Tax & Registration
                        </h6>
                    </div>
                    <div className="card-body py-2 px-3">
                        <div className="row g-2">
                            {agency.registration_number && (
                                <div className="col-md-6 mb-2">
                                    <label className="form-label text-muted fw-medium small">Registration Number</label>
                                    <p className="mb-0 fw-semibold small">{agency.registration_number}</p>
                                </div>
                            )}
                            {agency.gst_number && (
                                <div className="col-md-6 mb-2">
                                    <label className="form-label text-muted fw-medium small">GST Number</label>
                                    <p className="mb-0 fw-semibold small">{agency.gst_number}</p>
                                </div>
                            )}
                            {agency.pan_number && (
                                <div className="col-md-6 mb-2">
                                    <label className="form-label text-muted fw-medium small">PAN Number</label>
                                    <p className="mb-0 fw-semibold small">{agency.pan_number}</p>
                                </div>
                            )}
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Status</label>
                                <p className="mb-0">
                                    <span className={`badge badge-lg ${agency.tax_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                                        {agency.tax_status === 1 ? '✓ Active' : '✗ Inactive'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="card mt-3">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-map-location-dot me-2"></i>
                            Address Information
                        </h6>
                    </div>
                    <div className="card-body py-2 px-3">
                        <div className="row g-2">
                            <div className="col-md-12 mb-2">
                                <label className="form-label text-muted fw-medium small">Address</label>
                                <p className="mb-0 small">{agency.address}</p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">City</label>
                                <p className="mb-0 small">{agency.city}</p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">State</label>
                                <p className="mb-0 small">{agency.state}</p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Country</label>
                                <p className="mb-0 small">{agency.country}</p>
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label text-muted fw-medium small">Postal Code</label>
                                <p className="mb-0 small">{agency.postal_code}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Information */}
                {(agency.account_number || agency.ifsc_code) && (
                    <div className="card mt-3">
                        <div className="card-header border-0">
                            <h6 className="card-title mb-0">
                                <i className="fa-solid fa-bank me-2"></i>
                                Bank Information
                            </h6>
                        </div>
                        <div className="card-body py-2 px-3">
                            <div className="row g-2">
                                {agency.account_number && (
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label text-muted fw-medium small">Account Number</label>
                                        <p className="mb-0 fw-semibold small">{agency.account_number}</p>
                                    </div>
                                )}
                                {agency.ifsc_code && (
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label text-muted fw-medium small">IFSC Code</label>
                                        <p className="mb-0 fw-semibold small">{agency.ifsc_code}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {agency.note && (
                    <div className="card mt-3">
                        <div className="card-header border-0">
                            <h6 className="card-title mb-0">
                                <i className="fa-solid fa-note-sticky me-2"></i>
                                Notes
                            </h6>
                        </div>
                        <div className="card-body py-2 px-3">
                            <p className="mb-0 small">{agency.note}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Card */}
            <div className="col-lg-4 px-4">
                <div className="card">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-chart-pie me-2"></i>
                            Summary
                        </h6>
                    </div>
                    <div className="card-body py-2 px-3">
                        <div className="mb-2">
                            <label className="form-label text-muted fw-medium small">Agency Status</label>
                            <p className="mb-0 small">
                                <span className={`badge badge-lg ${agency.tax_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                                    {agency.tax_status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </p>
                        </div>
                        <hr className="my-2" />
                        <div className="mb-2">
                            <label className="form-label text-muted fw-medium small">Location</label>
                            <p className="mb-0 fw-semibold small">{agency.city}, {agency.country}</p>
                        </div>
                        <hr className="my-2" />
                        <div className="mb-2">
                            <label className="form-label text-muted fw-medium small">Contact Type</label>
                            <p className="mb-0 fw-semibold small">Agency</p>
                        </div>
                        <hr className="my-2" />
                        <div>
                            <label className="form-label text-muted fw-medium small">Registration</label>
                            <p className="mb-0 fw-semibold small">{agency.registration_number || 'Not Available'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

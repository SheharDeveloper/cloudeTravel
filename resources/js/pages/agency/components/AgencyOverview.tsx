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

export default function AgencyOverview({ agency }: Props) {
    return (
    <>
        <style>
            {`
                .agency-row {
                    align-items: flex-start !important;
                }

                .agency-col {
                    display: block !important;
                }

                .agency-card {
                    border-radius: 10px;
                    height: auto !important;
                    min-height: auto !important;
                    display: block !important;
                }

                .agency-card .card-header {
                    padding: 10px 14px !important;
                    border-bottom: none !important;
                }

                .agency-card .card-body {
                    padding: 10px 14px !important;
                }

                .agency-card .form-label {
                    margin-bottom: 2px !important;
                    font-size: 12px;
                    color: #8a8a8a;
                }

                .agency-card p {
                    margin-bottom: 0 !important;
                    line-height: 1.3;
                }

                .agency-card hr {
                    margin: 8px 0 !important;
                }

                .agency-card .card-title {
                    font-size: 15px;
                    font-weight: 600;
                }

                .agency-card .badge {
                    padding: 6px 12px;
                    font-size: 12px;
                }
            `}
        </style>

        <div className="row g-2 agency-row">

            {/* Left Column */}
            <div className="col-lg-4 px-2 agency-col">

                {/* Contact */}
                <div className="card agency-card">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-phone me-2"></i>
                            Contact Information
                        </h6>
                    </div>

                    <div className="card-body">
                        <div className="mb-1">
                            <label className="form-label">
                                Email
                            </label>
                            <p className="small">
                                <a href={`mailto:${agency.email}`}>
                                    {agency.email}
                                </a>
                            </p>
                        </div>

                        <hr />

                        <div className="mb-1">
                            <label className="form-label">
                                Phone
                            </label>
                            <p className="small">
                                <a href={`tel:${agency.phone_number}`}>
                                    {agency.phone_number}
                                </a>
                            </p>
                        </div>

                        {agency.alternate_phone && (
                            <>
                                <hr />
                                <div className="mb-0">
                                    <label className="form-label">
                                        Alternate Phone
                                    </label>
                                    <p className="small">
                                        <a href={`tel:${agency.alternate_phone}`}>
                                            {agency.alternate_phone}
                                        </a>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="card agency-card mt-2">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-map-location-dot me-2"></i>
                            Location
                        </h6>
                    </div>

                    <div className="card-body">
                        <div className="mb-1">
                            <label className="form-label">
                                Address
                            </label>
                            <p className="small">{agency.address}</p>
                        </div>

                        <hr />

                        <div className="mb-1">
                            <label className="form-label">
                                City
                            </label>
                            <p className="small">{agency.city}</p>
                        </div>

                        <hr />

                        <div className="mb-1">
                            <label className="form-label">
                                State
                            </label>
                            <p className="small">{agency.state}</p>
                        </div>

                        <hr />

                        <div className="mb-0">
                            <label className="form-label">
                                Postal Code
                            </label>
                            <p className="small">
                                {agency.postal_code}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="col-lg-8 px-2 agency-col">

                {/* Business Information */}
                <div className="card agency-card">
                    <div className="card-header border-0">
                        <h6 className="card-title mb-0">
                            <i className="fa-solid fa-briefcase me-2"></i>
                            Business Information
                        </h6>
                    </div>

                    <div className="card-body">
                        <div className="row g-2">
                            <div className="col-md-4 mb-1">
                                <label className="form-label">Agency Name</label>
                                <p className="fw-semibold small">{agency.agency_name}</p>
                            </div>

                            <div className="col-md-4 mb-1">
                                <label className="form-label">Legal Name</label>
                                <p className="fw-semibold small">{agency.legal_name}</p>
                            </div>

                            <div className="col-md-4 mb-1">
                                <label className="form-label">Status</label>
                                <p>
                                    <span className={`badge ${agency.tax_status === 1 ? "bg-success" : "bg-danger"}`}>
                                        {agency.tax_status === 1 ? "✓ Active" : "✗ Inactive"}
                                    </span>
                                </p>
                            </div>

                            <div className="col-md-4 mb-1">
                                <label className="form-label">Registration Number</label>
                                <p className="fw-semibold small">
                                    {agency.registration_number || "Not Available"}
                                </p>
                            </div>

                            <div className="col-md-4 mb-1">
                                <label className="form-label">GST Number</label>
                                <p className="fw-semibold small">
                                    {agency.gst_number || "Not Available"}
                                </p>
                            </div>

                            <div className="col-md-4 mb-1">
                                <label className="form-label">PAN Number</label>
                                <p className="fw-semibold small">
                                    {agency.pan_number || "Not Available"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mt-3">
                        <div className="card-header border-0">
                            <h6 className="card-title mb-0">
                                <i className="fa-solid fa-file-invoice me-2"></i>
                                Tax & Registration
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
                                {agency.note && (
                                    <div className="col-md-6 mb-2">
                                        <label className="form-label text-muted fw-medium small">Note</label>
                                        <p className="mb-0 fw-semibold small">{agency.note}</p>
                                    </div>
                                )}

                                <div className="col-md-6 mb-2">
                                    <label className="form-label text-muted fw-medium small">
                                       Tax Status
                                    </label>

                                    <p className="mb-0">
                                        <span
                                            className={`badge px-3 py-2 ${
                                                agency.tax_status === 1
                                                    ? 'bg-success text-white'
                                                    : 'bg-danger text-white'
                                            }`}
                                            style={{
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {agency.tax_status === 1
                                                ? '✓ Active'
                                                : '✗ Inactive'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>

               
            </div>
        </div>
    </>
);
}
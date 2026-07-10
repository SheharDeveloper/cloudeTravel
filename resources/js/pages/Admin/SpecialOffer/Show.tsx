import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { router } from "@inertiajs/react";

interface Currency {
    symbol: string;
    code: string;
    name: string;
}

interface Offer {
    id: number;
    uid: string;
    name: string;
    type?: string;
    description?: string;
    sub_description?: string;
    duration_days?: number;
    duration_nights?: number;
    total_price: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    images?: Array<{ id: number; image_path: string; }>;
}

interface ShowProps {
    offer: Offer;
    currency: Currency;
}

export default function ShowSpecialOffer({ offer, currency }: ShowProps) {
    return (
        <ProtectedRoute>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>{offer.name}</h1></li>
                        <li className="breadcrumb-item active">View Details</li>
                    </ol>
                </nav>
            </div>

            <style>{`
                .card { box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 0.75rem; }
                .card-header { padding: 0.75rem 1rem; border-bottom: 1px solid #dee2e6; background-color: #f8f9fa; }
                .card-body { padding: 1rem; }
                .table { margin-bottom: 0; font-size: 0.95rem; }
            `}</style>

            <div className="row" style={{ alignItems: "flex-start" }}>
                {/* Left Column */}
                <div className="col-lg-6">
                    {/* Basic Information Card */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Basic Information</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <td width="40%"><strong>Package Name</strong></td>
                                        <td>{offer.name}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Type</strong></td>
                                        <td><span className="badge bg-info">{offer.type || "N/A"}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Description</strong></td>
                                        <td>{offer.description || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Sub Description</strong></td>
                                        <td>{offer.sub_description || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Created</strong></td>
                                        <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-6">
                    {/* Details Card */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Package Details</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <td width="40%"><strong>Duration (Days)</strong></td>
                                        <td>{offer.duration_days || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Duration (Nights)</strong></td>
                                        <td>{offer.duration_nights || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Price</strong></td>
                                        <td><span className="badge bg-success">{currency.symbol}{offer.total_price.toLocaleString()}</span></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status</strong></td>
                                        <td>{offer.is_active ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Featured</strong></td>
                                        <td>{offer.is_featured ? <span className="badge bg-primary">Yes</span> : <span className="badge bg-secondary">No</span>}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Images Card */}
                    {offer.images && offer.images.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Package Images ({offer.images.length})</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-2">
                                    {offer.images.map((image) => (
                                        <div key={image.id} className="col-md-6 col-lg-4">
                                            <div className="border rounded overflow-hidden" style={{ aspectRatio: "1/1" }}>
                                                <img
                                                    src={`/storage/${image.image_path}`}
                                                    alt="Offer"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3">
                <button
                    className="btn btn-warning"
                    onClick={() => router.visit(`/admin/special-offer/${offer.uid}/edit`)}
                >
                    <i className="fa fa-edit me-2"></i>Edit
                </button>
                <button
                    className="btn btn-secondary ms-2"
                    onClick={() => router.visit("/admin/special-offer")}
                >
                    <i className="fa fa-arrow-left me-2"></i>Back
                </button>
            </div>
        </ProtectedRoute>
    );
}

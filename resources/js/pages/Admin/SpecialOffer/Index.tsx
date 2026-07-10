import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { router } from "@inertiajs/react";

interface SpecialOffer {
    id: number;
    uid: string;
    name: string;
    type?: string;
    total_price: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    images?: Array<{ id: number; image_path: string; }>;
}

interface Currency {
    symbol: string;
    code: string;
    name: string;
}

interface IndexProps {
    offers: SpecialOffer[];
    current_page: number;
    last_page: number;
    total: number;
    currency: Currency;
}

export default function SpecialOfferIndex({ offers, currency }: IndexProps) {
    return (
        <ProtectedRoute>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Special Offers</h1></li>
                        <li className="breadcrumb-item active">Manage</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <button
                                className="btn btn-primary mb-3"
                                onClick={() => router.visit("/admin/special-offer/create")}
                            >
                                <i className="fa fa-plus"></i> Create Offer
                            </button>

                            {offers && offers.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "10%" }}>Image</th>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Price</th>
                                                <th>Featured</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {offers.map((offer) => (
                                                <tr key={offer.id}>
                                                    <td>
                                                        {offer.images && offer.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${offer.images[0].image_path}`}
                                                                alt={offer.name}
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "4px"
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    backgroundColor: "#e9ecef",
                                                                    borderRadius: "4px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "#6c757d"
                                                                }}
                                                            >
                                                                <i className="fa fa-image"></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td><strong>{offer.name}</strong></td>
                                                    <td>{offer.type || "-"}</td>
                                                    <td>{currency.symbol}{offer.total_price.toLocaleString()}</td>
                                                    <td>
                                                        {offer.is_featured ? (
                                                            <span className="badge bg-primary">Featured</span>
                                                        ) : (
                                                            <span className="badge bg-light text-dark">Not Featured</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${offer.is_active ? "bg-success" : "bg-secondary"}`}>
                                                            {offer.is_active ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-info me-1"
                                                            onClick={() => router.visit(`/admin/special-offer/${offer.uid}`)}
                                                        >
                                                            <i className="fa fa-eye"></i> View
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-warning me-1"
                                                            onClick={() => router.visit(`/admin/special-offer/${offer.uid}/edit`)}
                                                        >
                                                            <i className="fa fa-edit"></i> Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => {
                                                                if (confirm("Are you sure?")) {
                                                                    router.delete(`/admin/special-offer/${offer.uid}`);
                                                                }
                                                            }}
                                                        >
                                                            <i className="fa fa-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert alert-info">No special offers found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

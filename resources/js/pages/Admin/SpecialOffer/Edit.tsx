import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { router } from "@inertiajs/react";
import { useState } from "react";

const PACKAGE_TYPES = ["Flight", "Hotel", "Package", "Visa", "Transportation"];
const TRANSPORT_TYPES = ["Bus", "Train", "Car", "Flight", "Cruise", "Boat"];

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
    flight_name?: string;
    hotel_name?: string;
    hotel_star_rating?: number;
    visa_name?: string;
    is_visa?: boolean;
    transport_name?: string;
    transport_type?: string;
    is_transport?: boolean;
    rating?: number;
    images?: Array<{ id: number; image_path: string; }>;
}

interface EditProps {
    offer: Offer;
    currency: Currency;
}

export default function EditSpecialOffer({ offer, currency }: EditProps) {
    const [formData, setFormData] = useState(offer);
    const [newImages, setNewImages] = useState<File[]>([]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e: any) => {
        const files = Array.from(e.target.files) as File[];
        setNewImages([...newImages, ...files]);
    };

    const removeNewImage = (index: number) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const deleteExistingImage = (imageId: number) => {
        if (confirm("Delete this image?")) {
            router.delete(`/admin/special-offer/${offer.uid}/images/${imageId}`);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formDataWithImages = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== "images") {
                const value = (formData as any)[key];
                if (typeof value === 'boolean') {
                    formDataWithImages.append(key, value ? '1' : '0');
                } else {
                    formDataWithImages.append(key, value || '');
                }
            }
        });

        newImages.forEach((image, index) => {
            formDataWithImages.append(`images[${index}]`, image);
        });

        router.put(`/admin/special-offer/${offer.uid}`, formDataWithImages);
    };

    return (
        <ProtectedRoute>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Edit Special Offer</h1></li>
                    </ol>
                </nav>
            </div>

            <style>{`
                .card { box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 0.75rem; }
                .card-header { padding: 0.75rem 1rem; border-bottom: 1px solid #dee2e6; background-color: #f8f9fa; }
                .card-body { padding: 1rem; }
                .mb-3 { margin-bottom: 0.8rem !important; }
                textarea { min-height: auto !important; padding: 0.5rem 0.75rem !important; }
            `}</style>

            <form onSubmit={handleSubmit}>
                <div className="row" style={{ alignItems: "flex-start" }}>
                    {/* LEFT COLUMN */}
                    <div className="col-lg-6">
                        {/* Basic Information Card */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Basic Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Package Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Type *</label>
                                            <select
                                                className="form-control"
                                                name="type"
                                                value={formData.type || ""}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                {PACKAGE_TYPES.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        rows={2}
                                        value={formData.description || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Sub Description</label>
                                    <textarea
                                        className="form-control"
                                        name="sub_description"
                                        rows={1}
                                        value={formData.sub_description || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Duration & Pricing Card */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Duration & Pricing</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Duration (Days)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="duration_days"
                                                value={formData.duration_days || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Duration (Nights)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="duration_nights"
                                                value={formData.duration_nights || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Total Price ({currency.symbol}) *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="total_price"
                                        value={formData.total_price}
                                        onChange={handleChange}
                                        required
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Flight Details Card */}
                        {(formData.type === "Flight" || formData.type === "Package") && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">✈️ Flight</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Flight Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="flight_name"
                                            value={formData.flight_name || ""}
                                            onChange={handleChange}
                                            placeholder="e.g., Air India AI101"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hotel Details Card */}
                        {(formData.type === "Hotel" || formData.type === "Package") && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">🏨 Hotel</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Hotel Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="hotel_name"
                                                    value={formData.hotel_name || ""}
                                                    onChange={handleChange}
                                                    placeholder="e.g., Taj Hotel"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Star Rating (1-5)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="hotel_star_rating"
                                                    value={formData.hotel_star_rating || ""}
                                                    onChange={handleChange}
                                                    min="1"
                                                    max="5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Visa Details Card */}
                        {(formData.type === "Visa" || formData.type === "Package") && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">🛂 Visa</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Visa Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="visa_name"
                                            value={formData.visa_name || ""}
                                            onChange={handleChange}
                                            placeholder="e.g., Schengen Visa"
                                        />
                                    </div>
                                    {formData.type === "Package" && (
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="is_visa"
                                                checked={formData.is_visa || false}
                                                onChange={handleChange}
                                                id="is_visa"
                                            />
                                            <label className="form-check-label" htmlFor="is_visa">
                                                Include Visa
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Transport Details Card */}
                        {(formData.type === "Transportation" || formData.type === "Package") && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">🚗 Transportation</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Transport Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="transport_name"
                                            value={formData.transport_name || ""}
                                            onChange={handleChange}
                                            placeholder="e.g., Luxury Coach"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Transport Type</label>
                                        <select
                                            className="form-control"
                                            name="transport_type"
                                            value={formData.transport_type || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Type</option>
                                            {TRANSPORT_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {formData.type === "Package" && (
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="is_transport"
                                                checked={formData.is_transport || false}
                                                onChange={handleChange}
                                                id="is_transport"
                                            />
                                            <label className="form-check-label" htmlFor="is_transport">
                                                Include Transportation
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-lg-6">
                        {/* Rating Card */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">⭐ Rating</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Package Rating (0-5)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="rating"
                                        value={formData.rating || ""}
                                        onChange={handleChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        placeholder="e.g., 4.5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Settings Card */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Settings</h5>
                            </div>
                            <div className="card-body">
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        id="is_active"
                                    />
                                    <label className="form-check-label" htmlFor="is_active">
                                        Active
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        id="is_featured"
                                    />
                                    <label className="form-check-label" htmlFor="is_featured">
                                        Featured
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Images Card */}
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">📸 Images</h5>
                            </div>
                            <div className="card-body">
                                {offer.images && offer.images.length > 0 && (
                                    <div className="mb-4">
                                        <label className="form-label d-block mb-3">Existing Images ({offer.images.length})</label>
                                        <div className="row g-2">
                                            {offer.images.map((image) => (
                                                <div key={image.id} className="col-md-4">
                                                    <div className="position-relative border rounded overflow-hidden" style={{ aspectRatio: "1/1" }}>
                                                        <img
                                                            src={`/storage/${image.image_path}`}
                                                            alt="Offer"
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                            onClick={() => deleteExistingImage(image.id)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <hr />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Upload Images</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <small className="text-muted d-block mt-2">JPG, PNG allowed. Max 5MB each</small>
                                </div>

                                {newImages.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label">New Images ({newImages.length})</label>
                                        <div className="row g-2">
                                            {newImages.map((image, index) => (
                                                <div key={index} className="col-md-4">
                                                    <div className="position-relative border rounded overflow-hidden" style={{ aspectRatio: "1/1" }}>
                                                        <img
                                                            src={URL.createObjectURL(image)}
                                                            alt={`Preview ${index}`}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                            onClick={() => removeNewImage(index)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-4">
                    <button type="submit" className="btn btn-primary me-2">
                        <i className="fa fa-save me-2"></i>Update Offer
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => router.visit("/admin/special-offer")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </ProtectedRoute>
    );
}

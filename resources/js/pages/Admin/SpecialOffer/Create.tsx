import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { countryService } from "@/services/countryService";
import SearchableSelect from "@/components/SearchableSelect";

const PACKAGE_TYPES = ["Flight", "Hotel", "Package", "Visa", "Transportation"];
const TRANSPORT_TYPES = ["Bus", "Train", "Car", "Flight", "Cruise", "Boat"];

interface Currency {
    symbol: string;
    code: string;
    name: string;
}

interface CreateProps {
    currency: Currency;
}

export default function CreateSpecialOffer({ currency }: CreateProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        description: "",
        sub_description: "",
        duration_days: "",
        duration_nights: "",
        total_price: "",
        is_active: true,
        is_featured: false,
        flight_name: "",
        flight_origin: "",
        flight_destination: "",
        hotel_name: "",
        hotel_star_rating: "",
        hotel_country: "",
        hotel_city: "",
        visa_name: "",
        visa_destination_country: "",
        visa_passport_country: "",
        is_visa: false,
        package_country: "",
        package_city: "",
        transport_name: "",
        transport_type: "",
        transport_origin: "",
        transport_destination: "",
        is_transport: false,
        rating: "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoadingCountries(true);
            try {
                const data = await countryService.getAllCountries();
                setCountries(data || []);
                console.log('Countries loaded:', data?.length);
            } catch (error) {
                console.error('Error loading countries:', error);
                setCountries([]);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e: any) => {
        const files = Array.from(e.target.files) as File[];
        setImages([...images, ...files]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formDataWithImages = new FormData();
        Object.keys(formData).forEach(key => {
            const value = (formData as any)[key];
            if (typeof value === 'boolean') {
                formDataWithImages.append(key, value ? '1' : '0');
            } else {
                formDataWithImages.append(key, value || '');
            }
        });

        images.forEach((image, index) => {
            formDataWithImages.append(`images[${index}]`, image);
        });

        router.post("/admin/special-offer", formDataWithImages);
    };

    return (
        <ProtectedRoute>
            <div className="page-title">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Create Special Offer</h1></li>
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
                                                value={formData.type}
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
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Sub Description</label>
                                    <textarea
                                        className="form-control"
                                        name="sub_description"
                                        rows={1}
                                        value={formData.sub_description}
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
                                                value={formData.duration_days}
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
                                                value={formData.duration_nights}
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
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Flight Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="flight_name"
                                                    value={formData.flight_name}
                                                    onChange={handleChange}
                                                    placeholder="e.g., Air India AI101"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <SearchableSelect
                                                label="Origin"
                                                name="flight_origin"
                                                value={formData.flight_origin}
                                                onChange={handleChange}
                                                options={countries}
                                                placeholder="Search origin country..."
                                                disabled={loadingCountries}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <SearchableSelect
                                                label="Destination"
                                                name="flight_destination"
                                                value={formData.flight_destination}
                                                onChange={handleChange}
                                                options={countries}
                                                placeholder="Search destination country..."
                                                disabled={loadingCountries}
                                            />
                                        </div>
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
                                                    value={formData.hotel_name}
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
                                                    value={formData.hotel_star_rating}
                                                    onChange={handleChange}
                                                    min="1"
                                                    max="5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <SearchableSelect
                                                label="Country"
                                                name="hotel_country"
                                                value={formData.hotel_country}
                                                onChange={handleChange}
                                                options={countries}
                                                placeholder="Search country..."
                                                disabled={loadingCountries}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="hotel_city"
                                                    value={formData.hotel_city}
                                                    onChange={handleChange}
                                                    placeholder="e.g., Delhi"
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
                                            value={formData.visa_name}
                                            onChange={handleChange}
                                            placeholder="e.g., Schengen Visa"
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <SearchableSelect
                                                label="Destination Country"
                                                name="visa_destination_country"
                                                value={formData.visa_destination_country}
                                                onChange={handleChange}
                                                options={countries}
                                                placeholder="Search country..."
                                                disabled={loadingCountries}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <SearchableSelect
                                                label="Passport Country"
                                                name="visa_passport_country"
                                                value={formData.visa_passport_country}
                                                onChange={handleChange}
                                                options={countries}
                                                placeholder="Search country..."
                                                disabled={loadingCountries}
                                            />
                                        </div>
                                    </div>
                                    {formData.type === "Package" && (
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="is_visa"
                                                checked={formData.is_visa}
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

                        {/* Package Details Card */}
                        {(formData.type === "Package") && (
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">📦 Package</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <SearchableSelect
                                                label="Country"
                                                name="package_country"
                                                value={formData.package_country}
                                                onChange={handleChange}
                                                options={countries}
                                                placeholder="Search country..."
                                                disabled={loadingCountries}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="package_city"
                                                    value={formData.package_city}
                                                    onChange={handleChange}
                                                    placeholder="e.g., Paris"
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                            value={formData.transport_name}
                                            onChange={handleChange}
                                            placeholder="e.g., Luxury Coach"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Transport Type</label>
                                        <select
                                            className="form-control"
                                            name="transport_type"
                                            value={formData.transport_type}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Type</option>
                                            {TRANSPORT_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Origin</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="transport_origin"
                                                    value={formData.transport_origin}
                                                    onChange={handleChange}
                                                    placeholder="e.g., Airport"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Destination</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="transport_destination"
                                                    value={formData.transport_destination}
                                                    onChange={handleChange}
                                                    placeholder="e.g., City Center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {formData.type === "Package" && (
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="is_transport"
                                                checked={formData.is_transport}
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
                                        value={formData.rating}
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

                                {images.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label">Images ({images.length})</label>
                                        <div className="row g-2">
                                            {images.map((image, index) => (
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
                                                            onClick={() => removeImage(index)}
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
                        <i className="fa fa-save me-2"></i>Create Offer
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

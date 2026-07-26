import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import CustomDatePicker from './CustomDatePicker';

interface TravelQuoteFormModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface DetailItem {
    id: string;
    type: 'hotel' | 'flight' | 'visa' | 'travel';
    data: Record<string, any>;
}

interface InputFieldSet {
    id: string;
    data: Record<string, any>;
}

export default function TravelQuoteFormModal({
    show,
    onClose,
    onSuccess,
}: TravelQuoteFormModalProps) {
    const [formData, setFormData] = useState({
        display_name: '',
        check_in_date: '',
        checkout_date: '',
        night: '',
        expiry_date: '',
        half_board: '',
        all_inclusive: '',
        images: [] as File[],
        show_hotel_name: false,
        show_individual_price: false,
        total_price: 0,
    });

    const [checkedItems, setCheckedItems] = useState({
        hotel: false,
        flight: false,
        visa: false,
        travel: false,
    });

    // Input field sets for each type (allowing multiple to be filled at once)
    const [hotelInputs, setHotelInputs] = useState<InputFieldSet[]>([]);
    const [flightInputs, setFlightInputs] = useState<InputFieldSet[]>([]);
    const [visaInputs, setVisaInputs] = useState<InputFieldSet[]>([]);
    const [travelInputs, setTravelInputs] = useState<InputFieldSet[]>([]);

    const [addedDetails, setAddedDetails] = useState<DetailItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const MAX_ITEMS = 5;

    const calculateTotalPrice = () => {
        let total = 0;

        // Sum hotel prices
        hotelInputs.forEach(hotel => {
            const price = parseFloat(hotel.data.price) || 0;
            total += price;
        });
        addedDetails.filter(d => d.type === 'hotel').forEach(hotel => {
            const price = parseFloat(hotel.data.price) || 0;
            total += price;
        });

        // Sum flight prices
        flightInputs.forEach(flight => {
            const price = parseFloat(flight.data.price) || 0;
            total += price;
        });
        addedDetails.filter(d => d.type === 'flight').forEach(flight => {
            const price = parseFloat(flight.data.price) || 0;
            total += price;
        });

        // Sum visa costs
        visaInputs.forEach(visa => {
            const cost = parseFloat(visa.data.cost) || 0;
            total += cost;
        });
        addedDetails.filter(d => d.type === 'visa').forEach(visa => {
            const cost = parseFloat(visa.data.cost) || 0;
            total += cost;
        });

        // Sum travel costs
        travelInputs.forEach(travel => {
            const cost = parseFloat(travel.data.cost) || 0;
            total += cost;
        });
        addedDetails.filter(d => d.type === 'travel').forEach(travel => {
            const cost = parseFloat(travel.data.cost) || 0;
            total += cost;
        });

        return total;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (type: 'hotel' | 'flight' | 'visa' | 'travel') => {
        const isChecking = !checkedItems[type];
        setCheckedItems(prev => ({
            ...prev,
            [type]: isChecking
        }));

        // When checking, add one empty input field set
        if (isChecking) {
            const newId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const emptyData = type === 'hotel'
                ? { name: '', stars: '', price: '', description: '' }
                : type === 'flight'
                ? { airline: '', departure: '', arrival: '', price: '', route: '' }
                : type === 'visa'
                ? { country: '', type: '', duration: '', cost: '' }
                : { destination: '', duration: '', activities: '', cost: '' };

            if (type === 'hotel') {
                setHotelInputs([{ id: newId, data: emptyData }]);
            } else if (type === 'flight') {
                setFlightInputs([{ id: newId, data: emptyData }]);
            } else if (type === 'visa') {
                setVisaInputs([{ id: newId, data: emptyData }]);
            } else if (type === 'travel') {
                setTravelInputs([{ id: newId, data: emptyData }]);
            }
        } else {
            // Clear all input sets when unchecking
            if (type === 'hotel') setHotelInputs([]);
            else if (type === 'flight') setFlightInputs([]);
            else if (type === 'visa') setVisaInputs([]);
            else if (type === 'travel') setTravelInputs([]);
        }
    };

    const handleInputSetChange = (type: 'hotel' | 'flight' | 'visa' | 'travel', id: string, field: string, value: string) => {
        if (type === 'hotel') {
            setHotelInputs(prev => prev.map(item => item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item));
        } else if (type === 'flight') {
            setFlightInputs(prev => prev.map(item => item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item));
        } else if (type === 'visa') {
            setVisaInputs(prev => prev.map(item => item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item));
        } else if (type === 'travel') {
            setTravelInputs(prev => prev.map(item => item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item));
        }
    };

    const addMoreInputSet = (type: 'hotel' | 'flight' | 'visa' | 'travel') => {
        const typeInputs = type === 'hotel' ? hotelInputs : type === 'flight' ? flightInputs : type === 'visa' ? visaInputs : travelInputs;

        if (typeInputs.length >= MAX_ITEMS) {
            toast.error(`Maximum ${MAX_ITEMS} ${type} items allowed`);
            return;
        }

        const newId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const emptyData = type === 'hotel'
            ? { name: '', stars: '', price: '', description: '' }
            : type === 'flight'
            ? { airline: '', departure: '', arrival: '', price: '', route: '' }
            : type === 'visa'
            ? { country: '', type: '', duration: '', cost: '' }
            : { destination: '', duration: '', activities: '', cost: '' };

        if (type === 'hotel') {
            setHotelInputs([...hotelInputs, { id: newId, data: emptyData }]);
        } else if (type === 'flight') {
            setFlightInputs([...flightInputs, { id: newId, data: emptyData }]);
        } else if (type === 'visa') {
            setVisaInputs([...visaInputs, { id: newId, data: emptyData }]);
        } else if (type === 'travel') {
            setTravelInputs([...travelInputs, { id: newId, data: emptyData }]);
        }
    };

    const removeInputSet = (type: 'hotel' | 'flight' | 'visa' | 'travel', id: string) => {
        if (type === 'hotel') {
            setHotelInputs(prev => prev.filter(item => item.id !== id));
        } else if (type === 'flight') {
            setFlightInputs(prev => prev.filter(item => item.id !== id));
        } else if (type === 'visa') {
            setVisaInputs(prev => prev.filter(item => item.id !== id));
        } else if (type === 'travel') {
            setTravelInputs(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleRemoveDetail = (id: string) => {
        setAddedDetails(addedDetails.filter(item => item.id !== id));
        toast.success('Item removed');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files || []);
            setFormData(prev => ({
                ...prev,
                images: files
            }));

            // Create image previews
            const previews: string[] = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push(reader.result as string);
                    if (previews.length === files.length) {
                        setImagePreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.display_name || !formData.check_in_date || !formData.checkout_date || !formData.night) {
            toast.error('Please fill all required fields');
            return;
        }

        // Validate checkout date is not before check-in date
        if (new Date(formData.checkout_date) < new Date(formData.check_in_date)) {
            toast.error('Check-out date must be after or equal to check-in date');
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSubmit = new FormData();

            const calculatedTotal = calculateTotalPrice();

            formDataToSubmit.append('display_name', formData.display_name);
            formDataToSubmit.append('check_in_date', formData.check_in_date);
            formDataToSubmit.append('checkout_date', formData.checkout_date);
            formDataToSubmit.append('night', formData.night);
            formDataToSubmit.append('show_hotel_name', formData.show_hotel_name ? '1' : '0');
            formDataToSubmit.append('show_individual_price', formData.show_individual_price ? '1' : '0');
            formDataToSubmit.append('total_price', calculatedTotal.toString());

            if (formData.expiry_date) {
                formDataToSubmit.append('expiry_date', formData.expiry_date);
            }
            if (formData.half_board) {
                formDataToSubmit.append('half_board', formData.half_board);
            }
            if (formData.all_inclusive) {
                formDataToSubmit.append('all_inclusive', formData.all_inclusive);
            }

            // Combine input sets with already added details
            const allHotels = [...addedDetails.filter(d => d.type === 'hotel'), ...hotelInputs.map(h => ({ id: h.id, type: 'hotel' as const, data: h.data }))];
            const allFlights = [...addedDetails.filter(d => d.type === 'flight'), ...flightInputs.map(f => ({ id: f.id, type: 'flight' as const, data: f.data }))];
            const allVisas = [...addedDetails.filter(d => d.type === 'visa'), ...visaInputs.map(v => ({ id: v.id, type: 'visa' as const, data: v.data }))];
            const allTravels = [...addedDetails.filter(d => d.type === 'travel'), ...travelInputs.map(t => ({ id: t.id, type: 'travel' as const, data: t.data }))];

            if (allHotels.length > 0) {
                formDataToSubmit.append('hotel_details', JSON.stringify(allHotels.map(d => d.data)));
            }
            if (allFlights.length > 0) {
                formDataToSubmit.append('flight_details', JSON.stringify(allFlights.map(d => d.data)));
            }
            if (allVisas.length > 0) {
                formDataToSubmit.append('visa_details', JSON.stringify(allVisas.map(d => d.data)));
            }
            if (allTravels.length > 0) {
                formDataToSubmit.append('travel_details', JSON.stringify(allTravels.map(d => d.data)));
            }

            formData.images.forEach((file, index) => {
                formDataToSubmit.append(`images[${index}]`, file);
            });

            router.post('/admin/travel-quote', formDataToSubmit, {
                onSuccess: () => {
                    toast.success('Travel Quote created successfully');
                    onClose();
                    resetForm();
                    onSuccess?.();
                },
                onError: (errors: any) => {
                    console.log('Validation errors:', errors);
                    setErrors(errors);
                    toast.error('Please fix the validation errors');
                }
            });
        } catch (error) {
            toast.error('An error occurred');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            display_name: '',
            check_in_date: '',
            checkout_date: '',
            night: '',
            expiry_date: '',
            half_board: '',
            all_inclusive: '',
            images: [],
            show_hotel_name: false,
            show_individual_price: false,
            total_price: 0,
        });
        setAddedDetails([]);
        setCheckedItems({
            hotel: false,
            flight: false,
            visa: false,
            travel: false,
        });
        setHotelInputs([]);
        setFlightInputs([]);
        setVisaInputs([]);
        setTravelInputs([]);
        setImagePreviews([]);
        setErrors({});
    };

    if (!show) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal d-block"
                style={{
                    display: show ? 'block' : 'none',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1050,
                    overflowY: 'auto',
                }}
                onClick={onClose}
            >
                {/* Modal Dialog - BIGGER */}
                <div
                    className="modal-dialog modal-xl"
                    style={{
                        position: 'relative',
                        margin: '2rem auto',
                        zIndex: 1050,
                        maxHeight: '95vh',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">
                                <i className="fa fa-plus me-2"></i>
                                Add Travel Quote
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                disabled={isSubmitting}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {/* Error Messages */}
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <h6 className="alert-heading">
                                        <i className="fa fa-exclamation-circle me-2"></i>
                                        Validation Errors
                                    </h6>
                                    <ul className="mb-0">
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key}>{message}</li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setErrors({})}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Basic Info Section */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <h6 className="mb-0">Basic Information</h6>
                                    </div>
                                    <div className="card-body">
                                        {/* Display Name */}
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Display Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="display_name"
                                                value={formData.display_name}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                placeholder="e.g., Paris Summer Getaway"
                                            />
                                        </div>

                                        {/* Date Range */}
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <CustomDatePicker
                                                        label="Check-in Date *"
                                                        value={formData.check_in_date}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, check_in_date: date }))}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <CustomDatePicker
                                                        label="Check-out Date *"
                                                        value={formData.checkout_date}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, checkout_date: date }))}
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Nights *</label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-lg"
                                                        name="night"
                                                        value={formData.night}
                                                        onChange={handleChange}
                                                        required
                                                        min="1"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Optional Fields */}
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="mb-0">
                                                    <CustomDatePicker
                                                        label="Expiry Date"
                                                        value={formData.expiry_date}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, expiry_date: date }))}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-0">
                                                    <label className="form-label fw-bold">Half Board</label>
                                                    <select
                                                        className="form-select form-select-lg"
                                                        name="half_board"
                                                        value={formData.half_board}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    >
                                                        <option value="">Select option</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                        <option value="Yes with breakfast">Yes with breakfast</option>
                                                        <option value="Yes with lunch">Yes with lunch</option>
                                                        <option value="Yes with dinner">Yes with dinner</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-0">
                                                    <label className="form-label fw-bold">All Inclusive</label>
                                                    <select
                                                        className="form-select form-select-lg"
                                                        name="all_inclusive"
                                                        value={formData.all_inclusive}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    >
                                                        <option value="">Select option</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="No">No</option>
                                                        <option value="Yes with activities">Yes with activities</option>
                                                        <option value="Yes with transfers">Yes with transfers</option>
                                                        <option value="Yes with everything">Yes with everything</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HOTEL DETAILS */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="hotelCheck"
                                                    checked={checkedItems.hotel}
                                                    onChange={() => handleCheckboxChange('hotel')}
                                                    disabled={isSubmitting}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="hotelCheck">
                                                    🏨 Hotel Details
                                                </label>
                                            </div>
                                            <small className="text-muted">({hotelInputs.length}/{MAX_ITEMS})</small>
                                        </div>
                                    </div>
                                    {checkedItems.hotel && (
                                        <div className="card-body">
                                            {hotelInputs.map((inputSet, index) => (
                                                <div key={inputSet.id} className="card mb-3 border-info">
                                                    <div className="card-header bg-info bg-opacity-10">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="fw-bold">Hotel #{index + 1}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeInputSet('hotel', inputSet.id)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Hotel Name</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.name}
                                                                        onChange={(e) => handleInputSetChange('hotel', inputSet.id, 'name', e.target.value)}
                                                                        placeholder="Enter hotel name"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Stars</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.stars}
                                                                        onChange={(e) => handleInputSetChange('hotel', inputSet.id, 'stars', e.target.value)}
                                                                        placeholder="e.g., 5"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Price</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.price}
                                                                        onChange={(e) => handleInputSetChange('hotel', inputSet.id, 'price', e.target.value)}
                                                                        placeholder="e.g., 150/night"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-0">
                                                                    <label className="form-label">Description</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.description}
                                                                        onChange={(e) => handleInputSetChange('hotel', inputSet.id, 'description', e.target.value)}
                                                                        placeholder="e.g., Luxury hotel in city center"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={() => addMoreInputSet('hotel')}
                                                disabled={isSubmitting || hotelInputs.length >= MAX_ITEMS}
                                            >
                                                <i className="fa fa-plus me-2"></i> Add More Hotel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* FLIGHT DETAILS */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flightCheck"
                                                    checked={checkedItems.flight}
                                                    onChange={() => handleCheckboxChange('flight')}
                                                    disabled={isSubmitting}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="flightCheck">
                                                    ✈️ Flight Details
                                                </label>
                                            </div>
                                            <small className="text-muted">({flightInputs.length}/{MAX_ITEMS})</small>
                                        </div>
                                    </div>
                                    {checkedItems.flight && (
                                        <div className="card-body">
                                            {flightInputs.map((inputSet, index) => (
                                                <div key={inputSet.id} className="card mb-3 border-warning">
                                                    <div className="card-header bg-warning bg-opacity-10">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="fw-bold">Flight #{index + 1}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeInputSet('flight', inputSet.id)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Airline</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.airline}
                                                                        onChange={(e) => handleInputSetChange('flight', inputSet.id, 'airline', e.target.value)}
                                                                        placeholder="e.g., Air France"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Route</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.route}
                                                                        onChange={(e) => handleInputSetChange('flight', inputSet.id, 'route', e.target.value)}
                                                                        placeholder="e.g., NYC to Paris"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Departure</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.departure}
                                                                        onChange={(e) => handleInputSetChange('flight', inputSet.id, 'departure', e.target.value)}
                                                                        placeholder="e.g., 10:00 AM"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Arrival</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.arrival}
                                                                        onChange={(e) => handleInputSetChange('flight', inputSet.id, 'arrival', e.target.value)}
                                                                        placeholder="e.g., 11:00 PM"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Price</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={inputSet.data.price}
                                                                onChange={(e) => handleInputSetChange('flight', inputSet.id, 'price', e.target.value)}
                                                                placeholder="e.g., $500"
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={() => addMoreInputSet('flight')}
                                                disabled={isSubmitting || flightInputs.length >= MAX_ITEMS}
                                            >
                                                <i className="fa fa-plus me-2"></i> Add More Flight
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* VISA DETAILS */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="visaCheck"
                                                    checked={checkedItems.visa}
                                                    onChange={() => handleCheckboxChange('visa')}
                                                    disabled={isSubmitting}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="visaCheck">
                                                    🛂 Visa Details
                                                </label>
                                            </div>
                                            <small className="text-muted">({visaInputs.length}/{MAX_ITEMS})</small>
                                        </div>
                                    </div>
                                    {checkedItems.visa && (
                                        <div className="card-body">
                                            {visaInputs.map((inputSet, index) => (
                                                <div key={inputSet.id} className="card mb-3 border-success">
                                                    <div className="card-header bg-success bg-opacity-10">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="fw-bold">Visa #{index + 1}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeInputSet('visa', inputSet.id)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Country</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.country}
                                                                        onChange={(e) => handleInputSetChange('visa', inputSet.id, 'country', e.target.value)}
                                                                        placeholder="e.g., France"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Type</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.type}
                                                                        onChange={(e) => handleInputSetChange('visa', inputSet.id, 'type', e.target.value)}
                                                                        placeholder="e.g., Schengen"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Duration</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.duration}
                                                                        onChange={(e) => handleInputSetChange('visa', inputSet.id, 'duration', e.target.value)}
                                                                        placeholder="e.g., 90 days"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-0">
                                                                    <label className="form-label">Cost</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.cost}
                                                                        onChange={(e) => handleInputSetChange('visa', inputSet.id, 'cost', e.target.value)}
                                                                        placeholder="e.g., $80"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={() => addMoreInputSet('visa')}
                                                disabled={isSubmitting || visaInputs.length >= MAX_ITEMS}
                                            >
                                                <i className="fa fa-plus me-2"></i> Add More Visa
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* TRAVEL DETAILS */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="form-check mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="travelCheck"
                                                    checked={checkedItems.travel}
                                                    onChange={() => handleCheckboxChange('travel')}
                                                    disabled={isSubmitting}
                                                />
                                                <label className="form-check-label fw-bold" htmlFor="travelCheck">
                                                    🌍 Travel Details
                                                </label>
                                            </div>
                                            <small className="text-muted">({travelInputs.length}/{MAX_ITEMS})</small>
                                        </div>
                                    </div>
                                    {checkedItems.travel && (
                                        <div className="card-body">
                                            {travelInputs.map((inputSet, index) => (
                                                <div key={inputSet.id} className="card mb-3 border-primary">
                                                    <div className="card-header bg-primary bg-opacity-10">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="fw-bold">Travel Plan #{index + 1}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => removeInputSet('travel', inputSet.id)}
                                                                disabled={isSubmitting}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Destination</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.destination}
                                                                        onChange={(e) => handleInputSetChange('travel', inputSet.id, 'destination', e.target.value)}
                                                                        placeholder="e.g., Paris"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Duration</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.duration}
                                                                        onChange={(e) => handleInputSetChange('travel', inputSet.id, 'duration', e.target.value)}
                                                                        placeholder="e.g., 7 days"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Activities</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.activities}
                                                                        onChange={(e) => handleInputSetChange('travel', inputSet.id, 'activities', e.target.value)}
                                                                        placeholder="e.g., Sightseeing, Museum tours"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-0">
                                                                    <label className="form-label">Cost</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={inputSet.data.cost}
                                                                        onChange={(e) => handleInputSetChange('travel', inputSet.id, 'cost', e.target.value)}
                                                                        placeholder="e.g., $1200"
                                                                        disabled={isSubmitting}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={() => addMoreInputSet('travel')}
                                                disabled={isSubmitting || travelInputs.length >= MAX_ITEMS}
                                            >
                                                <i className="fa fa-plus me-2"></i> Add More Travel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Hotel Details - Saved Items */}
                                {addedDetails.filter(d => d.type === 'hotel').length > 0 && (
                                    <div className="card mb-4 border-0 bg-info bg-opacity-10">
                                        <div className="card-header bg-info bg-opacity-25 border-0">
                                            <h6 className="mb-0 text-info">
                                                <i className="fa fa-check-circle me-2"></i>🏨 Hotels Saved ({addedDetails.filter(d => d.type === 'hotel').length})
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {addedDetails.filter(d => d.type === 'hotel').map((detail) => (
                                                <div key={detail.id} className="alert alert-info mb-2 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={true} disabled readOnly />
                                                            <label className="form-check-label fw-bold">
                                                                {detail.data.name} ({detail.data.stars}⭐) - ${detail.data.price}
                                                            </label>
                                                        </div>
                                                        <small className="text-muted d-block ms-4">{detail.data.description}</small>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveDetail(detail.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <i className="fa fa-trash me-1"></i> Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Flight Details - Saved Items */}
                                {addedDetails.filter(d => d.type === 'flight').length > 0 && (
                                    <div className="card mb-4 border-0 bg-warning bg-opacity-10">
                                        <div className="card-header bg-warning bg-opacity-25 border-0">
                                            <h6 className="mb-0 text-warning">
                                                <i className="fa fa-check-circle me-2"></i>✈️ Flights Saved ({addedDetails.filter(d => d.type === 'flight').length})
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {addedDetails.filter(d => d.type === 'flight').map((detail) => (
                                                <div key={detail.id} className="alert alert-warning mb-2 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={true} disabled readOnly />
                                                            <label className="form-check-label fw-bold">
                                                                {detail.data.airline} - {detail.data.route} ({detail.data.departure} → {detail.data.arrival})
                                                            </label>
                                                        </div>
                                                        <small className="text-muted d-block ms-4">Price: ${detail.data.price}</small>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveDetail(detail.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <i className="fa fa-trash me-1"></i> Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Visa Details - Saved Items */}
                                {addedDetails.filter(d => d.type === 'visa').length > 0 && (
                                    <div className="card mb-4 border-0 bg-success bg-opacity-10">
                                        <div className="card-header bg-success bg-opacity-25 border-0">
                                            <h6 className="mb-0 text-success">
                                                <i className="fa fa-check-circle me-2"></i>🛂 Visas Saved ({addedDetails.filter(d => d.type === 'visa').length})
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {addedDetails.filter(d => d.type === 'visa').map((detail) => (
                                                <div key={detail.id} className="alert alert-success mb-2 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={true} disabled readOnly />
                                                            <label className="form-check-label fw-bold">
                                                                {detail.data.country} - {detail.data.type} ({detail.data.duration})
                                                            </label>
                                                        </div>
                                                        <small className="text-muted d-block ms-4">Cost: ${detail.data.cost}</small>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveDetail(detail.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <i className="fa fa-trash me-1"></i> Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Travel Details - Saved Items */}
                                {addedDetails.filter(d => d.type === 'travel').length > 0 && (
                                    <div className="card mb-4 border-0 bg-primary bg-opacity-10">
                                        <div className="card-header bg-primary bg-opacity-25 border-0">
                                            <h6 className="mb-0 text-primary">
                                                <i className="fa fa-check-circle me-2"></i>🌍 Travel Plans Saved ({addedDetails.filter(d => d.type === 'travel').length})
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {addedDetails.filter(d => d.type === 'travel').map((detail) => (
                                                <div key={detail.id} className="alert alert-primary mb-2 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={true} disabled readOnly />
                                                            <label className="form-check-label fw-bold">
                                                                {detail.data.destination} - {detail.data.duration}
                                                            </label>
                                                        </div>
                                                        <small className="text-muted d-block ms-4">Activities: {detail.data.activities} | Cost: ${detail.data.cost}</small>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveDetail(detail.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <i className="fa fa-trash me-1"></i> Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Images Upload */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <h6 className="mb-0">Images</h6>
                                    </div>
                                    <div className="card-body">
                                        <input
                                            type="file"
                                            className="form-control form-control-lg"
                                            name="images"
                                            onChange={handleImageChange}
                                            multiple
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
                                        {formData.images.length > 0 && (
                                            <small className="text-muted d-block mt-2">
                                                <i className="fa fa-check-circle text-success me-2"></i>
                                                {formData.images.length} image(s) selected
                                            </small>
                                        )}

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="mt-4">
                                                <h6 className="mb-3">Preview</h6>
                                                <div className="row g-2">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="col-md-4 col-sm-6">
                                                            <div className="position-relative">
                                                                <img
                                                                    src={preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="img-fluid rounded border"
                                                                    style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                                                                />
                                                                <small className="position-absolute top-0 start-0 badge bg-primary m-2">
                                                                    #{index + 1}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Settings Section */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-header bg-transparent border-bottom">
                                        <h6 className="mb-0">⚙️ Quote Settings</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="showHotelName"
                                                checked={formData.show_hotel_name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, show_hotel_name: e.target.checked }))}
                                                disabled={isSubmitting}
                                            />
                                            <label className="form-check-label" htmlFor="showHotelName">
                                                <strong>Display Hotel Name</strong> - Show hotel names in the preview
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="showIndividualPrice"
                                                checked={formData.show_individual_price}
                                                onChange={(e) => setFormData(prev => ({ ...prev, show_individual_price: e.target.checked }))}
                                                disabled={isSubmitting}
                                            />
                                            <label className="form-check-label" htmlFor="showIndividualPrice">
                                                <strong>Display Individual Price</strong> - Show individual prices for each service
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Price Summary */}
                                <div className="card mb-4 border-0" style={{ background: 'linear-gradient(135deg, #1e6fe0 0%, #0f4fb0 100%)' }}>
                                    <div className="card-body text-white">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <small className="d-block mb-2" style={{ opacity: 0.9 }}>Services Added</small>
                                                <h5 className="mb-0">
                                                    {hotelInputs.length +
                                                        flightInputs.length +
                                                        visaInputs.length +
                                                        travelInputs.length +
                                                        addedDetails.length} Item(s)
                                                </h5>
                                            </div>
                                            <div className="col-md-6 text-end">
                                                <small className="d-block mb-2" style={{ opacity: 0.9 }}>Total Price</small>
                                                <h3 className="mb-0" style={{ fontSize: '28px', fontWeight: 700 }}>
                                                    ${calculateTotalPrice().toFixed(2)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer bg-light">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-check me-2"></i>
                                        Create Quote
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

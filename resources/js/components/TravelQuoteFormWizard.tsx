import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import DatePicker from './DatePicker';
import CountrySelect from './CountrySelect';
import RouteSelector from './RouteSelector';

interface WizardProps {
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    currencySymbol?: string;
    initialData?: any;
}

interface Hotel {
    id: string;
    name: string;
    displayName: string;
    stars: string;
    price: string;
    description: string;
    location: string;
    address: string;
    startDate: string;
}

interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    route: string;
    departure: string;
    arrival: string;
    duration: string;
    cabin: string;
    price: string;
    visaType: string;
    country: string;
    journeyType: 'outbound' | 'inbound';
}

interface Visa {
    id: string;
    country: string;
    type: string;
    duration: string;
    processingTime: string;
    cost: string;
    notes: string;
}

interface Transport {
    id: string;
    vehicleType: string;
    pickup: string;
    dropoff: string;
    driver: string;
    price: string;
}

export default function TravelQuoteFormWizard({
    show,
    onClose,
    onSuccess,
    currencySymbol = '£',
    initialData
}: WizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 7;
    const isEditing = !!initialData;

    const [formData, setFormData] = useState({
        display_name: '',
        check_in_date: '',
        checkout_date: '',
        night: '',
        expiry_date: '',
        half_board: '',
        all_inclusive: '',
        show_hotel_name: false,
        show_individual_price: false,
        per_person_pricing: false,
        adults: 1,
        children: 0,
        infants: 0,
        include_terms: false,
        include_logo: false,
        discount: 0,
        tax: 0,
    });

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [visas, setVisas] = useState<Visa[]>([]);
    const [transports, setTransports] = useState<Transport[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (show && isEditing && initialData) {
            setCurrentStep(1);

            // Ensure dates are in YYYY-MM-DD format
            const formatDate = (date: any) => {
                if (!date) return '';
                if (typeof date === 'string') {
                    // If already formatted, return it
                    if (date.match(/^\d{4}-\d{2}-\d{2}/)) {
                        return date.split('T')[0];
                    }
                }
                return date;
            };

            setFormData({
                display_name: initialData.display_name || '',
                check_in_date: formatDate(initialData.check_in_date),
                checkout_date: formatDate(initialData.checkout_date),
                night: initialData.night || '',
                expiry_date: formatDate(initialData.expiry_date),
                half_board: initialData.half_board || '',
                all_inclusive: initialData.all_inclusive || '',
                show_hotel_name: !!initialData.show_hotel_name,
                show_individual_price: !!initialData.show_individual_price,
                per_person_pricing: !!initialData.per_person_pricing,
                adults: initialData.adults || 1,
                children: initialData.children || 0,
                infants: initialData.infants || 0,
                include_terms: !!initialData.include_terms,
                include_logo: !!initialData.include_logo,
                discount: initialData.discount || 0,
                tax: initialData.tax || 0,
            });

            if (initialData.hotel_details) {
                setHotels(initialData.hotel_details.map((h: any) => ({
                    id: Math.random().toString(),
                    name: h.name || '',
                    displayName: h.displayName || '',
                    stars: h.stars || '',
                    price: h.price || '',
                    description: h.description || '',
                    location: h.location || '',
                    address: h.address || '',
                    startDate: h.startDate || ''
                })));
            }

            if (initialData.flight_details) {
                setFlights(initialData.flight_details.map((f: any) => ({
                    id: Math.random().toString(),
                    airline: f.airline || '',
                    flightNumber: f.flightNumber || '',
                    route: f.route || '',
                    departure: f.departure || '',
                    arrival: f.arrival || '',
                    duration: f.duration || '',
                    cabin: f.cabin || '',
                    price: f.price || '',
                    visaType: f.visaType || '',
                    country: f.country || '',
                    journeyType: f.journeyType || 'outbound'
                })));
            }

            if (initialData.visa_details) {
                setVisas(initialData.visa_details.map((v: any) => ({
                    id: Math.random().toString(),
                    country: v.country || '',
                    type: v.type || '',
                    duration: v.duration || '',
                    processingTime: v.processingTime || '',
                    cost: v.cost || '',
                    notes: v.notes || ''
                })));
            }

            if (initialData.travel_details) {
                setTransports(initialData.travel_details.map((t: any) => ({
                    id: Math.random().toString(),
                    vehicleType: t.vehicleType || '',
                    pickup: t.pickup || '',
                    dropoff: t.dropoff || '',
                    driver: t.driver || '',
                    price: t.price || ''
                })));
            }

            if (initialData.image_urls) {
                setImagePreviews(initialData.image_urls);
            }
        } else if (show && !isEditing) {
            setCurrentStep(1);
            setFormData({
                display_name: '',
                check_in_date: '',
                checkout_date: '',
                night: '',
                expiry_date: '',
                half_board: '',
                all_inclusive: '',
                show_hotel_name: false,
                show_individual_price: false,
                per_person_pricing: false,
                adults: 1,
                children: 0,
                infants: 0,
                include_terms: false,
                include_logo: false,
                discount: 0,
                tax: 0,
            });
            setHotels([]);
            setFlights([]);
            setVisas([]);
            setTransports([]);
            setImages([]);
            setImagePreviews([]);
        }
    }, [show, isEditing, initialData]);

    const calculateTotal = () => {
        let total = 0;
        hotels.forEach(h => total += parseFloat(h.price) || 0);
        flights.forEach(f => total += parseFloat(f.price) || 0);
        visas.forEach(v => total += parseFloat(v.cost) || 0);
        transports.forEach(t => total += parseFloat(t.price) || 0);
        return total;
    };

    const baseTotal = calculateTotal();
    const totalTravelers = Number(formData.adults || 1) + Number(formData.children || 0) + Number(formData.infants || 0);
    const priceBeforeTax = formData.per_person_pricing ? baseTotal * totalTravelers : baseTotal;
    const taxAmount = (priceBeforeTax * (formData.tax / 100)) || 0;
    const finalTotal = priceBeforeTax - (formData.discount || 0) + taxAmount;

    const calculateNights = (checkIn: string, checkOut: string) => {
        if (!checkIn || !checkOut) return 0;
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleDateChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-calculate nights when dates change
        if ((field === 'check_in_date' || field === 'checkout_date')) {
            const checkIn = field === 'check_in_date' ? value : formData.check_in_date;
            const checkOut = field === 'checkout_date' ? value : formData.checkout_date;

            if (checkIn && checkOut) {
                const nights = calculateNights(checkIn, checkOut);
                setFormData(prev => ({
                    ...prev,
                    night: nights.toString()
                }));
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const addHotel = () => {
        setHotels([...hotels, {
            id: Date.now().toString(),
            name: '',
            displayName: '',
            stars: '',
            price: '',
            description: '',
            location: '',
            address: '',
            startDate: ''
        }]);
    };

    const updateHotel = (id: string, field: string, value: string) => {
        setHotels(hotels.map(h => h.id === id ? { ...h, [field]: value } : h));
    };

    const removeHotel = (id: string) => {
        setHotels(hotels.filter(h => h.id !== id));
    };

    const addFlight = () => {
        setFlights([...flights, {
            id: Date.now().toString(),
            airline: '',
            flightNumber: '',
            route: '',
            departure: '',
            arrival: '',
            duration: '',
            cabin: '',
            price: '',
            visaType: '',
            country: '',
            journeyType: 'outbound'
        }]);
    };

    const updateFlight = (id: string, field: string, value: string) => {
        setFlights(flights.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const removeFlight = (id: string) => {
        setFlights(flights.filter(f => f.id !== id));
    };

    const addVisa = () => {
        setVisas([...visas, { id: Date.now().toString(), country: '', type: '', duration: '', processingTime: '', cost: '', notes: '' }]);
    };

    const updateVisa = (id: string, field: string, value: string) => {
        setVisas(visas.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const removeVisa = (id: string) => {
        setVisas(visas.filter(v => v.id !== id));
    };

    const addTransport = () => {
        setTransports([...transports, {
            id: Date.now().toString(),
            vehicleType: '',
            pickup: '',
            dropoff: '',
            driver: '',
            price: ''
        }]);
    };

    const updateTransport = (id: string, field: string, value: string) => {
        setTransports(transports.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const removeTransport = (id: string) => {
        setTransports(transports.filter(t => t.id !== id));
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.display_name) newErrors.display_name = 'Display name is required';
            if (!formData.check_in_date) newErrors.check_in_date = 'Check-in date is required';
            if (!formData.checkout_date) newErrors.checkout_date = 'Check-out date is required';
            if (!formData.night) newErrors.night = 'Number of nights is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const goToStep = (step: number) => {
        if (step < currentStep || validateStep(currentStep)) {
            setCurrentStep(step);
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            const formDataToSubmit = new FormData();

            formDataToSubmit.append('display_name', formData.display_name);
            formDataToSubmit.append('check_in_date', formData.check_in_date);
            formDataToSubmit.append('checkout_date', formData.checkout_date);
            formDataToSubmit.append('night', formData.night);
            formDataToSubmit.append('expiry_date', formData.expiry_date);
            formDataToSubmit.append('half_board', formData.half_board);
            formDataToSubmit.append('all_inclusive', formData.all_inclusive);
            formDataToSubmit.append('show_hotel_name', formData.show_hotel_name ? '1' : '0');
            formDataToSubmit.append('show_individual_price', formData.show_individual_price ? '1' : '0');
            formDataToSubmit.append('per_person_pricing', formData.per_person_pricing ? '1' : '0');
            formDataToSubmit.append('adults', formData.adults.toString());
            formDataToSubmit.append('children', formData.children.toString());
            formDataToSubmit.append('infants', formData.infants.toString());
            formDataToSubmit.append('created_at', new Date().toISOString());

            const priceSummary = {
                price_per_person: baseTotal.toFixed(2),
                total_persons: totalTravelers,
                subtotal: priceBeforeTax.toFixed(2),
                discount: formData.discount,
                tax_percent: formData.tax,
                tax_amount: taxAmount.toFixed(2),
                final_total: finalTotal.toFixed(2)
            };
            formDataToSubmit.append('price_summary', JSON.stringify(priceSummary));
            formDataToSubmit.append('total_price', finalTotal.toString());

            if (hotels.length > 0) {
                formDataToSubmit.append('hotel_details', JSON.stringify(hotels.map(h => ({
                    name: h.name,
                    displayName: h.displayName,
                    stars: h.stars,
                    price: h.price,
                    location: h.location,
                    address: h.address,
                    description: h.description
                }))));
            }

            if (flights.length > 0) {
                formDataToSubmit.append('flight_details', JSON.stringify(flights.map(f => ({
                    airline: f.airline,
                    flightNumber: f.flightNumber,
                    route: f.route,
                    departure: f.departure,
                    arrival: f.arrival,
                    price: f.price,
                    journeyType: f.journeyType
                }))));
            }

            if (visas.length > 0) {
                formDataToSubmit.append('visa_details', JSON.stringify(visas.map(v => ({
                    country: v.country,
                    type: v.type,
                    duration: v.duration,
                    cost: v.cost
                }))));
            }

            if (transports.length > 0) {
                formDataToSubmit.append('travel_details', JSON.stringify(transports.map(t => ({
                    vehicleType: t.vehicleType,
                    pickup: t.pickup,
                    dropoff: t.dropoff,
                    price: t.price
                }))));
            }

            images.forEach((file, index) => {
                formDataToSubmit.append(`images[${index}]`, file);
            });

            if (isEditing && initialData) {
                formDataToSubmit.append('_method', 'PUT');
                router.post(`/admin/travel-quote/${initialData.uid}`, formDataToSubmit, {
                    onSuccess: () => {
                        toast.success('Travel Quote updated successfully');
                        setIsSubmitting(false);
                        onClose();
                        onSuccess?.();
                    },
                    onError: (errors: any) => {
                        setIsSubmitting(false);
                        setErrors(errors);
                        toast.error('Please fix the validation errors');
                    }
                });
            } else {
                router.post('/admin/travel-quote', formDataToSubmit, {
                    onSuccess: () => {
                        toast.success('Travel Quote created successfully');
                        setIsSubmitting(false);
                        onClose();
                        onSuccess?.();
                    },
                    onError: (errors: any) => {
                        setIsSubmitting(false);
                        setErrors(errors);
                        toast.error('Please fix the validation errors');
                    }
                });
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.error('An error occurred');
            console.error(error);
        }
    };

    if (!show) return null;

    const steps = [
        { num: 1, label: 'Basic Info', icon: '📋' },
        { num: 2, label: 'Hotels', icon: '🏨' },
        { num: 3, label: 'Flights', icon: '✈️' },
        { num: 4, label: 'Visa', icon: '🛂' },
        { num: 5, label: 'Transport', icon: '🚗' },
        { num: 6, label: 'Images', icon: '📸' },
        { num: 7, label: 'Review', icon: '✓' },
    ];

    const progressPercentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: show ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1050,
                padding: '20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '1100px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '98vh',
                    height: '98vh'
                }}>
                    {/* Sticky Header */}
                    <div style={{
                        padding: '24px 32px',
                        borderBottom: '1px solid #e5e7eb',
                        background: '#f8fafc'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{isEditing ? 'Edit Travel Quote' : 'Create Travel Quote'}</h2>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>{progressPercentage}% Complete</p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: '#e5e7eb',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progressPercentage}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #6d28d9, #7c3aed)',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div style={{
                        padding: '24px 32px',
                        borderBottom: '1px solid #e5e7eb',
                        background: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        {steps.map((step, idx) => (
                            <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <div
                                    onClick={() => goToStep(step.num)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: currentStep >= step.num ? 'linear-gradient(135deg, #6d28d9, #7c3aed)' : currentStep > step.num ? '#10b981' : '#e5e7eb',
                                        color: currentStep >= step.num ? '#ffffff' : '#6b7280',
                                        fontWeight: 600,
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {currentStep > step.num ? '✓' : step.num}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginLeft: '8px',
                                    minWidth: 0
                                }}>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Step {step.num}</span>
                                    <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 600 }}>{step.label}</span>
                                </div>

                                {idx < steps.length - 1 && (
                                    <div style={{
                                        flex: 1,
                                        height: '2px',
                                        background: currentStep > step.num ? 'linear-gradient(90deg, #6d28d9, #7c3aed)' : '#e5e7eb',
                                        margin: '0 8px',
                                        transition: 'background 0.3s ease'
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '32px',
                        background: '#f8fafc',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>📋 Basic Information</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Display Name *</label>
                                        <input
                                            type="text"
                                            name="display_name"
                                            value={formData.display_name}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Paris Summer Getaway"
                                            style={{
                                                width: '100%',
                                                padding: '11px 12px',
                                                border: `2px solid ${errors.display_name ? '#ef4444' : '#e5e7eb'}`,
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit',
                                                transition: 'border-color 0.2s'
                                            }}
                                        />
                                        {errors.display_name && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.display_name}</p>}
                                    </div>

                                    <div>
                                        <DatePicker
                                            label="Expiry Date"
                                            value={formData.expiry_date}
                                            onChange={(date) => setFormData(prev => ({ ...prev, expiry_date: date }))}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            autoSelect={true}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                    <div>
                                        <DatePicker
                                            label="Check-in *"
                                            value={formData.check_in_date}
                                            onChange={(date) => handleDateChange('check_in_date', date)}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            autoSelect={true}
                                        />
                                        {errors.check_in_date && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.check_in_date}</p>}
                                    </div>

                                    <div>
                                        <DatePicker
                                            label="Check-out *"
                                            value={formData.checkout_date}
                                            onChange={(date) => handleDateChange('checkout_date', date)}
                                            minDate={formData.check_in_date || new Date().toISOString().split('T')[0]}
                                            autoSelect={true}
                                        />
                                        {errors.checkout_date && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.checkout_date}</p>}
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Nights *</label>
                                        <input
                                            type="number"
                                            name="night"
                                            value={formData.night}
                                            onChange={handleFormChange}
                                            min="1"
                                            style={{
                                                width: '100%',
                                                padding: '11px 12px',
                                                border: `2px solid ${errors.night ? '#ef4444' : '#e5e7eb'}`,
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                        {errors.night && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0' }}>{errors.night}</p>}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Half Board</label>
                                        <select
                                            name="half_board"
                                            value={formData.half_board}
                                            onChange={handleFormChange}
                                            style={{
                                                width: '100%',
                                                padding: '11px 12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit'
                                            }}
                                        >
                                            <option value="">Select option</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                            <option value="Yes with breakfast">Yes with breakfast</option>
                                            <option value="Yes with lunch">Yes with lunch</option>
                                            <option value="Yes with dinner">Yes with dinner</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>All Inclusive</label>
                                        <select
                                            name="all_inclusive"
                                            value={formData.all_inclusive}
                                            onChange={handleFormChange}
                                            style={{
                                                width: '100%',
                                                padding: '11px 12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontFamily: 'inherit'
                                            }}
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
                        )}

                        {/* Step 2: Hotels */}
                        {currentStep === 2 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>🏨 Hotels</h3>
                                    <button
                                        onClick={addHotel}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Hotel
                                    </button>
                                </div>

                                {hotels.length === 0 ? (
                                    <div style={{
                                        padding: '32px',
                                        textAlign: 'center',
                                        background: '#f3f4f6',
                                        borderRadius: '12px',
                                        color: '#6b7280'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '14px' }}>No hotels added yet. Click "Add Hotel" to get started.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {hotels.map((hotel) => (
                                            <div
                                                key={hotel.id}
                                                style={{
                                                    background: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    transition: 'box-shadow 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                                    <input type="text" placeholder="Hotel Name" value={hotel.name} onChange={(e) => updateHotel(hotel.id, 'name', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <input type="text" placeholder="Display Name" value={hotel.displayName} onChange={(e) => updateHotel(hotel.id, 'displayName', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <input type="text" placeholder="Stars" value={hotel.stars} onChange={(e) => updateHotel(hotel.id, 'stars', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <input type="number" placeholder="Price" value={hotel.price} onChange={(e) => updateHotel(hotel.id, 'price', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <CountrySelect
                                                        value={hotel.address}
                                                        onChange={(value) => updateHotel(hotel.id, 'address', value)}
                                                        placeholder="Select Country"
                                                    />
                                                    <input type="text" placeholder="Location/City" value={hotel.location} onChange={(e) => updateHotel(hotel.id, 'location', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                </div>
                                                <textarea placeholder="Description" value={hotel.description} onChange={(e) => updateHotel(hotel.id, 'description', e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', minHeight: '60px', resize: 'vertical', marginBottom: '12px' }} />
                                                <button onClick={() => removeHotel(hotel.id)} style={{ padding: '8px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Flights */}
                        {currentStep === 3 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>✈️ Flights</h3>
                                    <button
                                        onClick={addFlight}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Flight
                                    </button>
                                </div>

                                {flights.length === 0 ? (
                                    <div style={{
                                        padding: '32px',
                                        textAlign: 'center',
                                        background: '#f3f4f6',
                                        borderRadius: '12px',
                                        color: '#6b7280'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '14px' }}>No flights added yet. Click "Add Flight" to get started.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {flights.map((flight) => (
                                            <div key={flight.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
                                                {/* Journey Type Badge */}
                                                <div style={{ marginBottom: '12px' }}>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Journey Type</label>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateFlight(flight.id, 'journeyType', 'outbound')}
                                                            style={{
                                                                flex: 1,
                                                                padding: '8px 12px',
                                                                background: flight.journeyType === 'outbound' ? '#6d28d9' : '#f3f4f6',
                                                                color: flight.journeyType === 'outbound' ? '#ffffff' : '#374151',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            📤 Outbound
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateFlight(flight.id, 'journeyType', 'inbound')}
                                                            style={{
                                                                flex: 1,
                                                                padding: '8px 12px',
                                                                background: flight.journeyType === 'inbound' ? '#6d28d9' : '#f3f4f6',
                                                                color: flight.journeyType === 'inbound' ? '#ffffff' : '#374151',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            📥 Inbound
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                                    <input type="text" placeholder="Airline" value={flight.airline} onChange={(e) => updateFlight(flight.id, 'airline', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <input type="text" placeholder="Flight Number" value={flight.flightNumber} onChange={(e) => updateFlight(flight.id, 'flightNumber', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <div style={{ gridColumn: '1 / -1' }}>
                                                        <RouteSelector
                                                            value={flight.route}
                                                            onChange={(route) => updateFlight(flight.id, 'route', route)}
                                                        />
                                                    </div>
                                                    <input type="time" placeholder="Departure Time" value={flight.departure} onChange={(e) => updateFlight(flight.id, 'departure', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <input type="time" placeholder="Arrival Time" value={flight.arrival} onChange={(e) => updateFlight(flight.id, 'arrival', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <input type="number" placeholder="Price" value={flight.price} onChange={(e) => updateFlight(flight.id, 'price', e.target.value)} style={{ padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px' }} />
                                                    <button onClick={() => removeFlight(flight.id)} style={{ padding: '8px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', gridColumn: '1 / -1' }}>Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Visa */}
                        {currentStep === 4 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>🛂 Visa</h3>
                                    <button
                                        onClick={addVisa}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Visa
                                    </button>
                                </div>

                                {visas.length === 0 ? (
                                    <div style={{
                                        padding: '32px',
                                        textAlign: 'center',
                                        background: '#f3f4f6',
                                        borderRadius: '12px',
                                        color: '#6b7280'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '14px' }}>No visas added yet. Click "Add Visa" to get started.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {visas.map((visa) => (
                                            <div
                                                key={visa.id}
                                                style={{
                                                    background: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    padding: '16px'
                                                }}
                                            >
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                                    <CountrySelect
                                                        value={visa.country}
                                                        onChange={(value) => updateVisa(visa.id, 'country', value)}
                                                        placeholder="Select Country"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Visa Type"
                                                        value={visa.type}
                                                        onChange={(e) => updateVisa(visa.id, 'type', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Duration"
                                                        value={visa.duration}
                                                        onChange={(e) => updateVisa(visa.id, 'duration', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Cost"
                                                        value={visa.cost}
                                                        onChange={(e) => updateVisa(visa.id, 'cost', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <textarea
                                                        placeholder="Notes"
                                                        value={visa.notes}
                                                        onChange={(e) => updateVisa(visa.id, 'notes', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
                                                            fontFamily: 'inherit',
                                                            minHeight: '60px',
                                                            gridColumn: '1 / -1',
                                                            resize: 'vertical'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => removeVisa(visa.id)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            background: '#fee2e2',
                                                            color: '#dc2626',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 5: Transportation */}
                        {currentStep === 5 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>🚗 Transportation</h3>
                                    <button
                                        onClick={addTransport}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Transport
                                    </button>
                                </div>

                                {transports.length === 0 ? (
                                    <div style={{
                                        padding: '32px',
                                        textAlign: 'center',
                                        background: '#f3f4f6',
                                        borderRadius: '12px',
                                        color: '#6b7280'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '14px' }}>No transportation added yet. Click "Add Transport" to get started.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {transports.map((transport) => (
                                            <div
                                                key={transport.id}
                                                style={{
                                                    background: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    padding: '16px'
                                                }}
                                            >
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Vehicle Type"
                                                        value={transport.vehicleType}
                                                        onChange={(e) => updateTransport(transport.id, 'vehicleType', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Pickup Location"
                                                        value={transport.pickup}
                                                        onChange={(e) => updateTransport(transport.id, 'pickup', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Drop-off Location"
                                                        value={transport.dropoff}
                                                        onChange={(e) => updateTransport(transport.id, 'dropoff', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={transport.price}
                                                        onChange={(e) => updateTransport(transport.id, 'price', e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            fontSize: '13px'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => removeTransport(transport.id)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            background: '#fee2e2',
                                                            color: '#dc2626',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 6: Images */}
                        {currentStep === 6 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>📸 Images & Documents</h3>

                                <div style={{
                                    border: '2px dashed #d1d5db',
                                    borderRadius: '12px',
                                    padding: '40px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: '#f9fafb'
                                }}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                        id="imageInput"
                                    />
                                    <label htmlFor="imageInput" style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px' }}>📤 Drag and drop images here</p>
                                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>or click to select files</p>
                                    </label>
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div style={{ marginTop: '24px' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '12px' }}>Uploaded Images</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                                            {imagePreviews.map((preview, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        position: 'relative',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        aspectRatio: '1'
                                                    }}
                                                >
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${idx}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => removeImage(idx)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '4px',
                                                            right: '4px',
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            background: '#ef4444',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            fontSize: '14px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 7: Review */}
                        {currentStep === 7 && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>✓ Review & Settings</h3>

                                {/* Basic Info Summary */}
                                <div style={{
                                    background: '#f0f9ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '16px'
                                }}>
                                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginBottom: '12px' }}>📋 Basic Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                                        <div>
                                            <span style={{ color: '#6b7280', fontWeight: 600 }}>Display Name:</span>
                                            <p style={{ margin: '4px 0 0', color: '#1f2937', fontWeight: 600 }}>{formData.display_name}</p>
                                        </div>
                                        <div>
                                            <span style={{ color: '#6b7280', fontWeight: 600 }}>Check-in:</span>
                                            <p style={{ margin: '4px 0 0', color: '#1f2937', fontWeight: 600 }}>{formData.check_in_date}</p>
                                        </div>
                                        <div>
                                            <span style={{ color: '#6b7280', fontWeight: 600 }}>Check-out:</span>
                                            <p style={{ margin: '4px 0 0', color: '#1f2937', fontWeight: 600 }}>{formData.checkout_date}</p>
                                        </div>
                                        <div>
                                            <span style={{ color: '#6b7280', fontWeight: 600 }}>Nights:</span>
                                            <p style={{ margin: '4px 0 0', color: '#1f2937', fontWeight: 600 }}>{formData.night}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Cards */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{
                                        background: '#f0fdf4',
                                        border: '1px solid #dcfce7',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px' }}>Hotels</p>
                                        <p style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e', margin: 0 }}>{hotels.length}</p>
                                    </div>
                                    <div style={{
                                        background: '#fef3c7',
                                        border: '1px solid #fde68a',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px' }}>Flights</p>
                                        <p style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', margin: 0 }}>{flights.length}</p>
                                    </div>
                                    <div style={{
                                        background: '#ecfdf5',
                                        border: '1px solid #d1fae5',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px' }}>Visas</p>
                                        <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', margin: 0 }}>{visas.length}</p>
                                    </div>
                                    <div style={{
                                        background: '#f3e8ff',
                                        border: '1px solid #e9d5ff',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px' }}>Transport</p>
                                        <p style={{ fontSize: '20px', fontWeight: 700, color: '#a855f7', margin: 0 }}>{transports.length}</p>
                                    </div>
                                </div>

                                

                                {/* Settings & Packages */}
                                <div style={{
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    marginBottom: '16px'
                                }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>Settings</h4>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input type="checkbox" name="show_hotel_name" checked={formData.show_hotel_name} onChange={handleFormChange} style={{ marginRight: '8px', width: '16px', height: '16px', cursor: 'pointer' }} />
                                            <span style={{ fontSize: '13px', color: '#374151' }}>Show Hotel Names</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input type="checkbox" name="show_individual_price" checked={formData.show_individual_price} onChange={handleFormChange} style={{ marginRight: '8px', width: '16px', height: '16px', cursor: 'pointer' }} />
                                            <span style={{ fontSize: '13px', color: '#374151' }}>Show Individual Prices</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input type="checkbox" name="per_person_pricing" checked={formData.per_person_pricing} onChange={handleFormChange} style={{ marginRight: '8px', width: '16px', height: '16px', cursor: 'pointer' }} />
                                            <span style={{ fontSize: '13px', color: '#374151' }}>Price is Single Person</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Member Selection - Display only if per_person_pricing is enabled */}
                                {formData.per_person_pricing && (
                                <div style={{
                                    background: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    marginBottom: '24px'
                                }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>👥 Travelers</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>👨 Adults</label>
                                            <input type="number" name="adults" min="0" value={formData.adults} onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>👧 Children</label>
                                            <input type="number" name="children" min="0" value={formData.children} onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>👶 Infants</label>
                                            <input type="number" name="infants" min="0" value={formData.infants} onChange={handleFormChange} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: 700 }} />
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* Price Summary - Display only if per_person_pricing is enabled */}
                                {formData.per_person_pricing && (
                                    <div style={{
                                        background: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '20px',
                                    }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>💰 Price Summary (Per Single Person)</h4>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '16px',
                                            marginBottom: '16px'
                                        }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Price Per Person × Total ({totalTravelers} persons)</label>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>£{baseTotal.toFixed(2)} × {totalTravelers} = £{(baseTotal * totalTravelers).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Discount</label>
                                                <input
                                                    type="number"
                                                    name="discount"
                                                    value={formData.discount}
                                                    onChange={handleFormChange}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px 10px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '13px'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Tax (%)</label>
                                            <input
                                                type="number"
                                                name="tax"
                                                value={formData.tax}
                                                onChange={handleFormChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '13px'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Tax Amount</label>
                                            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', margin: 0 }}>{currencySymbol}{taxAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div style={{
                                        borderTop: '3px solid #6d28d9',
                                        paddingTop: '16px',
                                        marginTop: '16px',
                                        background: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
                                        padding: '16px',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>💎 Final Total Amount</span>
                                            <span style={{ fontSize: '28px', fontWeight: 700, color: '#6d28d9' }}>{currencySymbol}{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                            </div>
                        )}
                            </div>
                        )}

                        <style>{`
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(10px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes spin {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>

                    {/* Sticky Footer */}
                    <div style={{
                        padding: '16px 32px',
                        background: '#ffffff',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                            Total: <span style={{ color: '#6d28d9' }}>{currencySymbol}{finalTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '10px 16px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            {currentStep > 1 && (
                                <button
                                    onClick={handlePrevious}
                                    style={{
                                        padding: '10px 16px',
                                        background: '#e5e7eb',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    ← Previous
                                </button>
                            )}
                            {currentStep < totalSteps && (
                                <button
                                    onClick={handleNext}
                                    style={{
                                        padding: '10px 16px',
                                        background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Next →
                                </button>
                            )}
                            {currentStep === totalSteps && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    type="button"
                                    style={{
                                        padding: '10px 20px',
                                        background: isSubmitting ? '#9333ea' : 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        opacity: isSubmitting ? 0.8 : 1,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        minWidth: '150px',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isSubmitting && (
                                        <span style={{
                                            display: 'inline-block',
                                            width: '16px',
                                            height: '16px',
                                            border: '2.5px solid rgba(255,255,255,0.4)',
                                            borderTop: '2.5px solid #ffffff',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite',
                                            flexShrink: 0
                                        }} />
                                    )}
                                    <span>{isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? '✓ Update Quote' : '✓ Create Quote')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

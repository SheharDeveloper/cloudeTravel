import { useState } from 'react';

interface PackageBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    packageData: {
        uid: string;
        name: string;
        destination_country: string;
        hotel_name?: string;
        duration_days: number;
        price: number;
    };
}

export default function PackageBookingModal({ isOpen, onClose, packageData }: PackageBookingModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        rooms: 1,
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'adults' || name === 'children' || name === 'infants' || name === 'rooms' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.email || !formData.phone || !formData.checkInDate || !formData.checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    service: 'package',
                    formData: {
                        firstName: formData.firstName,
                        email: formData.email,
                        phone: formData.phone,
                    },
                    searchParams: {
                        packageUid: packageData.uid,
                        packageName: packageData.name,
                        destinationCountry: packageData.destination_country,
                        hotelName: packageData.hotel_name || 'Package Hotel',
                        checkInDate: formData.checkInDate,
                        checkOutDate: formData.checkOutDate,
                        adults: formData.adults,
                        children: formData.children,
                        infants: formData.infants,
                        rooms: formData.rooms,
                        duration: packageData.duration_days,
                    },
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setFormData({
                        firstName: '',
                        email: '',
                        phone: '',
                        checkInDate: '',
                        checkOutDate: '',
                        adults: 1,
                        children: 0,
                        infants: 0,
                        rooms: 1,
                    });
                }, 2000);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Booking failed'}`);
            }
        } catch (error) {
            alert('Error submitting booking');
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ background: '#f9f9f9', padding: '40px', borderRadius: '8px', marginBottom: '40px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>âœ“</div>
                        <h2 style={{ color: '#0499ff', marginBottom: '8px', fontSize: '28px', fontWeight: 700 }}>
                            Booking Confirmed!
                        </h2>
                        <p style={{ color: '#666', fontSize: '16px' }}>
                            Your package booking has been submitted successfully. We'll contact you soon.
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0499ff', marginBottom: '24px' }}>
                            Complete Your Booking for {packageData.name}
                        </h2>

                        {/* Form Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                            {/* Name */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Your phone number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Check-in Date */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Check-in Date
                                </label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Check-out Date */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Check-out Date
                                </label>
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Adults */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Adults
                                </label>
                                <input
                                    type="number"
                                    name="adults"
                                    min="1"
                                    value={formData.adults}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Children */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Children
                                </label>
                                <input
                                    type="number"
                                    name="children"
                                    min="0"
                                    value={formData.children}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Infants */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Infants
                                </label>
                                <input
                                    type="number"
                                    name="infants"
                                    min="0"
                                    value={formData.infants}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            {/* Rooms */}
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0499ff', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    Rooms
                                </label>
                                <input
                                    type="number"
                                    name="rooms"
                                    min="1"
                                    value={formData.rooms}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    background: '#0499ff',
                                    color: '#fff',
                                    padding: '14px 48px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'background 0.3s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#0277d8')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = '#0499ff')}
                            >
                                CONFIRM BOOKING
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function FlightResults({ searchParams }: any) {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    service: 'flight',
                    formData,
                    searchParams,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Booking saved:', data);
                setSubmitted(true);
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting booking');
        }
    };

    return (
        <>
            <Head title="Flight Booking - CloudTravel" />

            <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ background: '#f0f8ff', padding: '40px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
                            <h1 style={{ fontSize: '32px', color: '#003d82', marginBottom: '15px' }}>✓ Thank You!</h1>
                            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px', lineHeight: 1.6 }}>
                                Your flight booking request has been submitted successfully.
                            </p>
                            <p style={{ fontSize: '18px', fontWeight: 700, color: '#ff6b35', marginBottom: '30px' }}>
                                Our team will connect with you soon.
                            </p>
                            <p style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
                                We will review your request and contact you within 24 hours via email or phone to confirm your booking.
                            </p>
                            <button
                                onClick={() => window.location.href = '/'}
                                style={{
                                    background: '#ff6b35',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 30px',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h1 style={{ fontSize: '28px', color: '#003d82', marginBottom: '10px', textAlign: 'center' }}>
                                ✈️ Complete Your Flight Booking
                            </h1>
                            <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
                                {searchParams.fromCity} → {searchParams.toCity} | {searchParams.adults + searchParams.children + searchParams.infants} Traveller(s)
                            </p>

                            <div style={{ background: '#f8fafb', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                {/* Step Indicator */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                    {[1, 2, 3].map(s => (
                                        <div
                                            key={s}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: step >= s ? '#0066cc' : '#ddd',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                            }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>

                                {/* Step 1: Personal Info */}
                                {step === 1 && (
                                    <div>
                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '15px' }}>
                                            Personal Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Contact Info */}
                                {step === 2 && (
                                    <div>
                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '15px' }}>
                                            Contact Information
                                        </h3>
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email ID"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review & Confirm */}
                                {step === 3 && (
                                    <div>
                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '15px' }}>
                                            Review & Confirm
                                        </h3>
                                        <div style={{ display: 'grid', gap: '10px', fontSize: '12px', color: '#666' }}>
                                            <p>
                                                <strong>Name:</strong> {formData.firstName} {formData.lastName}
                                            </p>
                                            <p>
                                                <strong>Email:</strong> {formData.email}
                                            </p>
                                            <p>
                                                <strong>Phone:</strong> {formData.phone}
                                            </p>
                                            <div style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px' }}>
                                                <p style={{ fontSize: '11px', color: '#999' }}>
                                                    Please review your information before confirming the booking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                                    {step > 1 && (
                                        <button
                                            onClick={handlePrev}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                background: '#fff',
                                                color: '#0066cc',
                                                border: '1px solid #0066cc',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                            }}
                                        >
                                            ← Previous
                                        </button>
                                    )}
                                    {step < 3 && (
                                        <button
                                            onClick={handleNext}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                background: '#0066cc',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Next →
                                        </button>
                                    )}
                                    {step === 3 && (
                                        <button
                                            onClick={handleSubmit}
                                            style={{
                                                flex: 1,
                                                padding: '10px',
                                                background: '#ff6b35',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                            }}
                                        >
                                            ✓ Submit Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

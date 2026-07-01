import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function HotelResults({ searchParams }: any) {
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

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            alert('Please fill in all fields');
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
                    service: 'hotel',
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
            <Head title="Hotel Booking - CloudTravel" />

            <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ background: '#f0f8ff', padding: '40px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
                            <h1 style={{ fontSize: '32px', color: '#0499ff', marginBottom: '15px' }}>âœ“ Thank You!</h1>
                            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px', lineHeight: 1.6 }}>
                                Your hotel booking request has been submitted successfully.
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
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '28px', color: '#0499ff', marginBottom: '10px', textAlign: 'center' }}>
                            ðŸ¨ Complete Your Hotel Booking
                        </h1>
                        <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
                            {searchParams.city} | Check-in: {searchParams.checkInDate} - Check-out: {searchParams.checkOutDate}
                        </p>

                        {/* Two-Section Form Layout - Side by Side */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', background: '#f8fafb', padding: '30px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            {/* Section 1: Personal Information */}
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0499ff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0066cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>1</span>
                                    Personal Information
                                </h3>
                                <div style={{ display: 'grid', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Enter your first name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1.5px solid #ddd',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Enter your last name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1.5px solid #ddd',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Contact Information */}
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0499ff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0066cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>2</span>
                                    Contact Information
                                </h3>
                                <div style={{ display: 'grid', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Email ID</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1.5px solid #ddd',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1.5px solid #ddd',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s',
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #e85a24 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '14px 60px',
                                    borderRadius: '6px',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.3)';
                                }}
                            >
                                âœ“ Submit Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}


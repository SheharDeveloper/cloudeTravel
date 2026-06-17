import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchDetails: {
        fromCity?: string;
        toCity?: string;
        hotelCity?: string;
        destinationCountry?: string;
        adults?: number;
        children?: number;
        infants?: number;
        checkInDate?: string;
        checkOutDate?: string;
        departureDate?: string;
        returnDate?: string;
        tripType?: string;
        selectedClass?: string;
        [key: string]: any;
    };
    serviceType: 'flight' | 'hotel' | 'visa' | 'package';
}

export default function BookingModal({ isOpen, onClose, searchDetails, serviceType }: BookingModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', email: '', phone: '' });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.email || !formData.phone) {
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
                    service: serviceType,
                    formData,
                    searchParams: searchDetails,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setFormData({ firstName: '', email: '', phone: '' });
                }, 3000);
            } else {
                alert('Error submitting booking');
            }
        } catch (error) {
            alert('Error submitting booking');
        }
    };

    // Blur page background when modal is open
    useEffect(() => {
        const appElement = document.getElementById('app');
        if (isOpen && appElement) {
            // Create a style element for the blur effect
            const style = document.createElement('style');
            style.id = 'modal-blur-style';
            style.innerHTML = `
                #app > * {
                    filter: blur(5px);
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);

            return () => {
                const styleEl = document.getElementById('modal-blur-style');
                if (styleEl) {
                    styleEl.remove();
                }
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const emoji = serviceType === 'flight' ? '✈️' : serviceType === 'hotel' ? '🏨' : serviceType === 'visa' ? '🛂' : '📦';
    const title = serviceType === 'flight' ? 'Flight' : serviceType === 'hotel' ? 'Hotel' : serviceType === 'visa' ? 'Visa' : 'Package';

    const modalContent = (
        <>
            {/* Dark Overlay */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 9999, animation: 'fadeIn 0.3s ease' }} />

            {/* Modal */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                {submitted ? (
                    // Thank You Popup
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', animation: 'slideUp 0.3s ease' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{emoji}</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '12px' }}>Thank You!</h2>
                        <p style={{ fontSize: '16px', color: '#666', marginBottom: '8px', lineHeight: '1.6' }}>
                            Thank you for booking with us. We're fetching the best {title.toLowerCase()} offers for you!
                        </p>
                        <p style={{ fontSize: '14px', color: '#999', marginBottom: '24px' }}>
                            Our team will contact you within 24 hours with {title.toLowerCase()} options.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                            <p style={{ fontSize: '14px', color: '#333', margin: 0 }}>Need more info?</p>
                            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#25D366', color: '#fff', borderRadius: '50%', fontSize: '20px', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <i className="fa fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                ) : (
                    // Booking Form Popup
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', minWidth: '700px', maxWidth: '85vw', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', animation: 'slideUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#003d82', margin: 0 }}>
                                {emoji} Complete Your {title} Booking
                            </h2>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>×</button>
                        </div>

                        {/* Form Fields */}
                        <div style={{ display: 'grid', gap: '14px', marginBottom: '24px' }}>
                            {/* Row 1: First Name (Full Width) */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>First Name</label>
                                <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box', transition: 'border-color 0.3s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'} onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'} />
                            </div>

                            {/* Row 2: Email and Phone (Side by Side) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                {/* Email */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Email</label>
                                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box', transition: 'border-color 0.3s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'} onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'} />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Phone</label>
                                    <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box', transition: 'border-color 0.3s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#0066cc'} onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'} />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={onClose} style={{ padding: '10px 20px', border: '1.5px solid #ddd', background: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#666', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#999'; e.currentTarget.style.background = '#f9f9f9'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.background = '#fff'; }}>
                                Cancel
                            </button>
                            <button onClick={handleSubmit} style={{ padding: '10px 30px', background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 102, 204, 0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                Submit Booking
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}
            </style>
        </>
    );

    return createPortal(modalContent, document.body);
}

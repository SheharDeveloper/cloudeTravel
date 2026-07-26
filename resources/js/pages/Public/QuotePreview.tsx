import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

interface TravelQuote {
    id: number;
    uid: string;
    display_name: string;
    check_in_date: string;
    checkout_date: string;
    night: number;
    hotel_details?: any[];
    flight_details?: any;
    visa_details?: any;
    travel_details?: any;
    start?: string;
    half_board?: string;
    all_inclusive?: string;
    images?: string[];
    image_urls?: string[];
    total_price?: number;
    tax?: number;
    discount?: number;
    show_hotel_name?: boolean;
    show_individual_price?: boolean;
    expiry_date?: string;
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString + (dateString.includes('T') ? '' : 'T00:00:00'));
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'N/A';
    }
};

export default function QuotePreview({ travelQuote, hasPreviousFeedback, feedbackStatus, deviceMatch, previousDeviceInfo }: { travelQuote: TravelQuote; hasPreviousFeedback?: boolean; feedbackStatus?: string; deviceMatch?: boolean; previousDeviceInfo?: any }) {
    const [activeModal, setActiveModal] = useState<'accept' | 'reject' | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<any>(null);

    useEffect(() => {
        const captureDeviceInfo = () => {
            const info = {
                userAgent: navigator.userAgent,
                browser: getBrowserType(navigator.userAgent),
                deviceType: getDeviceType(navigator.userAgent),
                timestamp: new Date().toISOString()
            };
            setDeviceInfo(info);
        };
        captureDeviceInfo();
    }, []);

    useEffect(() => {
        if (travelQuote.expiry_date) {
            const expiryDate = new Date(travelQuote.expiry_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expiryDate.setHours(0, 0, 0, 0);
            setIsExpired(expiryDate < today);
        }
    }, [travelQuote.expiry_date]);

    const getBrowserType = (userAgent: string): string => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Unknown';
    };

    const getDeviceType = (userAgent: string): string => {
        if (/Mobile|Android|iPhone/.test(userAgent)) return 'Mobile';
        if (/Tablet|iPad/.test(userAgent)) return 'Tablet';
        return 'Desktop';
    };

    const saveFeedback = (status: 'accept' | 'reject', reason?: string) => {
        const feedbackData = {
            travel_quote_uid: travelQuote.uid,
            decision: status,
            reason: reason || null,
            name: name,
            email: email,
            phone_number: phoneNumber
        };

        router.post('/quote/feedback/submit', feedbackData, {
            onSuccess: () => {
                setSubmitted(true);
                const message = status === 'accept'
                    ? '✓ Your booking has been accepted. Thank you!'
                    : '✕ Your booking has been rejected. We appreciate your feedback.';
                toast.success(message, {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: status === 'accept' ? '#10b981' : '#ef4444',
                        color: '#fff',
                        padding: '16px 24px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            },
            onError: (errors: any) => {
                console.error('Feedback error:', errors);
                toast.error('Error saving feedback. Please try again.', {
                    duration: 4000,
                    position: 'top-center',
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        padding: '16px 24px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }
                });
            }
        });
    };

    const handleAccept = () => {
        setActiveModal('accept');
        setSubmitted(false);
    };

    const handleSubmitAccept = () => {
        if (!isFormValid()) {
            alert('Please fill in all required fields: Name, Email, and Phone Number');
            return;
        }
        saveFeedback('accept');
    };

    const handleReject = () => {
        setActiveModal('reject');
        setRejectReason('');
        setSubmitted(false);
    };

    const isFormValid = () => {
        return name.trim() !== '' && email.trim() !== '' && phoneNumber.trim() !== '';
    };

    const handleSubmitReject = () => {
        if (!isFormValid()) {
            alert('Please fill in all required fields: Name, Email, and Phone Number');
            return;
        }
        saveFeedback('reject', rejectReason);
    };

    const closeModal = () => {
        setActiveModal(null);
        setRejectReason('');
        setSubmitted(false);
        setName('');
        setEmail('');
        setPhoneNumber('');
    };

    const getFirstHotelImage = () => {
        return travelQuote.image_urls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';
    };

    return (
        <div style={{
            margin: 0,
            padding: '40px 16px',
            background: '#eef1f5',
            minHeight: '100vh',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <div style={{
                width: '380px',
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid #e7ebf0'
            }}>
                {/* Brand Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 0',
                    position: 'relative',
                    marginTop: '-50px',
                    marginBottom: '-30px'

                }}>
                    <img src="/images/newlogo.jpeg" alt="CloudTravel" style={{ width: '140px', height: '140px', objectFit: 'contain' }} />
                </div>

                {/* Show Content Only if Quote NOT Expired AND NO Previous Feedback */}
                {!isExpired && !hasPreviousFeedback ? (
                <>
                {/* Hero Image */}
                <div style={{
                    position: 'relative',
                    margin: '0 12px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    height: '150px'
                }}>
                    <img src={getFirstHotelImage()} alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: '14px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))',
                        color: '#fff'
                    }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px' }}>{travelQuote.display_name}</div>
                        <div style={{ color: '#f5a623', fontSize: '13px', letterSpacing: '2px' }}>★★★★★</div>
                    </div>
                </div>


                {/* Accommodation Section */}
                <div style={{ padding: '16px 18px 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1e6fe0', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                        🏨 Accommodation
                    </div>
                    <div style={{ display: 'flex', background: '#f4f6f9', borderRadius: '12px', padding: '12px 6px', textAlign: 'center' }}>
                        <div style={{ flex: 1, borderRight: '1px solid #e7ebf0' }}>
                            <div style={{ fontSize: '10px', color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Check-in</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2233' }}>{formatDate(travelQuote.check_in_date)}</div>
                        </div>
                        <div style={{ flex: 1, borderRight: '1px solid #e7ebf0' }}>
                            <div style={{ fontSize: '10px', color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Check-out</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2233' }}>{formatDate(travelQuote.checkout_date)}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', color: '#8b93a1', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Nights</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2233' }}>{travelQuote.night}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#5b6472', padding: '10px 0 2px' }}>{travelQuote.half_board || 'Standard Board'}</div>
                </div>

                {/* Hotels Section */}
                {travelQuote.hotel_details && travelQuote.hotel_details.length > 0 && (
                    <div style={{ padding: '16px 18px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1e6fe0', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                            🏨 Hotels
                        </div>
                        {travelQuote.hotel_details.map((hotel: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '12px', padding: '12px', background: '#f4f6f9', borderRadius: '10px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2233', marginBottom: '4px' }}>
                                    {travelQuote.show_hotel_name ? `${hotel.name} - ${hotel.displayName}` : hotel.displayName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#5b6472', marginBottom: '2px' }}>
                                    {hotel.location && `📍 ${hotel.location}`}{hotel.address && `, ${hotel.address}`}
                                </div>
                                {travelQuote.show_individual_price && hotel.price && (
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e6fe0', marginTop: '4px' }}>
                                        £{Number(hotel.price).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Flight Section */}
                {travelQuote.flight_details && Array.isArray(travelQuote.flight_details) && travelQuote.flight_details.length > 0 && (
                    <div style={{ padding: '16px 18px 4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1e6fe0', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                            ✈️ Flights
                        </div>
                        {travelQuote.flight_details.map((flight: any, idx: number) => (
                            <div key={idx} style={{ marginBottom: '12px' }}>
                                {/* Journey Type Header */}
                                {(idx === 0 || travelQuote.flight_details[idx - 1]?.journeyType !== flight.journeyType) && (
                                    <div style={{ textAlign: 'center', fontSize: '11.5px', fontWeight: 700, color: '#1e6fe0', letterSpacing: '0.3px', margin: '12px 0 8px', position: 'relative' }}>
                                        {flight.journeyType === 'outbound' ? '📤 OUTBOUND JOURNEY' : '📥 INBOUND JOURNEY'}
                                    </div>
                                )}
                                <div style={{ padding: '12px', background: '#f4f6f9', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '9px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e6fe0', fontSize: '15px' }}>✈</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a2233' }}>{flight.airline || 'Flight'}</div>
                                            <div style={{ fontSize: '11px', color: '#8b93a1', marginTop: '2px' }}>Flight #{flight.flightNumber}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#5b6472', marginBottom: '4px' }}>📍 {flight.route}</div>
                                    <div style={{ fontSize: '12px', color: '#5b6472', marginBottom: '4px' }}>🕐 {flight.departure} → {flight.arrival}</div>
                                    {travelQuote.show_individual_price && flight.price && (
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e6fe0', marginTop: '6px' }}>
                                            £{Number(flight.price).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Price Summary */}
                <div style={{
                    margin: '14px 18px 16px',
                    background: '#f4f6f9',
                    borderRadius: '12px',
                    padding: '12px 14px'
                }}>
                    <div style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1e6fe0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                        marginBottom: '8px'
                    }}>Price Summary</div>
                    <div style={{ fontSize: '12px', color: '#5b6472', lineHeight: 1.8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>Subtotal:</span>
                            <span style={{ fontWeight: 600 }}>£{((Number(travelQuote.total_price) || 0) - (Number(travelQuote.tax) || 0) + (Number(travelQuote.discount) || 0)).toFixed(2)}</span>
                        </div>
                        {Number(travelQuote.tax) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span>Tax:</span>
                                <span style={{ fontWeight: 600 }}>£{(Number(travelQuote.tax) || 0).toFixed(2)}</span>
                            </div>
                        )}
                        {Number(travelQuote.discount) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Discount:</span>
                                <span style={{ fontWeight: 600 }}>-£{(Number(travelQuote.discount) || 0).toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ borderTop: '1px solid #e7ebf0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700 }}>Grand Total:</span>
                            <span style={{ fontWeight: 700, color: '#1e6fe0', fontSize: '14px' }}>£{(Number(travelQuote.total_price) || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footnote */}
                <div style={{
                    padding: '0 18px 12px',
                    fontSize: '10.5px',
                    color: '#8b93a1',
                    lineHeight: 1.6
                }}>
                    • Prices are subject to availability<br/>
                    • Terms & Conditions apply
                </div>
                </>
                ) : (
                // Show Contact Information if Quote IS Expired OR Has Previous Feedback
                <div style={{ paddingTop: '0' }}>
                    {/* Session 1: Main Contact Information */}
                    <div style={{ padding: '16px 18px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: hasPreviousFeedback ? '#0369a1' : '#991b1b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '24px' }}>{hasPreviousFeedback ? '✓' : '⏰'}</span>
                            {hasPreviousFeedback ? 'Feedback Received' : 'Quote Expired'}
                        </div>
                        <p style={{ fontSize: '12px', color: '#5b6472', lineHeight: 1.6, marginBottom: '16px' }}>
                            {hasPreviousFeedback
                                ? `Thank you for your feedback! Our team has received your response. Status: ${feedbackStatus}. For any follow-up questions, please contact us.`
                                : 'This quote is no longer available. Please contact our travel specialists to discuss your travel plans.'}
                        </p>
                    </div>

                    {/* Session 1: Contact Information Section */}
                    <div style={{ padding: '0 18px 16px' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)',
                            border: '2px solid #1e6fe0',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 4px 12px rgba(30, 111, 224, 0.15)'
                        }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e6fe0', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📞 Contact Information
                            </div>
                            <div style={{ fontSize: '12px', color: '#5b6472', lineHeight: 2 }}>
                                <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e7ebf0' }}>
                                    <div style={{ fontWeight: 700, color: '#1e6fe0', marginBottom: '4px' }}>📧 Email:</div>
                                    <a href="mailto:info@cloudtravel.com" style={{ color: '#1e6fe0', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>
                                        info@cloudtravel.com
                                    </a>
                                </div>
                                <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e7ebf0' }}>
                                    <div style={{ fontWeight: 700, color: '#1e6fe0', marginBottom: '4px' }}>📱 Phone:</div>
                                    <a href="tel:+441234567890" style={{ color: '#1e6fe0', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>
                                        +44 (0) 123 456 7890
                                    </a>
                                </div>
                                <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e7ebf0' }}>
                                    <div style={{ fontWeight: 700, color: '#1e6fe0', marginBottom: '4px' }}>🕐 Business Hours:</div>
                                    <div style={{ fontSize: '11px', color: '#5b6472' }}>
                                        Mon - Fri: 9:00 AM - 6:00 PM GMT<br/>
                                        Saturday: 10:00 AM - 4:00 PM GMT
                                    </div>
                                </div>
                                <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e7ebf0' }}>
                                    <div style={{ fontWeight: 700, color: '#1e6fe0', marginBottom: '4px' }}>📍 Office:</div>
                                    <div style={{ fontSize: '11px', color: '#5b6472' }}>
                                        CloudTravel Ltd<br/>
                                        London, United Kingdom
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#1e6fe0', marginBottom: '4px' }}>✈️ Services:</div>
                                    <div style={{ fontSize: '11px', color: '#5b6472' }}>
                                        Custom itineraries • Visa assistance • Hotel bookings • Flight arrangements
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Session 2: Alternative Contact / Fallback */}
                    <div style={{ padding: '0 18px 18px' }}>
                        <div style={{
                            background: '#f9fafb',
                            border: '1.5px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '14px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6, marginBottom: '10px' }}>
                                <strong>Can't reach us via phone?</strong><br/>
                                Response time: Usually within 24 hours
                            </div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
                                We're here to help! Our team will get back to you as soon as possible.
                            </div>
                        </div>
                    </div>
                </div>
                )}

                


                {/* Action Buttons - Show only if quote is NOT expired AND NO previous feedback */}
                {!isExpired && !hasPreviousFeedback && (
                <div style={{ display: 'flex', gap: '10px', padding: '4px 18px 18px' }}>
                    <button
                        onClick={handleReject}
                        style={{
                            flex: 1,
                            padding: '13px 0',
                            borderRadius: '12px',
                            border: '1.5px solid #e7ebf0',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: '#fff',
                            color: '#5b6472',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#d33'; e.currentTarget.style.color = '#d33'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e7ebf0'; e.currentTarget.style.color = '#5b6472'; }}
                    >
                        Reject
                    </button>
                    <button
                        onClick={handleAccept}
                        style={{
                            flex: 1,
                            padding: '13px 0',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #1e6fe0, #0f4fb0)',
                            color: '#fff',
                            boxShadow: '0 6px 16px rgba(30,111,224,0.35)',
                            transition: 'transform 0.15s ease'
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        Accept
                    </button>
                </div>
                )}
            </div>

            {/* Modal Overlay */}
            {activeModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15,20,30,0.55)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '18px',
                        width: '100%',
                        maxWidth: '450px',
                        padding: '32px 28px 28px',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        animation: 'pop 0.25s ease'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: activeModal === 'accept'
                                ? 'linear-gradient(135deg, #1e6fe0, #0f4fb0)'
                                : 'linear-gradient(135deg, #e05555, #b03030)',
                            color: '#fff',
                            fontSize: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            {activeModal === 'accept' ? '✓' : '✕'}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a2233', marginBottom: '8px' }}>
                            {activeModal === 'accept'
                                ? 'Booking Accepted'
                                : submitted
                                ? 'Booking Rejected'
                                : 'Reject Booking'}
                        </div>
                        <div style={{ fontSize: '13.5px', color: '#5b6472', lineHeight: 1.6, marginBottom: '20px' }}>
                            {activeModal === 'accept'
                                ? 'Your booking has been accepted. A confirmation will be sent shortly.'
                                : submitted
                                ? rejectReason
                                    ? `Your booking has been declined. Reason noted: "${rejectReason}"`
                                    : 'Your booking has been declined.'
                                : 'Please let us know why you\'re rejecting this offer.'}
                        </div>

                        {/* Contact Information Section - Show after submission if quote is expired or has no expiry date */}
                        {submitted && (isExpired || !travelQuote.expiry_date) && (
                            <div style={{ marginBottom: '20px', padding: '14px', background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)', borderRadius: '10px', borderLeft: '4px solid #1e6fe0' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e6fe0', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                                    📞 Contact Our Travel Team
                                </div>
                                <div style={{ fontSize: '12px', color: '#5b6472', lineHeight: 1.8 }}>
                                    <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e7ebf0' }}>
                                        <strong style={{ color: '#1e6fe0' }}>📧 Email:</strong><br/>
                                        <a href="mailto:info@cloudtravel.com" style={{ color: '#1e6fe0', textDecoration: 'none', fontSize: '11px' }}>info@cloudtravel.com</a>
                                    </div>
                                    <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e7ebf0' }}>
                                        <strong style={{ color: '#1e6fe0' }}>📱 Phone:</strong><br/>
                                        <a href="tel:+441234567890" style={{ color: '#1e6fe0', textDecoration: 'none', fontSize: '11px' }}>+44 (0) 123 456 7890</a>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#8b93a1' }}>
                                        <strong style={{ color: '#1e6fe0' }}>🕐 Hours:</strong><br/>
                                        Mon-Fri 9:00 AM - 6:00 PM GMT
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeModal === 'accept' || activeModal === 'reject') && !submitted && (
                            <div style={{ marginBottom: '18px', display: 'grid', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Full Name *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: '1.5px solid #e7ebf0',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        fontFamily: 'inherit',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#1e6fe0'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e7ebf0'; }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: '1.5px solid #e7ebf0',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        fontFamily: 'inherit',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#1e6fe0'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e7ebf0'; }}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: '1.5px solid #e7ebf0',
                                        borderRadius: '8px',
                                        padding: '10px 12px',
                                        fontFamily: 'inherit',
                                        fontSize: '13px',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#1e6fe0'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e7ebf0'; }}
                                />
                            </div>
                        )}

                        {activeModal === 'reject' && !submitted && (
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Tell us why you're rejecting this quote..."
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    border: '1.5px solid #e7ebf0',
                                    borderRadius: '10px',
                                    padding: '12px 14px',
                                    fontFamily: 'inherit',
                                    fontSize: '13px',
                                    color: '#1a2233',
                                    resize: 'none',
                                    marginBottom: '16px',
                                    outline: 'none'
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = '#1e6fe0'; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = '#e7ebf0'; }}
                            />
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    flex: 1,
                                    background: '#f4f6f9',
                                    border: 'none',
                                    padding: '13px 28px',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: '#0f4fb0',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#e8ecf1'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = '#f4f6f9'; }}
                            >
                                {submitted ? 'Close' : 'Cancel'}
                            </button>
                            {!submitted && (
                                <button
                                    onClick={activeModal === 'accept' ? handleSubmitAccept : handleSubmitReject}
                                    style={{
                                        flex: 1,
                                        background: activeModal === 'accept'
                                            ? 'linear-gradient(135deg, #1e6fe0, #0f4fb0)'
                                            : 'linear-gradient(135deg, #e05555, #b03030)',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '13px 28px',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = activeModal === 'accept'
                                            ? 'linear-gradient(135deg, #1555d0, #0a3fa0)'
                                            : 'linear-gradient(135deg, #d63030, #a02020)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = activeModal === 'accept'
                                            ? 'linear-gradient(135deg, #1e6fe0, #0f4fb0)'
                                            : 'linear-gradient(135deg, #e05555, #b03030)';
                                    }}
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

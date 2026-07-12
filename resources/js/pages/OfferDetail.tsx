import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import BookingModal from '@/components/BookingModal';

interface SpecialOffer {
    id: number;
    uid: string;
    name: string;
    type: string;
    total_price: number;
    is_featured: boolean;
    rating?: number;
    description?: string;
    sub_description?: string;
    duration_days?: number;
    duration_nights?: number;
    images?: Array<{ id: number; image_path: string; }>;
    flight_name?: string;
    flight_origin?: string;
    flight_destination?: string;
    hotel_name?: string;
    hotel_star_rating?: number;
    hotel_country?: string;
    hotel_city?: string;
    visa_name?: string;
    is_visa?: boolean;
    transport_name?: string;
    transport_type?: string;
    transport_origin?: string;
    transport_destination?: string;
    is_transport?: boolean;
}

interface Currency {
    symbol: string;
    code: string;
}

export default function OfferDetail({ uid, currency }: { uid?: string; currency: Currency }) {
    const [offer, setOffer] = useState<SpecialOffer | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const [bookingData, setBookingData] = useState({
        firstName: '',
        email: '',
        phone: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const stickyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (uid) {
            loadOffer();
        }
    }, [uid]);

    const loadOffer = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/special-offers?per_page=1000');

            if (response.ok) {
                const data = await response.json();
                const offers = data.data || (Array.isArray(data) ? data : []);
                const found = offers.find((o: any) => o.uid === uid);

                if (found) {
                    setOffer(found);
                    setLoading(false);
                    return;
                }
            }

            try {
                const adminResponse = await fetch('/api/special-offers-detail/' + uid);
                if (adminResponse.ok) {
                    const offerData = await adminResponse.json();
                    if (offerData && offerData.id) {
                        setOffer(offerData);
                        setLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.log('Admin endpoint also failed');
            }

            setLoading(false);
            setTimeout(() => router.visit('/all-offers'), 500);

        } catch (error) {
            console.error('Error loading offer:', error);
            setLoading(false);
            setTimeout(() => router.visit('/all-offers'), 500);
        }
    };

    const getTypeIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            'Flight': 'fa-plane',
            'Hotel': 'fa-hotel',
            'Package': 'fa-cube',
            'Visa': 'fa-passport',
            'Transportation': 'fa-car'
        };
        return icons[type] || 'fa-gift';
    };

    const getServiceType = (type: string): 'flight' | 'hotel' | 'visa' | 'package' | 'airport-transfer' => {
        const serviceMap: { [key: string]: 'flight' | 'hotel' | 'visa' | 'package' | 'airport-transfer' } = {
            'Flight': 'flight',
            'Hotel': 'hotel',
            'Package': 'package',
            'Visa': 'visa',
            'Transportation': 'airport-transfer'
        };
        return serviceMap[type] || 'package';
    };

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        setDepartureDate('');
        setAdults(1);
        setSelectedClass('Economy');
        setBookingData({ firstName: '', email: '', phone: '' });
    };

    const handleBooking = async () => {
        if (!bookingData.firstName.trim() || !bookingData.email.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setBookingLoading(true);
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    service: getServiceType(offer!.type),
                    formData: bookingData,
                    searchParams: {
                        offerId: offer!.uid,
                        offerName: offer!.name
                    }
                })
            });

            if (response.ok) {
                alert('Booking submitted successfully! We will contact you soon.');
                setBookingData({ firstName: '', email: '', phone: '' });
                setShowBookingModal(false);
            } else {
                alert('Error submitting booking. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Error submitting booking. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading || !offer) {
        return (
            <>
                <Head title="Loading - CloudTravel">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
                </Head>
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#ffffff',
                    zIndex: 9998,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '50%',
                            height: '50%',
                            objectFit: 'contain',
                        }}
                    >
                        <source src="/images/loader.mp4" type="video/mp4" />
                    </video>
                </div>
            </>
        );
    }

    if (!offer) {
        return (
            <>
                <Head title="Offer Not Found - CloudTravel" />
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                        <i className="fa fa-search" style={{ fontSize: '64px', color: '#ddd', marginBottom: '20px', display: 'block' }}></i>
                        <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>Offer Not Found</h2>
                        <p style={{ color: '#999', marginBottom: '30px' }}>Sorry, this offer doesn't exist or has been removed.</p>
                        <button
                            onClick={() => router.visit('/all-offers')}
                            style={{
                                background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            Back to All Offers
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const heroImage = offer.images && offer.images.length > 0
        ? `/storage/${offer.images[0].image_path}`
        : undefined;

    return (
        <>
            <Head title={`${offer.name} - CloudTravel`}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

            <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

                {/* HERO SECTION */}
                <div style={{
                    position: 'relative',
                    height: '600px',
                    overflow: 'hidden',
                    backgroundImage: heroImage ? `url(${heroImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                    }}></div>

                    {/* Top Navigation Bar */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '20px 40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 10,
                    }}>
                        <button
                            onClick={() => router.visit('/all-offers')}
                            style={{
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <i className="fa fa-chevron-left"></i>
                            Back to All Offers
                        </button>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s',
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <i className="fa fa-share"></i>
                            </button>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '60px 40px 40px',
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
                        color: '#fff',
                    }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                                <span style={{
                                    background: 'rgba(15, 165, 233, 0.9)',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    <i className={`fa ${getTypeIcon(offer.type)}`}></i>
                                    {offer.type}
                                </span>
                                {offer.is_featured && (
                                    <span style={{
                                        background: 'rgba(245, 158, 11, 0.9)',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}>⭐ Featured Offer</span>
                                )}
                            </div>

                            <h1 style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                marginBottom: '12px',
                                fontFamily: 'Poppins, sans-serif',
                                textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                            }}>
                                {offer.name}
                            </h1>

                            {offer.sub_description && (
                                <p style={{
                                    fontSize: '15px',
                                    opacity: 0.95,
                                    marginBottom: '24px',
                                }}>
                                    {offer.sub_description}
                                </p>
                            )}

                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-end',
                            }}>
                                <div>
                                    <span style={{ fontSize: '13px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Starting From</span>
                                    <span style={{ fontSize: '32px', fontWeight: 700 }}>{currency.symbol}{offer.total_price?.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button onClick={() => setShowBookingModal(true)} style={{
                                        background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '14px 32px',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)',
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.4)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(14, 165, 233, 0.3)';
                                    }}>
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT - Two Column Layout */}
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px' }}>

                        {/* LEFT COLUMN */}
                        <div>

                            {/* IMAGE GALLERY */}
                            {offer.images && offer.images.length > 0 && (
                                <div style={{ marginBottom: '60px' }}>
                                    <div style={{
                                        position: 'relative',
                                        height: '500px',
                                        borderRadius: '18px',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                                        background: '#fff',
                                        backgroundImage: `url(/storage/${offer.images[selectedImageIndex]?.image_path})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'zoom-in',
                                        transition: 'all 0.3s',
                                    }} onClick={() => setShowLightbox(true)} onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            background: 'rgba(0,0,0,0.5)',
                                            color: '#fff',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            backdropFilter: 'blur(10px)',
                                        }}>
                                            <i className="fa fa-expand"></i> Click to Expand
                                        </div>

                                        {/* Navigation Arrows */}
                                        {offer.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedImageIndex((prev) => (prev === 0 ? offer.images!.length - 1 : prev - 1));
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        left: '15px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'rgba(0,0,0,0.4)',
                                                        border: 'none',
                                                        color: '#ffffff',
                                                        width: '45px',
                                                        height: '45px',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '20px',
                                                        transition: 'all 0.3s ease',
                                                        zIndex: 10
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                                    }}
                                                >
                                                    <i className="fa fa-chevron-left"></i>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedImageIndex((prev) => (prev === offer.images!.length - 1 ? 0 : prev + 1));
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '15px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'rgba(0,0,0,0.4)',
                                                        border: 'none',
                                                        color: '#ffffff',
                                                        width: '45px',
                                                        height: '45px',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '20px',
                                                        transition: 'all 0.3s ease',
                                                        zIndex: 10
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                                    }}
                                                >
                                                    <i className="fa fa-chevron-right"></i>
                                                </button>

                                                {/* Image Counter */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '15px',
                                                    left: '15px',
                                                    background: 'rgba(0,0,0,0.5)',
                                                    color: '#ffffff',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    zIndex: 10
                                                }}>
                                                    {selectedImageIndex + 1} / {offer.images.length}
                                                </div>

                                                {/* Dots Indicator */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '15px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    display: 'flex',
                                                    gap: '8px',
                                                    zIndex: 10
                                                }}>
                                                    {offer.images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedImageIndex(index);
                                                            }}
                                                            style={{
                                                                width: selectedImageIndex === index ? '24px' : '8px',
                                                                height: '8px',
                                                                borderRadius: '4px',
                                                                background: selectedImageIndex === index ? '#0499ff' : 'rgba(255,255,255,0.6)',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnail Gallery */}
                                    {offer.images.length > 1 && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                            gap: '12px',
                                            marginTop: '16px',
                                        }}>
                                            {offer.images.map((img, idx) => (
                                                <div key={idx} style={{
                                                    height: '80px',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: idx === selectedImageIndex ? '2px solid #0EA5E9' : '2px solid transparent',
                                                    opacity: idx === selectedImageIndex ? 1 : 0.6,
                                                    transition: 'all 0.3s',
                                                    backgroundImage: `url(/storage/${img.image_path})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }} onClick={() => setSelectedImageIndex(idx)} onMouseEnter={(e) => {
                                                    if (idx !== selectedImageIndex) e.currentTarget.style.opacity = '0.8';
                                                }} onMouseLeave={(e) => {
                                                    if (idx !== selectedImageIndex) e.currentTarget.style.opacity = '0.6';
                                                }}>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* OVERVIEW SECTION */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>About This Offer</h2>
                                <div style={{
                                    background: '#fff',
                                    padding: '32px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                }}>
                                    <p style={{
                                        fontSize: '15px',
                                        lineHeight: 1.8,
                                        color: '#374151',
                                        marginBottom: '20px',
                                    }}>
                                        {offer.description || 'Experience an amazing travel offer curated specifically for you. This exclusive package brings together the best destinations, luxury accommodations, and unforgettable experiences.'}
                                    </p>
                                    {offer.sub_description && (
                                        <p style={{
                                            fontSize: '15px',
                                            lineHeight: 1.8,
                                            color: '#374151',
                                        }}>
                                            {offer.sub_description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* PACKAGE DETAILS */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>What's Included</h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '16px',
                                }}>
                                    {[
                                        { icon: 'fa-plane', label: offer.flight_name || 'Flight', visible: !!offer.flight_name },
                                        { icon: 'fa-route', label: offer.flight_origin && offer.flight_destination ? `${offer.flight_origin} → ${offer.flight_destination}` : 'Route', visible: !!(offer.flight_origin || offer.flight_destination) },
                                        { icon: 'fa-hotel', label: offer.hotel_name || 'Hotel', visible: !!offer.hotel_name },
                                        { icon: 'fa-location-dot', label: offer.hotel_city && offer.hotel_country ? `${offer.hotel_city}, ${offer.hotel_country}` : 'Location', visible: !!(offer.hotel_city || offer.hotel_country) },
                                        { icon: 'fa-passport', label: offer.visa_name || 'Visa', visible: offer.is_visa },
                                        { icon: 'fa-car', label: offer.transport_name || 'Transport', visible: offer.is_transport },
                                        { icon: 'fa-road', label: offer.transport_origin && offer.transport_destination ? `${offer.transport_origin} → ${offer.transport_destination}` : 'Route', visible: !!(offer.transport_origin || offer.transport_destination) },
                                        { icon: 'fa-calendar', label: `${offer.duration_days || 0} Days`, visible: !!offer.duration_days },
                                        { icon: 'fa-moon', label: `${offer.duration_nights || 0} Nights`, visible: !!offer.duration_nights },
                                        { icon: 'fa-star', label: `${offer.hotel_star_rating || 0}-Star Hotel`, visible: !!offer.hotel_star_rating },
                                        { icon: 'fa-check', label: '24/7 Support', visible: true },
                                    ].filter(i => i.visible).map((item, idx) => (
                                        <div key={idx} style={{
                                            background: '#fff',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                            transition: 'all 0.3s',
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'center',
                                        }} onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(14, 165, 233, 0.15)';
                                        }} onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                                        }}>
                                            <div style={{
                                                fontSize: '24px',
                                                color: '#0EA5E9',
                                                minWidth: '30px',
                                            }}>
                                                <i className={`fa ${item.icon}`}></i>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: '#111827',
                                                }}>
                                                    {item.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT SIDEBAR - STICKY BOOKING CARD */}
                        <div ref={stickyRef}>
                            <div style={{
                                position: 'sticky',
                                top: '20px',
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '28px',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                                border: '1px solid rgba(0,0,0,0.05)',
                            }}>
                                {/* Price Section */}
                                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>Special Price</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '8px',
                                    }}>
                                        <span style={{
                                            fontSize: '32px',
                                            fontWeight: 700,
                                            color: '#111827',
                                        }}>{currency.symbol}{offer.total_price?.toLocaleString()}</span>
                                        <span style={{
                                            fontSize: '13px',
                                            color: '#9CA3AF',
                                            textDecoration: 'line-through',
                                        }}>{currency.symbol}{Math.round(offer.total_price * 1.2).toLocaleString()}</span>
                                    </div>
                                    <div style={{
                                        background: '#FEF3C7',
                                        color: '#92400E',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        marginTop: '8px',
                                        fontWeight: 600,
                                    }}>
                                        ⚡ Limited Time Offer
                                    </div>
                                </div>

                                {/* Offer Details */}
                                <div style={{
                                    background: '#F9FAFB',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    fontSize: '13px',
                                }}>
                                    {offer.duration_days && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Duration</span>
                                            <span>{offer.duration_days} Days</span>
                                        </div>
                                    )}
                                    {offer.duration_nights && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Nights</span>
                                            <span>{offer.duration_nights}</span>
                                        </div>
                                    )}
                                    {offer.hotel_name && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Hotel</span>
                                            <span>{offer.hotel_name}</span>
                                        </div>
                                    )}
                                    {offer.flight_name && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Flight</span>
                                            <span>{offer.flight_name}</span>
                                        </div>
                                    )}
                                    {offer.flight_origin && offer.flight_destination && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Route</span>
                                            <span>{offer.flight_origin} → {offer.flight_destination}</span>
                                        </div>
                                    )}
                                    {offer.hotel_name && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Hotel</span>
                                            <span>{offer.hotel_name}</span>
                                        </div>
                                    )}
                                    {offer.hotel_city && offer.hotel_country && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6B7280' }}>
                                            <span>Location</span>
                                            <span>{offer.hotel_city}, {offer.hotel_country}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                    <button onClick={() => setShowBookingModal(true)} style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)',
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.4)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(14, 165, 233, 0.3)';
                                    }}>
                                        Book Now
                                    </button>
                                </div>

                                {/* Trust Badges */}
                                <div style={{
                                    padding: '16px',
                                    background: '#F0F9FF',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    color: '#0369A1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px' }}>✓</span>
                                        <span>Best Price Guarantee</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px' }}>✓</span>
                                        <span>Secure Booking</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px' }}>✓</span>
                                        <span>24/7 Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Lightbox Modal */}
            {showLightbox && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }} onClick={() => setShowLightbox(false)}>
                    <div style={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        backgroundImage: `url(/storage/${offer.images?.[selectedImageIndex]?.image_path})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        aspectRatio: '16/9',
                    }}>
                        <button onClick={() => setShowLightbox(false)} style={{
                            position: 'absolute',
                            top: '-40px',
                            right: 0,
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '8px',
                        }}>
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* BOOKING MODAL - Using same modal from home page */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onSuccess={handleBookingSuccess}
                searchDetails={{
                    destinationCountry: offer.destination_country || offer.name,
                    offerName: offer.name,
                    offerId: offer.uid,
                    departureDate,
                    adults,
                    selectedClass,
                }}
                serviceType={offer.type === 'Flight' ? 'flight' : offer.type === 'Hotel' ? 'hotel' : 'package'}
            />
        </>
    );
}

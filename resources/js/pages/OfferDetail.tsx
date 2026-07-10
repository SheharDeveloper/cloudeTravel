import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
    hotel_name?: string;
    hotel_star_rating?: number;
    visa_name?: string;
    is_visa?: boolean;
    transport_name?: string;
    transport_type?: string;
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
    const [bookingData, setBookingData] = useState({
        firstName: '',
        email: '',
        phone: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        if (uid) {
            loadOffer();
        }
    }, [uid]);

    const loadOffer = async () => {
        try {
            setLoading(true);
            console.log('Loading offer with UID:', uid);

            // Fetch all offers (both featured and non-featured)
            const response = await fetch('/api/special-offers?per_page=1000');

            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data);

                // Handle paginated response
                const offers = data.data || (Array.isArray(data) ? data : []);
                console.log('Offers array:', offers);

                const found = offers.find((o: any) => o.uid === uid);
                console.log('Found offer:', found);

                if (found) {
                    setOffer(found);
                    setLoading(false);
                    return;
                }
            }

            // If not found in featured, try fetching from admin endpoint
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

            // If we get here, offer was not found
            console.error('Offer not found with UID:', uid);
            setLoading(false);
            setTimeout(() => router.visit('/all-offers'), 500);

        } catch (error) {
            console.error('Error loading offer:', error);
            setLoading(false);
            setTimeout(() => router.visit('/all-offers'), 500);
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
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                        <i className="fa fa-search" style={{ fontSize: '64px', color: '#ddd', marginBottom: '20px', display: 'block' }}></i>
                        <h2 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>Offer Not Found</h2>
                        <p style={{ color: '#999', marginBottom: '30px' }}>Sorry, this offer doesn't exist or has been removed.</p>
                        <button
                            onClick={() => router.visit('/all-offers')}
                            style={{
                                background: '#0499ff',
                                color: '#ffffff',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '6px',
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

    return (
        <>
            <Head title={`${offer.name} - CloudTravel`}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .fade-in {
                    animation: fadeIn 0.3s ease;
                }
            `}</style>

            {/* HERO SECTION */}
            <div style={{
                background: offer.images && offer.images.length > 0
                    ? `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%), url('/storage/${offer.images[0].image_path}') center/cover no-repeat`
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: '#ffffff',
                padding: '60px 20px'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <i className={`fa ${getTypeIcon(offer.type)}`}></i>
                            {offer.type}
                        </span>
                        {offer.is_featured && (
                            <span style={{
                                background: 'rgba(255,193,7,0.8)',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: 700
                            }}>
                                ⭐ Featured
                            </span>
                        )}
                    </div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 700,
                        marginBottom: '15px',
                        textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                        fontFamily: "'Playfair Display', serif"
                    }}>
                        {offer.name}
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        opacity: 0.95,
                        maxWidth: '600px',
                        margin: '0 auto',
                        textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
                    }}>
                        {offer.sub_description || offer.description?.substring(0, 150)}
                    </p>
                </div>
            </div>

            {/* BACK BUTTON */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #eee', padding: '15px 20px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <button
                        onClick={() => router.visit('/all-offers')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#0499ff',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <i className="fa fa-arrow-left"></i>
                        Back to All Offers
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ background: '#f9f9f9', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* LEFT SIDE - IMAGES */}
                        <div>
                            {/* MAIN IMAGE SLIDER */}
                            <div style={{
                                background: '#ffffff',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                marginBottom: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {offer.images && offer.images.length > 0 ? (
                                    <img
                                        src={`/storage/${offer.images[selectedImageIndex]?.image_path}`}
                                        alt={offer.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        className="fade-in"
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: '#ffffff',
                                        fontSize: '80px'
                                    }}>
                                        <i className="fa fa-gift"></i>
                                    </div>
                                )}

                                {/* NAVIGATION ARROWS */}
                                {offer.images && offer.images.length > 1 && (
                                    <>
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? offer.images!.length - 1 : prev - 1))}
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

                                        {/* Next Button */}
                                        <button
                                            onClick={() => setSelectedImageIndex((prev) => (prev === offer.images!.length - 1 ? 0 : prev + 1))}
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
                                                    onClick={() => setSelectedImageIndex(index)}
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

                            {/* IMAGE THUMBNAILS */}
                            {offer.images && offer.images.length > 1 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                    {offer.images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            onClick={() => setSelectedImageIndex(index)}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: selectedImageIndex === index ? '3px solid #0499ff' : '1px solid #ddd',
                                                aspectRatio: '1',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedImageIndex !== index) {
                                                    e.currentTarget.style.borderColor = '#0499ff';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedImageIndex !== index) {
                                                    e.currentTarget.style.borderColor = '#ddd';
                                                }
                                            }}
                                        >
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt={`${offer.name} ${index + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE - DETAILS */}
                        <div>
                            {/* HEADER */}
                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                    <span style={{
                                        background: '#0499ff',
                                        color: '#ffffff',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <i className={`fa ${getTypeIcon(offer.type)}`}></i>
                                        {offer.type}
                                    </span>
                                    {offer.is_featured && (
                                        <span style={{
                                            background: '#f39c12',
                                            color: '#ffffff',
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <i className="fa fa-star"></i>
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <h1 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '36px',
                                    fontWeight: 700,
                                    color: '#000000',
                                    marginBottom: '12px'
                                }}>
                                    {offer.name}
                                </h1>

                                {offer.sub_description && (
                                    <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>
                                        {offer.sub_description}
                                    </p>
                                )}
                            </div>

                            {/* RATING */}
                            {offer.rating && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '20px',
                                    padding: '15px',
                                    background: '#f0f7ff',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{
                                                color: i < Math.floor(offer.rating!) ? '#0499ff' : '#ddd',
                                                fontSize: '18px'
                                            }}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span style={{ color: '#000000', fontWeight: 700, fontSize: '16px' }}>
                                        {offer.rating}
                                    </span>
                                    <span style={{ color: '#999', fontSize: '13px' }}>
                                        (Based on customer reviews)
                                    </span>
                                </div>
                            )}

                            {/* PRICE */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0499ff 0%, #0284d0 100%)',
                                color: '#ffffff',
                                padding: '25px',
                                borderRadius: '12px',
                                marginBottom: '30px',
                                boxShadow: '0 4px 15px rgba(4, 153, 255, 0.3)'
                            }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', opacity: 0.9 }}>
                                    TOTAL PRICE
                                </div>
                                <div style={{
                                    fontSize: '42px',
                                    fontWeight: 700,
                                    marginBottom: '8px'
                                }}>
                                    {currency.symbol}{offer.total_price?.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                    Per person / Full package
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            {offer.description && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        color: '#000000',
                                        marginBottom: '12px'
                                    }}>
                                        About This Offer
                                    </h3>
                                    <p style={{
                                        color: '#666',
                                        lineHeight: 1.7,
                                        fontSize: '14px'
                                    }}>
                                        {offer.description}
                                    </p>
                                </div>
                            )}

                            {/* OFFER DETAILS */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: '#000000',
                                    marginBottom: '12px'
                                }}>
                                    Package Details
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {offer.duration_days && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                DURATION (Days)
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                {offer.duration_days} days
                                            </div>
                                        </div>
                                    )}
                                    {offer.duration_nights && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                NIGHTS
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                {offer.duration_nights} nights
                                            </div>
                                        </div>
                                    )}
                                    {offer.flight_name && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                <i className="fa fa-plane" style={{ marginRight: '6px' }}></i>AIRLINE
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                {offer.flight_name}
                                            </div>
                                        </div>
                                    )}
                                    {offer.hotel_name && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                <i className="fa fa-hotel" style={{ marginRight: '6px' }}></i>HOTEL
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                {offer.hotel_name}
                                            </div>
                                        </div>
                                    )}
                                    {offer.hotel_star_rating && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                HOTEL RATING
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000', display: 'flex', gap: '2px' }}>
                                                {[...Array(offer.hotel_star_rating)].map((_, i) => (
                                                    <span key={i} style={{ color: '#f39c12' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {offer.transport_name && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                <i className="fa fa-car" style={{ marginRight: '6px' }}></i>TRANSPORT
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                {offer.transport_name}
                                            </div>
                                        </div>
                                    )}
                                    {offer.visa_name && (
                                        <div style={{
                                            background: '#f0f7ff',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #0499ff'
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                                                <i className="fa fa-passport" style={{ marginRight: '6px' }}></i>VISA
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#000000' }}>
                                                {offer.visa_name}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA BUTTON */}
                            <button
                                onClick={() => setShowBookingModal(true)}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #0499ff 0%, #0284d0 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(4, 153, 255, 0.3)',
                                    marginBottom: '15px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(4, 153, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(4, 153, 255, 0.3)';
                                }}
                            >
                                <i className="fa fa-check-circle" style={{ marginRight: '8px' }}></i>
                                Book This Offer Now
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* BOOKING MODAL */}
            {showBookingModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        overflow: 'hidden'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0499ff 0%, #0284d0 100%)',
                            color: '#ffffff',
                            padding: '30px 25px',
                            textAlign: 'center'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                marginBottom: '8px'
                            }}>
                                {offer.name}
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                opacity: 0.95,
                                marginBottom: 0
                            }}>
                                Complete your booking details
                            </p>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '30px 25px' }}>
                            {/* First Name */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={bookingData.firstName}
                                    onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                                    placeholder="Enter your full name"
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#0499ff';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={bookingData.email}
                                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#0499ff';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Phone */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={bookingData.phone}
                                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                    placeholder="Enter your phone number"
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#0499ff';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    disabled={bookingLoading}
                                    style={{
                                        background: '#f0f0f0',
                                        color: '#000000',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: bookingLoading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: bookingLoading ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!bookingLoading) e.currentTarget.style.background = '#e0e0e0';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!bookingLoading) e.currentTarget.style.background = '#f0f0f0';
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBooking}
                                    disabled={bookingLoading}
                                    style={{
                                        background: 'linear-gradient(135deg, #0499ff 0%, #0284d0 100%)',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '12px 20px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: bookingLoading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: bookingLoading ? 0.6 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!bookingLoading) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(4, 153, 255, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!bookingLoading) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(4, 153, 255, 0.3)';
                                        }
                                    }}
                                >
                                    {bookingLoading ? 'Submitting...' : 'Submit Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import BookingModal from '@/components/BookingModal';

interface Package {
    id: number;
    uid: string;
    name: string;
    title: string;
    image?: string;
    description?: string;
    price: number;
    currency: string;
    origin_country?: string;
    destination_country: string;
    hotel_name?: string;
    hotel_stars: number;
    duration_days: number;
    travel_export_included: boolean;
    visa_service_included: boolean;
    status: boolean;
    is_featured: boolean;
}

interface Props {
    package: Package;
}

const ITINERARY_DAYS = [
    { day: 1, title: 'Arrival & Hotel Check-in', icon: 'fa-plane-arrival', description: 'Arrive at destination and check into your luxury hotel' },
    { day: 2, title: 'Island Tour', icon: 'fa-island', description: 'Guided tour of beautiful islands and local attractions' },
    { day: 3, title: 'Water Activities', icon: 'fa-water', description: 'Snorkeling, diving, and water sports activities' },
    { day: 4, title: 'Free Leisure Time', icon: 'fa-spa', description: 'Relax at hotel spa or explore at your own pace' },
    { day: 5, title: 'City Tour & Shopping', icon: 'fa-shopping-bag', description: 'Explore local markets and cultural sites' },
    { day: 6, title: 'Beach & Sunset Cruise', icon: 'fa-sunset', description: 'Scenic sunset cruise with dinner' },
    { day: 7, title: 'Departure', icon: 'fa-plane-departure', description: 'Check out and depart for home' },
];

const REVIEWS = [
    { name: 'Sarah Johnson', country: 'United Kingdom', rating: 5, comment: 'Absolutely incredible experience! The package included everything promised and more. Will definitely book again!' },
    { name: 'Ahmed Hassan', country: 'UAE', rating: 5, comment: 'Best vacation ever! Perfect hotel, amazing guides, and flawless service throughout.' },
    { name: 'Maria Garcia', country: 'Spain', rating: 5, comment: 'The attention to detail was exceptional. Every moment was memorable.' },
];

const INCLUSIONS = [
    { included: true, text: 'Flights' },
    { included: true, text: 'Luxury Hotel (4-5 Stars)' },
    { included: true, text: 'Daily Breakfast & Dinner' },
    { included: true, text: 'Airport Transfers' },
    { included: true, text: 'Guided City Tours' },
    { included: true, text: 'Travel Insurance' },
    { included: false, text: 'Personal Expenses' },
    { included: false, text: 'Optional Activities' },
];

export default function PackageDetail({ package: pkg }: Props) {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [checkInDate, setCheckInDate] = useState('');
    const [nights, setNights] = useState(pkg.duration_days);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [expandedDay, setExpandedDay] = useState(0);
    const stickyRef = useRef<HTMLDivElement>(null);

    const galleryImages = [pkg.image, pkg.image, pkg.image, pkg.image, pkg.image].filter(Boolean);

    const handleBook = () => {
        if (!checkInDate) {
            alert('Please select a check-in date');
            return;
        }
        setShowBookingModal(true);
    };

    const handleCloseModal = () => {
        setShowBookingModal(false);
    };

    const handleBookingSuccess = () => {
        setCheckInDate('');
        setNights(pkg.duration_days);
        setAdults(1);
        setChildren(0);
        setRooms(1);
    };

    return (
        <>
            <Head title={pkg.name} />

            <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

                {/* HERO SECTION */}
                <div style={{
                    position: 'relative',
                    height: '600px',
                    overflow: 'hidden',
                    backgroundImage: `url(${pkg.image})`,
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
                        <Link href="/?tab=packages" style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <i className="fa fa-chevron-left"></i>
                            Back to Packages
                        </Link>

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
                                }}>✓ Best Seller</span>
                                <span style={{
                                    background: 'rgba(245, 158, 11, 0.9)',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>⚡ Limited Offer</span>
                            </div>

                            <h1 style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                marginBottom: '12px',
                                fontFamily: 'Poppins, sans-serif',
                                textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                            }}>
                                {pkg.name}
                            </h1>

                            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', fontSize: '15px' }}>
                                <div>📍 {pkg.destination_country}</div>
                                <div>⏱️ {pkg.duration_days} Days • {pkg.duration_days - 1} Nights</div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: '#FFD700' }}>★</span>
                                    ))}
                                    <span>(4.9 • 632 Reviews)</span>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '24px',
                                display: 'flex',
                                gap: '16px',
                            }}>
                                <div>
                                    <span style={{ fontSize: '13px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>Starting From</span>
                                    <span style={{ fontSize: '32px', fontWeight: 700 }}>£{pkg.price.toLocaleString()}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'flex-end',
                                }}>
                                    <button onClick={handleBook} style={{
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
                                    <button style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        padding: '14px 24px',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s',
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                        <i className="fa fa-whatsapp"></i> WhatsApp
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
                            <div style={{ marginBottom: '60px' }}>
                                <div style={{
                                    position: 'relative',
                                    height: '500px',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                                    background: '#fff',
                                    backgroundImage: `url(${pkg.image})`,
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
                                </div>

                                {/* Thumbnail Gallery */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                    gap: '12px',
                                    marginTop: '16px',
                                }}>
                                    {galleryImages.map((img, idx) => (
                                        <div key={idx} style={{
                                            height: '80px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: idx === selectedImageIndex ? '2px solid #0EA5E9' : '2px solid transparent',
                                            opacity: idx === selectedImageIndex ? 1 : 0.6,
                                            transition: 'all 0.3s',
                                            backgroundImage: `url(${img})`,
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
                            </div>

                            {/* HIGHLIGHTS CARDS */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '16px',
                                marginBottom: '60px',
                            }}>
                                {[
                                    { icon: 'fa-plane', label: 'Flight Included', desc: 'International flights' },
                                    { icon: 'fa-hotel', label: 'Luxury Hotel', desc: `${pkg.hotel_stars}-star rating` },
                                    pkg.visa_service_included ? { icon: 'fa-passport', label: 'Visa Included', desc: 'Full visa support' } : null,
                                    { icon: 'fa-utensils', label: 'Meals', desc: 'Breakfast & dinner' },
                                ].filter(Boolean).map((item, idx) => (
                                    <div key={idx} style={{
                                        background: '#fff',
                                        padding: '24px 16px',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(14, 165, 233, 0.15)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                                    }}>
                                        <div style={{
                                            fontSize: '28px',
                                            color: '#0EA5E9',
                                            marginBottom: '12px',
                                        }}>
                                            <i className={`fa ${item.icon}`}></i>
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: '#111827',
                                            marginBottom: '4px',
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#6B7280',
                                        }}>
                                            {item.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* OVERVIEW SECTION */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>Overview</h2>
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
                                        {pkg.description || 'Experience the ultimate luxury getaway to one of the world\'s most breathtaking destinations. This carefully curated package combines world-class accommodations, thrilling adventures, and unforgettable moments.'}
                                    </p>
                                    <p style={{
                                        fontSize: '15px',
                                        lineHeight: 1.8,
                                        color: '#374151',
                                    }}>
                                        Enjoy pristine beaches, vibrant local culture, exquisite dining, and personalized service throughout your stay. Whether you\'re seeking relaxation or adventure, this package offers the perfect balance of luxury and exploration.
                                    </p>
                                </div>
                            </div>

                            {/* DAY-WISE ITINERARY */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>Day-Wise Itinerary</h2>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}>
                                    {ITINERARY_DAYS.slice(0, pkg.duration_days).map((item, idx) => (
                                        <div key={idx} style={{
                                            background: '#fff',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                            transition: 'all 0.3s',
                                        }}>
                                            <div style={{
                                                padding: '20px 24px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                background: expandedDay === idx ? '#F3F4F6' : '#fff',
                                                transition: 'background 0.3s',
                                            }} onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontSize: '20px',
                                                        fontWeight: 700,
                                                    }}>
                                                        {item.day}
                                                    </div>
                                                    <div>
                                                        <div style={{
                                                            fontSize: '16px',
                                                            fontWeight: 700,
                                                            color: '#111827',
                                                            marginBottom: '4px',
                                                        }}>
                                                            {item.title}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            color: '#6B7280',
                                                        }}>
                                                            <i className={`fa ${item.icon}`}></i> {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <i className={`fa fa-chevron-${expandedDay === idx ? 'up' : 'down'}`} style={{
                                                    color: '#0EA5E9',
                                                    fontSize: '18px',
                                                    transition: 'transform 0.3s',
                                                }}></i>
                                            </div>
                                            {expandedDay === idx && (
                                                <div style={{
                                                    padding: '0 24px 20px 88px',
                                                    color: '#6B7280',
                                                    fontSize: '14px',
                                                    lineHeight: 1.6,
                                                    background: '#F9FAFB',
                                                }}>
                                                    Explore local attractions, enjoy authentic cuisine, and immerse yourself in the local culture. Optional activities include water sports, spa treatments, and guided tours. Evening entertainment and leisure time included.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* INCLUSIONS */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>What's Included & Excluded</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                        borderLeft: '4px solid #10B981',
                                    }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: '#111827',
                                            marginBottom: '16px',
                                        }}>Included</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {INCLUSIONS.filter(i => i.included).map((item, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    fontSize: '14px',
                                                    color: '#374151',
                                                }}>
                                                    <span style={{
                                                        color: '#10B981',
                                                        fontSize: '18px',
                                                        fontWeight: 700,
                                                    }}>✓</span>
                                                    {item.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                        borderLeft: '4px solid #EF4444',
                                    }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: '#111827',
                                            marginBottom: '16px',
                                        }}>Not Included</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {INCLUSIONS.filter(i => !i.included).map((item, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    fontSize: '14px',
                                                    color: '#374151',
                                                }}>
                                                    <span style={{
                                                        color: '#EF4444',
                                                        fontSize: '18px',
                                                        fontWeight: 700,
                                                    }}>✗</span>
                                                    {item.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* REVIEWS */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>Guest Reviews</h2>
                                <div style={{
                                    background: '#fff',
                                    padding: '32px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        <div style={{
                                            fontSize: '48px',
                                            fontWeight: 700,
                                            color: '#111827',
                                        }}>4.9</div>
                                        <div style={{
                                            color: '#FFD700',
                                            fontSize: '18px',
                                            marginBottom: '8px',
                                        }}>★★★★★</div>
                                        <div style={{
                                            color: '#6B7280',
                                            fontSize: '14px',
                                        }}>Based on 632 verified reviews</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                    {REVIEWS.map((review, idx) => (
                                        <div key={idx} style={{
                                            background: '#fff',
                                            padding: '24px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                            transition: 'all 0.3s',
                                        }} onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(14, 165, 233, 0.15)';
                                        }} onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                                        }}>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    flexShrink: 0,
                                                }}>
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '8px',
                                                    }}>
                                                        <div>
                                                            <div style={{
                                                                fontSize: '15px',
                                                                fontWeight: 700,
                                                                color: '#111827',
                                                            }}>
                                                                {review.name}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '13px',
                                                                color: '#6B7280',
                                                            }}>
                                                                {review.country}
                                                            </div>
                                                        </div>
                                                        <div style={{ color: '#FFD700' }}>
                                                            {'★'.repeat(review.rating)}
                                                        </div>
                                                    </div>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        lineHeight: 1.6,
                                                        color: '#6B7280',
                                                        margin: 0,
                                                    }}>
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ */}
                            <div style={{ marginBottom: '60px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#111827',
                                    marginBottom: '24px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}>Frequently Asked Questions</h2>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}>
                                    {[
                                        { q: 'Can I cancel my booking?', a: 'Yes, cancellations up to 14 days before travel receive full refund. Cancellations within 14 days are non-refundable.' },
                                        { q: 'Is visa included in this package?', a: pkg.visa_service_included ? 'Yes! Visa processing is included in your package.' : 'Visa services available at additional cost.' },
                                        { q: 'Can I change my travel dates?', a: 'Date changes are allowed up to 30 days before your trip with a small modification fee.' },
                                        { q: 'How do payments work?', a: 'We accept all major credit cards, bank transfers, and installment plans available on selected dates.' },
                                    ].map((item, idx) => (
                                        <div key={idx} style={{
                                            background: '#fff',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                        }}>
                                            <div style={{
                                                padding: '20px 24px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                color: '#111827',
                                                background: expandedDay === idx + 100 ? '#F3F4F6' : '#fff',
                                                transition: 'background 0.3s',
                                            }} onClick={() => setExpandedDay(expandedDay === idx + 100 ? -1 : idx + 100)}>
                                                {item.q}
                                                <i className={`fa fa-chevron-${expandedDay === idx + 100 ? 'up' : 'down'}`} style={{
                                                    color: '#0EA5E9',
                                                    fontSize: '14px',
                                                }}></i>
                                            </div>
                                            {expandedDay === idx + 100 && (
                                                <div style={{
                                                    padding: '0 24px 20px 24px',
                                                    color: '#6B7280',
                                                    fontSize: '14px',
                                                    lineHeight: 1.6,
                                                    background: '#F9FAFB',
                                                }}>
                                                    {item.a}
                                                </div>
                                            )}
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
                                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>Per Person Starting From</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: '8px',
                                    }}>
                                        <span style={{
                                            fontSize: '32px',
                                            fontWeight: 700,
                                            color: '#111827',
                                        }}>£{pkg.price.toLocaleString()}</span>
                                        <span style={{
                                            fontSize: '13px',
                                            color: '#9CA3AF',
                                            textDecoration: 'line-through',
                                        }}>£{Math.round(pkg.price * 1.2).toLocaleString()}</span>
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
                                        ⚡ Save 20% Today
                                    </div>
                                </div>

                                {/* Booking Form */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                    {/* Check-in Date */}
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            display: 'block',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                        }}>Check-in Date</label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                boxSizing: 'border-box',
                                                background: '#F9FAFB',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                            }} onFocus={(e) => {
                                                e.currentTarget.style.borderColor = '#0EA5E9';
                                                e.currentTarget.style.background = '#fff';
                                            }} onBlur={(e) => {
                                                e.currentTarget.style.borderColor = '#E5E7EB';
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }}
                                        />
                                    </div>

                                    {/* Nights */}
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            display: 'block',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                        }}>Duration (Nights)</label>
                                        <select
                                            value={nights}
                                            onChange={(e) => setNights(parseInt(e.target.value))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 14px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                boxSizing: 'border-box',
                                                background: '#F9FAFB',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                            }} onFocus={(e) => {
                                                e.currentTarget.style.borderColor = '#0EA5E9';
                                                e.currentTarget.style.background = '#fff';
                                            }} onBlur={(e) => {
                                                e.currentTarget.style.borderColor = '#E5E7EB';
                                                e.currentTarget.style.background = '#F9FAFB';
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 21, 28].map(n => (
                                                <option key={n} value={n}>{n} nights</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Guests */}
                                    <div>
                                        <label style={{
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            color: '#6B7280',
                                            display: 'block',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                        }}>Guests</label>
                                        <div style={{ position: 'relative' }}>
                                            <div
                                                onClick={() => setShowGuestModal(!showGuestModal)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    height: '44px',
                                                    padding: '0 14px',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    background: '#F9FAFB',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    transition: 'all 0.3s',
                                                }} onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#0EA5E9';
                                                }} onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#E5E7EB';
                                                }}
                                            >
                                                <span>{adults} adults, {children} children, {rooms} rooms</span>
                                                <i className={`fa fa-chevron-${showGuestModal ? 'up' : 'down'}`}></i>
                                            </div>

                                            {showGuestModal && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    marginTop: '8px',
                                                    background: '#fff',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '12px',
                                                    padding: '16px',
                                                    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                                                    zIndex: 999,
                                                }}>
                                                    {[
                                                        { label: 'Adults', value: adults, onChange: setAdults, min: 1, max: 8 },
                                                        { label: 'Children', value: children, onChange: setChildren, min: 0, max: 6 },
                                                        { label: 'Rooms', value: rooms, onChange: setRooms, min: 1, max: 8 },
                                                    ].map((item, idx) => (
                                                        <div key={idx} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            paddingBottom: idx < 2 ? '12px' : 0,
                                                            borderBottom: idx < 2 ? '1px solid #F3F4F6' : 'none',
                                                            marginBottom: idx < 2 ? '12px' : 0,
                                                        }}>
                                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{item.label}</span>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                            }}>
                                                                <button onClick={() => item.onChange(Math.max(item.min, item.value - 1))} style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    border: '1px solid #E5E7EB',
                                                                    background: '#F9FAFB',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    color: '#6B7280',
                                                                    transition: 'all 0.2s',
                                                                }} onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = '#E5E7EB';
                                                                }} onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background = '#F9FAFB';
                                                                }}>−</button>
                                                                <span style={{
                                                                    minWidth: '24px',
                                                                    textAlign: 'center',
                                                                    fontWeight: 700,
                                                                    color: '#111827',
                                                                }}>{item.value}</span>
                                                                <button onClick={() => item.onChange(Math.min(item.max, item.value + 1))} style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    border: '1px solid #E5E7EB',
                                                                    background: '#F9FAFB',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    color: '#6B7280',
                                                                    transition: 'all 0.2s',
                                                                }} onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = '#E5E7EB';
                                                                }} onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background = '#F9FAFB';
                                                                }}>+</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div style={{
                                    background: '#F9FAFB',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    fontSize: '13px',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px',
                                        color: '#6B7280',
                                    }}>
                                        <span>Package price × {adults} person</span>
                                        <span>£{(pkg.price * adults).toLocaleString()}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px',
                                        color: '#6B7280',
                                    }}>
                                        <span>Taxes & fees</span>
                                        <span>£{Math.round(pkg.price * adults * 0.15).toLocaleString()}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #E5E7EB',
                                        fontWeight: 700,
                                        color: '#111827',
                                    }}>
                                        <span>Total Price</span>
                                        <span>£{Math.round(pkg.price * adults * 1.15).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                    <button onClick={handleBook} style={{
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
                                    <button style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        background: '#F3F4F6',
                                        color: '#111827',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#E5E7EB';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#F3F4F6';
                                    }}>
                                        <i className="fa fa-whatsapp" style={{ marginRight: '8px', color: '#25D366' }}></i>
                                        WhatsApp Us
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
                                        <span>ATOL Protected</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px' }}>✓</span>
                                        <span>Best Price Guarantee</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px' }}>✓</span>
                                        <span>24/7 Customer Support</span>
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
                        backgroundImage: `url(${pkg.image})`,
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

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    isOpen={showBookingModal}
                    onClose={handleCloseModal}
                    onSuccess={handleBookingSuccess}
                    searchDetails={{
                        destinationCountry: pkg.destination_country,
                        packageName: pkg.name,
                        packageUid: pkg.uid,
                        hotelName: pkg.hotel_name,
                        checkInDate,
                        nights,
                        adults,
                        children,
                        rooms,
                    }}
                    serviceType="package"
                />
            )}

        </>
    );
}

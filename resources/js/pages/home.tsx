import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { specialOfferService } from '@/services/specialOfferService';
import { heroImageService } from '@/services/heroImageService';
import { testimonialService } from '@/services/testimonialService';
import { contactInfoService } from '@/services/contactInfoService';
import { imageService } from '@/services/imageService';
import FlightSearchForm from '@/components/FlightSearchForm';
import HotelsSearchForm from '@/components/HotelsSearchForm';
import VisasSearchForm from '@/components/VisasSearchForm';
import PackageSearchForm from '@/components/PackageSearchForm';
import AirportTransportForm from '@/components/AirportTransportForm';
import AirlineLogoSlider from '@/components/AirlineLogoSlider';
import ImageWithFallback from '@/components/ImageWithFallback';

/**
 * Home/Landing page component with multiple sections
 */
export default function Home() {
    const [activeService, setActiveService] = useState('flight');
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [showTravellerModal, setShowTravellerModal] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [specialOffers, setSpecialOffers] = useState<any[]>([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const [contactInfo, setContactInfo] = useState<any>(null);
    const [currency, setCurrency] = useState({ symbol: '£', code: 'GBP' });
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const heroAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const testimonialAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        loadSpecialOffers();
        loadHeroImages();
        loadTestimonials();
        loadContactInfo();
    }, []);

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [specialOffers]);

    useEffect(() => {
        startHeroAutoPlay();
        return () => stopHeroAutoPlay();
    }, [heroImages]);

    useEffect(() => {
        startTestimonialAutoPlay();
        return () => stopTestimonialAutoPlay();
    }, [testimonials]);

    const loadSpecialOffers = async () => {
        const offers = await specialOfferService.getAll();
        setSpecialOffers(offers);
    };

    const loadHeroImages = async () => {
        const images = await heroImageService.getAll(1); // status=1 (active only)
        setHeroImages(images.length > 0 ? images : [heroImageService.getDefault()]);
    };

    const loadTestimonials = async () => {
        const data = await testimonialService.getAll(1); // status=1 (active only)
        setTestimonials(data);
    };

    const loadContactInfo = async () => {
        const data = await contactInfoService.get();
        setContactInfo(data);
    };

    const startAutoPlay = () => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
        if (specialOffers.length > 0) {
            autoPlayTimerRef.current = setInterval(() => {
                setCurrentOfferIndex((prev) => (prev === specialOffers.length - 1 ? 0 : prev + 1));
            }, 4000); // Total: 0.5s slide-in + 2s display + 0.5s slide-out + 1s buffer = 4s
        }
    };

    const stopAutoPlay = () => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };

    const startHeroAutoPlay = () => {
        if (heroAutoPlayTimerRef.current) clearInterval(heroAutoPlayTimerRef.current);
        if (heroImages.length > 1) {
            heroAutoPlayTimerRef.current = setInterval(() => {
                setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
            }, 8000); // Auto-play every 8 seconds
        }
    };

    const stopHeroAutoPlay = () => {
        if (heroAutoPlayTimerRef.current) clearInterval(heroAutoPlayTimerRef.current);
    };

    const startTestimonialAutoPlay = () => {
        if (testimonialAutoPlayTimerRef.current) clearInterval(testimonialAutoPlayTimerRef.current);
        if (testimonials.length > 1) {
            testimonialAutoPlayTimerRef.current = setInterval(() => {
                setCurrentTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
            }, 6000); // Auto-play every 6 seconds
        }
    };

    const stopTestimonialAutoPlay = () => {
        if (testimonialAutoPlayTimerRef.current) clearInterval(testimonialAutoPlayTimerRef.current);
    };

    return (
        <>
            <Head title="CloudTravel - Discover the World">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

            <style>{`
                * {
                    box-sizing: border-box;
                }

                /* Smooth transitions for all elements */
                button, input, select, textarea {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Tab button animation */
                button:active {
                    transform: scale(0.98);
                }

                /* Form content fade-in animation */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .form-content-animate {
                    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                /* Button hover and click effects */
                button {
                    position: relative;
                }

                button:hover {
                    transform: translateY(-2px);
                }

                button:active {
                    transform: translateY(0px) scale(0.97);
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 300px !important;
                        padding: 20px !important;
                    }
                    .hero-title {
                        font-size: 24px !important;
                    }
                    .hero-subtitle {
                        font-size: 12px !important;
                    }
                    .hero-buttons {
                        flex-direction: column !important;
                        gap: 8px !important;
                    }
                    .hero-buttons button {
                        padding: 8px 16px !important;
                        font-size: 11px !important;
                    }
                    .offer-marquee {
                        padding: 10px !important;
                        font-size: 10px !important;
                    }
                    .tours-section {
                        padding: 30px 15px !important;
                    }
                    .tours-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .contact-section {
                        padding: 30px 15px !important;
                    }
                    .contact-grid {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                    }
                    input, textarea {
                        font-size: 16px !important;
                    }
                    img {
                        max-width: 100% !important;
                        height: auto !important;
                    }
                    .flight-search-row1 {
                        grid-template-columns: 1fr !important;
                    }
                    .flight-search-row2 {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (min-width: 769px) and (max-width: 1024px) {
                    .flight-search-row1 {
                        grid-template-columns: 1fr !important;
                    }
                    .flight-search-row2 {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            {/* HERO SECTION */}
            {heroImages.length > 0 && (
            <div className="hero-section" style={{ position: 'relative', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', overflow: 'hidden', backgroundImage: `url(${heroImages[currentHeroIndex]?.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out', marginBottom: '50px', paddingTop: '40px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h3 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '5px', textShadow: '0 2px 12px rgba(0,0,0,.5)', transition: 'opacity 0.5s ease-in-out' }}>
                        {heroImages[currentHeroIndex]?.title || 'Discover the World with CloudTravel'}
                    </h3>
                    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,.88)', fontSize: '12px', marginBottom: '0px', lineHeight: 1.6, transition: 'opacity 0.5s ease-in-out' }}>
                        {heroImages[currentHeroIndex]?.subtitle || 'Book flights, hotels, and visas seamlessly in one platform.'}
                    </p>
                    {/* Removed inline buttons - using tabbed interface below */}
                </div>
            </div>
            )}

            {/* BOOKING SEARCH FORM WITH TABS */}
            <div style={{ padding: '0 280px', position: 'relative', zIndex: 10, marginTop: '-200px', paddingBottom: '80px', overflow: 'visible' }}>
                <div style={{ maxWidth: '100%', margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,.18)', overflow: 'visible' }}>
                    {/* Tab Navigation - Professional Style */}
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #efefef', backgroundColor: '#fff', padding: '0 20px', justifyContent: 'center', flexWrap: 'nowrap', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
                        <button
                            onClick={() => setActiveService('flight')}
                            style={{
                                padding: '15px 15px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeService === 'flight' ? '5px solid #0066cc' : 'none',
                                color: activeService === 'flight' ? '#0066cc' : '#000',
                                fontSize: '17px',
                                fontWeight: activeService === 'flight' ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-plane" style={{ fontSize: '19px' }}></i> Flights
                        </button>
                        <button
                            onClick={() => setActiveService('hotel')}
                            style={{
                                padding: '10px 10px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeService === 'hotel' ? '5px solid #0066cc' : 'none',
                                color: activeService === 'hotel' ? '#0066cc' : '#000',
                                fontSize: '17px',
                                fontWeight: activeService === 'hotel' ? 800 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-bed" style={{ fontSize: '19px' }}></i> Hotels
                        </button>
                        <button
                            onClick={() => setActiveService('flight-hotel')}
                            style={{
                                padding: '10px 10px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeService === 'flight-hotel' ? '5px solid #0066cc' : 'none',
                                color: activeService === 'flight-hotel' ? '#0066cc' : '#000',
                                fontSize: '17px',
                                fontWeight: activeService === 'flight-hotel' ? 800 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-cube" style={{ fontSize: '19px' }}></i> Package
                        </button>
                        <button
                            onClick={() => setActiveService('visa')}
                            style={{
                                padding: '10px 10px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeService === 'visa' ? '5px solid #0066cc' : 'none',
                                color: activeService === 'visa' ? '#0066cc' : '#000',
                                fontSize: '17px',
                                fontWeight: activeService === 'visa' ? 800 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-passport" style={{ fontSize: '19px' }}></i> Visa
                        </button>
                        <button
                            onClick={() => setActiveService('airport-transfer')}
                            style={{
                                padding: '10px 10px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeService === 'airport-transfer' ? '5px solid #0066cc' : 'none',
                                color: activeService === 'airport-transfer' ? '#0066cc' : '#000',
                                fontSize: '17px',
                                fontWeight: activeService === 'airport-transfer' ? 800 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-car" style={{ fontSize: '19px' }}></i> Airport Transport
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="form-content-animate" style={{ padding: '16px 32px 20px 32px', backgroundColor: '#f9f9f9', transition: 'all 0.3s ease-in-out', height: 'auto' }}>
                        {activeService === 'flight' && (
                        <FlightSearchForm
                            showDateRangePicker={showDateRangePicker}
                            setShowDateRangePicker={setShowDateRangePicker}
                            showTravellerModal={showTravellerModal}
                            setShowTravellerModal={setShowTravellerModal}
                        />
                    )}

                    {activeService === 'hotel' && (
                        <HotelsSearchForm />
                    )}

                    {activeService === 'visa' && (
                        <VisasSearchForm />
                    )}

                    {activeService === 'flight-hotel' && (
                        <PackageSearchForm />
                    )}

                    {activeService === 'airport-transfer' && (
                        <AirportTransportForm />
                    )}
                    </div>
                </div>
            </div>

            {/* SPECIAL OFFERS SLIDER - MARQUEE STYLE */}
            {specialOffers.length > 0 && (
                <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '12px 15px', textAlign: 'center', fontSize: '11.5px', color: '#555', overflow: 'hidden', width: '100%' }}>
                    <style>{`
                        @keyframes marqueeOffer {
                            0% {
                                opacity: 0;
                                transform: translateX(-100px);
                            }
                            12.5% {
                                opacity: 1;
                                transform: translateX(0);
                            }
                            62.5% {
                                opacity: 1;
                                transform: translateX(0);
                            }
                            75% {
                                opacity: 0;
                                transform: translateX(100px);
                            }
                            100% {
                                opacity: 0;
                                transform: translateX(100px);
                            }
                        }
                        .offer-marquee {
                            animation: marqueeOffer 4s ease-in-out;
                            display: inline-block;
                            white-space: normal;
                            word-wrap: break-word;
                        }
                        @media (max-width: 768px) {
                            .offer-marquee {
                                white-space: normal !important;
                                padding: 0 5px;
                            }
                        }
                    `}</style>
                    <div className="offer-marquee" key={currentOfferIndex}>
                        <div style={{ display: 'inline-block', color: '#ff6b35', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #ff6b35', marginBottom: '4px' }}>Special Offer</div>
                        <br />
                        ★ Special fares with <strong>{specialOffers[currentOfferIndex].airline}</strong> from {specialOffers[currentOfferIndex].from} to {specialOffers[currentOfferIndex].destinations} from <span style={{ color: '#c0392b', fontWeight: 700 }}>{specialOffers[currentOfferIndex].price}</span> <span style={{ color: '#ff6b35', fontWeight: 700 }}>→</span>
                    </div>
                </div>
            )}

            {/* VISA SERVICES SECTION */}
            <section style={{ padding: '50px 40px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px', textAlign: 'center' }}>🛂 Visa Services</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {[
                            { name: 'Schengen Visa', img: 'schengen.jpg', icon: '📋' },
                            { name: 'India Visa', img: 'india.jpg', icon: '📋' },
                            { name: 'USA ESTA', img: 'usa.jpg', icon: '📋' },
                            { name: 'Canada ETA', img: 'canada.jpg', icon: '📋' }
                        ].map((visa, idx) => (
                            <div key={idx} style={{ padding: '20px', background: '#f0f4ff', borderRadius: '10px', border: '1.5px solid #d4dff5', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', overflow: 'hidden' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,102,204,.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = '#e8f0ff'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#f0f4ff'; }}>
                                <ImageWithFallback
                                    src={imageService.getImagePath('visas', visa.img)}
                                    alt={visa.name}
                                    fallbackSrc={imageService.getFallbackImage('gallery')}
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                                />
                                <p style={{ fontSize: '15px', fontWeight: 600, color: '#003d82', margin: 0, lineHeight: 1.4 }}>{visa.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRAVEL PACKAGES SECTION */}
            <section style={{ padding: '50px 40px', background: '#f5f5f5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px', textAlign: 'center' }}>📦 Travel Packages</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {[
                            { name: 'Honeymoon Package', img: 'honeymoon.jpg', icon: '✈️' },
                            { name: 'Family Tour', img: 'family.jpg', icon: '✈️' },
                            { name: 'Adventure Trip', img: 'adventure.jpg', icon: '✈️' },
                            { name: 'Beach Retreat', img: 'beach.jpg', icon: '✈️' }
                        ].map((pkg, idx) => (
                            <div key={idx} style={{ padding: '20px', background: '#fff8f0', borderRadius: '10px', border: '1.5px solid #f5d9c3', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', overflow: 'hidden' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 16px rgba(255,107,53,.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = '#fffaf5'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#fff8f0'; }}>
                                <ImageWithFallback
                                    src={imageService.getImagePath('packages', pkg.img)}
                                    alt={pkg.name}
                                    fallbackSrc={imageService.getFallbackImage('gallery')}
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                                />
                                <p style={{ fontSize: '15px', fontWeight: 600, color: '#003d82', margin: 0, lineHeight: 1.4 }}>{pkg.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AIRLINE LOGO SLIDER SECTION */}
            <AirlineLogoSlider />

            {/* VISA & OTHER SERVICES SECTION */}
            <section style={{ padding: '60px 40px', background: '#f5f5f5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                        {/* Visa Services */}
                        <div>
                            <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#ff6b35', marginBottom: '30px' }}>Visa Services</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {['Schengen Visa', 'India Visa', 'USA ESTA', 'Canada ETA', 'Sri Lanka Visa', 'Turkey Visa', 'Dubai Visa'].map((visa, idx) => (
                                    <li key={idx} style={{ padding: '15px 0', borderBottom: '1px solid #ddd', color: '#333', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <i className="fa fa-check" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: 'bold' }}></i>
                                        {visa}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Other Services */}
                        <div>
                            <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#ff6b35', marginBottom: '30px' }}>Other Services</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {['New Indian Passport', 'Passport Renewal', 'Indian Passport Surrender', 'New OCI', 'OCI Update', 'PAN Card Service'].map((service, idx) => (
                                    <li key={idx} style={{ padding: '15px 0', borderBottom: '1px solid #ddd', color: '#333', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <i className="fa fa-check" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: 'bold' }}></i>
                                        {service}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div style={{ background: '#fff', padding: '20px 30px', borderRadius: '4px', marginTop: '40px', fontSize: '13px', color: '#666' }}>
                        <p style={{ margin: 0 }}><strong>Note:</strong> We provide visa assistance for Indian passport holders for Canada, USA (American and Schengen countries.</p>
                    </div>
                </div>
            </section>

            {/* CONTACT FORM SECTION */}
            <section className="contact-section" style={{ padding: '50px 40px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* Form */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#003d82', marginBottom: '20px' }}>Get in Touch</h3>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input type="text" placeholder="Name" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <input type="email" placeholder="Email" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input type="text" placeholder="Subject" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                                <textarea placeholder="Message" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', minHeight: '120px', fontFamily: "'Open Sans', sans-serif" }} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                                    <input type="checkbox" id="agree" />
                                    <label htmlFor="agree">I Agree to the terms & conditions</label>
                                </div>
                                <button type="submit" style={{ background: '#003d82', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Send</button>
                            </form>
                        </div>

                        {/* Gallery */}
                        <div style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }}></div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            {testimonials.length > 0 && (
                <section style={{ padding: '40px 20px', background: '#f5f5f5' }}>
                    <style>{`
                        @media (max-width: 768px) {
                            .testimonials-section { padding: 30px 15px; }
                            .testimonials-nav { flex-direction: row !important; gap: 10px !important; justify-content: center !important; }
                            .testimonials-nav button { width: 36px !important; height: 36px !important; font-size: 14px !important; flex-shrink: 0; }
                            .testimonials-slider-container { flex: 1; overflow: hidden; min-width: 0; width: 100%; }
                            .testimonials-slider { gap: 0 !important; }
                            .testimonial-card { flex: 0 0 100% !important; padding: 20px !important; width: 100%; }
                            .testimonials-heading { font-size: 22px !important; }
                            .testimonials-paragraph { font-size: 12px !important; }
                            .testimonials-nav {
                                display: flex !important;
                                align-items: center !important;
                                gap: 10px !important;
                            }
                        }

                        @media (min-width: 769px) {
                            .testimonials-slider-container { flex: 1; overflow: hidden; min-width: 0; }
                            .testimonials-slider { gap: 20px !important; flex-wrap: nowrap !important; }
                            .testimonial-card { flex: 0 0 calc(33.33333% - 13.33px) !important; padding: 30px !important; }
                            .testimonials-nav { gap: 30px !important; }
                        }
                    `}</style>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="testimonials-section">
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 className="testimonials-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '12px' }}>What Our Clients Say</h2>
                            <div style={{ width: '50px', height: '3px', background: '#ff6b35', margin: '0 auto 15px' }}></div>
                            <p className="testimonials-paragraph" style={{ color: '#777', fontSize: '13px', maxWidth: '500px', margin: '0 auto' }}>Discover what travelers around the world think about our services</p>
                        </div>

                        <div className="testimonials-nav" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
                            {/* Previous Button */}
                            <button
                                onClick={() => {
                                    const cardsPerView = window.innerWidth >= 769 ? 3 : 1;
                                    setCurrentTestimonialIndex((prev) => {
                                        const newIndex = prev - cardsPerView;
                                        return newIndex < 0 ? Math.max(0, testimonials.length - cardsPerView) : newIndex;
                                    });
                                }}
                                style={{ background: '#003d82', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}
                            >
                                <i className="fa fa-chevron-left"></i>
                            </button>

                            {/* Testimonial Slider */}
                            <div className="testimonials-slider-container" style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                                <div className="testimonials-slider" style={{ display: 'flex', gap: '20px', transition: 'transform 0.5s ease-in-out', transform: `translateX(calc(-${currentTestimonialIndex * (100/Math.max(1, window.innerWidth >= 769 ? 3 : 1))}%))`, flexWrap: 'nowrap' }}>
                                    {testimonials.map((testimonial) => (
                                        <div key={testimonial.id} className="testimonial-card" style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,.1)', textAlign: 'center', flex: '0 0 100%', minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                                <ImageWithFallback
                                                    src={testimonial.client_image}
                                                    alt={testimonial.client_name}
                                                    fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23f0f0f0'/%3E%3Ctext x='40' y='40' font-size='28' fill='%23999' text-anchor='middle' dy='.3em'%3E%3F%3C/text%3E%3C/svg%3E"
                                                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff6b35' }}
                                                />
                                            </div>
                                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>{testimonial.client_name}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '15px' }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <span key={i} style={{ color: '#ff6b35', fontSize: '14px' }}>★</span>
                                                ))}
                                            </div>
                                            <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic' }}>"{testimonial.message}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => {
                                    const cardsPerView = window.innerWidth >= 769 ? 3 : 1;
                                    setCurrentTestimonialIndex((prev) => {
                                        const newIndex = prev + cardsPerView;
                                        return newIndex >= testimonials.length ? 0 : newIndex;
                                    });
                                }}
                                style={{ background: '#003d82', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}
                            >
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>

                        {/* Pagination Dots */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentTestimonialIndex(idx)}
                                    style={{ width: '12px', height: '12px', borderRadius: '50%', border: 'none', background: idx === currentTestimonialIndex ? '#ff6b35' : '#ddd', cursor: 'pointer', transition: 'background 0.3s' }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

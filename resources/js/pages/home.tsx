import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { specialOfferService } from '@/services/specialOfferService';
import { heroImageService } from '@/services/heroImageService';
import { testimonialService } from '@/services/testimonialService';
import { contactInfoService } from '@/services/contactInfoService';
import { imageService } from '@/services/imageService';
import { fetchFeaturedVisas } from '@/services/visaService';
import { fetchFeaturedPackages } from '@/services/packageService';
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
    // ========== TAB MANAGEMENT ==========
    // Read URL parameter (?tab=visa) to set which form to display on page load
    const getInitialService = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            // Default to 'flight' if no tab specified
            return tab || 'flight';
        }
        return 'flight';
    };

    // activeService state: controls which form is displayed (flight, hotel, visa, flight-hotel, airport-transfer)
    const [activeService, setActiveService] = useState(getInitialService());
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
    const [heroImageLoading, setHeroImageLoading] = useState(true);
    const [featuredVisas, setFeaturedVisas] = useState<any[]>([]);
    const [featuredPackages, setFeaturedPackages] = useState<any[]>([]);
    const [searchedCountry, setSearchedCountry] = useState<string>('');
    const isInitialLoadRef = useRef(true);
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const heroAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const testimonialAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Update URL when activeService changes (when user clicks a tab)
    // Also syncs URL when user clicks browser back/forward buttons
    const handleTabChange = (service: string) => {
        setActiveService(service);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', service);
        window.history.pushState({}, '', url);
    };

    // Listen for browser back/forward button clicks
    // This keeps the form in sync when user navigates history
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') || 'flight';
            setActiveService(tab);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        loadSpecialOffers();
        loadHeroImages();
        loadTestimonials();
        loadContactInfo();
        loadFeaturedVisas();
        loadFeaturedPackages();
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
        // Only show loader on initial page load, not on every slider transition
        if (isInitialLoadRef.current && heroImages.length > 0) {
            setHeroImageLoading(true);
            // Ensure loader shows for at least 3 seconds on initial load
            const timer = setTimeout(() => {
                setHeroImageLoading(false);
                isInitialLoadRef.current = false;
            }, 3000);
            return () => clearTimeout(timer);
        }
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

    const loadFeaturedVisas = async () => {
        const visas = await fetchFeaturedVisas();
        setFeaturedVisas(visas);
    };

    const loadFeaturedPackages = async () => {
        const packages = await fetchFeaturedPackages();
        setFeaturedPackages(packages);
    };

    const getFilteredPackages = () => {
        if (!searchedCountry) return [];
        return featuredPackages.filter((pkg) =>
            pkg.destination_country?.toLowerCase().includes(searchedCountry.toLowerCase()) ||
            pkg.name?.toLowerCase().includes(searchedCountry.toLowerCase())
        );
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

            {/* Loading overlay with video when hero image is loading */}
            {heroImageLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#000',
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
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    >
                        <source src="/images/loader.mp4" type="video/mp4" />
                    </video>
                </div>
            )}

            <style>{`
                @keyframes heroSpin {
                    to { transform: rotate(360deg); }
                }

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
                    body, html {
                        width: 100% !important;
                        overflow-x: hidden !important;
                    }
                    .hero-section {
                        min-height: 150px !important;
                        padding: 15px !important;
                        width: 100% !important;
                        margin-bottom: 20px !important;
                    }
                    .hero-title {
                        font-size: 20px !important;
                    }
                    .hero-subtitle {
                        font-size: 11px !important;
                    }
                    .booking-form-container {
                        margin-top: 20px !important;
                        padding: 15px !important;
                    }
                    .booking-form-container > div {
                        max-width: 100% !important;
                        border-radius: 8px !important;
                    }
                    .booking-search-container {
                        display: block !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
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
                        gap: 10px !important;
                        margin-bottom: 10px !important;
                    }
                    .flight-search-row2 {
                        grid-template-columns: 1fr !important;
                        gap: 10px !important;
                        margin-bottom: 10px !important;
                    }
                    .flight-search-row3 {
                        grid-template-columns: 1fr !important;
                        gap: 10px !important;
                        margin-bottom: 10px !important;
                    }
                    .flight-search-container {
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 15px !important;
                    }
                    .flight-search-form {
                        width: 100% !important;
                    }
                    .trip-type-buttons {
                        display: flex !important;
                        gap: 8px !important;
                        margin-bottom: 12px !important;
                        justify-content: flex-start !important;
                    }
                    .trip-type-btn {
                        flex: 1 !important;
                        padding: 6px 10px !important;
                        font-size: 11px !important;
                        height: 36px !important;
                    }
                    /* Tab Navigation Mobile */
                    .tabs-nav {
                        gap: 10px !important;
                        padding: 6px 4px !important;
                        overflow-x: scroll !important;
                        overflow-y: hidden !important;
                        -webkit-overflow-scrolling: touch !important;
                        scroll-behavior: smooth !important;
                        justify-content: flex-start !important;
                        display: flex !important;
                        flex-wrap: nowrap !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 auto !important;
                        border-bottom: 2px solid #efefef !important;
                        scroll-snap-type: x mandatory !important;
                    }
                    .tab-button {
                        padding: 4px 4px !important;
                        font-size: 7px !important;
                        gap: 2px !important;
                        flex-shrink: 0 !important;
                        white-space: nowrap !important;
                        border-radius: 4px !important;
                        height: 36px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        scroll-snap-align: center !important;
                        width: 45px !important;
                        min-width: 45px !important;
                        max-width: 45px !important;
                    }
                    .tab-button i {
                        font-size: 13px !important;
                        margin: 0 !important;
                        line-height: 1 !important;
                    }
                    /* Hide Flying From arrow on mobile */
                    .flying-from-swap {
                        display: none !important;
                    }
                    /* Search Flights button mobile */
                    .search-flights-btn {
                        padding: 8px 16px !important;
                        font-size: 12px !important;
                        height: 40px !important;
                        min-width: auto !important;
                        width: 100% !important;
                    }
                    .hotel-search-row1 {
                        grid-template-columns: 1fr !important;
                    }
                    .hotel-search-row2 {
                        grid-template-columns: 1fr !important;
                    }
                    .visa-search-row {
                        grid-template-columns: 1fr !important;
                    }
                    .package-search-row1 {
                        grid-template-columns: 1fr !important;
                    }
                    .package-search-row2 {
                        grid-template-columns: 1fr !important;
                    }
                    .package-search-row3 {
                        grid-template-columns: 1fr !important;
                    }
                    .tabs-container {
                        padding: 15px !important;
                    }
                    .visa-grid {
                        display: flex !important;
                        grid-template-columns: unset !important;
                        gap: 15px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        -webkit-overflow-scrolling: touch !important;
                        flex-wrap: nowrap !important;
                        padding-bottom: 10px !important;
                    }
                    .visa-grid > div {
                        flex-shrink: 0 !important;
                        width: 160px !important;
                        min-width: 160px !important;
                    }
                    .package-grid {
                        display: flex !important;
                        grid-template-columns: unset !important;
                        gap: 15px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        -webkit-overflow-scrolling: touch !important;
                        flex-wrap: nowrap !important;
                        padding-bottom: 10px !important;
                    }
                    .package-grid > div {
                        flex-shrink: 0 !important;
                        width: 160px !important;
                        min-width: 160px !important;
                    }
                    .airline-slider {
                        padding: 20px 10px !important;
                    }
                    .airline-slider-grid {
                        display: flex !important;
                        grid-template-columns: unset !important;
                        gap: 12px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        -webkit-overflow-scrolling: touch !important;
                        flex-wrap: nowrap !important;
                        padding-bottom: 10px !important;
                        flex: 1 !important;
                    }
                    .airline-slider-grid > div {
                        flex-shrink: 0 !important;
                        width: 120px !important;
                        min-width: 120px !important;
                    }
                    .airline-slider-nav-btn {
                        display: none !important;
                    }
                    .search-container {
                        padding: 20px 15px !important;
                        margin: 20px 0 !important;
                    }
                    .booking-search-form {
                        padding: 20px 15px !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    button {
                        width: 100% !important;
                        max-width: 100% !important;
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
                {/* Hidden image to track loading */}
                {heroImageLoading && (
                    <img
                        src={heroImages[currentHeroIndex]?.image_url}
                        style={{ display: 'none' }}
                        alt="hero"
                    />
                )}

                {/* Loading Spinner */}
                {heroImageLoading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        zIndex: 100
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            border: '10px solid #d0d0d0',
                            borderTop: '10px solid #0066cc',
                            borderRadius: '50%',
                            animation: 'heroSpin 1s linear infinite',
                            boxShadow: '0 8px 25px rgba(0, 102, 204, 0.4)',
                            marginBottom: '20px'
                        }} />
                        <p style={{ color: '#0066cc', fontSize: '16px', fontWeight: 600, margin: 0 }}>Loading...</p>
                    </div>
                )}

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
            <div className="booking-form-container" style={{ padding: '0 20px', position: 'relative', zIndex: 10, marginTop: '-180px', paddingBottom: '80px', overflow: 'visible' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,.12)', overflow: 'visible' }}>
                    {/* Tab Navigation - Professional Style */}
                    {/* ========== TAB BUTTONS ========== */}
                    {/* Each tab button shows a service form when clicked */}
                    {/* Tab styling changes based on activeService state: */}
                    {/* - Active tab: blue underline (5px solid #0499ff) + blue text (#0499ff) + bold font (800) */}
                    {/* - Inactive tab: no underline + black text (#000) + normal font (500-600) */}
                    {/* When user clicks tab: handleTabChange() updates activeService + URL parameter */}
                    <div className="tabs-nav" style={{ display: 'flex', gap: 'clamp(0px, 1vw, 8px)', borderBottom: '2px solid #efefef', backgroundColor: '#fff', padding: 'clamp(2px, 1vw, 20px)', justifyContent: 'center', flexWrap: 'nowrap', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
                        {/* FLIGHTS TAB - Shows flight search form */}
                        <button className="tab-button"
                            onClick={() => handleTabChange('flight')}
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
                        <button className="tab-button"
                            onClick={() => handleTabChange('hotel')}
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
                        <button className="tab-button"
                            onClick={() => handleTabChange('flight-hotel')}
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
                        <button className="tab-button"
                            onClick={() => handleTabChange('visa')}
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
                        <button className="tab-button"
                            onClick={() => handleTabChange('airport-transfer')}
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
                        <>
                            <PackageSearchForm onCountrySelect={setSearchedCountry} />

                            {/* PACKAGES BY SEARCHED COUNTRY - TABLE FORMAT BELOW SEARCH BUTTON */}
                            {getFilteredPackages().length > 0 && (
                                <div style={{ background: '#f9f9f9', borderTop: '1px solid #e0e0e0', padding: '16px 0', marginTop: '12px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#003d82', marginBottom: '12px', paddingLeft: '30px' }}>
                                        📦 Available Packages in {searchedCountry}
                                    </h3>
                                    <div style={{ overflowX: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #0499ff', background: '#f0f7ff' }}>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#003d82' }}>Package</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#003d82' }}>Price</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#003d82' }}>Duration</th>
                                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#003d82' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getFilteredPackages().map((pkg) => (
                                                    <tr
                                                        key={pkg.id}
                                                        style={{
                                                            borderBottom: '1px solid #e0e0e0',
                                                            transition: 'background 0.2s',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#f0f7ff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'transparent';
                                                        }}
                                                    >
                                                        <td style={{ padding: '12px', fontSize: '13px' }}>
                                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                                {pkg.image && (
                                                                    <img
                                                                        src={pkg.image}
                                                                        alt={pkg.name}
                                                                        style={{
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            borderRadius: '4px',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div style={{ fontWeight: 700, color: '#003d82', marginBottom: '2px' }}>
                                                                        {pkg.name}
                                                                    </div>
                                                                    <div style={{ fontSize: '11px', color: '#999' }}>
                                                                        {pkg.description ? pkg.description.substring(0, 50) + '...' : 'Travel package'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 700, color: '#0499ff' }}>
                                                            £{pkg.price?.toLocaleString() || 'N/A'}
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                                                            {pkg.duration_days} days
                                                        </td>
                                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                                            <a
                                                                href={`/packages/${pkg.uid || pkg.id}`}
                                                                style={{
                                                                    background: '#0499ff',
                                                                    color: '#fff',
                                                                    padding: '6px 12px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '11px',
                                                                    fontWeight: 700,
                                                                    textDecoration: 'none',
                                                                    display: 'inline-block',
                                                                    transition: 'background 0.2s',
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = '#0284d0';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background = '#0499ff';
                                                                }}
                                                            >
                                                                View Details
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
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
                        <div style={{ display: 'inline-block', color: '#0499ff', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #0499ff', marginBottom: '4px' }}>Special Offer</div>
                        <br />
                        ★ Special fares with <strong>{specialOffers[currentOfferIndex].airline}</strong> from {specialOffers[currentOfferIndex].from} to {specialOffers[currentOfferIndex].destinations} from <span style={{ color: '#c0392b', fontWeight: 700 }}>{specialOffers[currentOfferIndex].price}</span> <span style={{ color: '#0499ff', fontWeight: 700 }}>→</span>
                    </div>
                </div>
            )}

            {/* VISA SERVICES SECTION */}
            <section style={{ padding: '50px 40px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px', textAlign: 'center' }}>🛂 Visa Services</h3>
                    <div className="visa-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
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
                                    fallbackSrc={imageService.getFallbackImage('visa')}
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                                />
                                <p style={{ fontSize: '15px', fontWeight: 600, color: '#003d82', margin: 0, lineHeight: 1.4 }}>{visa.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* FEATURED VISAS SECTION */}
            {featuredVisas.length > 0 && (
                <section style={{ padding: '50px 20px', background: '#fff' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '12px' }}>
                                <i className="fa fa-star" style={{ color: '#0499ff', marginRight: '10px' }}></i>
                                Featured Visa Services
                            </h2>
                            <div style={{ width: '50px', height: '3px', background: '#0499ff', margin: '0 auto 15px' }}></div>
                            <p style={{ color: '#777', fontSize: '13px', maxWidth: '500px', margin: '0 auto' }}>
                                Explore our most popular visa services for your travel needs
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
                            {featuredVisas.map((visa) => (
                                <div key={visa.id} style={{
                                    background: '#fff',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    border: '2px solid #0499ff'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        height: '180px',
                                        background: '#f0f0f0',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {visa.image ? (
                                            <ImageWithFallback
                                                src={visa.image}
                                                alt={visa.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: '#fff',
                                                fontSize: '48px'
                                            }}>
                                                <i className="fa fa-passport"></i>
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: '#0499ff',
                                            color: '#fff',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <i className="fa fa-star"></i> Featured
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: '#003d82',
                                            marginBottom: '8px'
                                        }}>
                                            {visa.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#0499ff',
                                            fontWeight: 600,
                                            marginBottom: '10px'
                                        }}>
                                            {visa.title}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            lineHeight: '1.5',
                                            marginBottom: '15px'
                                        }}>
                                            {visa.description ? visa.description.substring(0, 80) + '...' : 'Professional visa services'}
                                        </p>
                                        <button style={{
                                            width: '100%',
                                            background: '#0499ff',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#0277d8';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#0499ff';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FEATURED PACKAGES SECTION */}
            {featuredPackages.length > 0 && (
                <section style={{ padding: '50px 20px', background: '#f9f9f9' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '12px' }}>
                                <i className="fa fa-gift" style={{ color: '#0499ff', marginRight: '10px' }}></i>
                                Featured Travel Package
                            </h2>
                            <div style={{ width: '50px', height: '3px', background: '#0499ff', margin: '0 auto 15px' }}></div>
                            <p style={{ color: '#777', fontSize: '13px', maxWidth: '500px', margin: '0 auto' }}>
                                Explore our most popular travel packages for unforgettable adventures
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
                            {featuredPackages.map((pkg) => (
                                <div key={pkg.id} style={{
                                    background: '#fff',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    cursor: 'pointer',
                                    border: '2px solid #0499ff'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        height: '200px',
                                        background: '#f0f0f0',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        {pkg.image ? (
                                            <ImageWithFallback
                                                src={pkg.image}
                                                alt={pkg.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: '#fff',
                                                fontSize: '48px'
                                            }}>
                                                <i className="fa fa-gift"></i>
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: '#0499ff',
                                            color: '#fff',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <i className="fa fa-star"></i> Featured
                                        </div>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '10px',
                                            background: '#003d82',
                                            color: '#fff',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: 700
                                        }}>
                                            {pkg.origin_country || 'India'} → {pkg.destination_country}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: '#003d82',
                                            marginBottom: '8px'
                                        }}>
                                            {pkg.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#0499ff',
                                            fontWeight: 600,
                                            marginBottom: '10px'
                                        }}>
                                            {pkg.title}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                            fontSize: '12px',
                                            color: '#666'
                                        }}>
                                            <span><i className="fa fa-calendar me-1"></i>{pkg.duration_days} Days</span>
                                            <span><i className="fa fa-star me-1"></i>{pkg.hotel_stars} Stars</span>
                                        </div>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: '#003d82',
                                            marginBottom: '15px'
                                        }}>
                                            {pkg.currency} {parseFloat(String(pkg.price)).toFixed(0)}
                                        </div>
                                        {(pkg.travel_export_included || pkg.visa_service_included) && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '5px',
                                                marginBottom: '15px',
                                                flexWrap: 'wrap',
                                                fontSize: '10px'
                                            }}>
                                                {pkg.travel_export_included && (
                                                    <span className="badge bg-success"><i className="fa fa-check me-1"></i>Travel Export</span>
                                                )}
                                                {pkg.visa_service_included && (
                                                    <span className="badge bg-primary"><i className="fa fa-check me-1"></i>Visa Service</span>
                                                )}
                                            </div>
                                        )}
                                        <button style={{
                                            width: '100%',
                                            background: '#0499ff',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#0277d8';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#0499ff';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* AIRLINE LOGO SLIDER SECTION */}
            <AirlineLogoSlider />

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
                            <div style={{ width: '50px', height: '3px', background: '#0499ff', margin: '0 auto 15px' }}></div>
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
                                                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0499ff' }}
                                                />
                                            </div>
                                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>{testimonial.client_name}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '15px' }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <span key={i} style={{ color: '#0499ff', fontSize: '14px' }}>★</span>
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
                                    style={{ width: '12px', height: '12px', borderRadius: '50%', border: 'none', background: idx === currentTestimonialIndex ? '#0499ff' : '#ddd', cursor: 'pointer', transition: 'background 0.3s' }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

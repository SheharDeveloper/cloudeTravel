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
import ImageWithFallback from '@/components/ImageWithFallback';
import ContactForm from '@/components/ContactForm';
import SpecialOffers from '@/components/SpecialOffers';

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
    const [activeOfferTab, setActiveOfferTabState] = useState<string>(getInitialService());
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

    // Update URL when activeOfferTab changes (for special offers and unified tabs)
    const handleOfferTabChange = (tab: string) => {
        setActiveOfferTabState(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
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
        const result = await specialOfferService.getAllOffers();
        setSpecialOffers(result.offers);
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
                    .hotel-search-row1 {
                        grid-template-columns: 1fr 1fr !important;
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

                {/* Small Loading Popup - Inside Website with Blurred Background */}
                {heroImageLoading && (
                    <>
                        {/* Blurred Background Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            zIndex: 49,
                            borderRadius: '12px'
                        }}></div>

                        {/* Loader Popup */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: '#ffffff',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                            zIndex: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            maxWidth: '200px'
                        }}>
                            {/* Video Loader - Replace with your video */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            >
                                <source src="/images/loader.mp4" type="video/mp4" />
                                {/* Fallback spinner if video not available */}
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    border: '3px solid #e0e0e0',
                                    borderTop: '3px solid #0499ff',
                                    borderRadius: '50%',
                                    animation: 'heroSpin 1s linear infinite'
                                }} />
                            </video>
                            <span style={{ color: '#000000', fontSize: '12px', fontWeight: 600 }}>Loading...</span>
                        </div>
                    </>
                )}

                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h3 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#ffffff', marginBottom: '5px', textShadow: '0 2px 12px rgba(0,0,0,.5)', transition: 'opacity 0.5s ease-in-out' }}>
                        {heroImages[currentHeroIndex]?.title || 'Discover the World with CloudTravel'}
                    </h3>
                    <p className="hero-subtitle" style={{ color: '#ffffff', fontSize: '12px', marginBottom: '0px', lineHeight: 1.6, transition: 'opacity 0.5s ease-in-out' }}>
                        {heroImages[currentHeroIndex]?.subtitle || 'Book flights, hotels, and visas seamlessly in one platform.'}
                    </p>
                    {/* Removed inline buttons - using tabbed interface below */}
                </div>
            </div>
            )}

            {/* BOOKING SEARCH FORM WITH TABS */}
            <div className="booking-form-container" style={{ padding: '0 20px', position: 'relative', zIndex: 10, marginTop: '-180px', paddingBottom: '80px', overflow: 'visible' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,.12)', overflow: 'visible' }}>
                    {/* Tab Navigation - Professional Style */}
                    {/* Tabs controlled by activeOfferTab from special offers section */}
                    <div className="tabs-nav" style={{ display: 'flex', gap: 'clamp(0px, 1vw, 8px)', borderBottom: '2px solid #efefef', backgroundColor: '#fff', padding: 'clamp(2px, 1vw, 20px)', justifyContent: 'center', flexWrap: 'nowrap', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
                        {/* FLIGHTS TAB - Shows flight search form */}
                        <button className="tab-button"
                            onClick={() => handleOfferTabChange('flight')}
                            style={{
                                padding: '8px 12px',
                                background: activeOfferTab === 'flight' ? '#0499ff' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                borderBottom: activeOfferTab === 'flight' ? '3px solid #0499ff' : 'none',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: activeOfferTab === 'flight' ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-plane" style={{ fontSize: '19px', color: activeOfferTab === 'flight' ? '#ffffff' : '#888' }}></i> <span style={{ color: activeOfferTab === 'flight' ? '#ffffff' : '#000' }}>Flights</span>
                        </button>
                        <button className="tab-button"
                            onClick={() => handleOfferTabChange('hotel')}
                            style={{
                                padding: '8px 12px',
                                background: activeOfferTab === 'hotel' ? '#0499ff' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                borderBottom: activeOfferTab === 'hotel' ? '3px solid #0499ff' : 'none',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: activeOfferTab === 'hotel' ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-bed" style={{ fontSize: '19px', color: activeOfferTab === 'hotel' ? '#ffffff' : '#888' }}></i> <span style={{ color: activeOfferTab === 'hotel' ? '#ffffff' : '#000' }}>Hotels</span>
                        </button>
                        <button className="tab-button"
                            onClick={() => handleOfferTabChange('package')}
                            style={{
                                padding: '8px 12px',
                                background: activeOfferTab === 'package' ? '#0499ff' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                borderBottom: activeOfferTab === 'package' ? '3px solid #0499ff' : 'none',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: activeOfferTab === 'package' ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-cube" style={{ fontSize: '19px', color: activeOfferTab === 'package' ? '#ffffff' : '#888' }}></i> <span style={{ color: activeOfferTab === 'package' ? '#ffffff' : '#000' }}>Package</span>
                        </button>
                        <button className="tab-button"
                            onClick={() => handleOfferTabChange('visa')}
                            style={{
                                padding: '8px 12px',
                                background: activeOfferTab === 'visa' ? '#0499ff' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                borderBottom: activeOfferTab === 'visa' ? '3px solid #0499ff' : 'none',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: activeOfferTab === 'visa' ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-passport" style={{ fontSize: '19px', color: activeOfferTab === 'visa' ? '#ffffff' : '#666' }}></i> <span style={{ color: activeOfferTab === 'visa' ? '#ffffff' : '#000' }}>Visa</span>
                        </button>
                        <button className="tab-button"
                            onClick={() => handleOfferTabChange('airport-transfer')}
                            style={{
                                padding: '8px 12px',
                                background: activeOfferTab === 'airport-transfer' ? '#0499ff' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                borderBottom: activeOfferTab === 'airport-transfer' ? '3px solid #0499ff' : 'none',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: activeOfferTab === 'airport-transfer' ? 800 : 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                letterSpacing: '0.3px'
                            }}
                        >
                            <i className="fa fa-car" style={{ fontSize: '19px', color: activeOfferTab === 'airport-transfer' ? '#ffffff' : '#666' }}></i> <span style={{ color: activeOfferTab === 'airport-transfer' ? '#ffffff' : '#000' }}>Airport Transport</span>
                        </button>
                    </div>

                    {/* Form Content - Controlled by activeOfferTab */}
                    <div className="form-content-animate" style={{ padding: '16px 32px 20px 32px', backgroundColor: '#ffffff', transition: 'all 0.3s ease-in-out', height: 'auto' }}>
                        {activeOfferTab === 'flight' && (
                        <FlightSearchForm
                            showDateRangePicker={showDateRangePicker}
                            setShowDateRangePicker={setShowDateRangePicker}
                            showTravellerModal={showTravellerModal}
                            setShowTravellerModal={setShowTravellerModal}
                        />
                    )}

                    {activeOfferTab === 'hotel' && (
                        <HotelsSearchForm />
                    )}

                    {activeOfferTab === 'visa' && (
                        <VisasSearchForm />
                    )}

                    {activeOfferTab === 'package' && (
                        <>
                            <PackageSearchForm onCountrySelect={setSearchedCountry} />

                            {/* PACKAGES BY SEARCHED COUNTRY - TABLE FORMAT BELOW SEARCH BUTTON */}
                            {getFilteredPackages().length > 0 && (
                                <div style={{ background: '#f9f9f9', borderTop: '1px solid #e0e0e0', padding: '16px 0', marginTop: '12px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '12px', paddingLeft: '30px' }}>
                                        📦 Available Packages in {searchedCountry}
                                    </h3>
                                    <div style={{ overflowX: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid #0499ff', background: '#f0f7ff' }}>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#000000' }}>Package</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#000000' }}>Price</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#000000' }}>Duration</th>
                                                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#000000' }}>Action</th>
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
                                                                    <div style={{ fontWeight: 700, color: '#000000', marginBottom: '2px' }}>
                                                                        {pkg.name}
                                                                    </div>
                                                                    <div style={{ fontSize: '11px', color: '#000000' }}>
                                                                        {pkg.description ? pkg.description.substring(0, 50) + '...' : 'Travel package'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 700, color: '#000000' }}>
                                                            £{pkg.price?.toLocaleString() || 'N/A'}
                                                        </td>
                                                        <td style={{ padding: '12px', fontSize: '13px', color: '#000000' }}>
                                                            {pkg.duration_days} days
                                                        </td>
                                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                                            <a
                                                                href={`/packages/${pkg.uid || pkg.id}`}
                                                                style={{
                                                                    background: '#0499ff',
                                                                    color: '#000000',
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

                    {activeOfferTab === 'airport-transfer' && (
                        <AirportTransportForm />
                    )}
                    </div>
                </div>
            </div>



            {/* FEATURED VISAS SECTION */}
            {featuredVisas.length > 0 && (
                <section style={{ padding: '50px 20px', background: '#fff' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#000000', marginBottom: '12px' }}>
                                <i className="fa fa-star" style={{ color: '#000000', marginRight: '10px' }}></i>
                                Featured Visa Services
                            </h2>
                            <div style={{ width: '50px', height: '3px', background: '#ffffff', margin: '0 auto 15px' }}></div>
                            <p style={{ color: '#000000', fontSize: '13px', maxWidth: '500px', margin: '0 auto' }}>
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
                                                color: '#000000',
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
                                            color: '#000000',
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
                                            color: '#000000',
                                            marginBottom: '8px'
                                        }}>
                                            {visa.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#000000',
                                            fontWeight: 600,
                                            marginBottom: '10px'
                                        }}>
                                            {visa.title}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#000000',
                                            lineHeight: '1.5',
                                            marginBottom: '15px'
                                        }}>
                                            {visa.description ? visa.description.substring(0, 80) + '...' : 'Professional visa services'}
                                        </p>
                                        <button style={{
                                            width: '100%',
                                            background: '#ffffff',
                                            color: '#000000',
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


            {/* SPECIAL OFFERS COMPONENT */}
            {specialOffers.length > 0 && (
                <SpecialOffers
                    activeOfferTab={activeOfferTab}
                    handleOfferTabChange={handleOfferTabChange}
                    specialOffers={specialOffers}
                    currency={currency}
                />
            )}

            {/* CONTACT FORM SECTION */}
            <section className="contact-section" style={{ padding: '50px 40px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 className="testimonials-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#000000', marginBottom: '12px' }}>Get in Touch</h2>
                            <div style={{ width: '50px', height: '3px', background: '#ffffff', margin: '0 auto 15px' }}></div>
                            <p className="testimonials-paragraph" style={{ color: '#000000', fontSize: '13px', maxWidth: '500px', margin: '0 auto' }}>Have questions or want to learn more? Fill out the form and we'll get back to you soon!</p>
                        </div>
                    <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* Form */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '20px' }}>Get in Touch</h3>
                            <ContactForm />
                        </div>

                        {/* Gallery */}
                        <div style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }}></div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            {testimonials.length > 0 && (
                <section style={{ padding: '40px 20px', background: '#ffffff' }}>
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
                            <h2 className="testimonials-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#000000', marginBottom: '12px' }}>What Our Clients Say</h2>
                            <div style={{ width: '50px', height: '3px', background: '#ffffff', margin: '0 auto 15px' }}></div>
                            <p className="testimonials-paragraph" style={{ color: '#000000', fontSize: '13px', maxWidth: '500px', margin: '0 auto' }}>Discover what travelers around the world think about our services</p>
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
                                style={{ background: '#0499ff', color: '#000000', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}
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
                                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#000000', marginBottom: '8px' }}>{testimonial.client_name}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '15px' }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <span key={i} style={{ color: '#000000', fontSize: '14px' }}>★</span>
                                                ))}
                                            </div>
                                            <p style={{ color: '#000000', fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic' }}>"{testimonial.message}"</p>
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
                                style={{ background: '#0499ff', color: '#000000', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}
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

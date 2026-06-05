import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { specialOfferService } from '@/services/specialOfferService';
import { heroImageService } from '@/services/heroImageService';
import { testimonialService } from '@/services/testimonialService';
import { contactInfoService } from '@/services/contactInfoService';
import { getTours } from '@/services/tourService';

/**
 * Home/Landing page component with multiple sections
 */
export default function Home() {
    const [tripType, setTripType] = useState('roundtrip');
    const [showTravellerModal, setShowTravellerModal] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [showFlightModal, setShowFlightModal] = useState(false);

    const cityList = [
        { code: 'LON', name: 'London' },
        { code: 'DEL', name: 'Delhi' },
        { code: 'BOM', name: 'Mumbai' },
        { code: 'NYC', name: 'New York' },
        { code: 'LAX', name: 'Los Angeles' },
        { code: 'CDG', name: 'Paris' },
        { code: 'LHR', name: 'London Heathrow' },
        { code: 'DXB', name: 'Dubai' },
        { code: 'SIN', name: 'Singapore' },
        { code: 'HND', name: 'Tokyo' },
        { code: 'IXC', name: 'Chandigarh' },
    ];

    const filterCities = (search: string) => {
        if (!search) return cityList;
        return cityList.filter(city =>
            city.code.toLowerCase().includes(search.toLowerCase()) ||
            city.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [specialOffers, setSpecialOffers] = useState<any[]>([]);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const [contactInfo, setContactInfo] = useState<any>(null);
    const [tours, setTours] = useState<any[]>([]);
    const [currency, setCurrency] = useState({ symbol: '£', code: 'GBP' });
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const heroAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const testimonialAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        loadSpecialOffers();
        loadHeroImages();
        loadTestimonials();
        loadContactInfo();
        loadTours();
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

    const loadTours = async () => {
        try {
            const response = await getTours(1, 6, 'active', undefined, true);
            if (response.success) {
                setTours(response.data.data || []);
                if (response.currency) {
                    setCurrency(response.currency);
                }
            }
        } catch (err) {
            console.error('Failed to load tours:', err);
        }
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

    const handleFlightSearch = () => {
        if (!fromCity || !toCity || !departureDate) {
            alert('Please fill in all required fields');
            return;
        }

        router.post('/search/flight', {
            tripType,
            fromCity,
            toCity,
            departureDate,
            returnDate: tripType === 'roundtrip' ? returnDate : departureDate,
            adults,
            children,
            infants,
            selectedClass,
        });
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
                }
            `}</style>

            {/* HERO SECTION */}
            {heroImages.length > 0 && (
            <div className="hero-section" style={{ position: 'relative', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', backgroundImage: `url(${heroImages[currentHeroIndex]?.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out', marginBottom: '50px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: 700, color: '#fff', marginBottom: '10px', textShadow: '0 2px 12px rgba(0,0,0,.5)', transition: 'opacity 0.5s ease-in-out' }}>
                        {heroImages[currentHeroIndex]?.title || 'Discover the World with CloudTravel'}
                    </h1>
                    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7, transition: 'opacity 0.5s ease-in-out' }}>
                        {heroImages[currentHeroIndex]?.subtitle || 'Book flights, hotels, and visas seamlessly in one platform.'}
                    </p>
                    <div className="hero-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={handleFlightSearch} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-plane"></i> FLIGHT
                        </button>
                        <Link href="/hotels" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.7)', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase', textDecoration: 'none' }}>
                            <i className="fa fa-bed"></i> HOTEL
                        </Link>
                        <Link href="/visas" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.7)', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase', textDecoration: 'none' }}>
                            <i className="fa fa-passport"></i> VISA
                        </Link>
                    </div>
                </div>
            </div>
            )}

            {/* FLIGHT BOOKING FORM */}
            <div style={{ padding: '0 20px', position: 'relative', zIndex: 10, marginTop: '-80px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,.15)' }}>
                    {/* Trip Type Toggle */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button onClick={() => setTripType('oneway')} style={{ background: tripType === 'oneway' ? '#0066cc' : '#fff', color: tripType === 'oneway' ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>One Way</button>
                        <button onClick={() => setTripType('roundtrip')} style={{ background: tripType === 'roundtrip' ? '#0066cc' : '#fff', color: tripType === 'roundtrip' ? '#fff' : '#333', border: '1px solid #ddd', padding: '8px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Round Trip</button>
                    </div>

                    {/* Main Search Fields */}
                    <div style={{ display: tripType === 'oneway' ? 'grid' : 'grid', gridTemplateColumns: tripType === 'oneway' ? '2fr 0.8fr 2fr 1.2fr auto' : '2fr 0.8fr 2fr 1.2fr 1.2fr auto', gap: '15px', marginBottom: '20px', alignItems: 'end' }}>
                        {/* FROM CITY - Searchable Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 700 }}>From</label>
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={fromCity ? `${cityList.find(c => c.code === fromCity)?.code} - ${cityList.find(c => c.code === fromCity)?.name}` : fromSearch}
                                onChange={(e) => {
                                    setFromSearch(e.target.value);
                                    setFromCity('');
                                    setShowFromDropdown(true);
                                }}
                                onFocus={() => setShowFromDropdown(true)}
                                style={{ width: '100%', padding: '12px 12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '45px', boxSizing: 'border-box' }}
                            />
                            {/* FROM DROPDOWN */}
                            {showFromDropdown && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                                    {filterCities(fromSearch).length > 0 ? (
                                        filterCities(fromSearch).map(city => (
                                            <div
                                                key={city.code}
                                                onClick={() => {
                                                    setFromCity(city.code);
                                                    setFromSearch('');
                                                    setShowFromDropdown(false);
                                                }}
                                                style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                            >
                                                <strong>{city.code}</strong> - {city.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No cities found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    const tempCity = fromCity;
                                    setFromCity(toCity);
                                    setToCity(tempCity);
                                    setFromSearch('');
                                    setToSearch('');
                                    setShowFromDropdown(false);
                                    setShowToDropdown(false);
                                }}
                                style={{ background: '#f0f0f0', border: 'none', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e0e0e0'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f0f0'}
                            >⇄</button>
                        </div>
                        {/* TO CITY - Searchable Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 700 }}>To</label>
                            <input
                                type="text"
                                placeholder="Search city..."
                                value={toCity ? `${cityList.find(c => c.code === toCity)?.code} - ${cityList.find(c => c.code === toCity)?.name}` : toSearch}
                                onChange={(e) => {
                                    setToSearch(e.target.value);
                                    setToCity('');
                                    setShowToDropdown(true);
                                }}
                                onFocus={() => setShowToDropdown(true)}
                                style={{ width: '100%', padding: '12px 12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '45px', boxSizing: 'border-box' }}
                            />
                            {/* TO DROPDOWN */}
                            {showToDropdown && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                                    {filterCities(toSearch).length > 0 ? (
                                        filterCities(toSearch).map(city => (
                                            <div
                                                key={city.code}
                                                onClick={() => {
                                                    setToCity(city.code);
                                                    setToSearch('');
                                                    setShowToDropdown(false);
                                                }}
                                                style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                            >
                                                <strong>{city.code}</strong> - {city.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No cities found</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 700 }}>Departure</label>
                            <input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            />
                        </div>
                        {tripType === 'roundtrip' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 700 }}>Return</label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                                />
                            </div>
                        )}
                        <button
                            onClick={handleFlightSearch}
                            style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', height: '38px', whiteSpace: 'nowrap' }}>
                            Search →
                        </button>
                    </div>

                    {/* Secondary Row - Travellers & Special Fares */}
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', gap: '25px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                                <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Travellers & Class</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        onClick={() => setShowTravellerModal(!showTravellerModal)}
                                        value={`${adults + children + infants} Traveller${adults + children + infants !== 1 ? 's' : ''}, ${selectedClass}`}
                                        readOnly
                                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', width: '180px', cursor: 'pointer' }}
                                    />
                                    {/* TRAVELLER DROPDOWN */}
                                    {showTravellerModal && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#fff', width: '380px', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,.15)', zIndex: 100 }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '18px' }}>Travellers</h3>

                                            {/* Adults */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Adults <span style={{ fontSize: '9px', color: '#999' }}>12 yrs or above</span></p>
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                                                        const totalWithThisAdult = n + children + infants;
                                                        const isDisabled = n !== adults && totalWithThisAdult > 9;
                                                        return (
                                                            <button key={n} onClick={() => !isDisabled && setAdults(n)} disabled={isDisabled} style={{ background: adults === n ? '#0066cc' : '#fff', color: adults === n ? '#fff' : isDisabled ? '#ddd' : '#666', border: adults === n ? 'none' : '1px solid ' + (isDisabled ? '#f0f0f0' : '#ddd'), width: adults === n ? '32px' : '28px', height: adults === n ? '32px' : '28px', borderRadius: '4px', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: adults === n ? '11px' : '10px', fontWeight: adults === n ? 700 : 500, opacity: isDisabled ? 0.4 : 1 }}>{n}</button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Children <span style={{ fontSize: '9px', color: '#999' }}>2 - 12 yrs</span></p>
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                                        const totalWithThisChild = adults + n + infants;
                                                        const isDisabled = n !== children && totalWithThisChild > 9;
                                                        return (
                                                            <button key={n} onClick={() => !isDisabled && setChildren(n)} disabled={isDisabled} style={{ background: children === n ? '#0066cc' : '#fff', color: children === n ? '#fff' : isDisabled ? '#ddd' : '#666', border: children === n ? 'none' : '1px solid ' + (isDisabled ? '#f0f0f0' : '#ddd'), width: children === n ? '32px' : '28px', height: children === n ? '32px' : '28px', borderRadius: '4px', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: children === n ? '11px' : '10px', fontWeight: children === n ? 700 : 500, opacity: isDisabled ? 0.4 : 1 }}>{n}</button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Infants */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Infants <span style={{ fontSize: '9px', color: '#999' }}>0 - 2 yrs</span></p>
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    {[0, 1, 2, 3, 4].map(n => {
                                                        const totalWithThisInfant = adults + children + n;
                                                        const isDisabled = n !== infants && totalWithThisInfant > 9;
                                                        return (
                                                            <button key={n} onClick={() => !isDisabled && setInfants(n)} disabled={isDisabled} style={{ background: infants === n ? '#0066cc' : '#fff', color: infants === n ? '#fff' : isDisabled ? '#ddd' : '#666', border: infants === n ? 'none' : '1px solid ' + (isDisabled ? '#f0f0f0' : '#ddd'), width: infants === n ? '32px' : '28px', height: infants === n ? '32px' : '28px', borderRadius: '4px', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: infants === n ? '11px' : '10px', fontWeight: infants === n ? 700 : 500, opacity: isDisabled ? 0.4 : 1 }}>{n}</button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Group Booking Message */}
                                            {adults + children + infants >= 9 && (
                                                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '18px', marginTop: '15px' }}>
                                                    <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>👥 Planning a trip for more than 9 travellers? <span style={{ color: '#ff6b35', fontWeight: 600, cursor: 'pointer' }}>Create Group Booking</span></p>
                                                </div>
                                            )}

                                            {/* Class Selection */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px', fontWeight: 600 }}>Class</p>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {['Economy', 'Premium Economy', 'Business'].map(cls => (
                                                        <button key={cls} onClick={() => setSelectedClass(cls)} style={{ background: selectedClass === cls ? '#0066cc' : '#fff', color: selectedClass === cls ? '#fff' : '#333', border: '1px solid ' + (selectedClass === cls ? '#0066cc' : '#ddd'), padding: '8px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{cls}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Done Button */}
                                            <button onClick={() => setShowTravellerModal(false)} style={{ background: '#ff6b35', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Special Fares (Optional):</span>
                                <button style={{ background: '#fff', color: '#666', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Student</button>
                                <button style={{ background: '#fff', color: '#666', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Senior Citizen</button>
                                <button style={{ background: '#fff', color: '#666', border: '1px solid #ddd', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Armed Forces</button>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input type="checkbox" id="freeCancellation" />
                            <label htmlFor="freeCancellation" style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Always opt for Free Cancellation</label>
                            <span style={{ fontSize: '11px', color: '#999', marginLeft: '10px' }}>• ₹0 cancellation fee • No-questions-asked instant refunds • Priority customer service</span>
                        </div>
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

            {/* TOURS SECTION */}
            <section className="tours-section" style={{ padding: '50px 40px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="tours-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#003d82', marginBottom: '8px' }}>Our Tours</h2>
                        <div style={{ width: '40px', height: '2px', background: '#ff6b35', margin: '10px auto 14px' }}></div>
                        <p style={{ color: '#777', fontSize: '12.5px', lineHeight: 1.7 }}>We understand that travel is not just about destinations. Destinations, it is about the journeys and the experiences</p>
                    </div>

                    <div className="tours-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '15px' }}>
                        {tours.length > 0 ? tours.map((tour, idx) => (
                            <div key={idx} style={{
                                background: '#f8fafb',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 12px rgba(0,0,0,.08)',
                                position: 'relative',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                    <img src={tour.feature_image || '/images/dummy.jpg'} alt={tour.tour_title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                                    {tour.featured && (
                                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#ff6b35', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>⭐ Featured</span>
                                    )}
                                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#003d82', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{tour.country}</span>
                                    <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,.6)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{tour.duration_days} Days</span>
                                </div>
                                <div style={{ padding: '20px 25px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '10px', lineHeight: 1.3 }}>{tour.tour_title}</h3>
                                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', lineHeight: 1.5 }}>
                                        {tour.short_description ? tour.short_description.substring(0, 80) + '...' : 'Explore this amazing destination with our curated tour package.'}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
                                        <div>
                                            <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: 700 }}>Starting from</p>
                                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#ff6b35' }}>
                                                {tour.early_booking_price_text ? `${currency.symbol}${tour.early_booking_price_text}` : 'Inquire'}
                                            </span>
                                        </div>
                                        <a href={`/tours/${tour.id}`} style={{ background: '#003d82', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#002050'} onMouseLeave={(e) => e.currentTarget.style.background = '#003d82'}>View Details</a>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
                                <p>No tours available at the moment.</p>
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <a href="/tours" style={{ background: '#003d82', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>More Tours</a>
                    </div>
                </div>
            </section>

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
                                                <img
                                                    src={testimonial.client_image}
                                                    alt={testimonial.client_name}
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

            {/* Flight Booking Modal */}
            {showFlightModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">✈️ Flight Booking</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowFlightModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted mb-3">
                                    <strong>From:</strong> {fromCity} → <strong>To:</strong> {toCity} | <strong>Date:</strong> {departureDate}
                                </p>
                                <p className="text-muted small">Flight booking form will be displayed here...</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowFlightModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { heroImageService } from '@/services/heroImageService';
import { cityList, filterCities, flightInitialState } from '@/pages/frontend/service/flight/flight';

export default function Flights() {
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [tripType, setTripType] = useState(flightInitialState.tripType);
    const [showTravellerModal, setShowTravellerModal] = useState(flightInitialState.showTravellerModal);
    const [adults, setAdults] = useState(flightInitialState.adults);
    const [children, setChildren] = useState(flightInitialState.children);
    const [infants, setInfants] = useState(flightInitialState.infants);
    const [selectedClass, setSelectedClass] = useState(flightInitialState.selectedClass);
    const [fromCity, setFromCity] = useState(flightInitialState.fromCity);
    const [toCity, setToCity] = useState(flightInitialState.toCity);
    const [fromSearch, setFromSearch] = useState(flightInitialState.fromSearch);
    const [toSearch, setToSearch] = useState(flightInitialState.toSearch);
    const [showFromDropdown, setShowFromDropdown] = useState(flightInitialState.showFromDropdown);
    const [showToDropdown, setShowToDropdown] = useState(flightInitialState.showToDropdown);
    const heroAutoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        loadHeroImages();
    }, []);

    useEffect(() => {
        startHeroAutoPlay();
        return () => stopHeroAutoPlay();
    }, [heroImages]);

    const loadHeroImages = async () => {
        const images = await heroImageService.getAll(1);
        setHeroImages(images.length > 0 ? images : [heroImageService.getDefault()]);
    };

    const startHeroAutoPlay = () => {
        if (heroAutoPlayTimerRef.current) clearInterval(heroAutoPlayTimerRef.current);
        if (heroImages.length > 1) {
            heroAutoPlayTimerRef.current = setInterval(() => {
                setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
            }, 8000);
        }
    };

    const stopHeroAutoPlay = () => {
        if (heroAutoPlayTimerRef.current) clearInterval(heroAutoPlayTimerRef.current);
    };

    return (
        <>
            <Head title="Flights - CloudTravel">
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
                    .hero-buttons a, .hero-buttons button {
                        padding: 8px 16px !important;
                        font-size: 11px !important;
                    }
                    input, textarea {
                        font-size: 16px !important;
                    }
                }
            `}</style>

            {/* HERO SECTION */}
            {heroImages.length > 0 && (
            <div className="hero-section" style={{ position: 'relative', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', backgroundImage: `url(${heroImages[currentHeroIndex]?.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out', marginBottom: '50px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: 700, color: '#fff', marginBottom: '10px', textShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                        Book Your Flight
                    </h1>
                    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7 }}>
                        Find the best flight deals to your dream destination.
                    </p>
                    <div className="hero-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
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

            {/* FLIGHT SEARCH FORM */}
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
                            <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                        </div>
                        {tripType === 'roundtrip' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 700 }}>Return</label>
                                <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }} />
                            </div>
                        )}
                        <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', height: '38px', whiteSpace: 'nowrap' }}>Search →</button>
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
        </>
    );
}

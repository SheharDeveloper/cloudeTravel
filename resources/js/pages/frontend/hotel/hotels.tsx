import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { heroImageService } from '@/services/heroImageService';

export default function Hotels() {
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [city, setCity] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(1);
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

    const handleSearch = () => {
        if (!city || !checkInDate || !checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        router.post('/search/hotel', {
            city,
            checkInDate,
            checkOutDate,
            rooms,
            guests,
        });
    };

    return (
        <>
            <Head title="Hotels - CloudTravel">
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
                        Find Your Perfect Hotel
                    </h1>
                    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7 }}>
                        Book luxury hotels and resorts worldwide at the best prices.
                    </p>
                    <div className="hero-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/flights" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.7)', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase', textDecoration: 'none' }}>
                            <i className="fa fa-plane"></i> FLIGHT
                        </Link>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-bed"></i> HOTEL
                        </button>
                        <Link href="/visas" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.7)', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase', textDecoration: 'none' }}>
                            <i className="fa fa-passport"></i> VISA
                        </Link>
                    </div>
                </div>
            </div>
            )}

            {/* HOTEL SEARCH FORM */}
            <div style={{ padding: '0 20px', position: 'relative', zIndex: 10, marginTop: '-80px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,.15)' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0499ff', marginBottom: '20px', margin: '0 0 20px 0' }}>ðŸ¨ Hotel Search</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>City/Hotel</label>
                            <input
                                type="text"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>Check-in</label>
                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>Check-out</label>
                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', color: '#999', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>Rooms</label>
                            <input
                                type="number"
                                min="1"
                                value={rooms}
                                onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                                style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', height: '36px' }}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}


import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { heroImageService } from '@/services/heroImageService';

export default function Visas() {
    const [heroImages, setHeroImages] = useState<any[]>([]);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const [passportCountry, setPassportCountry] = useState('');
    const [destination, setDestination] = useState('');
    const [travelDate, setTravelDate] = useState('');
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
        if (!passportCountry || !destination || !travelDate) {
            alert('Please fill in all required fields');
            return;
        }

        router.post('/search/visa', {
            passportCountry,
            destination,
            travelDate,
        });
    };

    return (
        <>
            <Head title="Visas - CloudTravel">
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
                        Get Your Visa Approved
                    </h1>
                    <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7 }}>
                        Fast and hassle-free visa processing for your dream destination.
                    </p>
                    <div className="hero-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/flights" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.7)', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase', textDecoration: 'none' }}>
                            <i className="fa fa-plane"></i> FLIGHT
                        </Link>
                        <Link href="/hotels" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.7)', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase', textDecoration: 'none' }}>
                            <i className="fa fa-bed"></i> HOTEL
                        </Link>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-passport"></i> VISA
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* VISA SEARCH FORM */}
            <div style={{ padding: '0 20px', position: 'relative', zIndex: 10, marginTop: '-80px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,.15)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>Passport Country</label>
                            <input
                                type="text"
                                placeholder="India"
                                value={passportCountry}
                                onChange={(e) => setPassportCountry(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>Destination</label>
                            <input
                                type="text"
                                placeholder="Select country"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>Travel Date</label>
                            <input
                                type="date"
                                value={travelDate}
                                onChange={(e) => setTravelDate(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                            Get Quote
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

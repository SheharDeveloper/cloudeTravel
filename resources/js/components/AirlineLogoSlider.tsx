import { useState, useEffect } from 'react';
import { airlineService } from '@/services/airlineService';

interface Airline {
    id: string | number;
    name: string;
    iata?: string;
    icao?: string;
    country?: string;
}

export default function AirlineLogoSlider() {
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAirlines();
    }, []);

    const fetchAirlines = async () => {
        try {
            setLoading(true);
            const data = await airlineService.getAirlines(20, 0);
            // Filter airlines with valid IATA code
            const airlinesWithIata = data.filter((airline: any) => airline.iata);
            setAirlines(airlinesWithIata.length > 0 ? airlinesWithIata : getDefaultAirlines());
        } catch (error) {
            console.error('Error fetching airlines:', error);
            setAirlines(getDefaultAirlines());
        } finally {
            setLoading(false);
        }
    };

    const getDefaultAirlines = () => [
        { id: 1, name: 'Air India', logo: '🇮🇳' },
        { id: 2, name: 'Emirates', logo: '🇦🇪' },
        { id: 3, name: 'Qatar Airways', logo: '🇶🇦' },
        { id: 4, name: 'Lufthansa', logo: '🇩🇪' },
        { id: 5, name: 'British Airways', logo: '🇬🇧' },
        { id: 6, name: 'Turkish Airlines', logo: '🇹🇷' },
        { id: 7, name: 'Singapore Airlines', logo: '🇸🇬' },
        { id: 8, name: 'Thai Airways', logo: '🇹🇭' },
    ];

    useEffect(() => {
        if (airlines.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % airlines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [airlines.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + airlines.length) % airlines.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % airlines.length);
    };

    const getVisibleAirlines = () => {
        const visible = [];
        for (let i = 0; i < 6; i++) {
            visible.push(airlines[(currentIndex + i) % airlines.length]);
        }
        return visible;
    };

    if (loading) {
        return (
            <section style={{ padding: '50px 40px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px' }}>✈️ Partner Airlines</h3>
                    <p style={{ color: '#999' }}>Loading airlines...</p>
                </div>
            </section>
        );
    }

    return (
        <section style={{ padding: '50px 40px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px', textAlign: 'center' }}>✈️ Partner Airlines</h3>

                {airlines && airlines.length > 0 ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Left Arrow */}
                    <button
                        className="airline-slider-nav-btn"
                        onClick={handlePrev}
                        style={{
                            background: '#0066cc',
                            color: '#fff',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            fontSize: '18px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#0052a3';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#0066cc';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ‹
                    </button>

                    {/* Airlines Grid (6 in a row) */}
                    <div className="airline-slider-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', flex: 1 }}>
                        {getVisibleAirlines().filter((airline) => airline && airline.iata).map((airline, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '16px',
                                    background: '#f5f5f5',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#eee';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f5f5f5';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '20px',
                                    fontWeight: 700
                                }}>
                                    {airline.iata}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#333', margin: '8px 0 0 0', lineHeight: 1.2 }}>
                                        {airline.name}
                                    </p>
                                    <p style={{ fontSize: '10px', color: '#999', margin: '2px 0 0 0' }}>
                                        {airline.country}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        className="airline-slider-nav-btn"
                        onClick={handleNext}
                        style={{
                            background: '#0066cc',
                            color: '#fff',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            fontSize: '18px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#0052a3';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#0066cc';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ›
                    </button>
                </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#999', fontSize: '14px' }}>No airlines available</p>
                    </div>
                )}
            </div>
        </section>
    );
}

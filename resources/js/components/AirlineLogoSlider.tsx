import { useState, useEffect } from 'react';

const airlines = [
    { name: 'Air India', logo: '🇮🇳' },
    { name: 'Emirates', logo: '🇦🇪' },
    { name: 'Qatar Airways', logo: '🇶🇦' },
    { name: 'Lufthansa', logo: '🇩🇪' },
    { name: 'British Airways', logo: '🇬🇧' },
    { name: 'Turkish Airlines', logo: '🇹🇷' },
    { name: 'Singapore Airlines', logo: '🇸🇬' },
    { name: 'Thai Airways', logo: '🇹🇭' },
];

export default function AirlineLogoSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % airlines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

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

    return (
        <section style={{ padding: '50px 40px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px', textAlign: 'center' }}>✈️ Partner Airlines</h3>

                {/* Slider with 6 Airlines */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Left Arrow */}
                    <button
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', flex: 1 }}>
                        {getVisibleAirlines().map((airline, idx) => (
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
                                <div style={{ fontSize: '48px', lineHeight: 1 }}>{airline.logo}</div>
                                <p style={{ fontSize: '11px', fontWeight: 600, color: '#666', margin: 0, textAlign: 'center', lineHeight: 1.2 }}>
                                    {airline.name}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
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
            </div>
        </section>
    );
}

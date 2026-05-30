import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// ── Countdown Hook ────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
    const calc = () => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function CountBlock({ value, label }: { value: number; label: string }) {
    return (
        <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div
                style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 16,
                    padding: '18px 22px',
                    marginBottom: 8,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(240,147,251,0.1))',
                    }}
                />
                <span
                    style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        color: '#fff',
                        lineHeight: 1,
                        display: 'block',
                        position: 'relative',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {label}
            </span>
        </div>
    );
}

// ── Service Card ──────────────────────────────────────────────────────────────
interface ServiceCardProps {
    icon: string;
    title: string;
    description: string;
    gradient: string;
    glowColor: string;
    features: string[];
    delay: number;
    badge?: string;
}

function ServiceCard({ icon, title, description, gradient, glowColor, features, delay, badge }: ServiceCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#0d1117',
                border: `1px solid ${hovered ? glowColor + '60' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 24,
                padding: 32,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: hovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hovered ? `0 32px 80px ${glowColor}30, 0 0 0 1px ${glowColor}30` : '0 4px 24px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${delay}ms`,
            }}
            className="service-card-animate"
        >
            {/* Background gradient on hover */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: gradient,
                    opacity: hovered ? 0.06 : 0,
                    transition: 'opacity 0.4s ease',
                    borderRadius: 24,
                }}
            />

            {/* Glow orb */}
            <div
                style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: glowColor,
                    opacity: hovered ? 0.12 : 0.04,
                    filter: 'blur(40px)',
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                }}
            />

            {/* Badge */}
            {badge && (
                <div style={{ position: 'absolute', top: 20, right: 20 }}>
                    <span
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 20,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                    >
                        {badge}
                    </span>
                </div>
            )}

            {/* Icon */}
            <div
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: 24,
                    boxShadow: `0 8px 32px ${glowColor}40`,
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: hovered ? 'rotate(-8deg) scale(1.1)' : 'rotate(0) scale(1)',
                    position: 'relative',
                }}
            >
                {icon}
            </div>

            <h3
                style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 10,
                    position: 'relative',
                }}
            >
                {title}
            </h3>
            <p
                style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.7,
                    marginBottom: 24,
                    position: 'relative',
                }}
            >
                {description}
            </p>

            {/* Features list */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative' }}>
                {features.map((f) => (
                    <li
                        key={f}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            marginBottom: 10,
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.6)',
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: glowColor,
                                flexShrink: 0,
                                boxShadow: `0 0 8px ${glowColor}`,
                            }}
                        />
                        {f}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div
                style={{
                    marginTop: 28,
                    paddingTop: 24,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                }}
            >
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>Launching soon</span>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease',
                        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// ── Floating Particle ─────────────────────────────────────────────────────────
function Particle({ style }: { style: React.CSSProperties }) {
    return (
        <div
            style={{
                position: 'absolute',
                borderRadius: '50%',
                pointerEvents: 'none',
                ...style,
            }}
        />
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props as { auth: { user?: { name: string } } };
    const launchDate = new Date('2026-08-01T00:00:00');
    const time = useCountdown(launchDate);
    const [email, setEmail] = useState('');
    const [notified, setNotified] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setNotified(true);
    };

    const services: ServiceCardProps[] = [
        {
            icon: '✈️',
            title: 'Flight Booking',
            description: 'Search and book flights to destinations worldwide with real-time pricing and instant confirmation.',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            glowColor: '#667eea',
            features: ['500+ Airlines Worldwide', 'Lowest Fare Guarantee', 'Flexible Date Search', 'Multi-city Routes'],
            delay: 0,
            badge: 'Coming Soon',
        },
        {
            icon: '🏨',
            title: 'Hotel Stays',
            description: 'Discover and book luxury hotels, boutique stays, and budget accommodations all in one platform.',
            gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
            glowColor: '#f093fb',
            features: ['1M+ Properties Globally', 'Free Cancellation', 'Best Price Match', 'Exclusive Member Deals'],
            delay: 150,
            badge: 'Coming Soon',
        },
        {
            icon: '🛂',
            title: 'Visa Services',
            description: 'Hassle-free visa applications with expert guidance, document support, and real-time status tracking.',
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            glowColor: '#4facfe',
            features: ['190+ Countries Covered', 'Expert Assistance', 'Document Checklist', 'Status Tracking'],
            delay: 300,
            badge: 'Coming Soon',
        },
    ];

    return (
        <>
            <Head title="CloudTravel — Coming Soon">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900" rel="stylesheet" />
                <style>{`
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { background: #060a10 !important; }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33% { transform: translateY(-18px) rotate(2deg); }
                        66% { transform: translateY(-8px) rotate(-2deg); }
                    }
                    @keyframes pulse-glow {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(1.08); }
                    }
                    @keyframes orbit {
                        from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
                        to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
                    }
                    @keyframes fade-up {
                        from { opacity: 0; transform: translateY(40px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes slide-in-left {
                        from { opacity: 0; transform: translateX(-60px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes plane-fly {
                        0%   { transform: translateX(-120px) translateY(0px); opacity: 0; }
                        10%  { opacity: 1; }
                        90%  { opacity: 1; }
                        100% { transform: translateX(calc(100vw + 120px)) translateY(-40px); opacity: 0; }
                    }
                    @keyframes ticker {
                        from { transform: translateX(0); }
                        to   { transform: translateX(-50%); }
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }
                    @keyframes shimmer {
                        0%   { background-position: -200% center; }
                        100% { background-position: 200% center; }
                    }
                    @keyframes count-flip {
                        0%   { transform: rotateX(0deg); }
                        50%  { transform: rotateX(-90deg); }
                        100% { transform: rotateX(0deg); }
                    }
                    @keyframes grid-fade {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                    @keyframes badge-pop {
                        0%   { transform: scale(0.6); opacity: 0; }
                        70%  { transform: scale(1.1); }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes border-spin {
                        from { transform: rotate(0deg); }
                        to   { transform: rotate(360deg); }
                    }

                    .hero-title {
                        background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 40%, #667eea 70%, #f093fb 100%);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        animation: shimmer 4s linear infinite;
                    }

                    .nav-blur {
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                    }

                    .service-card-animate {
                        animation: fade-up 0.7s ease forwards;
                        opacity: 0;
                    }

                    .feature-item {
                        animation: fade-up 0.6s ease forwards;
                        opacity: 0;
                    }

                    .plane-fly {
                        animation: plane-fly 8s ease-in-out infinite;
                        animation-delay: 2s;
                    }

                    .ticker-wrap {
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .ticker-inner {
                        display: inline-flex;
                        animation: ticker 30s linear infinite;
                        gap: 0;
                    }

                    .notify-input:focus {
                        outline: none;
                        border-color: #667eea !important;
                        box-shadow: 0 0 0 3px rgba(102,126,234,0.2);
                    }
                `}</style>
            </Head>

            <div style={{ fontFamily: 'Inter, sans-serif', background: '#060a10', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>

                {/* ── Animated Plane ─────────────────────────────────────────── */}
                <div
                    className="plane-fly"
                    style={{
                        position: 'fixed',
                        top: '18%',
                        left: 0,
                        fontSize: '1.8rem',
                        zIndex: 1,
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 0 12px rgba(102,126,234,0.8))',
                    }}
                >
                    ✈️
                </div>

                {/* ── Background Grid ─────────────────────────────────────────── */}
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundImage: `
                            linear-gradient(rgba(102,126,234,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(102,126,234,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        pointerEvents: 'none',
                        zIndex: 0,
                        animation: 'grid-fade 2s ease forwards',
                        opacity: 0,
                    }}
                />

                {/* ── Ambient Orbs ────────────────────────────────────────────── */}
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                    <Particle style={{ top: '10%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)', animation: 'pulse-glow 6s ease-in-out infinite' }} />
                    <Particle style={{ top: '50%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(240,147,251,0.1) 0%, transparent 70%)', animation: 'pulse-glow 8s ease-in-out infinite', animationDelay: '2s' }} />
                    <Particle style={{ bottom: '10%', left: '30%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(79,172,254,0.1) 0%, transparent 70%)', animation: 'pulse-glow 7s ease-in-out infinite', animationDelay: '4s' }} />
                </div>

                {/* ── Navbar ───────────────────────────────────────────────────── */}
                <nav
                    className="nav-blur"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        padding: '0 48px',
                        height: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: scrolled ? 'rgba(6,10,16,0.95)' : 'rgba(6,10,16,0.6)',
                        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
                        }}>
                            ✈
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                            Cloud<span style={{ background: 'linear-gradient(135deg, #667eea, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Travel</span>
                        </span>
                    </div>

                    {/* Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {['Services', 'About', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                style={{
                                    color: 'rgba(255,255,255,0.55)',
                                    textDecoration: 'none',
                                    fontSize: '0.88rem',
                                    fontWeight: 500,
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.color = '#fff';
                                    (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                                    (e.target as HTMLElement).style.background = 'transparent';
                                }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    padding: '9px 22px',
                                    borderRadius: 10,
                                    fontSize: '0.88rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 20px rgba(102,126,234,0.35)',
                                    transition: 'transform 0.2s ease',
                                    display: 'inline-block',
                                }}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        padding: '9px 20px',
                                        borderRadius: 10,
                                        fontSize: '0.88rem',
                                        fontWeight: 500,
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        transition: 'all 0.2s ease',
                                        display: 'inline-block',
                                    }}
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            padding: '9px 22px',
                                            borderRadius: 10,
                                            fontSize: '0.88rem',
                                            fontWeight: 600,
                                            boxShadow: '0 4px 20px rgba(102,126,234,0.35)',
                                            display: 'inline-block',
                                        }}
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>

                {/* ── Hero Section ─────────────────────────────────────────────── */}
                <section
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '120px 24px 80px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {/* "Upcoming" badge */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(102,126,234,0.12)',
                            border: '1px solid rgba(102,126,234,0.35)',
                            borderRadius: 40,
                            padding: '8px 20px',
                            marginBottom: 32,
                            animation: 'badge-pop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
                        }}
                    >
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#667eea',
                            display: 'inline-block',
                            boxShadow: '0 0 12px #667eea',
                            animation: 'pulse-glow 2s ease-in-out infinite',
                        }} />
                        <span style={{ color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Upcoming — Launching August 2026
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1
                        className="hero-title"
                        style={{
                            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                            fontWeight: 900,
                            lineHeight: 1.05,
                            letterSpacing: '-0.04em',
                            maxWidth: 900,
                            marginBottom: 24,
                            animation: 'fade-up 1s ease 0.2s forwards',
                            opacity: 0,
                        }}
                    >
                        Your Journey,<br />Reimagined
                    </h1>

                    <p
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                            maxWidth: 560,
                            lineHeight: 1.75,
                            marginBottom: 56,
                            animation: 'fade-up 1s ease 0.4s forwards',
                            opacity: 0,
                        }}
                    >
                        Book flights, hotels, and visas seamlessly in one platform. We're building the future of travel — and it's almost here.
                    </p>

                    {/* Countdown Timer */}
                    <div
                        style={{
                            animation: 'fade-up 1s ease 0.6s forwards',
                            opacity: 0,
                            marginBottom: 48,
                        }}
                    >
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
                            Launching in
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <CountBlock value={time.days} label="Days" />
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '2rem', fontWeight: 300, marginBottom: 24 }}>:</span>
                            <CountBlock value={time.hours} label="Hours" />
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '2rem', fontWeight: 300, marginBottom: 24 }}>:</span>
                            <CountBlock value={time.minutes} label="Minutes" />
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '2rem', fontWeight: 300, marginBottom: 24 }}>:</span>
                            <CountBlock value={time.seconds} label="Seconds" />
                        </div>
                    </div>

                    {/* Notify Me Form */}
                    <div
                        style={{
                            animation: 'fade-up 1s ease 0.8s forwards',
                            opacity: 0,
                        }}
                    >
                        {notified ? (
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    background: 'rgba(52,211,153,0.12)',
                                    border: '1px solid rgba(52,211,153,0.3)',
                                    borderRadius: 50,
                                    padding: '14px 28px',
                                    color: '#6ee7b7',
                                    fontWeight: 600,
                                    animation: 'badge-pop 0.5s ease',
                                }}
                            >
                                <span>✓</span> You're on the list! We'll notify you at launch.
                            </div>
                        ) : (
                            <form onSubmit={handleNotify} style={{ display: 'flex', gap: 0, maxWidth: 440, width: '100%' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="notify-input"
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRight: 'none',
                                        borderRadius: '12px 0 0 12px',
                                        padding: '14px 20px',
                                        color: '#fff',
                                        fontSize: '0.92rem',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        border: 'none',
                                        borderRadius: '0 12px 12px 0',
                                        padding: '14px 24px',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.92rem',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        boxShadow: '0 4px 24px rgba(102,126,234,0.4)',
                                        transition: 'opacity 0.2s ease',
                                    }}
                                >
                                    Notify Me
                                </button>
                            </form>
                        )}
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: 12 }}>
                            No spam, ever. Unsubscribe anytime.
                        </p>
                    </div>
                </section>

                {/* ── Ticker ───────────────────────────────────────────────────── */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(240,147,251,0.1))',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        padding: '14px 0',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden',
                    }}
                    className="ticker-wrap"
                >
                    <div className="ticker-inner">
                        {[...Array(2)].map((_, i) => (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                                {['✈️ FLIGHTS', '🏨 HOTELS', '🛂 VISA SERVICES', '🚕 CAB BOOKING', '🌍 190+ COUNTRIES', '⭐ 5-STAR HOTELS', '💺 BUSINESS CLASS'].map((item) => (
                                    <span
                                        key={item}
                                        style={{
                                            color: 'rgba(255,255,255,0.45)',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.1em',
                                            padding: '0 32px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {item}
                                        <span style={{ color: 'rgba(102,126,234,0.6)', marginLeft: 32 }}>•</span>
                                    </span>
                                ))}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Services Section ─────────────────────────────────────────── */}
                <section style={{ padding: '100px 48px', position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'rgba(240,147,251,0.1)',
                                border: '1px solid rgba(240,147,251,0.25)',
                                borderRadius: 40,
                                padding: '6px 18px',
                                marginBottom: 20,
                            }}
                        >
                            <span style={{ color: '#f0abfc', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Our Services
                            </span>
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                marginBottom: 16,
                                animation: 'fade-up 0.8s ease forwards',
                            }}
                        >
                            Everything you need to{' '}
                            <span style={{ background: 'linear-gradient(135deg, #667eea, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                explore the world
                            </span>
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
                            Three powerful services, one seamless platform — designed for modern travellers.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                        {services.map((s) => (
                            <ServiceCard key={s.title} {...s} />
                        ))}
                    </div>
                </section>

                {/* ── Features Section ─────────────────────────────────────────── */}
                <section
                    style={{
                        padding: '80px 48px',
                        maxWidth: 1100,
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 32,
                            padding: '64px',
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <h2
                                style={{
                                    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    marginBottom: 12,
                                }}
                            >
                                Why choose{' '}
                                <span style={{ background: 'linear-gradient(135deg, #667eea, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                    CloudTravel?
                                </span>
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>
                                Built by travellers, for travellers.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
                            {[
                                { icon: '⚡', title: 'Instant Booking', desc: 'Real-time confirmation for all flights, hotels, and visa appointments.', color: '#fbbf24' },
                                { icon: '🔒', title: 'Secure Payments', desc: '256-bit SSL encryption with trusted payment gateways worldwide.', color: '#34d399' },
                                { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any lower price you find, guaranteed — no questions asked.', color: '#60a5fa' },
                                { icon: '🌐', title: '24/7 Support', desc: 'Our travel experts are available around the clock in 15+ languages.', color: '#f093fb' },
                            ].map((f, i) => (
                                <div
                                    key={f.title}
                                    className="feature-item"
                                    style={{
                                        textAlign: 'center',
                                        animationDelay: `${i * 120}ms`,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 18,
                                            background: `${f.color}15`,
                                            border: `1px solid ${f.color}30`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.8rem',
                                            margin: '0 auto 20px',
                                        }}
                                    >
                                        {f.icon}
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, color: '#fff' }}>{f.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Destinations Section ─────────────────────────────────────── */}
                <section style={{ padding: '80px 48px', maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'rgba(79,172,254,0.1)',
                                border: '1px solid rgba(79,172,254,0.25)',
                                borderRadius: 40,
                                padding: '6px 18px',
                                marginBottom: 20,
                            }}
                        >
                            <span style={{ color: '#4facfe', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Popular Destinations
                            </span>
                        </div>
                        <h2
                            style={{
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                marginBottom: 16,
                            }}
                        >
                            Explore the{' '}
                            <span style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                World's Most Beautiful Places
                            </span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                        {[
                            { name: 'Paris, France', img: '🗼' },
                            { name: 'Tokyo, Japan', img: '🗾' },
                            { name: 'New York, USA', img: '🗽' },
                            { name: 'Dubai, UAE', img: '🏙️' },
                            { name: 'London, UK', img: '🎡' },
                            { name: 'Barcelona, Spain', img: '🏖️' },
                            { name: 'Sydney, Australia', img: '🦘' },
                            { name: 'Rome, Italy', img: '🏛️' },
                            { name: 'Bangkok, Thailand', img: '🛕' },
                            { name: 'Istanbul, Turkey', img: '🕌' },
                            { name: 'Singapore', img: '🌴' },
                            { name: 'Amsterdam, Netherlands', img: '🚲' },
                            { name: 'Vienna, Austria', img: '🎼' },
                            { name: 'Berlin, Germany', img: '🍺' },
                            { name: 'Mexico City, Mexico', img: '🌮' },
                            { name: 'Toronto, Canada', img: '🍁' },
                        ].map((dest) => (
                            <div
                                key={dest.name}
                                style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(79,172,254,0.1))',
                                    border: '1px solid rgba(79,172,254,0.2)',
                                    position: 'relative',
                                    height: 220,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    padding: 16,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(79,172,254,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ position: 'absolute', top: 16, fontSize: '3rem' }}>{dest.img}</div>
                                <h3
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#fff',
                                        textAlign: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {dest.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Stats Section ────────────────────────────────────────────── */}
                <section style={{ padding: '60px 48px 100px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                        {[
                            { value: '500+', label: 'Airlines', sub: 'Worldwide partners' },
                            { value: '1M+', label: 'Hotels', sub: 'In 190+ countries' },
                            { value: '50K+', label: 'Happy Travellers', sub: 'And growing daily' },
                            { value: '4.9★', label: 'App Rating', sub: 'On iOS & Android' },
                        ].map((s, i) => (
                            <div
                                key={s.label}
                                style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                                        fontWeight: 900,
                                        letterSpacing: '-0.04em',
                                        background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        marginBottom: 8,
                                    }}
                                >
                                    {s.value}
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4, color: 'rgba(255,255,255,0.8)' }}>{s.label}</div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Footer ───────────────────────────────────────────────────── */}
                <footer
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        padding: '32px 48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                            ✈
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>CloudTravel</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
                        © {new Date().getFullYear()} CloudTravel. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Privacy', 'Terms', 'Contact'].map((l) => (
                            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.3)'}
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                </footer>

            </div>
        </>
    );
}

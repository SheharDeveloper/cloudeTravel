import { Link } from '@inertiajs/react';
import { Plane } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <>
            <style>{`
                /* ── Left panel — sky animations ── */
                @keyframes flyPlane {
                    0%   { left: -90px; top: 55%; opacity: 0; }
                    8%   { opacity: 1; }
                    25%  { top: 48%; }
                    50%  { top: 42%; }
                    75%  { top: 37%; }
                    92%  { opacity: 1; }
                    100% { left: calc(100% + 90px); top: 33%; opacity: 0; }
                }
                @keyframes cloud1 {
                    0%   { left: -230px; opacity: 0; }
                    6%   { opacity: 0.65; }
                    94%  { opacity: 0.65; }
                    100% { left: calc(100% + 230px); opacity: 0; }
                }
                @keyframes cloud2 {
                    0%   { left: -175px; opacity: 0; }
                    6%   { opacity: 0.48; }
                    94%  { opacity: 0.48; }
                    100% { left: calc(100% + 175px); opacity: 0; }
                }
                @keyframes cloud3 {
                    0%   { left: -200px; opacity: 0; }
                    6%   { opacity: 0.38; }
                    94%  { opacity: 0.38; }
                    100% { left: calc(100% + 200px); opacity: 0; }
                }
                @keyframes contrailPulse {
                    0%, 100% { opacity: 0.9; }
                    50%      { opacity: 0.3; }
                }
                @keyframes planeGlow {
                    0%, 100% { filter: drop-shadow(0 2px 10px rgba(255,255,255,0.4)); }
                    50%      { filter: drop-shadow(0 2px 18px rgba(255,255,255,0.8)); }
                }

                /* ── Right panel — form animations ── */
                @keyframes floatUp {
                    0%   { transform: translateY(0)       scale(1);   opacity: 0; }
                    10%  { opacity: 0.45; }
                    90%  { opacity: 0.45; }
                    100% { transform: translateY(-100vh)  scale(0.7); opacity: 0; }
                }
                @keyframes ringPulse {
                    0%, 100% { transform: scale(1);    opacity: 0.2; }
                    50%      { transform: scale(1.06); opacity: 0.34; }
                }
                @keyframes formFadeIn {
                    from { transform: translateY(28px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
                @keyframes gradientBar {
                    0%   { background-position: 0%   50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0%   50%; }
                }
            `}</style>

            <div className="container-fluid p-0" style={{ minHeight: '100vh' }}>
                <div className="row g-0" style={{ minHeight: '100vh' }}>

                    {/* ══ Left panel — image + sky animations ══ */}
                    <div className="col-lg-6 d-none d-lg-block position-relative overflow-hidden">

                        {/* Background photo */}
                        <img
                            src="https://cloudtravels.co.uk/tenancy/public/assets/images/loginBanner.jpg"
                            alt="Cloud Travels"
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {/* Dark gradient overlay */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)',
                        }} />

                        {/* Sky animation layer */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 3, overflow: 'hidden', pointerEvents: 'none',
                        }}>
                            {/* Cloud 1 */}
                            <div style={{ position: 'absolute', top: '18%', animation: 'cloud1 32s linear infinite' }}>
                                <svg viewBox="0 0 220 90" width="220" height="90" aria-hidden="true">
                                    <ellipse cx="110" cy="65" rx="100" ry="27" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="78"  cy="50" rx="55"  ry="38" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="143" cy="48" rx="46"  ry="33" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="110" cy="36" rx="38"  ry="30" fill="rgba(255,255,255,0.88)" />
                                </svg>
                            </div>
                            {/* Cloud 2 */}
                            <div style={{ position: 'absolute', top: '9%', animation: 'cloud2 21s linear infinite', animationDelay: '-13s' }}>
                                <svg viewBox="0 0 140 58" width="140" height="58" aria-hidden="true">
                                    <ellipse cx="70" cy="42" rx="62" ry="18" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="48" cy="30" rx="34" ry="23" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="96" cy="28" rx="28" ry="20" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="68" cy="22" rx="24" ry="18" fill="rgba(255,255,255,0.88)" />
                                </svg>
                            </div>
                            {/* Cloud 3 */}
                            <div style={{ position: 'absolute', top: '31%', animation: 'cloud3 40s linear infinite', animationDelay: '-24s' }}>
                                <svg viewBox="0 0 185 74" width="185" height="74" aria-hidden="true">
                                    <ellipse cx="92"  cy="54" rx="82" ry="22" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="65"  cy="40" rx="46" ry="30" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="124" cy="37" rx="38" ry="26" fill="rgba(255,255,255,0.88)" />
                                    <ellipse cx="92"  cy="27" rx="32" ry="24" fill="rgba(255,255,255,0.88)" />
                                </svg>
                            </div>

                            {/* Flying airplane */}
                            <div style={{
                                position: 'absolute', display: 'flex', alignItems: 'center',
                                animation: 'flyPlane 9s ease-in-out infinite', animationDelay: '0.5s',
                            }}>
                                <div style={{ width: 140, height: 3, borderRadius: 3, background: 'linear-gradient(to left, rgba(255,255,255,0.9), transparent)', animation: 'contrailPulse 2.2s ease-in-out infinite' }} />
                                <div style={{ position: 'absolute', left: 0, top: 10, width: 100, height: 2, borderRadius: 2, background: 'linear-gradient(to left, rgba(255,255,255,0.6), transparent)', animation: 'contrailPulse 2.2s ease-in-out infinite', animationDelay: '0.3s' }} />
                                <Plane size={54} color="white" strokeWidth={1.4} style={{ transform: 'rotate(-35deg)', animation: 'planeGlow 3s ease-in-out infinite' }} />
                            </div>
                        </div>

                        {/* Logo */}
                        <Link href={home()} className="position-absolute top-0 start-0 d-flex align-items-center text-white text-decoration-none p-4" style={{ zIndex: 4 }}>
                            <img src="/images/logo.png" alt="Cloud Travels" style={{ height: 40, width: 'auto', filter: 'brightness(0) invert(1)' }} />
                        </Link>

                        {/* Tagline */}
                        <div className="position-absolute bottom-0 start-0 end-0 text-white p-5" style={{ zIndex: 4 }}>
                            <h2 className="fw-bold mb-2" style={{ fontSize: '1.75rem', lineHeight: 1.3 }}>Your journey starts here</h2>
                            <p className="mb-0 small" style={{ color: 'rgba(255,255,255,0.75)' }}>Discover amazing destinations and book your perfect trip.</p>
                        </div>
                    </div>

                    {/* ══ Right panel — form + animations ══ */}
                    <div
                        className="col-lg-6 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                        style={{
                            minHeight: '100vh',
                            background: 'linear-gradient(160deg, #ffffff 0%, #eff6ff 45%, #dbeafe 100%)',
                        }}
                    >
                        {/* Decorative rings — top right */}
                        <div style={{ position: 'absolute', top: -110, right: -110, width: 380, height: 380, borderRadius: '50%', border: '2px solid rgba(96,165,250,0.22)', animation: 'ringPulse 5s ease-in-out infinite', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: -60,  right: -60,  width: 250, height: 250, borderRadius: '50%', border: '2px solid rgba(59,130,246,0.16)',  animation: 'ringPulse 5s ease-in-out infinite', animationDelay: '1s',   pointerEvents: 'none' }} />
                        {/* Decorative rings — bottom left */}
                        <div style={{ position: 'absolute', bottom: -90, left: -90, width: 320, height: 320, borderRadius: '50%', border: '2px solid rgba(147,197,253,0.22)', animation: 'ringPulse 6s ease-in-out infinite', animationDelay: '2s',   pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: -45, left: -45, width: 210, height: 210, borderRadius: '50%', border: '2px solid rgba(96,165,250,0.14)',  animation: 'ringPulse 6s ease-in-out infinite', animationDelay: '3s',   pointerEvents: 'none' }} />

                        {/* Floating color particles */}
                        <div style={{ position: 'absolute', left: '8%',  bottom: 0, width: 10, height: 10, borderRadius: '50%', background: '#93c5fd', opacity: 0, animation: 'floatUp  8s ease-in-out infinite',                  pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', left: '22%', bottom: 0, width:  6, height:  6, borderRadius: '50%', background: '#60a5fa', opacity: 0, animation: 'floatUp 11s ease-in-out infinite', animationDelay: '-3s',  pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', left: '42%', bottom: 0, width: 14, height: 14, borderRadius: '50%', background: '#bfdbfe', opacity: 0, animation: 'floatUp  9s ease-in-out infinite', animationDelay: '-5s',  pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', left: '62%', bottom: 0, width:  8, height:  8, borderRadius: '50%', background: '#7dd3fc', opacity: 0, animation: 'floatUp 13s ease-in-out infinite', animationDelay: '-7s',  pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', left: '80%', bottom: 0, width: 11, height: 11, borderRadius: '50%', background: '#93c5fd', opacity: 0, animation: 'floatUp 10s ease-in-out infinite', animationDelay: '-2s',  pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', left: '92%', bottom: 0, width:  7, height:  7, borderRadius: '50%', background: '#38bdf8', opacity: 0, animation: 'floatUp 14s ease-in-out infinite', animationDelay: '-9s',  pointerEvents: 'none' }} />

                        {/* Form content wrapper */}
                        <div
                            className="w-100 px-3 py-5"
                            style={{ maxWidth: 460, position: 'relative', zIndex: 2, animation: 'formFadeIn 0.65s ease-out both' }}
                        >
                            {/* Mobile logo */}
                            <div className="d-flex d-lg-none justify-content-center mb-4">
                                <Link href={home()} className="text-decoration-none">
                                    <img src="/images/logo.png" alt="Cloud Travels" style={{ height: 44, width: 'auto' }} />
                                </Link>
                            </div>

                            {/* Glassmorphism form card */}
                            <div style={{
                                background: 'rgba(255,255,255,0.80)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: 20,
                                border: '1px solid rgba(147,197,253,0.4)',
                                boxShadow: '0 8px 36px rgba(96,165,250,0.14), 0 2px 10px rgba(0,0,0,0.06)',
                                overflow: 'hidden',
                            }}>
                                {/* Animated gradient accent bar */}
                                <div style={{
                                    height: 4,
                                    background: 'linear-gradient(90deg, #3b82f6, #0ea5e9, #38bdf8, #6366f1, #0ea5e9, #3b82f6)',
                                    backgroundSize: '300% 100%',
                                    animation: 'gradientBar 4s ease infinite',
                                }} />

                                <div className="p-4 p-md-5">
                                    {/* Heading */}
                                    <div className="text-center mb-4">
                                        <h1
                                            className="fw-bold mb-1"
                                            style={{
                                                fontSize: '1.65rem',
                                                background: 'linear-gradient(135deg, #1e3a5f 0%, #0369a1 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            {title}
                                        </h1>
                                        <p className="text-muted small mb-0">{description}</p>
                                    </div>

                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

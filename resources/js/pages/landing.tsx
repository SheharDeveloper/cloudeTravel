import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Landing() {
    const [activeHeroBtn, setActiveHeroBtn] = useState('tour');

    return (
        <>
            <Head title="CloudTravel - Discover the World">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>
            <div style={{ fontFamily: "'Open Sans', sans-serif", background: '#fff', color: '#333', fontSize: '13px' }}>
            {/* TOP BAR */}
            <div style={{ background: '#0499ff', padding: '6px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px' }}>
                        <i className="fa fa-globe"></i>
                    </div>
                    <div style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px' }}>
                        <i className="fa fa-user"></i>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <a href="#" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', background: '#4267B2' }}>
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', background: '#E1306C' }}>
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', background: '#25D366' }}>
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>

            {/* NAVBAR */}
            <nav style={{ background: '#0499ff', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minWidth: '120px' }}>
                    <img src="/images/logo.png" alt="CloudTravel" style={{ width: 40, height: 40 }} />
                </Link>
                <ul style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none', margin: 0, padding: 0, flex: 1, justifyContent: 'center' }}>
                    <li><a href="#" style={{ color: '#0499ff', fontSize: '14px', fontWeight: 500, textDecoration: 'none', borderBottom: '3px solid #0499ff', paddingBottom: '5px' }}>Home</a></li>
                    <li><a href="#tours" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Tours</a></li>
                    <li><a href="#tickets" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Tickets</a></li>
                    <li style={{ position: 'relative', cursor: 'pointer' }}>
                        <a href="#visa" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Visa Services <i className="fa fa-chevron-down" style={{ fontSize: '10px' }}></i>
                        </a>
                    </li>
                    <li style={{ position: 'relative', cursor: 'pointer' }}>
                        <a href="#other" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Other Services <i className="fa fa-chevron-down" style={{ fontSize: '10px' }}></i>
                        </a>
                    </li>
                    <li><a href="#about" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>About Us</a></li>
                    <li><a href="#contact" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Contact Us</a></li>
                </ul>
                <a href="tel:" style={{ background: '#ff6b35', color: '#fff', padding: '10px 22px', borderRadius: '4px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', cursor: 'pointer' }}>CALL NOW</a>
            </nav>

            {/* HERO */}
            <div style={{ position: 'relative', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: 700, color: '#fff', marginBottom: '10px', textShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                        Discover the World with CloudTravel
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7 }}>
                        Book flights, hotels, and visas seamlessly in one platform.<br />Your journey starts here.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setActiveHeroBtn('tour')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeHeroBtn === 'tour' ? '#00d4ff' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeHeroBtn === 'tour' ? '#00d4ff' : 'rgba(255,255,255,.7)'), color: activeHeroBtn === 'tour' ? '#0499ff' : '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-plane"></i> TOURS
                        </button>
                        <button onClick={() => setActiveHeroBtn('flight')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeHeroBtn === 'flight' ? '#00d4ff' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeHeroBtn === 'flight' ? '#00d4ff' : 'rgba(255,255,255,.7)'), color: activeHeroBtn === 'flight' ? '#0499ff' : '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-plane"></i> FLIGHTS
                        </button>
                        <button onClick={() => setActiveHeroBtn('hotel')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeHeroBtn === 'hotel' ? '#00d4ff' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeHeroBtn === 'hotel' ? '#00d4ff' : 'rgba(255,255,255,.7)'), color: activeHeroBtn === 'hotel' ? '#0499ff' : '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-hotel"></i> HOTELS
                        </button>
                        <button onClick={() => setActiveHeroBtn('visa')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeHeroBtn === 'visa' ? '#00d4ff' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeHeroBtn === 'visa' ? '#00d4ff' : 'rgba(255,255,255,.7)'), color: activeHeroBtn === 'visa' ? '#0499ff' : '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-passport"></i> VISA
                        </button>
                    </div>
                </div>
            </div>

            {/* WhatsApp Float */}
            <a href="https://wa.me/message/W5DBNURIYOKOF1" style={{ position: 'fixed', right: '18px', bottom: '80px', width: '44px', height: '44px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', zIndex: 999, boxShadow: '0 3px 12px rgba(0,0,0,.25)', textDecoration: 'none' }}>
                <i className="fab fa-whatsapp"></i>
            </a>

            {/* SPECIAL OFFER */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '10px 0', textAlign: 'center', fontSize: '11.5px', color: '#555' }}>
                <div style={{ display: 'inline-block', color: '#00d4ff', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #00d4ff', marginBottom: '4px' }}>Special Offer</div>
                <br />
                â˜… Special fares with <strong>ETIHAD AIRWAYS</strong> from LONDON to destinations worldwide from <span style={{ color: '#c0392b', fontWeight: 700 }}>Â£495.00</span> <span style={{ color: '#00d4ff', fontWeight: 700 }}>â†’</span>
            </div>

            {/* TOURS SECTION */}
            <section id="tours" style={{ padding: '50px 0 40px', background: '#fff' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#0499ff', marginBottom: '8px' }}>Popular Tours</h2>
                        <div style={{ width: '40px', height: '2px', background: '#00d4ff', margin: '10px auto 14px' }}></div>
                        <p style={{ color: '#777', fontSize: '12.5px', lineHeight: 1.7 }}>Explore the world's most beautiful destinations with our curated tour packages.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                        {[
                            { title: 'Europe Grand Tour', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=70' },
                            { title: 'Asia Adventure', img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=70' },
                            { title: 'Caribbean Paradise', img: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=600&q=70' },
                        ].map((tour, i) => (
                            <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: '4px', overflow: 'hidden', background: '#fff', transition: 'box-shadow .2s' }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(0,0,0,.12)'} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                                <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                                    <img src={tour.img} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }} onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'scale(1.06)'} onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'} />
                                    <span style={{ position: 'absolute', top: 0, left: 0, background: '#00d4ff', color: '#0499ff', fontSize: '9px', fontWeight: 700, padding: '4px 10px', borderRadius: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '.5px' }}>FEATURED</span>
                                </div>
                                <div style={{ padding: '12px 14px 14px' }}>
                                    <h3 style={{ fontSize: '12.5px', fontWeight: 700, color: '#0499ff', marginBottom: '2px', lineHeight: 1.4 }}>{tour.title}</h3>
                                    <div style={{ color: '#00d4ff', fontSize: '11px', fontWeight: 600, marginBottom: '10px' }}>7-14 Days</div>
                                    <a href="#" style={{ display: 'inline-block', border: '1px solid #0499ff', color: '#0499ff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '2px', letterSpacing: '.5px', textTransform: 'uppercase', transition: 'all .2s', textDecoration: 'none' }} onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#0499ff'; (e.target as HTMLElement).style.color = '#fff'; }} onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#0499ff'; }}>View Details</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <a href="#" style={{ display: 'inline-block', background: '#0499ff', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '9px 26px', borderRadius: '3px', letterSpacing: '.5px', cursor: 'pointer', transition: 'background .2s', textDecoration: 'none' }} onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#00d4ff'} onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#0499ff'}>More Tours</a>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" style={{ background: '#f9f9f9', padding: '50px 0' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#0499ff', marginBottom: '8px' }}>Our Services</h2>
                        <div style={{ width: '40px', height: '2px', background: '#00d4ff', margin: '10px auto 14px' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {[
                            { icon: 'âœˆï¸', title: 'Flight Booking', desc: 'Book flights worldwide' },
                            { icon: 'ðŸ¨', title: 'Hotel Stays', desc: 'Find perfect accommodations' },
                            { icon: 'ðŸ›‚', title: 'Visa Services', desc: 'Hassle-free visa processing' },
                            { icon: 'ðŸŽ«', title: 'Tour Packages', desc: 'Curated tour experiences' },
                        ].map((service, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{service.icon}</div>
                                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0499ff', marginBottom: '5px' }}>{service.title}</h3>
                                <p style={{ fontSize: '11px', color: '#777' }}>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <section style={{ background: '#fff', padding: '50px 0' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#0499ff', marginBottom: '8px' }}>Our Gallery</h2>
                        <div style={{ width: '40px', height: '2px', background: '#00d4ff', margin: '10px auto 14px' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '22px' }}>
                        {[
                            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70',
                            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=70',
                            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=70',
                        ].map((img, i) => (
                            <div key={i} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', height: '180px', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }} onMouseEnter={(e) => { const img = e.currentTarget.querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1.07)'; }} onMouseLeave={(e) => { const img = e.currentTarget.querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1)'; }}>
                                <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <a href="#" style={{ display: 'inline-block', background: '#0499ff', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '8px 24px', borderRadius: '3px', cursor: 'pointer', transition: 'background .2s', textDecoration: 'none' }} onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#00d4ff'} onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#0499ff'}>Explore More</a>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#0499ff', color: '#fff', padding: '40px 0 0' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <img src="/images/logo.png" alt="CloudTravel" style={{ width: 38, height: 38 }} />
                            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>CloudTravel</div>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 1.7, marginBottom: '12px' }}>
                            Your trusted platform for flights, hotels, tours, and visa services. Book your next adventure today.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Quick Links</h4>
                        <a href="#" style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 2, display: 'block', textDecoration: 'none' }}>Home</a>
                        <a href="#tours" style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 2, display: 'block', textDecoration: 'none' }}>Tours</a>
                        <a href="#services" style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 2, display: 'block', textDecoration: 'none' }}>Services</a>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Services</h4>
                        <a href="#" style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 2, display: 'block', textDecoration: 'none' }}>Flight Booking</a>
                        <a href="#" style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 2, display: 'block', textDecoration: 'none' }}>Hotel Booking</a>
                        <a href="#" style={{ fontSize: '11.5px', color: '#8a9bbd', lineHeight: 2, display: 'block', textDecoration: 'none' }}>Visa Services</a>
                    </div>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <a href="#" style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#4267B2', textDecoration: 'none' }}>
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#E1306C', textDecoration: 'none' }}>
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#25D366', textDecoration: 'none' }}>
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div style={{ background: '#0499ff', padding: '13px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: '#fff', margin: 0 }}>
                        Â© {new Date().getFullYear()} CloudTravel. All rights reserved.
                    </p>
                </div>
            </footer>
            </div>
        </>
    );
}


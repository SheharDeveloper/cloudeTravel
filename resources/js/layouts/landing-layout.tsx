import { Link, Head } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';
import { contactInfoService } from '@/services/contactInfoService';

interface Props {
    children: ReactNode;
}

/**
 * Landing layout with header, footer and content area
 */
export default function LandingLayout({ children }: Props) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState<any>(null);

    useEffect(() => {
        loadContactInfo();
    }, []);

    const loadContactInfo = async () => {
        const data = await contactInfoService.get();
        setContactInfo(data);
    };

    const visaServices = [
        'Schengen Visa',
        'India Visa',
        'USA ESTA',
        'Canada ETA',
        'Sri Lanka Visa',
        'Turkey Visa',
        'Dubai Visa',
        'Egypt Visa',
        'Thailand Visa',
    ];

    const otherServices = [
        'New Indian Passport',
        'Passport Renewal',
        'Indian Passport Surrender',
        'New OCI',
        'OCI Update',
        'PAN Card service',
    ];
    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>
            <div style={{ fontFamily: "'Open Sans', sans-serif", background: '#fff', color: '#333', fontSize: '13px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* TOP BAR */}
            <div style={{ background: '#003d82', padding: '6px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px' }}>
                        <i className="fa fa-globe"></i>
                    </div>
                    <div style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px' }}>
                        <i className="fa fa-user"></i>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', background: '#4267B2', textDecoration: 'none' }}>
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', background: '#E1306C', textDecoration: 'none' }}>
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', background: '#25D366', textDecoration: 'none' }}>
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>

            {/* NAVBAR */}
            <nav style={{ background: '#003d82', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minWidth: '120px' }}>
                    <img src="/images/logo.png" alt="CloudTravel" style={{ width: 40, height: 40 }} />
                </Link>
                <ul style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none', margin: 0, padding: 0, flex: 1, justifyContent: 'center' }}>
                    <li><Link href="/" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: 500, textDecoration: 'none', borderBottom: '3px solid #ff6b35', paddingBottom: '5px' }}>Home</Link></li>
                    <li><Link href="/tours" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Tours</Link></li>
                    <li><Link href="/tickets" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Tickets</Link></li>

                    {/* Visa Services Dropdown */}
                    <li
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setOpenDropdown('visa')}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'visa' ? null : 'visa')}
                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                        >
                            Visa Services <i className="fa fa-chevron-down" style={{ fontSize: '10px' }}></i>
                        </button>
                        {openDropdown === 'visa' && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, background: '#002d63', minWidth: '200px', borderRadius: '4px', marginTop: '5px', boxShadow: '0 4px 12px rgba(0,0,0,.15)', zIndex: 1000 }}>
                                {visaServices.map((service) => (
                                    <a
                                        key={service}
                                        href="#"
                                        style={{ display: 'block', padding: '12px 15px', color: '#fff', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,.1)', transition: 'background 0.3s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1f3a')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {service}
                                    </a>
                                ))}
                            </div>
                        )}
                    </li>

                    {/* Other Services Dropdown */}
                    <li
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setOpenDropdown('other')}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'other' ? null : 'other')}
                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
                        >
                            Other Services <i className="fa fa-chevron-down" style={{ fontSize: '10px' }}></i>
                        </button>
                        {openDropdown === 'other' && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, background: '#002d63', minWidth: '200px', borderRadius: '4px', marginTop: '5px', boxShadow: '0 4px 12px rgba(0,0,0,.15)', zIndex: 1000 }}>
                                {otherServices.map((service) => (
                                    <a
                                        key={service}
                                        href="#"
                                        style={{ display: 'block', padding: '12px 15px', color: '#fff', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,.1)', transition: 'background 0.3s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1f3a')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {service}
                                    </a>
                                ))}
                            </div>
                        )}
                    </li>

                    <li><Link href="/about-us" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>About Us</Link></li>
                    <li><Link href="/contact-us" style={{ color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Contact Us</Link></li>
                </ul>
                <a href="tel:+1234567890" style={{ background: '#ff6b35', color: '#fff', padding: '10px 22px', borderRadius: '4px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', cursor: 'pointer' }}>CALL NOW</a>
            </nav>

            {/* CONTENT */}
            <main style={{ flex: 1 }}>
                {children}
            </main>

            {/* WhatsApp Float */}
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', right: '18px', bottom: '80px', width: '44px', height: '44px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', zIndex: 999, boxShadow: '0 3px 12px rgba(0,0,0,.25)', textDecoration: 'none' }}>
                <i className="fab fa-whatsapp"></i>
            </a>

            {/* FOOTER */}
            <footer style={{ background: '#003d82', color: '#fff', padding: '40px', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Logo Section */}
                    <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                        {contactInfo?.logo && (
                            <img src={contactInfo.logo} alt="CloudTravel" style={{ width: 50, height: 50 }} />
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                        {/* About */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', color: '#ff6b35' }}>About CloudTravel</h4>
                            <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'rgba(255,255,255,.7)' }}>
                                {contactInfo?.about_text || 'CloudTravel is your one-stop platform for booking flights, hotels, tours, and visa services worldwide. We make travel planning simple, affordable, and hassle-free.'}
                            </p>
                            {/* Social Media Links */}
                            {contactInfo && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    {contactInfo.facebook_url && (
                                        <a href={contactInfo.facebook_url} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4267B2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                    )}
                                    {contactInfo.instagram_url && (
                                        <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E1306C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                    )}
                                    {contactInfo.twitter_url && (
                                        <a href={contactInfo.twitter_url} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1DA1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                    )}
                                    {contactInfo.linkedin_url && (
                                        <a href={contactInfo.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', color: '#ff6b35' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '8px' }}><a href="/tours" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>Tours</a></li>
                                <li style={{ marginBottom: '8px' }}><a href="/tickets" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>Tickets</a></li>
                                <li style={{ marginBottom: '8px' }}><a href="/visa-services" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>Visa Services</a></li>
                                <li><a href="/contact-us" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>Contact Us</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', color: '#ff6b35' }}>Contact Info</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {contactInfo?.phone && (
                                    <li style={{ marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                        <i className="fa fa-phone me-2" style={{ color: '#ff6b35', marginRight: '8px' }}></i>
                                        <a href={`tel:${contactInfo.phone}`} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>{contactInfo.phone}</a>
                                    </li>
                                )}
                                {contactInfo?.email && (
                                    <li style={{ marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                        <i className="fa fa-envelope me-2" style={{ color: '#ff6b35', marginRight: '8px' }}></i>
                                        <a href={`mailto:${contactInfo.email}`} style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>{contactInfo.email}</a>
                                    </li>
                                )}
                                {contactInfo?.location && (
                                    <li style={{ marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                        <i className="fa fa-map-marker me-2" style={{ color: '#ff6b35', marginRight: '8px' }}></i>{contactInfo.location}
                                    </li>
                                )}
                                {contactInfo?.address && (
                                    <li style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                        <i className="fa fa-building me-2" style={{ color: '#ff6b35', marginRight: '8px' }}></i>{contactInfo.address}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', margin: 0 }}>© 2026 CloudTravel. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>Privacy Policy</a>
                            <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', textDecoration: 'none' }}>Terms & Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        </>
    );
}

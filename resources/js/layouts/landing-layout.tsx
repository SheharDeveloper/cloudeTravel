import { Link, Head } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';
import { contactInfoService } from '@/services/contactInfoService';
import { logoConfig, LOGO_PATH, footerLogoConfig } from '@/config/logo';

interface Props {
    children: ReactNode;
}

const mobileResponsiveStyles = `
    @media (max-width: 768px) {
        html, body {
            width: 100%;
            overflow-x: hidden;
        }

        .landing-navbar {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 0 16px !important;
            height: 70px !important;
            min-height: 70px !important;
            flex-wrap: nowrap !important;
        }

        .navbar-logo {
            display: flex !important;
            align-items: center !important;
            min-width: auto !important;
            flex-shrink: 0 !important;
            margin-right: auto !important;
        }

        .navbar-logo img {
            width: 45px !important;
            height: 45px !important;
            object-fit: contain !important;
        }

        .navbar-menu {
            display: none !important;
        }

        .navbar-cta {
            display: none !important;
        }

        .navbar-hamburger {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 44px !important;
            height: 44px !important;
            min-width: 44px !important;
            padding: 0 !important;
            margin: 0 !important;
            margin-left: auto !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            color: #333 !important;
            font-size: 20px !important;
        }

        .mobile-menu {
            width: 100%;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .mobile-menu.open {
            max-height: 500px;
        }

        .mobile-menu ul {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px 0;
        }

        .landing-footer {
            padding: 30px 15px !important;
        }

        .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
        }

        .footer-bottom {
            flex-direction: column !important;
            gap: 15px !important;
            text-align: center !important;
        }

        .landing-footer {
            padding: 20px !important;
        }

        .landing-footer h4 {
            font-size: 12px !important;
            margin-bottom: 10px !important;
        }

        .landing-footer p,
        .landing-footer li,
        .landing-footer a {
            font-size: 11px !important;
        }

        .landing-footer ul {
            margin: 0 !important;
            padding: 0 !important;
        }

        .landing-footer img {
            width: 50px !important;
            height: 50px !important;
        }
    }

    @media (min-width: 769px) {
        .navbar-hamburger {
            display: none !important;
        }

        .mobile-menu {
            display: none !important;
        }

        .landing-footer h4 {
            font-size: 12px !important;
        }

        .landing-footer p,
        .landing-footer li,
        .landing-footer a {
            font-size: 11px !important;
        }
    }
`;


/**
 * Landing layout with header, footer and content area
 */
export default function LandingLayout({ children }: Props) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [contactInfo, setContactInfo] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        loadContactInfo();

        // Detect mobile screen size
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
            <style>{mobileResponsiveStyles}</style>
            <div style={{ fontFamily: "'Open Sans', sans-serif", background: '#fff', color: '#333', fontSize: '13px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* NAVBAR */}
            <nav className="landing-navbar" style={{ background: '#FFFFFF', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', borderBottom: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
                <Link className="navbar-logo" href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', minWidth: isMobile ? '60px' : '120px' }}>
                    <img src={LOGO_PATH} alt={logoConfig.alt} style={{ width: isMobile ? 45 : 150, height: isMobile ? 45 : 150, objectFit: 'contain' }} />
                </Link>

                {/* Hamburger Button */}
                <button
                    className="navbar-hamburger"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ background: 'none', border: 'none', color: '#333', fontSize: '20px', cursor: 'pointer', padding: '8px', marginLeft: 'auto' }}
                >
                    <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                <ul className="navbar-menu" style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none', margin: 0, padding: 0, flex: 1, justifyContent: 'center' }}>
                    <li><Link href="/" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: 600, textDecoration: 'none', borderBottom: '3px solid #ff6b35', paddingBottom: '5px' }}>Home</Link></li>

                    {/* Visa Services Dropdown */}
                    <li
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setOpenDropdown('visa')}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'visa' ? null : 'visa')}
                            style={{ background: 'none', border: 'none', color: '#333', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0, transition: 'color 0.3s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                        >
                            Visa Services <i className="fa fa-chevron-down" style={{ fontSize: '10px' }}></i>
                        </button>
                        {openDropdown === 'visa' && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', minWidth: '200px', borderRadius: '6px', marginTop: '8px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 1000, border: '1px solid #f0f0f0' }}>
                                {visaServices.map((service) => (
                                    <a
                                        key={service}
                                        href="#"
                                        style={{ display: 'block', padding: '12px 15px', color: '#333', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.3s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
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
                            style={{ background: 'none', border: 'none', color: '#333', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0, transition: 'color 0.3s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                        >
                            Other Services <i className="fa fa-chevron-down" style={{ fontSize: '10px' }}></i>
                        </button>
                        {openDropdown === 'other' && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', minWidth: '200px', borderRadius: '6px', marginTop: '8px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 1000, border: '1px solid #f0f0f0' }}>
                                {otherServices.map((service) => (
                                    <a
                                        key={service}
                                        href="#"
                                        style={{ display: 'block', padding: '12px 15px', color: '#333', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.3s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {service}
                                    </a>
                                ))}
                            </div>
                        )}
                    </li>

                    <li><Link href="/about-us" style={{ color: '#333', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'} onMouseLeave={(e) => e.currentTarget.style.color = '#333'}>About Us</Link></li>
                    <li><Link href="/contact-us" style={{ color: '#333', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'} onMouseLeave={(e) => e.currentTarget.style.color = '#333'}>Contact Us</Link></li>
                </ul>
                <a className="navbar-cta" href="tel:+1234567890" style={{ background: '#ff6b35', color: '#fff', padding: '10px 22px', borderRadius: '4px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e85a24'} onMouseLeave={(e) => e.currentTarget.style.background = '#ff6b35'}>CALL NOW</a>
            </nav>

            {/* MOBILE MENU */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', margin: 0, padding: '15px 15px', textAlign: 'center' }}>
                    <li><Link href="/" style={{ color: '#ff6b35', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Home</Link></li>
                    <li><Link href="/about-us" style={{ color: '#333', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>About Us</Link></li>
                    <li><Link href="/contact-us" style={{ color: '#333', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Contact Us</Link></li>
                    <li><a href="tel:+1234567890" style={{ background: '#ff6b35', color: '#fff', padding: '8px 15px', borderRadius: '4px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'inline-block' }}>CALL NOW</a></li>
                </ul>
            </div>

            {/* CONTENT */}
            <main style={{ flex: 1 }}>
                {children}
            </main>

            {/* WhatsApp Float */}
            <a href="https://wa.me/message/W5DBNURIYOKOF1" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', right: '18px', bottom: '80px', width: '44px', height: '44px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', zIndex: 999, boxShadow: '0 3px 12px rgba(0,0,0,.25)', textDecoration: 'none' }}>
                <i className="fab fa-whatsapp"></i>
            </a>

            {/* FOOTER */}
            <footer className="landing-footer" style={{ background: '#003d82', color: '#fff', padding: '30px', marginTop: '40px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Logo Section */}
                    <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                        <img src={LOGO_PATH} alt={footerLogoConfig.alt} style={{ width: isMobile ? 40 : 75, height: isMobile ? 40 : 75, objectFit: 'contain' }} />
                    </div>

                    <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                        {/* Contact Info - Detailed */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', color: '#ff6b35' }}>Contact Info</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '10px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                    <i className="fa fa-map-pin" style={{ color: '#ff6b35', marginRight: '8px' }}></i>
                                    <strong>Address:</strong><br />
                                    <span style={{ marginLeft: '20px', display: 'block' }}>62 King Street<br />Southall, Middlesex<br />UB2 4DB, United Kingdom</span>
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                    <i className="fa fa-phone" style={{ color: '#ff6b35', marginRight: '8px' }}></i>
                                    <strong>Telephone:</strong><br />
                                    <a href="tel:02035000000" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', marginLeft: '20px', display: 'block' }}>0203500 0000</a>
                                </li>
                                <li style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                                    <i className="fa fa-mobile" style={{ color: '#ff6b35', marginRight: '8px' }}></i>
                                    <strong>Mobile:</strong><br />
                                    <a href="tel:07944495552" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', marginLeft: '20px', display: 'block' }}>07944495552</a>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', color: '#ff6b35' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '8px' }}><a href="/visa-services" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>Visa Services</a></li>
                                <li style={{ marginBottom: '8px' }}><a href="/contact-us" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>Contact Us</a></li>
                                <li><a href="/about-us" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: '12px' }}>About Us</a></li>
                            </ul>
                        </div>

                        {/* Documents */}
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '15px', color: '#ff6b35' }}>Documents</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '8px', fontSize: '11px' }}>
                                    <a href="/conditions/Safari.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>
                                        <i className="fa fa-file-pdf" style={{ marginRight: '6px' }}></i>Terms & Conditions 1
                                    </a>
                                </li>
                                <li style={{ marginBottom: '8px', fontSize: '11px' }}>
                                    <a href="/conditions/Safari (1).pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>
                                        <i className="fa fa-file-pdf" style={{ marginRight: '6px' }}></i>Terms & Conditions 2
                                    </a>
                                </li>
                                <li style={{ fontSize: '11px' }}>
                                    <a href="/conditions/Safari (2).pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.7)', textDecoration: 'none' }}>
                                        <i className="fa fa-file-pdf" style={{ marginRight: '6px' }}></i>Terms & Conditions 3
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

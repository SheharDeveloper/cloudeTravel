import { Head } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Other Services page component
 */
export default function OtherServices() {
    const [activeBtn, setActiveBtn] = useState('passport');

    return (
        <>
            <Head title="Other Services - CloudTravel">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

            {/* SPECIAL OFFER */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '10px 0', textAlign: 'center', fontSize: '11.5px', color: '#555' }}>
                <div style={{ display: 'inline-block', color: '#ff6b35', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #ff6b35', marginBottom: '4px' }}>Complete Solutions</div>
                <br />
                ★ Complete travel solutions beyond flights and hotels - <strong>All in one place</strong> with <span style={{ color: '#ff6b35', fontWeight: 700 }}>Expert Support</span>
            </div>

            {/* HERO SECTION */}
            <div style={{ position: 'relative', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: 700, color: '#fff', marginBottom: '10px', textShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                        Complete Travel Solutions
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7 }}>
                        Beyond flights and hotels, we offer everything you need for perfect travel.<br />From passports to car rentals, we've got you covered.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setActiveBtn('passport')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'passport' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'passport' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-id-card"></i> Passport
                        </button>
                        <button onClick={() => setActiveBtn('car')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'car' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'car' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-car"></i> Car Rental
                        </button>
                        <button onClick={() => setActiveBtn('insurance')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'insurance' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'insurance' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-shield"></i> Insurance
                        </button>
                        <button onClick={() => setActiveBtn('guide')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'guide' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'guide' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-map"></i> Guides
                        </button>
                    </div>
                </div>
            </div>

            {/* SERVICES SECTION */}
            <section style={{ padding: '50px 40px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#003d82', marginBottom: '8px' }}>Our Services</h2>
                        <div style={{ width: '40px', height: '2px', background: '#ff6b35', margin: '10px auto 14px' }}></div>
                        <p style={{ color: '#777', fontSize: '12.5px', lineHeight: 1.7 }}>Everything you need for a complete travel experience</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                        {[
                            { icon: 'fa-id-card', title: 'New Indian Passport', desc: 'Fast processing for new passport applications' },
                            { icon: 'fa-refresh', title: 'Passport Renewal', desc: 'Quick renewal of expired passports' },
                            { icon: 'fa-check-circle', title: 'Passport Surrender', desc: 'Proper surrender procedures and documentation' },
                            { icon: 'fa-globe', title: 'New OCI', desc: 'Overseas Citizen of India registration' },
                            { icon: 'fa-sync', title: 'OCI Update', desc: 'Update your OCI status and details' },
                            { icon: 'fa-credit-card', title: 'PAN Card Service', desc: 'PAN card application and updates' },
                            { icon: 'fa-car', title: 'Car Rental', desc: 'Rent vehicles at your destination' },
                            { icon: 'fa-shield', title: 'Travel Insurance', desc: 'Comprehensive trip protection' },
                            { icon: 'fa-utensils', title: 'Dining Reservations', desc: 'Book tables at premium restaurants' },
                            { icon: 'fa-ticket', title: 'Event Tickets', desc: 'Concerts, shows, and attractions' },
                            { icon: 'fa-map-location-dot', title: 'Travel Guides', desc: 'Expert guides for best experiences' },
                            { icon: 'fa-hotel', title: 'Airport Transfers', desc: 'Convenient airport pickup & drop' },
                        ].map((service, idx) => (
                            <div key={idx} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,.1)', transition: 'transform 0.3s' }}>
                                <div style={{ fontSize: '36px', color: '#ff6b35', marginBottom: '12px' }}>
                                    <i className={`fa-solid ${service.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>{service.title}</h3>
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px', lineHeight: 1.5 }}>{service.desc}</p>
                                <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Get Started</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section style={{ background: '#f5f5f5', padding: '50px 40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#003d82', marginBottom: '8px' }}>Why Choose CloudTravel</h2>
                        <div style={{ width: '40px', height: '2px', background: '#ff6b35', margin: '10px auto 14px' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: 'fa-check', title: 'Expert Team', desc: 'Experienced professionals' },
                            { icon: 'fa-bolt', title: 'Fast Processing', desc: 'Quick turnaround times' },
                            { icon: 'fa-phone', title: '24/7 Support', desc: 'Always here to help' },
                            { icon: 'fa-lock', title: 'Secure & Safe', desc: 'Your documents are safe' },
                            { icon: 'fa-smile', title: 'Customer First', desc: 'Your satisfaction matters' },
                            { icon: 'fa-globe', title: 'Global Network', desc: 'Worldwide partnerships' },
                        ].map((reason, idx) => (
                            <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', color: '#ff6b35', marginBottom: '10px' }}>
                                    <i className={`fa-solid ${reason.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '6px' }}>{reason.title}</h3>
                                <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{reason.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section style={{ background: '#003d82', color: '#fff', padding: '50px 40px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '15px' }}>Need Help with Anything?</h2>
                    <p style={{ fontSize: '13px', marginBottom: '25px', lineHeight: 1.8 }}>Our expert team is here to assist with all your travel service needs. Contact us today and let's make your travel plans perfect.</p>
                    <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Contact Us Now</button>
                </div>
            </section>
        </>
    );
}

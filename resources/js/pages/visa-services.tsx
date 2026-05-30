import { Head } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Visa Services page component
 */
export default function VisaServices() {
    const [activeBtn, setActiveBtn] = useState('visa');

    return (
        <>
            <Head title="Visa Services - CloudTravel">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

            {/* SPECIAL OFFER */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '10px 0', textAlign: 'center', fontSize: '11.5px', color: '#555' }}>
                <div style={{ display: 'inline-block', color: '#ff6b35', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #ff6b35', marginBottom: '4px' }}>Visa Processing</div>
                <br />
                ★ Fast visa processing services for <strong>50+ Countries</strong> with <span style={{ color: '#ff6b35', fontWeight: 700 }}>Expert Assistance</span>
            </div>

            {/* HERO SECTION */}
            <div style={{ position: 'relative', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '38px', fontWeight: 700, color: '#fff', marginBottom: '10px', textShadow: '0 2px 12px rgba(0,0,0,.5)' }}>
                        Visa Services Made Simple
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.88)', fontSize: '13px', marginBottom: '28px', lineHeight: 1.7 }}>
                        Fast, reliable visa processing for all major destinations.<br />Get your visa approved in days, not weeks.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setActiveBtn('visa')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'visa' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'visa' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-passport"></i> Tourist Visa
                        </button>
                        <button onClick={() => setActiveBtn('business')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'business' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'business' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-briefcase"></i> Business Visa
                        </button>
                        <button onClick={() => setActiveBtn('student')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'student' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'student' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-graduation-cap"></i> Student Visa
                        </button>
                        <button onClick={() => setActiveBtn('work')} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: activeBtn === 'work' ? '#ff6b35' : 'rgba(255,255,255,.15)', border: '2px solid ' + (activeBtn === 'work' ? '#ff6b35' : 'rgba(255,255,255,.7)'), color: '#fff', padding: '9px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '.5px', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textTransform: 'uppercase' }}>
                            <i className="fa fa-suitcase"></i> Work Visa
                        </button>
                    </div>
                </div>
            </div>

            {/* VISA TYPES SECTION */}
            <section style={{ padding: '50px 40px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#003d82', marginBottom: '8px' }}>Popular Visa Types</h2>
                        <div style={{ width: '40px', height: '2px', background: '#ff6b35', margin: '10px auto 14px' }}></div>
                        <p style={{ color: '#777', fontSize: '12.5px', lineHeight: 1.7 }}>Fast processing for visas to your favorite destinations worldwide</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                        {[
                            { country: 'Schengen', type: 'Europe Access', days: '4-6 days', cost: '£99' },
                            { country: 'India', type: 'Tourist', days: '3-5 days', cost: '£79' },
                            { country: 'USA', type: 'ESTA', days: '5-7 days', cost: '£119' },
                            { country: 'Canada', type: 'eTA', days: '5-7 days', cost: '£99' },
                            { country: 'Sri Lanka', type: 'E-Visa', days: '2-3 days', cost: '£49' },
                            { country: 'Turkey', type: 'E-Visa', days: '2-3 days', cost: '£29' },
                            { country: 'Dubai', type: 'Tourist', days: '3-4 days', cost: '£59' },
                            { country: 'Egypt', type: 'Tourist', days: '3-5 days', cost: '£69' },
                            { country: 'Thailand', type: 'Tourist', days: '2-3 days', cost: '£39' },
                            { country: 'Japan', type: 'Tourist', days: '4-5 days', cost: '£89' },
                            { country: 'Singapore', type: 'Tourist', days: '2-3 days', cost: '£49' },
                            { country: 'Malaysia', type: 'E-Visa', days: '2-3 days', cost: '£39' },
                        ].map((visa, idx) => (
                            <div key={idx} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,.1)', transition: 'transform 0.3s' }}>
                                <div style={{ fontSize: '32px', color: '#ff6b35', marginBottom: '12px' }}>
                                    <i className="fa fa-passport"></i>
                                </div>
                                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#003d82', marginBottom: '6px' }}>{visa.country}</h3>
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>{visa.type}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '11px', color: '#999' }}>Processing: {visa.days}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#ff6b35' }}>{visa.cost}</span>
                                </div>
                                <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Apply Now</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* REQUIREMENTS SECTION */}
            <section style={{ padding: '50px 40px', background: '#f5f5f5' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#003d82', marginBottom: '8px' }}>What You Need</h2>
                        <div style={{ width: '40px', height: '2px', background: '#ff6b35', margin: '10px auto 14px' }}></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: 'fa-id-card', title: 'Valid Passport', desc: 'Minimum 6 months validity' },
                            { icon: 'fa-camera', title: 'Photo', desc: 'Recent passport-sized photo' },
                            { icon: 'fa-file', title: 'Documents', desc: 'Travel purpose documents' },
                            { icon: 'fa-money-bill', title: 'Financial Proof', desc: 'Bank statements & funds' },
                            { icon: 'fa-hotel', title: 'Accommodation', desc: 'Hotel booking confirmation' },
                            { icon: 'fa-plane-departure', title: 'Flight Booking', desc: 'Return flight tickets' },
                        ].map((req, idx) => (
                            <div key={idx} style={{ background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', color: '#ff6b35', marginBottom: '10px' }}>
                                    <i className={`fa-solid ${req.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '6px' }}>{req.title}</h3>
                                <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{req.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section style={{ background: '#003d82', color: '#fff', padding: '50px 40px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '15px' }}>Ready to Get Your Visa?</h2>
                    <p style={{ fontSize: '13px', marginBottom: '25px', lineHeight: 1.8 }}>Our expert team will guide you through the entire process. We handle all the paperwork so you can focus on your journey.</p>
                    <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Start Your Application</button>
                </div>
            </section>
        </>
    );
}

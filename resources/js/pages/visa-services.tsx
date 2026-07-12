import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { fetchAllVisas } from '@/services/visaService';

/**
 * Visa Services page component
 */
export default function VisaServices() {
    const [visas, setVisas] = useState<any[]>([]);

    useEffect(() => {
        loadVisas();
    }, []);

    const loadVisas = async () => {
        try {
            const data = await fetchAllVisas();
            setVisas(data);
        } catch (error) {
            console.error('Error loading visas:', error);
        }
    };

    return (
        <>
            <Head title="Visa Services - CloudTravel">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
            </Head>

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
                </div>
            </div>

            {/* SPECIAL OFFER - AFTER SLIDER */}
            <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '20px 0', textAlign: 'center', fontSize: '11.5px', color: '#555' }}>
                <div style={{ display: 'inline-block', color: '#000000', fontWeight: 700, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #0499ff', marginBottom: '4px', paddingBottom: '2px' }}>Visa Processing</div>
                <br />
                â˜… Fast visa processing services for <strong>50+ Countries</strong> with <span style={{ color: '#000000', fontWeight: 700 }}>Expert Assistance</span>
            </div>

            {/* VISA TYPES SECTION */}
            <section style={{ padding: '60px 40px', background: 'linear-gradient(135deg, #f8faff 0%, #fff5f9 100%)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#000000', marginBottom: '12px', fontWeight: 700 }}>Popular Visa Types</h2>
                        <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #0499ff, #06d6d6)', margin: '16px auto 20px', borderRadius: '2px' }}></div>
                        <p style={{ color: '#333333', fontSize: '14px', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>Fast processing for visas to your favorite destinations worldwide. Expert assistance at every step of your journey.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
                        {visas.length > 0 ? (
                            visas.map((visa) => (
                                <Link
                                    key={visa.uid}
                                    href={`/visa/${visa.uid}`}
                                    style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'block' }}
                                >
                                    <div
                                        style={{
                                            background: '#fff',
                                            borderRadius: '12px',
                                            padding: '28px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,.08)',
                                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                            height: '100%',
                                            borderTop: '4px solid #0499ff',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(4, 153, 255, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)';
                                        }}
                                    >
                                        <div style={{ fontSize: '40px', color: '#0499ff', marginBottom: '16px', lineHeight: 1 }}>
                                            <i className="fa fa-passport"></i>
                                        </div>
                                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#000000', marginBottom: '8px' }}>
                                            {visa.name}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#000000', fontWeight: 600, marginBottom: '12px' }}>{visa.title}</p>
                                        <div style={{ marginBottom: '20px' }}>
                                            <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                                {visa.description ? visa.description.substring(0, 75) + '...' : 'Get your visa with expert assistance'}
                                            </p>
                                        </div>
                                        <div style={{ background: 'linear-gradient(135deg, #0499ff, #06d6d6)', color: '#fff', border: 'none', padding: '11px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', width: '100%', textAlign: 'center', transition: 'all 0.3s' }}>
                                            View Details →
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                                <p style={{ color: '#999', fontSize: '14px' }}>Loading visa services...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </>
    );
}


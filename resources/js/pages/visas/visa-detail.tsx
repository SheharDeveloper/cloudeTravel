import { Head } from '@inertiajs/react';
import VisasSearchForm from '@/components/VisasSearchForm';

interface VisaData {
    id: number;
    name: string;
    title: string;
    description?: string;
    image?: string;
    status: number;
    is_featured: boolean;
}

export default function VisaDetail({ visa }: { visa: VisaData }) {
    if (!visa) {
        return (
            <>
                <Head title="Visa Not Found - CloudTravel" />
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <h1>Visa not found</h1>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${visa.name} Visa - CloudTravel`} />

            <style>{`
                * { box-sizing: border-box; }
                @media (max-width: 768px) {
                    .hero-section { min-height: 300px !important; padding: 20px !important; }
                    .hero-title { font-size: 24px !important; }
                    .hero-subtitle { font-size: 12px !important; }
                    .details-grid { grid-template-columns: 1fr !important; }
                    .search-form-wrapper { padding: 20px !important; }
                }
            `}</style>

            {/* HERO SECTION */}
            <div
                className="hero-section"
                style={{
                    position: 'relative',
                    minHeight: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                    backgroundImage: visa.image
                        ? `url(${visa.image})`
                        : `url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    marginBottom: '50px',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,20,60,.6) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.7) 100%)',
                    }}
                ></div>
                <div style={{ position: 'relative', zIndex: 2, padding: '0 20px' }}>
                    <h1
                        className="hero-title"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '38px',
                            fontWeight: 700,
                            color: '#fff',
                            marginBottom: '10px',
                            textShadow: '0 2px 12px rgba(0,0,0,.5)',
                        }}
                    >
                        {visa.name} {visa.title}
                    </h1>
                    <p
                        className="hero-subtitle"
                        style={{
                            color: 'rgba(255,255,255,.88)',
                            fontSize: '13px',
                            marginBottom: '28px',
                            lineHeight: 1.7,
                        }}
                    >
                        {visa.description || 'Get your visa approved with our expert assistance.'}
                    </p>
                </div>
            </div>

            {/* VISA DETAILS SECTION */}
            <section style={{ padding: '40px 20px', background: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '28px',
                                color: '#003d82',
                                marginBottom: '8px',
                            }}
                        >
                            About {visa.name}
                        </h2>
                        <div style={{ width: '40px', height: '2px', background: '#ff6b35', margin: '10px auto 14px' }}></div>
                        <p style={{ color: '#777', fontSize: '12.5px', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
                            {visa.description || 'Get expert assistance with your visa application. Fast processing and hassle-free support for your travel needs.'}
                        </p>
                    </div>

                    <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', marginBottom: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div style={{ padding: '15px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', color: '#ff6b35', marginBottom: '10px' }}>
                                    <i className="fa fa-clock"></i>
                                </div>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '5px' }}>Fast Processing</h4>
                                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Quick turnaround for your application</p>
                            </div>
                            <div style={{ padding: '15px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', color: '#ff6b35', marginBottom: '10px' }}>
                                    <i className="fa fa-shield"></i>
                                </div>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '5px' }}>Secure & Safe</h4>
                                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Your data is protected</p>
                            </div>
                            <div style={{ padding: '15px', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', color: '#ff6b35', marginBottom: '10px' }}>
                                    <i className="fa fa-headset"></i>
                                </div>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '5px' }}>Expert Support</h4>
                                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Dedicated support team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISA SEARCH FORM */}
            <div
                className="search-form-wrapper"
                style={{ padding: '0 20px', position: 'relative', zIndex: 10, marginTop: '40px', paddingBottom: '80px' }}
            >
                <div
                    style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                        background: '#fff',
                        padding: '40px',
                        borderRadius: '8px',
                        boxShadow: '0 8px 30px rgba(0,0,0,.15)',
                    }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#003d82', marginBottom: '20px', textAlign: 'center' }}>
                        Search & Get Quote
                    </h3>
                    <VisasSearchForm prefilledVisaType={visa.name} disableVisaType={true} />
                </div>
            </div>
        </>
    );
}

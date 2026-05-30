import { Head } from '@inertiajs/react';

/**
 * About Us page component
 */
export default function AboutUs() {
    return (
        <>
            <Head title="About Us - CloudTravel" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '20px' }}>About CloudTravel</h1>

                {/* Mission Section */}
                <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Our Mission</h2>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8, marginBottom: '10px' }}>
                        At CloudTravel, our mission is to make travel planning simple, affordable, and accessible to everyone. We believe that travel enriches lives, broadens perspectives, and creates unforgettable memories.
                    </p>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8 }}>
                        We are committed to providing our customers with the best deals, reliable service, and expert advice to ensure every journey is perfect.
                    </p>
                </div>

                {/* Why Choose Us */}
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#003d82', marginBottom: '20px' }}>Why Choose CloudTravel</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {[
                        { icon: 'fa-check-circle', title: '✓ Best Prices', desc: 'Guaranteed lowest fares and exclusive deals' },
                        { icon: 'fa-headset', title: '✓ 24/7 Support', desc: 'Round-the-clock customer service and support' },
                        { icon: 'fa-shield-halved', title: '✓ Secure Booking', desc: 'Safe and secure payment processing' },
                        { icon: 'fa-star', title: '✓ Expert Team', desc: 'Experienced travel professionals' },
                        { icon: 'fa-globe', title: '✓ Global Network', desc: 'Partners worldwide for seamless service' },
                        { icon: 'fa-clock', title: '✓ Quick Processing', desc: 'Fast and efficient booking and confirmation' },
                    ].map((item, idx) => (
                        <div key={idx} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', color: '#ff6b35', marginBottom: '10px' }}>
                                <i className={`fa-solid ${item.icon}`}></i>
                            </div>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>{item.title}</h3>
                            <p style={{ fontSize: '12px', color: '#666' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div style={{ background: '#003d82', color: '#fff', padding: '40px', borderRadius: '8px', marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '30px', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: 700, color: '#ff6b35', marginBottom: '8px' }}>50K+</div>
                            <p style={{ fontSize: '13px', marginBottom: 0 }}>Happy Customers</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: 700, color: '#ff6b35', marginBottom: '8px' }}>150+</div>
                            <p style={{ fontSize: '13px', marginBottom: 0 }}>Destinations</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: 700, color: '#ff6b35', marginBottom: '8px' }}>15+</div>
                            <p style={{ fontSize: '13px', marginBottom: 0 }}>Years Experience</p>
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: 700, color: '#ff6b35', marginBottom: '8px' }}>24/7</div>
                            <p style={{ fontSize: '13px', marginBottom: 0 }}>Customer Support</p>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#003d82', marginBottom: '20px' }}>Our Team</h2>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', lineHeight: 1.8 }}>
                    Our dedicated team of travel experts, customer service professionals, and support staff work tirelessly to ensure your travel experience is exceptional.
                </p>
            </div>
        </>
    );
}

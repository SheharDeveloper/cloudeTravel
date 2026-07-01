import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function AboutUs() {
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

    const services = [
        'Worldwide Airline Tickets',
        'Hotels and Accommodation',
        'Holiday Packages',
        'Airport Transfers',
        'Travel Insurance',
        'UK Visa and Immigration Application Assistance',
        'UK Visitor, Family and Settlement Visa Application Assistance',
        'UK Citizenship and Naturalisation Application Assistance',
        'India Visa and e-Visa Services',
        'OCI (Overseas Citizen of India) Services',
        'Passport and Travel Document Services',
        'New and Renewal Passport Services',
        'Worldwide Visa and e-Visa Services',
        'Documentation and Other Travel-Related Services',
    ];

    const handlePrevService = () => {
        setCurrentServiceIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const handleNextService = () => {
        setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    };

    const handleServiceClick = (idx: number) => {
        setCurrentServiceIndex(idx);
    };

    return (
        <>
            <Head title="About Us - CloudTravel" />

            {/* Hero Section */}
            <div style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,20,60,.5) 0%, rgba(0,20,60,.3) 60%, rgba(0,20,60,.6) 100%)',
                    zIndex: 1
                }}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '48px',
                        fontWeight: 700,
                        margin: 0,
                        textShadow: '0 2px 12px rgba(0,0,0,.5)'
                    }}>About Cloud Travel</h1>
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,.88)',
                        margin: '12px 0 0 0',
                        lineHeight: 1.6
                    }}>Your One-Stop Travel & Visa Specialist Since 2015</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

                {/* Company Info */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0499ff', marginBottom: '20px' }}>About Us</h2>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
                        Cloud Travel Limited is a UK-based company (Company Registration No. 09677123) established in 2015 and trading under the registered brand Cloud TravelÂ®. We are proud to be one of the UK's leading high street and online one-stop travel agencies, providing trusted and professional travel services to customers throughout the United Kingdom and worldwide.
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, marginBottom: '15px' }}>
                        As an ATOL and IATA accredited agency, we are committed to delivering reliable, secure, and customer-focused travel solutions.
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8 }}>
                        Since 2015, Cloud TravelÂ® has built a reputation for excellent customer service, competitive prices, and complete travel solutions. Whether you are travelling for business, leisure, or family purposes, our experienced team is dedicated to making your journey simple, convenient, and memorable.
                    </p>
                </div>

                {/* Services Slider */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0499ff', marginBottom: '30px' }}>Our Specialist Services</h2>

                    <div style={{
                        background: '#f9f9f9',
                        padding: '40px',
                        borderRadius: '8px',
                        marginBottom: '30px',
                        position: 'relative',
                        minHeight: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Left Arrow */}
                        <button
                            onClick={handlePrevService}
                            style={{
                                position: 'absolute',
                                left: '15px',
                                background: '#0499ff',
                                color: '#fff',
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                fontSize: '18px',
                                cursor: 'pointer',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#0499ff';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#0499ff';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            ‹
                        </button>

                        {/* Service Display */}
                        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#0499ff', marginBottom: '15px' }}>
                                {currentServiceIndex + 1} / {services.length}
                            </div>
                            <h3 style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#0499ff',
                                margin: '0',
                                minHeight: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ✓  {services[currentServiceIndex]}
                            </h3>
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={handleNextService}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                background: '#0499ff',
                                color: '#fff',
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                fontSize: '18px',
                                cursor: 'pointer',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#0499ff';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#0499ff';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                             ›
                        </button>
                    </div>

                    {/* Services List */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: currentServiceIndex === idx ? '#0499ff' : '#fff',
                                    color: currentServiceIndex === idx ? '#fff' : '#333',
                                    padding: '15px',
                                    borderRadius: '6px',
                                    border: currentServiceIndex === idx ? 'none' : '1px solid #ddd',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textAlign: 'center'
                                }}
                                onClick={() => handleServiceClick(idx)}
                                onMouseEnter={(e) => {
                                    if (currentServiceIndex !== idx) {
                                        e.currentTarget.style.background = '#f0f0f0';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentServiceIndex !== idx) {
                                        e.currentTarget.style.background = '#fff';
                                    }
                                }}
                            >
                                 ✓  {service}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Online Platform Section */}
                <div style={{
                    background: '#e8f4f8',
                    padding: '30px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #0499ff'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0499ff', marginBottom: '12px' }}>Convenient Online Services</h3>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.8 }}>
                        To provide greater convenience for our customers, many of our services are available through our online platform, allowing clients to access and manage their travel requirements anytime and from anywhere.
                    </p>
                </div>
            </div>
        </>
    );
}


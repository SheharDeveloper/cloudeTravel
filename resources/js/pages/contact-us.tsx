import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { contactInfoService } from '@/services/contactInfoService';
import ContactForm from '@/components/ContactForm';

/**
 * Contact Us page component
 */
export default function ContactUs() {
    const [contactInfo, setContactInfo] = useState<any>(null);

    useEffect(() => {
        loadContactInfo();
    }, []);

    const loadContactInfo = async () => {
        const data = await contactInfoService.get();
        setContactInfo(data);
    };

    return (
        <>
            <Head title="Contact Us - CloudTravel" />

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #0a2647 0%, #0499ff 100%)',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '48px',
                        fontWeight: 700,
                        margin: 0,
                        textShadow: '0 2px 12px rgba(0,0,0,.5)'
                    }}>Contact Us</h1>
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,.88)',
                        margin: '12px 0 0 0',
                        lineHeight: 1.6
                    }}>Get in touch with our team. We're here to help with any travel inquiries.</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    {/* Contact Info */}
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0499ff', marginBottom: '20px' }}>Get in Touch</h3>

                        {contactInfo?.get_in_touch_image && (
                            <img
                                src={contactInfo.get_in_touch_image}
                                alt="Get in Touch"
                                style={{ maxWidth: '160px', maxHeight: '160px', width: 'auto', height: 'auto', borderRadius: '8px', marginBottom: '30px', objectFit: 'contain', backgroundColor: '#f5f5f5', padding: '10px' }}
                            />
                        )}

                        {contactInfo?.address && (
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0499ff', marginBottom: '8px' }}>Address</h4>
                                <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                    {contactInfo.address}
                                </p>
                            </div>
                        )}

                        {contactInfo?.phone && (
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0499ff', marginBottom: '8px' }}>Phone</h4>
                                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                    <a href={`tel:${contactInfo.phone}`} style={{ textDecoration: 'none', color: '#ff6b35', fontWeight: 600 }}>{contactInfo.phone}</a>
                                </p>
                            </div>
                        )}

                        {contactInfo?.email && (
                            <div style={{ marginBottom: '25px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0499ff', marginBottom: '8px' }}>Email</h4>
                                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                    <a href={`mailto:${contactInfo.email}`} style={{ textDecoration: 'none', color: '#ff6b35', fontWeight: 600 }}>{contactInfo.email}</a>
                                </p>
                            </div>
                        )}

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0499ff', marginBottom: '12px' }}>Business Hours</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                Monday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: 10:00 AM - 4:00 PM<br />
                                Sunday: Closed
                            </p>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0499ff', marginBottom: '12px' }}>Follow Us</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {contactInfo?.facebook_url && (
                                    <a href={contactInfo.facebook_url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#4267B2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                )}
                                {contactInfo?.twitter_url && (
                                    <a href={contactInfo.twitter_url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#1DA1F2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                )}
                                {contactInfo?.instagram_url && (
                                    <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1306C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                )}
                                {contactInfo?.linkedin_url && (
                                    <a href={contactInfo.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#0077B5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                )}
                                <a href="https://wa.me/message/W5DBNURIYOKOF1" target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
                        <ContactForm />
                    </div>
                </div>
            </div>

            {/* Google Maps Section */}
            <div style={{ marginTop: '60px', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0499ff', marginBottom: '30px', textAlign: 'center' }}>Our Location</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d639319.9569119832!2d-1.829651917124168!3d51.24958301798195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760d52956b5cb9%3A0xf7c975d392a773ce!2sCloud%20Travel%C2%AE%20Southall!5e0!3m2!1sen!2sin!4v1781950847097!5m2!1sen!2sin"
                            width="100%"
                            height={450}
                            style={{ border: '0', borderRadius: '8px', maxWidth: '1000px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />
        </>
    );
}


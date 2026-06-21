import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { contactInfoService } from '@/services/contactInfoService';

/**
 * Contact Us page component
 */
export default function ContactUs() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [contactInfo, setContactInfo] = useState<any>(null);

    useEffect(() => {
        loadContactInfo();
    }, []);

    const loadContactInfo = async () => {
        const data = await contactInfoService.get();
        setContactInfo(data);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Contact Us - CloudTravel" />

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
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#003d82', marginBottom: '20px' }}>Get in Touch</h3>

                        {contactInfo?.get_in_touch_image && (
                            <img
                                src={contactInfo.get_in_touch_image}
                                alt="Get in Touch"
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '30px', objectFit: 'contain', height: 'auto', maxHeight: '300px', backgroundColor: '#f5f5f5', padding: '10px' }}
                            />
                        )}

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Address</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                62 King Street<br />
                                Southall<br />
                                Middlesex UB2 4DB<br />
                                UK
                            </p>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Phone</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                <a href="tel:07944495552" style={{ textDecoration: 'none', color: '#ff6b35', fontWeight: 600 }}>07944495552</a>
                            </p>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Email</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                <a href="mailto:info@cloudtravels.co.uk" style={{ textDecoration: 'none', color: '#ff6b35', fontWeight: 600 }}>info@cloudtravels.co.uk</a>
                            </p>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '12px' }}>Business Hours</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                Monday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: 10:00 AM - 4:00 PM<br />
                                Sunday: Closed
                            </p>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '12px' }}>Follow Us</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#4267B2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#1DA1F2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1306C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="https://wa.me/message/W5DBNURIYOKOF1" target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                    <i className="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                                placeholder="Your name"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                                placeholder="Your email"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                                placeholder="Subject"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', minHeight: '150px', fontFamily: "'Open Sans', sans-serif" }}
                                placeholder="Your message"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', width: '100%', opacity: isLoading ? 0.7 : 1 }}
                        >
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Google Maps Section */}
            <div style={{ marginTop: '60px', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#003d82', marginBottom: '30px', textAlign: 'center' }}>Our Location</h3>
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

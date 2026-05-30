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
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '20px' }}>Contact Us</h1>
                <p style={{ color: '#666', marginBottom: '40px' }}>We'd love to hear from you. Get in touch with our team for any inquiries or assistance.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    {/* Contact Info */}
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#003d82', marginBottom: '20px' }}>Get in Touch</h3>

                        {contactInfo?.get_in_touch_image && (
                            <img
                                src={contactInfo.get_in_touch_image}
                                alt="Get in Touch"
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '30px', objectFit: 'cover', height: '200px' }}
                            />
                        )}

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Address</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                123 Travel Street<br />
                                London, UK<br />
                                SW1A 1AA
                            </p>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Phone</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                <a href="tel:+442071946000" style={{ textDecoration: 'none', color: '#ff6b35', fontWeight: 600 }}>+44 (0)20 7194 6000</a>
                            </p>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#003d82', marginBottom: '8px' }}>Email</h4>
                            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                <a href="mailto:info@cloudtravel.com" style={{ textDecoration: 'none', color: '#ff6b35', fontWeight: 600 }}>info@cloudtravel.com</a>
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
                                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
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
            <Toaster position="top-right" />
        </>
    );
}

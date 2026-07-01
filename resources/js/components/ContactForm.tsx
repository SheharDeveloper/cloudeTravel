import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleContactFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setFormMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        setFormSubmitting(true);
        setFormMessage(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setFormMessage({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setFormMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
            }
        } catch (error) {
            setFormMessage({ type: 'error', text: 'An error occurred. Please try again.' });
            console.error('Error sending message:', error);
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleContactFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
                type="text"
                placeholder="Name"
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={formSubmitting}
            />
            <input
                type="email"
                placeholder="Email"
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={formSubmitting}
            />
            <input
                type="text"
                placeholder="Subject"
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                disabled={formSubmitting}
            />
            <textarea
                placeholder="Message"
                style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px',
                    minHeight: '120px',
                    fontFamily: "'Open Sans', sans-serif",
                    fontStyle: 'normal',
                }}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={formSubmitting}
            />

            {formMessage && (
                <div
                    style={{
                        padding: '12px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        backgroundColor: formMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: formMessage.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${formMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                    }}
                >
                    {formMessage.text}
                </div>
            )}

            <button
                type="submit"
                disabled={formSubmitting}
                style={{
                    background: formSubmitting ? '#ccc' : '#0499ff',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    opacity: formSubmitting ? 0.7 : 1,
                }}
            >
                {formSubmitting ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
}


import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function TestimonialSettings() {
    const [isreview, setIsreview] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            setIsreview(data.isreview);
            setLoading(false);
        } catch (err) {
            console.error('Error loading settings:', err);
            toast.error('Failed to load settings');
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        const newValue = !isreview;
        setSaving(true);

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    isreview: newValue,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update settings');
            }

            const data = await response.json();
            setIsreview(data.isreview);
            toast.success('Settings updated successfully!');
        } catch (err) {
            console.error('Error updating settings:', err);
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">Review Settings</h5>
            </div>
            <div className="card-body">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                                <div>
                                    <h6 className="mb-1">Enable Customer Reviews</h6>
                                    <p className="text-muted small mb-0">
                                        {isreview
                                            ? 'Reviews are currently enabled on the website'
                                            : 'Reviews are currently disabled on the website'}
                                    </p>
                                </div>
                                <div
                                    onClick={handleToggle}
                                    style={{
                                        display: 'inline-flex',
                                        width: '60px',
                                        height: '34px',
                                        backgroundColor: isreview ? '#28a745' : '#6c757d',
                                        borderRadius: '17px',
                                        padding: '3px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.3s',
                                        alignItems: 'center',
                                        position: 'relative',
                                        opacity: saving ? 0.6 : 1,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            backgroundColor: 'white',
                                            borderRadius: '50%',
                                            transition: 'transform 0.3s',
                                            transform: isreview ? 'translateX(26px)' : 'translateX(0)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {saving ? (
                                            <span className="spinner-border spinner-border-sm text-primary"></span>
                                        ) : (
                                            <i className={`fa ${isreview ? 'fa-check' : 'fa-times'}`}></i>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="alert alert-info mb-0">
                                    <i className="fa fa-info-circle me-2"></i>
                                    <small>
                                        When enabled, customer reviews will be displayed on the homepage.
                                        When disabled, the review section will be hidden from the website.
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Toaster position="top-right" />
        </div>
    );
}

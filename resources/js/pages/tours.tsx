import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getTours } from '@/services/tourService';

/**
 * Tours page component with API integration
 */
export default function Tours() {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState({ symbol: '£', code: 'GBP' });
    const itemsPerPage = 12;

    useEffect(() => {
        fetchTours();
    }, [currentPage, searchTerm]);

    const fetchTours = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getTours(
                currentPage,
                itemsPerPage,
                'active',
                searchTerm || undefined
            );

            if (response.success) {
                setTours(response.data.data || []);
                setTotalPages(response.data.last_page || 1);
                if (response.currency) {
                    setCurrency(response.currency);
                }
            } else {
                setError(response.message || 'Failed to load tours');
            }
        } catch (err: any) {
            setError(err.message || 'Error loading tours');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Tours - CloudTravel" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '10px' }}>Tour Packages</h1>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Explore our exclusive collection of curated tour packages to the world's most beautiful destinations.</p>

                    {/* Search Bar */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Search tours by country or city..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            style={{
                                padding: '12px 20px',
                                background: '#ff6b35',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{ background: '#fee', color: '#c33', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '14px', color: '#999' }}>Loading tours...</div>
                    </div>
                ) : tours.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                        <p>No tours found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                            {tours.map((tour) => (
                                <div key={tour.id} style={{
                                    background: '#f8fafb',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 12px rgba(0,0,0,.08)',
                                    border: '1px solid #f0f0f0',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }} onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }} onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.08)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                        <img
                                            src={tour.feature_image || '/images/dummy.jpg'}
                                            alt={tour.tour_title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        {tour.featured && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                background: '#ff6b35',
                                                color: '#fff',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                ⭐ Featured
                                            </span>
                                        )}
                                        <span style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: '#003d82',
                                            color: '#fff',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 700
                                        }}>
                                            {tour.country}
                                        </span>
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            left: '12px',
                                            background: 'rgba(0,0,0,.6)',
                                            color: '#fff',
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 700
                                        }}>
                                            {tour.duration_days} Days
                                        </span>
                                    </div>
                                    <div style={{ padding: '25px' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#003d82', marginBottom: '10px', minHeight: '40px', lineHeight: 1.3 }}>
                                            {tour.tour_title}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', lineHeight: 1.5 }}>
                                            {tour.short_description ? tour.short_description.substring(0, 80) + '...' : 'Explore this amazing destination with our curated tour package.'}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
                                            <div>
                                                <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase', fontWeight: 700 }}>Starting from</p>
                                                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ff6b35' }}>
                                                    {tour.early_booking_price_text ? `${currency.symbol}${tour.early_booking_price_text}` : 'Inquire'}
                                                </span>
                                            </div>
                                            <a
                                                href={`/tours/${tour.id}`}
                                                style={{
                                                    background: '#003d82',
                                                    color: '#fff',
                                                    padding: '10px 16px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    textDecoration: 'none',
                                                    display: 'inline-block',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#002050'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#003d82'}
                                            >
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: currentPage === 1 ? '#f0f0f0' : '#fff',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <button
                                        key={idx + 1}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            background: currentPage === idx + 1 ? '#003d82' : '#fff',
                                            color: currentPage === idx + 1 ? '#fff' : '#333',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: currentPage === idx + 1 ? 700 : 400
                                        }}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: currentPage === totalPages ? '#f0f0f0' : '#fff',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

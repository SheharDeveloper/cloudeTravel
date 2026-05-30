import { Head } from '@inertiajs/react';

/**
 * Tours page component
 */
export default function Tours() {
    return (
        <>
            <Head title="Tours - CloudTravel" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '20px' }}>Tour Packages</h1>
                <p style={{ color: '#666', marginBottom: '40px' }}>Explore our exclusive collection of curated tour packages to the world's most beautiful destinations.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} style={{ background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
                            <img src={`https://via.placeholder.com/300x200?text=Tour+${item}`} alt={`Tour ${item}`} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '10px' }}>Destination Tour {item}</h3>
                                <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', lineHeight: 1.6 }}>Experience unforgettable moments with our expertly curated tour packages.</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#ff6b35' }}>£999</span>
                                    <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Book Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

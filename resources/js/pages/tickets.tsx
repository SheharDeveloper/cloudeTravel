import { Head } from '@inertiajs/react';

/**
 * Tickets page component
 */
export default function Tickets() {
    return (
        <>
            <Head title="Flight Tickets - CloudTravel" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#0499ff', marginBottom: '20px' }}>Flight Tickets</h1>
                <p style={{ color: '#666', marginBottom: '40px' }}>Book your flights to any destination worldwide with competitive prices and excellent service.</p>

                {/* Search Section */}
                <div style={{ background: '#f0f0f0', padding: '30px', borderRadius: '8px', marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0499ff', marginBottom: '20px' }}>Search Flights</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <input type="text" placeholder="From (City)" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px' }} />
                        <input type="text" placeholder="To (City)" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px' }} />
                        <input type="date" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px' }} />
                        <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Search Flights</button>
                    </div>
                </div>

                {/* Featured Deals */}
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0499ff', marginBottom: '20px' }}>Featured Deals</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Departure</p>
                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0499ff' }}>London (LHR)</p>
                                </div>
                                <i className="fa fa-plane" style={{ fontSize: '20px', color: '#ff6b35' }}></i>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Arrival</p>
                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0499ff' }}>Dubai (DXB)</p>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#ff6b35' }}>Â£{400 + item * 50}</span>
                                    <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Book</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}


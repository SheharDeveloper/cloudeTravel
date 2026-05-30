import { Head } from '@inertiajs/react';

/**
 * Schengen Visa page component
 */
export default function SchengenVisa() {
    return (
        <>
            <Head title="Schengen Visa - CloudTravel" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#003d82', marginBottom: '20px' }}>Schengen Visa</h1>
                <p style={{ color: '#666', marginBottom: '40px' }}>Visit any of the 27 Schengen countries with our hassle-free visa application service.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Quick Facts</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', color: '#666' }}>✓ Validity: 6 months</li>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', color: '#666' }}>✓ Processing: 4-6 days</li>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', color: '#666' }}>✓ Cost: £99</li>
                            <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', color: '#666' }}>✓ Type: Short Stay</li>
                            <li style={{ padding: '8px 0', color: '#666' }}>✓ Countries: 27</li>
                        </ul>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#003d82', marginBottom: '15px' }}>Requirements</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.8 }}>
                            <li>• Valid passport (6 months validity)</li>
                            <li>• Completed visa application form</li>
                            <li>• Proof of accommodation</li>
                            <li>• Travel insurance</li>
                            <li>• Financial proof (bank statements)</li>
                            <li>• Return flight tickets</li>
                            <li>• Employment letter</li>
                        </ul>
                    </div>
                </div>

                <div style={{ background: '#f0f0f0', padding: '30px', borderRadius: '8px', marginTop: '40px', textAlign: 'center' }}>
                    <button style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Apply Now</button>
                </div>
            </div>
        </>
    );
}

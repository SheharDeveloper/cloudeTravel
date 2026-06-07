import { useState } from 'react';

export default function CarRentalForm(): React.ReactElement {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [dropoffDate, setDropoffDate] = useState('');
    const [dropoffTime, setDropoffTime] = useState('');
    const [driverAge, setDriverAge] = useState(25);

    const locations = [
        'London - Heathrow Airport',
        'London - Gatwick Airport',
        'New York - JFK Airport',
        'New York - LaGuardia',
        'Los Angeles - LAX Airport',
        'Paris - Charles de Gaulle',
        'Tokyo - Narita Airport',
        'Dubai - DXB Airport',
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Pickup Location</label>
                <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff' }}
                >
                    <option value="">Select pickup location</option>
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Drop-off Location</label>
                <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#fff' }}
                >
                    <option value="">Select drop-off location</option>
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Pickup Date & Time</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s ease' }}
                    />
                    <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        style={{ width: '100px', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s ease' }}
                    />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Drop-off Date & Time</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        min={pickupDate}
                        style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s ease' }}
                    />
                    <input
                        type="time"
                        value={dropoffTime}
                        onChange={(e) => setDropoffTime(e.target.value)}
                        style={{ width: '100px', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s ease' }}
                    />
                </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Driver Age</label>
                <input
                    type="number"
                    value={driverAge}
                    onChange={(e) => setDriverAge(parseInt(e.target.value))}
                    min="18"
                    max="100"
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s ease' }}
                />
            </div>
        </div>
    );
}

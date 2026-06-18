import { useState } from 'react';
import BookingModal from '@/components/BookingModal';

export default function AirportTransportForm(): React.ReactElement {
    const [tripType, setTripType] = useState('oneway');
    const [pickupAirport, setPickupAirport] = useState('');
    const [pickupSearch, setPickupSearch] = useState('');
    const [destinationLocation, setDestinationLocation] = useState('');
    const [destinationSearch, setDestinationSearch] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('12:00');
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('12:00');
    const [returnPickupLocation, setReturnPickupLocation] = useState('');
    const [returnDestinationLocation, setReturnDestinationLocation] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [showPickupDropdown, setShowPickupDropdown] = useState(false);
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const airportList = [
        { code: 'LON', name: 'London - Heathrow Airport' },
        { code: 'LGW', name: 'London - Gatwick Airport' },
        { code: 'JFK', name: 'New York - JFK Airport' },
        { code: 'LAX', name: 'Los Angeles - LAX Airport' },
        { code: 'CDG', name: 'Paris - Charles de Gaulle' },
        { code: 'DXB', name: 'Dubai - International Airport' },
        { code: 'SIN', name: 'Singapore - Changi Airport' },
        { code: 'HND', name: 'Tokyo - Haneda Airport' },
    ];

    const locationList = [
        'Downtown City Center',
        'Hotel Zone',
        'Business District',
        'Airport Terminal',
        'Railway Station',
        'Shopping Mall',
        'Beach Resort',
        'Convention Center',
    ];

    const filterAirports = (search: string) => {
        if (!search) return airportList;
        return airportList.filter(airport =>
            airport.code.toLowerCase().includes(search.toLowerCase()) ||
            airport.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const filterLocations = (search: string) => {
        if (!search) return locationList;
        return locationList.filter(location =>
            location.toLowerCase().includes(search.toLowerCase())
        );
    };

    const handleSearch = () => {
        if (!pickupAirport || !destinationLocation || !pickupDate) {
            alert('Please fill in all required fields');
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setPickupAirport('');
        setDestinationLocation('');
        setPickupDate('');
        setPickupTime('12:00');
        setReturnDate('');
        setReturnTime('12:00');
        setReturnPickupLocation('');
        setReturnDestinationLocation('');
        setPassengers(1);
    };

    return (
        <div>
            {/* Trip Type Toggle */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', paddingBottom: '0px', borderBottom: 'none' }}>
                <button
                    onClick={() => setTripType('oneway')}
                    style={{
                        background: tripType === 'oneway' ? '#e8f1ff' : '#fff',
                        color: tripType === 'oneway' ? '#0066cc' : '#666',
                        border: `2px solid ${tripType === 'oneway' ? '#0066cc' : '#ddd'}`,
                        padding: '10px 28px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (tripType !== 'oneway') {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    One Way
                </button>
                <button
                    onClick={() => setTripType('return')}
                    style={{
                        background: tripType === 'return' ? '#e8f1ff' : '#fff',
                        color: tripType === 'return' ? '#0066cc' : '#666',
                        border: `2px solid ${tripType === 'return' ? '#0066cc' : '#ddd'}`,
                        padding: '10px 28px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (tripType !== 'return') {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Return
                </button>
            </div>

            {/* Row 1: Airport & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Pickup Airport */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>
                        Pick-up Location
                    </label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-plane"></i>
                    </div>
                    <input
                        type="text"
                        placeholder='Pick-up location'
                        value={pickupAirport ? `${airportList.find(a => a.code === pickupAirport)?.code} - ${airportList.find(a => a.code === pickupAirport)?.name}` : pickupSearch}
                        onChange={(e) => {
                            setPickupSearch(e.target.value);
                            setPickupAirport('');
                            setShowPickupDropdown(true);
                        }}
                        onFocus={() => setShowPickupDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                    />
                    {showPickupDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterAirports(pickupSearch).length > 0 ? (
                                filterAirports(pickupSearch).map(airport => (
                                    <div
                                        key={airport.code}
                                        onClick={() => {
                                            setPickupAirport(airport.code);
                                            setPickupSearch('');
                                            setShowPickupDropdown(false);
                                        }}
                                        style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <strong>{airport.code}</strong> - {airport.name}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No airports found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Drop-off Location */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>
                        Drop-off Location
                    </label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-map-marker"></i>
                    </div>
                    <input
                        type="text"
                        placeholder='Drop-off location'
                        value={destinationLocation || destinationSearch}
                        onChange={(e) => {
                            setDestinationSearch(e.target.value);
                            setDestinationLocation('');
                            setShowDestinationDropdown(true);
                        }}
                        onFocus={() => setShowDestinationDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                    />
                    <button
                        onClick={() => {
                            const temp = pickupAirport;
                            setPickupAirport(destinationLocation as any);
                            setDestinationLocation(temp as any);
                        }}
                        style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: '#fff', border: '1px solid #ccc', borderRadius: '50%', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px', width: '32px', zIndex: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f0f8ff';
                            e.currentTarget.style.borderColor = '#0066cc';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,102,204,0.2)';
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                        }}
                    >⇄</button>
                    {showDestinationDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterLocations(destinationSearch).length > 0 ? (
                                filterLocations(destinationSearch).map(location => (
                                    <div
                                        key={location}
                                        onClick={() => {
                                            setDestinationLocation(location);
                                            setDestinationSearch('');
                                            setShowDestinationDropdown(false);
                                        }}
                                        style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        {location}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No locations found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2: Date, Time & Passengers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Pickup Date */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Pick-up date</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-calendar"></i>
                    </div>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s', cursor: 'pointer' }}
                    />
                </div>

                {/* Pickup Time */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Pick-up time</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-clock-o"></i>
                    </div>
                    <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s', cursor: 'pointer' }}
                    />
                </div>

                {/* Passengers */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Passengers</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-users"></i>
                    </div>
                    <select
                        value={passengers}
                        onChange={(e) => setPassengers(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', cursor: 'pointer', backgroundColor: '#fff', transition: 'border-color 0.3s' }}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Return Trip Section - Only show for Return trips */}
            {tripType === 'return' && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #f0f0f0' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#003d82', marginBottom: '16px' }}>Return Trip</h4>

                    {/* Return Row 1: Return Locations */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                        {/* Return Pickup Location */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Return Pick-up Location</label>
                            <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                                <i className="fa fa-map-marker"></i>
                            </div>
                            <input
                                type="text"
                                placeholder='Return pick-up location'
                                value={returnPickupLocation}
                                onChange={(e) => setReturnPickupLocation(e.target.value)}
                                style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                            />
                        </div>

                        {/* Return Drop-off Location */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Return Drop-off Location</label>
                            <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                                <i className="fa fa-map-marker"></i>
                            </div>
                            <input
                                type="text"
                                placeholder='Return drop-off location'
                                value={returnDestinationLocation}
                                onChange={(e) => setReturnDestinationLocation(e.target.value)}
                                style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                            />
                        </div>
                    </div>

                    {/* Return Row 2: Return Date & Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                        {/* Return Date */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Return Date</label>
                            <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                                <i className="fa fa-calendar"></i>
                            </div>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s', cursor: 'pointer' }}
                            />
                        </div>

                        {/* Return Time */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Return Pick-up Time</label>
                            <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                                <i className="fa fa-clock-o"></i>
                            </div>
                            <input
                                type="time"
                                value={returnTime}
                                onChange={(e) => setReturnTime(e.target.value)}
                                style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    onClick={handleSearch}
                    style={{
                        background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 120px',
                        borderRadius: '28px',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        height: '50px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 8px 24px rgba(0, 102, 204, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '280px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 102, 204, 0.45)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 102, 204, 0.35)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1)';
                    }}
                >
                    SEARCH
                </button>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={handleCloseBookingModal}
                searchDetails={{
                    tripType,
                    pickupAirport,
                    destinationLocation,
                    pickupDate,
                    pickupTime,
                    returnDate: tripType === 'return' ? returnDate : undefined,
                    returnTime: tripType === 'return' ? returnTime : undefined,
                    returnPickupLocation: tripType === 'return' ? returnPickupLocation : undefined,
                    returnDestinationLocation: tripType === 'return' ? returnDestinationLocation : undefined,
                    passengers,
                }}
                serviceType="airport-transfer"
            />
        </div>
    );
}

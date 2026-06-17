import { useState } from 'react';
import { router } from '@inertiajs/react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';
import BookingModal from '@/components/BookingModal';

export default function PackageSearchForm(): React.ReactElement {
    const [hotelCity, setHotelCity] = useState('');
    const [hotelSearch, setHotelSearch] = useState('');
    const [showHotelDropdown, setShowHotelDropdown] = useState(false);
    const [departureAirport, setDepartureAirport] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [nights, setNights] = useState(7);
    const [showNightsDropdown, setShowNightsDropdown] = useState(false);
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [adults, setAdults] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const weeklyOptions = [7, 14, 21, 28];
    const dailyOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    const calculateCheckoutDate = () => {
        if (!checkInDate) return '';
        const checkin = new Date(checkInDate);
        const checkout = new Date(checkin);
        checkout.setDate(checkout.getDate() + nights);
        return checkout.toISOString().split('T')[0];
    };

    const checkOutDate = calculateCheckoutDate();

    const hotelList = [
        { code: 'LON', name: 'London' },
        { code: 'DEL', name: 'Delhi' },
        { code: 'BOM', name: 'Mumbai' },
        { code: 'NYC', name: 'New York' },
        { code: 'LAX', name: 'Los Angeles' },
        { code: 'CDG', name: 'Paris' },
        { code: 'DXB', name: 'Dubai' },
        { code: 'SIN', name: 'Singapore' },
    ];

    const airportList = [
        { code: 'LON', name: 'London' },
        { code: 'NYC', name: 'New York' },
        { code: 'LAX', name: 'Los Angeles' },
        { code: 'CDG', name: 'Paris' },
        { code: 'DXB', name: 'Dubai' },
        { code: 'SIN', name: 'Singapore' },
        { code: 'HND', name: 'Tokyo' },
        { code: 'BOM', name: 'Mumbai' },
    ];

    const filterHotels = (search: string) => {
        if (!search) return hotelList;
        return hotelList.filter(h =>
            h.code.toLowerCase().includes(search.toLowerCase()) ||
            h.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const handleSearch = () => {
        if (!hotelCity || !departureAirport || !checkInDate || !checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setHotelCity('');
        setDepartureAirport('');
        setCheckInDate('');
        setAdults(1);
        setRooms(1);
        setNights(7);
    };

    return (
        <div>
            {/* Row 1: Destination, Airport, Check-in */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1.2fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Destination */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Destination or Hotel</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-building"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter destination"
                        value={hotelSearch || (hotelCity ? `${hotelList.find(h => h.code === hotelCity)?.name}` : '')}
                        onChange={(e) => {
                            setHotelSearch(e.target.value);
                            setHotelCity('');
                            setShowHotelDropdown(true);
                        }}
                        onFocus={() => setShowHotelDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    />
                    {showHotelDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterHotels(hotelSearch).map(hotel => (
                                <div
                                    key={hotel.code}
                                    onClick={() => {
                                        setHotelCity(hotel.code);
                                        setHotelSearch('');
                                        setShowHotelDropdown(false);
                                    }}
                                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    <strong>{hotel.code}</strong> - {hotel.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Departure Airport */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Departure Airport</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-plane"></i>
                    </div>
                    <select
                        value={departureAirport}
                        onChange={(e) => setDepartureAirport(e.target.value)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', backgroundColor: '#fff', cursor: 'pointer', transition: 'border-color 0.3s', appearance: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <option value="">Select airport</option>
                        {airportList.map(a => (
                            <option key={a.code} value={a.code}>{a.code} - {a.name}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '12px', color: '#999', pointerEvents: 'none' }}>
                        <i className="fa fa-chevron-down"></i>
                    </div>
                </div>

                {/* Check-in Date - Calendar Picker */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Check-in Date</label>
                    <div
                        onClick={() => {
                            setShowCheckInCalendar(!showCheckInCalendar);
                            setShowNightsDropdown(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', height: '54px', border: '1.5px solid #ddd', borderRadius: '10px', background: '#fff', transition: 'border-color 0.3s', cursor: 'pointer', padding: '0 16px' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <div style={{ fontSize: '16px', color: '#999', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-calendar"></i>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                {checkInDate ? new Date(checkInDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check-in'}
                            </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>

                    {/* Calendar Date Picker */}
                    {showCheckInCalendar && (
                        <CalendarDateRangePicker
                            departureDate={checkInDate}
                            returnDate={checkInDate ? checkOutDate : ""}
                            tripType={checkInDate ? "roundtrip" : "oneway"}
                            onDateChange={(departure) => {
                                setCheckInDate(departure);
                            }}
                            onClose={() => setShowCheckInCalendar(false)}
                        />
                    )}
                </div>
            </div>

            {/* Row 2: Nights, Guests */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Nights Selector */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Nights</label>
                    <div
                        onClick={() => setShowNightsDropdown(!showNightsDropdown)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px', border: '1.5px solid #ddd', borderRadius: '10px', background: '#fff', padding: '0 16px', cursor: 'pointer', transition: 'border-color 0.3s', position: 'relative' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-moon" style={{ marginRight: '8px', color: '#999' }}></i>
                            <span style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>{nights} night{nights !== 1 ? 's' : ''}</span>
                        </div>
                        <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: '#999' }}></i>
                    </div>
                    {showNightsDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '300px', overflowY: 'auto' }}>
                            <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', padding: '8px 16px', textTransform: 'uppercase' }}>Weekly</div>
                                {weeklyOptions.map(n => (
                                    <div
                                        key={n}
                                        onClick={() => {
                                            setNights(n);
                                            setShowNightsDropdown(false);
                                        }}
                                        style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '13px', color: nights === n ? '#fff' : '#333', background: nights === n ? '#0066cc' : 'transparent', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => {
                                            if (nights !== n) e.currentTarget.style.background = '#f5f5f5';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (nights !== n) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        {n} nights
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '12px 0' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', padding: '8px 16px', textTransform: 'uppercase' }}>Daily</div>
                                {dailyOptions.map(n => (
                                    <div
                                        key={n}
                                        onClick={() => {
                                            setNights(n);
                                            setShowNightsDropdown(false);
                                        }}
                                        style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '13px', color: nights === n ? '#fff' : '#333', background: nights === n ? '#0066cc' : 'transparent', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => {
                                            if (nights !== n) e.currentTarget.style.background = '#f5f5f5';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (nights !== n) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        {n} nights
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
                                <button
                                    onClick={() => {
                                        handleSearch();
                                        setShowNightsDropdown(false);
                                    }}
                                    style={{ width: '100%', padding: '10px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#0052a3'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#0066cc'}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Guests and Rooms */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Guests & Rooms</label>
                    <div
                        onClick={() => setShowGuestModal(!showGuestModal)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px', border: '1.5px solid #ddd', borderRadius: '10px', background: '#fff', padding: '0 16px', cursor: 'pointer', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                            <i className="fa fa-users" style={{ marginRight: '8px', color: '#0066cc' }}></i>
                            {adults} Adult{adults !== 1 ? 's' : ''} • {rooms} Room{rooms !== 1 ? 's' : ''}
                        </div>
                        <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: '#999' }}></i>
                    </div>

                    {/* Guest & Room Selector Modal */}
                    {showGuestModal && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '6px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, minWidth: '300px', padding: '20px' }}>
                            {/* Adults Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>Adults</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                        style={{ width: '36px', height: '36px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#333' }}
                                    >
                                        −
                                    </button>
                                    <span style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>{adults}</span>
                                    <button
                                        onClick={() => setAdults(Math.min(8, adults + 1))}
                                        style={{ width: '36px', height: '36px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#333' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Rooms Selection */}
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>Rooms</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                                        style={{ width: '36px', height: '36px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#333' }}
                                    >
                                        −
                                    </button>
                                    <span style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>{rooms}</span>
                                    <button
                                        onClick={() => setRooms(Math.min(8, rooms + 1))}
                                        style={{ width: '36px', height: '36px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#333' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowGuestModal(false)}
                                style={{ width: '100%', padding: '10px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>

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
                    hotelCity,
                    departureAirport,
                    checkInDate,
                    checkOutDate,
                    nights,
                    adults,
                    rooms,
                }}
                serviceType="package"
            />
        </div>
    );
}

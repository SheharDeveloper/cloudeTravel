import { useState } from 'react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';
import BookingModal from '@/components/BookingModal';

export default function HotelsSearchForm(): React.ReactElement {
    const [stayType, setStayType] = useState('overnight');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [hotelCity, setHotelCity] = useState('');
    const [hotelSearch, setHotelSearch] = useState('');
    const [showHotelDropdown, setShowHotelDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const cityList = [
        { code: 'LON', name: 'London' },
        { code: 'DEL', name: 'Delhi' },
        { code: 'BOM', name: 'Mumbai' },
        { code: 'NYC', name: 'New York' },
        { code: 'LAX', name: 'Los Angeles' },
        { code: 'CDG', name: 'Paris' },
        { code: 'LHR', name: 'London Heathrow' },
        { code: 'DXB', name: 'Dubai' },
        { code: 'SIN', name: 'Singapore' },
        { code: 'HND', name: 'Tokyo' },
    ];

    const filterCities = (search: string) => {
        if (!search) return cityList;
        return cityList.filter(city =>
            city.code.toLowerCase().includes(search.toLowerCase()) ||
            city.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const handleHotelSearch = () => {
        if (!hotelCity || !checkInDate) {
            alert('Please fill in all required fields');
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setHotelCity('');
        setHotelSearch('');
        setCheckInDate('');
        setCheckOutDate('');
        setStayType('overnight');
        setShowDatePicker(false);
        setShowGuestModal(false);
    };

    return (
        <div>
            {/* Stay Type Toggle - Like Flight's One Way/Round Trip */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', paddingBottom: '0px', borderBottom: 'none' }}>
                <button
                    onClick={() => setStayType('dayuse')}
                    style={{
                        background: stayType === 'dayuse' ? '#e8f1ff' : '#fff',
                        color: stayType === 'dayuse' ? '#0066cc' : '#666',
                        border: `2px solid ${stayType === 'dayuse' ? '#0066cc' : '#ddd'}`,
                        padding: '10px 28px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        if (stayType !== 'dayuse') {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (stayType !== 'dayuse') {
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    Day Use Stay
                </button>
                <button
                    onClick={() => setStayType('overnight')}
                    style={{
                        background: stayType === 'overnight' ? '#e8f1ff' : '#fff',
                        color: stayType === 'overnight' ? '#0066cc' : '#666',
                        border: `2px solid ${stayType === 'overnight' ? '#0066cc' : '#ddd'}`,
                        padding: '10px 28px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        if (stayType !== 'overnight') {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (stayType !== 'overnight') {
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    Overnight Stay
                </button>
            </div>

            {/* Row 1: Hotel City & Dates */}
            <div className="hotel-search-row1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Hotel City */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Hotel City</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-map-marker"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search hotel city..."
                        value={hotelCity ? `${cityList.find(c => c.code === hotelCity)?.code} - ${cityList.find(c => c.code === hotelCity)?.name}` : hotelSearch}
                        onChange={(e) => {
                            setHotelSearch(e.target.value);
                            setHotelCity('');
                            setShowHotelDropdown(true);
                        }}
                        onFocus={() => setShowHotelDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                    />
                    {showHotelDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterCities(hotelSearch).length > 0 ? (
                                filterCities(hotelSearch).map(city => (
                                    <div
                                        key={city.code}
                                        onClick={() => {
                                            setHotelCity(city.code);
                                            setHotelSearch('');
                                            setShowHotelDropdown(false);
                                        }}
                                        style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <strong>{city.code}</strong> - {city.name}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No cities found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Dates */}
                <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>
                        {stayType === 'overnight' ? 'Check-in & Check-out' : 'Check-in Date'}
                    </label>
                    <div
                        onClick={() => {
                            setShowDatePicker(!showDatePicker);
                            if (!showDatePicker) setShowGuestModal(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', height: '54px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', transition: 'border-color 0.3s', cursor: 'pointer', padding: '0 16px' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    >
                        <div style={{ fontSize: '16px', color: '#999', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-calendar"></i>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                {checkInDate ? new Date(checkInDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check-in'}
                            </div>
                        </div>

                        {stayType === 'overnight' && (
                            <>
                                <div style={{ width: '1px', height: '30px', backgroundColor: '#e0e0e0', margin: '0 12px' }}></div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                        {checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check-out'}
                                    </div>
                                </div>
                            </>
                        )}

                        <div style={{ fontSize: '14px', color: '#999', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>

                    {showDatePicker && stayType === 'overnight' && (
                        <CalendarDateRangePicker
                            departureDate={checkInDate}
                            returnDate={checkOutDate}
                            tripType="roundtrip"
                            onDateChange={(checkin, checkout) => {
                                setCheckInDate(checkin);
                                setCheckOutDate(checkout);
                            }}
                            onClose={() => setShowDatePicker(false)}
                        />
                    )}

                    {showDatePicker && stayType === 'dayuse' && (
                        <CalendarDateRangePicker
                            departureDate={checkInDate}
                            returnDate=""
                            tripType="oneway"
                            onDateChange={(checkin) => {
                                setCheckInDate(checkin);
                                setCheckOutDate(checkin);
                            }}
                            onClose={() => setShowDatePicker(false)}
                        />
                    )}
                </div>
            </div>

            {/* Room & Guest Selection Card - Like Flight's Travellers */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.3s', marginBottom: '14px' }}
                onClick={() => {
                    setShowGuestModal(!showGuestModal);
                    if (!showGuestModal) setShowDatePicker(false);
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
            >
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600, position: 'absolute', top: '-20px' }}>Room & Guests</label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                        {rooms} Room{rooms > 1 ? 's' : ''} • {adults} Adult{adults > 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                        {children > 0 ? `${children} Child${children !== 1 ? 'ren' : ''}` : 'No children'}
                    </div>
                </div>
                <div style={{ fontSize: '16px', color: '#666' }}>
                    <i className="fa fa-chevron-down"></i>
                </div>
            </div>

            {/* Guest Modal - Like Flight Traveler Style */}
            {showGuestModal && (
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', width: 'clamp(320px, 90vw, 480px)', maxHeight: '650px', overflowY: 'auto', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '18px' }}>Room & Guests</h3>

                    {/* Room Selector - Numbered Buttons */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Rooms</p>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <button key={n} onClick={() => setRooms(n)} style={{ background: rooms === n ? '#0066cc' : '#fff', color: rooms === n ? '#fff' : '#666', border: rooms === n ? 'none' : '1px solid #ddd', width: rooms === n ? '32px' : '28px', height: rooms === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: rooms === n ? '11px' : '10px', fontWeight: rooms === n ? 700 : 500 }}>{n}</button>
                            ))}
                        </div>
                    </div>

                    {/* Adult Selector - Numbered Buttons */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Adults <span style={{ fontSize: '9px', color: '#999' }}>18 yrs or above</span></p>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <button key={n} onClick={() => setAdults(n)} style={{ background: adults === n ? '#0066cc' : '#fff', color: adults === n ? '#fff' : '#666', border: adults === n ? 'none' : '1px solid #ddd', width: adults === n ? '32px' : '28px', height: adults === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: adults === n ? '11px' : '10px', fontWeight: adults === n ? 700 : 500 }}>{n}</button>
                            ))}
                        </div>
                    </div>

                    {/* Children Selector - Numbered Buttons */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Children <span style={{ fontSize: '9px', color: '#999' }}>0 - 17 yrs</span></p>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <button key={n} onClick={() => setChildren(n)} style={{ background: children === n ? '#0066cc' : '#fff', color: children === n ? '#fff' : '#666', border: children === n ? 'none' : '1px solid #ddd', width: children === n ? '32px' : '28px', height: children === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: children === n ? '11px' : '10px', fontWeight: children === n ? 700 : 500 }}>{n}</button>
                            ))}
                        </div>
                    </div>

                    {/* Done Button */}
                    <button onClick={() => setShowGuestModal(false)} style={{ background: '#ff6b35', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                </div>
            )}

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', marginTop: '6px' }}>
                <button
                    onClick={handleHotelSearch}
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
                    SEARCH HOTELS
                </button>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={handleCloseBookingModal}
                searchDetails={{
                    hotelCity,
                    stayType,
                    checkInDate,
                    checkOutDate: stayType === 'overnight' ? checkOutDate : checkInDate,
                    rooms,
                    adults,
                    children,
                }}
                serviceType="hotel"
            />
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
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
    const [infants, setInfants] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const hotelRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const guestModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (hotelRef.current && !hotelRef.current.contains(event.target as Node)) {
                setShowHotelDropdown(false);
            }
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
            if (guestModalRef.current && !guestModalRef.current.contains(event.target as Node)) {
                setShowGuestModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                        background: stayType === 'dayuse' ? '#fff5e8' : '#fff',
                        color: stayType === 'dayuse' ? '#0499ff' : '#666',
                        border: `2px solid ${stayType === 'dayuse' ? '#0499ff' : '#ddd'}`,
                        padding: '10px 28px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: stayType === 'dayuse' ? '0 4px 12px rgba(4, 153, 255, 0.2)' : 'none'
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
                        background: stayType === 'overnight' ? '#fff5e8' : '#fff',
                        color: stayType === 'overnight' ? '#0499ff' : '#666',
                        border: `2px solid ${stayType === 'overnight' ? '#0499ff' : '#ddd'}`,
                        padding: '10px 28px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: stayType === 'overnight' ? '0 4px 12px rgba(4, 153, 255, 0.2)' : 'none'
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

            {/* Row 1: Hotel City, Dates & Guests */}
            <div className="hotel-search-row1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                {/* Hotel City */}
                <div ref={hotelRef} style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Where</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-map-marker"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Staying in"
                        value={hotelCity ? `${cityList.find(c => c.code === hotelCity)?.code} - ${cityList.find(c => c.code === hotelCity)?.name}` : hotelSearch}
                        onChange={(e) => {
                            setHotelSearch(e.target.value);
                            setHotelCity('');
                            setShowHotelDropdown(true);
                        }}
                        onFocus={(e) => {
                            setShowHotelDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
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
                <div ref={datePickerRef} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        When
                    </label>
                    <div
                        onClick={() => {
                            setShowDatePicker(!showDatePicker);
                            if (!showDatePicker) setShowGuestModal(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', height: '58px', border: '1.5px solid #ddd', borderRadius: '10px', background: '#fff', transition: 'all 0.3s', cursor: 'pointer', padding: '0 16px' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
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

                {/* Room & Guest Selection Card - In the same row */}
                <div ref={guestModalRef} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Who</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', border: '1.5px solid #ddd', borderRadius: '10px', background: '#fff', padding: '16px', cursor: 'pointer', transition: 'all 0.3s' }}
                        onClick={() => {
                            setShowGuestModal(!showGuestModal);
                            if (!showGuestModal) setShowDatePicker(false);
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
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
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '18px' }}>Room & Guests</h3>

                    {/* Room Selector */}
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Rooms</p>
                                <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}></p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <button onClick={() => setRooms(Math.max(1, rooms - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center', flex: 1 }}>{rooms}</span>
                                <button onClick={() => setRooms(Math.min(9, rooms + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* Adult Selector */}
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Adults</p>
                                <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>18 yrs or above</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <button onClick={() => setAdults(Math.max(1, adults - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center', flex: 1 }}>{adults}</span>
                                <button onClick={() => setAdults(Math.min(9, adults + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* Children Selector */}
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Children</p>
                                <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>0 - 17 yrs</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <button onClick={() => setChildren(Math.max(0, children - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center', flex: 1 }}>{children}</span>
                                <button onClick={() => setChildren(Math.min(8, children + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* Infants Selector */}
                    <div style={{ marginBottom: '20px', paddingBottom: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Infants</p>
                                <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>Under 2 yrs</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                <button onClick={() => setInfants(Math.max(0, infants - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center', flex: 1 }}>{infants}</span>
                                <button onClick={() => setInfants(Math.min(8, infants + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '40px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>
                    </div>

                    {/* Done Button */}
                    <button onClick={() => setShowGuestModal(false)} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Apply</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', marginTop: '6px' }}>
                <button
                    onClick={handleHotelSearch}
                    style={{
                        background: '#0499ff',
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
                        boxShadow: '0 8px 24px rgba(4, 153, 255, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '280px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(4, 153, 255, 0.45)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(4, 153, 255, 0.35)';
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

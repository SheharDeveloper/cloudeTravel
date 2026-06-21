import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';
import BookingModal from '@/components/BookingModal';

interface FlightSearchFormProps {
    showDateRangePicker: boolean;
    setShowDateRangePicker: (show: boolean) => void;
    showTravellerModal: boolean;
    setShowTravellerModal: (show: boolean) => void;
}

export default function FlightSearchForm({
    showDateRangePicker,
    setShowDateRangePicker,
    showTravellerModal,
    setShowTravellerModal
}: FlightSearchFormProps) {
    const [tripType, setTripType] = useState('roundtrip');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
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
        { code: 'IXC', name: 'Chandigarh' },
    ];

    const filterCities = (search: string) => {
        if (!search) return cityList;
        return cityList.filter(city =>
            city.code.toLowerCase().includes(search.toLowerCase()) ||
            city.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const handleFlightSearch = () => {
        if (!fromCity || !toCity || !departureDate) {
            alert('Please fill in all required fields');
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setFromCity('');
        setToCity('');
        setFromSearch('');
        setToSearch('');
        setDepartureDate('');
        setReturnDate('');
        setTripType('roundtrip');
        setShowDateRangePicker(false);
        setShowTravellerModal(false);
    };

    return (
        <div className="flight-search-form">
            {/* Trip Type Toggle */}
            <div className="trip-type-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '14px', paddingBottom: '0px', borderBottom: 'none' }}>
                <button
                    onClick={() => setTripType('oneway')}
                    className="trip-type-btn"
                    style={{
                        background: tripType === 'oneway' ? '#e8f1ff' : '#fff',
                        color: tripType === 'oneway' ? '#0066cc' : '#666',
                        border: `2px solid ${tripType === 'oneway' ? '#0066cc' : '#ddd'}`,
                        padding: '10px 20px',
                        borderRadius: '24px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: tripType === 'oneway' ? '0 4px 12px rgba(0, 102, 204, 0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        if (tripType !== 'oneway') {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (tripType !== 'oneway') {
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    One Way
                </button>
                <button
                    onClick={() => setTripType('roundtrip')}
                    className="trip-type-btn"
                    style={{
                        background: tripType === 'roundtrip' ? '#e8f1ff' : '#fff',
                        color: tripType === 'roundtrip' ? '#0066cc' : '#666',
                        border: `2px solid ${tripType === 'roundtrip' ? '#0066cc' : '#ddd'}`,
                        padding: '10px 20px',
                        borderRadius: '24px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: tripType === 'roundtrip' ? '0 4px 12px rgba(0, 102, 204, 0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        if (tripType !== 'roundtrip') {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (tripType !== 'roundtrip') {
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    Round Trip
                </button>
            </div>

            {/* Row 1: From, Swap, To */}
            <div className="flight-search-row1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '12px', alignItems: 'flex-start', position: 'relative' }}>
                {/* FROM CITY - Searchable Dropdown */}
                <div style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600, margin: 0, padding: 0 }}>Flying From</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-plane"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Flying from"
                        value={fromCity ? `${cityList.find(c => c.code === fromCity)?.code} - ${cityList.find(c => c.code === fromCity)?.name}` : fromSearch}
                        onChange={(e) => {
                            setFromSearch(e.target.value);
                            setFromCity('');
                            setShowFromDropdown(true);
                        }}
                        onFocus={() => setShowFromDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                    />
                    {/* FROM DROPDOWN */}
                    {showFromDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterCities(fromSearch).length > 0 ? (
                                filterCities(fromSearch).map(city => (
                                    <div
                                        key={city.code}
                                        onClick={() => {
                                            setFromCity(city.code);
                                            setFromSearch('');
                                            setShowFromDropdown(false);
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

                {/* TO CITY - Searchable Dropdown */}
                <div style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600, margin: 0, padding: 0 }}>Flying To</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-map-marker"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Flying to"
                        value={toCity ? `${cityList.find(c => c.code === toCity)?.code} - ${cityList.find(c => c.code === toCity)?.name}` : toSearch}
                        onChange={(e) => {
                            setToSearch(e.target.value);
                            setToCity('');
                            setShowToDropdown(true);
                        }}
                        onFocus={() => setShowToDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                    />
                    {/* TO DROPDOWN */}
                    {showToDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterCities(toSearch).length > 0 ? (
                                filterCities(toSearch).map(city => (
                                    <div
                                        key={city.code}
                                        onClick={() => {
                                            setToCity(city.code);
                                            setToSearch('');
                                            setShowToDropdown(false);
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

                {/* SWAP BUTTON - Perfectly centered between inputs */}
                <button
                    className="flying-from-swap"
                    onClick={() => {
                        const tempCity = fromCity;
                        setFromCity(toCity);
                        setToCity(tempCity);
                        setFromSearch('');
                        setToSearch('');
                        setShowFromDropdown(false);
                        setShowToDropdown(false);
                    }}
                    style={{ position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #ccc', borderRadius: '60%', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', width: '36px', zIndex: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f8ff';
                        e.currentTarget.style.borderColor = '#0066cc';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,102,204,0.2)';
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                    }}
                >⇄</button>
            </div>

            {/* Row 2: Date(s) and Travellers */}
            <div className="flight-search-row2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Combined Date Range Picker */}
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Dates</label>
                    <div
                        onClick={() => {
                            setShowDateRangePicker(!showDateRangePicker);
                            if (!showDateRangePicker) setShowTravellerModal(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', height: '54px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', transition: 'border-color 0.3s', cursor: 'pointer', padding: '0 16px' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    >
                        {/* Calendar Icon */}
                        <div style={{ fontSize: '16px', color: '#999', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-calendar"></i>
                        </div>

                        {/* Departure Date */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                {departureDate ? new Date(departureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Departure'}
                            </div>
                        </div>

                        {/* Divider */}
                        {tripType === 'roundtrip' && (
                            <div style={{ width: '1px', height: '30px', backgroundColor: '#e0e0e0', margin: '0 12px' }}></div>
                        )}

                        {/* Return Date (only for Round Trip) */}
                        {tripType === 'roundtrip' && (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                    {returnDate ? new Date(returnDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Return'}
                                </div>
                            </div>
                        )}

                        {/* Chevron Icon */}
                        <div style={{ fontSize: '14px', color: '#999', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>

                    {/* Calendar Date Range Picker */}
                    {showDateRangePicker && (
                        <CalendarDateRangePicker
                            departureDate={departureDate}
                            returnDate={returnDate}
                            tripType={tripType as 'oneway' | 'roundtrip'}
                            onDateChange={(departure, returnDateStr) => {
                                setDepartureDate(departure);
                                setReturnDate(returnDateStr);
                            }}
                            onClose={() => setShowDateRangePicker(false)}
                        />
                    )}
                </div>

                {/* Travellers & Class */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Travellers</label>
                    <div
                        onClick={() => {
                            setShowTravellerModal(!showTravellerModal);
                            if (!showTravellerModal) setShowDateRangePicker(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', padding: '12px 16px', cursor: 'pointer', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                {adults > 0 ? `${adults} Adult${adults > 1 ? 's' : ''}` : '0 Adults'} • {selectedClass}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                                {children > 0 || infants > 0 ? `${children} Child${children !== 1 ? 'ren' : ''}, ${infants} Infant${infants !== 1 ? 's' : ''}` : 'No children'}
                            </div>
                        </div>
                        <div style={{ fontSize: '16px', color: '#666' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    {/* TRAVELLER DROPDOWN */}
                    {showTravellerModal && (
                        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', width: 'clamp(320px, 90vw, 480px)', maxHeight: '650px', overflowY: 'auto', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '18px' }}>Travellers</h3>

                            {/* Adults */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Adults <span style={{ fontSize: '9px', color: '#999' }}>12 yrs or above</span></p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                                        const totalWithThisAdult = n + children + infants;
                                        const isDisabled = n !== adults && totalWithThisAdult > 9;
                                        return (
                                            <button key={n} onClick={() => !isDisabled && setAdults(n)} disabled={isDisabled} style={{ background: adults === n ? '#0066cc' : '#fff', color: adults === n ? '#fff' : isDisabled ? '#ddd' : '#666', border: adults === n ? 'none' : '1px solid ' + (isDisabled ? '#f0f0f0' : '#ddd'), width: adults === n ? '32px' : '28px', height: adults === n ? '32px' : '28px', borderRadius: '4px', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: adults === n ? '11px' : '10px', fontWeight: adults === n ? 700 : 500, opacity: isDisabled ? 0.4 : 1 }}>{n}</button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Children */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Children <span style={{ fontSize: '9px', color: '#999' }}>2 - 12 yrs</span></p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                        const totalWithThisChild = adults + n + infants;
                                        const isDisabled = n !== children && totalWithThisChild > 9;
                                        return (
                                            <button key={n} onClick={() => !isDisabled && setChildren(n)} disabled={isDisabled} style={{ background: children === n ? '#0066cc' : '#fff', color: children === n ? '#fff' : isDisabled ? '#ddd' : '#666', border: children === n ? 'none' : '1px solid ' + (isDisabled ? '#f0f0f0' : '#ddd'), width: children === n ? '32px' : '28px', height: children === n ? '32px' : '28px', borderRadius: '4px', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: children === n ? '11px' : '10px', fontWeight: children === n ? 700 : 500, opacity: isDisabled ? 0.4 : 1 }}>{n}</button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Infants */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Infants <span style={{ fontSize: '9px', color: '#999' }}>0 - 2 yrs</span></p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[0, 1, 2, 3, 4].map(n => {
                                        const totalWithThisInfant = adults + children + n;
                                        const isDisabled = n !== infants && totalWithThisInfant > 9;
                                        return (
                                            <button key={n} onClick={() => !isDisabled && setInfants(n)} disabled={isDisabled} style={{ background: infants === n ? '#0066cc' : '#fff', color: infants === n ? '#fff' : isDisabled ? '#ddd' : '#666', border: infants === n ? 'none' : '1px solid ' + (isDisabled ? '#f0f0f0' : '#ddd'), width: infants === n ? '32px' : '28px', height: infants === n ? '32px' : '28px', borderRadius: '4px', cursor: isDisabled ? 'not-allowed' : 'pointer', fontSize: infants === n ? '11px' : '10px', fontWeight: infants === n ? 700 : 500, opacity: isDisabled ? 0.4 : 1 }}>{n}</button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Group Booking Message */}
                            {adults + children + infants >= 9 && (
                                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '18px', marginTop: '15px' }}>
                                    <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>👥 Planning a trip for more than 9 travellers? <span style={{ color: '#ff6b35', fontWeight: 600, cursor: 'pointer' }}>Create Group Booking</span></p>
                                </div>
                            )}

                            {/* Class Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px', fontWeight: 600 }}>Class</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['Economy', 'Premium Economy', 'Business'].map(cls => (
                                        <button key={cls} onClick={() => setSelectedClass(cls)} style={{ background: selectedClass === cls ? '#0066cc' : '#fff', color: selectedClass === cls ? '#fff' : '#333', border: '1px solid ' + (selectedClass === cls ? '#0066cc' : '#ddd'), padding: '8px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{cls}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Done Button */}
                            <button onClick={() => setShowTravellerModal(false)} style={{ background: '#ff6b35', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', marginTop: '6px' }}>
                <button
                    className="search-flights-btn"
                    onClick={handleFlightSearch}
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
                    SEARCH FLIGHTS
                </button>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={handleCloseBookingModal}
                searchDetails={{
                    fromCity,
                    toCity,
                    departureDate,
                    returnDate: tripType === 'roundtrip' ? returnDate : '',
                    adults,
                    children,
                    infants,
                    selectedClass,
                }}
                serviceType="flight"
            />
        </div>
    );
}

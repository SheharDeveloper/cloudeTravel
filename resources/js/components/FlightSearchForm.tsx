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
    const [isFlexibleDates, setIsFlexibleDates] = useState(false);

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
            <div className="trip-type-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '16px', paddingBottom: '0px', borderBottom: 'none' }}>
                <button
                    onClick={() => setTripType('oneway')}
                    className="trip-type-btn"
                    style={{
                        background: tripType === 'oneway' ? '#fff5e8' : '#fff',
                        color: tripType === 'oneway' ? '#0499ff' : '#666',
                        border: `2px solid ${tripType === 'oneway' ? '#0499ff' : '#ddd'}`,
                        padding: '10px 20px',
                        borderRadius: '24px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: tripType === 'oneway' ? '0 4px 12px rgba(4, 153, 255, 0.2)' : 'none'
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
                        background: tripType === 'roundtrip' ? '#fff5e8' : '#fff',
                        color: tripType === 'roundtrip' ? '#0499ff' : '#666',
                        border: `2px solid ${tripType === 'roundtrip' ? '#0499ff' : '#ddd'}`,
                        padding: '10px 20px',
                        borderRadius: '24px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: tripType === 'roundtrip' ? '0 4px 12px rgba(4, 153, 255, 0.2)' : 'none'
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
            <div className="flight-search-row1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '20px', alignItems: 'flex-start', position: 'relative' }}>
                {/* FROM CITY - Searchable Dropdown */}
                <div style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, margin: 0, padding: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 16px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
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
                        onFocus={(e) => {
                            setShowFromDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
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
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, margin: 0, padding: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>To</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 16px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
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
                        onFocus={(e) => {
                            setShowToDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
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
                    style={{ position: 'absolute', top: '29px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #ddd', borderRadius: '60%', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', width: '36px', zIndex: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
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
            <div className="flight-search-row2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '16px', alignItems: 'flex-start', marginTop: '8px' }}>
                {/* Combined Date Range Picker */}
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>When</label>
                    <div
                        onClick={() => {
                            setShowDateRangePicker(!showDateRangePicker);
                            if (!showDateRangePicker) setShowTravellerModal(false);
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
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Who</label>
                    <div
                        onClick={() => {
                            setShowTravellerModal(!showTravellerModal);
                            if (!showTravellerModal) setShowDateRangePicker(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px', border: '1.5px solid #ddd', borderRadius: '10px', background: '#fff', padding: '12px 16px', cursor: 'pointer', transition: 'all 0.3s' }}
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
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Adults</p>
                                        <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>12 yrs or above</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setAdults(Math.max(1, adults - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center' }}>{adults}</span>
                                        <button onClick={() => setAdults(Math.min(9, adults + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Children */}
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Children</p>
                                        <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>2 - 12 yrs</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setChildren(Math.max(0, children - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center' }}>{children}</span>
                                        <button onClick={() => setChildren(Math.min(8, children + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Infants */}
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#333', margin: 0, fontWeight: 600 }}>Infants</p>
                                        <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0 0' }}>0 - 2 yrs</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setInfants(Math.max(0, infants - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#333', minWidth: '24px', textAlign: 'center' }}>{infants}</span>
                                        <button onClick={() => setInfants(Math.min(4, infants + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Group Booking Message */}
                            {adults + children + infants >= 9 && (
                                <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '18px', marginTop: '15px' }}>
                                    <p style={{ fontSize: '11px', color: '#333', margin: 0 }}>👥 Planning a trip for more than 9 travellers? <span style={{ color: '#0499ff', fontWeight: 600, cursor: 'pointer' }}>Create Group Booking</span></p>
                                </div>
                            )}

                            {/* Class Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px', fontWeight: 600 }}>Cabin Class</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {['Economy', 'Premium Economy', 'Business'].map(cls => (
                                        <div key={cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                            <span style={{ fontSize: '14px', color: '#333', fontWeight: selectedClass === cls ? 600 : 500 }}>{cls}</span>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => setSelectedClass(cls)}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        background: selectedClass === cls ? '#0499ff' : '#fff',
                                                        color: selectedClass === cls ? '#fff' : '#666',
                                                        border: selectedClass === cls ? 'none' : '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {selectedClass === cls ? '✓' : '+'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Travellers */}
                            <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #e0e0e0', marginBottom: '16px' }}>
                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', margin: 0 }}>
                                    {adults + children + infants} traveller{adults + children + infants !== 1 ? 's' : ''} selected
                                </p>
                            </div>

                            {/* Done Button */}
                            <button onClick={() => setShowTravellerModal(false)} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Apply</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Flexible Dates Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', marginTop: '12px' }}>
                <input
                    type="checkbox"
                    id="flexible-dates"
                    checked={isFlexibleDates}
                    onChange={(e) => setIsFlexibleDates(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0499ff' }}
                />
                <label htmlFor="flexible-dates" style={{ fontSize: '14px', color: '#333', fontWeight: 500, cursor: 'pointer', margin: 0 }}>
                    I'm flexible with dates ±3 days
                </label>
            </div>

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', marginTop: '6px' }}>
                <button
                    className="search-flights-btn"
                    onClick={handleFlightSearch}
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
                        boxShadow: '0 8px 24px rgba(255, 107, 53, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '280px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 107, 53, 0.45)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.35)';
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

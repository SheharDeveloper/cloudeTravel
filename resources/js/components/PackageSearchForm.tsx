import { useState } from 'react';
import { router } from '@inertiajs/react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';
import VisaServiceForm from '@/components/VisaServiceForm';
import CarRentalForm from '@/components/CarRentalForm';

export default function PackageSearchForm(): React.ReactElement {
    const [tripType, setTripType] = useState('roundtrip');
    const [selectedClass, setSelectedClass] = useState('Economy');
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [hotelCity, setHotelCity] = useState('');
    const [hotelSearch, setHotelSearch] = useState('');
    const [showHotelDropdown, setShowHotelDropdown] = useState(false);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [showPassengerModal, setShowPassengerModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showFlightDatePicker, setShowFlightDatePicker] = useState(false);
    const [showHotelDatePicker, setShowHotelDatePicker] = useState(false);
    const [addVisa, setAddVisa] = useState(false);
    const [addCarRental, setAddCarRental] = useState(false);

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

    const handlePackageSearch = () => {
        if (!fromCity || !toCity || !departureDate || !hotelCity || !checkInDate || !checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        router.post('/search/package', {
            tripType,
            selectedClass,
            fromCity,
            toCity,
            departureDate,
            returnDate: tripType === 'roundtrip' ? returnDate : '',
            hotelCity,
            checkInDate,
            checkOutDate,
            adults,
            children,
            infants,
            rooms,
        });
    };

    return (
        <div>
            {/* Trip Type & Class Dropdowns - Top Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', paddingBottom: '0px', borderBottom: 'none' }}>
                {/* Trip Type Dropdown */}
                <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as 'oneway' | 'roundtrip')}
                    style={{ padding: '10px 16px', border: '2px solid #ddd', borderRadius: '24px', fontSize: '14px', fontWeight: 600, height: '40px', boxSizing: 'border-box', cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.3s ease' }}
                >
                    <option value="oneway">One Way</option>
                    <option value="roundtrip">Round-trip</option>
                </select>

                {/* Class Selector Dropdown */}
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    style={{ padding: '10px 16px', border: '2px solid #ddd', borderRadius: '24px', fontSize: '14px', fontWeight: 600, height: '40px', boxSizing: 'border-box', cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.3s ease' }}
                >
                    {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                    ))}
                </select>
            </div>

            {/* Row 1: From, Swap, To, Departure Dates */}
            <div className="package-search-row1" style={{ display: 'grid', gridTemplateColumns: '1.2fr auto 1.2fr 1.2fr', gap: '16px', marginBottom: '12px', alignItems: 'flex-start', position: 'relative' }}>
                {/* FROM CITY */}
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

                {/* SWAP BUTTON - Centered between From and To */}
                <button
                    onClick={() => {
                        const tempCity = fromCity;
                        setFromCity(toCity);
                        setToCity(tempCity);
                        setFromSearch('');
                        setToSearch('');
                        setShowFromDropdown(false);
                        setShowToDropdown(false);
                    }}
                    style={{ alignSelf: 'flex-end', marginBottom: '6px', background: '#fff', border: '1px solid #ccc', borderRadius: '50%', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', width: '36px', zIndex: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f8ff';
                        e.currentTarget.style.borderColor = '#0066cc';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,102,204,0.2)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >⇄</button>

                {/* TO CITY */}
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

                {/* Flight Dates */}
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Departure</label>
                    <div
                        onClick={() => {
                            setShowFlightDatePicker(!showFlightDatePicker);
                            if (!showFlightDatePicker) setShowHotelDatePicker(false);
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
                                {departureDate ? new Date(departureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Departure'}
                            </div>
                        </div>
                        {tripType === 'roundtrip' && <div style={{ width: '1px', height: '30px', backgroundColor: '#e0e0e0', margin: '0 12px' }}></div>}
                        {tripType === 'roundtrip' && (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                    {returnDate ? new Date(returnDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Return'}
                                </div>
                            </div>
                        )}
                        <div style={{ fontSize: '14px', color: '#999', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    {showFlightDatePicker && (
                        <CalendarDateRangePicker
                            departureDate={departureDate}
                            returnDate={returnDate}
                            tripType={tripType as 'oneway' | 'roundtrip'}
                            onDateChange={(departure, returnDateStr) => {
                                setDepartureDate(departure);
                                setReturnDate(returnDateStr);
                            }}
                            onClose={() => setShowFlightDatePicker(false)}
                        />
                    )}
                </div>
            </div>

            {/* Row 2: Hotel Destination & Hotel Dates */}
            <div className="package-search-row2" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Staying At - Wider width */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Staying At</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-building"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter a destination or property"
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

                {/* Hotel Dates */}
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Hotel Dates</label>
                    <div
                        onClick={() => {
                            setShowHotelDatePicker(!showHotelDatePicker);
                            if (!showHotelDatePicker) setShowFlightDatePicker(false);
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
                        <div style={{ width: '1px', height: '30px', backgroundColor: '#e0e0e0', margin: '0 12px' }}></div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                {checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check-out'}
                            </div>
                        </div>
                        <div style={{ fontSize: '14px', color: '#999', marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>
                    {showHotelDatePicker && (
                        <CalendarDateRangePicker
                            departureDate={checkInDate}
                            returnDate={checkOutDate}
                            tripType="roundtrip"
                            onDateChange={(checkin, checkout) => {
                                setCheckInDate(checkin);
                                setCheckOutDate(checkout);
                            }}
                            onClose={() => setShowHotelDatePicker(false)}
                        />
                    )}
                </div>
            </div>

            {/* Row 3: Passengers & Rooms */}
            <div className="package-search-row3" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Passengers */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Passengers</label>
                    <div
                        onClick={() => {
                            setShowPassengerModal(!showPassengerModal);
                            if (!showPassengerModal) setShowRoomModal(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', padding: '12px 16px', cursor: 'pointer', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>
                                {adults} Adult{adults > 1 ? 's' : ''} • {selectedClass}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                                {children > 0 || infants > 0 ? `${children} Child${children !== 1 ? 'ren' : ''}, ${infants} Infant${infants !== 1 ? 's' : ''}` : 'No children'}
                            </div>
                        </div>
                        <div style={{ fontSize: '16px', color: '#666' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>

                    {/* PASSENGERS MODAL - Adults, Children, Infants & Class */}
                    {showPassengerModal && (
                        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', width: 'clamp(320px, 90vw, 480px)', maxHeight: '650px', overflowY: 'auto', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '18px' }}>Passengers</h3>

                            {/* Adults */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Adults <span style={{ fontSize: '9px', color: '#999' }}>12 yrs or above</span></p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                        <button key={n} onClick={() => setAdults(n)} style={{ background: adults === n ? '#0066cc' : '#fff', color: adults === n ? '#fff' : '#666', border: adults === n ? 'none' : '1px solid #ddd', width: adults === n ? '32px' : '28px', height: adults === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: adults === n ? '11px' : '10px', fontWeight: adults === n ? 700 : 500 }}>{n}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Children */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Children <span style={{ fontSize: '9px', color: '#999' }}>2 - 12 yrs</span></p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                        <button key={n} onClick={() => setChildren(n)} style={{ background: children === n ? '#0066cc' : '#fff', color: children === n ? '#fff' : '#666', border: children === n ? 'none' : '1px solid #ddd', width: children === n ? '32px' : '28px', height: children === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: children === n ? '11px' : '10px', fontWeight: children === n ? 700 : 500 }}>{n}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Infants */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: 600 }}>Infants <span style={{ fontSize: '9px', color: '#999' }}>0 - 2 yrs</span></p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[0, 1, 2, 3, 4].map(n => (
                                        <button key={n} onClick={() => setInfants(n)} style={{ background: infants === n ? '#0066cc' : '#fff', color: infants === n ? '#fff' : '#666', border: infants === n ? 'none' : '1px solid #ddd', width: infants === n ? '32px' : '28px', height: infants === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: infants === n ? '11px' : '10px', fontWeight: infants === n ? 700 : 500 }}>{n}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Class Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '12px', color: '#333', marginBottom: '10px', fontWeight: 600 }}>Class</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['Economy', 'Premium Economy', 'Business'].map(cls => (
                                        <button key={cls} onClick={() => setSelectedClass(cls)} style={{ background: selectedClass === cls ? '#0066cc' : '#fff', color: selectedClass === cls ? '#fff' : '#333', border: '1px solid ' + (selectedClass === cls ? '#0066cc' : '#ddd'), padding: '8px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{cls}</button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setShowPassengerModal(false)} style={{ background: '#ff6b35', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        </div>
                    )}
                </div>

                {/* Rooms */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Rooms</label>
                    <div
                        onClick={() => {
                            setShowRoomModal(!showRoomModal);
                            if (!showRoomModal) setShowPassengerModal(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '54px', border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', padding: '12px 16px', cursor: 'pointer', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d0d0d0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <i className="fa fa-bed" style={{ fontSize: '14px', color: '#0066cc' }}></i>
                            <div style={{ fontSize: '13px', color: '#333', fontWeight: 600 }}>{rooms} Room{rooms > 1 ? 's' : ''}</div>
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            <i className="fa fa-chevron-down"></i>
                        </div>
                    </div>

                    {/* ROOMS MODAL - Only Rooms */}
                    {showRoomModal && (
                        <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: '#fff', width: 'clamp(320px, 90vw, 480px)', maxHeight: '400px', overflowY: 'auto', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '18px' }}>Select Rooms</h3>

                            {/* Rooms */}
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px', fontWeight: 600 }}>Rooms</p>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                        <button key={n} onClick={() => setRooms(n)} style={{ background: rooms === n ? '#0066cc' : '#fff', color: rooms === n ? '#fff' : '#666', border: rooms === n ? 'none' : '1px solid #ddd', width: rooms === n ? '32px' : '28px', height: rooms === n ? '32px' : '28px', borderRadius: '4px', cursor: 'pointer', fontSize: rooms === n ? '11px' : '10px', fontWeight: rooms === n ? 700 : 500 }}>{n}</button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setShowRoomModal(false)} style={{ background: '#ff6b35', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        </div>
                    )}
                </div>

            </div>

            {/* Add-ons Toggles */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '14px', padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#333', fontWeight: 500 }}>
                    <input
                        type="checkbox"
                        checked={addVisa}
                        onChange={(e) => setAddVisa(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>Add Visa Service</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#333', fontWeight: 500 }}>
                    <input
                        type="checkbox"
                        checked={addCarRental}
                        onChange={(e) => setAddCarRental(e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>Add Car Rental</span>
                </label>
            </div>

            {/* Visa Service Component */}
            {addVisa && (
                <div style={{ marginBottom: '14px', padding: '14px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #d0e8ff', position: 'relative', overflow: 'visible', zIndex: 1 }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                        <i className="fa fa-passport"></i> Visa Service
                    </h4>
                    <VisaServiceForm travelDate={departureDate} tripType={tripType} />
                </div>
            )}

            {/* Car Rental Component */}
            {addCarRental && (
                <div style={{ marginBottom: '14px', padding: '14px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                        <i className="fa fa-car"></i> Car Rental
                    </h4>
                    <CarRentalForm />
                </div>
            )}

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', marginTop: '6px' }}>
                <button
                    onClick={handlePackageSearch}
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
                    SEARCH PACKAGE
                </button>
            </div>
        </div>
    );
}

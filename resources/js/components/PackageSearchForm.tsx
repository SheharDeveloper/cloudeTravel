import { useState } from 'react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';
import BookingModal from '@/components/BookingModal';

export default function PackageSearchForm(): React.ReactElement {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedAirport, setSelectedAirport] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [nights, setNights] = useState(7);
    const [showNightsDropdown, setShowNightsDropdown] = useState(false);
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [flexibleDays, setFlexibleDays] = useState(0);
    const [countrySearch, setCountrySearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [airportSearch, setAirportSearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showAirportDropdown, setShowAirportDropdown] = useState(false);

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

    const countryData = [
        {
            code: 'UK',
            name: 'United Kingdom',
            cities: [
                { code: 'LON', name: 'London', airports: [{ code: 'LHR', name: 'London Heathrow' }, { code: 'LGW', name: 'London Gatwick' }] },
                { code: 'MAN', name: 'Manchester', airports: [{ code: 'MAN', name: 'Manchester Airport' }] },
            ]
        },
        {
            code: 'IN',
            name: 'India',
            cities: [
                { code: 'DEL', name: 'Delhi', airports: [{ code: 'DEL', name: 'Indira Gandhi International' }] },
                { code: 'BOM', name: 'Mumbai', airports: [{ code: 'BOM', name: 'Bombay International' }] },
            ]
        },
        {
            code: 'US',
            name: 'United States',
            cities: [
                { code: 'NYC', name: 'New York', airports: [{ code: 'JFK', name: 'John F. Kennedy' }, { code: 'LGA', name: 'LaGuardia' }] },
                { code: 'LAX', name: 'Los Angeles', airports: [{ code: 'LAX', name: 'Los Angeles International' }] },
            ]
        },
        {
            code: 'FR',
            name: 'France',
            cities: [
                { code: 'PAR', name: 'Paris', airports: [{ code: 'CDG', name: 'Charles de Gaulle' }, { code: 'ORY', name: 'Orly' }] },
            ]
        },
        {
            code: 'AE',
            name: 'United Arab Emirates',
            cities: [
                { code: 'DXB', name: 'Dubai', airports: [{ code: 'DXB', name: 'Dubai International' }] },
            ]
        },
        {
            code: 'SG',
            name: 'Singapore',
            cities: [
                { code: 'SIN', name: 'Singapore', airports: [{ code: 'SIN', name: 'Changi Airport' }] },
            ]
        },
    ];

    const getCitiesForCountry = (countryCode: string) => {
        const country = countryData.find(c => c.code === countryCode);
        return country ? country.cities : [];
    };

    const getAllAirports = () => {
        const airports: any[] = [];
        countryData.forEach(country => {
            country.cities.forEach(city => {
                city.airports.forEach(airport => {
                    airports.push(airport);
                });
            });
        });
        return airports;
    };

    const handleSearch = () => {
        if (!selectedCountry || !selectedCity || !selectedAirport || !checkInDate || !checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setSelectedCountry('');
        setSelectedCity('');
        setSelectedAirport('');
        setCheckInDate('');
        setAdults(1);
        setChildren(0);
        setRooms(1);
        setNights(7);
        setFlexibleDays(0);
        setCountrySearch('');
        setCitySearch('');
        setAirportSearch('');
        setShowCountryDropdown(false);
        setShowCityDropdown(false);
        setShowAirportDropdown(false);
    };

    return (
        <div>
            {/* Row 1: Country, City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Country Selector - Searchable */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Country</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-globe"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={countrySearch || (selectedCountry ? countryData.find(c => c.code === selectedCountry)?.name || '' : '')}
                        onChange={(e) => {
                            setCountrySearch(e.target.value);
                            setSelectedCountry('');
                            setSelectedCity('');
                            setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    />
                    {showCountryDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                            {countryData.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(country => (
                                <div
                                    key={country.code}
                                    onClick={() => {
                                        setSelectedCountry(country.code);
                                        setCountrySearch('');
                                        setShowCountryDropdown(false);
                                        setSelectedCity('');
                                    }}
                                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    {country.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* City Selector - Searchable */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>City</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-building"></i>
                    </div>
                    <input
                        type="text"
                        placeholder={selectedCountry ? "Search city..." : "Select country first"}
                        value={citySearch || (selectedCity ? getCitiesForCountry(selectedCountry).find(c => c.code === selectedCity)?.name || '' : '')}
                        onChange={(e) => {
                            setCitySearch(e.target.value);
                            setSelectedCity('');
                            setShowCityDropdown(true);
                        }}
                        onFocus={() => selectedCountry && setShowCityDropdown(true)}
                        disabled={!selectedCountry}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s', opacity: selectedCountry ? 1 : 0.6, cursor: selectedCountry ? 'text' : 'not-allowed' }}
                        onMouseEnter={(e) => selectedCountry && (e.currentTarget.style.borderColor = '#ccc')}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    />
                    {showCityDropdown && selectedCountry && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                            {getCitiesForCountry(selectedCountry).filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase())).map(city => (
                                <div
                                    key={city.code}
                                    onClick={() => {
                                        setSelectedCity(city.code);
                                        setCitySearch('');
                                        setShowCityDropdown(false);
                                    }}
                                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    {city.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2: Airport, Check-in Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                {/* Airport Selector - All Airports, Searchable */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 600 }}>Airport</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-plane"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search airport..."
                        value={airportSearch || (selectedAirport ? getAllAirports().find(a => a.code === selectedAirport)?.code + ' - ' + getAllAirports().find(a => a.code === selectedAirport)?.name || '' : '')}
                        onChange={(e) => {
                            setAirportSearch(e.target.value);
                            setSelectedAirport('');
                            setShowAirportDropdown(true);
                        }}
                        onFocus={() => setShowAirportDropdown(true)}
                        style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '13px', height: '54px', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    />
                    {showAirportDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                            {getAllAirports().filter(a => a.code.toLowerCase().includes(airportSearch.toLowerCase()) || a.name.toLowerCase().includes(airportSearch.toLowerCase())).map(airport => (
                                <div
                                    key={airport.code}
                                    onClick={() => {
                                        setSelectedAirport(airport.code);
                                        setAirportSearch('');
                                        setShowAirportDropdown(false);
                                    }}
                                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    <strong>{airport.code}</strong> - {airport.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Check-in Date */}
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

            {/* Row 3: Nights, Guests */}
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
                            {adults} Adult{adults !== 1 ? 's' : ''} • {children} Child{children !== 1 ? 'ren' : ''} • {rooms} Room{rooms !== 1 ? 's' : ''}
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

                            {/* Children Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>Children (Age 0-12)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                        style={{ width: '36px', height: '36px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 600, color: '#333' }}
                                    >
                                        −
                                    </button>
                                    <span style={{ flex: 1, textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>{children}</span>
                                    <button
                                        onClick={() => setChildren(Math.min(6, children + 1))}
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

            {/* Row 3: Flexible Days Checkbox */}
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: '#333' }}>
                    <input
                        type="checkbox"
                        checked={flexibleDays === 3}
                        onChange={(e) => setFlexibleDays(e.target.checked ? 3 : 0)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: 500 }}>I'm flexible with dates ±3 days</span>
                </label>
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
                    selectedCountry,
                    selectedCity,
                    selectedAirport,
                    checkInDate,
                    checkOutDate,
                    nights,
                    adults,
                    children,
                    rooms,
                    flexibleDays,
                }}
                serviceType="package"
            />
        </div>
    );
}

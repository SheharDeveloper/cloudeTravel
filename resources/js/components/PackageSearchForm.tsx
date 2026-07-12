import { useState, useRef, useEffect } from 'react';
import CalendarDateRangePicker from '@/components/CalendarDateRangePicker';
import BookingModal from '@/components/BookingModal';
import { countryService } from '@/services/countryService';

interface PackageSearchFormProps {
    onCountrySelect?: (country: string) => void;
}

export default function PackageSearchForm({ onCountrySelect }: PackageSearchFormProps): React.ReactElement {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCountryName, setSelectedCountryName] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedAirport, setSelectedAirport] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [nights, setNights] = useState(7);
    const [showNightsDropdown, setShowNightsDropdown] = useState(false);
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [flexibleDays, setFlexibleDays] = useState(0);
    const [countrySearch, setCountrySearch] = useState('');
    const [airportSearch, setAirportSearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showAirportDropdown, setShowAirportDropdown] = useState(false);
    const [apiCountries, setApiCountries] = useState<any[]>([]);

    const countryRef = useRef<HTMLDivElement>(null);
    const airportRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const guestModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setShowCountryDropdown(false);
            }
            if (airportRef.current && !airportRef.current.contains(event.target as Node)) {
                setShowAirportDropdown(false);
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCheckInCalendar(false);
            }
            if (guestModalRef.current && !guestModalRef.current.contains(event.target as Node)) {
                setShowGuestModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            const data = await countryService.getAllCountries();
            setApiCountries(data);
        };
        fetchCountries();
    }, []);

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

    const filterCountries = (search: string) => {
        if (!search || !apiCountries.length) return apiCountries;
        return apiCountries.filter((country: any) =>
            country.code.toLowerCase().includes(search.toLowerCase()) ||
            country.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const airportList = [
        { code: 'LHR', name: 'London Heathrow' },
        { code: 'CDG', name: 'Paris Charles de Gaulle' },
        { code: 'JFK', name: 'New York JFK' },
        { code: 'NRT', name: 'Tokyo Narita' },
        { code: 'DXB', name: 'Dubai International' },
        { code: 'SIN', name: 'Singapore Changi' },
        { code: 'BOM', name: 'Mumbai International' },
        { code: 'SYD', name: 'Sydney Kingsford Smith' },
    ];

    const handleSearch = () => {
        if (!selectedCountry || !selectedCity || !selectedAirport || !checkInDate || !checkOutDate) {
            alert('Please fill in all required fields');
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setShowCountryDropdown(false);
        setShowAirportDropdown(false);
    };

    const handleBookingSuccess = () => {
        setSelectedCountry('');
        setSelectedCountryName('');
        setSelectedCity('');
        setSelectedAirport('');
        setCheckInDate('');
        setAdults(1);
        setChildren(0);
        setRooms(1);
        setNights(7);
        setFlexibleDays(0);
        setCountrySearch('');
        setAirportSearch('');
        setShowCountryDropdown(false);
        setShowAirportDropdown(false);
    };

    return (
        <div>
            {/* Row 1: Country, City, and Airport - 3 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                {/* Country Selector - Searchable */}
                <div ref={countryRef} style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#000000', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Where</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#000000', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-globe"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={countrySearch || selectedCountryName}
                        onChange={(e) => {
                            setCountrySearch(e.target.value);
                            setSelectedCountry('');
                            setSelectedCountryName('');
                            setShowCountryDropdown(true);
                        }}
                        onFocus={(e) => {
                            setShowCountryDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        style={{ width: '100%', padding: '8px 12px 8px 40px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                    />
                    {showCountryDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                            {filterCountries(countrySearch).length > 0 ? (
                                filterCountries(countrySearch).map((country: any) => (
                                    <div
                                        key={country.code}
                                        onClick={() => {
                                            setSelectedCountry(country.code);
                                            setSelectedCountryName(country.name);
                                            onCountrySelect?.(country.name);
                                            setCountrySearch('');
                                            setShowCountryDropdown(false);
                                        }}
                                        style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#000000', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <strong>{country.code}</strong> - {country.name}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#000000', fontSize: '13px', textAlign: 'center' }}>No countries found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* City Input - Fillable Text Field */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#000000', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#000000', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-building"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter city name..."
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        style={{ width: '100%', padding: '8px 12px 8px 40px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                    />
                </div>

                {/* Airport Selector */}
                <div ref={airportRef} style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#000000', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Airport</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#000000', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-plane"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search airport..."
                        value={airportSearch || (selectedAirport ? airportList.find((a: any) => a.code === selectedAirport)?.code + ' - ' + airportList.find((a: any) => a.code === selectedAirport)?.name || '' : '')}
                        onChange={(e) => {
                            setAirportSearch(e.target.value);
                            setSelectedAirport('');
                            setShowAirportDropdown(true);
                        }}
                        onFocus={(e) => {
                            setShowAirportDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        style={{ width: '100%', padding: '8px 12px 8px 40px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', height: '40px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                    />
                    {showAirportDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                            {airportList.filter((a: any) => a.code.toLowerCase().includes(airportSearch.toLowerCase()) || a.name.toLowerCase().includes(airportSearch.toLowerCase())).map((airport: any) => (
                                <div
                                    key={airport.code}
                                    onClick={() => {
                                        setSelectedAirport(airport.code);
                                        setAirportSearch('');
                                        setShowAirportDropdown(false);
                                    }}
                                    style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#000000', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    <strong>{airport.code}</strong> - {airport.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ROW 2: Check-in Date, Nights, Guests - 3 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                {/* Check-in Date */}
                <div ref={calendarRef} style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '4px', fontWeight: 600 }}>Check-in Date</label>
                    <div
                        onClick={() => {
                            setShowCheckInCalendar(!showCheckInCalendar);
                            setShowNightsDropdown(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', height: '40px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', transition: 'border-color 0.3s', cursor: 'pointer', padding: '0 12px' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <div style={{ fontSize: '13px', color: '#000000', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-calendar"></i>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#000000', fontWeight: 600 }}>
                                {checkInDate ? new Date(checkInDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check-in'}
                            </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#000000', marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
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

                {/* Nights Selector */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '4px', fontWeight: 600 }}>Nights</label>
                    <div
                        onClick={() => setShowNightsDropdown(!showNightsDropdown)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '40px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', padding: '0 12px', cursor: 'pointer', transition: 'border-color 0.3s', position: 'relative' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fa fa-moon" style={{ marginRight: '8px', color: '#000000' }}></i>
                            <span style={{ fontSize: '12px', color: '#000000', fontWeight: 600 }}>{nights} night{nights !== 1 ? 's' : ''}</span>
                        </div>
                        <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: '#000000' }}></i>
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
                <div ref={guestModalRef} style={{ position: 'relative', width: '100%' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '4px', fontWeight: 600 }}>Guests & Rooms</label>
                    <div
                        onClick={() => setShowGuestModal(!showGuestModal)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '40px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', padding: '0 12px', cursor: 'pointer', transition: 'border-color 0.3s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ccc'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                    >
                        <div style={{ fontSize: '13px', color: '#000000', fontWeight: 600 }}>
                            <i className="fa fa-users" style={{ marginRight: '8px', color: '#0066cc' }}></i>
                            {adults} Adult{adults !== 1 ? 's' : ''} • {children} Child{children !== 1 ? 'ren' : ''} • {rooms} Room{rooms !== 1 ? 's' : ''}
                        </div>
                        <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: '#000000' }}></i>
                    </div>

                    {/* Guest & Room Selector Modal */}
                    {showGuestModal && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '12px', boxShadow: '0 12px 48px rgba(0,0,0,.3)', zIndex: 9999, border: '1px solid #e0e0e0', padding: '24px' }}>
                            {/* Rooms Selection */}
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#000000', margin: 0, fontWeight: 600 }}>Rooms</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setRooms(Math.max(1, rooms - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#000000', minWidth: '24px', textAlign: 'center' }}>{rooms}</span>
                                        <button onClick={() => setRooms(Math.min(8, rooms + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Adults Selection */}
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#000000', margin: 0, fontWeight: 600 }}>Adults</p>
                                        <p style={{ fontSize: '11px', color: '#000000', margin: '4px 0 0 0' }}>18 yrs or above</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setAdults(Math.max(1, adults - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#000000', minWidth: '24px', textAlign: 'center' }}>{adults}</span>
                                        <button onClick={() => setAdults(Math.min(8, adults + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Children Selection */}
                            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#000000', margin: 0, fontWeight: 600 }}>Children</p>
                                        <p style={{ fontSize: '11px', color: '#000000', margin: '4px 0 0 0' }}>0 - 17 yrs</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setChildren(Math.max(0, children - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#000000', minWidth: '24px', textAlign: 'center' }}>{children}</span>
                                        <button onClick={() => setChildren(Math.min(6, children + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Infants Selection */}
                            <div style={{ marginBottom: '20px', paddingBottom: '0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', color: '#000000', margin: 0, fontWeight: 600 }}>Infants</p>
                                        <p style={{ fontSize: '11px', color: '#000000', margin: '4px 0 0 0' }}>Under 2 yrs</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setInfants(Math.max(0, infants - 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#000000', minWidth: '24px', textAlign: 'center' }}>{infants}</span>
                                        <button onClick={() => setInfants(Math.min(6, infants + 1))} style={{ background: '#0499ff', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '4px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowGuestModal(false)}
                                style={{ width: '100%', padding: '12px', background: '#0499ff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginTop: '20px' }}
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Row 3: Flexible Days Checkbox */}
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '13px', color: '#000000' }}>
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
                onSuccess={handleBookingSuccess}
                searchDetails={{
                    selectedCountry: selectedCountryName,
                    selectedCity,
                    selectedAirport: selectedAirport ? `${selectedAirport} - ${airportList.find((a: any) => a.code === selectedAirport)?.name}` : '',
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

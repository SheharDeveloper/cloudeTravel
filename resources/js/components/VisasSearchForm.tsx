import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';

export default function VisasSearchForm(): React.ReactElement {
    const [destinationCountry, setDestinationCountry] = useState('');
    const [passportCountry, setPassportCountry] = useState('');
    const [visaType, setVisaType] = useState('');
    const [numberOfTravelers, setNumberOfTravelers] = useState(1);
    const [travelDate, setTravelDate] = useState('');
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
    const [showPassportDropdown, setShowPassportDropdown] = useState(false);
    const [destinationSearch, setDestinationSearch] = useState('');
    const [passportSearch, setPassportSearch] = useState('');
    const [visaTypesList, setVisaTypesList] = useState<any[]>([]);
    const [visaSearch, setVisaSearch] = useState('');
    const [showVisaDropdown, setShowVisaDropdown] = useState(false);

    // Refs for click-outside detection
    const destinationRef = useRef<HTMLDivElement>(null);
    const passportRef = useRef<HTMLDivElement>(null);
    const visaRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Close destination dropdown if clicked outside
            if (destinationRef.current && !destinationRef.current.contains(target)) {
                setShowDestinationDropdown(false);
            }
            // Close passport dropdown if clicked outside
            if (passportRef.current && !passportRef.current.contains(target)) {
                setShowPassportDropdown(false);
            }
            // Close visa dropdown if clicked outside
            if (visaRef.current && !visaRef.current.contains(target)) {
                setShowVisaDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch visa types from API
    useEffect(() => {
        const fetchVisaTypes = async () => {
            try {
                const response = await fetch('/api/visas');
                const result = await response.json();

                if (result.data) {
                    setVisaTypesList(result.data);
                    // Don't auto-select first visa - let user choose
                }
            } catch (error) {
                console.error('Error fetching visa types:', error);
                setVisaTypesList([]);
            }
        };

        fetchVisaTypes();
    }, []);

    const countryList = [
        { code: 'GB', name: 'United Kingdom' },
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'NZ', name: 'New Zealand' },
        { code: 'IN', name: 'India' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'JP', name: 'Japan' },
        { code: 'SG', name: 'Singapore' },
        { code: 'AE', name: 'United Arab Emirates' },
        { code: 'SG', name: 'Singapore' },
    ];

    const filterCountries = (search: string) => {
        if (!search) return countryList;
        return countryList.filter(country =>
            country.code.toLowerCase().includes(search.toLowerCase()) ||
            country.name.toLowerCase().includes(search.toLowerCase())
        );
    };

    const handleVisaSearch = () => {
        if (!destinationCountry || !passportCountry || !travelDate) {
            alert('Please fill in all required fields');
            return;
        }

        router.post('/search/visa', {
            destinationCountry,
            passportCountry,
            visaType,
            numberOfTravelers,
            travelDate,
        });
    };

    return (
        <div>
            {/* Row 1: Destination Country, Passport Country, Visa Type, Travel Date - 4 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'flex-start', position: 'relative' }}>
                {/* Destination Country */}
                <div ref={destinationRef} style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>DESTINATION</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-globe"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search destination..."
                        value={destinationCountry ? `${countryList.find(c => c.code === destinationCountry)?.code} - ${countryList.find(c => c.code === destinationCountry)?.name}` : destinationSearch}
                        onChange={(e) => {
                            setDestinationSearch(e.target.value);
                            setDestinationCountry('');
                            setShowDestinationDropdown(true);
                        }}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                        onFocus={(e) => {
                            setShowDestinationDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    {showDestinationDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterCountries(destinationSearch).length > 0 ? (
                                filterCountries(destinationSearch).map(country => (
                                    <div
                                        key={country.code}
                                        onClick={() => {
                                            setDestinationCountry(country.code);
                                            setDestinationSearch('');
                                            setShowDestinationDropdown(false);
                                        }}
                                        style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <strong>{country.code}</strong> - {country.name}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No countries found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Passport Country */}
                <div ref={passportRef} style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>PASSPORT</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '18px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-passport"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Search passport country..."
                        value={passportCountry ? `${countryList.find(c => c.code === passportCountry)?.code} - ${countryList.find(c => c.code === passportCountry)?.name}` : passportSearch}
                        onChange={(e) => {
                            setPassportSearch(e.target.value);
                            setPassportCountry('');
                            setShowPassportDropdown(true);
                        }}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                        onFocus={(e) => {
                            setShowPassportDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    {showPassportDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                            {filterCountries(passportSearch).length > 0 ? (
                                filterCountries(passportSearch).map(country => (
                                    <div
                                        key={country.code}
                                        onClick={() => {
                                            setPassportCountry(country.code);
                                            setPassportSearch('');
                                            setShowPassportDropdown(false);
                                        }}
                                        style={{ padding: '12px 12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <strong>{country.code}</strong> - {country.name}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No countries found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Visa Type - Searchable Dropdown */}
                <div ref={visaRef} style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VISA TYPE</label>
                    <div style={{ position: 'absolute', left: '16px', top: 'calc(50% + 14px)', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                        <i className="fa fa-passport"></i>
                    </div>
                    <input
                        type="text"
                        placeholder="Select /Search Visa Type"
                        value={visaType ? visaTypesList.find(v => v.name === visaType)?.name || visaSearch : visaSearch}
                        onChange={(e) => {
                            setVisaSearch(e.target.value);
                            setVisaType('');
                            setShowVisaDropdown(true);
                        }}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                        onFocus={(e: any) => {
                            setShowVisaDropdown(true);
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                        }}
                        onBlur={(e: any) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    {showVisaDropdown && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', background: '#fff', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,.12)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                            {visaTypesList.filter(visa =>
                                visa.title.toLowerCase().includes(visaSearch.toLowerCase()) ||
                                visa.name.toLowerCase().includes(visaSearch.toLowerCase())
                            ).length > 0 ? (
                                visaTypesList.filter(visa =>
                                    visa.title.toLowerCase().includes(visaSearch.toLowerCase()) ||
                                    visa.name.toLowerCase().includes(visaSearch.toLowerCase())
                                ).map(visa => (
                                    <div
                                        key={visa.id}
                                        onClick={() => {
                                            setVisaType(visa.name);
                                            setVisaSearch('');
                                            setShowVisaDropdown(false);
                                        }}
                                        style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '13px', color: '#333', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <strong>{visa.name}</strong>
                                        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{visa.title}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', color: '#999', fontSize: '13px', textAlign: 'center' }}>No visas found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Travel Date */}
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>WHEN</label>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none', zIndex: 5 }}>
                            <i className="fa fa-calendar"></i>
                        </div>
                        <input
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                            onFocus={(e: any) => {
                                e.currentTarget.style.borderColor = '#0499ff';
                                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                            }}
                            onBlur={(e: any) => {
                                e.currentTarget.style.borderColor = '#ddd';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Row 2: Number of Travelers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>TRAVELERS</label>
                    <select
                        value={numberOfTravelers}
                        onChange={(e) => setNumberOfTravelers(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '16px 16px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s' }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0px', marginTop: '6px' }}>
                <button
                    onClick={handleVisaSearch}
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
                    SEARCH VISAS
                </button>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function VisasSearchForm(): React.ReactElement {
    const [destinationCountry, setDestinationCountry] = useState('');
    const [passportCountry, setPassportCountry] = useState('');
    const [visaType, setVisaType] = useState('tourist');
    const [numberOfTravelers, setNumberOfTravelers] = useState(1);
    const [travelDate, setTravelDate] = useState('');
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
    const [showPassportDropdown, setShowPassportDropdown] = useState(false);
    const [destinationSearch, setDestinationSearch] = useState('');
    const [passportSearch, setPassportSearch] = useState('');

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

    const visaTypes = [
        { value: 'tourist', label: 'Tourist Visa' },
        { value: 'business', label: 'Business Visa' },
        { value: 'student', label: 'Student Visa' },
        { value: 'work', label: 'Work Visa' },
        { value: 'family', label: 'Family Visit Visa' },
        { value: 'multiple', label: 'Multiple Entry Visa' },
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
                <div style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
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
                        onFocus={() => setShowDestinationDropdown(true)}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                        onFocus={(e) => {
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
                <div style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
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
                        onFocus={() => setShowPassportDropdown(true)}
                        style={{ width: '100%', padding: '16px 16px 16px 50px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '15px', height: '58px', boxSizing: 'border-box', transition: 'all 0.3s', fontWeight: 500 }}
                        onFocus={(e) => {
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

                {/* Visa Type */}
                <div style={{ width: '100%', position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#0499ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VISA TYPE</label>
                    <select
                        value={visaType}
                        onChange={(e) => setVisaType(e.target.value)}
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
                        {visaTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
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
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#0499ff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(4, 153, 255, 0.1)';
                        }}
                        onBlur={(e) => {
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

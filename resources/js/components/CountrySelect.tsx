import { useState, useEffect, useRef } from 'react';
import { countryService } from '@/services/countryService';

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

export default function CountrySelect({
    value,
    onChange,
    placeholder = 'Select Country',
    style = {}
}: CountrySelectProps) {
    const [countries, setCountries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await countryService.getAllCountries();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const defaultStyle = {
        padding: '8px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'inherit',
        ...style
    };

    const selectedCountryName = countries.find(c => c.name === value)?.name || value || placeholder;

    return (
        <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <input
                type="text"
                value={isOpen ? searchTerm : selectedCountryName}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isOpen) setIsOpen(true);
                }}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setSearchTerm('');
                }}
                placeholder={placeholder}
                disabled={loading}
                style={{
                    ...defaultStyle,
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            />

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 9999,
                        marginTop: '4px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                >
                    <div
                        style={{
                            padding: '8px',
                            borderBottom: '1px solid #e5e7eb',
                            position: 'sticky',
                            top: 0,
                            backgroundColor: 'white'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '8px 10px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontFamily: 'inherit',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <div
                                    key={country.code}
                                    onClick={() => {
                                        onChange(country.name);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        backgroundColor: value === country.name ? '#f0f0f0' : 'transparent',
                                        borderBottom: '1px solid #f0f0f0',
                                        transition: 'background-color 0.2s',
                                        fontSize: '13px',
                                        color: '#333'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = value === country.name ? '#f0f0f0' : 'transparent';
                                    }}
                                >
                                    {country.name}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '12px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

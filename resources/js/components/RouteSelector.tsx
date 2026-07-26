import { useState, useEffect, useRef } from 'react';
import CountrySelect from './CountrySelect';

interface RouteSelectorProps {
    value: string;
    onChange: (route: string) => void;
}

export default function RouteSelector({ value, onChange }: RouteSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [routeType, setRouteType] = useState<'domestic' | 'international'>('international');
    const [country, setCountry] = useState('');
    const [fromCountry, setFromCountry] = useState('');
    const [toCountry, setToCountry] = useState('');
    const [fromAirport, setFromAirport] = useState('');
    const [toAirport, setToAirport] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

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

    const handleConfirm = () => {
        if (routeType === 'domestic') {
            if (country && fromAirport && toAirport) {
                const route = `${fromAirport}, ${country} → ${toAirport}, ${country}`;
                onChange(route);
                setIsOpen(false);
            }
        } else {
            if (fromCountry && toCountry && fromAirport && toAirport) {
                const route = `${fromAirport}, ${fromCountry} → ${toAirport}, ${toCountry}`;
                onChange(route);
                setIsOpen(false);
            }
        }
    };

    const canConfirm = routeType === 'domestic'
        ? country && fromAirport && toAirport
        : fromCountry && toCountry && fromAirport && toAirport;

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                value={value}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                placeholder="Click to select route"
                style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                }}
            />

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        zIndex: 10000,
                        padding: '24px',
                        minWidth: '500px',
                        maxWidth: '600px'
                    }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#1f2937' }}>Select Route</h3>

                    {/* Route Type Selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Route Type</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="routeType"
                                    value="domestic"
                                    checked={routeType === 'domestic'}
                                    onChange={() => {
                                        setRouteType('domestic');
                                        setCountry('');
                                        setFromCountry('');
                                        setToCountry('');
                                        setFromAirport('');
                                        setToAirport('');
                                    }}
                                    style={{ marginRight: '6px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '13px' }}>Domestic</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="routeType"
                                    value="international"
                                    checked={routeType === 'international'}
                                    onChange={() => {
                                        setRouteType('international');
                                        setCountry('');
                                        setFromCountry('');
                                        setToCountry('');
                                        setFromAirport('');
                                        setToAirport('');
                                    }}
                                    style={{ marginRight: '6px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '13px' }}>International</span>
                            </label>
                        </div>
                    </div>

                    {/* Domestic Route */}
                    {routeType === 'domestic' && (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Country</label>
                                <CountrySelect
                                    value={country}
                                    onChange={setCountry}
                                    placeholder="Select country"
                                />
                            </div>

                            {country && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>From Airport</label>
                                        <input
                                            type="text"
                                            value={fromAirport}
                                            onChange={(e) => setFromAirport(e.target.value)}
                                            placeholder="Enter airport name or code (e.g., LHR, London Heathrow)"
                                            style={{
                                                width: '100%',
                                                padding: '8px 10px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontFamily: 'inherit',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>To Airport</label>
                                        <input
                                            type="text"
                                            value={toAirport}
                                            onChange={(e) => setToAirport(e.target.value)}
                                            placeholder="Enter airport name or code (e.g., CDG, Paris Charles de Gaulle)"
                                            style={{
                                                width: '100%',
                                                padding: '8px 10px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontFamily: 'inherit',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* International Route */}
                    {routeType === 'international' && (
                        <>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>From Country</label>
                                <CountrySelect
                                    value={fromCountry}
                                    onChange={setFromCountry}
                                    placeholder="Select departure country"
                                />
                            </div>

                            {fromCountry && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>From Airport</label>
                                    <input
                                        type="text"
                                        value={fromAirport}
                                        onChange={(e) => setFromAirport(e.target.value)}
                                        placeholder="Enter airport name or code"
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>To Country</label>
                                <CountrySelect
                                    value={toCountry}
                                    onChange={setToCountry}
                                    placeholder="Select destination country"
                                />
                            </div>

                            {toCountry && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>To Airport</label>
                                    <input
                                        type="text"
                                        value={toAirport}
                                        onChange={(e) => setToAirport(e.target.value)}
                                        placeholder="Enter airport name or code"
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '8px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                backgroundColor: '#f3f4f6',
                                fontSize: '13px',
                                fontWeight: 600
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!canConfirm}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: !canConfirm ? 'not-allowed' : 'pointer',
                                backgroundColor: !canConfirm ? '#d1d5db' : '#6d28d9',
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: 600
                            }}
                        >
                            Confirm Route
                        </button>
                    </div>
                </div>
            )}

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 9999
                    }}
                />
            )}
        </div>
    );
}

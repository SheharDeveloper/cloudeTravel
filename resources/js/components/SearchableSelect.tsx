import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    options: Array<{ code: string; name: string }>;
    placeholder?: string;
    disabled?: boolean;
}

export default function SearchableSelect({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "Search and select...",
    disabled = false
}: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionName: string) => {
        setSearchTerm('');
        setShowDropdown(false);
        
        // Create a synthetic event to match the onChange handler
        const event = {
            target: {
                name,
                value: optionName,
                type: 'select-one'
            }
        };
        onChange(event);
    };

    return (
        <div className="mb-3" ref={containerRef}>
            <label className="form-label">{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={showDropdown ? searchTerm : value}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    disabled={disabled}
                    autoComplete="off"
                    style={{
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        backgroundColor: disabled ? '#f9f9f9' : '#fff'
                    }}
                />
                
                {showDropdown && !disabled && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderTop: 'none',
                            borderRadius: '0 0 4px 4px',
                            maxHeight: '250px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option.code}
                                    onClick={() => handleSelect(option.name)}
                                    style={{
                                        padding: '10px 15px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: value === option.name ? '#e8f4f8' : '#fff',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = value === option.name ? '#e8f4f8' : '#fff';
                                    }}
                                >
                                    <div style={{ fontWeight: 500 }}>{option.name}</div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>{option.code}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '10px 15px', color: '#999' }}>
                                No countries found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';

interface CountryOption {
    id: number;
    countryName: string;
    countryCode: string;
    flag_url?: string;
}

interface CountrySelectProps {
    // The chosen country's name (what the travel quote stores)
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

/**
 * Searchable country box, the same as Visas → Create (flag, name and code):
 * lists the countries from Country Management (the page's `countries` prop).
 * Stores the country's name.
 */
export default function CountrySelect({ value, onChange, placeholder = 'Select Country', style = {} }: CountrySelectProps) {
    const countries = ((usePage().props as { countries?: CountryOption[] }).countries ?? []);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = countries.find((c) => c.countryName.toLowerCase() === (value || '').toLowerCase()) || null;
    const q = search.trim().toLowerCase();
    const filtered = q === ''
        ? countries
        : countries.filter((c) => c.countryName.toLowerCase().includes(q) || c.countryCode.toLowerCase().includes(q));

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const choose = (name: string) => {
        onChange(name);
        setOpen(false);
        setSearch('');
    };

    const hideBrokenFlag = (e: React.SyntheticEvent<HTMLImageElement>) => {
        (e.target as HTMLImageElement).style.visibility = 'hidden';
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {!open && selected?.flag_url && (
                <img
                    src={selected.flag_url}
                    alt=""
                    width={22}
                    height={16}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', objectFit: 'cover', borderRadius: 2, pointerEvents: 'none' }}
                    onError={hideBrokenFlag}
                />
            )}
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                // A name saved before (not in the list) still shows as typed
                value={open ? search : (selected?.countryName || value || '')}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => { setOpen(true); setSearch(''); }}
                autoComplete="off"
                // Same size as the travel quote form's other inputs
                style={{
                    padding: '8px 10px',
                    fontSize: 13,
                    borderRadius: 8,
                    ...style,
                    ...(!open && selected?.flag_url ? { paddingLeft: 42 } : {}),
                }}
            />
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        marginTop: 4,
                        backgroundColor: '#fff',
                        color: '#1f2937',
                        border: '1px solid #d5d9e6',
                        borderRadius: 8,
                        maxHeight: 240,
                        overflowY: 'auto',
                        boxShadow: '0 4px 14px rgba(20,20,50,0.08)',
                        fontSize: 14,
                    }}
                >
                    {value && (
                        <div onClick={() => choose('')} style={{ padding: '8px 14px', cursor: 'pointer', color: '#6b7280', backgroundColor: '#fff' }}>
                            None
                        </div>
                    )}
                    {filtered.length > 0 ? (
                        filtered.map((country) => (
                            <div
                                key={country.id}
                                onClick={() => choose(country.countryName)}
                                style={{
                                    padding: '8px 14px',
                                    cursor: 'pointer',
                                    color: '#1f2937',
                                    borderTop: '1px solid #f0f1f6',
                                    backgroundColor: selected?.id === country.id ? '#eef0ff' : '#fff',
                                }}
                            >
                                {country.flag_url && (
                                    <img
                                        src={country.flag_url}
                                        alt=""
                                        width={22}
                                        height={16}
                                        style={{ marginRight: 10, objectFit: 'cover', borderRadius: 2, verticalAlign: 'middle' }}
                                        onError={hideBrokenFlag}
                                    />
                                )}
                                {country.countryName}
                                <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af' }}>{country.countryCode}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '8px 14px', color: '#6b7280', backgroundColor: '#fff' }}>No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}

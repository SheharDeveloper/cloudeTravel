import { useState, useEffect, useRef } from 'react';

/**
 * Searchable dropdown that resolves to an id rather than a display string —
 * needed for foreign keys like visa_type_id / *_country_id, unlike the
 * name-based SearchableSelect used for flight/package search.
 */
export default function IdSearchSelect({
    label,
    value,
    options,
    placeholder,
    onChange,
}: {
    label: string;
    value: number | null;
    options: { id: number; label: string; sublabel?: string; flag?: string }[];
    placeholder: string;
    onChange: (id: number | null) => void;
}) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = options.find(o => o.id === value) || null;

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.sublabel || '').toLowerCase().includes(search.toLowerCase())
    );

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

    return (
        <div className="mb-3" ref={containerRef}>
            <label className="form-label">{label}</label>
            <div style={{ position: 'relative' }}>
                {!open && selected?.flag && (
                    <img
                        src={selected.flag}
                        alt=""
                        width={22}
                        height={16}
                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', objectFit: 'cover', borderRadius: 2, pointerEvents: 'none' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                )}
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={open ? search : (selected?.label || '')}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => { setOpen(true); setSearch(''); }}
                    autoComplete="off"
                    style={!open && selected?.flag ? { paddingLeft: 42 } : undefined}
                />
                {open && (
                    // Rendered in normal flow (not absolutely positioned) so no parent
                    // overflow or stacking rule can clip or hide the list.
                    <div
                        style={{
                            marginTop: 4,
                            backgroundColor: '#fff',
                            color: '#1f2937',
                            border: '1px solid #d5d9e6',
                            borderRadius: 8,
                            maxHeight: 220,
                            overflowY: 'auto',
                            boxShadow: '0 4px 14px rgba(20,20,50,0.08)',
                            fontSize: 14,
                        }}
                    >
                        <div
                            onClick={() => { onChange(null); setOpen(false); setSearch(''); }}
                            style={{ padding: '8px 14px', cursor: 'pointer', color: '#6b7280', backgroundColor: '#fff' }}
                        >
                            None
                        </div>
                        {filtered.length > 0 ? (
                            filtered.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => { onChange(option.id); setOpen(false); setSearch(''); }}
                                    style={{
                                        padding: '8px 14px',
                                        cursor: 'pointer',
                                        color: '#1f2937',
                                        borderTop: '1px solid #f0f1f6',
                                        backgroundColor: option.id === value ? '#eef0ff' : '#fff',
                                    }}
                                >
                                    {option.flag && (
                                        <img
                                            src={option.flag}
                                            alt=""
                                            width={22}
                                            height={16}
                                            style={{ marginRight: 10, objectFit: 'cover', borderRadius: 2, verticalAlign: 'middle' }}
                                            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                                        />
                                    )}
                                    {option.label}
                                    {option.sublabel && (
                                        <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af' }}>{option.sublabel}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '8px 14px', color: '#6b7280', backgroundColor: '#fff' }}>No results found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import VisaDescription from '@/components/VisaDescription';

interface Country {
    id: number;
    uid: string;
    countryName: string;
    countryCode: string;
    flag_url?: string;
}

interface CostRow {
    id?: number;
    type?: string | null;
    validation_process?: string | null;
    processing_time?: string | null;
    embassy_fee?: string | number | null;
    service_fee?: string | number | null;
    credit_amount?: string | number | null;
    total_cost?: string | number | null;
}

interface VisaResult {
    id: number;
    uid: string;
    name: string | null;
    title: string;
    description?: string | null;
    image?: string | null;
    visa_type?: { name: string } | null;
    category?: { name: string } | null;
    origin_country?: Country | null;
    destination_country?: Country | null;
    cost_details?: CostRow[];
}

export interface VisaRequirementsProps {
    countries: Country[];
    filters: { from: string | null; to: string | null };
    searched: boolean;
    visas: VisaResult[];
    contact?: { phone?: string | null; email?: string | null } | null;
    currency?: { symbol: string };
    /** Page the search submits to (public or admin route). */
    basePath: string;
    /** When set, Check Requirements opens this results page instead of showing results in place. */
    resultPath?: string;
}

const ACCENT = '#29a9e0';
const RED = '#b8161f';
const BORDER = '#cfe3ee';
const HERO_IMAGE = 'https://www.goodwind.in/static/images/world-bg.jpg';

/** Searchable country picker with flags; keeps the value as a country uid. */
function CountrySelect({
    label,
    value,
    countries,
    onChange,
}: {
    label: string;
    value: string | null;
    countries: Country[];
    onChange: (uid: string | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const box = useRef<HTMLDivElement>(null);
    const selected = countries.find((country) => country.uid === value) ?? null;

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const matches = useMemo(() => {
        const term = query.trim().toLowerCase();
        return term ? countries.filter((country) => country.countryName.toLowerCase().includes(term)) : countries;
    }, [countries, query]);

    return (
        <div ref={box} style={{ position: 'relative', flex: '1 1 260px', minWidth: 240 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#111' }}>{label}</label>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-haspopup="listbox"
                aria-expanded={open}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 16px',
                    background: '#fff',
                    border: `1px solid ${selected ? '#ced4da' : '#e5533d'}`,
                    borderRadius: 4,
                    fontSize: 16,
                    textAlign: 'left',
                    color: selected ? '#111' : '#8a8f98',
                    cursor: 'pointer',
                }}
            >
                {selected?.flag_url ? (
                    <img src={selected.flag_url} alt="" width={24} height={18} style={{ objectFit: 'cover', borderRadius: 2 }} />
                ) : (
                    <i className="fa-solid fa-location-dot" style={{ color: ACCENT }}></i>
                )}
                <span style={{ flex: 1 }}>{selected ? selected.countryName : '---Select Country---'}</span>
                <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`} style={{ color: '#111' }}></i>
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 30,
                        left: 0,
                        right: 0,
                        top: '100%',
                        marginTop: 4,
                        background: '#fff',
                        border: '1px solid #ced4da',
                        borderRadius: 4,
                        boxShadow: '0 8px 24px rgba(0,0,0,.15)',
                    }}
                >
                    <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search country…"
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14, color: '#111' }}
                        />
                    </div>
                    <ul role="listbox" style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 260, overflowY: 'auto' }}>
                        {selected && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => { onChange(null); setOpen(false); setQuery(''); }}
                                    style={{ width: '100%', textAlign: 'left', padding: '9px 14px', border: 0, background: '#fff', color: '#8a8f98', cursor: 'pointer' }}
                                >
                                    Clear selection
                                </button>
                            </li>
                        )}
                        {matches.length === 0 && <li style={{ padding: '10px 14px', color: '#8a8f98' }}>No country found</li>}
                        {matches.map((country) => (
                            <li key={country.id}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={country.uid === value}
                                    onClick={() => { onChange(country.uid); setOpen(false); setQuery(''); }}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 14px',
                                        border: 0,
                                        background: country.uid === value ? '#e8f5fc' : '#fff',
                                        color: '#111',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {country.flag_url && (
                                        <img
                                            src={country.flag_url}
                                            alt=""
                                            width={24}
                                            height={18}
                                            style={{ objectFit: 'cover', borderRadius: 2 }}
                                            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                                        />
                                    )}
                                    {country.countryName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function VisaRequirementsSearch({ countries, filters, searched, visas, contact, currency, basePath, resultPath }: VisaRequirementsProps) {
    const [from, setFrom] = useState<string | null>(filters.from);
    const [to, setTo] = useState<string | null>(filters.to);
    const [showHint, setShowHint] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [selectedUid, setSelectedUid] = useState<string | null>(visas[0]?.uid ?? null);

    // A new search brings a new list, so start on its first visa.
    useEffect(() => {
        setSelectedUid(visas[0]?.uid ?? null);
    }, [visas]);
    const selected = visas.find((visa) => visa.uid === selectedUid) ?? visas[0] ?? null;

    const symbol = currency?.symbol ?? '£';
    const phone = contact?.phone?.trim() || '';
    const phoneDigits = phone.replace(/[^\d+]/g, '');
    const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits.replace(/^\+/, '')}` : 'https://wa.me/message/W5DBNURIYOKOF1';

    const nameOf = (uid: string | null) => countries.find((country) => country.uid === uid)?.countryName;

    const check = () => {
        if (from === null && to === null) {
            setShowHint(true);
            return;
        }
        setShowHint(false);
        router.get(
            resultPath ?? basePath,
            { ...(from !== null && { from }), ...(to !== null && { to }) },
            resultPath
                ? {}
                : {
                      preserveScroll: true,
                      onSuccess: () => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                  },
        );
    };


    const money = (value: string | number | null | undefined) => `${symbol}${(parseFloat(String(value ?? '')) || 0).toFixed(2)}`;

    const cell = (head = false): React.CSSProperties => ({
        border: `1px solid ${BORDER}`,
        padding: '5px 8px',
        textAlign: 'center',
        fontWeight: head ? 600 : 400,
        color: '#111',
        background: '#fff',
    });

    const getStarted: React.CSSProperties = {
        display: 'inline-block',
        background: RED,
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.5,
        padding: '8px 18px',
        textDecoration: 'none',
    };
    return (
        <>
            {/* Hero */}
            <div
                style={{
                    position: 'relative',
                    minHeight: 520,
                    margin: '14px 20px 0',
                    borderRadius: 8,
                    background: `url(${HERO_IMAGE}) center / cover no-repeat, linear-gradient(135deg, #cfe8f7, #9ed0ee)`,
                }}
            >
                {/* Search card, overlapping the bottom of the hero */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: -190,
                        transform: 'translateX(-50%)',
                        width: 'min(1062px, calc(100% - 32px))',
                        background: '#fff',
                        boxShadow: '0 8px 30px rgba(0,0,0,.15)',
                        zIndex: 10,
                    }}
                >
                    <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${ACCENT}` }}>
                        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, color: ACCENT }}>Travel Visa Requirements</h1>
                        <p style={{ margin: '10px 0 0', color: '#111', fontSize: 16 }}>
                            Sometimes a journey of a thousand miles begins with a visa. Check your destination and apply online for any visa in the world.
                        </p>
                    </div>

                    <div style={{ padding: 20 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            <CountrySelect label="Visa From" value={from} countries={countries} onChange={setFrom} />
                            <CountrySelect label="Visa To" value={to} countries={countries} onChange={setTo} />
                        </div>

                        {showHint && (
                            <div style={{ color: '#e5533d', fontSize: 14, marginTop: 10 }}>
                                Select at least one country to check requirements.
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                            <button
                                type="button"
                                onClick={check}
                                style={{
                                    background: ACCENT,
                                    color: '#fff',
                                    border: 0,
                                    padding: '14px 30px',
                                    fontSize: 20,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Check Requirements
                            </button>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 32,
                            padding: '20px 16px',
                            borderTop: '1px solid #e9f2f7',
                            fontSize: 18,
                            fontWeight: 500,
                        }}
                    >
                        <Link href="/contact-us" style={{ color: '#111', textDecoration: 'none' }}>
                            <i className="fa-solid fa-comment" style={{ color: ACCENT, marginRight: 8 }}></i>Live Chat
                        </Link>
                        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ color: '#111', textDecoration: 'none' }}>
                            <i className="fa-brands fa-whatsapp" style={{ color: ACCENT, marginRight: 8 }}></i>Whatsapp
                        </a>
                        {phone && (
                            <a href={`tel:${phoneDigits}`} style={{ color: '#111', textDecoration: 'none' }}>
                                <i className="fa-solid fa-phone" style={{ color: ACCENT, marginRight: 8 }}></i>Call {phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Results — the top padding leaves room for the overlapping card */}
            <div ref={resultsRef} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', paddingTop: searched ? 230 : 210, minHeight: 260 }}>
                {searched && (
                    <>
                        <p style={{ color: '#555', fontSize: 13, marginBottom: 10 }}>
                            <strong style={{ color: '#111' }}>{visas.length} visa{visas.length === 1 ? '' : 's'} found</strong>
                            {' — '}
                            {[from !== null && `From ${nameOf(from)}`, to !== null && `To ${nameOf(to)}`].filter(Boolean).join(' · ')}
                        </p>

                        {visas.length === 0 || !selected ? (
                            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, padding: '36px 20px', textAlign: 'center', color: '#555' }}>
                                <i className="fa-solid fa-passport" style={{ fontSize: 32, color: '#ccc' }}></i>
                                <p style={{ margin: '10px 0 0', fontSize: 16, fontWeight: 600, color: '#111' }}>No visa found for this country.</p>
                                <p style={{ margin: '4px 0 0', fontSize: 14 }}>Contact us and we will help you apply.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
                                {/* Visa list */}
                                <div style={{ flex: '0 0 260px', maxWidth: '100%', background: '#fff', border: `1px solid ${BORDER}` }}>
                                    {visas.map((visa) => {
                                        const active = visa.uid === selected.uid;
                                        return (
                                            <button
                                                key={visa.uid}
                                                type="button"
                                                onClick={() => setSelectedUid(visa.uid)}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    padding: '9px 12px',
                                                    border: 0,
                                                    borderBottom: `1px solid ${BORDER}`,
                                                    borderLeft: `3px solid ${active ? RED : 'transparent'}`,
                                                    background: active ? '#e3f2fa' : '#fff',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <span style={{ display: 'block', fontSize: 13, color: '#111' }}>{visa.name || visa.title}</span>
                                                <span style={{ display: 'block', fontSize: 11, color: RED }}>Required</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Selected visa */}
                                <div style={{ flex: '1 1 480px', minWidth: 0, background: '#fff', border: `1px solid ${BORDER}`, padding: 14 }}>
                                    <a href={`/visa/${selected.uid}`} style={getStarted}>GET STARTED</a>

                                    <div style={{ fontSize: 13, color: '#111', margin: '14px 0' }}>
                                        {selected.description ? (
                                            <VisaDescription html={selected.description} />
                                        ) : (
                                            <span style={{ color: '#777' }}>No description added for this visa.</span>
                                        )}
                                    </div>

                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '10px 0 6px' }}>Type of visa</div>
                                    {(selected.cost_details ?? []).length === 0 ? (
                                        <p style={{ fontSize: 13, color: '#777' }}>No cost details added for this visa.</p>
                                    ) : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                                <thead>
                                                    <tr>
                                                        {['Type of visa', 'Validity', 'Processing', 'Embassy fee', 'Service fee', 'Total cost'].map((heading) => (
                                                            <th key={heading} style={cell(true)}>{heading}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(selected.cost_details ?? []).map((row, index) => (
                                                        <tr key={row.id ?? index}>
                                                            <td style={cell()}>{row.type || '—'}</td>
                                                            <td style={cell()}>{row.validation_process || '—'}</td>
                                                            <td style={cell()}>{row.processing_time || '—'}</td>
                                                            <td style={cell()}>{money(row.embassy_fee ?? row.credit_amount)}</td>
                                                            <td style={cell()}>{money(row.service_fee)}</td>
                                                            <td style={cell()}>{money(row.total_cost)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div style={{ marginTop: 14 }}>
                                        <a href={`/visa/${selected.uid}`} style={getStarted}>GET STARTED</a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

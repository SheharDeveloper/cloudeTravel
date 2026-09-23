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

/** A cost row already taxed and converted to the "Living In" currency. */
interface PricedRow {
    id?: number;
    type?: string | null;
    validation_process?: string | null;
    processing_time?: string | null;
    embassy_fee: number;
    service_fee: number;
    tax_fee: number;
    total_cost: number;
}

interface VisaResult {
    id: number;
    uid: string;
    name: string | null;
    title: string;
    description?: string | null;
    image?: string | null;
    priced_costs: PricedRow[];
}

interface Pricing {
    living_country: string | null;
    code: string;
    symbol: string;
    rate: number;
    converted: boolean;
    base_code: string;
    tax_enabled: boolean;
    taxes: { name: string; percent: number }[];
    note: string | null;
}

export interface VisaResultProps {
    countries: Country[];
    /** from = citizenship, to = destination */
    filters: { from: string; to: string; living_in: string | null };
    visas: VisaResult[];
    pricing: Pricing;
    contact?: { phone?: string | null; email?: string | null } | null;
    /** The results page itself, which Check Requirements reopens. */
    resultPath: string;
    /** Hides the GET STARTED buttons (used for the admin's Preview). */
    hideGetStarted?: boolean;
}

const ACCENT = '#29a9e0';
const RED = '#b8161f';
const BORDER = '#cfe3ee';
const FALLBACK_HERO = 'https://www.goodwind.in/static/images/world-bg.jpg';

interface Option {
    key: string;
    label: string;
    flag?: string;
}

/** Searchable dropdown in the grey style of the results card; the value is the option's key. */
function Field({
    label,
    value,
    options,
    onChange,
    placeholder,
    clearable = true,
}: {
    label: string;
    value: string | null;
    options: Option[];
    onChange: (key: string | null) => void;
    placeholder: string;
    clearable?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const box = useRef<HTMLDivElement>(null);
    const selected = options.find((option) => option.key === value) ?? null;

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const matches = useMemo(() => {
        const term = query.trim().toLowerCase();
        return term ? options.filter((option) => option.label.toLowerCase().includes(term)) : options;
    }, [options, query]);

    const pick = (key: string | null) => {
        onChange(key);
        setOpen(false);
        setQuery('');
    };

    return (
        <div ref={box} style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 15, marginBottom: 10, color: '#1f2937' }}>{label}</label>
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
                    padding: '14px 14px',
                    background: '#f1f3f5',
                    border: 0,
                    borderRadius: 3,
                    fontSize: 17,
                    textAlign: 'left',
                    color: selected ? '#1f2937' : '#8a8f98',
                    cursor: 'pointer',
                }}
            >
                {selected?.flag ? (
                    <img src={selected.flag} alt="" width={24} height={18} style={{ objectFit: 'cover', borderRadius: 2 }} />
                ) : (
                    <i className="fa-solid fa-location-dot" style={{ color: ACCENT }}></i>
                )}
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selected ? selected.label : placeholder}
                </span>
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
                            placeholder="Search…"
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14, color: '#111' }}
                        />
                    </div>
                    <ul role="listbox" style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: 260, overflowY: 'auto' }}>
                        {clearable && selected && (
                            <li>
                                <button
                                    type="button"
                                    onClick={() => pick(null)}
                                    style={{ width: '100%', textAlign: 'left', padding: '9px 14px', border: 0, background: '#fff', color: '#8a8f98', cursor: 'pointer' }}
                                >
                                    Clear selection
                                </button>
                            </li>
                        )}
                        {matches.length === 0 && <li style={{ padding: '10px 14px', color: '#8a8f98' }}>Nothing found</li>}
                        {matches.map((option) => (
                            <li key={option.key}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={option.key === value}
                                    onClick={() => pick(option.key)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 14px',
                                        border: 0,
                                        background: option.key === value ? '#e8f5fc' : '#fff',
                                        color: '#111',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {option.flag && (
                                        <img
                                            src={option.flag}
                                            alt=""
                                            width={24}
                                            height={18}
                                            style={{ objectFit: 'cover', borderRadius: 2 }}
                                            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                                        />
                                    )}
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/**
 * The results page: the search card (destination, visa type, citizenship,
 * living in) over the picture of the chosen visa, and that visa's details
 * below. The first visa found is chosen automatically; picking another one
 * from Visa Type (or the list below) switches the picture and the details.
 */
export default function VisaResultView({ countries, filters, visas, pricing, contact, resultPath, hideGetStarted }: VisaResultProps) {
    const [destination, setDestination] = useState<string | null>(filters.to);
    const [citizenship, setCitizenship] = useState<string | null>(filters.from);
    // Only what the user picked; Living In follows Citizenship until they pick one.
    const [livingIn, setLivingIn] = useState<string | null>(filters.living_in);
    const livingValue = livingIn ?? citizenship;
    const [showHint, setShowHint] = useState(false);
    const [selectedUid, setSelectedUid] = useState<string>(visas[0].uid);

    // A new search starts on its first visa. Changing only Living In reloads the
    // same visas with new prices, so the visa picked stays picked.
    const visaKey = visas.map((visa) => visa.uid).join('|');
    useEffect(() => {
        setSelectedUid(visas[0].uid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visaKey]);

    const selected = visas.find((visa) => visa.uid === selectedUid) ?? visas[0];

    const countryOptions: Option[] = useMemo(
        () => countries.map((country) => ({ key: country.uid, label: country.countryName, flag: country.flag_url })),
        [countries],
    );
    const visaOptions: Option[] = useMemo(() => visas.map((visa) => ({ key: visa.uid, label: visa.name || visa.title })), [visas]);

    const phone = contact?.phone?.trim() || '';
    const phoneDigits = phone.replace(/[^\d+]/g, '');
    const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits.replace(/^\+/, '')}` : 'https://wa.me/message/W5DBNURIYOKOF1';

    // Living In changes the tax and currency, so prices are recalculated straight
    // away for the search already shown (not for unsent edits to the other fields).
    const changeLivingIn = (key: string | null) => {
        setLivingIn(key);
        router.get(
            resultPath,
            { from: filters.from, to: filters.to, ...(key && { living_in: key }) },
            { preserveState: true, preserveScroll: true },
        );
    };

    const check = () => {
        if (!destination || !citizenship) {
            setShowHint(true);
            return;
        }
        setShowHint(false);
        router.get(resultPath, {
            from: citizenship,
            to: destination,
            ...(livingIn && { living_in: livingIn }),
        });
    };

    const money = (value: number) => `${pricing.symbol}${value.toFixed(2)}`;
    const taxLabel = pricing.taxes.map((tax) => `${tax.name} ${tax.percent}%`).join(' + ');
    const columns = ['Type of visa', 'Validity', 'Processing', 'Embassy fee', 'Service fee', ...(taxLabel ? [taxLabel] : []), 'Total cost'];

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
            {/* The chosen visa's picture, with the search card over it */}
            <div style={{ position: 'relative', minHeight: 360, margin: '14px 20px 0' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(135deg, #cfe8f7, #9ed0ee)' }}>
                    {visas.map((visa) => (
                        <div
                            key={visa.uid}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: `url(${visa.image || FALLBACK_HERO}) center / cover no-repeat`,
                                opacity: visa.uid === selected.uid ? 1 : 0,
                                transition: 'opacity .5s ease',
                            }}
                        />
                    ))}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: -170,
                        transform: 'translateX(-50%)',
                        width: 'min(1214px, calc(100% - 32px))',
                        background: '#fff',
                        boxShadow: '0 8px 30px rgba(0,0,0,.18)',
                        zIndex: 10,
                    }}
                >
                    <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #9fd8f2' }}>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: ACCENT }}>Travel Visa Requirements</h1>
                        <p style={{ margin: '8px 0 0', color: '#111', fontSize: 15 }}>
                            Sometimes a journey of a thousand miles begins with a visa. Check your destination and apply online for any visa in the world.
                        </p>
                    </div>

                    <div style={{ padding: 20 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            <Field label="Your Travel Destination" value={destination} options={countryOptions} onChange={setDestination} placeholder="---Select Country---" />
                            <Field
                                label="Visa Type"
                                value={selected.uid}
                                options={visaOptions}
                                onChange={(key) => key && setSelectedUid(key)}
                                placeholder="---Select Visa Type---"
                                clearable={false}
                            />
                            <Field label="Your Citizenship" value={citizenship} options={countryOptions} onChange={setCitizenship} placeholder="---Select Country---" />
                            <Field label="Living In" value={livingValue} options={countryOptions} onChange={changeLivingIn} placeholder="---Select Country---" />
                        </div>

                        {showHint && (
                            <div style={{ color: '#e5533d', fontSize: 14, marginTop: 10 }}>
                                Select a destination and your citizenship to check requirements.
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                            <button
                                type="button"
                                onClick={check}
                                style={{ background: ACCENT, color: '#fff', border: 0, padding: '12px 28px', fontSize: 19, fontWeight: 600, cursor: 'pointer' }}
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
                            padding: '18px 16px',
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

            {/* The chosen visa — the top padding leaves room for the overlapping card */}
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', paddingTop: 215, minHeight: 260 }}>
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
                        {!hideGetStarted && <a href={`/visa/${selected.uid}`} style={getStarted}>GET STARTED</a>}

                        <div style={{ fontSize: 13, color: '#111', margin: '14px 0' }}>
                            {selected.description ? (
                                <VisaDescription html={selected.description} />
                            ) : (
                                <span style={{ color: '#777' }}>No description added for this visa.</span>
                            )}
                        </div>

                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '10px 0 6px' }}>Type of visa</div>
                        {selected.priced_costs.length === 0 ? (
                            <p style={{ fontSize: 13, color: '#777' }}>No cost details added for this visa.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                    <thead>
                                        <tr>
                                            {columns.map((heading) => (
                                                <th key={heading} style={cell(true)}>{heading}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selected.priced_costs.map((row, index) => (
                                            <tr key={row.id ?? index}>
                                                <td style={cell()}>{row.type || '—'}</td>
                                                <td style={cell()}>{row.validation_process || '—'}</td>
                                                <td style={cell()}>{row.processing_time || '—'}</td>
                                                <td style={cell()}>{money(row.embassy_fee)}</td>
                                                <td style={cell()}>{money(row.service_fee)}</td>
                                                {taxLabel && <td style={cell()}>{money(row.tax_fee)}</td>}
                                                <td style={{ ...cell(), fontWeight: 600 }}>{money(row.total_cost)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Only a problem is worth saying: prices fell back to the base currency */}
                        {pricing.note && <div style={{ fontSize: 11, color: '#b45309', marginTop: 8 }}>{pricing.note}</div>}

                        {!hideGetStarted && (
                            <div style={{ marginTop: 14 }}>
                                <a href={`/visa/${selected.uid}`} style={getStarted}>GET STARTED</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

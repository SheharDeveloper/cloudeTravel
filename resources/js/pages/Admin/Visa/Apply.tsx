import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import DatePicker from '@/components/DatePicker';

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

interface VisaProp {
    uid: string;
    name: string | null;
    title: string;
    priced_costs: PricedRow[];
}

interface FamilyMemberProp {
    id: number;
    first_name: string;
    last_name: string;
    relation: string | null;
    passport_number: string | null;
}

interface ClientProp {
    uid: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    nationality: string | null;
    passport_number: string | null;
    family: FamilyMemberProp[];
}

type FieldName = 'first_name' | 'last_name' | 'email' | 'passport_number' | 'nationality' | 'phone';
type PassengerFields = Record<FieldName, string>;
interface ExtraPassenger extends PassengerFields {
    key: number;
    relation: string;
}

const EMPTY_FIELDS: PassengerFields = { first_name: '', last_name: '', email: '', passport_number: '', nationality: '', phone: '' };
const RELATIONS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Relative', 'Friend', 'Other'];
const FIELD_LABELS: Record<FieldName, string> = {
    last_name: 'Last Name',
    first_name: 'First Name',
    email: 'Email',
    passport_number: 'Passport Number',
    nationality: 'Nationality',
    phone: 'Phone Number',
};
const SELF_FIELDS: FieldName[] = ['last_name', 'first_name', 'email', 'passport_number', 'nationality', 'phone'];
const FAMILY_FIELDS: FieldName[] = ['last_name', 'first_name', 'passport_number', 'nationality', 'phone'];
const EXTRA_FIELDS: FieldName[] = ['first_name', 'last_name', 'passport_number', 'nationality', 'phone'];

interface Props {
    filters: { from: string; to: string; living_in: string | null };
    visas: VisaProp[];
    visaUid: string;
    costId: number | null;
    destinationName: string;
    destinationFlag: string;
    pricing: {
        symbol: string;
        code: string;
        base_code: string;
        rate: number;
        converted: boolean;
        taxes: { name: string; percent: number }[];
    };
    clients: ClientProp[];
    canSelectClient: boolean;
    // Set when opened through "Edit" on a booking
    booking?: BookingProp;
}

interface BookingProp {
    uid: string;
    invoice_number: string;
    date_of_entry: string | null;
    client: string | null;
    passengers: (PassengerFields & { relation: string; family_member_id: number | null })[];
}

/** A client's own details (Self) and each family member, as the passenger step starts them. */
const clientDefaults = (client: ClientProp) => ({
    selfFields: {
        first_name: client.first_name ?? '',
        last_name: client.last_name ?? '',
        email: client.email ?? '',
        passport_number: client.passport_number ?? '',
        nationality: client.nationality ?? '',
        phone: client.phone ?? '',
    } as PassengerFields,
    familyFields: Object.fromEntries(client.family.map((m) => [m.id, {
        first_name: m.first_name ?? '',
        last_name: m.last_name ?? '',
        email: '',
        passport_number: m.passport_number ?? '',
        nationality: client.nationality ?? '',
        phone: '',
    }])) as Record<number, PassengerFields>,
    familyChecked: Object.fromEntries(client.family.map((m) => [m.id, true])) as Record<number, boolean>,
});

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Where the passenger step starts: empty for a new booking, or rebuilt from
 * an edited booking's applications. Self and ticked family members go back
 * to their places under the client; everyone else becomes an extra passenger.
 */
const initialPassengers = (booking: BookingProp | undefined, clients: ClientProp[], canSelectClient: boolean) => {
    const start = {
        date: '',
        clientUid: '',
        includeSelf: true,
        includeFamily: true,
        selfFields: EMPTY_FIELDS,
        familyFields: {} as Record<number, PassengerFields>,
        familyChecked: {} as Record<number, boolean>,
        extras: (canSelectClient ? [] : [{ key: 1, relation: 'Self', ...EMPTY_FIELDS }]) as ExtraPassenger[],
    };
    if (!booking) return start;

    const pick = (p: BookingProp['passengers'][number]): PassengerFields => ({
        first_name: p.first_name, last_name: p.last_name, email: p.email,
        passport_number: p.passport_number, nationality: p.nationality, phone: p.phone,
    });
    const client = clients.find((c) => c.uid === booking.client);
    let rest = booking.passengers;
    const result = { ...start, date: booking.date_of_entry ?? '', extras: [] as ExtraPassenger[] };

    if (client) {
        const defaults = clientDefaults(client);
        const self = rest.find((p) => p.relation === 'self' && !p.family_member_id);
        const familyIds = new Set(client.family.map((m) => m.id));
        const booked = rest.filter((p) => p.family_member_id && familyIds.has(p.family_member_id));
        rest = rest.filter((p) => p !== self && !booked.includes(p));

        result.clientUid = client.uid;
        result.includeSelf = Boolean(self);
        result.selfFields = self ? pick(self) : defaults.selfFields;
        result.includeFamily = booked.length > 0;
        result.familyFields = { ...defaults.familyFields };
        // Members left out of the booking start unticked (or all ticked if none were booked)
        result.familyChecked = Object.fromEntries(client.family.map((m) => [m.id, booked.length === 0]));
        booked.forEach((p) => {
            result.familyFields[p.family_member_id!] = pick(p);
            result.familyChecked[p.family_member_id!] = true;
        });
    }

    result.extras = rest.map((p, i) => ({ key: i + 1, relation: capitalize(p.relation), ...pick(p) }));
    return result;
};

const FEATURES = [
    { icon: 'fa-solid fa-plane-departure', title: 'Fast & Reliable Service', text: 'Get your visa on time' },
    { icon: 'fa-solid fa-shield-halved', title: 'Secure Payment', text: '100% safe & encrypted' },
    { icon: 'fa-solid fa-headset', title: 'Expert Support', text: "We're here to help" },
    { icon: 'fa-solid fa-globe', title: 'Global Coverage', text: 'Multiple countries & visa types' },
];

export default function VisaApply() {
    const { filters, visas, visaUid, costId, destinationName, destinationFlag, pricing, clients, canSelectClient, booking } =
        usePage().props as unknown as Props;
    const [init] = useState(() => initialPassengers(booking, clients, canSelectClient));

    // Starts on the visa and cost row picked on the results page. Visa
    // Category switches between the route's visas; Visa Type between the
    // chosen visa's cost rows (Single / Multiple entry…).
    const [selectedVisaUid, setSelectedVisaUid] = useState(visaUid);
    const visa = visas.find((v) => v.uid === selectedVisaUid) ?? visas[0];

    const [selectedIndex, setSelectedIndex] = useState(() => {
        const index = visa.priced_costs.findIndex((row) => row.id === costId);
        return index === -1 ? 0 : index;
    });
    const selectedCost = visa.priced_costs[selectedIndex] ?? null;

    const changeVisa = (uid: string) => {
        setSelectedVisaUid(uid);
        setSelectedIndex(0);
    };

    const [dateOfEntry, setDateOfEntry] = useState(init.date);
    const [clientUid, setClientUid] = useState(init.clientUid);
    const [clientSearch, setClientSearch] = useState('');
    const [clientListOpen, setClientListOpen] = useState(false);
    const clientPickerRef = useRef<HTMLDivElement>(null);
    const selectedClient = clients.find((c) => c.uid === clientUid) ?? null;

    const filteredClients = useMemo(() => {
        const q = clientSearch.trim().toLowerCase();
        if (!q) return clients;
        return clients.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }, [clients, clientSearch]);

    // Close the client list when clicking anywhere else
    useEffect(() => {
        if (!clientListOpen) return;
        const close = (e: MouseEvent) => {
            if (clientPickerRef.current && !clientPickerRef.current.contains(e.target as Node)) setClientListOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [clientListOpen]);

    // Passengers: the client (Self), their family members (each can be
    // ticked off), and extra passengers added by hand. Every one of them
    // becomes its own application in the booking.
    const [includeSelf, setIncludeSelf] = useState(init.includeSelf);
    const [includeFamily, setIncludeFamily] = useState(init.includeFamily);
    const [selfFields, setSelfFields] = useState<PassengerFields>(init.selfFields);
    const [familyFields, setFamilyFields] = useState<Record<number, PassengerFields>>(init.familyFields);
    const [familyChecked, setFamilyChecked] = useState<Record<number, boolean>>(init.familyChecked);
    // Without the client picker, the booking is made of extra passengers only.
    const [extras, setExtras] = useState<ExtraPassenger[]>(init.extras);
    const nextExtraKey = useRef(init.extras.length + 1);
    const [saving, setSaving] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Esc closes the confirmation, like "Amendment"
    useEffect(() => {
        if (!confirmOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setConfirmOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [confirmOpen]);
    const errors = usePage().props.errors as Record<string, string>;

    const pickClient = (client: ClientProp) => {
        setClientUid(client.uid);
        setClientSearch('');
        setClientListOpen(false);

        // Pre-fill from the client record; blanks stay editable
        const defaults = clientDefaults(client);
        setIncludeSelf(true);
        setIncludeFamily(client.family.length > 0);
        setSelfFields(defaults.selfFields);
        setFamilyFields(defaults.familyFields);
        setFamilyChecked(defaults.familyChecked);
    };

    const clearClient = () => {
        setClientUid('');
        setFamilyFields({});
        setFamilyChecked({});
    };

    // A field taken from the client's saved record is shown read-only.
    const selfLocked = (field: FieldName) => Boolean(selectedClient && (selectedClient as unknown as Record<string, unknown>)[field]);
    const familyLocked = (member: FamilyMemberProp, field: FieldName) =>
        (field === 'first_name' || field === 'last_name' || field === 'passport_number') && Boolean(member[field]);

    const addExtra = () => {
        setExtras([...extras, { key: nextExtraKey.current++, relation: '', ...EMPTY_FIELDS }]);
    };
    const updateExtra = (key: number, changes: Partial<ExtraPassenger>) =>
        setExtras(extras.map((p) => (p.key === key ? { ...p, ...changes } : p)));
    const removeExtra = (key: number) => setExtras(extras.filter((p) => p.key !== key));

    // Everyone travelling, in the order they're sent (and numbered in errors)
    const family = selectedClient?.family ?? [];
    const passengers = [
        ...(selectedClient && includeSelf ? [{ id: 'self', relation: 'Self', family_member_id: null as number | null, ...selfFields }] : []),
        ...(selectedClient && includeFamily
            ? family.filter((m) => familyChecked[m.id]).map((m) => ({
                id: `family-${m.id}`,
                relation: m.relation || 'Family',
                family_member_id: m.id as number | null,
                ...familyFields[m.id],
            }))
            : []),
        ...extras.map((p) => ({ id: `extra-${p.key}`, family_member_id: null as number | null, ...p })),
    ];
    const passengerCount = passengers.length;
    const errorFor = (id: string, field: string) => {
        const index = passengers.findIndex((p) => p.id === id);
        return index === -1 ? undefined : errors[`passengers.${index}.${field}`];
    };

    const money = (value: number) => `${pricing.symbol}${value.toFixed(2)}`;
    // When prices are converted, the fee as entered (base currency) is shown underneath.
    const baseMoney = (value: number) => `${pricing.base_code} ${(value / pricing.rate).toFixed(2)}`;
    const taxLabel = pricing.taxes.map((tax) => `${tax.name} ${tax.percent}%`).join(' + ') || 'Tax';
    const visaName = visa.name || visa.title;

    const handleProceed = () => {
        if (!dateOfEntry) {
            toast.error('Select the date of entry first');
            return;
        }
        if (canSelectClient && !clientUid) {
            toast.error('Select a client');
            return;
        }
        if (!selectedCost?.id) {
            toast.error('This visa has no cost details to book');
            return;
        }
        if (passengerCount === 0) {
            toast.error('Add at least one passenger');
            return;
        }
        const missing = passengers.findIndex((p) => !p.first_name.trim() || !p.last_name.trim() || !p.relation.trim());
        if (missing !== -1) {
            toast.error(`Passenger ${missing + 1}: enter the first name, last name and relation`);
            return;
        }

        // Everything's filled in: ask to confirm before booking
        toast.dismiss();
        setConfirmOpen(true);
    };

    // "Yes, all details are confirmed"
    const submitBooking = () => {
        if (!selectedCost?.id) return;
        setConfirmOpen(false);
        setSaving(true);
        // Editing updates the same booking; otherwise a new one is made
        router[booking ? 'put' : 'post'](
            booking ? `/admin/service-bookings/${booking.uid}` : '/admin/visa-search/apply',
            {
                visa: visa.uid,
                cost: selectedCost.id,
                from: filters.from,
                to: filters.to,
                living_in: filters.living_in,
                date_of_entry: dateOfEntry,
                client: clientUid || null,
                passengers: passengers.map(({ id: _id, ...p }) => ({
                    relation: p.relation.trim().toLowerCase(),
                    family_member_id: p.family_member_id,
                    first_name: p.first_name.trim(),
                    last_name: p.last_name.trim(),
                    email: p.email.trim() || null,
                    passport_number: p.passport_number.trim() || null,
                    nationality: p.nationality.trim() || null,
                    phone: p.phone.trim() || null,
                })),
            },
            {
                preserveScroll: true,
                onError: (errs) => toast.error(Object.values(errs)[0] ?? 'Please check the form'),
                onFinish: () => setSaving(false),
            },
        );
    };

    // One read-only-or-editable passenger input
    const renderField = (
        id: string,
        field: FieldName,
        value: string,
        locked: boolean,
        onChange: (value: string) => void,
    ) => {
        const error = errorFor(id, field);
        return (
            <div className="col-sm-6 col-md-4" key={field}>
                <label className="va-label">{FIELD_LABELS[field]}</label>
                <input
                    type={field === 'email' ? 'email' : 'text'}
                    className={`form-control va-input ${error ? 'is-invalid' : ''}`}
                    value={value}
                    readOnly={locked}
                    placeholder={locked ? '' : FIELD_LABELS[field]}
                    onChange={(e) => onChange(e.target.value)}
                />
                {error && <div className="invalid-feedback d-block">{error}</div>}
            </div>
        );
    };

    return (
        <ProtectedRoute>
            <Head title={booking ? `Edit ${booking.invoice_number}` : `Visa to ${destinationName}`} />
            <style>{PAGE_STYLES + MODAL_STYLES}</style>

            <div className="visa-apply">
                {/* Header banner */}
                <div className="va-hero">
                    <div className="d-flex align-items-center gap-3">
                        <div className="va-hero-icon"><i className="fa-solid fa-passport"></i></div>
                        <div>
                            <h1 className="va-hero-title">
                                Visa to {destinationName}
                                {destinationFlag && <img src={destinationFlag} alt="" className="va-hero-flag" />}
                            </h1>
                            <nav className="va-crumbs">
                                <a href="/dashboard"><i className="fa-solid fa-house"></i></a>
                                <a href="/dashboard">Dashboard</a>
                                <span>/</span>
                                {booking ? (
                                    <>
                                        <a href="/admin/service-bookings?service=visa">Visa Applications</a>
                                        <span>/</span>
                                        <a href={`/admin/service-bookings/${booking.uid}`}>{booking.invoice_number}</a>
                                        <span>/</span>
                                        <span className="va-crumb-active">Edit</span>
                                    </>
                                ) : (
                                    <>
                                        <a href="/admin/visa-search">Search</a>
                                        <span>/</span>
                                        <span className="va-crumb-active">Apply</span>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                    <div className="va-hero-tagline d-none d-md-flex">
                        <span>Trusted Visa Services for a<br />Brighter Future</span>
                        <i className="fa-solid fa-plane"></i>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Visa details + client */}
                    <div className="col-lg-8">
                        <div className="va-card">
                            <div className="va-section-head">
                                <div className="va-section-icon"><i className="fa-solid fa-passport"></i></div>
                                <div>
                                    <h6>Visa Details</h6>
                                    <p>Please provide the details for your visa application</p>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="va-label">Visa Category</label>
                                    <div className="va-field">
                                        <i className="fa-solid fa-globe va-field-icon"></i>
                                        <select className="form-select" value={visa.uid} onChange={(e) => changeVisa(e.target.value)}>
                                            {visas.map((v) => (
                                                <option key={v.uid} value={v.uid}>{v.name || v.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="va-label">Visa Type</label>
                                    <div className="va-field">
                                        <i className="fa-regular fa-file-lines va-field-icon"></i>
                                        {visa.priced_costs.length === 0 ? (
                                            <input type="text" className="form-control" value="N/A" disabled />
                                        ) : (
                                            <select
                                                className="form-select"
                                                value={selectedIndex}
                                                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                                            >
                                                {visa.priced_costs.map((row, index) => (
                                                    <option key={row.id ?? index} value={index}>
                                                        {row.type || `Option ${index + 1}`}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="va-label">Validity</label>
                                    <div className="va-field">
                                        <i className="fa-regular fa-calendar va-field-icon"></i>
                                        <input type="text" className="form-control" value={selectedCost?.validation_process || 'N/A'} disabled />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="va-label">Processing Time</label>
                                    <div className="va-field">
                                        <i className="fa-regular fa-clock va-field-icon"></i>
                                        <input type="text" className="form-control" value={selectedCost?.processing_time || 'N/A'} disabled />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="va-label">Date of Entry</label>
                                    <DatePicker
                                        value={dateOfEntry}
                                        onChange={setDateOfEntry}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        autoSelect={true}
                                        icon={true}
                                        inputStyle={{ border: '1px solid #e5e7eb', borderRadius: 10, height: 44, fontSize: 14 }}
                                    />
                                </div>
                            </div>

                            {/* Client picker only for sessions with the Clients permission */}
                            {canSelectClient && (
                                <>
                                    <hr className="va-divider" />

                                    <div className="va-section-head">
                                        <div className="va-section-icon va-section-icon-round"><i className="fa-solid fa-user"></i></div>
                                        <div>
                                            <h6>Select Client</h6>
                                            <p>Search and choose a client for this visa application</p>
                                        </div>
                                    </div>

                                    <div className="va-client-picker" ref={clientPickerRef}>
                                        <div className="va-field">
                                            <i className="fa-solid fa-magnifying-glass va-field-icon"></i>
                                            <input
                                                type="text"
                                                className="form-control va-client-search"
                                                placeholder={clients.length === 0 ? 'No clients yet' : 'Search clients by name or email...'}
                                                value={clientSearch}
                                                onFocus={() => setClientListOpen(true)}
                                                onChange={(e) => { setClientSearch(e.target.value); setClientListOpen(true); }}
                                            />
                                            <i
                                                className={`fa-solid fa-chevron-${clientListOpen ? 'up' : 'down'} va-field-icon-right`}
                                                onClick={() => setClientListOpen(!clientListOpen)}
                                            ></i>
                                        </div>

                                        {clientListOpen && (
                                            <ul className="va-client-list">
                                                {filteredClients.length === 0 ? (
                                                    <li className="va-client-empty">
                                                        {clients.length === 0 ? 'No clients yet — add them from the Clients page' : 'No matching clients'}
                                                    </li>
                                                ) : (
                                                    filteredClients.map((c) => (
                                                        <li
                                                            key={c.uid}
                                                            className={c.uid === clientUid ? 'active' : ''}
                                                            onClick={() => pickClient(c)}
                                                        >
                                                            <strong>{c.name}</strong>
                                                            <span>{c.email}</span>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="va-client-selected">
                                        <i className="fa-regular fa-user"></i>
                                        {selectedClient ? (
                                            <div>
                                                <strong>{selectedClient.name}</strong>
                                                <span>{[selectedClient.email, selectedClient.phone].filter(Boolean).join(' · ')}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <strong>No client selected</strong>
                                                <span>Please select a client from the dropdown above.</span>
                                            </div>
                                        )}
                                        {selectedClient && (
                                            <button type="button" className="va-client-clear" onClick={clearClient} aria-label="Clear client">
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Passengers — each one becomes its own application */}
                            {(selectedClient || !canSelectClient) && (
                                <>
                                    <hr className="va-divider" />

                                    <div className="va-section-head">
                                        <div className="va-section-icon va-section-icon-round"><i className="fa-solid fa-users"></i></div>
                                        <div>
                                            <h6>Passengers <span className="va-count">{passengerCount}</span></h6>
                                            <p>Everyone travelling on this visa gets their own application</p>
                                        </div>
                                    </div>

                                    {selectedClient && (
                                        <div className="va-checks">
                                            <label>
                                                <input type="checkbox" checked={includeSelf} onChange={(e) => setIncludeSelf(e.target.checked)} />
                                                Self
                                            </label>
                                            {family.length > 0 && (
                                                <label>
                                                    <input type="checkbox" checked={includeFamily} onChange={(e) => setIncludeFamily(e.target.checked)} />
                                                    Family Members
                                                </label>
                                            )}
                                        </div>
                                    )}

                                    {selectedClient && includeSelf && (
                                        <div className="va-passenger">
                                            <div className="va-passenger-title">Self Details</div>
                                            <div className="row g-2">
                                                {SELF_FIELDS.map((field) =>
                                                    renderField('self', field, selfFields[field], selfLocked(field), (value) =>
                                                        setSelfFields({ ...selfFields, [field]: value }),
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedClient && includeFamily && family.map((member, index) => (
                                        <div key={member.id} className={`va-passenger ${familyChecked[member.id] ? '' : 'va-passenger-off'}`}>
                                            <label className="va-passenger-title va-passenger-check">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(familyChecked[member.id])}
                                                    onChange={(e) => setFamilyChecked({ ...familyChecked, [member.id]: e.target.checked })}
                                                />
                                                Family Member {index + 1}: {member.first_name} {member.last_name}
                                                {member.relation && <span className="va-relation">({member.relation})</span>}
                                            </label>
                                            {familyChecked[member.id] && (
                                                <div className="row g-2">
                                                    {FAMILY_FIELDS.map((field) =>
                                                        renderField(`family-${member.id}`, field, familyFields[member.id]?.[field] ?? '', familyLocked(member, field), (value) =>
                                                            setFamilyFields({ ...familyFields, [member.id]: { ...familyFields[member.id], [field]: value } }),
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {extras.map((extra, index) => {
                                        const id = `extra-${extra.key}`;
                                        const relationError = errorFor(id, 'relation');
                                        return (
                                            <div key={extra.key} className="va-passenger">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <div className="va-passenger-title mb-0">Additional Passenger {index + 1}</div>
                                                    {(canSelectClient || extras.length > 1) && (
                                                        <button type="button" className="va-remove" onClick={() => removeExtra(extra.key)}>
                                                            <i className="fa-regular fa-trash-can"></i> Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="row g-2">
                                                    <div className="col-sm-6 col-md-4">
                                                        <label className="va-label">Relation</label>
                                                        <select
                                                            className={`form-select va-input ${relationError ? 'is-invalid' : ''}`}
                                                            value={extra.relation}
                                                            onChange={(e) => updateExtra(extra.key, { relation: e.target.value })}
                                                        >
                                                            <option value="">Select</option>
                                                            {!canSelectClient && <option value="Self">Self</option>}
                                                            {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                                            {/* A relation saved on an edited booking that isn't in the list */}
                                                            {extra.relation && extra.relation !== 'Self' && !RELATIONS.includes(extra.relation) && (
                                                                <option value={extra.relation}>{extra.relation}</option>
                                                            )}
                                                        </select>
                                                        {relationError && <div className="invalid-feedback d-block">{relationError}</div>}
                                                    </div>
                                                    {EXTRA_FIELDS.map((field) =>
                                                        renderField(id, field, extra[field], false, (value) => updateExtra(extra.key, { [field]: value })),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="text-end">
                                        <button type="button" className="va-add" onClick={addExtra}>
                                            <i className="fa-solid fa-plus"></i> Add More Passenger
                                        </button>
                                    </div>
                                </>
                            )}

                            <button type="button" className="va-proceed" onClick={handleProceed} disabled={saving}>
                                <i className="fa-solid fa-arrow-right"></i>{' '}
                                {saving ? 'Saving…' : booking ? 'Save Changes' : 'Proceed To Payment'}
                            </button>
                        </div>
                    </div>

                    {/* Basket */}
                    <div className="col-lg-4">
                        <div className="va-card">
                            <div className="va-section-head">
                                <div className="va-section-icon va-section-icon-plain"><i className="fa-solid fa-cart-shopping"></i></div>
                                <div>
                                    <h6>Basket Details</h6>
                                    <p>Summary of your selected visa service</p>
                                </div>
                            </div>

                            <div className="va-basket-summary">
                                {destinationFlag && <img src={destinationFlag} alt="" className="va-basket-flag" />}
                                <div>
                                    <strong>{destinationName} Visa</strong>
                                    <span>
                                        {[visaName, selectedCost?.type, selectedCost?.processing_time].filter(Boolean).join('  |  ')}
                                    </span>
                                </div>
                            </div>

                            {selectedCost ? (
                                <>
                                    <div className="va-fee">
                                        <span><i className="fa-solid fa-users"></i> Passengers</span>
                                        <div><strong>{passengerCount}</strong></div>
                                    </div>
                                    <div className="va-fee">
                                        <span><i className="fa-regular fa-file-lines"></i> Visa Fee</span>
                                        <div>
                                            <strong>{money(selectedCost.embassy_fee)} × {passengerCount}</strong>
                                            <small>{money(selectedCost.embassy_fee * passengerCount)}</small>
                                        </div>
                                    </div>
                                    <div className="va-fee">
                                        <span><i className="fa-solid fa-gear"></i> Service Fee</span>
                                        <div>
                                            <strong>{money(selectedCost.service_fee)} × {passengerCount}</strong>
                                            <small>{money(selectedCost.service_fee * passengerCount)}</small>
                                        </div>
                                    </div>
                                    {selectedCost.tax_fee > 0 && (
                                        <div className="va-fee">
                                            <span><i className="fa-solid fa-percent"></i> {taxLabel}</span>
                                            <div>
                                                <strong>{money(selectedCost.tax_fee)} × {passengerCount}</strong>
                                                <small>{money(selectedCost.tax_fee * passengerCount)}</small>
                                            </div>
                                        </div>
                                    )}

                                    <div className="va-total">
                                        <span><i className="fa-solid fa-file-invoice"></i> Total</span>
                                        <div className="text-end">
                                            <strong>{money(selectedCost.total_cost * passengerCount)}</strong>
                                            {pricing.converted && <small className="d-block va-total-base">{baseMoney(selectedCost.total_cost * passengerCount)}</small>}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted mb-0">No cost details available for this visa.</p>
                            )}

                            <div className="va-secure">
                                <div className="va-secure-icon"><i className="fa-solid fa-shield-halved"></i></div>
                                <div>
                                    <strong>Your information is safe and secure</strong>
                                    <span>We use industry standard encryption to protect your data.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature strip */}
                <div className="va-features">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="va-feature">
                            <i className={f.icon}></i>
                            <div>
                                <strong>{f.title}</strong>
                                <span>{f.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {confirmOpen && (
                <div className="va-modal-backdrop" onClick={() => setConfirmOpen(false)}>
                    <div
                        className="va-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="va-confirm-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h5 id="va-confirm-title">Confirm Details</h5>
                        <p>Are all the details correct?</p>
                        <div className="va-modal-actions">
                            <button type="button" className="va-modal-yes" onClick={submitBooking} autoFocus>
                                Yes, all details are confirmed
                            </button>
                            <button type="button" className="va-modal-amend" onClick={() => setConfirmOpen(false)}>
                                Amendment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

// The "Confirm Details" popup shown by Proceed To Payment
const MODAL_STYLES = `
.va-modal-backdrop { position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(17, 24, 39, .45); }
.va-modal { width: 100%; max-width: 440px; padding: 28px 28px 24px; border-radius: 10px; background: #fff; text-align: center; box-shadow: 0 20px 50px rgba(0, 0, 0, .25); }
.va-modal h5 { margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #111827; }
.va-modal p { margin: 0 0 20px; font-size: 16px; color: #1f2937; }
.va-modal-actions { display: flex; gap: 8px; }
.va-modal-actions button { flex: 1; min-height: 52px; padding: 8px 14px; border: 0; border-radius: 6px; font-size: 15px; font-weight: 600; }
.va-modal-yes { background: #16a34a; color: #fff; }
.va-modal-yes:hover { background: #15803d; }
.va-modal-amend { background: #d1d5db; color: #111827; }
.va-modal-amend:hover { background: #c4c8cf; }`;

const PAGE_STYLES = `
.visa-apply { --va-primary: #4b2e9e; --va-primary-soft: #efeafc; --va-border: #e5e7eb; --va-text: #1f1a4d; --va-muted: #6b7280; color: var(--va-text); }
.visa-apply .va-hero { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px 28px; margin-bottom: 24px; border-radius: 16px; background: linear-gradient(100deg, #f5f3ff 0%, #eef0fb 60%, #e6e9f8 100%); }
.visa-apply .va-hero-icon { width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #fff; background: linear-gradient(135deg, #7c5ce0, #4b2e9e); box-shadow: 0 6px 16px rgba(75, 46, 158, .25); }
.visa-apply .va-hero-title { display: flex; align-items: center; gap: 12px; margin: 0 0 6px; font-size: 24px; font-weight: 700; color: var(--va-text); }
.visa-apply .va-hero-flag { width: 26px; height: 18px; object-fit: cover; border-radius: 3px; box-shadow: 0 0 0 1px rgba(0,0,0,.08); }
.visa-apply .va-crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13px; }
.visa-apply .va-crumbs a { color: var(--va-text); text-decoration: none; }
.visa-apply .va-crumbs span { color: var(--va-muted); }
.visa-apply .va-crumbs .va-crumb-active { color: var(--va-primary); font-weight: 600; }
.visa-apply .va-hero-tagline { align-items: center; gap: 14px; font-size: 13px; color: var(--va-text); }
.visa-apply .va-hero-tagline i { font-size: 22px; color: #6b6f8a; transform: rotate(-15deg); }

.visa-apply .va-card { height: 100%; padding: 24px; border-radius: 16px; background: #fff; border: 1px solid #eef0f4; box-shadow: 0 4px 20px rgba(31, 26, 77, .06); }
.visa-apply .va-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.visa-apply .va-section-head h6 { margin: 0; font-size: 16px; font-weight: 700; color: var(--va-text); }
.visa-apply .va-section-head p { margin: 2px 0 0; font-size: 13px; color: var(--va-muted); }
.visa-apply .va-section-icon { width: 40px; height: 40px; flex-shrink: 0; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; background: var(--va-primary); }
.visa-apply .va-section-icon-round { border-radius: 50%; }
.visa-apply .va-section-icon-plain { background: transparent; color: var(--va-text); font-size: 20px; width: 28px; }

.visa-apply .va-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--va-text); }
.visa-apply .va-field { position: relative; }
.visa-apply .va-field .form-select, .visa-apply .va-field .form-control { height: 44px; padding-left: 38px; border: 1px solid var(--va-border); border-radius: 10px; font-size: 14px; color: var(--va-text); box-shadow: none; }
.visa-apply .va-field .form-select:focus, .visa-apply .va-field .form-control:focus { border-color: var(--va-primary); box-shadow: 0 0 0 3px rgba(75, 46, 158, .12); }
.visa-apply .va-field .form-control:disabled { background: #f3f4f6; color: var(--va-muted); }
.visa-apply .va-field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--va-muted); pointer-events: none; z-index: 1; }
.visa-apply .va-field-icon-right { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--va-muted); cursor: pointer; font-size: 12px; }
.visa-apply .va-divider { margin: 24px 0; border-color: #eef0f4; opacity: 1; }

.visa-apply .va-client-picker { position: relative; }
.visa-apply .va-client-search { padding-right: 36px; }
.visa-apply .va-client-list { position: absolute; z-index: 20; left: 0; right: 0; top: calc(100% + 4px); max-height: 240px; overflow-y: auto; margin: 0; padding: 6px; list-style: none; background: #fff; border: 1px solid var(--va-border); border-radius: 10px; box-shadow: 0 10px 24px rgba(31, 26, 77, .12); }
.visa-apply .va-client-list li { display: flex; flex-direction: column; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; }
.visa-apply .va-client-list li span { color: var(--va-muted); font-size: 12px; }
.visa-apply .va-client-list li:hover, .visa-apply .va-client-list li.active { background: var(--va-primary-soft); }
.visa-apply .va-client-list .va-client-empty { cursor: default; color: var(--va-muted); }
.visa-apply .va-client-list .va-client-empty:hover { background: transparent; }
.visa-apply .va-client-selected { display: flex; align-items: center; gap: 14px; margin-top: 14px; padding: 14px 16px; border-radius: 10px; background: #f7f7fb; font-size: 13px; }
.visa-apply .va-client-selected > i { color: var(--va-muted); font-size: 16px; }
.visa-apply .va-client-selected div { flex: 1; display: flex; flex-direction: column; }
.visa-apply .va-client-selected span { color: var(--va-muted); font-size: 12px; }
.visa-apply .va-client-clear { border: 0; background: transparent; color: var(--va-muted); }

.visa-apply .va-count { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 22px; margin-left: 6px; padding: 0 7px; border-radius: 11px; background: var(--va-primary-soft); color: var(--va-primary); font-size: 12px; }
.visa-apply .va-checks { display: flex; gap: 24px; margin-bottom: 14px; font-size: 14px; font-weight: 600; }
.visa-apply .va-checks label, .visa-apply .va-passenger-check { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.visa-apply input[type="checkbox"] { width: 17px; height: 17px; accent-color: var(--va-primary); cursor: pointer; }
.visa-apply .va-passenger { margin-bottom: 14px; padding: 16px 18px; border: 1px solid #e3def7; border-radius: 12px; background: #fcfbff; }
.visa-apply .va-passenger-off { background: #fafafa; border-style: dashed; }
.visa-apply .va-passenger-off .va-passenger-title { color: var(--va-muted); margin-bottom: 0; }
.visa-apply .va-passenger-title { margin-bottom: 12px; font-size: 15px; font-weight: 700; color: var(--va-text); }
.visa-apply .va-relation { font-weight: 500; color: var(--va-muted); text-transform: lowercase; }
.visa-apply .va-input { height: 42px; border: 1px solid var(--va-border); border-radius: 8px; font-size: 14px; color: var(--va-text); box-shadow: none; }
.visa-apply .va-input:focus { border-color: var(--va-primary); box-shadow: 0 0 0 3px rgba(75, 46, 158, .12); }
.visa-apply .va-input[readonly] { background: #f3f4f6; color: #374151; }
.visa-apply .va-remove { border: 1px solid #fca5a5; border-radius: 6px; padding: 3px 10px; background: #fff; color: #dc2626; font-size: 12px; }
.visa-apply .va-remove:hover { background: #fef2f2; }
.visa-apply .va-add { padding: 9px 16px; border: 1px solid #16a34a; border-radius: 8px; background: #f0fdf4; color: #15803d; font-size: 14px; font-weight: 600; }
.visa-apply .va-add:hover { background: #dcfce7; }
.visa-apply .va-total-base { color: var(--va-muted); font-size: 11px; font-weight: 500; }
.visa-apply .va-proceed:disabled { opacity: .7; }
.visa-apply .va-proceed { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; margin-top: 16px; padding: 13px 20px; border: 0; border-radius: 10px; background: var(--va-primary); color: #fff; font-weight: 600; font-size: 14px; transition: background .2s; }
.visa-apply .va-proceed:hover { background: #3c2482; }

.visa-apply .va-basket-summary { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; padding: 16px; border-radius: 12px; background: #f5f3fc; }
.visa-apply .va-basket-flag { width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,.12); }
.visa-apply .va-basket-summary div { display: flex; flex-direction: column; min-width: 0; font-size: 14px; }
.visa-apply .va-basket-summary span { margin-top: 2px; color: var(--va-muted); font-size: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.visa-apply .va-fee { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 4px; border-bottom: 1px solid #eef0f4; font-size: 14px; }
.visa-apply .va-fee > span { display: flex; align-items: center; gap: 12px; }
.visa-apply .va-fee > span i { width: 16px; color: var(--va-text); }
.visa-apply .va-fee > div { display: flex; flex-direction: column; align-items: flex-end; }
.visa-apply .va-fee small { color: var(--va-muted); font-size: 11px; }
.visa-apply .va-total { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding: 18px 16px; border-radius: 12px; background: #f1eefb; font-size: 16px; font-weight: 700; }
.visa-apply .va-total span { display: flex; align-items: center; gap: 12px; }
.visa-apply .va-total span i { color: var(--va-primary); font-size: 20px; }
.visa-apply .va-total strong { font-size: 20px; }
.visa-apply .va-secure { display: flex; align-items: center; gap: 14px; margin-top: 18px; padding: 16px; border-radius: 12px; background: #eef8f1; font-size: 12px; }
.visa-apply .va-secure div:last-child { display: flex; flex-direction: column; }
.visa-apply .va-secure strong { color: #15803d; font-size: 13px; }
.visa-apply .va-secure span { color: var(--va-muted); }
.visa-apply .va-secure-icon { width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; color: #16a34a; font-size: 16px; }

.visa-apply .va-features { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 24px; padding: 18px 8px; border-radius: 16px; background: #f7f7fb; }
.visa-apply .va-feature { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 4px 12px; font-size: 12px; }
.visa-apply .va-feature + .va-feature { border-left: 1px solid var(--va-border); }
.visa-apply .va-feature i { font-size: 20px; color: var(--va-primary); }
.visa-apply .va-feature div { display: flex; flex-direction: column; }
.visa-apply .va-feature strong { color: var(--va-text); }
.visa-apply .va-feature span { color: var(--va-muted); }
.visa-apply .va-fee > span, .visa-apply .va-section-head > div:last-child { min-width: 0; }
@media (max-width: 767px) {
    .visa-apply .va-hero { padding: 16px; }
    .visa-apply .va-hero-icon { width: 44px; height: 44px; font-size: 18px; }
    .visa-apply .va-hero-title { font-size: 20px; flex-wrap: wrap; }
    .visa-apply .va-card { padding: 16px; }
    .visa-apply .va-fee { gap: 12px; }
    .visa-apply .va-fee > div { flex-shrink: 0; }
    .visa-apply .va-features { grid-template-columns: repeat(2, 1fr); row-gap: 16px; }
    .visa-apply .va-feature:nth-child(3) { border-left: 0; }
    .visa-apply .va-feature { justify-content: flex-start; }
}
`;

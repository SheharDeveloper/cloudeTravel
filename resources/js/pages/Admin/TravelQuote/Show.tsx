import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface TravelQuote {
    id: number;
    uid: string;
    display_name: string;
    check_in_date: string;
    checkout_date: string;
    night: number;
    hotel_details?: any;
    flight_details?: any;
    visa_details?: any;
    travel_details?: any;
    start?: string;
    half_board?: string;
    all_inclusive?: string;
    images?: string[];
    image_urls?: string[];
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString + (dateString.includes('T') ? '' : 'T00:00:00'));
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
    } catch {
        return 'N/A';
    }
};

interface FieldProps {
    icon: string;
    label: string;
    value: string | number;
}

const InfoField = ({ icon, label, value }: FieldProps) => (
    <div className="mb-3">
        <label className="text-muted small d-flex align-items-center mb-1">
            <span className="me-2">{icon}</span> {label}
        </label>
        <p className="fw-semibold mb-0 ms-4">{value || 'N/A'}</p>
    </div>
);

const ServiceDetailsBox = ({ data }: { data: any }) => {
    if (!data) return null;
    const items = Array.isArray(data) ? data : [data];
    return (
        <div className="row g-3">
            {items.map((item, idx) => (
                <div key={idx} className="col-md-4">
                    <div className="border rounded p-3" style={{ borderColor: '#E5E7EB', height: '100%' }}>
                        {Object.entries(item).map(([key, val]) => (
                            <div key={key} className="mb-2">
                                <small className="text-muted text-capitalize">{key.replace(/_/g, ' ')}</small>
                                <p className="fw-semibold mb-0 text-dark">{String(val)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const FlightTimeline = ({ flights }: { flights: any }) => {
    if (!flights || !Array.isArray(flights) || flights.length === 0) return null;

    return (
        <div className="row g-3">
            {flights.map((flight: any, idx: number) => (
                <div key={idx} className="col-md-6">
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '14px',
                        padding: '24px 16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        height: '100%'
                    }}>
                        {/* Journey Type Header */}
                        {flight.journeyType && (
                            <div style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#0499FF',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '20px'
                            }}>
                                {flight.journeyType === 'outbound' ? '📤 Outbound Journey' : '📥 Return Journey'}
                            </div>
                        )}

                        {/* Airline Info */}
                        {flight.airline && (
                            <div style={{
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#F3F4F6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }}>
                                    ✈️
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600', color: '#1F2937', fontSize: '16px' }}>
                                        {flight.airline}
                                    </p>
                                    {flight.flightNumber && (
                                        <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
                                            Flight #{flight.flightNumber}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timeline Section */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            marginBottom: '24px'
                        }}>
                            {/* Departure */}
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                    marginBottom: '8px'
                                }}>
                                    Departure
                                </div>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#1F2937',
                                    lineHeight: '1'
                                }}>
                                    {flight.departure?.split(' ')[0] || 'N/A'}
                                </div>
                                {flight.departure && flight.departure.includes(' ') && (
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6B7280',
                                        marginTop: '6px'
                                    }}>
                                        {flight.departure.split(' ').slice(1).join(' ')}
                                    </div>
                                )}
                            </div>

                            {/* Flight Path */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                minWidth: '120px'
                            }}>
                                <div style={{
                                    fontSize: '20px',
                                    color: '#0499FF'
                                }}>
                                    🛫
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '2px',
                                    background: 'linear-gradient(90deg, #E5E7EB 0%, #0499FF 50%, #E5E7EB 100%)',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '16px'
                                    }}>
                                        ✈️
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '20px',
                                    color: '#0499FF'
                                }}>
                                    🛬
                                </div>
                            </div>

                            {/* Arrival */}
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                    marginBottom: '8px'
                                }}>
                                    Arrival
                                </div>
                                <div style={{
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#1F2937',
                                    lineHeight: '1'
                                }}>
                                    {flight.arrival?.split(' ')[0] || 'N/A'}
                                </div>
                                {flight.arrival && flight.arrival.includes(' ') && (
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6B7280',
                                        marginTop: '6px'
                                    }}>
                                        {flight.arrival.split(' ').slice(1).join(' ')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Route Info */}
                        {flight.route && (
                            <div style={{
                                background: '#F9FAFB',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                color: '#6B7280',
                                borderLeft: '3px solid #0499FF',
                                marginBottom: '12px'
                            }}>
                                📍 {flight.route}
                            </div>
                        )}

                        {/* Price */}
                        {flight.price && (
                            <div style={{
                                background: 'linear-gradient(135deg, #F0F8FF 0%, #ffffff 100%)',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                borderLeft: '3px solid #0499FF',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>
                                    💰 Price
                                </span>
                                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0499FF' }}>
                                    £{Number(flight.price).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

interface Feedback {
    id: number;
    status: string;
    name: string;
    email: string;
    phone_number: string;
    reason?: string;
    created_at: string;
}

/** The "To" part of the invoice: who it's for and their address (the invoice form). */
type InvoiceCustomer = { name: string; email: string; phone: string; address: string; city: string; state: string; zip_code: string; country: string };

interface QuoteInvoiceItem {
    uid: string;
    invoice_number: string;
    status: string;
    total: string;
    created_at: string;
    customer: Record<keyof InvoiceCustomer, string | null>;
    invoice_url: string;
}

/** A customer who responded to this quote: their live invoice (once generated) and any rejected ones. */
interface QuoteInvoice {
    feedback_id: number;
    response_status: 'accept' | 'reject';
    name: string;
    email: string;
    phone: string | null;
    accepted_at: string;
    invoice: QuoteInvoiceItem | null;
    rejected_invoices: QuoteInvoiceItem[];
}

const CUSTOMER_FIELDS: { key: keyof InvoiceCustomer; label: string; col: string; required?: boolean; type?: string }[] = [
    { key: 'name', label: 'Full Name', col: 'col-md-6', required: true },
    { key: 'email', label: 'Email', col: 'col-md-6', required: true, type: 'email' },
    { key: 'phone', label: 'Phone', col: 'col-md-6' },
    { key: 'country', label: 'Country', col: 'col-md-6' },
    { key: 'address', label: 'Address', col: 'col-12' },
    { key: 'city', label: 'City', col: 'col-md-4' },
    { key: 'state', label: 'State', col: 'col-md-4' },
    { key: 'zip_code', label: 'Zip Code', col: 'col-md-4' },
];

export default function TravelQuoteShow({ travelQuote, feedback, invoices = [] }: { travelQuote: TravelQuote; feedback: Feedback[]; invoices?: QuoteInvoice[] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [invoiceIndex, setInvoiceIndex] = useState(0);
    const accepted = invoices[invoiceIndex] ?? invoices[0];

    // The invoice form (popup): create a new invoice, or edit the live one's details
    const [invoiceForm, setInvoiceForm] = useState<{ row: QuoteInvoice; editing: boolean; values: InvoiceCustomer } | null>(null);
    const [invoiceErrors, setInvoiceErrors] = useState<Record<string, string>>({});
    const [savingInvoice, setSavingInvoice] = useState(false);
    const openInvoiceForm = (row: QuoteInvoice) => {
        // Editing: what's on the invoice; new: the response's details (and the last rejected invoice's address, if any)
        const from = row.invoice?.customer ?? row.rejected_invoices[0]?.customer;
        const pick = (key: keyof InvoiceCustomer, fallback: string | null = '') => (from?.[key] ?? fallback ?? '') as string;
        setInvoiceErrors({});
        setInvoiceForm({
            row,
            editing: !!row.invoice,
            values: {
                name: pick('name', row.name), email: pick('email', row.email), phone: pick('phone', row.phone),
                address: pick('address'), city: pick('city'), state: pick('state'), zip_code: pick('zip_code'), country: pick('country'),
            },
        });
    };
    const saveInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceForm) return;
        const { row, editing, values } = invoiceForm;
        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setInvoiceForm(null),
            onError: (errs: Record<string, string>) => setInvoiceErrors(errs),
            onFinish: () => setSavingInvoice(false),
        };
        setSavingInvoice(true);
        if (editing && row.invoice) {
            router.put(`/admin/travel-quote/${travelQuote.uid}/invoices/${row.invoice.uid}`, values, options);
        } else {
            router.post(`/admin/travel-quote/${travelQuote.uid}/feedback/${row.feedback_id}/invoice`, values, options);
        }
    };
    const [copied, setCopied] = useState(false);
    const [feedbackList, setFeedbackList] = useState<Feedback[]>(feedback || []);
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleCopyLink = () => {
        const previewUrl = `${window.location.origin}/quote/preview/${travelQuote.uid}`;
        navigator.clipboard.writeText(previewUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = () => {
        const previewUrl = `${window.location.origin}/quote/preview/${travelQuote.uid}`;
        if (navigator.share) {
            navigator.share({
                title: `${travelQuote.display_name} - Travel Quote`,
                text: 'Check out this travel quote',
                url: previewUrl
            });
        } else {
            handleCopyLink();
        }
    };

    const hasFlightDetails = travelQuote.flight_details && (Array.isArray(travelQuote.flight_details) ? travelQuote.flight_details.length > 0 : Object.keys(travelQuote.flight_details).length > 0);
    const hasHotelDetails = travelQuote.hotel_details && (Array.isArray(travelQuote.hotel_details) ? travelQuote.hotel_details.length > 0 : Object.keys(travelQuote.hotel_details).length > 0);
    const hasVisaDetails = travelQuote.visa_details && (Array.isArray(travelQuote.visa_details) ? travelQuote.visa_details.length > 0 : Object.keys(travelQuote.visa_details).length > 0);
    const hasTravelDetails = travelQuote.travel_details && (Array.isArray(travelQuote.travel_details) ? travelQuote.travel_details.length > 0 : Object.keys(travelQuote.travel_details).length > 0);
    const hasImages = travelQuote.image_urls && travelQuote.image_urls.length > 0;

    return (
        <ProtectedRoute>
            <style>{`
                .card { border-radius: 12px; border: 1px solid #E5E7EB; box-shadow: 0 2px 8px rgba(0,0,0,0.04); height: auto; }
                .card-header { padding: 1rem; background: transparent; border-bottom: none; }
                .card-body { padding: 1rem; }
                .card-title { font-size: 15px; font-weight: 600; }
                .row { margin-left: -12px; margin-right: -12px; }
                .col-md-6, .col-md-4, .col-md-3, .col-lg-12 { padding-left: 12px; padding-right: 12px; }
                @media (max-width: 768px) {
                    .col-md-6 { flex: 0 0 100%; }
                    .col-md-4 { flex: 0 0 100%; }
                    .col-md-3 { flex: 0 0 50%; }
                }
            `}</style>

            {/* Page Title */}
            <div className="page-title mb-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li><h1>Travel Quote Details</h1></li>
                        <li className="breadcrumb-item"><a href="/admin/travel-quote">Travel Quotes</a></li>
                        <li className="breadcrumb-item active">#{travelQuote.id}</li>
                    </ol>
                </nav>
            </div>

            {/* Header Section */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h3 className="fw-bold mb-2" style={{ fontSize: '20px' }}>{travelQuote.display_name}</h3>
                            <div className="d-flex gap-3 flex-wrap">
                                <span className="badge bg-info">{travelQuote.image_urls?.length || 0} Image(s)</span>
                                <span className="text-muted small">
                                    <i className="las la-calendar me-1"></i>
                                    {formatDate(travelQuote.check_in_date)} to {formatDate(travelQuote.checkout_date)}
                                </span>
                                <span className="text-muted small">
                                    <i className="las la-moon me-1"></i>
                                    {travelQuote.night} Nights
                                </span>
                            </div>
                        </div>
                        <div className="text-end">
                            <small className="text-muted d-block">Quote ID</small>
                            <strong style={{ fontSize: '14px' }}>{travelQuote.uid.substring(0, 12)}</strong>
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-sm btn-outline-primary" onClick={handleCopyLink} title={copied ? 'Copied!' : 'Copy preview link'}>
                            <i className={`fa ${copied ? 'fa-check' : 'fa-link'} me-1`}></i> {copied ? 'Copied' : 'Copy Link'}
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={handleShare}>
                            <i className="fa fa-share me-1"></i> Share
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-top">
                    <div className="d-flex px-4 flex-wrap" style={{ gap: '2rem', overflowX: 'auto' }}>
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'overview' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                            style={{ fontWeight: activeTab === 'overview' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'overview' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                        >
                            Overview
                        </button>
                        {hasFlightDetails && (
                            <button
                                onClick={() => setActiveTab('flights')}
                                className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'flights' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                style={{ fontWeight: activeTab === 'flights' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'flights' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                            >
                                ✈️ Flights
                            </button>
                        )}
                        {hasHotelDetails && (
                            <button
                                onClick={() => setActiveTab('hotels')}
                                className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'hotels' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                style={{ fontWeight: activeTab === 'hotels' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'hotels' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                            >
                                🏨 Hotels
                            </button>
                        )}
                        {hasVisaDetails && (
                            <button
                                onClick={() => setActiveTab('visas')}
                                className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'visas' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                style={{ fontWeight: activeTab === 'visas' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'visas' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                            >
                                🛂 Visas
                            </button>
                        )}
                        {hasTravelDetails && (
                            <button
                                onClick={() => setActiveTab('travel')}
                                className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'travel' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                style={{ fontWeight: activeTab === 'travel' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'travel' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                            >
                                🌍 Travel
                            </button>
                        )}
                        {hasImages && (
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'gallery' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                style={{ fontWeight: activeTab === 'gallery' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'gallery' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                            >
                                📷 Gallery
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('responses')}
                            className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'responses' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                            style={{ fontWeight: activeTab === 'responses' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'responses' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                        >
                            Responses
                        </button>
                        {/* Only once a customer has responded to the quote */}
                        {(feedback?.length ?? 0) > 0 && (
                            <button
                                onClick={() => setActiveTab('invoice')}
                                className={`py-3 px-0 border-0 bg-transparent ${activeTab === 'invoice' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
                                style={{ fontWeight: activeTab === 'invoice' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'invoice' ? '2px solid #0d6efd' : 'none', whiteSpace: 'nowrap', fontSize: '16px' }}
                            >
                                🧾 Invoice
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <div>
                    {/* Quote Information Card */}
                    <div className="card mb-3">
                        <div className="card-header">
                            <h5 className="card-title mb-0">📋 Quote Information</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <InfoField icon="👤" label="Customer Name" value={travelQuote.display_name} />
                                </div>
                                <div className="col-md-6">
                                    <InfoField icon="🆔" label="Quote ID" value={travelQuote.uid} />
                                </div>
                                <div className="col-md-6">
                                    <InfoField icon="📅" label="Check-in" value={formatDate(travelQuote.check_in_date)} />
                                </div>
                                <div className="col-md-6">
                                    <InfoField icon="📅" label="Check-out" value={formatDate(travelQuote.checkout_date)} />
                                </div>
                                <div className="col-md-6">
                                    <InfoField icon="🌙" label="Duration" value={`${travelQuote.night} nights`} />
                                </div>
                                <div className="col-md-6">
                                    <InfoField icon="🍽️" label="Meal Plan" value={travelQuote.half_board || 'N/A'} />
                                </div>
                                {travelQuote.start && (
                                    <div className="col-md-6">
                                        <InfoField icon="✈️" label="Departure" value={formatDate(travelQuote.start)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* Flights Tab */}
            {activeTab === 'flights' && hasFlightDetails && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">✈️ Flight Details</h5>
                    </div>
                    <div className="card-body">
                        <FlightTimeline flights={travelQuote.flight_details} />
                    </div>
                </div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && hasHotelDetails && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">🏨 Hotel Details</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {Array.isArray(travelQuote.hotel_details) ? travelQuote.hotel_details.map((hotel: any, idx: number) => (
                                <div key={idx} className="col-md-4">
                                    <div style={{
                                        background: '#ffffff',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '14px',
                                        padding: '24px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                    }}>
                                        {/* Title - Name and Display Name */}
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#000000' }}>
                                            🏨 {hotel.name} {hotel.displayName}
                                        </h4>

                                        {/* Stars Rating */}
                                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#F59E0B' }}>
                                            {'⭐'.repeat(hotel.star_rating || hotel.rating || 5)}
                                        </p>

                                        {/* Address - Country and City */}
                                        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>
                                            📍 {hotel.address ? `${hotel.address}, ` : ''}{hotel.location || 'N/A'}
                                        </p>

                                        <div style={{ borderTop: '1px solid #E5E7EB', margin: '16px 0' }}></div>

                                        {/* Price */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase' }}>💰 Price</p>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#000000' }}>
                                                £{hotel.price ? Number(hotel.price).toFixed(0) : 'N/A'}
                                            </p>
                                        </div>

                                        <div style={{ borderTop: '1px solid #E5E7EB', margin: '16px 0' }}></div>

                                        {/* Description/Other Details */}
                                        {Object.entries(hotel).map(([key, val]) => {
                                            if (['name', 'display_name', 'displayName', 'location', 'address', 'price', 'stars', 'star_rating', 'rating'].includes(key) || !val) return null;
                                            return (
                                                <div key={key} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: '600', color: '#9CA3AF', textTransform: 'capitalize' }}>
                                                        📝 {key.replace(/_/g, ' ')}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: '13px', color: '#000000' }}>{String(val)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-12">
                                    <p className="text-muted">No hotel details available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Visas Tab */}
            {activeTab === 'visas' && hasVisaDetails && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">🛂 Visa Details</h5>
                    </div>
                    <div className="card-body">
                        <ServiceDetailsBox data={travelQuote.visa_details} />
                    </div>
                </div>
            )}

            {/* Travel Tab */}
            {activeTab === 'travel' && hasTravelDetails && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">🌍 Travel Details</h5>
                    </div>
                    <div className="card-body">
                        <ServiceDetailsBox data={travelQuote.travel_details} />
                    </div>
                </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && hasImages && travelQuote.image_urls && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">📷 Gallery ({travelQuote.image_urls?.length || 0})</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {travelQuote.image_urls?.map((url, idx) => (
                                <div key={idx} className="col-md-4">
                                    <img
                                        src={url}
                                        alt={`Quote ${idx + 1}`}
                                        className="img-fluid rounded"
                                        style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Responses Tab */}
            {activeTab === 'responses' && (
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">💬 Customer Responses ({feedback?.length || 0})</h5>
                    </div>
                    <div className="card-body">
                        {feedback && feedback.length > 0 ? (
                            <div className="row g-3">
                                {feedback.map((resp: Feedback, idx) => (
                                    <div key={idx} className="col-md-4">
                                        <div className={`card border-${resp.status === 'accept' ? 'success' : 'danger'}`}>
                                            <div className="card-body">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                                                    <span className={`badge bg-${resp.status === 'accept' ? 'success' : 'danger'}`}>
                                                        {resp.status === 'accept' ? '✓ Accepted' : '✕ Rejected'}
                                                    </span>
                                                    <button
                                                        className={`btn btn-sm ${editingId === resp.id ? 'btn-warning' : 'btn-outline-secondary'}`}
                                                        onClick={() => {
                                                            if (editingId === resp.id) {
                                                                setEditingId(null);
                                                            } else {
                                                                setEditingId(resp.id);
                                                            }
                                                        }}
                                                    >
                                                        {editingId === resp.id ? 'Cancel' : '🔄 Toggle Status'}
                                                    </button>
                                                    {editingId === resp.id && (
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ maxWidth: '140px' }}
                                                            defaultValue={resp.status}
                                                            onChange={(e) => {
                                                                const newStatus = e.target.value;
                                                                router.put(`/admin/travel-quote-feedback/${resp.id}/status`, { status: newStatus }, {
                                                                    onSuccess: () => {
                                                                        const updated = [...feedbackList];
                                                                        const index = updated.findIndex(f => f.id === resp.id);
                                                                        if (index !== -1) updated[index].status = newStatus;
                                                                        setFeedbackList(updated);
                                                                        setEditingId(null);
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <option value="">Select Status</option>
                                                            {/* Reject also rejects the customer's invoice; accept again to generate a new one */}
                                                            <option value="accept">Accept</option>
                                                            <option value="reject">Reject</option>
                                                            <option value="inactive">Inactive (Hide)</option>
                                                        </select>
                                                    )}
                                                    <small className="text-muted">{new Date(resp.created_at).toLocaleDateString()}</small>
                                                </div>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <p className="mb-2"><strong>👤 {resp.name}</strong></p>
                                                    <p className="mb-2">📧 {resp.email}</p>
                                                    <p className="mb-0">📱 {resp.phone_number}</p>
                                                </div>
                                                {resp.reason && (
                                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                                                        <p className="mb-2"><strong>Feedback:</strong></p>
                                                        <p className="text-muted mb-0">{resp.reason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <i className="fa fa-inbox text-muted" style={{ fontSize: '32px', marginBottom: '1rem', display: 'block', opacity: 0.5 }}></i>
                                <p className="text-muted mb-0">No responses yet. Customer responses will appear here once they interact with this quote.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Invoice Tab: "Generate Invoice" for the customer who accepted, then the invoice itself */}
            {activeTab === 'invoice' && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <h5 className="card-title mb-0">🧾 Invoice</h5>
                        {accepted?.invoice && accepted.response_status === 'accept' && (
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openInvoiceForm(accepted)}>
                                    <i className="fa fa-pen me-1"></i> Edit Invoice
                                </button>
                                <a href={accepted.invoice.invoice_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                                    <i className="fa fa-print me-1"></i> Open / Print
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="card-body">
                        {accepted ? (
                            <>
                                {/* More than one customer responded: pick whose invoice */}
                                {invoices.length > 1 && (
                                    <div className="d-flex gap-2 flex-wrap mb-3">
                                        {invoices.map((row, idx) => (
                                            <button
                                                key={row.feedback_id}
                                                type="button"
                                                className={`btn btn-sm ${idx === invoiceIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => setInvoiceIndex(idx)}
                                            >
                                                {row.name}{row.invoice ? ` · ${row.invoice.invoice_number}` : ''}
                                                {row.response_status === 'reject' && ' · Rejected'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Invoices rejected before (the response was rejected) */}
                                {accepted.rejected_invoices.length > 0 && (
                                    <div className="alert alert-light border d-flex flex-wrap align-items-center gap-2 py-2 small">
                                        <i className="fa fa-ban text-danger"></i>
                                        <span>Rejected invoice{accepted.rejected_invoices.length > 1 ? 's' : ''}:</span>
                                        {accepted.rejected_invoices.map((inv) => (
                                            <a key={inv.uid} href={inv.invoice_url} target="_blank" rel="noreferrer" className="badge bg-danger text-decoration-none">
                                                {inv.invoice_number}
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {accepted.response_status === 'reject' ? (
                                    /* Rejected: no invoice until the response is accepted again */
                                    <div className="text-center py-5">
                                        <i className="fa fa-times-circle text-danger" style={{ fontSize: '36px', marginBottom: '1rem', display: 'block' }}></i>
                                        <p className="mb-1"><strong>{accepted.name}</strong>'s response is <span className="text-danger fw-semibold">rejected</span>, so the invoice is rejected.</p>
                                        <p className="text-muted small mb-0">Change the response to Accept (Responses tab) to generate a new invoice.</p>
                                    </div>
                                ) : accepted.invoice ? (
                                    <iframe
                                        key={`${accepted.invoice.uid}-${JSON.stringify(accepted.invoice.customer)}`}
                                        src={accepted.invoice.invoice_url}
                                        title={`Invoice ${accepted.invoice.invoice_number}`}
                                        style={{ width: '100%', height: '80vh', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff' }}
                                    />
                                ) : (
                                    <div className="text-center py-5">
                                        <i className="fa fa-file-invoice text-primary" style={{ fontSize: '36px', marginBottom: '1rem', display: 'block' }}></i>
                                        <p className="mb-1"><strong>{accepted.name}</strong> accepted this quote on {formatDate(accepted.accepted_at)}.</p>
                                        <p className="text-muted small mb-3">{accepted.email}{accepted.phone ? ` · ${accepted.phone}` : ''}</p>
                                        <button type="button" className="btn btn-primary" onClick={() => openInvoiceForm(accepted)}>
                                            <i className="fa fa-file-invoice me-2"></i>Generate Invoice
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <i className="fa fa-file-invoice text-muted" style={{ fontSize: '32px', marginBottom: '1rem', display: 'block', opacity: 0.5 }}></i>
                                <p className="text-muted mb-0">No customer has accepted this quote yet. Once they accept, you can generate their invoice here.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* The invoice form: everything the invoice shows for the client, editable */}
            {invoiceForm && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => !savingInvoice && setInvoiceForm(null)}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <form className="modal-content" onSubmit={saveInvoice}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {invoiceForm.editing ? `Edit Invoice ${invoiceForm.row.invoice?.invoice_number}` : 'Generate Invoice'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setInvoiceForm(null)} disabled={savingInvoice}></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted small mb-3">
                                    These details show in the invoice's <strong>To</strong> section. The package, prices and dates come from the quote.
                                </p>
                                <div className="row">
                                    {CUSTOMER_FIELDS.map((field) => (
                                        <div key={field.key} className={`${field.col} mb-3`}>
                                            <label className="form-label" htmlFor={`inv-${field.key}`}>
                                                {field.label}{field.required && <span className="text-danger"> *</span>}
                                            </label>
                                            {field.key === 'address' ? (
                                                <textarea
                                                    id={`inv-${field.key}`}
                                                    rows={2}
                                                    className={`form-control ${invoiceErrors[field.key] ? 'is-invalid' : ''}`}
                                                    value={invoiceForm.values[field.key]}
                                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, values: { ...invoiceForm.values, [field.key]: e.target.value } })}
                                                />
                                            ) : (
                                                <input
                                                    id={`inv-${field.key}`}
                                                    type={field.type ?? 'text'}
                                                    required={field.required}
                                                    className={`form-control ${invoiceErrors[field.key] ? 'is-invalid' : ''}`}
                                                    value={invoiceForm.values[field.key]}
                                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, values: { ...invoiceForm.values, [field.key]: e.target.value } })}
                                                />
                                            )}
                                            {invoiceErrors[field.key] && <div className="invalid-feedback d-block">{invoiceErrors[field.key]}</div>}
                                        </div>
                                    ))}
                                </div>
                                {invoiceErrors.invoice && <div className="alert alert-danger py-2 mb-0">{invoiceErrors.invoice}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setInvoiceForm(null)} disabled={savingInvoice}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={savingInvoice}>
                                    <i className={`fa ${savingInvoice ? 'fa-spinner fa-spin' : invoiceForm.editing ? 'fa-save' : 'fa-file-invoice'} me-2`}></i>
                                    {savingInvoice ? 'Saving…' : invoiceForm.editing ? 'Save Changes' : 'Generate Invoice'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}

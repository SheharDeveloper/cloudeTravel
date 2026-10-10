import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import RichTextEditor from '@/components/RichTextEditor';
import { formatDate, statusBadge, statusLabel } from './Index';

const REMARK_MAX = 500;
// Formatting the server keeps: see ServiceBookingController::REMARK_TAGS
const REMARK_TOOLBAR = [['bold', 'italic', 'underline', 'strike'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']];

interface Application {
    uid: string;
    application_number: string;
    relation: string;
    first_name: string;
    last_name: string | null;
    email: string | null;
    passport_number: string | null;
    nationality: string | null;
    phone: string | null;
    amount: number;
    status: string;
}

interface DocSign {
    status: 'pending' | 'signed' | 'expired';
    url: string;
    signer_name: string | null;
    signer_email: string | null;
    email_sent_at: string | null;
    expires_at: string | null;
    signed_at: string | null;
    invoice_url: string;
}

const formatDateTime = (value: string | null) =>
    value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

interface Booking {
    uid: string;
    invoice_number: string;
    service: string;
    service_date: string | null;
    passengers: number;
    currency_symbol: string;
    currency_code: string;
    base_amount: number;
    service_fee: number;
    tax_amount: number;
    total_amount: number;
    status: string;
    created_at: string;
    details: Record<string, any> | null;
    invoice_remark: string | null;
    client: { uid: string; name: string; email: string; phone: string | null } | null;
    applications: Application[];
}

export default function ServiceBookingShow() {
    const { booking, flash, docSign } = usePage().props as unknown as { booking: Booking; flash?: { success?: string }; docSign: DocSign | null };

    // Opened from "View Application" (#application-<uid>): scroll to it and highlight it
    const [focusedApplication, setFocusedApplication] = useState<string | null>(null);
    useEffect(() => {
        const match = window.location.hash.match(/^#application-(.+)$/);
        if (!match) return;
        setFocusedApplication(match[1]);
        document.getElementById(`application-${match[1]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    // Doc Sign: generate the signing link (emailed to the client), resend it, or copy it
    const [signBusy, setSignBusy] = useState(false);
    const signAction = (path: string) => {
        setSignBusy(true);
        router.post(`/admin/service-bookings/${booking.uid}/${path}`, {}, {
            preserveScroll: true,
            onError: (errs) => toast.error(Object.values(errs)[0] ?? 'Something went wrong'),
            onFinish: () => setSignBusy(false),
        });
    };
    const generateDocSign = () => signAction('doc-sign');
    const resendDocSign = () => signAction('doc-sign/resend');
    const copySignUrl = async () => {
        if (!docSign) return;
        try {
            await navigator.clipboard.writeText(docSign.url);
            toast.success('Signing URL copied');
        } catch {
            // Clipboard blocked (e.g. not https): show it so it can be copied by hand
            window.prompt('Copy the signing URL:', docSign.url);
        }
    };
    const d = booking.details ?? {};
    const money = (value: number) => `${booking.currency_symbol}${value.toFixed(2)}`;

    // Payment Summary: one person's share of each amount, and the rest of the group
    const count = Math.max(booking.passengers, 1);
    const perPerson = {
        base: booking.base_amount / count,
        service: booking.service_fee / count,
        tax: booking.tax_amount / count,
        total: booking.total_amount / count,
    };
    const additional = count - 1;
    const taxLabel = (d.taxes ?? []).map((t: any) => `${t.name} ${t.percent}%`).join(' + ') || 'Tax';

    // Invoice remark editor (max 500 visible characters)
    const errors = usePage().props.errors as Record<string, string>;
    const [remarkOpen, setRemarkOpen] = useState(false);
    const [remark, setRemark] = useState('');
    const [savingRemark, setSavingRemark] = useState(false);
    const remarkLength = visibleLength(remark);
    const remarkTooLong = remarkLength > REMARK_MAX;
    const remarkError = errors.invoice_remark;

    const openRemark = () => {
        setRemark(booking.invoice_remark ?? '');
        setRemarkOpen(true);
    };

    const saveRemark = () => {
        if (remarkTooLong) return;
        setSavingRemark(true);
        router.put(
            `/admin/service-bookings/${booking.uid}/remark`,
            { invoice_remark: remarkLength === 0 ? '' : remark },
            {
                preserveScroll: true,
                onSuccess: () => setRemarkOpen(false),
                onFinish: () => setSavingRemark(false),
            },
        );
    };

    // Esc closes the remark editor
    useEffect(() => {
        if (!remarkOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setRemarkOpen(false);
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [remarkOpen]);

    // Shown once when arriving straight from the Apply page (clearing any
    // toast left over from it); the fixed id stops it showing twice.
    useEffect(() => {
        if (!flash?.success) return;
        toast.dismiss();
        toast.success(flash.success, { id: flash.success });
    }, [flash?.success]);

    return (
        <ProtectedRoute>
            <Head title={`Booking ${booking.invoice_number}`} />

            <div className="page-title mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li><h1>Booking {booking.invoice_number}</h1></li>
                        <li className="breadcrumb-item"><a href="/dashboard"><i className="fa fa-home me-2"></i>Dashboard</a></li>
                        <li className="breadcrumb-item"><a href="/admin/service-bookings">Service Bookings</a></li>
                        <li className="breadcrumb-item active">{booking.invoice_number}</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card mb-4" style={{ height: 'auto' }}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="card-title mb-0">
                                {booking.service === 'visa' ? `${d.destination ?? ''} Visa` : booking.service}
                            </h6>
                            <span className={`badge ${statusBadge(booking.status)} text-capitalize`}>{booking.status}</span>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <Detail label="Invoice Number" value={booking.invoice_number} />
                                <Detail label="Service" value={booking.service} capitalize />
                                <Detail label="Booked On" value={formatDate(booking.created_at)} />
                                {booking.service === 'visa' && (
                                    <>
                                        <Detail label="Visa Category" value={d.visa_name} />
                                        <Detail label="Visa Type" value={d.visa_type} />
                                        <Detail label="Validity" value={d.validity} />
                                        <Detail label="Processing Time" value={d.processing_time} />
                                        <Detail label="Date of Entry" value={formatDate(booking.service_date)} />
                                        <Detail label="Citizenship" value={d.origin} />
                                        {d.living_in && <Detail label="Living In" value={d.living_in} />}
                                    </>
                                )}
                                <Detail label="Client" value={booking.client ? `${booking.client.name} (${booking.client.email})` : '—'} />
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4" style={{ height: 'auto' }}>
                        <div className="card-header">
                            <h6 className="card-title mb-0">Applications ({booking.applications.length})</h6>
                        </div>
                        <div className="card-body">
                            {booking.applications.map((a, index) => (
                                <div
                                    key={a.uid}
                                    id={`application-${a.uid}`}
                                    className={`border rounded p-3 mb-3 sb-application ${focusedApplication === a.uid ? 'sb-application-focus' : ''}`}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong>
                                            <span className="sb-app-number">{a.application_number}</span>
                                            Application {index + 1}: {a.first_name} {a.last_name}{' '}
                                            <span className="text-muted fw-normal text-capitalize">({a.relation})</span>
                                        </strong>
                                        <span className={`badge ${statusBadge(a.status)} text-capitalize`}>{statusLabel(a.status)}</span>
                                    </div>
                                    <div className="row g-2 small">
                                        <Detail label="Passport Number" value={a.passport_number} />
                                        <Detail label="Nationality" value={a.nationality} />
                                        <Detail label="Phone" value={a.phone} />
                                        <Detail label="Email" value={a.email} />
                                        <Detail label="Amount" value={money(a.amount)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="sb-pay">
                        <div className="sb-pay-head">
                            <i className="fa-regular fa-money-bill-1"></i> Payment Summary
                        </div>
                        <div className="sb-pay-body">
                            {/* One person's fees, then everyone else as "Additional Members" */}
                            <PayRow label={booking.service === 'visa' ? 'Visa Fee' : 'Base Amount'} value={money(perPerson.base)} />
                            <PayRow label="Service Fee" value={money(perPerson.service)} />
                            {perPerson.tax > 0 && <PayRow label={taxLabel} value={money(perPerson.tax)} />}
                            {additional > 0 && (
                                <>
                                    <hr />
                                    <PayRow label={`Additional Members (1 + ${additional})`} value={money(perPerson.total * additional)} />
                                </>
                            )}
                            <hr />
                            <div className="sb-pay-total">
                                <span>Total Amount</span>
                                <strong>{money(booking.total_amount)}</strong>
                            </div>

                            {/* Doc Sign: generate once, then resend / copy the link until it's signed */}
                            {docSign && (
                                <div className={`sb-sign-status sb-sign-${docSign.status}`}>
                                    <strong>
                                        {docSign.status === 'signed' && <><i className="fa-solid fa-circle-check"></i> Signed</>}
                                        {docSign.status === 'pending' && <><i className="fa-regular fa-clock"></i> Awaiting signature</>}
                                        {docSign.status === 'expired' && <><i className="fa-solid fa-triangle-exclamation"></i> Link expired</>}
                                    </strong>
                                    <span>
                                        {docSign.status === 'signed'
                                            ? `By ${docSign.signer_name ?? 'the client'} on ${formatDateTime(docSign.signed_at)}`
                                            : docSign.signer_email
                                                ? `Sent to ${docSign.signer_email}${docSign.email_sent_at ? ` · ${formatDateTime(docSign.email_sent_at)}` : ''}`
                                                : 'No email address on file: copy the URL and share it'}
                                    </span>
                                    {docSign.status === 'pending' && <span>Deadline {formatDate(docSign.expires_at)}</span>}
                                </div>
                            )}

                            {!docSign && (
                                <button type="button" className="sb-pay-btn" onClick={generateDocSign} disabled={signBusy}>
                                    <i className="fa-regular fa-circle-check"></i> {signBusy ? 'Generating…' : 'Generate Doc Sign'}
                                </button>
                            )}
                            {docSign && docSign.status !== 'signed' && (
                                <button type="button" className="sb-pay-btn" onClick={resendDocSign} disabled={signBusy}>
                                    <i className="fa-regular fa-circle-check"></i> {signBusy ? 'Sending…' : 'Resend Email'}
                                </button>
                            )}
                            {docSign && (
                                <button type="button" className="sb-pay-btn" onClick={copySignUrl}>
                                    <i className="fa-regular fa-circle-check"></i> Copy URL
                                </button>
                            )}
                            {docSign?.status === 'signed' && (
                                <a href={docSign.invoice_url} target="_blank" rel="noreferrer" className="sb-pay-btn">
                                    <i className="fa-regular fa-file-lines"></i> View Signed Invoice
                                </a>
                            )}
                            <button type="button" className="sb-pay-btn" onClick={openRemark}>
                                {booking.invoice_remark ? 'Edit Invoice Remark' : 'Add Invoice Remark'}
                            </button>
                        </div>
                    </div>

                    {booking.invoice_remark && (
                        <div className="sb-remark">
                            <div className="sb-remark-head">
                                <span><i className="fa-regular fa-note-sticky"></i> Invoice Remark</span>
                                <button type="button" onClick={openRemark} aria-label="Edit invoice remark">
                                    <i className="fa-regular fa-pen-to-square"></i>
                                </button>
                            </div>
                            {/* Cleaned on the server to basic formatting only */}
                            <div className="sb-remark-body" dangerouslySetInnerHTML={{ __html: booking.invoice_remark }} />
                        </div>
                    )}
                </div>
            </div>

            {remarkOpen && (
                <div className="sb-modal-backdrop" onClick={() => setRemarkOpen(false)}>
                    <div
                        className="sb-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sb-remark-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sb-modal-head">
                            <h5 id="sb-remark-title">{booking.invoice_remark ? 'Edit Invoice Remark' : 'Add Invoice Remark'}</h5>
                            <button type="button" onClick={() => setRemarkOpen(false)} aria-label="Close">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <RichTextEditor
                            value={remark}
                            onChange={setRemark}
                            placeholder="Write a remark to show on the invoice..."
                            toolbar={REMARK_TOOLBAR}
                        />
                        <div className={`sb-counter ${remarkTooLong ? 'sb-counter-over' : ''}`}>
                            {remarkLength} / {REMARK_MAX} characters
                        </div>
                        {remarkError && <div className="invalid-feedback d-block">{remarkError}</div>}

                        <div className="sb-modal-actions">
                            <button type="button" className="sb-modal-cancel" onClick={() => setRemarkOpen(false)}>Cancel</button>
                            <button type="button" className="sb-modal-save" onClick={saveRemark} disabled={savingRemark || remarkTooLong}>
                                {savingRemark ? 'Saving…' : 'Save Remark'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{STYLES}</style>
            <Toaster position="top-right" />
        </ProtectedRoute>
    );
}

function Detail({ label, value, capitalize }: { label: string; value?: string | null; capitalize?: boolean }) {
    return (
        <div className="col-sm-6 col-md-4">
            <div className="text-muted small">{label}</div>
            <div className={`fw-semibold ${capitalize ? 'text-capitalize' : ''}`}>{value || '—'}</div>
        </div>
    );
}

function PayRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="sb-pay-row">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

/** The characters a reader sees in the editor's HTML (Quill's empty value is "<p><br></p>"). */
function visibleLength(html: string): number {
    const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
    return text.trim().length;
}

const STYLES = `
.sb-pay { margin-bottom: 1.5rem; border-radius: 12px; background: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, .08); overflow: hidden; }
.sb-pay-head { display: flex; align-items: center; gap: 10px; padding: 16px 22px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; font-size: 17px; font-weight: 700; color: #1f2937; }
.sb-pay-head i { color: #26a9e0; }
.sb-pay-body { padding: 18px 22px 22px; }
.sb-pay-row { display: flex; justify-content: space-between; gap: 12px; margin: 10px 0; font-size: 15px; color: #4b5563; }
.sb-pay-row strong { color: #111827; font-weight: 500; white-space: nowrap; }
.sb-pay-body hr { margin: 14px 0; border-color: #e5e7eb; opacity: 1; }
.sb-pay-total { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 17px; font-weight: 700; color: #1f2937; }
.sb-pay-total strong { color: #26a9e0; }
.sb-pay-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; margin-top: 12px; padding: 13px; border: 0; border-radius: 8px; background: #26a9e0; color: #fff; font-size: 15px; font-weight: 600; }
.sb-pay-btn:hover { background: #1d95c8; color: #fff; }
.sb-pay-btn:disabled { opacity: .7; }
a.sb-pay-btn { text-decoration: none; }
.sb-app-number { display: inline-block; margin-right: 8px; padding: 2px 8px; border-radius: 4px; background: #e0f2fe; color: #0369a1; font-size: 12px; }
/* Opened from "View Application": that application is highlighted */
.sb-application-focus { border-color: #26a9e0 !important; box-shadow: 0 0 0 3px rgba(38, 169, 224, .2); }
.sb-sign-status { display: flex; flex-direction: column; gap: 2px; margin-bottom: 4px; padding: 10px 12px; border-radius: 8px; font-size: 13px; }
.sb-sign-status strong { display: flex; align-items: center; gap: 6px; }
.sb-sign-status span { color: #4b5563; font-size: 12px; overflow-wrap: anywhere; }
.sb-sign-pending { background: #fef9c3; color: #854d0e; }
.sb-sign-signed { background: #dcfce7; color: #166534; }
.sb-sign-expired { background: #fee2e2; color: #991b1b; }
.sb-remark { margin-bottom: 1.5rem; padding: 16px 20px; border-radius: 12px; background: #fff; box-shadow: 0 2px 10px rgba(0, 0, 0, .08); }
.sb-remark-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-weight: 700; color: #1f2937; }
.sb-remark-head span { display: flex; align-items: center; gap: 8px; }
.sb-remark-head button { border: 0; background: transparent; color: #26a9e0; }
.sb-remark-body { font-size: 14px; color: #374151; overflow-wrap: anywhere; }
.sb-remark-body p { margin: 0 0 6px; }
.sb-remark-body ul, .sb-remark-body ol { margin: 0 0 6px; padding-left: 20px; }
/* The admin theme turns list markers off everywhere; remarks need them back */
.sb-remark-body ul li, .sb-remark-body li[data-list="bullet"] { display: list-item; list-style: disc outside !important; }
.sb-remark-body ol li:not([data-list="bullet"]) { display: list-item; list-style: decimal outside !important; }
.sb-modal-backdrop { position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(17, 24, 39, .45); }
.sb-modal { width: 100%; max-width: 560px; padding: 22px 24px; border-radius: 12px; background: #fff; box-shadow: 0 20px 50px rgba(0, 0, 0, .25); }
.sb-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.sb-modal-head h5 { margin: 0; font-size: 18px; font-weight: 700; color: #111827; }
.sb-modal-head button { border: 0; background: transparent; color: #6b7280; font-size: 18px; }
.sb-modal .ql-container { min-height: 150px; font-size: 14px; }
.sb-counter { margin-top: 6px; text-align: right; font-size: 12px; color: #6b7280; }
.sb-counter-over { color: #dc2626; font-weight: 600; }
.sb-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.sb-modal-actions button { padding: 9px 18px; border: 0; border-radius: 8px; font-weight: 600; }
.sb-modal-cancel { background: #e5e7eb; color: #111827; }
.sb-modal-save { background: #26a9e0; color: #fff; }
.sb-modal-save:disabled { opacity: .6; }
`;

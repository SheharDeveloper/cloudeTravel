import { useEffect, useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

interface Props {
    brand: { name: string; logo: string | null; email: string | null; phone: string | null };
    document: {
        id: string;
        invoice_number: string;
        service: string;
        visa_name: string;
        destination: string | null;
        date_issued: string;
        date_of_entry: string | null;
        passengers: number;
        total: string;
    };
    signer: { name: string | null; email: string | null; member_id: string | null; member_since: string | null };
    status: { value: 'pending' | 'signed'; expired: boolean; deadline: string | null; updated_at: string | null; signed_at: string | null };
    signatureImage: string | null;
    invoiceUrl: string;
    submitUrl: string;
    terms: { heading: string; description: string }[];
    flash?: { success?: string | null };
    errors: Record<string, string>;
}

const formatDate = (value: string | null, withTime = false) =>
    value
        ? new Date(value).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            ...(withTime && { hour: '2-digit', minute: '2-digit' }),
        })
        : '—';

/**
 * The public Document Signing Portal: the signer reviews the booking's
 * invoice, accepts the terms and signs with mouse or finger.
 */
export default function DocumentSign() {
    const { brand, document, signer, status, signatureImage, invoiceUrl, submitUrl, terms, flash, errors } =
        usePage().props as unknown as Props;
    const signed = status.value === 'signed';

    const [reviewed, setReviewed] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const pad = useRef<SignaturePadHandle>(null);

    const onReviewed = (checked: boolean) => {
        setReviewed(checked);
        if (checked && !termsAccepted) setTermsOpen(true);
    };

    const submit = () => {
        if (!reviewed) return setNotice('Please confirm that you have reviewed and agree to the document terms.');
        if (!termsAccepted) {
            setTermsOpen(true);
            return setNotice('Please read and accept the terms and conditions.');
        }
        if (!pad.current || pad.current.isEmpty()) return setNotice('Please provide your signature before submitting.');

        setNotice(null);
        setSubmitting(true);
        router.post(
            submitUrl,
            { accept_terms: true, signature_data: pad.current.toDataURL() },
            { preserveScroll: true, onFinish: () => setSubmitting(false) },
        );
    };

    // Esc closes the terms
    useEffect(() => {
        if (!termsOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setTermsOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [termsOpen]);

    const error = errors.signature_data || errors.accept_terms;

    return (
        <div className="ds-page">
            <Head title={`Sign ${document.invoice_number}`} />
            <style>{STYLES}</style>

            <div className="ds-wrap">
                {/* Header */}
                <div className="ds-hero">
                    <div className="ds-hero-left">
                        {brand.logo && <img src={brand.logo} alt="" className="ds-hero-logo" />}
                        <div>
                            <h1>Document Signing Portal</h1>
                            <div className="ds-hero-sub">
                                <span>{brand.name}</span>
                                <span className="ds-dot">•</span>
                                <span><i className="fa-regular fa-calendar me-1"></i>Document ID: {document.id}</span>
                            </div>
                        </div>
                    </div>
                    <span className="ds-pill">
                        <i className="fa-regular fa-clock me-1"></i>
                        {signed ? `Signed ${formatDate(status.signed_at)}` : `Deadline: ${formatDate(status.deadline)}`}
                    </span>
                </div>

                <div className="row g-4">
                    {/* Left column */}
                    <div className="col-lg-8">
                        {flash?.success && (
                            <div className="ds-alert ds-alert-success">
                                <i className="fa-solid fa-circle-check"></i>
                                {flash.success}
                            </div>
                        )}

                        {signed ? (
                            <Card>
                                <div className="ds-done">
                                    <div className="ds-done-icon"><i className="fa-solid fa-check"></i></div>
                                    <h3>Document Successfully Signed!</h3>
                                    <p>Thank you for completing the signing process. Your document is now being processed.</p>
                                </div>
                            </Card>
                        ) : (
                            <>
                                <Card title="Signer Information" icon="fa-regular fa-user">
                                    <div className="ds-signer">
                                        <div className="ds-avatar">{(signer.name ?? 'U').charAt(0).toUpperCase()}</div>
                                        <div className="ds-signer-body">
                                            <div className="ds-signer-head">
                                                <p className="ds-signer-name">{signer.name ?? 'Unknown signer'}</p>
                                                <span className="ds-tag"><i className="fa-solid fa-fingerprint me-1"></i>Signer</span>
                                            </div>
                                            <div className="row g-3">
                                                <Info icon="fa-regular fa-envelope" label="Email" value={signer.email} />
                                                <Info icon="fa-regular fa-user" label="Customer Since" value={formatDate(signer.member_since)} />
                                                <Info icon="fa-regular fa-id-card" label="Customer ID" value={signer.member_id ?? 'Not assigned'} />
                                                <Info icon="fa-regular fa-clock" label="Signing Deadline" value={formatDate(status.deadline)} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card title="Document Information" icon="fa-regular fa-file-lines">
                                    <div className="row g-4">
                                        <Info label="Visa Name" value={document.visa_name || '—'} large />
                                        <Info label="Service" value={document.service} large />
                                        <Info label="Date Issued" value={formatDate(document.date_issued)} large />
                                        <Info label="Invoice Number" value={document.invoice_number} large />
                                        {document.destination && <Info label="Destination" value={document.destination} large />}
                                        <Info label="Date of Entry" value={formatDate(document.date_of_entry)} large />
                                        <Info label="Applicants" value={String(document.passengers)} large />
                                        <Info label="Total Amount" value={document.total} large />
                                    </div>
                                </Card>
                            </>
                        )}

                        <Card
                            title="Document Preview"
                            icon="fa-regular fa-file"
                            action={<a href={invoiceUrl} target="_blank" rel="noreferrer" className="ds-link">Open full invoice <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i></a>}
                        >
                            {/* Reloads once signed, so the invoice shows the signature */}
                            <iframe key={status.value} src={`${invoiceUrl}?v=${status.value}`} title="Invoice" className="ds-frame" />
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="col-lg-4">
                        <div className="ds-sticky">
                            <Card title="Document Status" icon="fa-regular fa-clipboard">
                                <div className="ds-status-list">
                                    <div>
                                        <p className="ds-label">Current Status</p>
                                        {signed ? (
                                            <span className="ds-badge ds-badge-green">Signed</span>
                                        ) : status.expired ? (
                                            <span className="ds-badge ds-badge-red">Link Expired</span>
                                        ) : (
                                            <span className="ds-badge ds-badge-yellow">Pending Signature</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="ds-label">Last Updated</p>
                                        <p className="ds-value">{formatDate(status.updated_at, true)}</p>
                                    </div>
                                    <div>
                                        <p className="ds-label">{signed ? 'Signed On' : 'Signing Deadline'}</p>
                                        <p className="ds-value">{signed ? formatDate(status.signed_at, true) : formatDate(status.deadline)}</p>
                                    </div>
                                </div>

                                {!signed && (
                                    <div className="ds-note ds-note-yellow">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                        <div>
                                            <strong>Important Notice</strong>
                                            <p>
                                                {status.expired
                                                    ? `This link has expired. Please contact ${brand.name}${brand.phone ? ` on ${brand.phone}` : ''} for a new one.`
                                                    : 'Please sign this document before the deadline to avoid any processing delays.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {signed && signatureImage && (
                                <Card title="Digital Signature" icon="fa-solid fa-pen-nib">
                                    <div className="ds-signed-box">
                                        <img src={signatureImage} alt="Your signature" />
                                    </div>
                                    <p className="ds-muted mt-3 mb-0">Signed by {signer.name} on {formatDate(status.signed_at, true)}</p>
                                </Card>
                            )}

                            {!signed && !status.expired && (
                                <>
                                    <label className="ds-agree">
                                        <input type="checkbox" checked={reviewed} onChange={(e) => onReviewed(e.target.checked)} />
                                        <span>
                                            I have reviewed and agree to the terms of this document
                                            {termsAccepted ? (
                                                <span className="ds-agree-ok"><i className="fa-solid fa-check me-1"></i>Terms and conditions accepted</span>
                                            ) : (
                                                <button type="button" className="ds-agree-link" onClick={(e) => { e.preventDefault(); setTermsOpen(true); }}>
                                                    Read the terms and conditions
                                                </button>
                                            )}
                                        </span>
                                    </label>

                                    <Card title="Digital Signature" icon="fa-solid fa-pen-nib">
                                        <p className="ds-muted">Please sign in the box below using your mouse or touchscreen.</p>
                                        <SignaturePad ref={pad} />

                                        {(notice || error) && <p className="ds-error">{notice || error}</p>}

                                        <div className="ds-actions">
                                            <button type="button" className="ds-btn ds-btn-light" onClick={() => pad.current?.clear()}>
                                                <i className="fa-regular fa-trash-can me-2"></i>Clear Signature
                                            </button>
                                            <button type="button" className="ds-btn ds-btn-primary" onClick={submit} disabled={submitting}>
                                                <i className="fa-solid fa-pen-nib me-2"></i>{submitting ? 'Processing…' : 'Sign Document'}
                                            </button>
                                        </div>

                                        <div className="ds-note ds-note-blue">
                                            <i className="fa-solid fa-shield-halved"></i>
                                            <div>
                                                <strong>Your signature is secure and legally binding</strong>
                                                <p>By signing, you acknowledge that your digital signature is the legal equivalent of your handwritten signature.</p>
                                            </div>
                                        </div>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {termsOpen && (
                <div className="ds-modal-backdrop" onClick={() => setTermsOpen(false)}>
                    <div className="ds-modal" role="dialog" aria-modal="true" aria-labelledby="terms-title" onClick={(e) => e.stopPropagation()}>
                        <div className="ds-modal-body">
                            <h3 id="terms-title">Terms and Conditions</h3>
                            {terms.map((term) => (
                                <div key={term.heading} className="ds-term">
                                    <h4>{term.heading}</h4>
                                    <p>{term.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="ds-modal-foot">
                            <button type="button" className="ds-btn ds-btn-outline" onClick={() => setTermsOpen(false)}>Close</button>
                            <button
                                type="button"
                                className="ds-btn ds-btn-primary"
                                onClick={() => { setTermsAccepted(true); setReviewed(true); setTermsOpen(false); setNotice(null); }}
                            >
                                I Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Card({ title, icon, action, children }: { title?: string; icon?: string; action?: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="ds-card">
            {title && (
                <div className="ds-card-head">
                    <h3>{icon && <i className={`${icon} me-2`}></i>}{title}</h3>
                    {action}
                </div>
            )}
            <div className="ds-card-body">{children}</div>
        </div>
    );
}

function Info({ label, value, icon, large }: { label: string; value: string | null; icon?: string; large?: boolean }) {
    return (
        <div className="col-md-6">
            <div className="ds-info">
                {icon && <i className={`${icon} ds-info-icon`}></i>}
                <div>
                    <p className="ds-label">{label}</p>
                    <p className={`ds-value ${large ? 'ds-value-lg' : ''}`}>{value || '—'}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Signature pad ────────────────────────────────────────────────────────────

interface SignaturePadHandle {
    clear: () => void;
    isEmpty: () => boolean;
    toDataURL: () => string;
}

/** A small drawing pad (mouse, pen or finger) that exports a white-backed PNG. */
const SignaturePad = ({ ref }: { ref: React.Ref<SignaturePadHandle> }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const empty = useRef(true);
    const last = useRef<{ x: number; y: number } | null>(null);

    // Size the canvas to its box (sharp on high-DPI screens) with a white background
    const reset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const ctx = canvas.getContext('2d')!;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#111827';
        empty.current = true;
    };

    useEffect(() => {
        reset();
        window.addEventListener('resize', reset);
        return () => window.removeEventListener('resize', reset);
    }, []);

    useEffect(() => {
        const handle: SignaturePadHandle = {
            clear: reset,
            isEmpty: () => empty.current,
            toDataURL: () => canvasRef.current!.toDataURL('image/png'),
        };
        if (typeof ref === 'function') ref(handle);
        else if (ref) (ref as React.MutableRefObject<SignaturePadHandle | null>).current = handle;
    });

    const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drawing.current = true;
        last.current = point(e);
        // A tap draws a dot
        const ctx = e.currentTarget.getContext('2d')!;
        ctx.beginPath();
        ctx.arc(last.current.x, last.current.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = '#111827';
        ctx.fill();
        empty.current = false;
    };

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawing.current || !last.current) return;
        const ctx = e.currentTarget.getContext('2d')!;
        const p = point(e);
        ctx.beginPath();
        ctx.moveTo(last.current.x, last.current.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        last.current = p;
    };

    const end = () => {
        drawing.current = false;
        last.current = null;
    };

    return (
        <canvas
            ref={canvasRef}
            aria-label="Signature pad"
            className="ds-pad"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            onPointerCancel={end}
        />
    );
};

const STYLES = `
.ds-page { --ds-primary: #26a9e0; --ds-primary-dark: #1d95c8; --ds-secondary: #4b2e9e; --ds-text: #1f2937; --ds-muted: #6b7280; --ds-border: #e5e7eb;
    min-height: 100vh; background: #f1f5f9; color: var(--ds-text); font-family: 'Instrument Sans', system-ui, sans-serif; }
.ds-page p { margin: 0; }
.ds-wrap { max-width: 1280px; margin: 0 auto; padding: 32px 16px; }
.ds-hero { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 28px; padding: 24px; border-radius: 14px;
    background: linear-gradient(90deg, var(--ds-primary), var(--ds-secondary)); box-shadow: 0 10px 25px rgba(31, 41, 55, .12); color: #fff; }
.ds-hero-left { display: flex; align-items: center; gap: 16px; }
.ds-hero-logo { width: 54px; height: 54px; padding: 4px; border-radius: 10px; background: #fff; object-fit: contain; }
.ds-hero h1 { margin: 0; font-size: 28px; font-weight: 700; color: #fff; }
.ds-hero-sub { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; font-size: 14px; opacity: .9; }
.ds-dot { opacity: .6; }
.ds-pill { padding: 6px 14px; border: 1px solid rgba(255,255,255,.35); border-radius: 999px; background: rgba(255,255,255,.18); font-size: 14px; font-weight: 500; }
.ds-card { margin-bottom: 24px; overflow: hidden; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(31, 41, 55, .08); }
.ds-card:last-child { margin-bottom: 0; }
.ds-card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 24px; border-bottom: 1px solid var(--ds-border); background: linear-gradient(90deg, #f9fafb, #f3f4f6); }
.ds-card-head h3 { margin: 0; font-size: 18px; font-weight: 700; color: var(--ds-text); }
.ds-card-head h3 i { color: var(--ds-primary); }
.ds-card-body { padding: 24px; }
.ds-link { font-size: 14px; font-weight: 500; color: var(--ds-primary); text-decoration: none; }
.ds-link:hover { text-decoration: underline; }
.ds-alert { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; padding: 14px 16px; border-radius: 12px; font-size: 14px; box-shadow: 0 4px 14px rgba(31, 41, 55, .06); }
.ds-alert-success { border-left: 4px solid #4ade80; background: #f0fdf4; color: #15803d; }
.ds-done { padding: 12px 0; text-align: center; }
.ds-done-icon { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; margin: 0 auto 16px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 28px; }
.ds-done h3 { margin-bottom: 8px; font-size: 22px; font-weight: 700; }
.ds-done p { color: var(--ds-muted); }
.ds-signer { display: flex; align-items: flex-start; gap: 16px; }
.ds-avatar { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 50%; background: var(--ds-primary); color: #fff; font-size: 20px; font-weight: 700; }
.ds-signer-body { flex: 1; min-width: 0; }
.ds-signer-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 16px; }
.ds-signer-name { font-size: 18px; font-weight: 600; text-transform: uppercase; }
.ds-tag { padding: 3px 10px; border-radius: 999px; background: rgba(38, 169, 224, .1); color: var(--ds-primary); font-size: 12px; font-weight: 500; }
.ds-info { display: flex; align-items: flex-start; gap: 8px; }
.ds-info-icon { margin-top: 3px; color: #9ca3af; }
.ds-label { margin-bottom: 3px !important; font-size: 13px; color: var(--ds-muted); }
.ds-value { font-size: 14px; font-weight: 500; color: #111827; overflow-wrap: anywhere; }
.ds-value-lg { font-size: 16px; }
.ds-frame { display: block; width: 100%; height: 560px; border: 1px solid var(--ds-border); border-radius: 10px; }
.ds-sticky { position: sticky; top: 24px; }
.ds-status-list { display: flex; flex-direction: column; gap: 16px; }
.ds-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
.ds-badge-green { background: #dcfce7; color: #166534; }
.ds-badge-yellow { background: #fef9c3; color: #854d0e; }
.ds-badge-red { background: #fee2e2; color: #991b1b; }
.ds-note { display: flex; gap: 12px; margin-top: 22px; padding: 14px 16px; font-size: 14px; }
.ds-note i { margin-top: 3px; }
.ds-note p { margin-top: 4px !important; font-size: 13px; }
.ds-note-yellow { border-left: 4px solid #facc15; background: #fefce8; color: #854d0e; }
.ds-note-yellow i { color: #eab308; }
.ds-note-blue { border-left: 4px solid #60a5fa; background: #eff6ff; color: #1e40af; }
.ds-note-blue i { color: #3b82f6; }
.ds-note-blue p { color: #2563eb; }
.ds-signed-box { display: flex; align-items: center; justify-content: center; height: 160px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; }
.ds-signed-box img { max-width: 100%; max-height: 140px; }
.ds-muted { margin-bottom: 16px !important; color: #4b5563; font-size: 14px; }
.ds-agree { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 24px; padding: 16px; border-radius: 12px; background: #eff6ff; font-size: 14px; color: #374151; cursor: pointer; }
.ds-agree input { flex-shrink: 0; width: 20px; height: 20px; margin-top: 1px; accent-color: var(--ds-primary); cursor: pointer; }
.ds-agree-ok { display: block; margin-top: 4px; font-size: 12px; font-weight: 600; color: #15803d; }
.ds-agree-link { display: block; margin-top: 4px; padding: 0; border: 0; background: none; font-size: 12px; font-weight: 600; color: var(--ds-primary); }
.ds-agree-link:hover { text-decoration: underline; }
.ds-pad { display: block; width: 100%; height: 200px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; cursor: crosshair; touch-action: none; }
.ds-error { margin-top: 12px !important; font-size: 14px; font-weight: 500; color: #dc2626; }
.ds-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
.ds-btn { display: inline-flex; align-items: center; padding: 9px 16px; border: 0; border-radius: 8px; font-size: 14px; font-weight: 500; }
.ds-btn:disabled { opacity: .65; }
.ds-btn-primary { background: var(--ds-primary); color: #fff; }
.ds-btn-primary:hover { background: var(--ds-primary-dark); }
.ds-btn-light { background: #e5e7eb; color: #374151; }
.ds-btn-light:hover { background: #d1d5db; }
.ds-btn-outline { border: 1px solid #d1d5db; background: #fff; color: #374151; }
.ds-btn-outline:hover { background: #f9fafb; }
.ds-modal-backdrop { position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 0, 0, .7); }
.ds-modal { width: 100%; max-width: 760px; max-height: 90vh; overflow: auto; border-radius: 12px; background: #fff; box-shadow: 0 20px 50px rgba(0, 0, 0, .3); }
.ds-modal-body { padding: 24px; font-size: 14px; color: #4b5563; }
.ds-modal-body h3 { margin-bottom: 16px; font-size: 20px; font-weight: 600; color: var(--ds-text); }
.ds-term { margin-bottom: 16px; }
.ds-term h4 { margin-bottom: 4px; font-size: 15px; font-weight: 700; color: var(--ds-text); }
.ds-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 12px 24px; background: #f9fafb; }
@media (max-width: 991px) { .ds-sticky { position: static; } }
@media (max-width: 575px) { .ds-hero h1 { font-size: 22px; } .ds-card-body { padding: 18px; } .ds-frame { height: 440px; } }
`;

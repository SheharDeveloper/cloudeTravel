import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import ApplicationFormTab, { type ApplicationFormData } from '@/components/visa/ApplicationFormTab';

interface Props {
    brand: { name: string; logo: string | null; email: string | null; phone: string | null };
    verified: boolean;
    sendOtpUrl: string;
    verifyUrl: string;
    // On: "Send OTP" emails one; off: nothing is sent, the default OTP works
    emailOtp: boolean;
    summary: { application_number: string; name: string; visa: string; route: string };
    application: { uid: string } | null;
    form: ApplicationFormData | null;
    flash?: { success?: string | null };
    errors: Record<string, string>;
}

/**
 * A shared visa application ("Share Application"): confirm the applicant's
 * email with an OTP, then fill the application — no login needed.
 */
export default function SharedApplication() {
    const { brand, verified, sendOtpUrl, verifyUrl, summary, application, form, flash, errors } = usePage().props as unknown as Props;

    return (
        <>
            <Head title={`Application ${summary.application_number}`}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <link rel="stylesheet" href="/backend/assets/css/plugins_4.css" />
                <link rel="stylesheet" href="/backend/assets/css/style_4.css" />
            </Head>

            <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
                {/* The agency's brand */}
                <div className="bg-white border-bottom">
                    <div className="container py-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                            {brand.logo && <img src={brand.logo} alt={brand.name} style={{ height: 42, width: 'auto', maxWidth: 160, objectFit: 'contain' }} />}
                            <h5 className="mb-0 fw-bold text-primary">{brand.name}</h5>
                        </div>
                        <small className="text-muted">
                            {brand.phone && <><i className="fa fa-phone me-1"></i>{brand.phone}</>}
                            {brand.email && <span className="ms-3"><i className="fa fa-envelope me-1"></i>{brand.email}</span>}
                        </small>
                    </div>
                </div>

                <div className="container py-4">
                    <div className="card h-auto mb-4">
                        <div className="card-body py-3">
                            <h4 className="mb-1">{summary.name}</h4>
                            <small className="text-muted">
                                Visa Application #{summary.application_number}
                                {summary.visa && <> · {summary.visa}</>}
                                {summary.route && <> · {summary.route}</>}
                            </small>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="alert alert-success d-flex align-items-center gap-2">
                            <i className="fa fa-check-circle"></i>{flash.success}
                        </div>
                    )}

                    {verified && application && form ? (
                        <ApplicationFormTab applicationUid={application.uid} form={form} canEdit canSend={false} sent={null} baseUrl="/shared-application" />
                    ) : (
                        <OtpCard sendOtpUrl={sendOtpUrl} verifyUrl={verifyUrl} errors={errors} />
                    )}
                </div>
            </div>
        </>
    );
}

/** Step 1: the applicant's email → Send OTP. Step 2: the OTP → open the application. */
function OtpCard({ sendOtpUrl, verifyUrl, errors }: { sendOtpUrl: string; verifyUrl: string; errors: Record<string, string> }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [busy, setBusy] = useState(false);

    const sendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        router.post(sendOtpUrl, { email }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setOtpSent(true),
            onFinish: () => setBusy(false),
        });
    };

    const verify = (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        router.post(verifyUrl, { email, otp }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setBusy(false),
        });
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
                <div className="card h-auto">
                    <div className="card-header">
                        <h6 className="card-title mb-0"><i className="fa fa-lock me-2"></i>Verify to open your application</h6>
                    </div>
                    <div className="card-body">
                        <form onSubmit={otpSent ? verify : sendOtp}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="share-email">Email Address</label>
                                <input
                                    id="share-email"
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setOtpSent(false); }}
                                    placeholder="The email on your application"
                                    required
                                    autoFocus
                                />
                                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                            </div>

                            {otpSent && (
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="share-otp">OTP</label>
                                    <input
                                        id="share-otp"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={10}
                                        className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter the OTP"
                                        required
                                        autoFocus
                                    />
                                    {errors.otp && <div className="invalid-feedback d-block">{errors.otp}</div>}
                                    <button type="button" className="btn btn-link btn-sm px-0 mt-1" onClick={sendOtp} disabled={busy}>
                                        Send the OTP again
                                    </button>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100" disabled={busy}>
                                <i className={`fa ${busy ? 'fa-spinner fa-spin' : otpSent ? 'fa-unlock' : 'fa-paper-plane'} me-2`}></i>
                                {busy ? 'Please wait…' : otpSent ? 'Verify & Open Application' : 'Send OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

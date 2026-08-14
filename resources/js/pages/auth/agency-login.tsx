import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function AgencyLogin() {
    const { agencyName, logo, status, isClient, errors } = usePage().props as any;
    const [processing, setProcessing] = useState(false);

    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);

        router.post(isClient ? '/agency/client-login' : '/agency/login', data, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh', background: '#f4f5f9', padding: '24px' }}
        >
            <div className="card h-auto" style={{ width: '100%', maxWidth: 420 }}>
                <div className="card-body p-5">
                    {/* Agency branding */}
                    <div className="text-center mb-4">
                        {logo ? (
                            <img
                                src={logo}
                                alt={agencyName}
                                style={{ maxWidth: 160, maxHeight: 80, objectFit: 'contain' }}
                            />
                        ) : (
                            <div
                                className="bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto rounded"
                                style={{ width: 80, height: 80 }}
                            >
                                <span className="text-primary fw-bold fs-24">
                                    {agencyName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}

                        <h4 className="fw-semibold mt-3 mb-1">{agencyName}</h4>
                        <p className="text-muted small mb-0">
                            {isClient ? 'Client Login' : 'Sign in to your account'}
                        </p>
                    </div>

                    {status && <div className="alert alert-success">{status}</div>}

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                            {errors?.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                            {errors?.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        </div>

                        <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="remember"
                                checked={data.remember}
                                onChange={(e) => setData({ ...data, remember: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={processing}>
                            {processing ? 'Signing in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <a
                            href={isClient ? '/agency/login' : '/agency/client-login'}
                            className="small text-muted"
                        >
                            {isClient ? 'Agency staff login' : 'Client login'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

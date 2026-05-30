import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { apiFetch, setAuthToken } from '@/lib/api';
import { PublicRoute } from '@/lib/ProtectedRoute';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiFetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setAuthToken(data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                window.location.href = '/dashboard';
            } else {
                setError(data.message || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <PublicRoute>
            <>
                <Head title="Login" />
                <div className="w-100 h-100">
                <div className="authentication-wrapper authentication-basic w-100 h-100 px-0">
                    <div className="authentication-inner py-6 h-100 d-flex align-items-center justify-content-center">
                        <div className="card w-100" style={{ maxWidth: '100%' }}>
                            <div className="card-body">
                                <div className="app-brand justify-content-center mb-4 mt-2">
                                    <a href="/" className="app-brand-link gap-2">
                                        <span className="app-brand-text demo text-heading fw-bold">CloudTravel</span>
                                    </a>
                                </div>

                                <h4 className="mb-2 text-center">Welcome to CloudTravel! 👋</h4>
                                <p className="mb-4 text-center">Please sign-in to your account</p>

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}

                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="admin@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Sign in'}
                                    </button>
                                </form>

                                <p className="text-center mt-3">
                                    Don't have an account?{' '}
                                    <a href="/register">Create one</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        </PublicRoute>
    );
}

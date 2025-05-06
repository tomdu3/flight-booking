import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get location object

    const from = location.state?.from?.pathname || "/"; // Get intended path or default to homepage

    // Redirect if already logged in or after successful login
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true }); // Redirect to intended path or homepage
        }
    }, [isAuthenticated, navigate, from]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login({ email, password });
        // Navigation after successful login is handled by the useEffect hook
        if (!result.success) {
            // Error state is updated in AuthContext, and displayed below
        }
    };

    return (
        <section className="section">
            <div className="container mx-auto px-4" style={{ maxWidth: '500px' }}>
                <div className="bg-[var(--clr-card-background)] p-8 rounded-lg shadow-md border border-[var(--clr-border)]">
                    <h2 className="text-3xl font-title font-bold text-center text-[var(--clr-text)] mb-8">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                placeholder="********"
                            />
                        </div>

                        {error && (
                            <div className="text-[var(--clr-danger)] text-sm text-center p-3 bg-[var(--clr-danger)]/10 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full text-lg font-title py-3 flex items-center justify-center disabled:opacity-70"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-[var(--clr-text-light)] mt-6">
                        Don't have an account? {' '}
                        <Link to="/register" className="font-medium text-[var(--clr-primary)] hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;

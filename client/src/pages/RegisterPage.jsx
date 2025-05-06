import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const { register, loading, error, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect to home page or dashboard
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        // Reset password match validation if password fields change
        if (e.target.id === 'password' || e.target.id === 'confirmPassword') {
            setPasswordsMatch(true);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
        setPasswordsMatch(true);
        
        // Exclude confirmPassword from the data sent to backend
        const { confirmPassword, ...userData } = formData;

        const result = await register(userData);
        if (result.success) {
            // Registration successful, AuthProvider might log user in automatically
            // Navigation is handled by the useEffect hook if isAuthenticated becomes true
            // TODO:  Add a toast or show a success message before potential redirect
            alert(result.message || 'Registration successful!'); 
            // If registration doesn't auto-login, redirect to login:
            // if (!isAuthenticated) navigate('/login');
        } else {
             // Error state is updated in AuthContext
        }
    };

    return (
        <section className="section">
            <div className="container mx-auto px-4" style={{ maxWidth: '500px' }}>
                <div className="bg-[var(--clr-card-background)] p-8 rounded-lg shadow-md border border-[var(--clr-border)]">
                    <h2 className="text-3xl font-title font-bold text-center text-[var(--clr-text)] mb-8">Create Account</h2>
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                    placeholder="John"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6" // Example: Enforce minimum length
                                className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                placeholder="********"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:ring-1 transition-colors duration-200 outline-none ${passwordsMatch ? 'border-[var(--clr-border)] focus:border-[var(--clr-primary)] focus:ring-[var(--clr-primary)]' : 'border-red-500 focus:border-red-500 focus:ring-red-500'}`}
                                placeholder="********"
                            />
                            {!passwordsMatch && (
                                <p className="text-red-600 text-xs mt-1">Passwords do not match.</p>
                            )}
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
                                {loading ? 'Registering...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-[var(--clr-text-light)] mt-6">
                        Already have an account? {' '}
                        <Link to="/login" className="font-medium text-[var(--clr-primary)] hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;

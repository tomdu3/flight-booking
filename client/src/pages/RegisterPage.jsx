import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, error, loading } = useContext(AuthContext);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'confirmPassword') {
            setConfirmPasswordTouched(true);
            setPasswordsMatch(value === formData.password);
        } else if (name === 'password' && formData.confirmPassword) {
            setPasswordsMatch(value === formData.confirmPassword);
        }
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9\s]/.test(password);

        const errors = [];
        if (!minLength) errors.push('Password must be at least 8 characters long');
        if (!hasLetter) errors.push('Password must contain at least one letter');
        if (!hasNumber) errors.push('Password must contain at least one number');
        if (!hasSpecial) errors.push('Password must contain at least one special character');

        return errors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            passwordErrors.forEach(error => toast.error(error));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordsMatch(false);
            toast.error('Passwords do not match');
            return;
        }

        // Remove confirmPassword from the data sent to the server
        const { confirmPassword, ...registrationData } = formData;

        try {
            const result = await register(registrationData);
            
            if (result.success) {
                toast.success('Registration successful!');
                navigate('/');
                // Navigation is handled by the useEffect hook when isAuthenticated becomes true
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An error occurred during registration');
        }
    };

    return (
        <section className="section">
            <div className="container mx-auto px-4" style={{ maxWidth: '500px' }}>
                <div className="bg-[var(--clr-card-background)] p-8 rounded-lg shadow-md border border-[var(--clr-border)]">
                    <h2 className="text-3xl font-title font-bold text-center text-[var(--clr-text)] mb-8">Create Account</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                    placeholder="johndoe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-[var(--clr-border)] bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-colors duration-200 outline-none"
                                    placeholder="••••••••"
                                    minLength={8}
                                />
                                <p className="text-gray-500 text-xs mt-1">
                                    Password must be at least 8 characters long and contain at least one letter, one number, and one special character.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-gray-400 focus:ring-1 transition-colors duration-200 outline-none ${passwordsMatch ? 'border-[var(--clr-border)] focus:border-[var(--clr-primary)] focus:ring-[var(--clr-primary)]' : 'border-red-500 focus:border-red-500 focus:ring-red-500'}`}
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                                {confirmPasswordTouched && !passwordsMatch && (
                                    <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="text-[var(--clr-danger)] text-sm text-center p-3 bg-[var(--clr-danger)]/10 rounded-md">
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full rounded-lg px-4 py-2.5 text-base font-semibold transition-colors duration-200 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[var(--clr-primary)] hover:bg-[var(--clr-primary-dark)] text-white'
                                    }`}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4">
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <p className="text-sm text-[var(--clr-text)]">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[var(--clr-primary)] hover:text-[var(--clr-primary-dark)] font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;

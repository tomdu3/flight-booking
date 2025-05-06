import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from './AuthContext';

// Configure axios base URL (Update if your backend runs elsewhere)
const apiClient = axios.create({
    baseURL: '/api', // Proxy handles redirecting to backend server (e.g., http://localhost:5000/api)
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    // Add Authorization header if token exists
    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('authToken', token); // Ensure token is in localStorage
            // Optional: Fetch user profile on initial load if token exists
            // fetchUserProfile(); 
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
            localStorage.removeItem('authToken');
        }
        setLoading(false); // Finished initial token check
    }, [token]);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/auth/login', credentials);
            console.log('Login response:', response.data);
            
            if (response.data.user) {
                setUser(response.data.user);
                setToken('authenticated'); // We're using a dummy token
                setLoading(false);
                toast.success('Login successful!');
                return { success: true };
            } else {
                throw new Error('No user data received');
            }
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            setLoading(false);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/auth/register', userData);
            console.log('Registration response:', response.data);

            if (response.data.success && response.data.user) {
                setUser(response.data.user);
                setToken('authenticated');
                setLoading(false);
                toast.success('Registration successful!');
                return { 
                    success: true, 
                    message: response.data.message || 'Registration successful'
                };
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            setError(errorMessage);
            setLoading(false);
            toast.error(errorMessage);
            return { 
                success: false, 
                error: errorMessage,
                field: err.response?.data?.field
            };
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
            setUser(null);
            setToken(null);
            // Clear axios default headers
            delete apiClient.defaults.headers.common['Authorization'];
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    // Optional: Add function to fetch user profile if needed separately
    // const fetchUserProfile = async () => { ... };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token, // Check if token exists
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        // fetchUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

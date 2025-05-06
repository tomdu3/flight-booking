import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            const { user: userData } = response.data;
            // Token is handled by cookies from the backend
            setUser(userData);
            setToken('authenticated'); // Set a dummy token to trigger isAuthenticated
            // Update axios default headers
            apiClient.defaults.withCredentials = true;
            setLoading(false);
            toast.success('Login successful'); // Add toast notification
            return { success: true, user: userData };
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            setLoading(false);
            toast.error(errorMessage); // Add toast notification
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            // Backend might directly log in user or just register
            const response = await apiClient.post('/auth/register', userData);
            // Assuming registration also logs in the user and returns token/user
            if (response.data.token && response.data.user) {
                const { token: receivedToken, user: newUser } = response.data;
                setToken(receivedToken);
                setUser(newUser);
            }
            setLoading(false);
            return { success: true, message: response.data.message || 'Registration successful' };
        } catch (err) {
            console.error("Registration error:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
            return { success: false, error: err.response?.data?.message || 'Registration failed' };
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

    const value = {
        user,
        token,
        isAuthenticated: !!token, // Check if token exists
        loading,
        error,
        login,
        register,
        logout,
        // fetchUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

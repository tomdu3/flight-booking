import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    // If the authentication state is still loading, don't render anything yet
    // or show a loading spinner. For now, null
    // This prevents a flash of the login page before the auth state is confirmed.
    if (loading) {
        //TODO:  return <div>Loading...</div>; // Or a spinner component
        return null; 
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // If authenticated, render the children components
};

export default ProtectedRoute;

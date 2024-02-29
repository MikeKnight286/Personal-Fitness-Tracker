import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initially, do not set user state until after verification
        return null;
    });
    const [loading, setLoading] = useState(true); // Initialize loading state to true

    useEffect(() => {
        const initializeAuth = async () => {
            // Attempt to fetch the current user from authService
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false); // After checking user state, set loading to false
        };

        initializeAuth();
    }, []); // This effect runs once on component mount

    const login = async (credentials) => {
        const userData = await authService.login(credentials);
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData) => {
        const registeredUserData = await authService.register(userData);
        setUser(registeredUserData);
    };

    const value = {
        user,
        loading, // Expose loading state
        login,
        logout,
        register,
    };

    // Render a loading indicator or null while loading
    if (loading) {
        return <div>Loading...</div>; 
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

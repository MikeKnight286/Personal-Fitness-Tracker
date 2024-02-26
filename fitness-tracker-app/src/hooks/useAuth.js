import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; 

// Create an Auth context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await authService.login(credentials);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const passwordResetRequest = async (email) => {
        try {
            const response = await authService.passwordResetRequest(email);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const response = await authService.resetPassword(token, newPassword);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
        register,
        passwordResetRequest,
        resetPassword,
        loading,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

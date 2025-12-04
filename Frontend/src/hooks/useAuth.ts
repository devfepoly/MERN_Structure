/**
 * useAuth Hook
 * Custom hook for authentication management
 */

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@services';
import { useNavigate } from 'react-router-dom';
import { ROUTES, MESSAGES } from '@constants';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = authService.getCurrentUser();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(credentials);
            setUser(data?.user || null);
            navigate(ROUTES.HOME);
            return data;
        } catch (err: any) {
            setError(err.message || MESSAGES.ERROR.SERVER_ERROR);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Register function
    const register = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(userData);
            return response;
        } catch (err) {
            setError(err.message || MESSAGES.ERROR.SERVER_ERROR);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await authService.logout();
            setUser(null);
            navigate(ROUTES.AUTH);
        } catch (err) {
            console.error('Logout failed:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Refresh user profile
    const refreshProfile = useCallback(async () => {
        try {
            const data = await authService.getProfile();
            setUser(data?.user || null);
            return data?.user;
        } catch (err: any) {
            console.error('Profile refresh failed:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    return {
        user,
        loading,
        error,
        isAuthenticated: authService.isAuthenticated(),
        login,
        register,
        logout,
        refreshProfile,
        setError,
    };
};

export default useAuth;

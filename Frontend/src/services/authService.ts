/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Enhanced with security features
 */

import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@constants';
import { secureStorage, sanitizeInput } from '@utils/security';

export const authService = {
    /**
     * Login user
     * @param {Object} credentials - User credentials (email, password)
     * @returns {Promise} User data and tokens
     */
    login: async (credentials) => {
        // Sanitize input to prevent injection attacks
        const sanitizedCredentials = {
            email: sanitizeInput(credentials.email?.trim()),
            password: credentials.password, // Don't sanitize password, validate on backend
        };

        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, sanitizedCredentials);
        const data = response.data;

        // Store tokens and user data securely (encrypted in sessionStorage)
        if (data?.accessToken) {
            secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        }
        if (data?.refreshToken) {
            secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }
        if (data?.user) {
            // Sanitize user data before storing
            const sanitizedUser = {
                ...data.user,
                name: sanitizeInput(data.user.name),
                email: sanitizeInput(data.user.email),
            };
            secureStorage.setItem(STORAGE_KEYS.USER_DATA, sanitizedUser);
        }

        return data;
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise} User data
     */
    register: async (userData) => {
        // Sanitize all user input
        const sanitizedData = {
            ...userData,
            email: sanitizeInput(userData.email?.trim()),
            name: sanitizeInput(userData.name?.trim()),
            // Don't sanitize password, let backend handle validation
        };

        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, sanitizedData);
        return response.data;
    },

    /**
     * Logout user
     * @returns {Promise} Logout response
     */
    logout: async () => {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } finally {
            // Clear all storage securely regardless of API response
            secureStorage.clear();
            sessionStorage.clear();

            // Clear any cached data
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
        }
    },

    /**
     * Get current user profile
     * @returns {Promise} User profile data
     */
    getProfile: async () => {
        const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        const data = response.data;
        if (data?.user) {
            // Sanitize user data
            const sanitizedUser = {
                ...data.user,
                name: sanitizeInput(data.user.name),
                email: sanitizeInput(data.user.email),
            };
            secureStorage.setItem(STORAGE_KEYS.USER_DATA, sanitizedUser);
        }
        return data;
    },

    /**
     * Refresh access token
     * @returns {Promise} New access token
     */
    refreshToken: async () => {
        const refreshToken = secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
            refreshToken,
        });
        const data = response.data;

        if (data?.accessToken) {
            secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        }
        if (data?.refreshToken) {
            secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }

        return data;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated: () => {
        const token = secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        return !!token;
    },

    /**
     * Get stored user data
     * @returns {Object|null} User data
     */
    getCurrentUser: () => {
        try {
            return secureStorage.getItem(STORAGE_KEYS.USER_DATA);
        } catch (error) {
            console.error('Failed to get user data:', error);
            return null;
        }
    },
};

export default authService;

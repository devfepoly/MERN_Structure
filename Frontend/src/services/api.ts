/**
 * API Service
 * Centralized HTTP client with Axios
 * Enhanced with security features
 */

import axios from 'axios';
import ENV from '@config/env';
import { STORAGE_KEYS, HTTP_STATUS, MESSAGES } from '@constants';
import {
    secureStorage,
    isTokenExpired,
    generateCSRFToken,
    RateLimiter,
} from '@utils/security';

// Rate limiter instance
const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// Create axios instance with secure defaults
const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: ENV.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false, // Set to true if using cookies
    // Security headers
    validateStatus: (status) => status < 500, // Don't throw on client errors
});

// Request interceptor with enhanced security
apiClient.interceptors.request.use(
    (config) => {
        // Rate limiting check
        const userId = secureStorage.getItem(STORAGE_KEYS.USER_DATA)?.id || 'anonymous';
        if (!rateLimiter.isAllowed(userId)) {
            return Promise.reject(new Error('Too many requests. Please try again later.'));
        }

        // Add auth token with validation
        const token = secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            // Validate token expiry before using
            if (isTokenExpired(token)) {
                secureStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                window.location.href = '/admin/auth';
                return Promise.reject(new Error('Token expired'));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing operations
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
            let csrfToken = sessionStorage.getItem('csrf_token');
            if (!csrfToken) {
                csrfToken = generateCSRFToken();
                sessionStorage.setItem('csrf_token', csrfToken);
            }
            config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Add request timestamp for replay attack prevention
        config.headers['X-Request-Timestamp'] = Date.now().toString();

        // Safe logging in development (mask sensitive data)
        if (ENV.ENABLE_LOGGING) {
            const safeUrl = config.url?.includes('token')
                ? config.url.replace(/token=[^&]+/, 'token=***')
                : config.url;
            console.log('📤 Request:', config.method?.toUpperCase(), safeUrl);

            // Never log sensitive data
            if (config.data && !config.url?.includes('auth')) {
                console.log('📦 Data:', config.data);
            }
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor with enhanced security
apiClient.interceptors.response.use(
    (response) => {
        // Validate response integrity
        if (response.headers['x-content-type-options'] !== 'nosniff') {
            console.warn('⚠️ Missing security header: X-Content-Type-Options');
        }

        // Safe logging in development
        if (ENV.ENABLE_LOGGING) {
            const safeUrl = response.config.url?.includes('token')
                ? response.config.url.replace(/token=[^&]+/, 'token=***')
                : response.config.url;
            console.log('📥 Response:', response.status, safeUrl);
        }

        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token securely
                const refreshToken = secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                if (refreshToken && !isTokenExpired(refreshToken)) {
                    const response = await axios.post(
                        `${ENV.API_BASE_URL}/auth/refresh`,
                        { refreshToken },
                        {
                            headers: {
                                'X-Refresh-Request': 'true',
                            },
                        }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Store new tokens securely
                    secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                    if (newRefreshToken) {
                        secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                    }

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed - clear data and redirect
                secureStorage.clear();
                sessionStorage.clear();

                // Prevent redirect loop
                if (!window.location.pathname.includes('/auth')) {
                    window.location.href = '/admin/auth';
                }
                return Promise.reject(refreshError);
            }
        }

        // Handle rate limit errors
        if (error.response?.status === 429) {
            console.error('⚠️ Rate limit exceeded');
            return Promise.reject({
                message: 'Too many requests. Please slow down.',
                status: 429,
            });
        }

        // Handle other errors with safe logging
        const errorMessage = handleApiError(error);

        // Safe error logging (don't log sensitive data)
        if (ENV.ENABLE_LOGGING) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                message: errorMessage,
                url: error.config?.url,
            });
        }

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

// Error handler
const handleApiError = (error) => {
    if (!error.response) {
        return MESSAGES.ERROR.NETWORK;
    }

    switch (error.response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
            return MESSAGES.ERROR.UNAUTHORIZED;
        case HTTP_STATUS.NOT_FOUND:
            return MESSAGES.ERROR.NOT_FOUND;
        case HTTP_STATUS.BAD_REQUEST:
            return error.response.data?.message || MESSAGES.ERROR.VALIDATION;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            return MESSAGES.ERROR.SERVER_ERROR;
        default:
            return error.response.data?.message || 'An error occurred';
    }
};

// API Methods with optional config
export const api = {
    get: (url: string, config?: any) => apiClient.get(url, config),
    post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
    put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
    patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
    delete: (url: string, config?: any) => apiClient.delete(url, config),
};

export default api;

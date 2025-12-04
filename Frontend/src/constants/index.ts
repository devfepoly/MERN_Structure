/**
 * Application constants
 * Centralized location for all constant values
 */

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh',
        PROFILE: '/auth/profile',
    },
    USERS: {
        LIST: '/users',
        DETAIL: (id) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
    },
    // Add more endpoints as needed
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    ADMIN: '/admin',
    AUTH: '/admin/auth',
    NOT_FOUND: '*',
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
};

// Messages
export const MESSAGES = {
    ERROR: {
        NETWORK: 'Network error. Please check your connection.',
        UNAUTHORIZED: 'You are not authorized to access this resource.',
        NOT_FOUND: 'The requested resource was not found.',
        SERVER_ERROR: 'Server error. Please try again later.',
        VALIDATION: 'Please check your input and try again.',
    },
    SUCCESS: {
        LOGIN: 'Login successful!',
        LOGOUT: 'Logout successful!',
        CREATE: 'Created successfully!',
        UPDATE: 'Updated successfully!',
        DELETE: 'Deleted successfully!',
    },
};

// Regex Patterns
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[0-9]{10,11}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'DD/MM/YYYY',
    API: 'YYYY-MM-DD',
    DATETIME: 'DD/MM/YYYY HH:mm:ss',
};

export default {
    API_ENDPOINTS,
    HTTP_STATUS,
    STORAGE_KEYS,
    ROUTES,
    USER_ROLES,
    MESSAGES,
    REGEX,
    DATE_FORMATS,
};

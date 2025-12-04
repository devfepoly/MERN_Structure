/**
 * Security Utilities
 * Functions for enhanced security
 */

import CryptoJS from 'crypto-js';
import ENV from '@config/env';

// Secret key for encryption - MUST come from env
if (!ENV.ENCRYPTION_KEY) {
    throw new Error('VITE_ENCRYPTION_KEY is required. Please set it in your .env file.');
}
const ENCRYPTION_KEY = ENV.ENCRYPTION_KEY;

/**
 * Encrypt sensitive data before storing
 * @param {string} data - Data to encrypt
 * @returns {string} Encrypted data
 */
export const encrypt = (data) => {
    try {
        return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        return data;
    }
};

/**
 * Decrypt encrypted data
 * @param {string} encryptedData - Data to decrypt
 * @returns {string} Decrypted data
 */
export const decrypt = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error);
        return encryptedData;
    }
};

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.textContent = html;
    return tempDiv.innerHTML;
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
    if (!input) return '';

    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Generate CSRF token
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate token expiry
 * @param {string} token - JWT token
 * @returns {boolean} Is token valid
 */
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expiryTime;
    } catch (error) {
        console.error('Token validation failed:', error);
        return true;
    }
};

/**
 * Secure storage wrapper with encryption
 */
export const secureStorage = {
    /**
     * Set item in storage with encryption
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     */
    setItem: (key, value) => {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            const encrypted = encrypt(stringValue);
            sessionStorage.setItem(key, encrypted); // Use sessionStorage for better security
        } catch (error) {
            console.error('Secure storage set failed:', error);
        }
    },

    /**
     * Get item from storage with decryption
     * @param {string} key - Storage key
     * @returns {any} Decrypted value
     */
    getItem: (key) => {
        try {
            const encrypted = sessionStorage.getItem(key);
            if (!encrypted) return null;

            const decrypted = decrypt(encrypted);
            try {
                return JSON.parse(decrypted);
            } catch {
                return decrypted;
            }
        } catch (error) {
            console.error('Secure storage get failed:', error);
            return null;
        }
    },

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     */
    removeItem: (key) => {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Secure storage remove failed:', error);
        }
    },

    /**
     * Clear all storage
     */
    clear: () => {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Secure storage clear failed:', error);
        }
    },
};

/**
 * Rate limiter for preventing abuse
 */
export class RateLimiter {
    private maxRequests: number;
    private timeWindow: number;
    private requests: Map<string, number[]>;

    constructor(maxRequests = 10, timeWindow = 60000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = new Map();
    }

    /**
     * Check if request is allowed
     * @param {string} identifier - User/IP identifier
     * @returns {boolean} Is allowed
     */
    isAllowed(identifier: string): boolean {
        const now = Date.now();
        const userRequests = this.requests.get(identifier) || [];

        // Filter out old requests outside time window
        const recentRequests = userRequests.filter(
            timestamp => now - timestamp < this.timeWindow
        );

        if (recentRequests.length >= this.maxRequests) {
            return false;
        }

        recentRequests.push(now);
        this.requests.set(identifier, recentRequests);
        return true;
    }

    /**
     * Reset rate limiter for identifier
     * @param {string} identifier - User/IP identifier
     */
    reset(identifier: string): void {
        this.requests.delete(identifier);
    }
}

/**
 * Content Security Policy helper
 */
export const CSP_DIRECTIVES = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"], // Remove unsafe-inline in production
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", ENV.API_BASE_URL],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
};

/**
 * Mask sensitive data for logging
 * @param {string} data - Data to mask
 * @param {number} visibleChars - Number of visible characters
 * @returns {string} Masked data
 */
export const maskSensitiveData = (data, visibleChars = 4) => {
    if (!data || data.length <= visibleChars) return '***';
    return `${data.slice(0, visibleChars)}${'*'.repeat(data.length - visibleChars)}`;
};

/**
 * Validate and sanitize URL
 * @param {string} url - URL to validate
 * @returns {string|null} Safe URL or null
 */
export const sanitizeUrl = (url) => {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }
        return parsed.toString();
    } catch {
        return null;
    }
};

export default {
    encrypt,
    decrypt,
    sanitizeHtml,
    sanitizeInput,
    generateCSRFToken,
    isTokenExpired,
    secureStorage,
    RateLimiter,
    CSP_DIRECTIVES,
    maskSensitiveData,
    sanitizeUrl,
};

/**
 * Validation Utilities
 * Helper functions for form validation
 */

import { REGEX } from '@constants';

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export const isValidEmail = (email) => {
    return REGEX.EMAIL.test(email);
};

/**
 * Check if phone number is valid
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid
 */
export const isValidPhone = (phone) => {
    return REGEX.PHONE.test(phone);
};

/**
 * Check if password is strong
 * @param {string} password - Password to validate
 * @returns {boolean} Is valid
 */
export const isStrongPassword = (password) => {
    return REGEX.PASSWORD.test(password);
};

/**
 * Check if string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

/**
 * Check if value is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {string|null} Error message or null
 */
export const validateRequired = (value) => {
    if (!value || (typeof value === 'string' && isEmpty(value))) {
        return 'This field is required';
    }
    return null;
};

/**
 * Validate email field
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null
 */
export const validateEmail = (email) => {
    if (!email || isEmpty(email)) {
        return 'Email is required';
    }
    if (!isValidEmail(email)) {
        return 'Invalid email format';
    }
    return null;
};

/**
 * Validate password field
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null
 */
export const validatePassword = (password) => {
    if (!password || isEmpty(password)) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!isStrongPassword(password)) {
        return 'Password must contain at least one uppercase, one lowercase, and one number';
    }
    return null;
};

/**
 * Validate min length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {string|null} Error message or null
 */
export const validateMinLength = (value, minLength) => {
    if (!value || value.length < minLength) {
        return `Must be at least ${minLength} characters`;
    }
    return null;
};

/**
 * Validate max length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @returns {string|null} Error message or null
 */
export const validateMaxLength = (value, maxLength) => {
    if (value && value.length > maxLength) {
        return `Must be no more than ${maxLength} characters`;
    }
    return null;
};

export default {
    isValidEmail,
    isValidPhone,
    isStrongPassword,
    isEmpty,
    isValidUrl,
    validateRequired,
    validateEmail,
    validatePassword,
    validateMinLength,
    validateMaxLength,
};

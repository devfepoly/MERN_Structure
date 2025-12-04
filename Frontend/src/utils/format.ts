/**
 * Format Utilities
 * Helper functions for formatting data
 */

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'vi-VN') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
};

/**
 * Format date time to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date, locale = 'vi-VN') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(locale);
};

/**
 * Format number to currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'VND')
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'VND', locale = 'vi-VN') => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'vi-VN') => {
    if (number === null || number === undefined) return '';
    return new Intl.NumberFormat(locale).format(number);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string} Kebab-cased string
 */
export const toKebabCase = (str) => {
    if (!str) return '';
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
};

/**
 * Convert string to camelCase
 * @param {string} str - String to convert
 * @returns {string} CamelCased string
 */
export const toCamelCase = (str) => {
    if (!str) return '';
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
};

export default {
    formatDate,
    formatDateTime,
    formatCurrency,
    formatNumber,
    truncateText,
    capitalize,
    toKebabCase,
    toCamelCase,
};

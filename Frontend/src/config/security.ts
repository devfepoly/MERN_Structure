/**
 * Security Headers Configuration
 * Setup secure headers for the application
 */

import { CSP_DIRECTIVES } from '@utils/security';

/**
 * Setup security headers
 * Call this in your main.jsx or App.jsx
 */
export const setupSecurityHeaders = () => {
    // Set Content Security Policy via meta tag
    const cspContent = Object.entries(CSP_DIRECTIVES)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');

    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement | null;
    if (!cspMeta) {
        cspMeta = document.createElement('meta') as HTMLMetaElement;
        cspMeta.httpEquiv = 'Content-Security-Policy';
        document.head.appendChild(cspMeta);
    }
    cspMeta.content = cspContent;

    // Set X-Content-Type-Options
    let contentTypeMeta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]') as HTMLMetaElement | null;
    if (!contentTypeMeta) {
        contentTypeMeta = document.createElement('meta') as HTMLMetaElement;
        contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
        contentTypeMeta.content = 'nosniff';
        document.head.appendChild(contentTypeMeta);
    }

    // Set X-Frame-Options
    let frameOptionsMeta = document.querySelector('meta[http-equiv="X-Frame-Options"]') as HTMLMetaElement | null;
    if (!frameOptionsMeta) {
        frameOptionsMeta = document.createElement('meta') as HTMLMetaElement;
        frameOptionsMeta.httpEquiv = 'X-Frame-Options';
        frameOptionsMeta.content = 'DENY';
        document.head.appendChild(frameOptionsMeta);
    }

    // Set Referrer Policy
    let referrerMeta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement | null;
    if (!referrerMeta) {
        referrerMeta = document.createElement('meta') as HTMLMetaElement;
        referrerMeta.name = 'referrer';
        referrerMeta.content = 'strict-origin-when-cross-origin';
        document.head.appendChild(referrerMeta);
    }

    // Disable browser's autocomplete for sensitive forms
    document.querySelectorAll('input[type="password"]').forEach((input) => {
        input.setAttribute('autocomplete', 'new-password');
    });
};

/**
 * Prevent click-jacking
 */
export const preventClickJacking = () => {
    if (window.top !== window.self && window.top !== null) {
        window.top.location.href = window.self.location.href;
    }
};

/**
 * Disable right-click in production (optional)
 */
export const disableRightClick = () => {
    if (import.meta.env.MODE === 'production') {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
};

/**
 * Disable developer tools in production (optional)
 */
export const disableDevTools = () => {
    if (import.meta.env.MODE === 'production') {
        // Detect if dev tools are open
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                console.log('Developer tools detected');
                // You can redirect or show a warning
            }
        };

        // Check periodically
        setInterval(detectDevTools, 1000);

        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', (e) => {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                (e.ctrlKey && e.keyCode === 85) // Ctrl+U
            ) {
                e.preventDefault();
                return false;
            }
        });
    }
};

/**
 * Initialize all security measures
 */
export const initSecurity = () => {
    setupSecurityHeaders();
    preventClickJacking();

    // Optional - uncomment if needed
    // disableRightClick();
    // disableDevTools();

    console.log('🔒 Security measures initialized');
};

export default {
    setupSecurityHeaders,
    preventClickJacking,
    disableRightClick,
    disableDevTools,
    initSecurity,
};

/**
 * API Security Middleware - TypeScript
 * Additional security layers for API protection with type safety
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// ============= Types =============

type SanitizableValue = string | number | boolean | null | SanitizableObject | SanitizableArray;
interface SanitizableObject { [key: string]: SanitizableValue }
interface SanitizableArray extends Array<SanitizableValue> { }

// ============= Input Sanitization =============

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
    const sanitize = <T extends SanitizableValue>(obj: T): T => {
        if (typeof obj !== 'object' || obj === null) return obj;

        const sanitized: any = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            const value = (obj as any)[key];
            if (typeof value === 'string') {
                // Remove script tags and dangerous patterns
                sanitized[key] = value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '')
                    .trim();
            } else if (typeof value === 'object') {
                sanitized[key] = sanitize(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query as any);
    if (req.params) req.params = sanitize(req.params);

    next();
};

// ============= CSRF Protection =============

interface SessionWithCSRF extends Express.Request {
    session?: {
        csrfToken?: string;
        [key: string]: any;
    };
}

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (req: Request, res: Response, next: NextFunction): void => {
    const sessionReq = req as SessionWithCSRF;

    if (!sessionReq.session) {
        return next(new Error('Session is required for CSRF protection'));
    }

    const token = crypto.randomBytes(32).toString('hex');
    sessionReq.session.csrfToken = token;
    res.locals.csrfToken = token;
    next();
};

/**
 * Verify CSRF token
 */
export const verifyCSRFToken = (req: Request, res: Response, next: NextFunction): void => {
    // Skip for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const sessionReq = req as SessionWithCSRF;
    const token = (req.headers['x-csrf-token'] as string) || req.body._csrf;

    if (!token || token !== sessionReq.session?.csrfToken) {
        res.status(403).json({
            success: false,
            message: 'Invalid CSRF token',
            requestId: req.id,
        });
        return;
    }

    next();
};

// ============= API Key Validation =============

/**
 * Validate API key (for external API access)
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
        res.status(401).json({
            success: false,
            message: 'API key is required',
            requestId: req.id,
        });
        return;
    }

    // TODO: Validate against database
    // For now, check against environment variable
    const validApiKeys = process.env.API_KEYS?.split(',') || [];

    if (!validApiKeys.includes(apiKey)) {
        res.status(401).json({
            success: false,
            message: 'Invalid API key',
            requestId: req.id,
        });
        return;
    }

    next();
};

// ============= Request Signature Verification =============

/**
 * Verify request signature (for webhook/API security)
 */
export const verifySignature = (secret: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const signature = req.headers['x-signature'] as string;

        if (!signature) {
            res.status(401).json({
                success: false,
                message: 'Signature is required',
                requestId: req.id,
            });
            return;
        }

        const payload = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSignature) {
            res.status(401).json({
                success: false,
                message: 'Invalid signature',
                requestId: req.id,
            });
            return;
        }

        next();
    };
};

// ============= Timestamp Validation =============

/**
 * Validate request timestamp to prevent replay attacks
 */
export const validateTimestamp = (maxAgeSeconds: number = 300) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const timestamp = req.headers['x-timestamp'] as string;

        if (!timestamp) {
            res.status(400).json({
                success: false,
                message: 'Timestamp is required',
                requestId: req.id,
            });
            return;
        }

        const requestTime = parseInt(timestamp, 10);
        const currentTime = Math.floor(Date.now() / 1000);
        const age = currentTime - requestTime;

        if (age > maxAgeSeconds || age < 0) {
            res.status(401).json({
                success: false,
                message: 'Request expired or timestamp invalid',
                requestId: req.id,
            });
            return;
        }

        next();
    };
};

// ============= Suspicious Activity Detection =============

const suspiciousPatterns: RegExp[] = [
    /(\bor\b|\band\b).*?=.*?/i,           // SQL injection
    /<script[\s\S]*?>[\s\S]*?<\/script>/i, // XSS
    /\.\.[\/\\]/,                          // Path traversal
    /;.*?(exec|system|eval)/i,             // Command injection
];

export const detectSuspiciousActivity = (req: Request, res: Response, next: NextFunction): void => {
    const checkInput = (input: any): boolean => {
        if (typeof input === 'string') {
            return suspiciousPatterns.some(pattern => pattern.test(input));
        }
        if (typeof input === 'object' && input !== null) {
            return Object.values(input).some(checkInput);
        }
        return false;
    };

    const suspicious =
        checkInput(req.query) ||
        checkInput(req.body) ||
        checkInput(req.params);

    if (suspicious) {
        console.warn('[Security] Suspicious activity detected:', {
            requestId: req.id,
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
            userAgent: req.get('user-agent'),
        });

        res.status(400).json({
            success: false,
            message: 'Invalid request detected',
            requestId: req.id,
        });
        return;
    }

    next();
};

// ============= Content-Type Validation =============

export const validateContentType = (allowedTypes: string[] = ['application/json']) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Skip for GET requests
        if (req.method === 'GET') return next();

        const contentType = req.headers['content-type'];

        if (!contentType) {
            res.status(400).json({
                success: false,
                message: 'Content-Type header is required',
                requestId: req.id,
            });
            return;
        }

        const isAllowed = allowedTypes.some(type =>
            contentType.toLowerCase().includes(type.toLowerCase())
        );

        if (!isAllowed) {
            res.status(415).json({
                success: false,
                message: `Unsupported Content-Type. Allowed: ${allowedTypes.join(', ')}`,
                requestId: req.id,
            });
            return;
        }

        next();
    };
};

// ============= IP-based Access Control =============

export const blockIPs = (blacklist: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const clientIp = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress;

        if (blacklist.includes(clientIp as string)) {
            console.warn('[Security] Blocked IP attempt:', clientIp);
            res.status(403).json({
                success: false,
                message: 'Access denied',
            });
            return;
        }

        next();
    };
};

// ============= User-Agent Validation =============

export const validateUserAgent = (req: Request, res: Response, next: NextFunction): void => {
    const userAgent = req.get('user-agent');

    if (!userAgent) {
        res.status(400).json({
            success: false,
            message: 'User-Agent header is required',
            requestId: req.id,
        });
        return;
    }

    // Block known malicious user agents
    const maliciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan'];
    const isBlocked = maliciousAgents.some(agent =>
        userAgent.toLowerCase().includes(agent)
    );

    if (isBlocked) {
        console.warn('[Security] Blocked malicious user agent:', userAgent);
        res.status(403).json({
            success: false,
            message: 'Access denied',
        });
        return;
    }

    next();
};

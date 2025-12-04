/**
 * Security Configuration - TypeScript
 * Configure security middlewares: helmet, cors, rate limiting with type safety
 */

import { HelmetOptions } from 'helmet';
import { CorsOptions } from 'cors';
import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore - hpp module lacks proper TypeScript definitions
import hpp from 'hpp';
import compression from 'compression';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import config from './env';

// ============= Helmet Configuration =============

export const helmetConfig: HelmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
};

// ============= CORS Configuration =============

const corsOriginHandler = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = config.cors.origin.split(',').map(o => o.trim());

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
};

export const corsOptions: CorsOptions = {
    origin: corsOriginHandler,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-Token',
        'X-Request-ID',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
    maxAge: 86400, // 24 hours
};

// ============= Rate Limiting Configurations =============

export const generalLimiter = rateLimit({
    windowMs: config.security.rateLimitWindowMs,
    max: config.security.rateLimitMaxRequests,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
} as Partial<RateLimitOptions>);

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes.',
    },
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
} as Partial<RateLimitOptions>);

export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: {
        success: false,
        message: 'Too many API requests, please slow down.',
    },
} as Partial<RateLimitOptions>);

export const modifyLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        success: false,
        message: 'Too many modification requests, please slow down.',
    },
} as Partial<RateLimitOptions>);

// ============= MongoDB Sanitization =============

export const mongoSanitizeConfig = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ key }: { req: Request; key: string }) => {
        console.warn(`[Security] MongoDB injection attempt detected: ${key}`);
    },
});

// ============= HTTP Parameter Pollution Protection =============

export const hppConfig = hpp({
    whitelist: ['sort', 'page', 'limit', 'fields', 'filter'],
});

// ============= Compression =============

export const compressionConfig = compression({
    filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    level: 6,
    threshold: 1024,
});

// ============= Request Size Limits =============

export const requestSizeLimits = {
    json: { limit: '10mb' },
    urlencoded: { extended: true, limit: '10mb' },
};

// ============= Security Headers Middleware =============

export const securityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
    // Additional custom security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.removeHeader('X-Powered-By');
    next();
};

// ============= CSRF Token Generator =============

export const generateCSRFToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// ============= Request ID Middleware =============

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    req.id = crypto.randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
};

// ============= Request Logger Middleware =============

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            requestId: req.id,
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
        };

        if (res.statusCode >= 400) {
            console.error('[Request Error]', JSON.stringify(log));
        } else if (config.env === 'development') {
            console.log('[Request]', JSON.stringify(log));
        }
    });

    next();
};

// ============= IP Whitelist Middleware =============

export const ipWhitelist = (whitelist: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (whitelist.length === 0) return next();

        const clientIp = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress;

        if (whitelist.includes(clientIp as string)) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'Access denied - IP not whitelisted',
            });
        }
    };
};

// ============= Sensitive Data Filter =============

export const sensitiveDataFilter = <T extends Record<string, any>>(data: T): T => {
    const sensitive = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    const filtered = { ...data };

    Object.keys(filtered).forEach(key => {
        if (sensitive.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
            (filtered as any)[key] = '[REDACTED]';
        }
    });

    return filtered;
};

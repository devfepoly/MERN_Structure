/**
 * Express Application Setup - TypeScript
 * Configure Express app with middlewares and routes
 */

import express, { Request, Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import config from '@config/env';
import * as security from '@config/security';
import * as apiSecurity from '@middlewares/apiSecurity';

const app: Application = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// ============= SECURITY LAYER 1: Request Tracking & Headers =============
app.use(security.requestIdMiddleware);
app.use(security.securityHeaders);

// ============= SECURITY LAYER 2: CORS & Request Logging =============
app.use(cors(security.corsOptions));
app.use(security.requestLogger);

if (config.env === 'development') {
    app.use(morgan('dev'));
}

// ============= SECURITY LAYER 3: Rate Limiting =============
app.use('/api/', security.generalLimiter);

// ============= SECURITY LAYER 4: Body Parsing & Size Limits =============
app.use(express.json(security.requestSizeLimits.json));
app.use(express.urlencoded(security.requestSizeLimits.urlencoded));
app.use(cookieParser(config.cookie.secret));

// ============= SECURITY LAYER 5: Data Sanitization =============
app.use(security.mongoSanitizeConfig);
app.use(security.hppConfig);
app.use(apiSecurity.sanitizeInput);
app.use(apiSecurity.detectSuspiciousActivity);
app.use(apiSecurity.validateUserAgent);

// ============= SECURITY LAYER 6: Content-Type Validation =============
app.use(apiSecurity.validateContentType(['application/json', 'multipart/form-data']));

// ============= SECURITY LAYER 7: Compression =============
app.use(security.compressionConfig);

// ============= Static Files - Serve Uploads =============
app.use('/uploads', express.static('uploads'));

// ============= API Routes =============
import routes from '@routes';

// Health check (no rate limit)
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.env,
    });
});

// Mount API routes with rate limiting
app.use('/api', routes);

// ============= Error Handlers =============

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        requestId: req.id,
    });
});

// Custom error interface
interface CustomError extends Error {
    statusCode?: number;
    status?: number;
    type?: string;
    errors?: any;
}

// Global error handler
app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
    // Log error
    console.error('[Error]', {
        requestId: req.id,
        error: err.message,
        stack: config.env === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // CORS errors
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({
            success: false,
            message: 'CORS policy: Access denied',
            requestId: req.id,
        });
        return;
    }

    // Rate limit errors
    if (err.status === 429) {
        res.status(429).json({
            success: false,
            message: err.message || 'Too many requests',
            requestId: req.id,
        });
        return;
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: Object.values(err.errors || {}).map((e: any) => e.message),
            requestId: req.id,
        });
        return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            requestId: req.id,
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired',
            requestId: req.id,
        });
        return;
    }

    // Payload too large
    if (err.type === 'entity.too.large') {
        res.status(413).json({
            success: false,
            message: 'Request payload too large',
            requestId: req.id,
        });
        return;
    }

    // Default error
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: config.env === 'production'
            ? 'Internal server error'
            : err.message || 'Something went wrong',
        requestId: req.id,
        ...(config.env === 'development' && { stack: err.stack }),
    });
});

export default app;

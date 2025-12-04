/**
 * Environment Configuration - TypeScript
 * Validates and exports environment variables with type safety
 */

import dotenv from 'dotenv';
import { IEnvConfig } from '@types';

dotenv.config();

const config: IEnvConfig = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),

    // Database
    database: {
        url: process.env.DATABASE_URL || '',
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expire: process.env.JWT_EXPIRE || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || '',
        refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    },

    // Security
    security: {
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },

    // Cookie
    cookie: {
        secret: process.env.COOKIE_SECRET || '',
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800000', 10),
    },
};

/**
 * Validation function to ensure required environment variables are set
 */
const validateConfig = (): void => {
    const requiredEnvVars: string[] = [
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'COOKIE_SECRET',
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }
};

// Only validate in non-test environments
if (config.env !== 'test') {
    validateConfig();
}

export default config;

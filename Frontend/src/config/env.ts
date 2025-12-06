/**
 * Environment configuration
 * Centralized access to environment variables
 */

interface _ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_ENCRYPTION_KEY: string;
    readonly VITE_ENABLE_LOGGING: string;
    readonly VITE_ENABLE_MOCK_API: string;
    readonly MODE: string;
}

interface EnvConfig {
    API_BASE_URL: string;
    API_TIMEOUT: number;
    APP_NAME: string;
    APP_VERSION: string;
    NODE_ENV: string;
    ENCRYPTION_KEY: string;
    ENABLE_LOGGING: boolean;
    ENABLE_MOCK_API: boolean;
}

export const ENV: EnvConfig = {
    // API Configuration
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

    // App Configuration
    APP_NAME: import.meta.env.VITE_APP_NAME || 'React Final',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    NODE_ENV: import.meta.env.MODE || 'development',

    // Security Configuration - MUST be set in .env file
    ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,

    // Feature Flags
    ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
    ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
};

// Validate required environment variables
const validateEnv = () => {
    const requiredVars = {
        VITE_API_BASE_URL: 'API Base URL',
        VITE_ENCRYPTION_KEY: 'Encryption Key (CRITICAL for security!)',
    };

    const missingVars = Object.entries(requiredVars)
        .filter(([key]) => !import.meta.env[key])
        .map(([key, description]) => `${key} - ${description}`);

    if (missingVars.length > 0) {
        const error = `
❌ MISSING REQUIRED ENVIRONMENT VARIABLES:
${missingVars.map(v => `   • ${v}`).join('\n')}

📝 Steps to fix:
1. Copy .env.example to .env
2. Fill in all required values
3. Generate ENCRYPTION_KEY: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
4. Restart the dev server
`;

        console.error(error);

        // Stop execution if critical vars missing
        if (ENV.NODE_ENV === 'production' || !import.meta.env.VITE_ENCRYPTION_KEY) {
            throw new Error('Missing required environment variables. Check console for details.');
        }
    }
};

validateEnv();

export default ENV;

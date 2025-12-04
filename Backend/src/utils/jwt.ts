/**
 * JWT Utilities - TypeScript
 * Generate and verify JWT tokens with type safety
 */

import jwt from 'jsonwebtoken';
import config from '@config/env';
import { ITokenPayload } from '@types';

class JWTHelper {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExpire: string | number;
    private readonly refreshTokenExpire: string | number;

    constructor() {
        this.accessTokenSecret = config.jwt.secret;
        this.refreshTokenSecret = config.jwt.refreshSecret;
        this.accessTokenExpire = config.jwt.expire;
        this.refreshTokenExpire = config.jwt.refreshExpire;
    }

    /**
     * Generate access token
     */
    public generateAccessToken(payload: Omit<ITokenPayload, 'iat' | 'exp'>): string {
        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpire,
        } as any);
    }

    /**
     * Generate refresh token
     */
    public generateRefreshToken(payload: Omit<ITokenPayload, 'iat' | 'exp'>): string {
        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpire,
        } as any);
    }

    /**
     * Verify access token
     */
    public verifyAccessToken(token: string): ITokenPayload {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret) as ITokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            throw error;
        }
    }

    /**
     * Verify refresh token
     */
    public verifyRefreshToken(token: string): ITokenPayload {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret) as ITokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Refresh token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid refresh token');
            }
            throw error;
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    public decode(token: string): ITokenPayload | null {
        try {
            return jwt.decode(token) as ITokenPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Generate both access and refresh tokens
     */
    public generateTokenPair(payload: Omit<ITokenPayload, 'iat' | 'exp'>): {
        accessToken: string;
        refreshToken: string;
    } {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Extract token from Authorization header
     */
    public extractFromHeader(authHeader?: string): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }

    /**
     * Check if token is expired
     */
    public isExpired(token: string): boolean {
        try {
            const decoded = this.decode(token);
            if (!decoded || !decoded.exp) return true;

            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    }
}

export default new JWTHelper();

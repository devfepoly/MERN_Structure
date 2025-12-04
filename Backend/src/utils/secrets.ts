/**
 * Secrets Management - TypeScript
 * Secure handling of sensitive data with type safety
 */

import crypto, { CipherGCM, DecipherGCM } from 'crypto';
import { IEncryptedData, IHashResult } from '@types';

class SecretsManager {
    private readonly algorithm: string = 'aes-256-gcm';
    private readonly masterKey: string;

    constructor() {
        this.masterKey = process.env.MASTER_KEY || this.generateKey();
    }

    /**
     * Generate secure random key
     */
    public generateKey(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Generate secure random token
     */
    public generateToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('base64url');
    }

    /**
     * Hash sensitive data (one-way)
     */
    public hash(data: string, salt: string | null = null): IHashResult {
        const actualSalt = salt || crypto.randomBytes(16).toString('hex');
        const hash = crypto
            .pbkdf2Sync(data, actualSalt, 100000, 64, 'sha512')
            .toString('hex');

        return { hash, salt: actualSalt };
    }

    /**
     * Verify hashed data
     */
    public verifyHash(data: string, hash: string, salt: string): boolean {
        const { hash: newHash } = this.hash(data, salt);
        return crypto.timingSafeEqual(
            Buffer.from(hash),
            Buffer.from(newHash)
        );
    }

    /**
     * Encrypt sensitive data (two-way)
     */
    public encrypt(text: string): IEncryptedData {
        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(
                this.algorithm,
                Buffer.from(this.masterKey, 'hex').slice(0, 32),
                iv
            ) as CipherGCM;

            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            const authTag = cipher.getAuthTag();

            return {
                encrypted,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex'),
            };
        } catch (error) {
            throw new Error('Encryption failed');
        }
    }

    /**
     * Decrypt sensitive data
     */
    public decrypt(encrypted: string, iv: string, authTag: string): string {
        try {
            const decipher = crypto.createDecipheriv(
                this.algorithm,
                Buffer.from(this.masterKey, 'hex').slice(0, 32),
                Buffer.from(iv, 'hex')
            ) as DecipherGCM;

            decipher.setAuthTag(Buffer.from(authTag, 'hex'));

            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            throw new Error('Decryption failed');
        }
    }

    /**
     * Generate HMAC signature
     */
    public sign(data: any, secret: string): string {
        return crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(data))
            .digest('hex');
    }

    /**
     * Verify HMAC signature
     */
    public verifySignature(data: any, signature: string, secret: string): boolean {
        const expectedSignature = this.sign(data, secret);
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }

    /**
     * Generate secure session ID
     */
    public generateSessionId(): string {
        return crypto.randomBytes(32).toString('base64url');
    }

    /**
     * Mask sensitive data for logs
     */
    public maskSensitiveData<T = any>(
        data: T,
        fieldsToMask: string[] = ['password', 'token', 'secret']
    ): T {
        if (typeof data !== 'object' || data === null) return data;

        const masked: any = Array.isArray(data) ? [] : {};

        for (const key in data) {
            if (fieldsToMask.some(field =>
                key.toLowerCase().includes(field.toLowerCase())
            )) {
                masked[key] = '***REDACTED***';
            } else if (typeof (data as any)[key] === 'object') {
                masked[key] = this.maskSensitiveData((data as any)[key], fieldsToMask);
            } else {
                masked[key] = (data as any)[key];
            }
        }

        return masked;
    }

    /**
     * Constant-time string comparison
     */
    public safeCompare(a: string, b: string): boolean {
        if (typeof a !== 'string' || typeof b !== 'string') {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        return crypto.timingSafeEqual(
            Buffer.from(a),
            Buffer.from(b)
        );
    }
}

// Export singleton instance
export default new SecretsManager();

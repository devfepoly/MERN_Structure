/**
 * Sanitization Utilities - TypeScript
 * Clean and sanitize user input with type safety
 */

class SanitizeHelper {
    /**
     * Remove HTML tags from string
     */
    public stripHtml(text: string): string {
        return text.replace(/<[^>]*>/g, '');
    }

    /**
     * Remove script tags and dangerous patterns
     */
    public removeXSS(text: string): string {
        let sanitized = text;

        // Remove script tags
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

        // Remove javascript: protocol
        sanitized = sanitized.replace(/javascript:/gi, '');

        // Remove event handlers
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');

        // Remove data: URIs
        sanitized = sanitized.replace(/data:text\/html/gi, '');

        return sanitized.trim();
    }

    /**
     * Sanitize email address
     */
    public email(email: string): string {
        return email.toLowerCase().trim();
    }

    /**
     * Sanitize URL
     */
    public url(url: string): string {
        try {
            const parsed = new URL(url);
            // Only allow http and https protocols
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                throw new Error('Invalid protocol');
            }
            return parsed.href;
        } catch (error) {
            throw new Error('Invalid URL');
        }
    }

    /**
     * Sanitize filename
     */
    public filename(filename: string): string {
        // Remove path traversal attempts
        let sanitized = filename.replace(/\.\.[\/\\]/g, '');

        // Remove special characters except dots, dashes, and underscores
        sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

        return sanitized;
    }

    /**
     * Sanitize object (recursive)
     */
    public object<T extends Record<string, any>>(obj: T, deep: boolean = true): T {
        const sanitized: any = {};

        for (const key in obj) {
            const value = obj[key];

            if (typeof value === 'string') {
                sanitized[key] = this.removeXSS(value);
            } else if (deep && typeof value === 'object' && value !== null) {
                sanitized[key] = Array.isArray(value)
                    ? value.map((item: any) => typeof item === 'object' ? this.object(item, deep) : item)
                    : this.object(value, deep);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Escape special characters for SQL LIKE queries
     */
    public escapeLike(text: string): string {
        return text.replace(/[%_]/g, '\\$&');
    }

    /**
     * Sanitize phone number
     */
    public phone(phone: string): string {
        // Remove all non-numeric characters
        return phone.replace(/\D/g, '');
    }

    /**
     * Sanitize alphanumeric only
     */
    public alphanumeric(text: string): string {
        return text.replace(/[^a-zA-Z0-9]/g, '');
    }

    /**
     * Sanitize numeric only
     */
    public numeric(text: string): string {
        return text.replace(/[^0-9]/g, '');
    }

    /**
     * Trim and normalize whitespace
     */
    public whitespace(text: string): string {
        return text.replace(/\s+/g, ' ').trim();
    }

    /**
     * Sanitize MongoDB ObjectId
     */
    public objectId(id: string): string {
        const sanitized = id.replace(/[^a-f0-9]/gi, '');
        if (sanitized.length !== 24) {
            throw new Error('Invalid ObjectId format');
        }
        return sanitized;
    }
}

export default new SanitizeHelper();

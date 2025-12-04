/**
 * Logger Utilities - TypeScript
 * Custom logging functions with type safety
 */

import { Request, Response } from 'express';
import config from '@config/env';

enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: any;
}

class Logger {
    private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            ...(data && { data }),
        };
    }

    private log(entry: LogEntry): void {
        const logString = JSON.stringify(entry);

        switch (entry.level) {
            case LogLevel.ERROR:
                console.error(logString);
                break;
            case LogLevel.WARN:
                console.warn(logString);
                break;
            case LogLevel.DEBUG:
                if (config.env === 'development') {
                    console.debug(logString);
                }
                break;
            default:
                console.log(logString);
        }
    }

    public info(message: string, data?: any): void {
        this.log(this.formatLog(LogLevel.INFO, message, data));
    }

    public warn(message: string, data?: any): void {
        this.log(this.formatLog(LogLevel.WARN, message, data));
    }

    public error(message: string, error?: Error | any): void {
        const errorData = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error;

        this.log(this.formatLog(LogLevel.ERROR, message, errorData));
    }

    public debug(message: string, data?: any): void {
        if (config.env === 'development') {
            this.log(this.formatLog(LogLevel.DEBUG, message, data));
        }
    }

    public request(req: Request, res: Response, duration?: number): void {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            statusCode: res.statusCode,
            requestId: req.id,
            ...(duration && { duration: `${duration}ms` }),
        };

        if (res.statusCode >= 400) {
            this.error('Request failed', logData);
        } else {
            this.info('Request completed', logData);
        }
    }
}

export default new Logger();

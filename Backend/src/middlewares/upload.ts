/**
 * File Upload Middleware
 * Wrapper for Multer upload handlers with error handling
 */

import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import logger from '@utils/logger';

/**
 * Handle Multer errors
 */
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof MulterError) {
        logger.error('Multer error', { error: err.message, code: err.code, field: err.field });

        // Handle specific Multer errors
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                res.status(400).json({
                    success: false,
                    message: 'File too large. Please upload a smaller file.',
                    error: err.message,
                    requestId: req.id,
                });
                return;

            case 'LIMIT_FILE_COUNT':
                res.status(400).json({
                    success: false,
                    message: 'Too many files. Please reduce the number of files.',
                    error: err.message,
                    requestId: req.id,
                });
                return;

            case 'LIMIT_UNEXPECTED_FILE':
                res.status(400).json({
                    success: false,
                    message: `Unexpected file field: ${err.field}`,
                    error: err.message,
                    requestId: req.id,
                });
                return;

            default:
                res.status(400).json({
                    success: false,
                    message: 'File upload error',
                    error: err.message,
                    requestId: req.id,
                });
                return;
        }
    }

    // Handle custom file filter errors
    if (err.message && err.message.includes('Invalid file type')) {
        logger.warn('Invalid file type uploaded', { error: err.message });
        res.status(400).json({
            success: false,
            message: err.message,
            requestId: req.id,
        });
        return;
    }

    // Pass to next error handler
    next(err);
};

/**
 * Validate uploaded file exists
 */
export const validateFileExists = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.file && !req.files) {
        res.status(400).json({
            success: false,
            message: 'No file uploaded',
            requestId: req.id,
        });
        return;
    }
    next();
};

/**
 * Log file upload
 */
export const logFileUpload = (req: Request, _res: Response, next: NextFunction): void => {
    if (req.file) {
        logger.info('File uploaded', {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            userId: (req as any).user?.id,
            requestId: req.id,
        });
    } else if (req.files) {
        const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        logger.info('Multiple files uploaded', {
            count: files.length,
            files: files.map(f => ({
                filename: f.filename,
                originalname: f.originalname,
                size: f.size,
            })),
            userId: (req as any).user?.id,
            requestId: req.id,
        });
    }
    next();
};

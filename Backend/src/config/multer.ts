/**
 * File Upload Configuration - Multer
 * Secure file upload handling with validation
 */

import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';

// Upload directories
const UPLOAD_DIRS = {
    AVATARS: 'uploads/avatars',
    DOCUMENTS: 'uploads/documents',
    IMAGES: 'uploads/images',
    TEMP: 'uploads/temp',
} as const;

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
    AVATAR: 5 * 1024 * 1024, // 5MB
    IMAGE: 10 * 1024 * 1024, // 10MB
    DOCUMENT: 20 * 1024 * 1024, // 20MB
    VIDEO: 100 * 1024 * 1024, // 100MB
} as const;

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] as string[],
    DOCUMENTS: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ] as string[],
    VIDEOS: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'] as string[],
} as const;

// Create upload directories if they don't exist
Object.values(UPLOAD_DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration for different upload types
const createStorage = (uploadDir: string): StorageEngine => {
    return multer.diskStorage({
        destination: (_req: Request, _file: Express.Multer.File, cb) => {
            cb(null, uploadDir);
        },
        filename: (_req: Request, file: Express.Multer.File, cb) => {
            // Generate unique filename: timestamp-random-originalname
            const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
            const ext = path.extname(file.originalname);
            const nameWithoutExt = path.basename(file.originalname, ext);
            const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
            cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
        },
    });
};

// File filter for image uploads
const imageFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.IMAGES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${ALLOWED_MIME_TYPES.IMAGES.join(', ')} are allowed.`));
    }
};

// File filter for document uploads
const documentFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.DOCUMENTS.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only documents are allowed.`));
    }
};

// File filter for video uploads
const videoFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.VIDEOS.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only videos are allowed.`));
    }
};

// Avatar upload (single image, max 5MB)
export const uploadAvatar = multer({
    storage: createStorage(UPLOAD_DIRS.AVATARS),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: FILE_SIZE_LIMITS.AVATAR,
        files: 1,
    },
});

// Image upload (multiple images, max 10MB each)
export const uploadImages = multer({
    storage: createStorage(UPLOAD_DIRS.IMAGES),
    fileFilter: imageFileFilter,
    limits: {
        fileSize: FILE_SIZE_LIMITS.IMAGE,
        files: 10,
    },
});

// Document upload (single or multiple, max 20MB each)
export const uploadDocuments = multer({
    storage: createStorage(UPLOAD_DIRS.DOCUMENTS),
    fileFilter: documentFileFilter,
    limits: {
        fileSize: FILE_SIZE_LIMITS.DOCUMENT,
        files: 5,
    },
});

// Generic file upload with memory storage (for processing before saving)
export const uploadToMemory = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: FILE_SIZE_LIMITS.DOCUMENT,
        files: 1,
    },
});

// Temporary upload (will be moved or deleted later)
export const uploadTemp = multer({
    storage: createStorage(UPLOAD_DIRS.TEMP),
    limits: {
        fileSize: FILE_SIZE_LIMITS.DOCUMENT,
        files: 5,
    },
});

// Video upload (single video, max 100MB)
export const uploadVideo = multer({
    storage: createStorage(UPLOAD_DIRS.IMAGES), // Store in images for now
    fileFilter: videoFileFilter,
    limits: {
        fileSize: FILE_SIZE_LIMITS.VIDEO,
        files: 1,
    },
});

// Utility: Delete uploaded file
export const deleteFile = (filePath: string): void => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error);
    }
};

// Utility: Delete multiple files
export const deleteFiles = (filePaths: string[]): void => {
    filePaths.forEach(filePath => deleteFile(filePath));
};

// Utility: Get file URL
export const getFileUrl = (filename: string, uploadDir: keyof typeof UPLOAD_DIRS): string => {
    return `/${UPLOAD_DIRS[uploadDir]}/${filename}`;
};

// Utility: Validate file extension
export const isValidFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
    const ext = path.extname(filename).toLowerCase();
    return allowedExtensions.includes(ext);
};

// Utility: Get file size in readable format
export const getReadableFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

// Export constants for use in controllers
export { UPLOAD_DIRS, FILE_SIZE_LIMITS, ALLOWED_MIME_TYPES };

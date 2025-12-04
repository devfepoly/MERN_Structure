/**
 * Upload Routes Example
 * Demonstrates how to use Multer upload middleware
 */

import express, { Request, Response } from 'express';
import {
    uploadAvatar,
    uploadImages,
    uploadDocuments,
    deleteFile,
    getFileUrl,
    getReadableFileSize,
} from '@config/multer';
import { handleMulterError, validateFileExists, logFileUpload } from '@middlewares/upload';
import response from '@utils/response';

const router = express.Router();

/**
 * Upload single avatar
 * POST /api/uploads/avatar
 */
router.post(
    '/avatar',
    uploadAvatar.single('avatar'),
    handleMulterError,
    validateFileExists,
    logFileUpload,
    (req: Request, res: Response) => {
        const file = req.file!;

        response.success(res, {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: getReadableFileSize(file.size),
            url: getFileUrl(file.filename, 'AVATARS'),
            path: file.path,
        }, 'Avatar uploaded successfully', 201);
    }
);

/**
 * Upload multiple images
 * POST /api/uploads/images
 */
router.post(
    '/images',
    uploadImages.array('images', 10),
    handleMulterError,
    validateFileExists,
    logFileUpload,
    (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        response.success(res, {
            count: files.length,
            files: files.map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: getReadableFileSize(file.size),
                url: getFileUrl(file.filename, 'IMAGES'),
            })),
        }, 'Images uploaded successfully', 201);
    }
);

/**
 * Upload documents
 * POST /api/uploads/documents
 */
router.post(
    '/documents',
    uploadDocuments.array('documents', 5),
    handleMulterError,
    validateFileExists,
    logFileUpload,
    (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        response.success(res, {
            count: files.length,
            files: files.map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: getReadableFileSize(file.size),
                url: getFileUrl(file.filename, 'DOCUMENTS'),
            })),
        }, 'Documents uploaded successfully', 201);
    }
);

/**
 * Delete uploaded file
 * DELETE /api/uploads/:filename
 */
router.delete('/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;
    const { type } = req.query; // 'avatars', 'images', 'documents'

    // Construct file path based on type
    const uploadDir = type === 'avatars' ? 'uploads/avatars'
        : type === 'documents' ? 'uploads/documents'
            : 'uploads/images';

    const filePath = `${uploadDir}/${filename}`;

    try {
        deleteFile(filePath);
        response.success(res, null, 'File deleted successfully');
    } catch (error) {
        response.error(res, 'Failed to delete file', 500);
    }
});

export default router;

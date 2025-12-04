/**
 * Routes Index - TypeScript
 * Central route configuration with security
 */

import express, { Router, Request, Response } from 'express';
// import * as security from '@config/security';
import uploadRoutes from './uploadRoutes';

const router: Router = express.Router();

// TODO: Import routes when ready
// import authRoutes from './authRoutes';
// import userRoutes from './userRoutes';

// API Info
router.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        version: '1.0.0',
        documentation: '/api/docs',
        timestamp: new Date().toISOString(),
    });
});

// Mount upload routes (available immediately for testing)
router.use('/uploads', uploadRoutes);

// TODO: Mount routes with appropriate rate limiting
// Auth routes - stricter rate limiting
// router.use('/auth', security.authLimiter, authRoutes);

// User routes - standard API rate limiting
// router.use('/users', security.apiLimiter, userRoutes);

// Example: Protected modification routes
// router.use('/posts', security.apiLimiter);
// router.post('/posts', security.modifyLimiter, postController.create);
// router.put('/posts/:id', security.modifyLimiter, postController.update);
// router.delete('/posts/:id', security.modifyLimiter, postController.delete);

export default router;

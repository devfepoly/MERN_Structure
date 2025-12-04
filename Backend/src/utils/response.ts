/**
 * Response Utilities - TypeScript
 * Standardized API response helpers
 */

import { Response } from 'express';
import { IApiResponse, IApiError, IPaginatedResponse } from '@types';

class ResponseHelper {
    /**
     * Send success response
     */
    public success<T = any>(
        res: Response,
        data?: T,
        message: string = 'Success',
        statusCode: number = 200
    ): Response {
        const response: IApiResponse<T> = {
            success: true,
            message,
            ...(data !== undefined && { data }),
        };

        return res.status(statusCode).json(response);
    }

    /**
     * Send error response
     */
    public error(
        res: Response,
        message: string = 'An error occurred',
        statusCode: number = 500,
        errors?: string[]
    ): Response {
        const response: IApiError = {
            success: false,
            message,
            ...(errors && { errors }),
        };

        return res.status(statusCode).json(response);
    }

    /**
     * Send paginated response
     */
    public paginated<T = any>(
        res: Response,
        data: T[],
        page: number,
        limit: number,
        total: number,
        _message: string = 'Data retrieved successfully'
    ): Response {
        const totalPages = Math.ceil(total / limit);

        const response: IPaginatedResponse<T> = {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };

        return res.status(200).json(response);
    }

    /**
     * Send created response
     */
    public created<T = any>(
        res: Response,
        data?: T,
        message: string = 'Resource created successfully'
    ): Response {
        return this.success(res, data, message, 201);
    }

    /**
     * Send no content response
     */
    public noContent(res: Response): Response {
        return res.status(204).send();
    }

    /**
     * Send not found response
     */
    public notFound(
        res: Response,
        message: string = 'Resource not found'
    ): Response {
        return this.error(res, message, 404);
    }

    /**
     * Send unauthorized response
     */
    public unauthorized(
        res: Response,
        message: string = 'Unauthorized access'
    ): Response {
        return this.error(res, message, 401);
    }

    /**
     * Send forbidden response
     */
    public forbidden(
        res: Response,
        message: string = 'Access forbidden'
    ): Response {
        return this.error(res, message, 403);
    }

    /**
     * Send bad request response
     */
    public badRequest(
        res: Response,
        message: string = 'Bad request',
        errors?: string[]
    ): Response {
        return this.error(res, message, 400, errors);
    }

    /**
     * Send validation error response
     */
    public validationError(
        res: Response,
        errors: string[],
        message: string = 'Validation failed'
    ): Response {
        return this.error(res, message, 422, errors);
    }

    /**
     * Send internal server error response
     */
    public serverError(
        res: Response,
        message: string = 'Internal server error'
    ): Response {
        return this.error(res, message, 500);
    }
}

export default new ResponseHelper();

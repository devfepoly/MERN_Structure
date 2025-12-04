import { Request, Response, NextFunction } from 'express';
import { IUserPayload } from '@types';

// Extend Express Request to include custom properties
declare global {
    namespace Express {
        interface Request {
            id?: string;
            user?: IUserPayload;
        }
    }
}

// Middleware types
export type MiddlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void | Promise<void>;

export type ErrorMiddlewareFunction = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => void | Promise<void>;

// Route handler types
export type RouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

export type AsyncRouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

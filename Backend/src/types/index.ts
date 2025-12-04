import { Request } from 'express';

// ============= User Types =============

export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    avatar?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface IUserPayload {
    id: string;
    email: string;
    role: UserRole;
}

// ============= Auth Types =============

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterData {
    email: string;
    password: string;
    name: string;
}

export interface IAuthResponse {
    user: Omit<IUser, 'password'>;
    accessToken: string;
    refreshToken?: string;
}

export interface ITokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

// ============= API Response Types =============

export interface IApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    requestId?: string;
}

export interface IApiError {
    success: false;
    message: string;
    errors?: string[];
    requestId?: string;
    stack?: string;
}

export interface IPaginatedResponse<T> {
    success: true;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============= Express Request Extensions =============

export interface IAuthRequest extends Request {
    user?: IUserPayload;
    id?: string;
}

// ============= Security Types =============

export interface IEncryptedData {
    encrypted: string;
    iv: string;
    authTag: string;
}

export interface IHashResult {
    hash: string;
    salt: string;
}

// ============= Query Types =============

export interface IPaginationQuery {
    page?: string;
    limit?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface IFilterQuery extends IPaginationQuery {
    search?: string;
    role?: UserRole;
    isVerified?: string;
}

// ============= Config Types =============

export interface IEnvConfig {
    env: string;
    port: number;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expire: string;
        refreshSecret: string;
        refreshExpire: string;
    };
    security: {
        bcryptSaltRounds: number;
        rateLimitWindowMs: number;
        rateLimitMaxRequests: number;
    };
    cors: {
        origin: string;
    };
    cookie: {
        secret: string;
        maxAge: number;
    };
}

// ============= Service Return Types =============

export type ServiceResult<T> = Promise<{
    success: boolean;
    data?: T;
    error?: string;
}>;

// ============= Validation Types =============

export interface IValidationError {
    field: string;
    message: string;
}

export type ValidationResult = {
    isValid: boolean;
    errors: IValidationError[];
};

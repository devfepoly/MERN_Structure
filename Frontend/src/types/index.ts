/**
 * Common Type Definitions
 * Centralized TypeScript types for the application
 */

import React from 'react';

// ============= User & Auth Types =============

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    confirmPassword?: string;
}

// ============= API Types =============

export interface ApiError {
    message: string;
    status?: number;
    data?: unknown;
}

export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T = unknown> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ============= Route Types =============

export interface RouteConfig {
    path: string;
    component: React.LazyExoticComponent<React.ComponentType<unknown>>;
    index?: boolean;
    isProtected?: boolean;
    isRestricted?: boolean;
    requiredRole?: UserRole;
}

// ============= Hook Types =============

export interface UseApiResult<T = unknown> {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: (...args: unknown[]) => Promise<T>;
    reset: () => void;
}

export interface UseAuthResult {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (data: RegisterData) => Promise<ApiResponse>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<User>;
    setError: (error: string | null) => void;
}

// ============= Component Props Types =============

export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
}

export interface PublicRouteProps {
    children: React.ReactNode;
    restricted?: boolean;
}

export interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

// ============= Security Types =============

export interface SecureStorage {
    setItem: (key: string, value: unknown) => void;
    getItem: <T = unknown>(key: string) => T | null;
    removeItem: (key: string) => void;
    clear: () => void;
}

export interface RateLimiterConfig {
    maxRequests: number;
    timeWindow: number;
}

// ============= Utility Types =============

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

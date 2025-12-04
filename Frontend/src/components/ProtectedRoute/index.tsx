/**
 * Protected Route Component
 * Protects routes that require authentication
 */

import { memo, type FC } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@services';
import type { ProtectedRouteProps } from '@types';

// Routes constants
const ROUTES = {
    HOME: '/',
    AUTH: '/admin/auth',
};

const ProtectedRoute: FC<ProtectedRouteProps> = memo(({ children, requiredRole }) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.AUTH} replace />;
    }

    // Check if user has required role
    if (requiredRole && currentUser?.role !== requiredRole) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;

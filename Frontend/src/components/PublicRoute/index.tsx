/**
 * Public Route Component
 * Redirects to home if user is already authenticated
 */

import { memo, type FC } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@services';
import type { PublicRouteProps } from '@types';

const ROUTES = {
    HOME: '/',
};

const PublicRoute: FC<PublicRouteProps> = memo(({ children, restricted = false }) => {
    const isAuthenticated = authService.isAuthenticated();

    // If route is restricted and user is authenticated, redirect to home
    if (restricted && isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
});

PublicRoute.displayName = 'PublicRoute';

export default PublicRoute;

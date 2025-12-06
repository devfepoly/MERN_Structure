import React, { lazy, type ReactElement } from "react";
import { Route } from "react-router-dom";
import type { UserRole } from "@types";

// Lazy load components
const ProtectedRoute = lazy(() => import("@components/ProtectedRoute"));
const PublicRoute = lazy(() => import("@components/PublicRoute"));

// Lazy load pages with preload hints
const Home = lazy(() => import(/* webpackPrefetch: true */ "@pages/Home"));
const Admin = lazy(() => import(/* webpackPrefetch: true */ "@pages/Admin"));
const Auth = lazy(() => import(/* webpackPrefetch: true */ "@pages/Admin/Auth"));
const NotFound = lazy(() => import("@pages/NotFound"));

// User roles constant
const USER_ROLES = {
    ADMIN: 'admin' as const,
    USER: 'user' as const,
    GUEST: 'guest' as const,
};

// Route configuration with proper typing
interface RouteConfigItem {
    path: string;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    index?: boolean;
    isProtected?: boolean;
    isRestricted?: boolean;
    requiredRole?: UserRole;
}

const routesConfig: RouteConfigItem[] = [
    {
        path: "/",
        component: Home,
        index: true,
        isProtected: false,
        isRestricted: false,
    },
    {
        path: "/admin/*",
        component: Admin,
        isProtected: true,
        requiredRole: USER_ROLES.ADMIN,
    },
    {
        path: "/admin/auth",
        component: Auth,
        isProtected: false,
        isRestricted: true, // Redirect to home if already logged in
    },
    {
        path: "*",
        component: NotFound,
        isProtected: false,
    },
];

// Generate Route components dynamically with memoization
const routes: ReactElement[] = routesConfig.map(({ path, component, index, isProtected, isRestricted, requiredRole }) => {
    const Component = component;

    let element: ReactElement = <Component />;

    // Wrap with ProtectedRoute if needed
    if (isProtected) {
        element = (
            <ProtectedRoute requiredRole={requiredRole}>
                {element}
            </ProtectedRoute>
        );
    }

    // Wrap with PublicRoute if restricted (auth pages)
    if (isRestricted) {
        element = (
            <PublicRoute restricted={true}>
                {element}
            </PublicRoute>
        );
    }

    return (
        <Route
            key={path}
            path={path}
            element={element}
            index={index}
        />
    );
});

export default routes;

/**
 * Auth Context
 * Global authentication state management
 */

import { createContext, useContext, memo, type FC, type ReactNode } from 'react';
import { useAuth } from '@hooks';

const AuthContext = createContext(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = memo(({ children }) => {
    const auth = useAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
});

AuthProvider.displayName = 'AuthProvider';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

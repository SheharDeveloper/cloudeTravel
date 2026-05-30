import { useEffect, ReactNode } from 'react';
import { getAuthToken } from './api';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
    useEffect(() => {
        const token = getAuthToken();
        
        if (!token) {
            window.location.href = redirectTo;
        }
    }, [redirectTo]);

    const token = getAuthToken();
    
    if (!token) {
        return null;
    }

    return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
    useEffect(() => {
        const token = getAuthToken();
        
        if (token) {
            window.location.href = '/dashboard';
        }
    }, []);

    const token = getAuthToken();
    
    if (token) {
        return null;
    }

    return <>{children}</>;
}

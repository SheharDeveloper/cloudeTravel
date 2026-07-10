import { useEffect, ReactNode } from 'react';
import { usePage, router } from '@inertiajs/react';

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
    const page = usePage();
    const auth = page.props.auth as any;

    useEffect(() => {
        if (!auth?.user) {
            router.visit(redirectTo);
        }
    }, [redirectTo, auth?.user]);

    if (!auth?.user) {
        return null;
    }

    return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
    const page = usePage();
    const auth = page.props.auth as any;

    useEffect(() => {
        if (auth?.user) {
            router.visit('/dashboard');
        }
    }, [auth?.user]);

    if (auth?.user) {
        return null;
    }

    return <>{children}</>;
}

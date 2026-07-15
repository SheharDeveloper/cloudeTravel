const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const getAuthToken = (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
    if (!isBrowser) return;
    localStorage.setItem('auth_token', token);
};

export const clearAuthToken = (): void => {
    if (!isBrowser) return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': isBrowser ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' : '',
        ...options.headers as Record<string, string>,
    };

    // Don't set Content-Type for FormData - let browser handle it
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    } else if (!headers['Content-Type'] && options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (response.status === 401) {
        if (isBrowser && window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return response;
    }

    return response;
};

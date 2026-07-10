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
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': isBrowser ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' : '',
        ...options.headers as Record<string, string>,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✓ Token sent:', token.substring(0, 20) + '...');
    } else {
        console.warn('✗ No token found in localStorage');
    }

    // Don't set Content-Type for FormData - let browser handle it
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    } else if (!headers['Content-Type'] && options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    console.log('API Request:', { url, method: options.method, headers, bodyType: options.body?.constructor.name });

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    console.log('API Response Status:', response.status, 'Content-Type:', response.headers.get('content-type'));

    if (response.status === 401) {
        clearAuthToken();
        if (isBrowser) {
            window.location.href = '/login';
        }
        return response;
    }

    return response;
};

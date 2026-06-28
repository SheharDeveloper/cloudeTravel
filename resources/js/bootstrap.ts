import { getAuthToken } from '@/lib/api';

/**
 * Bootstrap: Configure fetch interceptor to include auth token in all requests
 * This ensures Inertia and other requests include the Authorization header
 */

// Store original fetch
const originalFetch = window.fetch;

// Override fetch to include auth token
window.fetch = function(url: string | Request | URL, options: RequestInit = {}): Promise<Response> {
    const token = getAuthToken();

    if (!token) {
        return originalFetch.call(this, url, options);
    }

    // Only modify requests to same origin
    let isLocalRequest = false;
    if (typeof url === 'string') {
        isLocalRequest = url.startsWith('/') || url.startsWith(window.location.origin);
    } else if (url instanceof URL) {
        isLocalRequest = url.origin === window.location.origin;
    } else if (url instanceof Request) {
        isLocalRequest = url.url.startsWith('/') || url.url.startsWith(window.location.origin);
    }

    if (isLocalRequest) {
        // Create new options object to avoid mutating original
        const newOptions = { ...options };

        // Ensure headers object exists and is mutable
        let headers: Record<string, string> = {};

        if (newOptions.headers instanceof Headers) {
            // Convert Headers instance to object
            newOptions.headers.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (newOptions.headers && typeof newOptions.headers === 'object') {
            // Copy existing headers
            Object.assign(headers, newOptions.headers);
        }

        // Add authorization header if not already present
        if (token && !headers.Authorization) {
            headers.Authorization = `Bearer ${token}`;
            console.log('✓ Token added to request:', url instanceof Request ? url.url : url);
        }

        newOptions.headers = headers;

        return originalFetch.call(this, url, newOptions);
    }

    return originalFetch.call(this, url, options);
};

console.log('✓ Bootstrap initialized: Auth token will be sent with all local requests');

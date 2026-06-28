import { apiFetch, getAuthToken, clearAuthToken } from '@/lib/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    booking?: T;
    notes?: T[];
    [key: string]: any;
}

interface RequestConfig extends RequestInit {
    params?: Record<string, any>;
}

class ApiService {
    private baseURL = '';

    /**
     * Build query string from params object
     */
    private buildQueryString(params: Record<string, any>): string {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                queryParams.append(key, String(value));
            }
        });
        return queryParams.toString();
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!getAuthToken();
    }

    /**
     * GET request
     */
    async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        const fullUrl = config?.params
            ? `${this.baseURL}${url}?${this.buildQueryString(config.params)}`
            : `${this.baseURL}${url}`;

        try {
            const response = await apiFetch(fullUrl, {
                method: 'GET',
                ...config,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = '/auth/login';
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    /**
     * POST request
     */
    async post<T = any>(url: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await apiFetch(`${this.baseURL}${url}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                ...config,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = '/auth/login';
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    /**
     * PATCH request
     */
    async patch<T = any>(url: string, body?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await apiFetch(`${this.baseURL}${url}`, {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                ...config,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = '/auth/login';
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('PATCH request failed:', error);
            throw error;
        }
    }

    /**
     * DELETE request
     */
    async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await apiFetch(`${this.baseURL}${url}`, {
                method: 'DELETE',
                ...config,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    clearAuthToken();
                    window.location.href = '/auth/login';
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }

    /**
     * Get booking by UID with authentication
     */
    async getBooking(uid: string) {
        return this.get(`/api/bookings/${uid}`);
    }

    /**
     * Get all bookings with authentication
     */
    async getBookings(params?: Record<string, any>) {
        return this.get('/api/bookings', { params });
    }

    /**
     * Create booking (public endpoint)
     */
    async createBooking(data: any) {
        return this.post('/api/bookings', data);
    }

    /**
     * Get booking notes with authentication
     */
    async getBookingNotes(bookingId: string) {
        return this.get(`/api/bookings/${bookingId}/notes`);
    }

    /**
     * Add booking note with authentication
     */
    async addBookingNote(bookingId: string, note: string) {
        return this.post(`/api/bookings/${bookingId}/notes`, { note });
    }

    /**
     * Delete booking note with authentication
     */
    async deleteBookingNote(bookingId: string, noteId: string) {
        return this.delete(`/api/bookings/${bookingId}/notes/${noteId}`);
    }
}

export default new ApiService();

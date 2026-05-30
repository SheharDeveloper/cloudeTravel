// Service for managing testimonials
// All API calls are handled here with proper authentication and error handling

import { apiFetch } from '@/lib/api';

// Testimonial interface matching the database schema
export interface Testimonial {
    id?: number;
    client_name: string;
    client_image?: string;
    message: string;
    rating: number; // 1-5 star rating
    status: number; // 1 = active, 0 = inactive
    order: number; // Display order
    created_at?: string;
    updated_at?: string;
}

// Default fallback image if client image is not available
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80';

// Service class for all testimonial operations
class TestimonialService {
    /**
     * Fetch all testimonials from the API
     * @param status - Optional status filter (1 for active, 0 for inactive, null for all)
     * @returns Promise<Testimonial[]> - Array of testimonials
     */
    async getAll(status?: number | null): Promise<Testimonial[]> {
        try {
            const url = status !== null && status !== undefined ? `/api/testimonials?status=${status}` : '/api/testimonials';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const testimonials = Array.isArray(data) ? data : data.data || [];
                return testimonials.map((t: any) => ({
                    ...t,
                    client_image: t.client_image || DEFAULT_IMAGE,
                }));
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch testimonials:', err);
            return [];
        }
    }

    /**
     * Fetch all testimonials for admin (includes active and inactive)
     * - Requires authentication (Bearer token will be automatically included via apiFetch)
     * - Backend detects authentication and returns all items without ?all=true
     * @returns Promise<Testimonial[]> - Array of all testimonials
     */
    async getAllForAdmin(): Promise<Testimonial[]> {
        try {
            const response = await apiFetch('/api/testimonials');
            if (response.ok) {
                const data = await response.json();
                const testimonials = Array.isArray(data) ? data : data.data || [];
                return testimonials.map((t: any) => ({
                    ...t,
                    client_image: t.client_image || DEFAULT_IMAGE,
                }));
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch testimonials:', err);
            return [];
        }
    }

    /**
     * Create a new testimonial via API
     * - Requires authentication (admin only)
     * - Uses POST method
     * - Accepts either FormData (with file upload) or JSON object
     * @param data - Testimonial data to create (can be FormData with client_image file or regular object)
     * @returns Promise<Testimonial | null> - Created testimonial or null on failure
     */
    async create(data: any): Promise<Testimonial | null> {
        try {
            const isFormData = data instanceof FormData;
            const fetchOptions: any = {
                method: 'POST',
                body: isFormData ? data : JSON.stringify(data),
            };
            if (!isFormData) {
                fetchOptions.headers = { 'Content-Type': 'application/json' };
            }

            const response = await apiFetch('/api/testimonials', fetchOptions);

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Failed to create testimonial:', err);
            return null;
        }
    }

    /**
     * Update an existing testimonial via API
     * - Requires authentication (admin only)
     * - Uses PATCH method
     * - Accepts either FormData (with file upload) or JSON object
     * @param id - Testimonial ID to update
     * @param data - Updated testimonial data (can be FormData with client_image file or regular object)
     * @returns Promise<Testimonial | null> - Updated testimonial or null on failure
     */
    async update(id: number, data: any): Promise<Testimonial | null> {
        try {
            const isFormData = data instanceof FormData;
            const fetchOptions: any = {
                method: 'PATCH',
                body: isFormData ? data : JSON.stringify(data),
            };
            if (!isFormData) {
                fetchOptions.headers = { 'Content-Type': 'application/json' };
            }

            const response = await apiFetch(`/api/testimonials/${id}`, fetchOptions);

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Failed to update testimonial:', err);
            return null;
        }
    }

    /**
     * Delete a testimonial via API
     * - Requires authentication (admin only)
     * - Uses DELETE method
     * @param id - Testimonial ID to delete
     * @returns Promise<boolean> - True if deletion successful, false otherwise
     */
    async delete(id: number): Promise<boolean> {
        try {
            const response = await apiFetch(`/api/testimonials/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                console.error('Delete failed with status:', response.status, error);
            }
            return response.ok;
        } catch (err) {
            console.error('Failed to delete testimonial:', err);
            return false;
        }
    }
}

// Export singleton instance of TestimonialService
export const testimonialService = new TestimonialService();

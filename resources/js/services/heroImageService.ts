// Service for managing hero images (homepage carousel)
// All API calls are handled here with proper authentication and error handling

import { apiFetch } from '@/lib/api';

// Hero image interface matching the database schema
export interface HeroImage {
    id: number;
    image_url: string; // URL to the hero image
    title?: string; // Hero title text
    subtitle?: string; // Hero subtitle text
    order?: number; // Display order in carousel
    status?: number; // 1 = active, 0 = inactive (only active images shown on frontend)
    created_at?: string;
    updated_at?: string;
}

// Default hero image if no images are available
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80';

// Service class for all hero image operations
class HeroImageService {
    /**
     * Fetch all hero images from the API
     * @param status - Optional status filter (1 for active, 0 for inactive, null for all)
     * @returns Promise<HeroImage[]> - Array of hero images
     */
    async getAll(status?: number | null): Promise<HeroImage[]> {
        try {
            const url = status !== null && status !== undefined ? `/api/hero-images?status=${status}` : '/api/hero-images';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) ? data : data.data || [];
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch hero images:', err);
            return [];
        }
    }

    /**
     * Fetch all hero images for admin (includes active and inactive)
     * - Requires authentication (Bearer token will be automatically included via apiFetch)
     * - Backend detects authentication and returns all items without ?all=true
     * @returns Promise<HeroImage[]> - Array of all hero images
     */
    async getAllForAdmin(): Promise<HeroImage[]> {
        try {
            const response = await apiFetch('/api/hero-images');
            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) ? data : data.data || [];
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch hero images:', err);
            return [];
        }
    }

    /**
     * Get default/fallback hero image
     * - Returned when no images are available in database
     * - Used as fallback in carousel when image array is empty
     * @returns HeroImage - Default hero image object
     */
    getDefault(): HeroImage {
        return {
            id: 0,
            image_url: DEFAULT_HERO_IMAGE,
            title: 'Discover the World with CloudTravel',
            subtitle: 'Book flights, hotels, and visas seamlessly in one platform.',
        };
    }

    /**
     * Create a new hero image via API
     * - Requires authentication (admin only)
     * - Uses POST method
     * - Accepts either FormData (with file upload) or JSON object
     * @param data - Hero image data to create (can be FormData with image_url file or regular object)
     * @returns Promise<HeroImage | null> - Created hero image or null on failure
     */
    async create(data: any): Promise<HeroImage | null> {
        try {
            const isFormData = data instanceof FormData;
            const fetchOptions: any = {
                method: 'POST',
                body: isFormData ? data : JSON.stringify(data),
            };
            if (!isFormData) {
                fetchOptions.headers = { 'Content-Type': 'application/json' };
            }

            const response = await apiFetch('/api/hero-images', fetchOptions);

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Failed to create hero image:', err);
            return null;
        }
    }

    /**
     * Update an existing hero image via API
     * - Requires authentication (admin only)
     * - Uses PUT method
     * - Accepts either FormData (with file upload) or JSON object
     * @param id - Hero image ID to update
     * @param data - Updated hero image data (can be FormData with image_url file or regular object)
     * @returns Promise<HeroImage | null> - Updated hero image or null on failure
     */
    async update(id: number, data: any): Promise<HeroImage | null> {
        try {
            const isFormData = data instanceof FormData;
            const fetchOptions: any = {
                method: 'PUT',
                body: isFormData ? data : JSON.stringify(data),
            };
            if (!isFormData) {
                fetchOptions.headers = { 'Content-Type': 'application/json' };
            }

            const response = await apiFetch(`/api/hero-images/${id}`, fetchOptions);

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Failed to update hero image:', err);
            return null;
        }
    }

    /**
     * Delete a hero image via API
     * - Requires authentication (admin only)
     * - Uses DELETE method
     * @param id - Hero image ID to delete
     * @returns Promise<boolean> - True if deletion successful, false otherwise
     */
    async delete(id: number): Promise<boolean> {
        try {
            const response = await apiFetch(`/api/hero-images/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                console.error('Delete failed with status:', response.status, error);
            }
            return response.ok;
        } catch (err) {
            console.error('Failed to delete hero image:', err);
            return false;
        }
    }
}

export const heroImageService = new HeroImageService();

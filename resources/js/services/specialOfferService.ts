// Service for managing special travel offers
// All API calls are handled here with proper authentication and error handling

import { apiFetch } from '@/lib/api';

// Special offer interface matching the database schema
export interface SpecialOffer {
    id: number;
    airline: string; // Airline name (e.g., "Emirates", "Qatar Airways")
    from: string; // Departure location
    destinations: string; // Destination location(s)
    price: string; // Discounted price for the offer
    description?: string; // Additional offer details
    image?: string; // Airline/offer image URL
    created_at?: string;
    updated_at?: string;
}

// Default fallback image if offer image is not available
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80';

// Service class for all special offer operations
class SpecialOfferService {
    /**
     * Fetch all special offers from the API
     * - Used by public homepage to display current deals
     * - Admin endpoint to get all offers for management
     * @returns Promise<SpecialOffer[]> - Array of special offers with default images applied
     */
    async getAll(): Promise<SpecialOffer[]> {
        try {
            const response = await fetch('/api/special-offers');
            if (response.ok) {
                const data = await response.json();
                const offers = Array.isArray(data) ? data : data.data || [];
                return offers.map((offer: any) => ({
                    ...offer,
                    image: offer.image || DEFAULT_IMAGE,
                }));
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch special offers:', err);
            return [];
        }
    }

    /**
     * Fetch a single special offer by ID
     * - Can be used by public endpoints to display detailed offer information
     * @param id - Special offer ID to fetch
     * @returns Promise<SpecialOffer | null> - Offer details or null on failure
     */
    async getById(id: number): Promise<SpecialOffer | null> {
        try {
            const response = await fetch(`/api/special-offers/${id}`);
            if (response.ok) {
                const offer = await response.json();
                return {
                    ...offer,
                    image: offer.image || DEFAULT_IMAGE,
                };
            }
            return null;
        } catch (err) {
            console.error('Failed to fetch special offer:', err);
            return null;
        }
    }

    /**
     * Create a new special offer via API
     * - Requires authentication (admin only)
     * - Uses POST method
     * @param data - Offer data to create (airline, from, destinations, price, description, image)
     * @returns Promise<SpecialOffer | null> - Created offer or null on failure
     */
    async create(data: Omit<SpecialOffer, 'id' | 'created_at' | 'updated_at'>): Promise<SpecialOffer | null> {
        try {
            const response = await apiFetch('/api/special-offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const offer = await response.json();
                return {
                    ...offer,
                    image: offer.image || DEFAULT_IMAGE,
                };
            }
            return null;
        } catch (err) {
            console.error('Failed to create special offer:', err);
            return null;
        }
    }

    /**
     * Update an existing special offer via API
     * - Requires authentication (admin only)
     * - Uses PUT method
     * @param id - Special offer ID to update
     * @param data - Updated offer data (any fields can be updated)
     * @returns Promise<SpecialOffer | null> - Updated offer or null on failure
     */
    async update(id: number, data: Partial<SpecialOffer>): Promise<SpecialOffer | null> {
        try {
            const response = await apiFetch(`/api/special-offers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const offer = await response.json();
                return {
                    ...offer,
                    image: offer.image || DEFAULT_IMAGE,
                };
            }
            return null;
        } catch (err) {
            console.error('Failed to update special offer:', err);
            return null;
        }
    }

    /**
     * Delete a special offer via API
     * - Requires authentication (admin only)
     * - Uses DELETE method
     * @param id - Special offer ID to delete
     * @returns Promise<boolean> - True if deletion successful, false otherwise
     */
    async delete(id: number): Promise<boolean> {
        try {
            const response = await apiFetch(`/api/special-offers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                console.error('Delete failed with status:', response.status, error);
            }
            return response.ok;
        } catch (err) {
            console.error('Failed to delete special offer:', err);
            return false;
        }
    }
}

export const specialOfferService = new SpecialOfferService();

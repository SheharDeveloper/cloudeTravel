// Special Offer API Service
const API_BASE_URL = '/api/special-offers';

interface SpecialOfferData {
    id: number;
    uid: string;
    name: string;
    type: string;
    description: string;
    sub_description: string;
    total_price: number;
    rating: number;
    is_active: boolean;
    is_featured: boolean;
    images?: any[];
    flight_origin?: string;
    flight_destination?: string;
    flight_name?: string;
    hotel_country?: string;
    hotel_city?: string;
    hotel_name?: string;
    hotel_star_rating?: number;
    visa_destination_country?: string;
    visa_passport_country?: string;
    visa_name?: string;
    transport_origin?: string;
    transport_destination?: string;
    transport_name?: string;
    transport_type?: string;
    duration_days?: number;
    duration_nights?: number;
}

export const specialOfferService = {
    // Fetch all special offers
    async getAllOffers(page: number = 1): Promise<{ offers: SpecialOfferData[], pagination: any }> {
        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&per_page=50`);
            if (!response.ok) throw new Error('Failed to fetch special offers');

            const data = await response.json();
            return {
                offers: data.offers || [],
                pagination: data.pagination || {}
            };
        } catch (error) {
            console.error('Error fetching special offers:', error);
            return { offers: [], pagination: {} };
        }
    },

    // Get featured special offers
    async getFeaturedOffers(page: number = 1): Promise<SpecialOfferData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}?featured=true&page=${page}&per_page=50`);
            if (!response.ok) throw new Error('Failed to fetch featured offers');

            const data = await response.json();
            return data.offers || [];
        } catch (error) {
            console.error('Error fetching featured offers:', error);
            return [];
        }
    },

    // Get offers by type
    async getOffersByType(type: string, page: number = 1): Promise<SpecialOfferData[]> {
        try {
            const response = await fetch(`${API_BASE_URL}?type=${encodeURIComponent(type)}&page=${page}&per_page=50`);
            if (!response.ok) throw new Error('Failed to fetch offers by type');

            const data = await response.json();
            return data.offers || [];
        } catch (error) {
            console.error('Error fetching offers by type:', error);
            return [];
        }
    },

    // Search offers by name
    async searchOffers(query: string, page: number = 1): Promise<SpecialOfferData[]> {
        if (!query.trim()) {
            const result = await this.getAllOffers(page);
            return result.offers;
        }

        try {
            const response = await fetch(`${API_BASE_URL}?search=${encodeURIComponent(query)}&page=${page}&per_page=50`);
            if (!response.ok) return [];

            const data = await response.json();
            return data.offers || [];
        } catch (error) {
            console.error('Error searching offers:', error);
            return [];
        }
    },

    // Get single offer by UID
    async getOfferByUid(uid: string): Promise<SpecialOfferData | null> {
        try {
            const response = await fetch(`${API_BASE_URL}-detail/${uid}`);
            if (!response.ok) return null;

            const data = await response.json();
            return data || null;
        } catch (error) {
            console.error('Error fetching offer:', error);
            return null;
        }
    }
};

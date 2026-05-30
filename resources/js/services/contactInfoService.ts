// Service for managing company contact information
// All API calls are handled here with proper authentication and error handling

import { apiFetch } from '@/lib/api';

// Contact info interface matching the database schema
export interface ContactInfo {
    id?: number;
    email?: string; // Company email address
    phone?: string; // Company phone number
    location?: string; // City/location name
    address?: string; // Full street address
    facebook_url?: string; // Facebook profile URL
    instagram_url?: string; // Instagram profile URL
    twitter_url?: string; // Twitter profile URL
    linkedin_url?: string; // LinkedIn profile URL
    about_text?: string; // Company description/about text
    logo?: string; // Company logo image URL
    get_in_touch_image?: string; // Call-to-action section image URL
    created_at?: string;
    updated_at?: string;
}

// Default fallback contact information
const DEFAULT_CONTACT: ContactInfo = {
    email: 'info@cloudtravel.com',
    phone: '+1 (555) 123-4567',
    location: 'London, United Kingdom',
    address: '123 Travel Street, London, UK',
    about_text: 'CloudTravel is your premier travel companion, offering seamless booking solutions for flights, hotels, visas, and unforgettable travel experiences.',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    logo: '',
    get_in_touch_image: '',
};

// Service class for contact information operations
class ContactInfoService {
    /**
     * Fetch contact information from the API
     * - Used by frontend to display contact details in footer and contact page
     * - Returns single record from database with default fallback
     * @returns Promise<ContactInfo> - Contact information object
     */
    async get(): Promise<ContactInfo> {
        try {
            const response = await fetch('/api/contact-info');
            if (response.ok) {
                const data = await response.json();
                return data || DEFAULT_CONTACT;
            }
            return DEFAULT_CONTACT;
        } catch (err) {
            console.error('Failed to fetch contact info:', err);
            return DEFAULT_CONTACT;
        }
    }

    /**
     * Update contact information via API
     * - Requires authentication (admin only)
     * - Uses PUT method
     * - Updates single record in database (only one contact info record exists)
     * - Supports both FormData (with file uploads) and regular JSON
     * @param data - Updated contact information data (FormData or object)
     * @returns Promise<ContactInfo | null> - Updated contact info or null on failure
     */
    async update(data: any): Promise<ContactInfo | null> {
        try {
            const options: RequestInit = {
                method: 'PUT',
            };

            if (data instanceof FormData) {
                options.body = data;
            } else {
                options.headers = {
                    'Content-Type': 'application/json',
                };
                options.body = JSON.stringify(data);
            }

            const response = await apiFetch('/api/contact-info', options);

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Failed to update contact info:', err);
            return null;
        }
    }
}

export const contactInfoService = new ContactInfoService();

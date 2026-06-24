import { apiFetch } from '@/lib/api';

// Visa data interface
export interface Visa {
    id: number;
    name: string;
    title: string;
    image?: string;
    description?: string;
    status: number;
    is_featured: boolean;
    created_at: string;
}

// Form data interface
export interface VisaFormData {
    name: string;
    title: string;
    description: string;
    image: File | null;
    status: number;
    is_featured: boolean;
}

/**
 * Visa Service - Handles all API calls and business logic for visa management
 */

/**
 * FETCH ALL VISAS - Get list of all visas from API
 * @returns Promise with visa array
 */
export const fetchAllVisas = async (): Promise<Visa[]> => {
    try {
        const response = await apiFetch('/api/visas', { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            return data.data || data || [];
        }
        throw new Error('Failed to fetch visas');
    } catch (error) {
        console.error('Error fetching visas:', error);
        throw error;
    }
};

/**
 * FETCH FEATURED VISAS - Get only featured visas from API
 * @returns Promise with featured visa array
 */
export const fetchFeaturedVisas = async (): Promise<Visa[]> => {
    try {
        const response = await apiFetch('/api/visas', { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            const visas = data.data || data || [];
            return visas.filter((visa: Visa) => visa.is_featured === true && (visa.status === 1 || visa.status === true));
        }
        throw new Error('Failed to fetch featured visas');
    } catch (error) {
        console.error('Error fetching featured visas:', error);
        throw error;
    }
};

/**
 * FETCH SINGLE VISA - Get visa details by ID
 * @param id - Visa ID
 * @returns Promise with visa data
 */
export const fetchVisaById = async (id: number): Promise<Visa> => {
    try {
        const response = await apiFetch(`/api/visas/${id}`, { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            return data.data || data;
        }
        throw new Error('Failed to fetch visa');
    } catch (error) {
        console.error('Error fetching visa:', error);
        throw error;
    }
};

/**
 * CREATE VISA - Add new visa with form data
 * @param formData - Visa form data including name, title, description, image, status
 * @returns Promise with response
 */
export const createVisa = async (formData: VisaFormData): Promise<Response> => {
    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('status', String(formData.status));
        data.append('is_featured', String(formData.is_featured ? 1 : 0));

        const response = await apiFetch('/api/visas', {
            method: 'POST',
            body: data,
        });

        return response;
    } catch (error) {
        console.error('Error creating visa:', error);
        throw error;
    }
};

/**
 * UPDATE VISA - Update existing visa with new data
 * @param id - Visa ID
 * @param formData - Updated visa form data
 * @returns Promise with response
 */
export const updateVisa = async (id: number, formData: VisaFormData): Promise<Response> => {
    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('status', String(formData.status));
        data.append('is_featured', String(formData.is_featured ? 1 : 0));

        const response = await apiFetch(`/api/visas/${id}`, {
            method: 'PUT',
            body: data,
        });

        return response;
    } catch (error) {
        console.error('Error updating visa:', error);
        throw error;
    }
};

/**
 * DELETE VISA - Remove visa from database
 * @param id - Visa ID to delete
 * @returns Promise with response
 */
export const deleteVisa = async (id: number): Promise<Response> => {
    try {
        const response = await apiFetch(`/api/visas/${id}`, {
            method: 'DELETE',
        });

        return response;
    } catch (error) {
        console.error('Error deleting visa:', error);
        throw error;
    }
};

/**
 * TOGGLE VISA STATUS - Change active/inactive status
 * @param id - Visa ID
 * @param newStatus - New status value (0 or 1)
 * @returns Promise with response
 */
export const toggleVisaStatus = async (id: number, newStatus: number): Promise<Response> => {
    try {
        const response = await apiFetch(`/api/visas/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                status: newStatus,
            }),
        });

        return response;
    } catch (error) {
        console.error('Error updating visa status:', error);
        throw error;
    }
};

/**
 * VALIDATE FORM - Check if all required fields are filled
 * @param formData - Form data to validate
 * @param isCreate - Whether this is a create form (requires image) or edit (optional image)
 * @returns Object with validation errors
 */
export const validateVisaForm = (formData: VisaFormData, isCreate: boolean = false): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
        errors.name = 'Visa name is required';
    }
    if (!formData.title.trim()) {
        errors.title = 'Title is required';
    }
    if (isCreate && !formData.image) {
        errors.image = 'Image is required for new visa';
    }

    return errors;
};

/**
 * FORMAT DATE - Convert date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
};

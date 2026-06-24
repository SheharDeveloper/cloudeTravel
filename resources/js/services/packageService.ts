import { apiFetch } from '@/lib/api';

// Package data interface
export interface Package {
    id: number;
    name: string;
    title: string;
    image?: string;
    description?: string;
    price: number;
    currency: string;
    origin_country?: string;
    destination_country: string;
    hotel_name?: string;
    hotel_stars: number;
    duration_days: number;
    travel_export_included: boolean;
    visa_service_included: boolean;
    status: number;
    is_featured: boolean;
    created_at: string;
}

// Form data interface
export interface PackageFormData {
    name: string;
    title: string;
    description: string;
    image: File | null;
    price: string;
    currency: string;
    origin_country: string;
    destination_country: string;
    hotel_name: string;
    hotel_stars: number;
    duration_days: number;
    travel_export_included: boolean;
    visa_service_included: boolean;
    status: number;
    is_featured: boolean;
}

/**
 * FETCH ALL PACKAGES - Get list of all packages from API
 */
export const fetchAllPackages = async (): Promise<Package[]> => {
    try {
        const response = await apiFetch('/api/packages', { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            return data.data || data || [];
        }
        throw new Error('Failed to fetch packages');
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};

/**
 * FETCH FEATURED PACKAGES - Get only featured and active packages
 */
export const fetchFeaturedPackages = async (): Promise<Package[]> => {
    try {
        const response = await apiFetch('/api/packages', { method: 'GET' });
        if (response.ok) {
            const data = await response.json();
            const packages = data.data || data || [];
            return packages.filter((pkg: Package) => pkg.is_featured === true && (pkg.status === 1 || pkg.status === true));
        }
        throw new Error('Failed to fetch featured packages');
    } catch (error) {
        console.error('Error fetching featured packages:', error);
        throw error;
    }
};

/**
 * CREATE PACKAGE - Add new package with form data
 */
export const createPackage = async (formData: PackageFormData): Promise<Response> => {
    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('price', formData.price);
        data.append('currency', formData.currency);
        data.append('origin_country', formData.origin_country);
        data.append('destination_country', formData.destination_country);
        data.append('hotel_name', formData.hotel_name);
        data.append('hotel_stars', String(formData.hotel_stars));
        data.append('duration_days', String(formData.duration_days));
        data.append('travel_export_included', String(formData.travel_export_included ? 1 : 0));
        data.append('visa_service_included', String(formData.visa_service_included ? 1 : 0));
        data.append('status', String(formData.status));
        data.append('is_featured', String(formData.is_featured ? 1 : 0));

        const response = await apiFetch('/api/packages', {
            method: 'POST',
            body: data,
        });

        return response;
    } catch (error) {
        console.error('Error creating package:', error);
        throw error;
    }
};

/**
 * UPDATE PACKAGE - Update existing package with new data
 */
export const updatePackage = async (id: number, formData: PackageFormData): Promise<Response> => {
    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('price', formData.price);
        data.append('currency', formData.currency);
        data.append('origin_country', formData.origin_country);
        data.append('destination_country', formData.destination_country);
        data.append('hotel_name', formData.hotel_name);
        data.append('hotel_stars', String(formData.hotel_stars));
        data.append('duration_days', String(formData.duration_days));
        data.append('travel_export_included', String(formData.travel_export_included ? 1 : 0));
        data.append('visa_service_included', String(formData.visa_service_included ? 1 : 0));
        data.append('status', String(formData.status));
        data.append('is_featured', String(formData.is_featured ? 1 : 0));

        const response = await apiFetch(`/api/packages/${id}`, {
            method: 'PUT',
            body: data,
        });

        return response;
    } catch (error) {
        console.error('Error updating package:', error);
        throw error;
    }
};

/**
 * DELETE PACKAGE - Remove package from database
 */
export const deletePackage = async (id: number): Promise<Response> => {
    try {
        const response = await apiFetch(`/api/packages/${id}`, {
            method: 'DELETE',
        });

        return response;
    } catch (error) {
        console.error('Error deleting package:', error);
        throw error;
    }
};

/**
 * VALIDATE FORM - Check if all required fields are filled
 */
export const validatePackageForm = (formData: PackageFormData, isCreate: boolean = false): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
        errors.name = 'Package name is required';
    }
    if (!formData.title.trim()) {
        errors.title = 'Title is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
        errors.price = 'Valid price is required';
    }
    if (!formData.destination_country.trim()) {
        errors.destination_country = 'Destination country is required';
    }

    return errors;
};

/**
 * FORMAT DATE - Convert date string to readable format
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
};

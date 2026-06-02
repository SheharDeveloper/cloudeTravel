import { apiFetch } from '@/lib/api';

/**
 * Tour Service - Handles all API calls for tour management
 * Provides methods for CRUD operations on tours with their related data
 */

interface TourFormData {
  basic: {
    tourTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    shortDescription: string;
    fullDescription: string;
    country: string;
    city: string;
    duration: string;
    startDate: string;
    endDate: string;
    bookingPrice: string;
    featuredImage: File | null;
    bannerImage: File | null;
    status: 'active' | 'inactive' | 'draft';
  };
  highlights: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    sortOrder: number;
  }>;
  itineraries: Array<{
    id: string;
    dayNumber: number;
    date: string;
    title: string;
    location: string;
    description: string;
    image: File | null;
  }>;
  destinations: Array<{
    id: string;
    destinationName: string;
    location: string;
    description: string;
    image: File | null;
    sortOrder: number;
  }>;
  termsConditions: {
    packageIncludes: string;
    packageExcludes: string;
  };
}

/**
 * Create a new tour with all related data
 * Converts form data to FormData format and sends to API
 *
 * @param formData - Complete tour form data
 * @returns Promise with API response
 */
export const createTour = async (formData: TourFormData) => {
  const form = new FormData();

  // Append basic tour information
  form.append('tour_title', formData.basic.tourTitle);
  form.append('hero_title', formData.basic.heroTitle);
  form.append('hero_subtitle', formData.basic.heroSubtitle);
  form.append('short_description', formData.basic.shortDescription);
  form.append('country', formData.basic.country);
  form.append('city', formData.basic.city);
  form.append('duration_days', String(formData.basic.duration));
  form.append('start_date', formData.basic.startDate);
  form.append('end_date', formData.basic.endDate);
  form.append('early_booking_price_text', formData.basic.bookingPrice);
  form.append('status', formData.basic.status);

  // Append featured image if provided
  if (formData.basic.featuredImage) {
    form.append('feature_image', formData.basic.featuredImage);
  }

  // Append banner images if provided
  if (formData.basic.bannerImage) {
    form.append('banner_images[]', formData.basic.bannerImage);
  }

  // Append highlights array
  formData.highlights.forEach((highlight, index) => {
    form.append(`highlights[${index}][title]`, highlight.title);
    form.append(`highlights[${index}][description]`, highlight.description);
    form.append(`highlights[${index}][short_order]`, highlight.sortOrder.toString());
  });

  // Append itineraries array with images
  formData.itineraries.forEach((itinerary, index) => {
    form.append(`itineraries[${index}][day]`, itinerary.dayNumber.toString());
    form.append(`itineraries[${index}][date]`, itinerary.date);
    form.append(`itineraries[${index}][title]`, itinerary.title);
    form.append(`itineraries[${index}][location]`, itinerary.location);
    form.append(`itineraries[${index}][description]`, itinerary.description);

    if (itinerary.image) {
      form.append(`itineraries[${index}][image]`, itinerary.image);
    }
  });

  // Append key destinations array
  formData.destinations.forEach((destination, index) => {
    form.append(`key_destinations[${index}][destination_name]`, destination.destinationName);
    form.append(`key_destinations[${index}][location]`, destination.location);
    form.append(`key_destinations[${index}][description]`, destination.description);
  });

  // Append terms and conditions - exactly 2 entries required by API
  form.append('terms_conditions[0][type]', 'package_includes');
  form.append('terms_conditions[0][policy]', formData.termsConditions.packageIncludes);
  form.append('terms_conditions[1][type]', 'package_does_not_include');
  form.append('terms_conditions[1][policy]', formData.termsConditions.packageExcludes);

  // Make POST request to create tour
  const response = await apiFetch('/api/tours', {
    method: 'POST',
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create tour');
  }

  return data;
};

/**
 * Update an existing tour with all related data
 * Sends updated form data to API
 *
 * @param tourId - ID of the tour to update
 * @param formData - Updated tour form data
 * @returns Promise with API response
 */
export const updateTour = async (tourId: number, formData: TourFormData) => {
  const form = new FormData();

  // Append basic tour information
  form.append('tour_title', formData.basic.tourTitle);
  form.append('hero_title', formData.basic.heroTitle);
  form.append('hero_subtitle', formData.basic.heroSubtitle);
  form.append('short_description', formData.basic.shortDescription);
  form.append('country', formData.basic.country);
  form.append('city', formData.basic.city);
  form.append('duration_days', String(formData.basic.duration));
  form.append('start_date', formData.basic.startDate);
  form.append('end_date', formData.basic.endDate);
  form.append('early_booking_price_text', formData.basic.bookingPrice);
  form.append('status', formData.basic.status);

  // Append featured image if provided
  if (formData.basic.featuredImage) {
    form.append('feature_image', formData.basic.featuredImage);
  }

  // Append banner images if provided
  if (formData.basic.bannerImage) {
    form.append('banner_images[]', formData.basic.bannerImage);
  }

  // Append highlights array
  formData.highlights.forEach((highlight, index) => {
    form.append(`highlights[${index}][title]`, highlight.title);
    form.append(`highlights[${index}][description]`, highlight.description);
    form.append(`highlights[${index}][short_order]`, highlight.sortOrder.toString());
  });

  // Append itineraries array with images
  formData.itineraries.forEach((itinerary, index) => {
    form.append(`itineraries[${index}][day]`, itinerary.dayNumber.toString());
    form.append(`itineraries[${index}][date]`, itinerary.date);
    form.append(`itineraries[${index}][title]`, itinerary.title);
    form.append(`itineraries[${index}][location]`, itinerary.location);
    form.append(`itineraries[${index}][description]`, itinerary.description);

    if (itinerary.image) {
      form.append(`itineraries[${index}][image]`, itinerary.image);
    }
  });

  // Append key destinations array
  formData.destinations.forEach((destination, index) => {
    form.append(`key_destinations[${index}][destination_name]`, destination.destinationName);
    form.append(`key_destinations[${index}][location]`, destination.location);
    form.append(`key_destinations[${index}][description]`, destination.description);
  });

  // Append terms and conditions - exactly 2 entries required by API
  form.append('terms_conditions[0][type]', 'package_includes');
  form.append('terms_conditions[0][policy]', formData.termsConditions.packageIncludes);
  form.append('terms_conditions[1][type]', 'package_does_not_include');
  form.append('terms_conditions[1][policy]', formData.termsConditions.packageExcludes);

  // Make PATCH request to update tour
  const response = await apiFetch(`/api/tours/${tourId}`, {
    method: 'PATCH',
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update tour');
  }

  return data;
};

/**
 * Fetch all tours with optional filtering and pagination
 *
 * @param page - Page number (default: 1)
 * @param perPage - Records per page (default: 15)
 * @param status - Filter by status (active, inactive, draft)
 * @param search - Search term for title, country, or city
 * @returns Promise with paginated tours data
 */
export const getTours = async (
  page: number = 1,
  perPage: number = 15,
  status?: string,
  search?: string,
  featured?: boolean
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (status) {
    params.append('status', status);
  }

  if (search) {
    params.append('search', search);
  }

  if (featured !== undefined) {
    params.append('featured', featured ? '1' : '0');
  }

  const response = await apiFetch(`/api/tours?${params.toString()}`, {
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tours');
  }

  return data;
};

/**
 * Fetch a single tour with all related data
 *
 * @param tourId - ID of the tour to fetch
 * @returns Promise with tour data including highlights, itineraries, destinations, and T&Cs
 */
export const getTour = async (tourId: number) => {
  const response = await apiFetch(`/api/tours/${tourId}`, {
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tour');
  }

  return data;
};

/**
 * Delete a tour and all related data
 *
 * @param tourId - ID of the tour to delete
 * @returns Promise with API response
 */
export const deleteTour = async (tourId: number) => {
  const response = await apiFetch(`/api/tours/${tourId}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete tour');
  }

  return data;
};

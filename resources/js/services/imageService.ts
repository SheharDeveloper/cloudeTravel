/**
 * Image Service - Handles image paths, validation, and fallbacks
 */

const DEFAULT_FALLBACK_IMAGE = '/images/noimages-flight.png';
const VISA_FALLBACK_IMAGE = '/images/noimages-visa.png';
const PACKAGE_FALLBACK_IMAGE = '/images/noimages-pacakage.png';
const HOTEL_FALLBACK_IMAGE = '/images/noimages-hotel.png';
const FALLBACK_PROFILE_IMAGE = '/images/noimages-flight.png';

export const imageService = {
    /**
     * Get the public path for an image
     * @param folderPath - e.g., 'tours/1' or 'testimonials'
     * @param imageName - e.g., 'image.jpg'
     * @returns Full public image path
     */
    getImagePath(folderPath: string, imageName: string): string {
        if (!folderPath || !imageName) {
            return DEFAULT_FALLBACK_IMAGE;
        }
        return `/storage/${folderPath}/${imageName}`;
    },

    /**
     * Get fallback image for different types
     * @param type - 'profile' | 'visa' | 'package' | 'hotel' | 'gallery' | 'default'
     * @returns Fallback image URL
     */
    getFallbackImage(type: 'profile' | 'visa' | 'package' | 'hotel' | 'gallery' | 'default' = 'default'): string {
        switch (type) {
            case 'profile':
                return FALLBACK_PROFILE_IMAGE;
            case 'visa':
                return VISA_FALLBACK_IMAGE;
            case 'package':
                return PACKAGE_FALLBACK_IMAGE;
            case 'hotel':
                return HOTEL_FALLBACK_IMAGE;
            case 'gallery':
                return DEFAULT_FALLBACK_IMAGE;
            default:
                return DEFAULT_FALLBACK_IMAGE;
        }
    },

    /**
     * Validate if image source is a valid URL or data URI
     * @param src - Image source
     * @returns true if valid
     */
    isValidImageSource(src: string): boolean {
        if (!src) return false;
        return src.startsWith('http') || src.startsWith('data:') || src.startsWith('/');
    },

    /**
     * Check if image exists by attempting to load it
     * @param src - Image source
     * @returns Promise<boolean>
     */
    async imageExists(src: string): Promise<boolean> {
        if (!this.isValidImageSource(src)) {
            return false;
        }

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    },

    /**
     * Get safe image URL with fallback
     * @param src - Primary image source
     * @param fallback - Fallback image source (optional)
     * @returns Safe image URL
     */
    getSafeImageUrl(src: string, fallback: string = DEFAULT_FALLBACK_IMAGE): string {
        return this.isValidImageSource(src) ? src : fallback;
    },
};

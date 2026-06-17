/**
 * Image Service - Handles image paths, validation, and fallbacks
 */

const DEFAULT_FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext x="200" y="150" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';

const FALLBACK_PROFILE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Ccircle cx="40" cy="40" r="40" fill="%23f0f0f0"/%3E%3Ctext x="40" y="45" font-size="32" fill="%23999" text-anchor="middle"%3E%3F%3C/text%3E%3C/svg%3E';

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
     * @param type - 'profile' | 'gallery' | 'default'
     * @returns SVG fallback image data URL
     */
    getFallbackImage(type: 'profile' | 'gallery' | 'default' = 'default'): string {
        switch (type) {
            case 'profile':
                return FALLBACK_PROFILE_IMAGE;
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

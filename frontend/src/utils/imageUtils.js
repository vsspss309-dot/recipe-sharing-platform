/**
 * Resolves a recipe image value to a proper displayable URL or null.
 * Handles:
 *  - Full Cloudinary URLs (https://...)
 *  - Local backend paths (/uploads/...)
 *  - Emoji strings (single unicode emoji) -> returns null (render as text)
 *  - Empty strings -> returns null
 */
const BACKEND_URL = "http://localhost:5000";

export const resolveImageUrl = (image) => {
    if (!image) return null;
    
    // Full URL (Cloudinary or other remote)
    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }
    
    // Local backend static path
    if (image.startsWith("/uploads/")) {
        return `${BACKEND_URL}${image}`;
    }
    
    // Data URL
    if (image.startsWith("data:")) {
        return image;
    }
    
    // Otherwise it's an emoji or non-image string -> not an image
    return null;
};

/**
 * Check if an image string value is a displayable image (vs an emoji placeholder)
 */
export const isImageUrl = (image) => {
    return resolveImageUrl(image) !== null;
};

export default resolveImageUrl;

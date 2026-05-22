/**
 * Converts a string into a URL-friendly slug.
 * @param {string} str 
 * @returns {string}
 */
export const slugify = (str) => {
    return (str || '')
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Generates an SEO-friendly URL slug for a product.
 * Format: slugified-product-name-id
 * @param {Object} product 
 * @returns {string}
 */
export const getProductUrl = (product) => {
    if (!product || !product.id) return '#';
    const nameSlug = slugify(product.name);
    return `/product/${nameSlug}-${product.id}`;
};

/**
 * Extracts the product ID from an SEO-friendly URL slug.
 * @param {string} slug 
 * @returns {string|null}
 */
export const extractProductIdFromSlug = (slug) => {
    if (!slug) return null;
    
    // If it's a numeric ID (old format)
    if (!isNaN(slug)) return slug;
    
    // Check if it ends with a UUID (Supabase/Firebase IDs)
    const uuidMatch = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    if (uuidMatch) {
        return uuidMatch[1];
    }
    
    // Fallback for non-UUID string IDs
    const parts = slug.split('-');
    const id = parts[parts.length - 1];
    
    return id || slug; // fallback to slug if extraction fails
};

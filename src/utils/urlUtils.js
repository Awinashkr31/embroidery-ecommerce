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
 * Format: purely human readable (no UUID)
 * @param {Object} product 
 * @returns {string}
 */
export const getProductUrl = (product) => {
    if (!product) return '#';
    const slug = product.clothing_information?.slug || slugify(product.name);
    return `/product/${slug}`;
};

/**
 * Legacy UUID extraction - kept for backwards compatibility if a user visits an old URL
 * @param {string} slug 
 * @returns {string|null}
 */
export const extractProductIdFromSlug = (slug) => {
    if (!slug) return null;
    const parts = slug.split('-');
    if (parts.length > 1) {
        const potentialId = parts.slice(-5).join('-');
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(potentialId)) {
            return potentialId;
        }
    }
    return null;
};

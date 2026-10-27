import { sanitizeProductName } from './productSanitizer';

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
 * Generates the canonical URL for a product: /product/<slug>-<uuid>
 * Aligns sitemap, internal links, and social crawlers on a single canonical format.
 * @param {Object} product 
 * @returns {string}
 */
export const getProductUrl = (product) => {
    if (!product) return '#';
    const cleanName = sanitizeProductName(product.name);
    const slug = product.clothing_information?.slug || slugify(cleanName);
    return `/product/${slug}-${product.id}`;
};

/**
 * UUID extraction from slug.
 * Supports /product/<slug>-<uuid>, /product/<uuid>, or trailing UUID.
 * @param {string} slug 
 * @returns {string|null}
 */
export const extractProductIdFromSlug = (slug) => {
    if (!slug) return null;
    const match = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    if (match) return match[1];

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

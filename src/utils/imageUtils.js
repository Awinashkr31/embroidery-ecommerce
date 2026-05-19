/**
 * Optimizes remote image URLs via wsrv.nl proxy.
 * Supports Supabase, Unsplash, and any public image URL.
 * 
 * @param {string} url - The original image URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {number} options.quality - Image quality (0-100), default 80
 * @param {string} options.format - 'origin' | 'webp' | 'avif', default 'webp'
 */
export const getOptimizedImageUrl = (url, { width, height, quality, format = 'webp' } = {}) => {
    if (!url) return '';

    // Skip data URIs, blob URIs, and local paths
    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;

    try {
        // Use wsrv.nl proxy for all remote images (Supabase, Unsplash, etc.)
        const proxyUrl = new URL('https://wsrv.nl/');
        proxyUrl.searchParams.set('url', url);
        
        if (width) proxyUrl.searchParams.set('w', String(width));
        if (height) proxyUrl.searchParams.set('h', String(height));
        if (quality) proxyUrl.searchParams.set('q', String(quality));
        if (format !== 'origin') {
             proxyUrl.searchParams.set('output', format);
        }

        return proxyUrl.toString();
    } catch {
        return url;
    }
};

/**
 * Get AVIF version of an optimized image URL.
 * ⚠️  NOTE: wsrv.nl does NOT support AVIF output (returns 400).
 *    Only use this for local static assets that have pre-generated .avif files.
 *    For dynamic/remote images, use getOptimizedImageUrl with WebP (default).
 * @param {string} url - Base image URL
 * @param {object} options - Same as getOptimizedImageUrl
 * @returns {string} AVIF-optimized URL (empty string for remote URLs)
 */
export const getAvifImageUrl = (url, options = {}) => {
    // wsrv.nl doesn't support AVIF, so only return for local files
    if (url && (url.startsWith('/') || url.startsWith('data:'))) {
        return url.replace(/\.(png|jpg|jpeg)$/i, '.avif');
    }
    return ''; // Return empty — caller should not use this as <source>
};

/**
 * Generate a responsive srcSet string for remote images.
 * @param {string} url - Base image URL
 * @param {number[]} widths - Array of widths to generate, e.g. [300, 600, 900]
 * @param {number} quality - Image quality
 * @returns {string} srcSet attribute value
 */
export const getResponsiveSrcSet = (url, widths = [300, 600, 900, 1200], quality = 75) => {
    if (!url) return '';
    // Skip local paths
    if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) return '';
    return widths
        .map(w => `${getOptimizedImageUrl(url, { width: w, quality })} ${w}w`)
        .join(', ');
};

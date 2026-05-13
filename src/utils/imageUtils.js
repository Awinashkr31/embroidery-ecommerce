/**
 * Optimizes Supabase Storage URLs by appending transformation parameters.
 * Note: Image Transformations are a Pro plan feature on Supabase.
 * If on Free tier, these parameters might be ignored but won't break the URL.
 * 
 * @param {string} url - The original image URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {number} options.quality - Image quality (0-100), default 80
 * @param {string} options.format - 'origin' | 'webp' | 'avif', default 'origin'
 */
export const getOptimizedImageUrl = (url, { width, height, quality, format = 'webp' } = {}) => {
    if (!url) return '';
    if (!url.includes('supabase.co')) return url; // Only optimize Supabase URLs

    try {
        // Use wsrv.nl proxy to enforce image resizing on Free Tier
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
 * Generate a responsive srcSet string for Supabase images.
 * @param {string} url - Base image URL
 * @param {number[]} widths - Array of widths to generate, e.g. [300, 600, 900]
 * @param {number} quality - Image quality
 * @returns {string} srcSet attribute value
 */
export const getResponsiveSrcSet = (url, widths = [300, 600, 900, 1200], quality = 80) => {
    if (!url || !url.includes('supabase.co')) return '';
    return widths
        .map(w => `${getOptimizedImageUrl(url, { width: w, quality })} ${w}w`)
        .join(', ');
};

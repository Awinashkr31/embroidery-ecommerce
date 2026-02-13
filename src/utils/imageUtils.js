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
 * @param {string} options.format - 'origin' | 'webp' | 'avif', default 'origin' (Supabase auto-detects usually)
 */
export const getOptimizedImageUrl = (url, { width, height, quality = 80, format = 'webp' } = {}) => {
    if (!url) return '';
    if (!url.includes('supabase.co')) return url; // Only optimize Supabase URLs

    try {
        const urlObj = new URL(url);
        
        // Supabase Storage Transformation Query Params
        if (width) urlObj.searchParams.set('width', width);
        if (height) urlObj.searchParams.set('height', height);
        urlObj.searchParams.set('quality', quality);
        
        // Only set format if specifically requested, otherwise allow auto values
        if (format !== 'origin') {
             urlObj.searchParams.set('format', format);
        }

        return urlObj.toString();
    } catch {
        return url;
    }
};

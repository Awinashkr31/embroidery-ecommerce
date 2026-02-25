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
export const getOptimizedImageUrl = (url) => {
    if (!url) return '';
    
    // EMERGENCY PROXY: Route through local Vite proxy to bypass Antivirus SSL block
    if (url.includes('yqtrlqkmitgnaehbawdm.supabase.co')) {
        url = url.replace('https://yqtrlqkmitgnaehbawdm.supabase.co', window.location.origin + '/supabase-api');
    }
    
    return url; // Temporarily disabled transformations to prevent Supabase 400 errors
};


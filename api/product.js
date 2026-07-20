import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const { slug } = req.query;
    if (!slug) {
        return res.status(400).send('Missing slug');
    }

    // Extract ID (UUID at the end of the slug)
    let id = slug;
    const uuidMatch = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    if (uuidMatch) {
        id = uuidMatch[1];
    } else {
        const parts = slug.split('-');
        id = parts[parts.length - 1] || slug;
    }

    try {
        // Fetch product from Supabase
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
        
        let product = null;
        if (supabaseUrl && supabaseKey) {
            const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}&select=name,description,images`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    product = data[0];
                }
            }
        }

        // Read base index.html
        let html = '';
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        let host = req.headers['x-forwarded-host'] || req.headers.host || process.env.VERCEL_URL;
        
        // Security: Prevent SSRF by validating the host
        const ALLOWED_HOSTS = ['www.Crochet Wali.live', 'Crochet Wali.live', 'localhost:5173', process.env.VERCEL_URL];
        if (!ALLOWED_HOSTS.includes(host)) {
            host = 'www.Crochet Wali.live'; // Fallback to production safe host
        }

        try {
            // Fetch from live deployment (safest on Vercel)
            const fetchRes = await fetch(`${protocol}://${host}/index.html`);
            if (fetchRes.ok) {
                html = await fetchRes.text();
            } else {
                throw new Error("Failed to fetch index.html");
            }
        } catch (e) {
            // Fallback for local development or if fetch fails
            const distPath = path.join(process.cwd(), 'dist', 'index.html');
            const rootPath = path.join(process.cwd(), 'index.html');
            if (fs.existsSync(distPath)) {
                html = fs.readFileSync(distPath, 'utf8');
            } else if (fs.existsSync(rootPath)) {
                html = fs.readFileSync(rootPath, 'utf8');
            } else {
                return res.status(500).send('Could not locate index.html');
            }
        }

        if (product && html) {
            const title = `${product.name} | Crochet Wali`;
            const description = product.description ? product.description.substring(0, 160).replace(/"/g, '&quot;') : "Handmade Embroidery & Crochet Gifts";
            
            let imageUrl = 'https://www.Crochet Wali.live/hero-gift.png';
            if (product.images) {
                let parsedImages = product.images;
                if (typeof parsedImages === 'string') {
                    try { parsedImages = JSON.parse(parsedImages); } catch (e) { parsedImages = []; }
                }
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                    imageUrl = parsedImages[0];
                }
            }

            const productUrl = `https://www.Crochet Wali.live/product/${slug}`;

            // Replace standard tags
            html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
            html = html.replace(/<meta name="description" content=".*?">/i, `<meta name="description" content="${description}">`);
            
            // Replace Open Graph tags
            html = html.replace(/<meta property="og:title" content=".*?">/i, `<meta property="og:title" content="${title}">`);
            html = html.replace(/<meta property="og:description" content=".*?">/i, `<meta property="og:description" content="${description}">`);
            html = html.replace(/<meta property="og:image" content=".*?">/i, `<meta property="og:image" content="${imageUrl}">`);
            html = html.replace(/<meta property="og:url" content=".*?">/i, `<meta property="og:url" content="${productUrl}">`);
            html = html.replace(/<meta property="og:type" content=".*?">/i, `<meta property="og:type" content="product">`);

            // Replace Twitter Card tags
            html = html.replace(/<meta property="twitter:title" content=".*?">/i, `<meta property="twitter:title" content="${title}">`);
            html = html.replace(/<meta property="twitter:description" content=".*?">/i, `<meta property="twitter:description" content="${description}">`);
            html = html.replace(/<meta property="twitter:image" content=".*?">/i, `<meta property="twitter:image" content="${imageUrl}">`);
            html = html.replace(/<meta property="twitter:url" content=".*?">/i, `<meta property="twitter:url" content="${productUrl}">`);
        }

        // Set caching headers so Vercel edge caches this for 1 hour
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (err) {
        console.error('OG Proxy Error:', err);
        res.status(500).send('Internal Server Error');
    }
}

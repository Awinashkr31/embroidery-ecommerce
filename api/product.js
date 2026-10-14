// Minimal OG-tag injector for social crawlers (WhatsApp, Facebook, Google, Twitter).
// Social crawlers only read <head> meta tags — they never execute JS.
// So we return a lightweight HTML shell with correct OG tags + a JS redirect for real users.
// This eliminates the expensive self-fetch of index.html, saving CPU + bandwidth.

export const config = {
    maxDuration: 5, // 5s max (free plan limit is 10s) — keeps Fluid Active CPU low
};

// Hardcoded minimal HTML template — social crawlers only need the <head>
function buildOgHtml({ title, description, imageUrl, productUrl, slug }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${productUrl}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${productUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:site_name" content="Crochet Wali">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${productUrl}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${imageUrl}">
  <meta name="robots" content="noindex">
</head>
<body>
  <p>Redirecting to <a href="${productUrl}">${title}</a>...</p>
  <script>window.location.replace("/${slug.includes('/') ? slug : 'product/' + slug}");</script>
</body>
</html>`;
}

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

    // Default OG values
    let title = 'Crochet Wali | Handmade Crochet Gifts';
    let description = 'Handmade crochet flowers, gajra, hair accessories & personalized gifts — made with love, shipped across India.';
    let imageUrl = 'https://www.crochetwali.in/hero-gift.png';
    const productUrl = `https://www.crochetwali.in/product/${slug}`;

    try {
        // Fetch product from Supabase
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

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
                    const product = data[0];
                    title = `${product.name} | Crochet Wali`;
                    description = product.description
                        ? product.description.substring(0, 160).replace(/"/g, '&quot;')
                        : description;

                    if (product.images) {
                        let parsedImages = product.images;
                        if (typeof parsedImages === 'string') {
                            try { parsedImages = JSON.parse(parsedImages); } catch (e) { parsedImages = []; }
                        }
                        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                            imageUrl = parsedImages[0];
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error('Supabase fetch error:', err);
        // Continue with default OG values — don't fail the request
    }

    const html = buildOgHtml({ title, description, imageUrl, productUrl, slug });

    // Cache for 24 hours, serve stale for up to 7 days while revalidating.
    // ~36 products × 1 revalidation/day = ~36 ISR writes/day = ~1K/month (free limit: 200K)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
}

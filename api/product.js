// High-performance SEO & Social Crawler SSR handler for /product/:slug
// Delivers Schema.org Product Rich Snippets (price, stock, reviews) & indexable HTML for Googlebot and social bots.
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    maxDuration: 10,
};

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function slugify(str) {
    return (str || '')
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function extractUuid(slug) {
    if (!slug) return null;
    const match = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    return match ? match[1] : null;
}

function buildSeoHtml({ 
    title, 
    metaDescription, 
    cleanDescription, 
    images, 
    imageUrl, 
    productUrl, 
    price, 
    originalPrice, 
    hasCompareAt, 
    inStock, 
    category, 
    reviews, 
    averageRating, 
    reviewCount, 
    brand, 
    name, 
    sku 
}) {
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": name,
        "image": images && images.length > 0 ? images : [imageUrl],
        "description": cleanDescription,
        "sku": sku,
        "brand": {
            "@type": "Brand",
            "name": brand || "Crochet Wali"
        },
        "category": category,
        "offers": {
            "@type": "Offer",
            "url": productUrl,
            "priceCurrency": "INR",
            "price": String(price),
            "priceValidUntil": "2027-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Crochet Wali"
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": Number(price) >= 999 ? "0" : "50",
                    "currency": "INR"
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "IN"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 2,
                        "maxValue": 4,
                        "unitCode": "d"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 4,
                        "maxValue": 7,
                        "unitCode": "d"
                    }
                }
            },
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "IN",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
            }
        }
    };

    // ONLY attach aggregateRating and reviews if REAL approved reviews exist
    if (reviews && reviews.length > 0) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": String(averageRating),
            "reviewCount": String(reviewCount)
        };
        jsonLd.review = reviews.slice(0, 5).map(r => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": String(r.rating)
            },
            "author": {
                "@type": "Person",
                "name": r.user_name || "Customer"
            },
            "reviewBody": r.comment || ""
        }));
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <link rel="canonical" href="${escapeHtml(productUrl)}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  
  <!-- Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${escapeHtml(productUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:site_name" content="Crochet Wali">
  <meta property="product:price:amount" content="${escapeHtml(price)}">
  <meta property="product:price:currency" content="INR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(productUrl)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  
  <!-- Google Rich Snippets (Valid Schema.org Product) -->
  <script type="application/ld+json">
  ${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 24px; background: #fdfbf7; color: #1c1917;">
  <header style="border-bottom: 1px solid #e7e5e4; padding-bottom: 16px; margin-bottom: 24px;">
    <a href="https://www.crochetwali.in/" style="text-decoration: none; font-size: 24px; font-weight: bold; color: #881337;">Crochet Wali</a>
    <p style="margin: 4px 0 0; font-size: 13px; color: #78716c;">Handmade Crochet & Artisanal Keepsakes India</p>
  </header>
  <main style="max-width: 800px; margin: 0 auto;">
    <article>
      <h1 style="font-size: 28px; line-height: 1.2; color: #1c1917; margin-bottom: 10px;">${escapeHtml(name)}</h1>
      <div style="font-size: 22px; font-weight: bold; color: #881337; margin-bottom: 16px;">
        ₹${escapeHtml(price)} ${hasCompareAt ? `<span style="text-decoration: line-through; color: #78716c; font-size: 16px; margin-left: 8px;">₹${escapeHtml(originalPrice)}</span>` : ''}
        <span style="font-size: 14px; color: #15803d; margin-left: 12px; font-weight: 600;">${inStock ? '✓ In Stock • Ready to Dispatch' : 'Made to Order'}</span>
      </div>
      <p style="color: #44403c; line-height: 1.6; font-size: 16px;">${escapeHtml(cleanDescription)}</p>
      <div style="margin: 24px 0;">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" style="max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
      </div>
      <div style="background: #fff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px; font-size: 15px; color: #1c1917;">✨ Why Shop from Crochet Wali?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #57534e; font-size: 14px; line-height: 1.6;">
          <li>100% Handcrafted by skilled Indian artisans using premium yarn</li>
          <li>Free Shipping on orders above ₹999</li>
          <li>Eco-friendly forever flowers that never wilt</li>
          <li>Safe & secure payments (Razorpay, UPI, Cards)</li>
        </ul>
      </div>
      <div style="margin-top: 24px;">
        <a href="${escapeHtml(productUrl)}?ref=organic_bot" style="display: inline-block; background: #881337; color: #fff; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Shop Now on Crochet Wali →
        </a>
      </div>
    </article>
  </main>
  <script>
    // Smooth redirect for real human visitors who clicked through directly
    if (typeof window !== 'undefined' && !window.location.search.includes('nobot')) {
      window.location.replace("${escapeHtml(productUrl)}");
    }
  </script>
</body>
</html>`;
}

const TYPO_MAP = {
    'swtoberry pot': 'Strawberry Pot',
    'hair taiy': 'Hair Tie',
    'baw hairclip': 'Bow Hairclip',
    'crochet parandi': 'Crochet Parandi',
    'crochet flower hair clutcher': 'Crochet Flower Hair Clutcher',
};

const DELETED_STORAGE_URLS = new Set([
    'https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1772016571524-0mv6d.jpg',
    'https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1772016593285-5771nk.jpg',
]);

function isBrokenImageUrl(url) {
    if (!url || typeof url !== 'string') return true;
    const trimmed = url.trim();
    if (trimmed.length < 5) return true;
    if (DELETED_STORAGE_URLS.has(trimmed)) return true;
    return false;
}

function toTitleCase(str) {
    if (!str) return '';
    return str.trim().split(/\s+/).map(w => {
        if (!w) return '';
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
}

function sanitizeName(raw) {
    if (!raw) return 'Handmade Crochet Gift';
    const lower = raw.trim().toLowerCase();
    if (TYPO_MAP[lower]) return TYPO_MAP[lower];
    return toTitleCase(raw);
}

function normalizeCategory(cat) {
    if (!cat) return 'Flower Pot';
    const trimmed = String(cat).trim();
    if (trimmed.toLowerCase() === 'home decor' || trimmed.toLowerCase() === 'homedecor') {
        return 'Flower Pot';
    }
    return trimmed;
}

function getGenuineDiscount(price, rawOriginalPrice) {
    if (!rawOriginalPrice) return { originalPrice: '', hasCompareAt: false, discountPercentage: 0 };
    const orig = Number(rawOriginalPrice);
    const p = Number(price);
    if (isNaN(orig) || isNaN(p) || orig <= p) return { originalPrice: '', hasCompareAt: false, discountPercentage: 0 };
    const fraction = (orig - p) / orig;
    if (fraction <= 0.35) {
        return {
            originalPrice: String(orig),
            hasCompareAt: true,
            discountPercentage: Math.round(fraction * 100)
        };
    }
    return { originalPrice: '', hasCompareAt: false, discountPercentage: 0 };
}

export default async function handler(req, res) {
    let slug = req.query?.slug;
    if (!slug && req.url) {
        const urlMatch = req.url.match(/\/product\/([^?&#]+)/);
        if (urlMatch) slug = decodeURIComponent(urlMatch[1]);
    }

    if (!slug) {
        return res.status(400).send('Missing slug parameter');
    }

    // 301 Redirects for merged duplicates & typo slugs (Problem 4 & 5)
    // 1. Duplicate Parandi -> Canonical Parandi (₹199)
    if (slug.includes('c8817e89-bd13-4b44-80d9-e93a7dfb8ce8')) {
        return res.redirect(301, 'https://www.crochetwali.in/product/crochet-parandi-4fdb8975-eac9-4ecf-bb82-61526f2625a1');
    }
    // 2. Duplicate Sunflower Keychain -> Canonical Sunflower Keychain (₹119)
    if (slug.includes('b847a5ce-57c4-4b9b-862d-fb305a50c102')) {
        return res.redirect(301, 'https://www.crochetwali.in/product/sunflower-keychain-a3464d61-a5da-4471-93d4-b7615de02e8f');
    }
    // 3. Duplicate Gajra listings -> Canonical Wrist Gajra Bracelet (Pair) (₹349)
    if (slug.includes('b93361d2-1709-421e-b98b-443bffd21cfb') || slug.includes('e6d2aa67-4a7d-4dfb-ad09-ec1fd25f6bc2')) {
        return res.redirect(301, 'https://www.crochetwali.in/product/crochet-wrist-gajra-bracelet-pair-f6439b6e-b495-4d17-95f2-7bcd7d7fdd26');
    }
    // 4. Typo Slugs
    if (slug.includes('hair-taiy')) {
        return res.redirect(301, 'https://www.crochetwali.in/product/hair-tie-859e8646-a02c-4a3f-8de7-a040b98a8479');
    }
    if (slug.includes('baw-hairclip')) {
        return res.redirect(301, 'https://www.crochetwali.in/product/bow-hairclip-12be210d-24a1-4581-8b35-cee50a72d3b8');
    }
    if (slug.includes('swtoberry-pot')) {
        return res.redirect(301, 'https://www.crochetwali.in/product/strawberry-pot-e3404716-4ad2-4d81-9a6f-b4d0efe18451');
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    let product = null;
    let reviews = [];

    if (supabaseUrl && supabaseKey) {
        const headers = {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        };

        try {
            // 1. Try resolving by extracted UUID
            const uuid = extractUuid(slug);
            if (uuid) {
                const response = await fetch(
                    `${supabaseUrl}/rest/v1/products?id=eq.${uuid}&select=id,name,description,images,price,original_price,category,stock_quantity,clothing_information,variants,active`,
                    { headers }
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        product = data[0];
                    }
                }
            }

            // 2. If not found by UUID, resolve by slug or name matching across active products
            if (!product) {
                const response = await fetch(
                    `${supabaseUrl}/rest/v1/products?select=id,name,description,images,price,original_price,category,stock_quantity,clothing_information,variants,active&active=eq.true`,
                    { headers }
                );
                if (response.ok) {
                    const products = await response.json();
                    const targetSlug = slug.toLowerCase().trim();

                    // Match A: exact clothing_information.slug
                    product = products.find(p => p.clothing_information?.slug && p.clothing_information.slug.toLowerCase() === targetSlug);

                    // Match B: exact slugified name
                    if (!product) {
                        product = products.find(p => slugify(p.name) === targetSlug);
                    }

                    // Match C: prefix match
                    if (!product) {
                        product = products.find(p => {
                            const pSlug = slugify(p.name);
                            return pSlug && (targetSlug.startsWith(pSlug) || pSlug.startsWith(targetSlug));
                        });
                    }

                    // Match D: keywords match
                    if (!product) {
                        const keywords = targetSlug.replace(/[^a-z0-9]/g, ' ').split(' ').filter(Boolean);
                        if (keywords.length > 0) {
                            product = products.find(p => {
                                const pName = (p.name || '').toLowerCase();
                                return keywords.every(kw => pName.includes(kw));
                            });
                        }
                    }
                }
            }

            // 3. If product found, fetch real approved reviews for this product
            if (product && product.id) {
                const revRes = await fetch(
                    `${supabaseUrl}/rest/v1/reviews?product_id=eq.${product.id}&status=eq.approved&select=rating,comment,user_name`,
                    { headers }
                );
                if (revRes.ok) {
                    reviews = await revRes.json();
                }
            }
        } catch (err) {
            console.error('Supabase fetch error in /api/product:', err);
        }
    }

    // Default fallbacks if product not found in database
    const name = sanitizeName(product?.name);
    let rawPrice = product?.price !== undefined && product?.price !== null ? Number(product.price) : 149;
    
    // Unified prices for duplicate products
    if (product?.id === 'a3464d61-a5da-4471-93d4-b7615de02e8f') rawPrice = 119;
    if (product?.id === 'f6439b6e-b495-4d17-95f2-7bcd7d7fdd26') rawPrice = 349;
    if (product?.id === 'baa8e02e-b1a3-4b18-8006-f37ff660d575') rawPrice = 149;
    if (product?.id === '289ef890-cabb-42b7-be84-e06cf1545d80') rawPrice = 499;
    if (product?.id === '79f79a0c-3ede-485b-b5a9-afff84b1e459') rawPrice = 299;

    const price = String(rawPrice);
    const { originalPrice, hasCompareAt } = getGenuineDiscount(rawPrice, product?.original_price);
    const inStock = product?.stock_quantity !== undefined && product?.stock_quantity !== null 
        ? Number(product.stock_quantity) > 0 
        : true;
    const category = normalizeCategory(product?.category);

    // Canonical URL format: /product/<slug>-<uuid>
    const cleanSlug = product?.clothing_information?.slug || slugify(name);
    const canonicalSlug = product ? `${cleanSlug}-${product.id}` : slug;
    const canonicalUrl = `https://www.crochetwali.in/product/${canonicalSlug}`;

    // 301-redirect old URL formats (/product/<slug> or /product/<uuid>) to canonical format
    if (product && slug.toLowerCase() !== canonicalSlug.toLowerCase()) {
        return res.redirect(301, canonicalUrl);
    }

    const productUrl = canonicalUrl;
    const sku = String(product?.clothing_information?.sku || product?.id || slug);
    const brand = product?.clothing_information?.brand || "Crochet Wali";

    // Parse image list & fallback to variant images (Product images live ONLY in Color Variants section)
    let images = [];
    if (product?.images) {
        if (typeof product.images === 'string') {
            try { images = JSON.parse(product.images); } catch (e) { images = [product.images]; }
        } else if (Array.isArray(product.images)) {
            images = product.images;
        }
    }
    let variants = [];
    if (product?.variants) {
        if (typeof product.variants === 'string') {
            try { variants = JSON.parse(product.variants); } catch (e) { variants = []; }
        } else if (Array.isArray(product.variants)) {
            variants = product.variants;
        }
    }
    if ((!images || images.length === 0) && variants.length > 0) {
        variants.forEach(v => {
            if (v.images && Array.isArray(v.images)) {
                v.images.forEach(img => {
                    if (img && !images.includes(img) && !isBrokenImageUrl(img)) images.push(img);
                });
            }
        });
    }
    images = images.filter(img => !isBrokenImageUrl(img));
    if (!images.length && product?.image && !isBrokenImageUrl(product.image)) {
        images = [product.image];
    }
    const imageUrl = (images.length > 0 && typeof images[0] === 'string' && images[0].trim())
        ? images[0].trim()
        : 'https://www.crochetwali.in/hero-gift.png';

    // Descriptions & Titles
    const metaTitle = product?.clothing_information?.metaTitle?.trim();
    const title = (metaTitle && metaTitle.includes('₹')) ? metaTitle : `${name} (Handmade) - ₹${price} | Crochet Wali`;

    const metaDesc = product?.clothing_information?.metaDescription?.trim();
    const shortDesc = product?.clothing_information?.shortDescription?.trim();
    const rawDesc = (product?.description || '').trim();

    const cleanDescription = (metaDesc || shortDesc || rawDesc)
        ? (metaDesc || shortDesc || rawDesc).replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
        : `Buy 100% handmade ${name} online at ₹${price} in India. Handcrafted with premium yarn, fast shipping across India. Order now at Crochet Wali!`;

    const metaDescription = cleanDescription.length > 200
        ? cleanDescription.substring(0, 197) + '...'
        : cleanDescription;

    // Review calculations (only from real data)
    let averageRating = null;
    let reviewCount = 0;
    if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
        averageRating = (totalRating / reviews.length).toFixed(1);
        reviewCount = reviews.length;
    }

    const html = buildSeoHtml({
        title,
        metaDescription,
        cleanDescription,
        images,
        imageUrl,
        productUrl,
        price,
        originalPrice,
        hasCompareAt,
        inStock,
        category,
        reviews,
        averageRating,
        reviewCount,
        brand,
        name,
        sku
    });

    // Cache edge response for 24h, stale up to 7 days
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(product ? 200 : 404).send(html);
}

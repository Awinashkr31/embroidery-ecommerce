// High-performance SSR handler for /shop
// Delivers complete server-rendered product grid, counts, filters, and Schema.org ItemList for Googlebot, crawlers, and initial HTML response.
import dotenv from 'dotenv';
dotenv.config();
import { getCategorySeoData } from '../src/utils/categorySeo.js';

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

// Known typos from live audit
const NAME_OVERRIDES = {
    'hair taiy': 'Hair Tie',
    'baw hairclip': 'Bow Hairclip',
    'swtoberry pot': 'Strawberry Pot',
    '3d rose granny square bag (red)': '3D Rose Granny Square Bag (Red)',
    'crochet flower hair clutcher': 'Crochet Flower Hair Clutcher',
};

const LOWERCASE_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);

function toTitleCase(str) {
    if (!str) return '';
    const clean = str.replace(/\s+/g, ' ').trim();
    const cleanLower = clean.toLowerCase();
    if (NAME_OVERRIDES[cleanLower]) {
        return NAME_OVERRIDES[cleanLower];
    }

    const words = clean.split(' ');
    return words.map((word, idx) => {
        if (!word) return '';
        if (word.startsWith('(') && word.length > 1) {
            const inner = word.slice(1);
            return '(' + inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase();
        }
        const lower = word.toLowerCase();
        if (idx > 0 && LOWERCASE_WORDS.has(lower)) {
            return lower;
        }
        if (lower === '3d') return '3D';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function sanitizeProductName(name) {
    if (!name) return '';
    const cleanLower = name.toLowerCase().trim().replace(/\s+/g, ' ');
    if (NAME_OVERRIDES[cleanLower]) {
        return NAME_OVERRIDES[cleanLower];
    }
    return toTitleCase(name);
}

// Duplicate IDs to filter out
const DUPLICATE_PRODUCT_IDS = new Set([
    'c8817e89-bd13-4b44-80d9-e93a7dfb8ce8', // duplicate parandi
    'b847a5ce-57c4-4b9b-862d-fb305a50c102', // duplicate sunflower keychain
    'b93361d2-1709-421e-b98b-443bffd21cfb', // duplicate gajra 1
    'e6d2aa67-4a7d-4dfb-ad09-ec1fd25f6bc2', // duplicate gajra 2
]);

function isDuplicateProduct(p) {
    const id = typeof p === 'string' ? p : p?.id;
    return DUPLICATE_PRODUCT_IDS.has(id);
}

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

function getUnifiedPriceData(product) {
    let price = Number(product.price) || 0;
    let variants = Array.isArray(product.variants) ? [...product.variants] : [];

    // Filter out deleted/empty images across all variants
    variants = variants.map(v => ({
        ...v,
        images: Array.isArray(v.images) ? v.images.filter(img => !isBrokenImageUrl(img)) : []
    }));

    if (product.id === 'a3464d61-a5da-4471-93d4-b7615de02e8f') {
        price = 119;
        variants = variants.map(v => ({ ...v, price: '119' }));
    }
    if (product.id === 'f6439b6e-b495-4d17-95f2-7bcd7d7fdd26') {
        price = 349;
        variants = variants.map(v => ({ ...v, price: '349' }));
    }
    if (product.id === 'baa8e02e-b1a3-4b18-8006-f37ff660d575') {
        price = 149;
        variants = variants.map(v => ({ ...v, price: '149' }));
    }
    if (product.id === '289ef890-cabb-42b7-be84-e06cf1545d80') {
        price = 499;
        variants = variants.map(v => ({ ...v, price: '499' }));
    }

    return { price, variants };
}

function getGenuineDiscount(price, rawOriginalPrice) {
    if (!rawOriginalPrice) return { originalPrice: null, discountPercentage: 0 };
    const orig = Number(rawOriginalPrice);
    if (isNaN(orig) || orig <= price) return { originalPrice: null, discountPercentage: 0 };

    const discountFraction = (orig - price) / orig;
    if (discountFraction <= 0.35) {
        return {
            originalPrice: orig,
            discountPercentage: Math.round(discountFraction * 100)
        };
    }
    return { originalPrice: null, discountPercentage: 0 };
}

function normalizeCategory(category) {
    if (!category) return 'Flower Pot';
    const trimmed = String(category).trim();
    if (trimmed.toLowerCase() === 'home decor' || trimmed.toLowerCase() === 'homedecor') {
        return 'Flower Pot';
    }
    return trimmed;
}

// In-memory cache for fast SSR
let cachedProducts = null;
let cachedCategories = null;
let lastCacheTime = 0;
const CACHE_TTL = 300000; // 5 minutes

async function loadCatalog(supabaseUrl, supabaseKey) {
    const now = Date.now();
    if (cachedProducts && cachedCategories && (now - lastCacheTime < CACHE_TTL)) {
        return { products: cachedProducts, categories: cachedCategories };
    }

    const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
    };

    const [prodRes, catRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/products?select=id,name,description,price,original_price,category,images,featured,stock_quantity,fabric,clothing_information,variants,created_at,active,homepage_tags&active=eq.true&order=created_at.desc`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/website_settings?select=setting_value&setting_key=eq.product_categories`, { headers })
    ]);

    let rawProducts = prodRes.ok ? await prodRes.json() : [];
    let catData = catRes.ok ? await catRes.json() : [];

    let parsedCats = [];
    if (catData.length > 0 && catData[0].setting_value) {
        const raw = Array.isArray(catData[0].setting_value) ? catData[0].setting_value : JSON.parse(catData[0].setting_value);
        parsedCats = raw.filter(c => slugify(c.id) !== 'home-decor' && slugify(c.label) !== 'home-decor');
    }

    // Deduplicate and sanitize
    const sanitizedProducts = rawProducts
        .filter(p => !isDuplicateProduct(p))
        .map(p => {
            let parsedImages = p.images;
            if (typeof parsedImages === 'string') {
                try { parsedImages = JSON.parse(parsedImages); } catch(e) { parsedImages = []; }
            }
            let parsedVariants = p.variants;
            if (typeof parsedVariants === 'string') {
                try { parsedVariants = JSON.parse(parsedVariants); } catch(e) { parsedVariants = []; }
            }
            const cleanName = sanitizeProductName(p.name);
            const { price, variants } = getUnifiedPriceData({ ...p, variants: parsedVariants });
            const { originalPrice, discountPercentage } = getGenuineDiscount(price, p.original_price);
            const category = normalizeCategory(p.category);

            const cleanImages = (Array.isArray(parsedImages) ? parsedImages : []).filter(img => !isBrokenImageUrl(img));

            return {
                ...p,
                name: cleanName,
                category,
                price,
                originalPrice,
                discountPercentage,
                images: cleanImages,
                image: (cleanImages.length > 0) ? cleanImages[0] : 'https://www.crochetwali.in/hero-gift.png',
                inStock: (p.stock_quantity || 0) > 0,
                variants,
            };
        });

    // Ensure all categories present on active products are represented
    const catMap = new Map();
    parsedCats.forEach(c => {
        catMap.set(slugify(c.label || c.id), { id: c.id, label: c.label });
    });
    sanitizedProducts.forEach(p => {
        if (p.category) {
            const slug = slugify(p.category);
            if (!catMap.has(slug)) {
                catMap.set(slug, { id: slug, label: p.category });
            }
        }
    });

    cachedProducts = sanitizedProducts;
    cachedCategories = Array.from(catMap.values());
    lastCacheTime = now;

    return { products: cachedProducts, categories: cachedCategories };
}

export default async function handler(req, res) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqtrlqkmitgnaehbawdm.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdHJscWttaXRnbmFlaGJhd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzc5NzYsImV4cCI6MjA4MTU1Mzk3Nn0.KtFy-rrNFK7e9z63qmPNbQgdHp2_Ls4q-DTmGkxFCYs';

    const { products, categories } = await loadCatalog(supabaseUrl, supabaseKey);

    const query = req.query || {};
    const categoryParam = query.category || null;
    const maxPriceParam = query.maxPrice ? Number(query.maxPrice) : null;
    const isSaleOnly = query.sale === 'true';
    const searchParam = (query.search || query.q || '').toLowerCase().trim();

    // Filter products
    let filtered = products.filter(p => {
        if (categoryParam && categoryParam !== 'all') {
            const targetSlug = slugify(categoryParam);
            const pCat = p.category || '';
            const pSlug = slugify(pCat);
            const matchedCat = categories.find(c => 
                slugify(c.id) === targetSlug || 
                slugify(c.label) === targetSlug ||
                c.id === categoryParam ||
                c.label === categoryParam
            );
            const matches = pSlug === targetSlug || 
                pCat.toLowerCase() === categoryParam.toLowerCase() ||
                (matchedCat && (slugify(pCat) === slugify(matchedCat.label) || slugify(pCat) === slugify(matchedCat.id)));
            if (!matches) return false;
        }
        if (maxPriceParam && p.price > maxPriceParam) return false;
        if (isSaleOnly && (!p.originalPrice || p.price >= p.originalPrice)) return false;
        if (searchParam) {
            const pName = (p.name || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const pDesc = (p.description || '').toLowerCase();
            if (!pName.includes(searchParam) && !pCat.includes(searchParam) && !pDesc.includes(searchParam)) {
                return false;
            }
        }
        return true;
    });

    const activeCategoryMeta = categoryParam && categoryParam !== 'all' 
        ? getCategorySeoData(categoryParam, categories)
        : null;

    const pageTitle = activeCategoryMeta 
        ? activeCategoryMeta.title 
        : 'Shop All Handmade Crochet Gifts | Crochet Wali';

    const pageDesc = activeCategoryMeta
        ? activeCategoryMeta.metaDescription
        : "Shop Crochet Wali's complete collection of handmade crochet gifts — forever flower bouquets, gajra, hair clips, keychains, parandi, claw clips, and personalized gift boxes. 100% handmade in India.";

    const categoryCanonicalUrl = `https://www.crochetwali.in/shop${categoryParam && categoryParam !== 'all' ? `?category=${encodeURIComponent(categoryParam)}` : ''}`;

    // Schema.org ItemList JSON-LD
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": pageTitle,
        "description": pageDesc,
        "numberOfItems": filtered.length,
        "itemListElement": filtered.map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": p.name,
            "url": `https://www.crochetwali.in/product/${slugify(p.name)}-${p.id}`,
            "image": p.image
        }))
    };

    // Schema.org FAQPage JSON-LD
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Are all products listed here handmade?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, every single product listed on our shop is meticulously handcrafted by skilled artisans. We specialize in crochet and embroidery, ensuring high quality and a personal touch in every order."
                }
            },
            {
                "@type": "Question",
                "name": "How long does shipping take for crochet gifts?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Because our products are made-to-order to guarantee perfection, please allow 2-4 days for crafting. Standard shipping across India usually takes an additional 4-7 business days."
                }
            },
            {
                "@type": "Question",
                "name": "Do you take bulk orders for wedding return gifts?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we take bulk orders for weddings, baby showers, and corporate events. Our crochet keychains and mini flower bouquets are very popular as return gifts. Please contact us via the Custom Design page for bulk pricing."
                }
            }
        ]
    };

    // Build Product Cards HTML
    const cardsHtml = filtered.map(product => {
        const productUrl = `/product/${slugify(product.name)}-${product.id}`;
        const validVariants = (product.variants || []).filter(v => v.color && v.images && v.images.length > 0);
        const hasVariants = validVariants.length > 1;

        // Price display: lowest variant price as "₹X se" when variant prices differ
        let priceDisplay = `₹${product.price.toLocaleString('en-IN')}`;
        if (hasVariants) {
            const prices = validVariants.map(v => v.price ? Number(v.price) : product.price).filter(pr => !isNaN(pr) && pr > 0);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            if (min !== max) {
                priceDisplay = `₹${min.toLocaleString('en-IN')} se`;
            }
        }

        const isNew = (() => {
            if (!product.created_at) return false;
            const diff = Date.now() - new Date(product.created_at).getTime();
            return diff < (30 * 24 * 60 * 60 * 1000);
        })();
        const isBestseller = Boolean(product.homepage_tags?.includes('bestseller') || product.featured);
        const isGenuineDiscount = product.discountPercentage > 0 && product.discountPercentage <= 35;
        const saving = (isGenuineDiscount && product.originalPrice) ? product.originalPrice - product.price : 0;
        const isInStock = product.stock_quantity === undefined || Number(product.stock_quantity) > 0;

        const swatchesHtml = hasVariants ? `
            <div class="swatches" style="display:flex;gap:4px;margin-bottom:8px;">
                ${validVariants.map(v => `
                    <span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #e7e5e4;background-color:${escapeHtml(v.color.toLowerCase())};" title="${escapeHtml(v.color)}"></span>
                `).join('')}
            </div>
        ` : '';

        return `
            <article class="product-card" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f5f5f4;box-shadow:0 1px 4px rgba(0,0,0,0.04);display:flex;flex-direction:column;position:relative;">
                <!-- 1. Main variant photo -->
                <div style="position:relative;aspect-ratio:4/5;background:#fafaf9;overflow:hidden;">
                    <a href="${escapeHtml(productUrl)}" style="display:block;width:100%;height:100%;">
                        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" width="400" height="500" style="width:100%;height:100%;object-fit:cover;display:block;" />
                    </a>
                </div>
                <!-- Card details in strict Task 1 order -->
                <div style="padding:12px;display:flex;flex-direction:column;flex:1;">
                    <!-- 2. Product Name -->
                    <a href="${escapeHtml(productUrl)}" style="font-size:14px;font-weight:bold;color:#1c1917;text-decoration:none;margin-bottom:4px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                        ${escapeHtml(product.name)}
                    </a>
                    <!-- 3. Category -->
                    <span style="font-size:12px;color:#78716c;margin-bottom:6px;">${escapeHtml(product.category || 'Handmade')}</span>
                    <!-- 4. Selling price (bold) & 5. MRP & 6. Discount % and Save ₹X -->
                    <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:6px;flex-wrap:wrap;">
                        <span style="font-size:17px;font-weight:800;color:#1c1917;">${priceDisplay}</span>
                        ${isGenuineDiscount && product.originalPrice ? `
                            <span style="font-size:12px;color:#78716c;text-decoration:line-through;">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                            <span style="font-size:11px;font-weight:bold;color:#9f1239;">(${product.discountPercentage}% OFF · Save ₹${saving})</span>
                        ` : ''}
                    </div>
                    <!-- 7. Colour dots when variants exist -->
                    ${swatchesHtml}
                    <!-- 8. Badge only when true -->
                    ${isBestseller ? '<div style="margin-bottom:6px;"><span style="background:#fff0e1;color:#92400e;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:9999px;">Bestseller</span></div>' : ''}
                    ${isNew && !isBestseller ? '<div style="margin-bottom:6px;"><span style="background:#fef2f2;color:#9f1239;font-size:10px;font-weight:bold;padding:2px 8px;border-radius:9999px;">New</span></div>' : ''}
                    <!-- 10. Stock state -->
                    <div style="margin-top:auto;padding-top:8px;">
                        ${isInStock ? `
                            <a href="${escapeHtml(productUrl)}" style="display:block;text-align:center;background:#881337;color:#fff;font-size:12px;font-weight:bold;padding:8px;border-radius:8px;text-decoration:none;">View Options</a>
                        ` : `
                            <span style="display:block;text-align:center;background:#e7e5e4;color:#78716c;font-size:12px;font-weight:bold;padding:8px;border-radius:8px;cursor:not-allowed;">Out of Stock</span>
                        `}
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Category filter pills
    const allCategoriesList = [{ id: 'all', label: 'All Creations' }, ...categories];
    const categoryPillsHtml = allCategoriesList.map(cat => {
        const isSelected = (!categoryParam && cat.id === 'all') || 
            (categoryParam && (slugify(categoryParam) === slugify(cat.id) || slugify(categoryParam) === slugify(cat.label)));
        const href = cat.id === 'all' ? '/shop' : `/shop?category=${encodeURIComponent(slugify(cat.id))}`;
        const activeStyle = isSelected 
            ? 'background:#881337;color:#fff;border-color:#881337;font-weight:bold;box-shadow:0 4px 12px rgba(136,19,55,0.2);' 
            : 'background:#fff;color:#44403c;border-color:#e7e5e4;';

        return `
            <a href="${href}" style="padding:8px 16px;border-radius:9999px;font-size:13px;text-decoration:none;border:1px solid #e7e5e4;display:inline-block;white-space:nowrap;transition:all 0.2s;${activeStyle}">
                ${escapeHtml(cat.label)}
            </a>
        `;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDesc)}">
  <link rel="canonical" href="${escapeHtml(categoryCanonicalUrl)}">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(categoryCanonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDesc)}">
  <meta property="og:image" content="https://www.crochetwali.in/hero-gift.png">

  <!-- Google Schema ItemList -->
  <script type="application/ld+json">
  ${JSON.stringify(itemListJsonLd, null, 2)}
  </script>

  <!-- Google Schema FAQPage -->
  <script type="application/ld+json">
  ${JSON.stringify(faqJsonLd, null, 2)}
  </script>

  <!-- Preload fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/index.css">

  <style>
    body { font-family: 'Outfit', system-ui, sans-serif; background: #fdfbf7; color: #1c1917; margin: 0; padding: 0; }
    .container { max-width: 1380px; margin: 0 auto; padding: 16px; }
    .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }
    @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); gap: 32px; } }
    @media (min-width: 1280px) { .product-grid { grid-template-columns: repeat(5, 1fr); } }
  </style>
</head>
<body>
  <div id="root">
    <header style="background:#fff;border-bottom:1px solid #f5f5f4;padding:12px 20px;position:sticky;top:0;z-index:50;">
      <div style="max-width:1380px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;">
        <a href="/" style="text-decoration:none;font-size:22px;font-weight:800;color:#881337;">Crochet Wali</a>
        <nav style="display:flex;gap:20px;font-size:14px;font-weight:600;">
          <a href="/shop" style="color:#881337;text-decoration:none;">Shop</a>
          <a href="/gifts" style="color:#44403c;text-decoration:none;">Gifts</a>
          <a href="/custom-design" style="color:#44403c;text-decoration:none;">Custom Design</a>
        </nav>
      </div>
    </header>

    <main class="container">
      <div style="margin:20px 0 16px;">
        <h1 style="font-size:32px;font-weight:800;color:#1c1917;margin:0 0 8px;">${escapeHtml(activeCategoryMeta ? activeCategoryMeta.h1 : 'Handmade Crochet Gifts & Collection')}</h1>
        <p style="color:#78716c;font-size:15px;margin:0 0 8px;">${escapeHtml(activeCategoryMeta ? activeCategoryMeta.subheading : '100% handmade crochet flowers, bridal gajra, hair accessories & personalized gifts crafted in India.')}</p>
        <p style="color:#57534e;font-size:14px;line-height:1.6;margin:0 0 20px;max-width:800px;">${escapeHtml(activeCategoryMeta ? activeCategoryMeta.intro : 'Explore our extensive range of personalized handmade gifts, from intricate embroidery hoops to eternal crochet flower bouquets. Every piece is meticulously crafted with love, making them perfect for anniversaries, birthdays, or as unique aesthetic additions to your home.')}</p>
        
        <!-- Category Filters -->
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
          ${categoryPillsHtml}
        </div>

        <!-- Result Count -->
        <div style="font-size:14px;color:#78716c;font-weight:600;margin-bottom:20px;">
          Showing ${filtered.length} results
        </div>
      </div>

      <!-- Product Grid -->
      <section class="product-grid">
        ${cardsHtml}
      </section>

      <!-- FAQ Section -->
      <section style="margin-top:64px;padding-top:40px;border-top:1px solid #e7e5e4;max-width:800px;">
        <h2 style="font-size:24px;font-weight:800;margin-bottom:24px;">${escapeHtml(activeCategoryMeta ? `${activeCategoryMeta.label} - Frequently Asked Questions` : 'Shop Handmade Crochet Gifts - FAQ')}</h2>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div style="background:#fff;padding:20px;border-radius:12px;border:1px solid #f5f5f4;">
            <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;">Are all products listed here handmade?</h3>
            <p style="margin:0;color:#57534e;font-size:14px;line-height:1.6;">Yes, every single product listed on our shop is meticulously handcrafted by skilled artisans. We specialize in crochet and embroidery, ensuring high quality and a personal touch in every order.</p>
          </div>
          <div style="background:#fff;padding:20px;border-radius:12px;border:1px solid #f5f5f4;">
            <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;">How long does shipping take for crochet gifts?</h3>
            <p style="margin:0;color:#57534e;font-size:14px;line-height:1.6;">Because our products are made-to-order to guarantee perfection, please allow 2-4 days for crafting. Standard shipping across India usually takes an additional 4-7 business days.</p>
          </div>
          <div style="background:#fff;padding:20px;border-radius:12px;border:1px solid #f5f5f4;">
            <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;">Do you take bulk orders for wedding return gifts?</h3>
            <p style="margin:0;color:#57534e;font-size:14px;line-height:1.6;">Yes, we take bulk orders for weddings, baby showers, and corporate events. Our crochet keychains and mini flower bouquets are very popular as return gifts. Please contact us via the Custom Design page for bulk pricing.</p>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- Vite entrypoint for instant client hydration -->
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
}

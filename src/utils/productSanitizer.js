/**
 * Product Catalogue Hygiene, Sanitization & Duplicate Resolution
 */

// Known typos from live audit
const NAME_OVERRIDES = {
    'hair taiy': 'Hair Tie',
    'baw hairclip': 'Bow Hairclip',
    'swtoberry pot': 'Strawberry Pot',
    '3d rose granny square bag (red)': '3D Rose Granny Square Bag (Red)',
    'crochet flower hair clutcher': 'Crochet Flower Hair Clutcher',
};

const LOWERCASE_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);

/**
 * Standardizes any string into proper Title Case
 */
export function toTitleCase(str) {
    if (!str) return '';
    const clean = str.replace(/\s+/g, ' ').trim();
    const cleanLower = clean.toLowerCase();
    if (NAME_OVERRIDES[cleanLower]) {
        return NAME_OVERRIDES[cleanLower];
    }

    const words = clean.split(' ');
    return words.map((word, idx) => {
        if (!word) return '';
        
        // Handle parentheses, e.g. (Pink), (Red), (Set), (Pair), (Yellow), (Qty: 1)
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

/**
 * Standardizes a product name according to catalogue hygiene rules
 */
export function sanitizeProductName(name) {
    if (!name) return '';
    const cleanLower = name.toLowerCase().trim().replace(/\s+/g, ' ');
    if (NAME_OVERRIDES[cleanLower]) {
        return NAME_OVERRIDES[cleanLower];
    }
    return toTitleCase(name);
}

// Canonical vs Merged Duplicate IDs
export const CANONICAL_MAP = {
    // 1. Parandi: Keep 4fdb8975... (₹199), merge c8817e89... (₹249)
    'c8817e89-bd13-4b44-80d9-e93a7dfb8ce8': {
        targetId: '4fdb8975-eac9-4ecf-bb82-61526f2625a1',
        targetSlug: 'crochet-parandi-4fdb8975-eac9-4ecf-bb82-61526f2625a1'
    },
    // 2. Sunflower Keychain: Keep a3464d61... (all 3 variants, ₹119), merge b847a5ce... (only 1 variant)
    'b847a5ce-57c4-4b9b-862d-fb305a50c102': {
        targetId: 'a3464d61-a5da-4471-93d4-b7615de02e8f',
        targetSlug: 'sunflower-keychain-a3464d61-a5da-4471-93d4-b7615de02e8f'
    },
    // 3. Gajra: Keep f6439b6e... (Wrist Gajra Bracelet (Pair), ₹349), merge b93361d2... & e6d2aa67...
    'b93361d2-1709-421e-b98b-443bffd21cfb': {
        targetId: 'f6439b6e-b495-4d17-95f2-7bcd7d7fdd26',
        targetSlug: 'crochet-wrist-gajra-bracelet-pair-f6439b6e-b495-4d17-95f2-7bcd7d7fdd26'
    },
    'e6d2aa67-4a7d-4dfb-ad09-ec1fd25f6bc2': {
        targetId: 'f6439b6e-b495-4d17-95f2-7bcd7d7fdd26',
        targetSlug: 'crochet-wrist-gajra-bracelet-pair-f6439b6e-b495-4d17-95f2-7bcd7d7fdd26'
    }
};

export const DUPLICATE_PRODUCT_IDS = new Set(Object.keys(CANONICAL_MAP));

/**
 * Returns true if a product is a deprecated duplicate that should be filtered out
 */
export function isDuplicateProduct(productOrId) {
    const id = typeof productOrId === 'string' ? productOrId : productOrId?.id;
    return DUPLICATE_PRODUCT_IDS.has(id);
}

/**
 * Returns the target canonical URL if the given slug or ID is a merged duplicate or old typo slug
 */
export function getDuplicateRedirect(slugOrId) {
    if (!slugOrId) return null;
    const lower = slugOrId.toLowerCase();

    // Check duplicate ID matches
    for (const [dupId, info] of Object.entries(CANONICAL_MAP)) {
        if (lower.includes(dupId)) {
            return `/product/${info.targetSlug}`;
        }
    }

    // Check slug typo redirects
    if (lower.includes('hair-taiy')) {
        return '/product/hair-tie-859e8646-a02c-4a3f-8de7-a040b98a8479';
    }
    if (lower.includes('baw-hairclip')) {
        return '/product/bow-hairclip-12be210d-24a1-4581-8b35-cee50a72d3b8';
    }
    if (lower.includes('swtoberry-pot')) {
        return '/product/strawberry-pot-e3404716-4ad2-4d81-9a6f-b4d0efe18451';
    }

    return null;
}

// Known deleted/404 image URLs from Supabase storage
export const DELETED_STORAGE_URLS = new Set([
    'https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1772016571524-0mv6d.jpg',
    'https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1772016593285-5771nk.jpg',
]);

export function isBrokenImageUrl(url) {
    if (!url || typeof url !== 'string') return true;
    const trimmed = url.trim();
    if (trimmed.length < 5) return true;
    if (DELETED_STORAGE_URLS.has(trimmed)) return true;
    return false;
}

/**
 * Unifies variant prices for products where variants had erroneous minor differences
 */
export function getUnifiedPriceData(product) {
    let price = Number(product.price) || 0;
    let variants = Array.isArray(product.variants) ? [...product.variants] : [];

    // Filter out known deleted or invalid image URLs from all variants
    variants = variants.map(v => ({
        ...v,
        images: Array.isArray(v.images) ? v.images.filter(img => !isBrokenImageUrl(img)) : []
    }));

    // 1. Sunflower Keychain: unify red variant (₹117 -> ₹119)
    if (product.id === 'a3464d61-a5da-4471-93d4-b7615de02e8f') {
        price = 119;
        variants = variants.map(v => ({ ...v, price: '119' }));
    }

    // 2. Crochet Wrist Gajra Bracelet (Pair): unify white variant (₹348 -> ₹349)
    if (product.id === 'f6439b6e-b495-4d17-95f2-7bcd7d7fdd26') {
        price = 349;
        variants = variants.map(v => ({ ...v, price: '349' }));
    }

    // 3. Crochet Bunny Heart Keychain: unify base and variant to ₹149
    if (product.id === 'baa8e02e-b1a3-4b18-8006-f37ff660d575') {
        price = 149;
        variants = variants.map(v => ({ ...v, price: '149' }));
    }

    // 4. Crochet Sunflower Pot: unify base and variant to ₹499
    if (product.id === '289ef890-cabb-42b7-be84-e06cf1545d80') {
        price = 499;
        variants = variants.map(v => ({ ...v, price: '499' }));
    }

    return { price, variants };
}

/**
 * Returns genuine discount and strike-through price.
 * Fake / exaggerated discounts (> 35%) are eliminated so cards display only honest pricing.
 */
export function getGenuineDiscount(price, rawOriginalPrice) {
    if (!rawOriginalPrice) return { isGenuine: false, originalPrice: null, discountPercentage: 0, savingAmount: 0 };
    const orig = Number(rawOriginalPrice);
    const p = Number(price);
    if (isNaN(orig) || isNaN(p) || orig <= p) return { isGenuine: false, originalPrice: null, discountPercentage: 0, savingAmount: 0 };

    const discountFraction = (orig - p) / orig;
    // Honest discount threshold: up to 35% genuine sale/promotional discount
    if (discountFraction <= 0.35) {
        return {
            isGenuine: true,
            originalPrice: orig,
            discountPercentage: Math.round(discountFraction * 100),
            savingAmount: orig - p
        };
    }

    // If discount > 35%, it represents an exaggerated synthetic MRP. Show only honest selling price.
    return { isGenuine: false, originalPrice: null, discountPercentage: 0, savingAmount: 0 };
}

/**
 * Normalizes product category to the canonical single source of truth.
 * The store owner confirmed on 2026-10-27 that "Home Decor" is NOT a category at all.
 * Stale / legacy "Home Decor" products are all Flower Pot products (Crochet Tulip Pot Pink,
 * Strawberry Pot, Crochet Sunflower Pot).
 */
export function normalizeCategory(category) {
    if (!category) return 'Flower Pot';
    const trimmed = String(category).trim();
    if (trimmed.toLowerCase() === 'home decor' || trimmed.toLowerCase() === 'homedecor') {
        return 'Flower Pot';
    }
    return trimmed;
}


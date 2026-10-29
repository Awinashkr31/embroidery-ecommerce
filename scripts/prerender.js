import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { 
    sanitizeProductName, 
    isDuplicateProduct, 
    getUnifiedPriceData, 
    getGenuineDiscount, 
    normalizeCategory, 
    isBrokenImageUrl 
} from '../src/utils/productSanitizer.js';
import { blogPosts as fallbackPosts } from '../src/pages/Blog/posts.js';
import { getCategorySeoData } from '../src/utils/categorySeo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

dotenv.config({ path: path.resolve(rootDir, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqtrlqkmitgnaehbawdm.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdHJscWttaXRnbmFlaGJhd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzc5NzYsImV4cCI6MjA4MTU1Mzk3Nn0.KtFy-rrNFK7e9z63qmPNbQgdHp2_Ls4q-DTmGkxFCYs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

function markdownToHtml(md) {
    if (!md) return '';
    return md
        .trim()
        .split(/\n\s*\n/)
        .map(block => {
            block = block.trim();
            if (!block) return '';
            if (block.startsWith('### ')) {
                const headingText = block.replace(/^###\s+/, '');
                return `<h3 style="font-size: 20px; font-weight: 700; color: #1c1917; margin: 28px 0 12px;">${formatInline(headingText)}</h3>`;
            }
            if (block.startsWith('## ')) {
                const headingText = block.replace(/^##\s+/, '');
                return `<h2 style="font-size: 24px; font-weight: 700; color: #1c1917; margin: 32px 0 16px;">${formatInline(headingText)}</h2>`;
            }
            return `<p style="color: #44403c; line-height: 1.8; font-size: 16px; margin: 0 0 16px;">${formatInline(block)}</p>`;
        })
        .filter(Boolean)
        .join('\n');
}

function formatInline(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #881337; text-decoration: underline;">$1</a>');
}

// Shared site header for pre-rendered pages
function renderHeader() {
    return `
    <header style="background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #f5f5f4; position: sticky; top: 0; z-index: 50; padding: 12px 20px;">
      <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
        <a href="/" style="display: flex; align-items: center; text-decoration: none;" aria-label="Crochet Wali Home">
          <img src="/logo.png" alt="Crochet Wali" style="height: 48px; width: auto; object-fit: contain;" width="120" height="48" />
        </a>
        <nav style="display: flex; gap: 24px; align-items: center; font-size: 14px; font-weight: 600;">
          <a href="/shop" style="color: #1c1917; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Shop</a>
          <a href="/gifts" style="color: #1c1917; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Gifts</a>
          <a href="/custom-design" style="color: #1c1917; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Custom Design</a>
          <a href="/blog" style="color: #1c1917; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Blog</a>
          <a href="/about" style="color: #1c1917; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">About</a>
        </nav>
      </div>
    </header>
    `;
}

// Shared site footer for pre-rendered pages
function renderFooter() {
    return `
    <footer style="background: #f0ece9; border-top: 1px solid #e7e5e4; padding: 48px 20px 32px; color: #57534e; margin-top: 64px;">
      <div style="max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px;">
        <div>
          <a href="/" style="display: inline-block; margin-bottom: 12px;">
            <img src="/logo.png" alt="Crochet Wali" style="height: 56px; width: auto;" width="140" height="56" />
          </a>
          <p style="font-size: 14px; line-height: 1.6; color: #78716c;">
            Weaving stories into fabric. Handcrafted crochet and detailed designs that bring elegance and warmth to your special moments. Made with love in India.
          </p>
        </div>
        <div>
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1c1917; margin-bottom: 16px;">Explore</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <li><a href="/shop" style="color: #57534e; text-decoration: none;">Shop All Creations</a></li>
            <li><a href="/gifts" style="color: #57534e; text-decoration: none;">Gift Guide</a></li>
            <li><a href="/categories" style="color: #57534e; text-decoration: none;">Categories</a></li>
            <li><a href="/blog" style="color: #57534e; text-decoration: none;">Journal & Blog</a></li>
            <li><a href="/custom-design" style="color: #57534e; text-decoration: none;">Custom Design Orders</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1c1917; margin-bottom: 16px;">Policies & Care</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <li><a href="/return-policy" style="color: #57534e; text-decoration: none;">Return Policy</a></li>
            <li><a href="/shipping-policy" style="color: #57534e; text-decoration: none;">Shipping Policy</a></li>
            <li><a href="/privacy-policy" style="color: #57534e; text-decoration: none;">Privacy Policy</a></li>
            <li><a href="/terms-of-service" style="color: #57534e; text-decoration: none;">Terms of Service</a></li>
            <li><a href="/support" style="color: #57534e; text-decoration: none;">Contact & Support</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1c1917; margin-bottom: 16px;">Contact & Community</h4>
          <p style="font-size: 14px; line-height: 1.6; color: #78716c; margin: 0 0 12px;">
            Email: <a href="mailto:support@crochetwali.in" style="color: #881337; text-decoration: none;">support@crochetwali.in</a><br />
            Instagram: <a href="https://www.instagram.com/crochetwali.in" target="_blank" rel="noopener noreferrer" style="color: #881337; text-decoration: none;">@crochetwali.in</a>
          </p>
          <p style="font-size: 12px; color: #a8a29e; margin-top: 16px;">
            © ${new Date().getFullYear()} Crochet Wali (Embroidery by Sana). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    `;
}

async function prerender() {
    console.log('🚀 Starting Static Pre-rendering for Crochet Wali...');

    if (!fs.existsSync(distDir)) {
        console.error('dist directory does not exist! Please run vite build first.');
        process.exit(1);
    }

    const baseHtmlPath = path.resolve(distDir, 'index.html');
    if (!fs.existsSync(baseHtmlPath)) {
        console.error('dist/index.html not found!');
        process.exit(1);
    }

    const rawBaseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
    // Ensure baseHtml always has a pristine <div id="root"></div> shell so replacements succeed cleanly
    const baseHtml = rawBaseHtml.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');

    // Extract asset tags (Vite bundles)
    const scriptMatches = baseHtml.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/g) || [];
    const cssMatches = baseHtml.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/g) || [];
    const preloadMatches = baseHtml.match(/<link rel="modulepreload" crossorigin href="([^"]+)">/g) || [];

    const scriptTags = scriptMatches.join('\n');
    const cssTags = cssMatches.join('\n');
    const preloadTags = preloadMatches.join('\n');
    const allHeadAssetTags = [preloadTags, cssTags].filter(Boolean).join('\n');

    console.log(`Extracted Vite bundle assets:`);
    console.log(`Scripts: ${scriptMatches.join(', ')}`);
    console.log(`Stylesheets: ${cssMatches.join(', ')}`);

    // Write api/viteAssets.js
    const viteAssetsJs = `// Auto-generated during build by scripts/prerender.js
export const viteAssets = {
  css: ${JSON.stringify(cssMatches[0] ? cssMatches[0].match(/href="([^"]+)"/)?.[1] : '')},
  js: ${JSON.stringify(scriptMatches[0] ? scriptMatches[0].match(/src="([^"]+)"/)?.[1] : '')},
  headTags: ${JSON.stringify(allHeadAssetTags)},
  scriptTags: ${JSON.stringify(scriptTags)}
};
`;
    const apiAssetsPath = path.resolve(rootDir, 'api/viteAssets.js');
    fs.writeFileSync(apiAssetsPath, viteAssetsJs, 'utf8');
    console.log(`Updated ${apiAssetsPath}`);

    // Fetch Products & Categories from Supabase
    let rawProducts = [];
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, name, description, price, original_price, category, images, featured, stock_quantity, fabric, clothing_information, variants, created_at, active, homepage_tags')
            .eq('active', true)
            .order('created_at', { ascending: false });
        if (!error && data) {
            rawProducts = data;
        }
    } catch (err) {
        console.warn('Could not fetch products from Supabase, continuing with fallback:', err.message);
    }

    // Process & sanitize products
    const products = rawProducts
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
            const image = (cleanImages.length > 0) ? cleanImages[0] : 'https://www.crochetwali.in/hero-gift.png';
            const cleanSlug = p.clothing_information?.slug || slugify(cleanName);
            const productSlug = `${cleanSlug}-${p.id}`;

            return {
                ...p,
                name: cleanName,
                slug: productSlug,
                category,
                price,
                originalPrice,
                discountPercentage,
                images: cleanImages,
                image,
                inStock: (p.stock_quantity === undefined || Number(p.stock_quantity) > 0),
                variants
            };
        });

    console.log(`Processed ${products.length} active products.`);

    // 1. PRE-RENDER HOMEPAGE (dist/index.html)
    console.log('Pre-rendering Homepage (dist/index.html)...');
    const bestsellers = products.filter(p => p.homepage_tags?.includes('bestseller') || p.featured).slice(0, 8);
    const newArrivals = products.filter(p => p.homepage_tags?.includes('new_arrival')).slice(0, 8);
    const featuredItems = (bestsellers.length > 0 ? bestsellers : products.slice(0, 8));

    const categoryPills = [
        { label: 'All Creations', href: '/shop' },
        { label: 'Flower Pot', href: '/shop?category=flower-pot' },
        { label: 'Bouquet', href: '/shop?category=bouquet' },
        { label: 'Keychain & Bag Charm', href: '/shop?category=handmade-keychain' },
        { label: 'Hair Accessories', href: '/shop?category=hair-accessories' },
        { label: "Flower's", href: "/shop?category=flowers" },
        { label: 'Gift Hampers', href: '/shop?category=gift-box' },
        { label: 'Toys', href: '/shop?category=toys' },
    ];

    const homeHtmlContent = `
    ${renderHeader()}
    
    <main id="main-content" style="max-width: 1280px; margin: 0 auto; padding: 16px 20px;">
      <!-- Hero Section -->
      <section style="background: linear-gradient(135deg, #fdf2f4 0%, #fff 100%); border-radius: 24px; padding: 48px 32px; margin-bottom: 40px; border: 1px solid #fecdd3; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 32px;">
        <div style="flex: 1; min-width: 280px;">
          <span style="display: inline-block; background: #e6f4ea; color: #166534; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            🌿 100% Handcrafted by Indian Artisans
          </span>
          <h1 style="font-size: clamp(32px, 5vw, 44px); font-weight: 800; color: #1c1917; line-height: 1.15; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">
            Handmade Crochet Gifts & Keepsakes Made with Love
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #57534e; margin: 0 0 24px; max-width: 540px;">
            Cherish everlasting crochet flower bouquets, handcrafted bridal gajras, cute keychains, and personalized anniversary keepsakes that never wilt.
          </p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="/shop" style="background: #881337; color: #fff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Shop All Creations</a>
            <a href="/custom-design" style="background: #fff; color: #1c1917; border: 1px solid #d6d3d1; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Custom Orders</a>
          </div>
        </div>
        <div style="flex: 1; min-width: 280px; text-align: center;">
          <img src="/hero-gift.png" alt="Crochet Wali Handmade Gifts" style="max-width: 100%; height: auto; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.06);" width="480" height="360" />
        </div>
      </section>

      <!-- Category Filter Navigation -->
      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #1c1917; margin-bottom: 16px;">Shop By Category</h2>
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px;">
          ${categoryPills.map(c => `
            <a href="${c.href}" style="padding: 8px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; text-decoration: none; background: #fff; color: #44403c; border: 1px solid #e7e5e4; white-space: nowrap;">
              ${escapeHtml(c.label)}
            </a>
          `).join('')}
        </div>
      </section>

      <!-- Featured & Bestselling Products -->
      <section style="margin-bottom: 48px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: #1c1917; margin: 0 0 4px; font-family: 'Playfair Display', Georgia, serif;">Artisan Favorites & Bestsellers</h2>
            <p style="font-size: 14px; color: #78716c; margin: 0;">Our most cherished bespoke creations, lovingly crafted stitch by stitch.</p>
          </div>
          <a href="/shop" style="color: #881337; font-weight: 700; font-size: 14px; text-decoration: none;">View All →</a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
          ${featuredItems.map(p => `
            <article style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; overflow: hidden; display: flex; flex-direction: column;">
              <a href="/product/${p.slug}" style="display: block; aspect-ratio: 1; background: #fafaf9; overflow: hidden;">
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" width="300" height="300" />
              </a>
              <div style="padding: 14px; display: flex; flex-direction: column; flex: 1;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; margin-bottom: 4px;">${escapeHtml(p.category)}</span>
                <a href="/product/${p.slug}" style="font-size: 15px; font-weight: 700; color: #1c1917; text-decoration: none; margin-bottom: 8px; line-height: 1.3;">
                  ${escapeHtml(p.name)}
                </a>
                <div style="margin-top: auto; display: flex; align-items: baseline; gap: 8px;">
                  <span style="font-size: 17px; font-weight: 800; color: #881337;">₹${p.price}</span>
                  ${p.originalPrice ? `<span style="font-size: 13px; color: #a8a29e; text-decoration: line-through;">₹${p.originalPrice}</span>` : ''}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Why Choose Crochet Wali Section -->
      <section style="background: #fafaf9; border-radius: 20px; padding: 36px 28px; margin-bottom: 48px; border: 1px solid #f5f5f4;">
        <h2 style="font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 24px;">Why Shop from Crochet Wali?</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">
          <div style="text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🧶</div>
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px;">100% Handcrafted</h3>
            <p style="font-size: 13px; color: #78716c; margin: 0; line-height: 1.5;">Every stitch is individually knitted by skilled women artisans across India.</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🌸</div>
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px;">Never Wilts</h3>
            <p style="font-size: 13px; color: #78716c; margin: 0; line-height: 1.5;">Our crochet bouquets and gajras stay vibrant forever as everlasting keepsakes.</p>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 28px; margin-bottom: 8px;">🚚</div>
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px;">Fast Pan-India Delivery</h3>
            <p style="font-size: 13px; color: #78716c; margin: 0; line-height: 1.5;">Carefully bubble-wrapped and delivered across all pin codes in India.</p>
          </div>
        </div>
      </section>



            <!-- Frequently Asked Questions -->
      <section style="margin-bottom: 48px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h2 style="font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 24px;">Frequently Asked Questions</h2>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e7e5e4;">
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px;">Are all Crochet Wali products handmade?</h3>
            <p style="font-size: 14px; color: #57534e; margin: 0; line-height: 1.6;">Yes! Every item at Crochet Wali is 100% handmade by talented artisans using premium, non-toxic cotton yarn.</p>
          </div>
          <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e7e5e4;">
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px;">How long does shipping take?</h3>
            <p style="font-size: 14px; color: #57534e; margin: 0; line-height: 1.6;">Orders are typically crafted and dispatched within 2-4 business days, and delivery takes 4-7 business days across India.</p>
          </div>
          <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e7e5e4;">
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px;">Can I request a custom crochet design?</h3>
            <p style="font-size: 14px; color: #57534e; margin: 0; line-height: 1.6;">Absolutely! Visit our Custom Design page to share your inspiration photo or color palette, and we will bring your vision to life.</p>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
    `;

    // Inject into dist/index.html
    const updatedHomepageHtml = baseHtml.replace('<div id="root"></div>', `<div id="root">${homeHtmlContent}</div>`);
    fs.writeFileSync(baseHtmlPath, updatedHomepageHtml, 'utf8');
    console.log(`Updated ${baseHtmlPath} with pre-rendered Homepage content.`);

    // 2. PRE-RENDER SHOP (dist/shop/index.html)
    console.log('Pre-rendering Shop Page (dist/shop/index.html)...');
    const shopDir = path.resolve(distDir, 'shop');
    fs.mkdirSync(shopDir, { recursive: true });

    const shopCardsHtml = products.map(p => `
      <article style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; overflow: hidden; display: flex; flex-direction: column;">
        <a href="/product/${p.slug}" style="display: block; aspect-ratio: 1; background: #fafaf9; overflow: hidden;">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" width="300" height="300" />
        </a>
        <div style="padding: 14px; display: flex; flex-direction: column; flex: 1;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; margin-bottom: 4px;">${escapeHtml(p.category)}</span>
          <a href="/product/${p.slug}" style="font-size: 15px; font-weight: 700; color: #1c1917; text-decoration: none; margin-bottom: 8px; line-height: 1.3;">
            ${escapeHtml(p.name)}
          </a>
          <div style="margin-top: auto; display: flex; align-items: baseline; gap: 8px;">
            <span style="font-size: 17px; font-weight: 800; color: #881337;">₹${p.price}</span>
            ${p.originalPrice ? `<span style="font-size: 13px; color: #a8a29e; text-decoration: line-through;">₹${p.originalPrice}</span>` : ''}
          </div>
        </div>
      </article>
    `).join('\n');

    const shopContent = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 24px 20px;">
      <h1 style="font-size: 32px; font-weight: 800; color: #1c1917; margin: 0 0 8px;">Shop All Handmade Crochet Gifts</h1>
      <p style="color: #78716c; font-size: 15px; margin: 0 0 24px;">Explore our complete collection of 100% handmade crochet flowers, bouquets, keychains, and hair accessories.</p>
      
      <!-- Category Pills -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 24px;">
        ${categoryPills.map(c => `
          <a href="${c.href}" style="padding: 8px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; text-decoration: none; background: #fff; color: #44403c; border: 1px solid #e7e5e4; white-space: nowrap;">
            ${escapeHtml(c.label)}
          </a>
        `).join('')}
      </div>

      <div style="font-size: 14px; font-weight: 600; color: #78716c; margin-bottom: 20px;">
        Showing ${products.length} handcrafted creations
      </div>

      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
        ${shopCardsHtml}
      </section>
    </main>
    ${renderFooter()}
    `;

    const shopHtml = baseHtml
        .replace(/<title>.*?<\/title>/, `<title>Shop All Handmade Crochet Gifts | Crochet Wali</title>`)
        .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="Shop Crochet Wali's complete collection of handmade crochet gifts — forever flower bouquets, gajra, hair clips, keychains, parandi, claw clips, and personalized gift boxes."`)
        .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://www.crochetwali.in/shop"`)
        .replace('<div id="root"></div>', `<div id="root">${shopContent}</div>`);

    fs.writeFileSync(path.resolve(shopDir, 'index.html'), shopHtml, 'utf8');
    console.log(`Pre-rendered dist/shop/index.html`);

    // 3. PRE-RENDER BLOG INDEX & POSTS
    console.log('Pre-rendering Blog Posts (dist/blog/...)...');
    const blogDir = path.resolve(distDir, 'blog');
    fs.mkdirSync(blogDir, { recursive: true });

    // Combine posts
    const blogCardsHtml = fallbackPosts.map(post => `
      <article style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; overflow: hidden; display: flex; flex-direction: column;">
        <a href="/blog/${post.slug}" style="display: block; aspect-ratio: 16/9; background: #fafaf9; overflow: hidden;">
          <img src="${escapeHtml(post.image || '/hero-gift.png')}" alt="${escapeHtml(post.title)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" width="400" height="225" />
        </a>
        <div style="padding: 20px; display: flex; flex-direction: column; flex: 1;">
          <span style="font-size: 12px; color: #78716c; margin-bottom: 6px;">Published on ${post.date}</span>
          <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 10px; line-height: 1.3;">
            <a href="/blog/${post.slug}" style="color: inherit; text-decoration: none;">${escapeHtml(post.title)}</a>
          </h2>
          <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">
            ${escapeHtml(post.excerpt)}
          </p>
          <a href="/blog/${post.slug}" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Read Article →</a>
        </div>
      </article>
    `).join('\n');

    const blogIndexContent = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px 20px;">
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 20px;">
        <a href="/" style="color: #78716c; text-decoration: none;">Home</a> / 
        <span style="color: #1c1917; font-weight: 600;">Blog</span>
      </nav>

      <h1 style="font-size: 32px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">Crochet Craft Guides & Stories</h1>
      <p style="color: #78716c; font-size: 15px; margin: 0 0 32px; max-width: 700px;">Explore our handmade guides, styling tips, crochet vs fresh flower comparisons, and gifting inspiration from our artisanal workshop.</p>

      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
        ${blogCardsHtml}
      </section>
    </main>
    ${renderFooter()}
    `;

    const blogIndexHtml = baseHtml
        .replace(/<title>.*?<\/title>/, `<title>Crochet & Handmade Craft Guides, Tips & Stories | Crochet Wali</title>`)
        .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="Explore handmade crochet guides, bridal gajra care, styling tips, flower comparisons, and thoughtful gift ideas from Crochet Wali."`)
        .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://www.crochetwali.in/blog"`)
        .replace('<div id="root"></div>', `<div id="root">${blogIndexContent}</div>`);

    fs.writeFileSync(path.resolve(blogDir, 'index.html'), blogIndexHtml, 'utf8');
    console.log(`Pre-rendered dist/blog/index.html`);

    // Individual Blog Posts
    for (const post of fallbackPosts) {
        const postDir = path.resolve(blogDir, post.slug);
        fs.mkdirSync(postDir, { recursive: true });

        const postArticleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image ? `https://www.crochetwali.in${post.image}` : "https://www.crochetwali.in/hero-gift.png",
            "datePublished": `${post.date}T00:00:00+05:30`,
            "author": {
                "@type": "Person",
                "name": "Sana"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Crochet Wali",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.crochetwali.in/logo.png"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.crochetwali.in/blog/${post.slug}`
            }
        };

        const postContentHtml = `
        ${renderHeader()}
        <main style="max-width: 800px; margin: 0 auto; padding: 32px 20px;">
          <!-- Breadcrumb -->
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px;">
            <a href="/" style="color: #78716c; text-decoration: none;">Home</a> / 
            <a href="/blog" style="color: #78716c; text-decoration: none;">Blog</a> / 
            <span style="color: #1c1917; font-weight: 600;">${escapeHtml(post.title)}</span>
          </nav>

          <article>
            <h1 style="font-size: clamp(28px, 4vw, 38px); font-weight: 800; color: #1c1917; line-height: 1.25; margin: 0 0 12px; font-family: 'Playfair Display', Georgia, serif;">
              ${escapeHtml(post.title)}
            </h1>
            <div style="font-size: 14px; color: #78716c; margin-bottom: 24px; display: flex; gap: 16px;">
              <span>By Sana (Artisan)</span>
              <span>•</span>
              <time datetime="${post.date}">${post.date}</time>
            </div>

            ${post.image ? `
              <div style="margin-bottom: 32px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="width: 100%; height: auto; display: block;" width="800" height="450" />
              </div>
            ` : ''}

            <div style="color: #44403c; line-height: 1.8; font-size: 16px;">
              ${markdownToHtml(post.content)}
            </div>

            <div style="margin-top: 48px; padding: 24px; background: #fff1f2; border-radius: 16px; border: 1px solid #fecdd3; text-align: center;">
              <h3 style="font-size: 18px; font-weight: 800; color: #881337; margin: 0 0 8px;">Explore Handmade Creations</h3>
              <p style="font-size: 14px; color: #44403c; margin: 0 0 16px;">Discover our handcrafted crochet flower bouquets, hair accessories, and personalized keepsakes.</p>
              <a href="/shop" style="display: inline-block; background: #881337; color: #fff; padding: 10px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px; text-decoration: none;">
                Visit Our Shop →
              </a>
            </div>
          </article>
        </main>
        ${renderFooter()}
        `;

        const postHtml = baseHtml
            .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(post.metaTitle || `${post.title} | Crochet Wali`)}</title>`)
            .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${escapeHtml(post.metaDescription || post.excerpt)}"`)
            .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://www.crochetwali.in/blog/${post.slug}"`)
            .replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(postArticleSchema, null, 2)}\n  </script>\n</head>`)
            .replace('<div id="root"></div>', `<div id="root">${postContentHtml}</div>`);

        fs.writeFileSync(path.resolve(postDir, 'index.html'), postHtml, 'utf8');
    }
    console.log(`Pre-rendered ${fallbackPosts.length} individual blog posts.`);

    // 4. PRE-RENDER PRODUCT PAGES (dist/product/:slug/index.html)
    console.log(`Pre-rendering ${products.length} product pages (dist/product/...)...`);
    const productBaseDir = path.resolve(distDir, 'product');
    fs.mkdirSync(productBaseDir, { recursive: true });

    for (const p of products) {
        const productDir = path.resolve(productBaseDir, p.slug);
        fs.mkdirSync(productDir, { recursive: true });

        const productUrl = `https://www.crochetwali.in/product/${p.slug}`;
        const cleanDesc = (p.description || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim() || 
            `Buy 100% handmade ${p.name} online in India at ₹${p.price}. Handcrafted with love by Crochet Wali artisans using premium yarn. Fast delivery across India.`;
        
        const metaDesc = cleanDesc.length > 180 ? cleanDesc.substring(0, 177) + '...' : cleanDesc;

        const productSchema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": p.name,
            "image": p.images.length > 0 ? p.images : [p.image],
            "description": cleanDesc,
            "sku": `CW-${p.id.slice(0, 8).toUpperCase()}`,
            "brand": {
                "@type": "Brand",
                "name": "Crochet Wali"
            },
            "category": p.category,
            "offers": {
                "@type": "Offer",
                "url": productUrl,
                "priceCurrency": "INR",
                "price": String(p.price),
                "priceValidUntil": "2027-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "availability": p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Crochet Wali"
                },
                "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": p.price >= 999 ? "0" : "50",
                        "currency": "INR"
                    },
                    "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "IN"
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

        const breadcrumbsSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.crochetwali.in/" },
                { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.crochetwali.in/shop" },
                { "@type": "ListItem", "position": 3, "name": p.category, "item": `https://www.crochetwali.in/shop?category=${encodeURIComponent(slugify(p.category))}` },
                { "@type": "ListItem", "position": 4, "name": p.name, "item": productUrl }
            ]
        };

        const productContentHtml = `
        ${renderHeader()}
        <main style="max-width: 1000px; margin: 0 auto; padding: 24px 20px;">
          <!-- Breadcrumb -->
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px;">
            <a href="/" style="color: #78716c; text-decoration: none;">Home</a> / 
            <a href="/shop" style="color: #78716c; text-decoration: none;">Shop</a> / 
            <a href="/shop?category=${encodeURIComponent(slugify(p.category))}" style="color: #78716c; text-decoration: none;">${escapeHtml(p.category)}</a> / 
            <span style="color: #1c1917; font-weight: 600;">${escapeHtml(p.name)}</span>
          </nav>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; align-items: start;">
            <!-- Product Images -->
            <div>
              <div style="background: #fafaf9; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); aspect-ratio: 1;">
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 100%; object-fit: cover;" width="500" height="500" fetchpriority="high" />
              </div>
              ${p.images.length > 1 ? `
                <div style="display: flex; gap: 8px; margin-top: 12px; overflow-x: auto;">
                  ${p.images.slice(0, 5).map(img => `
                    <div style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; border: 1px solid #e7e5e4;">
                      <img src="${escapeHtml(img)}" alt="" style="width: 100%; height: 100%; object-fit: cover;" width="64" height="64" />
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Product Details -->
            <div>
              <span style="display: inline-block; background: #fff1f2; color: #881337; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
                ${escapeHtml(p.category)}
              </span>
              <h1 style="font-size: clamp(24px, 3.5vw, 32px); font-weight: 800; color: #1c1917; line-height: 1.25; margin: 0 0 12px;">
                ${escapeHtml(p.name)}
              </h1>
              <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
                <span style="font-size: 28px; font-weight: 800; color: #881337;">₹${p.price}</span>
                ${p.originalPrice ? `
                  <span style="font-size: 16px; color: #a8a29e; text-decoration: line-through;">₹${p.originalPrice}</span>
                  <span style="font-size: 13px; font-weight: 700; color: #166534;">${p.discountPercentage}% OFF</span>
                ` : ''}
                <span style="font-size: 13px; color: #15803d; font-weight: 600; margin-left: 8px;">
                  ${p.inStock ? '✓ In Stock' : 'Made to Order'}
                </span>
              </div>

              <p style="color: #44403c; line-height: 1.7; font-size: 15px; margin: 0 0 24px;">
                ${escapeHtml(cleanDesc)}
              </p>

              <!-- Highlights -->
              <div style="background: #fafaf9; border-radius: 12px; padding: 16px; border: 1px solid #f5f5f4; margin-bottom: 24px;">
                <h3 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">✨ Artisan Highlights</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #57534e; line-height: 1.6;">
                  <li>100% Handcrafted by skilled Indian artisans using premium milk cotton yarn</li>
                  <li>Everlasting keepsake that never wilts or fades</li>
                  <li>Safe & secure checkout with free shipping over ₹999</li>
                </ul>
              </div>

              <div>
                <a href="${productUrl}" style="display: block; text-align: center; background: #881337; color: #fff; padding: 14px 28px; border-radius: 9999px; font-weight: 700; font-size: 15px; text-decoration: none;">
                  View & Personalize Options →
                </a>
              </div>
            </div>
          </div>
        </main>
        ${renderFooter()}
        `;

        const productHtml = baseHtml
            .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(p.name)} (Handmade) - ₹${p.price} | Crochet Wali</title>`)
            .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${escapeHtml(metaDesc)}"`)
            .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="${productUrl}"`)
            .replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(productSchema, null, 2)}\n  </script>\n  <script type="application/ld+json">\n${JSON.stringify(breadcrumbsSchema, null, 2)}\n  </script>\n</head>`)
            .replace('<div id="root"></div>', `<div id="root">${productContentHtml}</div>`);

        fs.writeFileSync(path.resolve(productDir, 'index.html'), productHtml, 'utf8');
    }
    console.log(`Pre-rendered ${products.length} product pages.`);

    // 5. PRE-RENDER CATEGORIES PAGE (dist/categories/index.html)
    console.log('Pre-rendering Categories (dist/categories/index.html)...');
    const categoriesDir = path.resolve(distDir, 'categories');
    fs.mkdirSync(categoriesDir, { recursive: true });

    const categoriesContent = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px 20px;">
      <h1 style="font-size: 32px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">Handmade Crochet Categories</h1>
      <p style="color: #78716c; font-size: 15px; margin: 0 0 32px;">Explore our curated artisanal collections crafted with care in India.</p>

      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        ${categoryPills.filter(c => c.label !== 'All Creations').map(c => `
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 24px; display: flex; flex-direction: column;">
            <h2 style="font-size: 20px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">${escapeHtml(c.label)}</h2>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Explore our handcrafted ${escapeHtml(c.label.toLowerCase())} collection.</p>
            <a href="${c.href}" style="color: #881337; font-weight: 700; font-size: 14px; text-decoration: none;">Browse ${escapeHtml(c.label)} →</a>
          </div>
        `).join('')}
      </section>
    </main>
    ${renderFooter()}
    `;

    const categoriesHtml = baseHtml
        .replace(/<title>.*?<\/title>/, `<title>Handmade Crochet Categories & Collections | Crochet Wali</title>`)
        .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="Explore handcrafted crochet flower pots, bouquets, keychains, bridal gajra, and gift hampers at Crochet Wali."`)
        .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://www.crochetwali.in/categories"`)
        .replace('<div id="root"></div>', `<div id="root">${categoriesContent}</div>`);

    fs.writeFileSync(path.resolve(categoriesDir, 'index.html'), categoriesHtml, 'utf8');

    console.log(`Pre-rendered dist/categories/index.html`);

    // 6. PRE-RENDER CUSTOM-DESIGN LANDING PAGE (dist/custom-design/index.html)
    console.log('Pre-rendering Custom Design Landing Page (dist/custom-design/index.html)...');
    const customDesignDir = path.resolve(distDir, 'custom-design');
    fs.mkdirSync(customDesignDir, { recursive: true });

    const customDesignFaqs = [
      {
        question: "How do I order a custom design?",
        answer: "Share your reference photo or idea on WhatsApp, choose yarn shades and size with the artisan, and the piece is handcrafted for you."
      },
      {
        question: "What is the minimum order?",
        answer: "MOQ is 1 piece for retail gifts; orders of 10+ pieces qualify for bulk wedding/event discounts."
      },
      {
        question: "How long does a custom order take?",
        answer: "2–4 days crafting plus 4–7 business days shipping across India"
      },
      {
        question: "What can I customise?",
        answer: "Custom names, dates, quotes, colour palettes, and bouquet combinations, with 30+ yarn shades to choose from."
      },
      {
        question: "Do you deliver across India?",
        answer: "Yes, custom orders are shipped across India in rigid gift-ready packaging."
      },
      {
        question: "Can I share a reference image from Pinterest or Instagram?",
        answer: "Yes! You can share screenshots, Pinterest pins, or reference sketches directly through WhatsApp. Head artisan Sana reviews the image to assess crochet feasibility and translates it into handmade yarn stitches."
      },
      {
        question: "How is the price of a custom crochet order calculated?",
        answer: "Because every custom piece is unique, pricing is provided by upfront quotation based on design complexity, dimensions, yarn requirements, and quantity before you confirm your order."
      },
      {
        question: "Can I request delivery before a specific birthday or anniversary?",
        answer: "Yes, please share your required delivery date during consultation. We will verify if your timeline fits within our 2–4 days crafting plus 4–7 business days transit schedule."
      },
      {
        question: "What payment methods are available?",
        answer: "We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, and Debit/Credit Cards via secure payment links once your quotation and design details are confirmed."
      },
      {
        question: "Will the finished handmade product look exactly like my reference image?",
        answer: "Handmade crochet and embroidery have authentic artisanal individuality. We replicate the reference style, colors, and proportions as closely as possible, and we share progress photos of your finished creation before dispatch."
      }
    ];

    const customFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": customDesignFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const customServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Crochet & Personalized Embroidery Gifts",
      "serviceType": "Custom crochet and embroidery gifts",
      "provider": {
        "@type": "Organization",
        "@id": "https://www.crochetwali.in/#organization",
        "name": "Crochet Wali",
        "url": "https://www.crochetwali.in"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "description": "Handcrafted custom crochet flower bouquets, plushies, amigurumi, keychains, bridal accessories, and personalized embroidery made to order in India.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "description": "Custom quotation provided based on design complexity, yarn selection, and dimensions."
      }
    };

    const customBreadcrumbsSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.crochetwali.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Custom Crochet & Embroidery Gifts",
          "item": "https://www.crochetwali.in/custom-design"
        }
      ]
    };

    const customDesignContent = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <!-- Breadcrumb Navigation -->
      <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
        <a href="/" style="color: #78716c; text-decoration: none;">Home</a>
        <span>/</span>
        <span style="color: #881337; font-weight: 600;">Custom Crochet &amp; Embroidery Gifts</span>
      </nav>

      <!-- Hero Section -->
      <section style="text-align: center; max-width: 860px; margin: 0 auto 48px;">
        <span style="display: inline-block; background: #fff1f2; color: #881337; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">
          ✨ Bespoke Handcrafted Artistry in India
        </span>
        <h1 style="font-size: clamp(28px, 4.5vw, 44px); font-weight: 800; color: #1c1917; line-height: 1.2; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">
          Custom Crochet &amp; Embroidery Gifts Made to Order
        </h1>
        <p style="font-size: clamp(15px, 2vw, 18px); color: #57534e; line-height: 1.7; margin: 0 0 28px;">
          Transform your creative vision into everlasting keepsakes. From custom crochet bouquets and adorable plushies to personalized bridal accessories and hand-embroidered keepsakes — handcrafted with premium milk cotton yarn in India.
        </p>

        <!-- Trust Badges -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 20px; margin-bottom: 32px; font-size: 13px; font-weight: 600; color: #44403c;">
          <span style="display: flex; align-items: center; gap: 6px;">🧶 100% Handcrafted in India</span>
          <span style="display: flex; align-items: center; gap: 6px;">⏱️ 2–4 Days Crafting Time</span>
          <span style="display: flex; align-items: center; gap: 6px;">🚚 Pan-India Tracked Courier (4–7 Days Transit)</span>
          <span style="display: flex; align-items: center; gap: 6px;">💬 Direct WhatsApp Artisan Support</span>
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
          <a href="#whatsapp-hub" style="display: inline-block; background: #881337; color: #fff; padding: 14px 32px; border-radius: 9999px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 14px rgba(136, 19, 55, 0.25);">
            Start Your Custom Order ↓
          </a>
          <a href="https://wa.me/917428013214?text=Hi%20Sana%20%28Crochet%20Wali%29%2C%20I%20would%20like%20to%20enquire%20about%20a%20custom%20order%21" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #fff; padding: 14px 28px; border-radius: 9999px; font-weight: 700; font-size: 15px; text-decoration: none;">
            WhatsApp Us: +91 74280 13214
          </a>
        </div>
      </section>

      <!-- How It Works (4 Steps) -->
      <section style="background: #fafaf9; border-radius: 24px; padding: 36px 24px; margin-bottom: 56px; border: 1px solid #f5f5f4;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 26px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">
            How Your Custom Creation Comes to Life
          </h2>
          <p style="color: #78716c; font-size: 15px; margin: 0;">Our simple 4-step process.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">
          <div style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4;">
            <span style="display: inline-block; background: #fff1f2; color: #881337; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 8px; margin-bottom: 12px;">Step 1</span>
            <h3 style="font-size: 16px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">Share Your Idea</h3>
            <p style="font-size: 13px; color: #57534e; line-height: 1.6; margin: 0;">Send your photo, colors, or design idea on WhatsApp.</p>
          </div>
          <div style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4;">
            <span style="display: inline-block; background: #fff1f2; color: #881337; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 8px; margin-bottom: 12px;">Step 2</span>
            <h3 style="font-size: 16px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">We Design</h3>
            <p style="font-size: 13px; color: #57534e; line-height: 1.6; margin: 0;">We customize your design and share the price & timeline.</p>
          </div>
          <div style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4;">
            <span style="display: inline-block; background: #fff1f2; color: #881337; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 8px; margin-bottom: 12px;">Step 3</span>
            <h3 style="font-size: 16px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">Confirm Your Order</h3>
            <p style="font-size: 13px; color: #57534e; line-height: 1.6; margin: 0;">Approve the details and pay securely via UPI or Card.</p>
          </div>
          <div style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4;">
            <span style="display: inline-block; background: #fff1f2; color: #881337; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 8px; margin-bottom: 12px;">Step 4</span>
            <h3 style="font-size: 16px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">Crafted & Delivered</h3>
            <p style="font-size: 13px; color: #57534e; line-height: 1.6; margin: 0;">Handmade in 2–4 days and delivered across India in 4–7 business days.</p>
          </div>
        </div>
      </section>

      <!-- Custom Masterpieces Gallery -->
      <section style="margin-bottom: 56px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 12px; font-weight: 700; color: #881337; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 6px;">Our Portfolio</span>
          <h2 style="font-size: 26px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">
            Custom Masterpieces Portfolio
          </h2>
          <p style="color: #78716c; font-size: 15px; margin: 0;">A glimpse into authentic handcrafted items created with love for clients across India.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778557378262-05kqnn.webp" alt="Handmade Crochet Rose Bouquet by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Forever Bouquet</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Crochet Rose Bouquet</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778595840761-7awolk.webp" alt="Handcrafted Crochet Wrist Gajra Bracelet Pair by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Bridal &amp; Festive</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Crochet Wrist Gajras</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788871942005-ny3r2h.webp" alt="Handcrafted Crochet Bunny Amigurumi Plushie by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Amigurumi Dolls</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Crochet Bunny Plushie</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788855782064-kq4e6h.webp" alt="Handmade Crochet Sunflower Keychain Charm by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Bag &amp; Key Charm</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Crochet Sunflower Keychain</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1793065438576-zio7zh.webp" alt="Handcrafted 3D Rose Granny Square Crochet Bag by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Artisanal Bags</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">3D Rose Granny Square Bag</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1793064727459-179tn.webp" alt="Handmade Crochet Tulip Flower Pot Keepsake by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Keepsake Pots</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Crochet Tulip Flower Pot</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1788879077093-l7a3x.webp" alt="Handmade Traditional Crochet Floral Parandi by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Hair Accessories</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Crochet Floral Parandi</h4>
            </div>
          </div>
          <div style="border-radius: 16px; overflow: hidden; background: #fafaf9; border: 1px solid #f5f5f4;">
            <img src="https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/images/products/1778561579733-7z4q8i.webp" alt="Handcrafted Floral Embroidery Hair Clips by Crochet Wali" style="width: 100%; aspect-ratio: 1; object-fit: cover;" width="300" height="300" loading="lazy" />
            <div style="padding: 12px 14px;">
              <span style="font-size: 11px; color: #881337; font-weight: 700; text-transform: uppercase;">Personalized Embroidery</span>
              <h4 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 2px 0 0;">Embroidery Floral Clips</h4>
            </div>
          </div>
        </div>
      </section>

<!-- Request Your Custom Crochet Gift Card (Clean & Simple) -->
      <section id="whatsapp-hub" style="max-width: 440px; margin: 0 auto 56px; padding: 0 20px;">
        <div style="background: #fff; border-radius: 28px; border: 1px solid #e7e5e4; padding: 36px 28px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          <div style="width: 56px; height: 56px; border-radius: 9999px; background: #e6f7ef; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
          </div>
          <h2 style="font-size: 28px; font-weight: 700; color: #1c1917; line-height: 1.25; margin: 0 0 14px; font-family: 'Playfair Display', Georgia, serif;">
            Request Your<br />Custom Crochet Gift
          </h2>
          <p style="font-size: 13.5px; color: #57534e; line-height: 1.6; margin: 0 auto 24px; max-width: 320px;">
            Simply message us on WhatsApp with your personalized gift idea, color preferences, or reference images for your custom crochet flowers or plushie, and we'll handcraft it for you in India.
          </p>
          <a href="https://wa.me/917428013214?text=Hi%20Sana%20%28Crochet%20Wali%29%2C%20I%20would%20like%20to%20request%20a%20custom%20crochet%20gift.%20Here%20are%20my%20ideas%2Freference%20photos%3A" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 10px; background: #0d6e5d; color: #fff; padding: 15px 24px; border-radius: 16px; font-weight: 700; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none; box-shadow: 0 4px 12px rgba(13, 110, 93, 0.25);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            <span>CHAT ON WHATSAPP</span>
          </a>
          <p style="font-size: 11.5px; color: #78716c; margin: 16px 0 0;">
            Average response time: &lt; 1 hour &middot; Delivery available all over India
          </p>
        </div>
      </section>

            <!-- Personalization & Delivery Expectations -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 56px;">
        <div style="background: #fafaf9; border-radius: 20px; padding: 28px; border: 1px solid #f5f5f4;">
          <h3 style="font-size: 20px; font-weight: 700; color: #1c1917; margin: 0 0 16px;">🎨 Personalization Options</h3>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #57534e; line-height: 1.8;">
            <li><strong>30+ Yarn Shades:</strong> Match lehengas, room decor, or favorite pastel and vibrant tones.</li>
            <li><strong>Custom Sizes &amp; Counts:</strong> Specify bouquet stems (single, 3, 5, 7+) or plushie dimensions.</li>
            <li><strong>Personalized Lettering:</strong> Add hand-embroidered names, wedding dates, or initials.</li>
            <li><strong>Gift Ready Packaging:</strong> Includes protective wrapping and handwritten note on request.</li>
            <li><strong>Artisanal Individuality:</strong> Every stitch is crafted by hand, giving each creation unique character.</li>
          </ul>
        </div>
        <div style="background: #fafaf9; border-radius: 20px; padding: 28px; border: 1px solid #f5f5f4;">
          <h3 style="font-size: 20px; font-weight: 700; color: #1c1917; margin: 0 0 16px;">⏱️ Timeline &amp; Pricing Expectations</h3>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #57534e; line-height: 1.8;">
            <li><strong>Transparent Quotation:</strong> Calculated individually based on complexity, size, and crafting hours. No hidden fees.</li>
            <li><strong>Handmade Crafting:</strong> 2 to 4 business days to craft your bespoke piece with meticulous care.</li>
            <li><strong>Transit Across India:</strong> 4 to 7 business days delivery via trusted courier services with real-time tracking.</li>
            <li><strong>Advance Planning:</strong> For weddings, anniversaries, or bulk hampers, order 2–3 weeks ahead.</li>
            <li><strong>Direct Artisan Contact:</strong> Chat directly with founder Sana on WhatsApp for immediate guidance.</li>
          </ul>
        </div>
      </section>

            <!-- Verified Client Stories (VERBATIM) -->
      <section style="margin-bottom: 56px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 26px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">
            Verified Client Stories
          </h2>
          <p style="color: #78716c; font-size: 15px; margin: 0;">Genuine experiences from clients who trusted us with their custom creations.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div style="background: #fafaf9; border-radius: 16px; padding: 24px; border: 1px solid #f5f5f4;">
            <div style="display: flex; gap: 4px; color: #f59e0b; margin-bottom: 12px;">★★★★★</div>
            <p style="font-size: 14px; color: #44403c; line-height: 1.7; font-style: italic; margin: 0 0 16px;">
              &ldquo;Ordered a custom crochet bridal bouquet for my wedding and it was beyond gorgeous! The colors matched my lehenga perfectly, and now I have a keepsake that will never wilt. Sana was so patient throughout the process.&rdquo;
            </p>
            <div>
              <strong style="display: block; font-size: 14px; color: #1c1917;">Sneha P.</strong>
              <span style="font-size: 12px; color: #78716c;">Mumbai &bull; Custom Bridal Crochet Bouquet</span>
            </div>
          </div>
          <div style="background: #fafaf9; border-radius: 16px; padding: 24px; border: 1px solid #f5f5f4;">
            <div style="display: flex; gap: 4px; color: #f59e0b; margin-bottom: 12px;">★★★★★</div>
            <p style="font-size: 14px; color: #44403c; line-height: 1.7; font-style: italic; margin: 0 0 16px;">
              &ldquo;Sana recreated our favorite cartoon characters as crochet plushies for our anniversary. The stitching quality, softness, and detailing were unbelievable. Delivered right on schedule in Bengaluru.&rdquo;
            </p>
            <div>
              <strong style="display: block; font-size: 14px; color: #1c1917;">Rahul M.</strong>
              <span style="font-size: 12px; color: #78716c;">Bengaluru &bull; Amigurumi Couple Plushies</span>
            </div>
          </div>
          <div style="background: #fafaf9; border-radius: 16px; padding: 24px; border: 1px solid #f5f5f4;">
            <div style="display: flex; gap: 4px; color: #f59e0b; margin-bottom: 12px;">★★★★★</div>
            <p style="font-size: 14px; color: #44403c; line-height: 1.7; font-style: italic; margin: 0 0 16px;">
              &ldquo;Got a customized floral embroidery hoop made with my niece&apos;s birth details. The finish is immaculate and looks so elegant in the nursery. Highly recommend Crochet Wali for bespoke gifts!&rdquo;
            </p>
            <div>
              <strong style="display: block; font-size: 14px; color: #1c1917;">Ananya T.</strong>
              <span style="font-size: 12px; color: #78716c;">Delhi &bull; Personalized Name Embroidery Hoop</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Supported Categories Grid -->
      <section style="margin-bottom: 56px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 12px; font-weight: 700; color: #881337; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 6px;">What We Make</span>
          <h2 style="font-size: 26px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">
            Custom Crochet &amp; Handmade Categories
          </h2>
          <p style="color: #78716c; font-size: 15px; margin: 0; max-width: 600px; margin-left: auto; margin-right: auto;">
            Every category below is handcrafted from scratch. Choose a design style to get started or request your own unique creation.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">1. Custom Crochet Bouquets &amp; Arrangements</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Everlasting roses, sunflowers, tulips, daisies, and lavender woven with premium milk cotton yarn that never wither.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Custom Bouquet →</a>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">2. Crochet Plushies, Dolls &amp; Amigurumi</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Customized cute animals, mini character dolls, baby keepsakes, and portrait figurines with hypoallergenic fiberfill.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Custom Plushie →</a>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">3. Handcrafted Crochet Keychains &amp; Bag Charms</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Personalized initial keychains, floral charms, mini animals, and matching couple charms with anti-rust alloy hardware.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Custom Keychains →</a>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">4. Crochet Hair Accessories &amp; Bridal Gajras</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Delicate jasmine gajra pairs, floral hair clips, headbands, and traditional wedding accessories tailored to your wedding attire.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Bridal Accessories →</a>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">5. Crochet Bags, Pouches &amp; Sleeves</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Artisanal tote bags, granny square slings, mobile pouches, and book sleeves in your favorite custom color palette.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Custom Bag →</a>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">6. Personalized Hand Embroidery Keepsakes</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Custom botanical embroidery hoops with couples' names, wedding anniversary dates, baby birth announcements, and monograms.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Custom Embroidery →</a>
          </div>
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 20px; display: flex; flex-direction: column;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">7. Custom Gift Hampers &amp; Bulk Orders</h3>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">Bespoke bridesmaid gift hampers, baby shower favor sets, festive hampers, and corporate event gifts with tiered quotation.</p>
            <a href="#whatsapp-hub" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Request Bulk Custom Order →</a>
          </div>
        </div>
      </section>

      <!-- Frequently Asked Questions -->
      <section style="margin-bottom: 56px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 26px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">
            Frequently Asked Questions
          </h2>
          <p style="color: #78716c; font-size: 15px; margin: 0;">Everything you need to know about our custom handcrafted crochet &amp; personalized embroidery.</p>
        </div>

        <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;">
          ${customDesignFaqs.map((faq, index) => `
            <details style="background: #fafaf9; border-radius: 12px; border: 1px solid #f5f5f4; padding: 18px 20px;">
              <summary style="font-size: 16px; font-weight: 700; color: #1c1917; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                <span>${index + 1}. ${escapeHtml(faq.question)}</span>
                <span style="color: #881337; font-weight: bold; font-size: 18px;">+</span>
              </summary>
              <p style="margin-top: 12px; font-size: 14px; color: #57534e; line-height: 1.7;">
                ${escapeHtml(faq.answer)}
              </p>
            </details>
          `).join('')}
        </div>
      </section>

      <!-- Bottom Direct Contact CTA Banner -->
      <section style="background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border-radius: 24px; padding: 40px 24px; text-align: center; border: 1px solid #fecdd3;">
        <h2 style="font-size: 24px; font-weight: 800; color: #881337; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">
          Ready to Bring Your Custom Idea to Life?
        </h2>
        <p style="font-size: 15px; color: #4c0519; margin: 0 0 24px; max-width: 600px; margin-left: auto; margin-right: auto;">
          Whether it is a custom bridal bouquet, a couple amigurumi, or a personalized embroidery keepsake — chat with founder Sana directly on WhatsApp for an immediate quotation.
        </p>
        <a href="https://wa.me/917428013214?text=Hi%20Sana%20%28Crochet%20Wali%29%2C%20I%20would%20like%20to%20discuss%20a%20custom%20crochet%20or%20embroidery%20gift%21" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #fff; padding: 14px 32px; border-radius: 9999px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);">
          Chat on WhatsApp: +91 74280 13214
        </a>
      </section>
    </main>
    ${renderFooter()}
    `;

    const customDesignHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>Custom Crochet Gifts &amp; Personalized Embroidery | Crochet Wali</title>`)
      .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="Order custom crochet gifts and personalised embroidery from Crochet Wali — handmade in India, 30+ yarn shades, MOQ just 1 piece. Share your idea today."`)
      .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://www.crochetwali.in/custom-design"`)
      .replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(customServiceSchema, null, 2)}\n  </script>\n  <script type="application/ld+json">\n${JSON.stringify(customBreadcrumbsSchema, null, 2)}\n  </script>\n  <script type="application/ld+json">\n${JSON.stringify(customFaqSchema, null, 2)}\n  </script>\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${customDesignContent}</div>`);

    fs.writeFileSync(path.resolve(customDesignDir, 'index.html'), customDesignHtml, 'utf8');
    console.log(`Pre-rendered dist/custom-design/index.html`);


    console.log('✅ All static pre-rendering completed successfully!');
}

prerender().catch(err => {
    console.error('Pre-rendering error:', err);
    process.exit(1);
});


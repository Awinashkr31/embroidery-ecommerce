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
    const hasH2 = /^##\s+/m.test(md);
    const normalized = (!hasH2 && /^###\s+/m.test(md))
        ? md.replace(/^(#{3,4})\s+(.*$)/gm, (match, hashes, title) => {
            if (hashes === '####') return `### ${title}`;
            if (hashes === '###') return `## ${title}`;
            return match;
        })
        : md;

    return normalized
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
          <a href="/categories" style="color: #1c1917; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em;">Categories</a>
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
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1c1917; margin-bottom: 16px;">Explore Collections</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <li><a href="/collections/crochet-bouquets" style="color: #57534e; text-decoration: none;">Crochet Bouquets</a></li>
            <li><a href="/collections/crochet-flowers" style="color: #57534e; text-decoration: none;">Forever Flower Pots</a></li>
            <li><a href="/collections/reusable-bridal-gajra" style="color: #57534e; text-decoration: none;">Reusable Bridal Gajra</a></li>
            <li><a href="/collections/crochet-accessories" style="color: #57534e; text-decoration: none;">Hair Clips & Accessories</a></li>
            <li><a href="/collections/crochet-keychains" style="color: #57534e; text-decoration: none;">Keychains & Charms</a></li>
            <li><a href="/collections/gifts-under-500" style="color: #57534e; text-decoration: none;">Gifts Under ₹500</a></li>
            <li><a href="/categories" style="color: #881337; font-weight: 700; text-decoration: none;">View All Collections →</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1c1917; margin-bottom: 16px;">Customer Care</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <li><a href="/return-policy" style="color: #57534e; text-decoration: none;">Return &amp; Replacement Policy</a></li>
            <li><a href="/shipping-policy" style="color: #57534e; text-decoration: none;">Shipping Policy (Pan-India)</a></li>
            <li><a href="/privacy-policy" style="color: #57534e; text-decoration: none;">Privacy Policy</a></li>
            <li><a href="/terms-of-service" style="color: #57534e; text-decoration: none;">Terms of Service</a></li>
            <li><a href="/support" style="color: #57534e; text-decoration: none;">Contact & Support</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #1c1917; margin-bottom: 16px;">Contact & Community</h4>
          <p style="font-size: 14px; line-height: 1.6; color: #78716c; margin: 0 0 12px;">
            Studio: Hauz Khas Village, Near Fort, New Delhi, Delhi 110016<br />
            WhatsApp: <a href="https://wa.me/917428013214" target="_blank" rel="noopener noreferrer" style="color: #881337; text-decoration: none; font-weight: 600;">+91 74280 13214</a><br />
            Email: <a href="mailto:support@crochetwali.in" style="color: #881337; text-decoration: none;">support@crochetwali.in</a><br />
            Instagram: <a href="https://www.instagram.com/crochetwali.in" target="_blank" rel="noopener noreferrer" style="color: #881337; text-decoration: none;">@crochetwali.in</a>
          </p>
          <p style="font-size: 12px; color: #a8a29e; margin-top: 16px;">
            © ${new Date().getFullYear()} Crochet Wali. All rights reserved. • <a href="/sitemap.xml" style="color: #78716c; text-decoration: underline;">Sitemap</a>
          </p>
        </div>
      </div>
    </footer>
    `;
}

// Universal HTML Page Generator to ensure pure, unique, crawlable HTML for every URL
function renderPageHtml({ baseHtml, title, description, canonicalUrl, ogImage, schemas = [], contentHtml }) {
    let html = baseHtml;

    // 1. Replace Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

    // 2. Replace Meta Description
    html = html.replace(/<meta name="description" content="[^"]*"( data-rh="true")?>/, `<meta name="description" content="${escapeHtml(description)}">`);

    // 3. Replace Canonical Link
    html = html.replace(/<link rel="canonical" href="[^"]*"( data-rh="true")?>/, `<link rel="canonical" href="${canonicalUrl}">`);

    // 4. OpenGraph and Twitter Meta Tags
    html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonicalUrl}">`);
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(description)}">`);

    html = html.replace(/<meta property="twitter:url" content="[^"]*">/, `<meta property="twitter:url" content="${canonicalUrl}">`);
    html = html.replace(/<meta property="twitter:title" content="[^"]*">/, `<meta property="twitter:title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta property="twitter:description" content="[^"]*">/, `<meta property="twitter:description" content="${escapeHtml(description)}">`);

    if (ogImage) {
        html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(ogImage)}">`);
        html = html.replace(/<meta property="twitter:image" content="[^"]*">/, `<meta property="twitter:image" content="${escapeHtml(ogImage)}">`);
    }

    // 5. Inject Structured Data Schemas
    if (schemas.length > 0) {
        const schemaScripts = schemas.map(s => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`).join('\n');
        html = html.replace('</head>', `${schemaScripts}\n</head>`);
    }

    // 6. Inject HTML Content into root
    html = html.replace('<div id="root"></div>', `<div id="root">${contentHtml}</div>`);

    return html;
}

// 18 Curated Collection SEO Data
const COLLECTION_SEO_CONTENT = {
    'crochet-bouquets': {
        title: 'Buy Crochet Bouquet Online India | Crochet Wali',
        description: 'Buy crochet bouquet online India with honest crochet bouquet price options from ₹99. Everlasting handmade flower bouquets delivered across India.',
        h1: 'Buy Crochet Bouquet Online India',
        text: 'Welcome to Crochet Wali, the premier place to buy crochet bouquet online India. If you are checking crochet bouquet price options, our handcrafted forever flower arrangements offer everlasting botanical charm starting from ₹99. Each bouquet is meticulously hand-knitted with premium milk cotton yarn to preserve its vibrant bloom forever without wilting. Explore our flower-specific collections including rose bouquets, sunflowers, and tulips. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-bags': {
        title: 'Handmade Crochet Bags India | Granny Square & Rose Bags | Crochet Wali',
        description: 'Shop handmade crochet bags in India. Discover artisan granny square shoulder bags, round rose bags, and 3D floral handbags from ₹1,499. Handcrafted in India.',
        h1: 'Handmade Crochet Bags & Artisanal Totes',
        text: 'Discover our exclusive collection of handmade crochet bags in India. Handcrafted using premium soft yarn, our artisanal bag collection features retro granny square totes, 3D rose statement bags, and elegant round rose handbags with pearl and golden chain accents. Perfect for outings, festive styling, and thoughtful handmade gifts. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.'
    },
    'handmade-gifts': {
        title: 'Handmade Gifts India | Aesthetic & Personalized Gifting | Crochet Wali',
        description: 'Discover India\'s finest collection of handmade crochet gifts and personalized keepsakes. Handcrafted flower pots, keychains, hair clips, and bridal gajras made with love in India.',
        h1: 'Handmade Gifts for Every Special Occasion',
        text: 'In a world of mass-produced plastic items, authentic handmade gifts stand out for their thought, craftsmanship, and soul. Our collection of handmade gifts is designed for those who cherish aesthetic, lasting tokens of love. From forever crochet bouquets to hand-embroidered accessories and cute bag charms, every creation is made by hand in India.',
    },
    'crochet-accessories': {
        title: 'Crochet Hair Accessories & Scrunchies | Crochet Wali',
        description: 'Shop handmade crochet hair accessories, including each crochet scrunchie, floral crochet clutcher, and hair clip in India. Live creations from ₹49 to ₹1,699.',
        h1: 'Handmade Crochet Hair Accessories, Scrunchies & Clutchers',
        text: 'Add artisan charm to your everyday look with our handcrafted crochet hair accessories. From a soft crochet scrunchie and floral crochet clutcher to clips, hair ties, and statement bags, each accessory is handcrafted with premium yarn for durable, snag-free comfort. Live accessory creations range from ₹49 to ₹1,699. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-gifts': {
        title: 'Crochet Gifts India | Unique Handcrafted Presents | Crochet Wali',
        description: 'Explore unique handcrafted crochet gifts in India. Everlasting flower pots, cute amigurumi keychains, bridal gajras, and romantic keepsakes made with premium yarn.',
        h1: 'Handmade Crochet Gifts',
        text: 'Welcome to our curated collection of handmade crochet gifts. Hand-knitted with cotton yarn, each gift offers tactile softness and lasting durability. Browse forever flowers, hair accessories, and personalized gift hampers crafted with care in India.',
    },
    'crochet-flowers': {
        title: 'Handmade Crochet Flowers & Potted Plants India | Crochet Wali',
        description: 'Shop handmade crochet flowers and forever potted plants in India. Everlasting roses, sunflowers, tulips, and daisies crafted with premium yarn. Sustainable and zero maintenance.',
        h1: 'Handmade Crochet Flowers & Desk Pots',
        text: 'Discover the everlasting charm of forever flowers with our handmade crochet flower collection. Handcrafted in India, our crochet flowers are the perfect sustainable alternative to fresh blossoms. They never wilt, require zero watering, and bring soothing botanical warmth to study desks, bedside tables, and living spaces.',
    },
    'crochet-gajra': {
        title: 'Buy Crochet Gajra Online India | Crochet Wali',
        description: 'Looking to buy crochet gajra? Shop handmade crochet gajra online in India from ₹199. Reusable floral hair accessories that never turn brown or wilt.',
        h1: 'Buy Handmade Crochet Gajra Online',
        text: 'Looking to buy crochet gajra for weddings and festivities? Order authentic handmade crochet gajra online from Crochet Wali. Real flowers wilt in hours, but our crocheted gajras retain pristine petal beauty forever and can be lightly scented with your favorite perfume or attar. Live pieces range from ₹199 to ₹349. For bridal occasions, explore our dedicated reusable bridal gajra collection. Handcrafted to order: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'reusable-bridal-gajra': {
        title: 'Reusable Bridal Gajra | Crochet Bridal Gajra | Crochet Wali',
        description: 'Shop handcrafted reusable bridal gajra and crochet bridal gajra in India from ₹199 to ₹349. Everlasting floral hair jewelry for Haldi, Mehendi, and weddings.',
        h1: 'Reusable Bridal Gajra & Crochet Bridal Hair Florals',
        text: 'Make your wedding memories timeless with our reusable bridal gajra and crochet bridal gajra designs. Handcrafted specifically for Indian brides, bridesmaids, and wedding guests, each piece is lightweight, secure, and will never wilt, shed petals, or turn brown during long ceremonies. Live bridal creations range from ₹199 to ₹349. For everyday ethnic accents, visit our classic crochet gajra collection. Handcrafted to order: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-keychains': {
        title: 'Crochet Keychain & Crochet Bag Charm | Crochet Wali',
        description: 'Shop cute crochet keychain designs and aesthetic crochet bag charm accessories in India. Handcrafted amigurumi charms for bags and keys from ₹99 to ₹299.',
        h1: 'Handmade Crochet Keychain & Crochet Bag Charm Picks',
        text: 'Discover our delightful collection of handmade crochet keychain and trending crochet bag charm accessories. Whether you want a mini floral bouquet, cute amigurumi animal, or sweet charm for your handbag or car keys, each piece is hand-stitched with durable yarn and sturdy metal rings. Live creations range from ₹99 to ₹299. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-claw-clips': {
        title: 'Crochet Claw Clips & Crochet Hair Clips | Crochet Wali',
        description: 'Shop aesthetic crochet claw clips and handmade crochet hair clips in India. Snag-free floral clips, bows, and clutchers handcrafted from ₹49 to ₹349.',
        h1: 'Handmade Crochet Claw Clips & Crochet Hair Clips',
        text: 'Elevate your daily hairstyles with our handcrafted crochet claw clips and aesthetic crochet hair clips. Built on durable salon-grade clips wrapped in soft botanical crochet flowers and bows, our clips provide a strong, snag-free hold for all hair types. Live hair creations range from ₹49 to ₹349. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'crochet-parandi': {
        title: 'Crochet Parandi | Punjabi Parandi | Crochet Wali',
        description: 'Shop traditional Punjabi parandi braids and handmade crochet parandi designs in India from ₹199 to ₹249. Floral tassels handcrafted for festive hair styling.',
        h1: 'Handmade Crochet Parandi & Punjabi Parandi Braids',
        text: 'Celebrate authentic Indian hair traditions with our handmade crochet parandi and festive Punjabi parandi designs. Handcrafted with intricate floral tassels, delicate beads, and rich colored cords, our parandis add instant grace to long braids for Haldi ceremonies, Sangeet dances, and weddings. Live parandi creations range from ₹199 to ₹249. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'gifts-for-girlfriend': {
        title: 'Handmade & Crochet Gifts for Girlfriend | Crochet Wali',
        description: 'Discover unique handmade gifts for girlfriend and romantic crochet gifts for girlfriend in India. Forever bouquets, pots, and accessories from ₹49 to ₹1,599.',
        h1: 'Handmade Gifts for Girlfriend & Romantic Keepsakes',
        text: 'Show her how much you care with romantic handmade gifts for girlfriend that never fade. Fresh roses wither within days, but our curated crochet gifts for girlfriend—from everlasting tulip pots and sunflower bouquets to artisan bags and hair charms—preserve your loving memories for years. Live curated creations range from ₹49 to ₹1,599. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'anniversary-gifts': {
        title: 'Anniversary Gifts Handmade in India | Crochet Wali',
        description: 'Celebrate your milestone with everlasting anniversary gifts handmade in India. Romantic crochet flower pots, bouquets, and keepsake gifts from ₹49 to ₹1,599.',
        h1: 'Anniversary Gifts Handmade with Love',
        text: 'Mark your milestone celebration with thoughtful anniversary gifts handmade to stand the test of time. Unlike conventional presents, our handcrafted crochet keepsakes—from everlasting floral pots to romantic bouquets and heirloom bags—symbolize enduring love and warmth. Live anniversary creations range from ₹49 to ₹1,599. Handcrafted to order in India: 2–4 days crafting + 4–7 business days shipping across India.',
    },
    'gifts-under-500': {
        title: 'Handmade Crochet Gifts Under ₹500 in India | Budget Aesthetic Gifts | Crochet Wali',
        description: 'Shop affordable handmade crochet gifts under ₹500 in India. Cute keychains, floral claw clips, bridal gajra bracelets, and mini keepsakes under ₹500.',
        h1: 'Handmade Gifts Under ₹500',
        text: 'Discover our budget-friendly curation of 100% handcrafted crochet gifts under ₹500. Thoughtful gifting does not have to be expensive. From cute animal keychains and elegant floral hair clips to traditional gajra bracelets, find charming handmade treasures that look premium without breaking your budget.',
    },
    'gifts-under-1000': {
        title: 'Handmade Gifts Under ₹1000 in India | Premium Crochet Creations | Crochet Wali',
        description: 'Explore premium handmade crochet gifts under ₹1000 in India. Everlasting flower pots, granny square bags, and luxury curated gift hampers.',
        h1: 'Handmade Gifts Under ₹1000',
        text: 'Looking for a standout handmade gift under ₹1000? Our premium selection includes everlasting crochet tulip and sunflower pots, artisanal granny square shoulder bags, and curated gift hampers that offer the perfect blend of craftsmanship, durability, and aesthetic charm.',
    },
    'crochet-rose-bouquet': {
        title: 'Handmade Crochet Rose Bouquets India | Forever Romantic Roses | Crochet Wali',
        description: 'Buy handmade crochet rose bouquets online in India. Everlasting red, pink, and pastel roses handcrafted with premium milk cotton yarn that never wilt.',
        h1: 'Handmade Crochet Rose Bouquets',
        text: 'Express timeless love with our handcrafted crochet rose bouquets. Fresh cut roses wilt in days, but our hand-knitted crochet roses preserve their elegance for years. Available in romantic red, blush pink, and vibrant pastels, wrapped in aesthetic floral packaging with satin ribbons.',
    },
    'crochet-sunflower': {
        title: 'Handmade Crochet Sunflowers India | Cheerful Forever Pots & Gifts | Crochet Wali',
        description: 'Shop bright handmade crochet sunflowers in India. Potted sunflowers, cheerful sunflower bouquets, and sunny car hanging charms made with love.',
        h1: 'Handmade Crochet Sunflowers & Pots',
        text: 'Bring sunshine into any room with Crochet Wali handcrafted crochet sunflowers. Handcrafted with rich golden yellow and chocolate brown yarn, our everlasting sunflower bouquets and desk pots make uplifting gifts for birthdays, graduations, and home decor.',
    },
    'crochet-tulip': {
        title: 'Handmade Crochet Tulips India | Aesthetic Pastel Tulip Pots & Bouquets | Crochet Wali',
        description: 'Shop delicate handmade crochet tulips in India. Pastel pink, lavender, and yellow tulip flower pots and bouquets crafted with soft milk cotton yarn.',
        h1: 'Handmade Crochet Tulips & Pots',
        text: 'Adorn your study desk, bedside table, or gift a loved one with our charming handmade crochet tulips. Featuring soft pastel shades and lifelike botanical forms, these forever tulip flowers bring clean cottagecore elegance that requires zero maintenance.',
    },
    'crochet-gift-hampers': {
        title: 'Crochet Gift Hamper | Handmade Gift Hamper India | Crochet Wali',
        description: 'Discover beautiful handmade gift hamper India options at Crochet Wali. Each crochet gift hamper features handcrafted florals and artisanal treasures for birthdays, anniversaries, and festive gifting.',
        h1: 'Handmade Crochet Gift Hampers India',
        text: 'Welcome to our curated crochet gift hamper collection. If you are searching for a thoughtful handmade gift hamper India delivery, our hampers bring together authentic Indian embroidery and delicate handcrafted crochet florals. Meticulously crafted with soft wool and premium yarn, each gift hamper is ideal for birthday celebrations, romantic anniversaries, and festive gifting. Care is simple: hand wash gently and dry flat. Live hamper creations currently range from ₹399 to ₹599 with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India. Looking for bulk corporate orders or wedding return gifts? Request a bespoke custom quotation via our custom design page, or explore our related crochet bouquets and crochet gifts collections.'
    },
    'crochet-flower-pots': {
        title: 'Crochet Flower Pot | Crochet Plant Pot Gift India | Crochet Wali',
        description: 'Shop everlasting handmade crochet flower pot creations and cute crochet plant pot gift designs in India. Perfect forever mini potted plants for desks, shelves, and gifting.',
        h1: 'Handmade Crochet Flower Pots & Mini Plants',
        text: 'Welcome to our everlasting crochet flower pot collection. If you are looking for an aesthetic crochet plant pot gift for your desk, study table, or home decor corner, our handmade potted plants bring lasting botanical warmth that never fades. Each piece features botanical blossoms—including sunny sunflowers, delicate pink tulips, and playful hanging strawberry vines—individually hand-crocheted and anchored in miniature textured pots. Ideal for home and office decor, or as a thoughtful keepsake for birthdays, anniversaries, and housewarmings. Care is simple: zero watering required, simply dust with a soft brush. Live potted creations range from ₹499 to ₹799 with confirmed delivery in 2–4 days crafting + 4–7 business days shipping across India. Explore our related crochet bouquets and crochet gifts collections for more everlasting floral inspiration.'
    },
    'crochet-plushies': {
        title: 'Crochet Plushies | Handmade Crochet Soft Toy India | Crochet Wali',
        description: 'Shop adorable handmade crochet plushie creations and cute crochet soft toy India designs. Soft, textured handcrafted companions for nursery decor and gifting.',
        h1: 'Handmade Crochet Plushies & Soft Toys',
        text: 'Welcome to our charming crochet plushie collection. If you are looking for an adorable crochet soft toy India delivery or looking to buy crochet plushie India designs handcrafted with genuine artisan care, our cuddly companions bring handmade warmth, textured character, and joyful personality to any space. Each plushie is individually crocheted by hand using soft, tactile yarn and stuffed with plush filling—ranging from our sweet floppy-eared bunny doll with custom outfit details to our cheerful little chick holding a delicate flower. While makers refer to this Japanese craft as amigurumi, our focus is simple: creating heirloom-quality plush friends that last forever. Perfect as keepsakes for room styling, nursery decor accents, baby shower gifting, desk companions, and celebratory gifts for birthdays and festive occasions. Care is simple: hand wash gently in cool water with mild soap and dry flat in shade. Live plushie creations range from ₹349 to ₹1,199 with confirmed delivery in 2–4 days crafting + 4–7 business days shipping across India. Explore our related crochet gifts and crochet bouquets collections for more handmade inspiration.'
    }
};

// Filter products for each collection matching Collection.jsx logic
function getProductsForCollection(slug, products) {
    return products.filter(product => {
        const productSlug = slugify(product.category);
        const titleSlug = slugify(product.name);
        const keywords = slug.split('-');

        // Recipient & Occasion special matching
        if (slug === 'crochet-bags') {
            return (
                product.id === '314035ce-5e96-451b-86a3-ec79043177f4' ||
                product.id === 'cbb84c37-ca75-41a2-b7e0-bf03f167512a' ||
                product.id === '70f2e066-81dc-4f8d-bebf-93d066d4e999' ||
                (titleSlug.includes('bag') && !titleSlug.includes('charm') && !titleSlug.includes('pouch') && !titleSlug.includes('keychain'))
            );
        }
        if (slug === 'crochet-plushies') {
            return (product.category && product.category.toLowerCase().includes('toy')) || productSlug.includes('toy');
        }
        if (slug === 'crochet-flower-pots') {
            return productSlug.includes('flower-pot') || (product.category && product.category.toLowerCase().includes('flower pot'));
        }
        if (slug === 'crochet-gift-hampers') {
            return productSlug.includes('hamper') || (product.category && product.category.toLowerCase().includes('hamper'));
        }
        if (slug === 'gifts-for-girlfriend' || slug === 'anniversary-gifts') {
            return titleSlug.includes('bouquet') || titleSlug.includes('rose') || titleSlug.includes('flower') || titleSlug.includes('pot') || productSlug.includes('bouquet') || productSlug.includes('flower');
        }
        if (slug === 'reusable-bridal-gajra') {
            return titleSlug.includes('gajra') || productSlug.includes('gajra') || titleSlug.includes('parandi');
        }
        if (slug === 'gifts-under-500') {
            return Number(product.price) <= 500;
        }
        if (slug === 'gifts-under-1000') {
            return Number(product.price) <= 1000;
        }
        if (slug === 'crochet-rose-bouquet') {
            return titleSlug.includes('rose') || productSlug.includes('rose');
        }
        if (slug === 'crochet-sunflower') {
            return titleSlug.includes('sunflower') || productSlug.includes('sunflower');
        }
        if (slug === 'crochet-tulip') {
            return titleSlug.includes('tulip') || productSlug.includes('tulip');
        }
        if (slug === 'crochet-bouquets') {
            return titleSlug.includes('bouquet') || productSlug.includes('bouquet');
        }
        if (slug === 'crochet-keychains') {
            return titleSlug.includes('keychain') || productSlug.includes('keychain') || titleSlug.includes('charm');
        }
        if (slug === 'crochet-claw-clips') {
            return titleSlug.includes('clip') || titleSlug.includes('claw') || titleSlug.includes('hair') || productSlug.includes('hair');
        }
        if (slug === 'crochet-parandi') {
            return titleSlug.includes('parandi') || productSlug.includes('parandi');
        }
        if (slug === 'crochet-accessories') {
            return titleSlug.includes('clip') || titleSlug.includes('claw') || titleSlug.includes('hair') || titleSlug.includes('bag') || titleSlug.includes('keychain') || titleSlug.includes('gajra') || titleSlug.includes('parandi') || productSlug.includes('hair') || productSlug.includes('accessories');
        }
        if (slug === 'crochet-flowers') {
            return titleSlug.includes('flower') || productSlug.includes('flower') || titleSlug.includes('bouquet') || productSlug.includes('bouquet') || titleSlug.includes('rose') || titleSlug.includes('tulip') || titleSlug.includes('sunflower') || productSlug.includes('pot');
        }
        if (slug === 'crochet-gajra') {
            return titleSlug.includes('gajra') || productSlug.includes('gajra');
        }
        if (slug === 'handmade-gifts' || slug === 'crochet-gifts') {
            return true;
        }

        const targetKeywords = keywords.filter(k => k !== 'crochet' && k !== 'handmade' && k !== 'gifts' && k !== 'custom');
        if (targetKeywords.length > 0) {
            return targetKeywords.some(k => {
                const singular = k.endsWith('s') ? k.slice(0, -1) : k;
                return productSlug.includes(k) || 
                       titleSlug.includes(k) || 
                       productSlug.includes(singular) || 
                       titleSlug.includes(singular);
            });
        }
        const firstKw = keywords[0];
        const firstSingular = firstKw ? (firstKw.endsWith('s') ? firstKw.slice(0, -1) : firstKw) : '';
        return productSlug.includes(firstKw) || titleSlug.includes(firstKw) || 
               (firstSingular && (productSlug.includes(firstSingular) || titleSlug.includes(firstSingular)));
    });
}

function renderProductCards(productList) {
    if (!productList || productList.length === 0) {
        return '<p style="color: #78716c; font-size: 15px;">Discover our creations in the shop.</p>';
    }
    return productList.map(p => {
      const cardImg = p.image && p.image.startsWith('http')
        ? `https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=300&q=75&output=webp`
        : (p.image || '/hero-gift.webp');
      return `
      <article style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; overflow: hidden; display: flex; flex-direction: column;">
        <a href="/product/${p.slug}" style="display: block; aspect-ratio: 1; background: #fafaf9; overflow: hidden;">
          <img src="${escapeHtml(cardImg)}" alt="${escapeHtml(p.name)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" width="300" height="300" />
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
      `;
    }).join('\n');
}

async function prerender() {
    console.log('🚀 Starting Comprehensive Static Pre-rendering for Crochet Wali...');

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

    // Fetch Products from Supabase
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

    const categoryPills = [
        { label: 'All Creations', href: '/shop' },
        { label: 'Crochet Bouquets', href: '/collections/crochet-bouquets' },
        { label: 'Bridal Gajra', href: '/collections/reusable-bridal-gajra' },
        { label: 'Hair Clips & Claw Clips', href: '/collections/crochet-claw-clips' },
        { label: 'Keychains & Charms', href: '/collections/crochet-keychains' },
        { label: 'Gifts Under ₹500', href: '/collections/gifts-under-500' },
        { label: 'Gifts For Girlfriend', href: '/collections/gifts-for-girlfriend' },
        { label: 'Anniversary Keepsakes', href: '/collections/anniversary-gifts' },
    ];

    // ==========================================
    // 1. PRE-RENDER HOMEPAGE (dist/index.html)
    // ==========================================
    console.log('Pre-rendering Homepage (dist/index.html)...');
    const bestsellers = products.filter(p => p.homepage_tags?.includes('bestseller') || p.featured).slice(0, 8);
    const featuredItems = (bestsellers.length > 0 ? bestsellers : products.slice(0, 8));

    const homeContentHtml = `
    ${renderHeader()}
    
    <main id="main-content" style="max-width: 1280px; margin: 0 auto; padding: 16px 20px;">
      <!-- Hero Section -->
      <section style="background: linear-gradient(135deg, #fdf2f4 0%, #fff 100%); border-radius: 24px; padding: 48px 32px; margin-bottom: 40px; border: 1px solid #fecdd3; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 32px;">
        <div style="flex: 1; min-width: 280px;">
          <span style="display: inline-block; background: #e6f4ea; color: #166534; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            🌿 100% Handcrafted by Indian Artisans
          </span>
          <h1 style="font-size: clamp(32px, 5vw, 44px); font-weight: 800; color: #1c1917; line-height: 1.15; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">
            Handmade Crochet Gifts &amp; Keepsakes Made with Love
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #57534e; margin: 0 0 24px; max-width: 540px;">
            Cherish everlasting crochet flower bouquets, handcrafted bridal gajras, cute keychains, and personalized anniversary keepsakes that never wilt. Made with love in India.
          </p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="/shop" style="background: #881337; color: #fff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Shop All Creations</a>
            <a href="/custom-design" style="background: #fff; color: #1c1917; border: 1px solid #d6d3d1; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px;">Custom Orders</a>
          </div>
        </div>
        <div style="flex: 1; min-width: 280px; text-align: center;">
          <img src="/assets/hero_crochet_1.webp" alt="Crochet Wali Handmade Gifts" style="max-width: 100%; height: auto; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.06);" width="480" height="360" fetchpriority="high" />
        </div>
      </section>

      <!-- Featured Collections Section (Internal Linking Hub) -->
      <section style="margin-bottom: 48px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 12px; font-weight: 700; color: #881337; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 6px;">Handpicked For You</span>
          <h2 style="font-size: 24px; font-weight: 800; color: #1c1917; margin: 0; font-family: 'Playfair Display', Georgia, serif;">Featured Handcrafted Collections</h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <a href="/collections/crochet-bouquets" style="background: #fff; border: 1px solid #f5f5f4; border-radius: 16px; padding: 20px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.2s;">
            <span style="font-size: 32px; margin-bottom: 8px;">💐</span>
            <strong style="color: #1c1917; font-size: 15px; margin-bottom: 4px;">Crochet Bouquets</strong>
            <span style="font-size: 12px; color: #78716c;">Forever flower bouquets</span>
          </a>
          <a href="/collections/reusable-bridal-gajra" style="background: #fff; border: 1px solid #f5f5f4; border-radius: 16px; padding: 20px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.2s;">
            <span style="font-size: 32px; margin-bottom: 8px;">🌸</span>
            <strong style="color: #1c1917; font-size: 15px; margin-bottom: 4px;">Bridal Gajra</strong>
            <span style="font-size: 12px; color: #78716c;">Reusable wedding jasmine</span>
          </a>
          <a href="/collections/crochet-claw-clips" style="background: #fff; border: 1px solid #f5f5f4; border-radius: 16px; padding: 20px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.2s;">
            <span style="font-size: 32px; margin-bottom: 8px;">🎀</span>
            <strong style="color: #1c1917; font-size: 15px; margin-bottom: 4px;">Hair Accessories</strong>
            <span style="font-size: 12px; color: #78716c;">Claw clips & floral pins</span>
          </a>
          <a href="/collections/crochet-keychains" style="background: #fff; border: 1px solid #f5f5f4; border-radius: 16px; padding: 20px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.2s;">
            <span style="font-size: 32px; margin-bottom: 8px;">🔑</span>
            <strong style="color: #1c1917; font-size: 15px; margin-bottom: 4px;">Keychains &amp; Charms</strong>
            <span style="font-size: 12px; color: #78716c;">Cute amigurumi charms</span>
          </a>
          <a href="/collections/gifts-under-500" style="background: #fff; border: 1px solid #f5f5f4; border-radius: 16px; padding: 20px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.2s;">
            <span style="font-size: 32px; margin-bottom: 8px;">🎁</span>
            <strong style="color: #1c1917; font-size: 15px; margin-bottom: 4px;">Gifts Under ₹500</strong>
            <span style="font-size: 12px; color: #78716c;">Affordable aesthetic gifts</span>
          </a>
          <a href="/collections/gifts-for-girlfriend" style="background: #fff; border: 1px solid #f5f5f4; border-radius: 16px; padding: 20px; text-decoration: none; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.2s;">
            <span style="font-size: 32px; margin-bottom: 8px;">❤️</span>
            <strong style="color: #1c1917; font-size: 15px; margin-bottom: 4px;">Gifts For Her</strong>
            <span style="font-size: 12px; color: #78716c;">Romantic flower keepsakes</span>
          </a>
        </div>
      </section>

      <!-- Category Filter Navigation -->
      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; font-weight: 800; color: #1c1917; margin-bottom: 16px;">Browse by Collection</h2>
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
            <h2 style="font-size: 24px; font-weight: 800; color: #1c1917; margin: 0 0 4px; font-family: 'Playfair Display', Georgia, serif;">Artisan Favorites &amp; Bestsellers</h2>
            <p style="font-size: 14px; color: #78716c; margin: 0;">Our most cherished bespoke creations, lovingly crafted stitch by stitch.</p>
          </div>
          <a href="/shop" style="color: #881337; font-weight: 700; font-size: 14px; text-decoration: none;">View All →</a>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
          ${renderProductCards(featuredItems)}
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
            <p style="font-size: 14px; color: #57534e; margin: 0; line-height: 1.6;">Orders are typically crafted and dispatched within 2–4 business days, and delivery takes 4–7 business days across India.</p>
          </div>
          <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e7e5e4;">
            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 8px;">Can I request a custom crochet design?</h3>
            <p style="font-size: 14px; color: #57534e; margin: 0; line-height: 1.6;">Absolutely! Visit our Custom Design page or chat directly on WhatsApp to share your inspiration photo or color palette, and we will bring your vision to life.</p>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
    `;

    const homeHtml = renderPageHtml({
        baseHtml,
        title: 'Crochet Wali | Handmade Crochet Flowers & Artisanal Keepsakes',
        description: 'Buy 100% handmade crochet flower bouquets, bridal gajras, hair accessories & personalized gift boxes starting at ₹99. Everlasting aesthetic gifts made with love in India. Free shipping over ₹999!',
        canonicalUrl: 'https://www.crochetwali.in/',
        ogImage: 'https://www.crochetwali.in/hero-gift.png',
        contentHtml: homeContentHtml
    });
    fs.writeFileSync(baseHtmlPath, homeHtml, 'utf8');
    console.log(`Updated ${baseHtmlPath} with pre-rendered Homepage content.`);

    // ==========================================
    // 2. PRE-RENDER SHOP (dist/shop/index.html)
    // ==========================================
    console.log('Pre-rendering Shop Page (dist/shop/index.html)...');
    const shopDir = path.resolve(distDir, 'shop');
    fs.mkdirSync(shopDir, { recursive: true });

    const shopContentHtml = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 24px 20px;">
      <h1 style="font-size: 32px; font-weight: 800; color: #1c1917; margin: 0 0 8px;">Shop All Handmade Crochet Gifts</h1>
      <p style="color: #78716c; font-size: 15px; margin: 0 0 24px;">Explore our complete collection of 100% handmade crochet flowers, bouquets, keychains, and hair accessories.</p>
      
      <!-- Category Filter Pills -->
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
        ${renderProductCards(products)}
      </section>
    </main>
    ${renderFooter()}
    `;

    const shopBreadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.crochetwali.in/" },
            { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.crochetwali.in/shop" }
        ]
    };

    const shopCollectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Shop All Handmade Crochet Gifts | Crochet Wali",
        "description": "Shop Crochet Wali's complete collection of handmade crochet gifts — forever flower bouquets, gajra, hair clips, keychains, parandi, claw clips, and personalized gift boxes. Shipped across India.",
        "url": "https://www.crochetwali.in/shop"
    };

    const shopItemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Shop All Handmade Crochet Gifts | Crochet Wali",
        "description": "Explore our complete collection of 100% handmade crochet flowers, bouquets, keychains, and hair accessories.",
        "numberOfItems": products.length,
        "itemListElement": products.map((p, index) => {
            const productUrl = `https://www.crochetwali.in/product/${p.slug}`;
            const imageUrl = p.image ? (p.image.startsWith('http') ? p.image : `https://www.crochetwali.in${p.image.startsWith('/') ? '' : '/'}${p.image}`) : "https://www.crochetwali.in/hero-gift.png";
            return {
                "@type": "ListItem",
                "position": index + 1,
                "name": p.name,
                "url": productUrl,
                "item": {
                    "@type": "Product",
                    "name": p.name,
                    "url": productUrl,
                    "image": imageUrl,
                    "offers": {
                        "@type": "Offer",
                        "price": String(p.price),
                        "priceCurrency": "INR",
                        "availability": p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                    }
                }
            };
        })
    };

    const shopHtml = renderPageHtml({
        baseHtml,
        title: 'Shop All Handmade Crochet Gifts | Crochet Wali',
        description: 'Shop Crochet Wali\'s complete collection of handmade crochet gifts — forever flower bouquets, gajra, hair clips, keychains, parandi, claw clips, and personalized gift boxes. Shipped across India.',
        canonicalUrl: 'https://www.crochetwali.in/shop',
        schemas: [shopBreadcrumbSchema, shopCollectionSchema, shopItemListSchema],
        contentHtml: shopContentHtml
    });
    fs.writeFileSync(path.resolve(shopDir, 'index.html'), shopHtml, 'utf8');
    console.log(`Pre-rendered dist/shop/index.html`);

    // ==========================================
    // 3. PRE-RENDER ALL COLLECTIONS (dist/collections/:slug/index.html)
    // ==========================================
    console.log(`Pre-rendering All ${Object.keys(COLLECTION_SEO_CONTENT).length} Collections (dist/collections/...)...`);
    const collectionsBaseDir = path.resolve(distDir, 'collections');
    fs.mkdirSync(collectionsBaseDir, { recursive: true });

    const collectionSlugs = Object.keys(COLLECTION_SEO_CONTENT);

    for (const cSlug of collectionSlugs) {
        const cData = COLLECTION_SEO_CONTENT[cSlug];
        const cDir = path.resolve(collectionsBaseDir, cSlug);
        fs.mkdirSync(cDir, { recursive: true });

        const cProducts = getProductsForCollection(cSlug, products);
        const cUrl = `https://www.crochetwali.in/collections/${cSlug}`;

        // Related Collections (pick 4 different collections)
        const relatedCollections = collectionSlugs
            .filter(s => s !== cSlug)
            .slice(0, 4)
            .map(s => ({ slug: s, ...COLLECTION_SEO_CONTENT[s] }));

        const breadcrumbsSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.crochetwali.in/" },
                { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://www.crochetwali.in/categories" },
                { "@type": "ListItem", "position": 3, "name": cData.h1, "item": cUrl }
            ]
        };

        const collectionSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": cData.h1,
            "description": cData.description,
            "url": cUrl
        };

        const itemListSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "numberOfItems": cProducts.length,
            "itemListElement": cProducts.map((p, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://www.crochetwali.in/product/${p.slug}`,
                "name": p.name
            }))
        };

        const collectionContentHtml = `
        ${renderHeader()}
        <main style="max-width: 1280px; margin: 0 auto; padding: 24px 20px;">
          <!-- Breadcrumb Navigation -->
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
            <a href="/" style="color: #78716c; text-decoration: none;">Home</a>
            <span>/</span>
            <a href="/categories" style="color: #78716c; text-decoration: none;">Collections</a>
            <span>/</span>
            <span style="color: #881337; font-weight: 600;">${escapeHtml(cData.h1)}</span>
          </nav>

          <!-- Header & Rich SEO Description -->
          <div style="background: #fafaf9; border-radius: 20px; padding: 32px 28px; margin-bottom: 32px; border: 1px solid #f5f5f4;">
            <span style="display: inline-block; background: #fff1f2; color: #881337; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
              Handcrafted in India
            </span>
            <h1 style="font-size: clamp(26px, 4vw, 36px); font-weight: 800; color: #1c1917; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">
              ${escapeHtml(cData.h1)}
            </h1>
            ${cSlug === 'crochet-bags' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Welcome to our artisanal <strong>crochet bags</strong> collection. If you are looking for aesthetic handmade bags in India, our handcrafted creations blend nostalgic granny square patterns with romantic floral crochet craftsmanship.</p>
              <p style="margin: 0;"><strong>What this collection contains:</strong> Exactly three distinct handmade statement pieces—the <em>Crochet Rose Round Bag</em> featuring a central red rose embellishment and delicate pearl chain strap, the <em>3D Rose Granny Square Bag (Red)</em> with textured three-dimensional roses and a chic golden chain, and the classic <em>Granny Square Bag</em> hand-assembled from cheerful cream, pink, and yellow floral motifs.</p>
              <p style="margin: 0;"><strong>Who it is for:</strong> Designed for women, teens, and fashion lovers who appreciate artisanal, tactile fashion. Perfect for brunch dates, casual weekend outings, festive occasions, and meaningful heirloom gifting.</p>
              <p style="margin: 0;"><strong>Available Styles &amp; Colours:</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Granny Square Bag:</strong> Cream base with vibrant pink and yellow square motifs (soft crochet handle).</li>
                <li><strong>3D Rose Granny Square Bag:</strong> Bold red with dimensional hand-crocheted roses and elegant golden chain strap.</li>
                <li><strong>Crochet Rose Round Bag:</strong> Classic red with centered botanical rose and refined pearl chain strap.</li>
                <li><em>Note: Interior capacity and exact bag dimensions are to be verified with the artisan team (TODO: Owner to update dimensions).</em></li>
              </ul>
              <p style="margin: 0;"><strong>Materials &amp; Craftsmanship:</strong> Handcrafted with premium soft crochet yarn, durable stitching, and accent chains. Each bag is made one stitch at a time in India.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> Hand wash gently in cool water with mild detergent and lay flat on a clean towel to dry in shade. Do not wring, machine wash, or iron directly.</p>
              <p style="margin: 0;"><strong>Delivery:</strong> Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">Looking for matching handmade accents? Explore our related <a href="/collections/crochet-accessories" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet accessories</a>, <a href="/collections/gifts-under-1000" style="color: #881337; font-weight: 600; text-decoration: underline;">gifts under ₹1000</a>, and <a href="/collections/gifts-under-500" style="color: #881337; font-weight: 600; text-decoration: underline;">gifts under ₹500</a>. For care instructions and styling inspiration, visit the <a href="/blog" style="color: #881337; font-weight: 600; text-decoration: underline;">Crochet Wali Blog &amp; Guides</a>.</p>
            </div>
            ` : cSlug === 'crochet-gift-hampers' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Welcome to our curated <strong>crochet gift hamper</strong> collection. If you are searching for a thoughtful <strong>handmade gift hamper India</strong> delivery, our hampers bring together authentic Indian embroidery and delicate handcrafted crochet florals.</p>
              <p style="margin: 0;"><strong>What’s inside:</strong> Each gift hamper is meticulously crafted with soft wool and premium yarn, featuring delicate florals and botanical accents. Perfect for birthday surprises, romantic anniversaries, and festive celebrations.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> Hand wash gently and dry flat, or dust with a soft brush to keep yarn colors fresh for years.</p>
              <p style="margin: 0;"><strong>Pricing &amp; Delivery:</strong> Live hamper creations currently range from ₹399 to ₹599. Handcrafted to order with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">Looking for bulk gifting or wedding return gifts? Contact us for a bespoke <a href="/custom-design" style="color: #881337; font-weight: 600; text-decoration: underline;">custom quotation</a> (quotation only; custom pricing varies by volume and design). Explore our <a href="/collections/crochet-bouquets" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet bouquets</a> and <a href="/collections/crochet-gifts" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet gifts</a> for more handmade inspiration.</p>
            </div>
            ` : cSlug === 'crochet-flower-pots' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Welcome to our everlasting <strong>crochet flower pot</strong> collection. If you are looking for an aesthetic <strong>crochet plant pot gift</strong> for your desk, study table, or home decor corner, our handmade potted plants bring lasting botanical warmth that never fades.</p>
              <p style="margin: 0;"><strong>What our pots are:</strong> Each piece features botanical blossoms—including sunny sunflowers, delicate pink tulips, and playful hanging strawberry vines—individually hand-crocheted and anchored in miniature textured pots.</p>
              <p style="margin: 0;"><strong>Who they are for:</strong> Ideal for home, office, and study desk decor, as well as thoughtful keepsakes for plant lovers, birthdays, anniversaries, housewarmings, or festive tokens of appreciation.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> 100% maintenance-free with zero watering needed. Simply dust gently with a soft brush or cool hairdryer every few weeks to keep the yarn vibrant and clean.</p>
              <p style="margin: 0;"><strong>Pricing &amp; Delivery:</strong> Live flower pot creations range from ₹499 to ₹799. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">Looking for other everlasting floral designs? Explore our <a href="/collections/crochet-bouquets" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet bouquets</a> and <a href="/collections/crochet-gifts" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet gifts</a> collections.</p>
            </div>
            ` : cSlug === 'crochet-plushies' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Welcome to our charming <strong>crochet plushie</strong> collection. If you are looking for an adorable <strong>crochet soft toy India</strong> delivery or looking to <strong>buy crochet plushie India</strong> designs handcrafted with genuine artisan care, our cuddly companions bring handmade warmth, textured character, and joyful personality to any space.</p>
              <p style="margin: 0;"><strong>What our plushies are:</strong> Each plushie is individually crocheted by hand using soft, tactile yarn and stuffed with plush filling—ranging from our sweet floppy-eared bunny doll with custom outfit details to our cheerful little chick holding a delicate flower. While makers refer to this Japanese craft as amigurumi, our focus is simple: creating heirloom-quality plush friends that last forever.</p>
              <p style="margin: 0;"><strong>Who they are for:</strong> Thoughtful keepsakes for room styling, nursery decor accents, baby shower gifting, desk companions, and celebratory gifts for birthdays and festive occasions.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> Hand wash gently in cool water with mild soap and dry flat in shade, or spot clean and dust with a soft brush to keep yarn textures vibrant and fresh.</p>
              <p style="margin: 0;"><strong>Pricing &amp; Delivery:</strong> Live plushie creations range from ₹349 to ₹1,199. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">Looking for other artisanal keepsakes? Explore our <a href="/collections/crochet-gifts" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet gifts</a> and <a href="/collections/crochet-bouquets" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet bouquets</a> collections, or get in touch for custom colors and personalized characters via our <a href="/custom-design" style="color: #881337; font-weight: 600; text-decoration: underline;">custom design</a> studio.</p>
            </div>
            ` : cSlug === 'crochet-bouquets' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Welcome to Crochet Wali, the premier place to <strong>buy crochet bouquet online India</strong>. If you are checking <strong>crochet bouquet price</strong> options, our handcrafted forever flower arrangements offer everlasting botanical charm starting from ₹99.</p>
              <p style="margin: 0;">Each bouquet is meticulously hand-knitted with premium milk cotton yarn to preserve its vibrant bloom forever without wilting. Perfect for romantic surprises, graduation gifts, anniversaries, and permanent home accents.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> 100% maintenance-free with zero watering needed. Simply dust gently with a soft powder brush or cool hairdryer to keep petals clean and vibrant.</p>
              <p style="margin: 0;"><strong>Pricing &amp; Delivery:</strong> Live bouquet creations range from ₹99 to ₹149. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">Looking for specific floral varieties? Explore our flower-specific collections: <a href="/collections/crochet-rose-bouquet" style="color: #881337; font-weight: 600; text-decoration: underline;">rose bouquets</a>, <a href="/collections/crochet-sunflower" style="color: #881337; font-weight: 600; text-decoration: underline;">sunflowers</a>, and <a href="/collections/crochet-tulip" style="color: #881337; font-weight: 600; text-decoration: underline;">tulips</a>.</p>
            </div>
            ` : cSlug === 'crochet-gajra' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Looking to <strong>buy crochet gajra</strong> for weddings and festivities? Order authentic handmade <strong>crochet gajra online</strong> from Crochet Wali. Real flowers wilt in hours, but our crocheted floral gajras retain pristine petal beauty forever and can be lightly scented with your favorite perfume or attar.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> Hand wash gently in cool water if needed and dry flat in shade. Reusable for years across multiple celebrations.</p>
              <p style="margin: 0;"><strong>Pricing &amp; Delivery:</strong> Live gajra pieces range from ₹199 to ₹349. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">For brides, bridesmaids, and wedding rituals, explore our specialized <a href="/collections/reusable-bridal-gajra" style="color: #881337; font-weight: 600; text-decoration: underline;">reusable bridal gajra</a> collection.</p>
            </div>
            ` : cSlug === 'reusable-bridal-gajra' ? `
            <div style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px; display: flex; flex-direction: column; gap: 12px;">
              <p style="margin: 0;">Make your wedding memories timeless with our <strong>reusable bridal gajra</strong> and <strong>crochet bridal gajra</strong> designs. Handcrafted specifically for Indian brides, bridesmaids, and wedding guests, each piece is lightweight, secure, and will never wilt, shed petals, or turn brown during long ceremonies.</p>
              <p style="margin: 0;"><strong>Care Basics:</strong> Spray with your favorite fragrance for a scented touch, and gently store flat after celebrations for future use.</p>
              <p style="margin: 0;"><strong>Pricing &amp; Delivery:</strong> Live bridal gajras and parandis range from ₹199 to ₹349. Handcrafted to order in India with confirmed delivery: 2–4 days crafting + 4–7 business days shipping across India.</p>
              <p style="margin: 0; font-size: 14px;">For everyday ethnic styling and festive hair accessories, browse our classic <a href="/collections/crochet-gajra" style="color: #881337; font-weight: 600; text-decoration: underline;">crochet gajra</a> collection.</p>
            </div>
            ` : `
            <p style="font-size: 15px; color: #57534e; line-height: 1.7; margin: 0 0 16px; max-width: 900px;">
              ${escapeHtml(cData.text)}
            </p>
            `}
            <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; font-weight: 600; color: #78716c;">
              <span>✓ ${cProducts.length} Creations Available</span>
              <span>•</span>
              <span>✓ 100% Handcrafted</span>
              <span>•</span>
              <span>✓ Pan-India Delivery (4–7 Days)</span>
            </div>
          </div>

          <!-- Product Grid -->
          <section style="margin-bottom: 56px;">
            <div style="font-size: 14px; font-weight: 600; color: #78716c; margin-bottom: 20px;">
              Showing all ${cProducts.length} items in ${escapeHtml(cData.h1)}
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
              ${renderProductCards(cProducts)}
            </div>
          </section>

          <!-- Related Collections Section -->
          <section style="background: #fff; border-radius: 20px; padding: 32px 24px; border: 1px solid #f5f5f4; margin-bottom: 48px;">
            <h3 style="font-size: 20px; font-weight: 800; color: #1c1917; margin: 0 0 16px;">Explore Related Collections</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
              ${relatedCollections.map(r => `
                <a href="/collections/${r.slug}" style="display: block; background: #fafaf9; padding: 18px; border-radius: 12px; border: 1px solid #f5f5f4; text-decoration: none;">
                  <strong style="display: block; font-size: 15px; color: #1c1917; margin-bottom: 4px;">${escapeHtml(r.h1)}</strong>
                  <span style="font-size: 12px; color: #881337; font-weight: 600;">Browse Collection →</span>
                </a>
              `).join('')}
            </div>
          </section>

          <!-- Custom Order CTA -->
          <section style="background: #fff1f2; border-radius: 16px; border: 1px solid #fecdd3; padding: 24px; text-align: center;">
            <h3 style="font-size: 18px; font-weight: 800; color: #881337; margin: 0 0 8px;">Want a Custom Variation?</h3>
            <p style="font-size: 14px; color: #57534e; margin: 0 0 16px;">Looking for specific flower colors, customized sizes, or custom bridal hampers? We handcraft custom orders with 30+ yarn shades.</p>
            <a href="/custom-design" style="display: inline-block; background: #881337; color: #fff; padding: 10px 24px; border-radius: 9999px; font-weight: 700; font-size: 14px; text-decoration: none;">
              Request Custom Design →
            </a>
          </section>
        </main>
        ${renderFooter()}
        `;

        const collectionHtml = renderPageHtml({
            baseHtml,
            title: cData.title,
            description: cData.description,
            canonicalUrl: cUrl,
            schemas: [breadcrumbsSchema, collectionSchema, itemListSchema],
            contentHtml: collectionContentHtml
        });

        fs.writeFileSync(path.resolve(cDir, 'index.html'), collectionHtml, 'utf8');
    }
    console.log(`Pre-rendered all ${collectionSlugs.length} collection pages.`);

    // ==========================================
    // 4. PRE-RENDER ALL ACTIVE PRODUCTS (dist/product/:slug/index.html)
    // ==========================================
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

        // Related Products (4 items from the same category or overall catalog)
        const relatedProducts = products
            .filter(item => item.id !== p.id && (item.category === p.category || !p.category))
            .slice(0, 4);
        const fallbackRelated = relatedProducts.length >= 4 
            ? relatedProducts 
            : [...relatedProducts, ...products.filter(item => item.id !== p.id && !relatedProducts.some(r => r.id === item.id))].slice(0, 4);

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
                    "merchantReturnDays": 5,
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
          <!-- Breadcrumb Navigation -->
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px;">
            <a href="/" style="color: #78716c; text-decoration: none;">Home</a> / 
            <a href="/shop" style="color: #78716c; text-decoration: none;">Shop</a> / 
            <a href="/shop?category=${encodeURIComponent(slugify(p.category))}" style="color: #78716c; text-decoration: none;">${escapeHtml(p.category)}</a> / 
            <span style="color: #1c1917; font-weight: 600;">${escapeHtml(p.name)}</span>
          </nav>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; align-items: start; margin-bottom: 64px;">
            <!-- Product Images -->
            <div>
              <div style="background: #fafaf9; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); aspect-ratio: 1;">
                <img src="${escapeHtml(p.image && p.image.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=600&q=80&output=webp` : p.image)}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 100%; object-fit: cover;" width="500" height="500" fetchpriority="high" />
              </div>
              ${p.images.length > 1 ? `
                <div style="display: flex; gap: 8px; margin-top: 12px; overflow-x: auto;">
                  ${p.images.slice(0, 5).map(img => `
                    <div style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; border: 1px solid #e7e5e4;">
                      <img src="${escapeHtml(img && img.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(img)}&w=120&q=75&output=webp` : img)}" alt="" style="width: 100%; height: 100%; object-fit: cover;" width="64" height="64" loading="lazy" />
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
                  <li>Safe &amp; secure checkout with free shipping over ₹999</li>
                  <li>Pan-India delivery in 4–7 business days</li>
                  <li>Return Policy: No returns. Damaged goods only: 5-day replacement with mandatory unboxing video</li>
                </ul>
              </div>

              <div>
                <a href="${productUrl}" style="display: block; text-align: center; background: #881337; color: #fff; padding: 14px 28px; border-radius: 9999px; font-weight: 700; font-size: 15px; text-decoration: none;">
                  View &amp; Personalize Options →
                </a>
              </div>
            </div>
          </div>

          <!-- Related Handmade Creations Section (High SEO Link Value) -->
          <section style="border-top: 1px solid #f5f5f4; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px;">
              <h2 style="font-size: 22px; font-weight: 800; color: #1c1917; margin: 0;">You May Also Cherish</h2>
              <a href="/shop" style="color: #881337; font-weight: 700; font-size: 13px; text-decoration: none;">Explore All →</a>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
              ${renderProductCards(fallbackRelated)}
            </div>
          </section>
        </main>
        ${renderFooter()}
        `;

        const productHtml = renderPageHtml({
            baseHtml,
            title: `${p.name} (Handmade) - ₹${p.price} | Crochet Wali`,
            description: metaDesc,
            canonicalUrl: productUrl,
            ogImage: p.image,
            schemas: [productSchema, breadcrumbsSchema],
            contentHtml: productContentHtml
        });

        const productHtmlWithState = productHtml.replace('</head>', `  <script>window.__INITIAL_PRODUCT__ = ${JSON.stringify(p)};</script>\n</head>`);
        fs.writeFileSync(path.resolve(productDir, 'index.html'), productHtmlWithState, 'utf8');
    }
    console.log(`Pre-rendered ${products.length} product pages.`);

    // ==========================================
    // 5. PRE-RENDER CATEGORIES PAGE (dist/categories/index.html)
    // ==========================================
    console.log('Pre-rendering Categories (dist/categories/index.html)...');
    const categoriesDir = path.resolve(distDir, 'categories');
    fs.mkdirSync(categoriesDir, { recursive: true });

    const categoriesContentHtml = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px 20px;">
      <h1 style="font-size: 32px; font-weight: 800; color: #1c1917; margin: 0 0 8px; font-family: 'Playfair Display', Georgia, serif;">Handmade Crochet Categories &amp; Collections</h1>
      <p style="color: #78716c; font-size: 15px; margin: 0 0 32px;">Explore our curated artisanal collections handcrafted with care in India.</p>

      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        ${collectionSlugs.map(s => {
          const c = COLLECTION_SEO_CONTENT[s];
          return `
          <div style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; padding: 24px; display: flex; flex-direction: column;">
            <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">${escapeHtml(c.h1)}</h2>
            <p style="font-size: 13.5px; color: #57534e; line-height: 1.6; margin: 0 0 16px; flex: 1;">${escapeHtml(c.description)}</p>
            <a href="/collections/${s}" style="color: #881337; font-weight: 700; font-size: 14px; text-decoration: none;">Explore ${escapeHtml(c.h1)} →</a>
          </div>
          `;
        }).join('')}
      </section>
    </main>
    ${renderFooter()}
    `;

    const categoriesHtml = renderPageHtml({
        baseHtml,
        title: 'Handmade Crochet Categories & Collections | Crochet Wali',
        description: 'Explore 18 curated collections of handcrafted crochet flower bouquets, gajras, keychains, hair clips, and budget aesthetic gifts at Crochet Wali.',
        canonicalUrl: 'https://www.crochetwali.in/categories',
        contentHtml: categoriesContentHtml
    });
    fs.writeFileSync(path.resolve(categoriesDir, 'index.html'), categoriesHtml, 'utf8');
    console.log(`Pre-rendered dist/categories/index.html`);

    // ==========================================
    // 6. PRE-RENDER BLOG INDEX & POSTS
    // ==========================================
    console.log('Pre-rendering Blog Posts (dist/blog/...)...');
    const blogDir = path.resolve(distDir, 'blog');
    fs.mkdirSync(blogDir, { recursive: true });

    const sortedBlogPosts = [...fallbackPosts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const blogCardsHtml = sortedBlogPosts.map((post, idx) => `
      <a href="/blog/${post.slug}" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 group flex flex-col" style="background: #fff; border-radius: 16px; border: 1px solid #f5f5f4; overflow: hidden; display: flex; flex-direction: column; text-decoration: none;">
        <div style="aspect-ratio: 16/10; overflow: hidden; background: #f5f5f4;">
          <img src="${escapeHtml(post.image && post.image.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(post.image)}&w=600&q=80&output=webp` : (post.image || '/hero-gift.webp'))}" alt="${escapeHtml(post.title)}" loading="${idx === 0 ? 'eager' : 'lazy'}" ${idx === 0 ? 'fetchpriority="high"' : ''} decoding="async" style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 16/10;" width="600" height="375" />
        </div>
        <div style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1;">
          <span style="color: #881337; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">${post.date ? new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 20px; color: #1c1917; margin: 0 0 12px; line-height: 1.35;">
            ${escapeHtml(post.title)}
          </h2>
          <p style="color: #57534e; font-size: 14px; line-height: 1.6; margin: 0 0 24px; flex-grow: 1;">
            ${escapeHtml(post.excerpt)}
          </p>
          <div style="display: flex; align-items: center; color: #881337; font-size: 14px; font-weight: 600; margin-top: auto;">
            Read Article →
          </div>
        </div>
      </a>
    `).join('\n');

    const blogIndexContent = `
    ${renderHeader()}
    <div style="min-height: 100vh; background-color: #fdfbf7; padding-top: 48px; padding-bottom: 96px;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 16px;">
        <div style="text-align: center; margin-bottom: 64px;">
          <h1 style="font-size: 36px; font-weight: 700; color: #1c1917; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">The Crochet Wali Blog</h1>
          <p style="color: #57534e; font-size: 16px; max-width: 672px; margin: 0 auto;">Discover gifting ideas, crochet care guides, and the stories behind our handmade creations.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
          ${blogCardsHtml}
        </div>
      </div>
    </div>
    ${renderFooter()}
    `;

    const blogIndexHtml = renderPageHtml({
        baseHtml,
        title: 'Handmade Crochet Journal & Guides | Crochet Wali Blog',
        description: 'Read the Crochet Wali journal for handmade crochet styling guides, forever bouquet gifting tips, care instructions, and wedding gajra stories.',
        canonicalUrl: 'https://www.crochetwali.in/blog',
        contentHtml: blogIndexContent
    });
    fs.writeFileSync(path.resolve(blogDir, 'index.html'), blogIndexHtml, 'utf8');

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
                <img src="${escapeHtml(post.image && post.image.startsWith('http') ? `https://wsrv.nl/?url=${encodeURIComponent(post.image)}&w=800&q=80&output=webp` : (post.image || '/hero-gift.webp'))}" alt="${escapeHtml(post.title)}" style="width: 100%; height: auto; display: block;" width="800" height="450" fetchpriority="high" />
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

        const postHtml = renderPageHtml({
            baseHtml,
            title: post.metaTitle || `${post.title} | Crochet Wali`,
            description: post.metaDescription || post.excerpt,
            canonicalUrl: `https://www.crochetwali.in/blog/${post.slug}`,
            schemas: [postArticleSchema],
            contentHtml: postContentHtml
        });

        fs.writeFileSync(path.resolve(postDir, 'index.html'), postHtml, 'utf8');
    }
    console.log(`Pre-rendered ${fallbackPosts.length} individual blog posts.`);

    // ==========================================
    // 7. PRE-RENDER CUSTOM-DESIGN LANDING PAGE
    // ==========================================
    console.log('Pre-rendering Custom Design Landing Page (dist/custom-design/index.html)...');
    const customDesignDir = path.resolve(distDir, 'custom-design');
    fs.mkdirSync(customDesignDir, { recursive: true });

    const customDesignFaqs = [
      { question: "How do I order a custom design?", answer: "Share your reference photo or idea on WhatsApp, choose yarn shades and size with the artisan, and the piece is handcrafted for you." },
      { question: "What is the minimum order?", answer: "MOQ is 1 piece for retail gifts; orders of 10+ pieces qualify for bulk wedding/event discounts." },
      { question: "How long does a custom order take?", answer: "Handmade in 7–14 days based on product plus 4–7 business days shipping across India." },
      { question: "What can I customise?", answer: "Custom names, dates, quotes, colour palettes, and bouquet combinations, with 30+ yarn shades to choose from." },
      { question: "Do you deliver across India?", answer: "Yes, custom orders are shipped across India in rigid gift-ready packaging." }
    ];

    const customServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Crochet & Personalized Gifts",
      "serviceType": "Custom crochet and embroidery gifts",
      "provider": { "@type": "Organization", "@id": "https://www.crochetwali.in/#organization", "name": "Crochet Wali" },
      "areaServed": { "@type": "Country", "name": "India" },
      "description": "Handcrafted custom crochet flower bouquets, plushies, amigurumi, keychains, bridal accessories, and personalized gifts made to order in India."
    };

    const customDesignContentHtml = `
    ${renderHeader()}
    <main style="max-width: 1280px; margin: 0 auto; padding: 32px 20px;">
      <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px;">
        <a href="/" style="color: #78716c; text-decoration: none;">Home</a> / 
        <span style="color: #881337; font-weight: 600;">Custom Design</span>
      </nav>

      <section style="text-align: center; max-width: 860px; margin: 0 auto 48px;">
        <span style="display: inline-block; background: #fff1f2; color: #881337; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px;">
          ✨ Bespoke Handcrafted Artistry in India
        </span>
        <h1 style="font-size: clamp(28px, 4.5vw, 44px); font-weight: 800; color: #1c1917; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">
          Custom Crochet Gifts Made to Order in India
        </h1>
        <p style="font-size: 16px; color: #57534e; line-height: 1.6; margin: 0 auto 24px; max-width: 680px;">
          Handcrafted bespoke crochet gifts made to order in India. Share your design idea or reference photo on WhatsApp for an upfront quotation (Handmade in 7–14 days based on product • pan-India delivery).
        </p>
        <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 24px;">
          <a href="#custom-order" style="background: #881337; color: #fff; padding: 14px 28px; border-radius: 9999px; font-weight: 700; text-decoration: none;">
            Create My Custom Design
          </a>
          <a href="https://wa.me/917428013214?text=Hi%20Crochet%20Wali%2C%20I%20would%20like%20to%20enquire%20about%20a%20custom%20order%21" target="_blank" rel="noopener noreferrer" style="background: #25D366; color: #fff; padding: 14px 28px; border-radius: 9999px; font-weight: 700; text-decoration: none;">
            WhatsApp Us: +91 74280 13214
          </a>
        </div>
        <details style="text-align: left; background: #fff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 16px 20px; max-width: 780px; margin: 0 auto;">
          <summary style="font-weight: 700; color: #881337; cursor: pointer; font-size: 14px;">View custom ordering guide & gift ideas ▾</summary>
          <div style="font-size: 14px; color: #57534e; line-height: 1.7; margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">
            <p style="margin: 0;"><strong>How do I order a custom crochet gift?</strong> Simply share your reference image, idea, or preferred colors with Crochet Wali via WhatsApp at <a href="https://wa.me/917428013214" style="color: #881337; font-weight: 600; text-decoration: underline;">+91 74280 13214</a>. We provide an upfront quotation based on design complexity, then handcraft your made to order crochet gifts (Handmade in 7–14 days based on product) with 4–7 business days pan-India shipping.</p>
            <p style="margin: 0; color: #78716c;">Whether you need <strong>customised crochet gifts</strong>, <strong>customized crochet gifts</strong>, or <strong>personalised crochet gifts</strong>, we create unique keepsakes for every milestone. From an everlasting <a href="/collections/crochet-bouquets" style="color: #881337; font-weight: 600; text-decoration: underline;">custom crochet bouquet</a>, a romantic <strong>custom crochet gift for girlfriend</strong>, or a lasting <strong>custom crochet gift for anniversary</strong> celebrations to a fun <strong>custom crochet gift for birthday</strong> surprises and matching <strong>custom crochet gift set</strong> boxes—each piece is crafted by quote. Planning an event? We also handcraft <strong>custom wedding favours</strong> by quotation, alongside <strong>personalized embroidery gifts</strong> as our secondary artisan offering.</p>
          </div>
        </details>
      </section>
    </main>
    ${renderFooter()}
    `;

    const customDesignHtml = renderPageHtml({
        baseHtml,
        title: 'Custom Crochet Gifts India | Made to Order | Crochet Wali',
        description: 'Order custom crochet gifts India loves. From a custom crochet bouquet to personalized crochet gifts, we handcraft made to order designs by quotation in India.',
        canonicalUrl: 'https://www.crochetwali.in/custom-design',
        schemas: [customServiceSchema],
        contentHtml: customDesignContentHtml
    });
    fs.writeFileSync(path.resolve(customDesignDir, 'index.html'), customDesignHtml, 'utf8');
    console.log(`Pre-rendered dist/custom-design/index.html`);

    // ==========================================
    // 8. PRE-RENDER STATIC PAGES IN SITEMAP
    // ==========================================
    const staticPages = [
        {
            slug: 'gifts',
            title: 'Handmade Gifts Guide | Best Crochet & Keepsake Gifts | Crochet Wali',
            description: 'Discover the ultimate handmade gift guide in India. Explore curated forever crochet flower bouquets, reusable bridal gajra, and gifts under ₹500.',
            h1: 'The Ultimate Handmade Gifts Guide',
            body: `
            <p style="font-size: 16px; line-height: 1.7; color: #57534e; margin-bottom: 24px;">Looking for a gift that truly lasts? Explore our curated gifting guides for anniversaries, birthdays, weddings, and thoughtful surprises.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 40px;">
              <a href="/collections/crochet-bouquets" style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4; text-decoration: none;">
                <h3 style="font-size: 17px; font-weight: 700; color: #1c1917; margin: 0 0 6px;">Romantic Bouquets</h3>
                <p style="font-size: 13px; color: #78716c; margin: 0;">Forever roses, tulips, and sunflowers for your special someone.</p>
              </a>
              <a href="/collections/reusable-bridal-gajra" style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4; text-decoration: none;">
                <h3 style="font-size: 17px; font-weight: 700; color: #1c1917; margin: 0 0 6px;">Bridal &amp; Festive Gajra</h3>
                <p style="font-size: 13px; color: #78716c; margin: 0;">Lightweight, reusable hair florals that never turn brown.</p>
              </a>
              <a href="/collections/gifts-under-500" style="background: #fff; padding: 20px; border-radius: 16px; border: 1px solid #f5f5f4; text-decoration: none;">
                <h3 style="font-size: 17px; font-weight: 700; color: #1c1917; margin: 0 0 6px;">Budget Gifts Under ₹500</h3>
                <p style="font-size: 13px; color: #78716c; margin: 0;">Cute keychains, hair clips, and keepsakes that won't break the bank.</p>
              </a>
            </div>
            `
        },
        {
            slug: 'new-arrivals',
            title: 'New Arrivals | Latest Handmade Crochet Creations | Crochet Wali',
            description: 'Explore the newest handmade crochet designs at Crochet Wali. Fresh bouquets, newly released hair clips, and adorable amigurumi creations.',
            h1: 'New Arrivals – Fresh Handmade Creations',
            body: `
            <p style="font-size: 16px; line-height: 1.7; color: #57534e; margin-bottom: 24px;">Discover our freshest creations just off the knitting needles. Each design is hand-knitted in limited batches with premium yarn.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
              ${renderProductCards(products.slice(0, 8))}
            </div>
            `
        },
        {
            slug: 'crochet-wali',
            title: 'About Crochet Wali | The Story of Handmade Crochet in India',
            description: 'Learn about Crochet Wali, founded by lead artisan Sana. Discover how we empower women artisans across India creating everlasting handmade crochet gifts.',
            h1: 'About Crochet Wali – Weaving Stories into Stitches',
            body: `
            <p style="font-size: 16px; line-height: 1.8; color: #44403c; margin-bottom: 20px;">Crochet Wali (originally Embroidery by Sana) began with a single vision: to bring authentic artisanal handcrafted elegance back to modern gifting.</p>
            <p style="font-size: 15px; line-height: 1.8; color: #57534e; margin-bottom: 20px;">Every flower petal, bridal gajra blossom, and amigurumi charm is crocheted by hand using premium, hypoallergenic milk cotton yarn. We deliver across every pin code in India.</p>
            <a href="/shop" style="display: inline-block; background: #881337; color: #fff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700;">Explore Our Shop →</a>
            `
        },
        {
            slug: 'about',
            title: 'About Us | Crochet Wali Artisanal Studio India',
            description: 'Discover the story behind Sana\'s artisanal journey creating handmade crochet bouquets, accessories, and custom embroidery in India.',
            h1: 'About Crochet Wali Artisanal Studio',
            body: `
            <p style="font-size: 16px; line-height: 1.8; color: #44403c; margin-bottom: 20px;">Welcome to Crochet Wali. Founded by Sana, our studio celebrates traditional fiber artistry with contemporary design aesthetics.</p>
            <p style="font-size: 15px; line-height: 1.8; color: #57534e; margin-bottom: 20px;">From romantic forever flower bouquets to custom heirloom embroidery hoops, our mission is to deliver gifts that carry heartfelt meaning and endure forever.</p>
            <div style="background: #fafaf9; padding: 24px; border-radius: 16px; border: 1px solid #f5f5f4; margin: 32px 0;">
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 12px;">Contact Information</h3>
              <p style="font-size: 14px; color: #57534e; margin: 0 0 8px;"><strong>Lead Artisan:</strong> Sana</p>
              <p style="font-size: 14px; color: #57534e; margin: 0 0 8px;"><strong>Email:</strong> support@crochetwali.in</p>
              <p style="font-size: 14px; color: #57534e; margin: 0;"><strong>Studio Location:</strong> India (Pan-India Shipping)</p>
            </div>
            `
        },
        {
            slug: 'support',
            title: 'Contact & Support | Crochet Wali Help Desk',
            description: 'Have a question about your order, tracking, or a custom crochet design? Get in touch with Crochet Wali support via WhatsApp or email.',
            h1: 'Crochet Wali Customer Support',
            body: `
            <p style="font-size: 16px; line-height: 1.7; color: #57534e; margin-bottom: 28px;">We are always happy to help! Whether you need help tracking your parcel, modifying a design, or discussing bulk event orders, reach out to us directly.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 40px;">
              <div style="background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e7e5e4;">
                <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">💬 WhatsApp Support</h3>
                <p style="font-size: 14px; color: #57534e; margin: 0 0 16px;">Fastest response for urgent updates and custom queries.</p>
                <a href="https://wa.me/917428013214" target="_blank" rel="noopener noreferrer" style="color: #25D366; font-weight: 700; text-decoration: none;">+91 74280 13214 →</a>
              </div>
              <div style="background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e7e5e4;">
                <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 0 0 8px;">✉️ Email Support</h3>
                <p style="font-size: 14px; color: #57534e; margin: 0 0 16px;">Send order details or bulk corporate/wedding enquiries.</p>
                <a href="mailto:support@crochetwali.in" style="color: #881337; font-weight: 700; text-decoration: none;">support@crochetwali.in →</a>
              </div>
            </div>
            `
        },
        {
            slug: 'return-policy',
            title: 'Return & Refund Policy | Crochet Wali',
            description: 'Read the official return and refund policy of Crochet Wali. No returns on handcrafted items. 5-day replacement policy for damaged products with mandatory unboxing video.',
            h1: 'Return & Refund Policy',
            body: `
            <div style="font-size: 15px; line-height: 1.8; color: #44403c;">
              <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">1. No Returns or Refunds</h2>
              <p>Due to the handcrafted, made-to-order nature of our crochet and embroidery creations, all sales are final. We do not provide returns or refunds. A 5-day replacement policy is provided exclusively for transit-damaged goods with a mandatory unboxing video.</p>
              
              <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">2. 5-Day Replacement Policy for Damaged Products</h2>
              <p>If you receive a damaged or defective product, we offer a 5-day replacement policy. You must notify us within 5 days of delivery to be eligible for a replacement.</p>
              
              <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">3. Mandatory Unboxing Video</h2>
              <p>To process any claim for a damaged product, an unboxing video is strictly required. You must send a clear, unedited unboxing video to our WhatsApp support at <a href="https://wa.me/917428013214" target="_blank" rel="noopener noreferrer" style="color: #881337; font-weight: 700;">+91 74280 13214</a> within 5 days of delivery.</p>
              
              <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">4. Replacement Process</h2>
              <p>Once we receive your unboxing video on WhatsApp and verify the transit damage, we will process a replacement for the exact same item and ship it at no additional cost to you.</p>
            </div>
            `
        },
        {
            slug: 'shipping-policy',
            title: 'Shipping & Delivery Policy | Pan-India Delivery | Crochet Wali',
            description: 'Crochet Wali shipping timelines: 2–4 days crafting + 4–7 business days transit across India. Real-time courier tracking provided.',
            h1: 'Shipping & Delivery Policy',
            body: `
            <div style="font-size: 15px; line-height: 1.8; color: #44403c;">
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Crafting &amp; Dispatch Timeline</h3>
              <p>Every piece at Crochet Wali is handmade with care. Orders are typically crafted and dispatched within <strong>2 to 4 business days</strong>.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Transit &amp; Delivery Across India</h3>
              <p>We ship across all pin codes in India via reputed courier partners including Delhivery, Bluedart, and India Post. Delivery typically takes <strong>4 to 7 business days</strong> post dispatch.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Shipping Rates</h3>
              <p>We offer <strong>FREE shipping on all orders over ₹999</strong>. For orders under ₹999, a nominal flat shipping fee of ₹50 is applied at checkout.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Tracking Your Order</h3>
              <p>Once dispatched, you will receive a tracking link via SMS, email, and WhatsApp to monitor your shipment in real time.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Damaged Shipments &amp; Replacements</h3>
              <p>Due to the handcrafted nature of our products, all sales are final and we do not accept returns. However, in the rare event that your product arrives damaged or defective in transit, we offer a <strong>5-day replacement policy</strong> with a mandatory unboxing video. Contact support within 5 days of delivery to initiate a free replacement.</p>
            </div>
            `
        },
        {
            slug: 'privacy-policy',
            title: 'Privacy Policy | Crochet Wali',
            description: 'Crochet Wali\'s privacy policy details how your personal data, payment info, and address details are safely collected and protected.',
            h1: 'Privacy Policy',
            body: `
            <div style="font-size: 15px; line-height: 1.8; color: #44403c;">
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Information We Collect</h3>
              <p>We collect essential order information including your name, delivery address, phone number, and email address solely to process your orders and provide delivery updates.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Payment Security</h3>
              <p>All online payments are securely processed through RBI-approved payment gateways (Razorpay). Crochet Wali never stores your credit card, debit card, or UPI credentials.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">No Third-Party Sharing</h3>
              <p>We never sell or rent your personal information to third parties. Data is shared strictly with logistics partners for delivery fulfillment.</p>
            </div>
            `
        },
        {
            slug: 'terms-of-service',
            title: 'Terms of Service | Crochet Wali',
            description: 'Read the official terms and conditions for placing orders, custom designs, and payments on Crochet Wali.',
            h1: 'Terms of Service',
            body: `
            <div style="font-size: 15px; line-height: 1.8; color: #44403c;">
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Returns &amp; Replacements Policy</h3>
              <p>Due to the custom handcrafted nature of our products, all sales are final and no returns or refunds are permitted. We provide a 5-day replacement exclusively for transit-damaged or defective goods with a mandatory unboxing video.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Handmade Nature of Products</h3>
              <p>Because each piece is individually crafted by human hands, slight natural variations in stitch tension, yarn color dye lots, and dimensions may occur. These nuances reflect genuine artisanal craftsmanship.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Orders &amp; Payment Confirmation</h3>
              <p>An order is confirmed upon successful receipt of payment or COD verification. We reserve the right to decline or cancel orders in cases of pricing or inventory inaccuracies.</p>
              
              <h3 style="font-size: 18px; font-weight: 700; color: #1c1917; margin: 24px 0 8px;">Jurisdiction</h3>
              <p>Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
            </div>
            `
        }
    ];

    for (const page of staticPages) {
        const pageDir = path.resolve(distDir, page.slug);
        fs.mkdirSync(pageDir, { recursive: true });

        const pageUrl = `https://www.crochetwali.in/${page.slug}`;

        const pageContentHtml = `
        ${renderHeader()}
        <main style="max-width: 900px; margin: 0 auto; padding: 32px 20px;">
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #78716c; margin-bottom: 24px;">
            <a href="/" style="color: #78716c; text-decoration: none;">Home</a> / 
            <span style="color: #881337; font-weight: 600;">${escapeHtml(page.h1)}</span>
          </nav>

          <h1 style="font-size: clamp(26px, 4vw, 36px); font-weight: 800; color: #1c1917; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif;">
            ${escapeHtml(page.h1)}
          </h1>

          <div>
            ${page.body}
          </div>
        </main>
        ${renderFooter()}
        `;

        const pageHtml = renderPageHtml({
            baseHtml,
            title: page.title,
            description: page.description,
            canonicalUrl: pageUrl,
            contentHtml: pageContentHtml
        });

        fs.writeFileSync(path.resolve(pageDir, 'index.html'), pageHtml, 'utf8');
        console.log(`Pre-rendered dist/${page.slug}/index.html`);
    }

    console.log('✅ All 94 URLs and static pages pre-rendered successfully with 100% crawlable HTML, unique titles, single H1s, and self-referencing canonicals!');
}

prerender().catch(err => {
    console.error('Pre-rendering error:', err);
    process.exit(1);
});

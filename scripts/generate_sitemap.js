import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { sanitizeProductName, isDuplicateProduct } from '../src/utils/productSanitizer.js';
import { blogPosts as fallbackPosts } from '../src/pages/Blog/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const slugify = (str) => (str || '')
  .toLowerCase()
  .trim()
  .replace(/[\s\W-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/gifts', priority: '0.8', changefreq: 'weekly' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly' },
  { path: '/new-arrivals', priority: '0.8', changefreq: 'weekly' },
  { path: '/crochet-wali', priority: '0.8', changefreq: 'weekly' },
  { path: '/custom-design', priority: '0.7', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/support', priority: '0.5', changefreq: 'monthly' },
  { path: '/return-policy', priority: '0.4', changefreq: 'monthly' },
  { path: '/shipping-policy', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'monthly' },
];

const COLLECTION_ROUTES = [
  'crochet-bouquets',
  'custom-embroidery-hoops',
  'handmade-gifts',
  'personalized-gifts',
  'crochet-accessories',
  'embroidery-hoops',
  'crochet-gifts',
  'gifts-under-500',
  'gifts-under-1000',
  'crochet-keychains',
  'crochet-claw-clips',
  'crochet-parandi',
  'crochet-rose-bouquet',
  'crochet-sunflower',
  'crochet-tulip',
  'crochet-flowers',
  'crochet-gajra',
  'reusable-bridal-gajra',
  'gifts-for-girlfriend',
  'anniversary-gifts',
];

async function generateSitemap() {
  console.log('Generating comprehensive sitemap for crochetwali.in...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, clothing_information, created_at, active')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Static Pages
  STATIC_ROUTES.forEach(route => {
    xml += `  <url>\n`;
    xml += `    <loc>https://www.crochetwali.in${route.path}</loc>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // 2. Collection Pages
  COLLECTION_ROUTES.forEach(slug => {
    xml += `  <url>\n`;
    xml += `    <loc>https://www.crochetwali.in/collections/${slug}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 3. Products (all active items)
  products.forEach(product => {
    if (isDuplicateProduct(product.id)) return;
    const cleanName = sanitizeProductName(product.name);
    const cleanSlug = product.clothing_information?.slug || slugify(cleanName);
    const productUrl = `https://www.crochetwali.in/product/${cleanSlug}-${product.id}`;
    const modDate = product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : today;

    xml += `  <url>\n`;
    xml += `    <loc>${productUrl}</loc>\n`;
    xml += `    <lastmod>${modDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 4. Blog Posts (published only, from database with fallback)
  let dbPosts = [];
  try {
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, publish_date, updated_at')
      .eq('status', 'published')
      .order('publish_date', { ascending: false });

    if (!blogError && blogPosts) {
      dbPosts = blogPosts;
    }
  } catch (e) {
    console.warn('Note: Could not query Supabase blog_posts, using fallback.');
  }

  // Combine fallback posts and DB posts by slug
  const postMap = new Map();
  // Fallback posts (all 16 original posts)
  fallbackPosts.forEach(post => {
    postMap.set(post.slug, {
      slug: post.slug,
      publish_date: post.date ? `${post.date}T00:00:00+05:30` : today,
      updated_at: null
    });
  });
  // Overlay DB posts (any newly published or edited in DB)
  dbPosts.forEach(post => {
    postMap.set(post.slug, post);
  });

  const finalPosts = Array.from(postMap.values());

  finalPosts.forEach(post => {
    const modDate = post.updated_at
      ? new Date(post.updated_at).toISOString().split('T')[0]
      : (post.publish_date ? new Date(post.publish_date).toISOString().split('T')[0] : today);
    xml += `  <url>\n`;
    xml += `    <loc>https://www.crochetwali.in/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${modDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const publicDest = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicDest, xml, 'utf8');
  console.log(`Saved ${publicDest} with ${STATIC_ROUTES.length + COLLECTION_ROUTES.length + products.length + finalPosts.length} URLs`);

  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distDest = path.resolve(distDir, 'sitemap.xml');
    fs.writeFileSync(distDest, xml, 'utf8');
    console.log(`Saved ${distDest}`);
  }
}

generateSitemap();

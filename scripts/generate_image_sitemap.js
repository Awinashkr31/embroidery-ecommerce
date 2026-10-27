import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sanitizeProductName, isDuplicateProduct } from '../src/utils/productSanitizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const slugify = (str) => {
    return (str || '')
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

async function generateImageSitemap() {
  console.log('Fetching products from Supabase...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, variants, images, clothing_information');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const product of products) {
    if (isDuplicateProduct(product.id)) continue;
    const cleanName = sanitizeProductName(product.name);
    const cleanSlug = product.clothing_information?.slug || slugify(cleanName);
    const productSlug = cleanSlug || product.id;
    const productUrl = `https://www.crochetwali.in/product/${productSlug}-${product.id}`;
    
    // Collect all unique images from product and variants
    const allImages = new Set();
    if (product.images && Array.isArray(product.images)) {
        product.images.forEach(img => allImages.add(img));
    }
    if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(variant => {
            if (variant.images && Array.isArray(variant.images)) {
                variant.images.forEach(img => allImages.add(img));
            }
        });
    }

  // Filter for valid image paths/URLs
  const validImages = Array.from(allImages).filter(img => typeof img === 'string' && img.trim() !== '');

    if (validImages.length > 0) {
      xml += `  <url>\n`;
      xml += `    <loc>${productUrl}</loc>\n`;
      for (const imgUrl of validImages) {
        // Ensure image URL is absolute (assuming Supabase storage or similar)
        let absoluteImgUrl = imgUrl;
        if (imgUrl.startsWith('/')) {
            absoluteImgUrl = `https://www.crochetwali.in${imgUrl}`;
        } else if (!imgUrl.startsWith('http')) {
             absoluteImgUrl = `https://yqtrlqkmitgnaehbawdm.supabase.co/storage/v1/object/public/products/${imgUrl}`;
        }
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${absoluteImgUrl}</image:loc>\n`;
        xml += `      <image:title>${cleanName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap_images.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Successfully generated Image Sitemap at: ${outputPath}`);
}

generateImageSitemap();

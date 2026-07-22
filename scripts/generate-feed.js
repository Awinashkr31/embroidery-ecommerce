import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env. Skipping feed generation.');
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility to create URL-friendly slugs (must match frontend implementation exactly)
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word chars
        .replace(/--+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
};

const getProductUrl = (product) => {
    const slug = slugify(product.name);
    return `https://www.embroiderybysana.live/product/${slug}-${product.id}`;
};

const escapeXml = (unsafe) => {
    return (unsafe || '').toString()
        .replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
};

async function generateFeed() {
    console.log('Generating Google Merchant Center XML feed...');
    
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true);
            
        if (error) throw error;

        let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Crochet Wali</title>
        <link>https://www.embroiderybysana.live</link>
        <description>Handmade crochet flowers, gajra, hair accessories &amp; personalized gifts</description>
`;

        products.forEach(product => {
            const url = getProductUrl(product);
            const title = escapeXml(product.name);
            const description = escapeXml(product.description || title);
            
            // Parse images
            let images = [];
            if (typeof product.images === 'string') {
                try { images = JSON.parse(product.images); } catch (e) { images = []; }
            } else if (Array.isArray(product.images)) {
                images = product.images;
            }
            if (images.length === 0 && product.image) images.push(product.image);
            
            const mainImage = images[0] ? escapeXml(images[0]) : 'https://www.embroiderybysana.live/logo.png';
            
            // Determine availability
            const inStock = product.stock_quantity > 0;
            const availability = inStock ? 'in_stock' : 'out_of_stock';
            
            // Extract Price
            const price = product.price;

            xml += `
        <item>
            <g:id>${product.id}</g:id>
            <g:title>${title}</g:title>
            <g:description>${description}</g:description>
            <g:link>${url}</g:link>
            <g:image_link>${mainImage}</g:image_link>
            <g:condition>new</g:condition>
            <g:availability>${availability}</g:availability>
            <g:price>${price} INR</g:price>
            <g:brand>Crochet Wali</g:brand>
            <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Artificial Flora</g:google_product_category>
            <g:identifier_exists>no</g:identifier_exists>
        </item>`;
        });

        xml += `
    </channel>
</rss>`;

        const outputPath = path.resolve(__dirname, '../public/merchant-feed.xml');
        fs.writeFileSync(outputPath, xml);
        console.log(`Successfully generated feed with ${products.length} products at ${outputPath}`);
    } catch (err) {
        console.error('Failed to generate feed:', err.message);
    }
}

generateFeed();

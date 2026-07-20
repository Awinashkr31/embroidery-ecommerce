import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';

const supabaseUrl = 'https://yqtrlqkmitgnaehbawdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdHJscWttaXRnbmFlaGJhd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzc5NzYsImV4cCI6MjA4MTU1Mzk3Nn0.KtFy-rrNFK7e9z63qmPNbQgdHp2_Ls4q-DTmGkxFCYs';
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    { id: 'cat-1', label: 'Flower Pot' },
    { id: 'cat-2', label: 'Gift Box' },
    { id: 'cat-3', label: 'Bouquet' },
    { id: 'cat-4', label: 'Handmade Keychain' },
    { id: 'cat-5', label: 'Flower\'s' },
    { id: 'cat-6', label: 'Rubber Bands' },
    { id: 'cat-7', label: 'Gajra' },
    { id: 'cat-8', label: 'Parandi' },
    { id: 'cat-9', label: 'Claw Hair clip' },
    { id: 'cat-10', label: 'Hair Clips' },
    { id: 'cat-11', label: 'Embroidery hair clips' },
    { id: 'cat-12', label: 'Bow' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

async function run() {
    const outDir = path.join(process.cwd(), 'public', 'category-images');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const { data } = await supabase.from('products').select('*').eq('active', true);
    
    for (const cat of categories) {
        const catName = cat.label.toLowerCase().trim();
        const p = data.find(x => (x.category || '').toLowerCase().trim() === catName);
        if (p && p.images) {
            let images = p.images;
            if (typeof images === 'string') {
                try { images = JSON.parse(images); } catch(e) { images = []; }
            }
            if (images.length > 0) {
                const imgUrl = images[0];
                const cleanName = cat.label.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                const ext = imgUrl.split('.').pop().split('?')[0] || 'jpg';
                const filename = `${cleanName}.${ext}`;
                const filepath = path.join(outDir, filename);
                console.log(`Downloading ${cat.label} -> ${filename}...`);
                try {
                    await downloadImage(imgUrl, filepath);
                    console.log(`Saved ${filename}`);
                } catch(e) {
                    console.error(`Error downloading ${cat.label}:`, e.message);
                }
            }
        } else {
            console.log(`No product found for ${cat.label}`);
        }
    }
}

run();

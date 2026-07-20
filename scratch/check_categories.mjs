import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://yqtrlqkmitgnaehbawdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdHJscWttaXRnbmFlaGJhd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzc5NzYsImV4cCI6MjA4MTU1Mzk3Nn0.KtFy-rrNFK7e9z63qmPNbQgdHp2_Ls4q-DTmGkxFCYs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase
        .from('website_settings')
        .select('setting_value')
        .eq('setting_key', 'product_categories')
        .single();
    
    let categories = [];
    if (data && data.setting_value) {
        categories = Array.isArray(data.setting_value) ? data.setting_value : JSON.parse(data.setting_value);
    }

    const dir = path.join(process.cwd(), 'public', 'category-images');
    const files = fs.readdirSync(dir);
    
    console.log("Files in directory:", files);
    console.log("\nCategories in DB:");
    for (const cat of categories) {
        // Same logic as CategoryContext
        const label = cat.label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        // Same logic as Home.jsx
        const cleanName = label.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        const expectedFile = `${cleanName}.webp`;
        const exists = files.includes(expectedFile);
        console.log(`- Label: "${label}" -> cleanName: "${cleanName}" -> Expected File: ${expectedFile} -> Exists: ${exists}`);
    }
}

check();

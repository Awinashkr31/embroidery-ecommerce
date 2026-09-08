import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yqtrlqkmitgnaehbawdm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdHJscWttaXRnbmFlaGJhd2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzc5NzYsImV4cCI6MjA4MTU1Mzk3Nn0.KtFy-rrNFK7e9z63qmPNbQgdHp2_Ls4q-DTmGkxFCYs'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testFetch() {
  const { data, error } = await supabase.from('products').select('category, images').eq('active', true);
  if (error) {
    console.error('Fetch Error:', error)
  } else {
    const cats = {};
    data.forEach(p => {
        if (!cats[p.category]) cats[p.category] = [];
        cats[p.category].push(p.images);
    });
    console.log('Categories in DB:', Object.keys(cats));
    console.log('Sample images:', Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, v[0]])));
  }

  const { data: catData, error: catError } = await supabase.from('website_settings').select('setting_value').eq('setting_key', 'product_categories').single();
  if (catError) {
      console.error('Cat Error:', catError);
  } else {
      console.log('Categories settings:', catData.setting_value);
  }
}

testFetch()

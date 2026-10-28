/**
 * Seed script: migrates the 16 hardcoded blog posts from posts.js into the
 * Supabase blog_posts table. Run ONCE after creating the table.
 *
 * Usage: node scripts/seed_blog_posts.js
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/pages/Blog/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Use the service role key to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  // If not using service role key, sign in as admin to satisfy RLS
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    console.log(`Authenticating as admin (${process.env.ADMIN_EMAIL})…`);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    if (authError) {
      console.error('Authentication failed:', authError.message);
      process.exit(1);
    }
    console.log('✓ Admin authenticated');
  }

  console.log(`Seeding ${blogPosts.length} blog posts into Supabase…`);

  for (const post of blogPosts) {
    const row = {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || '',
      status: 'published',                       // all existing posts are live
      publish_date: post.date ? `${post.date}T00:00:00+05:30` : new Date().toISOString(),
      meta_title: post.metaTitle || '',
      meta_description: post.metaDescription || '',
      keywords: post.keywords || '',
    };

    // Upsert on slug so re-running is safe
    const { error } = await supabase
      .from('blog_posts')
      .upsert(row, { onConflict: 'slug' });

    if (error) {
      console.error(`  ✗ Failed to seed "${post.slug}":`, error.message);
    } else {
      console.log(`  ✓ ${post.slug}`);
    }
  }

  // Verify
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, status')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Verification query failed:', error.message);
  } else {
    console.log(`\nDone. ${data.length} posts in blog_posts table.`);
  }
}

seed();

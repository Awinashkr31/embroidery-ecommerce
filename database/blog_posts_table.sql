-- ============================================
-- Blog Posts table for admin-managed blog
-- Run this in the Supabase SQL Editor
-- ============================================

-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  excerpt       TEXT DEFAULT '',
  content       TEXT DEFAULT '',
  image         TEXT DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  publish_date  TIMESTAMPTZ DEFAULT now(),
  meta_title    TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  keywords      TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookups (public page)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

-- Index for listing published posts sorted by date
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_date ON blog_posts (status, publish_date DESC);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read PUBLISHED posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Admins: full access (supports both public.is_admin() and admin_users check)
CREATE POLICY "Admins have full access to blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    (SELECT coalesce((SELECT true FROM admin_users WHERE email = auth.jwt()->>'email' AND active = true), false))
    OR
    (auth.jwt()->>'email' = 'admin@enbroidery.com')
  )
  WITH CHECK (
    (SELECT coalesce((SELECT true FROM admin_users WHERE email = auth.jwt()->>'email' AND active = true), false))
    OR
    (auth.jwt()->>'email' = 'admin@enbroidery.com')
  );

-- Service role: full access (used by seed script and background jobs)
CREATE POLICY "Service role full access to blog posts"
  ON blog_posts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Permissions
GRANT SELECT ON TABLE blog_posts TO anon;
GRANT ALL ON TABLE blog_posts TO authenticated;
GRANT ALL ON TABLE blog_posts TO service_role;

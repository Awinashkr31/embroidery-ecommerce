-- 1. Enable RLS on the table
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 2. Allow EVERYONE to READ settings (so the website works)
create policy "Allow Public Read Access"
on public.website_settings
for select
to public
using (true);

-- 3. Allow ONLY ADMIN to UPDATE settings
create policy "Allow Admin Write Access"
on public.website_settings
for all
to authenticated
using (auth.jwt() ->> 'email' = 'awinashkr31@gmail.com')
with check (auth.jwt() ->> 'email' = 'awinashkr31@gmail.com');

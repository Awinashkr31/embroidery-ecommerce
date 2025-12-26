-- Fix for: Table public.mehndi_bookings has multiple permissive policies for role authenticated for action UPDATE
-- Issue: "Anyone can update bookings" is overly permissive and conflicts with "Allow admins to update bookings".
-- Fix: Drop the generic/insecure "Anyone" policy and rely on the secured Admin policy.

-- 1. Remove the insecure/redundant policy
DROP POLICY IF EXISTS "Anyone can update bookings" ON mehndi_bookings;

-- 2. Ensure the specific Admin policy exists (This was created in the previous performance fix step)
-- If you haven't run fix_bookings_rls_performance.sql yet, run that first.

-- (Optional) If you want to confirm the Admin policy is the only one:
-- The previous script created "Allow admins to update bookings"
-- This cleanup script ensures it's the sole authority for updates.

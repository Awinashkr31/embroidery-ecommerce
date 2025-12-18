-- Fix security warning for mutable search_path in functions.
-- This prevents malicious users from potentially hijacking the function by manipulating the search_path.

ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

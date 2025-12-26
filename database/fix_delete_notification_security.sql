-- Fix for: Function public.delete_notification has a role mutable search_path

-- Secure the function by forcing a fixed search_path.
-- This prevents malicious users from hijacking the search path to execute arbitrary code.

ALTER FUNCTION public.delete_notification(notification_id uuid) SET search_path = public;

-- Fix security warning: set search_path for functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.generate_order_number() SET search_path = public;
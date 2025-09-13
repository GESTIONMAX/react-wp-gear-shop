-- Fix RLS policies to work with the new user_roles system instead of profiles.role
-- This fixes the "column profiles.role does not exist" error

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Users can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

DROP POLICY IF EXISTS "Public can view product images" ON product_images;
DROP POLICY IF EXISTS "Users can view product images" ON product_images;
DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;

DROP POLICY IF EXISTS "Public can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Users can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;

DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Users can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

-- Create simple public read access policies (no auth required for viewing products)
CREATE POLICY "Anyone can view active products"
ON products FOR SELECT
USING (is_active = true);

CREATE POLICY "Anyone can view product images"
ON product_images FOR SELECT
USING (true);

CREATE POLICY "Anyone can view product variants"
ON product_variants FOR SELECT
USING (true);

CREATE POLICY "Anyone can view active categories"
ON categories FOR SELECT
USING (is_active = true);

-- Create management policies using the NEW user_roles system
CREATE POLICY "Internal users can manage products"
ON products FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND public.is_internal_user(auth.uid())
);

CREATE POLICY "Internal users can manage product images"
ON product_images FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND public.is_internal_user(auth.uid())
);

CREATE POLICY "Internal users can manage product variants"
ON product_variants FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND public.is_internal_user(auth.uid())
);

CREATE POLICY "Internal users can manage categories"
ON categories FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND public.is_internal_user(auth.uid())
);

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Add comment explaining the fix
COMMENT ON TABLE products IS 'RLS policies updated to use new user_roles system instead of deprecated profiles.role - fixes column not found errors';

-- Grant necessary permissions for the functions
GRANT EXECUTE ON FUNCTION public.is_internal_user(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_type(UUID) TO anon, authenticated;
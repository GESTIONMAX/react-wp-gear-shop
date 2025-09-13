-- Fix RLS policies for products and related tables to allow public read access
-- This fixes the loading issue caused by the user role system changes

-- Drop existing restrictive policies that might block access
DROP POLICY IF EXISTS "Users can view active products" ON products;
DROP POLICY IF EXISTS "Users can view product images" ON product_images;
DROP POLICY IF EXISTS "Users can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Users can view active categories" ON categories;

-- Create new permissive policies for public read access
CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view product images"
ON product_images FOR SELECT
USING (true);

CREATE POLICY "Public can view product variants"
ON product_variants FOR SELECT
USING (true);

CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (is_active = true);

-- Ensure RLS is enabled but allows public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow admins and staff full access to products management
CREATE POLICY "Admins can manage products"
ON products FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins can manage product images"
ON product_images FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins can manage product variants"
ON product_variants FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'staff')
  )
);

CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'staff')
  )
);

-- Add comment explaining the fix
COMMENT ON TABLE products IS 'RLS policies updated to allow public read access while maintaining admin controls - fixes loading issues after user role system changes';
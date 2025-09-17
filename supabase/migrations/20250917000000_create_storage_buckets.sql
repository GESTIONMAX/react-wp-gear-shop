-- Create Storage Buckets for Chamelo E-commerce Assets
-- This migration creates the bucket hierarchy for collections, products, and variants

-- Create category-images bucket for collection banners/heroes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create product-images bucket for main product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create product-gallery bucket for product photo galleries
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-gallery',
  'product-gallery',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create variant-images bucket for product variant images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'variant-images',
  'variant-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create ui-assets bucket for icons, logos, and UI elements
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ui-assets',
  'ui-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Set public access policies for all buckets
-- Anyone can view images (public read)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN (
  'category-images',
  'product-images',
  'product-gallery',
  'variant-images',
  'ui-assets'
));

-- Only authenticated users can upload (admin/staff uploads)
CREATE POLICY "Authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- Only authenticated users can update their uploads
CREATE POLICY "Authenticated updates" ON storage.objects FOR UPDATE USING (
  auth.role() = 'authenticated'
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- Only authenticated users can delete their uploads
CREATE POLICY "Authenticated deletes" ON storage.objects FOR DELETE USING (
  auth.role() = 'authenticated'
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);
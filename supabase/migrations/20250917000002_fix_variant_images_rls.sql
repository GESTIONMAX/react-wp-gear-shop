-- Fix RLS policies for variant-images bucket upload

-- Remove existing restrictive policies if they exist
DROP POLICY IF EXISTS "variant_images_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_delete_policy" ON storage.objects;

-- Create permissive policies for variant-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "variant_images_upload_policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'variant-images'
);

-- Allow public read access to variant images
CREATE POLICY "variant_images_select_policy"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'variant-images'
);

-- Allow authenticated users to update variant images
CREATE POLICY "variant_images_update_policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'variant-images'
)
WITH CHECK (
  bucket_id = 'variant-images'
);

-- Allow authenticated users to delete variant images
CREATE POLICY "variant_images_delete_policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'variant-images'
);

-- Ensure the bucket exists and is public readable
DO $$
BEGIN
  -- Create bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'variant-images',
    'variant-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
  ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
END $$;

-- Also ensure RLS policies for variant_images table are permissive
DROP POLICY IF EXISTS "variant_images_insert_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_select_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_update_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_delete_policy" ON variant_images;

-- Create permissive policies for variant_images table
CREATE POLICY "variant_images_insert_policy"
ON variant_images
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "variant_images_select_policy"
ON variant_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "variant_images_update_policy"
ON variant_images
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "variant_images_delete_policy"
ON variant_images
FOR DELETE
TO authenticated
USING (true);
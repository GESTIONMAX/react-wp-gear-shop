-- Script pour corriger les politiques RLS des buckets produits
-- À exécuter dans Supabase SQL Editor

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes" ON storage.objects;

-- Nouvelles politiques plus permissives

-- Lecture publique pour tous les buckets
CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (
  bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- Upload pour utilisateurs authentifiés (plus permissif)
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- Update pour utilisateurs authentifiés
CREATE POLICY "Allow authenticated updates" ON storage.objects FOR UPDATE USING (
  auth.uid() IS NOT NULL
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- Delete pour utilisateurs authentifiés
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE USING (
  auth.uid() IS NOT NULL
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- Vérifier l'état des buckets
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id IN (
  'category-images',
  'product-images',
  'product-gallery',
  'variant-images',
  'ui-assets'
)
ORDER BY id;
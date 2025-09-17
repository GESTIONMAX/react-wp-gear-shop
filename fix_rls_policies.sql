-- ================================
-- SCRIPT À EXÉCUTER DANS SUPABASE SQL EDITOR
-- ================================
-- Ce script corrige les politiques RLS pour l'upload d'images de variantes

-- 1. Corriger les politiques du bucket variant-images
-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "variant_images_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_delete_policy" ON storage.objects;

-- Créer des politiques permissives pour variant-images
CREATE POLICY "variant_images_upload_policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'variant-images');

CREATE POLICY "variant_images_select_policy"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'variant-images');

CREATE POLICY "variant_images_update_policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'variant-images')
WITH CHECK (bucket_id = 'variant-images');

CREATE POLICY "variant_images_delete_policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'variant-images');

-- 2. Vérifier que le bucket existe et est configuré correctement
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'variant-images';

-- 3. Corriger les politiques de la table variant_images
DROP POLICY IF EXISTS "variant_images_insert_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_select_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_update_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_delete_policy" ON variant_images;

-- Créer des politiques permissives pour la table variant_images
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

-- 4. Vérifier les politiques de sécurité générales
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
AND (tablename = 'variant_images' OR tablename = 'objects')
ORDER BY schemaname, tablename, policyname;
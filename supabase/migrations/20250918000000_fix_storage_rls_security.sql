-- 🔒 Migration Critique : Correction des Vulnérabilités RLS Storage
-- Cette migration corrige les politiques de sécurité trop permissives identifiées lors de l'audit

-- 1. Nettoyer toutes les politiques storage existantes conflictuelles
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "variant_images_delete_policy" ON storage.objects;

-- 2. Créer des politiques sécurisées pour chaque bucket

-- LECTURE PUBLIQUE (uniquement pour les buckets publics appropriés)
CREATE POLICY "Public read access for product assets"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- UPLOAD SÉCURISÉ (vérification admin + validation)
CREATE POLICY "Admin can upload to any bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  -- Vérifier que l'utilisateur est admin
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
  -- Validation de la taille et du type
  AND (octet_length(COALESCE(content, '')) <= 52428800) -- 50MB max
);

-- MISE À JOUR SÉCURISÉE (admin uniquement)
CREATE POLICY "Admin can update storage objects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- SUPPRESSION SÉCURISÉE (admin uniquement)
CREATE POLICY "Admin can delete storage objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
  AND bucket_id IN (
    'category-images',
    'product-images',
    'product-gallery',
    'variant-images',
    'ui-assets'
  )
);

-- 3. Mettre à jour les buckets avec des contraintes renforcées
UPDATE storage.buckets
SET
  file_size_limit = 52428800, -- 50MB strict
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id IN ('category-images', 'product-images', 'product-gallery', 'variant-images');

UPDATE storage.buckets
SET
  file_size_limit = 10485760, -- 10MB pour UI assets
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
WHERE id = 'ui-assets';

-- 4. Ajouter des logs de sécurité (fonction utilitaire)
CREATE OR REPLACE FUNCTION public.log_storage_access(
  action TEXT,
  bucket_name TEXT,
  object_path TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Log les accès critiques pour audit
  INSERT INTO public.security_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    timestamp
  ) VALUES (
    auth.uid(),
    action,
    'storage',
    bucket_name || '/' || COALESCE(object_path, ''),
    jsonb_build_object(
      'bucket', bucket_name,
      'path', object_path,
      'user_agent', current_setting('request.headers')::json->>'user-agent'
    ),
    NOW()
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Ne pas faire échouer l'opération si le log échoue
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer la table de logs de sécurité si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances des logs
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON public.security_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_resource ON public.security_logs(resource_type, resource_id);

-- RLS pour les logs (admin uniquement)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view security logs"
ON public.security_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Documentation et commentaires
COMMENT ON POLICY "Public read access for product assets" ON storage.objects IS
'Permet la lecture publique des assets produits pour l''affichage sur le site';

COMMENT ON POLICY "Admin can upload to any bucket" ON storage.objects IS
'Seuls les administrateurs peuvent uploader des fichiers, avec validation de taille';

COMMENT ON FUNCTION public.log_storage_access(TEXT, TEXT, TEXT) IS
'Fonction d''audit pour tracer les accès critiques au storage';

COMMENT ON TABLE public.security_logs IS
'Table d''audit pour tracer les actions sensibles (accès admin uniquement)';
-- CORRECTION SÉCURITAIRE CRITIQUE pour la table profiles
-- Suppression des anciennes politiques potentiellement vulnérables
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Création de nouvelles politiques RLS ultra-sécurisées

-- 1. SELECT Policy - Accès ultra-strict aux données personnelles
CREATE POLICY "secure_profiles_select" ON public.profiles
  FOR SELECT
  TO authenticated  -- SEULEMENT pour les utilisateurs authentifiés
  USING (
    auth.uid() IS NOT NULL AND  -- Double vérification de l'authentification
    auth.uid() = user_id AND    -- L'utilisateur ne peut voir que SES données
    auth.role() = 'authenticated'  -- Vérification explicite du rôle
  );

-- 2. INSERT Policy - Création de profil ultra-sécurisée
CREATE POLICY "secure_profiles_insert" ON public.profiles
  FOR INSERT
  TO authenticated  -- SEULEMENT pour les utilisateurs authentifiés
  WITH CHECK (
    auth.uid() IS NOT NULL AND  -- Double vérification de l'authentification
    auth.uid() = user_id AND    -- L'utilisateur ne peut créer que SON profil
    auth.role() = 'authenticated' AND  -- Vérification explicite du rôle
    user_id IS NOT NULL         -- Le user_id ne peut pas être null
  );

-- 3. UPDATE Policy - Modification ultra-sécurisée
CREATE POLICY "secure_profiles_update" ON public.profiles
  FOR UPDATE
  TO authenticated  -- SEULEMENT pour les utilisateurs authentifiés
  USING (
    auth.uid() IS NOT NULL AND  -- Double vérification de l'authentification
    auth.uid() = user_id AND    -- L'utilisateur ne peut modifier que SES données
    auth.role() = 'authenticated'  -- Vérification explicite du rôle
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND  -- Double vérification de l'authentification
    auth.uid() = user_id AND    -- Même utilisateur après modification
    auth.role() = 'authenticated' AND  -- Vérification explicite du rôle
    user_id IS NOT NULL         -- Le user_id ne peut pas être modifié en null
  );

-- 4. DELETE Policy - Suppression sécurisée (ajout manquant)
CREATE POLICY "secure_profiles_delete" ON public.profiles
  FOR DELETE
  TO authenticated  -- SEULEMENT pour les utilisateurs authentifiés
  USING (
    auth.uid() IS NOT NULL AND  -- Double vérification de l'authentification
    auth.uid() = user_id AND    -- L'utilisateur ne peut supprimer que SON profil
    auth.role() = 'authenticated'  -- Vérification explicite du rôle
  );

-- 5. Politique de DENY explicite pour tous les accès non authentifiés
-- Cette politique bloque EXPLICITEMENT tout accès non autorisé
CREATE POLICY "deny_anonymous_access" ON public.profiles
  FOR ALL
  TO anon  -- Pour les utilisateurs anonymes
  USING (false);  -- REFUS TOTAL d'accès

-- 6. Ajout de contraintes de sécurité au niveau base de données
-- Empêche l'insertion de données avec user_id null
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;

-- 7. Fonction de sécurité pour valider l'accès aux profils
CREATE OR REPLACE FUNCTION public.validate_profile_access(profile_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérification multi-niveaux
  IF auth.uid() IS NULL THEN
    RETURN FALSE;  -- Pas d'authentification
  END IF;
  
  IF auth.role() != 'authenticated' THEN
    RETURN FALSE;  -- Rôle incorrect
  END IF;
  
  IF profile_user_id IS NULL THEN
    RETURN FALSE;  -- user_id invalide
  END IF;
  
  IF auth.uid() != profile_user_id THEN
    RETURN FALSE;  -- Tentative d'accès aux données d'un autre utilisateur
  END IF;
  
  RETURN TRUE;  -- Toutes les vérifications passées
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. Index de sécurité pour améliorer les performances des vérifications
CREATE INDEX IF NOT EXISTS idx_profiles_security_user_id ON public.profiles(user_id) 
WHERE user_id IS NOT NULL;

-- 9. Audit log pour tracer les accès (optionnel mais recommandé)
CREATE TABLE IF NOT EXISTS public.profiles_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Activer RLS sur la table d'audit aussi
ALTER TABLE public.profiles_audit_log ENABLE ROW LEVEL SECURITY;

-- Politique pour la table d'audit (seuls les admins peuvent voir)
CREATE POLICY "admin_only_audit_access" ON public.profiles_audit_log
  FOR ALL
  USING (false);  -- Bloque l'accès par défaut

-- 10. Vérification finale - S'assurer que RLS est bien activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 11. Suppression des permissions par défaut pour plus de sécurité
REVOKE ALL ON public.profiles FROM PUBLIC;
REVOKE ALL ON public.profiles FROM anon;

-- Accorder seulement les permissions nécessaires aux utilisateurs authentifiés
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
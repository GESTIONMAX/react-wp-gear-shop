-- Migration pour étendre le système de rôles avec distinction interne/externe
-- Date: 2025-09-13
-- Description: Ajoute les rôles granulaires (admin, staff, employee, client) et user_type (internal/external)

-- 1. Étendre l'enum app_role pour inclure les nouveaux rôles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'employee';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

-- 2. Créer un enum pour le type d'utilisateur
CREATE TYPE public.user_type AS ENUM ('internal', 'external');

-- 3. Ajouter la colonne user_type à la table user_roles
ALTER TABLE public.user_roles
ADD COLUMN IF NOT EXISTS user_type public.user_type DEFAULT 'external';

-- 4. Mettre à jour les enregistrements existants
-- Les admins sont considérés comme internes
UPDATE public.user_roles
SET user_type = 'internal'
WHERE role = 'admin';

-- Les utilisateurs simples sont considérés comme externes (clients)
UPDATE public.user_roles
SET user_type = 'external', role = 'client'
WHERE role = 'user';

-- 5. Ajouter des contraintes pour assurer la cohérence
ALTER TABLE public.user_roles
ADD CONSTRAINT check_role_user_type_consistency
CHECK (
  (role IN ('admin', 'staff', 'employee') AND user_type = 'internal') OR
  (role = 'client' AND user_type = 'external')
);

-- 6. Mettre à jour la fonction get_user_role pour prioriser les rôles internes
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE
    WHEN role = 'admin' THEN 1
    WHEN role = 'staff' THEN 2
    WHEN role = 'employee' THEN 3
    WHEN role = 'client' THEN 4
  END
  LIMIT 1
$$;

-- 7. Créer une fonction pour obtenir le type d'utilisateur
CREATE OR REPLACE FUNCTION public.get_user_type(_user_id UUID)
RETURNS user_type
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_type
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE
    WHEN role = 'admin' THEN 1
    WHEN role = 'staff' THEN 2
    WHEN role = 'employee' THEN 3
    WHEN role = 'client' THEN 4
  END
  LIMIT 1
$$;

-- 8. Créer une fonction pour vérifier si un utilisateur est interne
CREATE OR REPLACE FUNCTION public.is_internal_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND user_type = 'internal'
  )
$$;

-- 9. Créer une fonction pour vérifier les rôles spécifiques
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- 10. Mettre à jour les politiques RLS pour utiliser les nouveaux rôles
-- Politique pour les utilisateurs internes (admin, staff, employee)
CREATE POLICY "Internal users can manage user roles"
ON public.user_roles
FOR ALL
USING (public.is_internal_user(auth.uid()))
WITH CHECK (public.is_internal_user(auth.uid()));

-- 11. Ajouter des commentaires pour la documentation
COMMENT ON TYPE public.user_type IS 'Type d''utilisateur: internal (personnel) ou external (clients)';
COMMENT ON COLUMN public.user_roles.user_type IS 'Distingue les utilisateurs internes du personnel des clients externes';
COMMENT ON FUNCTION public.get_user_type(UUID) IS 'Retourne le type d''utilisateur (internal/external)';
COMMENT ON FUNCTION public.is_internal_user(UUID) IS 'Vérifie si un utilisateur fait partie du personnel interne';
COMMENT ON FUNCTION public.has_any_role(UUID, app_role[]) IS 'Vérifie si un utilisateur a l''un des rôles spécifiés';

-- 12. Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_roles_user_type ON public.user_roles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_user_type ON public.user_roles(role, user_type);

-- 13. Mettre à jour les politiques pour les nouvelles permissions
-- Staff peut gérer les clients mais pas les autres utilisateurs internes
CREATE POLICY "Staff can manage clients only"
ON public.user_roles
FOR ALL
USING (
  public.has_role(auth.uid(), 'staff') AND
  (SELECT user_type FROM public.user_roles WHERE user_id = user_roles.user_id) = 'external'
);

-- Employee a accès en lecture seulement
CREATE POLICY "Employee read access"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'employee'));
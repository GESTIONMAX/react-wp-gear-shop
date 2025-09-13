-- Étendre l'enum app_role pour inclure les nouveaux rôles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'employee';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'client';

-- Créer l'enum pour le type d'utilisateur
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('internal', 'external');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ajouter la colonne user_type à la table user_roles
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS user_type user_type DEFAULT 'external';

-- Créer la fonction get_user_type
CREATE OR REPLACE FUNCTION get_user_type(_user_id uuid)
RETURNS user_type
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_type
  FROM user_roles
  WHERE user_id = _user_id
  LIMIT 1;
$$;

-- Créer la fonction is_internal_user
CREATE OR REPLACE FUNCTION is_internal_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND user_type = 'internal'
  );
$$;

-- Créer la fonction has_any_role
CREATE OR REPLACE FUNCTION has_any_role(_user_id uuid, _roles app_role[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  );
$$;
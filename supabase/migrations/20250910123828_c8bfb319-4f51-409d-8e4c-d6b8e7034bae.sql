-- Supprimer les anciennes politiques RLS conflictuelles pour profiles
DROP POLICY IF EXISTS "secure_profiles_update" ON profiles;
DROP POLICY IF EXISTS "admins_can_update_all_profiles" ON profiles;

-- Créer une nouvelle politique unifiée pour les mises à jour
CREATE POLICY "profiles_update_policy" 
ON profiles 
FOR UPDATE 
USING (
  -- L'utilisateur peut modifier son propre profil OU c'est un admin
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin'::app_role))
) 
WITH CHECK (
  -- Même condition pour la vérification
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin'::app_role))
);

-- S'assurer qu'il n'y a pas de politique DELETE restrictive
DROP POLICY IF EXISTS "secure_profiles_delete" ON profiles;

-- Créer une politique DELETE unifiée 
CREATE POLICY "profiles_delete_policy" 
ON profiles 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin'::app_role))
);
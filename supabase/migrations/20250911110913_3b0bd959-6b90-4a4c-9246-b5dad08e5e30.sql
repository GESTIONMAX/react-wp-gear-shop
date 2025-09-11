-- Corriger la fonction has_role avec le search_path sécurisé
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Vérifier que les politiques existantes pour la table clients sont correctes
-- Si les anciennes politiques sont toujours là, les supprimer et recréer
DROP POLICY IF EXISTS "Admins can manage all client data" ON public.clients;
DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "admins_full_access" ON public.clients;

-- Recréer les politiques proprement
-- Les clients peuvent voir leurs propres données
CREATE POLICY "clients_select_own" ON public.clients
FOR SELECT
USING (auth.uid() = user_id);

-- Les clients peuvent mettre à jour leurs propres données  
CREATE POLICY "clients_update_own" ON public.clients
FOR UPDATE
USING (auth.uid() = user_id);

-- Les clients peuvent insérer leurs propres données
CREATE POLICY "clients_insert_own" ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout faire - politique critique pour le problème
CREATE POLICY "admins_full_access" ON public.clients
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
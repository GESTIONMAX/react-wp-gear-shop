-- Supprimer les politiques existantes pour les recréer proprement
DROP POLICY IF EXISTS "Admins can manage all client data" ON public.clients;
DROP POLICY IF EXISTS "Clients can view their own data" ON public.clients;
DROP POLICY IF EXISTS "Clients can update their own data" ON public.clients;
DROP POLICY IF EXISTS "Clients can insert their own data" ON public.clients;

-- Recréer les politiques avec une logique plus claire
-- 1. Les clients peuvent voir leurs propres données
CREATE POLICY "clients_select_own" ON public.clients
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Les clients peuvent mettre à jour leurs propres données
CREATE POLICY "clients_update_own" ON public.clients
FOR UPDATE
USING (auth.uid() = user_id);

-- 3. Les clients peuvent insérer leurs propres données
CREATE POLICY "clients_insert_own" ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Les admins peuvent tout faire sur les données clients
CREATE POLICY "admins_full_access" ON public.clients
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Vérifier que RLS est activé
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
-- Supprimer l'ancienne politique problématique pour les admins
DROP POLICY IF EXISTS "Admins can update all client data" ON public.clients;

-- Créer une nouvelle politique plus spécifique pour les admins
CREATE POLICY "Admins can manage all client data" 
ON public.clients 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Supprimer la politique admin incomplète
DROP POLICY IF EXISTS "Admins can manage all client data" ON public.clients;

-- Recréer la politique admin correcte avec WITH CHECK
CREATE POLICY "Admins can manage all client data" 
ON public.clients 
FOR ALL
TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
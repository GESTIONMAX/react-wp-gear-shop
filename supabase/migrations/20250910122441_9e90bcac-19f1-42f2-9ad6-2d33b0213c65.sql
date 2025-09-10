-- Ajouter une policy pour permettre aux admins de modifier tous les profils
CREATE POLICY "admins_can_update_all_profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Mettre à jour la policy SELECT pour permettre aux administrateurs de voir tous les profils
DROP POLICY IF EXISTS "secure_profiles_select" ON public.profiles;

CREATE POLICY "secure_profiles_select" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) 
  AND (auth.role() = 'authenticated'::text) 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);
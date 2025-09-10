-- Ajouter une politique permettant aux utilisateurs de s'attribuer un rôle s'ils n'en ont pas encore
CREATE POLICY "Users can assign themselves a role if they have none"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
);
-- Ajouter le champ complément d'adresse au profil
ALTER TABLE public.profiles 
ADD COLUMN address_complement text;
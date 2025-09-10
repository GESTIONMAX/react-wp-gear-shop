-- Ajouter les champs d'adresse et téléphone marketing aux profils
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'France',
ADD COLUMN IF NOT EXISTS marketing_phone TEXT,
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Ajouter des commentaires pour documenter les nouveaux champs
COMMENT ON COLUMN public.profiles.address IS 'Adresse de livraison par défaut du client';
COMMENT ON COLUMN public.profiles.city IS 'Ville de livraison par défaut';
COMMENT ON COLUMN public.profiles.postal_code IS 'Code postal de livraison par défaut'; 
COMMENT ON COLUMN public.profiles.country IS 'Pays de livraison par défaut';
COMMENT ON COLUMN public.profiles.marketing_phone IS 'Numéro de téléphone pour les campagnes marketing/SMS';
COMMENT ON COLUMN public.profiles.marketing_consent IS 'Consentement pour recevoir des SMS marketing';
COMMENT ON COLUMN public.profiles.notes IS 'Notes internes sur le client';
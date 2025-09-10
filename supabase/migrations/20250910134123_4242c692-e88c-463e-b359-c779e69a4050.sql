-- Créer une table dédiée pour les informations clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  -- Informations personnelles
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Adresses
  address TEXT,
  address_complement TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'France',
  
  -- Adresses préférées
  preferred_shipping_address JSONB,
  preferred_billing_address JSONB,
  
  -- Marketing
  marketing_phone TEXT,
  marketing_consent BOOLEAN DEFAULT FALSE,
  
  -- Notes internes admin
  notes TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contrainte sur user_id
  CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policies pour les clients (peuvent voir et modifier leurs propres données)
CREATE POLICY "Clients can view their own data" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Clients can update their own data" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Clients can insert their own data" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policies pour les admins (accès complet)
CREATE POLICY "Admins can manage all client data" 
ON public.clients 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Trigger pour auto-update du timestamp
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrer les données existantes de profiles vers clients
INSERT INTO public.clients (
  user_id, first_name, last_name, email, phone, 
  address, address_complement, city, postal_code, country,
  preferred_shipping_address, preferred_billing_address,
  marketing_phone, marketing_consent, notes, created_at, updated_at
)
SELECT 
  user_id, first_name, last_name, email, phone,
  address, address_complement, city, postal_code, country,
  preferred_shipping_address, preferred_billing_address,
  marketing_phone, marketing_consent, notes, created_at, updated_at
FROM public.profiles
WHERE user_id IS NOT NULL;

-- Index pour améliorer les performances
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_created_at ON public.clients(created_at DESC);
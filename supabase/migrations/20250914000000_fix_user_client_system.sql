-- Migration pour clarifier le système utilisateurs vs clients
-- Séparer clairement :
-- 1. app_users (utilisateurs de l'app) - authentifiés avec Supabase Auth
-- 2. clients (clients de l'entreprise) - données business/CRM

-- 1. Nettoyer et recréer la table des utilisateurs app
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.app_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role public.app_role NOT NULL DEFAULT 'client',
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Garder/créer la table clients (données business)
-- Cette table contient TOUS les clients de l'entreprise, même non-authentifiés
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Optionnel : lien vers un utilisateur authentifié
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Informations personnelles (toujours présentes)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
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

  -- Constraint unique sur email
  CONSTRAINT unique_client_email UNIQUE(email)
);

-- 3. Activer RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS pour app_users
CREATE POLICY "Users can view own profile"
ON public.app_users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.app_users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all app users"
ON public.app_users FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.app_users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Politiques RLS pour clients
CREATE POLICY "Admins can manage all clients"
ON public.clients FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.app_users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Clients can view their own data if authenticated"
ON public.clients FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Clients can update their own data if authenticated"
ON public.clients FOR UPDATE
USING (auth.uid() = user_id);

-- 6. Trigger pour créer automatiquement un app_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.app_users (id, email, role, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        'client',
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Fonction pour vérifier si admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.app_users
        WHERE id = _user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Créer le compte admin principal
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'aurelien@gestionmax.fr', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Mettre ce compte en admin
INSERT INTO public.app_users (id, email, role, full_name)
SELECT id, email, 'admin', 'Aurélien Admin'
FROM auth.users
WHERE email = 'aurelien@gestionmax.fr'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 9. Triggers et index
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_users_updated_at
BEFORE UPDATE ON public.app_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_app_users_role ON public.app_users(role);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at DESC);

-- 11. Permissions
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon, authenticated;

-- 12. Documentation
COMMENT ON TABLE public.app_users IS 'Utilisateurs authentifiés de l''application (admin/client)';
COMMENT ON TABLE public.clients IS 'Base de données des clients de l''entreprise (CRM-like)';
COMMENT ON FUNCTION public.is_admin(UUID) IS 'Vérifie si un app_user est administrateur';
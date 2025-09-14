-- Migration pour simplifier le système utilisateur : Admin/Client seulement
-- Supprime la complexité et restaure la fonctionnalité des produits

-- 1. Nettoyer les tables complexes existantes
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TYPE IF EXISTS public.user_type CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_type(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_internal_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.has_any_role(UUID, app_role[]) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role) CASCADE;

-- 2. Simplifier l'enum des rôles : seulement admin et client
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- 3. Créer une table profiles simple et claire
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role public.app_role NOT NULL DEFAULT 'client',
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Activer RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS pour profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 6. Trigger pour créer automatiquement un profil client
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, full_name)
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

-- 7. Créer les 2 comptes admin (remplacez les emails par les vôtres)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'aurelien@gestionmax.fr', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW()),
    (gen_random_uuid(), 'admin2@votresite.com', crypt('admin123', gen_salt('bf')), NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 8. Fonction simple pour vérifier si admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = _user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. RÉPARER L'ACCÈS AUX PRODUITS - Supprimer toutes les politiques cassées
DROP POLICY IF EXISTS "Users can view active products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Public can view active products" ON products;

DROP POLICY IF EXISTS "Users can view product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can view product images" ON product_images;
DROP POLICY IF EXISTS "Public can view product images" ON product_images;

DROP POLICY IF EXISTS "Users can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Anyone can view product variants" ON product_variants;
DROP POLICY IF EXISTS "Public can view product variants" ON product_variants;

DROP POLICY IF EXISTS "Users can view active categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;

-- 10. CRÉER DES POLITIQUES SIMPLES ET FONCTIONNELLES
-- Accès libre en lecture pour tous (visiteurs + clients + admins)
CREATE POLICY "Everyone can view active products"
ON products FOR SELECT
USING (is_active = true);

CREATE POLICY "Everyone can view product images"
ON product_images FOR SELECT
USING (true);

CREATE POLICY "Everyone can view product variants"
ON product_variants FOR SELECT
USING (true);

CREATE POLICY "Everyone can view active categories"
ON categories FOR SELECT
USING (is_active = true);

-- Seuls les admins peuvent modifier les produits
CREATE POLICY "Admins can manage products"
ON products FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can manage product images"
ON product_images FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can manage product variants"
ON product_variants FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can manage categories"
ON categories FOR ALL
USING (public.is_admin());

-- 11. Permissions sur les fonctions
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon, authenticated;

-- 12. Commentaires de documentation
COMMENT ON TABLE public.profiles IS 'Table utilisateurs simplifiée : admin (2 comptes) + clients';
COMMENT ON FUNCTION public.is_admin(UUID) IS 'Vérifie si utilisateur est admin - système simplifié';

-- 13. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
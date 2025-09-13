-- Migration pour corriger le profil admin
-- S'assurer que aurelien@gestionmax.fr a le rôle admin

-- D'abord, mettre à jour le profil existant s'il existe
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'aurelien@gestionmax.fr';

-- Si le profil n'existe pas, le créer
INSERT INTO public.profiles (id, email, role, full_name)
SELECT
    au.id,
    au.email,
    'admin'::public.app_role,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email)
FROM auth.users au
WHERE au.email = 'aurelien@gestionmax.fr'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = au.id
);
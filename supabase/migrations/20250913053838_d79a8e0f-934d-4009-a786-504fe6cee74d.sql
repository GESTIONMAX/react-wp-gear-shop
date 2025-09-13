-- Corriger les politiques RLS pour permettre l'accès anonyme aux données publiques

-- Politique pour products - lecture publique des produits actifs
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Politique pour categories - lecture publique des catégories actives  
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

-- Politique pour product_images - lecture publique
DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images" 
ON public.product_images 
FOR SELECT 
USING (true);

-- Politique pour product_variants - lecture publique
DROP POLICY IF EXISTS "Anyone can view product variants" ON public.product_variants;
CREATE POLICY "Anyone can view product variants" 
ON public.product_variants 
FOR SELECT 
USING (true);

-- Vérification que RLS est activé mais permet l'accès public en lecture
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'categories', 'product_images', 'product_variants');
-- Activer la catégorie LIFESTYLE
UPDATE public.categories 
SET is_active = true 
WHERE slug = 'lifestyle';

-- Réassigner les produits aux bonnes catégories basé sur leurs noms et tags

-- Produits SPORT (basé sur les tags Sport, Performance, Cyclisme)
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE slug = 'sport')
WHERE slug IN ('music-shield', 'falcon');

-- Produits LIFESTYLE (basé sur les tags Lifestyle, Classique, Élégant, Urbain)  
UPDATE public.products 
SET category_id = (SELECT id FROM public.categories WHERE slug = 'lifestyle')
WHERE slug IN ('duck-classic', 'dragon', 'prime');

-- Produits PRISMATIC restent comme ils sont (Shield, Euphoria, Aura)
-- Ils sont déjà correctement assignés

-- Vérification des assignations
SELECT 
  p.name, 
  p.slug,
  c.name as category_name,
  c.slug as category_slug,
  p.tags
FROM public.products p 
LEFT JOIN public.categories c ON c.id = p.category_id 
WHERE p.is_active = true
ORDER BY c.slug, p.name;
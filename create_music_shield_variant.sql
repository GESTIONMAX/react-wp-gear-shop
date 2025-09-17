-- Script pour créer la variante Music Shield et son produit parent

-- 1. D'abord, créer le produit Music Shield (si il n'existe pas)
INSERT INTO products (
  id,
  name,
  slug,
  description,
  short_description,
  price,
  in_stock,
  stock_quantity,
  created_at
) VALUES (
  gen_random_uuid(),
  'Music Shield Audio',
  'music-shield-audio',
  'Lunettes audio intelligentes avec monture personnalisable et verres colorés',
  'Lunettes connectées avec audio intégré',
  19900, -- 199.00 € en centimes
  true,
  50,
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- 2. Récupérer l'ID du produit Music Shield
-- (à exécuter dans une seconde requête pour récupérer l'ID)

-- 3. Créer la variante Music Shield Monture Blanche Verres Bleus
INSERT INTO variants (
  id,
  product_id,
  name,
  sku,
  properties,
  price,
  stock_quantity,
  in_stock,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM products WHERE slug = 'music-shield-audio' LIMIT 1),
  'Music Shield - Monture Blanche Verres Bleus',
  'msh-blc-blu-audio',
  '{"color": "blanche", "lens": "bleus", "audio": true, "type": "audio-glasses"}'::jsonb,
  19900, -- Même prix que le produit de base
  10,
  true,
  NOW()
);

-- 4. Vérifier que tout s'est bien créé
SELECT
  p.name as product_name,
  p.slug as product_slug,
  v.name as variant_name,
  v.sku as variant_sku,
  v.id as variant_id
FROM products p
JOIN variants v ON p.id = v.product_id
WHERE p.slug = 'music-shield-audio';
-- Ajouter la catégorie LIFESTYLE manquante
INSERT INTO categories (name, slug, description, is_active) 
VALUES ('LIFESTYLE', 'lifestyle', 'Style de vie et usage quotidien', true)
ON CONFLICT (slug) DO NOTHING;

-- Répartir les produits dans les bonnes catégories
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'lifestyle')
WHERE name IN ('Music Shield', 'Falcon');

UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'prismatic')  
WHERE name IN ('Shield');
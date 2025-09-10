-- Insert sample categories
INSERT INTO public.categories (name, slug, description, is_active) VALUES
('SPORT', 'sport', 'Performance et usages sportifs, notamment cyclisme', true),
('LIFESTYLE', 'lifestyle', 'Design élégant, usage citadin moderne et innovant', true),
('PRISMATIC', 'prismatic', 'Technologie de verres à couleur réglable, style marquant', true);

-- Get category IDs for foreign key relationships
DO $$
DECLARE
    sport_cat_id UUID;
    lifestyle_cat_id UUID;
    prismatic_cat_id UUID;
    product_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO sport_cat_id FROM public.categories WHERE slug = 'sport';
    SELECT id INTO lifestyle_cat_id FROM public.categories WHERE slug = 'lifestyle';
    SELECT id INTO prismatic_cat_id FROM public.categories WHERE slug = 'prismatic';

    -- Insert SPORT products
    INSERT INTO public.products (name, slug, description, short_description, price, sale_price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Music Shield', 'music-shield', 'Lunettes sportives avec audio intégré pour cyclistes. Protection UV totale, ajustement automatique de la teinte et son immersif pour vos performances sportives.', 'Lunettes sportives avec audio intégré', 29900, 26900, sport_cat_id, '{"Sport", "Audio", "Cyclisme", "UV"}', true, 15, '{"Audio stéréo intégré pour cyclisme", "Ajustement automatique de la teinte", "Protection UV 100%", "Résistance IP65", "Autonomie 8 heures"}', '{"Collection": "SPORT", "Audio": "Stéréo intégré", "Autonomie": "8 heures", "Charge": "2 heures", "Protection": "UV 100% + IP65", "Transmittance": "15-85%"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Music Shield
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop&crop=center', 'Music Shield lunettes sportives', 0),
    (product_id, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&crop=center', 'Music Shield vue de profil', 1);

    -- Insert product variants for Music Shield
    INSERT INTO public.product_variants (product_id, name, price, sale_price, in_stock, stock_quantity, attributes) VALUES
    (product_id, 'Music Shield Noir Mat + Smoke Lenses', 29900, 26900, true, 5, '{"color": "Noir Mat", "lenses": "Smoke Lenses", "audio": "Oui"}'),
    (product_id, 'Music Shield Bleu + Fire', 29900, 26900, true, 5, '{"color": "Bleu", "lenses": "Fire", "audio": "Oui"}'),
    (product_id, 'Music Shield Neon + Alpha Purple', 31900, 28900, true, 5, '{"color": "Neon", "lenses": "Alpha Purple", "audio": "Oui"}');

    -- Insert Falcon product
    INSERT INTO public.products (name, slug, description, short_description, price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Falcon', 'falcon', 'Lunettes de performance pour sportifs exigeants. Design aérodynamique, verres adaptatifs ultra-rapides et confort optimal pour les longues sessions d''entraînement.', 'Lunettes de performance sportive', 24900, sport_cat_id, '{"Sport", "Performance", "Cyclisme"}', true, 20, '{"Design aérodynamique ultra-léger", "Verres adaptatifs rapides (0,3s)", "Ajustement nasal premium", "Anti-buée intégré", "Certification sportive"}', '{"Collection": "SPORT", "Vitesse d''ajustement": "0,3 secondes", "Protection": "UV 100%", "Poids": "28 grammes", "Matériaux": "TR90 + Titane"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Falcon
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&crop=center', 'Falcon lunettes performance', 0),
    (product_id, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop&crop=center', 'Falcon vue détaillée', 1);

    -- Insert LIFESTYLE products
    INSERT INTO public.products (name, slug, description, short_description, price, sale_price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Prime', 'prime', 'Lunettes connectées élégantes pour l''usage quotidien urbain. Design sophistiqué, technologie discrète et fonctionnalités smart pour le lifestyle moderne.', 'Lunettes connectées lifestyle premium', 39900, 35900, lifestyle_cat_id, '{"Lifestyle", "Connecté", "Urbain", "Premium"}', true, 12, '{"Connectivité smartphone discrète", "Design urbain sophistiqué", "Verres adaptatifs intelligents", "Contrôles tactiles intégrés", "Mode nuit automatique"}', '{"Collection": "LIFESTYLE", "Connectivité": "Bluetooth 5.2", "Autonomie": "12 heures", "Charge": "1,5 heures", "Contrôles": "Tactiles + Vocaux"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Prime
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop&crop=center', 'Prime lunettes lifestyle', 0),
    (product_id, 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop&crop=center', 'Prime vue élégante', 1);

    -- Insert PRISMATIC products
    INSERT INTO public.products (name, slug, description, short_description, price, sale_price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Aura', 'aura', 'Lunettes prismatiques à couleur réglable pour un style unique. Technologie de verres révolutionnaire permettant de changer la couleur selon l''humeur et l''environnement.', 'Lunettes prismatiques à couleur réglable', 44900, 39900, prismatic_cat_id, '{"Prismatic", "Innovation", "Style", "Couleur"}', true, 10, '{"Verres à couleur réglable en temps réel", "Palette prismatique complète", "Contrôle via app mobile", "Effets lumineux personnalisés", "Style avant-gardiste"}', '{"Collection": "PRISMATIC", "Couleurs disponibles": "16,7 millions", "Vitesse changement": "0,1 seconde", "Contrôle": "App mobile + Tactile", "Autonomie": "10 heures"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Aura
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop&crop=center', 'Aura lunettes prismatiques', 0),
    (product_id, 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=600&h=600&fit=crop&crop=center', 'Aura effets couleur', 1);

END $$;
-- Ajouter les 4 produits manquants
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

    -- Insert Shield (SPORT)
    INSERT INTO public.products (name, slug, description, short_description, price, sale_price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Shield', 'shield', 'Lunettes sport protection maximale avec audio optionnel. Conçues pour les sports extrêmes avec résistance renforcée et technologie adaptative avancée.', 'Lunettes sport protection maximale', 32900, 29900, sport_cat_id, '{"Sport", "Protection", "Audio", "Extrême"}', true, 12, '{"Protection maximale renforcée", "Audio stéréo optionnel", "Résistance aux chocs IP67", "Verres incassables", "Design sport extrême"}', '{"Collection": "SPORT", "Résistance": "IP67 + Anti-choc", "Audio": "Optionnel intégré", "Protection": "Maximale UV + Impact", "Certification": "Sports extrêmes"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Shield
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop&crop=center', 'Shield lunettes protection', 0),
    (product_id, 'https://images.unsplash.com/photo-1556306535-38b7b5077bb8?w=600&h=600&fit=crop&crop=center', 'Shield vue résistance', 1);

    -- Insert product variants for Shield
    INSERT INTO public.product_variants (product_id, name, price, sale_price, in_stock, stock_quantity, attributes) VALUES
    (product_id, 'Shield Noir Mat + Smoke + Audio', 32900, 29900, true, 6, '{"color": "Noir Mat", "lenses": "Smoke", "audio": "Oui"}'),
    (product_id, 'Shield Gold + Fire sans Audio', 27900, 24900, true, 6, '{"color": "Gold", "lenses": "Fire", "audio": "Non"}');

    -- Insert Duck Classic (LIFESTYLE)
    INSERT INTO public.products (name, slug, description, short_description, price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Duck Classic', 'duck-classic', 'Lunettes lifestyle au design intemporel avec touches modernes connectées. Parfait équilibre entre élégance classique et innovation technologique discrète.', 'Lunettes lifestyle classique connecté', 34900, lifestyle_cat_id, '{"Lifestyle", "Classique", "Élégant", "Connecté"}', true, 16, '{"Design intemporel élégant", "Connectivité discrète intégrée", "Confort premium toute la journée", "Verres adaptatifs lifestyle", "Finitions haut de gamme"}', '{"Collection": "LIFESTYLE", "Design": "Intemporel premium", "Connectivité": "Bluetooth discret", "Autonomie": "14 heures", "Matériaux": "Acétate premium"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Duck Classic
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&crop=center', 'Duck Classic élégant', 0),
    (product_id, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&crop=center', 'Duck Classic profil', 1);

    -- Insert product variants for Duck Classic
    INSERT INTO public.product_variants (product_id, name, price, in_stock, stock_quantity, attributes) VALUES
    (product_id, 'Duck Classic Blanc + Rose', 34900, true, 8, '{"color": "Blanc", "lenses": "Rose"}'),
    (product_id, 'Duck Classic Obsidian + Calm Lenses', 34900, true, 8, '{"color": "Obsidian", "lenses": "Calm Lenses"}');

    -- Insert Dragon (LIFESTYLE)
    INSERT INTO public.products (name, slug, description, short_description, price, sale_price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Dragon', 'dragon', 'Lunettes lifestyle haut de gamme avec technologie de pointe. Interface utilisateur avancée, design premium et fonctionnalités connectées pour l''innovation au quotidien.', 'Lunettes lifestyle innovation premium', 59900, 54900, lifestyle_cat_id, '{"Premium", "Innovation", "Connecté", "Lifestyle"}', true, 8, '{"Interface utilisateur avancée", "Twin Tip Charging Cable inclus", "IA adaptive environnementale", "Design premium ultra-léger", "Écosystème connecté complet"}', '{"Collection": "LIFESTYLE", "IA": "Adaptive environnementale", "Autonomie": "16 heures", "Charge rapide": "30 min = 6h", "Câble": "Twin Tip inclus"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Dragon
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop&crop=center', 'Dragon premium', 0),
    (product_id, 'https://images.unsplash.com/photo-1565598380269-c85f559d1c19?w=600&h=600&fit=crop&crop=center', 'Dragon innovation', 1);

    -- Insert product variants for Dragon
    INSERT INTO public.product_variants (product_id, name, price, sale_price, in_stock, stock_quantity, attributes) VALUES
    (product_id, 'Dragon Obsidian + Fire', 59900, 54900, true, 4, '{"color": "Obsidian", "lenses": "Fire"}'),
    (product_id, 'Dragon Gold + Rose', 59900, 54900, true, 4, '{"color": "Gold", "lenses": "Rose"}');

    -- Insert Euphoria (PRISMATIC)
    INSERT INTO public.products (name, slug, description, short_description, price, sale_price, category_id, tags, in_stock, stock_quantity, features, specifications, is_active)
    VALUES 
    ('Euphoria', 'euphoria', 'L''innovation ultime en lunettes prismatiques. Effets visuels spectaculaires, synchronisation musicale et expérience immersive unique pour les trendsetter.', 'Lunettes prismatiques avec effets immersifs', 69900, 62900, prismatic_cat_id, '{"Prismatic", "Premium", "Immersif", "Tendance"}', true, 6, '{"Synchronisation musicale avancée", "Effets prismatiques hypnotiques", "Réalité augmentée intégrée", "Mode festival et événements", "Design futuriste exclusif"}', '{"Collection": "PRISMATIC", "Synchronisation": "Audio + Rythme", "Effets": "Hypnotique + Cosmic", "AR intégrée": "Basique", "Autonomie": "8 heures intensif"}', true)
    RETURNING id INTO product_id;

    -- Insert product images for Euphoria
    INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order) VALUES
    (product_id, 'https://images.unsplash.com/photo-1556306535-38b7b5077bb8?w=600&h=600&fit=crop&crop=center', 'Euphoria futuriste', 0),
    (product_id, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop&crop=center', 'Euphoria immersif', 1);

    -- Insert product variants for Euphoria
    INSERT INTO public.product_variants (product_id, name, price, sale_price, in_stock, stock_quantity, attributes) VALUES
    (product_id, 'Euphoria Obsidian + Hypnotic Prismatic', 69900, 62900, true, 3, '{"color": "Obsidian", "lenses": "Hypnotic Prismatic"}'),
    (product_id, 'Euphoria Gold + Cosmic Prismatic', 69900, 62900, true, 3, '{"color": "Gold", "lenses": "Cosmic Prismatic"}');

END $$;
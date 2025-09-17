-- Script pour ajouter les colonnes manquantes à la table variants

-- Vérifier d'abord la structure actuelle
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'variants'
ORDER BY ordinal_position;

-- Ajouter les colonnes manquantes si elles n'existent pas
ALTER TABLE variants
ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;

ALTER TABLE variants
ADD COLUMN IF NOT EXISTS sale_price INTEGER;

ALTER TABLE variants
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

ALTER TABLE variants
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Ajouter des commentaires
COMMENT ON COLUMN variants.price IS 'Prix de la variante en centimes';
COMMENT ON COLUMN variants.sale_price IS 'Prix promotionnel en centimes';
COMMENT ON COLUMN variants.stock_quantity IS 'Quantité en stock';
COMMENT ON COLUMN variants.in_stock IS 'Disponibilité de la variante';

-- Vérifier la structure après modifications
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'variants'
ORDER BY ordinal_position;
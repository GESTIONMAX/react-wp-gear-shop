-- Migration pour ajouter le champ SKU à la table product_variants
-- Le SKU (Stock Keeping Unit) est un identifiant unique pour chaque variante

-- Ajouter la colonne SKU
ALTER TABLE product_variants
ADD COLUMN sku VARCHAR(100);

-- Ajouter une contrainte d'unicité sur le SKU
ALTER TABLE product_variants
ADD CONSTRAINT unique_product_variant_sku UNIQUE (sku);

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN product_variants.sku
IS 'Stock Keeping Unit - Identifiant unique pour la variante (ex: MGS-BLK-M-AUD)';

-- Créer un index pour les performances de recherche par SKU
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
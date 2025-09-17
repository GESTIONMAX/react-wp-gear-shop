-- Migration pour ajouter la contrainte de clé étrangère manquante à variant_images
-- Cette contrainte assure l'intégrité référentielle entre variant_images et product_variants

-- Ajouter la contrainte de clé étrangère avec CASCADE DELETE
-- pour que la suppression d'une variante supprime automatiquement ses images
ALTER TABLE variant_images
ADD CONSTRAINT fk_variant_images_product_variant
FOREIGN KEY (variant_id) REFERENCES product_variants(id)
ON DELETE CASCADE;

-- Ajouter un commentaire pour documenter la contrainte
COMMENT ON CONSTRAINT fk_variant_images_product_variant ON variant_images
IS 'Contrainte de clé étrangère vers product_variants avec suppression en cascade';
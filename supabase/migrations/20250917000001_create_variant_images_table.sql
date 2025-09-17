-- Migration pour créer la table variant_images
-- Cette table stocke les images spécifiques aux variantes de produits

-- Créer la table variant_images
CREATE TABLE IF NOT EXISTS variant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'main',
  context VARCHAR(50),
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des commentaires pour la documentation
COMMENT ON TABLE variant_images IS 'Images spécifiques aux variantes de produits stockées dans le bucket variant-images';
COMMENT ON COLUMN variant_images.variant_id IS 'Référence vers la variante de produit';
COMMENT ON COLUMN variant_images.image_url IS 'URL complète de l''image dans Supabase Storage';
COMMENT ON COLUMN variant_images.storage_path IS 'Chemin de stockage dans le bucket variant-images';
COMMENT ON COLUMN variant_images.type IS 'Type d''image : main, swatch, detail, lifestyle, packaging';
COMMENT ON COLUMN variant_images.context IS 'Contexte de prise de vue : studio, lifestyle, detail, packaging, outdoor';
COMMENT ON COLUMN variant_images.alt_text IS 'Texte alternatif pour l''accessibilité';
COMMENT ON COLUMN variant_images.sort_order IS 'Ordre d''affichage des images';

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_variant_images_variant_id ON variant_images(variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_images_type ON variant_images(type);
CREATE INDEX IF NOT EXISTS idx_variant_images_sort_order ON variant_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_variant_images_variant_type ON variant_images(variant_id, type);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_variant_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_variant_images_updated_at
  BEFORE UPDATE ON variant_images
  FOR EACH ROW
  EXECUTE FUNCTION update_variant_images_updated_at();

-- Contraintes de validation
ALTER TABLE variant_images
ADD CONSTRAINT check_variant_images_type
CHECK (type IN ('main', 'swatch', 'detail', 'lifestyle', 'packaging', 'gallery'));

ALTER TABLE variant_images
ADD CONSTRAINT check_variant_images_context
CHECK (context IS NULL OR context IN ('studio', 'lifestyle', 'detail', 'packaging', 'outdoor', 'closeup'));

ALTER TABLE variant_images
ADD CONSTRAINT check_variant_images_sort_order
CHECK (sort_order >= 0);

-- Politique RLS (Row Level Security)
ALTER TABLE variant_images ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique (pour l'affichage des produits)
CREATE POLICY "variant_images_select_policy" ON variant_images
  FOR SELECT USING (true);

-- Politique pour l'insertion (utilisateurs authentifiés uniquement)
CREATE POLICY "variant_images_insert_policy" ON variant_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour la mise à jour (utilisateurs authentifiés uniquement)
CREATE POLICY "variant_images_update_policy" ON variant_images
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique pour la suppression (utilisateurs authentifiés uniquement)
CREATE POLICY "variant_images_delete_policy" ON variant_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insérer quelques données d'exemple pour les tests
-- Note: Ces insertions seront conditionnelles en fonction de l'existence des variantes

-- Fonction utilitaire pour récupérer l'image principale d'une variante
CREATE OR REPLACE FUNCTION get_variant_main_image(variant_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  main_image_url TEXT;
BEGIN
  SELECT image_url INTO main_image_url
  FROM variant_images
  WHERE variant_id = variant_uuid
    AND type = 'main'
  ORDER BY sort_order ASC, created_at ASC
  LIMIT 1;

  RETURN main_image_url;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer toutes les images d'une variante par type
CREATE OR REPLACE FUNCTION get_variant_images_by_type(variant_uuid UUID, image_type TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  image_url TEXT,
  storage_path TEXT,
  type VARCHAR(50),
  context VARCHAR(50),
  alt_text VARCHAR(255),
  sort_order INTEGER
) AS $$
BEGIN
  IF image_type IS NULL THEN
    RETURN QUERY
    SELECT vi.id, vi.image_url, vi.storage_path, vi.type, vi.context, vi.alt_text, vi.sort_order
    FROM variant_images vi
    WHERE vi.variant_id = variant_uuid
    ORDER BY vi.type, vi.sort_order ASC, vi.created_at ASC;
  ELSE
    RETURN QUERY
    SELECT vi.id, vi.image_url, vi.storage_path, vi.type, vi.context, vi.alt_text, vi.sort_order
    FROM variant_images vi
    WHERE vi.variant_id = variant_uuid AND vi.type = image_type
    ORDER BY vi.sort_order ASC, vi.created_at ASC;
  END IF;
END;
$$ LANGUAGE plpgsql;
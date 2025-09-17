-- Script pour créer la table variant_images directement via Supabase SQL Editor

CREATE TABLE IF NOT EXISTS variant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'main',
  context VARCHAR(50) DEFAULT 'studio',
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des commentaires
COMMENT ON TABLE variant_images IS 'Images spécifiques aux variantes de produits';
COMMENT ON COLUMN variant_images.variant_id IS 'ID de la variante (peut être texte pour le moment)';
COMMENT ON COLUMN variant_images.image_url IS 'URL complète de l''image dans Supabase Storage';
COMMENT ON COLUMN variant_images.storage_path IS 'Chemin de stockage dans le bucket';
COMMENT ON COLUMN variant_images.type IS 'Type: main, swatch, detail, lifestyle, packaging';
COMMENT ON COLUMN variant_images.context IS 'Contexte: studio, lifestyle, detail, packaging, outdoor';

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_variant_images_variant_id ON variant_images(variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_images_type ON variant_images(variant_id, type);

-- Trigger pour updated_at
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

-- Contraintes
ALTER TABLE variant_images
ADD CONSTRAINT check_variant_images_type
CHECK (type IN ('main', 'swatch', 'detail', 'lifestyle', 'packaging', 'gallery'));

-- Politiques RLS
ALTER TABLE variant_images ENABLE ROW LEVEL SECURITY;

-- Lecture publique (pour affichage produits)
CREATE POLICY "variant_images_select_policy" ON variant_images
  FOR SELECT USING (true);

-- Écriture pour utilisateurs authentifiés
CREATE POLICY "variant_images_insert_policy" ON variant_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "variant_images_update_policy" ON variant_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "variant_images_delete_policy" ON variant_images
  FOR DELETE USING (auth.role() = 'authenticated');
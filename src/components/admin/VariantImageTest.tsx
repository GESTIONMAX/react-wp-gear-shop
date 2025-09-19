import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useVariantMainImage } from '@/hooks/useVariantImages';

const VariantImageTest: React.FC = () => {
  const [variants, setVariants] = useState<{ id: string; name: string; sku?: string; product_id: string }[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Hook pour récupérer l'image de la variante sélectionnée
  const { mainImage, loading: imageLoading } = useVariantMainImage(selectedVariantId);

  // Charger toutes les variantes Music Shield
  const loadVariants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('variants')
        .select('id, name, sku, product_id')
        .ilike('name', '%music%shield%');

      if (error) throw error;
      setVariants(data || []);

      if (data && data.length > 0) {
        setSelectedVariantId(data[0].id);
      }
    } catch (error) {
      console.error('Erreur chargement variantes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier les images dans la base
  const checkVariantImages = async () => {
    try {
      const { data, error } = await supabase
        .from('variant_images')
        .select('*')
        .eq('variant_id', selectedVariantId);

      if (error) throw error;
      console.log('Images trouvées pour cette variante:', data);
    } catch (error) {
      console.error('Erreur vérification images:', error);
    }
  };

  useEffect(() => {
    loadVariants();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test d'affichage des images de variantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Variantes Music Shield trouvées :</h3>
            {loading ? (
              <p>Chargement...</p>
            ) : variants.length > 0 ? (
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`p-2 border rounded cursor-pointer ${
                      selectedVariantId === variant.id ? 'bg-blue-100' : 'bg-gray-50'
                    }`}
                    onClick={() => setSelectedVariantId(variant.id)}
                  >
                    <div><strong>{variant.name}</strong></div>
                    <div className="text-sm text-gray-600">ID: {variant.id}</div>
                    <div className="text-sm text-gray-600">SKU: {variant.sku}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500">Aucune variante Music Shield trouvée</p>
            )}
          </div>

          {selectedVariantId && (
            <div>
              <h3 className="font-semibold mb-2">Image de la variante sélectionnée :</h3>

              {imageLoading ? (
                <div className="w-64 h-64 bg-gray-200 animate-pulse rounded flex items-center justify-center">
                  <span>Chargement...</span>
                </div>
              ) : mainImage ? (
                <div className="space-y-2">
                  <img
                    src={mainImage.image_url}
                    alt={mainImage.alt_text || 'Image variante'}
                    className="w-64 h-64 object-cover border rounded"
                  />
                  <div className="text-sm bg-gray-100 p-2 rounded">
                    <div><strong>URL:</strong> {mainImage.image_url}</div>
                    <div><strong>Type:</strong> {mainImage.type}</div>
                    <div><strong>Contexte:</strong> {mainImage.context}</div>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center">
                  <span>Aucune image trouvée</span>
                </div>
              )}

              <Button onClick={checkVariantImages} className="mt-2">
                Vérifier les images en base
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VariantImageTest;
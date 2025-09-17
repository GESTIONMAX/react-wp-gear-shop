import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProductImage = (productId: string, fallbackImage?: string) => {
  const [imageUrl, setImageUrl] = useState<string>(fallbackImage || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const getProductImage = async () => {
      setLoading(true);
      try {
        // D'abord, chercher si le produit a une image directe
        if (fallbackImage && fallbackImage !== '') {
          setImageUrl(fallbackImage);
          setLoading(false);
          return;
        }

        // Sinon, chercher l'image de la première variante
        // 1. D'abord chercher dans product_variants
        const { data: productVariants, error: productVariantsError } = await supabase
          .from('product_variants')
          .select('id')
          .eq('product_id', productId)
          .limit(1);

        if (!productVariantsError && productVariants && productVariants.length > 0) {
          // 2. Récupérer l'image principale de la première variante product_variants
          const { data: variantImage, error: imageError } = await supabase
            .from('variant_images')
            .select('image_url')
            .eq('variant_id', productVariants[0].id)
            .eq('type', 'main')
            .limit(1)
            .single();

          if (!imageError && variantImage) {
            setImageUrl(variantImage.image_url);
            setLoading(false);
            return;
          }
        }

        // 3. Fallback vers la table variants (ancienne)
        const { data: variants, error: variantsError } = await supabase
          .from('variants')
          .select('id')
          .eq('product_id', productId)
          .limit(1);

        if (variantsError) throw variantsError;

        if (variants && variants.length > 0) {
          // 2. Récupérer l'image principale de la première variante
          const { data: variantImage, error: imageError } = await supabase
            .from('variant_images')
            .select('image_url')
            .eq('variant_id', variants[0].id)
            .eq('type', 'main')
            .limit(1)
            .single();

          if (!imageError && variantImage) {
            setImageUrl(variantImage.image_url);
          } else {
            // Fallback vers n'importe quelle image de variante
            const { data: anyVariantImage } = await supabase
              .from('variant_images')
              .select('image_url')
              .eq('variant_id', variants[0].id)
              .limit(1)
              .single();

            if (anyVariantImage) {
              setImageUrl(anyVariantImage.image_url);
            }
          }
        }
      } catch (error) {
        console.error('Erreur récupération image produit:', error);
      } finally {
        setLoading(false);
      }
    };

    getProductImage();
  }, [productId, fallbackImage]);

  return { imageUrl, loading };
};
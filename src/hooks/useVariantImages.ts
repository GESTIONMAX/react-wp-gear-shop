import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VariantImage {
  id: string;
  variant_id: string;
  image_url: string;
  storage_path: string;
  type: string;
  context?: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

export interface VariantImageFilters {
  variantId?: string;
  type?: string;
  context?: string;
}

export const useVariantImages = (filters?: VariantImageFilters) => {
  const [images, setImages] = useState<VariantImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('variant_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (filters?.variantId) {
        query = query.eq('variant_id', filters.variantId);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.context) {
        query = query.eq('context', filters.context);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setImages(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du chargement des images de variantes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [filters?.variantId, filters?.type, filters?.context]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages
  };
};

// Hook pour récupérer l'image principale d'une variante
export const useVariantMainImage = (variantId: string) => {
  const [mainImage, setMainImage] = useState<VariantImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!variantId) return;

    const fetchMainImage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('variant_images')
          .select('*')
          .eq('variant_id', variantId)
          .eq('type', 'main')
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
          throw error;
        }

        setMainImage(data || null);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'image principale:', err);
        setMainImage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMainImage();
  }, [variantId]);

  return { mainImage, loading };
};

// Hook pour récupérer toutes les images d'une variante groupées par type
export const useVariantImagesByType = (variantId: string) => {
  const { images, loading, error, refetch } = useVariantImages({ variantId });

  const imagesByType = images.reduce((acc, image) => {
    if (!acc[image.type]) {
      acc[image.type] = [];
    }
    acc[image.type].push(image);
    return acc;
  }, {} as Record<string, VariantImage[]>);

  return {
    imagesByType,
    allImages: images,
    loading,
    error,
    refetch
  };
};

// Hook pour les opérations CRUD sur les images de variantes
export const useVariantImageOperations = () => {
  const [loading, setLoading] = useState(false);

  const deleteImage = async (imageId: string, storagePath: string) => {
    setLoading(true);
    try {
      // Supprimer de Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('variant-images')
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // Supprimer de la base de données
      const { error: dbError } = await supabase
        .from('variant_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès.",
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'image.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateImageMetadata = async (
    imageId: string,
    updates: Partial<Pick<VariantImage, 'type' | 'context' | 'alt_text' | 'sort_order'>>
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('variant_images')
        .update(updates)
        .eq('id', imageId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Image mise à jour",
        description: "Les métadonnées ont été mises à jour.",
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteImage,
    updateImageMetadata,
    loading
  };
};
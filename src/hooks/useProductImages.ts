import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  type: string;
  context?: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

export interface ProductImageFilters {
  productId?: string;
  type?: string;
  context?: string;
}

export const useProductImages = (filters?: ProductImageFilters) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('product_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (filters?.productId) {
        query = query.eq('product_id', filters.productId);
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
      console.error('Erreur lors du chargement des images de produits:', err);
    } finally {
      setLoading(false);
    }
  }, [filters?.productId, filters?.type, filters?.context]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages
  };
};

// Hook pour récupérer l'image principale d'un produit
export const useProductMainImage = (productId: string) => {
  const [mainImage, setMainImage] = useState<ProductImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchMainImage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', productId)
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
  }, [productId]);

  return { mainImage, loading };
};

// Hook pour récupérer toutes les images d'un produit groupées par type
export const useProductImagesByType = (productId: string) => {
  const { images, loading, error, refetch } = useProductImages({ productId });

  const imagesByType = images.reduce((acc, image) => {
    if (!acc[image.type]) {
      acc[image.type] = [];
    }
    acc[image.type].push(image);
    return acc;
  }, {} as Record<string, ProductImage[]>);

  return {
    imagesByType,
    allImages: images,
    loading,
    error,
    refetch
  };
};

// Hook pour les opérations CRUD sur les images de produits
export const useProductImageOperations = () => {
  const [loading, setLoading] = useState(false);

  const deleteImage = async (imageId: string, storagePath: string) => {
    setLoading(true);
    try {
      // Supprimer de Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }

      // Supprimer de la base de données
      const { error: dbError } = await supabase
        .from('product_images')
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
    updates: Partial<Pick<ProductImage, 'type' | 'context' | 'alt_text' | 'sort_order'>>
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_images')
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
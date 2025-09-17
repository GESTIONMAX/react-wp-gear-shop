import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  category_id?: string;
  in_stock: boolean;
  stock_quantity: number;
  tags?: string[];
  features?: string[];
  specifications?: Record<string, string>;
  images?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

// Hook pour récupérer tous les produits (admin)
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(id, image_url, alt_text, sort_order),
          variants:product_variants(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Hook pour récupérer un produit spécifique (admin)
export const useAdminProduct = (productId: string) => {
  return useQuery({
    queryKey: ['adminProduct', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(id, image_url, alt_text, sort_order),
          variants:product_variants(*)
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};

// Hook pour créer un produit
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: CreateProductData) => {
      // Créer le produit
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          short_description: productData.short_description,
          price: productData.price,
          sale_price: productData.sale_price,
          category_id: productData.category_id,
          in_stock: productData.in_stock,
          stock_quantity: productData.stock_quantity,
          tags: productData.tags || [],
          features: productData.features || [],
          specifications: productData.specifications || {},
          is_active: true
        })
        .select()
        .single();

      if (productError) throw productError;

      // Ajouter les images si présentes
      if (productData.images && productData.images.length > 0) {
        const imageInserts = productData.images.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          sort_order: index,
          alt_text: `${productData.name} - Image ${index + 1}`
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour un produit
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: UpdateProductData) => {
      const { id, images, ...updateData } = productData;

      // Mettre à jour le produit
      const { data: product, error: productError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (productError) throw productError;

      // Gérer les images si présentes
      if (images) {
        // Supprimer les anciennes images
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', id);

        if (deleteError) throw deleteError;

        // Ajouter les nouvelles images
        if (images.length > 0) {
          const imageInserts = images.map((imageUrl, index) => ({
            product_id: id,
            image_url: imageUrl,
            sort_order: index,
            alt_text: `${updateData.name || 'Produit'} - Image ${index + 1}`
          }));

          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(imageInserts);

          if (imagesError) throw imagesError;
        }
      }

      return product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminProduct', variables.id] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour supprimer un produit
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      try {
        // 1. Supprimer les images du produit depuis Supabase Storage et la DB
        const { data: productImages } = await supabase
          .from('product_images')
          .select('storage_path')
          .eq('product_id', productId);

        if (productImages && productImages.length > 0) {
          // Supprimer les fichiers du storage
          const storagePaths = productImages.map(img => img.storage_path);
          const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove(storagePaths);

          if (storageError) {
            console.warn('Erreur suppression storage:', storageError);
            // Ne pas échouer si les fichiers n'existent pas
          }

          // Supprimer les entrées de la table product_images
          const { error: imagesError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId);

          if (imagesError) throw imagesError;
        }

        // 2. Supprimer les variantes du produit si elles existent
        const { error: variantsError } = await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', productId);

        if (variantsError && variantsError.code !== 'PGRST116') { // PGRST116 = no rows found
          console.warn('Erreur suppression variantes:', variantsError);
        }

        // 3. Supprimer les images de variantes si elles existent
        const { data: variantImages } = await supabase
          .from('variant_images')
          .select('storage_path, variant_id')
          .in('variant_id',
            (await supabase
              .from('variants')
              .select('id')
              .eq('product_id', productId)
            ).data?.map(v => v.id) || []
          );

        if (variantImages && variantImages.length > 0) {
          // Supprimer les fichiers du storage
          const variantStoragePaths = variantImages.map(img => img.storage_path);
          const { error: variantStorageError } = await supabase.storage
            .from('variant-images')
            .remove(variantStoragePaths);

          if (variantStorageError) {
            console.warn('Erreur suppression variant storage:', variantStorageError);
          }

          // Supprimer les entrées de la table variant_images
          const { error: variantImagesError } = await supabase
            .from('variant_images')
            .delete()
            .in('variant_id', variantImages.map(img => img.variant_id));

          if (variantImagesError) {
            console.warn('Erreur suppression variant images:', variantImagesError);
          }
        }

        // 4. Supprimer les variantes du produit
        const { error: productVariantsError } = await supabase
          .from('variants')
          .delete()
          .eq('product_id', productId);

        if (productVariantsError && productVariantsError.code !== 'PGRST116') {
          console.warn('Erreur suppression variants:', productVariantsError);
        }

        // 5. Finalement, supprimer le produit
        const { error: productError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (productError) throw productError;

        return productId;
      } catch (error) {
        console.error('Erreur lors de la suppression complète:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit et toutes ses données associées ont été supprimés avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du produit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de suppression",
        description: `Impossible de supprimer le produit: ${errorMessage}`,
        variant: "destructive",
      });
    },
  });
};

// Hook pour activer/désactiver un produit
export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut du produit a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut du produit. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour récupérer les catégories pour l'admin
export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types pour les variantes
export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string; // Stock Keeping Unit - identifiant unique pour la variante
  price: number;
  sale_price?: number;
  in_stock: boolean;
  stock_quantity: number;
  attributes: Record<string, string>;
  created_at: string;
  updated_at: string;
  products?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Hook pour récupérer toutes les variantes avec les informations produit
export const useVariants = () => {
  return useQuery({
    queryKey: ['variants'],
    queryFn: async () => {
      console.log('Chargement des variantes...');

      try {
        // Essayer d'abord avec le champ SKU
        const { data, error } = await supabase
          .from('product_variants')
          .select(`
            id,
            product_id,
            name,
            sku,
            price,
            sale_price,
            in_stock,
            stock_quantity,
            attributes,
            created_at,
            updated_at,
            products!inner(
              id,
              name,
              slug
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur lors du chargement des variantes:', error);

          // Si l'erreur est liée au champ SKU manquant, essayer sans SKU
          if (error.message && error.message.includes('sku')) {
            console.log('Le champ SKU n\'existe pas encore, chargement sans SKU...');

            const { data: dataWithoutSku, error: errorWithoutSku } = await supabase
              .from('product_variants')
              .select(`
                id,
                product_id,
                name,
                price,
                sale_price,
                in_stock,
                stock_quantity,
                attributes,
                created_at,
                updated_at,
                products!inner(
                  id,
                  name,
                  slug
                )
              `)
              .order('created_at', { ascending: false });

            if (errorWithoutSku) throw errorWithoutSku;

            // Ajouter des SKU vides aux données pour la compatibilité
            const dataWithEmptySku = dataWithoutSku?.map(variant => ({
              ...variant,
              sku: null
            }));

            console.log('Variantes chargées sans SKU:', dataWithEmptySku?.length || 0);
            return dataWithEmptySku as ProductVariant[];
          }

          throw error;
        }

        console.log('Variantes chargées avec succès:', data?.length || 0);
        return data as ProductVariant[];

      } catch (err) {
        console.error('Erreur complète lors du chargement des variantes:', err);
        throw err;
      }
    },
  });
};

// Hook pour récupérer les variantes actives
export const useActiveVariants = () => {
  return useQuery({
    queryKey: ['variants', 'active'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select(`
            id,
            product_id,
            name,
            sku,
            price,
            sale_price,
            in_stock,
            stock_quantity,
            attributes,
            created_at,
            updated_at,
            products!inner(
              id,
              name,
              slug
            )
          `)
          .eq('in_stock', true)
          .order('created_at', { ascending: false });

        if (error) {
          if (error.message && error.message.includes('sku')) {
            // Fallback sans SKU
            const { data: dataWithoutSku, error: errorWithoutSku } = await supabase
              .from('product_variants')
              .select(`
                id,
                product_id,
                name,
                price,
                sale_price,
                in_stock,
                stock_quantity,
                attributes,
                created_at,
                updated_at,
                products!inner(
                  id,
                  name,
                  slug
                )
              `)
              .eq('in_stock', true)
              .order('created_at', { ascending: false });

            if (errorWithoutSku) throw errorWithoutSku;

            return dataWithoutSku?.map(variant => ({
              ...variant,
              sku: null
            })) as ProductVariant[];
          }
          throw error;
        }

        return data as ProductVariant[];
      } catch (err) {
        console.error('Erreur chargement variantes actives:', err);
        throw err;
      }
    },
  });
};

// Hook pour récupérer les variantes d'un produit
export const useProductVariants = (productId: string) => {
  return useQuery({
    queryKey: ['variants', 'product', productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select(`
            id,
            product_id,
            name,
            sku,
            price,
            sale_price,
            in_stock,
            stock_quantity,
            attributes,
            created_at,
            updated_at
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) {
          if (error.message && error.message.includes('sku')) {
            // Fallback sans SKU
            const { data: dataWithoutSku, error: errorWithoutSku } = await supabase
              .from('product_variants')
              .select(`
                id,
                product_id,
                name,
                price,
                sale_price,
                in_stock,
                stock_quantity,
                attributes,
                created_at,
                updated_at
              `)
              .eq('product_id', productId)
              .order('created_at', { ascending: false });

            if (errorWithoutSku) throw errorWithoutSku;

            return dataWithoutSku?.map(variant => ({
              ...variant,
              sku: null
            })) as ProductVariant[];
          }
          throw error;
        }

        return data as ProductVariant[];
      } catch (err) {
        console.error('Erreur chargement variantes produit:', err);
        throw err;
      }
    },
    enabled: !!productId,
  });
};

// Hook pour récupérer une variante par ID
export const useVariant = (id: string) => {
  return useQuery({
    queryKey: ['variant', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select(`
            id,
            product_id,
            name,
            sku,
            price,
            sale_price,
            in_stock,
            stock_quantity,
            attributes,
            created_at,
            updated_at,
            products!inner(
              id,
              name,
              slug
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          if (error.message && error.message.includes('sku')) {
            // Fallback sans SKU
            const { data: dataWithoutSku, error: errorWithoutSku } = await supabase
              .from('product_variants')
              .select(`
                id,
                product_id,
                name,
                price,
                sale_price,
                in_stock,
                stock_quantity,
                attributes,
                created_at,
                updated_at,
                products!inner(
                  id,
                  name,
                  slug
                )
              `)
              .eq('id', id)
              .single();

            if (errorWithoutSku) throw errorWithoutSku;

            return {
              ...dataWithoutSku,
              sku: null
            } as ProductVariant;
          }
          throw error;
        }

        return data as ProductVariant;
      } catch (err) {
        console.error('Erreur chargement variante:', err);
        throw err;
      }
    },
    enabled: !!id,
  });
};

// Hook pour créer une variante
export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (variantData: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at' | 'products'>) => {
      const { data, error } = await supabase
        .from('product_variants')
        .insert(variantData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Variante créée",
        description: "La variante a été créée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la variante.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour une variante
export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...variantData }: Partial<ProductVariant> & { id: string }) => {
      const { data, error } = await supabase
        .from('product_variants')
        .update(variantData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Variante mise à jour",
        description: "La variante a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la variante.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour supprimer une variante
export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Variante supprimée",
        description: "La variante a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la variante.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour basculer le statut stock d'une variante
export const useToggleVariantStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Récupérer le statut actuel
      const { data: currentData, error: fetchError } = await supabase
        .from('product_variants')
        .select('in_stock')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Inverser le statut
      const { data, error } = await supabase
        .from('product_variants')
        .update({ in_stock: !currentData.in_stock })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de stock de la variante a été mis à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    },
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];
type ProductImage = { image_url: string; alt_text?: string; sort_order: number };
type ProductVariant = Database['public']['Tables']['product_variants']['Row'];

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_variant_id?: string;
  created_at: string;
  updated_at: string;
}

// Hook pour récupérer la wishlist de l'utilisateur
export const useWishlist = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async (): Promise<WishlistItem[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

// Hook pour vérifier si un produit est dans la wishlist
export const useIsInWishlist = (productId: string, variantId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist-check', user?.id, productId, variantId],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;
      
      let query = supabase
        .from('wishlist')
        .select('id')
        .eq('product_id', productId);
        
      if (variantId) {
        query = query.eq('product_variant_id', variantId);
      } else {
        query = query.is('product_variant_id', null);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!productId,
  });
};

// Hook pour ajouter/retirer de la wishlist
export const useToggleWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      variantId, 
      isInWishlist 
    }: { 
      productId: string; 
      variantId?: string; 
      isInWishlist: boolean;
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (isInWishlist) {
        // Retirer de la wishlist
        let query = supabase
          .from('wishlist')
          .delete()
          .eq('product_id', productId);
          
        if (variantId) {
          query = query.eq('product_variant_id', variantId);
        } else {
          query = query.is('product_variant_id', null);
        }
        
        const { error } = await query;
        if (error) throw error;
        
        return { action: 'removed' };
      } else {
        // Ajouter à la wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId,
            product_variant_id: variantId || null,
          });
          
        if (error) throw error;
        
        return { action: 'added' };
      }
    },
    onSuccess: (result, { productId, variantId }) => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ 
        queryKey: ['wishlist-check', user?.id, productId, variantId] 
      });
      
      // Afficher une notification
      if (result.action === 'added') {
        toast({
          title: t('wishlist.added') || "Ajouté aux favoris",
          description: t('wishlist.addedDescription') || "Le produit a été ajouté à votre liste de favoris",
        });
      } else {
        toast({
          title: t('wishlist.removed') || "Retiré des favoris",
          description: t('wishlist.removedDescription') || "Le produit a été retiré de votre liste de favoris",
        });
      }
    },
    onError: (error: Error) => {
      console.error('Wishlist error:', error);
      
      if (error.message === 'User not authenticated') {
        toast({
          title: t('auth.loginRequired') || "Connexion requise",
          description: t('auth.loginRequiredDescription') || "Vous devez être connecté pour utiliser les favoris",
          variant: "destructive",
        });
      } else {
        toast({
          title: t('common.error') || "Erreur",
          description: t('wishlist.error') || "Une erreur est survenue lors de la mise à jour de vos favoris",
          variant: "destructive",
        });
      }
    },
  });
};

// Hook pour récupérer les détails des produits de la wishlist
export const useWishlistWithProducts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist-products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: wishlistItems, error } = await supabase
        .from('wishlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!wishlistItems || wishlistItems.length === 0) return [];
      
      // Récupérer les détails des produits
      const productIds = [...new Set(wishlistItems.map(item => item.product_id))];
      
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, alt_text, sort_order),
          product_variants(*)
        `)
        .in('id', productIds)
        .eq('is_active', true);
        
      if (productsError) throw productsError;
      
      // Récupérer les catégories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true);

      if (categoriesError) throw categoriesError;
      
      const categoryMap = new Map(categories.map((c: Category) => [c.id, c]));
      
      // Combiner les données
      return wishlistItems.map(wishlistItem => {
        const product = products?.find(p => p.id === wishlistItem.product_id);
        if (!product) return null;
        
        const category = categoryMap.get(product.category_id);
        
        return {
          wishlistItem,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            shortDescription: product.short_description || '',
            price: product.price / 100,
            salePrice: product.sale_price ? product.sale_price / 100 : undefined,
            images: product.product_images
              ?.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order)
              ?.map((img: ProductImage) => img.image_url) || [],
            category: category?.name || '',
            tags: product.tags || [],
            inStock: product.in_stock,
            stockQuantity: product.stock_quantity,
            features: product.features || [],
            specifications: (product.specifications as Record<string, string>) || {},
            variants: product.product_variants?.map((variant: ProductVariant) => ({
              id: variant.id,
              name: variant.name,
              price: variant.price / 100,
              salePrice: variant.sale_price ? variant.sale_price / 100 : undefined,
              inStock: variant.in_stock,
              attributes: (variant.attributes as Record<string, string>) || {}
            })) || []
          }
        };
      }).filter(Boolean);
    },
    enabled: !!user,
  });
};
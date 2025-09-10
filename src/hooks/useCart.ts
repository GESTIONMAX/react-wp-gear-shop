import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface CartItem {
  id: string;
  product: Product;
  productVariantId?: string;
  quantity: number;
  createdAt: string;
}

export const useSupabaseCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch cart items from Supabase
  const cartQuery = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async (): Promise<CartItem[]> => {
      if (!user) return [];

      const { data: cartItems, error } = await supabase
        .from('shopping_cart')
        .select(`
          id,
          quantity,
          created_at,
          product_variant_id,
          products!inner(
            id,
            name,
            slug,
            description,
            short_description,
            price,
            sale_price,
            tags,
            in_stock,
            stock_quantity,
            features,
            specifications,
            categories!inner(name, slug),
            product_images(image_url, alt_text, sort_order),
            product_variants(*)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        createdAt: item.created_at,
        productVariantId: item.product_variant_id,
        product: {
          id: item.products.id,
          name: item.products.name,
          slug: item.products.slug,
          description: item.products.description || '',
          shortDescription: item.products.short_description || '',
          price: item.products.price / 100,
          salePrice: item.products.sale_price ? item.products.sale_price / 100 : undefined,
          images: item.products.product_images
            ?.sort((a, b) => a.sort_order - b.sort_order)
            ?.map(img => img.image_url) || [],
          category: item.products.categories?.name || '',
          tags: item.products.tags || [],
          inStock: item.products.in_stock,
          stockQuantity: item.products.stock_quantity,
          features: item.products.features || [],
          specifications: (item.products.specifications as Record<string, string>) || {},
          variants: item.products.product_variants?.map(variant => ({
            id: variant.id,
            name: variant.name,
            price: variant.price / 100,
            salePrice: variant.sale_price ? variant.sale_price / 100 : undefined,
            inStock: variant.in_stock,
            attributes: (variant.attributes as Record<string, string>) || {}
          })) || []
        }
      }));
    },
    enabled: !!user,
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, variantId, quantity = 1 }: {
      productId: string;
      variantId?: string;
      quantity?: number;
    }) => {
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('shopping_cart')
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            product_variant_id: variantId || null,
            quantity,
          },
          {
            onConflict: 'user_id,product_id,product_variant_id',
            ignoreDuplicates: false
          }
        )
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Ajouté au panier",
        description: "Le produit a été ajouté à votre panier",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      if (!user) throw new Error('User must be authenticated');

      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier",
      });
    },
  });

  // Update quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: {
      cartItemId: string;
      quantity: number;
    }) => {
      if (!user) throw new Error('User must be authenticated');

      if (quantity <= 0) {
        return removeFromCartMutation.mutate(cartItemId);
      }

      const { error } = await supabase
        .from('shopping_cart')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User must be authenticated');

      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé",
      });
    },
  });

  const cartItems = cartQuery.data || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const variant = item.productVariantId
      ? item.product.variants?.find(v => v.id === item.productVariantId)
      : undefined;
    const price = variant?.salePrice || variant?.price || item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return {
    items: cartItems,
    totalItems,
    totalPrice,
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};
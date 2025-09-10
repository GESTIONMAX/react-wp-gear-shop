import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, ShippingAddress } from '@/types/order';

interface CreateOrderData {
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  items: Array<{
    productId: string;
    productVariantId?: string;
    productName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
  }>;
}

// Hook pour récupérer une commande par ID
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as unknown as Order;
    },
    enabled: !!orderId,
  });
};

// Hook pour récupérer les commandes de l'utilisateur
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
  });
};

// Hook pour créer une commande
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // 1. Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: orderData.totalAmount,
          shipping_address: orderData.shippingAddress,
          billing_address: orderData.billingAddress,
          payment_method: orderData.paymentMethod,
          notes: orderData.notes,
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Créer les articles de commande
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_variant_id: item.productVariantId,
        product_name: item.productName,
        variant_name: item.variantName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.unitPrice * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order as unknown as Order;
    },
    onSuccess: () => {
      // Invalider les requêtes de commandes pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Hook pour mettre à jour le statut d'une commande
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalider les requêtes de commandes
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
    },
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order, OrderItem } from '@/types/order';

// Hook pour récupérer les commandes d'un utilisateur
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_id,
            product_variant_id,
            product_name,
            variant_name,
            quantity,
            unit_price,
            total_price,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
};

// Hook pour récupérer une commande spécifique
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_id,
            product_variant_id,
            product_name,
            variant_name,
            quantity,
            unit_price,
            total_price,
            created_at
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as any;
    },
    enabled: !!orderId,
  });
};

// Hook pour créer une commande
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      // Séparer les items de la commande
      const { order_items, ...orderFields } = orderData;
      
      // Créer la commande d'abord
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderFields)
        .select()
        .single();

      if (orderError) throw orderError;

      // Créer les items de la commande
      if (order_items && order_items.length > 0) {
        const itemsWithOrderId = order_items.map((item: any) => ({
          ...item,
          order_id: order.id,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsWithOrderId);

        if (itemsError) throw itemsError;
      }

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Commande créée",
        description: "Votre commande a été créée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour récupérer toutes les commandes (admin)
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_id,
            product_variant_id,
            product_name,
            variant_name,
            quantity,
            unit_price,
            total_price,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
};

// Hook pour récupérer une commande spécifique (admin)
export const useAdminOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_id,
            product_variant_id,
            product_name,
            variant_name,
            quantity,
            unit_price,
            total_price,
            created_at
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as any;
    },
    enabled: !!orderId,
  });
};

// Hook pour mettre à jour le statut d'une commande
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour le statut de paiement
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ orderId, paymentStatus }: { orderId: string; paymentStatus: Order['payment_status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Paiement mis à jour",
        description: "Le statut de paiement a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de paiement.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour ajouter des notes à une commande
export const useUpdateOrderNotes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ orderId, notes }: { orderId: string; notes: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', data.id] });
      toast({
        title: "Notes mises à jour",
        description: "Les notes de la commande ont été mises à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les notes.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour supprimer une commande (admin uniquement)
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      // Supprimer d'abord les items de la commande
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Puis supprimer la commande
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande.",
        variant: "destructive",
      });
    },
  });
};

// Fonction utilitaire pour formater le prix
export const formatPrice = (price: number, currency: string = 'EUR') => {
  return `${(price / 100).toFixed(2)} ${currency === 'EUR' ? '€' : currency}`;
};

// Fonction utilitaire pour obtenir la couleur du badge de statut
export const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 text-yellow-50';
    case 'confirmed':
      return 'bg-blue-500 text-blue-50';
    case 'shipped':
      return 'bg-purple-500 text-purple-50';
    case 'delivered':
      return 'bg-green-500 text-green-50';
    case 'cancelled':
      return 'bg-red-500 text-red-50';
    default:
      return 'bg-gray-500 text-gray-50';
  }
};

// Fonction utilitaire pour obtenir la couleur du badge de paiement
export const getPaymentStatusColor = (status: Order['payment_status']) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500 text-green-50';
    case 'pending':
      return 'bg-yellow-500 text-yellow-50';
    case 'failed':
      return 'bg-red-500 text-red-50';
    case 'refunded':
      return 'bg-orange-500 text-orange-50';
    default:
      return 'bg-gray-500 text-gray-50';
  }
};
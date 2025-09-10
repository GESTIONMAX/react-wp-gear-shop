import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Invoice, CreateInvoiceData } from '@/types/invoice';
import { toast } from '@/hooks/use-toast';

// Hook pour récupérer une facture spécifique
export const useInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          items:invoice_items(*)
        `)
        .eq('id', invoiceId)
        .single();
      
      if (error) throw error;
      return data as Invoice;
    },
    enabled: !!invoiceId,
  });
};

// Hook pour récupérer toutes les factures de l'utilisateur
export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          items:invoice_items(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invoice[];
    },
  });
};

// Hook pour créer une nouvelle facture
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoiceData: CreateInvoiceData) => {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Créer la facture
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          order_id: invoiceData.order_id,
          total_amount: invoiceData.total_amount,
          currency: invoiceData.currency || 'EUR',
          status: invoiceData.status || 'draft',
          invoice_date: invoiceData.invoice_date || new Date().toISOString().split('T')[0],
          due_date: invoiceData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: invoiceData.notes,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Créer les éléments de la facture
      if (invoiceData.items && invoiceData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            invoiceData.items.map(item => ({
              invoice_id: invoice.id,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.total_price,
            }))
          );

        if (itemsError) throw itemsError;
      }

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création de la facture:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour créer une facture à partir d'une commande
export const useCreateInvoiceFromOrder = () => {
  const createInvoice = useCreateInvoice();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      // Récupérer la commande avec ses éléments
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Commande non trouvée');

      // Créer les données de la facture
      const invoiceData: CreateInvoiceData = {
        order_id: order.id,
        total_amount: order.total_amount,
        currency: order.currency,
        status: 'draft',
        items: order.items?.map(item => ({
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })) || [],
      };

      return createInvoice.mutateAsync(invoiceData);
    },
  });
};

// Hook pour mettre à jour le statut d'une facture
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ invoiceId, status }: { invoiceId: string; status: 'draft' | 'sent' | 'paid' | 'cancelled' }) => {
      const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.invoiceId] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la facture a été mis à jour.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
};
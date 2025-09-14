import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ShippingAddress } from '@/types/order';

interface CreatePaymentSessionData {
  orderData: {
    user_id: string;
    total_amount: number;
    shipping_address: ShippingAddress;
    billing_address: ShippingAddress;
    notes?: string;
    order_items: Array<{
      product_id: string;
      product_variant_id?: string;
      product_name: string;
      variant_name?: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  };
  successUrl: string;
  cancelUrl: string;
}

interface PaymentSessionResponse {
  sessionId: string;
  url: string;
  orderId: string;
}

const createPaymentSession = async (data: CreatePaymentSessionData): Promise<PaymentSessionResponse> => {
  const { data: response, error } = await supabase.functions.invoke('create-payment-session', {
    body: data,
  });

  if (error) {
    console.error('Error creating payment session:', error);
    throw new Error(error.message || 'Failed to create payment session');
  }

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
};

export const useCreatePaymentSession = () => {
  return useMutation({
    mutationFn: createPaymentSession,
    onError: (error) => {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    },
  });
};
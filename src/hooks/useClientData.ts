import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ClientData {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  address_complement: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  preferred_shipping_address: any | null;
  preferred_billing_address: any | null;
  marketing_phone: string | null;
  marketing_consent: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Hook pour récupérer les données client par user_id
export const useClientData = (userId: string) => {
  return useQuery({
    queryKey: ['clientData', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as ClientData | null;
    },
    enabled: !!userId,
  });
};

// Hook pour récupérer tous les clients (pour les admins)
export const useAllClients = () => {
  return useQuery({
    queryKey: ['allClients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ClientData[];
    },
  });
};

// Hook pour mettre à jour les données client
export const useUpdateClientData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<ClientData> }) => {
      const { data, error } = await supabase
        .from('clients')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      queryClient.invalidateQueries({ queryKey: ['clientData', data.user_id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Données client mises à jour",
        description: "Les informations du client ont été mises à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des données client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les données client.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour créer un nouveau client
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientData: Omit<ClientData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client créé",
        description: "Le nouveau client a été créé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création du client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client.",
        variant: "destructive",
      });
    },
  });
};
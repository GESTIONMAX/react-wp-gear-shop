import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ShippingAddress } from '@/types';

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
  preferred_shipping_address: ShippingAddress | null;
  preferred_billing_address: ShippingAddress | null;
  marketing_phone: string | null;
  marketing_consent: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientWithRole extends ClientData {
  role?: string;
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
      console.log('=== Fetching all clients - Testing different approaches ===');

      // Approche 1: Tester quelle table existe
      try {
        // Essayer d'abord la table 'clients'
        const { data: clients, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5); // Limiter pour les tests

        if (!clientsError && clients) {
          console.log('Using clients table:', clients.length);
          const clientsWithRoles: ClientWithRole[] = clients.map(client => ({
            ...client,
            role: 'client' // Par défaut
          }));
          return clientsWithRoles;
        }

        console.log('Clients table failed:', clientsError?.message);
      } catch (e) {
        console.log('Clients table exception:', e);
      }

      // Approche 2: Essayer la table 'profiles'
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!profilesError && profiles) {
          console.log('Using profiles table:', profiles.length);
          const clientsWithRoles: ClientWithRole[] = profiles.map(profile => ({
            id: profile.id,
            user_id: profile.id,
            first_name: profile.first_name || null,
            last_name: profile.last_name || null,
            email: profile.email,
            phone: profile.phone || null,
            address: null,
            address_complement: null,
            city: null,
            postal_code: null,
            country: null,
            preferred_shipping_address: null,
            preferred_billing_address: null,
            marketing_phone: null,
            marketing_consent: false,
            notes: null,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            role: profile.role || 'client'
          }));
          return clientsWithRoles;
        }

        console.log('Profiles table failed:', profilesError?.message);
      } catch (e) {
        console.log('Profiles table exception:', e);
      }

      // Approche 3: Données mock en cas d'échec
      console.log('Using mock data');
      return [
        {
          id: '1',
          user_id: '1',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone: null,
          address: null,
          address_complement: null,
          city: null,
          postal_code: null,
          country: null,
          preferred_shipping_address: null,
          preferred_billing_address: null,
          marketing_phone: null,
          marketing_consent: false,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'client'
        }
      ] as ClientWithRole[];
    },
  });
};

// Hook pour mettre à jour les données client
export const useUpdateClientData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<ClientData> }) => {
      console.log('=== Début de la mutation updateClientData ===');
      console.log('userId:', userId);
      console.log('updates:', updates);
      
      // Vérifier l'utilisateur connecté et son rôle
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('=== Utilisateur connecté ===');
      console.log('user:', user);
      console.log('userError:', userError);
      
      if (user) {
        // Vérifier le rôle
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        console.log('=== Rôle utilisateur ===');
        console.log('roleData:', roleData);
        console.log('roleError:', roleError);
      }
      
      const { data, error } = await supabase
        .from('clients')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      console.log('=== Résultat de la requête ===');
      console.log('data:', data);
      console.log('error:', error);
      
      if (error) {
        console.error('=== ERREUR SUPABASE ===');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        throw error;
      }
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

// Hook pour mettre à jour le rôle d'un client
export const useUpdateClientRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle du client a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle client.",
        variant: "destructive",
      });
    },
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserRole, UserType } from './useAdmin';

export interface ExternalUser {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  role: 'client';
  user_type: 'external';
  // Données client spécifiques
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  marketing_consent?: boolean | null;
  notes?: string | null;
}

// Hook pour récupérer uniquement les utilisateurs externes (clients)
export const useExternalUsers = () => {
  return useQuery({
    queryKey: ['externalUsers'],
    queryFn: async () => {
      // Récupérer tous les profils qui ne sont pas des utilisateurs internes
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Récupérer les rôles des utilisateurs internes pour les exclure
      const { data: internalRoles, error: internalRolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('user_type', 'internal');

      if (internalRolesError) throw internalRolesError;

      const internalUserIds = new Set(internalRoles.map(role => role.user_id));

      // Récupérer les rôles externes (clients)
      const { data: externalRoles, error: externalRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, user_type, created_at, updated_at')
        .eq('user_type', 'external');

      if (externalRolesError) throw externalRolesError;

      // Récupérer les données client supplémentaires
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('user_id, address, city, postal_code, country, marketing_consent, notes');

      if (clientsError) throw clientsError;

      // Filtrer les profils pour exclure les utilisateurs internes
      const externalProfiles = profiles.filter(profile =>
        !internalUserIds.has(profile.user_id)
      );

      // Combiner les données
      const externalUsers: ExternalUser[] = externalProfiles.map(profile => {
        const userRole = externalRoles.find(role => role.user_id === profile.user_id);
        const clientData = clientsData?.find(client => client.user_id === profile.user_id);

        return {
          id: profile.user_id,
          user_id: profile.user_id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          role: userRole?.role || 'client',
          user_type: 'external',
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          // Données client
          address: clientData?.address,
          city: clientData?.city,
          postal_code: clientData?.postal_code,
          country: clientData?.country,
          marketing_consent: clientData?.marketing_consent,
          notes: clientData?.notes,
        };
      });

      return externalUsers;
    },
  });
};

// Hook pour les clients uniquement (alias pour useExternalUsers pour compatibilité)
export const useCustomers = useExternalUsers;

// Hook pour mettre à jour les données d'un client
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      profileData,
      clientData
    }: {
      userId: string;
      profileData?: Partial<{
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
      }>;
      clientData?: Partial<{
        address: string;
        city: string;
        postal_code: string;
        country: string;
        marketing_consent: boolean;
        notes: string;
      }>;
    }) => {
      // Mettre à jour le profil si des données sont fournies
      if (profileData) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', userId);

        if (profileError) throw profileError;
      }

      // Mettre à jour les données client si des données sont fournies
      if (clientData) {
        const { error: clientError } = await supabase
          .from('clients')
          .upsert({
            user_id: userId,
            ...clientData
          });

        if (clientError) throw clientError;
      }

      // S'assurer que l'utilisateur a le rôle client
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'client' as UserRole,
          user_type: 'external' as UserType
        });

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['externalUsers'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client mis à jour",
        description: "Les données du client ont été mises à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les données du client.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour obtenir les statistiques des clients
export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customerStats'],
    queryFn: async () => {
      // Récupérer tous les clients
      const { data: externalUsers } = await useExternalUsers().queryFn();

      // Récupérer les commandes des clients
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, created_at, status, payment_status');

      if (ordersError) throw ordersError;

      // Calculer les statistiques
      const totalCustomers = externalUsers?.length || 0;
      const customersWithOrders = new Set(orders?.map(o => o.user_id)).size;
      const customersWithoutOrders = totalCustomers - customersWithOrders;

      // Revenus par client
      const customerRevenue = orders?.reduce((acc: Record<string, number>, order) => {
        acc[order.user_id] = (acc[order.user_id] || 0) + (order.total_amount || 0);
        return acc;
      }, {}) || {};

      // Client le plus rentable
      const topCustomer = Object.entries(customerRevenue)
        .sort(([, a], [, b]) => b - a)[0];

      // Nouveaux clients ce mois
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const newCustomersThisMonth = externalUsers?.filter(customer =>
        new Date(customer.created_at) >= thisMonth
      ).length || 0;

      return {
        totalCustomers,
        customersWithOrders,
        customersWithoutOrders,
        newCustomersThisMonth,
        topCustomer: topCustomer ? {
          userId: topCustomer[0],
          revenue: topCustomer[1],
          customer: externalUsers?.find(c => c.user_id === topCustomer[0])
        } : null,
        averageOrderValue: orders?.length ?
          orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / orders.length : 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
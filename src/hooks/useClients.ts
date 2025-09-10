import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ClientWithRole {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  role?: string;
}

// Hook pour récupérer uniquement les clients (exclut les admins)
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      // Récupérer les profils utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Récupérer les rôles des utilisateurs
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combiner les données et filtrer uniquement les clients
      const clientsWithRoles: ClientWithRole[] = profiles
        .map(profile => {
          const userRole = roles.find(role => role.user_id === profile.user_id);
          return {
            ...profile,
            role: userRole?.role || 'user'
          };
        })
        .filter(user => user.role !== 'admin'); // Exclure les admins

      return clientsWithRoles;
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
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
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
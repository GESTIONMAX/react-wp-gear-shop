import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemUser {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user' | 'staff' | 'employee' | 'client';
  created_at: string;
  updated_at: string;
}

// Hook pour récupérer uniquement les utilisateurs avec des rôles système explicites
export const useSystemUsers = () => {
  return useQuery({
    queryKey: ['systemUsers'],
    queryFn: async () => {
      // Récupérer uniquement les utilisateurs qui ont des rôles dans user_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at,
          updated_at
        `);

      if (rolesError) throw rolesError;

      // Récupérer les profils correspondants
      const userIds = userRoles.map(ur => ur.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combiner les données
      const systemUsers: SystemUser[] = userRoles.map(userRole => {
        const profile = profiles.find(p => p.user_id === userRole.user_id);
        return {
          id: userRole.user_id,
          user_id: userRole.user_id,
          email: profile?.email || null,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          role: userRole.role as SystemUser['role'],
          created_at: userRole.created_at,
          updated_at: userRole.updated_at,
        };
      });

      return systemUsers;
    },
  });
};

// Hook pour attribuer un rôle système à un utilisateur
export const useAssignSystemRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userEmail, role }: { userEmail: string; role: 'admin' | 'user' }) => {
      // D'abord, trouver l'utilisateur par email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', userEmail)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Utilisateur non trouvé');

      // Ensuite, attribuer ou mettre à jour le rôle
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: profile.user_id,
          role: role
        });

      if (error) throw error;
      return profile.user_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      toast({
        title: "Rôle système attribué",
        description: "L'utilisateur a maintenant accès au système.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer le rôle système.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour révoquer l'accès système d'un utilisateur
export const useRevokeSystemAccess = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      toast({
        title: "Accès révoqué",
        description: "L'utilisateur n'a plus accès au système.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de révoquer l'accès système.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour le rôle d'un utilisateur système
export const useUpdateSystemUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur système a été modifié.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle.",
        variant: "destructive",
      });
    },
  });
};
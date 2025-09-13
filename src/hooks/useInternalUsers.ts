import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserRole, UserType } from './useAdmin';

export interface InternalUser {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  role: UserRole;
  user_type: UserType;
}

// Hook pour récupérer uniquement les utilisateurs internes (admin, staff, employee)
export const useInternalUsers = () => {
  return useQuery({
    queryKey: ['internalUsers'],
    queryFn: async () => {
      // Récupérer les rôles des utilisateurs internes
      const { data: internalRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          user_type,
          created_at,
          updated_at
        `)
        .eq('user_type', 'internal');

      if (rolesError) throw rolesError;

      // Récupérer les profils correspondants
      const userIds = internalRoles.map(ur => ur.user_id);

      if (userIds.length === 0) {
        return [];
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name, avatar_url, phone, created_at, updated_at')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combiner les données
      const internalUsers: InternalUser[] = internalRoles.map(userRole => {
        const profile = profiles.find(p => p.user_id === userRole.user_id);
        return {
          id: userRole.user_id,
          user_id: userRole.user_id,
          email: profile?.email || null,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          avatar_url: profile?.avatar_url || null,
          phone: profile?.phone || null,
          role: userRole.role,
          user_type: userRole.user_type,
          created_at: userRole.created_at,
          updated_at: userRole.updated_at,
        };
      });

      return internalUsers.sort((a, b) => {
        // Trier par ordre hiérarchique: admin > staff > employee
        const roleOrder: Record<UserRole, number> = {
          admin: 1,
          staff: 2,
          employee: 3,
          client: 4
        };
        return roleOrder[a.role] - roleOrder[b.role];
      });
    },
  });
};

// Hook pour attribuer un rôle interne à un utilisateur
export const useAssignInternalRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userEmail, role }: { userEmail: string; role: Exclude<UserRole, 'client'> }) => {
      // D'abord, trouver l'utilisateur par email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', userEmail)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Utilisateur non trouvé');

      // Ensuite, attribuer le rôle interne
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: profile.user_id,
          role: role,
          user_type: 'internal' as UserType
        });

      if (error) throw error;
      return profile.user_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      queryClient.invalidateQueries({ queryKey: ['userType'] });
      toast({
        title: "Rôle interne attribué",
        description: "L'utilisateur fait maintenant partie du personnel interne.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer le rôle interne.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour le rôle d'un utilisateur interne
export const useUpdateInternalUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Exclude<UserRole, 'client'> }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({
          role,
          user_type: 'internal' as UserType
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur interne a été modifié.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour révoquer l'accès interne d'un utilisateur
export const useRevokeInternalAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('user_type', 'internal');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internalUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      queryClient.invalidateQueries({ queryKey: ['userType'] });
      toast({
        title: "Accès révoqué",
        description: "L'utilisateur n'a plus accès au système interne.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de révoquer l'accès interne.",
        variant: "destructive",
      });
    },
  });
};
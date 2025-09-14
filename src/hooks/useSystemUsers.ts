import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemUser {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'client';
  created_at: string;
  updated_at: string;
}

// Hook pour récupérer les utilisateurs authentifiés (simplifié)
export const useSystemUsers = () => {
  return useQuery({
    queryKey: ['systemUsers'],
    queryFn: async () => {
      console.log('=== Fetching System Users ===');

      try {
        // Récupérer tous les utilisateurs authentifiés de auth.users via RPC ou query
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
          console.log('Auth admin not available, using alternative approach');

          // Approche alternative: créer une liste simplifiée basée sur l'utilisateur connecté
          const { data: { user: currentUser } } = await supabase.auth.getUser();

          if (!currentUser) return [];

          const systemUsers: SystemUser[] = [{
            id: currentUser.id,
            user_id: currentUser.id,
            email: currentUser.email || null,
            first_name: currentUser.user_metadata?.first_name || null,
            last_name: currentUser.user_metadata?.last_name || null,
            role: currentUser.email === 'aurelien@gestionmax.fr' ? 'admin' : 'client',
            created_at: currentUser.created_at,
            updated_at: currentUser.updated_at || currentUser.created_at,
          }];

          console.log('System users (simplified):', systemUsers);
          return systemUsers;
        }

        // Si l'admin auth fonctionne, utiliser les données complètes
        const systemUsers: SystemUser[] = authUsers.users.map(user => ({
          id: user.id,
          user_id: user.id,
          email: user.email || null,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          role: user.email === 'aurelien@gestionmax.fr' ? 'admin' : 'client',
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
        }));

        console.log('System users (full):', systemUsers);
        return systemUsers;

      } catch (error) {
        console.error('Error fetching system users:', error);

        // Fallback: retourner l'utilisateur actuel seulement
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) return [];

        return [{
          id: currentUser.id,
          user_id: currentUser.id,
          email: currentUser.email || null,
          first_name: currentUser.user_metadata?.first_name || null,
          last_name: currentUser.user_metadata?.last_name || null,
          role: currentUser.email === 'aurelien@gestionmax.fr' ? 'admin' : 'client',
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at || currentUser.created_at,
        }];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour attribuer un rôle système à un utilisateur (simplifié - info seulement)
export const useAssignSystemRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userEmail, role }: { userEmail: string; role: 'admin' | 'client' }) => {
      console.log('Assign system role (email-based logic):', { userEmail, role });

      // Dans notre architecture simplifiée, les rôles sont déterminés par l'email
      // Cette fonction ne fait rien de concret mais simule l'action
      if (userEmail !== 'aurelien@gestionmax.fr' && role === 'admin') {
        throw new Error('Seul aurelien@gestionmax.fr peut avoir le rôle admin');
      }

      return { userEmail, role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      toast({
        title: "Information",
        description: `Les rôles sont basés sur l'email. ${data.userEmail} ${data.role === 'admin' ? 'est admin' : 'est client'}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Information",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook pour révoquer l'accès système d'un utilisateur (simplifié - info seulement)
export const useRevokeSystemAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('Revoke system access (email-based logic):', userId);

      // Dans notre architecture simplifiée, on ne peut pas vraiment révoquer l'accès
      // Cette fonction simule l'action mais ne fait rien de concret
      throw new Error('Dans cette version simplifiée, les accès sont gérés par email uniquement');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      toast({
        title: "Information",
        description: "Les accès sont gérés automatiquement par email.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Information",
        description: error.message,
        variant: "default",
      });
    },
  });
};

// Hook pour mettre à jour le rôle d'un utilisateur système (simplifié - info seulement)
export const useUpdateSystemUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'client' }) => {
      console.log('Update system user role (email-based logic):', { userId, role });

      // Dans notre architecture simplifiée, les rôles sont déterminés par l'email
      // Cette fonction ne fait rien de concret mais simule l'action
      throw new Error('Les rôles sont automatiquement déterminés par email');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      toast({
        title: "Information",
        description: "Les rôles sont gérés automatiquement par email.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Information",
        description: error.message,
        variant: "default",
      });
    },
  });
};
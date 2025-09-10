import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'user';

// Hook pour vérifier si l'utilisateur est admin
export const useIsAdmin = () => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        return false;
      }

      return data === 'admin';
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour obtenir le rôle de l'utilisateur
export const useUserRole = () => {
  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        return null;
      }

      return data as UserRole;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour attribuer un rôle admin (pour le développement)
export const useAssignAdminRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'admin' as UserRole
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast({
        title: "Rôle admin attribué",
        description: "Vous êtes maintenant administrateur.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'attribuer le rôle admin.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour les statistiques admin
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Statistiques des produits
      const { data: productsStats, error: productsError } = await supabase
        .from('products')
        .select('id, price, sale_price, in_stock, created_at');

      if (productsError) throw productsError;

      // Statistiques des commandes
      const { data: ordersStats, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at');

      if (ordersError) throw ordersError;

      // Statistiques des utilisateurs
      const { data: usersStats, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (usersError) throw usersError;

      // Calculs
      const totalProducts = productsStats?.length || 0;
      const activeProducts = productsStats?.filter(p => p.in_stock).length || 0;
      const totalOrders = ordersStats?.length || 0;
      const totalRevenue = ordersStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalUsers = usersStats?.length || 0;

      // Commandes par statut
      const ordersByStatus = ordersStats?.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

      // Ventes des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentOrders = ordersStats?.filter(order => 
        new Date(order.created_at) >= thirtyDaysAgo
      ) || [];

      const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      return {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts
        },
        orders: {
          total: totalOrders,
          byStatus: ordersByStatus,
          recent: recentOrders.length,
          recentRevenue
        },
        revenue: {
          total: totalRevenue,
          recent: recentRevenue
        },
        users: {
          total: totalUsers
        }
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
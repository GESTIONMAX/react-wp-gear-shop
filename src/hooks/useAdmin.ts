import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'staff' | 'employee' | 'client';
export type UserType = 'internal' | 'external';

// Hook pour vérifier si l'utilisateur est admin
export const useIsAdmin = () => {
  const { userInfo } = useAuth();

  return useQuery({
    queryKey: ['userRole', userInfo.user?.id],
    queryFn: async () => {
      if (!userInfo.user) return false;

      // Utiliser les infos du contexte (déjà calculées)
      if (userInfo.role) {
        console.log('useIsAdmin - Using context role:', userInfo.role);
        return userInfo.role === 'admin';
      }

      // Fallback sur email si pas de rôle en contexte
      const fallbackIsAdmin = userInfo.user.email === 'aurelien@gestionmax.fr';
      console.log('useIsAdmin - Email-based result:', fallbackIsAdmin);
      return fallbackIsAdmin;
    },
    enabled: !!userInfo.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour les statistiques admin simplifiées
export const useAdminStats = () => {
  const { userInfo } = useAuth();

  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      console.log('=== Fetching Admin Stats ===');
      console.log('User admin status:', userInfo.isInternal, userInfo.role);

      // Vérifier si l'utilisateur est admin
      if (!userInfo.isInternal || userInfo.role !== 'admin') {
        throw new Error('Accès administrateur requis');
      }

      try {
        // Statistiques des produits
        const { data: productsStats, error: productsError } = await supabase
          .from('products')
          .select('id, price, sale_price, in_stock, created_at, stock_quantity')
          .limit(100);

        console.log('Products query:', { count: productsStats?.length, error: productsError?.message });

        // Statistiques des catégories
        const { data: categoriesStats, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, is_active, created_at')
          .limit(50);

        console.log('Categories query:', { count: categoriesStats?.length, error: categoriesError?.message });

        // Statistiques des commandes
        const { data: ordersStats, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_amount, status, created_at')
          .limit(100);

        console.log('Orders query:', { count: ordersStats?.length, error: ordersError?.message });

        // Calculer les statistiques de base
        const totalProducts = productsStats?.length || 0;
        const activeProducts = productsStats?.filter(p => p.in_stock).length || 0;
        const totalCategories = categoriesStats?.length || 0;
        const activeCategories = categoriesStats?.filter(c => c.is_active).length || 0;
        const totalOrders = ordersStats?.length || 0;
        const totalRevenue = ordersStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        const stats = {
          products: {
            total: totalProducts,
            active: activeProducts,
            lowStock: 0,
            byCategory: {},
            topSelling: []
          },
          categories: {
            total: totalCategories,
            active: activeCategories
          },
          variants: {
            total: 0,
            active: 0
          },
          orders: {
            total: totalOrders,
            month: ordersStats?.filter(o => {
              const orderDate = new Date(o.created_at);
              const thisMonth = new Date();
              thisMonth.setDate(1);
              return orderDate >= thisMonth;
            }).length || 0,
            lastMonth: ordersStats?.filter(o => {
              const orderDate = new Date(o.created_at);
              const lastMonth = new Date();
              lastMonth.setMonth(lastMonth.getMonth() - 1);
              lastMonth.setDate(1);
              const lastMonthEnd = new Date(lastMonth);
              lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
              lastMonthEnd.setDate(0);
              return orderDate >= lastMonth && orderDate <= lastMonthEnd;
            }).length || 0,
            byStatus: {},
            salesByDay: []
          },
          revenue: {
            total: totalRevenue,
            month: ordersStats?.filter(o => {
              const orderDate = new Date(o.created_at);
              const thisMonth = new Date();
              thisMonth.setDate(1);
              return orderDate >= thisMonth;
            }).reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
            growth: 0,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
          },
          users: {
            total: 0
          },
          performance: {
            conversionRate: 0,
            activeCartUsers: 0
          },
          recentActivity: {
            newOrders: ordersStats?.filter(o => {
              const orderDate = new Date(o.created_at);
              const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return orderDate > lastWeek;
            }).length || 0,
            newProducts: productsStats?.filter(p => {
              const productDate = new Date(p.created_at);
              const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return productDate > lastWeek;
            }).length || 0,
          }
        };

        console.log('Calculated stats:', stats);
        return stats;

      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    enabled: !!userInfo.user && userInfo.isInternal && userInfo.role === 'admin',
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
};

// Hook pour attribuer un rôle admin (pour le développement)
export const useAssignAdminRole = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Utilisateur non connecté');

      // Cette fonction ne fait rien car nous utilisons maintenant la logique email
      // dans le contexte d'authentification
      console.log('Admin role assignment - using email-based logic');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast({
        title: "Information",
        description: "Le rôle admin est basé sur l'email configuré.",
      });
    },
    onError: () => {
      toast({
        title: "Information",
        description: "Le rôle admin est basé sur l'email configuré.",
        variant: "destructive",
      });
    },
  });
};
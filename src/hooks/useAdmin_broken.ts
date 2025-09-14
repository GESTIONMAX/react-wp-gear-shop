import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'staff' | 'employee' | 'client';
export type UserType = 'internal' | 'external';

// Hook pour vérifier si l'utilisateur est admin
export const useIsAdmin = () => {
  const { userInfo } = useAuth(); // Utiliser userInfo au lieu de user pour avoir le rôle

  return useQuery({
    queryKey: ['userRole', userInfo.user?.id],
    queryFn: async () => {
      if (!userInfo.user) return false;

      // Priorité 1: Utiliser les infos du contexte (déjà calculées)
      if (userInfo.role) {
        console.log('useIsAdmin - Using context role:', userInfo.role);
        return userInfo.role === 'admin';
      }

      console.log('useIsAdmin - Context role not available, checking database...');

      // Priorité 2: Fallback sur email si pas de rôle en contexte
      const fallbackIsAdmin = userInfo.user.email === 'aurelien@gestionmax.fr';
      console.log('useIsAdmin - Email-based result:', fallbackIsAdmin);
      return fallbackIsAdmin;
    },
    enabled: !!userInfo.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour vérifier si l'utilisateur est un utilisateur interne (admin, staff, employee)
export const useIsInternalUser = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userType', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('user_type')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification du type d\'utilisateur:', error);
        return false;
      }

      return data?.user_type === 'internal';
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour obtenir le type d'utilisateur (internal/external)
export const useUserType = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userType', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('user_type')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération du type d\'utilisateur:', error);
        return null;
      }

      return (data?.user_type as UserType) || 'external';
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour vérifier si l'utilisateur a l'un des rôles spécifiés
export const useHasAnyRole = (roles: UserRole[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hasAnyRole', user?.id, roles],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', roles)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification des rôles:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour obtenir le rôle de l'utilisateur
export const useUserRole = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        return null;
      }

      return (data?.role as UserRole) || null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour attribuer un rôle admin (pour le développement)
export const useAssignAdminRole = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'admin' as UserRole,
          user_type: 'internal' as UserType
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

// Hook pour les statistiques admin avancées
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
        // Statistiques des produits (essayer en premier)
        const { data: productsStats, error: productsError } = await supabase
          .from('products')
          .select('id, price, sale_price, in_stock, created_at, category_id, stock_quantity')
          .limit(100);

        console.log('Products query:', { count: productsStats?.length, error: productsError?.message });

        // Statistiques des catégories
        const { data: categoriesStats, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, is_active, created_at')
          .limit(50);

        console.log('Categories query:', { count: categoriesStats?.length, error: categoriesError?.message });

        // Statistiques des commandes (si disponible)
        const { data: ordersStats, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_amount, status, created_at, payment_status, user_id')
          .limit(100);

        console.log('Orders query:', { count: ordersStats?.length, error: ordersError?.message });

        // Statistiques des clients (depuis la nouvelle table)
        const { data: clientsStats, error: clientsError } = await supabase
          .from('clients')
          .select('id, created_at, user_id')
          .limit(100);

        console.log('Clients query:', { count: clientsStats?.length, error: clientsError?.message });

        // Calculer les statistiques de base
        const totalProducts = productsStats?.length || 0;
        const activeProducts = productsStats?.filter(p => p.in_stock).length || 0;
        const totalCategories = categoriesStats?.length || 0;
        const activeCategories = categoriesStats?.filter(c => c.is_active).length || 0;
        const totalOrders = ordersStats?.length || 0;
        const totalRevenue = ordersStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        const totalClients = clientsStats?.length || 0;

        const stats = {
          totalProducts,
          activeProducts,
          totalCategories,
          activeCategories,
          totalOrders,
          totalRevenue,
          totalClients,
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
      const activeProducts = productsStats?.filter(p => p.in_stock).length || 0;
      const productsWithVariants = productsStats?.filter(p => 
        variantsStats?.some(v => v.product_id === p.id)
      ).length || 0;

      const totalCategories = categoriesStats?.length || 0;
      const activeCategories = categoriesStats?.filter(c => c.is_active).length || 0;
      
      const totalVariants = variantsStats?.length || 0;
      const activeVariants = variantsStats?.filter(v => v.in_stock).length || 0;

      const totalOrders = ordersStats?.length || 0;
      const totalRevenue = ordersStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalUsers = usersStats?.length || 0;

      // Calculs avancés par période
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Commandes par période
      const todayOrders = ordersStats?.filter(order => 
        new Date(order.created_at) >= today
      ) || [];
      
      const weekOrders = ordersStats?.filter(order => 
        new Date(order.created_at) >= thisWeek
      ) || [];
      
      const monthOrders = ordersStats?.filter(order => 
        new Date(order.created_at) >= thisMonth
      ) || [];

      const lastMonthOrders = ordersStats?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= lastMonth && orderDate <= lastMonthEnd;
      }) || [];

      // Revenus par période
      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const weekRevenue = weekOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Évolution mensuelle
      const monthGrowth = lastMonthRevenue > 0 
        ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Panier moyen
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Taux de conversion (approximatif basé sur les paniers vs commandes)
      const activeCartUsers = new Set(cartStats?.map(c => c.user_id)).size;
      const orderUsers = new Set(ordersStats?.map(o => o.user_id)).size;
      const conversionRate = activeCartUsers > 0 ? (orderUsers / activeCartUsers) * 100 : 0;

      // Répartitions
      const productsByCategory = productsStats?.reduce((acc: any, product) => {
        const categoryName = product.categories?.name || 'Sans catégorie';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {}) || {};

      const ordersByStatus = ordersStats?.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const ordersByPaymentStatus = ordersStats?.reduce((acc: any, order) => {
        acc[order.payment_status || 'unknown'] = (acc[order.payment_status || 'unknown'] || 0) + 1;
        return acc;
      }, {}) || {};

      // Top produits vendus
      const productSales = orderItemsStats?.reduce((acc: any, item) => {
        acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
        return acc;
      }, {}) || {};

      const topProducts = Object.entries(productSales)
        .map(([productId, quantity]) => {
          const product = productsStats?.find(p => p.id === productId);
          return {
            id: productId,
            name: product?.categories?.name || 'Produit inconnu',
            quantity: quantity as number,
            revenue: orderItemsStats
              ?.filter(item => item.product_id === productId)
              .reduce((sum, item) => sum + (item.total_price || 0), 0) || 0
          };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Évolution des ventes sur 7 jours
      const salesByDay = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const dayOrders = ordersStats?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= dayStart && orderDate < dayEnd;
        }) || [];

        return {
          date: dayStart.toISOString().split('T')[0],
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
        };
      }).reverse();

      // Stock critique (produits avec moins de 5 unités)
      const lowStockProducts = productsStats?.filter(p => 
        p.stock_quantity < 5 && p.in_stock
      ).length || 0;

      return {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts,
          withVariants: productsWithVariants,
          withoutVariants: totalProducts - productsWithVariants,
          lowStock: lowStockProducts,
          byCategory: productsByCategory,
          topSelling: topProducts
        },
        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: totalCategories - activeCategories
        },
        variants: {
          total: totalVariants,
          active: activeVariants,
          inactive: totalVariants - activeVariants
        },
        orders: {
          total: totalOrders,
          today: todayOrders.length,
          week: weekOrders.length,
          month: monthOrders.length,
          lastMonth: lastMonthOrders.length,
          byStatus: ordersByStatus,
          byPaymentStatus: ordersByPaymentStatus,
          salesByDay
        },
        revenue: {
          total: totalRevenue,
          today: todayRevenue,
          week: weekRevenue,
          month: monthRevenue,
          lastMonth: lastMonthRevenue,
          growth: monthGrowth,
          averageOrderValue
        },
        users: {
          total: totalUsers,
          conversionRate
        },
        performance: {
          conversionRate,
          averageOrderValue,
          monthGrowth,
          activeCartUsers
        }
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
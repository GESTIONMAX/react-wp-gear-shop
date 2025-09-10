import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'user';

// Hook pour vérifier si l'utilisateur est admin
export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        return false;
      }

      console.log('useIsAdmin - user.id:', user.id, 'role:', data);
      return data === 'admin';
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
        .rpc('get_user_role', { _user_id: user.id });

      if (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        return null;
      }

      return data as UserRole;
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
      // Statistiques des produits avec catégories
      const { data: productsStats, error: productsError } = await supabase
        .from('products')
        .select(`
          id, 
          price, 
          sale_price, 
          in_stock, 
          created_at,
          category_id,
          categories(id, name)
        `);

      if (productsError) throw productsError;

      // Statistiques des catégories
      const { data: categoriesStats, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, is_active, created_at');

      if (categoriesError) throw categoriesError;

      // Statistiques des variantes
      const { data: variantsStats, error: variantsError } = await supabase
        .from('product_variants')
        .select('id, product_id, in_stock, price, created_at');

      if (variantsError) throw variantsError;

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

      // Calculs des produits
      const totalProducts = productsStats?.length || 0;
      const activeProducts = productsStats?.filter(p => p.in_stock).length || 0;
      const productsWithVariants = productsStats?.filter(p => 
        variantsStats?.some(v => v.product_id === p.id)
      ).length || 0;

      // Calculs des catégories
      const totalCategories = categoriesStats?.length || 0;
      const activeCategories = categoriesStats?.filter(c => c.is_active).length || 0;
      
      // Répartition des produits par catégorie
      const productsByCategory = productsStats?.reduce((acc: any, product) => {
        const categoryName = product.categories?.name || 'Sans catégorie';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {}) || {};

      // Calculs des variantes
      const totalVariants = variantsStats?.length || 0;
      const activeVariants = variantsStats?.filter(v => v.in_stock).length || 0;

      // Calculs des commandes
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
          inactive: totalProducts - activeProducts,
          withVariants: productsWithVariants,
          withoutVariants: totalProducts - productsWithVariants,
          byCategory: productsByCategory
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
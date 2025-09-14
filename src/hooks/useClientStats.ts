import { useMemo } from 'react';
import { ClientWithRole } from './useClientData';
import { Order } from '@/components/admin/users/ClientDetailDialog/types';

interface UseClientStatsProps {
  clients: ClientWithRole[];
  orders: Order[];
}

export const useClientStats = ({ clients, orders }: UseClientStatsProps) => {
  // Créer un Map pour des lookups O(1) au lieu de filter O(n)
  const ordersByUserId = useMemo(() => {
    const map = new Map<string, Order[]>();
    orders.forEach(order => {
      const userId = order.user_id;
      if (!map.has(userId)) {
        map.set(userId, []);
      }
      map.get(userId)!.push(order);
    });
    return map;
  }, [orders]);

  const clientStats = useMemo(() => {
    const total = clients.length;
    const admins = clients.filter(c => c.role === 'admin').length;
    const users = clients.filter(c => !c.role || c.role === 'user').length;

    // Compter les clients actifs en utilisant le Map
    const activeClients = clients.filter(client => {
      const clientOrders = ordersByUserId.get(client.id) || [];
      return clientOrders.length > 0;
    }).length;

    return {
      total,
      admins,
      users,
      activeClients,
    };
  }, [clients, ordersByUserId]);

  const getClientOrders = useMemo(() => {
    return (clientId: string) => ordersByUserId.get(clientId) || [];
  }, [ordersByUserId]);

  const getClientTotalSpent = useMemo(() => {
    return (clientId: string) => {
      const clientOrders = ordersByUserId.get(clientId) || [];
      return clientOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    };
  }, [ordersByUserId]);

  return {
    clientStats,
    getClientOrders,
    getClientTotalSpent,
  };
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, Invoice } from './types';

interface StatsTabProps {
  userOrders: Order[];
  userInvoices: Invoice[];
}

export const StatsTab: React.FC<StatsTabProps> = ({ userOrders, userInvoices }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  const totalSpent = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const unpaidInvoices = userInvoices.filter(inv => inv.status !== 'paid');
  const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            Sur {userOrders.length} commande{userOrders.length > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {userOrders.length > 0 ? formatPrice(totalSpent / userOrders.length) : '0 €'}
          </div>
          <p className="text-xs text-muted-foreground">Par commande</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Factures impayées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {unpaidInvoices.length}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPrice(unpaidAmount)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
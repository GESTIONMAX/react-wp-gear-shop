import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminStats, useAssignAdminRole } from '@/hooks/useAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import SalesChart from '@/components/admin/SalesChart';
import TopProductsChart from '@/components/admin/TopProductsChart';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Euro,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  FolderOpen,
  Layers3,
  Settings,
  Target,
  CreditCard,
  BarChart3,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useAdminStats();
  const assignAdminRole = useAssignAdminRole();

  // Pour le développement - bouton pour s'attribuer le rôle admin
  const handleAssignAdmin = () => {
    assignAdminRole.mutate();
  };

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} €`;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" description="Vue d'ensemble de votre boutique">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                  <div className="bg-muted h-8 rounded w-1/2"></div>
                  <div className="bg-muted h-3 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard" description="Vue d'ensemble de votre boutique">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Erreur de chargement</h3>
                <p className="text-muted-foreground">
                  Impossible de charger les statistiques. Si vous n'êtes pas encore administrateur, 
                  utilisez le bouton ci-dessous.
                </p>
              </div>
              <Button onClick={handleAssignAdmin} disabled={assignAdminRole.isPending}>
                {assignAdminRole.isPending ? 'Attribution...' : 'Devenir Administrateur'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" description="Vue d'ensemble de votre boutique">
      <div className="space-y-8">
        {/* Cartes de statistiques principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <StatsCard
            title="Produits"
            value={stats?.products.total || 0}
            subtitle={`${stats?.products.active || 0} actifs • ${stats?.products.lowStock || 0} stock faible`}
            icon={Package}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-900"
            iconClassName="text-blue-600"
          />

          <StatsCard
            title="Collections"
            value={stats?.categories.total || 0}
            subtitle={`${stats?.categories.active || 0} actives`}
            icon={FolderOpen}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-900"
            iconClassName="text-green-600"
          />

          <StatsCard
            title="Variantes"
            value={stats?.variants.total || 0}
            subtitle={`${stats?.variants.active || 0} disponibles`}
            icon={Layers3}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-900"
            iconClassName="text-purple-600"
          />

          <StatsCard
            title="Commandes"
            value={stats?.orders.total || 0}
            subtitle={`${stats?.orders.month || 0} ce mois`}
            trend={{
              value: ((stats?.orders.month || 0) - (stats?.orders.lastMonth || 0)) / Math.max(stats?.orders.lastMonth || 1, 1) * 100,
              isPositive: (stats?.orders.month || 0) >= (stats?.orders.lastMonth || 0),
              period: 'vs mois dernier'
            }}
            icon={ShoppingCart}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-900"
            iconClassName="text-orange-600"
          />

          <StatsCard
            title="Revenus"
            value={formatPrice(stats?.revenue.total || 0)}
            subtitle={`${formatPrice(stats?.revenue.month || 0)} ce mois`}
            trend={{
              value: stats?.revenue.growth || 0,
              isPositive: (stats?.revenue.growth || 0) >= 0,
              period: 'vs mois dernier'
            }}
            icon={Euro}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900"
            iconClassName="text-indigo-600"
          />

          <StatsCard
            title="Panier Moyen"
            value={formatPrice(stats?.revenue.averageOrderValue || 0)}
            subtitle="Par commande"
            icon={BarChart3}
            className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 text-teal-900"
            iconClassName="text-teal-600"
          />

          <StatsCard
            title="Conversion"
            value={`${(stats?.performance.conversionRate || 0).toFixed(1)}%`}
            subtitle="Taux de conversion"
            icon={Target}
            className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-900"
            iconClassName="text-amber-600"
          />

          <StatsCard
            title="Clients"
            value={stats?.users.total || 0}
            subtitle={`${stats?.performance.activeCartUsers || 0} paniers actifs`}
            icon={Users}
            className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 text-pink-900"
            iconClassName="text-pink-600"
          />
        </div>

        {/* Graphiques et métriques avancées */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart data={(stats?.orders.salesByDay || []).map(item => ({
            date: item.date,
            orders: item.amount || 0,
            revenue: item.amount || 0
          }))} />
          <TopProductsChart data={(stats?.products.topSelling || []).map((item, index) => ({
            id: `product-${index}`,
            name: item.name,
            quantity: item.count || 0,
            revenue: (item.count || 0) * 2000 // Estimation du revenu
          }))} />
        </div>

        {/* Graphiques et détails */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Produits par Collection */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Produits par Collection</CardTitle>
              <CardDescription className="text-sm">
                Répartition de vos produits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.products.byCategory && Object.entries(stats.products.byCategory).length > 0 ? (
                Object.entries(stats.products.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-sm font-medium text-gray-700">{category.toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count as number}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun produit trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statut des Commandes */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Statut des Commandes</CardTitle>
              <CardDescription className="text-sm">
                État actuel des commandes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.orders.byStatus && Object.entries(stats.orders.byStatus).length > 0 ? (
                Object.entries(stats.orders.byStatus).map(([status, count]) => {
                  const statusConfig: Record<string, { label: string; color: string }> = {
                    pending: { label: 'En attente', color: 'bg-yellow-500' },
                    confirmed: { label: 'Confirmées', color: 'bg-blue-500' },
                    shipped: { label: 'Expédiées', color: 'bg-purple-500' },
                    delivered: { label: 'Livrées', color: 'bg-green-500' },
                    cancelled: { label: 'Annulées', color: 'bg-red-500' }
                  };

                  const config = statusConfig[status] || statusConfig.pending;

                  return (
                    <div key={status} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                        <span className="text-sm font-medium text-gray-700">{config.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count as number}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune commande trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
              <CardDescription className="text-sm">
                Raccourcis vers les tâches courantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700" 
                onClick={() => window.location.href = '/admin/products'}
              >
                <Package className="h-4 w-4 mr-3" />
                Ajouter un produit
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => window.location.href = '/admin/collections'}
              >
                <FolderOpen className="h-4 w-4 mr-3" />
                Gérer les collections
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => window.location.href = '/admin/variants'}
              >
                <Layers3 className="h-4 w-4 mr-3" />
                Gérer les variantes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => window.location.href = '/admin/orders'}
              >
                <ShoppingCart className="h-4 w-4 mr-3" />
                Voir les commandes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => window.location.href = '/admin/analytics'}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Statistiques détaillées
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Développement uniquement */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-dashed border-2 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-600">Mode Développement</CardTitle>
              <CardDescription>
                Outils de développement - visible uniquement en mode dev
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleAssignAdmin} 
                disabled={assignAdminRole.isPending}
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                {assignAdminRole.isPending ? 'Attribution...' : '🛠️ Devenir Administrateur'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Cliquez pour vous attribuer le rôle d'administrateur
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
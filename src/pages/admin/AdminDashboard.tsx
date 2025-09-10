import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminStats, useAssignAdminRole } from '@/hooks/useAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
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
  Settings
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Produits */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">Produits</CardTitle>
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-blue-900">{stats?.products.total || 0}</div>
              <p className="text-xs text-blue-600 mt-1">
                {stats?.products.active || 0} actifs • {stats?.products.withVariants || 0} avec variantes
              </p>
            </CardContent>
          </Card>

          {/* Collections */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700">Collections</CardTitle>
                <FolderOpen className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-green-900">{stats?.categories.total || 0}</div>
              <p className="text-xs text-green-600 mt-1">
                {stats?.categories.active || 0} actives
              </p>
            </CardContent>
          </Card>

          {/* Variantes */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700">Variantes</CardTitle>
                <Layers3 className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-purple-900">{stats?.variants.total || 0}</div>
              <p className="text-xs text-purple-600 mt-1">
                {stats?.variants.active || 0} disponibles
              </p>
            </CardContent>
          </Card>

          {/* Commandes */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-700">Commandes</CardTitle>
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-orange-900">{stats?.orders.total || 0}</div>
              <p className="text-xs text-orange-600 mt-1">
                {stats?.orders.recent || 0} ce mois
              </p>
            </CardContent>
          </Card>

          {/* Chiffre d'Affaires */}
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-indigo-700">Chiffre d'Affaires</CardTitle>
                <Euro className="h-5 w-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-indigo-900">
                {formatPrice(stats?.revenue.total || 0)}
              </div>
              <p className="text-xs text-indigo-600 mt-1">
                {formatPrice(stats?.revenue.recent || 0)} ce mois
              </p>
            </CardContent>
          </Card>

          {/* Clients */}
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-pink-700">Clients</CardTitle>
                <Users className="h-5 w-5 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-pink-900">{stats?.users.total || 0}</div>
              <p className="text-xs text-pink-600 mt-1">
                Clients enregistrés
              </p>
            </CardContent>
          </Card>
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
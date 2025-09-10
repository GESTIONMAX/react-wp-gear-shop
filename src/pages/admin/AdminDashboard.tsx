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
  Truck
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.products.active || 0} actifs, {stats?.products.inactive || 0} inactifs
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.orders.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.orders.recent || 0} ces 30 derniers jours
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats?.revenue.total || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPrice(stats?.revenue.recent || 0)} ces 30 jours
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Clients enregistrés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et détails */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Statut des commandes */}
          <Card>
            <CardHeader>
              <CardTitle>Statut des Commandes</CardTitle>
              <CardDescription>
                Répartition des commandes par statut
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.orders.byStatus && Object.entries(stats.orders.byStatus).map(([status, count]) => {
                const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
                  pending: { label: 'En attente', color: 'bg-yellow-500', icon: Clock },
                  confirmed: { label: 'Confirmées', color: 'bg-blue-500', icon: CheckCircle },
                  shipped: { label: 'Expédiées', color: 'bg-purple-500', icon: Truck },
                  delivered: { label: 'Livrées', color: 'bg-green-500', icon: CheckCircle },
                  cancelled: { label: 'Annulées', color: 'bg-red-500', icon: AlertCircle }
                };

                const config = statusConfig[status] || statusConfig.pending;
                const Icon = config.icon;

                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>
                Raccourcis vers les tâches courantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => window.location.href = '/admin/products'}>
                <Package className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/categories'}>
                <Package className="h-4 w-4 mr-2" />
                Gérer les catégories
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/orders'}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Voir les commandes
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/analytics'}>
                <TrendingUp className="h-4 w-4 mr-2" />
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
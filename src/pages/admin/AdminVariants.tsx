import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { Layers3, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminVariants: React.FC = () => {
  return (
    <AdminLayout 
      title="Gestion des Variantes" 
      description="Gérez les différentes variantes de vos produits"
    >
      <div className="space-y-6">
        {/* Header avec bouton d'ajout */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Variantes de Produits</h1>
            <p className="text-muted-foreground">
              Créez et gérez les différentes options de vos produits
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Variante
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Variantes</CardTitle>
              <Layers3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Toutes variantes créées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Variantes Actives</CardTitle>
              <Layers3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                En stock disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits avec Variantes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Produits ayant des options
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Types d'Attributs</CardTitle>
              <Layers3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Couleur, taille, etc.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Zone principale */}
        <Card>
          <CardHeader>
            <CardTitle>Variantes de Produits</CardTitle>
            <CardDescription>
              Les variantes permettent de proposer différentes options pour un même produit (couleur, taille, modèle, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Layers3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune variante</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Les variantes vous permettent d'offrir différentes options pour vos produits. 
                Par exemple : couleurs, tailles, modèles, capacités de stockage, etc.
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Créer ma première variante
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section informative */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exemples de Variantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Vêtements :</strong> Taille, Couleur, Matière
              </div>
              <div className="text-sm">
                <strong>Électronique :</strong> Capacité, Couleur, Version
              </div>
              <div className="text-sm">
                <strong>Accessoires :</strong> Couleur, Style, Compatibilité
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avantages des Variantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                ✓ Gestion séparée des stocks par option
              </div>
              <div className="text-sm">
                ✓ Prix différenciés par variante
              </div>
              <div className="text-sm">
                ✓ Images spécifiques à chaque option
              </div>
              <div className="text-sm">
                ✓ Meilleure expérience client
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVariants;
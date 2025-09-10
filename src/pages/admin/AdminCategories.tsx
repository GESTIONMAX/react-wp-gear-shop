import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tags, Info, FolderOpen, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminCategories: React.FC = () => {
  return (
    <AdminLayout 
      title="Catégories de Produits" 
      description="Pour une catégorisation avancée de vos produits"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">
            Système de catégorisation avancé pour vos produits
          </p>
        </div>

        {/* Alerte d'information */}
        <Alert className="border-orange-200 bg-orange-50">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Fonctionnalité à venir</AlertTitle>
          <AlertDescription className="text-orange-700">
            Les catégories seront utilisées lorsqu'il faudra catégoriser vos produits de manière plus précise. 
            Pour le moment, vous pouvez organiser vos produits avec les <strong>Collections</strong>.
          </AlertDescription>
        </Alert>

        {/* Comparaison Collections vs Catégories */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-800">Collections (Actuel)</CardTitle>
              </div>
              <CardDescription>
                Système actuel pour organiser vos produits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">✓ Regroupement par thème ou saison</div>
              <div className="text-sm">✓ Organisation marketing</div>
              <div className="text-sm">✓ Mise en avant de gammes</div>
              <div className="text-sm">✓ Facilité d'utilisation</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-800">Catégories (À venir)</CardTitle>
              </div>
              <CardDescription>
                Système futur pour une catégorisation plus précise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">• Classification hiérarchique</div>
              <div className="text-sm">• Filtrage avancé</div>
              <div className="text-sm">• Navigation par arbre</div>
              <div className="text-sm">• SEO optimisé</div>
            </CardContent>
          </Card>
        </div>

        {/* Exemples d'utilisation future */}
        <Card>
          <CardHeader>
            <CardTitle>Exemples de Catégorisation Future</CardTitle>
            <CardDescription>
              Voici comment les catégories pourront être utilisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-semibold mb-2">Électronique</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>├ Smartphones</li>
                  <li>├ Ordinateurs</li>
                  <li>│  ├ Portables</li>
                  <li>│  └ Bureau</li>
                  <li>└ Accessoires</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mode</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>├ Homme</li>
                  <li>│  ├ Vêtements</li>
                  <li>│  └ Chaussures</li>
                  <li>├ Femme</li>
                  <li>└ Enfant</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Maison</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>├ Cuisine</li>
                  <li>├ Salon</li>
                  <li>├ Chambre</li>
                  <li>└ Jardin</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques placeholder */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Catégories Principales</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Fonctionnalité à venir
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sous-catégories</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Classification hiérarchique
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Catégorisés</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Attribution automatique
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
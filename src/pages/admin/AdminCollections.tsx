import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminCollections: React.FC = () => {
  return (
    <AdminLayout 
      title="Gestion des Collections" 
      description="Organisez vos produits en collections cohérentes"
    >
      <div className="space-y-6">
        {/* Header avec bouton d'ajout */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Collections</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos collections de produits
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Collection
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Aucune collection créée
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections Actives</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Collections publiées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Organisés</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Produits dans des collections
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Zone principale */}
        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>
              Les collections vous permettent d'organiser vos produits par thème, saison ou type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune collection</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre première collection pour organiser vos produits.
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Créer ma première collection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { FolderOpen, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollections, useToggleCollectionStatus, useDeleteCollection } from '@/hooks/useCollections';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminCollections: React.FC = () => {
  const { data: collections, isLoading, error } = useCollections();
  const toggleStatus = useToggleCollectionStatus();
  const deleteCollection = useDeleteCollection();

  const handleToggleStatus = (id: string) => {
    toggleStatus.mutate(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la collection "${name}" ?`)) {
      deleteCollection.mutate(id);
    }
  };

  const formatPrice = (price: number) => `${(price / 100).toFixed(2)} €`;

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des Collections" description="Organisez vos produits en collections cohérentes">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Gestion des Collections" description="Organisez vos produits en collections cohérentes">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Erreur lors du chargement des collections</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const activeCollections = collections?.filter(c => c.is_active).length || 0;
  const totalCollections = collections?.length || 0;

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
              <div className="text-2xl font-bold">{totalCollections}</div>
              <p className="text-xs text-muted-foreground">
                Collections créées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections Actives</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCollections}</div>
              <p className="text-xs text-muted-foreground">
                Collections publiées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'Activation</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCollections > 0 ? Math.round((activeCollections / totalCollections) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Collections actives
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des collections */}
        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>
              Gérez vos collections de produits existantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {collections && collections.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créée</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                            <FolderOpen className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{collection.name}</div>
                            {collection.description && (
                              <div className="text-sm text-muted-foreground">{collection.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {collection.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={collection.is_active ? "default" : "secondary"}>
                          {collection.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(collection.created_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(collection.id)}
                            disabled={toggleStatus.isPending}
                          >
                            {collection.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(collection.id, collection.name)}
                            disabled={deleteCollection.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
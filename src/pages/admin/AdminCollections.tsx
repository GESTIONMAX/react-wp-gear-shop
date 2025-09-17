import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { FolderOpen, Plus, Edit, Trash2, Eye, EyeOff, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollections, useToggleCollectionStatus, useDeleteCollection, type Collection } from '@/hooks/useCollections';
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
import CreateCollectionForm from '@/components/admin/CreateCollectionForm';

const AdminCollections: React.FC = () => {
  const { data: collections, isLoading, error } = useCollections();
  const toggleStatus = useToggleCollectionStatus();
  const deleteCollection = useDeleteCollection();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const handleToggleStatus = (id: string) => {
    toggleStatus.mutate(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la collection "${name}" ?\n\nCette action ne peut pas être annulée.`)) {
      deleteCollection.mutate(id);
    }
  };

  const handleCreateCollection = () => {
    setEditingCollection(null);
    setShowCreateForm(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingCollection(null);
  };

  const handleFormSuccess = () => {
    // Les données seront automatiquement rafraîchies par React Query
  };

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
          <Button className="gap-2" onClick={handleCreateCollection}>
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

        {/* Formulaire de création/modification */}
        {showCreateForm && (
          <CreateCollectionForm
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
            editingCollection={editingCollection}
          />
        )}

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
                    <TableHead>Collection</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Image</TableHead>
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
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FolderOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{collection.name}</div>
                            {collection.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {collection.description}
                              </div>
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
                        {collection.image_url ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={collection.image_url}
                              alt={collection.name}
                              className="w-12 h-12 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-12 h-12 bg-muted rounded-lg items-center justify-center">
                              <Image className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
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
                            title={collection.is_active ? "Désactiver" : "Activer"}
                          >
                            {collection.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCollection(collection)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(collection.id, collection.name)}
                            disabled={deleteCollection.isPending}
                            title="Supprimer"
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
                <Button className="gap-2" onClick={handleCreateCollection}>
                  <Plus className="h-4 w-4" />
                  Créer ma première collection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section informative */}
        {collections && collections.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Exemples de Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <strong>Par gamme :</strong> Premium, Essential, Pro
                </div>
                <div className="text-sm">
                  <strong>Par usage :</strong> Sport, Lifestyle, Business
                </div>
                <div className="text-sm">
                  <strong>Par nouveauté :</strong> Nouveautés 2024, Best-sellers
                </div>
                <div className="text-sm">
                  <strong>Par prix :</strong> Accessible, Premium, Luxe
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avantages des Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  ✓ Organisation logique des produits
                </div>
                <div className="text-sm">
                  ✓ Navigation simplifiée pour les clients
                </div>
                <div className="text-sm">
                  ✓ Mise en avant de gammes spécifiques
                </div>
                <div className="text-sm">
                  ✓ Amélioration du SEO et du référencement
                </div>
                <div className="text-sm">
                  ✓ Création d'expériences d'achat thématiques
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-base text-blue-800 flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Images Hero Automatiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-blue-700">
                  <strong>Slugs reconnus automatiquement :</strong>
                </div>
                <div className="text-xs text-blue-600 space-y-1">
                  <div>• <code className="bg-blue-100 px-1 rounded">sport</code> → Page /sport</div>
                  <div>• <code className="bg-blue-100 px-1 rounded">lifestyle</code> → Page /lifestyle</div>
                  <div>• <code className="bg-blue-100 px-1 rounded">prismatic</code> → Page /prismatic</div>
                </div>
                <div className="text-xs text-blue-600 mt-3">
                  L'image uploadée remplace automatiquement l'image hero de la catégorie correspondante !
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCollections;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import { Layers3, Plus, Package, Edit, Trash2, Eye, EyeOff, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVariants, useToggleVariantStock, useDeleteVariant } from '@/hooks/useVariants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CreateVariantForm from '@/components/admin/CreateVariantForm';
import ImageUploadDebug from '@/components/admin/ImageUploadDebug';
import VariantImageUploader from '@/components/admin/VariantImageUploader';

const AdminVariants: React.FC = () => {
  const { data: variants, isLoading, error } = useVariants();
  const toggleStock = useToggleVariantStock();
  const deleteVariant = useDeleteVariant();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedVariantForImages, setSelectedVariantForImages] = useState<{
    id: string;
    name: string;
    product_id: string;
  } | null>(null);

  const handleToggleStock = (id: string) => {
    toggleStock.mutate(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la variante "${name}" ?`)) {
      deleteVariant.mutate(id);
    }
  };

  const formatPrice = (price: number) => `${(price / 100).toFixed(2)} €`;

  const handleCreateVariant = () => {
    setEditingVariant(null);
    setShowCreateForm(true);
  };

  const handleEditVariant = (variant: any) => {
    setEditingVariant(variant);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingVariant(null);
  };

  const handleManageImages = (variant: { id: string; name: string; product_id: string }) => {
    setSelectedVariantForImages(variant);
    setShowImageManager(true);
  };

  const handleImageManagerClose = () => {
    setShowImageManager(false);
    setSelectedVariantForImages(null);
  };

  const handleCreateSuccess = () => {
    // Recharger les données des variantes
    window.location.reload();
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des Variantes" description="Gérez les différentes variantes de vos produits">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Gestion des Variantes" description="Gérez les différentes variantes de vos produits">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Erreur lors du chargement des variantes</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const activeVariants = variants?.filter(v => v.in_stock).length || 0;
  const totalVariants = variants?.length || 0;
  const uniqueProducts = new Set(variants?.map(v => v.product_id)).size || 0;
  const uniqueAttributes = new Set(variants?.flatMap(v => Object.keys(v.attributes || {}))).size || 0;

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
          <Button className="gap-2" onClick={handleCreateVariant}>
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
              <div className="text-2xl font-bold">{totalVariants}</div>
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
              <div className="text-2xl font-bold">{activeVariants}</div>
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
              <div className="text-2xl font-bold">{uniqueProducts}</div>
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
              <div className="text-2xl font-bold">{uniqueAttributes}</div>
              <p className="text-xs text-muted-foreground">
                Couleur, taille, etc.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gestion des variantes */}
        <div className="space-y-6">
          {/* Formulaire de création */}
          {showCreateForm && (
            <CreateVariantForm
              onClose={handleFormClose}
              onSuccess={handleCreateSuccess}
              editingVariant={editingVariant}
            />
          )}

          {/* Liste des variantes */}
          <Card>
              <CardHeader>
                <CardTitle>Variantes de Produits</CardTitle>
                <CardDescription>
                  Gérez toutes vos variantes de produits existantes
                </CardDescription>
              </CardHeader>
              <CardContent>
            {variants && variants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variante</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Attributs</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                            <Layers3 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{variant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {variant.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{variant.products?.name}</div>
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          {variant.products?.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.attributes || {}).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatPrice(variant.price)}</div>
                        {variant.sale_price && (
                          <div className="text-sm text-green-600">
                            Promo: {formatPrice(variant.sale_price)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{variant.stock_quantity}</div>
                        <div className="text-xs text-muted-foreground">unités</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant.in_stock ? "default" : "secondary"}>
                          {variant.in_stock ? "En stock" : "Rupture"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageImages(variant)}
                            title="Gérer les images"
                          >
                            <Images className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStock(variant.id)}
                            disabled={toggleStock.isPending}
                            title={variant.in_stock ? "Masquer" : "Afficher"}
                          >
                            {variant.in_stock ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditVariant(variant)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(variant.id, variant.name)}
                            disabled={deleteVariant.isPending}
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
            )}
            </CardContent>
          </Card>

          {/* Gestionnaire d'images de variantes */}
          {showImageManager && selectedVariantForImages && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestion des images - {selectedVariantForImages.name}</CardTitle>
                    <CardDescription>
                      Téléchargez et gérez les images pour cette variante
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleImageManagerClose}>
                    Fermer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <VariantImageUploader
                  productId={selectedVariantForImages.product_id}
                  variantId={selectedVariantForImages.id}
                  variantName={selectedVariantForImages.name}
                  onImagesUploaded={() => {
                    // Optionnel: vous pouvez ajouter une logique de refresh ici
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Section informative */}
          {variants && variants.length > 0 && (
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVariants;
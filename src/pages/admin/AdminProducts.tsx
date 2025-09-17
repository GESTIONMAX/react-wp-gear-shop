import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Loader2, Search, Package, Plus, MoreHorizontal, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAdminProducts, useDeleteProduct, useToggleProductStatus, useCreateProduct, useUpdateProduct } from '@/hooks/useAdminProducts';
import ProductForm from '@/components/admin/ProductForm';
import { toast } from '@/hooks/use-toast';

// Page de gestion des produits
const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: products = [], isLoading, error } = useAdminProducts();
  const deleteProduct = useDeleteProduct();
  const toggleProductStatus = useToggleProductStatus();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleDelete = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct.mutateAsync(productId);
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit.",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await toggleProductStatus.mutateAsync({ productId, isActive: !currentStatus });
      toast({
        title: "Statut mis à jour",
        description: `Le produit a été ${!currentStatus ? 'activé' : 'désactivé'}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut du produit.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      // Le ProductForm envoie les prix en euros, on les convertit en centimes ici
      const cleanData = {
        ...productData,
        // Convertir euros en centimes pour la base de données
        price: Math.round(parseFloat(productData.price) * 100),
        sale_price: productData.sale_price ? Math.round(parseFloat(productData.sale_price) * 100) : null,
        // S'assurer des types corrects
        stock_quantity: parseInt(productData.stock_quantity.toString()) || 0,
        in_stock: Boolean(productData.in_stock),
      };

      console.log('Données à créer (prix convertis en centimes):', cleanData);
      await createProduct.mutateAsync(cleanData);
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Erreur création produit:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer le produit: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    try {
      // Le ProductForm envoie les prix en euros, on les convertit en centimes ici
      const cleanData = {
        ...productData,
        // Convertir euros en centimes pour la base de données
        price: Math.round(parseFloat(productData.price) * 100),
        sale_price: productData.sale_price ? Math.round(parseFloat(productData.sale_price) * 100) : null,
        // S'assurer des types corrects
        stock_quantity: parseInt(productData.stock_quantity.toString()) || 0,
        in_stock: Boolean(productData.in_stock),
      };

      console.log('Données à modifier (prix convertis en centimes):', cleanData);
      await updateProduct.mutateAsync(cleanData);
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès.",
      });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Erreur mise à jour produit:', error);
      toast({
        title: "Erreur",
        description: `Impossible de modifier le produit: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category?.name === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const productStats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    inactive: products.filter(p => !p.is_active).length,
    inStock: products.filter(p => p.in_stock).length,
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des produits" description="Gérez votre catalogue de produits">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Gestion des produits" description="Gérez votre catalogue de produits">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement des produits. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Gestion des produits" 
      description="Gérez votre catalogue de produits"
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productStats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Actifs</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{productStats.active}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Inactifs</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{productStats.inactive}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{productStats.inStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Filters */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filtres & Recherche</CardTitle>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Produit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau produit</DialogTitle>
                    <DialogDescription>
                      Ajoutez un nouveau produit à votre catalogue
                    </DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    onSubmit={handleCreateProduct}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isLoading={createProduct.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des produits</CardTitle>
            <CardDescription>
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            {product.images?.[0]?.image_url ? (
                              <img 
                                src={product.images[0].image_url} 
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.short_description || 'Aucune description'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.category?.name || 'Sans catégorie'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {product.sale_price ? (
                            <>
                              <span className="text-destructive">{(product.sale_price / 100).toFixed(2)} €</span>
                              <span className="text-muted-foreground line-through ml-2 text-sm">
                                {(product.price / 100).toFixed(2)} €
                              </span>
                            </>
                          ) : (
                            <span>{(product.price / 100).toFixed(2)} €</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.in_stock ? "default" : "destructive"}>
                          {product.in_stock ? `${product.stock_quantity} en stock` : 'Rupture'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(product.id, product.is_active)}
                            >
                              {product.is_active ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun produit trouvé</p>
                  {searchTerm && (
                    <p className="text-sm">Essayez de modifier votre recherche</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
              <DialogDescription>
                Modifiez les informations du produit
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <ProductForm
                product={selectedProduct}
                onSubmit={handleUpdateProduct}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedProduct(null);
                }}
                isLoading={updateProduct.isPending}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
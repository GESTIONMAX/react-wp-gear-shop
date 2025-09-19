import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Globe,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Package
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Supplier } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock data for suppliers
const mockSuppliers = [
  {
    id: '1',
    name: 'TechSource Electronics',
    contact_person: 'Marie Dubois',
    email: 'marie@techsource.fr',
    phone: '+33 1 23 45 67 89',
    website: 'www.techsource-electronics.fr',
    address: '123 Avenue des Champs-Élysées',
    city: 'Paris',
    postal_code: '75008',
    country: 'France',
    category: 'Électronique grand public',
    status: 'active',
    rating: 4.8,
    products_count: 145,
    created_at: '2024-01-15T10:30:00Z',
    notes: 'Fournisseur fiable pour les produits électroniques. Livraisons rapides.'
  },
  {
    id: '2',
    name: 'Gaming Hardware Pro',
    contact_person: 'Jean-Luc Martin',
    email: 'contact@gaminghardwarepro.com',
    phone: '+33 4 56 78 90 12',
    website: 'www.gaminghardwarepro.com',
    address: '456 Rue de la Technologie',
    city: 'Lyon',
    postal_code: '69000',
    country: 'France',
    category: 'Gaming',
    status: 'active',
    rating: 4.6,
    products_count: 89,
    created_at: '2024-02-20T14:15:00Z',
    notes: 'Spécialiste gaming avec d\'excellents prix sur les composants.'
  },
  {
    id: '3',
    name: 'Mobile Accessories World',
    contact_person: 'Sophie Chen',
    email: 'sophie@mobileaccessories.fr',
    phone: '+33 2 34 56 78 90',
    website: 'www.mobile-accessories.fr',
    address: '789 Boulevard Mobile',
    city: 'Nantes',
    postal_code: '44000',
    country: 'France',
    category: 'Accessoires mobiles',
    status: 'pending',
    rating: 4.2,
    products_count: 234,
    created_at: '2024-03-10T09:20:00Z',
    notes: 'Nouveau fournisseur en cours d\'évaluation. Catalogue très complet.'
  }
];

const AdminSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = !searchTerm || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const supplierStats = {
    total: mockSuppliers.length,
    active: mockSuppliers.filter(s => s.status === 'active').length,
    pending: mockSuppliers.filter(s => s.status === 'pending').length,
    totalProducts: mockSuppliers.reduce((sum, s) => sum + s.products_count, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactif</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
            <p className="text-muted-foreground">
              Gérez vos partenaires fournisseurs et leurs informations
            </p>
          </div>
          <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau fournisseur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau fournisseur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau fournisseur
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="supplier-name">Nom de l'entreprise</Label>
                  <Input id="supplier-name" placeholder="TechSource Electronics" />
                </div>
                <div>
                  <Label htmlFor="contact-person">Personne de contact</Label>
                  <Input id="contact-person" placeholder="Marie Dubois" />
                </div>
                <div>
                  <Label htmlFor="supplier-email">Email</Label>
                  <Input id="supplier-email" type="email" placeholder="contact@techsource.fr" />
                </div>
                <div>
                  <Label htmlFor="supplier-phone">Téléphone</Label>
                  <Input id="supplier-phone" placeholder="+33 1 23 45 67 89" />
                </div>
                <div>
                  <Label htmlFor="supplier-website">Site web</Label>
                  <Input id="supplier-website" placeholder="www.techsource.fr" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="supplier-category">Catégorie</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Électronique grand public</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="mobile">Accessoires mobiles</SelectItem>
                      <SelectItem value="computers">Informatique</SelectItem>
                      <SelectItem value="audio">Audio/Vidéo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="supplier-notes">Notes</Label>
                  <Textarea id="supplier-notes" placeholder="Informations supplémentaires..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingSupplier(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setIsAddingSupplier(false)}>
                  Ajouter le fournisseur
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fournisseurs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplierStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Partenaires enregistrés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fournisseurs Actifs</CardTitle>
              <Building2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{supplierStats.active}</div>
              <p className="text-xs text-muted-foreground">
                Partenaires confirmés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Building2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{supplierStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                À valider
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Disponibles</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{supplierStats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total du catalogue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres et recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un fournisseur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des fournisseurs</CardTitle>
            <CardDescription>
              {filteredSuppliers.length} fournisseur{filteredSuppliers.length > 1 ? 's' : ''} trouvé{filteredSuppliers.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Produits</TableHead>
                    <TableHead>Ajouté</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.city}, {supplier.country}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{supplier.contact_person}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {supplier.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(supplier.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">{getRatingStars(supplier.rating)}</span>
                          <span className="text-sm text-muted-foreground">({supplier.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{supplier.products_count}</div>
                        <div className="text-sm text-muted-foreground">produits</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(supplier.created_at), { addSuffix: true, locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedSupplier(supplier)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails du fournisseur</DialogTitle>
                                <DialogDescription>
                                  Informations complètes de {supplier.name}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedSupplier && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Nom de l'entreprise</Label>
                                      <div className="font-medium">{selectedSupplier.name}</div>
                                    </div>
                                    <div>
                                      <Label>Personne de contact</Label>
                                      <div className="font-medium">{selectedSupplier.contact_person}</div>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <div className="font-medium">{selectedSupplier.email}</div>
                                    </div>
                                    <div>
                                      <Label>Téléphone</Label>
                                      <div className="font-medium">{selectedSupplier.phone}</div>
                                    </div>
                                    <div>
                                      <Label>Site web</Label>
                                      <div className="font-medium text-blue-600">
                                        <a href={`https://${selectedSupplier.website}`} target="_blank" rel="noopener noreferrer">
                                          {selectedSupplier.website}
                                        </a>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Catégorie</Label>
                                      <div className="font-medium">{selectedSupplier.category}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Adresse complète</Label>
                                    <div className="font-medium">
                                      {selectedSupplier.address}<br />
                                      {selectedSupplier.postal_code} {selectedSupplier.city}<br />
                                      {selectedSupplier.country}
                                    </div>
                                  </div>
                                  {selectedSupplier.notes && (
                                    <div>
                                      <Label>Notes</Label>
                                      <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                                        {selectedSupplier.notes}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredSuppliers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun fournisseur trouvé</p>
                  {searchTerm && (
                    <p className="text-sm">Essayez de modifier votre recherche</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSuppliers;
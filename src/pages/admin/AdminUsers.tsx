import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Search, 
  UserCheck, 
  UserX, 
  Crown, 
  Users, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  Euro,
  FileText,
  Truck,
  Edit,
  Save,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Fixed Tabs import
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useUsers, useUpdateUserRole } from '@/hooks/useUsers';
import { useAdminOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  console.log('🔄 Component render - editingProfile:', editingProfile);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    address_complement: '',
    city: '',
    postal_code: '',
    country: 'France',
    marketing_phone: '',
    marketing_consent: false,
    notes: ''
  });
  
  // Debug: Track state changes
  React.useEffect(() => {
    console.log('🔄 editingProfile state changed to:', editingProfile);
  }, [editingProfile]);
  
  const { data: users = [], isLoading, error } = useUsers();
  const { data: orders = [] } = useAdminOrders();
  const { data: invoices = [] } = useInvoices();
  const { data: profile } = useProfile(selectedUser?.user_id);
  const updateUserRole = useUpdateUserRole();
  const updateProfile = useUpdateProfile();

  const handleEditProfile = () => {
    console.log('📝 handleEditProfile called');
    console.log('👤 selectedUser:', selectedUser);
    console.log('🗂️ profile:', profile);
    console.log('🔄 État editingProfile avant:', editingProfile);
    
    if (profile) {
      const newForm = {
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        address: profile.address || '',
        address_complement: (profile as any).address_complement || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'France',
        marketing_phone: profile.marketing_phone || '',
        marketing_consent: profile.marketing_consent || false,
        notes: profile.notes || ''
      };
      console.log('📋 Formulaire pré-rempli:', newForm);
      setProfileForm(newForm);
      console.log('🔄 Activation du mode édition...');
      setEditingProfile(true);
      console.log('🔄 État editingProfile après setEditingProfile(true):', editingProfile);
      
      // Force re-render pour debug
      setTimeout(() => {
        console.log('🔄 État editingProfile après timeout:', editingProfile);
      }, 100);
    } else {
      console.error('❌ Pas de profil disponible pour l\'édition');
    }
  };

  const handleSaveProfile = async () => {
    console.log('🚀 handleSaveProfile called');
    
    if (!selectedUser) {
      console.error('❌ Pas d\'utilisateur sélectionné');
      return;
    }
    
    if (!selectedUser.user_id) {
      console.error('❌ Pas d\'user_id pour l\'utilisateur sélectionné:', selectedUser);
      return;
    }
    
    console.log('🔧 Tentative de sauvegarde du profil:', {
      userId: selectedUser.user_id,
      formData: profileForm,
      profileExists: !!profile
    });
    
    try {
      const result = await updateProfile.mutateAsync({
        userId: selectedUser.user_id,
        updates: profileForm
      });
      console.log('✅ Profil sauvegardé avec succès:', result);
      setEditingProfile(false);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setProfileForm({
      first_name: '',
      last_name: '',
      address: '',
      address_complement: '',
      city: '',
      postal_code: '',
      country: 'France',
      marketing_phone: '',
      marketing_consent: false,
      notes: ''
    });
  };
  const ClientDetailDialog = ({ user }: { user: any }) => {
    if (!user) return null;

    const userOrders = orders.filter(order => order.user_id === user.user_id);
    const userInvoices = invoices.filter(invoice => invoice.user_id === user.user_id);
    
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalInvoices = userInvoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price / 100);
    };

    return (
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-medium text-primary">
                {user.first_name?.charAt(0) || user.email?.charAt(0) || '?'}
              </span>
            </div>
            {user.first_name || user.last_name 
              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
              : 'Client sans nom'
            }
          </DialogTitle>
          <DialogDescription>
            Informations détaillées et historique du client
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="addresses">Adresses</TabsTrigger>
            <TabsTrigger value="orders">Commandes ({userOrders.length})</TabsTrigger>
            <TabsTrigger value="invoices">Factures ({userInvoices.length})</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Inscrit {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-muted-foreground" />
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrateur' : 'Client'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dernière commande</span>
                      <span className="text-sm">
                        {userOrders.length > 0 
                          ? formatDistanceToNow(new Date(userOrders[0].created_at), { addSuffix: true, locale: fr })
                          : 'Aucune commande'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dernière facture</span>
                      <span className="text-sm">
                        {userInvoices.length > 0 
                          ? formatDistanceToNow(new Date(userInvoices[0].created_at), { addSuffix: true, locale: fr })
                          : 'Aucune facture'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Informations du client</h3>
                <p className="text-sm text-muted-foreground">
                  Adresse par défaut et informations de contact marketing
                </p>
              </div>
              {!editingProfile ? (
                <Button 
                  onClick={() => {
                    console.log('🖱️ Button "Modifier" clicked!');
                    handleEditProfile();
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    size="sm"
                    disabled={updateProfile.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfile.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </div>

            <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
              Mode édition: {editingProfile ? 'ACTIVÉ' : 'DÉSACTIVÉ'} | 
              Profile ID: {profile?.id} | 
              Selected User ID: {selectedUser?.user_id}
            </div>

            {!editingProfile ? (
              // Mode affichage
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Adresse par défaut
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </div>
                       {profile?.address && (
                         <div className="text-sm text-muted-foreground space-y-1">
                           <div>{profile.address}</div>
                           {(profile as any).address_complement && (
                             <div>{(profile as any).address_complement}</div>
                           )}
                           <div>{profile.postal_code} {profile.city}</div>
                           <div>{profile.country}</div>
                         </div>
                       )}
                      {!profile?.address && (
                        <div className="text-sm text-muted-foreground italic">
                          Aucune adresse par défaut définie
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Marketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Téléphone SMS:</span>
                        <span className="text-sm">
                          {profile?.marketing_phone || 'Non renseigné'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Consentement SMS:</span>
                        <Badge variant={profile?.marketing_consent ? 'default' : 'secondary'}>
                          {profile?.marketing_consent ? 'Accepté' : 'Refusé'}
                        </Badge>
                      </div>
                      {profile?.notes && (
                        <div className="mt-4">
                          <span className="text-sm font-medium">Notes internes:</span>
                          <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                            {profile.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Mode édition
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Prénom</Label>
                        <Input
                          id="first_name"
                          value={profileForm.first_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Nom</Label>
                        <Input
                          id="last_name"
                          value={profileForm.last_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Adresse par défaut</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                       <Label htmlFor="address">Adresse</Label>
                       <Input
                         id="address"
                         value={profileForm.address}
                         onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                         placeholder="123 Rue de la Paix"
                       />
                     </div>
                     <div>
                       <Label htmlFor="address_complement">Complément d'adresse</Label>
                       <Input
                         id="address_complement"
                         value={profileForm.address_complement}
                         onChange={(e) => setProfileForm(prev => ({ ...prev, address_complement: e.target.value }))}
                         placeholder="Bâtiment A, Apt 4"
                       />
                     </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="postal_code">Code postal</Label>
                        <Input
                          id="postal_code"
                          value={profileForm.postal_code}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, postal_code: e.target.value }))}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={profileForm.country}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Marketing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="marketing_phone">Téléphone pour SMS marketing</Label>
                      <Input
                        id="marketing_phone"
                        value={profileForm.marketing_phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, marketing_phone: e.target.value }))}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing_consent"
                        checked={profileForm.marketing_consent}
                        onCheckedChange={(checked) => 
                          setProfileForm(prev => ({ ...prev, marketing_consent: checked as boolean }))
                        }
                      />
                      <Label htmlFor="marketing_consent">
                        Consentement pour recevoir des SMS marketing
                      </Label>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes internes</Label>
                      <Textarea
                        id="notes"
                        value={profileForm.notes}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Notes sur ce client..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Historique des adresses utilisées */}
            {userOrders.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Historique des adresses</h4>
                <div className="space-y-4">
                  {/* Adresses de livraison historiques */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Adresses de livraison utilisées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Array.from(new Set(userOrders
                          .filter(order => order.shipping_address)
                          .map(order => JSON.stringify(order.shipping_address))))
                          .map((addressStr, index) => {
                            const address = JSON.parse(addressStr);
                            const ordersWithThisAddress = userOrders.filter(
                              order => JSON.stringify(order.shipping_address) === addressStr
                            );
                            
                            return (
                              <div key={index} className="border rounded-lg p-3 bg-muted/50">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="text-sm font-medium">
                                    {address.firstName} {address.lastName}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {ordersWithThisAddress.length} fois
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  <div>{address.address}</div>
                                  <div>{address.postalCode} {address.city}</div>
                                  {address.phone && <div>Tél: {address.phone}</div>}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {userOrders.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Commande</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.status}</Badge>
                          </TableCell>
                          <TableCell>{formatPrice(order.total_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune commande pour ce client</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            {userInvoices.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Facture</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                          <TableCell>{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatPrice(invoice.total_amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune facture pour ce client</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(totalSpent)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sur {userOrders.length} commande{userOrders.length > 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {userOrders.length > 0 ? formatPrice(totalSpent / userOrders.length) : '0 €'}
                  </div>
                  <p className="text-xs text-muted-foreground">Par commande</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Factures impayées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {userInvoices.filter(inv => inv.status !== 'paid').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(userInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total_amount, 0))}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    );
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await updateUserRole.mutateAsync({ userId, role: newRole });
      toast({
        title: "Rôle mis à jour",
        description: `Le rôle utilisateur a été modifié avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle utilisateur.",
        variant: "destructive",
      });
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
                       (roleFilter === 'admin' && user.role === 'admin') ||
                       (roleFilter === 'user' && (!user.role || user.role === 'user'));
    
    return matchesSearch && matchesRole;
  });

  // Statistics enriched with order data
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => !u.role || u.role === 'user').length,
    activeClients: users.filter(u => {
      const userOrders = orders.filter(order => order.profiles?.id === u.id);
      return userOrders.length > 0;
    }).length,
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des clients" description="Gérez vos clients, leurs commandes et leurs informations">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Gestion des clients" description="Gérez vos clients, leurs commandes et leurs informations">
        <Alert variant="destructive">
          <AlertDescription>
            Erreur lors du chargement des clients. Veuillez réessayer.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Gestion des clients" 
      description="Gérez vos clients, leurs commandes et leurs informations"
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Tous les utilisateurs inscrits
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userStats.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                Avec au moins une commande
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userStats.admins}</div>
              <p className="text-xs text-muted-foreground">
                Accès administration
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Standard</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{userStats.users}</div>
              <p className="text-xs text-muted-foreground">
                Clients réguliers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres & Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
            <CardDescription>
              {filteredUsers.length} client{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>Total dépensé</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const userOrders = orders.filter(order => order.profiles?.id === user.id);
                    const totalSpent = userOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {user.first_name?.charAt(0) || user.email?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {user.first_name || user.last_name 
                                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                  : 'Sans nom'
                                }
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? (
                              <>
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                Client
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            <span>{userOrders.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <Euro className="h-4 w-4" />
                            <span>
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(totalSpent / 100)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                              </DialogTrigger>
                              <ClientDetailDialog user={selectedUser} />
                            </Dialog>
                            
                            <Select
                              value={user.role || 'user'}
                              onValueChange={(newRole: 'admin' | 'user') => 
                                handleRoleChange(user.user_id, newRole)
                              }
                              disabled={updateUserRole.isPending}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Client</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun client trouvé</p>
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

export default AdminUsers;
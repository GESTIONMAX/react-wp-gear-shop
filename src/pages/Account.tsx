import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Package, 
  CreditCard, 
  Settings, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  FileText,
  Receipt,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useClientData, useUpdateClientData } from '@/hooks/useClientData';
import { toast } from '@/hooks/use-toast';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  
  // Séparation claire : profile pour données utilisateur, clientData pour données client
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id || '');
  const { data: clientData, isLoading: clientLoading } = useClientData(user?.id || '');
  
  const updateProfile = useUpdateProfile();
  const updateClientData = useUpdateClientData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Formulaire pour données profil (nom, email, phone, avatar)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  });

  // Formulaire pour données client (adresses, marketing, etc.)
  const [clientForm, setClientForm] = useState({
    address: '',
    address_complement: '',
    city: '',
    postal_code: '',
    country: 'France',
    marketing_phone: '',
    marketing_consent: false,
    notes: '',
    preferred_shipping_address: {
      address: '',
      address_complement: '',
      city: '',
      postal_code: '',
      country: 'France',
      first_name: '',
      last_name: ''
    }
  });

  // Initialiser les formulaires quand les données sont chargées
  React.useEffect(() => {
    if (profile && !editingProfile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        email: profile.email || ''
      });
    }
  }, [profile, editingProfile]);

  React.useEffect(() => {
    if (clientData && !editingProfile) {
      const shippingAddr = clientData.preferred_shipping_address || {};
      setClientForm({
        address: clientData.address || '',
        address_complement: clientData.address_complement || '',
        city: clientData.city || '',
        postal_code: clientData.postal_code || '',
        country: clientData.country || 'France',
        marketing_phone: clientData.marketing_phone || '',
        marketing_consent: clientData.marketing_consent || false,
        notes: clientData.notes || '',
        preferred_shipping_address: {
          address: shippingAddr.address || '',
          address_complement: shippingAddr.address_complement || '',
          city: shippingAddr.city || '',
          postal_code: shippingAddr.postal_code || '',
          country: shippingAddr.country || 'France',
          first_name: shippingAddr.first_name || '',
          last_name: shippingAddr.last_name || ''
        }
      });
    }
  }, [clientData, editingProfile]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      // Mettre à jour les données de profil
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: profileForm
      });

      // Mettre à jour les données client
      await updateClientData.mutateAsync({
        userId: user.id,
        updates: clientForm
      });

      setEditingProfile(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    // Réinitialiser les formulaires
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        email: profile.email || ''
      });
    }
    if (clientData) {
      const shippingAddr = clientData.preferred_shipping_address || {};
      setClientForm({
        address: clientData.address || '',
        address_complement: clientData.address_complement || '',
        city: clientData.city || '',
        postal_code: clientData.postal_code || '',
        country: clientData.country || 'France',
        marketing_phone: clientData.marketing_phone || '',
        marketing_consent: clientData.marketing_consent || false,
        notes: clientData.notes || '',
        preferred_shipping_address: {
          address: shippingAddr.address || '',
          address_complement: shippingAddr.address_complement || '',
          city: shippingAddr.city || '',
          postal_code: shippingAddr.postal_code || '',
          country: shippingAddr.country || 'France',
          first_name: shippingAddr.first_name || '',
          last_name: shippingAddr.last_name || ''
        }
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || invoicesLoading || profileLoading || clientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement de votre compte...</p>
        </div>
      </div>
    );
  }

  const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const totalInvoices = invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Mon compte</h1>
              <p className="text-muted-foreground">
                {profile?.first_name} {profile?.last_name}
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
          </TabsList>

          {/* Tableau de bord */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders?.length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Factures</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{invoices?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Commandes récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Commande #{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.total_amount)}</p>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status === 'delivered' ? 'Livrée' : 
                             order.status === 'pending' ? 'En attente' : 
                             order.status === 'processing' ? 'En cours' : order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune commande pour le moment.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Gérez vos informations de profil et adresses
                    </CardDescription>
                  </div>
                  {!editingProfile ? (
                    <Button onClick={() => setEditingProfile(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} disabled={updateProfile.isPending || updateClientData.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {(updateProfile.isPending || updateClientData.isPending) ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Prénom</Label>
                    {editingProfile ? (
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm">{profile?.first_name || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="last_name">Nom</Label>
                    {editingProfile ? (
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm">{profile?.last_name || 'Non renseigné'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {editingProfile ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm">{profile?.email || 'Non renseigné'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {editingProfile ? (
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <p className="text-sm">{profile?.phone || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Adresse principale */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Adresse principale</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Adresse</Label>
                      {editingProfile ? (
                        <Input
                          id="address"
                          value={clientForm.address}
                          onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="123 Rue de la Paix"
                        />
                      ) : (
                        <p className="text-sm">{clientData?.address || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address_complement">Complément d'adresse</Label>
                      {editingProfile ? (
                        <Input
                          id="address_complement"
                          value={clientForm.address_complement}
                          onChange={(e) => setClientForm(prev => ({ ...prev, address_complement: e.target.value }))}
                          placeholder="Apt 4B, Étage 2, etc."
                        />
                      ) : (
                        <p className="text-sm">{clientData?.address_complement || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postal_code">Code postal</Label>
                      {editingProfile ? (
                        <Input
                          id="postal_code"
                          value={clientForm.postal_code}
                          onChange={(e) => setClientForm(prev => ({ ...prev, postal_code: e.target.value }))}
                          placeholder="75001"
                        />
                      ) : (
                        <p className="text-sm">{clientData?.postal_code || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">Ville</Label>
                      {editingProfile ? (
                        <Input
                          id="city"
                          value={clientForm.city}
                          onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Paris"
                        />
                      ) : (
                        <p className="text-sm">{clientData?.city || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country">Pays</Label>
                      {editingProfile ? (
                        <Input
                          id="country"
                          value={clientForm.country}
                          onChange={(e) => setClientForm(prev => ({ ...prev, country: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm">{clientData?.country || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Marketing */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Préférences marketing</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="marketing_phone">Téléphone SMS</Label>
                      {editingProfile ? (
                        <Input
                          id="marketing_phone"
                          value={clientForm.marketing_phone}
                          onChange={(e) => setClientForm(prev => ({ ...prev, marketing_phone: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm">{clientData?.marketing_phone || 'Non renseigné'}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {editingProfile ? (
                        <Checkbox
                          id="marketing_consent"
                          checked={clientForm.marketing_consent}
                          onCheckedChange={(checked) => setClientForm(prev => ({ ...prev, marketing_consent: !!checked }))}
                        />
                      ) : null}
                      <Label htmlFor="marketing_consent">
                        J'accepte de recevoir des communications marketing par SMS
                      </Label>
                      {!editingProfile && (
                        <Badge variant={clientData?.marketing_consent ? 'default' : 'secondary'}>
                          {clientData?.marketing_consent ? 'Accepté' : 'Refusé'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commandes */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes commandes</CardTitle>
                <CardDescription>
                  Historique de toutes vos commandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Commande #{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.created_at)}
                              </p>
                              {order.notes && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Note: {order.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(order.total_amount)}</p>
                              <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                {order.status === 'delivered' ? 'Livrée' : 
                                 order.status === 'pending' ? 'En attente' : 
                                 order.status === 'processing' ? 'En cours' : order.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune commande pour le moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Factures */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes factures</CardTitle>
                <CardDescription>
                  Historique de toutes vos factures
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoices && invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <Card key={invoice.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Facture #{invoice.invoice_number}</p>
                              <p className="text-sm text-muted-foreground">
                                Émise le {formatDate(invoice.invoice_date)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Échéance: {formatDate(invoice.due_date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(invoice.total_amount)}</p>
                              <Badge variant={invoice.status === 'sent' ? 'default' : 'secondary'}>
                                {invoice.status === 'sent' ? 'Envoyée' : 
                                 invoice.status === 'draft' ? 'Brouillon' : 
                                 invoice.status === 'cancelled' ? 'Annulée' : invoice.status}
                              </Badge>
                            </div>
                          </div>
                          {invoice.pdf_url && (
                            <div className="mt-4">
                              <Button variant="outline" size="sm" asChild>
                                <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Télécharger PDF
                                </a>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune facture pour le moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
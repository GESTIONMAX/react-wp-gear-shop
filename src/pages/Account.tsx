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
import { toast } from '@/hooks/use-toast';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id || '');
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    address_complement: '',
    city: '',
    postal_code: '',
    country: 'France',
    phone: '',
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

  // Initialiser le formulaire quand le profil est chargé
  React.useEffect(() => {
    if (profile && !editingProfile) {
      const shippingAddr = profile.preferred_shipping_address || {};
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        address: profile.address || '',
        address_complement: profile.address_complement || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'France',
        phone: profile.phone || '',
        marketing_phone: profile.marketing_phone || '',
        marketing_consent: profile.marketing_consent || false,
        notes: profile.notes || '',
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
    } else if (!profile && !profileLoading && !editingProfile) {
      // Profil vide si aucun profil n'existe
      setProfileForm({
        first_name: '',
        last_name: '',
        address: '',
        address_complement: '',
        city: '',
        postal_code: '',
        country: 'France',
        phone: '',
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
    }
  }, [profile, editingProfile, profileLoading]);

  if (!user) {
    // Afficher l'interface d'authentification au lieu de rediriger
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-merriweather text-3xl font-bold mb-8">Mon Compte</h1>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Connexion requise</CardTitle>
              <CardDescription>
                Vous devez être connecté pour accéder à votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur MyTechGear !",
    });
    navigate('/');
  };

  const handleEditProfile = () => {
    if (profile) {
      const shippingAddr = profile.preferred_shipping_address || {};
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        address: profile.address || '',
        address_complement: profile.address_complement || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'France',
        phone: profile.phone || '',
        marketing_phone: profile.marketing_phone || '',
        marketing_consent: profile.marketing_consent || false,
        notes: profile.notes || '',
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
      setEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: {
          ...profileForm,
          // S'assurer que les champs vides sont null pour la base de données
          preferred_shipping_address: profileForm.preferred_shipping_address.address 
            ? profileForm.preferred_shipping_address 
            : null
        }
      });
      setEditingProfile(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    if (profile) {
      const shippingAddr = profile.preferred_shipping_address || {};
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        address: profile.address || '',
        address_complement: profile.address_complement || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'France',
        phone: profile.phone || '',
        marketing_phone: profile.marketing_phone || '',
        marketing_consent: profile.marketing_consent || false,
        notes: profile.notes || '',
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      processing: { label: 'En cours', variant: 'default' as const },
      shipped: { label: 'Expédié', variant: 'outline' as const },
      delivered: { label: 'Livré', variant: 'default' as const },
      cancelled: { label: 'Annulé', variant: 'destructive' as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getInvoiceStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Brouillon', variant: 'secondary' as const },
      sent: { label: 'Envoyée', variant: 'default' as const },
      paid: { label: 'Payée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const userInitials = user.user_metadata?.first_name && user.user_metadata?.last_name 
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au magasin
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="font-merriweather text-3xl font-bold text-primary mb-4">
              Mon Espace Client
            </h1>
            <p className="text-muted-foreground text-lg">
              Gérez votre profil, vos commandes et vos préférences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-4 lg:w-[480px] mb-2 gap-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3 px-3">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 py-3 px-3">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Commandes</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2 py-3 px-3">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Factures</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 py-3 px-3">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8 mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Commandes totales
                    </CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orders?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Depuis votre inscription
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Commandes en cours
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {orders?.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      En préparation ou en transit
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total factures
                    </CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{invoices?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Factures émises
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Dernières commandes */}
              <Card>
                <CardHeader>
                  <CardTitle>Dernières commandes</CardTitle>
                  <CardDescription>
                    Aperçu de vos commandes récentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">Commande {order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-medium">{formatPrice(order.total_amount)}</p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>
                      <Button className="mt-4" onClick={() => navigate('/')}>
                        Découvrir nos produits
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Commandes</CardTitle>
                  <CardDescription>
                    Historique complet de vos commandes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg">Commande {order.order_number}</h4>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(order.created_at)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
                                {getStatusBadge(order.status)}
                              </div>
                            </div>
                            
                            {order.shipping_address && (
                              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium flex items-center mb-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  Adresse de livraison
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {order.shipping_address.address}, {order.shipping_address.city} {order.shipping_address.postalCode}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Aucune commande pour le moment</p>
                      <Button className="mt-4" onClick={() => navigate('/')}>
                        Passer votre première commande
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Factures</CardTitle>
                  <CardDescription>
                    Historique complet de vos factures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Chargement...</p>
                    </div>
                  ) : invoices && invoices.length > 0 ? (
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <Card key={invoice.id} className="border-l-4 border-l-secondary">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                  <Receipt className="h-5 w-5" />
                                  Facture {invoice.invoice_number}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(invoice.invoice_date)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Échéance : {formatDate(invoice.due_date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{formatPrice(invoice.total_amount)}</p>
                                {getInvoiceStatusBadge(invoice.status)}
                              </div>
                            </div>
                            
                            {invoice.notes && (
                              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">Notes</p>
                                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Aucune facture pour le moment</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-8 mt-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>
                        Gérez vos informations de profil et adresses
                      </CardDescription>
                    </div>
                    {!editingProfile ? (
                      <Button 
                        onClick={handleEditProfile} 
                        variant="outline" 
                        size="sm"
                        disabled={profileLoading}
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
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">Chargement du profil...</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">
                            {profile?.first_name || profile?.last_name 
                              ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
                              : 'Nom non renseigné'
                            }
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {user.email}
                          </p>
                          {profile?.phone && (
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {profile.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {!editingProfile ? (
                        // Mode affichage
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium text-lg mb-4">Informations personnelles</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Prénom</Label>
                                <p className="text-sm">{profile?.first_name || 'Non renseigné'}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                                <p className="text-sm">{profile?.last_name || 'Non renseigné'}</p>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                <p className="text-sm">{user.email}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                                <p className="text-sm">{profile?.phone || 'Non renseigné'}</p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              Adresse principale
                            </h4>
                            {profile?.address ? (
                              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium">
                                  {profile.first_name} {profile.last_name}
                                </p>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>{profile.address}</p>
                                  {profile.address_complement && (
                                    <p>{profile.address_complement}</p>
                                  )}
                                  <p>{profile.postal_code} {profile.city}</p>
                                  <p>{profile.country}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Aucune adresse principale définie
                              </p>
                            )}
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Adresse de livraison préférée
                            </h4>
                            {profile?.preferred_shipping_address && profile.preferred_shipping_address.address ? (
                              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium">
                                  {profile.preferred_shipping_address.first_name} {profile.preferred_shipping_address.last_name}
                                </p>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p>{profile.preferred_shipping_address.address}</p>
                                  {profile.preferred_shipping_address.address_complement && (
                                    <p>{profile.preferred_shipping_address.address_complement}</p>
                                  )}
                                  <p>{profile.preferred_shipping_address.postal_code} {profile.preferred_shipping_address.city}</p>
                                  <p>{profile.preferred_shipping_address.country}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Aucune adresse de livraison définie (l'adresse principale sera utilisée)
                              </p>
                            )}
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-lg mb-4">Préférences marketing</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-muted-foreground">Téléphone SMS</Label>
                                <p className="text-sm">{profile?.marketing_phone || 'Non renseigné'}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium text-muted-foreground">Consentement SMS</Label>
                                <Badge variant={profile?.marketing_consent ? 'default' : 'secondary'}>
                                  {profile?.marketing_consent ? 'Accepté' : 'Refusé'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Mode édition
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium text-lg mb-4">Informations personnelles</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="first_name">Prénom</Label>
                                <Input
                                  id="first_name"
                                  value={profileForm.first_name}
                                  onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                                  placeholder="Votre prénom"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="last_name">Nom</Label>
                                <Input
                                  id="last_name"
                                  value={profileForm.last_name}
                                  onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                                  placeholder="Votre nom"
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                <Input value={user.email || ''} readOnly className="bg-muted" />
                                <p className="text-xs text-muted-foreground">
                                  L'email ne peut pas être modifié depuis cette interface
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                  id="phone"
                                  value={profileForm.phone}
                                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                  placeholder="0123456789"
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-lg mb-4">Adresse principale</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                  id="address"
                                  value={profileForm.address}
                                  onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                                  placeholder="123 Rue de la Paix"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="address_complement">Complément d'adresse</Label>
                                <Input
                                  id="address_complement"
                                  value={profileForm.address_complement}
                                  onChange={(e) => setProfileForm(prev => ({ ...prev, address_complement: e.target.value }))}
                                  placeholder="Appartement, bâtiment, etc."
                                />
                              </div>
                              <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                  <Label htmlFor="postal_code">Code postal</Label>
                                  <Input
                                    id="postal_code"
                                    value={profileForm.postal_code}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, postal_code: e.target.value }))}
                                    placeholder="75001"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="city">Ville</Label>
                                  <Input
                                    id="city"
                                    value={profileForm.city}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                                    placeholder="Paris"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="country">Pays</Label>
                                  <Input
                                    id="country"
                                    value={profileForm.country}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                                    placeholder="France"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-lg mb-4">Adresse de livraison préférée</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Si différente de l'adresse principale. Laisser vide pour utiliser l'adresse principale.
                            </p>
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label htmlFor="shipping_first_name">Prénom (livraison)</Label>
                                  <Input
                                    id="shipping_first_name"
                                    value={profileForm.preferred_shipping_address.first_name}
                                    onChange={(e) => setProfileForm(prev => ({
                                      ...prev,
                                      preferred_shipping_address: {
                                        ...prev.preferred_shipping_address,
                                        first_name: e.target.value
                                      }
                                    }))}
                                    placeholder="Prénom pour la livraison"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="shipping_last_name">Nom (livraison)</Label>
                                  <Input
                                    id="shipping_last_name"
                                    value={profileForm.preferred_shipping_address.last_name}
                                    onChange={(e) => setProfileForm(prev => ({
                                      ...prev,
                                      preferred_shipping_address: {
                                        ...prev.preferred_shipping_address,
                                        last_name: e.target.value
                                      }
                                    }))}
                                    placeholder="Nom pour la livraison"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="shipping_address">Adresse de livraison</Label>
                                <Input
                                  id="shipping_address"
                                  value={profileForm.preferred_shipping_address.address}
                                  onChange={(e) => setProfileForm(prev => ({
                                    ...prev,
                                    preferred_shipping_address: {
                                      ...prev.preferred_shipping_address,
                                      address: e.target.value
                                    }
                                  }))}
                                  placeholder="123 Rue de la Livraison"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="shipping_address_complement">Complément d'adresse (livraison)</Label>
                                <Input
                                  id="shipping_address_complement"
                                  value={profileForm.preferred_shipping_address.address_complement}
                                  onChange={(e) => setProfileForm(prev => ({
                                    ...prev,
                                    preferred_shipping_address: {
                                      ...prev.preferred_shipping_address,
                                      address_complement: e.target.value
                                    }
                                  }))}
                                  placeholder="Appartement, bâtiment, etc."
                                />
                              </div>
                              <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                  <Label htmlFor="shipping_postal_code">Code postal</Label>
                                  <Input
                                    id="shipping_postal_code"
                                    value={profileForm.preferred_shipping_address.postal_code}
                                    onChange={(e) => setProfileForm(prev => ({
                                      ...prev,
                                      preferred_shipping_address: {
                                        ...prev.preferred_shipping_address,
                                        postal_code: e.target.value
                                      }
                                    }))}
                                    placeholder="75001"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="shipping_city">Ville</Label>
                                  <Input
                                    id="shipping_city"
                                    value={profileForm.preferred_shipping_address.city}
                                    onChange={(e) => setProfileForm(prev => ({
                                      ...prev,
                                      preferred_shipping_address: {
                                        ...prev.preferred_shipping_address,
                                        city: e.target.value
                                      }
                                    }))}
                                    placeholder="Paris"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="shipping_country">Pays</Label>
                                  <Input
                                    id="shipping_country"
                                    value={profileForm.preferred_shipping_address.country}
                                    onChange={(e) => setProfileForm(prev => ({
                                      ...prev,
                                      preferred_shipping_address: {
                                        ...prev.preferred_shipping_address,
                                        country: e.target.value
                                      }
                                    }))}
                                    placeholder="France"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-lg mb-4">Préférences marketing</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="marketing_phone">Téléphone pour SMS marketing</Label>
                                <Input
                                  id="marketing_phone"
                                  value={profileForm.marketing_phone}
                                  onChange={(e) => setProfileForm(prev => ({ ...prev, marketing_phone: e.target.value }))}
                                  placeholder="0123456789"
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
                                <Label htmlFor="marketing_consent" className="text-sm">
                                  J'accepte de recevoir des SMS marketing
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
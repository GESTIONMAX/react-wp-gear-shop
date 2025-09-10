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
  LogOut
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { toast } from '@/hooks/use-toast';

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur MyTechGear !",
    });
    navigate('/');
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
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={user.user_metadata?.first_name || ''}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={user.user_metadata?.last_name || ''}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ''}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note :</strong> Pour modifier vos informations personnelles, 
                      veuillez nous contacter directement.
                    </p>
                  </div>
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
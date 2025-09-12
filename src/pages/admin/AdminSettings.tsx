import React, { useState } from 'react';
import { useSettingsByCategory, useUpdateSettingsCategory } from '@/hooks/useSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import {
  Store,
  CreditCard,
  Truck,
  Package,
  Bell,
  Shield,
  Palette,
  Settings,
  Save,
  Info
} from 'lucide-react';

// Schémas de validation pour chaque section
const shopSchema = z.object({
  shop_name: z.string().min(1, "Le nom de la boutique est requis"),
  shop_description: z.string().optional(),
  shop_email: z.string().email("Email invalide"),
  shop_phone: z.string().optional(),
  shop_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }),
});

const billingSchema = z.object({
  default_tax_rate: z.number().min(0).max(100),
  currency: z.object({
    value: z.string(),
    symbol: z.string(),
  }),
  invoice_prefix: z.string().min(1),
  order_prefix: z.string().min(1),
});

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const updateSettings = useUpdateSettingsCategory();

  const { data: shopSettings, isLoading: shopLoading } = useSettingsByCategory('shop');
  const { data: billingSettings, isLoading: billingLoading } = useSettingsByCategory('billing');
  const { data: shippingSettings, isLoading: shippingLoading } = useSettingsByCategory('shipping');
  const { data: inventorySettings, isLoading: inventoryLoading } = useSettingsByCategory('inventory');
  const { data: notificationSettings, isLoading: notificationsLoading } = useSettingsByCategory('notifications');
  const { data: securitySettings, isLoading: securityLoading } = useSettingsByCategory('security');
  const { data: displaySettings, isLoading: displayLoading } = useSettingsByCategory('display');
  const { data: paymentSettings, isLoading: paymentLoading } = useSettingsByCategory('payment');

  const shopForm = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      shop_name: shopSettings?.find(s => s.key === 'shop_name')?.value?.value || '',
      shop_description: shopSettings?.find(s => s.key === 'shop_description')?.value?.value || '',
      shop_email: shopSettings?.find(s => s.key === 'shop_email')?.value?.value || '',
      shop_phone: shopSettings?.find(s => s.key === 'shop_phone')?.value?.value || '',
      shop_address: shopSettings?.find(s => s.key === 'shop_address')?.value || {},
    },
  });

  // Mise à jour des valeurs par défaut quand les données sont chargées
  React.useEffect(() => {
    if (shopSettings) {
      shopForm.reset({
        shop_name: shopSettings?.find(s => s.key === 'shop_name')?.value?.value || '',
        shop_description: shopSettings?.find(s => s.key === 'shop_description')?.value?.value || '',
        shop_email: shopSettings?.find(s => s.key === 'shop_email')?.value?.value || '',
        shop_phone: shopSettings?.find(s => s.key === 'shop_phone')?.value?.value || '',
        shop_address: shopSettings?.find(s => s.key === 'shop_address')?.value || {},
      });
    }
  }, [shopSettings, shopForm]);

  const onSubmitShop = (data: any) => {
    updateSettings.mutate({
      category: 'shop',
      settings: {
        shop_name: { value: data.shop_name },
        shop_description: { value: data.shop_description },
        shop_email: { value: data.shop_email },
        shop_phone: { value: data.shop_phone },
        shop_address: data.shop_address,
      }
    });
  };

  const tabs = [
    {
      id: 'shop',
      label: 'Boutique',
      icon: Store,
      description: 'Informations générales de votre boutique'
    },
    {
      id: 'billing',
      label: 'Facturation',
      icon: CreditCard,
      description: 'TVA, devises et numérotation'
    },
    {
      id: 'shipping',
      label: 'Livraison',
      icon: Truck,
      description: 'Zones, tarifs et délais'
    },
    {
      id: 'inventory',
      label: 'Stock',
      icon: Package,
      description: 'Gestion des stocks et inventaire'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Emails et alertes automatiques'
    },
    {
      id: 'security',
      label: 'Sécurité',
      icon: Shield,
      description: 'Sessions et mots de passe'
    },
    {
      id: 'display',
      label: 'Affichage',
      icon: Palette,
      description: 'Thème et préférences visuelles'
    },
    {
      id: 'payment',
      label: 'Paiement',
      icon: CreditCard,
      description: 'Méthodes et processeurs de paiement'
    }
  ];

  if (shopLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Configurez votre boutique et ses fonctionnalités</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configuration
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Navigation des onglets */}
        <div className="border-b">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full h-auto p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex flex-col gap-1 p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        
        {/* Onglet Boutique */}
        <TabsContent value="shop" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informations de la boutique
              </CardTitle>
              <CardDescription>
                Configurez les informations de base de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...shopForm}>
                <form onSubmit={shopForm.handleSubmit(onSubmitShop)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={shopForm.control}
                      name="shop_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de la boutique</FormLabel>
                          <FormControl>
                            <Input placeholder="MyTechGear" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={shopForm.control}
                      name="shop_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de contact</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@mytechgear.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={shopForm.control}
                      name="shop_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 1 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={shopForm.control}
                    name="shop_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre boutique..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Cette description apparaîtra sur votre site et dans les moteurs de recherche
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Adresse physique</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={shopForm.control}
                        name="shop_address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rue</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Rue de la Tech" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shopForm.control}
                        name="shop_address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shopForm.control}
                        name="shop_address.postal_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input placeholder="75001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={shopForm.control}
                        name="shop_address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays</FormLabel>
                            <FormControl>
                              <Input placeholder="France" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateSettings.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateSettings.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autres onglets - versions simplifiées pour l'exemple */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Facturation et TVA
              </CardTitle>
              <CardDescription>
                Configurez les paramètres de facturation et de taxation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Taux de TVA par défaut (%)</Label>
                    <Input 
                      type="number" 
                      placeholder="20" 
                      defaultValue={billingSettings?.find(s => s.key === 'default_tax_rate')?.value?.value || 20}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Devise par défaut</Label>
                    <Select defaultValue="EUR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar ($)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Préfixe des factures</Label>
                    <Input 
                      placeholder="FACT-" 
                      defaultValue={billingSettings?.find(s => s.key === 'invoice_prefix')?.value?.value || 'FACT-'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Préfixe des commandes</Label>
                    <Input 
                      placeholder="CMD-" 
                      defaultValue={billingSettings?.find(s => s.key === 'order_prefix')?.value?.value || 'CMD-'}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Paramètres de livraison
              </CardTitle>
              <CardDescription>
                Configurez les zones, tarifs et délais de livraison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Seuil livraison gratuite (€)</Label>
                    <Input 
                      type="number" 
                      placeholder="50" 
                      defaultValue={(shippingSettings?.find(s => s.key === 'shipping_free_threshold')?.value?.value || 5000) / 100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frais de livraison standard (€)</Label>
                    <Input 
                      type="number" 
                      placeholder="5" 
                      defaultValue={(shippingSettings?.find(s => s.key === 'shipping_default_cost')?.value?.value || 500) / 100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Délai de traitement</Label>
                    <Input 
                      placeholder="24-48h" 
                      defaultValue={shippingSettings?.find(s => s.key === 'processing_time')?.value?.value || '24-48h'}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Message informatif pour les autres onglets */}
        {['inventory', 'notifications', 'security', 'display', 'payment'].map(tabId => (
          <TabsContent key={tabId} value={tabId} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {tabs.find(t => t.id === tabId)?.label}
                </CardTitle>
                <CardDescription>
                  {tabs.find(t => t.id === tabId)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Configuration de {tabs.find(t => t.id === tabId)?.label?.toLowerCase()} en cours de développement...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminSettings;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { CheckoutFormData, ShippingAddress } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, signIn, signUp, loading } = useAuth();
  const { mutate: createOrder, isPending } = useCreateOrder();

  // États pour l'authentification
  const [showAuth, setShowAuth] = useState(!user);
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      addressComplement: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      addressComplement: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
    },
    useSameAddress: true,
    paymentMethod: 'card',
    notes: '',
  });

  // Charger le profil utilisateur et pré-remplir le formulaire
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profile && !error) {
            // Pré-remplir avec les informations disponibles du profil
            setFormData(prev => ({
              ...prev,
              shippingAddress: {
                firstName: profile.first_name || user.user_metadata?.first_name || '',
                lastName: profile.last_name || user.user_metadata?.last_name || '',
                address: profile.address || '',
                addressComplement: profile.address_complement || '',
                city: profile.city || '',
                postalCode: profile.postal_code || '',
                country: profile.country || 'France',
                phone: profile.phone || '',
              },
              billingAddress: {
                firstName: profile.first_name || user.user_metadata?.first_name || '',
                lastName: profile.last_name || user.user_metadata?.last_name || '',
                address: profile.address || '',
                addressComplement: profile.address_complement || '',
                city: profile.city || '',
                postalCode: profile.postal_code || '',
                country: profile.country || 'France',
                phone: profile.phone || '',
              }
            }));
          } else {
            // Si pas de profil, utiliser les métadonnées utilisateur
            setFormData(prev => ({
              ...prev,
              shippingAddress: {
                ...prev.shippingAddress,
                firstName: user.user_metadata?.first_name || '',
                lastName: user.user_metadata?.last_name || '',
              },
              billingAddress: {
                ...prev.billingAddress,
                firstName: user.user_metadata?.first_name || '',
                lastName: user.user_metadata?.last_name || '',
              }
            }));
          }
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
        }
        setShowAuth(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleShippingAddressChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handleBillingAddressChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress!,
        [field]: value
      }
    }));
  };

  // Gestion de l'authentification
  const handleAuthChange = (field: string, value: string) => {
    setAuthForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await signIn(authForm.email, authForm.password);
      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message || "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        setShowAuth(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authForm.password !== authForm.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);

    try {
      const { error } = await signUp(authForm.email, authForm.password, authForm.firstName, authForm.lastName);
      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        });
        setShowAuth(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuth(true);
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer commande",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de passer commande",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const orderData = {
      user_id: user.id,
      total_amount: Math.round(totalPrice * 100), // Convertir en centimes
      shipping_address: formData.shippingAddress,
      billing_address: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress!,
      payment_method: formData.paymentMethod,
      notes: formData.notes || undefined,
      order_items: items.map(item => {
        const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.price;
        return {
          product_id: item.productId,
          product_variant_id: item.variantId,
          product_name: item.product.name,
          variant_name: item.variant?.name,
          quantity: item.quantity,
          unit_price: Math.round(price * 100), // Convertir en centimes
          total_price: Math.round(price * item.quantity * 100), // Convertir en centimes
        };
      }),
    };

    createOrder(orderData, {
      onSuccess: (order) => {
        clearCart();
        toast({
          title: "Commande confirmée !",
          description: `Votre commande ${order.order_number} a été enregistrée avec succès.`,
        });
        navigate(`/order-success/${order.id}`);
      },
      onError: (error) => {
        console.error('Erreur lors de la création de la commande:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Panier vide</h1>
          <p className="text-muted-foreground mb-6">Vous n'avez aucun article dans votre panier.</p>
          <Button onClick={() => navigate('/')}>
            Continuer mes achats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="font-merriweather text-3xl font-bold">Finaliser ma commande</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section d'authentification */}
              {showAuth && !user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Connexion ou Inscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="signin" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="signin">Se connecter</TabsTrigger>
                        <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                        <TabsTrigger value="guest">En tant qu'invité</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="signin" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="signin-email">Email</Label>
                            <Input
                              id="signin-email"
                              type="email"
                              value={authForm.email}
                              onChange={(e) => handleAuthChange('email', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="signin-password">Mot de passe</Label>
                            <Input
                              id="signin-password"
                              type="password"
                              value={authForm.password}
                              onChange={(e) => handleAuthChange('password', e.target.value)}
                              required
                            />
                          </div>
                          <Button 
                            type="button"
                            onClick={handleSignIn}
                            disabled={authLoading}
                            className="w-full"
                          >
                            {authLoading ? 'Connexion...' : 'Se connecter'}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="signup" className="space-y-4">
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="signup-firstName">Prénom</Label>
                              <Input
                                id="signup-firstName"
                                value={authForm.firstName}
                                onChange={(e) => handleAuthChange('firstName', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="signup-lastName">Nom</Label>
                              <Input
                                id="signup-lastName"
                                value={authForm.lastName}
                                onChange={(e) => handleAuthChange('lastName', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="signup-email">Email</Label>
                            <Input
                              id="signup-email"
                              type="email"
                              value={authForm.email}
                              onChange={(e) => handleAuthChange('email', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="signup-password">Mot de passe</Label>
                            <Input
                              id="signup-password"
                              type="password"
                              value={authForm.password}
                              onChange={(e) => handleAuthChange('password', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="signup-confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                              id="signup-confirmPassword"
                              type="password"
                              value={authForm.confirmPassword}
                              onChange={(e) => handleAuthChange('confirmPassword', e.target.value)}
                              required
                            />
                          </div>
                          <Button 
                            type="button"
                            onClick={handleSignUp}
                            disabled={authLoading}
                            className="w-full"
                          >
                            {authLoading ? 'Inscription...' : 'S\'inscrire'}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="guest" className="space-y-4">
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">
                            Vous pouvez passer commande en tant qu'invité, mais vous ne pourrez pas suivre votre commande.
                          </p>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => setShowAuth(false)}
                          >
                            Continuer en tant qu'invité
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Message utilisateur connecté */}
              {user && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm">Connecté en tant que <strong>{user.email}</strong></span>
                      </div>
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAuth(true)}
                      >
                        Changer de compte
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Adresse de livraison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.shippingAddress.firstName}
                        onChange={(e) => handleShippingAddressChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.shippingAddress.lastName}
                        onChange={(e) => handleShippingAddressChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.shippingAddress.address}
                      onChange={(e) => handleShippingAddressChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressComplement">Complément d'adresse</Label>
                    <Input
                      id="addressComplement"
                      value={formData.shippingAddress.addressComplement || ''}
                      onChange={(e) => handleShippingAddressChange('addressComplement', e.target.value)}
                      placeholder="Bâtiment, étage, appartement..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) => handleShippingAddressChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.shippingAddress.phone}
                      onChange={(e) => handleShippingAddressChange('phone', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Adresse de facturation */}
              <Card>
                <CardHeader>
                  <CardTitle>Adresse de facturation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useSameAddress"
                      checked={formData.useSameAddress}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, useSameAddress: checked as boolean }))
                      }
                    />
                    <Label htmlFor="useSameAddress">Utiliser la même adresse que la livraison</Label>
                  </div>

                  {!formData.useSameAddress && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingFirstName">Prénom *</Label>
                          <Input
                            id="billingFirstName"
                            value={formData.billingAddress?.firstName || ''}
                            onChange={(e) => handleBillingAddressChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingLastName">Nom *</Label>
                          <Input
                            id="billingLastName"
                            value={formData.billingAddress?.lastName || ''}
                            onChange={(e) => handleBillingAddressChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="billingAddress">Adresse *</Label>
                        <Input
                          id="billingAddress"
                          value={formData.billingAddress?.address || ''}
                          onChange={(e) => handleBillingAddressChange('address', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingAddressComplement">Complément d'adresse</Label>
                        <Input
                          id="billingAddressComplement"
                          value={formData.billingAddress?.addressComplement || ''}
                          onChange={(e) => handleBillingAddressChange('addressComplement', e.target.value)}
                          placeholder="Bâtiment, étage, appartement..."
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingCity">Ville *</Label>
                          <Input
                            id="billingCity"
                            value={formData.billingAddress?.city || ''}
                            onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingPostalCode">Code postal *</Label>
                          <Input
                            id="billingPostalCode"
                            value={formData.billingAddress?.postalCode || ''}
                            onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mode de paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as any }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Carte bancaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Virement bancaire</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes de commande (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Instructions de livraison, commentaires..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Récapitulatif */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => {
                    const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.price;
                    return (
                      <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              {Object.values(item.variant.attributes).join(', ')}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatPrice(price * item.quantity)}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span className="text-green-600">Gratuite</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Garanties */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Livraison gratuite</span>
                    </div>
                    <div className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2 text-orange-600" />
                      <span>Retour gratuit 30 jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bouton de commande */}
              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground shadow-glow"
                size="lg"
                disabled={isPending}
              >
                {isPending ? 'Traitement...' : 'Confirmer ma commande'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
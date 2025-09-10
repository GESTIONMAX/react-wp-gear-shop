import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { CheckoutFormData, ShippingAddress } from '@/types/order';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
    },
    useSameAddress: true,
    paymentMethod: 'card',
    notes: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer commande",
        variant: "destructive",
      });
      navigate('/auth');
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
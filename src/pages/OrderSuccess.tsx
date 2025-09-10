import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/hooks/useOrders';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId!);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100); // Convertir depuis les centimes
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
          <p className="text-muted-foreground mb-6">Cette commande n'existe pas ou n'est pas accessible.</p>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header de confirmation */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-merriweather text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-lg text-muted-foreground">
            Merci pour votre achat. Votre commande <span className="font-semibold">{order.order_number}</span> a été enregistrée avec succès.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Informations de commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Détails de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de commande</p>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de commande</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-semibold text-green-600">Confirmée</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode de paiement</p>
                  <p className="font-semibold">{order.payment_method === 'card' ? 'Carte bancaire' : order.payment_method}</p>
                </div>
              </div>

              {order.items && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Articles commandés</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product_name}</h4>
                            {item.variant_name && (
                              <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                            )}
                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(item.total_price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(order.total_amount)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Adresse de livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-semibold">
                  {order.shipping_address.firstName} {order.shipping_address.lastName}
                </p>
                <p>{order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.postalCode} {order.shipping_address.city}
                </p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.phone && (
                  <p>Tél: {order.shipping_address.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                <div>
                  <p className="font-medium">Confirmation par email</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un email de confirmation avec tous les détails de votre commande.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <p className="font-medium">Préparation de la commande</p>
                  <p className="text-sm text-muted-foreground">
                    Votre commande sera préparée et expédiée sous 24-48h.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-orange-600 mt-2"></div>
                <div>
                  <p className="font-medium">Suivi de livraison</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un numéro de suivi pour suivre votre colis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/')}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              Continuer mes achats
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="flex-1"
            >
              Imprimer la commande
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
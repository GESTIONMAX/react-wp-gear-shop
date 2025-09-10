import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

interface MiniCartProps {
  onClose: () => void;
}

export const MiniCart: React.FC<MiniCartProps> = ({ onClose }) => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="font-merriweather text-lg font-semibold mb-2">Panier vide</h3>
        <p className="text-muted-foreground mb-6">
          Votre panier est actuellement vide. Découvrez nos produits !
        </p>
        <Button onClick={onClose} className="gradient-primary text-primary-foreground">
          Continuer mes achats
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-merriweather text-lg font-semibold">
          Panier ({totalItems} {totalItems > 1 ? 'articles' : 'article'})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-destructive hover:text-destructive"
        >
          Vider
        </Button>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {items.map((item) => {
          const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.price;
          const originalPrice = item.variant?.price || item.product.price;
          const isOnSale = price < originalPrice;

          return (
            <Card key={`${item.productId}-${item.variantId}`} className="p-4">
              <div className="flex space-x-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {item.product.name}
                  </h4>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Object.values(item.variant.attributes).join(', ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {formatPrice(price)}
                      </span>
                      {isOnSale && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="space-y-2">
          <Button className="w-full gradient-primary text-primary-foreground">
            Passer commande
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Continuer mes achats
          </Button>
        </div>
      </div>
    </div>
  );
};
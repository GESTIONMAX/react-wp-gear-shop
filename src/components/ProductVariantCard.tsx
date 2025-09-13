import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { WishlistButton } from '@/components/WishlistButton';

interface ProductVariantCardProps {
  product: Product;
  variant: ProductVariant;
  className?: string;
}

export const ProductVariantCard: React.FC<ProductVariantCardProps> = ({ 
  product, 
  variant, 
  className 
}) => {
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, variant.id);
  };

  const isOnSale = variant.salePrice && variant.salePrice < variant.price;
  const displayPrice = variant.salePrice || variant.price;

  // Create a display name combining product name and variant name
  const displayName = `${product.name} - ${variant.name}`;

  return (
    <Link to={`/product/${product.slug}?variant=${variant.id}`}>
      <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${className}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={variant.images?.[0] || product.images[0]}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Sale badge */}
          {isOnSale && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{Math.round(((variant.price - displayPrice) / variant.price) * 100)}%
            </Badge>
          )}
          
          {/* Stock status */}
          {!variant.inStock && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Rupture
            </Badge>
          )}
          
          {/* Wishlist button */}
          <WishlistButton
            productId={product.id}
            variantId={variant.id}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              variant.inStock ? '' : 'right-20'
            } bg-background/80 hover:bg-background`}
            size="sm"
          />
          
          {/* Quick add button */}
          {variant.inStock && (
            <Button
              className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gradient-primary text-primary-foreground"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier
            </Button>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            
            <h3 className="font-medium line-clamp-2 text-sm">
              {displayName}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.shortDescription}
            </p>
            
            {/* Variant attributes */}
            {variant.attributes && Object.keys(variant.attributes).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(variant.attributes).slice(0, 2).map(([key, value], index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Rating (mock) */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                />
              ))}
              <span className="text-xs text-muted-foreground">(124)</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="font-bold text-lg">
                {formatPrice(displayPrice)}
              </span>
              {isOnSale && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(variant.price)}
                </span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
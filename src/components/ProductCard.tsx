import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const isOnSale = product.salePrice && product.salePrice < product.price;
  const displayPrice = product.salePrice || product.price;

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${className}`}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Sale badge */}
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{Math.round(((product.price - displayPrice) / product.price) * 100)}%
          </Badge>
        )}
        
        {/* Stock status */}
        {!product.inStock && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Rupture
          </Badge>
        )}
        
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            product.inStock ? '' : 'right-20'
          } ${isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
          onClick={handleToggleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
        
        {/* Quick add button */}
        {product.inStock && (
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
            {product.name}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.shortDescription}
          </p>
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature.split(' ').slice(0, 2).join(' ')}
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
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {product.variants && product.variants.length > 1 && (
            <Badge variant="outline" className="text-xs">
              {product.variants.length} variants
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWishlistWithProducts, useToggleWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductVariant } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Wishlist = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: wishlistItems = [], isLoading } = useWishlistWithProducts();
  const { addItem } = useCart();
  const toggleWishlist = useToggleWishlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleAddToCart = (product: Product, variantId?: string) => {
    addItem(product, 1, variantId);
  };

  const handleRemoveFromWishlist = (productId: string, variantId?: string) => {
    toggleWishlist.mutate({
      productId,
      variantId,
      isInWishlist: true,
    } as { productId: string; variantId?: string; isInWishlist: boolean });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SEO
          title={`${t('wishlist.title')} | MyTechGear`}
          description={t('wishlist.metaDescription')}
          url="/wishlist"
          type="website"
          noIndex={true}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">
              {t('auth.loginRequired') || 'Connexion requise'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('wishlist.loginMessage') || 'Vous devez être connecté pour voir vos favoris'}
            </p>
            <Button asChild>
              <Link to="/auth">
                {t('navigation.login') || 'Se connecter'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t('common.loading') || 'Chargement...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${t('wishlist.title') || 'Mes Favoris'} | MyTechGear`}
        description={t('wishlist.metaDescription') || 'Découvrez vos produits favoris et ajoutez-les à votre panier'}
        url="/wishlist"
        type="website"
        noIndex={true}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back') || 'Retour'}
            </Link>
          </Button>
          <div>
            <h1 className="font-merriweather text-3xl font-bold flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              {t('wishlist.title') || 'Mes Favoris'}
            </h1>
            {wishlistItems.length > 0 && (
              <p className="text-muted-foreground mt-2">
                {t('wishlist.itemCount', { count: wishlistItems.length }) || 
                  `${wishlistItems.length} produit${wishlistItems.length > 1 ? 's' : ''} dans vos favoris`}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">
              {t('wishlist.empty') || 'Votre liste de favoris est vide'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t('wishlist.emptyDescription') || 
                'Découvrez nos produits et ajoutez-les à vos favoris pour les retrouver facilement.'}
            </p>
            <Button asChild>
              <Link to="/">
                {t('wishlist.continueShopping') || 'Découvrir nos produits'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(({ wishlistItem, product }: { wishlistItem: { id: string; product_variant_id?: string }; product: Product }) => {
              const variant = wishlistItem.product_variant_id 
                ? product.variants?.find((v: ProductVariant) => v.id === wishlistItem.product_variant_id)
                : null;
              
              const currentPrice = variant?.salePrice || variant?.price || product.salePrice || product.price;
              const originalPrice = variant?.price || product.price;
              const isOnSale = variant ? 
                (variant.salePrice && variant.salePrice < variant.price) :
                (product.salePrice && product.salePrice < product.price);

              return (
                <Card key={wishlistItem.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {isOnSale && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                        -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                      </Badge>
                    )}
                    
                    {!product.inStock && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {t('common.outOfStock') || 'Rupture'}
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background text-red-500"
                      onClick={() => handleRemoveFromWishlist(product.id, wishlistItem.product_variant_id)}
                      title={t('wishlist.remove') || 'Retirer des favoris'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {product.inStock && (
                      <Button
                        className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAddToCart(product, wishlistItem.product_variant_id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t('common.addToCart') || 'Ajouter au panier'}
                      </Button>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      
                      <Link 
                        to={`/product/${product.slug}${variant ? `?variant=${variant.id}` : ''}`}
                        className="block"
                      >
                        <h3 className="font-medium line-clamp-2 text-sm hover:text-primary transition-colors">
                          {product.name}
                          {variant && ` - ${variant.name}`}
                        </h3>
                      </Link>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.shortDescription}
                      </p>
                      
                      {variant?.attributes && Object.keys(variant.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.attributes).slice(0, 2).map(([key, value], index) => (
                             <Badge key={index} variant="outline" className="text-xs">
                               {key}: {String(value)}
                             </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg">
                          {formatPrice(currentPrice)}
                        </span>
                        {isOnSale && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ajouté le {new Date(wishlistItem.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
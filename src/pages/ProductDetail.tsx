import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Zap, Shield, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import { useProductBySlug } from '@/hooks/useProducts';
import { useProductImages } from '@/hooks/useProductImages';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useProductBySlug(slug || '');

  // Get product images from database
  const { images: productImages } = useProductImages({
    productId: product?.id
  });

  // Get current variant and its images
  const currentVariant = selectedVariant
    ? product?.variants?.find(v => v.id === selectedVariant)
    : null;

  // Prefer database images, fallback to product.images array
  const fallbackImages = currentVariant?.images || product?.images || [];
  const databaseImages = productImages.map(img => ({
    url: img.image_url,
    alt: img.alt_text,
    type: img.type
  }));

  const currentImages = databaseImages.length > 0 ? databaseImages : fallbackImages.map(url => ({ url }));

  // Reset image index when variant changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedVariant]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/404" replace />;
  }

  const currentPrice = selectedVariant 
    ? product.variants?.find(v => v.id === selectedVariant)?.salePrice || product.variants?.find(v => v.id === selectedVariant)?.price || product.price
    : product.salePrice || product.price;

  const originalPrice = selectedVariant
    ? product.variants?.find(v => v.id === selectedVariant)?.price
    : product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Accueil</a>
            <ChevronRight className="h-4 w-4" />
            <a href={`#${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">{product.category}</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Image Gallery with Carousel */}
          <div className="space-y-4">
            <ProductImageCarousel
              images={currentImages}
              productName={currentVariant ? `${product.name} - ${currentVariant.name}` : product.name}
              autoPlay={true}
              autoPlayInterval={5000}
            />

            {/* Sale Badge overlay */}
            {product.salePrice && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-accent text-accent-foreground">
                  -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>
                  <h1 className="font-merriweather text-3xl lg:text-4xl font-bold leading-tight">
                    {product.name}
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8) · 245 avis</span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-primary">
                {currentPrice}€
              </span>
              {product.salePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {originalPrice}€
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Variantes disponibles</h3>
                <div className="grid gap-2">
                  {product.variants.map((variant) => (
                  <Card
                    key={variant.id}
                    className={`cursor-pointer transition-all ${
                      selectedVariant === variant.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => variant.inStock && setSelectedVariant(variant.id)}
                  >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{variant.name}</p>
                            <div className="flex space-x-2 text-sm text-muted-foreground">
                              {Object.entries(variant.attributes).map(([key, value]) => (
                                <span key={key}>{value}</span>
                              ))}
                            </div>
                          </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {variant.salePrice || variant.price}€
                              </p>
                              {variant.salePrice && (
                                <p className="text-sm text-muted-foreground line-through">
                                  {variant.price}€
                                </p>
                              )}
                              {!variant.inStock && (
                                <Badge variant="destructive" className="text-xs mt-1">
                                  Rupture
                                </Badge>
                              )}
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantité</label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full gradient-primary text-primary-foreground shadow-glow transition-bounce hover:scale-105"
                size="lg"
                disabled={!product.inStock || (selectedVariant && !currentVariant?.inStock)}
              >
                {(!product.inStock || (selectedVariant && !currentVariant?.inStock)) 
                  ? 'Rupture de stock' 
                  : 'Ajouter au panier'}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Acheter maintenant
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="h-4 w-4 text-accent" />
                <span>Livraison 24h</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-success" />
                <span>Garantie 2 ans</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="h-4 w-4 text-warning" />
                <span>Retour gratuit</span>
              </div>
            </div>

            {/* Stock Info */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`} />
              <span>
                {product.inStock 
                  ? `En stock (${product.stockQuantity} disponibles)`
                  : 'Rupture de stock'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Caractéristiques</TabsTrigger>
              <TabsTrigger value="specs">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis clients</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Caractéristiques principales</h3>
                  {product.features && product.features.length > 0 ? (
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Aucune caractéristique disponible.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Spécifications techniques</h3>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-muted">
                          <span className="font-medium">{key}</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune spécification disponible.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Avis clients</h3>
                  <div className="space-y-6">
                    {/* Sample Reviews */}
                    {[
                      { name: "Marie L.", rating: 5, comment: "Lunettes exceptionnelles ! La qualité audio est impressionnante pour du cyclisme." },
                      { name: "Thomas R.", rating: 5, comment: "Design premium et fonctionnalités innovantes. Je recommande vivement." },
                      { name: "Sophie M.", rating: 4, comment: "Très satisfaite de mon achat. L'autonomie pourrait être un peu meilleure." }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-muted pb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
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

export default ProductDetail;
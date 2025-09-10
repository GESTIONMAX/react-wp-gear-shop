import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hero from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { useAssignAdminRole, useIsAdmin } from '@/hooks/useAdmin';
import { TrendingUp, Sparkles, Clock, User, Loader2, Shield } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { data: products = [], isLoading, error } = useProducts();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const assignAdminRole = useAssignAdminRole();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Erreur lors du chargement des produits</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  // Filter products by category if specified
  const filteredProducts = categoryFilter 
    ? products.filter(product => 
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    : products;

  const featuredProducts = filteredProducts.slice(0, 4);
  const onSaleProducts = filteredProducts.filter(p => p.salePrice && p.salePrice < p.price);

  return (
    <div className="min-h-screen bg-background">
      {/* Auth Banner for non-authenticated users */}
      {!user && !categoryFilter && (
        <div className="bg-primary text-primary-foreground py-3">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-4">
              <User className="h-5 w-5" />
              <span className="text-sm">
                Créez votre compte pour une expérience personnalisée
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                asChild
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link to="/auth">
                  Se connecter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Banner for authenticated users without admin role */}
      {user && !isAdminLoading && !isAdmin && !categoryFilter && (
        <div className="bg-accent text-accent-foreground py-3 border-b">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-4">
              <Shield className="h-5 w-5" />
              <span className="text-sm">
                Obtenez l'accès administrateur pour gérer le site
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => assignAdminRole.mutate()}
                disabled={assignAdminRole.isPending}
                className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
              >
                {assignAdminRole.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Attribution...
                  </>
                ) : (
                  'Devenir Admin'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section - Only show if no category filter */}
      {!categoryFilter && <Hero />}
      
      {/* Category Header - Show when filtering */}
      {categoryFilter && (
        <div className="py-12 bg-gradient-subtle">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
              {categoryFilter.toUpperCase()}
            </Badge>
            <h1 className="font-merriweather text-4xl font-bold mb-4">
              Collection {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection exclusive de lunettes connectées {categoryFilter}
            </p>
          </div>
        </div>
      )}
      
      {/* Paiement en plusieurs fois - CTA Section - Only show on home */}
      {!categoryFilter && (
        <section className="py-12 gradient-accent">
          <div className="container mx-auto px-4">
            <div className="text-center text-primary-foreground">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="bg-primary-foreground/20 rounded-full p-3 mr-4">
                  <svg className="h-8 w-8 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold font-merriweather">
                    Paiement en 3x ou 4x sans frais
                  </h3>
                  <p className="text-primary-foreground/90">
                    Financez vos lunettes connectées dès 67€/mois avec Klarna
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  <span className="text-sm">Sans engagement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  <span className="text-sm">Réponse instantanée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  <span className="text-sm">100% sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-accent mr-2" />
              <h2 className="font-merriweather text-3xl font-bold">
                Produits vedettes
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de produits technologiques les plus populaires, 
              choisis pour leur innovation et leur qualité exceptionnelle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-destructive mr-2" />
              <h2 className="font-merriweather text-3xl font-bold">
                Offres spéciales
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Profitez de nos promotions exceptionnelles sur une sélection 
              de produits tech premium. Offres limitées dans le temps !
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {onSaleProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-merriweather text-3xl font-bold mb-4">
              {categoryFilter 
                ? `Produits ${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}`
                : 'Tous nos produits'
              }
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {categoryFilter 
                ? `Explorez notre collection ${categoryFilter} avec des technologies de pointe.`
                : 'Explorez notre catalogue complet de produits technologiques. Utilisez les filtres pour trouver exactement ce que vous cherchez.'
              }
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Only show on home page */}
            {!categoryFilter && (
              <div className="lg:col-span-1">
                <ProductFilters />
              </div>
            )}
            
            {/* Products Grid */}
            <div className={categoryFilter ? "lg:col-span-4" : "lg:col-span-3"}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                  {categoryFilter && (
                    <>
                      {' '}dans la catégorie{' '}
                      <Badge variant="secondary">{categoryFilter.toUpperCase()}</Badge>
                    </>
                  )}
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Grille
                  </Button>
                  <Button variant="ghost" size="sm">
                    Liste
                  </Button>
                </div>
              </div>
              
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                categoryFilter ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Load more - only show if we have many products */}
              {filteredProducts.length === 0 && (
                <div className="text-center mt-12">
                  <p className="text-muted-foreground mb-4">
                    Aucun produit trouvé dans cette catégorie.
                  </p>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/">Voir tous les produits</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-primary-foreground">
            <h2 className="font-merriweather text-3xl font-bold mb-4">
              Restez connecté à l'innovation
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir les dernières actualités tech, 
              nos offres exclusives et les nouveautés en avant-première.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-lg border-0 text-foreground"
              />
              <Button className="bg-background text-primary hover:bg-background/90">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Clients satisfaits</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">Produits en stock</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <p className="text-muted-foreground">Livraison express</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <p className="text-muted-foreground">Taux de satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

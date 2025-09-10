import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Sparkles, Clock, User, Loader2 } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { data: products = [], isLoading, error } = useProducts();
  
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

  const featuredProducts = products.slice(0, 4);
  const onSaleProducts = products.filter(p => p.salePrice && p.salePrice < p.price);

  return (
    <div className="min-h-screen bg-background">
      {/* Auth Banner for non-authenticated users */}
      {!user && (
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
      
      {/* Hero Section */}
      <Hero />
      
      {/* Paiement en plusieurs fois - CTA Section */}
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
              Tous nos produits
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explorez notre catalogue complet de produits technologiques. 
              Utilisez les filtres pour trouver exactement ce que vous cherchez.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters />
            </div>
            
            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {products.length} produits trouvés
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Load more */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Voir plus de produits
                </Button>
              </div>
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

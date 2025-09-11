import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Zap, Shield, Headphones } from 'lucide-react';
import CategoryHero from '@/components/CategoryHero';
import { ProductVariantCard } from '@/components/ProductVariantCard';
import { CustomBreadcrumb } from '@/components/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { expandProductVariants, filterVariantsByCategory } from '@/utils/productVariants';
import { BlogCarousel } from '@/components/BlogCarousel';
import { getBlogPostsByCategory } from '@/data/blog';

const Sport = () => {
  const { data: products = [], isLoading } = useProducts();
  
  // Expand products into variants and filter by sport category
  const allVariants = expandProductVariants(products);
  const sportVariants = filterVariantsByCategory(allVariants, 'sport');
  
  // Get blog posts for sport category
  const sportBlogPosts = getBlogPostsByCategory('sport');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des lunettes sport...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: "Protection IP67",
      description: "Résistance à l'eau et à la poussière pour tous vos sports"
    },
    {
      icon: Headphones,
      title: "Audio intégré",
      description: "Son immersif sans casque pour rester connecté"
    },
    {
      icon: Zap,
      title: "Batterie longue durée",
      description: "Jusqu'à 8h d'autonomie pour vos sessions intensives"
    },
    {
      icon: Trophy,
      title: "Performance tracking",
      description: "Suivi en temps réel de vos performances sportives"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Lunettes Connectées Sport | MyTechGear - Performance & Style</title>
        <meta 
          name="description" 
          content="Découvrez notre collection de lunettes connectées sport. Audio intégré, résistance IP67, tracking performance. Parfait pour running, cyclisme, sports outdoor."
        />
        <meta name="keywords" content="lunettes connectées sport, audio sport, lunettes running, wearable sport, tech sport" />
        <link rel="canonical" href="/sport" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <CustomBreadcrumb />
        
        {/* Hero Section */}
        <CategoryHero category="sport" />

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                Conçues pour la Performance
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nos lunettes sport combinent technologie avancée et design ergonomique 
                pour accompagner tous vos défis sportifs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                Collection Sport
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Badge variant="secondary">{sportVariants.length} modèles disponibles</Badge>
                <Badge variant="outline">Prix 249€ - 329€</Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                De l'entrée de gamme au haut de gamme, trouvez les lunettes parfaites 
                pour votre pratique sportive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sportVariants.map(({ product, variant, key }) => (
                <ProductVariantCard 
                  key={key} 
                  product={product} 
                  variant={variant} 
                />
              ))}
            </div>

            {sportVariants.length === 0 && (
              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Aucun produit sport disponible pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Blog Articles Section */}
        <BlogCarousel 
          posts={sportBlogPosts}
          title="Actualités Sport & Performance"
          subtitle="Découvrez les derniers conseils, tests et innovations pour optimiser vos performances sportives avec les lunettes connectées."
        />

        {/* CTA Section */}
        <section className="py-16 gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto text-primary-foreground">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                Prêt à révolutionner votre sport ?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Essayez nos lunettes connectées 30 jours, satisfait ou remboursé. 
                Livraison gratuite et service client dédié.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  ✓ Garantie 2 ans
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  ✓ Livraison 24h
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  ✓ Support technique
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Sport;
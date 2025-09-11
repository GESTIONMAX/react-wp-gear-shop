import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Crown, Gem, Zap, Star } from 'lucide-react';
import CategoryHero from '@/components/CategoryHero';
import { ProductVariantCard } from '@/components/ProductVariantCard';
import { CustomBreadcrumb } from '@/components/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { expandProductVariants, filterVariantsByCategory } from '@/utils/productVariants';

const Prismatic = () => {
  const { data: products = [], isLoading } = useProducts();
  
  // Expand products into variants and filter by prismatic category
  const allVariants = expandProductVariants(products);
  const prismaticVariants = filterVariantsByCategory(allVariants, 'prismatic');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des lunettes prismatic...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Crown,
      title: "Luxe Absolu",
      description: "Matériaux précieux et finitions artisanales d'exception"
    },
    {
      icon: Gem,
      title: "Verres Prismatiques",
      description: "Technologie prismatique exclusive pour une expérience visuelle unique"
    },
    {
      icon: Zap,
      title: "IA Avancée",
      description: "Intelligence artificielle de pointe pour une interactivité intuitive"
    },
    {
      icon: Star,
      title: "Édition Limitée",
      description: "Pièces uniques numérotées, symboles d'exclusivité"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Lunettes Connectées Prismatic | MyTechGear - Luxe & Exclusivité</title>
        <meta 
          name="description" 
          content="Collection Prismatic premium : lunettes connectées haut de gamme avec verres prismatiques, IA avancée, matériaux luxueux. Édition limitée exclusive."
        />
        <meta name="keywords" content="lunettes connectées premium, verres prismatiques, luxe tech, édition limitée, smart glasses haut de gamme" />
        <link rel="canonical" href="/prismatic" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <CustomBreadcrumb />
        
        {/* Hero Section */}
        <CategoryHero category="prismatic" />

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                L'Excellence Prismatique
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Notre collection Prismatic repousse les limites de l'innovation avec 
                des technologies exclusives et un savoir-faire d'exception.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/20">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
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
                Collection Prismatic
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Badge variant="secondary">{prismaticVariants.length} modèles exclusifs</Badge>
                <Badge variant="outline" className="border-primary text-primary">Prix 449€ - 699€</Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des créations d'exception alliant luxe, innovation et exclusivité. 
                Chaque paire est une œuvre d'art technologique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {prismaticVariants.map(({ product, variant, key }) => (
                <ProductVariantCard 
                  key={key} 
                  product={product} 
                  variant={variant} 
                />
              ))}
            </div>

            {prismaticVariants.length === 0 && (
              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Collection Prismatic en cours de préparation...
                </p>
                <Badge variant="outline">Bientôt disponible</Badge>
              </div>
            )}
          </div>
        </section>

        {/* Exclusivity Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                L'Art de l'Exclusivité
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="font-semibold mb-2">Matériaux Précieux</h3>
                <p className="text-sm text-muted-foreground">
                  Titane aérospatial, verres saphir, finitions or et platine
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="font-semibold mb-2">Artisanat d'Exception</h3>
                <p className="text-sm text-muted-foreground">
                  Façonnage à la main par nos maîtres artisans, chaque détail compte
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-semibold mb-2">Série Limitée</h3>
                <p className="text-sm text-muted-foreground">
                  Production limitée à 999 exemplaires numérotés dans le monde
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-16 gradient-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-primary-foreground">
              <h2 className="font-merriweather text-3xl font-bold mb-6">
                Technologie Prismatique Révolutionnaire
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Nos verres prismatiques utilisent une technologie de décomposition 
                lumineuse brevetée, créant des effets visuels spectaculaires tout en 
                préservant une clarté optique parfaite.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-primary-foreground/10 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Innovation Optique</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Décomposition spectrale contrôlée pour des effets arc-en-ciel 
                    personnalisables selon l'ambiance désirée.
                  </p>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">IA Contextuelle</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Adaptation automatique des effets prismatiques selon l'environnement, 
                    l'heure et l'humeur de l'utilisateur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Prismatic;
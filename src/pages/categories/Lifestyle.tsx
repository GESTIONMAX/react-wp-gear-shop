import React from 'react';
import SEO from '@/components/SEO';
import { Sparkles, Users, Palette, Camera } from 'lucide-react';
import CategoryHero from '@/components/CategoryHero';
import { ProductVariantCard } from '@/components/ProductVariantCard';
import { CustomBreadcrumb } from '@/components/Breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { expandProductVariants, filterVariantsByCategory } from '@/utils/productVariants';
import { BlogCarousel } from '@/components/BlogCarousel';
import { getBlogPostsByCategory } from '@/data/blog';
import { FAQSection } from '@/components/FAQSection';
import { getFAQByCategory } from '@/data/faq';

const Lifestyle = () => {
  const { data: products = [], isLoading, error } = useProducts();
  
  // Debug logs
  console.log('Lifestyle page - Products loaded:', products.length);
  console.log('Lifestyle page - Loading state:', isLoading);
  console.log('Lifestyle page - Error:', error);
  
  // Fallback products for lifestyle category
  const fallbackLifestyleProducts = [
    {
      id: 'lifestyle-1',
      name: 'Urban Connect',
      slug: 'urban-connect',
      description: 'Lunettes lifestyle élégantes avec notifications discrètes',
      shortDescription: 'Style urbain connecté',
      price: 399,
      salePrice: 349,
      images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop&crop=center'],
      category: 'LIFESTYLE',
      tags: ['Élégant', 'Notifications', 'Urbain'],
      inStock: true,
      stockQuantity: 8,
      variants: [{
        id: 'lifestyle-1-v1',
        name: 'Noir Mat',
        price: 399,
        salePrice: 349,
        inStock: true,
        attributes: { color: 'Noir Mat', style: 'Minimaliste' }
      }]
    },
    {
      id: 'lifestyle-2',
      name: 'Classic Premium',
      slug: 'classic-premium',
      description: 'Design intemporel avec technologie moderne intégrée',
      shortDescription: 'Élégance moderne',
      price: 449,
      images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&crop=center'],
      category: 'LIFESTYLE',
      tags: ['Premium', 'Intemporel', 'Discret'],
      inStock: true,
      stockQuantity: 12,
      variants: [{
        id: 'lifestyle-2-v1',
        name: 'Écaille/Or',
        price: 449,
        inStock: true,
        attributes: { color: 'Écaille/Or', finition: 'Premium' }
      }]
    }
  ];
  
  // Use fallback if no products loaded
  const productsToUse = products.length > 0 ? products : fallbackLifestyleProducts;
  
  // Expand products into variants and filter by lifestyle category
  const allVariants = expandProductVariants(productsToUse);
  const lifestyleVariants = filterVariantsByCategory(allVariants, 'lifestyle');
  
  console.log('Lifestyle variants found:', lifestyleVariants.length);
  
  // Get blog posts for lifestyle category
  const lifestyleBlogPosts = getBlogPostsByCategory('lifestyle');
  
  // Get FAQ for lifestyle category
  const lifestyleFAQ = getFAQByCategory('lifestyle');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des lunettes lifestyle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading products:', error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Erreur de chargement des produits</p>
          <p className="text-sm text-muted-foreground">Affichage des produits de démonstration</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Palette,
      title: "Design Premium",
      description: "Matériaux nobles et finitions haut de gamme pour un style unique"
    },
    {
      icon: Camera,
      title: "Photo & Vidéo",
      description: "Capturez vos moments avec une qualité professionnelle"
    },
    {
      icon: Users,
      title: "Social Connect",
      description: "Partagez instantanément sur vos réseaux sociaux préférés"
    },
    {
      icon: Sparkles,
      title: "Style Adaptatif",
      description: "S'adapte automatiquement à votre environnement et style"
    }
  ];

  return (
    <>
      <SEO
        title="Lunettes Connectées Lifestyle | MyTechGear - Élégance & Innovation"
        description="Collection lifestyle de lunettes connectées premium. Design élégant, photo/vidéo HD, social connect. Parfait pour le quotidien urbain moderne."
        keywords="lunettes connectées lifestyle, lunettes élégantes, wearable fashion, tech lifestyle, smart glasses"
        url="/lifestyle"
        type="website"
        image="/categories/lifestyle-hero.jpg"
        category="Lifestyle"
      />

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <CustomBreadcrumb />
        
        {/* Hero Section */}
        <CategoryHero category="lifestyle" />

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                L'Élégance Connectée
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nos lunettes lifestyle allient sophistication et technologie pour 
                accompagner votre quotidien avec style et intelligence.
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
                Collection Lifestyle
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Badge variant="secondary">{lifestyleVariants.length} modèles disponibles</Badge>
                <Badge variant="outline">Prix 349€ - 599€</Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Des modèles raffinés qui s'intègrent parfaitement à votre style de vie 
                urbain et moderne.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lifestyleVariants.map(({ product, variant, key }) => (
                <ProductVariantCard 
                  key={key} 
                  product={product} 
                  variant={variant} 
                />
              ))}
            </div>

            {lifestyleVariants.length === 0 && (
              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Aucun produit lifestyle disponible pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Lifestyle Benefits Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                Pourquoi Choisir Lifestyle ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">👔</div>
                <h3 className="font-semibold mb-2">Professionnel</h3>
                <p className="text-sm text-muted-foreground">
                  Parfait pour les réunions et présentations avec discrétion garantie
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌃</div>
                <h3 className="font-semibold mb-2">Urbain</h3>
                <p className="text-sm text-muted-foreground">
                  Navigation GPS, transports, informations locales en temps réel
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="font-semibold mb-2">Créatif</h3>
                <p className="text-sm text-muted-foreground">
                  Capturez et partagez vos moments créatifs instantanément
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Articles Section */}
        <BlogCarousel 
          posts={lifestyleBlogPosts}
          title="Lifestyle & Tech Connectée"
          subtitle="Restez informé des dernières tendances en matière de lunettes connectées et découvrez comment intégrer cette technologie dans votre quotidien."
        />

        {/* FAQ Section */}
        {lifestyleFAQ && <FAQSection faq={lifestyleFAQ} />}

        {/* CTA Section */}
        <section className="py-16 gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto text-primary-foreground">
              <h2 className="font-merriweather text-3xl font-bold mb-4">
                Redéfinissez votre style
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Découvrez comment nos lunettes lifestyle transforment votre quotidien 
                avec élégance et innovation technologique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  ✓ Design premium
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  ✓ Discrétion totale
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  ✓ Connectivité avancée
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Lifestyle;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Clock, Shield } from 'lucide-react';

interface CategoryHeroProps {
  category: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
  const getCategoryData = (cat: string) => {
    const categoryLower = cat.toLowerCase();
    
    switch (categoryLower) {
      case 'sport':
        return {
          title: 'Collection Sport',
          subtitle: 'Performance & Cyclisme',
          description: 'Lunettes connectées conçues pour les sportifs exigeants. Résistance, précision des données et confort optimal pour repousser vos limites.',
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop&crop=center',
          features: ['GPS intégré', 'Résistant à l\'eau', 'Capteurs de performance'],
          gradient: 'from-blue-600 to-cyan-500'
        };
      case 'lifestyle':
        return {
          title: 'Collection Lifestyle',
          subtitle: 'Élégance Connectée',
          description: 'L\'alliance parfaite entre style et technologie. Des lunettes connectées qui s\'intègrent naturellement à votre quotidien urbain.',
          image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop&crop=center',
          features: ['Design élégant', 'Notifications discrètes', 'Autonomie 12h'],
          gradient: 'from-purple-600 to-pink-500'
        };
      case 'prismatic':
        return {
          title: 'Collection Prismatic',
          subtitle: 'Couleurs Réglables',
          description: 'Innovation révolutionnaire : des verres qui s\'adaptent à votre environnement et votre style. Couleurs et opacité entièrement personnalisables.',
          image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&h=600&fit=crop&crop=center',
          features: ['Verres adaptatifs', 'Contrôle tactile', 'Mode nuit automatique'],
          gradient: 'from-emerald-600 to-teal-500'
        };
      default:
        return {
          title: `Collection ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          subtitle: 'Innovation & Style',
          description: 'Découvrez notre collection exclusive de lunettes connectées alliant technologie de pointe et design contemporain.',
          image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=600&fit=crop&crop=center',
          features: ['Technologie avancée', 'Design premium', 'Garantie étendue'],
          gradient: 'from-gray-600 to-gray-400'
        };
    }
  };

  const data = getCategoryData(category);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-30`} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            {/* Category Badge */}
            <Badge 
              variant="outline" 
              className="mb-6 text-white border-white/30 bg-white/10 backdrop-blur-sm text-base px-4 py-2"
            >
              {category.toUpperCase()}
            </Badge>

            {/* Title */}
            <h1 className="font-merriweather text-4xl lg:text-6xl font-bold mb-4 leading-tight">
              {data.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-200 mb-6 font-light">
              {data.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
              {data.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              {data.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 shadow-lg font-semibold"
              >
                Découvrir la collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                Voir les specs techniques
              </Button>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                <span>Livraison 24-48h</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="h-4 w-4" />
                <span>Garantie 3 ans</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Star className="h-4 w-4" />
                <span>4.8/5 étoiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
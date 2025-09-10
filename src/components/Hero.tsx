import React from 'react';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-merriweather text-4xl lg:text-6xl font-bold leading-tight">
                L'innovation tech
                <span className="gradient-primary bg-clip-text text-transparent"> à portée de main</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Découvrez notre sélection de produits technologiques dernière génération. 
                Smartphones, ordinateurs, audio et gaming premium.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gradient-primary text-primary-foreground shadow-glow transition-bounce hover:scale-105"
              >
                Découvrir nos produits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="transition-smooth hover:bg-muted"
              >
                Voir les promotions
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Livraison rapide</p>
                  <p className="text-xs text-muted-foreground">24-48h chrono</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Garantie étendue</p>
                  <p className="text-xs text-muted-foreground">Jusqu'à 3 ans</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Retour gratuit</p>
                  <p className="text-xs text-muted-foreground">30 jours</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="transition-smooth hover:shadow-elegant hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop&crop=center"
                    alt="iPhone"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-sm">Smartphones</h3>
                  <p className="text-xs text-muted-foreground">Dernière génération</p>
                </CardContent>
              </Card>
              
              <Card className="transition-smooth hover:shadow-elegant hover:-translate-y-2 mt-8">
                <CardContent className="p-6 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center"
                    alt="MacBook"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-sm">Ordinateurs</h3>
                  <p className="text-xs text-muted-foreground">Performance ultime</p>
                </CardContent>
              </Card>
              
              <Card className="transition-smooth hover:shadow-elegant hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop&crop=center"
                    alt="AirPods"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-sm">Audio</h3>
                  <p className="text-xs text-muted-foreground">Son premium</p>
                </CardContent>
              </Card>
              
              <Card className="transition-smooth hover:shadow-elegant hover:-translate-y-2 -mt-8">
                <CardContent className="p-6 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop&crop=center"
                    alt="PlayStation"
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-sm">Gaming</h3>
                  <p className="text-xs text-muted-foreground">Expérience immersive</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 gradient-accent rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-8 -left-4 w-16 h-16 gradient-primary rounded-full opacity-20 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
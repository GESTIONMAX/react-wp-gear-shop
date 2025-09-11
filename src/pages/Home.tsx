import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Zap, Eye, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const categories = [
    {
      id: "sport",
      name: "SPORT",
      title: "Performance & Endurance",
      description: "Lunettes connectées conçues pour les athlètes et les passionnés de sport. Monitoring en temps réel, résistance aux conditions extrêmes.",
      href: "/sport",
      icon: Trophy,
      gradient: "from-red-500 to-orange-500",
      features: ["Résistant à l'eau", "GPS intégré", "Monitoring cardiaque"]
    },
    {
      id: "lifestyle",
      name: "LIFESTYLE",
      title: "Élégance & Quotidien",
      description: "L'alliance parfaite entre style et technologie pour votre vie quotidienne. Design raffiné, fonctionnalités intelligentes.",
      href: "/lifestyle",
      icon: Eye,
      gradient: "from-blue-500 to-purple-500",
      features: ["Design premium", "Notifications smart", "Autonomie longue durée"]
    },
    {
      id: "prismatic",
      name: "PRISMATIC",
      title: "Innovation & Futur",
      description: "L'avant-garde de la technologie wearable. Réalité augmentée, intelligence artificielle, expérience immersive.",
      href: "/prismatic",
      icon: Zap,
      gradient: "from-green-500 to-teal-500",
      features: ["Réalité augmentée", "IA intégrée", "Interface holographique"]
    }
  ];

  return (
    <>
      <Helmet>
        <title>MyTechGear - Lunettes Connectées de Nouvelle Génération</title>
        <meta 
          name="description" 
          content="Découvrez notre gamme complète de lunettes connectées pour SPORT, LIFESTYLE et PRISMATIC. Technologie française de pointe avec garantie 2 ans." 
        />
        <meta name="keywords" content="lunettes connectées, smart glasses, sport, lifestyle, réalité augmentée, wearable technology" />
        <link rel="canonical" href="/" />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute inset-0 opacity-40" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="block text-foreground">Choisissez Votre</span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Vision du Futur
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Trois univers, une technologie révolutionnaire.<br />
                Découvrez la catégorie qui correspond à votre style de vie.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Technologie Française</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Garantie 2 ans</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Livraison Gratuite</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id} 
                    className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${category.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h2>
                        
                        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
                          {category.title}
                        </h3>
                      </div>

                      <p className="text-center text-muted-foreground mb-8 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {category.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient}`} />
                            <span className="text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        asChild 
                        className="w-full group/btn bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300"
                      >
                        <Link to={category.href} className="flex items-center justify-center gap-2">
                          Découvrir {category.name}
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pas encore décidé ?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8">
                Explorez notre blog pour découvrir les dernières innovations 
                et trouver les lunettes connectées parfaites pour vous.
              </p>

              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Link to="/blog" className="flex items-center gap-2">
                  Lire le Blog
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
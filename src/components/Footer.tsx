import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MT</span>
              </div>
              <span className="font-merriweather font-bold text-xl text-primary">
                MyTechGear
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Votre destination tech pour les dernières innovations. 
              Qualité, performance et service client au rendez-vous.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liens rapides</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Smartphones
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Ordinateurs
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Audio
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Gaming
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Promotions
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Centre d'aide
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Livraison & Retours
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Garantie
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contactez-nous
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Restez informé de nos dernières offres et nouveautés
            </p>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Votre email"
                  className="flex-1"
                />
                <Button className="gradient-primary text-primary-foreground">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact info */}
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>123 Avenue de la Tech, 75001 Paris</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>01 23 45 67 89</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>contact@mytechgear.eu</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 MyTechGear.eu. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
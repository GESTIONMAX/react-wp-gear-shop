import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CustomBreadcrumb } from '@/components/Breadcrumb';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Scale,
  User,
  Calendar,
  ExternalLink
} from 'lucide-react';

const LegalNotice = () => {
  return (
    <>
      <Helmet>
        <title>Mentions Légales | MyTechGear.eu - Informations Légales</title>
        <meta
          name="description"
          content="Mentions légales, informations sur l'éditeur, hébergeur et conditions d'utilisation du site MyTechGear.eu - Lunettes connectées premium."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/mentions-legales" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <CustomBreadcrumb />

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Scale className="h-3 w-3 mr-2" />
                Informations légales
              </Badge>
              <h1 className="font-merriweather text-4xl lg:text-5xl font-bold mb-6">
                Mentions Légales
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Informations légales obligatoires concernant l'éditeur, l'hébergeur
                et les conditions d'utilisation du site MyTechGear.eu
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Éditeur du site */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    Éditeur du site
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Raison sociale</p>
                          <p className="text-muted-foreground">MyTechGear SAS</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Scale className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Forme juridique</p>
                          <p className="text-muted-foreground">Société par Actions Simplifiée</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Capital social</p>
                          <p className="text-muted-foreground">100 000 €</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Adresse</p>
                          <p className="text-muted-foreground">
                            123 Avenue de l'Innovation<br />
                            75001 Paris, France
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Téléphone</p>
                          <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">contact@mytechgear.eu</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">SIRET</p>
                      <p>123 456 789 00012</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">RCS</p>
                      <p>Paris B 123 456 789</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">TVA</p>
                      <p>FR12 123456789</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Directeur de publication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    Directeur de publication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Nom :</strong> Jean-Baptiste Dupont</p>
                  <p><strong>Qualité :</strong> Président de MyTechGear SAS</p>
                  <p><strong>Contact :</strong> direction@mytechgear.eu</p>
                </CardContent>
              </Card>

              {/* Hébergeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    Hébergement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium mb-2">Hébergeur principal</p>
                      <p><strong>Vercel Inc.</strong></p>
                      <p className="text-muted-foreground">
                        340 S Lemon Ave #4133<br />
                        Walnut, CA 91789, États-Unis
                      </p>
                      <p className="text-muted-foreground">
                        Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Base de données</p>
                      <p><strong>Supabase Inc.</strong></p>
                      <p className="text-muted-foreground">
                        970 Toa Payoh North #07-04<br />
                        Singapore 318992
                      </p>
                      <p className="text-muted-foreground">
                        Site web : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Propriété intellectuelle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    Propriété intellectuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes, etc.)
                    est protégé par le droit d'auteur et constitue la propriété exclusive de MyTechGear SAS,
                    sauf mention contraire.
                  </p>
                  <p>
                    Toute reproduction, distribution, modification, adaptation, retransmission ou publication
                    de ces éléments est strictement interdite sans l'accord écrit préalable de MyTechGear SAS.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Marques déposées :</strong> MyTechGear®, ainsi que tous les logos et noms de produits
                      présents sur ce site sont des marques déposées de MyTechGear SAS.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Données personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    Protection des données personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
                    "Informatique et Libertés", vous disposez de droits sur vos données personnelles.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Responsable de traitement</p>
                      <p className="text-muted-foreground">MyTechGear SAS</p>
                    </div>
                    <div>
                      <p className="font-medium">Délégué à la protection des données</p>
                      <p className="text-muted-foreground">dpo@mytechgear.eu</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pour plus d'informations, consultez notre
                    <a href="/politique-confidentialite" className="text-primary hover:underline ml-1">
                      Politique de confidentialité
                    </a>.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    Politique des cookies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Ce site utilise des cookies pour améliorer votre expérience de navigation,
                    réaliser des statistiques d'audience et vous proposer des contenus personnalisés.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous pouvez configurer vos préférences de cookies ou les refuser dans les
                    paramètres de votre navigateur.
                  </p>
                </CardContent>
              </Card>

              {/* Responsabilité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-primary" />
                    Limitation de responsabilité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    MyTechGear SAS s'efforce de maintenir les informations de ce site à jour et exactes.
                    Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité
                    de toutes les informations.
                  </p>
                  <p>
                    L'utilisation des informations de ce site se fait sous votre seule responsabilité.
                    MyTechGear SAS ne saurait être tenue responsable des dommages directs ou indirects
                    résultant de l'utilisation de ce site.
                  </p>
                </CardContent>
              </Card>

              {/* Droit applicable */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-primary" />
                    Droit applicable et juridiction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Les présentes mentions légales sont soumises au droit français.
                    En cas de litige, les tribunaux français seront seuls compétents.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Pour toute question concernant ces mentions légales ou ce site internet :
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="mailto:legal@mytechgear.eu"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      legal@mytechgear.eu
                    </a>
                    <a
                      href="tel:+33123456789"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      +33 1 23 45 67 89
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Formulaire de contact
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LegalNotice;
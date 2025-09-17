import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CustomBreadcrumb } from '@/components/Breadcrumb';
import {
  Shield,
  Eye,
  Lock,
  Database,
  Share2,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  User,
  Calendar,
  Cookie,
  Globe,
  FileText,
  Settings
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | MyTechGear.eu - Protection des Données</title>
        <meta
          name="description"
          content="Politique de confidentialité et protection des données personnelles de MyTechGear.eu. Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/politique-confidentialite" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <CustomBreadcrumb />

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-500/5 via-blue-600/10 to-blue-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Shield className="h-3 w-3 mr-2" />
                Protection des données
              </Badge>
              <h1 className="font-merriweather text-4xl lg:text-5xl font-bold mb-6">
                Politique de Confidentialité
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Votre vie privée est importante pour nous. Découvrez comment nous collectons,
                utilisons et protégeons vos données personnelles en toute transparence.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    MyTechGear SAS, en tant que responsable de traitement, s'engage à protéger
                    et respecter votre vie privée. Cette politique explique comment nous collectons,
                    utilisons, stockons et protégeons vos données personnelles.
                  </p>
                  <p>
                    Cette politique s'applique à tous les services proposés par MyTechGear.eu
                    et est conforme au Règlement Général sur la Protection des Données (RGPD)
                    et à la loi française "Informatique et Libertés".
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Responsable du traitement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    Responsable du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Société</p>
                        <p className="text-muted-foreground">MyTechGear SAS</p>
                      </div>
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-muted-foreground">
                          123 Avenue de l'Innovation<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-muted-foreground">contact@mytechgear.eu</p>
                      </div>
                      <div>
                        <p className="font-medium">Délégué à la protection des données</p>
                        <p className="text-muted-foreground">dpo@mytechgear.eu</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Données collectées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-primary" />
                    Données personnelles collectées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Données d'identification
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Nom et prénom</li>
                        <li>• Adresse email</li>
                        <li>• Numéro de téléphone</li>
                        <li>• Date de naissance (optionnelle)</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        Données de livraison et facturation
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Adresses de livraison et facturation</li>
                        <li>• Informations de paiement (cryptées)</li>
                        <li>• Historique des commandes</li>
                        <li>• Préférences de livraison</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-purple-600" />
                        Données de navigation
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Adresse IP</li>
                        <li>• Type de navigateur et version</li>
                        <li>• Pages visitées et temps de visite</li>
                        <li>• Référent de visite</li>
                        <li>• Données de géolocalisation approximative</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-orange-600" />
                        Données comportementales
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Produits consultés et wishlist</li>
                        <li>• Interactions avec le site</li>
                        <li>• Préférences et paramètres</li>
                        <li>• Données d'usage des services</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Finalités du traitement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-primary" />
                    Finalités du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Gestion des commandes</h4>
                        <p className="text-sm text-muted-foreground">
                          Traitement et suivi des commandes, gestion des livraisons, facturation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Service client</h4>
                        <p className="text-sm text-muted-foreground">
                          Support technique, gestion des retours, assistance utilisateur
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Amélioration des services</h4>
                        <p className="text-sm text-muted-foreground">
                          Analyse d'usage, développement de nouveaux produits, optimisation UX
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Marketing et communication</h4>
                        <p className="text-sm text-muted-foreground">
                          Newsletter, offres personnalisées, communications promotionnelles (avec consentement)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Base légale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    Base légale du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-700">Exécution du contrat</h4>
                      <p className="text-sm text-muted-foreground">
                        Pour la gestion des commandes, livraisons et service client
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-700">Intérêt légitime</h4>
                      <p className="text-sm text-muted-foreground">
                        Pour l'amélioration de nos services et la sécurité de la plateforme
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium text-purple-700">Consentement</h4>
                      <p className="text-sm text-muted-foreground">
                        Pour les communications marketing et l'utilisation de cookies non essentiels
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium text-orange-700">Obligation légale</h4>
                      <p className="text-sm text-muted-foreground">
                        Pour la comptabilité, la fiscalité et la lutte contre la fraude
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Durée de conservation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    Durée de conservation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Données de compte client</p>
                        <p className="text-sm text-muted-foreground">Compte actif</p>
                      </div>
                      <Badge variant="outline">3 ans après dernière activité</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Données de commande</p>
                        <p className="text-sm text-muted-foreground">Facturation et garantie</p>
                      </div>
                      <Badge variant="outline">10 ans (obligation légale)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Données de navigation</p>
                        <p className="text-sm text-muted-foreground">Analytics et amélioration</p>
                      </div>
                      <Badge variant="outline">25 mois maximum</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-muted-foreground">Communications marketing</p>
                      </div>
                      <Badge variant="outline">Jusqu'à désabonnement</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partage des données */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-primary" />
                    Partage des données
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Nous ne vendons jamais vos données personnelles. Nous pouvons partager
                    certaines données avec nos partenaires de confiance dans les cas suivants :
                  </p>
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        Prestataires de services
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Transporteurs (La Poste, Chronopost, DPD)</li>
                        <li>• Processeurs de paiement (Stripe, PayPal)</li>
                        <li>• Hébergeurs (Vercel, Supabase)</li>
                        <li>• Services d'analytics (Google Analytics)</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Obligations légales
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Autorités judiciaires sur réquisition</li>
                        <li>• Administration fiscale</li>
                        <li>• Organismes de lutte contre la fraude</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vos droits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    Vos droits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Eye className="h-4 w-4 text-blue-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Droit d'accès</p>
                          <p className="text-xs text-muted-foreground">Connaître les données vous concernant</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Settings className="h-4 w-4 text-green-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Droit de rectification</p>
                          <p className="text-xs text-muted-foreground">Corriger des données inexactes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Droit d'effacement</p>
                          <p className="text-xs text-muted-foreground">Supprimer vos données</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Lock className="h-4 w-4 text-purple-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Droit à la limitation</p>
                          <p className="text-xs text-muted-foreground">Restreindre le traitement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Share2 className="h-4 w-4 text-orange-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Droit à la portabilité</p>
                          <p className="text-xs text-muted-foreground">Récupérer vos données</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-4 w-4 text-gray-600 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Droit d'opposition</p>
                          <p className="text-xs text-muted-foreground">Refuser certains traitements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Comment exercer vos droits :</strong> Contactez-nous à dpo@mytechgear.eu
                      avec une pièce d'identité. Nous répondrons sous 30 jours maximum.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Cookie className="h-5 w-5 text-primary" />
                    Politique des cookies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Notre site utilise différents types de cookies pour améliorer votre expérience
                    et analyser l'utilisation de nos services.
                  </p>
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-green-700">Cookies essentiels</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Nécessaires au fonctionnement du site (panier, connexion, sécurité)
                      </p>
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        Toujours actifs
                      </Badge>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-blue-700">Cookies d'analyse</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Statistiques d'usage pour améliorer le site (Google Analytics)
                      </p>
                      <Badge variant="outline" className="text-blue-700 border-blue-200">
                        Avec consentement
                      </Badge>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-purple-700">Cookies marketing</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Publicité ciblée et remarketing
                      </p>
                      <Badge variant="outline" className="text-purple-700 border-purple-200">
                        Avec consentement
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur
                    ou via notre bandeau de consentement.
                  </p>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    Sécurité des données
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                    pour protéger vos données personnelles :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Mesures techniques</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Chiffrement SSL/TLS</li>
                        <li>• Hachage des mots de passe</li>
                        <li>• Sauvegardes régulières</li>
                        <li>• Pare-feu et monitoring</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Mesures organisationnelles</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Accès restreint aux données</li>
                        <li>• Formation du personnel</li>
                        <li>• Contrats avec sous-traitants</li>
                        <li>• Procédures de notification</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transferts internationaux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    Transferts internationaux
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Certains de nos prestataires peuvent être situés en dehors de l'Union Européenne.
                    Dans ce cas, nous nous assurons que des garanties appropriées sont en place :
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Clauses contractuelles types de la Commission européenne</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Décisions d'adéquation (ex: Suisse, Royaume-Uni)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Certification Privacy Shield ou équivalent</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    Modifications de la politique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Cette politique de confidentialité peut être modifiée pour refléter les changements
                    dans nos pratiques ou la législation. En cas de modification substantielle,
                    nous vous en informerons par email ou via un bandeau sur le site.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Conseil :</strong> Nous vous recommandons de consulter régulièrement
                      cette page pour rester informé de nos pratiques de confidentialité.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact et réclamations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Pour toute question concernant cette politique de confidentialité ou l'exercice
                    de vos droits :
                  </p>
                  <div className="grid gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="mailto:dpo@mytechgear.eu"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        dpo@mytechgear.eu
                      </a>
                      <a
                        href="tel:+33123456789"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        +33 1 23 45 67 89
                      </a>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium mb-2">Autorité de contrôle</p>
                      <p className="text-sm text-muted-foreground">
                        En cas de litige, vous pouvez saisir la Commission Nationale de l'Informatique
                        et des Libertés (CNIL) :
                        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                          www.cnil.fr
                        </a>
                      </p>
                    </div>
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

export default PrivacyPolicy;
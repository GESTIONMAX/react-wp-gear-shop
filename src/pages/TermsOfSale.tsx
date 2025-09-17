import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CustomBreadcrumb } from '@/components/Breadcrumb';
import {
  ShoppingCart,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  Scale,
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Package,
  Clock,
  Euro,
  FileText,
  CheckCircle,
  XCircle,
  Gavel
} from 'lucide-react';

const TermsOfSale = () => {
  return (
    <>
      <Helmet>
        <title>Conditions Générales de Vente | MyTechGear.eu - CGV E-commerce</title>
        <meta
          name="description"
          content="Conditions générales de vente de MyTechGear.eu. Informations sur les commandes, livraisons, retours, garanties et modalités de paiement pour nos lunettes connectées."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/conditions-generales-vente" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <CustomBreadcrumb />

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-green-500/5 via-green-600/10 to-green-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">
                <Scale className="h-3 w-3 mr-2" />
                Conditions commerciales
              </Badge>
              <h1 className="font-merriweather text-4xl lg:text-5xl font-bold mb-6">
                Conditions Générales de Vente
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conditions applicables à toute commande passée sur MyTechGear.eu.
                Vos droits et obligations en tant que client.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Préambule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    Préambule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les relations
                    contractuelles entre MyTechGear SAS et toute personne physique ou morale
                    souhaitant effectuer un achat sur le site MyTechGear.eu.
                  </p>
                  <p>
                    L'acceptation de ces conditions est matérialisée par la validation de votre commande.
                    Nous vous recommandons de les lire attentivement avant tout achat.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')} -
                      Version applicable à toute commande passée à partir de cette date.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations légales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-primary" />
                    Informations sur le vendeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Dénomination sociale</p>
                        <p className="text-muted-foreground">MyTechGear SAS</p>
                      </div>
                      <div>
                        <p className="font-medium">Capital social</p>
                        <p className="text-muted-foreground">100 000 €</p>
                      </div>
                      <div>
                        <p className="font-medium">Siège social</p>
                        <p className="text-muted-foreground">
                          123 Avenue de l'Innovation<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">RCS</p>
                        <p className="text-muted-foreground">Paris B 123 456 789</p>
                      </div>
                      <div>
                        <p className="font-medium">TVA Intracommunautaire</p>
                        <p className="text-muted-foreground">FR12 123456789</p>
                      </div>
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-muted-foreground">
                          Email : contact@mytechgear.eu<br />
                          Tél : +33 1 23 45 67 89
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Produits et services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    Produits et services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        Description des produits
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Lunettes connectées et accessoires high-tech</li>
                        <li>• Descriptions détaillées avec photos et caractéristiques</li>
                        <li>• Informations techniques, compatibilité et notices</li>
                        <li>• Prix indiqués en euros TTC, hors frais de livraison</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Disponibilité
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Produits vendus dans la limite des stocks disponibles</li>
                        <li>• En cas de rupture, information immédiate du client</li>
                        <li>• Possibilité de précommande selon les produits</li>
                        <li>• Délais de réapprovisionnement communiqués si connus</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commandes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Processus de commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Sélection des produits</h4>
                        <p className="text-sm text-muted-foreground">
                          Ajout au panier, vérification des quantités et options
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Identification</h4>
                        <p className="text-sm text-muted-foreground">
                          Création de compte ou connexion, adresses de livraison et facturation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Mode de livraison</h4>
                        <p className="text-sm text-muted-foreground">
                          Choix du transporteur, délais et frais de port
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Paiement et validation</h4>
                        <p className="text-sm text-muted-foreground">
                          Acceptation des CGV, choix du mode de paiement, validation finale
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Important :</strong> La validation de votre commande constitue
                      une acceptation irrévocable de ces CGV et forme un contrat de vente.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Prix et paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Prix et modalités de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Euro className="h-4 w-4 text-green-600" />
                        Tarification
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Prix en euros TTC (TVA française 20%)</li>
                        <li>• Frais de port calculés selon destination</li>
                        <li>• Offres promotionnelles à durée limitée</li>
                        <li>• Prix fermes et définitifs lors de la commande</li>
                        <li>• Aucune modification après validation</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        Modes de paiement
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Carte bancaire (Visa, MasterCard, Amex)</li>
                        <li>• PayPal et portefeuilles électroniques</li>
                        <li>• Paiement en 3x sans frais (selon montant)</li>
                        <li>• Virement bancaire (commandes entreprises)</li>
                        <li>• Paiement sécurisé SSL 256 bits</li>
                      </ul>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Paiement à la commande</span>
                      <Badge variant="default">Obligatoire</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Délai d'encaissement</span>
                      <Badge variant="outline">Immédiat</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Devise de facturation</span>
                      <Badge variant="outline">EUR (€)</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Livraison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    Livraison et expédition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        Zones de livraison
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-700 mb-2">France métropolitaine</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Livraison standard : 48-72h</li>
                            <li>• Livraison express : 24h</li>
                            <li>• Points relais disponibles</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-blue-700 mb-2">Union Européenne</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Délai : 3-7 jours ouvrés</li>
                            <li>• Frais douaniers inclus</li>
                            <li>• Suivi de colis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        Délais et modalités
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Préparation : 24-48h ouvrées après confirmation de paiement</li>
                        <li>• Expedition du lundi au vendredi (hors jours fériés)</li>
                        <li>• Suivi de colis par email et SMS</li>
                        <li>• Livraison contre signature obligatoire</li>
                        <li>• Reprise automatique en cas d'absence (selon transporteur)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-800 text-sm">
                      <strong>Attention :</strong> Les délais sont donnés à titre indicatif.
                      En cas de retard important, nous vous contacterons pour vous proposer des solutions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Droit de rétractation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    Droit de rétractation et retours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-700 mb-2">Délai de rétractation</h4>
                      <p className="text-sm text-muted-foreground">
                        Vous disposez de <strong>14 jours calendaires</strong> à compter de la réception
                        de votre commande pour exercer votre droit de rétractation, sans avoir à justifier
                        de motifs ni à payer de pénalités.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-700 mb-2">Conditions de retour</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Produits dans leur emballage d'origine</li>
                        <li>• État neuf, non utilisé et non endommagé</li>
                        <li>• Accessoires et documentation complets</li>
                        <li>• Retour à vos frais (sauf produit défectueux)</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium text-orange-700 mb-2">Exceptions</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Produits personnalisés ou sur mesure</li>
                        <li>• Produits d'hygiène descellés</li>
                        <li>• Logiciels et contenu numérique téléchargés</li>
                        <li>• Produits périssables ou à date d'expiration courte</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      <strong>Remboursement :</strong> Nous nous engageons à vous rembourser
                      dans les 14 jours suivant la réception de votre retour par le même moyen
                      de paiement que celui utilisé lors de l'achat.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Garanties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    Garanties et SAV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        Garantie légale de conformité
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Durée : 2 ans à compter de la livraison</li>
                        <li>• Couvre les défauts de conformité présents lors de la délivrance</li>
                        <li>• Réparation ou remplacement gratuit</li>
                        <li>• Réduction du prix ou résolution du contrat si impossible</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        Garantie des vices cachés
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Articles 1641 à 1649 du Code Civil</li>
                        <li>• Défauts cachés rendant le produit impropre à l'usage</li>
                        <li>• Action en garantie dans les 2 ans de la découverte</li>
                        <li>• Remboursement ou réduction du prix</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Garantie commerciale constructeur
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Selon les conditions de chaque fabricant</li>
                        <li>• Généralement 1 à 3 ans selon les produits</li>
                        <li>• Extension de garantie disponible sur certains produits</li>
                        <li>• Conditions détaillées avec chaque produit</li>
                      </ul>
                    </div>
                  </div>
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
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Engagement de MyTechGear</h4>
                        <p className="text-sm text-muted-foreground">
                          Nous nous engageons à livrer des produits conformes aux descriptions,
                          dans les délais annoncés et à assurer un service client de qualité.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Limitations</h4>
                        <p className="text-sm text-muted-foreground">
                          Notre responsabilité est limitée au prix d'achat du produit.
                          Nous ne saurions être tenus responsables des dommages indirects,
                          de la perte de données ou du manque à gagner.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-medium">Cas de force majeure</h4>
                        <p className="text-sm text-muted-foreground">
                          Événements imprévisibles et irrésistibles (catastrophes naturelles,
                          grèves, pandémies) pouvant affecter l'exécution de nos obligations.
                        </p>
                      </div>
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
                    Tous les éléments du site MyTechGear.eu (textes, images, logos, marques,
                    base de données) sont protégés par le droit de la propriété intellectuelle
                    et appartiennent à MyTechGear SAS ou à ses partenaires.
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Reproduction interdite sans autorisation écrite</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Usage commercial strictement prohibé</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Usage personnel autorisé dans le cadre de la commande</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Protection des données */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    Protection des données personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Les données personnelles collectées dans le cadre de votre commande sont
                    traitées conformément à notre Politique de Confidentialité et au RGPD.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Finalités principales</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Traitement et suivi des commandes</li>
                        <li>• Gestion de la relation client</li>
                        <li>• Facturation et comptabilité</li>
                        <li>• Service après-vente</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Vos droits</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Accès, rectification, effacement</li>
                        <li>• Limitation du traitement</li>
                        <li>• Portabilité des données</li>
                        <li>• Opposition au traitement</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact DPO :
                    <a href="mailto:dpo@mytechgear.eu" className="text-primary hover:underline ml-1">
                      dpo@mytechgear.eu
                    </a>
                  </p>
                </CardContent>
              </Card>

              {/* Litiges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Gavel className="h-5 w-5 text-primary" />
                    Résolution des litiges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-700 mb-2">Médiation préalable</h4>
                      <p className="text-sm text-muted-foreground">
                        En cas de litige, nous privilégions la résolution amiable.
                        Contactez notre service client qui s'efforcera de trouver une solution satisfaisante.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-700 mb-2">Médiation de la consommation</h4>
                      <p className="text-sm text-muted-foreground">
                        En cas d'échec, vous pouvez recourir gratuitement au médiateur de la consommation :
                        <a href="https://www.mediateur-conso.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                          www.mediateur-conso.fr
                        </a>
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium text-orange-700 mb-2">Juridiction compétente</h4>
                      <p className="text-sm text-muted-foreground">
                        À défaut d'accord amiable, les tribunaux français seront seuls compétents.
                        Droit français applicable.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dispositions générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    Dispositions générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">Modification des CGV</h4>
                      <p className="text-sm text-muted-foreground">
                        Ces conditions peuvent être modifiées à tout moment. La version applicable
                        est celle en vigueur au moment de la commande.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">Nullité partielle</h4>
                      <p className="text-sm text-muted-foreground">
                        Si une clause s'avérait nulle, les autres dispositions resteraient valables
                        et seraient exécutées dans la pleine mesure permise par la loi.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">Conservation</h4>
                      <p className="text-sm text-muted-foreground">
                        Archivage électronique des commandes et factures pendant 10 ans
                        conformément aux obligations légales.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    Service client et contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Pour toute question concernant vos commandes, ces CGV ou nos produits :
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Moyens de contact</h4>
                      <div className="space-y-2">
                        <a
                          href="mailto:contact@mytechgear.eu"
                          className="flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                          <Mail className="h-4 w-4" />
                          contact@mytechgear.eu
                        </a>
                        <a
                          href="tel:+33123456789"
                          className="flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                          <Phone className="h-4 w-4" />
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Horaires d'ouverture</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Lundi - Vendredi : 9h00 - 18h00</p>
                        <p>Samedi : 10h00 - 16h00</p>
                        <p>Dimanche et jours fériés : Fermé</p>
                        <p className="text-xs text-blue-600 mt-2">
                          Support par email 7j/7 - Réponse sous 24h
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    CGV mises à jour le : {new Date().toLocaleDateString('fr-FR')}
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

export default TermsOfSale;
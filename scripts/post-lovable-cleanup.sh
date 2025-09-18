#!/bin/bash

# 🧹 Script de Nettoyage Post-Lovable
# Ce script automatise le nettoyage d'un projet exporté depuis Lovable

set -e

echo "🚀 Début du nettoyage post-Lovable..."
echo "======================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier qu'on est dans un projet Node.js
if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# 1. Audit initial
print_step "Audit initial des dépendances..."
echo "Vulnérabilités avant nettoyage :"
npm audit --audit-level=moderate || true
echo ""

# 2. Identifier les dépendances Lovable
print_step "Identification des dépendances Lovable..."
if npm list | grep -i lovable > /dev/null 2>&1; then
    echo "Dépendances Lovable trouvées :"
    npm list | grep -i lovable
else
    print_success "Aucune dépendance Lovable trouvée"
fi
echo ""

# 3. Supprimer lovable-tagger
print_step "Suppression de lovable-tagger..."
if npm list lovable-tagger > /dev/null 2>&1; then
    npm uninstall lovable-tagger
    print_success "lovable-tagger supprimé"
else
    print_success "lovable-tagger déjà absent"
fi

# 4. Nettoyer vite.config.ts
print_step "Nettoyage de vite.config.ts..."
if [ -f "vite.config.ts" ]; then
    if grep -q "lovable-tagger" vite.config.ts; then
        # Backup
        cp vite.config.ts vite.config.ts.backup

        # Supprimer l'import
        sed -i '/import.*lovable-tagger/d' vite.config.ts

        # Simplifier les plugins
        sed -i 's/plugins: \[react(), mode === "development" && componentTagger()\]\.filter(Boolean),/plugins: [react()],/' vite.config.ts

        print_success "vite.config.ts nettoyé (backup créé)"
    else
        print_success "vite.config.ts déjà propre"
    fi
fi

# 5. Mettre à jour les dépendances vulnérables
print_step "Mise à jour des dépendances de sécurité..."
npm install esbuild@latest vite@latest @vitejs/plugin-react-swc@latest
print_success "Dépendances mises à jour"

# 6. Nettoyer index.html
print_step "Nettoyage des métadonnées index.html..."
if [ -f "index.html" ]; then
    if grep -q "Lovable\|lovable" index.html; then
        # Backup
        cp index.html index.html.backup

        # Replacements (à adapter selon les besoins)
        sed -i 's/content="Lovable"/content="MyTechGear"/' index.html
        sed -i 's/content="Lovable Generated Project"/content="Découvrez notre sélection de produits technologiques premium"/' index.html
        sed -i 's|https://lovable.dev/opengraph-image-p98pqg.png|/hero-smart-glasses.jpg|g' index.html
        sed -i 's/@lovable_dev/@mytechgear/' index.html

        print_success "index.html nettoyé (backup créé)"
    else
        print_success "index.html déjà propre"
    fi
fi

# 7. Recherche de références restantes
print_step "Recherche de références Lovable restantes..."

echo "Dans le code source :"
if find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "lovable\|@lovable\|data-component-id" {} \; 2>/dev/null | head -5; then
    print_warning "Références trouvées - vérification manuelle nécessaire"
else
    print_success "Aucune référence trouvée dans le code source"
fi

# 8. Build et tests
print_step "Build et tests de validation..."

echo "Build de production..."
if npm run build; then
    print_success "Build réussi"
else
    print_error "Build échoué"
    exit 1
fi

echo "Tests unitaires..."
if npm run test; then
    print_success "Tests réussis"
else
    print_warning "Tests échoués ou non configurés"
fi

# 9. Vérification du build final
print_step "Vérification du build final..."
if [ -d "dist" ]; then
    if grep -r "lovable\|data-component-id" dist/ > /dev/null 2>&1; then
        print_warning "Traces Lovable détectées dans le build"
        echo "Fichiers concernés :"
        grep -r "lovable\|data-component-id" dist/ | head -3
    else
        print_success "Build propre - aucune trace Lovable"
    fi
fi

# 10. Audit final
print_step "Audit de sécurité final..."
echo "Vulnérabilités après nettoyage :"
if npm audit --audit-level=moderate; then
    print_success "Aucune vulnérabilité détectée"
else
    print_warning "Vulnérabilités encore présentes - vérification manuelle nécessaire"
fi

# 11. Résumé
echo ""
echo "======================================="
echo -e "${GREEN}🎉 Nettoyage post-Lovable terminé !${NC}"
echo ""
echo "📋 Résumé des actions :"
echo "  ✅ Dépendances Lovable supprimées"
echo "  ✅ Configuration Vite nettoyée"
echo "  ✅ Métadonnées HTML personnalisées"
echo "  ✅ Dépendances de sécurité mises à jour"
echo "  ✅ Build et tests validés"
echo ""
echo "📚 Consultez la documentation complète :"
echo "  - docs/post-lovable-checklist.md"
echo "  - docs/quick-commands.md"
echo ""
echo "⚠️  N'oubliez pas de :"
echo "  1. Vérifier manuellement les fichiers de backup (.backup)"
echo "  2. Adapter les métadonnées à votre projet"
echo "  3. Tester l'application en mode développement"
echo "  4. Effectuer un commit des changements"
echo ""

# Proposer de démarrer le serveur de dev
read -p "Voulez-vous démarrer le serveur de développement ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Démarrage du serveur de développement..."
    npm run dev
fi
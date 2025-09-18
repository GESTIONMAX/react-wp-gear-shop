#!/bin/bash

# 🔒 Script d'audit de sécurité automatique
# Étape 1 : Audit local des dépendances

set -e

echo "🔍 Audit de sécurité automatique - Étape 1"
echo "========================================"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# 1. Audit npm
echo "🔍 Audit npm des vulnérabilités..."
if npm audit --audit-level=moderate; then
    print_success "Aucune vulnérabilité trouvée"
else
    print_warning "Vulnérabilités détectées - voir détails ci-dessus"
fi

# 2. Génération du rapport JSON
echo "📊 Génération du rapport de sécurité..."
npm audit --json > security-audit.json 2>/dev/null || true
print_success "Rapport généré: security-audit.json"

# 3. Vérification des dépendances obsolètes
echo "📦 Vérification des dépendances obsolètes..."
npm outdated --depth=0 || print_warning "Dépendances obsolètes trouvées"

# 4. Résumé
echo ""
echo "📋 Résumé de l'audit:"
echo "- Audit npm: terminé"
echo "- Rapport JSON: security-audit.json"
echo "- Dépendances vérifiées"

echo ""
echo "🎯 Prochaines étapes:"
echo "1. Configurer GitHub Actions (Étape 2)"
echo "2. Mettre en place Dependabot (Étape 3)"
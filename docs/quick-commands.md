# Commandes Rapides Post-Lovable

## 🚀 Commandes de Nettoyage en Une Fois

```bash
#!/bin/bash
# Script de nettoyage rapide post-Lovable

echo "🧹 Nettoyage post-Lovable en cours..."

# 1. Supprimer les dépendances Lovable
echo "📦 Suppression des dépendances Lovable..."
npm uninstall lovable-tagger 2>/dev/null || true

# 2. Mettre à jour les dépendances vulnérables
echo "🔒 Mise à jour des dépendances de sécurité..."
npm install esbuild@latest vite@latest @vitejs/plugin-react-swc@latest

# 3. Audit de sécurité
echo "🔍 Audit de sécurité..."
npm audit

# 4. Tests
echo "✅ Tests de validation..."
npm run build
npm run test

# 5. Recherche de références restantes
echo "🔎 Recherche de références Lovable restantes..."
echo "=== Recherche dans le code source ==="
grep -r "lovable\|@lovable" src/ 2>/dev/null || echo "✅ Aucune référence trouvée"

echo "=== Recherche data-component-id ==="
grep -r "data-component-id" src/ 2>/dev/null || echo "✅ Aucun attribut trouvé"

echo "=== Vérification du build final ==="
grep -r "lovable\|data-component-id" dist/ 2>/dev/null || echo "✅ Build propre"

echo "🎉 Nettoyage terminé !"
```

## 🔍 Commandes de Vérification

### Vérifier les dépendances
```bash
npm list | grep -i lovable
npm audit --audit-level=moderate
```

### Vérifier le code source
```bash
# Recherche complète
find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "lovable\|@lovable\|data-component-id" {} \;

# Recherche par type
grep -r "@lovable" src/
grep -r "data-component-id" src/
grep -r "lovable-tagger" vite.config.ts
```

### Vérifier le build
```bash
npm run build
grep -r "lovable\|data-component-id" dist/ || echo "✅ Build propre"
```

## 🛠️ Commandes de Correction

### Nettoyage vite.config.ts
```bash
# Supprimer import lovable-tagger
sed -i '/import.*lovable-tagger/d' vite.config.ts

# Simplifier plugins
sed -i 's/plugins: \[react(), mode === "development" && componentTagger()\]\.filter(Boolean),/plugins: [react()],/' vite.config.ts
```

### Nettoyage index.html
```bash
# Backup
cp index.html index.html.bak

# Remplacer les métadonnées Lovable (à adapter selon vos besoins)
sed -i 's/content="Lovable"/content="VotreMarque"/' index.html
sed -i 's/content="Lovable Generated Project"/content="Votre Description"/' index.html
sed -i 's|https://lovable.dev/opengraph-image-p98pqg.png|/votre-image.jpg|g' index.html
sed -i 's/@lovable_dev/@votre_compte/' index.html
```

## 📊 Commandes de Validation

### Test complet
```bash
# Build + Test + Audit
npm run build && npm run test && npm audit
```

### Vérification des performances
```bash
# Taille du bundle
ls -lh dist/assets/

# Analyse du bundle
npx vite-bundle-analyzer dist/
```

### Test du serveur dev
```bash
# Démarrer en arrière-plan et tester
timeout 10s npm run dev &
sleep 5
curl -s http://localhost:8080 > /dev/null && echo "✅ Serveur OK" || echo "❌ Erreur serveur"
```

## 🎯 One-Liner de Validation

```bash
# Validation complète en une commande
npm run build && npm run test && npm audit && (grep -r "lovable\|data-component-id" dist/ > /dev/null && echo "❌ Traces Lovable détectées" || echo "✅ Application propre")
```

## 📁 Structure après nettoyage

```
react-wp-gear-shop/
├── docs/
│   ├── post-lovable-checklist.md    ← Procédure complète
│   └── quick-commands.md             ← Ce fichier
├── src/                              ← Code source propre
├── dist/                             ← Build sans traces Lovable
├── package.json                      ← Sans dépendances Lovable
├── vite.config.ts                    ← Configuration nettoyée
└── index.html                        ← Métadonnées personnalisées
```
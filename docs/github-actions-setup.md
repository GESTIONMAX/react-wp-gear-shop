# 🔒 Configuration GitHub Actions - Guide de Configuration

## 📋 Workflows Créés

### 1. **Security Audit & Build** (`security-audit.yml`)
- ✅ Audit de sécurité automatique
- ✅ Vérification des dépendances obsolètes
- ✅ Tests de build sur Node 18 et 20
- ✅ Scan de vulnérabilités avec Trivy
- ✅ Déclenchement : push, PR, et hebdomadaire

### 2. **Deploy to Production** (`deploy.yml`)
- ✅ Vérifications de sécurité pré-déploiement
- ✅ Build et tests automatiques
- ✅ Déploiement sécurisé vers Vercel
- ✅ Health check post-déploiement

### 3. **Dependabot** (`dependabot.yml`)
- ✅ Mises à jour automatiques des dépendances
- ✅ Surveillance hebdomadaire
- ✅ Auto-merge pour les correctifs de sécurité mineurs

## 🔧 Configuration Requise

### Variables d'Environnement GitHub

Dans **Settings > Secrets and Variables > Actions** :

#### **Variables (publiques)**
Aller dans l'onglet **"Variables"** :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
```

#### **Secrets (privés)**
Aller dans l'onglet **"Secrets"** :
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

#### **📋 Guide de Configuration Détaillé**

**1. Variables Supabase (publiques) :**
- Dans votre dashboard Supabase : **Settings** → **API**
- `VITE_SUPABASE_URL` : "Project URL"
- `VITE_SUPABASE_PUBLISHABLE_KEY` : "Project API keys" → "anon public"

**2. Secrets Vercel (privés) :**
- `VERCEL_TOKEN` : Token configuré pour le compte
- `VERCEL_ORG_ID` : Dans Vercel → Settings → General → "Team ID"
- `VERCEL_PROJECT_ID` : Dans votre projet Vercel → Settings → General → "Project ID"

**3. Alternative via CLI Vercel :**
```bash
npx vercel link
# Les IDs seront dans .vercel/project.json
cat .vercel/project.json
```

### Permissions GitHub

Dans **Settings > Actions > General** :
- ✅ **Workflow permissions** : Read and write permissions
- ✅ **Allow GitHub Actions to create and approve pull requests**

## 🛡️ Fonctionnalités de Sécurité

### **Audit Automatique**
- Scan des vulnérabilités npm
- Vérification des dépendances obsolètes
- Contrôle de la configuration de sécurité
- Scan avec Trivy (vulnérabilités avancées)

### **Protection du Déploiement**
- Blocage si vulnérabilités critiques
- Vérification des variables d'environnement
- Scan du build pour détecter les secrets
- Health check post-déploiement

### **Code Review Automatisé**
- CODEOWNERS pour les fichiers critiques
- Review obligatoire pour les changements sécurité
- Labels automatiques pour les PR

## 🚀 Utilisation

### Déclenchement Manuel
```bash
# Via GitHub UI : Actions > Deploy to Production > Run workflow
# Ou via CLI GitHub
gh workflow run deploy.yml -f environment=production
```

### Monitoring
- **Security Summary** : Visible dans chaque run
- **Artifacts** : Rapports d'audit conservés 30 jours
- **Notifications** : Échecs envoyés par email

## 📊 Rapports Générés

### Audit de Sécurité
- `audit-report.json` : Rapport npm audit complet
- `outdated.txt` : Liste des dépendances obsolètes
- Résumé dans GitHub Actions Summary

### Build
- `production-build` : Artifacts de build (7 jours)
- Métriques de taille de bundle
- Vérification d'absence de secrets

## ⚡ Optimisations Performances

### Cache NPM
- Cache automatique des `node_modules`
- Restoration rapide des dépendances

### Build Matrix
- Tests parallèles sur Node 18 et 20
- Détection précoce des incompatibilités

### Conditional Jobs
- Scan avancé uniquement sur PR/main
- Déploiement uniquement après tests réussis

## 🔧 Personnalisation

### Modifier la Fréquence d'Audit
```yaml
schedule:
  - cron: '0 8 * * 1'  # Lundi 8h
  # ou quotidien : '0 8 * * *'
```

### Ajouter des Environnements
```yaml
environment:
  name: staging
  url: https://staging.mytechgear.eu
```

### Notifications Slack (optionnel)
```yaml
- name: 📢 Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎯 Prochaines Étapes

1. **Configurer les secrets Vercel**
2. **Tester le premier déploiement**
3. **Configurer les notifications**
4. **Personnaliser selon vos besoins**

---

*Configuration testée avec GitHub Actions, Vercel, et Supabase.*
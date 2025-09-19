# 🥽 MyTechGear.eu - E-commerce Lunettes Connectées

> **Application e-commerce moderne** spécialisée dans la vente de lunettes connectées premium avec interface d'administration complète et gestion avancée des produits.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-black?logo=shadcnui)](https://ui.shadcn.com/)
[![Nivo](https://img.shields.io/badge/Nivo-0.99.0-FF6B6B?logo=d3dotjs)](https://nivo.rocks/)

## 📸 Aperçu

Une application e-commerce élégante et performante offrant une expérience d'achat premium pour les lunettes connectées, avec un dashboard administrateur complet pour la gestion des produits, commandes et analytics.

## ✨ Fonctionnalités Principales

### 🛒 **E-commerce Frontend**
- **Catalogue produits** avec filtres avancés et recherche
- **Pages catégories** dynamiques (Sport, Lifestyle, Prismatic)
- **Fiches produits** détaillées avec galeries d'images optimisées
- **Panier intelligent** avec gestion des variantes (couleurs, tailles)
- **Wishlist** pour sauvegarder les produits favoris
- **Système d'authentification** utilisateur complet
- **Checkout sécurisé** avec multiple moyens de paiement
- **Suivi des commandes** en temps réel

### 👨‍💼 **Dashboard Administrateur**
- **Gestion des produits** : CRUD complet avec variantes et images
- **Gestion des collections** : Organisation logique des produits
- **Gestion des utilisateurs** : Administration des comptes clients
- **Gestion des commandes** : Suivi et traitement des ventes
- **Gestion des fournisseurs** : Carnet d'adresses business
- **Analytics avancées** : Tableaux de bord avec métriques clés
- **Upload d'images** avec compression automatique
- **Système de notifications** en temps réel

### 🎨 **Interface & Design**
- **Design moderne** avec composants shadcn/ui
- **Responsive design** adaptatif mobile/tablet/desktop
- **Thème cohérent** avec palette de couleurs harmonieuse
- **Animations fluides** et micro-interactions
- **Typography élégante** avec font Merriweather
- **Dark/Light mode** (en développement)

### 📱 **Pages Légales**
- **Mentions légales** complètes et conformes
- **Politique de confidentialité** RGPD compliant
- **Conditions générales de vente** e-commerce

## 🏗️ Architecture Technique

### **Frontend**
```
├── React 18.3.1          # Framework UI moderne
├── TypeScript 5.8.3      # Typage statique robuste
├── Vite 7.1.6            # Build tool ultra-rapide
├── Tailwind CSS 3.4.17   # Framework CSS utility-first
├── shadcn/ui              # Composants UI premium
├── Nivo 0.99.0            # Bibliothèque de graphiques modernes
├── React Query            # Gestion d'état serveur
├── React Router 6         # Navigation SPA
├── React Hook Form        # Gestion des formulaires
├── Lucide Icons           # Icônes modernes
└── date-fns               # Manipulation des dates
```

### **Backend & Services**
```
├── Supabase              # Backend-as-a-Service
│   ├── PostgreSQL       # Base de données relationnelle
│   ├── Auth              # Authentification utilisateur
│   ├── Storage           # Stockage des images
│   ├── Real-time         # Mises à jour en temps réel
│   └── Edge Functions    # Fonctions serverless
├── Stripe                # Processeur de paiement
└── Vercel                # Hébergement et déploiement
```

### **Structure du Projet**
```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants de base shadcn/ui
│   ├── admin/           # Composants d'administration
│   └── common/          # Composants partagés
├── pages/               # Pages de l'application
│   ├── admin/          # Pages d'administration
│   └── public/         # Pages publiques
├── hooks/               # Hooks React personnalisés
├── contexts/            # Contextes React (Auth, Cart)
├── lib/                # Utilitaires et configurations
├── types/              # Définitions TypeScript
└── styles/             # Styles globaux
```

## 🚀 Installation & Développement

### **Prérequis**
- Node.js 18+ ([installer avec nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn
- Compte Supabase (pour la base de données)

### **Installation locale**

```bash
# Cloner le repository
git clone https://github.com/GESTIONMAX/react-wp-gear-shop.git
cd react-wp-gear-shop

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# Démarrer le serveur de développement
npm run dev
```

### **Variables d'environnement**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### **Scripts disponibles**
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript
```

## 📊 Base de Données

### **Schema Principal**
```sql
-- Produits et variantes
products              # Produits principaux
├── product_variants  # Variantes (couleurs, tailles, SKU)
├── product_images    # Images des produits
└── variant_images    # Images des variantes

-- Organisation
categories            # Catégories de produits
collections          # Collections thématiques

-- E-commerce
orders               # Commandes
order_items          # Articles commandés
shopping_cart        # Panier utilisateur
wishlist_items       # Liste de souhaits

-- Utilisateurs
profiles             # Profils utilisateurs
suppliers            # Fournisseurs
```

### **Migrations Supabase**
Les migrations sont versionnées dans `/supabase/migrations/` avec :
- Tables et relations
- Politiques de sécurité RLS
- Fonctions et triggers
- Index de performance

## 🎯 Fonctionnalités Avancées

### **Gestion des Images**
- **Upload avec drag & drop**
- **Compression automatique** (WebP, qualité optimisée)
- **Redimensionnement intelligent**
- **CDN Supabase Storage**
- **Lazy loading** pour les performances

### **Recherche & Filtres**
- **Recherche full-text** dans les produits
- **Filtres multi-critères** (prix, catégorie, couleur)
- **Tri dynamique** (prix, popularité, nouveautés)
- **Pagination optimisée**

### **Admin Dashboard**
- **Métriques temps réel** (ventes, visiteurs, conversions)
- **Graphiques interactifs** avec Nivo (Bar Charts, Line Charts)
- **Exports de données** (CSV, PDF)
- **Gestion des stocks** avec alertes
- **Système de notifications**

### **Performance & SEO**
- **Code splitting** automatique
- **Lazy loading** des composants
- **Meta tags dynamiques** avec React Helmet
- **Sitemap automatique**
- **Optimisation Core Web Vitals**

## 🔐 Sécurité

### **Frontend**
- **Validation des formulaires** avec Zod
- **Sanitisation des inputs**
- **Protection XSS**
- **HTTPS obligatoire**

### **Backend**
- **Row Level Security (RLS)** Supabase
- **Authentification JWT**
- **Chiffrement des données sensibles**
- **Audit logs** des actions admin

## 📱 Responsive Design

### **Breakpoints Tailwind**
```css
sm: 640px   # Mobile large
md: 768px   # Tablet
lg: 1024px  # Desktop
xl: 1280px  # Large desktop
2xl: 1536px # Extra large
```

### **Composants Adaptatifs**
- Navigation mobile avec menu hamburger
- Grilles produits responsive
- Modales et formulaires optimisés touch
- Images adaptatives avec srcset

## 🚀 Déploiement

### **Production (Vercel)**
```bash
# Build automatique sur push main
git push origin main

# Ou déploiement manuel
npm run build
vercel --prod
```

### **Variables d'environnement Production**
- `VITE_SUPABASE_URL` - URL de production Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `VITE_STRIPE_PUBLISHABLE_KEY` - Clé publique Stripe

### **Domaine personnalisé**
Le site est configuré pour `mytechgear.eu` avec :
- SSL automatique
- CDN global Vercel
- Compression gzip/brotli
- Cache optimisé

## 📈 Performances

### **Métriques Core Web Vitals**
- **LCP** < 1.2s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)

### **Optimisations**
- Bundle size optimisé (~150KB gzipped)
- Images WebP avec fallback
- Lazy loading intelligent
- Service Worker pour le cache
- Preloading des routes critiques

## 🧪 Tests

### **Configuration**
```bash
# Tests unitaires (à venir)
npm run test

# Tests e2e avec Playwright (à venir)
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🤝 Contribution

### **Guidelines**
1. **Branching** : Feature branches depuis `main`
2. **Commits** : Messages conventionnels (feat, fix, docs)
3. **TypeScript** : Typage strict obligatoire
4. **ESLint** : Configuration stricte respectée
5. **Tests** : Coverage minimum 80%

### **Processus**
```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Développer et tester
npm run dev
npm run lint
npm run type-check

# Commit et push
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request
```

## 📚 Documentation

### **Ressources**
- [**Supabase Docs**](https://supabase.com/docs) - Backend et base de données
- [**shadcn/ui**](https://ui.shadcn.com/) - Composants UI
- [**Tailwind CSS**](https://tailwindcss.com/docs) - Framework CSS
- [**React Query**](https://tanstack.com/query/latest) - Gestion d'état serveur

### **APIs**
- `/docs/api` - Documentation des endpoints
- `/docs/components` - Guide des composants
- `/docs/deployment` - Guide de déploiement

## 🐛 Support & Issues

### **Rapporter un bug**
1. Vérifier les [issues existantes](https://github.com/GESTIONMAX/react-wp-gear-shop/issues)
2. Créer une nouvelle issue avec :
   - Description détaillée
   - Étapes de reproduction
   - Screenshots si applicable
   - Environnement (OS, navigateur)

### **Demander une fonctionnalité**
Utiliser le template "Feature Request" avec :
- Cas d'usage détaillé
- Bénéfices attendus
- Maquettes/wireframes si disponibles

## 📄 License

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

### **Développement**
- **Lead Developer** : [GESTIONMAX](https://github.com/GESTIONMAX)
- **UI/UX Design** : Équipe interne
- **Backend Architecture** : Supabase + Vercel

### **Contact**
- **Email** : contact@mytechgear.eu
- **Website** : [MyTechGear.eu](https://mytechgear.eu)
- **Support** : [GitHub Issues](https://github.com/GESTIONMAX/react-wp-gear-shop/issues)

---

## 📈 Migration Recharts → Nivo

### **Problème résolu**
Recharts présentait des problèmes de compatibilité avec React 18.3.1 :
- Erreurs liées aux React internals
- Problèmes d'hydration SSR
- Warnings de performance

### **Solution adoptée**
Migration complète vers **Nivo 0.99.0** :
- ✅ **TopProductsChart.tsx** → ResponsiveBar
- ✅ **SalesChart.tsx** → ResponsiveLine
- ✅ **Suppression complète** de Recharts
- ✅ **Bundle optimisé** (-20 dépendances)

### **Avantages**
- 🚀 **Performances améliorées**
- 🔧 **100% compatible React 18**
- 🎨 **Thèmes cohérents** avec Tailwind CSS
- 📱 **SSR optimisé** sans hydration issues
- 💡 **API moderne** et TypeScript-friendly

---

## 📚 Documentation Technique

### **Architecture & Stack**

L'application utilise une stack moderne et performante :

- **Frontend** : React 18.3.1 + TypeScript 5.8.3 + Vite 7.1.6
- **UI Components** : shadcn/ui + Tailwind CSS 3.4.17
- **Charts & Analytics** : Nivo 0.99.0 (migration depuis Recharts)
- **State Management** : React Query + Context API
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Déploiement** : Vercel avec CDN global

### **Sécurité et Audits**

L'application respecte les meilleures pratiques de sécurité :

- ✅ **0 vulnérabilités** de sécurité (npm audit)
- ✅ **Dépendances à jour** et compatibles React 18.3
- ✅ **Migration Recharts → Nivo** pour résoudre les problèmes React 18 internals
- ✅ **Code propre** sans références externes
- ✅ **Bundle optimisé** avec code splitting
- ✅ **Métadonnées SEO** personnalisées et conformes

---

## 🎉 Fonctionnalités à venir

### **Q1 2025**
- [ ] Application mobile React Native
- [ ] Mode sombre complet
- [ ] Chat client en temps réel
- [ ] Programme de fidélité
- [ ] Recommandations IA

### **Q2 2025**
- [ ] Multi-langue (EN, DE, ES)
- [ ] Réalité augmentée (essayage virtuel)
- [ ] Intégration IoT lunettes
- [ ] Marketplace multi-vendeurs
- [ ] API publique

---

⭐ **Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

**Made with ❤️ by GESTIONMAX Team**
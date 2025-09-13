# 🌍 Guide Système de Traduction MyTechGear

## Configuration Actuelle

✅ **Langues supportées :**
- 🇫🇷 Français (langue par défaut)
- 🇬🇧 Anglais
- 🇪🇸 Espagnol  
- 🇩🇪 Allemand
- 🇮🇹 Italien

## Structure des Fichiers

```
src/i18n/
├── config.ts              # Configuration principale i18next
├── locales/
│   ├── fr.json            # Traductions françaises
│   ├── en.json            # Traductions anglaises
│   ├── es.json            # Traductions espagnoles
│   ├── de.json            # Traductions allemandes
│   └── it.json            # Traductions italiennes
└── hooks/
    └── useLanguage.ts     # Hook personnalisé pour la langue
```

## Utilisation dans les Composants

### Import basique
```tsx
import { useTranslation } from 'react-i18next';

const MonComposant = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('navigation.home')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
};
```

### Avec pluralisation
```tsx
const { t } = useTranslation();

// Affichage automatique singulier/pluriel selon le count
<p>{t('cart.itemCount', { count: items.length })}</p>
```

### Hook personnalisé pour la gestion des langues
```tsx
import { useLanguage } from '@/hooks/useLanguage';

const MonComposant = () => {
  const { 
    changeLanguage, 
    getCurrentLanguage,
    getLanguageFlag,
    getLanguageName 
  } = useLanguage();
  
  return (
    <button onClick={() => changeLanguage('en')}>
      {getLanguageFlag('en')} {getLanguageName('en')}
    </button>
  );
};
```

## Structure des Clés de Traduction

```json
{
  "navigation": {
    "home": "Accueil",
    "sport": "Sport"
  },
  "common": {
    "loading": "Chargement...",
    "addToCart": "Ajouter au panier"
  },
  "home": {
    "hero": {
      "title": "Titre principal",
      "subtitle": "Sous-titre"
    }
  }
}
```

## Composants Intégrés

### ✅ Header
- Navigation multilingue
- Sélecteur de langue avec drapeaux
- Recherche traduite

### ✅ LanguageSelector
- Menu déroulant avec drapeaux
- Changement instantané de langue
- Sauvegarde automatique dans localStorage

## État de l'Implémentation

### ✅ Terminé
- Configuration i18next complète
- 5 langues européennes configurées
- Hook personnalisé useLanguage
- Composant LanguageSelector
- Header traduit avec sélecteur de langue
- Détection automatique de la langue du navigateur
- Sauvegarde de la préférence dans localStorage

### 🔄 En Cours
- Traduction des pages principales (Sport, Lifestyle, Prismatic)
- Traduction du panier et checkout

### 📋 À Faire
- Traduction complète de tous les composants
- Traduction des messages d'erreur et notifications
- Traduction du contenu admin
- Traduction des articles de blog
- Format des dates selon la locale
- Format des devises selon la région
- Gestion des directions RTL (si arabe ajouté plus tard)

## Ajout d'une Nouvelle Langue

1. **Ajouter la langue dans config.ts :**
```tsx
export const supportedLanguages = {
  // ... langues existantes
  pt: { name: 'Português', flag: '🇵🇹' }
};

const resources = {
  // ... ressources existantes
  pt: {
    translation: ptTranslation,
  }
};
```

2. **Créer le fichier de traduction :**
```bash
src/i18n/locales/pt.json
```

3. **Importer dans config.ts :**
```tsx
import ptTranslation from './locales/pt.json';
```

## Bonnes Pratiques

### Nommage des Clés
- Utilisez une hiérarchie logique (navigation.home, common.loading)
- Soyez descriptif : `home.hero.title` plutôt que `h1`
- Groupez par contexte d'usage

### Gestion des Variables
```tsx
// ✅ Bon
t('cart.itemCount', { count: 5 })
// Résultat: "5 articles"

// ✅ Pluralisation automatique
"itemCount": "{{count}} article",
"itemCount_plural": "{{count}} articles"
```

### Fallbacks
```tsx
// ✅ Toujours prévoir un fallback
{t('common.search') || 'Rechercher des produits...'}
```

## Performance et SEO

- **Lazy Loading :** Les traductions se chargent à la demande
- **SEO :** Générer des URLs spécifiques par langue (`/fr/sport`, `/en/sport`)
- **Métadonnées :** Traduire title, description, mots-clés
- **Sitemap :** Générer un sitemap multilingue

## Prochaines Étapes Recommandées

1. **Priorité Haute :**
   - Finir la traduction des pages produits
   - Traduire le processus de checkout complet
   - Ajouter les traductions aux composants ProductCard et ProductVariantCard

2. **Priorité Moyenne :**
   - Implémenter les URLs multilingues
   - Traduire l'interface admin
   - Format des prix selon la région (€, $, £)

3. **Priorité Basse :**
   - Ajouter plus de langues (portugais, néerlandais)
   - Système de traduction automatique pour le contenu dynamique
   - Interface de gestion des traductions pour les admins

## Test de l'Implémentation

Le sélecteur de langue est maintenant visible dans le header. Testez :
1. Changez de langue via le sélecteur
2. Rechargez la page (préférence sauvegardée)
3. Vérifiez la navigation traduite
4. Testez sur mobile

**Système prêt pour une expansion européenne ! 🚀**
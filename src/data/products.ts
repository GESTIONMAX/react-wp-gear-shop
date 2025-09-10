import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'SPORT',
    slug: 'sport',
    description: 'Performance et usages sportifs, notamment cyclisme'
  },
  {
    id: '2',
    name: 'LIFESTYLE',
    slug: 'lifestyle',
    description: 'Design élégant, usage citadin moderne et innovant'
  },
  {
    id: '3',
    name: 'PRISMATIC',
    slug: 'prismatic',
    description: 'Technologie de verres à couleur réglable, style marquant'
  }
];

export const products: Product[] = [
  // Collection SPORT - MyTechGear Lunettes
  {
    id: '1',
    name: 'Music Shield',
    slug: 'music-shield',
    description: 'Lunettes sportives avec audio intégré pour cyclistes. Protection UV totale, ajustement automatique de la teinte et son immersif pour vos performances sportives.',
    shortDescription: 'Lunettes sportives avec audio intégré',
    price: 299,
    salePrice: 269,
    images: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'SPORT',
    tags: ['Sport', 'Audio', 'Cyclisme', 'UV'],
    inStock: true,
    stockQuantity: 15,
    variants: [
      {
        id: '1-1',
        name: 'Music Shield Noir Mat + Smoke Lenses',
        price: 299,
        salePrice: 269,
        inStock: true,
        attributes: { color: 'Noir Mat', lenses: 'Smoke Lenses', audio: 'Oui' }
      },
      {
        id: '1-2',
        name: 'Music Shield Bleu + Fire',
        price: 299,
        salePrice: 269,
        inStock: true,
        attributes: { color: 'Bleu', lenses: 'Fire', audio: 'Oui' }
      },
      {
        id: '1-3',
        name: 'Music Shield Neon + Alpha Purple',
        price: 319,
        salePrice: 289,
        inStock: true,
        attributes: { color: 'Neon', lenses: 'Alpha Purple', audio: 'Oui' }
      }
    ],
    features: [
      'Audio stéréo intégré pour cyclisme',
      'Ajustement automatique de la teinte',
      'Protection UV 100%',
      'Résistance IP65',
      'Autonomie 8 heures'
    ],
    specifications: {
      'Collection': 'SPORT',
      'Audio': 'Stéréo intégré',
      'Autonomie': '8 heures',
      'Charge': '2 heures',
      'Protection': 'UV 100% + IP65',
      'Transmittance': '15-85%'
    }
  },
  {
    id: '2',
    name: 'Falcon',
    slug: 'falcon',
    description: 'Lunettes de performance pour sportifs exigeants. Design aérodynamique, verres adaptatifs ultra-rapides et confort optimal pour les longues sessions d\'entraînement.',
    shortDescription: 'Lunettes de performance sportive',
    price: 249,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'SPORT',
    tags: ['Sport', 'Performance', 'Cyclisme'],
    inStock: true,
    stockQuantity: 20,
    variants: [
      {
        id: '2-1',
        name: 'Falcon Blanc + Smoke',
        price: 249,
        inStock: true,
        attributes: { color: 'Blanc', lenses: 'Smoke', audio: 'Non' }
      },
      {
        id: '2-2',
        name: 'Falcon Obsidian + Rouge',
        price: 249,
        inStock: true,
        attributes: { color: 'Obsidian', lenses: 'Rouge', audio: 'Non' }
      }
    ],
    features: [
      'Design aérodynamique ultra-léger',
      'Verres adaptatifs rapides (0,3s)',
      'Ajustement nasal premium',
      'Anti-buée intégré',
      'Certification sportive'
    ],
    specifications: {
      'Collection': 'SPORT',
      'Vitesse d\'ajustement': '0,3 secondes',
      'Protection': 'UV 100%',
      'Poids': '28 grammes',
      'Matériaux': 'TR90 + Titane'
    }
  },
  {
    id: '3',
    name: 'Shield',
    slug: 'shield',
    description: 'Lunettes sport protection maximale avec audio optionnel. Conçues pour les sports extrêmes avec résistance renforcée et technologie adaptative avancée.',
    shortDescription: 'Lunettes sport protection maximale',
    price: 329,
    salePrice: 299,
    images: [
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556306535-38b7b5077bb8?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'SPORT',
    tags: ['Sport', 'Protection', 'Audio', 'Extrême'],
    inStock: true,
    stockQuantity: 12,
    variants: [
      {
        id: '3-1',
        name: 'Shield Noir Mat + Smoke + Audio',
        price: 329,
        salePrice: 299,
        inStock: true,
        attributes: { color: 'Noir Mat', lenses: 'Smoke', audio: 'Oui' }
      },
      {
        id: '3-2',
        name: 'Shield Gold + Fire sans Audio',
        price: 279,
        salePrice: 249,
        inStock: true,
        attributes: { color: 'Gold', lenses: 'Fire', audio: 'Non' }
      }
    ],
    features: [
      'Protection maximale renforcée',
      'Audio stéréo optionnel',
      'Résistance aux chocs IP67',
      'Verres incassables',
      'Design sport extrême'
    ],
    specifications: {
      'Collection': 'SPORT',
      'Résistance': 'IP67 + Anti-choc',
      'Audio': 'Optionnel intégré',
      'Protection': 'Maximale UV + Impact',
      'Certification': 'Sports extrêmes'
    }
  },
  // Collection LIFESTYLE
  {
    id: '4',
    name: 'Prime',
    slug: 'prime',
    description: 'Lunettes connectées élégantes pour l\'usage quotidien urbain. Design sophistiqué, technologie discrète et fonctionnalités smart pour le lifestyle moderne.',
    shortDescription: 'Lunettes connectées lifestyle premium',
    price: 399,
    salePrice: 359,
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'LIFESTYLE',
    tags: ['Lifestyle', 'Connecté', 'Urbain', 'Premium'],
    inStock: true,
    stockQuantity: 12,
    variants: [
      {
        id: '4-1',
        name: 'Prime Gold + Alpha Blue',
        price: 399,
        salePrice: 359,
        inStock: true,
        attributes: { color: 'Gold', lenses: 'Alpha Blue' }
      },
      {
        id: '4-2',
        name: 'Prime Noir Mat + Calm Lenses',
        price: 399,
        salePrice: 359,
        inStock: true,
        attributes: { color: 'Noir Mat', lenses: 'Calm Lenses' }
      }
    ],
    features: [
      'Connectivité smartphone discrète',
      'Design urbain sophistiqué',
      'Verres adaptatifs intelligents',
      'Contrôles tactiles intégrés',
      'Mode nuit automatique'
    ],
    specifications: {
      'Collection': 'LIFESTYLE',
      'Connectivité': 'Bluetooth 5.2',
      'Autonomie': '12 heures',
      'Charge': '1,5 heures',
      'Contrôles': 'Tactiles + Vocaux'
    }
  },
  {
    id: '5',
    name: 'Duck Classic',
    slug: 'duck-classic',
    description: 'Lunettes lifestyle au design intemporel avec touches modernes connectées. Parfait équilibre entre élégance classique et innovation technologique discrète.',
    shortDescription: 'Lunettes lifestyle classique connecté',
    price: 349,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'LIFESTYLE',
    tags: ['Lifestyle', 'Classique', 'Élégant', 'Connecté'],
    inStock: true,
    stockQuantity: 16,
    variants: [
      {
        id: '5-1',
        name: 'Duck Classic Blanc + Rose',
        price: 349,
        inStock: true,
        attributes: { color: 'Blanc', lenses: 'Rose' }
      },
      {
        id: '5-2',
        name: 'Duck Classic Obsidian + Calm Lenses',
        price: 349,
        inStock: true,
        attributes: { color: 'Obsidian', lenses: 'Calm Lenses' }
      }
    ],
    features: [
      'Design intemporel élégant',
      'Connectivité discrète intégrée',
      'Confort premium toute la journée',
      'Verres adaptatifs lifestyle',
      'Finitions haut de gamme'
    ],
    specifications: {
      'Collection': 'LIFESTYLE',
      'Design': 'Intemporel premium',
      'Connectivité': 'Bluetooth discret',
      'Autonomie': '14 heures',
      'Matériaux': 'Acétate premium'
    }
  },
  {
    id: '6',
    name: 'Dragon',
    slug: 'dragon',
    description: 'Lunettes lifestyle haut de gamme avec technologie de pointe. Interface utilisateur avancée, design premium et fonctionnalités connectées pour l\'innovation au quotidien.',
    shortDescription: 'Lunettes lifestyle innovation premium',
    price: 599,
    salePrice: 549,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1565598380269-c85f559d1c19?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'LIFESTYLE',
    tags: ['Premium', 'Innovation', 'Connecté', 'Lifestyle'],
    inStock: true,
    stockQuantity: 8,
    variants: [
      {
        id: '6-1',
        name: 'Dragon Obsidian + Fire',
        price: 599,
        salePrice: 549,
        inStock: true,
        attributes: { color: 'Obsidian', lenses: 'Fire' }
      },
      {
        id: '6-2',
        name: 'Dragon Gold + Rose',
        price: 599,
        salePrice: 549,
        inStock: true,
        attributes: { color: 'Gold', lenses: 'Rose' }
      }
    ],
    features: [
      'Interface utilisateur avancée',
      'Twin Tip Charging Cable inclus',
      'IA adaptive environnementale',
      'Design premium ultra-léger',
      'Écosystème connecté complet'
    ],
    specifications: {
      'Collection': 'LIFESTYLE',
      'IA': 'Adaptive environnementale',
      'Autonomie': '16 heures',
      'Charge rapide': '30 min = 6h',
      'Câble': 'Twin Tip inclus'
    }
  },
  // Collection PRISMATIC
  {
    id: '7',
    name: 'Aura',
    slug: 'aura',
    description: 'Lunettes prismatiques à couleur réglable pour un style unique. Technologie de verres révolutionnaire permettant de changer la couleur selon l\'humeur et l\'environnement.',
    shortDescription: 'Lunettes prismatiques à couleur réglable',
    price: 449,
    salePrice: 399,
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'PRISMATIC',
    tags: ['Prismatic', 'Innovation', 'Style', 'Couleur'],
    inStock: true,
    stockQuantity: 10,
    variants: [
      {
        id: '7-1',
        name: 'Aura Blanc + Prismatic Full Range',
        price: 449,
        salePrice: 399,
        inStock: true,
        attributes: { color: 'Blanc', lenses: 'Prismatic Full Range' }
      },
      {
        id: '7-2',
        name: 'Aura Neon + Prismatic Rainbow',
        price: 469,
        salePrice: 419,
        inStock: true,
        attributes: { color: 'Neon', lenses: 'Prismatic Rainbow' }
      }
    ],
    features: [
      'Verres à couleur réglable en temps réel',
      'Palette prismatique complète',
      'Contrôle via app mobile',
      'Effets lumineux personnalisés',
      'Style avant-gardiste'
    ],
    specifications: {
      'Collection': 'PRISMATIC',
      'Couleurs disponibles': '16,7 millions',
      'Vitesse changement': '0,1 seconde',
      'Contrôle': 'App mobile + Tactile',
      'Autonomie': '10 heures'
    }
  },
  {
    id: '8',
    name: 'Euphoria',
    slug: 'euphoria',
    description: 'L\'innovation ultime en lunettes prismatiques. Effets visuels spectaculaires, synchronisation musicale et expérience immersive unique pour les trendsetter.',
    shortDescription: 'Lunettes prismatiques avec effets immersifs',
    price: 699,
    salePrice: 629,
    images: [
      'https://images.unsplash.com/photo-1556306535-38b7b5077bb8?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'PRISMATIC',
    tags: ['Prismatic', 'Premium', 'Immersif', 'Tendance'],
    inStock: true,
    stockQuantity: 6,
    variants: [
      {
        id: '8-1',
        name: 'Euphoria Obsidian + Hypnotic Prismatic',
        price: 699,
        salePrice: 629,
        inStock: true,
        attributes: { color: 'Obsidian', lenses: 'Hypnotic Prismatic' }
      },
      {
        id: '8-2',
        name: 'Euphoria Gold + Cosmic Prismatic',
        price: 699,
        salePrice: 629,
        inStock: true,
        attributes: { color: 'Gold', lenses: 'Cosmic Prismatic' }
      }
    ],
    features: [
      'Synchronisation musicale avancée',
      'Effets prismatiques hypnotiques',
      'Réalité augmentée intégrée',
      'Mode festival et événements',
      'Design futuriste exclusif'
    ],
    specifications: {
      'Collection': 'PRISMATIC',
      'Synchronisation': 'Audio + Rythme',
      'Effets': 'Hypnotique + Cosmic',
      'AR intégrée': 'Basique',
      'Autonomie': '8 heures intensif'
    }
  }
];
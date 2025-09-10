import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Derniers smartphones et accessoires mobiles'
  },
  {
    id: '2',
    name: 'Ordinateurs',
    slug: 'ordinateurs',
    description: 'PC portables, de bureau et composants'
  },
  {
    id: '3',
    name: 'Audio',
    slug: 'audio',
    description: 'Écouteurs, enceintes et équipements audio'
  },
  {
    id: '4',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Consoles, jeux et accessoires gaming'
  },
  {
    id: '5',
    name: 'Lunettes',
    slug: 'lunettes',
    description: 'Lunettes connectées et sportives MyTechGear'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Le smartphone le plus avancé d\'Apple avec puce A17 Pro, caméra 48MP et écran Super Retina XDR de 6,7 pouces. Design en titane ultra-léger et résistant.',
    shortDescription: 'Smartphone Apple avec puce A17 Pro et caméra 48MP',
    price: 1479,
    salePrice: 1399,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1695048133158-cb4466d15d85?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Smartphones',
    tags: ['Apple', 'iOS', 'Premium', 'Camera'],
    inStock: true,
    stockQuantity: 15,
    variants: [
      {
        id: '1-1',
        name: 'Titane Naturel 256GB',
        price: 1479,
        salePrice: 1399,
        inStock: true,
        attributes: { color: 'Titane Naturel', storage: '256GB' }
      },
      {
        id: '1-2',
        name: 'Titane Bleu 512GB',
        price: 1679,
        salePrice: 1599,
        inStock: true,
        attributes: { color: 'Titane Bleu', storage: '512GB' }
      }
    ],
    features: [
      'Puce A17 Pro avec GPU 6 cœurs',
      'Système de caméras Pro avec objectif 5x',
      'Écran Super Retina XDR de 6,7"',
      'Design en titane de qualité aérospatiale',
      'Action Button personnalisable'
    ],
    specifications: {
      'Écran': '6,7" Super Retina XDR OLED',
      'Processeur': 'Apple A17 Pro',
      'Stockage': '256GB - 1TB',
      'Caméra': '48MP Principal, 12MP Ultra Grand Angle',
      'Batterie': 'Jusqu\'à 29h de lecture vidéo'
    }
  },
  {
    id: '2',
    name: 'MacBook Pro 14" M3',
    slug: 'macbook-pro-14-m3',
    description: 'MacBook Pro avec puce M3 révolutionnaire, écran Liquid Retina XDR et jusqu\'à 22 heures d\'autonomie. Performance exceptionnelle pour les créatifs et professionnels.',
    shortDescription: 'Ordinateur portable Apple avec puce M3 et écran 14"',
    price: 2299,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Ordinateurs',
    tags: ['Apple', 'MacBook', 'M3', 'Professional'],
    inStock: true,
    stockQuantity: 8,
    variants: [
      {
        id: '2-1',
        name: 'M3 8-Core 512GB Gris Sidéral',
        price: 2299,
        inStock: true,
        attributes: { processor: 'M3 8-Core', storage: '512GB', color: 'Gris Sidéral' }
      },
      {
        id: '2-2',
        name: 'M3 Pro 10-Core 1TB Argent',
        price: 2799,
        inStock: true,
        attributes: { processor: 'M3 Pro 10-Core', storage: '1TB', color: 'Argent' }
      }
    ],
    features: [
      'Puce Apple M3 avec CPU 8 cœurs',
      'Écran Liquid Retina XDR 14,2"',
      'Jusqu\'à 22 heures d\'autonomie',
      'Magic Keyboard rétroéclairé',
      'Touch ID intégré'
    ],
    specifications: {
      'Écran': '14,2" Liquid Retina XDR',
      'Processeur': 'Apple M3',
      'Mémoire': '8GB - 128GB RAM unifiée',
      'Stockage': '512GB - 8TB SSD',
      'Ports': '3x Thunderbolt 4, HDMI, MagSafe 3'
    }
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    description: 'Écouteurs sans fil avec réduction de bruit active adaptative, son spatial personnalisé et jusqu\'à 6 heures d\'écoute. Boîtier de charge USB-C inclus.',
    shortDescription: 'Écouteurs sans fil Apple avec réduction de bruit',
    price: 279,
    salePrice: 249,
    images: [
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1625225233840-695456021cde?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Audio',
    tags: ['Apple', 'Wireless', 'ANC', 'Premium'],
    inStock: true,
    stockQuantity: 25,
    features: [
      'Réduction de bruit active adaptative',
      'Son spatial personnalisé avec suivi des mouvements',
      'Mode Transparence adaptatif',
      'Jusqu\'à 6h d\'écoute (30h avec le boîtier)',
      'Résistance à la sueur et à l\'eau IPX4'
    ],
    specifications: {
      'Autonomie': '6h (écouteurs) + 30h (boîtier)',
      'Connectivité': 'Bluetooth 5.3',
      'Résistance': 'IPX4',
      'Charge': 'Lightning, USB-C, Qi wireless',
      'Poids': '5,3g par écouteur'
    }
  },
  {
    id: '4',
    name: 'PlayStation 5 Slim',
    slug: 'playstation-5-slim',
    description: 'Console de jeu nouvelle génération avec SSD ultra-rapide, ray tracing matériel et manette DualSense avec retour haptique. Design compact 30% plus petit.',
    shortDescription: 'Console de jeux Sony nouvelle génération',
    price: 549,
    salePrice: 499,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Gaming',
    tags: ['Sony', 'PlayStation', 'Gaming', 'Console'],
    inStock: true,
    stockQuantity: 12,
    variants: [
      {
        id: '4-1',
        name: 'PS5 Slim 1TB Standard',
        price: 549,
        salePrice: 499,
        inStock: true,
        attributes: { type: 'Standard', storage: '1TB' }
      },
      {
        id: '4-2',
        name: 'PS5 Slim 1TB Digital Edition',
        price: 449,
        salePrice: 399,
        inStock: true,
        attributes: { type: 'Digital', storage: '1TB' }
      }
    ],
    features: [
      'SSD ultra-rapide avec temps de chargement instantanés',
      'Ray tracing matériel pour des visuels photoréalistes',
      'Manette DualSense avec retour haptique',
      'Audio 3D Tempest pour une immersion totale',
      '30% plus compact que la PS5 originale'
    ],
    specifications: {
      'CPU': 'AMD Zen 2 8-core 3.5GHz',
      'GPU': 'AMD RDNA 2 10.28 TFLOPS',
      'Mémoire': '16GB GDDR6',
      'Stockage': '1TB SSD NVMe',
      'Résolution': 'Jusqu\'à 4K@120fps'
    }
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Smartphone Android haut de gamme avec S Pen intégré, caméra 200MP avec zoom 100x, écran Dynamic AMOLED 2X 6,8" et intelligence artificielle Galaxy AI.',
    shortDescription: 'Smartphone Samsung avec S Pen et caméra 200MP',
    price: 1419,
    salePrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Smartphones',
    tags: ['Samsung', 'Android', 'S Pen', 'Camera'],
    inStock: true,
    stockQuantity: 18,
    variants: [
      {
        id: '5-1',
        name: 'Noir Titane 256GB',
        price: 1419,
        salePrice: 1299,
        inStock: true,
        attributes: { color: 'Noir Titane', storage: '256GB' }
      },
      {
        id: '5-2',
        name: 'Violet Titane 512GB',
        price: 1619,
        salePrice: 1499,
        inStock: true,
        attributes: { color: 'Violet Titane', storage: '512GB' }
      }
    ],
    features: [
      'S Pen intégré pour productivité avancée',
      'Caméra 200MP avec zoom optique 10x',
      'Galaxy AI pour traduction et résumés intelligents',
      'Écran Dynamic AMOLED 2X 6,8" 120Hz',
      'Cadre en titane de qualité armure'
    ],
    specifications: {
      'Écran': '6,8" Dynamic AMOLED 2X QHD+',
      'Processeur': 'Snapdragon 8 Gen 3',
      'Stockage': '256GB - 1TB',
      'Caméra': '200MP + 50MP + 12MP + 10MP',
      'Batterie': '5000mAh avec charge 45W'
    }
  },
  {
    id: '6',
    name: 'Dell XPS 13 Plus',
    slug: 'dell-xps-13-plus',
    description: 'Ultrabook premium avec écran InfinityEdge 13,4", processeurs Intel Core de 12ème génération, design minimaliste et clavier capacitif innovant.',
    shortDescription: 'Ultrabook Dell premium avec écran InfinityEdge',
    price: 1399,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Ordinateurs',
    tags: ['Dell', 'Ultrabook', 'Intel', 'Premium'],
    inStock: true,
    stockQuantity: 10,
    features: [
      'Écran InfinityEdge 13,4" OLED disponible',
      'Processeurs Intel Core de 12ème génération',
      'Clavier capacitif avec barre tactile',
      'Design CNC en aluminium usiné',
      'Certification EPEAT Gold'
    ],
    specifications: {
      'Écran': '13,4" FHD+ ou OLED 3.5K',
      'Processeur': 'Intel Core i5/i7 12ème gen',
      'Mémoire': '8GB - 32GB LPDDR5',
      'Stockage': '256GB - 2TB SSD',
      'Poids': 'À partir de 1,23kg'
    }
  },
  // Collection SPORT - MyTechGear Lunettes
  {
    id: '7',
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
    category: 'Lunettes',
    tags: ['Sport', 'Audio', 'Cyclisme', 'UV'],
    inStock: true,
    stockQuantity: 15,
    variants: [
      {
        id: '7-1',
        name: 'Music Shield Noir Mat + Smoke Lenses',
        price: 299,
        salePrice: 269,
        inStock: true,
        attributes: { color: 'Noir Mat', lenses: 'Smoke Lenses', audio: 'Oui' }
      },
      {
        id: '7-2',
        name: 'Music Shield Bleu + Fire',
        price: 299,
        salePrice: 269,
        inStock: true,
        attributes: { color: 'Bleu', lenses: 'Fire', audio: 'Oui' }
      },
      {
        id: '7-3',
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
    id: '8',
    name: 'Falcon',
    slug: 'falcon',
    description: 'Lunettes de performance pour sportifs exigeants. Design aérodynamique, verres adaptatifs ultra-rapides et confort optimal pour les longues sessions d\'entraînement.',
    shortDescription: 'Lunettes de performance sportive',
    price: 249,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&h=600&fit=crop&crop=center'
    ],
    category: 'Lunettes',
    tags: ['Sport', 'Performance', 'Cyclisme'],
    inStock: true,
    stockQuantity: 20,
    variants: [
      {
        id: '8-1',
        name: 'Falcon Blanc + Smoke',
        price: 249,
        inStock: true,
        attributes: { color: 'Blanc', lenses: 'Smoke', audio: 'Non' }
      },
      {
        id: '8-2',
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
  // Collection LIFESTYLE
  {
    id: '9',
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
    category: 'Lunettes',
    tags: ['Lifestyle', 'Connecté', 'Urbain', 'Premium'],
    inStock: true,
    stockQuantity: 12,
    variants: [
      {
        id: '9-1',
        name: 'Prime Gold + Alpha Blue',
        price: 399,
        salePrice: 359,
        inStock: true,
        attributes: { color: 'Gold', lenses: 'Alpha Blue' }
      },
      {
        id: '9-2',
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
    id: '10',
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
    category: 'Lunettes',
    tags: ['Premium', 'Innovation', 'Connecté', 'Lifestyle'],
    inStock: true,
    stockQuantity: 8,
    variants: [
      {
        id: '10-1',
        name: 'Dragon Obsidian + Fire',
        price: 599,
        salePrice: 549,
        inStock: true,
        attributes: { color: 'Obsidian', lenses: 'Fire' }
      },
      {
        id: '10-2',
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
    id: '11',
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
    category: 'Lunettes',
    tags: ['Prismatic', 'Innovation', 'Style', 'Couleur'],
    inStock: true,
    stockQuantity: 10,
    variants: [
      {
        id: '11-1',
        name: 'Aura Blanc + Prismatic Full Range',
        price: 449,
        salePrice: 399,
        inStock: true,
        attributes: { color: 'Blanc', lenses: 'Prismatic Full Range' }
      },
      {
        id: '11-2',
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
    id: '12',
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
    category: 'Lunettes',
    tags: ['Prismatic', 'Premium', 'Immersif', 'Tendance'],
    inStock: true,
    stockQuantity: 6,
    variants: [
      {
        id: '12-1',
        name: 'Euphoria Obsidian + Hypnotic Prismatic',
        price: 699,
        salePrice: 629,
        inStock: true,
        attributes: { color: 'Obsidian', lenses: 'Hypnotic Prismatic' }
      },
      {
        id: '12-2',
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
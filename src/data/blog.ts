import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  // Articles SPORT
  {
    id: 'sport-1',
    title: 'Les lunettes connectées révolutionnent le cyclisme professionnel',
    slug: 'lunettes-connectees-cyclisme-professionnel',
    excerpt: 'Découvrez comment les cyclistes professionnels utilisent les lunettes connectées pour améliorer leurs performances et optimiser leur entraînement.',
    content: 'Article complet sur l\'utilisation des lunettes connectées dans le cyclisme...',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Marc Dubois',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Sport',
      slug: 'sport'
    },
    tags: ['Cyclisme', 'Performance', 'Technologie'],
    publishedAt: '2024-01-15',
    readingTime: 8,
    seo: {
      metaTitle: 'Lunettes connectées cyclisme professionnel | Guide 2024',
      metaDescription: 'Comment les cyclistes pros utilisent les lunettes connectées pour améliorer performances. Guide complet avec tests et recommandations.'
    }
  },
  {
    id: 'sport-2',
    title: 'Trail running : comment choisir ses lunettes connectées',
    slug: 'trail-running-choisir-lunettes-connectees',
    excerpt: 'Guide complet pour choisir les meilleures lunettes connectées adaptées au trail running et aux sports outdoor.',
    content: 'Guide détaillé pour le trail running...',
    featuredImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Sport',
      slug: 'sport'
    },
    tags: ['Trail Running', 'Outdoor', 'Guide d\'achat'],
    publishedAt: '2024-01-10',
    readingTime: 6
  },
  {
    id: 'sport-3',
    title: 'Audio intégré vs écouteurs : le débat pour les sportifs',
    slug: 'audio-integre-vs-ecouteurs-sportifs',
    excerpt: 'Comparatif détaillé entre l\'audio intégré dans les lunettes connectées et les écouteurs traditionnels pour le sport.',
    content: 'Comparatif audio pour sportifs...',
    featuredImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Thomas Leroy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Sport',
      slug: 'sport'
    },
    tags: ['Audio', 'Comparatif', 'Sport'],
    publishedAt: '2024-01-05',
    readingTime: 7
  },

  // Articles LIFESTYLE
  {
    id: 'lifestyle-1',
    title: 'Lunettes connectées au bureau : productivité et style',
    slug: 'lunettes-connectees-bureau-productivite',
    excerpt: 'Comment intégrer les lunettes connectées dans votre quotidien professionnel pour allier style, confort et productivité.',
    content: 'Guide pour l\'utilisation professionnelle...',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Claire Rousseau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Lifestyle',
      slug: 'lifestyle'
    },
    tags: ['Bureau', 'Productivité', 'Style'],
    publishedAt: '2024-01-12',
    readingTime: 5,
    seo: {
      metaTitle: 'Lunettes connectées bureau | Productivité et style professionnel',
      metaDescription: 'Optimisez votre productivité au bureau avec les lunettes connectées. Guide complet style, confort et fonctionnalités pro.'
    }
  },
  {
    id: 'lifestyle-2',
    title: 'Tendances 2024 : les lunettes connectées deviennent mainstream',
    slug: 'tendances-2024-lunettes-connectees-mainstream',
    excerpt: 'Analyse des dernières tendances en matière de lunettes connectées et leur adoption croissante dans le lifestyle quotidien.',
    content: 'Analyse des tendances 2024...',
    featuredImage: 'https://images.unsplash.com/photo-1556306535-38b7b5077bb8?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Antoine Moreau',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Lifestyle',
      slug: 'lifestyle'
    },
    tags: ['Tendances', '2024', 'Mode'],
    publishedAt: '2024-01-08',
    readingTime: 9
  },
  {
    id: 'lifestyle-3',
    title: 'Smart glasses et vie urbaine : le guide du citadin connecté',
    slug: 'smart-glasses-vie-urbaine-guide',
    excerpt: 'Comment les lunettes connectées transforment l\'expérience urbaine : navigation, notifications et interactions sociales.',
    content: 'Guide pour la vie urbaine connectée...',
    featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Émilie Durand',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Lifestyle',
      slug: 'lifestyle'
    },
    tags: ['Urbain', 'Navigation', 'Smart City'],
    publishedAt: '2024-01-03',
    readingTime: 6
  },

  // Articles PRISMATIC
  {
    id: 'prismatic-1',
    title: 'La révolution des verres prismatiques : science et innovation',
    slug: 'revolution-verres-prismatiques-science',
    excerpt: 'Plongez dans la technologie révolutionnaire des verres prismatiques et découvrez comment ils changent la couleur en temps réel.',
    content: 'Explication scientifique des verres prismatiques...',
    featuredImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Dr. Jean Petit',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Prismatic',
      slug: 'prismatic'
    },
    tags: ['Innovation', 'Science', 'Technologie'],
    publishedAt: '2024-01-14',
    readingTime: 10,
    seo: {
      metaTitle: 'Verres prismatiques révolutionnaires | Science et innovation',
      metaDescription: 'Découvrez la technologie des verres prismatiques qui changent de couleur. Science, innovation et applications futures expliquées.'
    }
  },
  {
    id: 'prismatic-2',
    title: 'Festival fashion : les lunettes prismatiques font sensation',
    slug: 'festival-fashion-lunettes-prismatiques',
    excerpt: 'Retour sur l\'impact des lunettes prismatiques dans l\'univers des festivals et de la mode avant-gardiste.',
    content: 'Impact des lunettes prismatiques dans la mode...',
    featuredImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Luna Silva',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Prismatic',
      slug: 'prismatic'
    },
    tags: ['Festival', 'Mode', 'Avant-garde'],
    publishedAt: '2024-01-09',
    readingTime: 4
  },
  {
    id: 'prismatic-3',
    title: 'Customisation infinie : créez vos propres effets prismatiques',
    slug: 'customisation-effets-prismatiques',
    excerpt: 'Tutoriel complet pour créer et personnaliser vos effets prismatiques via l\'application mobile dédiée.',
    content: 'Guide de customisation des effets...',
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&crop=center',
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    category: {
      name: 'Prismatic',
      slug: 'prismatic'
    },
    tags: ['Customisation', 'Tutorial', 'App'],
    publishedAt: '2024-01-01',
    readingTime: 8
  }
];

// Fonction utilitaire pour filtrer les articles par catégorie
export const getBlogPostsByCategory = (categorySlug: string): BlogPost[] => {
  return blogPosts.filter(post => post.category.slug === categorySlug);
};
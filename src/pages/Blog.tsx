import React from 'react';
import BlogGrid from '@/components/BlogGrid';
import { BlogPost, BlogCategory } from '@/types/blog';

// Données de démonstration - à remplacer par l'API Strapi
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Les dernières tendances tech 2025',
    slug: 'tendances-tech-2025',
    excerpt: 'Découvrez les innovations technologiques qui vont marquer cette année. De l\'IA aux objets connectés, tour d\'horizon des tendances incontournables.',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    author: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150'
    },
    category: {
      name: 'Technologie',
      slug: 'technologie'
    },
    tags: ['tech', 'innovation', 'IA'],
    publishedAt: '2025-01-15T10:00:00Z',
    readingTime: 5
  },
  {
    id: '2',
    title: 'Guide d\'achat : Smartphone 2025',
    slug: 'guide-achat-smartphone-2025',
    excerpt: 'Comment choisir le smartphone parfait ? Nos experts vous guident à travers les critères essentiels pour faire le bon choix.',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    author: {
      name: 'Marc Dubois',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    category: {
      name: 'Guides',
      slug: 'guides'
    },
    tags: ['smartphone', 'guide', 'achat'],
    publishedAt: '2025-01-12T14:30:00Z',
    readingTime: 8
  },
  {
    id: '3',
    title: 'Test : MacBook Pro M4',
    slug: 'test-macbook-pro-m4',
    excerpt: 'Notre test complet du nouveau MacBook Pro M4. Performance, autonomie, design - tout ce qu\'il faut savoir avant d\'acheter.',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    author: {
      name: 'Julie Larsson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    category: {
      name: 'Tests',
      slug: 'tests'
    },
    tags: ['apple', 'macbook', 'test'],
    publishedAt: '2025-01-10T09:15:00Z',
    readingTime: 12
  },
  {
    id: '4',
    title: 'Sécurité informatique : 10 conseils essentiels',
    slug: 'securite-informatique-conseils',
    excerpt: 'Protégez vos données et votre vie privée avec ces 10 conseils de sécurité informatique. Des bases aux techniques avancées.',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    author: {
      name: 'Thomas Bernard',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    category: {
      name: 'Sécurité',
      slug: 'securite'
    },
    tags: ['sécurité', 'conseils', 'protection'],
    publishedAt: '2025-01-08T16:20:00Z',
    readingTime: 6
  },
  {
    id: '5',
    title: 'Gaming : Les meilleures configs 2025',
    slug: 'gaming-meilleures-configs-2025',
    excerpt: 'Découvrez les configurations gaming recommandées pour tous les budgets. Du PC d\'entrée de gamme au setup ultime.',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    author: {
      name: 'Antoine Rousseau',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    category: {
      name: 'Gaming',
      slug: 'gaming'
    },
    tags: ['gaming', 'PC', 'config'],
    publishedAt: '2025-01-05T11:45:00Z',
    readingTime: 10
  },
  {
    id: '6',
    title: 'Écologie et tech : Vers un numérique durable',
    slug: 'ecologie-tech-numerique-durable',
    excerpt: 'Comment concilier innovation technologique et respect de l\'environnement ? Focus sur les initiatives pour un numérique plus vert.',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    author: {
      name: 'Emma Leroy',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'
    },
    category: {
      name: 'Écologie',
      slug: 'ecologie'
    },
    tags: ['écologie', 'durable', 'environnement'],
    publishedAt: '2025-01-03T13:10:00Z',
    readingTime: 7
  }
];

const mockCategories: BlogCategory[] = [
  { id: '1', name: 'Technologie', slug: 'technologie', postsCount: 12 },
  { id: '2', name: 'Guides', slug: 'guides', postsCount: 8 },
  { id: '3', name: 'Tests', slug: 'tests', postsCount: 15 },
  { id: '4', name: 'Sécurité', slug: 'securite', postsCount: 6 },
  { id: '5', name: 'Gaming', slug: 'gaming', postsCount: 10 },
  { id: '6', name: 'Écologie', slug: 'ecologie', postsCount: 4 }
];

const Blog: React.FC = () => {
  const featuredPost = mockPosts[0]; // Premier article comme article vedette
  const regularPosts = mockPosts.slice(1);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* SEO Meta Tags */}
      <title>Blog Tech - MyTechGear</title>

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-merriweather text-4xl md:text-5xl font-bold mb-6">
              Blog Tech
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Actualités, guides d'achat, tests produits et conseils d'experts pour rester à la pointe de la technologie
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">✨ Articles exclusifs</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🔬 Tests approfondis</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">💡 Conseils d'experts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <BlogGrid 
              posts={regularPosts}
              categories={mockCategories}
              featuredPost={featuredPost}
              showFilters={true}
              showFeatured={true}
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
            <p className="text-muted-foreground mb-8">
              Recevez nos derniers articles et guides directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                S'abonner
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Pas de spam, vous pouvez vous désabonner à tout moment
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
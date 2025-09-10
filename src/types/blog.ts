// Types pour le blog - Structure temporaire en attendant le schéma Strapi
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
  publishedAt: string;
  readingTime?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postsCount?: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
}
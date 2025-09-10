import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { BlogPost, BlogCategory, BlogFilters } from '@/types/blog';

interface BlogGridProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  isLoading?: boolean;
  featuredPost?: BlogPost;
  showFilters?: boolean;
  showFeatured?: boolean;
}

const BlogGrid: React.FC<BlogGridProps> = ({ 
  posts, 
  categories, 
  isLoading = false,
  featuredPost,
  showFilters = true,
  showFeatured = true
}) => {
  const [filters, setFilters] = useState<BlogFilters>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const filteredPosts = posts.filter(post => {
    if (filters.search && !post.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !post.excerpt.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && post.category.slug !== filters.category) {
      return false;
    }
    if (filters.tag && !post.tags.includes(filters.tag)) {
      return false;
    }
    return true;
  });

  const handleCategoryFilter = (categorySlug: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categorySlug ? undefined : categorySlug
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  if (isLoading) {
    return (
      <div className="space-y-8">
        {showFeatured && (
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg h-96"></div>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-t-lg"></div>
              <CardContent className="p-6 space-y-3">
                <div className="bg-muted h-4 rounded w-3/4"></div>
                <div className="bg-muted h-3 rounded w-full"></div>
                <div className="bg-muted h-3 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Article mis en avant */}
      {showFeatured && featuredPost && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">Article à la une</h2>
          <BlogCard post={featuredPost} variant="featured" />
        </section>
      )}

      {/* Filtres et recherche */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des articles..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center space-x-2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  <span>Effacer</span>
                </Button>
              )}
            </div>
          </div>

          {/* Panneau de filtres */}
          {showFiltersPanel && (
            <Card className="p-4 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Catégories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge
                        key={category.id}
                        variant={filters.category === category.slug ? "default" : "outline"}
                        className="cursor-pointer hover-scale transition-all"
                        onClick={() => handleCategoryFilter(category.slug)}
                      >
                        {category.name}
                        {category.postsCount && (
                          <span className="ml-1 text-xs">({category.postsCount})</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              {filters.category && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{categories.find(c => c.slug === filters.category)?.name}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
                  />
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>"{filters.search}"</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, search: undefined }))}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grille d'articles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post, index) => (
          <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <BlogCard post={post} />
          </div>
        ))}
      </div>

      {/* Message si aucun article */}
      {filteredPosts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucun article trouvé</p>
            <p className="text-sm">Essayez de modifier vos critères de recherche</p>
          </div>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Afficher tous les articles
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogGrid;
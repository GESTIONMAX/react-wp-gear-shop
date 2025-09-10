import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (variant === 'featured') {
    return (
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
        <div className="relative overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {post.category.name}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Link to={`/blog/${post.slug}`} className="block">
              <h2 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-primary-glow transition-colors">
                {post.title}
              </h2>
              <p className="text-white/90 line-clamp-2 mb-3">
                {post.excerpt}
              </p>
            </Link>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(post.author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{post.author.name}</p>
                <div className="flex items-center text-muted-foreground space-x-3">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(post.publishedAt)}
                  </span>
                  {post.readingTime && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readingTime} min
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex-1 min-w-0">
              <Badge variant="outline" className="mb-2 text-xs">
                {post.category.name}
              </Badge>
              <Link to={`/blog/${post.slug}`} className="block">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>
              <div className="flex items-center text-xs text-muted-foreground mt-2 space-x-3">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.publishedAt)}
                </span>
                {post.readingTime && (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readingTime} min
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {post.category.name}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <Link to={`/blog/${post.slug}`} className="block">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {post.excerpt}
        </p>
      </CardHeader>
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{post.author.name}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground space-x-3">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(post.publishedAt)}
          </span>
          {post.readingTime && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {post.readingTime} min
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
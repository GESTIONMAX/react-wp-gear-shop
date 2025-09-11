import React from 'react';
import { Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { BlogPost } from '@/types/blog';

interface BlogCarouselProps {
  posts: BlogPost[];
  title: string;
  subtitle?: string;
}

export const BlogCarousel: React.FC<BlogCarouselProps> = ({ posts, title, subtitle }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-merriweather text-3xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {posts.map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <BlogCard post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6" />
          </Carousel>
        </div>

        {/* Indicators pour mobile */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(posts.length / 1) }).map((_, index) => (
              <div 
                key={index} 
                className="h-2 w-2 rounded-full bg-muted-foreground/30"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {post.category.name}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author.name}</span>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readingTime} min</span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
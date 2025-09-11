import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

interface BlogCarouselProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
}

export const BlogCarousel = ({ posts, title = "Articles recommandés", subtitle }: BlogCarouselProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground">
            {subtitle || "Découvrez nos derniers articles et conseils"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.id} className="h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {typeof post.category === 'string' ? post.category : post.category.name}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex flex-col justify-between flex-1">
                <div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Par {typeof post.author === 'string' ? post.author : post.author.name}</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readingTime}
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Lire l'article
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
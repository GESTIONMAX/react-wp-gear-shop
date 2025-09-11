import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbProps {
  items?: BreadcrumbItem[];
}

export const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ items }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if none provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Accueil', href: '/' }];
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Custom labels for known routes
      const customLabels: Record<string, string> = {
        'sport': 'Sport',
        'lifestyle': 'Lifestyle',
        'prismatic': 'Prismatic',
        'blog': 'Blog',
        'auth': 'Connexion',
        'account': 'Mon compte',
        'checkout': 'Commande',
        'admin': 'Administration'
      };
      
      breadcrumbs.push({
        label: customLabels[segment] || label,
        href: index === pathSegments.length - 1 ? undefined : href
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length <= 1) return null;

  return (
    <div className="bg-muted/30 py-4">
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.href} className="flex items-center text-sm text-muted-foreground hover:text-primary">
                        {index === 0 && <Home className="h-4 w-4 mr-1" />}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-sm font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Package,
  FolderOpen,
  BarChart3,
  Settings,
  Users,
  ShoppingCart,
  Receipt,
  Layers3,
  Tags
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutGrid,
    description: 'Vue d\'ensemble'
  },
  {
    title: 'Produits',
    href: '/admin/products',
    icon: Package,
    description: 'Gestion des produits'
  },
  {
    title: 'Collections',
    href: '/admin/collections',
    icon: FolderOpen,
    description: 'Gestion des collections'
  },
  {
    title: 'Variantes',
    href: '/admin/variants',
    icon: Layers3,
    description: 'Gestion des variantes'
  },
  {
    title: 'Catégories',
    href: '/admin/categories',
    icon: Tags,
    description: 'Pour catégoriser (à venir)'
  },
  {
    title: 'Commandes',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Gestion des commandes'
  },
  {
    title: 'Factures',
    href: '/admin/invoices',
    icon: Receipt,
    description: 'Gestion des factures'
  },
  {
    title: 'Clients',
    href: '/admin/users',
    icon: Users,
    description: 'Gestion des clients'
  },
  {
    title: 'Statistiques',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Analyses et rapports'
  },
  {
    title: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configuration'
  }
];

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <div className={cn('flex flex-col h-full bg-background border-r', className)}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">MyTechGear</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href !== '/admin' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className={cn(
                'h-4 w-4 transition-colors',
                isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              <div className="flex-1">
                <div className={cn(
                  'font-medium',
                  isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'
                )}>
                  {item.title}
                </div>
                <div className={cn(
                  'text-xs opacity-75',
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>© 2025 MyTechGear</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
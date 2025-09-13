import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { MiniCart } from '@/components/MiniCart';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.sport'), href: '/sport' },
    { name: t('navigation.lifestyle'), href: '/lifestyle' },
    { name: t('navigation.prismatic'), href: '/prismatic' },
    { name: t('navigation.blog'), href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MT</span>
              </div>
              <span className="font-merriweather font-bold text-xl text-primary">
                MyTechGear
              </span>
            </Link>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('common.search') || 'Rechercher des produits...'}
                className="pl-10 pr-4 bg-muted/50 border-0 focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Account */}
            {!loading && (
              user ? (
                <div className="flex items-center space-x-1">
                  <span className="hidden lg:block text-sm text-muted-foreground mr-2">
                    {user.email?.split('@')[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title={t('navigation.account')}
                  >
                    <Link to="/account">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    title={t('account.logout')}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  title={t('navigation.login')}
                >
                  <Link to="/auth">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )
            )}

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>{t('cart.title')}</SheetTitle>
                  <SheetDescription>
                    {t('cart.emptyDescription') || 'Articles sélectionnés pour votre commande'}
                  </SheetDescription>
                </SheetHeader>
                <MiniCart onClose={() => setIsCartOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('common.search') || 'Rechercher des produits...'}
                className="pl-10 pr-10 bg-muted/50 border-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 pb-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              {item.name}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
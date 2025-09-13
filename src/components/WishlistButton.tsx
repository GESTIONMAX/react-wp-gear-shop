import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsInWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  variantId?: string;
  className?: string;
  size?: 'sm' | 'lg' | 'icon';
  variant?: 'ghost' | 'outline' | 'default';
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variantId,
  className,
  size = 'icon',
  variant = 'ghost',
  showText = false
}) => {
  const { data: isInWishlist, isLoading } = useIsInWishlist(productId, variantId);
  const toggleWishlist = useToggleWishlist();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist.mutate({
      productId,
      variantId,
      isInWishlist: !!isInWishlist,
    });
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    lg: 'h-12 w-12',
    icon: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    lg: 'h-5 w-5',
    icon: 'h-4 w-4'
  };

  if (showText) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleToggle}
        disabled={isLoading || toggleWishlist.isPending}
        className={cn(
          'gap-2',
          isInWishlist && 'text-red-500 hover:text-red-600',
          className
        )}
      >
        <Heart 
          className={cn(
            iconSizes[size],
            isInWishlist && 'fill-current'
          )}
        />
        {isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggle}
      disabled={isLoading || toggleWishlist.isPending}
      className={cn(
        sizeClasses[size],
        isInWishlist && 'text-red-500 hover:text-red-600',
        'transition-colors duration-200',
        className
      )}
      title={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          isInWishlist && 'fill-current',
          'transition-all duration-200'
        )}
      />
    </Button>
  );
};
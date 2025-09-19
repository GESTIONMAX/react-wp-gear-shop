import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageData {
  url: string;
  alt?: string;
  type?: string;
}

interface ProductImageCarouselProps {
  images: ImageData[];
  productName?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  productName = '',
  className,
  autoPlay = false,
  autoPlayInterval = 4000
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  // Scroll thumbnails into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedIndex]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            goToPrevious();
            break;
          case 'ArrowRight':
            goToNext();
            break;
          case 'Escape':
            setIsFullscreen(false);
            break;
          case ' ':
            e.preventDefault();
            toggleAutoPlay();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious, toggleAutoPlay]);

  if (!images || images.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-0 aspect-square bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
              📷
            </div>
            <p>Aucune image disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <Card className="overflow-hidden group">
          <CardContent className="p-0 relative">
            <div
              className="aspect-square relative cursor-pointer"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={toggleFullscreen}
            >
              <img
                src={currentImage.url}
                alt={currentImage.alt || `${productName} - Image ${selectedIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Image type badge */}
              {currentImage.type && (
                <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                  {currentImage.type}
                </Badge>
              )}

              {/* Navigation controls */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Control buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {images.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/50 text-white hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAutoPlay();
                    }}
                  >
                    {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {selectedIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div
            ref={thumbnailsRef}
            className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pb-2"
          >
            {images.map((image, index) => (
              <Card
                key={index}
                className={cn(
                  "cursor-pointer overflow-hidden transition-all flex-shrink-0",
                  selectedIndex === index
                    ? 'ring-2 ring-primary scale-105'
                    : 'hover:scale-102 opacity-70 hover:opacity-100'
                )}
                onClick={() => setSelectedIndex(index)}
              >
                <CardContent className="p-0">
                  <img
                    src={image.url}
                    alt={image.alt || `${productName} thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  selectedIndex === index
                    ? 'bg-primary scale-125'
                    : 'bg-muted hover:bg-muted-foreground/50'
                )}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/20 text-white hover:bg-white/30"
              onClick={toggleFullscreen}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white hover:bg-white/30"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 text-white hover:bg-white/30"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Main fullscreen image */}
            <img
              src={currentImage.url}
              alt={currentImage.alt || `${productName} fullscreen`}
              className="max-w-full max-h-full object-contain"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            {/* Controls bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 text-white px-4 py-2 rounded-full">
              <span className="text-sm">{selectedIndex + 1} / {images.length}</span>

              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleAutoPlay}
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* Keyboard hints */}
            <div className="absolute bottom-4 right-4 text-white/70 text-xs">
              <div>← → : Navigation</div>
              <div>Espace : Play/Pause</div>
              <div>Esc : Fermer</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageCarousel;
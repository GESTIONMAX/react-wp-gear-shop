import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Edit, ArrowUpDown } from 'lucide-react';
import { useProductImages, useProductImageOperations, ProductImage } from '@/hooks/useProductImages';
import { toast } from '@/hooks/use-toast';

interface ProductImageGalleryProps {
  productId: string;
  productName?: string;
  onImageDeleted?: () => void;
  onImageOrderChanged?: () => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  productId,
  productName,
  onImageDeleted,
  onImageOrderChanged
}) => {
  const { images, loading: loadingImages, refetch } = useProductImages({ productId });
  const { deleteImage, updateImageMetadata, loading: operationLoading } = useProductImageOperations();

  const handleDeleteImage = async (image: ProductImage) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette image ?\n\nType: ${image.type}\nContexte: ${image.context || 'N/A'}`)) {
      return;
    }

    const success = await deleteImage(image.id, image.storage_path);
    if (success) {
      await refetch();
      onImageDeleted?.();
    }
  };

  const handleReorderImage = async (imageId: string, direction: 'up' | 'down') => {
    const currentImage = images.find(img => img.id === imageId);
    if (!currentImage) return;

    const currentOrder = currentImage.sort_order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

    // Trouver l'image à échanger
    const targetImage = images.find(img => img.sort_order === targetOrder);
    if (!targetImage) return;

    try {
      // Échanger les ordres
      await updateImageMetadata(currentImage.id, { sort_order: targetOrder });
      await updateImageMetadata(targetImage.id, { sort_order: currentOrder });

      await refetch();
      onImageOrderChanged?.();

      toast({
        title: "Ordre modifié",
        description: "L'ordre des images a été mis à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'ordre des images.",
        variant: "destructive",
      });
    }
  };

  const getImageTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      main: 'Principale',
      gallery: 'Galerie',
      thumbnail: 'Vignette',
      hero: 'Héro',
      detail: 'Détail',
      lifestyle: 'Style de vie',
      packaging: 'Emballage'
    };
    return types[type] || type;
  };

  const getImageContextLabel = (context: string | undefined) => {
    if (!context) return 'N/A';

    const contexts: Record<string, string> = {
      studio: 'Studio',
      lifestyle: 'Style de vie',
      detail: 'Détail',
      packaging: 'Emballage',
      outdoor: 'Extérieur'
    };
    return contexts[context] || context;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      main: 'bg-blue-100 text-blue-800',
      gallery: 'bg-purple-100 text-purple-800',
      thumbnail: 'bg-green-100 text-green-800',
      hero: 'bg-red-100 text-red-800',
      detail: 'bg-yellow-100 text-yellow-800',
      lifestyle: 'bg-pink-100 text-pink-800',
      packaging: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loadingImages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Chargement des images...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Images du produit
          {productName && <span className="text-sm font-normal text-muted-foreground"> - {productName}</span>}
          <Badge variant="outline" className="ml-2">{images.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucune image trouvée pour ce produit.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Images triées par ordre */}
            {images.map((image, index) => (
              <div key={image.id} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Image preview */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 relative rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || 'Image produit'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  </div>

                  {/* Image metadata et actions */}
                  <div className="flex-1 space-y-3">
                    {/* Badges et métadonnées */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getTypeColor(image.type)}>
                        {getImageTypeLabel(image.type)}
                      </Badge>
                      <Badge variant="outline">
                        {getImageContextLabel(image.context)}
                      </Badge>
                      <Badge variant="secondary">
                        Ordre: {image.sort_order}
                      </Badge>
                    </div>

                    {/* Alt text */}
                    {image.alt_text && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Alt:</strong> {image.alt_text}
                      </div>
                    )}

                    {/* Informations techniques */}
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <div className="font-mono truncate" title={image.storage_path}>
                        📁 {image.storage_path}
                      </div>
                      <div className="mt-1">
                        📅 Créé: {new Date(image.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(image.image_url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderImage(image.id, 'up')}
                        disabled={index === 0 || operationLoading}
                        title="Monter dans l'ordre"
                      >
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        ↑
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderImage(image.id, 'down')}
                        disabled={index === images.length - 1 || operationLoading}
                        title="Descendre dans l'ordre"
                      >
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        ↓
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image)}
                        disabled={operationLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {operationLoading ? 'Suppression...' : 'Supprimer'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageGallery;
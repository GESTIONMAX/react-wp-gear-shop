import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Edit } from 'lucide-react';
import { useVariantImages, useVariantImageOperations, VariantImage } from '@/hooks/useVariantImages';
import { toast } from '@/hooks/use-toast';

interface VariantImageGalleryProps {
  variantId: string;
  variantName?: string;
  onImageDeleted?: () => void;
}

const VariantImageGallery: React.FC<VariantImageGalleryProps> = ({
  variantId,
  variantName,
  onImageDeleted
}) => {
  const { images, loading: loadingImages, refetch } = useVariantImages({ variantId });
  const { deleteImage, loading: deletingImage } = useVariantImageOperations();

  const handleDeleteImage = async (image: VariantImage) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette image ?\n\nType: ${image.type}\nContexte: ${image.context || 'N/A'}`)) {
      return;
    }

    const success = await deleteImage(image.id, image.storage_path);
    if (success) {
      await refetch();
      onImageDeleted?.();
    }
  };

  const getImageTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      main: 'Principale',
      swatch: 'Échantillon',
      detail: 'Détail',
      lifestyle: 'Style de vie',
      packaging: 'Emballage',
      gallery: 'Galerie'
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
      swatch: 'bg-green-100 text-green-800',
      detail: 'bg-yellow-100 text-yellow-800',
      lifestyle: 'bg-purple-100 text-purple-800',
      packaging: 'bg-orange-100 text-orange-800',
      gallery: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loadingImages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images existantes</CardTitle>
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
          Images existantes
          {variantName && <span className="text-sm font-normal text-muted-foreground"> - {variantName}</span>}
          <Badge variant="outline" className="ml-2">{images.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucune image trouvée pour cette variante.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg p-4 space-y-3">
                {/* Image preview */}
                <div className="aspect-square relative rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Image variante'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png';
                    }}
                  />
                </div>

                {/* Image metadata */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge className={getTypeColor(image.type)}>
                      {getImageTypeLabel(image.type)}
                    </Badge>
                    <Badge variant="outline">
                      {getImageContextLabel(image.context)}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div>Ordre: {image.sort_order}</div>
                    {image.alt_text && (
                      <div className="truncate" title={image.alt_text}>
                        Alt: {image.alt_text}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(image.image_url, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage(image)}
                    disabled={deletingImage}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingImage ? 'Suppression...' : 'Supprimer'}
                  </Button>
                </div>

                {/* Storage path info */}
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  <div className="font-mono truncate" title={image.storage_path}>
                    {image.storage_path}
                  </div>
                  <div className="mt-1">
                    Créé: {new Date(image.created_at).toLocaleDateString('fr-FR')}
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

export default VariantImageGallery;
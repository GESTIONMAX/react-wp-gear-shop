import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ImageUploader from './ImageUploader';
import ProductImageGallery from './ProductImageGallery';
import { UploadedImage } from '@/types/storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProductImageUploaderProps {
  productId: string;
  productName?: string;
  onImagesUploaded?: (images: ProductImageData[]) => void;
}

interface ProductImageData {
  id?: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  type: string;
  context?: string;
  alt_text?: string;
  sort_order: number;
}

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  productId,
  productName,
  onImagesUploaded
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [imageType, setImageType] = useState<string>('main');
  const [imageContext, setImageContext] = useState<string>('studio');
  const [altText, setAltText] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0);

  const imageTypes = [
    { value: 'main', label: 'Image principale' },
    { value: 'gallery', label: 'Galerie' },
    { value: 'thumbnail', label: 'Vignette' },
    { value: 'hero', label: 'Image héro' },
    { value: 'detail', label: 'Détail produit' },
    { value: 'lifestyle', label: 'Style de vie' },
    { value: 'packaging', label: 'Emballage' }
  ];

  const imageContexts = [
    { value: 'studio', label: 'Studio' },
    { value: 'lifestyle', label: 'Style de vie' },
    { value: 'detail', label: 'Détail' },
    { value: 'packaging', label: 'Emballage' },
    { value: 'outdoor', label: 'Extérieur' }
  ];

  const handleImagesUploaded = (images: UploadedImage[]) => {
    setUploadedImages(images);
  };

  const saveToDatabase = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "Aucune image",
        description: "Veuillez d'abord uploader des images.",
        variant: "destructive",
      });
      return;
    }

    // Validation supplémentaire
    if (!productId) {
      toast({
        title: "Erreur de configuration",
        description: "ID de produit manquant.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const savedImages: ProductImageData[] = [];
    let uploadedCount = 0;

    try {
      // Récupérer le plus haut sort_order existant
      const { data: existingImages } = await supabase
        .from('product_images')
        .select('sort_order')
        .eq('product_id', productId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const maxSortOrder = existingImages && existingImages.length > 0
        ? existingImages[0].sort_order
        : -1;

      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];

        const productImageData: Omit<ProductImageData, 'id'> = {
          product_id: productId,
          image_url: image.url,
          storage_path: image.path,
          type: imageType,
          context: imageContext,
          alt_text: altText || `${productName} - ${imageType}`,
          sort_order: maxSortOrder + i + 1
        };

        const { data, error } = await supabase
          .from('product_images')
          .insert(productImageData)
          .select()
          .single();

        if (error) {
          console.error('Erreur insertion base de données:', error);
          throw new Error(`Erreur base de données: ${error.message}${error.code ? ` (${error.code})` : ''}`);
        }

        savedImages.push(data);
        uploadedCount++;
      }

      toast({
        title: "Images sauvegardées",
        description: `${uploadedCount}/${uploadedImages.length} image(s) ajoutée(s) au produit ${productName || 'sélectionné'}.`,
      });

      // Reset form
      setUploadedImages([]);
      setAltText('');

      onImagesUploaded?.(savedImages);

      // Force refresh of the gallery
      setRefreshGallery(prev => prev + 1);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: `Erreur de sauvegarde (${uploadedCount}/${uploadedImages.length} réussies)`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageDeleted = () => {
    setRefreshGallery(prev => prev + 1);
  };

  const handleImageOrderChanged = () => {
    setRefreshGallery(prev => prev + 1);
  };

  const uploadOptions = {
    generatePath: true,
    pathOptions: {
      productId
    }
  };

  return (
    <div className="space-y-6">
      {/* Gallery of existing images */}
      <ProductImageGallery
        key={refreshGallery} // Force re-render when images change
        productId={productId}
        productName={productName}
        onImageDeleted={handleImageDeleted}
        onImageOrderChanged={handleImageOrderChanged}
      />

      <Separator />

      {/* Upload new images */}
      <Card>
        <CardHeader>
          <CardTitle>
            Ajouter de nouvelles images
            {productName && <span className="text-sm font-normal text-muted-foreground"> - {productName}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration des métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type d'image</Label>
              <Select value={imageType} onValueChange={setImageType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {imageTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contexte</Label>
              <Select value={imageContext} onValueChange={setImageContext}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {imageContexts.map(context => (
                    <SelectItem key={context.value} value={context.value}>
                      {context.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Texte alternatif (optionnel)</Label>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder={`${productName} - ${imageType}`}
            />
          </div>

          {/* Upload des images */}
          <ImageUploader
            bucket="product-images"
            onImagesUploaded={handleImagesUploaded}
            initialImages={uploadedImages}
            maxImages={10}
            uploadOptions={uploadOptions}
          />

          {/* Actions */}
          {uploadedImages.length > 0 && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setUploadedImages([])}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                onClick={saveToDatabase}
                disabled={saving}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder en base'}
              </Button>
            </div>
          )}

          {/* Info sur les chemins */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Chemin de stockage :</strong> product-images/products/{productId}/
            <br />
            <strong>Types disponibles :</strong> Image principale, Galerie, Vignette, Héro, Détail, Style de vie, Emballage
            <br />
            <strong>Ordre automatique :</strong> Les nouvelles images sont ajoutées à la fin
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductImageUploader;
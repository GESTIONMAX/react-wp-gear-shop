import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from './ImageUploader';
import { UploadedImage } from '@/types/storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface VariantImageUploaderProps {
  productId: string;
  variantId: string;
  variantName?: string;
  onImagesUploaded?: (images: VariantImageData[]) => void;
}

interface VariantImageData {
  id?: string;
  variant_id: string;
  image_url: string;
  storage_path: string;
  type: string;
  context?: string;
  alt_text?: string;
  sort_order: number;
}

const VariantImageUploader: React.FC<VariantImageUploaderProps> = ({
  productId,
  variantId,
  variantName,
  onImagesUploaded
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [imageType, setImageType] = useState<string>('main');
  const [imageContext, setImageContext] = useState<string>('studio');
  const [altText, setAltText] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const imageTypes = [
    { value: 'main', label: 'Image principale' },
    { value: 'swatch', label: 'Échantillon couleur' },
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

    setSaving(true);
    const savedImages: VariantImageData[] = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];

        const variantImageData: Omit<VariantImageData, 'id'> = {
          variant_id: variantId,
          image_url: image.url,
          storage_path: image.path,
          type: imageType,
          context: imageContext,
          alt_text: altText || `${variantName} - ${imageType}`,
          sort_order: i
        };

        const { data, error } = await supabase
          .from('variant_images')
          .insert(variantImageData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        savedImages.push(data);
      }

      toast({
        title: "Images sauvegardées",
        description: `${savedImages.length} image(s) ajoutée(s) à la variante.`,
      });

      // Reset form
      setUploadedImages([]);
      setAltText('');

      onImagesUploaded?.(savedImages);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde en base de données.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const uploadOptions = {
    generatePath: true,
    pathOptions: {
      productId,
      variantId
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Upload images variante
          {variantName && <span className="text-sm font-normal text-muted-foreground"> - {variantName}</span>}
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
            placeholder={`${variantName} - ${imageType}`}
          />
        </div>

        {/* Upload des images */}
        <ImageUploader
          bucket="variant-images"
          onImagesUploaded={handleImagesUploaded}
          initialImages={uploadedImages}
          maxImages={5}
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
          <strong>Chemin de stockage :</strong> variant-images/products/{productId}/variants/{variantId}/
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantImageUploader;
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useImageUpload, UploadedImage } from '@/hooks/useImageUpload';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  bucket: 'products' | 'categories';
  onImagesUploaded: (images: UploadedImage[]) => void;
  initialImages?: UploadedImage[];
  maxImages?: number;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket,
  onImagesUploaded,
  initialImages = [],
  maxImages = 5,
  className
}) => {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const { uploadImage, deleteImage, uploading, progress } = useImageUpload(bucket);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);

    if (acceptedFiles.length > remainingSlots) {
      toast({
        title: "Limite d'images atteinte",
        description: `Vous ne pouvez uploader que ${remainingSlots} image(s) supplémentaire(s).`,
        variant: "destructive",
      });
    }

    for (const file of filesToUpload) {
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        const newImages = [...images, uploadedImage];
        setImages(newImages);
        onImagesUploaded(newImages);
      }
    }
  }, [images, maxImages, uploadImage, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    disabled: uploading || images.length >= maxImages
  });

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index];
    const success = await deleteImage(imageToRemove.path);
    
    if (success) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesUploaded(newImages);
    }
  };

  return (
    <div className={className}>
      {/* Zone de drop */}
      {images.length < maxImages && (
        <Card 
          {...getRootProps()} 
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <CardContent className="p-8 text-center">
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragActive 
                    ? 'Déposez les images ici...' 
                    : 'Glissez-déposez vos images ou cliquez pour sélectionner'
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, WebP jusqu'à 5MB • {images.length}/{maxImages} images
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barre de progression */}
      {uploading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Upload en cours...</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Images uploadées</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État vide */}
      {images.length === 0 && !uploading && (
        <div className="mt-4 text-center text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune image uploadée</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Loader2, FileImage } from 'lucide-react';
import { compressImage } from '@/utils/imageCompression';

interface CollectionImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
  collectionName: string;
  disabled?: boolean;
}

const CollectionImageUploader: React.FC<CollectionImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  collectionName,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCollectionSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image est trop volumineuse. Taille maximum : 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Compression intelligente
      console.log('Compression de l\'image...');
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.85
      });

      // Génération du nom de fichier unique
      const collectionSlug = generateCollectionSlug(collectionName || 'collection');
      const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `${collectionSlug}-${Date.now()}.${fileExtension}`;

      console.log(`Upload de l'image: ${fileName}`);

      // Suppression de l'ancienne image si elle existe
      if (currentImageUrl) {
        try {
          const urlParts = currentImageUrl.split('/');
          const oldFileName = urlParts[urlParts.length - 1];
          console.log(`Suppression de l'ancienne image: ${oldFileName}`);

          await supabase.storage
            .from('category-images')
            .remove([oldFileName]);
        } catch (error) {
          console.warn('Erreur lors de la suppression de l\'ancienne image:', error);
        }
      }

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw uploadError;
      }

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(fileName);

      console.log('Image uploadée avec succès:', publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Image uploadée",
        description: "L'image a été optimisée et uploadée avec succès.",
      });

    } catch (error) {
      console.error('Erreur upload image:', error);
      toast({
        title: "Erreur d'upload",
        description: `Impossible d'uploader l'image: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return;

    try {
      const urlParts = currentImageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from('category-images')
        .remove([fileName]);

      if (error) {
        console.warn('Erreur suppression storage:', error);
      }

      onImageRemoved();

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès.",
      });

    } catch (error) {
      console.error('Erreur suppression image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      {!currentImageUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div>
                <p className="text-sm font-medium">Optimisation en cours...</p>
                <p className="text-xs text-muted-foreground">
                  Compression et upload de l'image
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FileImage className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Glissez une image ici ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP • Max 10MB • Optimisation automatique
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Affichage de l'image actuelle */}
      {currentImageUrl && (
        <div className="space-y-3">
          <div className="relative group rounded-lg overflow-hidden">
            <img
              src={currentImageUrl}
              alt="Image de la collection"
              className="w-full max-w-md h-48 object-cover border transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled}
                title="Supprimer l'image"
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => !disabled && fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Remplacer l'image
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </div>
      )}

      {/* Informations d'optimisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-2 flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Optimisation automatique
          </div>
          <ul className="space-y-1 text-xs">
            <li>• Compression intelligente pour des temps de chargement rapides</li>
            <li>• Redimensionnement optimal (1200x800px max)</li>
            <li>• Qualité préservée à 85% pour un bon équilibre</li>
            <li>• Stockage sécurisé et CDN intégré</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollectionImageUploader;
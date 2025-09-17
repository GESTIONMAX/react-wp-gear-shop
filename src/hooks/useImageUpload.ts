import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { StorageBucket, StoragePathOptions, UploadedImage, StorageUploadOptions } from '@/types/storage';
import { StorageService } from '@/services/storageService';
import { ImageCompressor } from '@/utils/imageCompression';

export const useImageUpload = (bucket: StorageBucket) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);

  const uploadImage = async (
    file: File,
    options?: StorageUploadOptions
  ): Promise<UploadedImage | null> => {
    try {
      setUploading(true);
      setCompressing(true);
      setProgress(0);

      // Valider le fichier avec le service de stockage
      const validation = StorageService.validateFile(file, bucket);
      if (!validation.isValid) {
        toast({
          title: "Fichier invalide",
          description: validation.error,
          variant: "destructive",
        });
        return null;
      }

      // Compression automatique selon le bucket
      let fileToUpload = file;
      const originalSize = file.size;

      if (file.type.startsWith('image/')) {
        try {
          let compressionResult;

          // Choisir la compression selon le bucket
          if (bucket === 'variant-images') {
            compressionResult = await ImageCompressor.compressForVariant(file);
          } else {
            compressionResult = await ImageCompressor.compressImage(file,
              ImageCompressor.PRESETS.product);
          }

          fileToUpload = compressionResult.file;

          if (compressionResult.wasCompressed) {
            toast({
              title: "Image optimisée",
              description: `Taille réduite de ${ImageCompressor.formatFileSize(originalSize)} à ${ImageCompressor.formatFileSize(compressionResult.compressedSize)} (${Math.round((1 - 1/compressionResult.compressionRatio) * 100)}% de réduction)`,
            });
          }
        } catch (compressionError) {
          console.warn('Compression échouée, utilisation du fichier original:', compressionError);
        }
      }

      setCompressing(false);

      // Générer le chemin de fichier
      const fileName = options?.generatePath
        ? StorageService.generateFilePath(bucket, fileToUpload.name, options.pathOptions)
        : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileToUpload.name.split('.').pop()}`;

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Upload vers Supabase Storage avec le fichier optimisé
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload, {
          cacheControl: options?.cacheControl || '3600',
          upsert: options?.upsert || false
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Erreur upload:', error);
        toast({
          title: "Erreur d'upload",
          description: `${error.message}${fileToUpload.size > 50 * 1024 * 1024 ? ' (Fichier trop volumineux)' : ''}`,
          variant: "destructive",
        });
        return null;
      }

      setProgress(100);

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      });

      return {
        url: publicUrl,
        path: data.path,
        name: fileToUpload.name,
        bucket,
        size: fileToUpload.size,
        type: fileToUpload.type
      };

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setCompressing(false);
      setProgress(0);
    }
  };

  const deleteImage = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('Erreur suppression:', error);
        toast({
          title: "Erreur de suppression",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès.",
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  };

  const uploadMultipleImages = async (
    files: File[],
    options?: StorageUploadOptions
  ): Promise<UploadedImage[]> => {
    const results: UploadedImage[] = [];

    for (const file of files) {
      const result = await uploadImage(file, options);
      if (result) {
        results.push(result);
      }
    }

    return results;
  };

  const getBucketInfo = () => {
    return StorageService.getBucketConfig(bucket);
  };

  return {
    uploadImage,
    deleteImage,
    uploadMultipleImages,
    getBucketInfo,
    uploading,
    compressing,
    progress
  };
};
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UploadedImage {
  url: string;
  path: string;
  name: string;
}

export const useImageUpload = (bucket: 'products' | 'categories') => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File, path?: string): Promise<UploadedImage | null> => {
    try {
      setUploading(true);
      setProgress(0);

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5242880) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale autorisée est de 5MB.",
          variant: "destructive",
        });
        return null;
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format non supporté",
          description: "Seuls les formats JPEG, PNG et WebP sont autorisés.",
          variant: "destructive",
        });
        return null;
      }

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Erreur upload:', error);
        toast({
          title: "Erreur d'upload",
          description: error.message,
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
        name: file.name
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

  const uploadMultipleImages = async (files: File[]): Promise<UploadedImage[]> => {
    const results: UploadedImage[] = [];
    
    for (const file of files) {
      const result = await uploadImage(file);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  };

  return {
    uploadImage,
    deleteImage,
    uploadMultipleImages,
    uploading,
    progress
  };
};
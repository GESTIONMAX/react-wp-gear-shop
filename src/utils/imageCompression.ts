/**
 * Utilitaire de compression d'images
 * Optimise automatiquement les images avant upload
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxFileSize?: number; // en bytes
  outputFormat?: 'jpeg' | 'webp' | 'png';
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  wasCompressed: boolean;
}

export class ImageCompressor {
  // Configurations par défaut pour différents types d'images
  static readonly PRESETS = {
    // Images de variantes - qualité élevée mais optimisée
    variant: {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.85,
      maxFileSize: 2 * 1024 * 1024, // 2MB
      outputFormat: 'jpeg' as const
    },
    // Images produits principales - très haute qualité
    product: {
      maxWidth: 2400,
      maxHeight: 2400,
      quality: 0.9,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      outputFormat: 'jpeg' as const
    },
    // Images de galerie - équilibre qualité/taille
    gallery: {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.8,
      maxFileSize: 1.5 * 1024 * 1024, // 1.5MB
      outputFormat: 'jpeg' as const
    },
    // Échantillons/swatches - petite taille optimisée
    swatch: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.9,
      maxFileSize: 200 * 1024, // 200KB
      outputFormat: 'jpeg' as const
    }
  };

  /**
   * Compresse une image avec les options spécifiées
   */
  static async compressImage(
    file: File,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const originalSize = file.size;

    // Si le fichier est déjà assez petit, pas de compression
    if (options.maxFileSize && file.size <= options.maxFileSize * 0.8) {
      return {
        file,
        originalSize,
        compressedSize: file.size,
        compressionRatio: 1,
        wasCompressed: false
      };
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Impossible de créer le contexte canvas');

      // Charger l'image
      const img = await this.loadImage(file);

      // Calculer les nouvelles dimensions
      const { width, height } = this.calculateDimensions(
        img.width,
        img.height,
        options.maxWidth || 1920,
        options.maxHeight || 1920
      );

      // Configurer le canvas
      canvas.width = width;
      canvas.height = height;

      // Dessiner l'image redimensionnée
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en blob avec compression
      const outputFormat = options.outputFormat || 'jpeg';
      const quality = options.quality || 0.85;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Échec de la compression'));
        }, `image/${outputFormat}`, quality);
      });

      // Si la compression n'a pas réduit la taille suffisamment, essayer avec une qualité plus faible
      let finalBlob = blob;
      if (options.maxFileSize && blob.size > options.maxFileSize) {
        finalBlob = await this.compressAggressively(canvas, outputFormat, options.maxFileSize);
      }

      // Créer le nouveau fichier
      const extension = outputFormat === 'jpeg' ? '.jpg' : `.${outputFormat}`;
      const originalName = file.name.replace(/\.[^/.]+$/, '');
      const compressedFile = new File([finalBlob], `${originalName}${extension}`, {
        type: `image/${outputFormat}`,
        lastModified: Date.now()
      });

      return {
        file: compressedFile,
        originalSize,
        compressedSize: finalBlob.size,
        compressionRatio: originalSize / finalBlob.size,
        wasCompressed: true
      };

    } catch (error) {
      console.error('Erreur lors de la compression:', error);
      // En cas d'erreur, retourner le fichier original
      return {
        file,
        originalSize,
        compressedSize: file.size,
        compressionRatio: 1,
        wasCompressed: false
      };
    }
  }

  /**
   * Compresse une image spécifiquement pour les variantes
   */
  static async compressForVariant(file: File): Promise<CompressionResult> {
    return this.compressImage(file, this.PRESETS.variant);
  }

  /**
   * Compresse une image spécifiquement pour les échantillons/swatches
   */
  static async compressForSwatch(file: File): Promise<CompressionResult> {
    return this.compressImage(file, this.PRESETS.swatch);
  }

  /**
   * Charge une image depuis un fichier
   */
  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Impossible de charger l\'image'));
      };

      img.src = url;
    });
  }

  /**
   * Calcule les nouvelles dimensions en gardant le ratio
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Réduire si trop large
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    // Réduire si trop haut
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Compression agressive pour respecter la taille maximale
   */
  private static async compressAggressively(
    canvas: HTMLCanvasElement,
    format: string,
    maxSize: number
  ): Promise<Blob> {
    let quality = 0.8;
    let blob: Blob | null = null;

    // Essayer différentes qualités jusqu'à respecter la taille
    while (quality > 0.1) {
      blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Échec de la compression agressive'));
        }, `image/${format}`, quality);
      });

      if (blob.size <= maxSize) break;
      quality -= 0.1;
    }

    if (!blob) throw new Error('Impossible de compresser suffisamment l\'image');
    return blob;
  }

  /**
   * Obtient des informations sur un fichier image
   */
  static async getImageInfo(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    name: string;
  }> {
    const img = await this.loadImage(file);
    return {
      width: img.width,
      height: img.height,
      size: file.size,
      type: file.type,
      name: file.name
    };
  }

  /**
   * Formate la taille d'un fichier en format lisible
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}
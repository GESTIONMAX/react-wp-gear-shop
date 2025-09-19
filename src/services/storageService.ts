import { StorageBucket, StoragePathOptions, BUCKET_CONFIGS } from '@/types/storage';

export class StorageService {
  static generateFilePath(
    bucket: StorageBucket,
    fileName: string,
    options?: StoragePathOptions
  ): string {
    const fileExt = fileName.split('.').pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const baseFileName = `${timestamp}-${randomId}.${fileExt}`;

    switch (bucket) {
      case 'category-images':
        return this.generateCategoryPath(baseFileName, options);

      case 'product-images':
        return this.generateProductPath(baseFileName, options);

      case 'product-gallery':
        return this.generateProductGalleryPath(baseFileName, options);

      case 'variant-images':
        return this.generateVariantPath(baseFileName, options);

      case 'ui-assets':
        return this.generateUIAssetsPath(baseFileName, options);

      default:
        return baseFileName;
    }
  }

  private static generateCategoryPath(fileName: string, options?: StoragePathOptions): string {
    if (options?.categoryId) {
      const type = options.type || 'hero';
      return `categories/${options.categoryId}/${type}/${fileName}`;
    }
    return `categories/general/${fileName}`;
  }

  private static generateProductPath(fileName: string, options?: StoragePathOptions): string {
    if (options?.productId) {
      const type = options.type || 'main';
      return `products/${options.productId}/${type}/${fileName}`;
    }
    return `products/general/${fileName}`;
  }

  private static generateProductGalleryPath(fileName: string, options?: StoragePathOptions): string {
    if (options?.productId) {
      return `products/${options.productId}/gallery/${fileName}`;
    }
    return `gallery/general/${fileName}`;
  }

  private static generateVariantPath(fileName: string, options?: StoragePathOptions): string {
    if (options?.productId && options?.variantId) {
      return `products/${options.productId}/variants/${options.variantId}/${fileName}`;
    } else if (options?.productId) {
      return `products/${options.productId}/variants/general/${fileName}`;
    }
    return `variants/general/${fileName}`;
  }

  private static generateUIAssetsPath(fileName: string, options?: StoragePathOptions): string {
    const folder = options?.folder || 'general';
    const type = options.type || 'icon';
    return `ui/${folder}/${type}/${fileName}`;
  }

  static validateFile(file: File, bucket: StorageBucket): { isValid: boolean; error?: string } {
    const config = BUCKET_CONFIGS[bucket];

    if (file.size > config.maxFileSize) {
      const maxSizeMB = Math.round(config.maxFileSize / (1024 * 1024));
      return {
        isValid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB`
      };
    }

    if (!config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Type de fichier non supporté. Types autorisés: ${config.allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  static getBucketConfig(bucket: StorageBucket) {
    return BUCKET_CONFIGS[bucket];
  }

  static getPublicUrl(bucket: StorageBucket, path: string): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
    }

    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  static extractPathInfo(path: string, bucket: StorageBucket): StoragePathOptions | null {
    const pathParts = path.split('/');

    switch (bucket) {
      case 'category-images':
        if (pathParts.length >= 3 && pathParts[0] === 'categories') {
          return {
            categoryId: pathParts[1],
            type: pathParts[2] as 'main' | 'gallery' | 'thumbnail' | 'hero' | 'icon' | 'logo'
          };
        }
        break;

      case 'product-images':
      case 'product-gallery':
        if (pathParts.length >= 3 && pathParts[0] === 'products') {
          return {
            productId: pathParts[1],
            type: pathParts[2] as 'main' | 'gallery' | 'thumbnail' | 'hero' | 'icon' | 'logo'
          };
        }
        break;

      case 'variant-images':
        if (pathParts.length >= 4 && pathParts[0] === 'products' && pathParts[2] === 'variants') {
          return {
            productId: pathParts[1],
            variantId: pathParts[3]
          };
        }
        break;

      case 'ui-assets':
        if (pathParts.length >= 3 && pathParts[0] === 'ui') {
          return {
            folder: pathParts[1],
            type: pathParts[2] as 'main' | 'gallery' | 'thumbnail' | 'hero' | 'icon' | 'logo'
          };
        }
        break;
    }

    return null;
  }
}
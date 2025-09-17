export type StorageBucket =
  | 'category-images'
  | 'product-images'
  | 'product-gallery'
  | 'variant-images'
  | 'ui-assets';

export interface BucketConfig {
  id: StorageBucket;
  name: string;
  maxFileSize: number;
  allowedTypes: string[];
  description: string;
}

export const BUCKET_CONFIGS: Record<StorageBucket, BucketConfig> = {
  'category-images': {
    id: 'category-images',
    name: 'Images de catégories',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    description: 'Bannières et images héro des collections'
  },
  'product-images': {
    id: 'product-images',
    name: 'Images produits principales',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    description: 'Images principales des produits'
  },
  'product-gallery': {
    id: 'product-gallery',
    name: 'Galeries produits',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    description: 'Galeries photos des produits'
  },
  'variant-images': {
    id: 'variant-images',
    name: 'Images des variantes',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    description: 'Images spécifiques aux variantes de produits'
  },
  'ui-assets': {
    id: 'ui-assets',
    name: 'Ressources UI',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    description: 'Icônes, logos et éléments d\'interface'
  }
};

export interface StoragePathOptions {
  productId?: string;
  categoryId?: string;
  variantId?: string;
  type?: 'main' | 'gallery' | 'thumbnail' | 'hero' | 'icon' | 'logo';
  folder?: string;
}

export interface UploadedImage {
  url: string;
  path: string;
  name: string;
  bucket: StorageBucket;
  size: number;
  type: string;
}

export interface StorageUploadOptions {
  generatePath?: boolean;
  pathOptions?: StoragePathOptions;
  cacheControl?: string;
  upsert?: boolean;
}
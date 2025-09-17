import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from './ImageUploader';
import { UploadedImage } from '@/types/storage';

const StorageExamples: React.FC = () => {
  const [categoryImages, setCategoryImages] = useState<UploadedImage[]>([]);
  const [productImages, setProductImages] = useState<UploadedImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  const [variantImages, setVariantImages] = useState<UploadedImage[]>([]);
  const [uiAssets, setUiAssets] = useState<UploadedImage[]>([]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exemples d'utilisation des buckets de stockage</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="category" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="category">Catégories</TabsTrigger>
              <TabsTrigger value="product">Produits</TabsTrigger>
              <TabsTrigger value="gallery">Galerie</TabsTrigger>
              <TabsTrigger value="variant">Variantes</TabsTrigger>
              <TabsTrigger value="ui">Assets UI</TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Images de catégories</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bannières et images héro des collections (50MB max)
                </p>
                <ImageUploader
                  bucket="category-images"
                  onImagesUploaded={setCategoryImages}
                  initialImages={categoryImages}
                  maxImages={3}
                  uploadOptions={{
                    generatePath: true,
                    pathOptions: {
                      categoryId: 'cat_123',
                      type: 'hero'
                    }
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Images principales de produits</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Images principales des produits (50MB max)
                </p>
                <ImageUploader
                  bucket="product-images"
                  onImagesUploaded={setProductImages}
                  initialImages={productImages}
                  maxImages={5}
                  uploadOptions={{
                    generatePath: true,
                    pathOptions: {
                      productId: 'prod_456',
                      type: 'main'
                    }
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Galerie de produits</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Galeries photos des produits (50MB max)
                </p>
                <ImageUploader
                  bucket="product-gallery"
                  onImagesUploaded={setGalleryImages}
                  initialImages={galleryImages}
                  maxImages={10}
                  uploadOptions={{
                    generatePath: true,
                    pathOptions: {
                      productId: 'prod_456'
                    }
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="variant" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Images de variantes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Images spécifiques aux variantes de produits (50MB max)
                </p>
                <ImageUploader
                  bucket="variant-images"
                  onImagesUploaded={setVariantImages}
                  initialImages={variantImages}
                  maxImages={3}
                  uploadOptions={{
                    generatePath: true,
                    pathOptions: {
                      productId: 'prod_456',
                      variantId: 'var_789'
                    }
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="ui" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ressources UI</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Icônes, logos et éléments d'interface (10MB max)
                </p>
                <ImageUploader
                  bucket="ui-assets"
                  onImagesUploaded={setUiAssets}
                  initialImages={uiAssets}
                  maxImages={5}
                  uploadOptions={{
                    generatePath: true,
                    pathOptions: {
                      folder: 'icons',
                      type: 'icon'
                    }
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exemples de chemins générés */}
      <Card>
        <CardHeader>
          <CardTitle>Exemples de chemins générés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <strong>category-images:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                categories/cat_123/hero/1678901234-abc123.jpg
              </code>
            </div>
            <div>
              <strong>product-images:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                products/prod_456/main/1678901234-def456.jpg
              </code>
            </div>
            <div>
              <strong>product-gallery:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                products/prod_456/gallery/1678901234-ghi789.jpg
              </code>
            </div>
            <div>
              <strong>variant-images:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                products/prod_456/variants/var_789/1678901234-jkl012.jpg
              </code>
            </div>
            <div>
              <strong>ui-assets:</strong>
              <code className="block bg-muted p-2 rounded mt-1">
                ui/icons/icon/1678901234-mno345.svg
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageExamples;
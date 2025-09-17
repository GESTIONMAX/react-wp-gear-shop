import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreateProductData, UpdateProductData, useAdminCategories } from '@/hooks/useAdminProducts';
import ImageUploader from './ImageUploader';
import { UploadedImage } from '@/types/storage';
import { X, Plus } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'] & {
  images?: Array<{ image_url: string; alt_text?: string; sort_order?: number }>;
  category?: { id: string; name: string; slug: string } | null;
};

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number;
  category_id: string;
  in_stock: boolean;
  stock_quantity: number;
  tags: string[];
  features: string[];
  specifications: Record<string, string>;
  images: UploadedImage[];
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductData | UpdateProductData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false
}) => {
  const { data: categories = [] } = useAdminCategories();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [features, setFeatures] = useState<string[]>(product?.features || []);
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    (product?.specifications as Record<string, string>) || {}
  );
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      short_description: product?.short_description || '',
      price: product?.price || 0,
      sale_price: product?.sale_price || undefined,
      category_id: product?.category_id || '',
      in_stock: product?.in_stock ?? true,
      stock_quantity: product?.stock_quantity || 0,
    }
  });

  const watchName = watch('name');

  // Auto-génération du slug
  useEffect(() => {
    if (watchName && !isEditing) {
      const slug = watchName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchName, setValue, isEditing]);

  // Initialisation des images
  useEffect(() => {
    if (product?.images) {
      const initialImages: UploadedImage[] = product.images?.map((img) => ({
        url: img.image_url,
        path: img.image_url.split('/').pop() || '',
        name: img.alt_text || 'Image produit',
        bucket: 'product-images',
        size: 0,
        type: 'image/jpeg'
      }));
      setImages(initialImages);
    }
  }, [product]);

  const handleFormSubmit = (data: ProductFormData) => {
    const formData = {
      ...data,
      images: images.map(img => img.url),
      tags,
      features,
      specifications
    };

    if (isEditing && product) {
      onSubmit({ ...formData, id: product.id });
    } else {
      onSubmit(formData);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications({
        ...specifications,
        [newSpecKey.trim()]: newSpecValue.trim()
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Le nom est requis' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{String(errors.name.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                {...register('slug', { required: 'Le slug est requis' })}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{String(errors.slug.message)}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Description courte</Label>
            <Textarea
              id="short_description"
              rows={2}
              {...register('short_description')}
              placeholder="Description courte pour les listes de produits"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description complète</Label>
            <Textarea
              id="description"
              rows={6}
              {...register('description')}
              placeholder="Description détaillée du produit"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            bucket="product-images"
            onImagesUploaded={setImages}
            initialImages={images}
            maxImages={5}
            uploadOptions={{
              generatePath: true,
              pathOptions: {
                productId: product?.id,
                type: 'main'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Prix et stock */}
      <Card>
        <CardHeader>
          <CardTitle>Prix et inventaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (en centimes) *</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { 
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{String(errors.price.message)}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Ex: 1999 pour 19,99€
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Prix promotionnel (en centimes)</Label>
              <Input
                id="sale_price"
                type="number"
                {...register('sale_price', {
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Quantité en stock</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register('stock_quantity', {
                  min: { value: 0, message: 'La quantité doit être positive' }
                })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="in_stock"
              {...register('in_stock')}
            />
            <Label htmlFor="in_stock">Produit en stock</Label>
          </div>
        </CardContent>
      </Card>

      {/* Catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select 
              defaultValue={product?.category_id || "none"} 
              onValueChange={(value) => setValue('category_id', value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune catégorie</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeTag(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Caractéristiques */}
      <Card>
        <CardHeader>
          <CardTitle>Caractéristiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ajouter une caractéristique"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spécifications */}
      <Card>
        <CardHeader>
          <CardTitle>Spécifications techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-3">
            <Input
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="Nom de la spécification"
            />
            <Input
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Valeur"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
            />
            <Button type="button" onClick={addSpecification} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">
                  <strong>{key}:</strong> {value}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecification(key)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le produit')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
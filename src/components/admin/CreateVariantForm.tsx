import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { X, Upload, Image } from 'lucide-react';

interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price: number;
  stock_quantity: number;
  attributes?: Record<string, string>;
}

interface CreateVariantFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingVariant?: ProductVariant;
}

const CreateVariantForm: React.FC<CreateVariantFormProps> = ({ onClose, onSuccess, editingVariant }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    product_id: editingVariant?.product_id || '',
    name: editingVariant?.name || '',
    sku: editingVariant?.sku || '',
    price: editingVariant ? (editingVariant.price / 100).toString() : '',
    stock_quantity: editingVariant?.stock_quantity?.toString() || '10',
    attributes: {
      color: editingVariant?.attributes?.color || '',
      size: editingVariant?.attributes?.size || '',
      material: editingVariant?.attributes?.material || ''
    }
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const generateVariantSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
  };

  const uploadImages = async (variantId: string, variantName: string) => {
    if (selectedImages.length === 0) return;

    const variantSlug = generateVariantSlug(variantName);
    const uploadPromises = selectedImages.map(async (file, index) => {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${index === 0 ? 'main' : `image-${index + 1}`}-${Date.now()}.${fileExtension}`;
      const filePath = `${variantSlug}/${fileName}`;

      // Upload du fichier avec bypass RLS temporaire
      const { error: uploadError } = await supabase.storage
        .from('variant-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('variant-images')
        .getPublicUrl(filePath);

      // Insertion dans la table variant_images
      const { error: dbError } = await supabase
        .from('variant_images')
        .insert({
          variant_id: variantId,
          image_url: publicUrl,
          storage_path: filePath,
          type: index === 0 ? 'main' : 'gallery',
          context: 'studio',
          alt_text: `${variantName} - Image ${index + 1}`,
          sort_order: index
        });

      if (dbError) throw dbError;
    });

    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product_id || !formData.name || !formData.price) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (produit, nom, prix)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Nettoyer les attributs vides
      const cleanAttributes = Object.fromEntries(
        Object.entries(formData.attributes).filter(([_, value]) => value.trim() !== '')
      );

      let variantResult: any;

      if (editingVariant) {
        // Mettre à jour la variante existante
        const updateData: Partial<ProductVariant> = {
          product_id: formData.product_id,
          name: formData.name,
          price: Math.round(parseFloat(formData.price) * 100),
          stock_quantity: parseInt(formData.stock_quantity),
          attributes: cleanAttributes
        };

        // Ajouter le SKU seulement s'il est fourni
        if (formData.sku && formData.sku.trim()) {
          updateData.sku = formData.sku.trim().toUpperCase();
        }

        const { data: updatedVariant, error } = await supabase
          .from('product_variants')
          .update(updateData)
          .eq('id', editingVariant.id)
          .select()
          .single();

        if (error) throw error;
        variantResult = updatedVariant;
      } else {
        // Créer une nouvelle variante
        const insertData: Omit<ProductVariant, 'id'> & { in_stock: boolean } = {
          product_id: formData.product_id,
          name: formData.name,
          price: Math.round(parseFloat(formData.price) * 100),
          stock_quantity: parseInt(formData.stock_quantity),
          in_stock: true,
          attributes: cleanAttributes
        };

        // Ajouter le SKU seulement s'il est fourni
        if (formData.sku && formData.sku.trim()) {
          insertData.sku = formData.sku.trim().toUpperCase();
        }

        const { data: newVariant, error } = await supabase
          .from('product_variants')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        variantResult = newVariant;
      }

      // Upload des images si présentes
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        await uploadImages(variantResult.id, variantResult.name);
      }

      toast({
        title: "Succès",
        description: editingVariant
          ? `Variante modifiée avec ${selectedImages.length} image(s) !`
          : `Variante créée avec ${selectedImages.length} image(s) !`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur création variante:', error);

      // Gestion spécifique des erreurs de SKU dupliqué
      let errorMessage = `Erreur lors de la ${editingVariant ? 'modification' : 'création'}: ${error.message}`;

      if (error.message && error.message.includes('unique_product_variant_sku')) {
        errorMessage = `Le SKU "${formData.sku.toUpperCase()}" existe déjà. Veuillez choisir un SKU unique.`;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value
      }
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limiter à 5 images maximum
    const selectedFiles = files.slice(0, 5);
    setSelectedImages(selectedFiles);

    // Créer les aperçus
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);

    // Libérer l'URL de l'aperçu supprimé
    URL.revokeObjectURL(imagePreview[index]);

    setSelectedImages(newImages);
    setImagePreview(newPreviews);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {editingVariant ? 'Modifier la variante' : 'Créer une nouvelle variante'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sélection du produit */}
          <div className="space-y-2">
            <Label htmlFor="product">Produit *</Label>
            <Select value={formData.product_id} onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un produit" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nom de la variante */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la variante *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Music Shield - Monture Noire, Verres Bleus"
            />
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku">SKU (Code produit)</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Ex: MGS-BLK-M-AUD (optionnel)"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Identifiant unique pour cette variante (optionnel, sera converti en majuscules)
            </p>
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="249.00"
            />
          </div>

          {/* Quantité en stock */}
          <div className="space-y-2">
            <Label htmlFor="stock">Quantité en stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
            />
          </div>

          {/* Attributs */}
          <div className="space-y-4">
            <Label>Attributs (optionnels)</Label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  value={formData.attributes.color}
                  onChange={(e) => handleAttributeChange('color', e.target.value)}
                  placeholder="Ex: noire, blanche"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Taille/Type</Label>
                <Input
                  id="size"
                  value={formData.attributes.size}
                  onChange={(e) => handleAttributeChange('size', e.target.value)}
                  placeholder="Ex: M, L, XL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Matériau/Option</Label>
                <Input
                  id="material"
                  value={formData.attributes.material}
                  onChange={(e) => handleAttributeChange('material', e.target.value)}
                  placeholder="Ex: audio, standard"
                />
              </div>
            </div>
          </div>

          {/* Upload d'images */}
          <div className="space-y-4">
            <Label>Images de la variante (optionnel)</Label>

            {/* Zone de drop */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Cliquez pour sélectionner des images
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP • Max 5 images • 10MB par image
                </p>
              </label>
            </div>

            {/* Aperçu des images */}
            {imagePreview.length > 0 && (
              <div className="space-y-3">
                <Label>Aperçu des images ({imagePreview.length}/5)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Aperçu ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div className="absolute top-1 right-1">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="absolute bottom-1 left-1">
                        <span className="bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                          {index === 0 ? 'Principal' : `Image ${index + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  La première image sera utilisée comme image principale
                </p>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || uploadingImages} className="flex-1">
              {uploadingImages
                ? 'Upload des images...'
                : loading
                  ? (editingVariant ? 'Modification...' : 'Création...')
                  : (editingVariant ? 'Modifier la variante' : 'Créer la variante')
              }
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading || uploadingImages}>
              Annuler
            </Button>
          </div>

          {/* Indicateur de progression */}
          {uploadingImages && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Upload de {selectedImages.length} image(s) en cours...
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateVariantForm;
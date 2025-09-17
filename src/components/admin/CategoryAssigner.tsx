import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const CategoryAssigner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, category_id')
        .ilike('name', '%music%shield%');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const assignCategoryToProduct = async () => {
    if (!selectedProduct || !selectedCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit et une catégorie",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ category_id: selectedCategory })
        .eq('id', selectedProduct);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Catégorie assignée avec succès !",
      });

      // Recharger les produits
      loadProducts();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'assignation: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignMusicShieldToSport = async () => {
    setLoading(true);
    try {
      // Trouver la catégorie Sport
      const sportCategory = categories.find(cat =>
        cat.name.toLowerCase().includes('sport') ||
        cat.slug.toLowerCase().includes('sport')
      );

      if (!sportCategory) {
        throw new Error('Catégorie Sport non trouvée');
      }

      // Trouver le produit Music Shield
      const musicShieldProduct = products.find(prod =>
        prod.name.toLowerCase().includes('music') &&
        prod.name.toLowerCase().includes('shield')
      );

      if (!musicShieldProduct) {
        throw new Error('Produit Music Shield non trouvé');
      }

      // Assigner la catégorie
      const { error } = await supabase
        .from('products')
        .update({ category_id: sportCategory.id })
        .eq('id', musicShieldProduct.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Music Shield assigné à la catégorie ${sportCategory.name} !`,
      });

      loadProducts();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action rapide Music Shield → Sport */}
      <Card>
        <CardHeader>
          <CardTitle>Action rapide - Music Shield → Sport</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Assignez automatiquement le produit Music Shield à la catégorie Sport
          </p>

          <Button
            onClick={assignMusicShieldToSport}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Assignment...' : 'Assigner Music Shield à Sport'}
          </Button>
        </CardContent>
      </Card>

      {/* Assignation manuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Assignation manuelle de catégorie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Produit Music Shield :</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un produit" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.category_id ? '✅' : '❌'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Catégorie :</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.slug})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={assignCategoryToProduct}
            disabled={loading || !selectedProduct || !selectedCategory}
            className="w-full"
            variant="outline"
          >
            {loading ? 'Assignment...' : 'Assigner la catégorie'}
          </Button>
        </CardContent>
      </Card>

      {/* Statut actuel */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Statut des produits Music Shield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">{product.name}</span>
                  <span className={`text-sm ${product.category_id ? 'text-green-600' : 'text-red-600'}`}>
                    {product.category_id ? '✅ Catégorisé' : '❌ Sans catégorie'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoryAssigner;
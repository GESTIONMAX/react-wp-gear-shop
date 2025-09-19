import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const TableMigrator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [variantsData, setVariantsData] = useState<{ id: string; name: string; sku?: string; product_id: string; price?: number; attributes?: Record<string, string> }[]>([]);
  const [productVariantsData, setProductVariantsData] = useState<{ id: string; name: string; price: number }[]>([]);

  useEffect(() => {
    loadTableData();
  }, []);

  const loadTableData = async () => {
    try {
      // Charger variants
      const { data: variants } = await supabase
        .from('variants')
        .select('*')
        .ilike('name', '%music%shield%');

      // Charger product_variants
      const { data: productVariants } = await supabase
        .from('product_variants')
        .select('*')
        .ilike('name', '%music%shield%');

      setVariantsData(variants || []);
      setProductVariantsData(productVariants || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const migrateVariantToProductVariants = async () => {
    setLoading(true);
    try {
      // Trouver la variante Music Shield dans la table variants
      const musicShieldVariant = variantsData.find(v =>
        v.sku === 'SPR-MSH-BLC-BLU-AUDIO' ||
        v.name.includes('Music Shield')
      );

      if (!musicShieldVariant) {
        throw new Error('Variante Music Shield non trouvée dans la table variants');
      }

      // Vérifier si elle existe déjà dans product_variants
      const { data: existingProductVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('name', musicShieldVariant.name)
        .single();

      let productVariantId;

      if (existingProductVariant) {
        productVariantId = existingProductVariant.id;
        toast({
          title: "Info",
          description: "La variante existe déjà dans product_variants",
        });
      } else {
        // Créer dans product_variants
        const { data: newProductVariant, error } = await supabase
          .from('product_variants')
          .insert({
            product_id: musicShieldVariant.product_id,
            name: musicShieldVariant.name,
            price: musicShieldVariant.price || 24900,
            in_stock: true,
            stock_quantity: 10,
            attributes: musicShieldVariant.attributes || {
              color: 'blanche',
              lens: 'bleus',
              audio: true
            }
          })
          .select()
          .single();

        if (error) throw error;
        productVariantId = newProductVariant.id;

        toast({
          title: "Succès",
          description: "Variante copiée vers product_variants",
        });
      }

      // Maintenant, mettre à jour les images pour pointer vers la nouvelle variante
      const { error: updateError } = await supabase
        .from('variant_images')
        .update({ variant_id: productVariantId })
        .eq('variant_id', musicShieldVariant.id);

      if (updateError) throw updateError;

      toast({
        title: "Migration réussie",
        description: "Images migrées vers la variante product_variants",
      });

      // Recharger les données
      loadTableData();

    } catch (error) {
      console.error('Erreur migration:', error);
      toast({
        title: "Erreur",
        description: `Erreur migration: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMusicShieldInProductVariants = async () => {
    setLoading(true);
    try {
      // Trouver le produit Music Shield
      const { data: musicShieldProduct } = await supabase
        .from('products')
        .select('id')
        .ilike('name', '%music%shield%')
        .single();

      if (!musicShieldProduct) {
        throw new Error('Produit Music Shield non trouvé');
      }

      // Créer la variante directement dans product_variants
      const { data: newVariant, error } = await supabase
        .from('product_variants')
        .insert({
          product_id: musicShieldProduct.id,
          name: 'Music Shield - Monture Blanche, Verres Bleus avec audio',
          price: 24900, // 249.00€
          in_stock: true,
          stock_quantity: 10,
          attributes: {
            color: 'blanche',
            lens: 'bleus',
            audio: true,
            sku: 'SPR-MSH-BLC-BLU-AUDIO'
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Associer l'image
      const { error: imageError } = await supabase
        .from('variant_images')
        .insert({
          variant_id: newVariant.id,
          image_url: 'https://hgapjysrbldjqromnrov.supabase.co/storage/v1/object/public/variant-images/music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
          storage_path: 'music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
          type: 'main',
          context: 'studio',
          alt_text: 'Music Shield - Monture Blanche, Verres Bleus avec audio - Image principale',
          sort_order: 0
        });

      if (imageError) throw imageError;

      toast({
        title: "Succès complet",
        description: "Variante créée dans product_variants avec image associée !",
      });

      loadTableData();

    } catch (error) {
      console.error('Erreur création:', error);
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
      {/* Statut des tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Table: variants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Variantes Music Shield trouvées: {variantsData.length}</p>
            {variantsData.map((variant) => (
              <div key={variant.id} className="text-xs bg-muted p-2 rounded mt-2">
                <div><strong>{variant.name}</strong></div>
                <div>ID: {variant.id}</div>
                <div>SKU: {variant.sku || 'N/A'}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Table: product_variants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Variantes Music Shield trouvées: {productVariantsData.length}</p>
            {productVariantsData.map((variant) => (
              <div key={variant.id} className="text-xs bg-muted p-2 rounded mt-2">
                <div><strong>{variant.name}</strong></div>
                <div>ID: {variant.id}</div>
                <div>Prix: {variant.price}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={createMusicShieldInProductVariants}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Création...' : 'Créer Music Shield dans product_variants'}
          </Button>

          {variantsData.length > 0 && (
            <Button
              onClick={migrateVariantToProductVariants}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Migration...' : 'Migrer depuis variants vers product_variants'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableMigrator;
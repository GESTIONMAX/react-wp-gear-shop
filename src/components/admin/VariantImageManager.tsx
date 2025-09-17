import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const VariantImageManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    variantId: '', // À remplir avec le vrai UUID
    imageUrl: 'https://hgapjysrbldjqromnrov.supabase.co/storage/v1/object/public/variant-images/music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
    storagePath: 'music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
    type: 'main',
    context: 'studio',
    altText: 'Music Shield - Monture Blanche, Verres Bleus avec audio - Image principale',
    sortOrder: 0
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInsertMusicShield = async () => {
    setLoading(true);
    try {
      // Cherchons toutes les variantes Music Shield (plusieurs stratégies de recherche)
      let variants = null;
      const variantError = null;

      // Stratégie 1: par nom
      const { data: variantsByName } = await supabase
        .from('variants')
        .select('id, name, sku')
        .ilike('name', '%music%shield%')
        .limit(10);

      // Stratégie 2: par SKU spécifique
      const { data: variantsBySku } = await supabase
        .from('variants')
        .select('id, name, sku')
        .eq('sku', 'SPR-MSH-BLC-BLU-AUDIO')
        .limit(1);

      // Stratégie 3: par nom exact
      const { data: variantsByExactName } = await supabase
        .from('variants')
        .select('id, name, sku')
        .eq('name', 'Music Shield - Monture Blanche, Verres Bleus avec audio')
        .limit(1);

      // Combiner les résultats
      const allVariants = [
        ...(variantsByName || []),
        ...(variantsBySku || []),
        ...(variantsByExactName || [])
      ];

      // Supprimer les doublons et prioriser la variante avec le bon SKU
      const uniqueVariants = allVariants.filter((variant, index, self) =>
        index === self.findIndex(v => v.id === variant.id)
      );

      // Prioriser la variante avec le SKU bleu
      variants = uniqueVariants.sort((a, b) => {
        if (a.sku === 'SPR-MSH-BLC-BLU-AUDIO') return -1;
        if (b.sku === 'SPR-MSH-BLC-BLU-AUDIO') return 1;
        return 0;
      });

      if (variantError) {
        throw new Error(`Erreur recherche variante: ${variantError.message}`);
      }

      if (!variants || variants.length === 0) {
        throw new Error('Aucune variante Music Shield trouvée. Créez d\'abord la variante dans votre système.');
      }

      // Afficher les variantes trouvées pour sélection
      console.log('Variantes trouvées:', variants);

      // Utiliser la première variante trouvée ou demander à l'utilisateur
      const selectedVariant = variants[0];

      // Insérer l'image avec l'UUID réel
      const { data, error } = await supabase
        .from('variant_images')
        .insert({
          variant_id: selectedVariant.id,
          image_url: 'https://hgapjysrbldjqromnrov.supabase.co/storage/v1/object/public/variant-images/music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
          storage_path: 'music-shield-monture-blanche-verres-bleus-audio-spr-msh-blc-blu-audio/main-1.png',
          type: 'main',
          context: 'studio',
          alt_text: 'Music Shield - Monture Blanche Verres Bleus - Image principale',
          sort_order: 0
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: `Image insérée pour la variante: ${selectedVariant.name}`,
      });

      console.log('Variante utilisée:', selectedVariant);
      console.log('Image insérée:', data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de l'insertion: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInsertCustom = async () => {
    setLoading(true);
    try {
      // TODO: Implémenter l'insertion personnalisée
      toast({
        title: "En développement",
        description: "Fonctionnalité en cours de développement",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMusicShieldVariant = async () => {
    setLoading(true);
    try {
      // 1. Créer le produit Music Shield (si il n'existe pas)
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', 'music-shield-audio')
        .single();

      let productId = existingProduct?.id;

      if (!productId) {
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: 'Music Shield Audio',
            slug: 'music-shield-audio',
            description: 'Lunettes audio intelligentes avec monture personnalisable et verres colorés',
            short_description: 'Lunettes connectées avec audio intégré',
            price: 19900,
            in_stock: true,
            stock_quantity: 50
          })
          .select()
          .single();

        if (productError) throw productError;
        productId = newProduct.id;
      }

      // 2. Créer la variante (sans les colonnes qui n'existent pas encore)
      const { data: variant, error: variantError } = await supabase
        .from('variants')
        .insert({
          product_id: productId,
          name: 'Music Shield - Monture Blanche Verres Bleus',
          sku: 'msh-blc-blu-audio',
          attributes: {
            color: 'blanche',
            lens: 'bleus',
            audio: true,
            type: 'audio-glasses'
          }
          // Colonnes supprimées temporairement : price, stock_quantity, in_stock
        })
        .select()
        .single();

      if (variantError) throw variantError;

      toast({
        title: "Succès",
        description: `Variante créée: ${variant.name}`,
      });

      console.log('Variante créée:', variant);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la création: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanFolder = async () => {
    setLoading(true);
    try {
      // TODO: Implémenter le scan automatique
      toast({
        title: "En développement",
        description: "Fonctionnalité en cours de développement",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Création de la variante Music Shield */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 1 - Créer la variante Music Shield</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Créez d'abord la variante Music Shield dans votre système avant d'ajouter des images
          </p>

          <div className="bg-muted p-3 rounded text-sm">
            <strong>Produit :</strong> Music Shield<br/>
            <strong>Variante :</strong> Monture Blanche, Verres Bleus avec audio<br/>
            <strong>SKU :</strong> SPR-MSH-BLC-BLU-AUDIO<br/>
            <strong>Prix :</strong> 249.00 €
          </div>

          <Button
            onClick={handleCreateMusicShieldVariant}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? 'Création...' : 'Créer la Variante Music Shield'}
          </Button>
        </CardContent>
      </Card>

      {/* Action rapide pour Music Shield */}
      <Card>
        <CardHeader>
          <CardTitle>Étape 2 - Associer l'image à la variante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Une fois la variante créée, associez-lui l'image que vous avez uploadée
          </p>

          <div className="bg-muted p-3 rounded text-sm">
            <strong>Image :</strong> main-1.png<br/>
            <strong>URL :</strong> ...variant-images/music-shield-.../main-1.png
          </div>

          <Button
            onClick={handleInsertMusicShield}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Insertion...' : 'Associer Image à la Variante'}
          </Button>
        </CardContent>
      </Card>

      {/* Scan automatique du dossier */}
      <Card>
        <CardHeader>
          <CardTitle>Scan automatique du dossier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scanner automatiquement le dossier Music Shield et insérer toutes les images trouvées
          </p>

          <Button
            onClick={handleScanFolder}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Scan en cours...' : 'Scanner et Insérer Toutes les Images'}
          </Button>
        </CardContent>
      </Card>

      {/* Insertion manuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Insertion manuelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID Variante</Label>
              <Input
                value={formData.variantId}
                onChange={(e) => handleInputChange('variantId', e.target.value)}
                placeholder="msh-blc-blu-audio"
              />
            </div>

            <div className="space-y-2">
              <Label>Type d'image</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="main">Principale</option>
                <option value="swatch">Échantillon</option>
                <option value="detail">Détail</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="gallery">Galerie</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Contexte</Label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={formData.context}
                onChange={(e) => handleInputChange('context', e.target.value)}
              >
                <option value="studio">Studio</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="detail">Détail</option>
                <option value="outdoor">Extérieur</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Ordre de tri</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => handleInputChange('sortOrder', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>URL de l'image</Label>
            <Textarea
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Chemin de stockage</Label>
            <Input
              value={formData.storagePath}
              onChange={(e) => handleInputChange('storagePath', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Texte alternatif</Label>
            <Input
              value={formData.altText}
              onChange={(e) => handleInputChange('altText', e.target.value)}
            />
          </div>

          <Button
            onClick={handleInsertCustom}
            disabled={loading}
            variant="secondary"
            className="w-full"
          >
            {loading ? 'Insertion...' : 'Insérer Image Personnalisée'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VariantImageManager;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateCollection, useUpdateCollection, type Collection } from '@/hooks/useCollections';
import { toast } from '@/hooks/use-toast';
import { X, FolderOpen } from 'lucide-react';
import CollectionImageUploader from './CollectionImageUploader';

interface CreateCollectionFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingCollection?: Collection;
}

const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  onClose,
  onSuccess,
  editingCollection
}) => {
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const [formData, setFormData] = useState({
    name: editingCollection?.name || '',
    slug: editingCollection?.slug || '',
    description: editingCollection?.description || '',
    image_url: editingCollection?.image_url || '',
    is_active: editingCollection?.is_active ?? true,
  });

  // Générer automatiquement le slug à partir du nom
  useEffect(() => {
    if (!editingCollection && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, editingCollection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le slug sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCollection) {
        await updateCollection.mutateAsync({
          id: editingCollection.id,
          ...formData
        });
      } else {
        await createCollection.mutateAsync(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      // L'erreur est déjà gérée par les hooks
    }
  };

  const isLoading = createCollection.isPending || updateCollection.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          {editingCollection ? 'Modifier la collection' : 'Créer une nouvelle collection'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de la collection */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la collection *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Lunettes connectées premium"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="Ex: sport, lifestyle, prismatic"
              className="font-mono text-sm"
              required
            />
            <div className="text-xs text-muted-foreground">
              <p>URL-friendly identifier (généré automatiquement à partir du nom)</p>
              {['sport', 'lifestyle', 'prismatic'].includes(formData.slug.toLowerCase()) && (
                <p className="text-blue-600 font-medium mt-1">
                  ✓ Ce slug correspond à une page de catégorie existante. L'image sera utilisée automatiquement !
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez cette collection..."
              rows={3}
            />
          </div>

          {/* Upload d'image */}
          <div className="space-y-2">
            <Label>Image de la collection</Label>
            <CollectionImageUploader
              currentImageUrl={formData.image_url}
              onImageUploaded={(imageUrl) => {
                setFormData(prev => ({ ...prev, image_url: imageUrl }));
              }}
              onImageRemoved={() => {
                setFormData(prev => ({ ...prev, image_url: '' }));
              }}
              collectionName={formData.name}
              disabled={isLoading}
            />
          </div>

          {/* Statut actif */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="is_active" className="text-base font-medium">
                Collection active
              </Label>
              <p className="text-sm text-muted-foreground">
                Les collections actives sont visibles sur le site web
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
          </div>

          {/* Aperçu des informations */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Aperçu de la collection
            </h4>
            <div className="space-y-2 text-sm">
              <div><strong>Nom :</strong> {formData.name || 'Non défini'}</div>
              <div><strong>Slug :</strong> {formData.slug || 'Non défini'}</div>
              <div><strong>Statut :</strong> {formData.is_active ? 'Active' : 'Inactive'}</div>
              <div><strong>Image :</strong> {formData.image_url ? 'Définie' : 'Aucune image'}</div>
              {formData.description && (
                <div><strong>Description :</strong> {formData.description.slice(0, 100)}{formData.description.length > 100 ? '...' : ''}</div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? (editingCollection ? 'Modification...' : 'Création...')
                : (editingCollection ? 'Modifier la collection' : 'Créer la collection')
              }
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCollectionForm;
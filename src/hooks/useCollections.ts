import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types pour les collections
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hook pour récupérer toutes les collections
export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Collection[];
    },
  });
};

// Hook pour récupérer les collections actives
export const useActiveCollections = () => {
  return useQuery({
    queryKey: ['collections', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as Collection[];
    },
  });
};

// Hook pour récupérer une collection par ID
export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Collection;
    },
    enabled: !!id,
  });
};

// Hook pour récupérer une collection par slug
export const useCollectionBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['collection', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        // Si la collection n'existe pas, retourner null au lieu de throw
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as Collection;
    },
    enabled: !!slug,
    // Cache la réponse pendant 5 minutes pour éviter les requêtes répétées
    staleTime: 5 * 60 * 1000,
  });
};

// Hook pour créer une collection
export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (collectionData: Omit<Collection, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(collectionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Collection créée",
        description: "La collection a été créée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la collection.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour une collection
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...collectionData }: Partial<Collection> & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(collectionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Collection mise à jour",
        description: "La collection a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la collection.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour supprimer une collection
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Collection supprimée",
        description: "La collection a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la collection.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour basculer le statut d'une collection
export const useToggleCollectionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Récupérer le statut actuel
      const { data: currentData, error: fetchError } = await supabase
        .from('categories')
        .select('is_active')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Inverser le statut
      const { data, error } = await supabase
        .from('categories')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la collection a été mis à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    },
  });
};
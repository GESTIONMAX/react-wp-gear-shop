import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Hook pour récupérer tous les paramètres
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

// Hook pour récupérer les paramètres par catégorie
export const useSettingsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['settings', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', category)
        .order('key', { ascending: true });

      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

// Hook pour mettre à jour un paramètre
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', data.category] });
      toast({
        title: "Paramètre mis à jour",
        description: "La configuration a été sauvegardée avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paramètre.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour mettre à jour plusieurs paramètres d'une catégorie
export const useUpdateSettingsCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ category, settings }: { category: string; settings: Record<string, any> }) => {
      const updates = Object.entries(settings).map(([key, value]) => 
        supabase
          .from('site_settings')
          .update({
            value,
            updated_at: new Date().toISOString()
          })
          .eq('key', key)
      );

      const results = await Promise.all(updates);
      
      // Vérifier s'il y a des erreurs
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Erreurs lors de la mise à jour: ${errors.map(e => e.error?.message).join(', ')}`);
      }

      return results.map(result => result.data).filter(Boolean);
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', category] });
      toast({
        title: "Paramètres mis à jour",
        description: "La configuration a été sauvegardée avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive",
      });
    },
  });
};

// Utilitaire pour récupérer la valeur d'un paramètre spécifique
export const useSettingValue = (key: string) => {
  const { data: settings } = useSettings();
  
  const setting = settings?.find(s => s.key === key);
  return setting?.value || null;
};
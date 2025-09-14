import { useState, useCallback } from 'react';
import { useUpdateClientData } from './useClientData';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import { ShippingAddress } from '@/types';

export interface ProfileForm {
  first_name: string;
  last_name: string;
  address: string;
  address_complement: string;
  city: string;
  postal_code: string;
  country: string;
  marketing_phone: string;
  marketing_consent: boolean;
  notes: string;
  preferred_shipping_address: ShippingAddress | null;
  preferred_billing_address: ShippingAddress | null;
}

const initialProfileForm: ProfileForm = {
  first_name: '',
  last_name: '',
  address: '',
  address_complement: '',
  city: '',
  postal_code: '',
  country: 'France',
  marketing_phone: '',
  marketing_consent: false,
  notes: '',
  preferred_shipping_address: null,
  preferred_billing_address: null,
};

export const useClientActions = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileForm>(initialProfileForm);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const updateClientData = useUpdateClientData();
  const queryClient = useQueryClient();

  const handleEditProfile = useCallback((clientData: any) => {
    if (clientData) {
      const newForm: ProfileForm = {
        first_name: clientData.first_name || '',
        last_name: clientData.last_name || '',
        address: clientData.address || '',
        address_complement: clientData.address_complement || '',
        city: clientData.city || '',
        postal_code: clientData.postal_code || '',
        country: clientData.country || 'France',
        marketing_phone: clientData.marketing_phone || '',
        marketing_consent: clientData.marketing_consent || false,
        notes: clientData.notes || '',
        preferred_shipping_address: clientData.preferred_shipping_address || null,
        preferred_billing_address: clientData.preferred_billing_address || null,
      };
      setProfileForm(newForm);
      setEditingProfile(true);
    }
  }, []);

  const handleSaveProfile = useCallback(async (userId: string) => {
    if (!userId) return;

    try {
      await updateClientData.mutateAsync({
        userId,
        updates: profileForm,
      });

      // Invalider les queries pour actualiser les données
      await queryClient.invalidateQueries({ queryKey: ['clientData', userId] });
      await queryClient.invalidateQueries({ queryKey: ['allClients'] });
      await queryClient.refetchQueries({ queryKey: ['users'] });

      setEditingProfile(false);

      toast({
        title: "Profil mis à jour",
        description: "Les informations du client ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [profileForm, updateClientData, queryClient]);

  const handleCancelEdit = useCallback(() => {
    setEditingProfile(false);
    setProfileForm(initialProfileForm);
  }, []);

  const handleSelectUser = useCallback((user: any) => {
    setSelectedUser(user);
  }, []);

  return {
    editingProfile,
    setEditingProfile,
    profileForm,
    setProfileForm,
    selectedUser,
    handleEditProfile,
    handleSaveProfile,
    handleCancelEdit,
    handleSelectUser,
    updateClientData,
  };
};
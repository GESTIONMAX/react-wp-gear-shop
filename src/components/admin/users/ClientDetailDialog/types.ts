import type { Database } from '@/integrations/supabase/types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];

export interface ProfileFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  address_complement?: string;
  preferred_shipping_address?: string;
  marketing_phone?: boolean;
  marketing_consent?: boolean;
  notes?: string;
}

export interface ClientData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateClientData {
  updateProfile: (data: Partial<ProfileFormData>) => Promise<void>;
  isUpdating: boolean;
  isPending?: boolean;
}
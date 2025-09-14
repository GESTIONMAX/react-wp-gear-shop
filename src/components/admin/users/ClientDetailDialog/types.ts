import type { Database } from '@/integrations/supabase/types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];

export interface ProfileFormData {
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
  preferred_shipping_address: any;
  preferred_billing_address: any;
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
  mutate: (data: { userId: string; updates: Partial<ClientData> }) => void;
  isLoading: boolean;
  isPending?: boolean;
  isError: boolean;
  error: Error | null;
}
// Types pour le système de commandes
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  addressComplement?: string; // Complément d'adresse ajouté
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_variant_id?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number; // en centimes
  total_price: number; // en centimes
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number; // en centimes
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  useSameAddress: boolean;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  notes?: string;
}
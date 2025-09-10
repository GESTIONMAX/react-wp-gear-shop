// Types pour le système de facturation
export interface Invoice {
  id: string;
  user_id: string;
  order_id?: string;
  invoice_number: string;
  total_amount: number; // en centimes
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  invoice_date: string;
  due_date: string;
  pdf_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_name: string;
  quantity: number;
  unit_price: number; // en centimes
  total_price: number; // en centimes
  created_at: string;
}

export interface CreateInvoiceData {
  order_id?: string;
  total_amount: number;
  currency?: string;
  status?: 'draft' | 'sent' | 'paid' | 'cancelled';
  invoice_date?: string;
  due_date?: string;
  notes?: string;
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}
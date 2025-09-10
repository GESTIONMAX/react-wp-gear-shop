-- Créer une séquence pour les numéros de factures
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Créer la table des factures
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE DEFAULT generate_invoice_number(),
  total_amount INTEGER NOT NULL, -- en centimes
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, paid, cancelled
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  pdf_url TEXT, -- URL vers le PDF de la facture
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fonction pour générer les numéros de factures
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN 'FACT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 6, '0');
END;
$$;

-- Activer RLS sur la table factures
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que leurs propres factures
CREATE POLICY "invoices_select_own" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent créer leurs propres factures
CREATE POLICY "invoices_insert_own" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent modifier leurs propres factures
CREATE POLICY "invoices_update_own" 
ON public.invoices 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Créer la table des éléments de facture
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL, -- en centimes
  total_price INTEGER NOT NULL, -- en centimes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table des éléments de facture
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que les éléments de leurs factures
CREATE POLICY "invoice_items_select_own" 
ON public.invoice_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.user_id = auth.uid()
));

-- Politique pour que les utilisateurs puissent créer des éléments pour leurs factures
CREATE POLICY "invoice_items_insert_own" 
ON public.invoice_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.user_id = auth.uid()
));
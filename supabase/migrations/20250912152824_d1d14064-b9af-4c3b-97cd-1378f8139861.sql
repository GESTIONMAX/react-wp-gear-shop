-- Créer la table des paramètres du site
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent gérer les paramètres
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger pour updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer les paramètres par défaut
INSERT INTO public.site_settings (key, value, category, description) VALUES
  -- Informations boutique
  ('shop_name', '{"value": "MyTechGear"}', 'shop', 'Nom de la boutique'),
  ('shop_description', '{"value": "Votre boutique de technologie premium"}', 'shop', 'Description de la boutique'),
  ('shop_email', '{"value": "contact@mytechgear.com"}', 'shop', 'Email de contact'),
  ('shop_phone', '{"value": "+33 1 23 45 67 89"}', 'shop', 'Téléphone'),
  ('shop_address', '{"street": "123 Rue de la Tech", "city": "Paris", "postal_code": "75001", "country": "France"}', 'shop', 'Adresse physique'),
  
  -- Facturation et TVA
  ('default_tax_rate', '{"value": 20}', 'billing', 'Taux de TVA par défaut (%)'),
  ('currency', '{"value": "EUR", "symbol": "€"}', 'billing', 'Devise par défaut'),
  ('invoice_prefix', '{"value": "FACT-"}', 'billing', 'Préfixe des factures'),
  ('order_prefix', '{"value": "CMD-"}', 'billing', 'Préfixe des commandes'),
  
  -- Livraison
  ('shipping_free_threshold', '{"value": 5000}', 'shipping', 'Montant pour livraison gratuite (centimes)'),
  ('shipping_default_cost', '{"value": 500}', 'shipping', 'Frais de livraison par défaut (centimes)'),
  ('shipping_zones', '{"zones": [{"name": "France", "cost": 500}, {"name": "Europe", "cost": 1500}]}', 'shipping', 'Zones de livraison'),
  ('processing_time', '{"value": "24-48h"}', 'shipping', 'Délai de traitement'),
  
  -- Stock
  ('low_stock_threshold', '{"value": 10}', 'inventory', 'Seuil d''alerte stock faible'),
  ('auto_reserve_stock', '{"value": true}', 'inventory', 'Réservation automatique du stock'),
  ('out_of_stock_behavior', '{"value": "hide"}', 'inventory', 'Comportement produits en rupture (hide/show)'),
  
  -- Notifications
  ('email_notifications', '{"order_confirmation": true, "shipping_notification": true, "low_stock_alert": true}', 'notifications', 'Notifications par email'),
  ('admin_email', '{"value": "admin@mytechgear.com"}', 'notifications', 'Email administrateur'),
  
  -- Sécurité
  ('session_duration', '{"value": 86400}', 'security', 'Durée de session (secondes)'),
  ('max_login_attempts', '{"value": 5}', 'security', 'Tentatives de connexion max'),
  ('password_min_length', '{"value": 8}', 'security', 'Longueur minimale mot de passe'),
  
  -- Affichage
  ('default_theme', '{"value": "light"}', 'display', 'Thème par défaut'),
  ('products_per_page', '{"value": 12}', 'display', 'Produits par page'),
  ('default_language', '{"value": "fr"}', 'display', 'Langue par défaut'),
  
  -- Paiement
  ('payment_methods', '{"stripe": true, "paypal": false, "bank_transfer": true}', 'payment', 'Méthodes de paiement activées'),
  ('stripe_public_key', '{"value": ""}', 'payment', 'Clé publique Stripe'),
  ('payment_currency', '{"value": "EUR"}', 'payment', 'Devise de paiement');
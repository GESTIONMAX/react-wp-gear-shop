-- Migration pour nettoyer l'architecture profiles/clients
-- Supprimer les colonnes client de la table profiles

-- 1. Supprimer les colonnes d'adresse (données client)
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS address_complement,
DROP COLUMN IF EXISTS city, 
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS country;

-- 2. Supprimer les colonnes marketing (données client)  
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS marketing_phone,
DROP COLUMN IF EXISTS marketing_consent,
DROP COLUMN IF EXISTS notes;

-- 3. Supprimer les adresses préférées (données client)
ALTER TABLE public.profiles  
DROP COLUMN IF EXISTS preferred_shipping_address,
DROP COLUMN IF EXISTS preferred_billing_address;

-- 4. Garder uniquement les colonnes profil pur dans profiles:
-- id, user_id, first_name, last_name, email, avatar_url, phone, created_at, updated_at

-- La table clients garde toutes ses colonnes pour les données client
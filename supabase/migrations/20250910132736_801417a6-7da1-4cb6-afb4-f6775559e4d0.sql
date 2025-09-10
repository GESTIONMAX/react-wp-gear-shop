-- Mettre à jour le profil de l'admin avec des données complètes
UPDATE profiles 
SET 
  first_name = 'Aurelien',
  last_name = 'Lavayssiere', 
  phone = '0646022468',
  address = '123 Avenue Admin',
  city = 'Nice',
  postal_code = '06000',
  country = 'France',
  marketing_phone = '0646022468',
  marketing_consent = true,
  updated_at = NOW()
WHERE user_id = 'b03953c4-360f-401a-979f-1c0b1826120c';
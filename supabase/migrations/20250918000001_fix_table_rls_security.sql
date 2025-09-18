-- 🔒 Migration Critique : Sécurisation des Politiques RLS Tables
-- Correction des politiques trop permissives identifiées lors de l'audit

-- 1. Nettoyer les politiques trop permissives de variant_images
DROP POLICY IF EXISTS "variant_images_insert_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_select_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_update_policy" ON variant_images;
DROP POLICY IF EXISTS "variant_images_delete_policy" ON variant_images;

-- 2. Créer des politiques sécurisées pour variant_images
CREATE POLICY "variant_images_public_read"
ON variant_images
FOR SELECT
TO public
USING (true); -- Les images de variantes peuvent être vues par tous

CREATE POLICY "variant_images_admin_manage"
ON variant_images
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Vérifier et renforcer les politiques products
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for admin users" ON products;
DROP POLICY IF EXISTS "Enable delete for admin users" ON products;

-- Politiques sécurisées pour products
CREATE POLICY "products_public_read"
ON products
FOR SELECT
TO public
USING (
  -- Seuls les produits actifs sont visibles publiquement
  status = 'active'
);

CREATE POLICY "products_admin_full_access"
ON products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Sécuriser product_variants
DROP POLICY IF EXISTS "Enable read access for all users" ON product_variants;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON product_variants;
DROP POLICY IF EXISTS "Enable update for admin users" ON product_variants;
DROP POLICY IF EXISTS "Enable delete for admin users" ON product_variants;

CREATE POLICY "product_variants_public_read"
ON product_variants
FOR SELECT
TO public
USING (
  -- Seules les variantes de produits actifs sont visibles
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_variants.product_id
    AND products.status = 'active'
  )
);

CREATE POLICY "product_variants_admin_manage"
ON product_variants
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Sécuriser product_images
DROP POLICY IF EXISTS "Enable read access for all users" ON product_images;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON product_images;
DROP POLICY IF EXISTS "Enable update for admin users" ON product_images;
DROP POLICY IF EXISTS "Enable delete for admin users" ON product_images;

CREATE POLICY "product_images_public_read"
ON product_images
FOR SELECT
TO public
USING (
  -- Images visibles si le produit est actif
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_images.product_id
    AND products.status = 'active'
  )
);

CREATE POLICY "product_images_admin_manage"
ON product_images
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 6. Sécuriser categories
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable update for admin users" ON categories;
DROP POLICY IF EXISTS "Enable delete for admin users" ON categories;

CREATE POLICY "categories_public_read"
ON categories
FOR SELECT
TO public
USING (true); -- Les catégories peuvent être vues par tous

CREATE POLICY "categories_admin_manage"
ON categories
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 7. Sécuriser collections
DROP POLICY IF EXISTS "Enable read access for all users" ON collections;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON collections;
DROP POLICY IF EXISTS "Enable update for admin users" ON collections;
DROP POLICY IF EXISTS "Enable delete for admin users" ON collections;

CREATE POLICY "collections_public_read"
ON collections
FOR SELECT
TO public
USING (true); -- Les collections peuvent être vues par tous

CREATE POLICY "collections_admin_manage"
ON collections
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 8. Sécuriser orders (table critique)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;

CREATE POLICY "orders_user_own_read"
ON orders
FOR SELECT
TO authenticated
USING (
  -- L'utilisateur peut voir ses propres commandes
  user_id = auth.uid()
  OR
  -- Ou les commandes de son client associé
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.user_id = auth.uid()
    AND clients.id = orders.client_id
  )
);

CREATE POLICY "orders_user_create"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur peut créer des commandes pour lui-même
  user_id = auth.uid()
  OR
  -- Ou pour son client associé
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.user_id = auth.uid()
    AND clients.id = orders.client_id
  )
);

CREATE POLICY "orders_admin_full_access"
ON orders
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 9. Sécuriser order_items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admin can manage all order items" ON order_items;

CREATE POLICY "order_items_user_read"
ON order_items
FOR SELECT
TO authenticated
USING (
  -- L'utilisateur peut voir les items de ses commandes
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      orders.user_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.user_id = auth.uid()
        AND clients.id = orders.client_id
      )
    )
  )
);

CREATE POLICY "order_items_user_create"
ON order_items
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur peut créer des items pour ses commandes
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      orders.user_id = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.user_id = auth.uid()
        AND clients.id = orders.client_id
      )
    )
  )
);

CREATE POLICY "order_items_admin_full_access"
ON order_items
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 10. Fonction utilitaire de validation RLS
CREATE OR REPLACE FUNCTION public.validate_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 11. Documentation des politiques
COMMENT ON POLICY "products_public_read" ON products IS
'Lecture publique limitée aux produits actifs uniquement';

COMMENT ON POLICY "orders_user_own_read" ON orders IS
'Les utilisateurs voient uniquement leurs propres commandes ou celles de leur client associé';

COMMENT ON FUNCTION public.validate_user_admin() IS
'Fonction réutilisable pour valider les droits administrateur';
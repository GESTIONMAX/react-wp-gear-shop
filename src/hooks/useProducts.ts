import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products', 'v3', new Date().getHours()], // Force cache refresh every hour
    queryFn: async (): Promise<Product[]> => {
      console.log('🔄 Fetching products...');

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, alt_text, sort_order),
          product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('📦 Products raw data:', { products, error });

      if (error) {
        console.error('❌ Products fetch error:', error);
        throw error;
      }

      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true);

      console.log('📂 Categories data:', { categories, categoriesError });
      
      if (categoriesError) {
        console.error('❌ Categories fetch error:', categoriesError);
        throw categoriesError;
      }

      const categoryMap = new Map(categories.map((c: any) => [c.id, c]));
      
      console.log('🏷️ Category mapping:', Object.fromEntries(categoryMap));

      const transformedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        shortDescription: product.short_description || '',
        price: product.price / 100, // Convert cents to euros
        salePrice: product.sale_price ? product.sale_price / 100 : undefined,
        images: product.product_images
          ?.sort((a, b) => a.sort_order - b.sort_order)
          ?.map(img => img.image_url) || [],
        category: categoryMap.get(product.category_id)?.name || '',
        categorySlug: categoryMap.get(product.category_id)?.slug || '',
        tags: product.tags || [],
        inStock: product.in_stock,
        stockQuantity: product.stock_quantity,
        features: product.features || [],
        specifications: (product.specifications as Record<string, string>) || {},
        variants: product.product_variants?.map(variant => ({
          id: variant.id,
          name: variant.name,
          price: variant.price / 100,
          salePrice: variant.sale_price ? variant.sale_price / 100 : undefined,
          inStock: variant.in_stock,
          attributes: (variant.attributes as Record<string, string>) || {}
        })) || []
      }));
      
      console.log('✅ Transformed products:', transformedProducts.length, transformedProducts);

      return transformedProducts;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product | null> => {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, alt_text, sort_order),
          product_variants(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', product.category_id)
        .maybeSingle();

      // Ne pas jeter l'erreur pour ne pas bloquer l'affichage produit
      if (categoryError) {
        console.warn('Categorie introuvable pour le produit', product.id);
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        shortDescription: product.short_description || '',
        price: product.price / 100,
        salePrice: product.sale_price ? product.sale_price / 100 : undefined,
        images: product.product_images
          ?.sort((a, b) => a.sort_order - b.sort_order)
          ?.map(img => img.image_url) || [],
        category: (category?.name as string) || '',
        tags: product.tags || [],
        inStock: product.in_stock,
        stockQuantity: product.stock_quantity,
        features: product.features || [],
        specifications: (product.specifications as Record<string, string>) || {},
        variants: product.product_variants?.map(variant => ({
          id: variant.id,
          name: variant.name,
          price: variant.price / 100,
          salePrice: variant.sale_price ? variant.sale_price / 100 : undefined,
          inStock: variant.in_stock,
          attributes: (variant.attributes as Record<string, string>) || {}
        })) || []
      };
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image_url
      }));
    },
  });
};
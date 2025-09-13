import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      console.log('🔍 Fetching products from Supabase...');
      
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          product_images(image_url, alt_text, sort_order),
          product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('📦 Supabase response:', { products, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      if (!products || products.length === 0) {
        console.warn('⚠️ No products found in database');
        return [];
      }

      console.log(`✅ Found ${products.length} products in database`);

      return products.map(product => ({
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
        category: product.categories?.name || '',
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
    },
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
          categories(name, slug),
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
        category: product.categories?.name || '',
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
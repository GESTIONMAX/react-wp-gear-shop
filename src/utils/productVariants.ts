import { Product, ProductVariant } from '@/types';

export interface ProductVariantPair {
  product: Product;
  variant: ProductVariant;
  key: string;
}

/**
 * Transforms a list of products into a flattened list of product-variant pairs
 * This allows displaying each variant as a separate card
 */
export const expandProductVariants = (products: Product[]): ProductVariantPair[] => {
  const variants: ProductVariantPair[] = [];
  
  products.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      // Add each variant as a separate item
      product.variants.forEach(variant => {
        variants.push({
          product,
          variant,
          key: `${product.id}-${variant.id}`
        });
      });
    } else {
      // If no variants, create a virtual "default" variant using product data
      const defaultVariant: ProductVariant = {
        id: `default-${product.id}`,
        name: 'Standard',
        price: product.price,
        salePrice: product.salePrice,
        inStock: product.inStock,
        attributes: {}
      };
      
      variants.push({
        product,
        variant: defaultVariant,
        key: `${product.id}-default`
      });
    }
  });
  
  return variants;
};

/**
 * Filters product variants by category
 */
export const filterVariantsByCategory = (
  variants: ProductVariantPair[], 
  category?: string
): ProductVariantPair[] => {
  if (!category) return variants;
  
  return variants.filter(({ product }) => {
    const productCategoryName = (product.category || '').toLowerCase();
    const productCategorySlug = (product as { categorySlug?: string }).categorySlug ? (product as { categorySlug?: string }).categorySlug.toLowerCase() : '';
    const targetCategory = category.toLowerCase();
    
    // Debug log pour voir les correspondances
    console.log(`🔍 Filtering: ${product.name} | category: "${productCategoryName}" | slug: "${productCategorySlug}" | target: "${targetCategory}"`);
    
    return productCategoryName === targetCategory || productCategorySlug === targetCategory;
  });
};
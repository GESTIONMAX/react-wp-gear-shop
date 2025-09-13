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
  
  console.log('Filtering variants by category:', category);
  console.log('Available variants:', variants.map(v => ({ 
    productName: v.product.name, 
    category: v.product.category 
  })));
  
  return variants.filter(({ product }) => {
    const productCategory = product.category.toLowerCase();
    const targetCategory = category.toLowerCase();
    const matches = productCategory === targetCategory;
    console.log(`Product ${product.name}: category="${productCategory}", target="${targetCategory}", matches=${matches}`);
    return matches;
  });
};
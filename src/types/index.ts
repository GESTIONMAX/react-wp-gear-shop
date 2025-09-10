// MyTechGear.eu Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  variants?: ProductVariant[];
  features?: string[];
  specifications?: Record<string, string>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  attributes: Record<string, string>; // e.g., { color: "blue", size: "M" }
  images?: string[]; // Images spécifiques à cette variante
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variantId?: string;
  variant?: ProductVariant;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
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
  categorySlug?: string; // for robust filtering by slug
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
  sku?: string; // Stock Keeping Unit - identifiant unique pour la variante
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

// User and Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'staff' | 'employee' | 'client';
  isInternal?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt?: string;
}

// Order and Invoice Types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  taxAmount: number;
  subtotal: number;
  order: Order;
  createdAt: string;
}

// Admin Types
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

// Settings Types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  currency: string;
  taxRate: number;
  shippingRates: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  name: string;
  description?: string;
  rate: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  enabled: boolean;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}
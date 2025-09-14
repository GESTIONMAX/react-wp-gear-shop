import { describe, it, expect } from 'vitest'
import { CartItem, Product } from '@/types'

// Test de la logique métier du panier (sans composants React)
describe('Cart Logic', () => {
  const mockProduct: Product = {
    id: 'test-product-1',
    name: 'Test Product',
    slug: 'test-product',
    price: 2999, // 29.99€
    salePrice: 1999, // 19.99€
    description: 'A test product',
    shortDescription: 'Test product for testing',
    images: ['test-image.jpg'],
    category: 'Test Category',
    tags: ['test'],
    inStock: true,
    stockQuantity: 10,
    features: ['Feature 1'],
    specifications: { color: 'red' },
    variants: []
  }

  // Simuler la logique du reducer du panier
  const addItemToCart = (items: CartItem[], product: Product, quantity: number, variantId?: string): CartItem[] => {
    const existingItemIndex = items.findIndex(
      item => item.productId === product.id && item.variantId === variantId
    )

    if (existingItemIndex > -1) {
      const newItems = [...items]
      newItems[existingItemIndex].quantity += quantity
      return newItems
    }

    const variant = variantId ? product.variants?.find(v => v.id === variantId) : undefined
    return [...items, {
      productId: product.id,
      product,
      quantity,
      variantId,
      variant
    }]
  }

  const removeItemFromCart = (items: CartItem[], productId: string, variantId?: string): CartItem[] => {
    return items.filter(item =>
      !(item.productId === productId && item.variantId === variantId)
    )
  }

  const updateItemQuantity = (items: CartItem[], productId: string, quantity: number, variantId?: string): CartItem[] => {
    return items.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity }
      }
      return item
    })
  }

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + (price * item.quantity)
    }, 0)
  }

  const calculateTotalItems = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  it('should add item to empty cart', () => {
    const items: CartItem[] = []
    const result = addItemToCart(items, mockProduct, 2)

    expect(result).toHaveLength(1)
    expect(result[0].productId).toBe('test-product-1')
    expect(result[0].quantity).toBe(2)
    expect(result[0].product.name).toBe('Test Product')
  })

  it('should add quantity to existing item', () => {
    const existingItems: CartItem[] = [{
      productId: mockProduct.id,
      product: mockProduct,
      quantity: 1,
    }]

    const result = addItemToCart(existingItems, mockProduct, 2)

    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(3)
  })

  it('should remove item from cart', () => {
    const items: CartItem[] = [{
      productId: mockProduct.id,
      product: mockProduct,
      quantity: 2,
    }]

    const result = removeItemFromCart(items, mockProduct.id)

    expect(result).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const items: CartItem[] = [{
      productId: mockProduct.id,
      product: mockProduct,
      quantity: 2,
    }]

    const result = updateItemQuantity(items, mockProduct.id, 5)

    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(5)
  })

  it('should calculate total price correctly', () => {
    const items: CartItem[] = [
      {
        productId: mockProduct.id,
        product: mockProduct,
        quantity: 2,
      },
      {
        productId: 'product-2',
        product: { ...mockProduct, id: 'product-2', price: 1000, salePrice: null },
        quantity: 1,
      }
    ]

    const totalPrice = calculateTotalPrice(items)

    // (1999 * 2) + (1000 * 1) = 3998 + 1000 = 4998
    expect(totalPrice).toBe(4998)
  })

  it('should calculate total items correctly', () => {
    const items: CartItem[] = [
      {
        productId: mockProduct.id,
        product: mockProduct,
        quantity: 2,
      },
      {
        productId: 'product-2',
        product: { ...mockProduct, id: 'product-2' },
        quantity: 3,
      }
    ]

    const totalItems = calculateTotalItems(items)
    expect(totalItems).toBe(5)
  })

  it('should handle variants correctly', () => {
    const productWithVariants: Product = {
      ...mockProduct,
      variants: [
        { id: 'variant-1', name: 'Small', sku: 'TEST-S', price: 2499 },
        { id: 'variant-2', name: 'Large', sku: 'TEST-L', price: 3499 }
      ]
    }

    let items: CartItem[] = []

    // Ajouter même produit avec différentes variantes
    items = addItemToCart(items, productWithVariants, 1, 'variant-1')
    items = addItemToCart(items, productWithVariants, 1, 'variant-2')

    expect(items).toHaveLength(2)
    expect(items[0].variantId).toBe('variant-1')
    expect(items[1].variantId).toBe('variant-2')
    expect(items[0].variant?.name).toBe('Small')
    expect(items[1].variant?.name).toBe('Large')
  })

  it('should use sale price over regular price', () => {
    const items: CartItem[] = [{
      productId: mockProduct.id,
      product: mockProduct,
      quantity: 1,
    }]

    const totalPrice = calculateTotalPrice(items)

    // Should use salePrice (1999) not price (2999)
    expect(totalPrice).toBe(1999)
  })
})
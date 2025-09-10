import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, CartContextType } from '@/types';
import { toast } from '@/hooks/use-toast';

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; variantId?: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; variantId?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variantId } = action.payload;
      const existingItemIndex = state.findIndex(
        item => item.productId === product.id && item.variantId === variantId
      );

      if (existingItemIndex > -1) {
        const newState = [...state];
        newState[existingItemIndex].quantity += quantity;
        return newState;
      }

      const variant = variantId ? product.variants?.find(v => v.id === variantId) : undefined;
      return [...state, {
        productId: product.id,
        product,
        quantity,
        variantId,
        variant
      }];
    }

    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload;
      return state.filter(item => 
        !(item.productId === productId && item.variantId === variantId)
      );
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, variantId } = action.payload;
      if (quantity <= 0) {
        return state.filter(item => 
          !(item.productId === productId && item.variantId === variantId)
        );
      }

      return state.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      );
    }

    case 'CLEAR_CART':
      return [];

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('mytechgear-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mytechgear-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, variantId?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, variantId } });
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de votre panier",
    });
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, variantId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Panier vidé",
      description: "Votre panier a été vidé",
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.variant?.salePrice || item.variant?.price || item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
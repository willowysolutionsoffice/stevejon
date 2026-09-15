'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';
import { getApiUrl } from '@/lib/api';

export interface CartItem {
  id: string;
  productId: string | number;
  variantId?: string;
  title: string;
  category: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = authClient.useSession();
  const apiUrl = getApiUrl();

  // Load from localStorage on mount (for offline/guest mode)
  useEffect(() => {
    const storedCart = localStorage.getItem('judescart_cart') || localStorage.getItem('stevejon_cart');
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on items change (only if not logged in, to prevent override)
  useEffect(() => {
    if (isInitialized && !session?.user) {
      localStorage.setItem('judescart_cart', JSON.stringify(items));
    }
  }, [items, isInitialized, session]);

  // Sync with backend when user session changes
  useEffect(() => {
    if (!isInitialized) return;

    const syncAndFetchCart = async () => {
      if (session?.user) {
        try {
          const storedCart = localStorage.getItem('judescart_cart') || localStorage.getItem('stevejon_cart');
          const localItems = storedCart ? JSON.parse(storedCart) : [];

          if (localItems.length > 0) {
            // Push offline/guest cart to DB
            await fetch(`${apiUrl}/cart/sync`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: localItems }),
              credentials: 'include'
            });
            localStorage.removeItem('judescart_cart');
            localStorage.removeItem('stevejon_cart');
          }

          // Fetch user's cart from DB
          const res = await fetch(`${apiUrl}/cart`, { credentials: 'include' });
          if (res.ok) {
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
              setItems(result.data);
            }
          }
        } catch (e) {
          console.error("Error syncing cart with DB:", e);
        }
      } else {
        // User logged out, restore local cart
        const storedCart = localStorage.getItem('judescart_cart') || localStorage.getItem('stevejon_cart');
        if (storedCart) {
          try {
            setItems(JSON.parse(storedCart));
          } catch (e) {
            console.error("Failed to restore cart:", e);
          }
        } else {
          setItems([]);
        }
      }
    };

    syncAndFetchCart();
  }, [session, isInitialized]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = async (newItem: any, addedQty: number = 1) => {
    const qty = typeof newItem.quantity === 'number' ? newItem.quantity : addedQty;
    const title = newItem.title || newItem.name || 'JudesCart Item';
    const productId = newItem.productId || newItem.id || String(Date.now());
    const size = newItem.size || 'M';
    const color = newItem.color || 'Standard';
    const price = Number(newItem.price) || 0;
    const image = newItem.image || '/prod_overshirt_1778670536589.png';
    const category = newItem.category || 'Apparel';
    const variantId = newItem.variantId;

    const id = `${productId}-${size}-${color}`;
    
    // 1. Optimistic UI update
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id,
            productId,
            variantId,
            title,
            category,
            price,
            image,
            size,
            color,
            quantity: qty,
          },
        ];
      }
    });

    // Auto open side drawer on add
    setIsDrawerOpen(true);

    // 2. Persist to DB if logged in
    if (session?.user) {
      try {
        await fetch(`${apiUrl}/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            variantId,
            size,
            color,
            quantity: qty,
          }),
          credentials: 'include',
        });
      } catch (e) {
        console.error("Failed to save cart item to DB:", e);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const itemToRemove = items.find(item => item.id === id);

    // 1. Optimistic UI update
    setItems(prevItems => prevItems.filter(item => item.id !== id));

    // 2. Persist to DB if logged in
    if (session?.user && itemToRemove) {
      const targetId = itemToRemove.variantId || itemToRemove.id;
      try {
        await fetch(`${apiUrl}/cart/items/${targetId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
      } catch (e) {
        console.error("Failed to remove item from DB cart:", e);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    // 1. Optimistic UI update
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );

    // 2. Persist to DB if logged in
    if (session?.user) {
      const item = items.find(i => i.id === id);
      if (item) {
        const targetId = item.variantId || item.id;
        try {
          await fetch(`${apiUrl}/cart`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              variantId: targetId,
              quantity
            }),
            credentials: 'include'
          });
        } catch (e) {
          console.error("Failed to update cart item quantity in DB:", e);
        }
      }
    }
  };

  const clearCart = async () => {
    // 1. Optimistic UI update
    setItems([]);

    // 2. Persist to DB if logged in
    if (session?.user) {
      try {
        await fetch(`${apiUrl}/cart`, {
          method: 'DELETE',
          credentials: 'include'
        });
      } catch (e) {
        console.error("Failed to clear DB cart:", e);
      }
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

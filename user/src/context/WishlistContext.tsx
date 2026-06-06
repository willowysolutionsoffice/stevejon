'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';
import { getApiUrl } from '@/lib/api';

export interface WishlistItem {
  id: string;
  productId: string | number;
  variantId?: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: session } = authClient.useSession();
  const apiUrl = getApiUrl();

  // Load from localStorage on mount (for guest/offline mode)
  useEffect(() => {
    const storedWishlist = localStorage.getItem('stevejon_wishlist');
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on items change (only if not logged in)
  useEffect(() => {
    if (isInitialized && !session?.user) {
      localStorage.setItem('stevejon_wishlist', JSON.stringify(items));
    }
  }, [items, isInitialized, session]);

  // Sync wishlist with database on session change
  useEffect(() => {
    if (!isInitialized) return;

    const syncAndFetchWishlist = async () => {
      if (session?.user) {
        try {
          const storedWishlist = localStorage.getItem('stevejon_wishlist');
          const localItems = storedWishlist ? JSON.parse(storedWishlist) : [];

          if (localItems.length > 0) {
            // Sync local wishlist with database
            await fetch(`${apiUrl}/wishlist/sync`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: localItems }),
              credentials: 'include'
            });
            localStorage.removeItem('stevejon_wishlist');
          }

          // Fetch fresh user wishlist from DB
          const res = await fetch(`${apiUrl}/wishlist`, { credentials: 'include' });
          if (res.ok) {
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
              setItems(result.data);
            }
          }
        } catch (e) {
          console.error("Error syncing wishlist with DB:", e);
        }
      } else {
        // Logged out, restore guest wishlist
        const storedWishlist = localStorage.getItem('stevejon_wishlist');
        if (storedWishlist) {
          try {
            setItems(JSON.parse(storedWishlist));
          } catch (e) {
            console.error("Failed to restore wishlist:", e);
          }
        } else {
          setItems([]);
        }
      }
    };

    syncAndFetchWishlist();
  }, [session, isInitialized, apiUrl]);

  const addToWishlist = async (newItem: WishlistItem) => {
    // 1. Optimistic UI update
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => String(item.productId) === String(newItem.productId));
      if (existingIndex > -1) {
        return prevItems; // Already in wishlist
      } else {
        return [...prevItems, newItem];
      }
    });

    // 2. Persist to DB if logged in
    if (session?.user) {
      try {
        await fetch(`${apiUrl}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: newItem.productId,
            variantId: newItem.variantId
          }),
          credentials: 'include'
        });
      } catch (e) {
        console.error("Failed to save wishlist item to DB:", e);
      }
    }
  };

  const removeFromWishlist = async (productId: string | number) => {
    const itemToRemove = items.find(item => String(item.productId) === String(productId));

    // 1. Optimistic UI update
    setItems(prevItems => prevItems.filter(item => String(item.productId) !== String(productId)));

    // 2. Persist to DB if logged in
    if (session?.user && itemToRemove) {
      const targetId = itemToRemove.variantId || itemToRemove.id;
      try {
        await fetch(`${apiUrl}/wishlist/items/${targetId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
      } catch (e) {
        console.error("Failed to remove item from DB wishlist:", e);
      }
    }
  };

  const isInWishlist = (productId: string | number) => {
    return items.some(item => String(item.productId) === String(productId));
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export interface WishlistItem {
  id: string; // using variantId as id
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
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch wishlist on mount or session changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (session?.user) {
        try {
          const res = await fetch(`${apiUrl}/wishlist`, { credentials: 'include' });
          if (res.ok) {
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
              setItems(result.data);
            }
          }
        } catch (e) {
          console.error("Error fetching wishlist from DB:", e);
        }
      } else {
        setItems([]);
      }
      setIsInitialized(true);
    };

    fetchWishlist();
  }, [session, apiUrl]);

  const addToWishlist = async (newItem: WishlistItem) => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    // 1. Optimistic UI update
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => String(item.productId) === String(newItem.productId));
      if (existingIndex > -1) {
        return prevItems; // Already in wishlist
      } else {
        return [...prevItems, newItem];
      }
    });

    // 2. Persist to DB
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
  };

  const removeFromWishlist = async (productId: string | number) => {
    if (!session?.user) return;

    const itemToRemove = items.find(item => String(item.productId) === String(productId));

    // 1. Optimistic UI update
    setItems(prevItems => prevItems.filter(item => String(item.productId) !== String(productId)));

    // 2. Persist to DB
    if (itemToRemove) {
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

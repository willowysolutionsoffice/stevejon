'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  id: string; // using productId as id since we don't care about size/color for wishlist typically, or can just use productId
  productId: number;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
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

  // Save to localStorage on items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('stevejon_wishlist', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToWishlist = (newItem: WishlistItem) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.productId === newItem.productId);
      if (existingIndex > -1) {
        return prevItems; // Already in wishlist
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromWishlist = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.productId === productId);
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

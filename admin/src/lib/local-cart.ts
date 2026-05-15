"use client";

import { z } from "zod";
import { addToCartBundleInput } from "@/schema/cart-schema";
import { API_URL } from "./api-client";


const CART_KEY = "cart";

type CartItem = z.infer<typeof addToCartBundleInput>[number];

// ✅ Get cart from localStorage
export function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? (JSON.parse(cart) as CartItem[]) : [];
  } catch (e) {
    console.error("Failed to parse local cart:", e);
    return [];
  }
}

// ✅ Add item to localStorage cart
export function addLocalCartItem(variantId: string, quantity: number = 1) {
  const cart = getLocalCart();

  const existing = cart.find((item) => item.variantId === variantId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ variantId, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ✅ Sync local cart to backend, then clear local cart
export async function syncLocalCartToBackend() {
  const cart = getLocalCart();

  if (cart.length === 0) {
    console.log("Local cart is empty, skipping sync.");
    return { success: true };
  }

  try {
    const parsed = addToCartBundleInput.parse(cart);

    console.log("Syncing local cart to backend:", parsed);
    const response = await fetch(`${API_URL}/cart/bundle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
    });

    const res = await response.json();

    if (response.ok) {
      localStorage.removeItem(CART_KEY);
    }

    return res;
  } catch (error) {
    console.error("Local cart sync failed:", error);
    throw error;
  }
}

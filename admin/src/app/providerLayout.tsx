"use client";
import { CartWishlistProvider } from "@/context/cartContext";
import { ConfigurableProductProvider } from "@/context/ConfigurableProductContext";

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartWishlistProvider>
      <ConfigurableProductProvider>
        {children}
      </ConfigurableProductProvider>
    </CartWishlistProvider>
  );
}

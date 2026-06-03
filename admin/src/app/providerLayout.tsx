"use client";
import { CartWishlistProvider } from "@/context/cartContext";
import { ConfigurableProductProvider } from "@/context/ConfigurableProductContext";

// Inject a global fetch interceptor on the client side to automatically include session cookies
// (credentials: "include") for all cross-origin requests to the backend.
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : (input instanceof Request ? input.url : "");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    let backendHost = "localhost:5000";
    try {
      backendHost = new URL(apiUrl).host;
    } catch {}

    if (url.includes(backendHost) || url.includes("/api/")) {
      init = init || {};
      init.credentials = init.credentials || "include";
    }
    return originalFetch(input, init);
  };
}

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

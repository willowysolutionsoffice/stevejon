import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STEVEJON",
  description: "STEVEJON has redefined bespoke tailoring for over three decades. Our journey began in a small atelier, fueled by a passion for exquisite fabrics, precise drafting, and the timeless art of the perfect fit. Tailoring is not just about measurements; it is about sculpting a silhouette that mirrors the soul and projects strength, elegance, and effortless sophistication.",
  icons: {
    icon: "/favicon.svg",
  },
};

import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F5FAFF] text-[#061B3A] selection:bg-[#0077FF] selection:text-white">
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              {children}
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

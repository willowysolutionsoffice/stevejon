'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';

export default function NewArrivals() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getProductId = (title: string) => {
    switch (title) {
      case "Overshirt": return 1;
      case "Trouser": return 5;
      case "Pocket Square": return 7; // Just mapping to a valid ID (Scarf/Accessories)
      case "Belt": return 9; // Signature Set
      default: return 1;
    }
  }

  const handleAddToCart = (e: React.MouseEvent, prod: { title: string; price: string; img: string }) => {
    e.preventDefault();
    addToCart({
      productId: getProductId(prod.title),
      title: prod.title,
      category: prod.title === "Pocket Square" || prod.title === "Belt" ? "Accessories" : "Apparel",
      price: 5400, // Using standard price from catalog to match product page
      image: prod.img,
      size: 'M',
      color: 'Classic',
      quantity: 1,
    });
    
    setToastMessage(`Added ${prod.title} to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative">
      <h2 className="text-3xl font-serif text-center md:text-left mb-12">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {[
          { title: "Overshirt", price: "Rs 850", img: "/prod_overshirt_1778670536589.png" },
          { title: "Trouser", price: "Rs 620", img: "/prod_trouser_1778670553370.png" },
          { title: "Pocket Square", price: "Rs 150", img: "/prod_overshirt_1778670536589.png" },
          { title: "Belt", price: "Rs 280", img: "/prod_trouser_1778670553370.png" },
        ].map((prod, i) => (
          <div key={i} className="group flex flex-col">
            <Link href={`/product?id=${getProductId(prod.title)}`} className="block relative aspect-[3/4] bg-[#F3F2EE] mb-4 overflow-hidden rounded-xl">
              <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[0.6rem] font-bold tracking-widest z-10 shadow-sm">NEW</div>
              <Image 
                src={prod.img} 
                alt={prod.title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
              />
            </Link>
            <div className="flex flex-col gap-3 flex-1">
              <Link href={`/product?id=${getProductId(prod.title)}`} className="block">
                <h4 className="text-sm text-gray-900 group-hover:text-[#DF9F28] transition-colors">{prod.title}</h4>
                <p className="text-sm font-semibold text-gray-900 mt-1">{prod.price}</p>
              </Link>
              <button 
                onClick={(e) => handleAddToCart(e, prod)}
                className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 text-[0.65rem] font-bold tracking-[0.2em] uppercase border border-gray-200 text-gray-800 rounded-full hover:bg-[#DF9F28] hover:text-white hover:border-[#DF9F28] transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-fadeIn">
          <div className="bg-green-500 rounded-full p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase">
            {toastMessage}
          </span>
        </div>
      )}
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      size: 'M',
      color: 'Classic',
      quantity: 1,
    });
    removeFromWishlist(item.productId);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between animate-fadeIn">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-24 flex-1 w-full">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Catalog
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-widest uppercase text-black mb-3">
            Your Wishlist
          </h1>
          <p className="text-gray-500 text-xs md:text-sm tracking-[0.15em] uppercase font-medium">
            Curate your favorite pieces
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-28 bg-white rounded-[8px] border border-gray-100 shadow-sm flex flex-col items-center justify-center my-8">
            <div className="w-20 h-20 bg-[#F3F2EE] text-gray-400 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif tracking-wide text-black mb-3">Your wishlist is currently empty</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed font-sans">
              Save your favorite items here to review and purchase them later.
            </p>
            <Link
              href="/product"
              className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] bg-[#F3F2EE] mb-4 overflow-hidden rounded-[8px] group/image">
                  <Link href={`/product?id=${item.productId}`} className="block w-full h-full">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover/image:scale-105 mix-blend-multiply"
                    />
                  </Link>
                  <div className="absolute top-3 right-3 z-20">
                    <button 
                      onClick={() => removeFromWishlist(item.productId)}
                      className="bg-white p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <Link href={`/product?id=${item.productId}`} className="block">
                    <h4 className="text-sm text-gray-900 group-hover:text-[#DF9F28] transition-colors">{item.title}</h4>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹ {item.price}</p>
                  </Link>
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 text-[0.65rem] font-bold tracking-[0.2em] uppercase border border-gray-200 text-gray-800 rounded-full hover:bg-[#DF9F28] hover:text-white hover:border-[#DF9F28] transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

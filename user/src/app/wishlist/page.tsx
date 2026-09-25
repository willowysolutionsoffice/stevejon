'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowLeft, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      variantId: item.variantId,
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#111111] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="sj-container space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                SAVED ITEMS
              </span>
              <h1 className="text-xl sm:text-2xl font-sans font-extrabold text-[#111111] tracking-tight">
                Your Wishlist ({wishlistItems.length})
              </h1>
              <p className="text-xs sm:text-sm text-[#555555]">
                Review your saved pieces and move them to your bag whenever you&apos;re ready.
              </p>
            </div>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#555555] hover:text-[#DF9F28] tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Link>
          </div>

          {/* Wishlist Grid */}
          {wishlistItems.length === 0 ? (
            <div className="max-w-md mx-auto py-16 bg-white rounded-xl border border-slate-200 text-center space-y-4 p-8">
              <div className="w-16 h-16 rounded-full bg-[#FEF8EE] text-[#DF9F28] flex items-center justify-center mx-auto border border-[#DF9F28]/30">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-sans font-extrabold text-[#111111] tracking-tight">Your Wishlist is Empty</h2>
              <p className="text-xs text-[#555555] max-w-sm mx-auto">
                Save your favorite tailored garments and accessories to easily find and purchase them later.
              </p>
              <Link
                href="/product"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] text-xs font-black uppercase tracking-wider rounded-full shadow-sm"
              >
                <span>Discover Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] w-full bg-white overflow-hidden">
                    <Link href={`/product?id=${item.productId}`} className="block w-full h-full">
                      <Image
                        src={item.image || '/prod_overshirt_1778670536589.png'}
                        alt={item.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-600 shadow-xs transition-colors cursor-pointer"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-[#DF9F28] uppercase tracking-wider">
                        {item.category}
                      </p>
                      <Link
                        href={`/product?id=${item.productId}`}
                        className="text-xs sm:text-sm font-bold text-[#111111] hover:text-[#DF9F28] line-clamp-1 mt-0.5"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm font-bold text-[#111111] mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2.5 px-3 bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move To Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

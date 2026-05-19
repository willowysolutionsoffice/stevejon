'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    clearCart();
  };

  if (isCheckedOut) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between animate-fadeIn">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-40 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50/50">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-black mb-4">
            Order Placed Successfully
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed font-sans">
            Thank you for your purchase. Your Stevejon luxury items are being prepared at our atelier and will be shipped via complimentary express delivery.
          </p>
          <Link
            href="/product"
            className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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
            Shopping Cart
          </h1>
          <p className="text-gray-500 text-xs md:text-sm tracking-[0.15em] uppercase font-medium">
            Review your selections before checkout
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-28 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center my-8">
            <div className="w-20 h-20 bg-[#F3F2EE] text-gray-400 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif tracking-wide text-black mb-3">Your cart is currently empty</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed font-sans">
              Discover our exclusive collection of bespoke apparel, fine leather goods, and premium accessories.
            </p>
            <Link
              href="/product"
              className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          /* Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Items List (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-2xl overflow-hidden bg-[#F3F2EE] flex-shrink-0 border border-gray-100/50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="128px"
                      className="object-cover mix-blend-multiply p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col w-full text-left">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#DF9F28]">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-serif tracking-wide text-black mt-0.5">
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variant tags */}
                    <div className="flex flex-wrap items-center gap-3 my-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium font-sans">
                        Color: <strong className="text-black">{item.color}</strong>
                      </span>
                      {item.size && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium font-sans">
                          Size: <strong className="text-black">{item.size}</strong>
                        </span>
                      )}
                    </div>

                    {/* Price and Quantity row */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 w-full">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold text-base transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-black font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black font-bold text-base transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-lg font-bold text-black font-sans">
                        ₹ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-[0_15px_50px_rgba(0,0,0,0.03)]">
                <h2 className="text-xl font-serif tracking-wider uppercase text-black mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-4 mb-8 font-sans text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">₹ {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-green-600 uppercase tracking-wider text-xs">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-black">₹ 0</span>
                  </div>
                  <div className="h-[1px] bg-gray-100 my-2"></div>
                  <div className="flex justify-between text-base md:text-lg font-bold text-black font-sans">
                    <span>Total</span>
                    <span>₹ {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#DF9F28] hover:bg-[#c58b20] text-white py-5 rounded-full flex items-center justify-center gap-3 transition-all text-xs font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer group mb-6"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="text-center text-[0.7rem] tracking-wider text-gray-400 uppercase">
                  Secure checkout powered by Stevejon Atelier
                </p>
              </div>

              {/* Guarantees */}
              <div className="bg-[#F9F8F4] rounded-3xl border border-gray-100 p-6 grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="w-5 h-5 text-[#DF9F28]" />
                  <span className="text-[0.65rem] font-bold tracking-wider uppercase text-black">Express</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#DF9F28]" />
                  <span className="text-[0.65rem] font-bold tracking-wider uppercase text-black">2-Yr Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RefreshCw className="w-5 h-5 text-[#DF9F28]" />
                  <span className="text-[0.65rem] font-bold tracking-wider uppercase text-black">Easy Returns</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, CheckCircle2, X, CreditCard, Smartphone, Check } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [shippingForm, setShippingForm] = useState({
    name: 'Jane Doe',
    phone: '+91 98765 43210',
    street: '12, Atelier Lane, Khar West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400052',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderItems = items.map(item => ({
      id: item.id,
      productId: item.productId,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    }));

    const newOrder = createOrder(orderItems, shippingForm, paymentMethod);
    setPlacedOrder(newOrder);
    setIsCheckoutOpen(false);
    clearCart();
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between animate-fadeIn">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-40 text-center flex-1 flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-green-50/50">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-black mb-2">
            Order Placed Successfully
          </h1>
          <p className="text-gray-500 text-xs md:text-sm tracking-[0.2em] uppercase font-bold mb-6">
            ORDER ID: {placedOrder.id}
          </p>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed font-sans">
            Thank you for your purchase. Your Stevejon luxury items are being prepared at our atelier and will be shipped via complimentary express delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
            <Link
              href="/orders"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-lg cursor-pointer text-center flex-1 w-full"
            >
              View My Orders
            </Link>
            <Link
              href="/product"
              className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer text-center flex-1 w-full"
            >
              Continue Shopping
            </Link>
          </div>
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
          <div className="text-center py-28 bg-white rounded-[8px] border border-gray-100 shadow-sm flex flex-col items-center justify-center my-8">
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
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[8px] border border-gray-100 shadow-sm relative group transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-[8px] overflow-hidden bg-[#F3F2EE] flex-shrink-0 border border-gray-100/50">
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
                      {item.stock !== undefined && item.stock <= 5 && (
                        <span className="text-[0.65rem] text-amber-600 font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                          Only {item.stock} left
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
                          onClick={() => {
                            if (item.stock !== undefined && item.quantity >= item.stock) {
                              showToast(`Only ${item.stock} items left in stock.`);
                              return;
                            }
                            updateQuantity(item.id, item.quantity + 1);
                          }}
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed font-bold text-base transition-colors cursor-pointer"
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
              <div className="bg-white rounded-[8px] border border-gray-100 p-8 shadow-[0_15px_50px_rgba(0,0,0,0.03)]">
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
                  onClick={() => setIsCheckoutOpen(true)}
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
              <div className="bg-[#F9F8F4] rounded-[8px] border border-gray-100 p-6 grid grid-cols-3 gap-4 text-center">
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

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FDFCF8] w-full max-w-lg rounded-[8px] shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col border border-gray-100">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-lg font-serif tracking-wider uppercase text-black">Shipping Details</h3>
                <p className="text-[0.65rem] text-gray-400 uppercase tracking-widest mt-0.5 font-semibold">Please provide your delivery information</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-gray-400 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Recipient Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.name}
                    onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28] transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28] transition-all bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28] transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1.5">Pincode</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                      className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28] transition-all bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-[8px] px-4 py-3 text-sm focus:outline-none focus:border-[#DF9F28] focus:ring-1 focus:ring-[#DF9F28] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 mb-2.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                    { id: 'Credit Card', label: 'Card', icon: CreditCard },
                    { id: 'Cash on Delivery', label: 'Cash', icon: Truck },
                  ].map((pay) => {
                    const Icon = pay.icon;
                    return (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setPaymentMethod(pay.id)}
                        className={`flex flex-col items-center gap-2 p-3 border rounded-[8px] transition-all cursor-pointer text-center ${
                          paymentMethod === pay.id
                            ? 'border-[#DF9F28] bg-[#FDF8EE] ring-1 ring-[#DF9F28]/20 text-black'
                            : 'border-gray-200 hover:border-gray-400 text-gray-500 bg-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-gray-800" />
                        <span className="text-[0.6rem] font-bold tracking-wider uppercase leading-tight">{pay.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#DF9F28] hover:bg-[#c58b20] text-white py-4 rounded-full flex items-center justify-center gap-3 transition-all text-xs font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer"
                >
                  Pay & Place Order (₹ {totalPrice.toLocaleString()})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-fadeIn">
          <div className="bg-[#DF9F28] rounded-full p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase">
            {toastMessage}
          </span>
        </div>
      )}

      <Footer />
    </div>
  );
}

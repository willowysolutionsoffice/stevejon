'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, CheckCircle2, X, CreditCard, Smartphone, Check, AlertCircle } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { authClient } from '@/lib/auth-client';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const { data: session } = authClient.useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  const [shippingForm, setShippingForm] = useState({
    name: 'Jane Doe',
    phone: '+91 98765 43210',
    street: '12, Atelier Lane, Khar West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400052',
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsCheckingCoupon(true);
    setCouponError(null);
    try {
      const response = await fetch(`${apiUrl}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), cartTotal: totalPrice }),
        credentials: "include"
      });
      const res = await response.json();
      if (response.ok && res.success) {
        setAppliedCoupon(res);
        setCouponInput("");
        showToast(`Coupon "${res.code}" applied!`);
      } else {
        setCouponError(res.error || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError("Error validating coupon code");
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponInput("");
    showToast("Coupon removed");
  };

  useEffect(() => {
    if (!isCheckoutOpen) {
      setAppliedCoupon(null);
      setCouponInput("");
      setCouponError(null);
    }
  }, [isCheckoutOpen]);

  // Fetch saved addresses of the user when checkout is opened
  useEffect(() => {
    if (isCheckoutOpen && session?.user) {
      const fetchSavedAddresses = async () => {
        try {
          const res = await fetch(`${apiUrl}/profile/addresses`, { credentials: 'include' });
          if (res.ok) {
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
              setSavedAddresses(result.data);

              // Auto-fill default address if available
              const defaultAddr = result.data.find((a: any) => a.isDefault);
              if (defaultAddr) {
                setShippingForm({
                  name: defaultAddr.name,
                  phone: defaultAddr.phone,
                  street: defaultAddr.street,
                  city: defaultAddr.city,
                  state: defaultAddr.state,
                  pincode: defaultAddr.pincode,
                });
              } else if (result.data.length > 0) {
                // Fallback to first address
                setShippingForm({
                  name: result.data[0].name,
                  phone: result.data[0].phone,
                  street: result.data[0].street,
                  city: result.data[0].city,
                  state: result.data[0].state,
                  pincode: result.data[0].pincode,
                });
              }
            }
          }
        } catch (err) {
          console.error("Failed to load checkout addresses:", err);
        }
      };
      fetchSavedAddresses();
    }
  }, [isCheckoutOpen, session, apiUrl]);

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const orderItems = items.map(item => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        category: item.category,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      const newOrder = await createOrder(orderItems, shippingForm, paymentMethod, appliedCoupon?.code);
      setPlacedOrder(newOrder);
      setIsCheckoutOpen(false);
      clearCart();
    } catch (err: any) {
      console.error("Failed to place order:", err);
      setCheckoutError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                  onClick={() => {
                    if (!session?.user) {
                      router.push('/login?callback=/cart');
                    } else {
                      setIsCheckoutOpen(true);
                    }
                  }}
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
              {/* Saved Address Selector */}
              {session?.user && savedAddresses.length > 0 && (
                <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 mb-2">
                  <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-[#DF9F28] mb-2 font-sans">Select Saved Address</label>
                  <select
                    onChange={(e) => {
                      const selected = savedAddresses.find(a => a.id === e.target.value);
                      if (selected) {
                        setShippingForm({
                          name: selected.name,
                          phone: selected.phone,
                          street: selected.street,
                          city: selected.city,
                          state: selected.state,
                          pincode: selected.pincode
                        });
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-xs font-bold tracking-wider text-gray-700 focus:outline-none focus:border-[#DF9F28] cursor-pointer"
                  >
                    {savedAddresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.name} - {addr.street.substring(0, 25)}... {addr.isDefault ? '(Default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Checkout Order Summary */}
              <div className="bg-[#F9F8F4] p-5 rounded-[8px] border border-gray-100 space-y-4">
                <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-[#DF9F28] font-sans">
                  Order Summary
                </label>
                <div className="max-h-[160px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <div className="relative w-10 h-12 bg-white rounded border border-gray-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply p-0.5" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-serif text-black truncate font-semibold">{item.title}</p>
                        <p className="text-[0.65rem] text-gray-400 mt-0.5">
                          Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''} | Color: {item.color}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-black">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-gray-500 font-sans">
                      <span>Subtotal</span>
                      <span>₹ {totalPrice.toLocaleString()}</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-xs text-red-600 font-sans font-medium">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>- ₹ {appliedCoupon.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-black uppercase tracking-wider mt-1 pt-2 border-t border-gray-100">
                    <span>Grand Total</span>
                    <span className="font-sans">₹ {(totalPrice - (appliedCoupon?.discountAmount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-white p-5 rounded-[8px] border border-gray-200/60 space-y-3">
                <label className="block text-[0.65rem] font-bold tracking-widest uppercase text-gray-500 font-sans">
                  Have a Coupon / Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    disabled={appliedCoupon !== null}
                    className="flex-1 border border-gray-200 rounded-[8px] px-4 py-2.5 text-xs font-semibold tracking-wider bg-white focus:outline-none focus:border-[#DF9F28]"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-[8px] text-[0.65rem] font-bold tracking-wider uppercase transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isCheckingCoupon}
                      className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-[8px] text-[0.65rem] font-bold tracking-wider uppercase transition-all cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                      {isCheckingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-red-500 text-[0.7rem] font-sans font-semibold mt-1">
                    {couponError}
                  </p>
                )}
                {appliedCoupon && (
                  <p className="text-green-600 text-[0.7rem] font-sans font-semibold mt-1 flex items-center gap-1">
                    ✓ Coupon "{appliedCoupon.code}" applied! Saved ₹{appliedCoupon.discountAmount.toLocaleString()}
                  </p>
                )}
              </div>

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
                <div className="bg-[#FDF8EE] border border-[#DF9F28]/30 rounded-[8px] p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#DF9F28]/10 rounded-full flex items-center justify-center text-[#DF9F28] flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-black uppercase tracking-wider block">Cash on Delivery (COD)</span>
                    <span className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-semibold block mt-0.5">Pay in cash or UPI QR code upon delivery</span>
                  </div>
                </div>
              </div>

              {checkoutError && (
                <div className="bg-red-50 text-red-600 text-xs p-4 rounded-2xl border border-red-100 flex items-start gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#DF9F28] hover:bg-[#c58b20] disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-4 rounded-full flex items-center justify-center gap-3 transition-all text-xs font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer"
                >
                  {isSubmitting ? 'Placing Order...' : `Place Order (₹ ${(totalPrice - (appliedCoupon?.discountAmount || 0)).toLocaleString()})`}
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

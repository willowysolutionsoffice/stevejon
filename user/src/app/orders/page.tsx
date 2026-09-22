'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Check,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  Clock,
  Ticket,
  Truck,
  RotateCcw,
  Package,
  AlertCircle,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useOrders, Order, OrderStatus, OrderItem } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const { orders, cancelOrder } = useOrders();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CURRENT' | 'PAST'>('ALL');
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('id');
    if (orderIdParam && orders.some((o) => o.id === orderIdParam)) {
      setExpandedOrderIds([orderIdParam]);
      setTimeout(() => {
        const el = document.getElementById(orderIdParam);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [searchParams, orders]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleBuyAgain = (e: React.MouseEvent, item: OrderItem) => {
    e.stopPropagation();
    addToCart({
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      category: item.category,
      price: item.price,
      image: item.image,
      size: item.size,
      color: item.color,
      quantity: 1,
    });

    setToastMessage(`Added ${item.title} back to cart`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmCancel = async () => {
    if (orderToCancel) {
      try {
        await cancelOrder(orderToCancel);
        setToastMessage(`Order ${orderToCancel} has been cancelled`);
      } catch (err: any) {
        setToastMessage(err.message || `Failed to cancel order ${orderToCancel}`);
      } finally {
        setOrderToCancel(null);
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  const isCurrentOrder = (status: OrderStatus) => {
    return status === 'PENDING' || status === 'PROCESSING' || status === 'SHIPPED';
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === 'CURRENT' && !isCurrentOrder(order.status)) return false;
      if (activeTab === 'PAST' && isCurrentOrder(order.status)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesItem = order.items.some((item) => item.title.toLowerCase().includes(q));
        if (!matchesId && !matchesItem) return false;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PROCESSING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111111] font-sans flex flex-col justify-between">
      <Navbar />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-[#061B3A] animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#DF9F28]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-10 md:py-16">
        <div className="sj-container space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                PURCHASE HISTORY
              </span>
              <h1 className="text-2xl sm:text-3xl font-sans font-extrabold text-[#111111] tracking-tight">
                Your Orders & Tracking
              </h1>
              <p className="text-xs sm:text-sm text-[#555555]">
                Review your active dispatches, past bespoke purchases, and lucky draw tickets.
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

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['ALL', 'CURRENT', 'PAST'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#0A192F] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#555555] hover:bg-slate-100 hover:text-[#111111]'
                  }`}
                >
                  {tab === 'ALL' ? 'All Orders' : tab === 'CURRENT' ? 'Active Orders' : 'Past Orders'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID or item..."
                className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#DF9F28]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="max-w-md mx-auto py-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 p-8">
              <div className="w-16 h-16 rounded-full bg-[#FEF8EE] text-[#DF9F28] flex items-center justify-center mx-auto border border-[#DF9F28]/30">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] font-sans">No orders found</h3>
              <p className="text-xs text-[#555555]">
                You have not placed any orders matching this criteria yet.
              </p>
              <Link
                href="/product"
                className="inline-block px-6 py-2.5 bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] text-xs font-black uppercase rounded-full tracking-wider shadow-sm cursor-pointer"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderIds.includes(order.id);
                return (
                  <div
                    key={order.id}
                    id={order.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                  >
                    {/* Top Order Summary Bar */}
                    <div
                      onClick={() => toggleExpand(order.id)}
                      className="p-5 sm:p-6 bg-[#F8FAFC] border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Order ID</p>
                          <p className="text-sm font-bold font-mono text-[#111111]">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Placed On</p>
                          <p className="text-xs font-semibold text-[#555555]">
                            {new Date(order.date || (order as any).createdAt || Date.now()).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Total Amount</p>
                          <p className="text-xs font-bold text-[#111111]">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <div className="p-1 rounded-full text-slate-400 hover:text-[#111111]">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 py-2">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                              <Image src={item.image || '/prod_overshirt_1778670536589.png'} alt={item.title} fill className="object-cover" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#111111] line-clamp-1">{item.title}</h4>
                              <p className="text-[11px] text-[#888888] font-medium">{item.category} • Size: {item.size} • Qty: {item.quantity}</p>
                              <p className="text-xs font-semibold text-[#111111] mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleBuyAgain(e, item)}
                            className="px-4 py-2 bg-[#0A192F] hover:bg-[#DF9F28] hover:text-[#111111] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                          >
                            Buy Again
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Expanded Details: Shipping & Lucky Tickets */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 bg-[#F8FAFC] border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-2">
                          <h5 className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#DF9F28]" />
                            <span>Delivery Destination</span>
                          </h5>
                          <p className="text-[#555555] leading-relaxed">
                            {order.shippingDetails?.name}<br />
                            {order.shippingDetails?.street}<br />
                            {order.shippingDetails?.city}, {order.shippingDetails?.state} - {order.shippingDetails?.pincode}<br />
                            Phone: {order.shippingDetails?.phone}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-[#DF9F28]" />
                            <span>Lucky Draw Status</span>
                          </h5>
                          <p className="text-[#555555] leading-relaxed">
                            This order automatically qualified for our weekly live lucky draw. Your generated ticket is permanently archived in your profile.
                          </p>
                          {order.status === 'PENDING' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setOrderToCancel(order.id); }}
                              className="text-xs text-rose-600 hover:underline font-semibold pt-2 block cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Cancel Modal Confirmation */}
          {orderToCancel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#111111] text-center">Cancel Order?</h3>
                <p className="text-xs text-[#555555] text-center">
                  Are you sure you want to cancel order <span className="font-mono font-bold text-[#111111]">{orderToCancel}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleConfirmCancel}
                    className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-rose-500 cursor-pointer"
                  >
                    Confirm Cancel
                  </button>
                  <button
                    onClick={() => setOrderToCancel(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-[#111111] text-xs font-semibold rounded-xl hover:bg-slate-200 cursor-pointer"
                  >
                    Keep Order
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#DF9F28] border-t-transparent rounded-full animate-spin" /></div>}>
      <OrdersPageContent />
    </Suspense>
  );
}

'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Search, X, Check, ShoppingBag, 
  Calendar, CreditCard, MapPin, ChevronDown, ChevronUp, AlertCircle, Clock
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useOrders, Order, OrderStatus, OrderItem } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const { orders, cancelOrder } = useOrders();
  const { addToCart } = useCart();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CURRENT' | 'PAST'>('ALL');
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cancellation Modal state
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  // Auto-expand specific order if passed via query param (e.g. ?id=SJ-84902)
  useEffect(() => {
    const orderIdParam = searchParams.get('id');
    if (orderIdParam && orders.some(o => o.id === orderIdParam)) {
      setExpandedOrderIds([orderIdParam]);
      // Scroll to that order card if possible after a brief delay
      setTimeout(() => {
        const el = document.getElementById(orderIdParam);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [searchParams, orders]);

  // Toggle order card expansion
  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  // Re-order item
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
      quantity: 1
    });

    setToastMessage(`Added ${item.title} back to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Confirm cancel order
  const handleCancelClick = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setOrderToCancel(orderId);
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
        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      }
    }
  };

  // Helper: check if order is active/current (PENDING, PROCESSING, SHIPPED)
  const isCurrentOrder = (status: OrderStatus) => {
    return status === 'PENDING' || status === 'PROCESSING' || status === 'SHIPPED';
  };

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab filter
      if (activeTab === 'CURRENT' && !isCurrentOrder(order.status)) return false;
      if (activeTab === 'PAST' && isCurrentOrder(order.status)) return false;

      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesItems = order.items.some(item => 
          item.title.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        );
        return matchesId || matchesItems;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Helper: Status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase bg-yellow-50 text-yellow-700 border border-yellow-200/50">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200/50 animate-pulse">
            <Clock className="w-3 h-3" />
            In Atelier
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/50">
            <Clock className="w-3 h-3" />
            In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200/50">
            <Check className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-wider uppercase bg-red-50 text-red-700 border border-red-200/50">
            <X className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Helper: Stepper timeline steps active states
  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'PENDING', label: 'Ordered' },
      { key: 'PROCESSING', label: 'Confirmed' },
      { key: 'SHIPPED', label: 'In Transit' },
      { key: 'DELIVERED', label: 'Delivered' }
    ];

    let activeIndex = -1;
    if (status === 'PENDING') activeIndex = 0;
    else if (status === 'PROCESSING') activeIndex = 1;
    else if (status === 'SHIPPED') activeIndex = 2;
    else if (status === 'DELIVERED') activeIndex = 3;

    return steps.map((step, idx) => ({
      ...step,
      isCompleted: idx <= activeIndex,
      isCurrent: idx === activeIndex
    }));
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
            My Orders
          </h1>
          <p className="text-gray-500 text-xs md:text-sm tracking-[0.15em] uppercase font-medium">
            Manage your past ateliers and track active shipments
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-100">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 md:border-0 overflow-x-auto select-none">
            {[
              { id: 'ALL', label: 'All Orders' },
              { id: 'CURRENT', label: 'Active Shipments' },
              { id: 'PAST', label: 'Past Orders' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 md:py-2 px-4 text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#DF9F28] text-black bg-white/40'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Order ID or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full text-xs font-medium tracking-wide border border-gray-200 focus:outline-none focus:border-[#DF9F28] transition-colors bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center my-6">
            <div className="w-16 h-16 bg-[#F3F2EE] text-gray-400 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-serif tracking-wide text-black mb-2">No orders found</h2>
            <p className="text-gray-500 text-xs max-w-xs mx-auto mb-8 leading-relaxed font-sans">
              {searchQuery 
                ? "We couldn't find any orders matching your search. Please check the keywords." 
                : "You haven't placed any orders yet. Discover our exclusive catalog."}
            </p>
            {!searchQuery && (
              <Link
                href="/product"
                className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md cursor-pointer"
              >
                Explore Catalog
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredOrders.map(order => {
              const isExpanded = expandedOrderIds.includes(order.id);
              const isCancelled = order.status === 'CANCELLED';

              return (
                <div 
                  key={order.id} 
                  id={order.id}
                  className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden ${
                    isExpanded ? 'ring-1 ring-gray-100 shadow-md' : ''
                  }`}
                >
                  {/* Card Header (Summary) */}
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer select-none bg-white transition-colors hover:bg-gray-50/20"
                  >
                    {/* ID & Date */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div>
                        <span className="text-[0.65rem] font-bold tracking-widest text-[#DF9F28] uppercase">Order ID</span>
                        <h3 className="text-base font-bold text-black font-sans mt-0.5">{order.id}</h3>
                      </div>
                      <div className="h-[1px] w-8 bg-gray-100 hidden md:block"></div>
                      <div>
                        <span className="text-[0.65rem] font-bold tracking-widest text-gray-400 uppercase">Placed On</span>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5 flex items-center gap-1.5 font-sans">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Total Amount & Status */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 md:gap-8">
                      <div className="md:text-right">
                        <span className="text-[0.65rem] font-bold tracking-widest text-gray-400 uppercase block">Total Amount</span>
                        <span className="text-base font-bold text-black font-sans mt-0.5 block">
                          ₹ {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(order.status)}
                        <div className="text-gray-400 hover:text-black transition-colors p-1 bg-gray-50 rounded-full border border-gray-100">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 md:p-8 bg-[#FDFCF8]/40 space-y-8 animate-fadeIn">
                      
                      {/* Timeline Stepper or Cancelled Banner */}
                      {isCancelled ? (
                        <div className="bg-red-50/50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold tracking-wider uppercase text-red-700">Order Cancelled</h4>
                            <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-xl">
                              This order has been cancelled and a full refund has been initiated to your original payment method. If you used UPI or Credit Card, it should reflect in 3-5 business days.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-6">
                          <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-black border-b border-gray-50 pb-3">Delivery Progress</h4>
                          
                          {/* Progress Stepper */}
                          <div className="relative pt-4 pb-2">
                            {/* Horizontal Line Background */}
                            <div className="absolute top-[21px] left-8 right-8 h-[2px] bg-gray-100 -z-10 hidden sm:block"></div>
                            
                            {/* Horizontal Line Active */}
                            <div 
                              className="absolute top-[21px] left-8 h-[2px] bg-[#DF9F28] transition-all duration-500 -z-10 hidden sm:block"
                              style={{
                                width: 
                                  order.status === 'PENDING' ? '0%' :
                                  order.status === 'PROCESSING' ? '33.3%' :
                                  order.status === 'SHIPPED' ? '66.6%' :
                                  order.status === 'DELIVERED' ? '100%' : '0%'
                              }}
                            ></div>

                            {/* Verticial line background for mobile */}
                            <div className="absolute top-6 bottom-6 left-3 w-[2px] bg-gray-100 -z-10 sm:hidden"></div>

                            {/* Stepper nodes */}
                            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                              {getTimelineSteps(order.status).map((step, idx) => (
                                <div key={idx} className="flex sm:flex-col items-center gap-4 sm:gap-2.5 sm:text-center flex-1">
                                  {/* Node Circle */}
                                  <div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                      step.isCompleted
                                        ? 'border-[#DF9F28] bg-[#DF9F28] text-white shadow-md shadow-[#DF9F28]/25 scale-105'
                                        : 'border-gray-200 bg-white text-gray-300'
                                    } ${step.isCurrent ? 'ring-4 ring-yellow-600/10' : ''}`}
                                  >
                                    {step.isCompleted ? (
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    ) : (
                                      <span className="text-[0.65rem] font-bold font-sans">{idx + 1}</span>
                                    )}
                                  </div>
                                  {/* Node details */}
                                  <div>
                                    <h5 className={`text-xs font-bold tracking-wider uppercase ${
                                      step.isCompleted ? 'text-black font-semibold' : 'text-gray-400 font-medium'
                                    }`}>
                                      {step.label}
                                    </h5>
                                    {step.isCurrent && (
                                      <span className="text-[0.55rem] text-[#DF9F28] font-bold tracking-widest uppercase sm:block mt-0.5">
                                        Current Step
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Items Grid */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-black">Ordered Items</h4>
                        <div className="flex flex-col gap-4">
                          {order.items.map(item => (
                            <div 
                              key={item.id}
                              className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-3xl border border-gray-50 shadow-sm relative group"
                            >
                              {/* Item image */}
                              <div className="relative aspect-[3/4] w-20 rounded-2xl overflow-hidden bg-[#F3F2EE] flex-shrink-0 border border-gray-100/50 p-2">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  sizes="80px"
                                  className="object-cover mix-blend-multiply"
                                />
                              </div>

                              {/* Item details */}
                              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                <div className="text-center sm:text-left">
                                  <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#DF9F28]">
                                    {item.category}
                                  </span>
                                  <h5 className="text-sm font-serif tracking-wide text-black mt-0.5">
                                    {item.title}
                                  </h5>
                                  {/* Variant details */}
                                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                                    <span className="text-[0.65rem] bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
                                      Color: <strong className="text-black">{item.color}</strong>
                                    </span>
                                    {item.size && (
                                      <span className="text-[0.65rem] bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
                                        Size: <strong className="text-black">{item.size}</strong>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Price & Quantity */}
                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 w-full sm:w-auto border-t sm:border-0 border-gray-50 pt-3 sm:pt-0">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[0.65rem] text-gray-400 block uppercase font-bold">Qty</span>
                                    <span className="text-sm font-bold text-black font-sans">{item.quantity}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[0.65rem] text-gray-400 block uppercase font-bold">Price</span>
                                    <span className="text-sm font-bold text-black font-sans">
                                      ₹ {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => handleBuyAgain(e, item)}
                                    className="bg-black hover:bg-gray-800 text-white p-2.5 rounded-full shadow-md cursor-pointer transition-transform hover:scale-105"
                                    title="Buy Again"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Details Grid (Billing, Shipping, Invoice) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 font-sans">
                        {/* Shipping Details */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm text-xs">
                          <h4 className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400 mb-3 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#DF9F28]" />
                            Delivery Address
                          </h4>
                          <p className="font-bold text-black text-sm mb-1">{order.shippingDetails.name}</p>
                          <p className="text-gray-600 leading-relaxed">
                            {order.shippingDetails.street},<br />
                            {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
                          </p>
                          <p className="text-gray-500 font-semibold mt-3">Phone: {order.shippingDetails.phone}</p>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm text-xs">
                          <h4 className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400 mb-3 flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-[#DF9F28]" />
                            Payment Method
                          </h4>
                          <p className="font-bold text-black text-sm mb-1">{order.paymentMethod}</p>
                          <p className="text-gray-500 mt-1 leading-relaxed">
                            Complimentary express delivery insured by Stevejon Atelier.
                          </p>
                          <div className="mt-4 inline-flex items-center gap-1.5 text-green-600 font-bold uppercase tracking-wider text-[0.6rem] bg-green-50 px-2.5 py-0.5 rounded-full">
                            Paid Securely
                          </div>
                        </div>

                        {/* Order Invoice Summary */}
                        <div className="bg-[#F9F8F4] p-6 rounded-3xl border border-gray-100 shadow-sm text-xs space-y-2.5">
                          <h4 className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-gray-400 mb-3 block">Invoice Summary</h4>
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-bold text-black">₹ {order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Express Shipping</span>
                            <span className="font-bold text-green-600 uppercase">Free</span>
                          </div>
                          <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-100">
                            <span>Tax (Atelier duty)</span>
                            <span className="font-bold text-black">₹ 0</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-black pt-1">
                            <span>Total Paid</span>
                            <span>₹ {order.totalAmount.toLocaleString()}</span>
                          </div>

                          {/* Cancellation Button */}
                          {!isCancelled && isCurrentOrder(order.status) && (
                            <button
                              onClick={(e) => handleCancelClick(e, order.id)}
                              className="w-full mt-4 text-[0.65rem] tracking-[0.15em] font-bold text-red-500 bg-red-50 hover:bg-red-100/60 border border-red-100 py-2.5 rounded-full uppercase transition-colors text-center cursor-pointer"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FDFCF8] w-full max-w-sm rounded-[2rem] shadow-2xl p-8 border border-gray-100 animate-scaleUp text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-serif tracking-wider uppercase text-black mb-2">Cancel Order</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-6 font-sans">
              Are you sure you want to cancel order <strong className="text-black">{orderToCancel}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setOrderToCancel(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                No, Keep
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer shadow-md"
              >
                Yes, Cancel
              </button>
            </div>
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

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#DF9F28] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}

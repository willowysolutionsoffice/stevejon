'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [orderQuery, setOrderQuery] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId || 'JC-849201');
  const [isSearching, setIsSearching] = useState(false);

  const sampleTrackingData = {
    orderId: searchedId || 'JC-849201',
    status: 'In Transit',
    estimatedDelivery: 'Thursday, Sept 18, 2026',
    carrier: 'BlueDart Express Air (Track #BD982341IN)',
    origin: 'JudesCart Central Fulfilment Hub, Bengaluru',
    destination: 'Customer Delivery Hub, Mumbai',
    items: [
      { name: 'JudesCart Utility Wool Overshirt (Size M)', qty: 1, price: '₹4,299' },
      { name: 'SonicPro Studio ANC Headphones (Matte Black)', qty: 1, price: '₹4,999' }
    ],
    timeline: [
      {
        title: 'Order Placed & Verified',
        desc: 'Payment processed and verified by JudesCart Security.',
        time: 'Sept 15, 2026 - 10:30 AM',
        completed: true,
      },
      {
        title: 'Packed & Quality Inspected',
        desc: 'Items checked, boxed with eco-friendly protective packaging.',
        time: 'Sept 15, 2026 - 02:45 PM',
        completed: true,
      },
      {
        title: 'Handed to Express Courier',
        desc: 'Departed Bengaluru Air Cargo Hub.',
        time: 'Sept 16, 2026 - 08:15 AM',
        completed: true,
      },
      {
        title: 'In Transit to Destination Facility',
        desc: 'Arriving at Regional Distribution Center.',
        time: 'Sept 16, 2026 - Current Status',
        current: true,
      },
      {
        title: 'Out for Delivery',
        desc: 'Courier agent will arrive with OTP verification.',
        time: 'Expected Sept 18, 2026',
        completed: false,
      },
    ],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setSearchedId(orderQuery.trim().toUpperCase());
        setIsSearching(false);
      }, 400);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111]">Track Order</span>
        </div>

        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-12 h-12 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Track Your Consignment
          </h1>
          <p className="text-[#555555] text-xs sm:text-sm mt-2">
            Real-time live milestone updates for your JudesCart orders & lucky tickets.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Package className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. JC-849201)"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-[#DF9F28] font-mono uppercase text-[#111111]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-xs cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#111111]" />
              <span>{isSearching ? 'Locating...' : 'Track Package'}</span>
            </button>
          </form>
        </div>

        {/* Tracking Details Card */}
        {searchedId && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Status Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0A192F] via-[#061B3A] to-[#0A192F] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-[#DF9F28]">{sampleTrackingData.orderId}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DF9F28]/20 text-[#DF9F28] border border-[#DF9F28]/30">
                    {sampleTrackingData.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black">
                  Estimated Delivery: {sampleTrackingData.estimatedDelivery}
                </h2>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#DF9F28]" />
                  <span>{sampleTrackingData.carrier}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1.5 text-white"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Support</span>
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Timeline Steps */}
              <div className="lg:col-span-7">
                <h3 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-6">
                  Shipment Milestones
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {sampleTrackingData.timeline.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : step.current
                            ? 'bg-white border-[#DF9F28] ring-4 ring-[#FEF8EE]'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        {step.current && <div className="w-1.5 h-1.5 bg-[#DF9F28] rounded-full animate-ping" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <p className={`text-xs font-bold ${step.current ? 'text-[#111111] font-extrabold' : 'text-[#555555]'}`}>
                            {step.title}
                          </p>
                          <span className="text-[10px] text-[#888888] font-mono">{step.time}</span>
                        </div>
                        <p className="text-xs text-[#555555] mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items & Destination */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200/80">
                  <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
                    Consignment Destination
                  </h3>
                  <div className="flex items-start gap-2.5 text-xs text-[#555555]">
                    <MapPin className="w-4 h-4 text-[#DF9F28] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#111111]">Primary Resident Address</p>
                      <p className="text-[#555555] mt-0.5">{sampleTrackingData.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200/80">
                  <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
                    Items in Parcel
                  </h3>
                  <div className="space-y-2.5">
                    {sampleTrackingData.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-[#555555] font-medium truncate mr-2">{item.name}</span>
                        <span className="font-bold text-[#111111] shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <TrackOrderContent />
    </Suspense>
  );
}

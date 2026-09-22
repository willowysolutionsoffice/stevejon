'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Package,
  Globe,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111]">Shipping & Delivery</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-12 h-12 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-[#555555] text-xs sm:text-sm mt-2">
            Fast, insured, and tracked fulfillment across 26,000+ pin codes in India.
          </p>
        </div>

        {/* Shipping Rates Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-10">
          <h2 className="text-lg font-bold text-[#111111] mb-4">Domestic Delivery Speeds & Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[#888888] font-bold uppercase text-[11px]">
                  <th className="pb-3">Shipping Tier</th>
                  <th className="pb-3">Estimated Transit</th>
                  <th className="pb-3">Cost</th>
                  <th className="pb-3">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#555555] font-medium">
                <tr>
                  <td className="py-3.5 font-bold text-[#111111] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#DF9F28]" />
                    <span>Standard Express</span>
                  </td>
                  <td className="py-3.5">3 – 5 Business Days</td>
                  <td className="py-3.5 text-emerald-600 font-bold">FREE on orders ≥ ₹1,999 (else ₹99)</td>
                  <td className="py-3.5">All PIN Codes</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-bold text-[#111111] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#DF9F28]" />
                    <span>Priority Air Cargo</span>
                  </td>
                  <td className="py-3.5">1 – 2 Business Days</td>
                  <td className="py-3.5 font-bold text-[#111111]">₹199 flat</td>
                  <td className="py-3.5">Tier 1 & Metro Cities</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-bold text-[#111111] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#DF9F28]" />
                    <span>Same-Day White Glove</span>
                  </td>
                  <td className="py-3.5">Under 12 Hours (Before 2 PM)</td>
                  <td className="py-3.5 font-bold text-[#111111]">₹349 flat</td>
                  <td className="py-3.5">Mumbai, Bengaluru, Delhi NCR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#111111] mb-1">100% Insured In-Transit</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Every parcel is sealed with tamper-evident security tape and covered under full transit insurance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#111111] mb-1">Eco-Responsible Packaging</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Recyclable honeycomb kraft boxing without unnecessary single-use plastics.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#111111] mb-1">Live SMS & WhatsApp Alerts</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Instant milestone notifications with driver OTP verification on delivery.
            </p>
          </div>
        </div>

        {/* Frequently Asked Shipping Questions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <h2 className="text-lg font-bold text-[#111111] mb-4">Shipping FAQ</h2>
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-bold text-[#111111] mb-1">How can I track my shipment?</h3>
              <p className="text-[#555555] leading-relaxed">
                As soon as your order is dispatched, you will receive a tracking link via SMS, Email, and in your{' '}
                <Link href="/track-order" className="text-[#DF9F28] font-bold hover:text-[#C6891E] transition-colors">
                  Track Order
                </Link>{' '}
                portal.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#111111] mb-1">What happens if I miss the delivery?</h3>
              <p className="text-[#555555] leading-relaxed">
                Our logistics partner attempts delivery up to 3 consecutive times. You can also reschedule delivery directly through the tracking link sent to your phone.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

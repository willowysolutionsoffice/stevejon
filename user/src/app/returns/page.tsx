'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Package,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReturnsPage() {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && reason) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Returns & Refunds</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-12 h-12 bg-amber-500/10 text-[#DF9F28] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            30-Day Hassle-Free Returns & Refunds
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-2">
            Free doorstep pickup with instant refund initiation or exchange replacement.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-4">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Request Return</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Submit your request below or via your Account portal within 30 days of receiving your item.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-4">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Free Doorstep Pickup</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Our courier will arrive at your address with the return label. No packaging printing required.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative">
            <div className="w-8 h-8 rounded-full bg-[#DF9F28] text-slate-950 flex items-center justify-center font-bold text-xs mb-4">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Instant Refund</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Once handed to courier, refund is credited to your original payment method or JudesCoins within 24 hours.
            </p>
          </div>
        </div>

        {/* Interactive Return Request Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-2xl mx-auto mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Initiate Return or Replacement</h2>
          <p className="text-xs text-stone-500 mb-6">
            Enter your order reference number to generate a return shipping docket.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-emerald-950">Return Request Docket Created!</h3>
              <p className="text-xs text-emerald-800 mt-1">
                Pickup has been scheduled for Order #{orderId}. Our courier representative will contact you within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order Reference ID *</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. JC-849201"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-[#DF9F28]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Return / Exchange *</label>
                <select
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#DF9F28] bg-white"
                >
                  <option value="">Select a reason...</option>
                  <option value="size">Size / Fit issue (Free size exchange)</option>
                  <option value="defective">Damaged or defective on arrival</option>
                  <option value="different">Different from description / photos</option>
                  <option value="changed_mind">No longer needed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#111111] hover:bg-[#DF9F28] text-white hover:text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Submit Return Request
              </button>
            </form>
          )}
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-stone-600">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Return Conditions</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>Items must be unworn, unwashed, and in their original packaging with tags intact.</li>
            <li>Electronics and headphones must include all original cables, manuals, and accessories.</li>
            <li>Customized, bespoke, or intimate personal care goods are non-returnable unless defective.</li>
            <li>Lucky Draw Tickets won on refunded orders will be automatically readjusted.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

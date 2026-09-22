'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111]">Customer Support</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-12 h-12 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Headphones className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="text-[#555555] text-xs sm:text-sm mt-2">
            24/7 dedicated concierge support for all your product, orders, and rewards queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-[#111111]">Contact Channels</h2>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111111]">Toll-Free Concierge</p>
                  <p className="text-xs text-[#555555] mt-0.5">+91 1800-419-7000</p>
                  <p className="text-[10px] text-[#888888]">Mon - Sat: 9:00 AM – 9:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111111]">Email Support</p>
                  <p className="text-xs text-[#555555] mt-0.5">concierge@judescart.com</p>
                  <p className="text-[10px] text-[#888888]">Typical response under 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#111111]">Headquarters</p>
                  <p className="text-xs text-[#555555] mt-0.5">
                    JudesCart Atelier Towers, Residency Road, Bengaluru, Karnataka 560025, India
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#FEF8EE] border border-[#DF9F28]/30 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#DF9F28]" />
                <h3 className="text-xs font-bold text-[#111111] uppercase">Self-Service Portals</h3>
              </div>
              <div className="space-y-2 text-xs font-bold">
                <Link href="/track-order" className="block text-[#111111] hover:text-[#DF9F28] transition-colors">
                  → Track Live Package Status
                </Link>
                <Link href="/returns" className="block text-[#111111] hover:text-[#DF9F28] transition-colors">
                  → Initiate Returns or Exchange
                </Link>
                <Link href="/faq" className="block text-[#111111] hover:text-[#DF9F28] transition-colors">
                  → Read Frequently Asked Questions
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-[#111111] mb-2">Send us a Message</h2>
              <p className="text-xs text-[#555555] mb-6">
                Fill in the details below and our customer relations team will contact you shortly.
              </p>

              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-emerald-950">Message Dispatched!</h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Thank you {formData.name}. A support ticket #TC-{Math.floor(1000 + Math.random() * 9000)} has been generated and sent to {formData.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#111111] mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#DF9F28] text-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111111] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#DF9F28] text-[#111111]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiry regarding order or product availability"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#DF9F28] text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#DF9F28] text-[#111111]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#111111]" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

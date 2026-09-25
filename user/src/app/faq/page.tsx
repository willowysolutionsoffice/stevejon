'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ_ITEMS = [
  {
    category: 'Orders & Shipping',
    question: 'How long does it take for my order to be dispatched?',
    answer: 'Standard collection garments and accessories are carefully inspected and dispatched within 24 to 48 business hours. Tracked shipping details are sent automatically via SMS and Email.',
  },
  {
    category: 'Orders & Shipping',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including Razorpay (Credit/Debit cards, UPI, Netbanking) and Cash on Delivery (COD) on eligible orders.',
  },
  {
    category: 'Sartorial & Sizing',
    question: 'How do I ensure I select the right size?',
    answer: 'Each product detail page features an in-depth size guide with chest, shoulder, waist, and length measurements. If you are between sizes, we generally recommend sizing up for a relaxed modern fit.',
  },
  {
    category: 'Exchanges & Returns',
    question: 'What is your exchange and return policy?',
    answer: 'We offer hassle-free 7-day exchanges on standard purchases for fit and sizing. Garments must be unworn, in original condition with all tags attached.',
  },
  {
    category: 'Lucky Draw & Rewards',
    question: 'How does the Weekly Lucky Draw work?',
    answer: 'Every verified order placed on JudesCart automatically generates an official digital lucky ticket linked to your profile and order number. Winners are drawn live every week using a verifiable random protocol.',
  },
  {
    category: 'Lucky Draw & Rewards',
    question: 'Are there any extra fees if I win a prize?',
    answer: 'No. All lucky draw prizes are delivered completely free of charge with all shipping and gift taxes covered by JudesCart as a gesture of appreciation.',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111111] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="sj-container max-w-4xl space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SUPPORT & CONCIERGE</span>
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-sans font-extrabold text-[#111111] tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto">
              Find answers regarding our standards, shipping timelines, returns, and weekly lucky draws.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto pt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#DF9F28] shadow-xs"
                />
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#DF9F28] block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="p-1 rounded-full text-[#888888]">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#DF9F28]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#555555] leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Concierge Box */}
          <div className="bg-[#0A192F] text-white rounded-xl p-8 sm:p-10 text-center space-y-4 shadow-xl border border-[#061B3A]">
            <h3 className="text-xl font-sans font-bold text-white">Still Have Questions?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
              Our concierge team is available to assist you with orders, styling, or delivery queries.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Mail className="w-4 h-4 text-[#DF9F28]" />
                <span>support@judescart.com</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Phone className="w-4 h-4 text-[#DF9F28]" />
                <span>+91 98765 43210</span>
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

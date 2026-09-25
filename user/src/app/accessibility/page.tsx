'use client';

import React from 'react';
import Link from 'next/link';
import { Accessibility, Eye, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111]">Accessibility Statement</span>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
          <div>
            <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-2xl flex items-center justify-center mb-3">
              <Accessibility className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              Accessibility & Inclusion Statement
            </h1>
            <p className="text-xs text-[#888888] mt-1">WCAG 2.1 AA Compliance Initiative</p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#555555] space-y-6 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">Our Commitment</h2>
              <p>
                JudesCart is dedicated to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone, applying the relevant accessibility standards defined by the Web Content Accessibility Guidelines (WCAG 2.1 AA).
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">Key Accessibility Features Implemented</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-[#111111]">Keyboard Navigation:</strong> Full keyboard tab indexing, focus ring indicators, and ⌘K search shortcuts.</li>
                <li><strong className="text-[#111111]">Screen Reader Compatibility:</strong> Proper semantic HTML5 tags, ARIA roles, descriptive alt texts on product imagery, and live announcements.</li>
                <li><strong className="text-[#111111]">Color Contrast & Fluid Typography:</strong> Minimum 4.5:1 color contrast ratio across all text and UI elements, with fluid responsive font scaling.</li>
                <li><strong className="text-[#111111]">Reduced Motion Support:</strong> Respects user preferences for reduced motion animations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">Feedback & Assistance</h2>
              <p>
                We welcome your feedback on the accessibility of JudesCart. If you encounter any barriers, please let our team know at <a href="mailto:accessibility@judescart.com" className="text-[#DF9F28] font-bold hover:text-[#C6891E] underline">accessibility@judescart.com</a> or via our <Link href="/contact" className="text-[#DF9F28] font-bold hover:text-[#C6891E] underline">Customer Support</Link> page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

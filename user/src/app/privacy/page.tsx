'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111]">Privacy Policy</span>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
          <div>
            <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-2xl flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              Privacy & Data Protection Policy
            </h1>
            <p className="text-xs text-[#888888] mt-1">Last Updated: September 2026</p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#555555] space-y-6 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">1. Overview & Commitment</h2>
              <p>
                At JudesCart (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we are committed to safeguarding the privacy and personal data of our customers. This Privacy Policy details how we collect, process, protect, and handle your information across our website, mobile application, and concierge services.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong className="text-[#111111]">Account & Identity:</strong> Name, email address, phone number, and delivery addresses.</li>
                <li><strong className="text-[#111111]">Transaction & Payments:</strong> Encrypted payment tokens processed securely via PCI-DSS compliant gateways (Razorpay, UPI). We do not store raw card numbers.</li>
                <li><strong className="text-[#111111]">Lucky Draw & Gamification:</strong> Ticket numbers, streak claims, and reward redemption histories.</li>
                <li><strong className="text-[#111111]">Device & Usage:</strong> Browser fingerprint, IP address, and cookie identifiers for session management.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">3. How We Use Your Data</h2>
              <p>
                Your information is used strictly to fulfill orders, issue tracking updates, compute lucky draw qualifications, provide customer concierge support, and optimize website performance. We never sell your personal information to third-party data brokers.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">4. 256-Bit SSL Encryption</h2>
              <p>
                All data transmitted between your browser and JudesCart is encrypted using industry-standard TLS 1.3 encryption protocols.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">5. Contact Our Data Protection Officer</h2>
              <p>
                If you have questions regarding your data or wish to request data erasure, please contact us at <a href="mailto:privacy@judescart.com" className="text-[#DF9F28] font-bold hover:text-[#C6891E] underline">privacy@judescart.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

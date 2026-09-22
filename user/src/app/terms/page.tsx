'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Shield, Scale, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6">
          <Link href="/" className="hover:text-[#111111]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111]">Terms of Service</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
          <div>
            <div className="w-10 h-10 bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 rounded-xl flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs text-[#888888] mt-1">Effective Date: September 2026</p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#555555] space-y-6 leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or placing an order on JudesCart (&quot;the Platform&quot;), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">2. Product Pricing & Accuracy</h2>
              <p>
                All prices listed on the website are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to correct pricing errors and cancel orders resulting from inadvertent technical anomalies.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">3. Weekly Lucky Draw & Rewards</h2>
              <p>
                Participation in the JudesCart Weekly Lucky Draw is automatic with eligible purchases. Lucky tickets are generated digitally and tied to specific verified orders. The draw results are audited and transparently published every Sunday at 8:00 PM IST.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">4. User Conduct & Accounts</h2>
              <p>
                You agree not to exploit automated bots, scrapers, or fraudulent payment instruments on the platform. Violation of these terms will lead to immediate account suspension and cancellation of rewards.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[#111111] mb-2">5. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

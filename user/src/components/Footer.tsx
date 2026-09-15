'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  RotateCcw,
  Award,
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Shield,
  CreditCard,
  Headphones,
  Zap,
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#0C0F14] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Top 5-Item Feature Trust Strip */}
      <div className="sj-container pb-14 border-b border-stone-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Express Delivery
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                Insured express dispatch across 26,000+ pin codes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                30-Day Returns
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                Doorstep pickup with instant refunds or size exchanges.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Manufacturer Warranty
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                100% authentic products with standard brand warranty.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Secure Checkout
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                256-bit encrypted Razorpay, UPI & card processing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Weekly Lucky Draw
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                Every verified purchase earns entry tickets to bumper draws.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="sj-container pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/logo-icon.webp"
                  alt="JudesCart Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none font-sans">
                  Judes<span className="text-[#DF9F28]">Cart</span>
                </span>
                <span className="text-[8px] tracking-[0.2em] font-sans font-semibold text-stone-400 uppercase mt-0.5">
                  Shop More. Live Better.
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Discover top-rated electronics, tech gear, premium apparel, footwear, leather goods, smart home essentials, and beauty items with transparent weekly lucky draw rewards.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#DF9F28]" />
                <span>Insider VIP Newsletter (+500 Coins)</span>
              </p>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Welcome to the Insider Club! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-stone-900 border border-stone-800 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-[#DF9F28]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#DF9F28] hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-2">
              <Lock className="w-3.5 h-3.5 text-[#DF9F28]" />
              <span>PCI-DSS Compliant • 256-Bit SSL Protection</span>
            </div>
          </div>

          {/* Column 1: All Departments */}
          <div className="lg:col-span-3">
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
              All Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  All Products Catalog
                </Link>
              </li>
              <li>
                <Link href="/product?category=electronics" className="hover:text-white transition-colors">
                  Electronics & Tech Gear
                </Link>
              </li>
              <li>
                <Link href="/product?category=apparel" className="hover:text-white transition-colors">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link href="/product?category=footwear" className="hover:text-white transition-colors">
                  Footwear & Sneakers
                </Link>
              </li>
              <li>
                <Link href="/product?category=leather" className="hover:text-white transition-colors">
                  Leather Goods & Bags
                </Link>
              </li>
              <li>
                <Link href="/product?category=home" className="hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/product?category=beauty" className="hover:text-white transition-colors">
                  Beauty & Personal Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div className="lg:col-span-3">
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Help / FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Customer Support Concierge
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  My Orders History
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Rewards & Apps */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">
              Rewards & App
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/lucky-draw" className="hover:text-white transition-colors">
                  Weekly Live Draw
                </Link>
              </li>
              <li>
                <Link href="/lucky-draw#bumper-draw" className="hover:text-white transition-colors">
                  Bumper Jackpot
                </Link>
              </li>
              <li>
                <Link href="/lucky-draw#winners" className="hover:text-white transition-colors">
                  Verified Winners
                </Link>
              </li>
              <li>
                <Link href="/lucky-draw#rules" className="hover:text-white transition-colors">
                  Draw Rules
                </Link>
              </li>
              <li>
                <Link href="/install-app" className="text-[#DF9F28] hover:underline font-bold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links & Payment Badges */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>© {new Date().getFullYear()} JudesCart. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/accessibility" className="hover:text-stone-300 transition-colors">
              Accessibility
            </Link>
            <span>•</span>
            <Link href="/install-app" className="hover:text-stone-300 transition-colors">
              Install App
            </Link>
          </div>

          <div className="flex items-center gap-3 text-stone-400 text-[11px]">
            <span className="hover:text-white transition-colors">Razorpay</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">UPI</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">Visa</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">Mastercard</span>
            <span>•</span>
            <span className="hover:text-white transition-colors">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

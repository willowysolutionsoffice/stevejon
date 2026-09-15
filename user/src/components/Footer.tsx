'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  RotateCcw,
  Award,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="sj-container pb-14 border-b border-stone-800">
        
        {/* Top 4-Item Feature Trust Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Express Dispatch
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Complimentary insured delivery across all departments on orders over ₹999.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                7-Day Easy Exchanges
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Hassle-free size exchanges and simple prepaid pickup labels.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Atelier Craftsmanship
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Every piece rigorously inspected for tailoring precision, material durability, and finish.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-stone-900 text-[#DF9F28] border border-stone-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                100% Authentic Guarantee
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                256-bit encrypted Razorpay checkout and certified genuine products.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="sj-container pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
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
              JudesCart is your premier destination for bespoke tailoring, fine leather goods, artisan footwear, and lifestyle essentials paired with transparent weekly lucky draw rewards.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <Lock className="w-3.5 h-3.5 text-[#DF9F28]" />
              <span>PCI-DSS Compliant • 256-Bit Razorpay Checkout</span>
            </div>
          </div>

          {/* Column 1: Shop Departments */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/product?category=Apparel" className="hover:text-white transition-colors">
                  Apparel & Tailoring
                </Link>
              </li>
              <li>
                <Link href="/product?category=Leather+Goods" className="hover:text-white transition-colors">
                  Leather Goods
                </Link>
              </li>
              <li>
                <Link href="/product?category=Accessories" className="hover:text-white transition-colors">
                  Fine Accessories
                </Link>
              </li>
              <li>
                <Link href="/product?category=Outerwear" className="hover:text-white transition-colors">
                  Outerwear & Coats
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sweepstakes & Rewards */}
          <div>
            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3">
              Lucky Draw & Perks
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/lucky-draw" className="hover:text-white transition-colors">
                  Weekly Live Draw
                </Link>
              </li>
              <li>
                <Link href="/lucky-draw#bumper-draw" className="hover:text-white transition-colors">
                  Grand Bumper Jackpot
                </Link>
              </li>
              <li>
                <Link href="/lucky-draw#winners" className="hover:text-white transition-colors">
                  Verified Winners
                </Link>
              </li>
              <li>
                <Link href="/lucky-draw#rules" className="hover:text-white transition-colors">
                  Draw Rules & Eligibility
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} JudesCart. Shop More. Live Better.</p>
          <div className="flex items-center gap-4 text-stone-400">
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


'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

export default function BenefitsSection() {
  return (
    <section className="sj-container">
      <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white shadow-xl border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Text & Value Props */}
          <div className="p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#DF9F28]">
              <span>The JudesCart Standard</span>
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold leading-tight text-white tracking-tight">
              Bespoke Quality. Master Craftsmanship. Timeless Style.
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              At JudesCart, every garment, fine leather good, and bespoke accessory is created with unyielding dedication to material excellence, tailored comfort, and verifiable authenticity.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-800 text-xs text-stone-300">
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DF9F28]" />
                  <span>Atelier Guarantee</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Comprehensive 1-year warranty on all apparel, leathers, and accessories.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-[#DF9F28]" />
                  <span>Carbon-Neutral Dispatch</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-1">
                  Every order is packaged sustainably and shipped with 100% carbon-neutral delivery.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/product"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#DF9F28] transition-colors group"
              >
                <span>Explore the complete JudesCart catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#DF9F28]" />
              </Link>
            </div>
          </div>

          {/* Right Visual Showcase Banner */}
          <div className="relative aspect-square lg:aspect-auto min-h-[360px] bg-stone-900">
            <Image
              src="/about_atelier.png"
              alt="JudesCart bespoke tailoring and craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}


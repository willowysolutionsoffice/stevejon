'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export default function BenefitsSection() {
  return (
    <section className="sj-container">
      <div className="relative rounded-3xl overflow-hidden bg-white text-zinc-900 shadow-xs border border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Text & Value Props */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#DF9F28]">
              <Sparkles className="w-3.5 h-3.5 text-[#DF9F28]" />
              <span>The JudesCart Standard</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 tracking-tight">
              Bespoke Quality. Master Craftsmanship. Timeless Style.
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal max-w-xl">
              At JudesCart, every garment, fine leather good, and bespoke accessory is created with unyielding dedication to material excellence, tailored comfort, and verifiable authenticity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                <h4 className="font-semibold text-zinc-900 uppercase tracking-wide text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#DF9F28]" />
                  <span>Atelier Guarantee</span>
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-normal">
                  Comprehensive 1-year warranty on all apparel, leathers, and accessories.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                <h4 className="font-semibold text-zinc-900 uppercase tracking-wide text-xs flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-[#DF9F28]" />
                  <span>Carbon-Neutral Dispatch</span>
                </h4>
                <p className="text-xs text-zinc-500 mt-1 leading-normal">
                  Every order is packaged sustainably and shipped with 100% carbon-neutral delivery.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/product"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 hover:text-[#DF9F28] transition-colors group focus-visible:outline-none"
              >
                <span>Explore the complete catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#DF9F28]" />
              </Link>
            </div>
          </div>

          {/* Right Visual Showcase Banner */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto min-h-[340px] lg:h-full bg-zinc-100 border-t lg:border-t-0 lg:border-l border-zinc-200">
            <Image
              src="/about_atelier.png"
              alt="JudesCart bespoke tailoring and craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}


'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Truck, Headphones, CreditCard } from 'lucide-react';

export default function PromoSection() {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Upper Banner: Shop and Win */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#1A1A1A] via-[#2D2D2D] to-[#FDFCF8] p-8 md:p-14 min-h-[460px] flex flex-col md:flex-row items-center border border-gray-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        
        {/* Decorative background grid pattern for luxury feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Left Side: Campaign Text */}
        <div className="w-full md:w-1/2 z-10 flex flex-col justify-center text-left text-white pr-4">
          <span className="text-[0.65rem] tracking-[0.25em] text-white/50 uppercase font-sans mb-1">
            Section
          </span>
          <span className="text-xs tracking-[0.2em] font-serif text-[#DF9F28] uppercase mb-6">
            About Us
          </span>
          <h2 className="text-4xl md:text-[3.2rem] font-serif uppercase tracking-[0.05em] leading-[1.1] mb-6">
            Shop <br /> and Win
          </h2>
          <p className="text-white/60 text-xs md:text-sm tracking-wide max-w-sm mb-8 leading-relaxed font-sans">
            Lorem ipsum dolor sit amet consectetur. Euismod fermentum nisi.
          </p>
          <div>
            <a href="#" className="inline-flex items-center gap-2 text-white text-xs tracking-[0.2em] uppercase font-semibold underline underline-offset-8 decoration-white/30 hover:decoration-white transition-all group">
              Read More
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Right Side: Luxury Product Floating Collage */}
        <div className="w-full md:w-1/2 relative h-[300px] md:h-[380px] mt-8 md:mt-0 flex items-center justify-end overflow-visible select-none">
          {/* Base Model Panel (tall backdrop) */}
          <div className="absolute right-0 top-0 bottom-0 w-[45%] rounded-2xl overflow-hidden shadow-xl border border-white/10 z-0">
            <Image
              src="/cat_apparel_1778670103427.png"
              alt="Stevejon Luxury Campaign"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Floating Item 1: Duffle Bag (Center floating, high shadow) */}
          <div className="absolute left-[10%] sm:left-[15%] top-[10%] w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white/5 bg-[#F3F2EE] z-20 transition-transform duration-500 hover:scale-105">
            <Image
              src="/cat_leather_1778670351299.png"
              alt="Stevejon Duffle Bag"
              fill
              className="object-cover mix-blend-multiply p-2"
            />
          </div>

          {/* Floating Item 2: Overshirt (Layered behind Duffle) */}
          <div className="absolute left-[34%] sm:left-[38%] bottom-[5%] w-[100px] h-[120px] sm:w-[130px] sm:h-[160px] rounded-2xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.12)] border border-white/5 bg-[#F3F2EE] z-10 transition-transform duration-500 hover:scale-105">
            <Image
              src="/prod_overshirt_1778670536589.png"
              alt="Stevejon Overshirt"
              fill
              className="object-cover mix-blend-multiply p-2"
            />
          </div>

          {/* Floating Item 3: Accessories (At the bottom, high shadow) */}
          <div className="absolute left-[0%] sm:left-[5%] bottom-[12%] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-2xl overflow-hidden shadow-[0_15px_25px_rgba(0,0,0,0.15)] border border-white/5 bg-[#F3F2EE] z-30 transition-transform duration-500 hover:scale-105">
            <Image
              src="/cat_accessories_1778670517925.png"
              alt="Stevejon Fragrance & Accessories"
              fill
              className="object-cover mix-blend-multiply p-2"
            />
          </div>
        </div>
      </div>

      {/* Bottom Ribbon: Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-gray-100 mt-12">
        {/* Feature 1: Free Shipping */}
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="p-3.5 bg-[#F3F2EE] rounded-full text-black shadow-sm">
            <Truck className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-black font-sans">
              Free Shipping
            </h4>
            <p className="text-[0.65rem] md:text-xs text-gray-500 tracking-wide mt-0.5">
              Free shopping for order above ₹2000
            </p>
          </div>
        </div>

        {/* Feature 2: 24x7 Support */}
        <div className="flex items-center gap-4 justify-center">
          <div className="p-3.5 bg-[#F3F2EE] rounded-full text-black shadow-sm">
            <Headphones className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-black font-sans">
              24 x 7 Support
            </h4>
            <p className="text-[0.65rem] md:text-xs text-gray-500 tracking-wide mt-0.5">
              Support on all days
            </p>
          </div>
        </div>

        {/* Feature 3: COD Available */}
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <div className="p-3.5 bg-[#F3F2EE] rounded-full text-black shadow-sm">
            <CreditCard className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-black font-sans">
              COD Available
            </h4>
            <p className="text-[0.65rem] md:text-xs text-gray-500 tracking-wide mt-0.5">
              Secure Payment Options
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

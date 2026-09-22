'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111111] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="relative py-20 md:py-28 bg-[#0A192F] text-white overflow-hidden border-b border-[#061B3A]">
          <div className="absolute inset-0 bg-radial from-[#DF9F28]/15 via-[#061B3A]/80 to-[#0A192F] pointer-events-none" />
          <div className="sj-container relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
              <span>THE JUDESCART ATELIER</span>
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight">
              A Legacy of Sartorial Excellence
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Crafting bespoke apparel, fine leather accessories, and refined essentials tailored for those who appreciate understated distinction.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="sj-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                  OUR PHILOSOPHY
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-[#111111] leading-snug">
                  Tailoring That Mirrors Character and Sophistication
                </h2>
                <div className="w-16 h-1 bg-[#DF9F28] rounded-full" />
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Founded on the belief that garments are an intimate expression of individuality, JudesCart has redefined modern wardrobe essentials for over three decades. Our journey started with a deep devotion to pure natural fabrics, precise drafting, and the art of the perfect fit.
                </p>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Every creation is a collaboration between master artisans and discerning patrons. We source certified organic cottons, pure cashmere, and full-grain leathers, ensuring each stitch reflects endurance, tactile comfort, and effortless elegance.
                </p>
              </div>

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200">
                <Image
                  src="/cat_apparel_1778670103427.png"
                  alt="JudesCart Tailoring Heritage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pillars of Craft */}
        <section className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="sj-container space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                CORE PRINCIPLES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-[#111111] tracking-tight">
                Crafted Without Compromise
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: 'Artisan Construction',
                  desc: 'Every garment incorporates reinforced hand-finishing, structured canvassing, and precision drafting.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Pure Sustainable Fibres',
                  desc: 'We partner exclusively with certified ethical mills producing long-staple cottons and natural dyes.',
                },
                {
                  icon: Heart,
                  title: 'Patron Community',
                  desc: 'We celebrate our loyal patrons through bespoke privileges, private previews, and our weekly live lucky draw.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:border-[#DF9F28]/40 hover:shadow-md transition-all space-y-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF8EE] text-[#DF9F28] flex items-center justify-center border border-[#DF9F28]/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

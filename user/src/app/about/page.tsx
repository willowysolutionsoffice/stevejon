'use client';

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#061B3A] font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[#031B3F]">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105" 
          style={{ backgroundImage: `url('/cat_apparel_1778670103427.png')` }}
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <span className="text-xs uppercase tracking-[0.3em] text-[#0077FF] font-semibold mb-6 block animate-fade-in">
            ESTABLISHED IN PARIS
          </span>
          <h1 className="text-4xl md:text-7xl font-serif tracking-[0.15em] text-white mb-6">
            STEVEJON
          </h1>
          <p className="text-sm md:text-lg text-white/70 font-light tracking-[0.1em] leading-relaxed max-w-2xl mx-auto">
            Crafting the pinnacle of personalized tailoring and exclusive bespoke collections for the modern connoisseur.
          </p>
        </div>
      </div>

      {/* Our Heritage Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#0077FF] font-bold">
              OUR HERITAGE
            </span>
            <h2 className="text-3xl md:text-4xl font-serif tracking-[0.1em] leading-tight">
              A Legacy of Uncompromising Excellence
            </h2>
            <div className="w-16 h-[1px] bg-[#0077FF]"></div>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Founded on the belief that clothing is the ultimate expression of individuality, STEVEJON has redefined bespoke tailoring for over three decades. Our journey began in a small atelier, fueled by a passion for exquisite fabrics, precise drafting, and the timeless art of the perfect fit.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              Every garment we create is a collaborative masterpiece between the designer, the artisan, and the wearer. We source only the finest fabrics from historic mills in Italy and England, ensuring that each thread tells a story of luxury, comfort, and longevity.
            </p>
          </div>
          
          <div className="relative aspect-[4/5] bg-[#E7F2FF] overflow-hidden group shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105" 
              style={{ backgroundImage: `url('/cat_leather_1778670351299.png')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
          </div>
        </div>
      </div>

      {/* The Philosophy - Full Width Elegant Statement */}
      <div className="bg-[#021631] text-white py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] text-[#0077FF] font-semibold">
            THE PHILOSOPHY
          </span>
          <blockquote className="text-xl md:text-3xl font-serif italic font-light leading-relaxed tracking-wide text-white/90">
            "Tailoring is not just about measurements; it is about sculpting a silhouette that mirrors the soul and projects strength, elegance, and effortless sophistication."
          </blockquote>
          <div className="w-12 h-[1px] bg-[#0077FF] mx-auto"></div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Steve Jon — Founder & Creative Director
          </p>
        </div>
      </div>

      {/* The Three Pillars Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#0077FF] font-bold">
            OUR THREE PILLARS
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-[0.1em]">
            How We Define Perfection
          </h2>
          <div className="w-16 h-[1px] bg-black/10 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4 p-4 hover:bg-white transition-all duration-300 rounded-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="w-12 h-12 rounded-full bg-[#0077FF]/10 flex items-center justify-center mx-auto text-[#0077FF] font-serif text-lg font-semibold">
              I
            </div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 pt-2">
              Sartorial Integrity
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light max-w-xs mx-auto">
              We adhere strictly to traditional tailoring methods, hand-stitching canvasses, lapels, and collars to produce a soft roll and unrivaled drape.
            </p>
          </div>

          <div className="space-y-4 p-4 hover:bg-white transition-all duration-300 rounded-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="w-12 h-12 rounded-full bg-[#0077FF]/10 flex items-center justify-center mx-auto text-[#0077FF] font-serif text-lg font-semibold">
              II
            </div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 pt-2">
              Flawless Materials
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light max-w-xs mx-auto">
              Our wool, cashmere, silk, and linens are selected exclusively from ethical, legendary European mills with centuries of heritage.
            </p>
          </div>

          <div className="space-y-4 p-4 hover:bg-white transition-all duration-300 rounded-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="w-12 h-12 rounded-full bg-[#0077FF]/10 flex items-center justify-center mx-auto text-[#0077FF] font-serif text-lg font-semibold">
              III
            </div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 pt-2">
              Perfect Adaptation
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light max-w-xs mx-auto">
              Every detail, from the horn buttons to custom linings, is tailored precisely to your posture, movement, and personal tastes.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

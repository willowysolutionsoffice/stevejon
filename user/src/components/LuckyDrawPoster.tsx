import React from 'react';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LuckyDrawPoster() {
  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#DF9F28] via-[#B87A15] to-[#8C5D0D] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(223,159,40,0.3)] border border-[#DF9F28]/30">
        
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content */}
        <div className="z-10 text-white w-full md:w-2/3 text-center md:text-left mb-8 md:mb-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-xs tracking-[0.3em] font-sans uppercase font-bold text-white/90">
              Exclusive Event
            </span>
            <Sparkles className="w-5 h-5 text-white/80" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif uppercase tracking-wider mb-4 leading-tight drop-shadow-md">
            Weekly <br className="hidden md:block" /> Lucky Draw
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-md mx-auto md:mx-0 mb-8 font-sans leading-relaxed">
            Participate in our exclusive weekly lucky draw and stand a chance to win premium rewards and shopping vouchers.
          </p>
          <Link href="/lucky-draw" className="inline-flex items-center justify-center gap-2 bg-white text-[#8C5D0D] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] group hover:-translate-y-1">
            Enter Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Visual Element */}
        <div className="z-10 w-full md:w-1/3 flex justify-center relative">
          <div className="relative">
            {/* Glowing background behind gift */}
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
            <div className="relative bg-white/10 p-8 rounded-full border border-white/20 backdrop-blur-sm transform transition-transform duration-700 hover:scale-110 hover:rotate-6 shadow-2xl">
              <Gift className="w-24 h-24 md:w-32 md:h-32 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" strokeWidth={1.5} />
            </div>
            {/* Floating particles */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 animate-bounce" style={{ animationDelay: '100ms' }}>
               <Sparkles className="w-6 h-6 text-white/80" />
            </div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 animate-bounce" style={{ animationDelay: '300ms' }}>
               <Sparkles className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

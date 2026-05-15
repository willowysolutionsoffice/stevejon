import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex flex-col items-center justify-center text-white">

      {/* Background Image */}
      <Image
        src="/hero.png"
        alt="Stevejon Hero"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center mt-32 px-4">
        <h1 className="text-3xl md:text-[2.8rem] font-serif tracking-[0.1em] mb-10 text-center max-w-4xl leading-snug drop-shadow-lg">
          STEVEJON | THE NEW <br /> STANDARD OF REFINEMENT
        </h1>

        <button className="border border-white/60 px-10 py-3 text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 ease-in-out backdrop-blur-sm">
          EXPLORE NOW
        </button>
      </div>

      {/* Bottom Line */}
      <div className="absolute bottom-8 w-3/4 max-w-lg h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20"></div>
    </section>
  );
}
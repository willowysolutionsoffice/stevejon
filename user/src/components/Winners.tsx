'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Zap } from 'lucide-react';

export default function Winners() {
  const winnersList = [
    {
      id: 1,
      name: 'Justin Davis',
      location: 'Kozhikode',
      image: '/winner_man.jpg',
    },
    {
      id: 2,
      name: 'Maria Thomas',
      location: 'Alapuzha',
      image: '/winner_woman.jpg',
    },
    {
      id: 3,
      name: 'Justin Davis',
      location: 'Kozhikode',
      image: '/winner_man.jpg',
    },
    {
      id: 4,
      name: 'Maria Thomas',
      location: 'Alapuzha',
      image: '/winner_woman.jpg',
      hasLightning: true,
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-[#FDFCF8] bg-[linear-gradient(to_right,#1a1a1a03_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a03_1px,transparent_1px)] bg-[size:40px_40px] border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif tracking-[0.1em] uppercase text-[#1A1A1A] mb-3">
            Winners!
          </h2>
          <div className="h-[1px] w-12 bg-[#DF9F28] mx-auto mb-4"></div>
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-500">
            Winners of Week 12
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {winnersList.map((winner, idx) => (
            <div key={idx} className="flex flex-col items-center group relative w-full">
              
              {/* Card Outer Wrapper (handles absolute badges without overflow-hidden) */}
              <div className="relative w-full aspect-[3/4]">
                
                {/* Gold Badge at top-left */}
                <div className="absolute top-3.5 left-3.5 bg-[#DF9F28] text-white p-2 rounded-full shadow-[0_4px_12px_rgba(223,159,40,0.3)] z-20 flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                  <Star className="w-4 h-4 fill-current text-white" />
                </div>

                {/* Micro-Animated Gold Lightning Bolt (Only on 4th Card) */}
                {winner.hasLightning && (
                  <div className="absolute -top-4 -right-2.5 z-30 animate-bounce transition-all duration-300" style={{ animationDuration: '3s' }}>
                    <div className="bg-gradient-to-br from-[#FFD700] to-[#DF9F28] p-2.5 rounded-full shadow-[0_8px_20px_rgba(223,159,40,0.45)] border border-white/20">
                      <Zap className="w-4 h-4 fill-current text-white" />
                    </div>
                  </div>
                )}

                {/* Inner Image Container (isolated overflow-hidden) */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 bg-[#F3F2EE] border border-gray-100/50">
                  {/* Winner Portrait Image */}
                  <Image
                    src={winner.image}
                    alt={`Winner - ${winner.name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-750 group-hover:scale-105"
                    priority
                  />

                  {/* Soft bottom overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

              </div>

              {/* Name & Details */}
              <div className="text-center mt-4">
                <h4 className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] font-sans">
                  {winner.name}
                </h4>
                <p className="text-[0.65rem] md:text-xs tracking-[0.2em] font-medium text-[#DF9F28] uppercase mt-1">
                  {winner.location}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

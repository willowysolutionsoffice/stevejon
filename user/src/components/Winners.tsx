'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, Zap } from 'lucide-react';

interface WinnerRecord {
  week: number;
  date: string;
  orderId: string;
  name: string;
  location: string;
  prize: string;
  isUser: boolean;
}

const DEFAULT_SEED_WINNERS = [
  {
    name: 'Justin Davis',
    location: 'Kozhikode',
    image: '/winner_man.jpg',
    week: 12,
  },
  {
    name: 'Maria Thomas',
    location: 'Alapuzha',
    image: '/winner_woman.jpg',
    week: 11,
  },
  {
    name: 'Justin Davis',
    location: 'Kozhikode',
    image: '/winner_man.jpg',
    week: 10,
  },
  {
    name: 'Maria Thomas',
    location: 'Alapuzha',
    image: '/winner_woman.jpg',
    week: 9,
    hasLightning: true,
  },
];

export default function Winners() {
  const [winnersList, setWinnersList] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadDefaultSeeds = React.useCallback(() => {
    setWinnersList(DEFAULT_SEED_WINNERS.map((s, idx) => ({
      id: idx + 1,
      name: s.name,
      location: s.location,
      image: s.image,
      weekText: `Week ${s.week}`,
      prize: 'Stevejon Atelier Prize',
      hasLightning: s.hasLightning,
    })));
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('stevejon_lucky_draw_winners');
    if (stored) {
      try {
        const parsed: WinnerRecord[] = JSON.parse(stored);
        
        // Map the stored winners to include portraits and layout fields
        const mapped = parsed.map((w, idx) => {
          // Intelligently assign existing portraits based on names
          const femaleNames = ['maria', 'elena', 'seraphina', 'asha', 'sophia', 'hana', 'thomas'];
          const lowerName = w.name.toLowerCase();
          const isFemale = femaleNames.some(fn => lowerName.includes(fn));
          
          return {
            id: idx + 1,
            name: w.name,
            location: w.location,
            image: isFemale ? '/winner_woman.jpg' : '/winner_man.jpg',
            weekText: `Week ${w.week}`,
            prize: w.prize,
            hasLightning: idx === 0, // Highlight the most recent winner with the gold lightning bolt!
          };
        });

        // If we have mapped winners, use them. If we have less than 4, pad with default seeds
        if (mapped.length > 0) {
          const padded = [...mapped];
          if (padded.length < 4) {
            const extraSeeds = DEFAULT_SEED_WINNERS.slice(padded.length);
            extraSeeds.forEach((seed, seedIdx) => {
              padded.push({
                id: padded.length + 1,
                name: seed.name,
                location: seed.location,
                image: seed.image,
                weekText: `Week ${seed.week}`,
                prize: 'Signature Stevejon Atelier Prize',
                hasLightning: false,
              });
            });
          }
          setWinnersList(padded.slice(0, 4));
        } else {
          setWinnersList(DEFAULT_SEED_WINNERS.map((s, idx) => ({
            id: idx + 1,
            name: s.name,
            location: s.location,
            image: s.image,
            weekText: `Week ${s.week}`,
            prize: 'Stevejon Atelier Prize',
            hasLightning: s.hasLightning,
          })));
        }
      } catch (e) {
        console.error('Failed to parse dynamic winners on homepage', e);
        loadDefaultSeeds();
      }
    } else {
      loadDefaultSeeds();
    }
  }, []);


  if (!mounted) {
    return (
      <section className="py-24 px-4 md:px-8 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse h-10 w-48 bg-gray-200 mx-auto rounded"></div>
        </div>
      </section>
    );
  }

  // Find the highest week to display in header title (or fallback to Week 12)
  const displayWeekText = winnersList[0]?.weekText || 'Week 12';

  return (
    <section className="py-24 px-4 md:px-8 bg-[#FDFCF8] bg-[linear-gradient(to_right,#1a1a1a03_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a03_1px,transparent_1px)] bg-[size:40px_40px] border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-serif tracking-[0.1em] uppercase text-[#1A1A1A] mb-3">
            Winners!
          </h2>
          <div className="h-[1px] w-12 bg-[#DF9F28] mx-auto mb-4"></div>
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-500">
            Featured Winners of {displayWeekText}
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {winnersList.map((winner, idx) => (
            <div key={idx} className="flex flex-col items-center group relative w-full animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
              
              {/* Card Outer Wrapper (handles absolute badges without overflow-hidden) */}
              <div className="relative w-full aspect-[3/4]">
                
                {/* Gold Badge at top-left */}
                <div className="absolute top-3.5 left-3.5 bg-[#DF9F28] text-white p-2 rounded-full shadow-[0_4px_12px_rgba(223,159,40,0.3)] z-20 flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                  <Star className="w-4 h-4 fill-current text-white" />
                </div>

                {/* Micro-Animated Gold Lightning Bolt (Only on 4th Card or most recent drawn winner) */}
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
                  {winner.location} ({winner.weekText})
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

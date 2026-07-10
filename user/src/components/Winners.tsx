'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getApiUrl } from '@/lib/api';

interface ShowcaseWinner {
  id: string;
  winnerName: string;
  winnerPlace: string;
  winnerImage: string;
  drawCampaign: {
    name: string;
    prizeName: string;
  };
}

export default function Winners() {
  const [winners, setWinners] = useState<ShowcaseWinner[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${getApiUrl()}/draws/showcase`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setWinners(res.data);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Hide section if no showcase winners published yet
  if (!loaded || winners.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 bg-[#F5FAFF] border-t border-gray-100/50">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif tracking-[0.1em] uppercase text-[#061B3A] mb-3">
            Our Winners
          </h2>
          <div className="h-[1px] w-12 bg-[#0077FF] mx-auto mb-4" />
          <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-gray-500">
            Celebrated champions of our lucky draw
          </p>
        </div>

        {/* Winners Grid – centred */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {winners.map((winner, idx) => (
            <div
              key={winner.id}
              className="flex flex-col items-center group w-[160px] md:w-[200px]"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Portrait */}
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 bg-[#E7F2FF] border border-gray-100/50">
                <Image
                  src={winner.winnerImage}
                  alt={winner.winnerName}
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={idx < 4}
                />
                {/* Bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Name & details – centred */}
              <div className="text-center mt-4 space-y-1">
                <h4 className="text-xs md:text-sm font-semibold tracking-[0.12em] uppercase text-[#061B3A]">
                  {winner.winnerName}
                </h4>
                <p className="text-[0.65rem] md:text-xs tracking-[0.18em] font-medium text-[#0077FF] uppercase">
                  {winner.winnerPlace}
                </p>
                <p className="text-[0.6rem] text-gray-400 tracking-wide">
                  {winner.drawCampaign.prizeName}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

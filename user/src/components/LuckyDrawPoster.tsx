'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

type DrawCampaign = {
  id: string;
  name: string;
  prizeName: string;
  prizeImage: string;
  startDate: string;
  endDate: string;
  winnerCount: number;
  status: string;
};

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(endDate: string): TimeLeft {
  const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function LuckyDrawPoster() {
  const [campaigns, setCampaigns] = useState<DrawCampaign[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 3, hours: 14, minutes: 22, seconds: 45 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${getApiUrl()}/draws`)
      .then((r) => r.json())
      .then((res) => {
        const active: DrawCampaign[] = Array.isArray(res.data)
          ? res.data.filter((c: DrawCampaign) => c.status === 'ACTIVE')
          : [];
        setCampaigns(active);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (campaigns.length === 0) return;
    const endDate = campaigns[current]?.endDate || new Date(Date.now() + 86400000 * 4).toISOString();
    setTimeLeft(getTimeLeft(endDate));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [campaigns, current]);

  const activeCampaign = campaigns.length > 0 ? campaigns[current] : {
    id: 'default',
    name: 'Weekly JudesCart Rewards Draw',
    prizeName: 'JudesCart Tailored Cashmere Coat & Travel Duffle',
    prizeImage: '/cat_leather_1778670351299.png',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    winnerCount: 1,
    status: 'ACTIVE',
  };

  return (
    <section className="sj-container">
      <div className="relative rounded-3xl overflow-hidden bg-[#0A192F] text-white border border-[#061B3A] shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Text & Countdown */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DF9F28]/15 border border-[#DF9F28]/40 text-[#DF9F28] text-xs font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#DF9F28]" />
              <span>Live Weekly Sweepstakes</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {activeCampaign.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 max-w-lg leading-relaxed font-normal">
              Every verified customer order automatically generates lucky draw tickets. Discover fine tailoring and enter transparent weekly prize drawings.
            </p>

            {/* Countdown Box */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-[#DF9F28] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#DF9F28]" />
                <span>Next Live Draw Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-2 max-w-xs text-center font-mono">
                <div className="bg-[#061B3A] border border-white/10 rounded-xl p-2.5">
                  <span className="block text-lg sm:text-xl font-bold text-white leading-none">{pad(timeLeft.days)}</span>
                  <span className="text-[10px] text-slate-300 font-sans font-medium uppercase mt-1 block">Days</span>
                </div>
                <div className="bg-[#061B3A] border border-white/10 rounded-xl p-2.5">
                  <span className="block text-lg sm:text-xl font-bold text-white leading-none">{pad(timeLeft.hours)}</span>
                  <span className="text-[10px] text-slate-300 font-sans font-medium uppercase mt-1 block">Hours</span>
                </div>
                <div className="bg-[#061B3A] border border-white/10 rounded-xl p-2.5">
                  <span className="block text-lg sm:text-xl font-bold text-white leading-none">{pad(timeLeft.minutes)}</span>
                  <span className="text-[10px] text-slate-300 font-sans font-medium uppercase mt-1 block">Mins</span>
                </div>
                <div className="bg-[#061B3A] border border-[#DF9F28]/30 rounded-xl p-2.5">
                  <span className="block text-lg sm:text-xl font-bold text-[#DF9F28] leading-none">{pad(timeLeft.seconds)}</span>
                  <span className="text-[10px] text-[#DF9F28] font-sans font-medium uppercase mt-1 block">Secs</span>
                </div>
              </div>
            </div>

            {/* Primary CTA (Spec: bg #DF9F28, text #111111, hover #C6891E) */}
            <div className="pt-2">
              <Link
                href="/lucky-draw"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-98 focus-visible:ring-2 focus-visible:ring-[#DF9F28]"
              >
                <span>View Lucky Draw Details</span>
                <ArrowRight className="w-4 h-4 text-[#111111]" />
              </Link>
            </div>
          </div>

          {/* Right Prize Image Showcase */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto min-h-[320px] lg:h-full bg-[#061B3A] border-t lg:border-t-0 lg:border-l border-white/10">
            <Image
              src={activeCampaign.prizeImage || '/prod_overshirt_1778670536589.png'}
              alt={activeCampaign.prizeName}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 p-3.5 rounded-xl bg-[#061B3A]/90 backdrop-blur-md border border-white/10 text-white">
              <span className="text-[10px] uppercase font-semibold text-[#DF9F28] tracking-wider block">
                Featured Prize
              </span>
              <p className="font-semibold text-xs sm:text-sm text-white line-clamp-1 mt-0.5">
                {activeCampaign.prizeName}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

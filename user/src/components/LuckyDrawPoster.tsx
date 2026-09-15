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
      <div className="relative rounded-3xl overflow-hidden bg-[#111111] text-white border border-stone-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Text & Countdown */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DF9F28]/15 border border-[#DF9F28]/40 text-[#DF9F28] text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#DF9F28] animate-pulse" />
              <span>LIVE WEEKLY SWEEPSTAKES</span>
            </div>

            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {activeCampaign.name}
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed font-normal">
              Every verified customer order automatically generates lucky draw tickets. Discover fine tailoring and enter transparent weekly prize drawings.
            </p>

            {/* Countdown Box */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-[#DF9F28] uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#DF9F28]" />
                <span>Next Live Draw Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-2 max-w-xs text-center">
                <div className="bg-black/50 border border-stone-800 rounded-xl p-2">
                  <span className="block font-sans text-lg sm:text-xl font-bold text-white">{pad(timeLeft.days)}</span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">Days</span>
                </div>
                <div className="bg-black/50 border border-stone-800 rounded-xl p-2">
                  <span className="block font-sans text-lg sm:text-xl font-bold text-white">{pad(timeLeft.hours)}</span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">Hours</span>
                </div>
                <div className="bg-black/50 border border-stone-800 rounded-xl p-2">
                  <span className="block font-sans text-lg sm:text-xl font-bold text-white">{pad(timeLeft.minutes)}</span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">Mins</span>
                </div>
                <div className="bg-black/50 border border-stone-800 rounded-xl p-2">
                  <span className="block font-sans text-lg sm:text-xl font-bold text-[#DF9F28]">{pad(timeLeft.seconds)}</span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase">Secs</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <Link
                href="/lucky-draw"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DF9F28] hover:bg-[#C6891E] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
              >
                <span>View Lucky Draw Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Prize Image Showcase */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto min-h-[320px] bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800">
            <Image
              src={activeCampaign.prizeImage || '/prod_overshirt_1778670536589.png'}
              alt={activeCampaign.prizeName}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 p-3 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-700/60 text-white">
              <span className="text-[10px] uppercase font-bold text-[#DF9F28] tracking-wider block">
                Featured Prize
              </span>
              <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                {activeCampaign.prizeName}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

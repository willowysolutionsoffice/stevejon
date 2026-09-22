'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Clock,
  Ticket,
  ShieldCheck,
  ArrowRight,
  Gift,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  ShoppingBag,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

type Winner = {
  id: string;
  winnerName: string;
  winnerPlace: string;
  winnerImage: string;
  drawCampaign?: {
    name: string;
    prizeName: string;
  };
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

export default function LuckyDrawPage() {
  const [campaigns, setCampaigns] = useState<DrawCampaign[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 3, hours: 14, minutes: 22, seconds: 45 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, wRes] = await Promise.all([
          fetch(`${getApiUrl()}/draws`),
          fetch(`${getApiUrl()}/draws/showcase`),
        ]);

        if (cRes.ok) {
          const cData = await cRes.json();
          if (Array.isArray(cData?.data)) {
            setCampaigns(cData.data);
            const active = cData.data.find((c: DrawCampaign) => c.status === 'ACTIVE');
            if (active) {
              const target = active.endDate;
              setTimeLeft(getTimeLeft(target));
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
            }
          }
        }

        if (wRes.ok) {
          const wData = await wRes.json();
          if (Array.isArray(wData?.data)) {
            setWinners(wData.data);
          }
        }
      } catch (err) {
        console.error('Error loading lucky draw page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const activeCampaign = campaigns.find((c) => c.status === 'ACTIVE') || {
    id: 'default',
    name: 'Weekly Grand Lucky Draw Campaign',
    prizeName: 'JudesCart Signature Cashmere Suit & Duffle',
    prizeImage: '/prod_overshirt_1778670536589.png',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    winnerCount: 1,
    status: 'ACTIVE',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111111] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION WITH LIVE COUNTDOWN & GRAND PRIZE */}
        {/* ========================================================================= */}
        <section className="relative bg-[#0A192F] text-white py-16 md:py-24 overflow-hidden border-b border-[#061B3A]">
          <div className="absolute inset-0 bg-radial from-[#DF9F28]/10 via-[#061B3A]/85 to-[#0A192F] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DF9F28]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="sj-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Headlines & Timer */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DF9F28]/15 border border-[#DF9F28]/40 text-[#DF9F28] text-xs font-bold tracking-widest uppercase">
                  <Trophy className="w-3.5 h-3.5 text-[#DF9F28]" />
                  <span>COMMUNITY REWARD INITIATIVE</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-extrabold text-white tracking-tight leading-tight">
                  The JudesCart <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF9F28] via-amber-200 to-white">
                    Weekly Grand Draw
                  </span>
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
                  Every order placed on JudesCart automatically enters our weekly verified prize draw. Win signature bespoke garments, handcrafted leather goods, and exclusive gift rewards.
                </p>

                {/* Live Countdown Timer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-300">
                    <Clock className="w-4 h-4 text-[#DF9F28]" />
                    <span>Next Live Draw Countdown:</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 max-w-sm">
                    {[
                      { label: 'Days', val: timeLeft.days },
                      { label: 'Hours', val: timeLeft.hours },
                      { label: 'Minutes', val: timeLeft.minutes },
                      { label: 'Seconds', val: timeLeft.seconds },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="bg-[#061B3A]/90 border border-white/10 rounded-2xl p-3 text-center shadow-lg"
                      >
                        <span className="block text-2xl sm:text-3xl font-bold font-mono text-white">
                          {pad(t.val)}
                        </span>
                        <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                          {t.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href="/product"
                    className="px-7 py-3.5 bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg shadow-[#DF9F28]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#111111]" />
                    <span>Shop Eligible Products</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full backdrop-blur-sm transition-all flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-[#DF9F28]" />
                    <span>View My Tickets</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Grand Prize Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#061B3A] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between group">
                  <Image
                    src={activeCampaign.prizeImage || '/prod_overshirt_1778670536589.png'}
                    alt={activeCampaign.prizeName}
                    fill
                    className="object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061B3A] via-[#061B3A]/60 to-transparent" />

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-[#DF9F28]/20 border border-[#DF9F28]/40 text-[#DF9F28] text-[10px] font-bold tracking-widest uppercase">
                      THIS WEEK&apos;S REWARD
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">
                      {activeCampaign.winnerCount} Lucky Winner(s)
                    </span>
                  </div>

                  <div className="relative z-10 space-y-2">
                    <p className="text-xs font-bold text-[#DF9F28] uppercase tracking-widest">
                      {activeCampaign.name}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-white leading-snug">
                      {activeCampaign.prizeName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified JudesCart Authentic Gift</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. HOW IT WORKS: 3-STEP EXPLANATION */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-24 bg-white border-b border-slate-200">
          <div className="sj-container space-y-12">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                SIMPLE & TRANSPARENT
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-[#111111] tracking-tight">
                How It Works
              </h2>
              <p className="text-xs sm:text-sm text-[#555555]">
                Participating in JudesCart lucky draw campaigns takes zero extra effort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: ShoppingBag,
                  title: 'Shop Any Product',
                  desc: 'Browse our catalog and place an order. Every verified purchase qualifies automatically.',
                },
                {
                  step: '02',
                  icon: Ticket,
                  title: 'Receive Lucky Ticket',
                  desc: 'Your unique ticket code is generated and linked to your order ID and profile instantly.',
                },
                {
                  step: '03',
                  icon: Trophy,
                  title: 'Weekly Live Draw',
                  desc: 'Winners are drawn every week and announced across our portal with rewards delivered directly.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 hover:border-[#DF9F28]/50 hover:shadow-md transition-all relative group"
                  >
                    <span className="text-4xl font-sans font-extrabold text-slate-200 group-hover:text-[#DF9F28]/30 transition-colors absolute top-6 right-6">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF8EE] text-[#DF9F28] border border-[#DF9F28]/20 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider mb-2">
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

        {/* ========================================================================= */}
        {/* 3. ACTIVE & UPCOMING CAMPAIGNS LIST */}
        {/* ========================================================================= */}
        <section className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
          <div className="sj-container space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                  ACTIVE SCHEDULE
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-[#111111] tracking-tight">
                  Campaign Schedule
                </h2>
                <p className="text-xs sm:text-sm text-[#555555]">
                  Explore current campaigns and prizes up for grabs this month.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#0A192F]">
                    <Image
                      src={camp.prizeImage || '/prod_overshirt_1778670536589.png'}
                      alt={camp.prizeName}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xs ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#0A192F] text-slate-300'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#111111]">{camp.name}</h3>
                      <p className="text-xs font-semibold text-[#DF9F28] uppercase tracking-wider">
                        Prize: {camp.prizeName}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#555555]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#888888]" />
                        <span>Draw: {new Date(camp.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <span className="font-semibold text-[#111111]">{camp.winnerCount} Winner(s)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PAST WINNERS HALL OF FAME */}
        {/* ========================================================================= */}
        {winners.length > 0 && (
          <section className="py-16 md:py-24 bg-white">
            <div className="sj-container space-y-10">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                  COMMUNITY RECOGNITION
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-[#111111] tracking-tight">
                  Past Draw Winners
                </h2>
                <p className="text-xs sm:text-sm text-[#555555]">
                  Real customers who took home signature JudesCart prizes.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {winners.map((winner, idx) => (
                  <div
                    key={winner.id || idx}
                    className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4 text-center space-y-3 hover:border-[#DF9F28]/40 transition-colors"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-200">
                      <Image
                        src={winner.winnerImage || '/winner_man.jpg'}
                        alt={winner.winnerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111111]">{winner.winnerName}</h4>
                      <p className="text-xs text-[#DF9F28] font-semibold">{winner.winnerPlace}</p>
                      <p className="text-[11px] text-[#888888] mt-1">
                        {winner.drawCampaign?.prizeName || 'Signature Prize'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

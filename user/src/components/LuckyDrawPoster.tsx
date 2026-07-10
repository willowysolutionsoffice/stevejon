'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Trophy, Timer } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

type DrawCampaign = {
  id: string;
  name: string;
  prizeName: string;
  prizeImage: string;
  startDate: string;
  endDate: string;
  winnerCount: number;
  status: string; // "ACTIVE" | "UPCOMING" | "COMPLETED"
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

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

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function LuckyDrawPoster() {
  const [campaigns, setCampaigns] = useState<DrawCampaign[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${getApiUrl()}/draws`)
      .then((r) => r.json())
      .then((res) => {
        const active: DrawCampaign[] = Array.isArray(res.data)
          ? res.data.filter((c: DrawCampaign) => c.status === 'ACTIVE')
          : [];
        setCampaigns(active);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Update countdown every second based on current slide's endDate
  useEffect(() => {
    if (campaigns.length === 0) return;
    const endDate = campaigns[current].endDate;
    setTimeLeft(getTimeLeft(endDate));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [campaigns, current]);

  const handleNext = useCallback(() => {
    if (isTransitioning || campaigns.length < 2) return;
    setIsTransitioning(true);
    setCurrent((p) => (p === campaigns.length - 1 ? 0 : p + 1));
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, campaigns.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || campaigns.length < 2) return;
    setIsTransitioning(true);
    setCurrent((p) => (p === 0 ? campaigns.length - 1 : p - 1));
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, campaigns.length]);

  // Auto-slide every 5 seconds when multiple campaigns
  useEffect(() => {
    if (campaigns.length < 2) return;
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext, campaigns.length]);

  // Hide section entirely if not loaded yet or no active campaigns
  if (!loaded || campaigns.length === 0) return null;

  const campaign = campaigns[current];

  return (
    <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0077FF] via-[#004EA8] to-[#002B66] shadow-[0_20px_50px_rgba(0,119,255,0.30)] border border-[#0077FF]/30">

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Slides wrapper */}
        <div
          className="relative transition-all duration-500 ease-in-out"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <div className="p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Left – content */}
            <div className="z-10 text-white w-full md:w-3/5 text-center md:text-left">
              {/* Badge */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-white/80" />
                <span className="text-xs tracking-[0.3em] font-sans uppercase font-bold text-white/90">
                  Exclusive Event
                </span>
                <Sparkles className="w-4 h-4 text-white/80" />
              </div>

              {/* Campaign name */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif uppercase tracking-wider mb-3 leading-tight drop-shadow-md">
                {campaign.name}
              </h2>

              {/* Prize name */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <Trophy className="w-4 h-4 text-white/90 shrink-0" />
                <p className="text-white/90 text-sm md:text-base font-sans font-semibold">
                  Prize: <span className="text-white">{campaign.prizeName}</span>
                </p>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-5 text-xs text-white/70 font-sans">
                <span className="flex items-center gap-1">
                  Ends {formatDate(campaign.endDate)}
                </span>
                <span>🏆 {campaign.winnerCount} winner{campaign.winnerCount !== 1 ? 's' : ''}</span>
              </div>

              {/* Countdown timer */}
              <div className="mb-6">
                <div className="flex items-center justify-center md:justify-start gap-1.5 mb-2">
                  <Timer className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-xs text-white/70 uppercase tracking-widest font-sans">Draw closes in</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hrs', value: timeLeft.hours },
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Sec', value: timeLeft.seconds },
                  ].map(({ label, value }, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center">
                        <div className="min-w-[52px] bg-white/10 border border-white/25 rounded-xl px-3 py-2 text-center backdrop-blur-sm">
                          <span className="text-2xl font-bold text-white font-mono tabular-nums leading-none">
                            {pad(value)}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/60 mt-1 uppercase tracking-widest">{label}</span>
                      </div>
                      {i < 3 && <span className="text-white/50 text-xl font-bold mb-4">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/lucky-draw`}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#002B66] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] group hover:-translate-y-1"
              >
                Enter Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right – prize image */}
            <div className="z-10 w-full md:w-2/5 flex justify-center relative">
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl transform transition-transform duration-700 hover:scale-105">
                  <Image
                    src={campaign.prizeImage}
                    alt={campaign.prizeName}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Floating sparkles */}
                <div className="absolute -top-4 -right-4 animate-bounce" style={{ animationDelay: '100ms' }}>
                  <Sparkles className="w-6 h-6 text-white/80" />
                </div>
                <div className="absolute -bottom-4 -left-4 animate-bounce" style={{ animationDelay: '300ms' }}>
                  <Sparkles className="w-8 h-8 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple campaign controls */}
        {campaigns.length > 1 && (
          <>
            {/* Prev / Next arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous campaign"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Next campaign"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {campaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === current || isTransitioning) return;
                    setIsTransitioning(true);
                    setCurrent(idx);
                    setTimeout(() => setIsTransitioning(false), 600);
                  }}
                  className={`transition-all duration-400 rounded-full focus:outline-none cursor-pointer ${
                    idx === current ? 'w-6 h-1.5 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Campaign ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}

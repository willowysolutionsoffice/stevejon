'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Gift, Crown } from 'lucide-react';

const ANNOUNCEMENTS = [
  { text: "COMPLIMENTARY EXPRESS DELIVERY ON ORDERS ABOVE ₹999", link: "/product", icon: Truck },
  { text: "WEEKLY LUCKY DRAW — WIN BESPOKE GIFTS WITH EVERY ORDER", link: "/lucky-draw", icon: Gift },
  { text: "NEW SEASON BESPOKE APPAREL & ACCESSORIES NOW LIVE", link: "/collections", icon: Crown },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[index];
  const Icon = current.icon;

  return (
    <div className="bg-[#111111] text-white text-[11px] font-medium tracking-[0.12em] uppercase py-2 px-4 border-b border-stone-800 transition-colors">
      <div className="sj-container flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-stone-400 text-[10px]">
          <Truck className="w-3.5 h-3.5 text-[#DF9F28]" />
          <span>Tracked Global Delivery</span>
        </div>

        <div className="flex-1 text-center truncate">
          <Link
            href={current.link}
            className="inline-flex items-center justify-center gap-2 hover:text-[#DF9F28] transition-colors group"
          >
            <Icon className="w-3.5 h-3.5 text-[#DF9F28] shrink-0 animate-pulse" />
            <span className="truncate font-semibold tracking-wider">{current.text}</span>
            <ArrowRight className="w-3 h-3 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 text-stone-400 text-[10px]">
          <Link href="/lucky-draw" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DF9F28] animate-pulse"></span>
            <span className="font-semibold text-[#DF9F28]">Live Draw</span>
          </Link>
          <span>•</span>
          <Link href="/faq" className="hover:text-white transition-colors">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}

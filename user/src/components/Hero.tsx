'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  Trophy,
  Crown,
  ShoppingBag,
  ArrowRight,
  Clock,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Deal items for the interactive Deal Card
const FLASH_DEALS = [
  {
    id: 'deal-1',
    name: 'JudesCart Utility Wool Overshirt',
    price: 4299,
    originalPrice: 5249,
    discount: '-18%',
    image: '/prod_overshirt_1778670536589.png',
    href: '/product?id=prod-1',
    stock: 'In Stock • Ready to Dispatch',
  },
  {
    id: 'deal-2',
    name: 'Tailored Merino Blend Suit Jacket',
    price: 14999,
    originalPrice: 18499,
    discount: '-19%',
    image: '/cat_apparel_1778670103427.png',
    href: '/product?id=prod-2',
    stock: 'Only 3 left in batch',
  },
  {
    id: 'deal-3',
    name: 'Handcrafted Leather Briefcase',
    price: 8299,
    originalPrice: 9999,
    discount: '-17%',
    image: '/cat_leather_1778670351299.png',
    href: '/product?id=prod-3',
    stock: 'Hand-Burnished Edition',
  },
  {
    id: 'deal-4',
    name: 'Minimalist Bifold Cardholder',
    price: 2199,
    originalPrice: 2899,
    discount: '-24%',
    image: '/cat_accessories_1778670517925.png',
    href: '/product?id=prod-5',
    stock: 'Limited Atelier Run',
  },
];

// Typed hero campaign card interface
export interface HeroCardConfig {
  id: string;
  tabLabel: string;
  tabIcon: React.ElementType;
  pillIcon: React.ElementType;
  pillLabel: string;
  pillClass: string;
  badgeLabel: string;
  badgeClass: string;
  title: string;
  subtitle: string;
  bgImage: string;
  gradientClass: string;
  borderClass: string;
  linkText: string;
  linkHref: string;
  linkColor: string;
  type: 'deal' | 'countdown' | 'weekly-draw' | 'bumper-jackpot';
}

export const HERO_CARDS: HeroCardConfig[] = [
  {
    id: 'special-drops',
    tabLabel: 'Flash Deals',
    tabIcon: Flame,
    pillIcon: Flame,
    pillLabel: 'Special Offers',
    pillClass: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
    badgeLabel: 'Save Up To 24%',
    badgeClass: 'bg-rose-600 text-white font-bold',
    title: 'Discounted & Flash Deals',
    subtitle: 'Handpicked premium drops on immediate offer.',
    bgImage: '/prod_overshirt_1778670536589.png',
    gradientClass: 'from-[#1c1204] via-[#261906] to-[#120b02]',
    borderClass: 'border-amber-500/40 hover:border-amber-400',
    linkText: 'Explore All Catalog Offers',
    linkHref: '/product',
    linkColor: 'text-[#DF9F28] hover:text-amber-200',
    type: 'deal',
  },
  {
    id: 'seasonal-gala',
    tabLabel: 'Sale Events',
    tabIcon: Calendar,
    pillIcon: Calendar,
    pillLabel: 'Upcoming Sales',
    pillClass: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
    badgeLabel: 'In 3 Days',
    badgeClass: 'bg-amber-500/90 text-slate-950 font-bold',
    title: 'Sale Days & Events',
    subtitle: 'JudesCart Autumn Gala arrives shortly.',
    bgImage: '/cat_leather_1778670351299.png',
    gradientClass: 'from-[#0a1224] via-[#121c38] to-[#070c18]',
    borderClass: 'border-amber-400/30 hover:border-amber-400',
    linkText: 'Preview Early-Bird Catalog',
    linkHref: '/collections',
    linkColor: 'text-[#DF9F28] hover:text-amber-200',
    type: 'countdown',
  },
  {
    id: 'weekly-draws',
    tabLabel: 'Lucky Draws',
    tabIcon: Trophy,
    pillIcon: Trophy,
    pillLabel: 'Weekly Lucky Draws',
    pillClass: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
    badgeLabel: '3 Tiers',
    badgeClass: 'bg-emerald-600 text-white font-bold',
    title: 'Shop & Win Every Week',
    subtitle: 'Every verified order automatically enters draw.',
    bgImage: '/cat_accessories_1778670517925.png',
    gradientClass: 'from-[#031d14] via-[#062b1e] to-[#02140e]',
    borderClass: 'border-emerald-500/40 hover:border-emerald-400',
    linkText: 'Weekly Draw Rules',
    linkHref: '/lucky-draw#rules',
    linkColor: 'text-emerald-300 hover:text-emerald-200',
    type: 'weekly-draw',
  },
  {
    id: 'grand-bumper',
    tabLabel: 'JUDES Jackpot',
    tabIcon: Crown,
    pillIcon: Crown,
    pillLabel: 'Judes Exclusive',
    pillClass: 'bg-purple-500/25 border-amber-400/50 text-amber-300',
    badgeLabel: 'Annual Grand',
    badgeClass: 'bg-[#DF9F28] text-slate-950 font-bold',
    title: 'Grand Bumper Jackpot',
    subtitle: 'Annual flagship prize draw for valued patrons.',
    bgImage: '/about_craftsmanship.png',
    gradientClass: 'from-[#1a0828] via-[#2c0d44] to-[#11031c]',
    borderClass: 'border-amber-400/50 hover:border-amber-400',
    linkText: 'View Bumper Draw Details',
    linkHref: '/lucky-draw',
    linkColor: 'text-[#DF9F28] hover:text-amber-200',
    type: 'bumper-jackpot',
  },
];

interface HeroCampaignCardProps {
  card: HeroCardConfig;
  timeLeft: { days: number; hours: number; mins: number; secs: number };
  activeDealIndex: number;
  onSelectDeal: (idx: number) => void;
  dealAdded: boolean;
  alertSet: boolean;
  onQuickAddDeal: (e: React.MouseEvent) => void;
  onSetAlert: (e: React.MouseEvent) => void;
}

function HeroCampaignCard({
  card,
  timeLeft,
  activeDealIndex,
  onSelectDeal,
  dealAdded,
  alertSet,
  onQuickAddDeal,
  onSetAlert,
}: HeroCampaignCardProps) {
  const PillIcon = card.pillIcon;
  const currentDeal = FLASH_DEALS[activeDealIndex] || FLASH_DEALS[0];

  return (
    <div
      className={`w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-b ${card.gradientClass} border ${card.borderClass} text-white relative select-none shadow-md hover:shadow-2xl transition-all duration-300 group`}
    >
      {/* Background Silhouette Image */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src={card.bgImage}
          alt={card.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Main Content Stack */}
      <div className="relative z-10 space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* Row 1: Header Badges */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider shrink-0 whitespace-nowrap ${card.pillClass}`}
          >
            <PillIcon className="w-3 h-3 shrink-0" />
            <span>{card.pillLabel}</span>
          </div>
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${card.badgeClass}`}
          >
            {card.badgeLabel}
          </span>
        </div>

        {/* Row 2: Title & Subtitle */}
        <div>
          <h2 className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
            {card.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 line-clamp-1">
            {card.subtitle}
          </p>
        </div>

        {/* Row 3: Dynamic Interactive Content Section */}
        {card.type === 'deal' && (
          <>
            <div className="p-2 sm:p-2.5 space-y-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/20">
                  <Image
                    src={currentDeal.image}
                    alt={currentDeal.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  <div className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black bg-rose-600 text-white leading-none">
                    {currentDeal.discount}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={currentDeal.href}
                    className="text-[11px] font-bold text-white hover:text-amber-300 transition-colors line-clamp-1 block"
                    title={currentDeal.name}
                  >
                    {currentDeal.name}
                  </Link>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-black text-amber-300">
                      ₹{currentDeal.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      ₹{currentDeal.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[9px] text-emerald-300 font-semibold block">
                    {currentDeal.stock}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onQuickAddDeal}
                className="w-full py-1.5 px-2.5 text-[11px] rounded-md font-bold flex items-center justify-center gap-1 transition-all duration-200 shadow-xs cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/30 active:scale-98"
              >
                {dealAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span>{dealAdded ? 'Added to Bag' : 'Quick Add Deal'}</span>
              </button>
            </div>

            {/* Deal Pagination Indicators */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[8px] sm:text-[9px] text-stone-400 font-medium">
                Deal {activeDealIndex + 1} of {FLASH_DEALS.length}
              </span>
              <div className="flex items-center gap-1">
                {FLASH_DEALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectDeal(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      activeDealIndex === i
                        ? 'w-4 bg-amber-400'
                        : 'w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Show deal ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {card.type === 'countdown' && (
          <>
            <div className="p-2 sm:p-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Autumn Gala Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-white leading-none">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Days</span>
                </div>
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-white leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Hours</span>
                </div>
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-white leading-none">
                    {String(timeLeft.mins).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Mins</span>
                </div>
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-cyan-300 leading-none">
                    {String(timeLeft.secs).padStart(2, '0')}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Secs</span>
                </div>
              </div>
            </div>

            <div className="p-1.5 rounded-md bg-white/5 border border-white/10 flex items-center justify-between text-[9px] sm:text-[10px]">
              <span className="font-semibold text-slate-200 truncate">Sept 18–22: Mega Autumn Gala</span>
              <span className="font-bold text-amber-300 shrink-0 ml-1">Up to 60%</span>
            </div>

            <button
              type="button"
              onClick={onSetAlert}
              className="w-full py-1.5 px-2.5 text-[11px] rounded-md font-bold flex items-center justify-center gap-1 transition-all duration-200 shadow-xs cursor-pointer bg-white/15 hover:bg-white/25 text-indigo-200 border border-white/20 active:scale-98"
            >
              {alertSet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5 text-indigo-300" />}
              <span>{alertSet ? 'Alert Configured' : 'Set Sale Alert'}</span>
            </button>
          </>
        )}

        {card.type === 'weekly-draw' && (
          <>
            <div className="space-y-1">
              <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[9px]">
                    💎
                  </span>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-white leading-none block">
                      Platinum Tier
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-emerald-200">
                      Bespoke Suits & Watches
                    </span>
                  </div>
                </div>
                <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded">
                  &gt;₹5,000
                </span>
              </div>

              <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[9px]">
                    🥇
                  </span>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-white leading-none block">
                      Gold Tier
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-emerald-200">
                      Signature Leather Goods
                    </span>
                  </div>
                </div>
                <span className="text-[8px] sm:text-[9px] font-extrabold text-blue-300 bg-blue-400/10 px-1.5 py-0.2 rounded">
                  ₹2,500+
                </span>
              </div>

              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[9px]">
                    🥈
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-white leading-none block">
                      Silver
                    </span>
                    <span className="text-[9px] text-emerald-200">
                      Cashmere & Accessories
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-cyan-300 bg-cyan-400/10 px-1.5 py-0.2 rounded">
                  ₹1,000+
                </span>
              </div>
            </div>

            <Link
              href="/lucky-draw"
              className="w-full py-1.5 px-2.5 text-[11px] rounded-md font-bold flex items-center justify-center gap-1 transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xs cursor-pointer active:scale-98"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              <span>Open Prize Wheel</span>
            </Link>
          </>
        )}

        {card.type === 'bumper-jackpot' && (
          <>
            <div className="p-2 space-y-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-amber-400/30">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xs shrink-0">
                  🚗
                </span>
                <span className="font-bold text-amber-200 truncate">Luxury SUV & Vehicle</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-pink-400/20 border border-pink-400/40 flex items-center justify-center text-xs shrink-0">
                  ✈️
                </span>
                <span className="font-bold text-pink-200 truncate">7-Day International Tour</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-xs shrink-0">
                  💰
                </span>
                <span className="font-bold text-yellow-200 truncate">₹5,00,000 Cash Spree</span>
              </div>
            </div>

            <Link
              href="/product"
              className="w-full py-1.5 px-2.5 text-[11px] rounded-md font-black flex items-center justify-center gap-1 transition-all duration-200 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-xs active:scale-98"
            >
              <Crown className="w-3.5 h-3.5 text-slate-950" />
              <span>Shop Brand JudesCart</span>
            </Link>
          </>
        )}
      </div>

      {/* Card Footer Link */}
      <div className="relative z-10 pt-2 mt-2 border-t border-white/10">
        <Link
          href={card.linkHref}
          className={`group/link flex items-center justify-between text-[11px] font-bold transition-colors ${card.linkColor}`}
        >
          <span>{card.linkText}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function Hero() {
  const { addToCart } = useCart();
  const [activeCard, setActiveCard] = useState(0);
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [dealAdded, setDealAdded] = useState(false);
  const [alertSet, setAlertSet] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 13,
    mins: 45,
    secs: 41,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAddDeal = (e: React.MouseEvent) => {
    e.preventDefault();
    const deal = FLASH_DEALS[activeDealIndex] || FLASH_DEALS[0];
    addToCart({
      productId: deal.id,
      title: deal.name,
      category: 'Apparel',
      price: deal.price,
      image: deal.image,
      size: 'L',
      color: 'Classic',
      quantity: 1,
    });
    setDealAdded(true);
    setTimeout(() => setDealAdded(false), 2000);
  };

  const handleSetAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 font-sans">
      {/* Section Heading Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#DF9F28] block mb-1">
            Curated Drops & Campaigns
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover JudesCart Campaigns
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-[1.3] font-normal">
          Explore exclusive seasonal tailoring, limited handcrafted leather drops, weekly verified sweepstakes, and the JudesCart grand bumper jackpot.
        </p>
      </div>

      {/* Mobile Interactive Tab Switcher & Swipe Frame */}
      <div className="block md:hidden pb-3">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-2.5 pt-1 px-1">
          {HERO_CARDS.map((card, idx) => {
            const TabIcon = card.tabIcon;
            const isActive = activeCard === idx;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveCard(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#DF9F28] text-slate-950 shadow-md font-bold'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/60'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{card.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Card Frame */}
        <div className="relative w-full max-w-[360px] mx-auto pt-1">
          <HeroCampaignCard
            card={HERO_CARDS[activeCard]}
            timeLeft={timeLeft}
            activeDealIndex={activeDealIndex}
            onSelectDeal={setActiveDealIndex}
            dealAdded={dealAdded}
            alertSet={alertSet}
            onQuickAddDeal={handleQuickAddDeal}
            onSetAlert={handleSetAlert}
          />
        </div>

        {/* Mobile Pagination Control */}
        <div className="flex items-center justify-between mt-3 px-3 max-w-[360px] mx-auto">
          <button
            type="button"
            aria-label="Previous Campaign Card"
            onClick={() => setActiveCard((prev) => (prev > 0 ? prev - 1 : HERO_CARDS.length - 1))}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-stone-200 shadow-xs text-stone-700 hover:text-[#DF9F28] active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {HERO_CARDS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to card ${i + 1}`}
                onClick={() => setActiveCard(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCard === i ? 'w-6 bg-[#DF9F28]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next Campaign Card"
            onClick={() => setActiveCard((prev) => (prev < HERO_CARDS.length - 1 ? prev + 1 : 0))}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-stone-200 shadow-xs text-stone-700 hover:text-[#DF9F28] active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop 4-Card Grid */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        {HERO_CARDS.map((card) => (
          <div key={card.id} className="w-full h-full">
            <HeroCampaignCard
              card={card}
              timeLeft={timeLeft}
              activeDealIndex={activeDealIndex}
              onSelectDeal={setActiveDealIndex}
              dealAdded={dealAdded}
              alertSet={alertSet}
              onQuickAddDeal={handleQuickAddDeal}
              onSetAlert={handleSetAlert}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
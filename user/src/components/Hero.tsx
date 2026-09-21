'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '@/lib/api';

export interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  offerPrice?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  badge?: string;
}

// Authentic high-resolution Steve Jon landscape e-commerce banners
const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    tag: 'AUTUMN / WINTER COLLECTION',
    title: 'Signature Tailoring & Outerwear',
    offerPrice: 'Starting from ₹4,299*',
    description: 'Precision-tailored wool overshirts, blazers, and luxury knitwear engineered for effortless modern distinction.',
    buttonText: 'Shop Collection',
    buttonLink: '/product',
    image: '/banners/Banner.jpg',
    badge: 'NEW SEASON',
  },
  {
    id: 'banner-2',
    tag: 'HANDCRAFTED ATELIER',
    title: 'Artisan Bags & Leather Goods',
    offerPrice: 'Up to 40% OFF',
    description: 'Hand-burnished full-grain leather briefcases, wallets, and accessories crafted to age with authentic character.',
    buttonText: 'Explore Leather',
    buttonLink: '/product?category=Signature%20Leather%20Goods',
    image: '/banners/banner5.jpg',
    badge: 'LIMITED EDITION',
  },
  {
    id: 'banner-3',
    tag: 'CONTEMPORARY FOOTWEAR',
    title: 'Signature Footwear & Sneakers',
    offerPrice: 'Up to 50% OFF',
    description: 'Clean silhouette sneakers, boots, and everyday essentials crafted for durability and timeless appeal.',
    buttonText: 'Explore Deals',
    buttonLink: '/product',
    image: '/banners/banner2.jpg',
    badge: 'SALE EVENT',
  },
];

export default function Hero() {
  const [banners, setBanners] = useState<BannerSlide[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch admin banners from backend if configured
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/banners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            const activeBanners = data.filter((b: any) => b.isActive !== false);
            if (activeBanners.length >= 2) {
              const mapped: BannerSlide[] = activeBanners.map((b: any, idx: number) => {
                const def = DEFAULT_BANNERS[idx % DEFAULT_BANNERS.length];
                return {
                  id: b.id || `banner-${idx}`,
                  tag: 'EXCLUSIVE DROP',
                  title: b.title || def.title,
                  offerPrice: def.offerPrice,
                  description: def.description,
                  buttonText: b.buttonText || 'Shop Now',
                  buttonLink: b.buttonLink || '/product',
                  image: b.image || def.image,
                  badge: 'FEATURED',
                };
              });
              setBanners(mapped);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = banners.length;

  // Next / Previous rotation
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // When clicking Card 2 (Secondary Banner on right):
  // Advances by 1: (1, 2) -> (2, 3) -> (3, 1) -> (1, 2)
  const handleSecondaryClick = () => {
    nextSlide();
  };

  // Autoplay (6.5s) with pause on hover
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide, total]);

  // Touch gesture support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  // Pair logic: Spot 1 shows banners[currentIndex], Spot 2 shows banners[(currentIndex + 1) % total]
  const spot1Banner = banners[currentIndex] || DEFAULT_BANNERS[0];
  const spot2Index = (currentIndex + 1) % total;
  const spot2Banner = banners[spot2Index] || DEFAULT_BANNERS[1];

  return (
    <section className="sj-container pt-3 sm:pt-5 md:pt-12 pb-0 select-none">
      {/* 2-Column Banner Grid: Full Width on Mobile/Tablet, Split 8:4 on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        
        {/* =========================================================================
            SPOT 1: LARGE MAIN CAMPAIGN BANNER (Full width on Mobile, 8 Cols on Desktop)
            Landscape e-commerce image background + readable promotional text + CTA
           ========================================================================= */}
        <div
          className="w-full lg:col-span-8 xl:col-span-8 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-sm transition-all duration-300 group flex flex-col justify-between h-[340px] xs:h-[370px] sm:h-[400px] md:h-[420px] lg:h-[440px] xl:h-[460px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows (Visible on Tablet & Desktop) */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                aria-label="Previous slide"
                className="hidden sm:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center border border-white/20 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Next slide"
                className="hidden sm:flex absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center border border-white/20 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={spot1Banner.id}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col justify-between"
            >
              {/* Wide Landscape Banner Image */}
              <Image
                src={spot1Banner.image}
                alt={spot1Banner.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 75vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />

              {/* Enhanced Readability Gradient for mobile portrait and desktop landscape */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 sm:bg-gradient-to-r sm:from-black/90 sm:via-black/60 sm:to-transparent pointer-events-none" />

              {/* Banner Text Content & CTA (Left-Aligned) */}
              <div className="relative z-10 p-5 sm:p-7 md:p-9 lg:p-11 flex flex-col justify-between h-full max-w-xl space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 inline-block px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/20">
                    {spot1Banner.tag}
                  </span>

                  <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[36px] xl:text-[38px] font-bold text-white tracking-tight leading-tight line-clamp-2">
                    {spot1Banner.title}
                  </h1>

                  {spot1Banner.offerPrice && (
                    <p className="text-sm xs:text-base sm:text-lg font-bold text-amber-300 tracking-tight pt-0.5">
                      {spot1Banner.offerPrice}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-zinc-200/95 font-normal leading-relaxed line-clamp-2 max-w-xs sm:max-w-md pt-0.5">
                    {spot1Banner.description}
                  </p>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-1 sm:pt-2 flex flex-col items-start gap-1.5 sm:gap-2">
                  <Link
                    href={spot1Banner.buttonLink}
                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide rounded-xl shadow-md transition-all duration-200 inline-flex items-center gap-1.5 sm:gap-2 group/btn cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>{spot1Banner.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>

                  <span className="text-[10px] sm:text-[11px] text-zinc-300/90 font-medium">
                    Complimentary Lucky Draw ticket included with every order
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================================================================
            SPOT 2: SECONDARY PROMOTIONAL BANNER (Visible on Desktop lg+, hidden on mobile/tablet)
           ========================================================================= */}
        <div
          onClick={handleSecondaryClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden lg:flex lg:col-span-4 xl:col-span-4 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer lg:h-[440px] xl:h-[460px] flex-col justify-between"
          title="Click to bring this banner into the main spotlight"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={spot2Banner.id}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-7"
            >
              {/* Secondary Landscape Banner Image */}
              <Image
                src={spot2Banner.image}
                alt={spot2Banner.title}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Top-to-Bottom Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30 pointer-events-none" />

              {/* Top Status Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                  {spot2Banner.badge || 'UP NEXT'}
                </span>
                <span className="text-[10px] font-semibold text-white/90 uppercase tracking-wider flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                  <span>Up Next</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Bottom Promotional Details */}
              <div className="relative z-10 space-y-2 pt-6">
                {spot2Banner.offerPrice && (
                  <span className="text-sm font-bold text-amber-300 uppercase tracking-wide block">
                    {spot2Banner.offerPrice}
                  </span>
                )}

                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2">
                  {spot2Banner.title}
                </h2>

                <div className="pt-2 flex items-center justify-between border-t border-white/20">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white group-hover:text-amber-200 transition-colors">
                    {spot2Banner.buttonText}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* =========================================================================
          PAGINATION DOTS: (1, 2, 3)
         ========================================================================= */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          {banners.map((banner, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={banner.id}
                type="button"
                aria-label={`Go to banner ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-6 bg-zinc-900 shadow-xs'
                    : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
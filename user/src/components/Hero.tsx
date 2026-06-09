'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

type Banner = {
  id: string;
  title: string;
  image: string;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  isActive: boolean;
};

export default function Hero() {
  const [slides, setSlides] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${getApiUrl()}/banners`)
      .then((r) => r.json())
      .then((data: Banner[]) => {
        const active = Array.isArray(data)
          ? data.filter((b) => b.isActive).sort((a, b) => a.order - b.order)
          : [];
        setSlides(active);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioning || slides.length < 2) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, slides.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || slides.length < 2) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index: number) => {
    if (index === current || isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [handleNext, slides.length]);

  // Loading skeleton
  if (!loaded) {
    return (
      <section className="relative h-[95vh] w-full bg-[#111] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </section>
    );
  }

  // Fallback — no banners configured
  if (slides.length === 0) {
    return (
      <section className="relative h-[95vh] w-full overflow-hidden flex flex-col items-center justify-center text-white bg-[#111]">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-serif tracking-widest mb-4">STEVEJON</h1>
          <p className="text-white/60 text-sm tracking-widest uppercase">The New Standard of Refinement</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[95vh] w-full overflow-hidden flex flex-col items-center justify-center text-white bg-[#111]">

      {/* ── Background slides – cross-fade + Ken Burns ── */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                idx === current ? 'scale-100' : 'scale-105'
              }`}
            />
            {/* Dark elegant vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>
        ))}
      </div>

      {/* ── Slide content – staggered text animations ── */}
      <div className="relative z-20 text-center flex flex-col items-center mt-28 px-6 max-w-5xl select-none">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`${isActive ? 'block' : 'hidden'} flex flex-col items-center`}
            >
              {/* Title – slides up + fades in */}
              <h1
                className={`text-3xl md:text-[3.2rem] font-serif tracking-[0.08em] mb-8 text-center leading-snug drop-shadow-xl max-w-4xl transition-all duration-1000 delay-200 transform ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {slide.title.split(' | ').map((part, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <br className="hidden md:inline" />}
                    {index > 0 && <span className="text-white/40 hidden md:inline"> | </span>}
                    {part}
                  </React.Fragment>
                ))}
              </h1>

              {/* CTA button – slides up + scales in, delayed */}
              {slide.buttonText && slide.buttonLink && (
                <div
                  className={`transition-all duration-1000 delay-[400ms] transform ${
                    isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                  }`}
                >
                  <Link
                    href={slide.buttonLink}
                    className="border border-white/60 px-10 py-4 text-xs font-semibold tracking-[0.25em] hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-in-out backdrop-blur-md inline-block"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Navigation arrows (glassmorphism) ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/10 hover:border-white/30 bg-black/10 hover:bg-black/30 text-white/70 hover:text-white transition-all duration-300 focus:outline-none backdrop-blur-sm hidden md:flex items-center justify-center cursor-pointer group"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5] group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/10 hover:border-white/30 bg-black/10 hover:bg-black/30 text-white/70 hover:text-white transition-all duration-300 focus:outline-none backdrop-blur-sm hidden md:flex items-center justify-center cursor-pointer group"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 z-30 flex gap-3 items-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-500 rounded-full focus:outline-none cursor-pointer ${
                idx === current
                  ? 'w-8 h-1 bg-[#DF9F28]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Ambient bottom fade ── */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#FDFCF8] to-transparent z-20 pointer-events-none" />
    </section>
  );
}
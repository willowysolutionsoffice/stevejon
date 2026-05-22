'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: "/hero.png",
    tagline: "ESTABLISHED IN PARIS",
    title: "STEVEJON | THE NEW STANDARD OF REFINEMENT",
    description: "Experience the pinnacle of personalized tailoring and exclusive bespoke collections.",
    buttonText: "EXPLORE NOW",
    link: "/collections"
  },
  {
    image: "/about_atelier.png",
    tagline: "THE ATELIER EXPERIENCE",
    title: "TRADITION MEETS CONTEMPORARY ELEGANCE",
    description: "Sartorial craftsmanship passed down through generations, shaped for the modern silhouette.",
    buttonText: "OUR STORY",
    link: "/about"
  },
  {
    image: "/about_craftsmanship.png",
    tagline: "UNCOMPROMISING PRECISION",
    title: "UNRIVALED CRAFTSMANSHIP IN EVERY DETAIL",
    description: "Every stitch tells a story of mathematical precision, luxury fabrics, and absolute comfort.",
    buttonText: "DISCOVER ATELIER",
    link: "/about"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (index === current || isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000); // Auto-slide every 6 seconds

    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="relative h-[95vh] w-full overflow-hidden flex flex-col items-center justify-center text-white bg-[#111]">
      
      {/* Background Slides (Cross-fade) */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
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
            {/* Dark elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>
        ))}
      </div>

      {/* Slide Content */}
      <div className="relative z-20 text-center flex flex-col items-center mt-28 px-6 max-w-5xl select-none">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={idx}
              className={`${isActive ? 'block' : 'hidden'} flex flex-col items-center`}
            >
              {/* Tagline */}
              <span 
                className={`text-xs uppercase tracking-[0.35em] text-[#DF9F28] font-bold mb-4 transition-all duration-700 delay-100 transform ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {slide.tagline}
              </span>

              {/* Title */}
              <h1 
                className={`text-3xl md:text-[3.2rem] font-serif tracking-[0.08em] mb-6 text-center leading-snug drop-shadow-xl max-w-4xl transition-all duration-1000 delay-200 transform ${
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

              {/* Description */}
              <p
                className={`text-sm md:text-base font-light text-white/70 max-w-2xl leading-relaxed mb-10 tracking-[0.05em] transition-all duration-1000 delay-300 transform ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {slide.description}
              </p>

              {/* CTA Button */}
              <div 
                className={`transition-all duration-1000 delay-400 transform ${
                  isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
              >
                <Link
                  href={slide.link}
                  className="border border-white/60 px-10 py-4 text-xs font-semibold tracking-[0.25em] hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-in-out backdrop-blur-md inline-block"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Minimal Glassmorphism) */}
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

      {/* Dots Indicator */}
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

      {/* Ambient bottom fade line */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#FDFCF8] to-transparent z-20 pointer-events-none"></div>
    </section>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image: string;
}

export default function TodaysDeal() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 4, seconds: 32 });
  const [dealProducts, setDealProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDealProducts = async () => {
      const apiUrl = getApiUrl();
      try {
        const response = await fetch(`${apiUrl}/products?limit=2`);
        if (response.ok) {
          const resData = await response.json();
          if (resData && Array.isArray(resData.data)) {
            const mapped = resData.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              image: p.image || "/prod_overshirt_1778670536589.png"
            }));
            setDealProducts(mapped);
          }
        }
      } catch (error) {
        console.error("Error fetching deal products:", error);
      }
    };

    fetchDealProducts();

    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const difference = endOfDay.getTime() - now.getTime();

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-[2rem] border border-gray-100/80 shadow-[0_15px_50px_rgba(0,0,0,0.02)] overflow-hidden p-6 md:p-12 flex flex-col lg:flex-row items-stretch gap-8 min-h-[480px]">
        {/* Deal info & Countdown */}
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4 lg:p-8 min-w-[280px]">
          <h2 className="text-3xl md:text-[2.6rem] font-serif tracking-[0.1em] uppercase text-[#061B3A] mb-4">
            Today&apos;s Deal
          </h2>
          <p className="text-gray-500 text-xs md:text-sm tracking-[0.15em] uppercase mb-10">
            Grab the chance, <span className="text-[#061B3A] font-semibold">Get 50% OFF.</span>
          </p>

          {/* Countdown digits */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#061B3A] tracking-tight tabular-nums min-w-[3rem] md:min-w-[4rem]">
                {timeLeft.hours}
              </span>
              <span className="text-[0.65rem] md:text-xs tracking-[0.2em] font-medium text-gray-400 uppercase mt-2">Hours</span>
            </div>
            
            <span className="text-2xl md:text-3xl font-light text-[#061B3A]/30 -mt-6">:</span>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#061B3A] tracking-tight tabular-nums min-w-[3rem] md:min-w-[4rem]">
                {timeLeft.minutes}
              </span>
              <span className="text-[0.65rem] md:text-xs tracking-[0.2em] font-medium text-gray-400 uppercase mt-2">Minutes</span>
            </div>

            <span className="text-2xl md:text-3xl font-light text-[#061B3A]/30 -mt-6">:</span>

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#061B3A] tracking-tight tabular-nums min-w-[3rem] md:min-w-[4rem]">
                {timeLeft.seconds}
              </span>
              <span className="text-[0.65rem] md:text-xs tracking-[0.2em] font-medium text-gray-400 uppercase mt-2">Seconds</span>
            </div>
          </div>

          <Link href="/product" className="bg-[#061B3A] hover:bg-black text-white font-medium text-xs tracking-[0.2em] uppercase px-10 py-4 rounded-full inline-flex items-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 group cursor-pointer">
            Shop Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Deal Cards */}
        {dealProducts.map((prod) => (
          <Link key={prod.id} href={`/product?id=${prod.id}`} className="w-full lg:w-[28%] relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-[#E7F2FF] block">
            <Image
              src={prod.image}
              alt={`Today's Deal - ${prod.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 28vw"
              className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105 p-6"
              priority
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Link at the bottom */}
            <div className="absolute bottom-6 left-0 right-0 text-center z-10">
              <span className="text-white text-[0.65rem] md:text-xs tracking-[0.2em] uppercase font-medium underline underline-offset-4 decoration-white/70 group-hover:decoration-white transition-all">
                {prod.name}
              </span>
            </div>
          </Link>
        ))}

        {/* Fallbacks if dealProducts count is less than 2 */}
        {dealProducts.length === 0 && [1, 2].map((i) => (
          <div key={i} className="w-full lg:w-[28%] rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]"></div>
        ))}
      </div>
    </section>
  );
}

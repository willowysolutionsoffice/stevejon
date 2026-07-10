'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiUrl } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  image: string;
}

export default function CollectionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const apiUrl = getApiUrl();
      try {
        const response = await fetch(`${apiUrl}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Error fetching collections categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#061B3A] font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-20">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.1em] mb-4">OUR COLLECTIONS</h1>
          <div className="w-24 h-[1px] bg-black/20 mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex flex-col animate-pulse">
                <div className="aspect-[3/4] w-full bg-gray-200 rounded-2xl"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mt-6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
            {categories.map((cat) => (
              <Link href={`/product?category=${encodeURIComponent(cat.name)}`} key={cat.id} className="group cursor-pointer block">
                <div className="relative aspect-[3/4] bg-[#E7F2FF] mb-4 overflow-hidden rounded-2xl">
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 mt-6">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">{cat.name}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 border-b border-transparent group-hover:border-black/30 pb-1 transition-colors">Discover</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

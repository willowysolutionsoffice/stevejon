'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight, Trophy, Zap, X } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
}

export default function ProductPage() {
  // Real project products catalog duplicated to form a pristine 9-item grid
  const productsCatalog: Product[] = [
    {
      id: 1,
      title: "Utility Overshirt",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/prod_overshirt_1778670536589.png"
    },
    {
      id: 2,
      title: "Leather Duffle Bag",
      category: "Leather Goods",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_leather_1778670351299.png"
    },
    {
      id: 3,
      title: "Signature Perfume",
      category: "Accessories",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_accessories_1778670517925.png"
    },
    {
      id: 4,
      title: "Double-Breasted Coat",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_apparel_1778670103427.png"
    },
    {
      id: 5,
      title: "Savile Row Trouser",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/prod_trouser_1778670553370.png"
    },
    {
      id: 6,
      title: "Luxury Briefcase",
      category: "Leather Goods",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_leather_1778670351299.png"
    },
    {
      id: 7,
      title: "Premium Atelier Scarf",
      category: "Accessories",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_accessories_1778670517925.png"
    },
    {
      id: 8,
      title: "Casual Utility Trouser",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/prod_trouser_1778670553370.png"
    },
    {
      id: 9,
      title: "Stevejon Signature Set",
      category: "Accessories",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_accessories_1778670517925.png"
    }
  ];

  // Client-side category selection state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Apparel', 'Leather Goods']);

  // Handle category checkbox changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all active filters
  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  // Filter products catalog dynamically
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return productsCatalog;
    return productsCatalog.filter(p => selectedCategories.includes(p.category));
  }, [selectedCategories]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN: Sidebar Filters & Widgets */}
          <aside className="w-full lg:w-1/4 flex flex-col gap-10 lg:sticky lg:top-32 select-none">
            
            {/* Filter Section Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-serif tracking-[0.1em] uppercase text-black mb-8 pb-3 border-b border-gray-100">
                Filter Option
              </h2>

              {/* Category Checkboxes */}
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">
                  Category
                </h3>
                <div className="flex flex-col gap-3">
                  {['Apparel', 'Leather Goods', 'Accessories'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 text-xs tracking-wider font-medium text-gray-700 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="w-4 h-4 rounded border-gray-200 text-[#DF9F28] focus:ring-[#DF9F28] accent-[#DF9F28]"
                      />
                      <span className="group-hover:text-black transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Checkboxes */}
              <div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">
                  Price Range
                </h3>
                <div className="flex flex-col gap-3">
                  {['Under ₹5000', '₹5000 - ₹10000', 'Over ₹10000'].map(price => (
                    <label key={price} className="flex items-center gap-3 text-xs tracking-wider font-medium text-gray-700 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={price === '₹5000 - ₹10000'}
                        className="w-4 h-4 rounded border-gray-200 text-[#DF9F28] focus:ring-[#DF9F28] accent-[#DF9F28]"
                        disabled
                      />
                      <span className="group-hover:text-black transition-colors opacity-60">{price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Flash Sales Gold Widget */}
            <div className="relative rounded-[2.2rem] p-8 text-center bg-gradient-to-br from-[#FDF8EE] to-[#F5EAD4] border border-[#DF9F28]/15 shadow-sm overflow-hidden flex flex-col items-center">
              
              {/* Floating gold lightning icon in corner */}
              <div className="absolute -top-3 -left-3 text-[#DF9F28]/20 z-0">
                <Zap className="w-20 h-20 fill-current" />
              </div>

              <div className="bg-[#DF9F28]/10 text-[#DF9F28] p-3 rounded-full mb-6 z-10">
                <Zap className="w-6 h-6 fill-current" />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif italic font-extrabold text-black uppercase tracking-wide leading-none mb-3 z-10">
                Flash Sales!
              </h3>
              
              <p className="text-gray-600 text-[0.7rem] md:text-xs tracking-wider leading-relaxed max-w-[200px] mb-8 font-sans z-10">
                Check out the latest offer products and win attractive prizes!
              </p>

              <button className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-8 py-3 rounded-full inline-flex items-center gap-1.5 transition-all text-xs font-semibold tracking-[0.15em] uppercase hover:shadow-lg hover:shadow-yellow-600/10 group cursor-pointer z-10">
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Win Weekly Badge */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 flex items-center justify-center gap-3 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="bg-[#DF9F28]/10 p-2 rounded-full">
                <Trophy className="w-4 h-4 text-[#DF9F28]" />
              </div>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-black font-sans">
                Win Weekly
              </span>
            </div>

          </aside>

          {/* RIGHT COLUMN: Active Filters & Products Grid */}
          <main className="w-full lg:w-3/4 flex-1">
            
            {/* Active Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-gray-100 min-h-[44px]">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-gray-400">
                Active Filters:
              </span>

              {selectedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="inline-flex items-center gap-1.5 bg-[#F3F2EE] hover:bg-[#E5E4E0] text-black text-[0.65rem] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {cat === 'Leather Goods' ? 'Leather' : cat}
                  <X className="w-3 h-3 text-gray-400 hover:text-black transition-colors" />
                </button>
              ))}

              {selectedCategories.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-[#DF9F28] hover:text-[#c58b20] transition-colors cursor-pointer ml-2 border-b border-[#DF9F28]/35 hover:border-[#c58b20]"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
              {filteredProducts.map(prod => (
                <div key={prod.id} className="group cursor-pointer">
                  
                  {/* Image Card */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 bg-[#F3F2EE] border border-gray-100/50">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover mix-blend-multiply transition-transform duration-750 group-hover:scale-105 p-4"
                      priority={prod.id <= 3}
                    />
                    
                    {/* Subtle bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Details */}
                  <div className="mt-5 text-left">
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-gray-400">
                      {prod.category}
                    </span>
                    <h3 className="text-sm font-semibold tracking-wide text-gray-900 mt-1 hover:text-black transition-colors font-sans">
                      {prod.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-black">
                        ₹ {prod.price}
                      </span>
                      <span className="text-[0.7rem] line-through text-gray-400 font-normal">
                        ₹ {prod.originalPrice}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-[#F9F8F4] rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 tracking-wider">No products found matching the selected filters.</p>
                <button
                  onClick={handleClearAll}
                  className="mt-4 text-xs font-semibold tracking-widest uppercase underline text-black cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}

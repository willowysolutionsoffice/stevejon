'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Compass, ArrowUpRight } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import ProductCard from './ProductCard';

interface RawProduct {
  id: string;
  name: string;
  description?: string;
  image: string;
  subimage?: string[];
  isNewArrival?: boolean;
  isCustomerFavorite?: boolean;
  rating?: number;
  reviewsCount?: number;
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  variants?: Array<{
    id: string;
    price: number;
    offerPrice?: number;
    qty?: number;
    sku?: string;
  }>;
}

const CATEGORY_TABS = [
  'ALL PRODUCTS',
  'APPAREL',
  'LEATHER GOODS',
  'FOOTWEAR',
  'ACCESSORIES',
  'HOME LIVING',
];

const FALLBACK_PRODUCTS: RawProduct[] = [
  {
    id: 'prod-1',
    name: 'JudesCart Utility Wool Overshirt',
    category: { id: 'c1', name: 'APPAREL' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/prod_overshirt_1778670536589.png',
    isNewArrival: true,
    isCustomerFavorite: true,
    rating: 4.9,
    reviewsCount: 142,
    variants: [{ id: 'v1', price: 4299, offerPrice: 5249 }],
  },
  {
    id: 'prod-2',
    name: 'Tailored Merino Blend Suit Jacket',
    category: { id: 'c1', name: 'APPAREL' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/cat_apparel_1778670103427.png',
    isCustomerFavorite: true,
    rating: 4.8,
    reviewsCount: 89,
    variants: [{ id: 'v2', price: 14999, offerPrice: 18499 }],
  },
  {
    id: 'prod-3',
    name: 'Handcrafted Executive Leather Briefcase',
    category: { id: 'c2', name: 'LEATHER GOODS' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/cat_leather_1778670351299.png',
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 67,
    variants: [{ id: 'v3', price: 8299, offerPrice: 9999 }],
  },
  {
    id: 'prod-4',
    name: 'Signature Leather Weekender & Duffle',
    category: { id: 'c2', name: 'LEATHER GOODS' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/about_craftsmanship.png',
    isCustomerFavorite: true,
    rating: 4.9,
    reviewsCount: 112,
    variants: [{ id: 'v4', price: 11499, offerPrice: 13999 }],
  },
  {
    id: 'prod-5',
    name: 'Precision Wireless ANC Studio Headphones',
    category: { id: 'c3', name: 'ACCESSORIES' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/cat_accessories_1778670517925.png',
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 204,
    variants: [{ id: 'v5', price: 6499, offerPrice: 8999 }],
  },
  {
    id: 'prod-6',
    name: 'Smart Obsidian Touchscreen Chrono Watch',
    category: { id: 'c3', name: 'ACCESSORIES' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/cat_accessories_1778670517925.png',
    isCustomerFavorite: true,
    rating: 4.8,
    reviewsCount: 95,
    variants: [{ id: 'v6', price: 7999, offerPrice: 10499 }],
  },
  {
    id: 'prod-7',
    name: 'Handcrafted Italian Calfskin Oxford Shoes',
    category: { id: 'c4', name: 'FOOTWEAR' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/cat_leather_1778670351299.png',
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 78,
    variants: [{ id: 'v7', price: 8999, offerPrice: 11999 }],
  },
  {
    id: 'prod-8',
    name: 'Minimalist Artisan Suede Chelsea Boots',
    category: { id: 'c4', name: 'FOOTWEAR' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/cat_leather_1778670351299.png',
    isCustomerFavorite: true,
    rating: 4.7,
    reviewsCount: 63,
    variants: [{ id: 'v8', price: 9499, offerPrice: 12499 }],
  },
  {
    id: 'prod-9',
    name: 'Bespoke Pure Cashmere Throw Blanket',
    category: { id: 'c5', name: 'HOME LIVING' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/about_atelier.png',
    isCustomerFavorite: true,
    rating: 5.0,
    reviewsCount: 54,
    variants: [{ id: 'v9', price: 5499, offerPrice: 6999 }],
  },
  {
    id: 'prod-10',
    name: 'Aroma Atelier Obsidian Ceramic Diffuser',
    category: { id: 'c5', name: 'HOME LIVING' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/about_atelier.png',
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 41,
    variants: [{ id: 'v10', price: 3299, offerPrice: 4199 }],
  },
  {
    id: 'prod-11',
    name: 'Pleated Tailored Wool Trousers',
    category: { id: 'c1', name: 'APPAREL' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/prod_trouser_1778670553370.png',
    rating: 4.8,
    reviewsCount: 88,
    variants: [{ id: 'v11', price: 3499, offerPrice: 4299 }],
  },
  {
    id: 'prod-12',
    name: 'Bespoke Atelier Double-Breasted Blazer',
    category: { id: 'c1', name: 'APPAREL' },
    brand: { id: 'b1', name: 'JudesCart' },
    image: '/about_atelier.png',
    isCustomerFavorite: true,
    rating: 4.9,
    reviewsCount: 136,
    variants: [{ id: 'v12', price: 16999, offerPrice: 19999 }],
  },
];

export default function NewArrivals() {
  const [products, setProducts] = useState<RawProduct[]>(FALLBACK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL PRODUCTS');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/products?limit=50`);
        if (res.ok) {
          const json = await res.json();
          const items: RawProduct[] = Array.isArray(json?.data) ? json.data : [];
          if (items.length > 0) {
            setProducts(items);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL PRODUCTS') {
      return products.slice(0, 12);
    }

    const target = activeCategory.toUpperCase().trim();
    const matched = products.filter((p) => {
      const catName = p.category?.name?.toUpperCase().trim() || '';
      const prodName = p.name?.toUpperCase().trim() || '';

      if (catName === target) return true;

      // Category match aliases
      if (target === 'ACCESSORIES' && (catName.includes('ELECTR') || catName.includes('TECH') || catName.includes('ACCESS') || prodName.includes('HEADPHONE') || prodName.includes('WATCH') || prodName.includes('AUDIO'))) return true;
      if (target === 'APPAREL' && (catName.includes('APPAR') || catName.includes('CLOTH') || catName.includes('TAILOR') || catName.includes('FASHION') || prodName.includes('JACKET') || prodName.includes('OVERSHIRT') || prodName.includes('BLAZER') || prodName.includes('TROUSER'))) return true;
      if (target === 'LEATHER GOODS' && (catName.includes('LEATHER') || catName.includes('BAG') || prodName.includes('LEATHER') || prodName.includes('BRIEFCASE') || prodName.includes('WEEKENDER') || prodName.includes('WALLET'))) return true;
      if (target === 'FOOTWEAR' && (catName.includes('FOOT') || catName.includes('SHOE') || prodName.includes('OXFORD') || prodName.includes('BOOT') || prodName.includes('SNEAKER') || prodName.includes('LOAFER'))) return true;
      if (target === 'HOME LIVING' && (catName.includes('HOME') || catName.includes('LIVING') || prodName.includes('BLANKET') || prodName.includes('DIFFUSER') || prodName.includes('CASHMERE') || prodName.includes('DECOR'))) return true;

      return false;
    });

    if (matched.length > 0) {
      return matched.slice(0, 12);
    }

    return FALLBACK_PRODUCTS.filter((p) => {
      const catName = p.category?.name?.toUpperCase().trim() || '';
      return catName === target;
    }).slice(0, 12);
  }, [products, activeCategory]);

  return (
    <section className="sj-container space-y-6 sm:space-y-8">
      {/* =========================================================================
          TANEIRA-INSPIRED SECTION HEADER & CURATION TABS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-[#DF9F28] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#DF9F28]" />
            <span>CURATED EDITS &amp; TOP PICKS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Featured at JudesCart
          </h2>
          <p className="text-xs text-[#555555] mt-0.5">
            Discover precision tailoring, master leathers, and bespoke luxury pieces.
          </p>
        </div>

        {/* Category Pill Filters (Taneira Style Clean Rounded Navigation) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategory(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#DF9F28] ${
                  isActive
                    ? 'bg-[#0A192F] text-white shadow-sm border border-[#0A192F]'
                    : 'bg-white text-[#555555] border border-[#E2E8F0] hover:border-[#DF9F28] hover:text-[#111111]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TANEIRA-STYLE EDITORIAL CURATION SPOTLIGHT BANNER
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-[#0A192F] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[260px] border border-[#E2E8F0] shadow-sm">
          <Image
            src="/about_atelier.png"
            alt="The Atelier Curation"
            fill
            className="object-cover object-center opacity-30 mix-blend-luminosity hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061B3A] via-[#061B3A]/85 to-transparent pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-lg">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#DF9F28]/20 text-[#DF9F28] border border-[#DF9F28]/40">
              The Artisan Curation
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              Masterpiece Weaves &amp; Hand-Finished Silhouettes
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md hidden sm:block">
              Engineered with ethical Italian wool, vegetable-tanned full-grain leathers, and timeless architectural tailoring.
            </p>
          </div>

          <div className="relative z-10 pt-4 flex items-center justify-between">
            <Link
              href="/product"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#DF9F28] hover:bg-[#C6891E] text-[#111111] font-bold text-xs tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Explore Curated Edit</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
            </Link>
            <span className="text-[11px] text-slate-300 font-medium hidden md:inline">
              Complimentary Lucky Draw ticket included with every purchase
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl bg-gradient-to-br from-[#FEF8EE] to-[#F1F5F9] border border-[#DF9F28]/30 p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#DF9F28]">
                LUCKY DRAW PERK
              </span>
              <Compass className="w-4 h-4 text-[#DF9F28]" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#111111] leading-snug">
              Weekly Luxury Sweepstakes
            </h4>
            <p className="text-xs text-[#555555] leading-relaxed">
              Every curated order automatically enters you into the verified weekly lucky draw for bespoke coats, leather duffles, and studio accessories.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0]">
            <Link
              href="/lucky-draw"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#DF9F28] transition-colors"
            >
              <span>View Active Prize Pool</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#DF9F28]" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRODUCTS GRID: 4-COLUMN COMPACT LAYOUT ON DESKTOP (Taneira-Scale Cards)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {filteredProducts.map((prod) => {
          const mainVariant = prod.variants?.[0];
          const price = mainVariant?.price || 4299;
          const originalPrice = mainVariant?.offerPrice;

          return (
            <ProductCard
              key={prod.id}
              id={prod.id}
              variantId={mainVariant?.id}
              name={prod.name}
              category={prod.category?.name || 'APPAREL'}
              brand={prod.brand?.name || 'JudesCart'}
              price={price}
              originalPrice={originalPrice}
              image={prod.image || '/prod_overshirt_1778670536589.png'}
              subimage={prod.subimage || []}
              description={prod.description}
              rating={prod.rating || 4.9}
              reviewsCount={prod.reviewsCount || 128}
              isNewArrival={prod.isNewArrival}
              isCustomerFavorite={prod.isCustomerFavorite}
            />
          );
        })}
      </div>

      {/* View All CTA Footer */}
      <div className="pt-4 text-center">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-[#0A192F] hover:text-white text-[#111111] border border-[#E2E8F0] hover:border-[#0A192F] font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
        >
          <span>Browse All Featured Styles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}


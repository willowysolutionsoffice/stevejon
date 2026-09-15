'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  'ELECTRONICS',
  'APPAREL',
  'LEATHER GOODS',
  'FOOTWEAR',
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
    category: { id: 'c3', name: 'ELECTRONICS' },
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
    category: { id: 'c3', name: 'ELECTRONICS' },
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
      if (target === 'ELECTRONICS' && (catName.includes('ELECTR') || catName.includes('TECH') || catName.includes('ACCESS') || prodName.includes('HEADPHONE') || prodName.includes('WATCH') || prodName.includes('AUDIO'))) return true;
      if (target === 'APPAREL' && (catName.includes('APPAR') || catName.includes('CLOTH') || catName.includes('TAILOR') || catName.includes('FASHION') || prodName.includes('JACKET') || prodName.includes('OVERSHIRT') || prodName.includes('BLAZER') || prodName.includes('TROUSER'))) return true;
      if (target === 'LEATHER GOODS' && (catName.includes('LEATHER') || catName.includes('BAG') || prodName.includes('LEATHER') || prodName.includes('BRIEFCASE') || prodName.includes('WEEKENDER') || prodName.includes('WALLET'))) return true;
      if (target === 'FOOTWEAR' && (catName.includes('FOOT') || catName.includes('SHOE') || prodName.includes('OXFORD') || prodName.includes('BOOT') || prodName.includes('SNEAKER') || prodName.includes('LOAFER'))) return true;
      if (target === 'HOME LIVING' && (catName.includes('HOME') || catName.includes('LIVING') || prodName.includes('BLANKET') || prodName.includes('DIFFUSER') || prodName.includes('CASHMERE') || prodName.includes('DECOR'))) return true;

      return false;
    });

    if (matched.length > 0) {
      return matched.slice(0, 12);
    }

    // Fallback if current database doesn't have matches for the category
    return FALLBACK_PRODUCTS.filter((p) => {
      const catName = p.category?.name?.toUpperCase().trim() || '';
      return catName === target;
    }).slice(0, 12);
  }, [products, activeCategory]);

  return (
    <section className="sj-container space-y-6 sm:space-y-8">
      {/* Section Header with Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#DF9F28]">
            TOP TRENDING PICKS
          </span>
          <h2 className="font-sans text-xl sm:text-3xl font-extrabold text-stone-900 mt-0.5 sm:mt-1">
            Featured at JudesCart
          </h2>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#DF9F28] text-slate-950 shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid: 3 columns desktop, 2 columns tablet, 2 columns mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6">
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
    </section>
  );
}

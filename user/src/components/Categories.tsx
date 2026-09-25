'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  image: string;
  _count?: {
    products?: number;
  };
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/categories`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // JudesCart authentic categories with real assets
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Apparel & Tailoring', image: '/cat_apparel_1778670103427.png', _count: { products: 38 } },
    { id: '2', name: 'Signature Leather Goods', image: '/cat_leather_1778670351299.png', _count: { products: 19 } },
    { id: '3', name: 'Fine Accessories', image: '/cat_accessories_1778670517925.png', _count: { products: 24 } },
    { id: '4', name: 'Atelier Suits & Blazers', image: '/about_atelier.png', _count: { products: 16 } },
    { id: '5', name: 'Outerwear & Jackets', image: '/prod_overshirt_1778670536589.png', _count: { products: 12 } },
    { id: '6', name: 'Travel & Craftsmanship', image: '/about_craftsmanship.png', _count: { products: 28 } },
  ];

  return (
    <section className="sj-container space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#DF9F28]">
            All Departments
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight mt-0.5">
            Shop by Department
          </h2>
        </div>

        <Link
          href="/product"
          className="text-xs font-semibold uppercase tracking-wider text-[#DF9F28] hover:text-[#C6891E] flex items-center gap-1.5 transition-colors focus-visible:outline-none"
        >
          <span>View All Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Categories Grid (2 cols mobile, 2 cols tablet, 3 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {displayCategories.map((cat, idx) => {
          const itemCount = cat._count?.products || (idx * 7 + 14);

          return (
            <Link
              key={cat.id}
              href={`/product?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[16/11] rounded-xl overflow-hidden bg-slate-100 border border-[#E2E8F0] shadow-xs flex flex-col justify-end p-4 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-[#DF9F28] focus-visible:ring-2 focus-visible:ring-[#DF9F28]"
            >
              {/* Category Background Image */}
              <Image
                src={cat.image || '/cat_apparel_1778670103427.png'}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />

              {/* Midnight Navy Gradient Dark Overlay (#061B3A) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061B3A]/90 via-[#061B3A]/40 to-transparent pointer-events-none" />

              {/* Bottom Card Information */}
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#DF9F28] font-bold block">
                  {itemCount} Styles
                </span>
                
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight line-clamp-1">
                  {cat.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

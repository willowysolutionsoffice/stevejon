'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, TrendingUp, Sparkles, Tag, Package, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'ANC Headphones',
  'Wool Overshirt',
  'Leather Briefcase',
  'Chelsea Boots',
  'Smart Desk Lamp',
  'Organic Skincare',
  'Executive Watch'
];

const SEARCH_CATEGORIES = [
  { label: 'All', query: '' },
  { label: 'Electronics', query: 'electronics' },
  { label: 'Apparel', query: 'apparel' },
  { label: 'Leather Goods', query: 'leather' },
  { label: 'Footwear', query: 'footwear' },
  { label: 'Home & Living', query: 'home' },
  { label: 'Beauty', query: 'beauty' },
];

const SAMPLE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'JudesCart Utility Wool Overshirt',
    category: 'Apparel',
    price: 4299,
    originalPrice: 5999,
    image: '/prod_overshirt_1778670536589.png',
    badge: 'Best Seller'
  },
  {
    id: 'prod-2',
    name: 'SonicPro Studio ANC Wireless Headphones',
    category: 'Electronics',
    price: 4999,
    originalPrice: 8999,
    image: '/prod_overshirt_1778670536589.png',
    badge: 'Popular'
  },
  {
    id: 'prod-3',
    name: 'Atelier Artisan Full-Grain Leather Briefcase',
    category: 'Leather Goods',
    price: 8499,
    originalPrice: 12999,
    image: '/prod_overshirt_1778670536589.png',
    badge: 'Luxury'
  },
  {
    id: 'prod-4',
    name: 'Minimalist Chelsea Suede Leather Boots',
    category: 'Footwear',
    price: 5299,
    originalPrice: 7499,
    image: '/prod_overshirt_1778670536589.png',
    badge: 'Trending'
  },
  {
    id: 'prod-5',
    name: 'Nordic Lumina Smart Ambient Desk Lamp',
    category: 'Home & Living',
    price: 3199,
    originalPrice: 4499,
    image: '/prod_overshirt_1778670536589.png',
    badge: 'New'
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch real products or fallback
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (e) {
        // Fallback to SAMPLE_PRODUCTS
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesQuery = query.trim() === '' || 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      (p.category && p.category.toLowerCase().includes(query.toLowerCase()));
    const matchesCat = selectedCategory === '' || 
      (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesQuery && matchesCat;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/product?search=${encodeURIComponent(query)}`);
    }
  };

  const handleProductSelect = (id: string) => {
    onClose();
    router.push(`/product?id=${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center px-5 py-4 border-b border-stone-100 bg-white">
          <Search className="w-5 h-5 text-[#DF9F28] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, materials, SKU..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-stone-400 font-medium outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 mr-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            ESC
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-50/80 border-b border-stone-100 overflow-x-auto no-scrollbar">
          {SEARCH_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat.query ? '' : cat.query)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.query
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Quick Suggestions when query is empty */}
          {query === '' && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#DF9F28]" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 text-xs font-semibold border border-amber-200/60 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#DF9F28]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              <span>{query ? `Search Results (${filteredProducts.length})` : 'Recommended Products'}</span>
              {query && (
                <Link
                  href={`/product?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[#DF9F28] hover:underline flex items-center gap-0.5 text-xs font-bold"
                >
                  <span>View full catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">No products found</p>
                <p className="text-xs text-stone-500 mt-1">Try searching for generic terms like &quot;Audio&quot;, &quot;Jacket&quot;, or &quot;Boots&quot;</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductSelect(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                        <Image
                          src={item.image || '/prod_overshirt_1778670536589.png'}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#DF9F28] transition-colors truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {item.category || 'General'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
                        {item.originalPrice && (
                          <p className="text-[10px] text-stone-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#DF9F28] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded font-mono text-[10px] shadow-2xs">↵</kbd> to search
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded font-mono text-[10px] shadow-2xs">ESC</kbd> to close
            </span>
          </div>
          <span className="text-amber-800 font-semibold">Weekly Lucky Draw on every order</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Headphones,
  Shirt,
  Footprints,
  Briefcase,
  Home,
  Sparkles,
  Gift,
  Coins,
  Package,
  LogOut,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { authClient } from '@/lib/auth-client';
import CartDrawer from './CartDrawer';
import DailyGiftModal from './DailyGiftModal';
import SearchModal from './SearchModal';
import CurrencyModal, { CURRENCIES, Currency } from './CurrencyModal';
import AccountDrawer from './AccountDrawer';
import AuthModal from './AuthModal';

export interface NavCategory {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  directoryTitle: string;
  directorySubtitle: string;
  items: Array<{ title: string; href: string }>;
  featured: {
    badge: string;
    title: string;
    description: string;
    price: string;
    image: string;
    href: string;
  };
}

const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    id: 'all',
    label: 'All Products',
    href: '/product',
    icon: SlidersHorizontal,
    directoryTitle: 'ALL PRODUCTS DIRECTORY',
    directorySubtitle: 'Browse Entire Store Catalog',
    items: [
      { title: 'New Seasonal Arrivals', href: '/product?category=Apparel' },
      { title: 'Executive Leather Briefcases', href: '/product?category=Leather+Goods' },
      { title: 'Bespoke Tailored Blazers', href: '/product?category=Apparel' },
      { title: 'Fine Atelier Accessories', href: '/product?category=Accessories' },
    ],
    featured: {
      badge: 'Top Recommendation',
      title: 'JudesCart Utility Wool Overshirt',
      description: 'Engineered from premium organic wool blend with clean sartorial drape.',
      price: '₹4,299',
      image: '/prod_overshirt_1778670536589.png',
      href: '/product?id=prod-1',
    },
  },
  {
    id: 'electronics',
    label: 'Electronics',
    href: '/product?category=electronics',
    icon: Headphones,
    popular: true,
    directoryTitle: 'ELECTRONICS DIRECTORY',
    directorySubtitle: 'Explore Popular Collections',
    items: [
      { title: 'ANC Wireless Headphones', href: '/product?category=electronics' },
      { title: 'Smart Desk Lighting & Qi', href: '/product?category=electronics' },
      { title: 'Studio & High-Fidelity Audio', href: '/product?category=electronics' },
      { title: 'Workspace & Ergonomic Gear', href: '/product?category=electronics' },
    ],
    featured: {
      badge: 'Top Recommendation',
      title: 'SonicPro Studio ANC Headphones',
      description: '40mm beryllium acoustic drivers with 45h active battery life.',
      price: '₹4,999',
      image: '/prod_overshirt_1778670536589.png',
      href: '/product?category=electronics',
    },
  },
  {
    id: 'fashion',
    label: 'Fashion',
    href: '/product?category=Apparel',
    icon: Shirt,
    directoryTitle: 'FASHION DIRECTORY',
    directorySubtitle: 'Tailored Apparel & Sartorial Fits',
    items: [
      { title: 'Suits & Bespoke Blazers', href: '/product?category=Apparel' },
      { title: 'Pleated Tailored Trousers', href: '/product?category=Apparel' },
      { title: 'Merino Blend Outerwear', href: '/product?category=Apparel' },
      { title: 'Luxury Silk Pocket Squares', href: '/product?category=Accessories' },
    ],
    featured: {
      badge: 'Bespoke Collection',
      title: 'Tailored Merino Blend Suit Jacket',
      description: 'Double-vented European cut crafted from Australian superfine wool.',
      price: '₹14,999',
      image: '/cat_apparel_1778670103427.png',
      href: '/product?id=prod-2',
    },
  },
  {
    id: 'footwear',
    label: 'Footwear',
    href: '/product?category=footwear',
    icon: Footprints,
    directoryTitle: 'FOOTWEAR DIRECTORY',
    directorySubtitle: 'Handcrafted Shoes & Boots',
    items: [
      { title: 'Oxford Classic Dress Shoes', href: '/product?category=footwear' },
      { title: 'Derby Full-Grain Brogues', href: '/product?category=footwear' },
      { title: 'Handmade Suede Penny Loafers', href: '/product?category=footwear' },
      { title: 'All-Weather Chelsea Boots', href: '/product?category=footwear' },
    ],
    featured: {
      badge: 'Handcrafted Heritage',
      title: 'Artisan Suede Penny Loafers',
      description: 'Goodyear welted with premium Italian suede and cushioned insoles.',
      price: '₹7,499',
      image: '/cat_leather_1778670351299.png',
      href: '/product?category=footwear',
    },
  },
  {
    id: 'leather-goods',
    label: 'Leather Goods',
    href: '/product?category=Leather+Goods',
    icon: Briefcase,
    directoryTitle: 'LEATHER GOODS DIRECTORY',
    directorySubtitle: 'Executive Bags & Handcrafted Luggage',
    items: [
      { title: 'Executive Briefcases', href: '/product?category=Leather+Goods' },
      { title: 'Signature Travel Duffles', href: '/product?category=Leather+Goods' },
      { title: 'Minimalist Bifold Wallets', href: '/product?category=Leather+Goods' },
      { title: 'Full-Grain Leather Belts', href: '/product?category=Leather+Goods' },
    ],
    featured: {
      badge: 'Master Crafted',
      title: 'Executive Leather Briefcase',
      description: 'Hand-burnished vegetable tanned leather with solid brass hardware.',
      price: '₹8,299',
      image: '/cat_leather_1778670351299.png',
      href: '/product?id=prod-3',
    },
  },
  {
    id: 'home-living',
    label: 'Home & Living',
    href: '/product?category=home-living',
    icon: Home,
    directoryTitle: 'HOME & LIVING DIRECTORY',
    directorySubtitle: 'Refined Spaces & Interior Objects',
    items: [
      { title: 'Acoustic Ambient Lighting', href: '/product?category=home-living' },
      { title: 'Artisan Desk Organizers', href: '/product?category=home-living' },
      { title: 'Ceramic Tableware & Decor', href: '/product?category=home-living' },
      { title: 'Premium Linen Textiles', href: '/product?category=home-living' },
    ],
    featured: {
      badge: 'Curated Living',
      title: 'Atelier Ceramic & Lamp Set',
      description: 'Minimalist sculptural lighting paired with handmade stoneware pieces.',
      price: '₹5,899',
      image: '/about_craftsmanship.png',
      href: '/product?category=home-living',
    },
  },
  {
    id: 'beauty',
    label: 'Beauty',
    href: '/product?category=beauty',
    icon: Sparkles,
    directoryTitle: 'BEAUTY & WELLNESS DIRECTORY',
    directorySubtitle: 'Personal Grooming & Botanical Care',
    items: [
      { title: 'Botanical Eau De Parfum', href: '/product?category=beauty' },
      { title: 'Organic Beard & Hair Oils', href: '/product?category=beauty' },
      { title: 'Revitalizing Face Elixir', href: '/product?category=beauty' },
      { title: 'Signature Atelier Grooming Kit', href: '/product?category=beauty' },
    ],
    featured: {
      badge: 'Organic Formula',
      title: 'Atelier Botanical Grooming Elixir',
      description: 'Cold-pressed botanical oils infused with cedarwood and bergamot.',
      price: '₹2,499',
      image: '/cat_accessories_1778670517925.png',
      href: '/product?category=beauty',
    },
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();
  const { totalItems: totalWishlistItems } = useWishlist();
  const { data: session } = authClient.useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDailyGiftModalOpen, setIsDailyGiftModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mouseLeaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsUserMenuOpen(false);
    setActiveCategoryId(null);
  }, [pathname]);

  // Handle outside click to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveCategoryId(null);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hover management with debounce to eliminate flickering
  const handleCategoryMouseEnter = (catId: string) => {
    if (mouseLeaveTimeout.current) {
      clearTimeout(mouseLeaveTimeout.current);
      mouseLeaveTimeout.current = null;
    }
    setActiveCategoryId(catId);
  };

  const handleMouseLeave = () => {
    if (mouseLeaveTimeout.current) {
      clearTimeout(mouseLeaveTimeout.current);
    }
    mouseLeaveTimeout.current = setTimeout(() => {
      setActiveCategoryId(null);
    }, 160);
  };

  const handleMegaMenuMouseEnter = () => {
    if (mouseLeaveTimeout.current) {
      clearTimeout(mouseLeaveTimeout.current);
      mouseLeaveTimeout.current = null;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsUserMenuOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const activeCategoryData = NAVIGATION_CATEGORIES.find((c) => c.id === activeCategoryId);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full bg-white/98 backdrop-blur-md border-b border-zinc-200 shadow-xs transition-all duration-200"
      >
        {/* 1. Main Header Row (Tier 1 - Substantially Increased Height) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22 lg:h-24 gap-3 sm:gap-6">
            
            {/* Left: Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
              <Link href="/" className="group flex items-center shrink-0 pr-1 focus-visible:outline-none" aria-label="JudesCart Home">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0">
                  <Image
                    src="/logo-icon.webp"
                    alt="JudesCart Logo"
                    fill
                    sizes="48px"
                    className="object-contain group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="hidden sm:flex flex-col ml-3">
                  <span className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-zinc-950 group-hover:text-[#DF9F28] transition-colors leading-none">
                    Judes<span className="text-[#DF9F28]">Cart</span>
                  </span>
                  <span className="text-[11px] tracking-[0.24em] font-bold text-zinc-400 uppercase mt-1">
                    Shop More. Live Better.
                  </span>
                </div>
              </Link>

              {/* Hamburger Button for Mobile Drawer */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 text-zinc-700 hover:text-[#DF9F28] hover:bg-zinc-100 rounded-xl transition-colors shrink-0 cursor-pointer lg:hidden focus-visible:ring-2 focus-visible:ring-[#DF9F28]"
                aria-label="Toggle navigation menu"
                title="Menu & Options"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Quick Search Button */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2.5 text-zinc-700 hover:text-[#DF9F28] hover:bg-zinc-100 rounded-xl transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#DF9F28]"
                aria-label="Search catalog"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Center: Large Search Bar (Desktop - Prominently Sized) */}
              <div className="hidden md:flex flex-1 max-w-lg lg:max-w-2xl ml-3">
                <div 
                  onClick={() => setIsSearchModalOpen(true)} 
                  className="w-full relative cursor-pointer"
                >
                  <div className="w-full flex items-center justify-between px-5 py-3 sm:py-3.5 rounded-2xl text-sm text-zinc-500 bg-zinc-100/90 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200 transition-all duration-150 group shadow-2xs">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Search className="w-5 h-5 text-[#DF9F28] group-hover:scale-110 transition-transform shrink-0" />
                      <span className="text-sm text-zinc-500 font-medium truncate">
                        Search products, categories, or brands...
                      </span>
                    </div>
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2.5 py-1 text-xs font-mono font-semibold text-zinc-500 bg-white rounded-lg border border-zinc-200 shadow-2xs shrink-0 select-none">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Currency, Wishlist, Sign In, Cart */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Currency Badge */}
              <div className="hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsCurrencyModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-all border border-zinc-200/90 bg-white cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  title="Select Currency"
                >
                  <span className="text-base leading-none" role="img" aria-label={selectedCurrency.name}>{selectedCurrency.flag}</span>
                  <span className="font-bold text-zinc-900 tracking-tight">{selectedCurrency.code}</span>
                  <span className="text-zinc-400 font-mono text-xs">({selectedCurrency.symbol})</span>
                </button>
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-3 rounded-xl text-zinc-700 hover:text-[#DF9F28] hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-label="Wishlist"
                title="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlistItems > 0 && (
                  <span className="absolute 0.5 top-0.5 right-0.5 min-w-[18px] h-[18px] bg-[#DF9F28] text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-xs">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* User Account / Sign In */}
              <div className="relative" ref={userMenuRef}>
                {session?.user ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-zinc-900 transition-all text-sm font-semibold cursor-pointer shrink-0 group focus-visible:ring-2 focus-visible:ring-amber-500"
                      aria-label="User Account Menu"
                    >
                      <User className="w-4 h-4 text-[#DF9F28] group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline max-w-[90px] truncate">
                        {session.user.name || 'Account'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Account Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2.5 border-b border-zinc-100">
                          <p className="text-sm font-semibold text-zinc-900 truncate">
                            {session.user.name || 'User'}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {session.user.email}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <User className="w-4 h-4 text-zinc-400" />
                          <span>My Profile & Addresses</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <Package className="w-4 h-4 text-zinc-400" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          href="/lucky-draw"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                          <Ticket className="w-4 h-4 text-[#DF9F28]" />
                          <span>My Lucky Tickets</span>
                        </Link>

                        <div className="border-t border-zinc-100 mt-1 pt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signin');
                      setIsAuthModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-zinc-900 transition-all text-sm font-semibold cursor-pointer shrink-0 group focus-visible:ring-2 focus-visible:ring-amber-500"
                    aria-label="Customer Sign In"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => openDrawer()}
                className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-150 active:scale-95 shrink-0 group cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 shadow-sm"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:text-[#DF9F28] transition-colors" />
                <span className="hidden sm:inline text-sm font-semibold tracking-wide">Cart</span>
                <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-bold rounded-full bg-[#DF9F28] text-zinc-950">
                  {totalItems}
                </span>
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Search Input Drawer (Dropdown) */}
        {isMobileSearchOpen && (
          <div className="px-4 pb-3 md:hidden bg-white border-b border-zinc-200 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands & categories..."
                autoFocus
                className="w-full pl-10 pr-20 py-2 bg-zinc-100 text-xs text-zinc-900 rounded-full border border-zinc-200 focus:outline-none focus:border-[#DF9F28]"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-zinc-900 text-white text-xs font-semibold rounded-full hover:bg-[#DF9F28] hover:text-zinc-950 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* 2. Secondary Category Navigation Bar (Tier 2 - Dark Obsidian #111111) */}
        <nav
          className="hidden lg:block bg-[#111111] border-t border-zinc-800 border-b border-zinc-900 text-white relative shadow-inner"
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-13 sm:h-14">
              
              {/* Category Nav Items */}
              <div className="flex items-center space-x-1.5 xl:space-x-2.5">
                {NAVIGATION_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategoryId === cat.id;

                  return (
                    <div key={cat.id} className="relative py-1.5">
                      <Link
                        href={cat.href}
                        onMouseEnter={() => handleCategoryMouseEnter(cat.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-150 select-none group ${
                          isActive
                            ? 'bg-[#DF9F28] text-zinc-950 font-bold shadow-xs'
                            : 'text-zinc-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className={isActive ? 'text-zinc-950' : 'text-[#DF9F28]'}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span>{cat.label}</span>
                        {cat.popular && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#DF9F28] text-zinc-950">
                            Popular
                          </span>
                        )}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Right Trust & Guarantee Badges */}
              <div className="hidden xl:flex items-center gap-5 text-xs sm:text-[13px] font-medium text-zinc-400">
                <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Free Delivery over ₹999
                </span>
                <span className="text-zinc-700">•</span>
                <Link href="/faq" className="text-zinc-300 hover:text-white transition-colors">
                  7-Day Easy Returns
                </Link>
              </div>

            </div>
          </div>

          {/* 3. Mega Menu Hover Panel */}
          {activeCategoryData && (
            <div
              className="absolute top-full inset-x-0 bg-white/98 backdrop-blur-xl border-b border-zinc-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-12 gap-8 items-center">
                  
                  {/* Left Directory Grid (col-span-7) */}
                  <div className="col-span-7 space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#DF9F28]">
                        {activeCategoryData.directoryTitle}
                      </span>
                      <h4 className="text-base font-bold text-zinc-900 mt-0.5">
                        {activeCategoryData.directorySubtitle}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {activeCategoryData.items.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="group flex items-center justify-between p-3 rounded-xl border border-zinc-100 hover:border-amber-300 hover:bg-amber-50/40 transition-all"
                        >
                          <span className="text-xs font-medium text-zinc-800 group-hover:text-[#DF9F28] transition-colors">
                            {item.title}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-[#DF9F28] group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={activeCategoryData.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DF9F28] hover:text-[#C6891E] hover:underline"
                      >
                        <span>View all {activeCategoryData.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Featured Recommendation (col-span-5) */}
                  <div className="col-span-5 border-l border-zinc-100 pl-8">
                    <Link
                      href={activeCategoryData.featured.href}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 hover:bg-amber-50/50 border border-zinc-200 hover:border-amber-300 transition-all block"
                    >
                      <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-zinc-200">
                        <Image
                          src={activeCategoryData.featured.image}
                          alt={activeCategoryData.featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                          {activeCategoryData.featured.badge}
                        </span>
                        <h5 className="text-sm font-semibold text-zinc-900 group-hover:text-[#DF9F28] transition-colors truncate">
                          {activeCategoryData.featured.title}
                        </h5>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                          {activeCategoryData.featured.description}
                        </p>
                        <p className="text-xs font-bold text-zinc-900 pt-1">
                          {activeCategoryData.featured.price}
                        </p>
                      </div>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* 4. Mobile Menu Drawer (Fixed Portal Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-50 animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="relative w-7 h-7 shrink-0">
                    <Image
                      src="/logo-icon.webp"
                      alt="JudesCart Logo"
                      fill
                      sizes="28px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-base font-bold tracking-tight text-zinc-900 leading-none">
                    Judes<span className="text-[#DF9F28]">Cart</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 border-b border-zinc-200">
                <Link
                  href="/product"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-zinc-800 border border-zinc-200 text-xs font-semibold hover:border-zinc-300"
                >
                  <SlidersHorizontal className="w-4 h-4 text-zinc-600 shrink-0" />
                  <span>All Products</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-zinc-800 border border-zinc-200 text-xs font-semibold hover:border-zinc-300"
                >
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>
              </div>

              {/* Navigation Category Accordions */}
              <div className="p-3 space-y-1">
                <p className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Departments & Categories
                </p>

                {NAVIGATION_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isExpanded = mobileExpandedCat === cat.id;

                  return (
                    <div key={cat.id} className="border-b border-zinc-100 last:border-none">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-800 hover:text-[#DF9F28] flex-1"
                        >
                          <Icon className="w-4 h-4 text-[#DF9F28]" />
                          <span>{cat.label}</span>
                          {cat.popular && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded-full font-semibold bg-[#DF9F28] text-zinc-950 uppercase">
                              Hot
                            </span>
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                          className="p-2 text-zinc-400 hover:text-zinc-700"
                          aria-label={`Toggle ${cat.label} subcategories`}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="pl-9 pr-3 pb-2 space-y-1 animate-in fade-in duration-150">
                          {cat.items.map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-1 text-xs font-medium text-zinc-600 hover:text-[#DF9F28]"
                            >
                              {sub.title}
                            </Link>
                          ))}
                          <Link
                            href={cat.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DF9F28] pt-1"
                          >
                            <span>View All {cat.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-zinc-100">
                  <Link
                    href="/lucky-draw"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-amber-950 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#DF9F28]" />
                      <span>Weekly Lucky Draw</span>
                    </div>
                    <span className="text-[10px] bg-[#DF9F28] text-zinc-950 font-bold px-1.5 py-0.5 rounded-md">
                      LIVE
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Account & Support Links */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-2">
              {session?.user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs flex items-center justify-center border border-amber-200">
                      {session.user.name ? session.user.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-900 truncate">{session.user.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-center text-zinc-700 hover:border-amber-300"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 px-3 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-center text-zinc-700 hover:border-amber-300"
                    >
                      Orders
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-1.5 text-xs font-semibold text-rose-600 text-center hover:underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-900 hover:bg-[#DF9F28] text-white hover:text-zinc-950 rounded-xl text-xs font-semibold tracking-wide transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Join JudesCart</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Slide-Over Cart Drawer & Modals */}
      <CartDrawer />
      <AccountDrawer
        isOpen={isAccountDrawerOpen}
        onClose={() => setIsAccountDrawerOpen(false)}
        onOpenAuth={(m) => {
          setAuthModalMode(m || 'signin');
          setIsAuthModalOpen(true);
        }}
        onOpenDailyGift={() => setIsDailyGiftModalOpen(true)}
      />
      <DailyGiftModal
        isOpen={isDailyGiftModalOpen}
        onClose={() => setIsDailyGiftModalOpen(false)}
      />
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={(c) => setSelectedCurrency(c)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}

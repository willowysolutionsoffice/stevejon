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
import AnnouncementBar from './AnnouncementBar';

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
  const { totalItems } = useCart();
  const { totalItems: totalWishlistItems } = useWishlist();
  const { data: session } = authClient.useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
        searchInputRef.current?.focus();
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
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-all duration-200"
      >
        {/* Top Announcement Bar */}
        <AnnouncementBar />

        {/* 1. Main Header Row (Tier 1) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left: Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 min-w-0">
              <Link href="/" className="group flex items-center shrink-0 pr-0.5" aria-label="JudesCart Home">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                  <Image
                    src="/logo-icon.webp"
                    alt="JudesCart Logo"
                    fill
                    sizes="36px"
                    className="object-contain group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="hidden sm:flex flex-col ml-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#DF9F28] transition-colors leading-none font-sans">
                    Judes<span className="text-[#DF9F28]">Cart</span>
                  </span>
                  <span className="text-[8px] tracking-[0.2em] font-sans font-semibold text-stone-400 uppercase mt-0.5">
                    Shop More. Live Better.
                  </span>
                </div>
              </Link>

              {/* Hamburger Button for Mobile Drawer */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-stone-700 hover:text-[#DF9F28] hover:bg-stone-100 rounded-xl transition-colors shrink-0 cursor-pointer lg:hidden"
                aria-label="Toggle navigation menu"
                title="Menu & Options"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Quick Search Button */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 text-stone-700 hover:text-[#DF9F28] hover:bg-stone-100 rounded-xl transition-colors shrink-0 cursor-pointer"
                aria-label="Search catalog"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Center: Large Search Bar (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-md ml-1 lg:ml-2">
                <form onSubmit={handleSearchSubmit} className="w-full relative">
                  <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs text-stone-500 bg-stone-100/90 hover:bg-stone-200/80 hover:text-stone-900 border border-stone-200 transition-all duration-150 shadow-2xs group focus-within:bg-white focus-within:border-[#DF9F28] focus-within:ring-2 focus-within:ring-amber-100">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Search className="w-3.5 h-3.5 text-[#DF9F28] group-hover:scale-110 transition-transform shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search all products, brands & categories..."
                        className="w-full bg-transparent border-none outline-none text-[11px] lg:text-xs text-stone-900 placeholder:text-stone-400 font-medium"
                      />
                    </div>
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-stone-400 bg-white rounded border border-stone-200 shadow-2xs shrink-0 select-none">
                      ⌘K
                    </kbd>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Currency, Wishlist, Daily Gift, Coins, Sign In, Cart */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              
              {/* Currency Badge */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100/90 transition-all border border-stone-200/80 bg-white/70 shadow-xs select-none">
                  <span className="text-sm leading-none" role="img" aria-label="Indian Rupee">🇮🇳</span>
                  <span className="font-semibold text-stone-900 tracking-tight">INR</span>
                  <span className="text-stone-400 font-mono text-[11px] font-normal">(₹)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" title="Auto-matched to India" />
                </div>
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full text-stone-700 hover:text-[#DF9F28] hover:bg-stone-100 transition-all shrink-0"
                aria-label="Wishlist"
                title="View Wishlist"
              >
                <Heart className="w-4 h-4" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] bg-[#DF9F28] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-xs">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Daily Gift Button */}
              <Link
                href="/lucky-draw"
                className="relative flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/60 hover:from-amber-100 hover:to-amber-200/80 border border-amber-200/80 text-amber-950 transition-all text-xs font-bold cursor-pointer shadow-2xs group shrink-0"
                title="Daily JudesCart Mystery Vault - Open to Claim Rewards"
              >
                <Gift className="w-4 h-4 text-[#DF9F28] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Daily Gift</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-ping" />
              </Link>

              {/* JudesCoins Balance */}
              <Link
                href="/lucky-draw"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 transition-all text-xs font-bold group cursor-pointer shadow-2xs shrink-0"
                title="JudesCoins Rewards Balance"
              >
                <Coins className="w-3.5 h-3.5 text-[#DF9F28] group-hover:scale-110 transition-transform" />
                <span>0</span>
                <span className="text-[10px] text-amber-700/80 font-bold uppercase tracking-wider">Coins</span>
              </Link>

              {/* User Account / Sign In */}
              <div className="relative" ref={userMenuRef}>
                {session?.user ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-950 transition-all text-xs font-bold cursor-pointer shrink-0 shadow-2xs group"
                      aria-label="User Account Menu"
                    >
                      <User className="w-3.5 h-3.5 text-[#DF9F28] group-hover:scale-110 transition-transform" />
                      <span className="hidden sm:inline max-w-[80px] truncate">
                        {session.user.name || 'Account'}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-[#DF9F28] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Account Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2.5 border-b border-stone-100">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {session.user.name || 'User'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {session.user.email}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#DF9F28] transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Addresses</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#DF9F28] transition-colors"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          href="/lucky-draw"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#DF9F28] transition-colors"
                        >
                          <Ticket className="w-4 h-4 text-[#DF9F28]" />
                          <span>My Lucky Tickets</span>
                        </Link>

                        <div className="border-t border-stone-100 mt-1 pt-1">
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
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 text-slate-800 hover:text-[#DF9F28] transition-all text-xs font-bold cursor-pointer shrink-0 shadow-2xs group"
                    aria-label="Customer Sign In"
                  >
                    <User className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Sign In</span>
                    <span className="hidden xl:inline text-[10px] text-amber-800 font-extrabold bg-amber-100 border border-amber-200/80 px-1.5 py-0.2 rounded-full">
                      +200
                    </span>
                  </Link>
                )}
              </div>

              {/* Shopping Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#111111] hover:bg-[#DF9F28] text-white hover:text-slate-950 transition-all duration-150 active:scale-95 shadow-xs font-sans shrink-0 group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-white group-hover:text-slate-950 transition-colors" />
                <span className="hidden sm:inline text-xs font-bold tracking-wide">Cart</span>
                <span className="flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold rounded-full bg-[#DF9F28] text-slate-950 group-hover:bg-slate-950 group-hover:text-white transition-colors">
                  {totalItems}
                </span>
              </Link>

            </div>
          </div>
        </div>

        {/* Mobile Search Input Drawer (Dropdown) */}
        {isMobileSearchOpen && (
          <div className="px-4 pb-3 md:hidden bg-white border-b border-stone-200 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands & categories..."
                autoFocus
                className="w-full pl-10 pr-20 py-2 bg-stone-100 text-xs text-slate-900 rounded-full border border-stone-200 focus:outline-none focus:border-[#DF9F28]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#111111] text-white text-xs font-bold rounded-full hover:bg-[#DF9F28] hover:text-slate-950 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* 2. Secondary Category Navigation Bar (Tier 2 - Dark Obsidian #111111) */}
        <nav
          className="hidden lg:block bg-[#111111] border-t border-stone-800 border-b border-stone-900 text-white relative shadow-inner"
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11">
              
              {/* Category Nav Items */}
              <div className="flex items-center space-x-1 xl:space-x-2">
                {NAVIGATION_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategoryId === cat.id;

                  return (
                    <div key={cat.id} className="relative py-1.5">
                      <Link
                        href={cat.href}
                        onMouseEnter={() => handleCategoryMouseEnter(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 select-none group ${
                          isActive
                            ? 'bg-[#DF9F28] text-slate-950 font-black shadow-xs'
                            : 'text-stone-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className={isActive ? 'text-slate-950' : 'text-[#DF9F28]'}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span>{cat.label}</span>
                        {cat.popular && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-[#DF9F28] text-slate-950">
                            Popular
                          </span>
                        )}
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isActive ? 'rotate-180 text-slate-950' : 'text-stone-400 group-hover:text-stone-200'
                          }`}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Right Trust & Guarantee Badges */}
              <div className="hidden xl:flex items-center gap-4 text-[11px] font-medium text-stone-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Free Delivery over ₹999
                </span>
                <span className="text-stone-700">•</span>
                <Link href="/faq" className="text-stone-300 hover:text-white transition-colors">
                  7-Day Easy Returns
                </Link>
              </div>

            </div>
          </div>

          {/* 3. Mega Menu Hover Panel */}
          {activeCategoryData && (
            <div
              className="absolute top-full inset-x-0 bg-white/98 backdrop-blur-xl border-b border-stone-200/90 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-12 gap-8 items-center">
                  
                  {/* Left Directory Grid (col-span-7) */}
                  <div className="col-span-7 space-y-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#DF9F28]">
                        {activeCategoryData.directoryTitle}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">
                        {activeCategoryData.directorySubtitle}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {activeCategoryData.items.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="group flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                        >
                          <span className="text-xs font-semibold text-stone-800 group-hover:text-[#DF9F28] transition-colors">
                            {item.title}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#DF9F28] group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={activeCategoryData.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DF9F28] hover:text-[#C6891E] hover:underline"
                      >
                        <span>View all {activeCategoryData.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Featured Recommendation (col-span-5) */}
                  <div className="col-span-5 border-l border-stone-100 pl-8">
                    <Link
                      href={activeCategoryData.featured.href}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/80 hover:border-amber-300 transition-all block"
                    >
                      <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200">
                        <Image
                          src={activeCategoryData.featured.image}
                          alt={activeCategoryData.featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                          {activeCategoryData.featured.badge}
                        </span>
                        <h5 className="text-sm font-bold text-stone-900 group-hover:text-[#DF9F28] transition-colors truncate">
                          {activeCategoryData.featured.title}
                        </h5>
                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {activeCategoryData.featured.description}
                        </p>
                        <p className="text-xs font-bold text-stone-900 pt-1">
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
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-50 animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
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
                  <span className="text-base font-bold tracking-tight text-slate-900 leading-none font-sans">
                    Judes<span className="text-[#DF9F28]">Cart</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50/60 border-b border-stone-200">
                <Link
                  href="/lucky-draw"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 text-xs font-bold"
                >
                  <Gift className="w-4 h-4 text-[#DF9F28] shrink-0" />
                  <span>Daily Gift</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 text-slate-800 border border-stone-200 text-xs font-bold"
                >
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Wishlist ({totalWishlistItems})</span>
                </Link>
              </div>

              {/* Navigation Category Accordions */}
              <div className="p-3 space-y-1">
                <p className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Departments & Categories
                </p>

                {NAVIGATION_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isExpanded = mobileExpandedCat === cat.id;

                  return (
                    <div key={cat.id} className="border-b border-stone-100 last:border-none">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          href={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-800 hover:text-[#DF9F28] flex-1"
                        >
                          <Icon className="w-4 h-4 text-[#DF9F28]" />
                          <span>{cat.label}</span>
                          {cat.popular && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded-full font-bold bg-[#DF9F28] text-slate-950 uppercase">
                              Hot
                            </span>
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                          className="p-2 text-slate-400 hover:text-slate-700"
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
                              className="block py-1 text-xs font-medium text-stone-600 hover:text-[#DF9F28]"
                            >
                              {sub.title}
                            </Link>
                          ))}
                          <Link
                            href={cat.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DF9F28] pt-1"
                          >
                            <span>View All {cat.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-stone-100">
                  <Link
                    href="/lucky-draw"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-amber-900 bg-amber-50/80 rounded-xl border border-amber-200/80"
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#DF9F28]" />
                      <span>Weekly Lucky Draw</span>
                    </div>
                    <span className="text-[10px] bg-[#DF9F28] text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                      LIVE
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Account & Support Links */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
              {session?.user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                      {session.user.name ? session.user.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{session.user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-center text-slate-700 hover:border-amber-300"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-1.5 px-3 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-center text-slate-700 hover:border-amber-300"
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
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#111111] hover:bg-[#DF9F28] text-white hover:text-slate-950 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Join JudesCart</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  Banknote,
  MessageSquare,
  FileText,
  ShieldCheck,
  LogIn,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { totalItems: totalWishlistItems } = useWishlist();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsOpen(false);
      router.push(`/collections?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-6 text-white/90 text-xs tracking-[0.15em] font-medium mix-blend-difference">
        {/* Desktop Links (Hidden on mobile/tablet) */}
        <div className="hidden lg:flex gap-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <Link href="/product" className="hover:text-white transition-colors">
            PRODUCT
          </Link>
          <Link
            href="/collections"
            className="hover:text-white transition-colors"
          >
            COLLECTIONS
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            ABOUT US
          </Link>
        </div>

        {/* Mobile Hamburger (Visible on mobile/tablet only) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-300 transition-colors p-1"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Centered Brand Name */}
        <div className="text-xl md:text-2xl tracking-[0.3em] font-serif absolute left-1/2 transform -translate-x-1/2 pr-4">
          STEVEJON
        </div>

        {/* Desktop Right Links (Hidden on mobile/tablet) */}
        <div className="hidden lg:flex gap-8 items-center">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-white hover:text-gray-300 transition-colors p-1"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          <Link href="/orders" className="hover:text-white transition-colors">
            ORDERS
          </Link>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="hover:text-white transition-colors flex items-center gap-1 focus:outline-none"
              aria-label="User Menu"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden border border-gray-100 font-sans text-gray-800 tracking-normal transform transition-all">
                  <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                      <User className="w-5 h-5 text-gray-600 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        User
                      </h3>
                      <p className="text-xs text-gray-500">
                        Welcome to Stevejon
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <a
                      href="#"
                      className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                      <span className="text-sm text-gray-700 group-hover:text-black">
                        FAQs
                      </span>
                    </a>

                    <a
                      href="#"
                      className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group"
                    >
                      <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                      <span className="text-sm text-gray-700 group-hover:text-black">
                        Terms Of Use
                      </span>
                    </a>

                    <a
                      href="#"
                      className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group"
                    >
                      <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                      <span className="text-sm text-gray-700 group-hover:text-black">
                        Privacy Notice
                      </span>
                    </a>
                  </div>

                  <div className="p-5 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-3.5 rounded-full text-xs font-bold tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      LOGIN/SIGNUP
                      <LogIn className="w-4 h-4 stroke-[2]" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link
            href="/wishlist"
            className="hover:text-white transition-colors relative flex items-center"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.5]" />
            <span className="absolute -top-1 -right-2 bg-[#DF9F28] text-white text-[0.55rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans shadow-sm">
              {totalWishlistItems}
            </span>
          </Link>
          <Link
            href="/cart"
            className="hover:text-white transition-colors relative flex items-center"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            <span className="absolute -top-1 -right-2 bg-[#DF9F28] text-white text-[0.55rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans shadow-sm">
              {totalItems}
            </span>
          </Link>
        </div>

        {/* Mobile Right Tools */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors p-1"
            aria-label="User Menu"
          >
            <User className="w-4 h-4 stroke-[1.5]" />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-white hover:text-gray-300 transition-colors p-1"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>
          <Link
            href="/wishlist"
            className="text-white hover:text-gray-300 transition-colors p-1 relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1.5 bg-[#DF9F28] text-white text-[0.55rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center font-sans">
              {totalWishlistItems}
            </span>
          </Link>
          <Link
            href="/cart"
            className="text-white hover:text-gray-300 transition-colors p-1 relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1.5 bg-[#DF9F28] text-white text-[0.55rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center font-sans">
              {totalItems}
            </span>
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/98 backdrop-blur-md z-[100] flex flex-col justify-center items-center gap-8 text-white select-none transition-all duration-350 ease-in-out">
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Monogram backdrop */}
          <div className="text-2xl tracking-[0.4em] font-serif text-white/30 mb-8">
            STEVEJON
          </div>

          {/* Link List */}
          <Link
            href="/"
            onClick={toggleMenu}
            className="text-lg tracking-[0.2em] font-light hover:text-[#DF9F28] transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/product"
            onClick={toggleMenu}
            className="text-lg tracking-[0.2em] font-light hover:text-[#DF9F28] transition-colors"
          >
            PRODUCT
          </Link>
          <Link
            href="/collections"
            onClick={toggleMenu}
            className="text-lg tracking-[0.2em] font-light hover:text-[#DF9F28] transition-colors"
          >
            COLLECTIONS
          </Link>
          <Link
            href="/about"
            onClick={toggleMenu}
            className="text-lg tracking-[0.2em] font-light hover:text-[#DF9F28] transition-colors"
          >
            ABOUT
          </Link>

          <div className="w-12 h-[1px] bg-white/10 my-4"></div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-xs tracking-[0.15em] font-medium text-white/50 hover:text-white transition-colors uppercase"
          >
            SEARCH
          </button>
          <Link
            href="/orders"
            onClick={toggleMenu}
            className="text-xs tracking-[0.15em] font-medium text-white/50 hover:text-white transition-colors"
          >
            ORDERS
          </Link>
          <Link
            href="/login"
            onClick={toggleMenu}
            className="text-xs tracking-[0.15em] font-medium text-white/50 hover:text-white transition-colors flex items-center gap-2"
          >
            LOGIN / SIGNUP
          </Link>
          <Link
            href="/wishlist"
            onClick={toggleMenu}
            className="text-xs tracking-[0.15em] font-medium text-white/50 hover:text-white transition-colors"
          >
            WISHLIST ({totalWishlistItems})
          </Link>
          <Link
            href="/cart"
            onClick={toggleMenu}
            className="text-xs tracking-[0.15em] font-medium text-[#DF9F28] hover:text-[#DF9F28]/80 transition-colors"
          >
            CART ({totalItems})
          </Link>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col transition-all duration-300 font-sans">
          <div className="flex justify-between items-center px-6 md:px-12 py-8">
            <div className="text-xl md:text-2xl tracking-[0.3em] font-serif text-black">
              STEVEJON
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-black hover:text-gray-600 p-2 transition-colors"
              aria-label="Close Search"
            >
              <X className="w-8 h-8 stroke-[1.5]" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start pt-16 md:pt-32 px-6">
            <form onSubmit={handleSearch} className="w-full max-w-3xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full border-b-2 border-black bg-transparent text-2xl md:text-5xl font-light text-black placeholder-gray-400 py-4 md:py-6 pr-16 focus:outline-none focus:border-[#DF9F28] transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 bottom-6 md:bottom-8 text-black hover:text-[#DF9F28] transition-colors"
              >
                <Search className="w-8 h-8 md:w-10 md:h-10 stroke-[1]" />
              </button>
            </form>

            <div className="w-full max-w-3xl mt-16 text-left">
              <h4 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-4">
                {[
                  "Linen Shirts",
                  "Bespoke Suits",
                  "Leather Accessories",
                  "Summer Collection",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(
                        `/collections?search=${encodeURIComponent(term)}`,
                      );
                      setIsSearchOpen(false);
                      setIsOpen(false);
                    }}
                    className="px-6 py-3 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-black hover:text-black transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-6 text-white/90 text-xs tracking-[0.15em] font-medium mix-blend-difference">
        
        {/* Desktop Links (Hidden on mobile/tablet) */}
        <div className="hidden lg:flex gap-8">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <Link href="/product" className="hover:text-white transition-colors">PRODUCT</Link>
          <Link href="/collections" className="hover:text-white transition-colors">COLLECTIONS</Link>
          <a href="#" className="hover:text-white transition-colors">ATELIER</a>
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
        <div className="hidden lg:flex gap-8">
          <a href="#" className="hover:text-white transition-colors">SEARCH</a>
          <a href="#" className="hover:text-white transition-colors">ACCOUNT</a>
          <a href="#" className="hover:text-white transition-colors">BAG (0)</a>
        </div>

        {/* Mobile Right Tools */}
        <div className="lg:hidden flex items-center gap-4">
          <a href="#" className="text-white hover:text-gray-300 transition-colors p-1" aria-label="Search">
            <Search className="w-4 h-4 stroke-[1.5]" />
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors p-1 relative" aria-label="Cart">
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1.5 bg-[#DF9F28] text-white text-[0.55rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center font-sans">
              0
            </span>
          </a>
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
          <a 
            href="#" 
            onClick={toggleMenu} 
            className="text-lg tracking-[0.2em] font-light hover:text-[#DF9F28] transition-colors"
          >
            ATELIER
          </a>

          <div className="w-12 h-[1px] bg-white/10 my-4"></div>

          <a 
            href="#" 
            onClick={toggleMenu} 
            className="text-xs tracking-[0.15em] font-medium text-white/50 hover:text-white transition-colors"
          >
            SEARCH
          </a>
          <a 
            href="#" 
            onClick={toggleMenu} 
            className="text-xs tracking-[0.15em] font-medium text-white/50 hover:text-white transition-colors"
          >
            ACCOUNT
          </a>
          <a 
            href="#" 
            onClick={toggleMenu} 
            className="text-xs tracking-[0.15em] font-medium text-[#DF9F28] hover:text-[#DF9F28]/80 transition-colors"
          >
            BAG (0)
          </a>

        </div>
      )}
    </>
  );
}

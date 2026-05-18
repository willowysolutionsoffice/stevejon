import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-8 py-6 text-white/90 text-xs tracking-[0.15em] font-medium mix-blend-difference">
      <div className="flex gap-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <Link href="/collections" className="hover:text-white transition-colors">PRODUCT</Link>
        <Link href="/collections" className="hover:text-white transition-colors">COLLECTIONS</Link>
        <a href="#" className="hover:text-white transition-colors">ATELIER</a>
      </div>
      <div className="text-2xl tracking-[0.3em] font-serif pr-4">
        STEVEJON
      </div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">SEARCH</a>
        <a href="#" className="hover:text-white transition-colors">ACCOUNT</a>
        <a href="#" className="hover:text-white transition-colors">BAG (0)</a>
      </div>
    </nav>
  );
}

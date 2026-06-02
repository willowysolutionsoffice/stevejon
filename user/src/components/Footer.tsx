import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white pt-20 pb-10 px-8 text-xs font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-4">
          <h5 className="tracking-widest uppercase mb-2 opacity-80">CUSTOMER CARE</h5>
          <Link href="/about" className="text-[#888] hover:text-white transition-colors">About Us</Link>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Customer Care</a>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Shipping</a>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Returns</a>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="tracking-widest uppercase mb-2 opacity-80">EXPLORE</h5>
          <Link href="/collections" className="text-[#888] hover:text-white transition-colors">Collections</Link>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Atelier</a>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Journal</a>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Privacy Policy</a>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="tracking-widest uppercase mb-2 opacity-80">COMPANY</h5>
          <Link href="/about" className="text-[#888] hover:text-white transition-colors">About</Link>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Careers</a>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Stores</a>
          <a href="#" className="text-[#888] hover:text-white transition-colors">Contact Us</a>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="tracking-widest uppercase mb-2 opacity-80">JOIN THE PRIVATE LIST</h5>
          <p className="text-[#888] leading-relaxed">Sign up for newsletters and updates on our collections and atelier.</p>
          <div className="flex mt-2 border-b border-[#333] pb-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-transparent w-full outline-none text-white placeholder-[#555] text-sm"
            />
            <button className="text-white hover:text-gray-300 transition-colors">→</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#222]">
        <p className="text-[#555] mb-4 md:mb-0">© {new Date().getFullYear()} STEVEJON. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          {/* Simple social links placeholders */}
          <a href="#" className="text-[#555] hover:text-white transition-colors">FB</a>
          <a href="#" className="text-[#555] hover:text-white transition-colors">IG</a>
          <a href="#" className="text-[#555] hover:text-white transition-colors">TW</a>
          <a href="#" className="text-[#555] hover:text-white transition-colors">LI</a>
        </div>
      </div>
    </footer>
  );
}

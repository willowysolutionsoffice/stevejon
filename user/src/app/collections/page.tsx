import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CollectionsPage() {
  const products = [
    { title: "TIMELESS APPAREL", img: "/cat_apparel_1778670103427.png" },
    { title: "LEATHER GOODS", img: "/cat_leather_1778670351299.png" },
    { title: "SIGNATURE ACCESSORIES", img: "/cat_accessories_1778670517925.png" },
    { title: "Overshirt", img: "/prod_overshirt_1778670536589.png" },
    { title: "Trouser", img: "/prod_trouser_1778670553370.png" }
  ];

  const getCollectionLink = (title: string) => {
    const uppercaseTitle = title.toUpperCase();
    if (uppercaseTitle.includes('APPAREL')) return '/product?category=Apparel';
    if (uppercaseTitle.includes('LEATHER')) return '/product?category=Leather Goods';
    if (uppercaseTitle.includes('ACCESSORIES')) return '/product?category=Accessories';
    if (uppercaseTitle.includes('OVERSHIRT')) return '/product?id=1';
    if (uppercaseTitle.includes('TROUSER')) return '/product?id=5';
    return '/product';
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-20">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.1em] mb-4">OUR COLLECTIONS</h1>
          <div className="w-24 h-[1px] bg-black/20 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
          {products.map((prod, i) => (
            <Link href={getCollectionLink(prod.title)} key={i} className="group cursor-pointer block">
              <div className="relative aspect-[3/4] bg-[#F3F2EE] mb-4 overflow-hidden">
                <Image 
                  src={prod.img} 
                  alt={prod.title} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                />
              </div>
              <div className="flex flex-col items-center gap-1 mt-6">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">{prod.title}</h3>
                <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 border-b border-transparent group-hover:border-black/30 pb-1 transition-colors">Discover</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

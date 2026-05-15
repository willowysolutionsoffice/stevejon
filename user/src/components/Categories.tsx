import React from 'react';
import Image from 'next/image';

export default function Categories() {
  return (
    <section className="px-4 py-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: "TIMELESS APPAREL", img: "/cat_apparel_1778670103427.png" },
        { title: "LEATHER GOODS", img: "/cat_leather_1778670351299.png" },
        { title: "SIGNATURE ACCESSORIES", img: "/cat_accessories_1778670517925.png" }
      ].map((cat, i) => (
        <div key={i} className="group relative aspect-[4/5] overflow-hidden bg-gray-200 cursor-pointer">
          <Image 
            src={cat.img} 
            alt={cat.title} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white text-sm tracking-widest uppercase">{cat.title}</h3>
          </div>
        </div>
      ))}
    </section>
  );
}

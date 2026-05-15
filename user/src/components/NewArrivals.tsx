import React from 'react';
import Image from 'next/image';

export default function NewArrivals() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif text-center md:text-left mb-12">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {[
          { title: "Overshirt", price: "$850", img: "/prod_overshirt_1778670536589.png" },
          { title: "Trouser", price: "$620", img: "/prod_trouser_1778670553370.png" },
          { title: "Pocket Square", price: "$150", img: "/prod_overshirt_1778670536589.png" },
          { title: "Belt", price: "$280", img: "/prod_trouser_1778670553370.png" },
        ].map((prod, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="relative aspect-[3/4] bg-[#F3F2EE] mb-4 overflow-hidden">
              <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[0.6rem] font-bold tracking-widest z-10 shadow-sm">NEW</div>
              <Image 
                src={prod.img} 
                alt={prod.title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-gray-900">{prod.title}</h4>
              <p className="text-sm font-semibold">{prod.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

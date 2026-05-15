import React from 'react';
import Image from 'next/image';

export default function ProductCollectionGrid() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif text-center md:text-left mb-12">Product Collection Grid</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
        {[
          { title: "Overcoat", price: "$2,450", img: "/cat_apparel_1778670103427.png" },
          { title: "Blazer", price: "$1,200", img: "/prod_overshirt_1778670536589.png" },
          { title: "Knit", price: "$950", img: "/prod_trouser_1778670553370.png" },
          { title: "Duffle", price: "$650", img: "/cat_leather_1778670351299.png" },
          { title: "Scarf", price: "$1,100", img: "/cat_accessories_1778670517925.png" },
          { title: "Watch", price: "$850", img: "/prod_overshirt_1778670536589.png" },
        ].map((prod, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="relative aspect-square bg-[#F3F2EE] mb-4 overflow-hidden">
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

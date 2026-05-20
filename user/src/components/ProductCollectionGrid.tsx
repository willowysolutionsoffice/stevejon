import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCollectionGrid() {
  const getProductId = (title: string) => {
    switch (title) {
      case "Overcoat": return 4; // Double-Breasted Coat
      case "Blazer": return 1; // Overshirt (closest match)
      case "Knit": return 5; // Savile Row Trouser
      case "Duffle": return 2; // Leather Duffle Bag
      case "Scarf": return 7; // Premium Atelier Scarf
      case "Watch": return 9; // Signature Set
      default: return 1;
    }
  }

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-12">Our Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16">
        {[
          { title: "Overcoat", price: "$2,450", img: "/cat_apparel_1778670103427.png" },
          { title: "Blazer", price: "$1,200", img: "/prod_overshirt_1778670536589.png" },
          { title: "Knit", price: "$950", img: "/prod_trouser_1778670553370.png" },
          { title: "Duffle", price: "$650", img: "/cat_leather_1778670351299.png" },
          { title: "Scarf", price: "$1,100", img: "/cat_accessories_1778670517925.png" },
          { title: "Watch", price: "$850", img: "/prod_overshirt_1778670536589.png" },
        ].map((prod, i) => (
          <Link href={`/product?id=${getProductId(prod.title)}`} key={i} className="group cursor-pointer block">
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
          </Link>
        ))}
      </div>
    </section>
  );
}

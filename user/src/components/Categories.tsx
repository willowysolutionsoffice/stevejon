'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      try {
        const res = await fetch(`${apiUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="relative aspect-[4/5] bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </section>
    );
  }

  // Fallback in case backend categories are not seeded or offline
  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: "Apparel", image: "/cat_apparel_1778670103427.png" },
    { id: '2', name: "Leather Goods", image: "/cat_leather_1778670351299.png" },
    { id: '3', name: "Accessories", image: "/cat_accessories_1778670517925.png" }
  ];

  return (
    <section className="px-4 py-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      {displayCategories.slice(0, 3).map((cat) => (
        <Link href={`/product?category=${encodeURIComponent(cat.name)}`} key={cat.id} className="group relative aspect-[4/5] overflow-hidden bg-gray-200 cursor-pointer block">
          <Image 
            src={cat.image} 
            alt={cat.name} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white text-sm tracking-widest uppercase">{cat.name}</h3>
          </div>
        </Link>
      ))}
    </section>
  );
}

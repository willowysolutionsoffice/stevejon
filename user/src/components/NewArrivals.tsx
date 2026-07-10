'use client';

import React, { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  variantId?: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  isNewArrival: boolean;
}

export default function NewArrivals() {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const apiUrl = getApiUrl();
      try {
        const response = await fetch(`${apiUrl}/products?limit=100`);
        if (response.ok) {
          const resData = await response.json();
          if (resData && Array.isArray(resData.data)) {
            // Map the API data
            const mapped = resData.data.map((p: any) => {
              const price = p.variants?.[0]?.price || 5400;
              return {
                id: p.id,
                variantId: p.variants?.[0]?.id,
                name: p.name,
                category: p.category?.name || "Apparel",
                price: price,
                originalPrice: p.variants?.[0]?.offerPrice || Math.round(price * 1.2),
                image: p.image || "/prod_overshirt_1778670536589.png",
                isNewArrival: p.isNewArrival
              };
            });

            // Filter for new arrivals, fallback to first 4 products if none marked
            let filtered = mapped.filter((p: any) => p.isNewArrival);
            if (filtered.length === 0) {
              filtered = mapped.slice(0, 4);
            }
            setProducts(filtered.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    addToCart({
      productId: prod.id,
      variantId: prod.variantId,
      title: prod.name,
      category: prod.category,
      price: prod.price,
      image: prod.image,
      size: 'M',
      color: 'Classic',
      quantity: 1,
    });
    
    setToastMessage(`Added ${prod.name} to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToWishlist = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    addToWishlist({
      id: String(prod.id),
      productId: prod.id,
      variantId: prod.variantId,
      title: prod.name,
      category: prod.category,
      price: prod.price,
      image: prod.image,
    });
    setToastMessage(`Added ${prod.name} to wishlist`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleBuyNow = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    addToCart({
      productId: prod.id,
      variantId: prod.variantId,
      title: prod.name,
      category: prod.category,
      price: prod.price,
      image: prod.image,
      size: 'M',
      color: 'Classic',
      quantity: 1,
    });
    router.push('/cart');
  };

  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center md:text-left mb-12">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="aspect-[3/4] w-full bg-gray-200 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto relative">
      <h2 className="text-3xl font-serif text-center md:text-left mb-12">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {products.map((prod) => (
          <div key={prod.id} className="group flex flex-col">
            <div className="relative aspect-[3/4] bg-[#E7F2FF] mb-4 overflow-hidden rounded-xl group/image">
              <Link href={`/product?id=${prod.id}`} className="block w-full h-full">
                <div className="absolute top-3 left-3 bg-white px-2 py-1 text-[0.6rem] font-bold tracking-widest z-10 shadow-sm">NEW</div>
                <Image 
                  src={prod.image} 
                  alt={prod.name} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover/image:scale-105 mix-blend-multiply"
                />
              </Link>
              <div className="absolute bottom-3 right-3 flex flex-row gap-2 z-20">
                <button 
                  onClick={(e) => handleAddToWishlist(e, prod)}
                  className="bg-white p-2.5 rounded-full shadow-md hover:bg-[#0077FF] hover:text-white transition-colors text-gray-800"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleAddToCart(e, prod)}
                  className="bg-white p-2.5 rounded-full shadow-md hover:bg-[#0077FF] hover:text-white transition-colors text-gray-800"
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <Link href={`/product?id=${prod.id}`} className="block">
                <h4 className="text-sm text-gray-900 group-hover:text-[#0077FF] transition-colors">{prod.name}</h4>
                <p className="text-sm font-semibold text-gray-900 mt-1">₹ {prod.price.toLocaleString()}</p>
              </Link>
              <button 
                onClick={(e) => handleBuyNow(e, prod)}
                className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 text-[0.65rem] font-bold tracking-[0.2em] uppercase border border-gray-200 text-gray-800 rounded-full hover:bg-[#0077FF] hover:text-white hover:border-[#0077FF] transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-fadeIn">
          <div className="bg-green-500 rounded-full p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase">
            {toastMessage}
          </span>
        </div>
      )}
    </section>
  );
}

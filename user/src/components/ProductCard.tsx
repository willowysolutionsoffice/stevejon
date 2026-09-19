'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export interface ProductCardProps {
  id: string | number;
  variantId?: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  subimage?: string[];
  rating?: number;
  reviewsCount?: number;
  isNewArrival?: boolean;
  isCustomerFavorite?: boolean;
  onQuickView?: () => void;
}

export default function ProductCard({
  id,
  variantId,
  name,
  description,
  category = 'APPAREL',
  brand = 'JudesCart',
  price,
  originalPrice,
  image,
  subimage = [],
  rating = 4.9,
  reviewsCount = 128,
  isNewArrival = false,
  isCustomerFavorite = false,
  onQuickView,
}: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist ? isInWishlist(id) : false;

  // Calculate discount percentage if original price is higher
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Secondary hover image
  const secondaryImage = subimage && subimage.length > 0 ? subimage[0] : null;
  const displayImage = isHovered && secondaryImage ? secondaryImage : (image || '/prod_overshirt_1778670536589.png');

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id: String(id),
        productId: id,
        variantId: variantId,
        title: name,
        category: category,
        price: price,
        image: image,
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView();
    } else {
      router.push(`/product?id=${encodeURIComponent(String(id))}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: id,
      variantId: variantId,
      title: name,
      category: category,
      price: price,
      image: image,
      size: 'M',
      color: 'Classic',
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-white border border-zinc-200/90 overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Restrained Badge, Wishlist & Quick Action */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Link href={`/product?id=${encodeURIComponent(String(id))}`} className="relative block w-full h-full focus-visible:outline-none">
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Single Primary Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          {hasDiscount ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-900 text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : isCustomerFavorite ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#DF9F28] text-zinc-950 shadow-xs">
              Bestseller
            </span>
          ) : isNewArrival ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-900 text-white shadow-xs">
              New
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Accessible 36x36px target) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-rose-600 hover:bg-white transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Desktop Slide-up Action Bar */}
        <div className="absolute inset-x-3 bottom-3 z-20 transition-all duration-200 transform translate-y-3 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:block">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickView}
              aria-label="Quick View"
              title="Quick View"
              className="w-10 h-10 rounded-xl bg-white text-zinc-700 hover:text-zinc-900 border border-zinc-200 shadow-sm flex items-center justify-center cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 h-10 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 hover:bg-[#DF9F28] hover:text-zinc-950 text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Card Information Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#DF9F28]">
              {category}
            </span>
            <div className="flex items-center gap-1 text-zinc-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-zinc-800">{rating.toFixed(1)}</span>
              <span className="text-[11px] text-zinc-400">({reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product?id=${encodeURIComponent(String(id))}`} className="block group-hover:text-[#DF9F28] transition-colors focus-visible:outline-none">
            <h3 className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2">
              {name}
            </h3>
          </Link>

          {/* Optional Short Description on large cards */}
          {description && (
            <p className="hidden md:block text-xs text-zinc-500 line-clamp-1 pt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Price & Mobile Actions */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-zinc-900">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Quick Add (Touch friendly) */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded}
              aria-label="Add to bag"
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white active:bg-[#DF9F28] active:text-zinc-950'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

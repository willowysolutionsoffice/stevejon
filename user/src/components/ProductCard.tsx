'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check, Star, Eye, Scale } from 'lucide-react';
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
  const [isCompared, setIsCompared] = useState(false);

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

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCompared((prev) => !prev);
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
      className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 hover:border-[#DF9F28]/60 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges, Action Buttons & Desktop Slide-up Quick Action Bar */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <Link href={`/product?id=${encodeURIComponent(String(id))}`} className="relative block w-full h-full">
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Top-Left Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none scale-90 sm:scale-100 origin-top-left flex flex-col gap-1">
          {(isCustomerFavorite || isNewArrival) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#DF9F28] text-slate-950 shadow-xs">
              {isCustomerFavorite ? 'Bestseller' : 'New'}
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Top-Right Action Buttons */}
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-slate-200/80 text-slate-700 hover:text-rose-600 hover:bg-white transition-all active:scale-90 cursor-pointer"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Compare Button */}
        <button
          type="button"
          onClick={handleCompareToggle}
          aria-label="Compare product"
          title="Compare product"
          className={`absolute top-8.5 right-2 sm:top-12 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-xs border transition-all active:scale-90 cursor-pointer ${
            isCompared
              ? 'bg-[#DF9F28] text-slate-950 border-[#DF9F28]'
              : 'bg-white/90 border-slate-200/80 text-slate-700 hover:text-[#DF9F28] hover:bg-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Desktop Hover Quick Action Bar (Slides up on desktop hover) */}
        <div className="absolute inset-x-3 bottom-3 z-20 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto hidden sm:block">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickView}
              aria-label="Quick View"
              title="Quick View"
              className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-[#DF9F28] text-xs font-bold shadow-md hover:bg-white transition-all flex items-center justify-center cursor-pointer border border-slate-200"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#DF9F28] hover:bg-[#C6891E] text-slate-950'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Card Information Body */}
      <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & 5-Star Rating Row */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1">
            <span className="uppercase tracking-wider font-bold text-[#DF9F28]">
              {category}
            </span>
            <div className="scale-75 sm:scale-100 origin-right">
              <div className="inline-flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-amber-400/40 text-amber-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-stone-700">{rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400">({reviewsCount})</span>
              </div>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product?id=${encodeURIComponent(String(id))}`} className="block">
            <h3 className="text-xs sm:text-sm font-sans font-bold text-slate-900 group-hover:text-[#DF9F28] transition-colors line-clamp-1 sm:line-clamp-2">
              {name}
            </h3>
          </Link>

          {/* Luxury Tags */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5 sm:pt-1">
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-amber-500/10 text-amber-700 border border-amber-300/80">
              🎟️ Platinum
            </span>
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
              👑 JUDES
            </span>
          </div>

          {/* Short Description (Visible on sm+) */}
          <p className="hidden sm:block text-xs text-slate-500 line-clamp-1 mt-0.5">
            {description || 'Custom crafted with premium materials and signature JudesCart attention to detail.'}
          </p>
        </div>

        {/* Color Swatches & Price Row */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              title="Matte Obsidian Black"
              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all ring-1 sm:ring-2 ring-[#DF9F28] ring-offset-1 scale-110 bg-stone-900 cursor-pointer"
            />
            <button
              type="button"
              title="Signature Gold"
              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all border-slate-300 hover:scale-105 bg-[#DF9F28] cursor-pointer"
            />
            <button
              type="button"
              title="Silver Slate"
              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all border-slate-300 hover:scale-105 bg-slate-200 cursor-pointer"
            />
          </div>

          <div className="flex items-baseline gap-1 sm:gap-1.5 text-right">
            <span className="text-xs sm:text-sm font-extrabold text-[#0A192F]">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Action Row (Visible only on mobile < sm) */}
        <div className="sm:hidden pt-1.5 flex items-center gap-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickView}
            aria-label="Quick View"
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs flex items-center justify-center cursor-pointer shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#DF9F28] active:bg-[#C6891E] text-slate-950'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="truncate">Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

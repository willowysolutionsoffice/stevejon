'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight, Trophy, Zap, X, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Check, ShoppingBag, Heart } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
}

export default function ProductPage() {
  // Real project products catalog duplicated to form a pristine 9-item grid
  const productsCatalog: Product[] = [
    {
      id: 1,
      title: "Utility Overshirt",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/prod_overshirt_1778670536589.png"
    },
    {
      id: 2,
      title: "Leather Duffle Bag",
      category: "Leather Goods",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_leather_1778670351299.png"
    },
    {
      id: 3,
      title: "Signature Perfume",
      category: "Accessories",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_accessories_1778670517925.png"
    },
    {
      id: 4,
      title: "Double-Breasted Coat",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_apparel_1778670103427.png"
    },
    {
      id: 5,
      title: "Savile Row Trouser",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/prod_trouser_1778670553370.png"
    },
    {
      id: 6,
      title: "Luxury Briefcase",
      category: "Leather Goods",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_leather_1778670351299.png"
    },
    {
      id: 7,
      title: "Premium Atelier Scarf",
      category: "Accessories",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_accessories_1778670517925.png"
    },
    {
      id: 8,
      title: "Casual Utility Trouser",
      category: "Apparel",
      price: 5400,
      originalPrice: 6600,
      image: "/prod_trouser_1778670553370.png"
    },
    {
      id: 9,
      title: "Stevejon Signature Set",
      category: "Accessories",
      price: 5400,
      originalPrice: 6600,
      image: "/cat_accessories_1778670517925.png"
    }
  ];

  // Client-side category selection state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Apparel', 'Leather Goods']);
  
  // Product Detail Inner Page State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Classic');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');

  // Handle category checkbox changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all active filters
  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  // Filter products catalog dynamically
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return productsCatalog;
    return productsCatalog.filter(p => selectedCategories.includes(p.category));
  }, [selectedCategories]);

  // If a product is selected, render the stunning Product Detail Inner Page
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans animate-fadeIn">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-24">
          {/* Back Button */}
          <button 
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-12 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Catalog
          </button>

          {/* Product Detail Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Image Gallery (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-32">
              <div className="relative aspect-[4/5] rounded-[2.5rem] bg-[#F3F2EE] border border-gray-100 overflow-hidden shadow-sm group">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105 p-8 md:p-12"
                  priority
                />
                <div className="absolute top-6 left-6 bg-[#DF9F28] text-white text-[0.65rem] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full shadow-md">
                  Stevejon Exclusive
                </div>
                <button className="absolute top-6 right-6 bg-white/80 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-full shadow-sm transition-all hover:scale-110 cursor-pointer">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail preview row */}
              <div className="grid grid-cols-3 gap-4">
                {[selectedProduct.image, selectedProduct.image, selectedProduct.image].map((img, idx) => (
                  <div key={idx} className={`relative aspect-square rounded-2xl bg-[#F3F2EE] border-2 overflow-hidden cursor-pointer transition-all hover:opacity-100 ${idx === 0 ? 'border-[#DF9F28] opacity-100 shadow-sm' : 'border-transparent opacity-60'}`}>
                    <Image src={img} alt="" fill className="object-cover mix-blend-multiply p-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info & Actions (6 cols) */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#DF9F28]">
                  {selectedProduct.category}
                </span>
                <div className="flex items-center gap-1.5 bg-gray-100/80 px-3 py-1 rounded-full">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800 ml-1">4.9</span>
                  <span className="text-[0.65rem] text-gray-500">(128 Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide text-black mb-6 leading-tight">
                {selectedProduct.title}
              </h1>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-100">
                <span className="text-3xl md:text-4xl font-bold text-black font-sans">
                  ₹ {selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-lg md:text-xl line-through text-gray-400 font-normal">
                  ₹ {selectedProduct.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Save ₹ {(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()}
                </span>
              </div>

              {/* Description snippet */}
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 font-sans">
                Experience unparalleled luxury and craftsmanship with the {selectedProduct.title}. Designed for the modern connoisseur, this masterpiece combines timeless elegance with uncompromising utility, tailored from the finest bespoke materials.
              </p>

              {/* Color Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-700">Color: <span className="text-black font-semibold">{selectedColor}</span></span>
                </div>
                <div className="flex gap-3">
                  {[
                    { name: 'Classic', bg: 'bg-[#3A3835]' },
                    { name: 'Pristine White', bg: 'bg-[#F4F4F0]' },
                    { name: 'Heritage Tan', bg: 'bg-[#C89D7C]' },
                    { name: 'Midnight Navy', bg: 'bg-[#1C2838]' },
                  ].map(col => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-9 h-9 rounded-full ${col.bg} border-2 transition-all cursor-pointer flex items-center justify-center ${selectedColor === col.name ? 'border-[#DF9F28] scale-110 shadow-md ring-2 ring-[#DF9F28]/20' : 'border-gray-200 hover:scale-105'}`}
                      title={col.name}
                    >
                      {selectedColor === col.name && <Check className={`w-4 h-4 ${col.name === 'Pristine White' ? 'text-black' : 'text-white'}`} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {selectedProduct.category === 'Apparel' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-700">Size: <span className="text-black font-semibold">{selectedSize}</span></span>
                    <button className="text-xs font-semibold underline tracking-wider text-gray-500 hover:text-black cursor-pointer">Size Guide</button>
                  </div>
                  <div className="flex gap-3">
                    {['S', 'M', 'L', 'XL'].map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl border text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center ${selectedSize === size ? 'border-[#DF9F28] bg-[#DF9F28] text-white shadow-lg shadow-[#DF9F28]/20' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-200 rounded-full bg-white px-4 py-2 w-fit">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-bold text-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-black font-sans">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-bold text-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button className="flex-1 bg-[#DF9F28] hover:bg-[#c58b20] text-white px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all text-xs font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#DF9F28]/20 hover:shadow-2xl hover:shadow-[#DF9F28]/30 cursor-pointer group">
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Add To Cart
                </button>
              </div>

              {/* Buy Now Button */}
              <button className="w-full bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all text-xs font-bold tracking-[0.2em] uppercase mb-12 shadow-lg cursor-pointer">
                Buy It Now
              </button>

              {/* Premium Guarantees Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-t border-b border-gray-100 mb-12 bg-gray-50/50 rounded-3xl p-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-[#DF9F28]" />
                  <h4 className="text-xs font-bold tracking-wider uppercase text-black">Express Delivery</h4>
                  <p className="text-[0.7rem] text-gray-500 leading-relaxed">Complimentary insured shipping worldwide.</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#DF9F28]" />
                  <h4 className="text-xs font-bold tracking-wider uppercase text-black">2-Year Warranty</h4>
                  <p className="text-[0.7rem] text-gray-500 leading-relaxed">Official Stevejon atelier guarantee.</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RefreshCw className="w-6 h-6 text-[#DF9F28]" />
                  <h4 className="text-xs font-bold tracking-wider uppercase text-black">Easy Exchanges</h4>
                  <p className="text-[0.7rem] text-gray-500 leading-relaxed">30-day seamless return policy.</p>
                </div>
              </div>

              {/* Accordion / Tabs Section */}
              <div className="flex flex-col border border-gray-200 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'materials', label: 'Materials & Care' },
                    { id: 'shipping', label: 'Shipping' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer border-b-2 ${activeTab === tab.id ? 'border-[#DF9F28] text-black bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="p-8 text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                  {activeTab === 'description' && (
                    <p>
                      Every Stevejon piece represents the pinnacle of modern luxury. The {selectedProduct.title} is meticulously crafted by master artisans to ensure a flawless silhouette, unparalleled comfort, and exceptional durability. Features custom hardware, reinforced stitching, and an exclusive serial number for authenticity verification.
                    </p>
                  )}
                  {activeTab === 'materials' && (
                    <p>
                      • 100% Premium imported materials.<br />
                      • Dry clean only by a professional leather/apparel specialist.<br />
                      • Store in the provided Stevejon breathable dust bag.<br />
                      • Avoid prolonged exposure to direct sunlight and moisture.
                    </p>
                  )}
                  {activeTab === 'shipping' && (
                    <p>
                      • White-glove express delivery within 2-4 business days.<br />
                      • Real-time tracking provided via email & SMS.<br />
                      • All packages are fully insured against loss or damage.<br />
                      • Signature required upon delivery for absolute security.
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Related Products Section */}
          <div className="mt-32 pt-16 border-t border-gray-100">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-serif tracking-widest uppercase text-black mb-4">You May Also Like</h2>
              <div className="w-16 h-[1px] bg-[#DF9F28] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {productsCatalog.filter(p => p.id !== selectedProduct.id).slice(0, 3).map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => {
                    setSelectedProduct(prod);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F3F2EE] mb-4">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105 p-4"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-[#DF9F28]">{prod.category}</span>
                    <h3 className="text-sm font-semibold tracking-wide text-gray-900 mt-1 group-hover:text-[#DF9F28] transition-colors">{prod.title}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm font-bold text-black">₹ {prod.price}</span>
                      <span className="text-[0.7rem] line-through text-gray-400">₹ {prod.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-40 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN: Sidebar Filters & Widgets */}
          <aside className="w-full lg:w-1/4 flex flex-col gap-10 lg:sticky lg:top-32 select-none">
            
            {/* Filter Section Container */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-serif tracking-[0.1em] uppercase text-black mb-8 pb-3 border-b border-gray-100">
                Filter Option
              </h2>

              {/* Category Checkboxes */}
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">
                  Category
                </h3>
                <div className="flex flex-col gap-3">
                  {['Apparel', 'Leather Goods', 'Accessories'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 text-xs tracking-wider font-medium text-gray-700 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="w-4 h-4 rounded border-gray-200 text-[#DF9F28] focus:ring-[#DF9F28] accent-[#DF9F28]"
                      />
                      <span className="group-hover:text-black transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Checkboxes */}
              <div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">
                  Price Range
                </h3>
                <div className="flex flex-col gap-3">
                  {['Under ₹5000', '₹5000 - ₹10000', 'Over ₹10000'].map(price => (
                    <label key={price} className="flex items-center gap-3 text-xs tracking-wider font-medium text-gray-700 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={price === '₹5000 - ₹10000'}
                        className="w-4 h-4 rounded border-gray-200 text-[#DF9F28] focus:ring-[#DF9F28] accent-[#DF9F28]"
                        disabled
                      />
                      <span className="group-hover:text-black transition-colors opacity-60">{price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Flash Sales Gold Widget */}
            <div className="relative rounded-[2.2rem] p-8 text-center bg-gradient-to-br from-[#FDF8EE] to-[#F5EAD4] border border-[#DF9F28]/15 shadow-sm overflow-hidden flex flex-col items-center">
              
              {/* Floating gold lightning icon in corner */}
              <div className="absolute -top-3 -left-3 text-[#DF9F28]/20 z-0">
                <Zap className="w-20 h-20 fill-current" />
              </div>

              <div className="bg-[#DF9F28]/10 text-[#DF9F28] p-3 rounded-full mb-6 z-10">
                <Zap className="w-6 h-6 fill-current" />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif italic font-extrabold text-black uppercase tracking-wide leading-none mb-3 z-10">
                Flash Sales!
              </h3>
              
              <p className="text-gray-600 text-[0.7rem] md:text-xs tracking-wider leading-relaxed max-w-[200px] mb-8 font-sans z-10">
                Check out the latest offer products and win attractive prizes!
              </p>

              <button className="bg-[#DF9F28] hover:bg-[#c58b20] text-white px-8 py-3 rounded-full inline-flex items-center gap-1.5 transition-all text-xs font-semibold tracking-[0.15em] uppercase hover:shadow-lg hover:shadow-yellow-600/10 group cursor-pointer z-10">
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Win Weekly Badge */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 flex items-center justify-center gap-3 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="bg-[#DF9F28]/10 p-2 rounded-full">
                <Trophy className="w-4 h-4 text-[#DF9F28]" />
              </div>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-black font-sans">
                Win Weekly
              </span>
            </div>

          </aside>

          {/* RIGHT COLUMN: Active Filters & Products Grid */}
          <main className="w-full lg:w-3/4 flex-1">
            
            {/* Active Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-gray-100 min-h-[44px]">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-gray-400">
                Active Filters:
              </span>

              {selectedCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="inline-flex items-center gap-1.5 bg-[#F3F2EE] hover:bg-[#E5E4E0] text-black text-[0.65rem] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {cat === 'Leather Goods' ? 'Leather' : cat}
                  <X className="w-3 h-3 text-gray-400 hover:text-black transition-colors" />
                </button>
              ))}

              {selectedCategories.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-[#DF9F28] hover:text-[#c58b20] transition-colors cursor-pointer ml-2 border-b border-[#DF9F28]/35 hover:border-[#c58b20]"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.id} 
                  onClick={() => {
                    setSelectedProduct(prod);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer"
                >
                  
                  {/* Image Card */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 bg-[#F3F2EE] border border-gray-100/50">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover mix-blend-multiply transition-transform duration-750 group-hover:scale-105 p-4"
                      priority={prod.id <= 3}
                    />
                    
                    {/* Subtle bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Details */}
                  <div className="mt-5 text-left">
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-gray-400">
                      {prod.category}
                    </span>
                    <h3 className="text-sm font-semibold tracking-wide text-gray-900 mt-1 group-hover:text-black transition-colors font-sans">
                      {prod.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-black">
                        ₹ {prod.price}
                      </span>
                      <span className="text-[0.7rem] line-through text-gray-400 font-normal">
                        ₹ {prod.originalPrice}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-[#F9F8F4] rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 tracking-wider">No products found matching the selected filters.</p>
                <button
                  onClick={handleClearAll}
                  className="mt-4 text-xs font-semibold tracking-widest uppercase underline text-black cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}


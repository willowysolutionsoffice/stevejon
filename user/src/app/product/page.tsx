'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingBag,
  Heart,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Award,
  Ticket,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getApiUrl } from '@/lib/api';

interface ProductSummary {
  id: string | number;
  variantId?: string;
  name: string;
  category: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  image: string;
  subimage?: string[];
  isNewArrival?: boolean;
  isCustomerFavorite?: boolean;
}

const PRICE_RANGES = [
  { label: 'Under ₹2,000', value: '0-2000' },
  { label: '₹2,000 - ₹5,000', value: '2000-5000' },
  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
  { label: 'Above ₹10,000', value: '10000-999999' },
];

const DEFAULT_FALLBACK_PRODUCTS: ProductSummary[] = [
  {
    id: 'prod-1',
    name: 'JudesCart Utility Wool Overshirt',
    category: 'Apparel',
    brand: 'JudesCart',
    image: '/prod_overshirt_1778670536589.png',
    isNewArrival: true,
    isCustomerFavorite: true,
    price: 4299,
    originalPrice: 5249,
  },
  {
    id: 'prod-2',
    name: 'Tailored Merino Blend Suit Jacket',
    category: 'Apparel',
    brand: 'JudesCart',
    image: '/cat_apparel_1778670103427.png',
    isCustomerFavorite: true,
    price: 14999,
    originalPrice: 18499,
  },
  {
    id: 'prod-3',
    name: 'Handcrafted Executive Leather Briefcase',
    category: 'Leather Goods',
    brand: 'JudesCart',
    image: '/cat_leather_1778670351299.png',
    isNewArrival: true,
    price: 8299,
    originalPrice: 9999,
  },
  {
    id: 'prod-4',
    name: 'Signature Leather Weekender & Duffle',
    category: 'Leather Goods',
    brand: 'JudesCart',
    image: '/about_craftsmanship.png',
    isCustomerFavorite: true,
    price: 11499,
    originalPrice: 13999,
  },
  {
    id: 'prod-5',
    name: 'Minimalist Minimalist Cardholder & Bifold',
    category: 'Accessories',
    brand: 'JudesCart',
    image: '/cat_accessories_1778670517925.png',
    isNewArrival: true,
    price: 2199,
    originalPrice: 2899,
  },
  {
    id: 'prod-6',
    name: 'Pleated Tailored Wool Trousers',
    category: 'Apparel',
    brand: 'JudesCart',
    image: '/prod_trouser_1778670553370.png',
    price: 3499,
    originalPrice: 4299,
  },
  {
    id: 'prod-7',
    name: 'Bespoke Atelier Double-Breasted Blazer',
    category: 'Apparel',
    brand: 'JudesCart',
    image: '/about_atelier.png',
    isCustomerFavorite: true,
    price: 16999,
    originalPrice: 19999,
  },
  {
    id: 'prod-8',
    name: 'Heritage Silk Pocket Square & Tie Set',
    category: 'Accessories',
    brand: 'JudesCart',
    image: '/cat_accessories_1778670517925.png',
    isNewArrival: true,
    price: 1899,
    originalPrice: 2499,
  },
];

function ProductPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // State: Catalog
  const [productsCatalog, setProductsCatalog] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Product Detail Selection State
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Classic');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCategoriesList(data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products function
  const fetchProducts = async (
    currentPage: number,
    categoryId: string | null,
    priceRanges: string[],
    search: string,
    isLoadMore: boolean
  ) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const apiUrl = getApiUrl();
    let queryUrl = `${apiUrl}/products?page=${currentPage}&limit=12`;
    if (categoryId) {
      queryUrl += `&categoryId=${categoryId}`;
    }
    if (priceRanges.length > 0) {
      queryUrl += `&priceRanges=${priceRanges.join(',')}`;
    }
    if (search.trim()) {
      queryUrl += `&search=${encodeURIComponent(search.trim())}`;
    }

    try {
      const response = await fetch(queryUrl);
      if (response.ok) {
        const resData = await response.json();
        if (resData && Array.isArray(resData.data)) {
          const mapped: ProductSummary[] = resData.data.map((p: any) => {
            const price = p.variants?.[0]?.price || 4999;
            return {
              id: p.id,
              variantId: p.variants?.[0]?.id,
              name: p.name,
              category: p.category?.name || 'Apparel',
              brand: p.brand?.name || 'JudesCart',
              price: price,
              originalPrice: p.variants?.[0]?.offerPrice || Math.round(price * 1.2),
              image: p.image || '/prod_overshirt_1778670536589.png',
              subimage: p.subimage || [],
              isNewArrival: p.isNewArrival,
              isCustomerFavorite: p.isCustomerFavorite,
            };
          });

          if (isLoadMore) {
            setProductsCatalog((prev) => [...prev, ...mapped]);
          } else {
            setProductsCatalog(mapped.length > 0 ? mapped : DEFAULT_FALLBACK_PRODUCTS);
          }
          setHasNextPage(resData.pagination?.hasNextPage || false);
        } else if (!isLoadMore) {
          setProductsCatalog(DEFAULT_FALLBACK_PRODUCTS);
        }
      } else if (!isLoadMore) {
        setProductsCatalog(DEFAULT_FALLBACK_PRODUCTS);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (!isLoadMore) {
        setProductsCatalog(DEFAULT_FALLBACK_PRODUCTS);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    setPage(1);
    fetchProducts(1, selectedCategoryId, selectedPriceRanges, activeSearchQuery, false);
  }, [selectedCategoryId, selectedPriceRanges, activeSearchQuery]);

  // Handle URL query parameters
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery && categoriesList.length > 0) {
      const match = categoriesList.find(
        (c) => c.name.toLowerCase() === categoryQuery.toLowerCase()
      );
      if (match) {
        setSelectedCategoryId(match.id);
      }
    }

    const searchQueryParam = searchParams.get('search');
    if (searchQueryParam !== null) {
      setSearchQuery(searchQueryParam);
      setActiveSearchQuery(searchQueryParam);
    }

    const idQuery = searchParams.get('id');
    if (idQuery) {
      setSelectedProduct({
        id: idQuery,
        name: 'Loading...',
        category: '',
        price: 0,
        image: '/prod_overshirt_1778670536589.png',
      });
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams, categoriesList]);

  // Fetch full details when a product is selected
  useEffect(() => {
    if (!selectedProduct) {
      setSelectedProductDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const res = await fetch(`${getApiUrl()}/products/${selectedProduct.id}`);
        if (res.ok) {
          const resData = await res.json();
          if (resData?.success && resData?.data) {
            const data = resData.data;
            setSelectedProductDetails(data);
            setActiveImage(data.image || null);

            const sizes = Array.from(
              new Set(
                data.variants?.flatMap((v: any) =>
                  v.options
                    ?.filter((opt: any) => opt.attribute?.name?.toLowerCase() === 'size')
                    ?.map((opt: any) => opt.attributeValue?.value)
                ).filter(Boolean)
              )
            ) as string[];

            const colors = Array.from(
              new Set(
                data.variants?.flatMap((v: any) =>
                  v.options
                    ?.filter((opt: any) => opt.attribute?.name?.toLowerCase() === 'color')
                    ?.map((opt: any) => opt.attributeValue?.value)
                ).filter(Boolean)
              )
            ) as string[];

            if (sizes.length > 0) setSelectedSize(sizes[0]);
            if (colors.length > 0) setSelectedColor(colors[0]);
            return;
          }
        }

        // Fallback Product Details
        const fallback = DEFAULT_FALLBACK_PRODUCTS.find((p) => p.id === selectedProduct.id) || DEFAULT_FALLBACK_PRODUCTS[0];
        setSelectedProductDetails({
          id: fallback.id,
          name: fallback.name,
          description: 'Meticulously tailored from premium grade materials with reinforced stitching, modern architectural proportions, and an elegant finish suitable for all occasions.',
          image: fallback.image,
          category: { name: fallback.category },
          brand: { name: fallback.brand || 'JudesCart' },
          variants: [
            {
              id: 'v-fallback-1',
              price: fallback.price,
              offerPrice: fallback.originalPrice,
              qty: 15,
              options: [
                { attribute: { name: 'Size' }, attributeValue: { value: 'S' } },
                { attribute: { name: 'Size' }, attributeValue: { value: 'M' } },
                { attribute: { name: 'Size' }, attributeValue: { value: 'L' } },
                { attribute: { name: 'Size' }, attributeValue: { value: 'XL' } },
                { attribute: { name: 'Color' }, attributeValue: { value: 'Classic Charcoal' } },
                { attribute: { name: 'Color' }, attributeValue: { value: 'Navy' } },
              ],
            },
          ],
        });
        setActiveImage(fallback.image);
        setSelectedSize('M');
        setSelectedColor('Classic Charcoal');
      } catch (err) {
        console.error('Error fetching product detail:', err);
        const fallback = DEFAULT_FALLBACK_PRODUCTS.find((p) => p.id === selectedProduct.id) || DEFAULT_FALLBACK_PRODUCTS[0];
        setSelectedProductDetails({
          id: fallback.id,
          name: fallback.name,
          description: 'Meticulously tailored from premium grade materials with reinforced stitching, modern architectural proportions, and an elegant finish suitable for all occasions.',
          image: fallback.image,
          category: { name: fallback.category },
          brand: { name: fallback.brand || 'JudesCart' },
          variants: [
            {
              id: 'v-fallback-1',
              price: fallback.price,
              offerPrice: fallback.originalPrice,
              qty: 15,
              options: [
                { attribute: { name: 'Size' }, attributeValue: { value: 'S' } },
                { attribute: { name: 'Size' }, attributeValue: { value: 'M' } },
                { attribute: { name: 'Size' }, attributeValue: { value: 'L' } },
                { attribute: { name: 'Size' }, attributeValue: { value: 'XL' } },
                { attribute: { name: 'Color' }, attributeValue: { value: 'Classic Charcoal' } },
                { attribute: { name: 'Color' }, attributeValue: { value: 'Navy' } },
              ],
            },
          ],
        });
        setActiveImage(fallback.image);
        setSelectedSize('M');
        setSelectedColor('Classic Charcoal');
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedProduct?.id]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, selectedCategoryId, selectedPriceRanges, activeSearchQuery, true);
  };

  const handleClearAll = () => {
    setSelectedCategoryId(null);
    setSelectedPriceRanges([]);
    setSearchQuery('');
    setActiveSearchQuery('');
    router.push('/product');
  };

  const handlePriceRangeToggle = (val: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(val) ? prev.filter((r) => r !== val) : [...prev, val]
    );
  };

  // Sort catalog
  const sortedProducts = useMemo(() => {
    const items = [...productsCatalog];
    if (sortBy === 'price-asc') return items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return items.sort((a, b) => b.price - a.price);
    return items;
  }, [productsCatalog, sortBy]);

  // Selected Variant Matching
  const currentVariant = useMemo(() => {
    if (!selectedProductDetails?.variants) return null;
    return (
      selectedProductDetails.variants.find((v: any) => {
        const matchesSize = v.options?.some(
          (opt: any) =>
            opt.attribute?.name?.toLowerCase() === 'size' &&
            opt.attributeValue?.value === selectedSize
        );
        const matchesColor = v.options?.some(
          (opt: any) =>
            opt.attribute?.name?.toLowerCase() === 'color' &&
            opt.attributeValue?.value === selectedColor
        );
        return matchesSize || matchesColor;
      }) || selectedProductDetails.variants[0]
    );
  }, [selectedProductDetails, selectedSize, selectedColor]);

  const activePrice = currentVariant?.price || selectedProductDetails?.variants?.[0]?.price || 4999;
  const activeOfferPrice = currentVariant?.offerPrice;

  const handleAddToCart = () => {
    if (!selectedProductDetails) return;
    addToCart({
      productId: selectedProductDetails.id,
      variantId: currentVariant?.id,
      title: selectedProductDetails.name,
      category: selectedProductDetails.category?.name || 'Apparel',
      price: activePrice,
      image: activeImage || selectedProductDetails.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });
    showToast(`Added ${selectedProductDetails.name} to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const isFavorited = selectedProductDetails
    ? isInWishlist(selectedProductDetails.id)
    : false;

  const handleWishlistToggle = () => {
    if (!selectedProductDetails) return;
    if (isFavorited) {
      removeFromWishlist(selectedProductDetails.id);
      showToast('Removed from wishlist');
    } else {
      addToWishlist({
        id: String(selectedProductDetails.id),
        productId: selectedProductDetails.id,
        variantId: currentVariant?.id,
        title: selectedProductDetails.name,
        category: selectedProductDetails.category?.name || 'Apparel',
        price: activePrice,
        image: activeImage || selectedProductDetails.image,
      });
      showToast('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SINGLE PRODUCT DETAIL VIEW (When a product is selected) */}
      {/* ========================================================================= */}
      {selectedProduct ? (
        <main className="flex-1 py-10 md:py-16">
          <div className="sj-container">
            {/* Breadcrumbs & Back button */}
            <div className="flex items-center justify-between pb-8 border-b border-slate-200/80 mb-10">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  router.push('/product');
                }}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-600 hover:text-[#DF9F28] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <Link href="/" className="hover:text-slate-900">Home</Link>
                <span>/</span>
                <Link href="/product" className="hover:text-slate-900">Catalog</Link>
                <span>/</span>
                <span className="text-slate-900 font-semibold truncate max-w-[200px]">
                  {selectedProductDetails?.name || 'Product'}
                </span>
              </div>
            </div>

            {loadingDetails || !selectedProductDetails ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
                <div className="lg:col-span-7 aspect-[4/5] bg-slate-200 rounded-2xl" />
                <div className="lg:col-span-5 space-y-6">
                  <div className="h-6 w-32 bg-slate-200 rounded" />
                  <div className="h-10 w-4/5 bg-slate-200 rounded" />
                  <div className="h-8 w-1/3 bg-slate-200 rounded" />
                  <div className="h-24 w-full bg-slate-200 rounded" />
                </div>
              </div>
            ) : (
              <div className="space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                  {/* Left Column: Image Gallery */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                      <Image
                        src={activeImage || selectedProductDetails.image || '/prod_overshirt_1778670536589.png'}
                        alt={selectedProductDetails.name}
                        fill
                        priority
                        className="object-cover object-center"
                      />

                      {/* Floating Wishlist on Detail View */}
                      <button
                        onClick={handleWishlistToggle}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:text-rose-600 shadow-md transition-all"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Thumbnail Selector Strip */}
                    {selectedProductDetails.subimage && selectedProductDetails.subimage.length > 0 && (
                      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                        <button
                          onClick={() => setActiveImage(selectedProductDetails.image)}
                          className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            activeImage === selectedProductDetails.image
                              ? 'border-[#DF9F28] ring-2 ring-amber-100'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <Image
                            src={selectedProductDetails.image}
                            alt="Primary"
                            fill
                            className="object-cover"
                          />
                        </button>
                        {selectedProductDetails.subimage.map((sub: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(sub)}
                            className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                              activeImage === sub
                                ? 'border-[#DF9F28] ring-2 ring-amber-100'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <Image src={sub} alt={`Sub image ${i}`} fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Purchasing & Specifications */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Brand & Category */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                        {selectedProductDetails.brand?.name || 'JUDESCART'}
                      </span>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-slate-900 tracking-tight leading-tight">
                        {selectedProductDetails.name}
                      </h1>
                    </div>

                    {/* Price & Savings Badge */}
                    <div className="flex items-baseline gap-3 pt-2">
                      <span className="text-3xl font-bold text-slate-900">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </span>
                      {activeOfferPrice && activeOfferPrice > activePrice && (
                        <>
                          <span className="text-base text-slate-400 line-through">
                            ₹{activeOfferPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold">
                            {Math.round(((activeOfferPrice - activePrice) / activeOfferPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-fit">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>In Stock — Ready For Immediate Dispatch</span>
                    </div>

                    {/* Short Description */}
                    {selectedProductDetails.description && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                        {selectedProductDetails.description}
                      </p>
                    )}

                    {/* Size Selector */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-900">
                        <span>Select Size</span>
                        <button
                          onClick={() => setActiveTab('specs')}
                          className="text-[#DF9F28] hover:underline lowercase font-normal"
                        >
                          size guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`min-w-[48px] h-10 px-3 rounded-lg text-xs font-bold tracking-wider uppercase border transition-all ${
                              selectedSize === sz
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                        Quantity
                      </label>
                      <div className="flex items-center w-36 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold text-base"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-xs font-bold text-slate-900 font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="space-y-3 pt-4">
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-3.5 px-6 bg-slate-900 hover:bg-[#DF9F28] hover:text-slate-950 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Shopping Cart</span>
                      </button>

                      <button
                        onClick={handleBuyNow}
                        className="w-full py-3.5 px-6 bg-[#DF9F28] hover:bg-[#C6891E] text-slate-950 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Buy Now — Instant Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Lucky Draw Incentive Card */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                      <Ticket className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 space-y-0.5">
                        <p className="font-bold">Lucky Draw Eligible Item</p>
                        <p className="text-amber-800">
                          Purchasing this product automatically generates an official ticket for our live weekly grand draw.
                        </p>
                      </div>
                    </div>

                    {/* Trust Guarantees */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#DF9F28] shrink-0" />
                        <span>Fast Tracked Dispatch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#DF9F28] shrink-0" />
                        <span>7-Day Size Exchanges</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#DF9F28] shrink-0" />
                        <span>100% Genuine JudesCart</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#DF9F28] shrink-0" />
                        <span>Bespoke Quality Standard</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabbed Product Details */}
                <div className="pt-10 border-t border-slate-200">
                  <div className="flex items-center gap-8 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'description', label: 'Description & Fit' },
                      { id: 'specs', label: 'Material & Care' },
                      { id: 'shipping', label: 'Shipping & Returns' },
                      { id: 'reviews', label: 'Client Reviews (12)' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`text-xs font-bold tracking-wider uppercase pb-2 transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'text-[#DF9F28] border-b-2 border-[#DF9F28]'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="py-8 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {activeTab === 'description' && (
                      <div className="space-y-4">
                        <p>
                          Engineered for the modern wardrobe, this garment combines heritage drafting techniques with premium organic textiles. Designed to drape naturally across the shoulders with clean lines and superior comfort.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          <li>Tailored silhouette with reinforced stitch finishing</li>
                          <li>Natural breathable fibre weave for all-season versatility</li>
                          <li>Signature JudesCart custom hardware accents</li>
                        </ul>
                      </div>
                    )}

                    {activeTab === 'specs' && (
                      <div className="space-y-4">
                        <p className="font-semibold text-slate-900">Fabric Composition & Care:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>100% Premium Pure Sourced Cotton / Cashmere blend</li>
                          <li>Dry clean recommended or gentle cold machine wash</li>
                          <li>Warm iron on reverse side</li>
                          <li>Do not tumble dry or bleach</li>
                        </ul>
                      </div>
                    )}

                    {activeTab === 'shipping' && (
                      <div className="space-y-4">
                        <p>
                          All orders are processed and dispatched within 24-48 business hours. Tracked delivery confirmation is sent via SMS and Email.
                        </p>
                        <p>
                          Hassle-free 7-day exchanges for sizing and fit. If you need any assistance, our dedicated concierge team is available 24/7.
                        </p>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-slate-900">4.9 out of 5.0</span>
                          <span className="text-xs text-slate-400">(Based on 12 verified purchases)</span>
                        </div>
                        <p className="text-xs text-slate-500 italic">
                          "Exceptional tailoring and material feel. Fits true to size and looks even better in person." — Arjun V.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        /* ========================================================================= */
        /* 2. CATALOG LISTING VIEW (Default view when browsing /product) */
        /* ========================================================================= */
        <main className="flex-1 py-10 md:py-16">
          <div className="sj-container space-y-8">
            
            {/* Catalog Page Header & Search Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-[0.2em] text-[#DF9F28] uppercase">
                  JUDESCART CATALOG
                </span>
                <h1 className="text-3xl sm:text-4xl font-sans font-extrabold text-slate-900 tracking-tight">
                  All Collections & Apparel
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Showing {sortedProducts.length} curated products
                </p>
              </div>

              {/* Active Search / Filter Pill */}
              {activeSearchQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold">
                  <span>Search: &quot;{activeSearchQuery}&quot;</span>
                  <button onClick={() => { setSearchQuery(''); setActiveSearchQuery(''); router.push('/product'); }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Catalog Toolbar */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-800"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {(selectedCategoryId || selectedPriceRanges.length > 0) && (
                  <span className="w-2 h-2 rounded-full bg-[#DF9F28]" />
                )}
              </button>

              <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Filter by Category & Price using the sidebar</span>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#DF9F28]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Main Catalog Layout (Sidebar + Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Filter Sidebar (Desktop) */}
              <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs sticky top-28">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-slate-900">
                    Filters
                  </h3>
                  {(selectedCategoryId || selectedPriceRanges.length > 0 || activeSearchQuery) && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-[#DF9F28] hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Categories Filter */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategoryId(null)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedCategoryId === null
                          ? 'bg-amber-50 text-[#DF9F28] font-bold border-l-2 border-[#DF9F28]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors uppercase ${
                          selectedCategoryId === cat.id
                            ? 'bg-amber-50 text-[#DF9F28] font-bold border-l-2 border-[#DF9F28]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Price Range
                  </h4>
                  <div className="space-y-1.5">
                    {PRICE_RANGES.map((r) => {
                      const active = selectedPriceRanges.includes(r.value);
                      return (
                        <label
                          key={r.value}
                          onClick={() => handlePriceRangeToggle(r.value)}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none py-1"
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            readOnly
                            className="rounded text-[#DF9F28] focus:ring-[#DF9F28] accent-[#DF9F28] border-slate-300"
                          />
                          <span>{r.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Right Product Grid */}
              <div className="lg:col-span-9 space-y-8">
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="aspect-[3/4] bg-white rounded-xl border border-slate-200 animate-pulse" />
                    ))}
                  </div>
                ) : sortedProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-sans">No products found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      We couldn&apos;t find any items matching your active filter criteria. Try resetting filters or adjusting search terms.
                    </p>
                    <button
                      onClick={handleClearAll}
                      className="px-6 py-2.5 bg-[#DF9F28] hover:bg-[#C6891E] text-slate-950 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {sortedProducts.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          id={prod.id}
                          variantId={prod.variantId}
                          name={prod.name}
                          category={prod.category}
                          brand={prod.brand}
                          price={prod.price}
                          originalPrice={prod.originalPrice}
                          image={prod.image}
                          subimage={prod.subimage}
                          isNewArrival={prod.isNewArrival}
                          isCustomerFavorite={prod.isCustomerFavorite}
                        />
                      ))}
                    </div>

                    {/* Load More Pagination */}
                    {hasNextPage && (
                      <div className="text-center pt-8">
                        <button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="px-8 py-3 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-300 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-xs"
                        >
                          {loadingMore ? 'Loading Items...' : 'Load More Products'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900">
                  Filter Catalog
                </h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategoryId(null); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                      selectedCategoryId === null ? 'bg-amber-50 text-[#DF9F28] font-bold border-l-2 border-[#DF9F28]' : 'text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategoryId(cat.id); setIsMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase ${
                        selectedCategoryId === cat.id ? 'bg-amber-50 text-[#DF9F28] font-bold border-l-2 border-[#DF9F28]' : 'text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price Range</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((r) => {
                    const active = selectedPriceRanges.includes(r.value);
                    return (
                      <label
                        key={r.value}
                        onClick={() => handlePriceRangeToggle(r.value)}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer"
                      >
                        <input type="checkbox" checked={active} readOnly className="rounded text-[#DF9F28] accent-[#DF9F28]" />
                        <span>{r.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#DF9F28] hover:bg-[#C6891E] text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
              <button
                onClick={() => { handleClearAll(); setIsMobileFilterOpen(false); }}
                className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#DF9F28] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
}

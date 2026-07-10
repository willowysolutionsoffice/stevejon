'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { ArrowRight, Trophy, Zap, X, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Check, ShoppingBag, Heart, Search } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getApiUrl } from '@/lib/api';

interface Product {
  id: string | number;
  variantId?: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
}

function ProductPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToCart({
      productId: prod.id,
      variantId: prod.variantId,
      title: prod.title,
      category: prod.category,
      price: prod.price,
      image: prod.image,
      size: 'M',
      color: 'Classic',
      quantity: 1,
    });
    showToast(`Added ${prod.title} to cart`);
  };

  const handleQuickAddToWishlist = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    addToWishlist({
      id: String(prod.id),
      productId: prod.id,
      variantId: prod.variantId,
      title: prod.title,
      category: prod.category,
      price: prod.price,
      image: prod.image,
    });
    showToast(`Added ${prod.title} to wishlist`);
  };

  const [productsCatalog, setProductsCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' | 'sku' | 'category'
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeSearchType, setActiveSearchType] = useState('name');

  // Product Detail Inner Page State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Classic');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const apiUrl = getApiUrl();
      try {
        const response = await fetch(`${apiUrl}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCategoriesList(data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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
    sType: string,
    isLoadMore: boolean
  ) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const apiUrl = getApiUrl();
    let queryUrl = `${apiUrl}/products?page=${currentPage}&limit=9`;
    if (categoryId) {
      queryUrl += `&categoryId=${categoryId}`;
    }
    if (priceRanges.length > 0) {
      queryUrl += `&priceRanges=${priceRanges.join(',')}`;
    }
    if (search.trim()) {
      queryUrl += `&search=${encodeURIComponent(search.trim())}&searchType=${sType}`;
    }

    try {
      const response = await fetch(queryUrl);
      if (response.ok) {
        const resData = await response.json();
        if (resData && Array.isArray(resData.data)) {
          const mapped = resData.data.map((p: any) => {
            const price = p.variants?.[0]?.price || 5400;
            return {
              id: p.id,
              variantId: p.variants?.[0]?.id,
              title: p.name,
              category: p.category?.name || "Apparel",
              price: price,
              originalPrice: p.variants?.[0]?.offerPrice || Math.round(price * 1.2),
              image: p.image || "/prod_overshirt_1778670536589.png"
            };
          });

          if (isLoadMore) {
            setProductsCatalog(prev => [...prev, ...mapped]);
          } else {
            setProductsCatalog(mapped);
          }
          setHasNextPage(resData.pagination?.hasNextPage || false);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger fetch on filter/search change (always resets to page 1)
  useEffect(() => {
    setPage(1);
    fetchProducts(1, selectedCategoryId, selectedPriceRanges, activeSearchQuery, activeSearchType, false);
  }, [selectedCategoryId, selectedPriceRanges, activeSearchQuery, activeSearchType]);

  // Handle URL parameters once categories and catalog load
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery && categoriesList.length > 0) {
      const match = categoriesList.find(c => c.name.toLowerCase() === categoryQuery.toLowerCase());
      if (match) {
        setSelectedCategoryId(match.id);
      }
    }

    const idQuery = searchParams.get('id');
    if (idQuery && productsCatalog.length > 0) {
      const prod = productsCatalog.find(p => String(p.id) === String(idQuery));
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, [searchParams, categoriesList, productsCatalog]);

  // Handle URL search parameters on mount or when searchParams change
  useEffect(() => {
    const searchQueryParam = searchParams.get('search');
    if (searchQueryParam !== null) {
      setSearchQuery(searchQueryParam);
      setActiveSearchQuery(searchQueryParam);
      const searchTypeParam = searchParams.get('searchType') || 'name';
      setSearchType(searchTypeParam);
      setActiveSearchType(searchTypeParam);
    }
  }, [searchParams]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, selectedCategoryId, selectedPriceRanges, activeSearchQuery, activeSearchType, true);
  };

  const handleClearAll = () => {
    setSelectedCategoryId(null);
    setSelectedPriceRanges([]);
    setSearchQuery('');
    setSearchType('name');
    setActiveSearchQuery('');
    setActiveSearchType('name');
  };

  // Filtered products list is simply the productsCatalog since the API handles filtering
  const filteredProducts = productsCatalog;

  const [selectedProductDetails, setSelectedProductDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch product details on selection
  useEffect(() => {
    if (!selectedProduct) {
      setSelectedProductDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoadingDetails(true);
      const apiUrl = getApiUrl();
      try {
        const response = await fetch(`${apiUrl}/products/${selectedProduct.id}`);
        if (response.ok) {
          const resData = await response.json();
          if (resData && resData.success && resData.data) {
            const data = resData.data;
            setSelectedProductDetails(data);
            
            // Extract unique sizes and colors to set defaults
            const sizes = Array.from(new Set(
              data.variants?.flatMap((v: any) =>
                v.options
                  ?.filter((opt: any) => opt.attribute?.name?.toLowerCase() === 'size')
                  ?.map((opt: any) => opt.attributeValue?.value)
              ).filter(Boolean)
            )) as string[];

            const colors = Array.from(new Set(
              data.variants?.flatMap((v: any) =>
                v.options
                  ?.filter((opt: any) => opt.attribute?.name?.toLowerCase() === 'color')
                  ?.map((opt: any) => opt.attributeValue?.value)
              ).filter(Boolean)
            )) as string[];

            if (sizes.length > 0) setSelectedSize(sizes[0]);
            if (colors.length > 0) setSelectedColor(colors[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    let finalPrice = selectedProduct.price;
    let currentVariant: any = null;
    
    if (selectedProductDetails && selectedProductDetails.variants) {
      currentVariant = selectedProductDetails.variants.find((v: any) => {
        const hasSize = v.options?.some((opt: any) => opt.attribute?.name?.toLowerCase() === 'size' && opt.attributeValue?.value === selectedSize);
        const hasColor = v.options?.some((opt: any) => opt.attribute?.name?.toLowerCase() === 'color' && opt.attributeValue?.value === selectedColor);
        
        const sizesInVariantList = selectedProductDetails.variants.some((v2: any) => v2.options?.some((o: any) => o.attribute?.name?.toLowerCase() === 'size'));
        const colorsInVariantList = selectedProductDetails.variants.some((v2: any) => v2.options?.some((o: any) => o.attribute?.name?.toLowerCase() === 'color'));
        
        return (!sizesInVariantList || hasSize) && (!colorsInVariantList || hasColor);
      }) || selectedProductDetails.variants[0];

      if (currentVariant) {
        finalPrice = currentVariant.price;
        if (currentVariant.qty === 0) {
          showToast("Sorry, this variant is out of stock.");
          return;
        }
        if (quantity > currentVariant.qty) {
          showToast(`Only ${currentVariant.qty} items left in stock.`);
          return;
        }
      }
    }

    addToCart({
      productId: selectedProduct.id,
      variantId: currentVariant?.id,
      title: selectedProduct.title,
      category: selectedProduct.category,
      price: finalPrice,
      image: selectedProductDetails?.image || selectedProduct.image,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    router.push('/cart');
  };

  // If a product is selected, render the stunning Product Detail Inner Page
  if (selectedProduct) {
    const defaultReviews = [
      {
        name: "Alex Mathio",
        date: "13 Oct 2024",
        rating: 5,
        comment: "Stevejon's dedication to quality materials and ethical tailoring practices resonates strongly. The structural drape and shoulder fit are the absolute best I have ever experienced. A truly responsible and high-end fashion choice.",
        avatar: "/winner_man.jpg"
      },
      {
        name: "Sofia Laurent",
        date: "22 Nov 2025",
        rating: 5,
        comment: "The quality of the fabric and the fit is simply second to none. Stevejon's attention to detail, from custom horn buttons to the hand-rolled lapels, makes this my absolute favorite wardrobe piece.",
        avatar: "/winner_woman.jpg"
      },
      {
        name: "Julian Vance",
        date: "05 Jan 2026",
        rating: 5,
        comment: "Outstanding bespoke tailoring. The drape is immaculate, and the customer service was truly world-class. Absolute perfection in every stitch. Worth every single penny.",
        avatar: "/winner_man.jpg"
      }
    ];

    const reviewsDatabase: Record<number, typeof defaultReviews> = {
      1: [
        {
          name: "Alex Mathio",
          date: "13 Oct 2024",
          rating: 5,
          comment: "This Overshirt is the ultimate layering piece. The fabric is sturdy yet soft, and the fit across the shoulders is exceptionally precise. Easily a staple in my everyday wardrobe.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Sofia Laurent",
          date: "22 Nov 2025",
          rating: 5,
          comment: "Beautiful drape and weight. You can instantly feel the quality of the premium Italian weave. The classic shade pairs perfectly with almost everything in my casual collection.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Julian Vance",
          date: "05 Jan 2026",
          rating: 5,
          comment: "Impeccable craftsmanship. The hand-finished seams and custom horn buttons elevate this far above standard retail overshirts. Extremely recommended.",
          avatar: "/winner_man.jpg"
        }
      ],
      2: [
        {
          name: "Marcus Vance",
          date: "18 Feb 2025",
          rating: 5,
          comment: "An absolute travel masterpiece. The full-grain leather is robust and has already started developing a beautiful rich patina. The brass hardware is top-tier.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Helena Rostova",
          date: "04 Apr 2025",
          rating: 5,
          comment: "Generously sized yet fits perfectly in overhead compartments. The stitching is completely flawless and the interior lining feels exceptionally luxurious.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "David Chen",
          date: "11 Jul 2025",
          rating: 5,
          comment: "I get compliments every single time I travel with this bag. The shoulder strap is extremely comfortable even when fully loaded. Truly built to last a lifetime.",
          avatar: "/winner_man.jpg"
        }
      ],
      3: [
        {
          name: "Siddharth Sen",
          date: "03 Jan 2025",
          rating: 5,
          comment: "An exquisite, sophisticated scent profile. The transition from spicy cardamom to deep cedarwood is beautiful. It lasts over 8 hours on skin without being overpowering.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Clara Dupont",
          date: "19 Mar 2025",
          rating: 5,
          comment: "Unique, mysterious, and incredibly elegant. I’ve found my new signature scent. The heavy glass bottle and magnetic cap feel extremely premium on my vanity.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Liam Sterling",
          date: "28 Aug 2025",
          rating: 5,
          comment: "Receive endless compliments wearing this. It projects a refined, subtle aura of confidence. A masterpiece of high-end perfumery.",
          avatar: "/winner_man.jpg"
        }
      ],
      4: [
        {
          name: "Vittorio Rossi",
          date: "09 Nov 2024",
          rating: 5,
          comment: "The silhouette of this double-breasted coat is absolutely regal. It drapes beautifully, keeping its form while moving. The Italian virgin wool is incredibly warm and soft.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Isabella Vane",
          date: "15 Dec 2024",
          rating: 5,
          comment: "Exquisite tailoring. The broad lapels and structured shoulders project power and elegance. Stevejon has outdone themselves with this piece.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Arthur Pendelton",
          date: "22 Jan 2025",
          rating: 5,
          comment: "Fits like a glove. The hand-sewn lining is silky smooth, and the warmth-to-weight ratio is perfect. Essential for any gentleman's winter wardrobe.",
          avatar: "/winner_man.jpg"
        }
      ],
      5: [
        {
          name: "Oliver Twist",
          date: "14 May 2025",
          rating: 5,
          comment: "The absolute perfect trouser. The rise, the drape, and the cuff line are flawlessly tailored. It coordinates effortlessly with bespoke blazers.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Emilia Clarke",
          date: "29 Jun 2025",
          rating: 5,
          comment: "Outstanding wool-crepe comfort. It flows elegantly and retains its crease even after long hours of travel. Truly a masterpiece of functional luxury.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Dev Patel",
          date: "08 Sep 2025",
          rating: 5,
          comment: "Tailoring at its finest. The waist adjustment side tabs are sleek and functional. The stitch finish is exceptionally clean.",
          avatar: "/winner_man.jpg"
        }
      ],
      6: [
        {
          name: "Christian Bale",
          date: "10 Dec 2024",
          rating: 5,
          comment: "A briefcase that commands respect in every boardroom. The structured leather holds its form flawlessly, and the organizer sections are perfectly engineered for modern tech.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Diana Prince",
          date: "14 Feb 2025",
          rating: 5,
          comment: "Immaculate leather grain and flawless finish. The lock mechanism feels crisp and secure. A beautiful marriage of security, heritage, and style.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Harvey Specter",
          date: "03 May 2025",
          rating: 5,
          comment: "The absolute pinnacle of professional carry. It projects extreme refinement and attention to detail. Indispensable.",
          avatar: "/winner_man.jpg"
        }
      ],
      7: [
        {
          name: "Tom Ford",
          date: "01 Jun 2025",
          rating: 5,
          comment: "The silk quality is sublime. The hand-rolled edges are completely even, giving it the perfect posture when folded in a suit pocket.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Gemma Chan",
          date: "22 Jul 2025",
          rating: 5,
          comment: "Lustrous colors and beautiful patterns. It adds the perfect touch of sophisticated flair to both tuxedos and casual blazers.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Henry Cavill",
          date: "14 Oct 2025",
          rating: 5,
          comment: "A tiny detail that speaks volumes. The silk has the perfect dry-slip texture that prevents it from sliding down the pocket. Absolute class.",
          avatar: "/winner_man.jpg"
        }
      ],
      8: [
        {
          name: "Keanu Reeves",
          date: "23 Apr 2025",
          rating: 5,
          comment: "Incredibly durable and surprisingly stylish. The utility pockets are streamlined so they don't bulk out the silhouette. Best casual trousers I own.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Zendaya",
          date: "09 Aug 2025",
          rating: 5,
          comment: "Perfect relaxed luxury aesthetic. The gabardine cotton is extremely breathable and comfortable for all-day wear. Highly recommend.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Chris Evans",
          date: "11 Nov 2025",
          rating: 5,
          comment: "Robust, functional, and handsomely tailored. Stevejon proves that casual wear can be built with the exact same high standards as evening wear.",
          avatar: "/winner_man.jpg"
        }
      ],
      9: [
        {
          name: "Daniel Craig",
          date: "12 Oct 2025",
          rating: 5,
          comment: "The calfskin leather is incredibly supple, and the polished silver buckle is beautifully minimal. Holds up perfectly without stretching.",
          avatar: "/winner_man.jpg"
        },
        {
          name: "Cate Blanchett",
          date: "29 Nov 2025",
          rating: 5,
          comment: "Beautiful hand-painted edges and robust stitching. It's the ideal finishing piece that binds any formal or smart-casual outfit together.",
          avatar: "/winner_woman.jpg"
        },
        {
          name: "Benedict Cumberbatch",
          date: "08 Jan 2026",
          rating: 5,
          comment: "A timeless belt of absolute distinction. Simple, durable, and crafted from top-grade leather. Fits perfectly in the waist loops.",
          avatar: "/winner_man.jpg"
        }
      ]
    };

    const reviews = (reviewsDatabase as any)[selectedProduct.id] || defaultReviews;

    // Resolve dynamic images and gallery
    const mainImage = selectedProductDetails?.image || selectedProduct.image;
    const thumbnails = selectedProductDetails?.subimage?.length > 0 
      ? [mainImage, ...selectedProductDetails.subimage]
      : [mainImage, mainImage, mainImage];

    const displayImage = activeImage || mainImage;

    // Extract unique colors and sizes from variants
    const dynamicSizes = Array.from(new Set(
      selectedProductDetails?.variants?.flatMap((v: any) =>
        v.options
          ?.filter((opt: any) => opt.attribute?.name?.toLowerCase() === 'size')
          ?.map((opt: any) => opt.attributeValue?.value)
      ).filter(Boolean)
    )) as string[];

    const dynamicColors = Array.from(new Set(
      selectedProductDetails?.variants?.flatMap((v: any) =>
        v.options
          ?.filter((opt: any) => opt.attribute?.name?.toLowerCase() === 'color')
          ?.map((opt: any) => opt.attributeValue?.value)
      ).filter(Boolean)
    )) as string[];

    // Fallbacks
    const finalSizes = dynamicSizes.length > 0 ? dynamicSizes : (selectedProduct.category === 'Apparel' ? ['S', 'M', 'L', 'XL'] : []);
    const finalColors = dynamicColors.length > 0 ? dynamicColors : [];

    // Find selected variant for price updates
    const currentVariant = selectedProductDetails?.variants?.find((v: any) => {
      const hasSize = v.options?.some((opt: any) => opt.attribute?.name?.toLowerCase() === 'size' && opt.attributeValue?.value === selectedSize);
      const hasColor = v.options?.some((opt: any) => opt.attribute?.name?.toLowerCase() === 'color' && opt.attributeValue?.value === selectedColor);
      
      const sizesInVariantList = selectedProductDetails.variants.some((v2: any) => v2.options?.some((o: any) => o.attribute?.name?.toLowerCase() === 'size'));
      const colorsInVariantList = selectedProductDetails.variants.some((v2: any) => v2.options?.some((o: any) => o.attribute?.name?.toLowerCase() === 'color'));
      
      return (!sizesInVariantList || hasSize) && (!colorsInVariantList || hasColor);
    }) || selectedProductDetails?.variants?.[0];

    const displayPrice = currentVariant ? currentVariant.price : selectedProduct.price;
    const displayOriginalPrice = currentVariant ? (currentVariant.offerPrice || Math.round(currentVariant.price * 1.2)) : selectedProduct.originalPrice;

    const getColorBg = (colName: string) => {
      const name = colName.toLowerCase();
      if (name.includes('red')) return 'bg-red-600';
      if (name.includes('blue')) return 'bg-blue-600';
      if (name.includes('green')) return 'bg-green-600';
      if (name.includes('black')) return 'bg-black';
      if (name.includes('white')) return 'bg-white border border-gray-300';
      if (name.includes('grey') || name.includes('gray')) return 'bg-gray-500';
      if (name.includes('yellow')) return 'bg-yellow-500';
      if (name.includes('tan') || name.includes('brown')) return 'bg-amber-800';
      if (name.includes('navy')) return 'bg-blue-950';
      return 'bg-gradient-to-br from-gray-400 to-gray-600';
    };

    return (
      <div className="min-h-screen bg-[#F5FAFF] text-[#061B3A] font-sans animate-fadeIn">
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
              <div className="relative aspect-[4/5] rounded-[2.5rem] bg-[#E7F2FF] border border-gray-100 overflow-hidden shadow-sm group">
                <Image
                  src={displayImage}
                  alt={selectedProduct.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105 p-8 md:p-12"
                  priority
                />
                <div className="absolute top-6 left-6 bg-[#0077FF] text-white text-[0.65rem] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full shadow-md">
                  Stevejon Exclusive
                </div>
              </div>

              {/* Thumbnail preview row */}
              <div className="grid grid-cols-3 gap-4">
                {thumbnails.map((img, idx) => {
                  const isSelected = activeImage ? (activeImage === img) : (idx === 0);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square rounded-2xl bg-[#E7F2FF] border-2 overflow-hidden cursor-pointer transition-all hover:opacity-100 ${isSelected ? 'border-[#0077FF] opacity-100 shadow-sm' : 'border-transparent opacity-60'}`}
                    >
                      <Image src={img} alt="" fill className="object-cover mix-blend-multiply p-4" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Product Info & Actions (6 cols) */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#0077FF]">
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
              <div className="flex flex-col gap-3 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl md:text-4xl font-bold text-black font-sans">
                    ₹ {displayPrice.toLocaleString()}
                  </span>
                  <span className="text-lg md:text-xl line-through text-gray-400 font-normal">
                    ₹ {displayOriginalPrice.toLocaleString()}
                  </span>
                  {displayOriginalPrice > displayPrice && (
                    <span className="text-xs font-bold tracking-widest uppercase bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Save ₹ {(displayOriginalPrice - displayPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Stock Status Indicator */}
                {selectedProductDetails && (
                  <div className="flex items-center gap-2 mt-1 select-none">
                    <div className={`w-2 h-2 rounded-full ${currentVariant && currentVariant.qty > 0 ? (currentVariant.qty <= 5 ? 'bg-amber-500 animate-pulse' : 'bg-green-500') : 'bg-red-500'}`} />
                    <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${currentVariant && currentVariant.qty > 0 ? (currentVariant.qty <= 5 ? 'text-amber-600' : 'text-green-600') : 'text-red-500'}`}>
                      {currentVariant && currentVariant.qty > 0 
                        ? (currentVariant.qty <= 5 ? `Only ${currentVariant.qty} left in stock - order soon!` : 'In Stock')
                        : 'Out of Stock'}
                    </span>
                  </div>
                )}
              </div>

              {/* Description snippet */}
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 font-sans">
                {selectedProductDetails?.description || `Experience unparalleled luxury and craftsmanship with the ${selectedProduct.title}. Designed for the modern connoisseur, this masterpiece combines timeless elegance with uncompromising utility, tailored from the finest bespoke materials.`}
              </p>

              {/* Color Selection */}
              {finalColors.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-700">Color: <span className="text-black font-semibold">{selectedColor}</span></span>
                  </div>
                  <div className="flex gap-3">
                    {finalColors.map(colorName => (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`w-9 h-9 rounded-full ${getColorBg(colorName)} border-2 transition-all cursor-pointer flex items-center justify-center ${selectedColor === colorName ? 'border-[#0077FF] scale-110 shadow-md ring-2 ring-[#0077FF]/20' : 'border-gray-200 hover:scale-105'}`}
                        title={colorName}
                      >
                        {selectedColor === colorName && <Check className={`w-4 h-4 ${colorName.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {finalSizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-700">Size: <span className="text-black font-semibold">{selectedSize}</span></span>
                    <button className="text-xs font-semibold underline tracking-wider text-gray-500 hover:text-black cursor-pointer">Size Guide</button>
                  </div>
                  <div className="flex gap-3">
                    {finalSizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl border text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center ${selectedSize === size ? 'border-[#0077FF] bg-[#0077FF] text-white shadow-lg shadow-[#0077FF]/20' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400'}`}
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
                    onClick={() => setQuantity(q => {
                      if (currentVariant && q >= currentVariant.qty) {
                        showToast(`Only ${currentVariant.qty} items left in stock.`);
                        return q;
                      }
                      return q + 1;
                    })}
                    disabled={currentVariant && quantity >= currentVariant.qty}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed font-bold text-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart} 
                  disabled={currentVariant && currentVariant.qty === 0}
                  className="flex-1 bg-[#0077FF] hover:bg-[#005ED1] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white px-8 py-4 rounded-full flex items-center justify-center gap-3 transition-all text-xs font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#0077FF]/20 hover:shadow-2xl hover:shadow-[#0077FF]/30 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  {currentVariant && currentVariant.qty === 0 ? 'Out of Stock' : 'Add To Cart'}
                </button>
              </div>

              {/* Buy Now Button */}
              <button 
                onClick={handleAddToCart} 
                disabled={currentVariant && currentVariant.qty === 0}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all text-xs font-bold tracking-[0.2em] uppercase mb-12 shadow-lg cursor-pointer"
              >
                {currentVariant && currentVariant.qty === 0 ? 'Out of Stock' : 'Buy It Now'}
              </button>

              {/* Premium Guarantees Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-t border-b border-gray-100 mb-12 bg-gray-50/50 rounded-3xl p-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-[#0077FF]" />
                  <h4 className="text-xs font-bold tracking-wider uppercase text-black">Express Delivery</h4>
                  <p className="text-[0.7rem] text-gray-500 leading-relaxed">Complimentary insured shipping worldwide.</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#0077FF]" />
                  <h4 className="text-xs font-bold tracking-wider uppercase text-black">2-Year Warranty</h4>
                  <p className="text-[0.7rem] text-gray-500 leading-relaxed">Official Stevejon atelier guarantee.</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RefreshCw className="w-6 h-6 text-[#0077FF]" />
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
                      className={`flex-1 py-4 text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer border-b-2 ${activeTab === tab.id ? 'border-[#0077FF] text-black bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
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

          {/* Rating & Reviews Section */}
          <div className="mt-32 pt-16 border-t border-gray-100 font-sans">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-16 text-left">Rating & Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Big Average & Breakdown Bar (5 cols) */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-10 lg:gap-8 items-start sm:items-center lg:items-start justify-between w-full">
                <div className="flex flex-col items-start">
                  <div className="flex items-baseline gap-1">
                    <span className="text-8xl font-bold tracking-tight text-gray-950">4,5</span>
                    <span className="text-2xl text-gray-400 font-medium">/5</span>
                  </div>
                  <p className="text-sm text-gray-400 font-normal tracking-wide mt-2">(50 New Reviews)</p>
                </div>
                
                <div className="w-full max-w-xs">
                  <div className="flex flex-col gap-3.5">
                    {[
                      { stars: 5, percentage: 'w-[75%]' },
                      { stars: 4, percentage: 'w-[15%]' },
                      { stars: 3, percentage: 'w-[5%]' },
                      { stars: 2, percentage: 'w-0' },
                      { stars: 1, percentage: 'w-0' }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex items-center gap-4 w-full">
                        <div className="flex items-center gap-1.5 w-10 text-left text-yellow-500">
                          <Star className="w-4 h-4 fill-current stroke-none" />
                          <span className="text-xs font-semibold text-gray-700 font-sans">{bar.stars}</span>
                        </div>
                        <div className="flex-1 h-[3px] bg-gray-100/80 rounded-full overflow-hidden">
                          <div className={`h-full bg-gray-950 rounded-full ${bar.percentage}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Review Card Slider (7 cols) */}
              <div className="lg:col-span-7 w-full relative pr-6">
                
                {/* Main Card Container */}
                <div className="bg-[#FCFCFC] rounded-[2rem] border border-gray-100/80 p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.015)] transition-all duration-300 min-h-[300px] flex flex-col justify-between relative">
                  
                  <div className="text-left">
                    {/* Header: Name, Stars and Date */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 font-sans tracking-wide">
                          {reviews[activeReviewIdx].name}
                        </h4>
                        <div className="flex text-yellow-500 mt-2 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < reviews[activeReviewIdx].rating ? 'fill-current stroke-none' : 'text-gray-200 stroke-[1.5]'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium font-sans">
                        {reviews[activeReviewIdx].date}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-500 text-sm md:text-base font-normal leading-relaxed font-sans mb-10 max-w-xl">
                      "{reviews[activeReviewIdx].comment}"
                    </p>
                  </div>

                  {/* Footer Row: Avatar and custom sliding scrollbar pagination */}
                  <div className="flex items-center justify-between border-t border-gray-100/50 pt-6 mt-4">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                      <Image 
                        src={reviews[activeReviewIdx].avatar} 
                        alt={reviews[activeReviewIdx].name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Dribbble Style Horizontal Scrollbar Indicator */}
                    <div className="w-28 h-[3px] bg-gray-200/60 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-gray-950 rounded-full transition-all duration-500 ease-out absolute"
                        style={{ 
                          width: `${100 / reviews.length}%`, 
                          left: `${(100 / reviews.length) * activeReviewIdx}%` 
                        }}
                      />
                    </div>
                  </div>

                </div>

                {/* Overlapping Next Button positioned on the right border */}
                <button
                  onClick={() => setActiveReviewIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 rounded-full border border-gray-200/80 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center hover:bg-gray-950 hover:text-white hover:border-gray-950 transition-all duration-300 cursor-pointer focus:outline-none group"
                  aria-label="Next Review"
                >
                  <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-transform group-hover:translate-x-0.5 stroke-[2]" />
                </button>

              </div>

            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-32 pt-16 border-t border-gray-100">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-serif tracking-widest uppercase text-black mb-4">You May Also Like</h2>
              <div className="w-16 h-[1px] bg-[#0077FF] mx-auto"></div>
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
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#E7F2FF] mb-4">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105 p-4"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-[#0077FF]">{prod.category}</span>
                    <h3 className="text-sm font-semibold tracking-wide text-gray-900 mt-1 group-hover:text-[#0077FF] transition-colors">{prod.title}</h3>
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
    <div className="min-h-screen bg-[#F5FAFF] text-[#061B3A] font-sans">
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
                  {categoriesList.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 text-xs tracking-wider font-medium text-gray-700 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategoryId === cat.id}
                        onChange={() => {
                          setSelectedCategoryId(prev => prev === cat.id ? null : cat.id);
                        }}
                        className="w-4 h-4 rounded border-gray-200 text-[#0077FF] focus:ring-[#0077FF] accent-[#0077FF]"
                      />
                      <span className="group-hover:text-black transition-colors">{cat.name}</span>
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
                  {[
                    { key: 'under_5000', label: 'Under ₹5000' },
                    { key: '5000_10000', label: '₹5000 - ₹10000' },
                    { key: 'over_10000', label: 'Over ₹10000' }
                  ].map(priceRange => (
                    <label key={priceRange.key} className="flex items-center gap-3 text-xs tracking-wider font-medium text-gray-700 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(priceRange.key)}
                        onChange={() => {
                          setSelectedPriceRanges(prev => 
                            prev.includes(priceRange.key)
                              ? prev.filter(p => p !== priceRange.key)
                              : [...prev, priceRange.key]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-200 text-[#0077FF] focus:ring-[#0077FF] accent-[#0077FF]"
                      />
                      <span className="group-hover:text-black transition-colors">{priceRange.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Flash Sales Gold Widget */}
            <div className="relative rounded-[2.2rem] p-8 text-center bg-gradient-to-br from-[#EAF4FF] to-[#DCEEFF] border border-[#0077FF]/15 shadow-sm overflow-hidden flex flex-col items-center">
              
              {/* Floating gold lightning icon in corner */}
              <div className="absolute -top-3 -left-3 text-[#0077FF]/20 z-0">
                <Zap className="w-20 h-20 fill-current" />
              </div>

              <div className="bg-[#0077FF]/10 text-[#0077FF] p-3 rounded-full mb-6 z-10">
                <Zap className="w-6 h-6 fill-current" />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif italic font-extrabold text-black uppercase tracking-wide leading-none mb-3 z-10">
                Flash Sales!
              </h3>
              
              <p className="text-gray-600 text-[0.7rem] md:text-xs tracking-wider leading-relaxed max-w-[200px] mb-8 font-sans z-10">
                Check out the latest offer products and win attractive prizes!
              </p>

              <button className="bg-[#0077FF] hover:bg-[#005ED1] text-white px-8 py-3 rounded-full inline-flex items-center gap-1.5 transition-all text-xs font-semibold tracking-[0.15em] uppercase hover:shadow-lg hover:shadow-yellow-600/10 group cursor-pointer z-10">
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Win Weekly Badge */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-4 flex items-center justify-center gap-3 group cursor-pointer hover:shadow-md transition-shadow">
              <div className="bg-[#0077FF]/10 p-2 rounded-full">
                <Trophy className="w-4 h-4 text-[#0077FF]" />
              </div>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-black font-sans">
                Win Weekly
              </span>
            </div>

          </aside>

          {/* RIGHT COLUMN: Active Filters & Products Grid */}
          <main className="w-full lg:w-3/4 flex-1">

            {/* Search Input Bar Group */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-4 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder={
                    searchType === 'sku'
                      ? 'Search by variant SKU (e.g. OVER-SHIRT-M)...'
                      : searchType === 'category'
                      ? 'Search by category (e.g. Apparel)...'
                      : 'Search products by name...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveSearchQuery(searchQuery);
                      setActiveSearchType(searchType);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-full text-xs font-semibold tracking-wider border border-gray-200 focus:outline-none focus:border-[#0077FF] focus:ring-1 focus:ring-[#0077FF] transition-all bg-gray-50/50"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto items-center">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-white border border-gray-200 rounded-full px-4 py-3 text-xs font-bold tracking-wider text-gray-700 focus:outline-none focus:border-[#0077FF] cursor-pointer"
                >
                  <option value="name">Search by Name</option>
                  <option value="sku">Search by SKU</option>
                  <option value="category">Search by Category</option>
                </select>
                <button
                  onClick={() => {
                    setActiveSearchQuery(searchQuery);
                    setActiveSearchType(searchType);
                  }}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md cursor-pointer select-none"
                >
                  Search
                </button>
              </div>
            </div>
            
            {/* Active Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-gray-100 min-h-[44px]">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-gray-400">
                Active Filters:
              </span>

              {activeSearchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#E7F2FF] hover:bg-[#E5E4E0] text-black text-[0.65rem] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {activeSearchType === 'sku' ? 'SKU: ' : activeSearchType === 'category' ? 'Category: ' : ''}
                  "{activeSearchQuery}"
                  <X className="w-3 h-3 text-gray-400 hover:text-black transition-colors" />
                </button>
              )}

              {selectedCategoryId && (
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className="inline-flex items-center gap-1.5 bg-[#E7F2FF] hover:bg-[#E5E4E0] text-black text-[0.65rem] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {categoriesList.find(c => c.id === selectedCategoryId)?.name || 'Category'}
                  <X className="w-3 h-3 text-gray-400 hover:text-black transition-colors" />
                </button>
              )}

              {selectedPriceRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedPriceRanges(prev => prev.filter(r => r !== range))}
                  className="inline-flex items-center gap-1.5 bg-[#E7F2FF] hover:bg-[#E5E4E0] text-black text-[0.65rem] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  {range === 'under_5000' ? 'Under ₹5000' : range === '5000_10000' ? '₹5000 - ₹10000' : 'Over ₹10000'}
                  <X className="w-3 h-3 text-gray-400 hover:text-black transition-colors" />
                </button>
              ))}

              {(selectedCategoryId || selectedPriceRanges.length > 0) && (
                <button
                  onClick={handleClearAll}
                  className="text-[0.65rem] tracking-[0.2em] uppercase font-bold text-[#0077FF] hover:text-[#005ED1] transition-colors cursor-pointer ml-2 border-b border-[#0077FF]/35 hover:border-[#005ED1]"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 w-full col-span-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 animate-pulse">
                    <div className="aspect-[3/4] w-full bg-gray-200 rounded-2xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 w-full col-span-3">
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
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 bg-[#E7F2FF] border border-gray-100/50">
                      <Image
                        src={prod.image}
                        alt={prod.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover mix-blend-multiply transition-transform duration-750 group-hover:scale-105 p-4"
                        priority={true}
                      />
                      
                      {/* Subtle bottom gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Wishlist & Cart Icons */}
                      <div className="absolute bottom-3 right-3 flex flex-row gap-2 z-20">
                        <button 
                          onClick={(e) => handleQuickAddToWishlist(e, prod)}
                          className="bg-white p-2.5 rounded-full shadow-md hover:bg-[#0077FF] hover:text-white transition-colors text-gray-800"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleQuickAddToCart(e, prod)}
                          className="bg-white p-2.5 rounded-full shadow-md hover:bg-[#0077FF] hover:text-white transition-colors text-gray-800"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
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
            )}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium text-xs tracking-[0.2em] uppercase px-10 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-[#F1F7FF] rounded-[2rem] border border-dashed border-gray-200">
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

      <Footer />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5FAFF]"></div>}>
      <ProductPageContent />
    </Suspense>
  );
}


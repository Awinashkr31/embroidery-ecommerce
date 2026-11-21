import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import { FREE_SHIPPING_THRESHOLD } from '../constants/shippingConfig';
import { ChevronRight, Search, Leaf, Tag, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import heroCrochet1 from '../assets/hero_crochet_1.webp';
import flowerHero from '../assets/flower.webp';
import tempHeroCrochet from '../assets/temp_hero_crochet.webp';

// Mobile-first horizontal scroll container
const HorizontalScroll = ({ children, title, actionText, actionLink }) => (
  <div className="py-3.5 sm:py-5">
    <div className="px-4 mb-2.5 sm:mb-3 flex items-end justify-between">
      <h2 className="text-[17px] sm:text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
      {actionText && actionLink && (
        <Link to={actionLink} className="text-rose-900 text-xs font-bold flex items-center mb-0.5 hover:underline">
          {actionText} <ChevronRight size={14} />
        </Link>
      )}
    </div>
    <div className="flex overflow-x-auto no-scrollbar gap-3 sm:gap-4 px-4 pb-1 snap-x snap-mandatory">
      {children}
    </div>
  </div>
);



const Home = () => {
  const { categories } = useCategories();
  const { FREE_DELIVERY_THRESHOLD } = useCart();
  const { products, fetchProducts } = useProducts();
  const { settings } = useSettings();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const homeProducts = products;

  const allCategoryCards = useMemo(() => {
    const metaMap = {
      'flower-pot': {
        title: 'Flower Pots',
        image: '/custom-images/custom_strawberry_pot.webp',
        fallback: '/category-images/flower-pot.webp',
      },
      'bouquet': {
        title: 'Bouquets',
        image: '/custom-images/custom_bouquet.webp',
        fallback: '/category-images/bouquet.webp',
      },
      'handmade-keychain': {
        title: 'Keychains',
        image: '/custom-images/custom_keychains.webp',
        fallback: '/category-images/handmade-keychain.webp',
      },
      'handmade keychain': {
        title: 'Keychains',
        image: '/custom-images/custom_keychains.webp',
        fallback: '/category-images/handmade-keychain.webp',
      },
      'hair-accessories': {
        title: 'Hair Clips',
        image: '/custom-images/custom_hairclips.webp',
        fallback: '/category-images/hair-accessories.webp',
      },
      'toys': {
        title: 'Plushies',
        image: '/custom-images/custom_bunny_overalls.webp',
        fallback: '/category-images/toys.webp',
      },
      'bags--pouches': {
        title: 'Bags & Pouches',
        image: '/custom-images/custom_granny_bag.webp',
        fallback: '/category-images/bags--pouches.webp',
      },
      'gift-box': {
        title: 'Gift Hampers',
        image: '/category-images/gift-box.webp',
        fallback: '/category-images/gift-hampers.webp',
      },
      'flowers': {
        title: 'Forever Flowers',
        image: '/category-images/flowers.webp',
        fallback: '/assets/flower.webp',
      },
    };

    return categories.map((cat) => {
      const cleanSlug = String(cat.id || '').toLowerCase().trim().replace(/\s+/g, '-');
      const meta = metaMap[cat.id] || metaMap[cleanSlug] || {};
      const cleanName = String(cat.label || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');

      return {
        id: cat.id,
        title: meta.title || cat.label,
        link: `/shop?category=${encodeURIComponent(cat.label)}`,
        image: meta.image || `/category-images/${cleanName}.webp`,
        fallback: meta.fallback || `/category-images/${cat.id}.webp`,
      };
    });
  }, [categories]);

  const { newArrivals, bestsellers, festiveSpecials, perfectGifts, trendingNow } = useMemo(() => {
    const na = homeProducts.filter(p => p.homepage_tags?.includes('new_arrival')).slice(0, 8);
    const bs = homeProducts.filter(p => p.homepage_tags?.includes('bestseller')).slice(0, 8);
    
    const displayedIds = new Set([
      ...na.map(p => p.id),
      ...bs.map(p => p.id)
    ]);
    
    const remaining = homeProducts.filter(p => !displayedIds.has(p.id));
    
    return {
      newArrivals: na,
      bestsellers: bs,
      festiveSpecials: remaining.slice(0, 8),
      perfectGifts: remaining.slice(8, 16),
      trendingNow: remaining.slice(16, 24),
    };
  }, [homeProducts]);

  const heroSlides = useMemo(() => {
    const rawSlides = settings?.home_slides_data;
    let customSlides = [];
    if (Array.isArray(rawSlides)) {
      customSlides = rawSlides;
    } else if (typeof rawSlides === 'string') {
      try { customSlides = JSON.parse(rawSlides); } catch { customSlides = []; }
    }

    const defaultSlides = [
      { image: '/assets/hero_crochet_1.webp', title: "Forever Flowers &\nHandcrafted Love", subtitle: "100% handmade crochet bouquets, accessories &...", link: '/shop' },
      { image: '/assets/flower.webp', title: "Custom Keepsakes &\nPersonal Gifts", subtitle: "Made to order with premium botanical-dyed yarn.", link: '/shop' },
      { image: '/assets/temp_hero_crochet.webp', title: "Festive Drops &\nNew Arrivals", subtitle: "Explore our latest collection of handmade treasures.", link: '/shop' }
    ];

    const isInvalidUrl = (url) => {
      if (!url || typeof url !== 'string' || !url.trim()) return true;
      // Stale deleted Supabase storage paths that return 400
      if (url.includes('1770652799530') || url.includes('1770652749048') || url.includes('1770652725905') || url.includes('home_hero_image_1770014013753')) {
        return true;
      }
      return false;
    };

    const validCustom = customSlides.filter(s => s && ((s.desktopImage && !isInvalidUrl(s.desktopImage)) || (s.mobileImage && !isInvalidUrl(s.mobileImage))));
    if (validCustom.length > 0) {
      return validCustom.map((s, idx) => ({
        image: (!isInvalidUrl(s.desktopImage) ? s.desktopImage : s.mobileImage) || defaultSlides[idx % defaultSlides.length].image,
        title: idx === 0 ? "Forever Flowers &\nHandcrafted Love" : (idx === 1 ? "Custom Keepsakes &\nPersonal Gifts" : "Festive Drops &\nNew Arrivals"),
        subtitle: idx === 0 ? "100% handmade crochet bouquets, accessories &..." : (idx === 1 ? "Made to order with premium botanical-dyed yarn." : "Explore our latest collection of handmade treasures."),
        link: s.link || '/shop'
      }));
    }

    const s1 = !isInvalidUrl(settings?.home_slider_image_1) ? settings.home_slider_image_1 : null;
    const s2 = !isInvalidUrl(settings?.home_slider_image_2) ? settings.home_slider_image_2 : null;
    const s3 = !isInvalidUrl(settings?.home_slider_image_3) ? settings.home_slider_image_3 : null;

    if (s1 || s2 || s3) {
      const slides = [];
      if (s1) slides.push({ image: s1, title: "Forever Flowers &\nHandcrafted Love", subtitle: "100% handmade crochet bouquets, accessories &...", link: '/shop' });
      if (s2) slides.push({ image: s2, title: "Custom Keepsakes &\nPersonal Gifts", subtitle: "Made to order with premium botanical-dyed yarn.", link: '/shop' });
      if (s3) slides.push({ image: s3, title: "Festive Drops &\nNew Arrivals", subtitle: "Explore our latest collection of handmade treasures.", link: '/shop' });
      if (slides.length > 0) return slides;
    }

    return defaultSlides;
  }, [settings]);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-background text-stone-900 font-body pb-24 lg:pb-0 pt-[env(safe-area-inset-top)] antialiased relative">
      <SEO title="Crochet Wali | Handmade Crochet Flowers & Artisanal Keepsakes" />
      <h1 className="sr-only">Crochet Wali – Handmade Crochet Flowers, Gajra, Hair Accessories & Aesthetic Gifts India</h1>

      {/* Search Bar */}
      <div className="px-4 pt-1.5 pb-2">
        <form onSubmit={handleSearch} className="flex items-center bg-white border border-stone-300 shadow-md rounded-full px-4 py-2.5 transition-all focus-within:border-rose-400 focus-within:ring-1 focus-within:ring-rose-200 focus-within:shadow-lg">
           <Search size={18} className="text-stone-500 mr-2 shrink-0" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search for bouquets, gifts..." 
             className="flex-1 bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-500 w-full truncate"
           />
        </form>
      </div>

      {/* Hero Banner (Screenshot Layout) */}
      <section className="mb-4 sm:mb-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 transform-gpu will-change-scroll">
          <div className="w-0 shrink-0" /> {/* Left Spacer */}
          {heroSlides.map((slide, idx) => (
            <div key={idx} className="relative flex shrink-0 w-[92vw] sm:w-[85vw] md:w-[600px] bg-stone-900 rounded-2xl overflow-hidden shadow-sm h-[320px] snap-center">
              {/* Background Image & Overlay */}
              <img 
                src={slide.image?.startsWith('http') ? getOptimizedImageUrl(slide.image, { width: 800, quality: 80 }) : slide.image} 
                loading={idx === 0 ? "eager" : "lazy"} 
                fetchPriority={idx === 0 ? "high" : "auto"} 
                decoding="async" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                alt={`${slide.title.replace(/\n/g, ' ')} - Crochet Wali`} 
                onError={(e) => {
                  const fallbacks = [heroCrochet1, flowerHero, tempHeroCrochet];
                  const fallback = fallbacks[idx % fallbacks.length];
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallback;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 z-10" />

              {/* Content Overlay */}
              <div className="relative z-20 w-full p-5 flex flex-col justify-end h-full pb-6">
                <div className="flex flex-col items-start gap-2 mb-2">
                  <span className="bg-[#e6f4ea] text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-fit gap-1.5 shadow-sm">
                    <Leaf size={12} className="font-bold" /> Handcrafted in India
                  </span>
                </div>
                
                <h2 className="font-headline-md text-white mb-3 leading-tight whitespace-pre-line drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {slide.title}
                </h2>
                
                <div className="bg-white text-rose-900 text-xs font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2 w-fit shadow-lg">
                  <Tag size={14} className="shrink-0" />
                  <span className="leading-tight">FLAT 20% - 40% OFF •<br/>Festive Sale</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link to="/shop" className="bg-rose-900 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-1 shadow-md hover:bg-rose-800 transition-colors whitespace-nowrap">
                    Shop Now
                  </Link>
                  <Link 
                    to="/custom-design" 
                    aria-label="Order custom crochet gifts"
                    className="bg-stone-950 text-white border border-stone-600 text-xs font-bold px-5 py-2.5 rounded-full shadow-md text-center hover:bg-stone-900 transition-colors whitespace-nowrap"
                  >
                    Custom
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="w-0 shrink-0" /> {/* Right Spacer */}
        </div>
      </section>

      {/* Shop By Category - Editorial Grid & Custom Orders (Matching Reference Mockup) */}
      <section className="mb-4 sm:mb-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-2 sm:mb-3">
          <div>
            <h2 
              className="text-xl md:text-2xl font-bold text-stone-900 leading-tight" 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Curated stitches for every celebration
            </p>
          </div>
          <Link 
            to="/shop" 
            className="text-rose-900 text-xs md:text-sm font-bold flex items-center mb-0.5 hover:underline"
          >
            See All <ChevronRight size={14} />
          </Link>
        </div>

        {/* All Categories Grid (2 Columns on Mobile, 4 Columns on Desktop - Compact Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {allCategoryCards.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 block bg-stone-100"
            >
              {/* Full-bleed Category Image */}
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                onError={(e) => {
                  if (cat.fallback && e.currentTarget.src !== cat.fallback) {
                    e.currentTarget.src = cat.fallback;
                  }
                }}
              />

              {/* Scrim Gradient Overlay for Contrast */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-45% to-transparent pointer-events-none" 
                aria-hidden="true"
              />

              {/* Bottom Label + Arrow */}
              <div className="absolute bottom-0 inset-x-0 p-2 sm:p-2.5 flex items-center justify-between pointer-events-none">
                <h3
                  className="font-bold text-white text-xs sm:text-sm md:text-base leading-tight drop-shadow-sm tracking-tight truncate mr-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {cat.title}
                </h3>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FRESH OFF THE HOOK CAROUSEL */}
      {newArrivals.length > 0 && (
        <section className="bg-surface-blush/30">
           <HorizontalScroll title="Fresh Off The Hook" actionText="Explore All" actionLink="/shop">
             {newArrivals.map((product) => (
               <div key={product.id} className="min-w-[130px] w-[130px] md:min-w-[260px] md:w-[260px] snap-center">
                 <ProductCard product={product} isHome={true} showAddButton={false} />
               </div>
             ))}
           </HorizontalScroll>
        </section>
      )}


      {/* 6. BESTSELLERS GRID / ARTISAN FAVORITES */}
      {bestsellers.length > 0 && (
        <section className="px-4 py-4 sm:py-7 bg-[#fff8f6] rounded-t-2xl sm:rounded-t-[2.5rem]">
          <div className="text-center space-y-1 max-w-lg mx-auto mb-3.5 sm:mb-5">
            <div className="inline-flex items-center justify-center gap-2 text-rose-200 mb-0.5">
              <span className="h-[1px] w-8 bg-rose-200"></span>
              <Sparkles className="text-rose-900" size={16} />
              <span className="h-[1px] w-8 bg-rose-200"></span>
            </div>
            <h2 className="text-[22px] sm:text-[28px] font-bold text-stone-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Artisan Favorites</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed px-2 font-medium">
              Our most cherished bespoke creations, lovingly crafted stitch by stitch for life's gentle moments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
             {bestsellers.map((product) => (
               <ProductCard key={`fav-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
          </div>
        </section>
      )}

      {/* Custom Orders Banner */}
      <div className="px-4 py-2 sm:py-3.5 bg-white">
        <Link
          to="/custom-design"
          className="group relative w-full aspect-[16/7] sm:aspect-[21/7] md:h-[180px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 block bg-stone-100"
        >
          {/* Panoramic Image */}
          <img
            src="/custom-images/custom_hero_banner.webp"
            alt="Custom Handmade Crochet Orders by Crochet Wali"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/hero_crochet_1.webp';
            }}
          />

          {/* Scrim Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 via-50% to-black/10 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Bottom Title & Action */}
          <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 flex items-center justify-between pointer-events-none">
            <div>
              <h3
                className="font-bold text-white text-sm sm:text-xl md:text-2xl leading-tight drop-shadow-sm tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Custom Orders
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-200/90 mt-0.5 line-clamp-1">
                Reference photo se banwaye apni pasand ka handmade crochet
              </p>
            </div>

            {/* Circular Arrow Button */}
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-stone-900 group-hover:scale-110 transition-all duration-300 shadow-sm shrink-0 ml-2 sm:ml-3">
              <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
        </Link>
      </div>

      {/* 7. FESTIVE SPECIALS */}
      {festiveSpecials.length > 0 && (
        <section className="px-4 py-3.5 sm:py-6 bg-white">
           <div className="mb-2 sm:mb-3 flex justify-between items-end">
             <h2 className="text-[17px] sm:text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Festive Specials</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-rose-900 hover:bg-rose-50 transition-colors" aria-label="Explore all Festive Specials in Shop">
               <ChevronRight size={16} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
             {festiveSpecials.map((product) => (
               <ProductCard key={`festive-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
           </div>
        </section>
      )}

      {/* Free Shipping Banner */}
      <div className="px-4 py-1.5 sm:py-2.5 bg-white">
        <div className="flex items-center justify-between bg-[#fff0f0] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-xs border border-rose-200 overflow-hidden relative">
          <div className="flex items-center gap-2.5 sm:gap-3 relative z-10">
            <span className="text-xl sm:text-2xl animate-[bounce_2s_ease-in-out_infinite]">🚚</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">Free Shipping</p>
              <p className="text-[11px] sm:text-xs text-stone-600">on orders over <span className="font-bold text-rose-900">₹{FREE_SHIPPING_THRESHOLD}</span></p>
            </div>
          </div>
          <Link to="/shop" className="bg-rose-900 text-white text-[11px] sm:text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 shadow-sm hover:bg-rose-800 transition-colors whitespace-nowrap relative z-10 hover:scale-105 active:scale-95 transition-transform">
            Shop Now <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* 8. PERFECT GIFTS */}
      {perfectGifts.length > 0 && (
        <section className="px-4 py-3.5 sm:py-6 bg-[#fdfaf9]">
           <div className="mb-2 sm:mb-3 flex justify-between items-end">
             <h2 className="text-[17px] sm:text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Perfect Gifts</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-rose-900 hover:bg-rose-50 transition-colors" aria-label="Explore all Perfect Gifts in Shop">
               <ChevronRight size={16} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
             {perfectGifts.map((product) => (
               <ProductCard key={`gifts-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
           </div>
        </section>
      )}

      {/* 9. TRENDING NOW */}
      {trendingNow.length > 0 && (
        <section className="px-4 pt-3.5 sm:pt-6 pb-6 sm:pb-12 bg-white">
           <div className="mb-2 sm:mb-3 flex justify-between items-end">
             <h2 className="text-[17px] sm:text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Trending Now</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-rose-900 hover:bg-rose-50 transition-colors" aria-label="Explore all Trending Now items in Shop">
               <ChevronRight size={16} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
             {trendingNow.map((product) => (
               <ProductCard key={`trending-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
           </div>
        </section>
      )}



    </div>
  );
};

export default Home;
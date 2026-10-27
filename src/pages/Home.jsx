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
import heroCrochet1 from '../assets/hero_crochet_1.webp';
import flowerHero from '../assets/flower.webp';
import tempHeroCrochet from '../assets/temp_hero_crochet.webp';

// Mobile-first horizontal scroll container
const HorizontalScroll = ({ children, title, actionText, actionLink }) => (
  <div className="py-6">
    <div className="px-4 mb-4 flex items-end justify-between">
      <h2 className="text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
      {actionText && actionLink && (
        <Link to={actionLink} className="text-rose-900 text-xs font-bold flex items-center mb-1 hover:underline">
          {actionText} <ChevronRight size={14} />
        </Link>
      )}
    </div>
    <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 pb-2 snap-x snap-mandatory">
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

  const dynamicCategories = useMemo(() => {
    return categories.map(cat => {
      const cleanName = cat.label.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      const categoryProduct = homeProducts.find(p => (p.category === cat.id || p.category === cat.label) && p.image && !p.image.includes('unsplash'));
      return {
        id: cat.id,
        label: cat.label,
        image: categoryProduct?.image || `/category-images/${cleanName}.webp`
      };
    });
  }, [categories, homeProducts]);

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
      { image: heroCrochet1, title: "Forever Flowers &\nHandcrafted Love", subtitle: "100% handmade crochet bouquets, accessories &...", link: '/shop' },
      { image: flowerHero, title: "Custom Keepsakes &\nPersonal Gifts", subtitle: "Made to order with premium botanical-dyed yarn.", link: '/shop' },
      { image: tempHeroCrochet, title: "Festive Drops &\nNew Arrivals", subtitle: "Explore our latest collection of handmade treasures.", link: '/shop' }
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
      <div className="px-4 pt-2 pb-3">
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

      {/* Category Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-4 mb-2 snap-x">
        <div className="w-1.5 shrink-0" /> {/* Left Spacer to equal px-4 total (gap 2.5 + 1.5 = 4) */}
        <Link to="/shop" className="px-5 py-1.5 bg-rose-900 text-white text-xs font-semibold border border-rose-900 rounded-full shrink-0 snap-start shadow-sm ml-1">
          All
        </Link>
        {dynamicCategories.map((cat, idx) => (
          <Link 
            key={idx}
            to={`/shop?category=${encodeURIComponent(cat.label)}`}
            className="px-5 py-1.5 bg-white text-stone-600 text-xs font-medium border border-stone-300 rounded-full shrink-0 snap-start shadow-sm hover:bg-rose-50 hover:text-rose-900 hover:border-rose-300 transition-all"
          >
            {cat.label}
          </Link>
        ))}
        <div className="w-1.5 shrink-0" /> {/* Right Spacer */}
      </div>

      {/* Hero Banner (Screenshot Layout) */}
      <section className="mb-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 transform-gpu will-change-scroll">
          <div className="w-0 shrink-0" /> {/* Left Spacer */}
          {heroSlides.map((slide, idx) => (
            <div key={idx} className="relative flex shrink-0 w-[92vw] sm:w-[85vw] md:w-[600px] bg-stone-900 rounded-2xl overflow-hidden shadow-sm h-[320px] snap-center">
              {/* Background Image & Overlay */}
              <img 
                src={slide.image} 
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

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
                  <Link to="/custom-design" className="bg-stone-950/80 backdrop-blur-md text-white border border-white/80 text-xs font-bold px-5 py-2.5 rounded-full shadow-md text-center hover:bg-stone-900 transition-colors whitespace-nowrap">
                    Custom
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <div className="w-0 shrink-0" /> {/* Right Spacer */}
        </div>
      </section>

      {/* Free Shipping Banner */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between bg-[#fff0f0] rounded-xl px-4 py-3 shadow-sm border border-rose-200 overflow-hidden relative">
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-2xl animate-[bounce_2s_ease-in-out_infinite]">🚚</span>
            <div>
              <p className="text-sm font-bold text-stone-900">Free Shipping</p>
              <p className="text-xs text-stone-600">on orders over <span className="font-bold text-rose-900">₹{FREE_SHIPPING_THRESHOLD}</span></p>
            </div>
          </div>
          <Link to="/shop" className="bg-rose-900 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-sm hover:bg-rose-800 transition-colors whitespace-nowrap relative z-10 hover:scale-105 active:scale-95 transition-transform">
            Shop Now <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Shop By Category */}
      <section className="mb-8">
        <div className="px-4 flex justify-between items-end mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Shop By Category</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">Curated stitches for every celebration</p>
          </div>
          <Link to="/shop" className="text-rose-900 text-xs font-bold flex items-center mb-1 hover:underline">
            See All <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-4 md:flex md:overflow-x-auto no-scrollbar gap-y-4 gap-x-2 md:gap-5 px-4 pb-2 snap-x transform-gpu will-change-scroll">
          {dynamicCategories.slice(0, 9).map((cat, i) => (
            <Link key={cat.id || i} to={`/shop?category=${encodeURIComponent(cat.label)}`} className="flex flex-col items-center gap-1.5 group w-full md:w-[76px] shrink-0 snap-start">
              <div className="w-[15vw] h-[15vw] max-w-[64px] max-h-[64px] md:w-[76px] md:h-[76px] rounded-full p-[1px] md:p-[2px] bg-gradient-to-tr from-[#e5a0a6] to-[#f4d1d4] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full border-[2px] border-white overflow-hidden bg-stone-100">
                  <img 
                    src={cat.image} 
                    loading="lazy" 
                    decoding="async" 
                    alt="" 
                    aria-hidden="true" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = heroCrochet1;
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-stone-900 text-center leading-tight whitespace-normal w-full px-0.5">
                {cat.label}
              </span>
            </Link>
          ))}
          
          {/* View All Circle */}
          <Link to="/shop" className="flex flex-col items-center gap-1.5 group w-full md:w-[76px] shrink-0 snap-start" aria-label="View all categories in Shop">
            <div className="w-[15vw] h-[15vw] max-w-[64px] max-h-[64px] md:w-[76px] md:h-[76px] rounded-full p-[1px] md:p-[2px] bg-gradient-to-tr from-[#e5a0a6] to-[#f4d1d4] shadow-sm shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full border-[2px] border-white bg-rose-50 flex flex-col items-center justify-center text-rose-900">
                <ArrowRight size={24} className="text-rose-900 mb-0.5" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xs font-bold text-stone-900 text-center leading-tight whitespace-normal w-full px-0.5">
              View All
            </span>
          </Link>
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
        <section className="px-4 py-10 bg-[#fff8f6] rounded-t-[2.5rem]">
          <div className="text-center space-y-1.5 max-w-lg mx-auto mb-6">
            <div className="inline-flex items-center justify-center gap-2 text-rose-200 mb-1">
              <span className="h-[1px] w-8 bg-rose-200"></span>
              <Sparkles className="text-rose-900" size={18} />
              <span className="h-[1px] w-8 bg-rose-200"></span>
            </div>
            <h2 className="text-[28px] font-bold text-stone-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Artisan Favorites</h2>
            <p className="text-sm text-stone-600 leading-relaxed px-2 font-medium">
              Our most cherished bespoke creations, lovingly crafted stitch by stitch for life's gentle moments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
             {bestsellers.map((product) => (
               <ProductCard key={`fav-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
          </div>
          
          
        </section>
      )}

      {/* 7. FESTIVE SPECIALS */}
      {festiveSpecials.length > 0 && (
        <section className="px-4 py-8 bg-white">
           <div className="mb-4 flex justify-between items-end">
             <h2 className="text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Festive Specials</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-rose-900 hover:bg-rose-50 transition-colors" aria-label="Explore all Festive Specials in Shop">
               <ChevronRight size={18} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {festiveSpecials.map((product) => (
               <ProductCard key={`festive-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
           </div>
        </section>
      )}

      {/* 8. PERFECT GIFTS */}
      {perfectGifts.length > 0 && (
        <section className="px-4 py-8 bg-[#fdfaf9]">
           <div className="mb-4 flex justify-between items-end">
             <h2 className="text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Perfect Gifts</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-rose-900 hover:bg-rose-50 transition-colors" aria-label="Explore all Perfect Gifts in Shop">
               <ChevronRight size={18} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {perfectGifts.map((product) => (
               <ProductCard key={`gifts-${product.id}`} product={product} isHome={true} showAddButton={false} />
             ))}
           </div>
        </section>
      )}

      {/* 9. TRENDING NOW */}
      {trendingNow.length > 0 && (
        <section className="px-4 pt-8 pb-12 bg-white">
           <div className="mb-4 flex justify-between items-end">
             <h2 className="text-[18px] font-bold text-stone-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Trending Now</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-rose-900 hover:bg-rose-50 transition-colors" aria-label="Explore all Trending Now items in Shop">
               <ChevronRight size={18} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
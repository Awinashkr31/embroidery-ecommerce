import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Shield, Quote, ArrowRight, CheckCircle2, ChevronRight, Search, Camera, Leaf, Tag, Sparkles, Package } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../config/supabase';

// Mobile-first horizontal scroll container
const HorizontalScroll = ({ children, title, actionText, actionLink }) => (
  <div className="py-6">
    <div className="px-4 mb-4 flex items-end justify-between">
      <h2 className="text-[18px] font-bold text-[#0f2142] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
      {actionText && actionLink && (
        <Link to={actionLink} className="text-terracotta-dark text-[12px] font-bold flex items-center mb-1">
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
  const [homeProducts, setHomeProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchHomeProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('id, name, price, original_price, images, homepage_tags, stock_quantity, variants, category')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(50);

        if (data && mounted) {
          const mappedProducts = data.map(p => {
            let parsedImages = p.images;
            if (typeof parsedImages === 'string') {
              try { parsedImages = JSON.parse(parsedImages); } catch (e) {}
            }
            return {
              ...p,
              images: Array.isArray(parsedImages) ? parsedImages : [],
              image: (Array.isArray(parsedImages) && parsedImages.length > 0) ? parsedImages[0] : 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500',
              inStock: (p.stock_quantity || 0) > 0,
              stock: p.stock_quantity,
              originalPrice: p.original_price,
              discountPercentage: (p.original_price && p.original_price > p.price)
                ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : 0,
            };
          });
          setHomeProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      }
    };
    fetchHomeProducts();
    return () => { mounted = false; };
  }, []);

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

  const heroSlides = [
    { image: "/assets/hero_crochet_1.webp", title: "Forever Flowers &\nHandcrafted Love", subtitle: "100% handmade crochet bouquets, accessories &..." },
    { image: "/assets/flower.webp", title: "Custom Keepsakes &\nPersonal Gifts", subtitle: "Made to order with premium botanical-dyed yarn." },
    { image: "/assets/temp_hero_crochet.webp", title: "Festive Drops &\nNew Arrivals", subtitle: "Explore our latest collection of handmade treasures." }
  ];

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-background text-on-background font-body pb-24 lg:pb-0 pt-[env(safe-area-inset-top)] antialiased relative">
      <SEO title="Anuki Crochet | Luxury Artisanal Keepsakes" />

      {/* Search Bar */}
      <div className="px-4 pt-2 pb-3">
        <form onSubmit={handleSearch} className="flex items-center bg-white border border-stone-300 shadow-md rounded-full px-4 py-2.5 transition-all focus-within:border-rose-400 focus-within:ring-1 focus-within:ring-rose-200 focus-within:shadow-lg">
           <Search size={18} className="text-stone-500 mr-2 shrink-0" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search for bouquets, gifts..." 
             className="flex-1 bg-transparent text-[13px] md:text-sm outline-none text-stone-800 placeholder:text-stone-500 w-full truncate"
           />
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-2.5 px-4 pb-4 mb-2 snap-x">
        <Link to="/shop" className="px-5 py-1.5 bg-gradient-to-r from-rose-700 to-rose-600 text-white text-[13px] font-semibold border border-rose-700 rounded-full shrink-0 snap-start shadow-[0_4px_12px_rgba(225,29,72,0.25)]">
          All
        </Link>
        {dynamicCategories.map((cat, idx) => (
          <Link 
            key={idx}
            to={`/shop?category=${encodeURIComponent(cat.label)}`}
            className="px-5 py-1.5 bg-white text-stone-700 text-[13px] font-medium border border-stone-300 rounded-full shrink-0 snap-start shadow-sm hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Hero Banner (Screenshot Layout) */}
      <section className="mb-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 pr-4 gap-4 transform-gpu will-change-scroll">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className="relative flex shrink-0 w-[92vw] sm:w-[85vw] md:w-[600px] bg-stone-900 rounded-2xl overflow-hidden shadow-sm h-[320px] snap-center">
              {/* Background Image & Overlay */}
              <img src={slide.image} loading={idx === 0 ? "eager" : "lazy"} fetchPriority={idx === 0 ? "high" : "auto"} decoding="async" className="absolute inset-0 w-full h-full object-cover z-0" alt="Hero Featured" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

              {/* Content Overlay */}
              <div className="relative z-20 w-full p-5 flex flex-col justify-end h-full pb-6">
                <div className="flex flex-col items-start gap-2 mb-2">
                  <span className="bg-[#e6f4ea]/90 backdrop-blur-sm text-[#137333] text-[10px] font-bold px-2 py-1 rounded-full flex items-center w-fit gap-1 shadow-sm">
                    <Leaf size={12} className="font-bold" /> Handcrafted in India
                  </span>
                </div>
                
                <h1 className="font-headline-md text-white mb-3 leading-tight whitespace-pre-line drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {slide.title}
                </h1>
                
                <div className="bg-white/95 backdrop-blur-sm text-rose-700 text-[10px] font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2 w-fit shadow-lg">
                  <Tag size={14} className="shrink-0" />
                  <span className="leading-tight">FLAT 20% - 40% OFF •<br/>Festive Sale</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link to="/shop" className="bg-rose-600 text-white text-[12px] font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-1 shadow-lg hover:bg-rose-700 transition-colors whitespace-nowrap">
                    Shop Now
                  </Link>
                  <Link to="/custom-design" className="bg-white/20 backdrop-blur-md text-white border border-white/40 text-[12px] font-bold px-5 py-2.5 rounded-full shadow-lg text-center hover:bg-white/30 transition-colors whitespace-nowrap">
                    Custom
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Shipping Banner */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#fff0f0] to-[#ffe8e0] rounded-xl px-4 py-3 shadow-sm border border-rose-100/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_3s_infinite] pointer-events-none" style={{ backgroundSize: '200% 100%' }}></div>
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-2xl animate-[bounce_2s_ease-in-out_infinite]">🚚</span>
            <div>
              <p className="text-[13px] md:text-[14px] font-bold text-stone-900">Free Shipping</p>
              <p className="text-[11px] md:text-[12px] text-stone-500">on orders over <span className="font-bold text-[#e11d48]">₹{FREE_DELIVERY_THRESHOLD || 799}</span></p>
            </div>
          </div>
          <Link to="/shop" className="bg-[#e11d48] text-white text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-sm hover:bg-[#be123c] transition-colors whitespace-nowrap relative z-10 hover:scale-105 active:scale-95 transition-transform">
            Shop Now <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Shop By Category */}
      <section className="mb-8">
        <div className="px-4 flex justify-between items-end mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0f2142] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Shop By Category</h2>
            <p className="text-[11px] text-stone-500 mt-1">Curated stitches for every celebration</p>
          </div>
          <Link to="/shop" className="text-terracotta-dark text-[12px] font-bold flex items-center mb-1">
            See All <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-4 md:flex md:overflow-x-auto no-scrollbar gap-y-4 gap-x-2 md:gap-5 px-4 pb-2 snap-x transform-gpu will-change-scroll">
          {dynamicCategories.slice(0, 9).map((cat, i) => (
            <Link key={cat.id || i} to={`/shop?category=${encodeURIComponent(cat.label)}`} className="flex flex-col items-center gap-1.5 group w-full md:w-[76px] shrink-0 snap-start">
              <div className="w-[15vw] h-[15vw] max-w-[64px] max-h-[64px] md:w-[76px] md:h-[76px] rounded-full p-[1px] md:p-[2px] bg-gradient-to-tr from-[#e5a0a6] to-[#f4d1d4] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full border-[2px] border-white overflow-hidden bg-stone-100">
                  <img src={cat.image} loading="lazy" decoding="async" alt={cat.label} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[9px] md:text-[11px] font-bold text-[#0f2142] text-center leading-tight whitespace-normal w-full px-0.5">
                {cat.label}
              </span>
            </Link>
          ))}
          
          {/* View All Circle */}
          <Link to="/shop" className="flex flex-col items-center gap-1.5 group w-full md:w-[76px] shrink-0 snap-start">
            <div className="w-[15vw] h-[15vw] max-w-[64px] max-h-[64px] md:w-[76px] md:h-[76px] rounded-full p-[1px] md:p-[2px] bg-gradient-to-tr from-[#e5a0a6] to-[#f4d1d4] shadow-sm shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full border-[2px] border-white bg-rose-50 flex flex-col items-center justify-center text-rose-700">
                <ArrowRight size={24} className="text-rose-700 mb-0.5" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-[9px] md:text-[11px] font-bold text-[#0f2142] text-center leading-tight whitespace-normal w-full px-0.5">
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
                 <ProductCard product={product} isHome={true} />
               </div>
             ))}
           </HorizontalScroll>
        </section>
      )}


      {/* 6. BESTSELLERS GRID / ARTISAN FAVORITES */}
      {bestsellers.length > 0 && (
        <section className="px-4 py-10 bg-[#fff8f6] rounded-t-[2.5rem]">
          <div className="text-center space-y-1.5 max-w-lg mx-auto mb-6">
            <div className="inline-flex items-center justify-center gap-2 text-[#dac1bd] mb-1">
              <span className="h-[1px] w-8 bg-[#dac1bd]"></span>
              <Sparkles className="text-[#8a3c32]" size={18} />
              <span className="h-[1px] w-8 bg-[#dac1bd]"></span>
            </div>
            <h2 className="text-[28px] font-bold text-[#1f1b1a] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Artisan Favorites</h2>
            <p className="text-[13px] text-[#554340] leading-relaxed px-2 font-medium">
              Our most cherished bespoke creations, lovingly crafted stitch by stitch for life's gentle moments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
             {bestsellers.map((product) => (
               <ProductCard key={`fav-${product.id}`} product={product} isHome={true} />
             ))}
          </div>
          
          
        </section>
      )}

      {/* 7. FESTIVE SPECIALS */}
      {festiveSpecials.length > 0 && (
        <section className="px-4 py-8 bg-white">
           <div className="mb-4 flex justify-between items-end">
             <h2 className="text-[18px] font-bold text-[#0f2142] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Festive Specials</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-terracotta-dark hover:bg-rose-50 transition-colors">
               <ChevronRight size={18} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {festiveSpecials.map((product) => (
               <ProductCard key={`festive-${product.id}`} product={product} isHome={true} />
             ))}
           </div>
        </section>
      )}

      {/* 8. PERFECT GIFTS */}
      {perfectGifts.length > 0 && (
        <section className="px-4 py-8 bg-[#fdfaf9]">
           <div className="mb-4 flex justify-between items-end">
             <h2 className="text-[18px] font-bold text-[#0f2142] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Perfect Gifts</h2>
             <Link to="/shop" className="p-1.5 bg-white rounded-full shadow-sm text-terracotta-dark hover:bg-rose-50 transition-colors">
               <ChevronRight size={18} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {perfectGifts.map((product) => (
               <ProductCard key={`gifts-${product.id}`} product={product} isHome={true} />
             ))}
           </div>
        </section>
      )}

      {/* 9. TRENDING NOW */}
      {trendingNow.length > 0 && (
        <section className="px-4 pt-8 pb-12 bg-white">
           <div className="mb-4 flex justify-between items-end">
             <h2 className="text-[18px] font-bold text-[#0f2142] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Trending Now</h2>
             <Link to="/shop" className="p-1.5 bg-stone-100 rounded-full shadow-sm text-terracotta-dark hover:bg-rose-50 transition-colors">
               <ChevronRight size={18} />
             </Link>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {trendingNow.map((product) => (
               <ProductCard key={`trending-${product.id}`} product={product} isHome={true} />
             ))}
           </div>
        </section>
      )}



    </div>
  );
};

export default Home;
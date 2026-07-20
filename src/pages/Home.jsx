import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { Star, Truck, Shield, Award, ChevronLeft, ChevronRight, Quote, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { getProductUrl } from '../utils/urlUtils';
import { supabase } from '../config/supabase';

// Scroll reveal hook
const useInView = () => {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsInView(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, isInView];
};
const Reveal = ({ children, className = '', delay = 0 }) => {
    const [ref, inView] = useInView();
    return (
        <div ref={ref} className={`${className} transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

const CATEGORY_IMAGES = {
    'home decor': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600',
    'accessories': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600',
    'art': 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=600',
    'gifts': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
    'hoop art': 'https://images.unsplash.com/photo-1584285406059-e9eb7b17d740?w=600',
    'bridal': 'https://images.unsplash.com/photo-1583939000240-410c5cb2ed29?w=600',
    'custom': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    'jewelry': 'https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=600',
    'clothing': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600'
};

const REVIEWS = [
    { id: 1, name: "Priya S.", rating: 5, text: "Mujhe bouquet bahut pasand aaya! Ekdum real flowers jaisa lagta hai. Meri friend ko gift diya toh woh bahut khush hui. Best quality hai!" },
    { id: 2, name: "Meera R.", rating: 5, text: "Hair clips ka design itna cute hai na, sab poochte hain kahan se liya. Thread work ekdum neat hai aur colour bhi bilkul wahi mila jo photo mein tha." },
    { id: 3, name: "Anita K.", rating: 4, text: "Keychain ka embroidery work amazing hai. Delivery thoda late aayi but product dekhke sab bhool gayi. Packaging bhi bahut premium thi." },
    { id: 4, name: "Riya M.", rating: 5, text: "Gajra liya tha function ke liye — everyone loved it! Itna detailed handwork hai ki log sochte hain asli phool hain. Definitely dubara order karungi." },
    { id: 5, name: "Neha G.", rating: 5, text: "Custom design karwaya tha rakhi ke liye, Sana ne exactly waise hi banaya jaisa maine bola tha. Gift wrapping bhi bahut sundar thi. Highly recommend!" },
    { id: 6, name: "Simran T.", rating: 5, text: "Rubber band set liya beti ke liye, itna soft aur comfortable hai. School mein sab friends ne bhi manga address. Quality ke liye price bilkul sahi hai." },
];

const budgetBazaarItemsRow1 = [
    { title: "Claw Clips", price: 99, img: "https://images.unsplash.com/photo-1596755389378-c11d66f442b3?w=400" },
    { title: "Hair Bows", price: 149, img: "https://images.unsplash.com/photo-1627914437433-72210a17406a?w=400" },
    { title: "Bouquets", price: 199, img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400" },
    { title: "Rubber Bands", price: 99, img: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400" },
    { title: "Keychains", price: 149, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400" },
];

const budgetBazaarItemsRow2 = [
    { title: "Parandi", price: 249, img: "https://images.unsplash.com/photo-1579782811467-33f7f185efb1?w=400" },
    { title: "Scrunchies", price: 129, img: "https://images.unsplash.com/photo-1610444383181-e28a529fb6ee?w=400" },
    { title: "Rings", price: 149, img: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=400" },
    { title: "Earrings", price: 199, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400" },
    { title: "Bracelets", price: 149, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400" },
];

const Home = () => {
  const { categories } = useCategories();
  const { FREE_DELIVERY_THRESHOLD } = useCart();
  const { settings } = useSettings();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const homeSlides = [
    {
      desktopImage: '/assets/temp_hero_crochet.webp',
      mobileImage: '/assets/temp_hero_crochet.webp',
      link: '/shop'
    },
    {
      desktopImage: '/assets/hero_crochet_1.webp',
      mobileImage: '/assets/hero_crochet_1.webp',
      link: '/shop'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const reviewScrollRef = useRef(null);
  const budgetScrollRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
      // Delay rendering below-the-fold content to prioritize Hero LCP
      const timer = setTimeout(() => setIsMounted(true), 100);
      return () => clearTimeout(timer);
  }, []);

  // Auto slide Budget Bazaar only when visible
  useEffect(() => {
      let interval;
      const el = budgetScrollRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
              interval = setInterval(() => {
                  const scrollAmount = 140; // Approx item width + gap
                  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
                      el.scrollTo({ left: 0, behavior: 'smooth' });
                  } else {
                      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                  }
              }, 3000);
          } else {
              if (interval) clearInterval(interval);
          }
      }, { threshold: 0.1 });
      
      observer.observe(el);

      return () => {
          if (interval) clearInterval(interval);
          observer.disconnect();
      };
  }, []);

  const minSwipeDistance = 50;
  
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchMove = useCallback((e) => setTouchEnd(e.targetTouches[0].clientX), []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
       setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    } 
    if (distance < -minSwipeDistance) {
       setCurrentSlide((prev) => (prev - 1 + homeSlides.length) % homeSlides.length);
    }
  }, [touchStart, touchEnd, homeSlides.length]);

  // Autoplay only on desktop (mobile gets static hero for faster LCP)
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) return;
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [homeSlides.length]);

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
                .limit(30);
                
            if (data && mounted) {
                const mappedProducts = data.map(p => {
                    let parsedImages = p.images;
                    if (typeof parsedImages === 'string') {
                        try { parsedImages = JSON.parse(parsedImages); } catch (e) { parsedImages = []; }
                    }
                    let parsedVariants = p.variants;
                    if (typeof parsedVariants === 'string') {
                        try { parsedVariants = JSON.parse(parsedVariants); } catch (e) { parsedVariants = []; }
                    }
                    
                    return {
                        ...p,
                        images: Array.isArray(parsedImages) ? parsedImages : [],
                        image: (Array.isArray(parsedImages) && parsedImages.length > 0) ? parsedImages[0] : 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500',
                        inStock: (p.stock_quantity || 0) > 0,
                        stock: p.stock_quantity,
                        originalPrice: p.original_price,
                        discountPercentage: (p.original_price && p.original_price > p.price)
                            ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                            : 0,
                        variants: Array.isArray(parsedVariants) ? parsedVariants : [],
                        homepage_tags: Array.isArray(p.homepage_tags) ? p.homepage_tags : []
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
        return {
            id: cat.id,
            label: cat.label,
            image: cat.image || CATEGORY_IMAGES[cat.label.toLowerCase()] || `/category-images/${cleanName}.webp`
        };
    });
  }, [categories]);

  const { newArrivals, bestsellers, premiumProducts, budgetGridItems } = useMemo(() => {
    const newArr = homeProducts.filter(p => p.homepage_tags?.includes('new_arrival'));
    const best = homeProducts.filter(p => p.homepage_tags?.includes('bestseller'));
    const prem = homeProducts.filter(p => p.homepage_tags?.includes('premium'));

    // Get actual budget products (e.g. price <= 499)
    const budgetProducts = homeProducts.filter(p => p.price <= 499);
    
    // We want 16 items total to make a scrolling 2-row grid
    // If not enough products, fallback to any available home products
    const sourceForBudget = budgetProducts.length >= 3 ? budgetProducts : homeProducts;
    
    const budgetGrid = sourceForBudget.slice(0, 16).map(p => ({
        id: p.id,
        title: p.name,
        price: p.price,
        img: p.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400"
    }));

    return {
      newArrivals: newArr.length > 0 ? newArr.slice(0, 7) : homeProducts.slice(0, 7),
      bestsellers: best.length > 0 ? best.slice(0, 7) : homeProducts.slice(7, 14),
      premiumProducts: prem.length > 0 ? prem.slice(0, 7) : homeProducts.slice(14, 21),
      budgetGridItems: budgetGrid
    };
  }, [homeProducts]);

  const scrollReviews = useCallback((direction) => {
      if (reviewScrollRef.current) {
          const scrollAmount = 300;
          reviewScrollRef.current.scrollBy({
              left: direction === 'left' ? -scrollAmount : scrollAmount,
              behavior: 'smooth'
          });
      }
  }, []);


  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are the crochet bouquets actually handmade?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Every single crochet bouquet and embroidery piece is 100% handmade with love by Sana using premium, durable yarn that lasts forever."
        }
      },
      {
        "@type": "Question",
        "name": "Do you deliver across India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Absolutely. We offer secure, pan-India delivery. We also provide Free Shipping on all orders above ₹${FREE_DELIVERY_THRESHOLD || 999}.`
        }
      },
      {
        "@type": "Question",
        "name": "Can I request a custom design?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we love custom orders! You can visit our Custom Design page to request personalized embroidery hoops or bespoke crochet flowers."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard delivery takes approximately 4-7 days depending on your location in India. Custom handmade items may require additional crafting time."
        }
      }
    ]
  };

  return (
    <div className="font-body bg-white selection:bg-rose-900 selection:text-white">
      <SEO 
        title="Crochet Wali | Handmade Crochet Flowers, Gajra, Hair Clips & Gifts India"
        schema={[faqSchema]}
      >
          <link rel="preload" as="image" href={homeSlides[currentSlide]?.desktopImage || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"} />
      </SEO>
      <h1 className="sr-only">Crochet Wali – Handmade Crochet Gifts Made with Love</h1>

        {/* ================= CUSTOM HERO BANNER ================= */}
        <section 
            className="relative w-full aspect-[5/3] md:aspect-[21/9] lg:aspect-[24/9] overflow-hidden bg-[#4a0d1d]"
            onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
            onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
            onTouchEnd={onTouchEnd}
        >
            {/* Background Image (Covers entire right half behind the slant) */}
            <div className="absolute right-0 top-0 w-[75%] md:w-[60%] h-full z-0 transition-opacity duration-500">
                <img 
                    src={homeSlides[currentSlide]?.desktopImage || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800"} 
                    alt="Handcrafted Gifts" 
                    className="w-full h-full object-cover animate-fade-in translate-x-[15%] md:translate-x-[10%] scale-[1.1]" 
                    key={currentSlide}
                    decoding="sync"
                    loading="eager"
                    fetchpriority="high"
                />
                {/* Optional dark overlay to ensure text/dots readability if image is bright */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Left Cream Slant */}
            <div className="absolute top-0 left-0 h-full w-[60%] md:w-[55%] bg-[#fcf5ef] z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
            
            {/* Content Wrapper */}
            <div className="absolute inset-0 flex items-center z-20">
                {/* Left Text */}
                <div className="w-[60%] md:w-[50%] pl-4 sm:pl-8 md:pl-16 flex flex-col justify-center">
                    <div className="flex items-start font-bold leading-none">
                        <span className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] text-[#6e132b] tracking-tighter">50</span>
                        <div className="flex flex-col ml-1 md:ml-2 pt-1 md:pt-3">
                           <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#6e132b]">%</span>
                           <span className="text-xl sm:text-2xl md:text-4xl text-rose-400 mt-0.5 md:mt-1">-</span>
                        </div>
                        
                        <span className="text-[3rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[7rem] text-[#6e132b] tracking-tighter ml-1 md:ml-2">80</span>
                        <div className="flex flex-col ml-1 md:ml-2 pt-1 md:pt-3">
                            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#6e132b]">%</span>
                            <span className="text-xs sm:text-sm md:text-lg lg:text-xl text-[#6e132b] mt-1 md:mt-2 tracking-widest">OFF</span>
                        </div>
                    </div>
                    
                    <p className="text-[10px] sm:text-xs md:text-base lg:text-lg mt-3 md:mt-6 text-stone-800 font-semibold max-w-[150px] sm:max-w-[180px] md:max-w-[280px] leading-snug">
                        Unique handcrafted gifts for every occasion
                    </p>
                    
                    <Link to="/shop" className="mt-4 md:mt-8 bg-[#6e132b] text-white px-5 py-1.5 sm:px-6 sm:py-2 md:px-10 md:py-3 rounded-full font-bold text-[10px] sm:text-xs md:text-sm w-max hover:bg-[#4a0d1d] transition-colors shadow-lg flex items-center gap-2">
                        SHOP NOW <span className="font-black">&gt;</span>
                    </Link>
                </div>
            </div>
            
            {/* Carousel Dots */}
            <div className="absolute bottom-3 md:bottom-6 right-[20%] md:right-[22%] flex gap-2.5 z-20">
                {homeSlides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                            currentSlide === idx 
                                ? 'bg-white scale-125' 
                                : 'bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      {isMounted && (
        <>
      <section className="py-12 md:py-16 bg-white border-b border-stone-100">
        <div className="container-custom">
            <Reveal>
              <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                  <h2 className="text-[22px] md:text-[28px] font-heading font-bold text-[#0f172a] tracking-tight capitalize">Shop by Category</h2>
                  <Link to="/shop" className="text-[#e11d48] font-semibold text-[13px] md:text-sm flex items-center gap-1 hover:underline transition-colors">
                      See All <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </Link>
              </div>
            </Reveal>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12 pb-4 px-1 md:px-0 max-w-5xl mx-auto">
                {dynamicCategories.slice(0, 12).map((category, i) => (
                    <Reveal key={category.id}>
                      <Link 
                          to={`/shop?category=${encodeURIComponent(category.label)}`}
                          className="group flex flex-col items-center"
                      >
                          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1.5 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] group-hover:-translate-y-1 transition-all duration-300">
                              <div className="w-full h-full rounded-full overflow-hidden bg-stone-50">
                                  <img 
                                      src={getOptimizedImageUrl(category.image, { width: 200, quality: 70 })} 
                                      alt={category.label} 
                                      width={160}
                                      height={160}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                      loading={i < 4 ? "eager" : "lazy"}
                                      decoding="async"
                                      onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200"; }}
                                  />
                              </div>
                          </div>
                          <span className="font-bold text-[9px] sm:text-[10px] md:text-xs text-center uppercase tracking-[0.15em] text-stone-800 group-hover:text-[#6e132b] transition-colors break-words w-full px-1 mt-3 md:mt-4">
                              {category.label}
                          </span>
                      </Link>
                    </Reveal>
                ))}
            </div>
        </div>
      </section>

        {/* ================= HORIZONTAL PROMO CARDS ================= */}
        <section className="w-full bg-white py-6 md:py-8 overflow-hidden">
            <div className="container-custom flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory no-scrollbar pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                
                {/* Promo Card 1 - Red */}
                <div className="min-w-[320px] md:min-w-[420px] bg-[#e11d48] rounded-[24px] shrink-0 snap-center flex overflow-hidden relative shadow-md h-[160px] md:h-[200px]">
                    <div className="w-1/2 p-5 md:p-8 flex flex-col justify-center z-10 relative">
                        <h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase leading-tight mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>Crochet<br/>Bouquet</h3>
                        <p className="text-white/95 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-3 md:mb-5 mt-1">Forever Flowers</p>
                        <Link to="/shop?category=bouquets" className="bg-white text-[#e11d48] font-bold text-[11px] md:text-xs px-5 py-2 rounded-full w-max shadow-sm hover:scale-105 transition-transform">
                            Shop Bouquets
                        </Link>
                    </div>
                    <div className="w-[60%] h-full absolute right-0 top-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#e11d48] via-[#e11d48]/50 to-transparent w-16 z-10"></div>
                        <img src="/promo-images/promo_bouquet_1784372081052.webp" alt="Crochet Bouquet" className="w-full h-full object-cover" width="600" height="400" loading="lazy" decoding="async" />
                    </div>
                </div>

                {/* Promo Card 2 - Teal */}
                <div className="min-w-[320px] md:min-w-[420px] bg-[#0d9488] rounded-[24px] shrink-0 snap-center flex overflow-hidden relative shadow-md h-[160px] md:h-[200px]">
                    <div className="w-1/2 p-5 md:p-8 flex flex-col justify-center z-10 relative">
                        <h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase leading-tight mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>Flower<br/>Pots</h3>
                        <p className="text-white/95 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-3 md:mb-5 mt-1">Vibrant Decor</p>
                        <Link to="/shop?category=flower-pots" className="bg-white text-[#0d9488] font-bold text-[11px] md:text-xs px-5 py-2 rounded-full w-max shadow-sm hover:scale-105 transition-transform">
                            Shop Flower Pots
                        </Link>
                    </div>
                    <div className="w-[60%] h-full absolute right-0 top-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] via-[#0d9488]/50 to-transparent w-16 z-10"></div>
                        <img src="/promo-images/promo_flowerpot_1784372090942.webp" alt="Flower Pots" className="w-full h-full object-cover" width="600" height="400" loading="lazy" decoding="async" />
                    </div>
                </div>

                {/* Promo Card 3 - Indigo */}
                <div className="min-w-[320px] md:min-w-[420px] bg-[#4f46e5] rounded-[24px] shrink-0 snap-center flex overflow-hidden relative shadow-md h-[160px] md:h-[200px]">
                    <div className="w-1/2 p-5 md:p-8 flex flex-col justify-center z-10 relative">
                        <h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase leading-tight mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>Hair<br/>Clips</h3>
                        <p className="text-white/95 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-3 md:mb-5 mt-1">Cute Accessories</p>
                        <Link to="/shop?category=hair-accessories" className="bg-white text-[#4f46e5] font-bold text-[11px] md:text-xs px-5 py-2 rounded-full w-max shadow-sm hover:scale-105 transition-transform">
                            Shop Hair Clips
                        </Link>
                    </div>
                    <div className="w-[60%] h-full absolute right-0 top-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] via-[#4f46e5]/50 to-transparent w-16 z-10"></div>
                        <img src="/promo-images/promo_hairclips_1784372110625.webp" alt="Hair Clips" className="w-full h-full object-cover" width="600" height="400" loading="lazy" decoding="async" />
                    </div>
                </div>

                {/* Promo Card 4 - Amber */}
                <div className="min-w-[320px] md:min-w-[420px] bg-[#d97706] rounded-[24px] shrink-0 snap-center flex overflow-hidden relative shadow-md h-[160px] md:h-[200px]">
                    <div className="w-1/2 p-5 md:p-8 flex flex-col justify-center z-10 relative">
                        <h3 className="text-white font-heading font-bold text-2xl md:text-3xl uppercase leading-tight mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                            Cute<br/>
                            <span className="text-lg md:text-2xl">Keychains</span>
                        </h3>
                        <p className="text-white/95 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mb-3 md:mb-5 mt-1">Carry Everywhere</p>
                        <Link to="/shop?category=keychains" className="bg-white text-[#d97706] font-bold text-[11px] md:text-xs px-5 py-2 rounded-full w-max shadow-sm hover:scale-105 transition-transform">
                            Shop Keychains
                        </Link>
                    </div>
                    <div className="w-[60%] h-full absolute right-0 top-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#d97706] via-[#d97706]/50 to-transparent w-16 z-10"></div>
                        <img src="/promo-images/promo_keychain_1784372100478.webp" alt="Cute Keychains" className="w-full h-full object-cover" width="600" height="400" loading="lazy" decoding="async" />
                    </div>
                </div>

            </div>
        </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="py-10 md:py-16 bg-[#ede9f6]">
          <div className="container-custom">
               <Reveal>
                 <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                      <h2 className="text-[22px] md:text-[28px] font-heading font-bold text-[#0f172a] tracking-tight capitalize">Just Landed</h2>
                      <Link to="/category/new-arrivals" className="text-[#e11d48] font-semibold text-[13px] md:text-sm flex items-center gap-1 hover:underline transition-colors">
                          See All <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                 </div>
               </Reveal>

               <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-4 md:gap-6 xl:gap-8 3xl:gap-10">
                   {newArrivals.map((product, i) => (
                       <Reveal key={product.id} delay={i * 100} className={i < 4 ? "" : i === 4 ? "hidden xl:block" : i === 5 ? "hidden 2xl:block" : "hidden 4xl:block"}>
                         <div className="group block">
                           <ProductCard 
                               product={product} 
                               toggleWishlist={toggleWishlist} 
                               isInWishlist={isInWishlist} 
                           />
                         </div>
                       </Reveal>
                   ))}
               </div>
          </div>
      </section>

      {/* ================= PRICE STORE ================= */}
      <section className="py-8 md:py-12 bg-white">
          <div className="container-custom max-w-sm md:max-w-md mx-auto">
              <div className="bg-[#fffcf5] p-3 md:p-4 rounded-[20px] border-2 border-[#fef3c7] shadow-sm relative">
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                      {/* Block 1 */}
                      <Link to="/shop?maxPrice=99" className="bg-[#e11d48] rounded-[16px] p-4 flex flex-col items-center justify-center text-center aspect-[5/4] shadow-inner transform transition-transform hover:scale-[1.02]">
                          <span className="text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-0.5">Under</span>
                          <span className="text-yellow-400 font-heading font-bold text-3xl md:text-4xl leading-none">₹99</span>
                      </Link>
                      {/* Block 2 */}
                      <Link to="/shop?sale=true" className="bg-[#e11d48] rounded-[16px] p-4 flex flex-col items-center justify-center text-center aspect-[5/4] shadow-inner transform transition-transform hover:scale-[1.02]">
                          <span className="text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-0.5">Flat</span>
                          <span className="text-yellow-400 font-heading font-bold text-3xl md:text-4xl leading-none">80<span className="text-xl md:text-2xl">%</span></span>
                          <span className="text-white font-bold text-[9px] md:text-[10px] tracking-widest uppercase mt-0.5">Off</span>
                      </Link>
                      {/* Block 3 */}
                      <Link to="/shop?maxPrice=199" className="bg-[#e11d48] rounded-[16px] p-4 flex flex-col items-center justify-center text-center aspect-[5/4] shadow-inner transform transition-transform hover:scale-[1.02]">
                          <span className="text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-0.5">Under</span>
                          <span className="text-yellow-400 font-heading font-bold text-3xl md:text-4xl leading-none">₹199</span>
                      </Link>
                      {/* Block 4 */}
                      <Link to="/shop?maxPrice=499" className="bg-[#e11d48] rounded-[16px] p-4 flex flex-col items-center justify-center text-center aspect-[5/4] shadow-inner transform transition-transform hover:scale-[1.02]">
                          <span className="text-white font-bold text-[10px] md:text-xs tracking-widest uppercase mb-0.5">Under</span>
                          <span className="text-yellow-400 font-heading font-bold text-3xl md:text-4xl leading-none">₹499</span>
                      </Link>
                  </div>
                  
                  {/* Center Badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-[#0ea5e9] border-[3px] border-white rounded-[10px] px-3.5 md:px-4 py-1.5 md:py-2 shadow-md transform -rotate-2">
                          <span className="block text-white font-heading font-black text-[13px] md:text-sm leading-[1.1] text-center tracking-wide" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>PRICE<br/>STORE</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ================= BUDGET BAZAAR ================= */}
      <section className="w-full bg-[#fde047] py-8 md:py-12">
          <div className="container-custom">
              {/* Title Banner */}
              <div className="flex justify-center mb-6 md:mb-8">
                  <div className="relative inline-block bg-[#064e3b] px-8 md:px-12 py-1.5 md:py-2 pr-6 shadow-md" style={{ clipPath: 'polygon(16px 0, 100% 0, 100% 100%, 16px 100%, 0 50%)' }}>
                      <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                      <h2 className="text-white font-bold text-xl md:text-2xl tracking-widest text-center ml-2 pt-0.5 uppercase">
                          BUDGET BAZAAR
                      </h2>
                  </div>
              </div>

                {/* Grid */}
                <div ref={budgetScrollRef} className="grid grid-rows-2 grid-flow-col auto-cols-[125px] md:auto-cols-[150px] gap-2.5 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 md:px-2 max-w-5xl mx-auto">
                    {budgetGridItems.map((item, idx) => (
                        <Link key={idx} to={item.id ? `/product/${item.id}` : "/shop"} className="snap-start relative aspect-[3/4] rounded-[16px] overflow-hidden group shadow-sm block">
                          <img src={item.img} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5 md:p-3">
                              <span className="text-white/90 font-medium text-[9px] md:text-[10px] leading-tight drop-shadow-md">Under</span>
                              <span className="text-white font-bold text-lg md:text-xl leading-none mb-0.5 drop-shadow-md">₹{item.price || item.defaultPrice}</span>
                              <span className="text-white font-bold text-[10px] md:text-xs truncate drop-shadow-md">{item.title}</span>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* ================= BESTSELLERS ================= */}
      <section className="py-12 md:py-16 bg-stone-50">
          <div className="container-custom">
               <Reveal>
                   <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                       <h2 className="text-[22px] md:text-[28px] font-heading font-bold text-[#0f172a] tracking-tight">Bestsellers</h2>
                       <Link to="/shop" className="text-[#e11d48] font-semibold text-[13px] md:text-sm flex items-center gap-1 hover:underline transition-colors">
                          See All <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                 </div>
               </Reveal>

               <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-4 md:gap-8 xl:gap-10 3xl:gap-12">
                   {bestsellers.map((product, i) => (
                       <Reveal key={product.id} delay={i * 100} className={i < 4 ? "" : i === 4 ? "hidden xl:block" : i === 5 ? "hidden 2xl:block" : "hidden 4xl:block"}>
                         <Link to={getProductUrl(product)} className="group block">
                           <ProductCard 
                               product={product} 
                               toggleWishlist={toggleWishlist} 
                               isInWishlist={isInWishlist} 
                           />
                         </Link>
                       </Reveal>
                   ))}
               </div>
               
          </div>
      </section>

      {/* ================= BRAND HIGHLIGHT / HUM KARKE DIKHATE HAIN ================= */}
      {settings.home_craftsmanship_image && (
          <section className="py-12 bg-white">
              <div className="container-custom">
                  <Link 
                      to={settings.home_craftsmanship_link || "/shop"} 
                      className="col-span-1 md:col-span-2 relative block w-full overflow-hidden bg-stone-50 rounded-md shadow-sm aspect-square md:aspect-[24/7]"
                  >
                        <picture>
                            <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(settings.home_craftsmanship_image, { width: 1400, quality: 75 })} />
                            <img 
                                src={getOptimizedImageUrl(settings.home_craftsmanship_image_mobile || settings.home_craftsmanship_image, { width: 600, quality: 70 })} 
                                alt="The Art of Embroidery" 
                                width={1400}
                                height={400}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </picture>
                  </Link>
              </div>
          </section>
      )}

      {/* ================= PREMIUM COLLECTION ================= */}
      <section className="py-12 md:py-16 bg-white">
          <div className="container-custom">
               {/* Premium Banner */}
               {settings.home_premium_banner_image && (
                   <div className="relative w-full aspect-[21/9] md:aspect-[24/7] overflow-hidden bg-stone-50 mb-12 shadow-2xl">
                        <picture>
                            <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(settings.home_premium_banner_image, { width: 1400, quality: 75 })} />
                            <img 
                                src={getOptimizedImageUrl(settings.home_premium_banner_image_mobile || settings.home_premium_banner_image, { width: 600, quality: 70 })} 
                                alt="Premium Collection Banner" 
                                width={1400}
                                height={500}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        </picture>
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12">
                            <Link to={settings.home_premium_banner_link || "/shop"} className="inline-block px-8 py-3 md:px-12 md:py-4 bg-stone-50 text-stone-900 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-stone-200 transition-colors shadow-xl rounded-sm">
                                Explore Collection
                            </Link>
                        </div>
                   </div>
               )}

               <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-0">
                    <h2 className="text-[22px] md:text-[28px] font-heading font-bold text-[#0f172a] tracking-tight">Premium Embroidery</h2>
                    <Link to="/shop" className="text-[#e11d48] font-semibold text-[13px] md:text-sm flex items-center gap-1 hover:underline transition-colors">
                        See All <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-4 md:gap-8 xl:gap-10 3xl:gap-12">
                   {premiumProducts.map((product, i) => (
                       <Reveal key={product.id} delay={i * 100} className={i < 4 ? "" : i === 4 ? "hidden xl:block" : i === 5 ? "hidden 2xl:block" : "hidden 4xl:block"}>
                         <Link to={getProductUrl(product)} className="group block bg-white rounded-2xl p-2 md:p-3 hover:shadow-xl transition-shadow duration-500">
                             <ProductCard 
                                 product={product} 
                                 toggleWishlist={toggleWishlist} 
                                 isInWishlist={isInWishlist} 
                             />
                         </Link>
                       </Reveal>
                   ))}
               </div>
          </div>
      </section>

      {/* ================= CUSTOMER REVIEWS ================= */}
      <section className="py-16 bg-stone-50 border-t border-stone-200">
          <div className="container-custom">
               <div className="flex flex-col items-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-blue-900 uppercase tracking-widest text-center">Customer Reviews</h2>
                    <p className="text-stone-500 text-sm mt-2 font-medium tracking-wide">WHAT OUR CLIENTS SAY</p>
                    <div className="w-24 h-1 bg-blue-900 mt-4"></div>
               </div>

               <div className="relative px-4 md:px-12">
                   {/* Navigation Buttons */}
                   <button 
                       onClick={() => scrollReviews('left')}
                       className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-stone-600 hover:text-blue-900 hover:scale-110 transition-all z-10"
                   >
                       <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                       onClick={() => scrollReviews('right')}
                       className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-stone-600 hover:text-blue-900 hover:scale-110 transition-all z-10"
                   >
                       <ChevronRight className="w-6 h-6" />
                   </button>

                   {/* Reviews Container */}
                   <div 
                       ref={reviewScrollRef}
                       className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 px-2 no-scrollbar snap-x snap-mandatory"
                       style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                   >
                       {REVIEWS.map((review) => (
                           <div 
                               key={review.id} 
                               className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-stone-100 w-[300px] md:w-[360px] shrink-0 snap-center flex flex-col"
                           >
                               <div className="flex items-center gap-4 mb-4">
                                   <div className="w-11 h-11 rounded-full shrink-0 bg-rose-900 flex items-center justify-center text-white font-bold text-lg">
                                       {review.name.charAt(0)}
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-stone-900">{review.name}</h4>
                                       <div className="flex text-yellow-400 gap-0.5 mt-1">
                                           {[...Array(review.rating)].map((_, i) => (
                                               <Star key={i} className="w-3 h-3 fill-current" />
                                           ))}
                                       </div>
                                   </div>
                               </div>
                               <Quote className="w-8 h-8 text-stone-200 mb-2 shrink-0" />
                               <p className="text-stone-600 text-sm leading-relaxed italic flex-1">
                                   "{review.text}"
                               </p>
                           </div>
                       ))}
                   </div>
               </div>
          </div>
      </section>

      {/* ================= FAQ SECTION FOR AI / GEO ================= */}
      <section className="py-16 md:py-24 bg-[#fdfbf7]">
          <div className="container-custom max-w-4xl">
              <div className="text-center mb-12">
                  <span className="text-rose-700 font-bold tracking-widest uppercase text-sm mb-3 block">Got Questions?</span>
                  <h2 className="text-3xl md:text-5xl font-heading font-semibold text-black">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-6">
                  {faqSchema.mainEntity.map((faq, index) => (
                      <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-100">
                          <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-3">{faq.name}</h3>
                          <p className="text-stone-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <section className="bg-blue-900 text-white py-6">
          <div className="container-custom">
              <div className="flex flex-wrap justify-center gap-6 md:gap-16 items-center text-xs md:text-sm font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-yellow-400" />
                      <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span>Premium Quality</span>
                  </div>
              </div>
          </div>
      </section>
        </>
      )}

    </div>
  );
};

export default Home;

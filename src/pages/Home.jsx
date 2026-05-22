import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { Star, Truck, Shield, Award, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { getProductUrl } from '../utils/urlUtils';

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
    { id: 4, name: "Riya M.", rating: 5, text: "Gajra liya tha mehndi ke liye — everyone loved it! Itna detailed handwork hai ki log sochte hain asli phool hain. Definitely dubara order karungi." },
    { id: 5, name: "Neha G.", rating: 5, text: "Custom design karwaya tha rakhi ke liye, Sana ne exactly waise hi banaya jaisa maine bola tha. Gift wrapping bhi bahut sundar thi. Highly recommend!" },
    { id: 6, name: "Simran T.", rating: 5, text: "Rubber band set liya beti ke liye, itna soft aur comfortable hai. School mein sab friends ne bhi manga address. Quality ke liye price bilkul sahi hai." },
];

const Home = () => {
  const { categories } = useCategories();
  const { products, fetchProducts } = useProducts();
  const { FREE_DELIVERY_THRESHOLD } = useCart();
  const { settings } = useSettings();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const homeSlides = Array.isArray(settings.home_slides_data) && settings.home_slides_data.length > 0 
    ? settings.home_slides_data 
    : [
        {
          desktopImage: 'https://images.unsplash.com/photo-1584285406059-e9eb7b17d740?w=1600',
          mobileImage: 'https://images.unsplash.com/photo-1584285406059-e9eb7b17d740?w=800',
          link: '/shop'
        }
      ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const reviewScrollRef = useRef(null);

  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
       setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    } 
    if (distance < -minSwipeDistance) {
       setCurrentSlide((prev) => (prev - 1 + homeSlides.length) % homeSlides.length);
    }
  };

  // Autoplay only on desktop (mobile gets static hero for faster LCP)
  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) return;
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [homeSlides.length]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const dynamicCategories = useMemo(() => {
    return categories.map(cat => {
        const normalize = (str) => (str || '').toLowerCase().trim();
        const catName = normalize(cat.label);
        const productForCat = products.find(p => normalize(p.category) === catName && p.image);
        return {
            id: cat.id,
            label: cat.label,
            image: productForCat ? productForCat.image : (CATEGORY_IMAGES[catName] || "https://images.unsplash.com/photo-1616627561839-074385245eb6?q=80&w=600")
        };
    });
  }, [categories, products]);

  const { newArrivals, bestsellers, premiumProducts } = useMemo(() => {
    const newArr = products.filter(p => p.homepage_tags?.includes('new_arrival'));
    const best = products.filter(p => p.homepage_tags?.includes('bestseller'));
    const prem = products.filter(p => p.homepage_tags?.includes('premium'));

    return {
      newArrivals: newArr.length > 0 ? newArr.slice(0, 4) : products.slice(0, 4),
      bestsellers: best.length > 0 ? best.slice(0, 4) : products.slice(4, 8),
      premiumProducts: prem.length > 0 ? prem.slice(0, 4) : products.slice(0, 4)
    };
  }, [products]);

  const scrollReviews = (direction) => {
      if (reviewScrollRef.current) {
          const scrollAmount = 300;
          reviewScrollRef.current.scrollBy({
              left: direction === 'left' ? -scrollAmount : scrollAmount,
              behavior: 'smooth'
          });
      }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Embroidery By Sana",
    "url": "https://www.embroiderybysana.live",
    "logo": "https://www.embroiderybysana.live/logo.png",
    "description": "Embroidery By Sana is an Indian handmade embroidery and crochet brand specializing in personalized handmade gifts, aesthetic crochet bouquets, forever flower bouquets, and cute handmade accessories.",
    "foundingLocation": {
      "@type": "Place",
      "name": "India"
    }
  };

  return (
    <div className="font-body bg-white selection:bg-rose-900 selection:text-white">
      <h1 className="sr-only">Handmade Embroidery Gifts, Crochet Bouquets & Aesthetic Personalized Gifts India | Embroidery By Sana</h1>
      <SEO 
          title="Handmade Embroidery & Crochet Bouquet India | Personalized Gifts" 
          description="Shop handmade crochet bouquets, forever flower bouquets, personalized embroidery hoops, aesthetic handmade gifts, and cute crochet accessories online in India. Custom handmade gifts for birthdays, anniversaries & more." 
          schema={orgSchema}
      />

      {/* ================= HERO SLIDER ================= */}
      {/* Hero uses aspect-ratio for CLS prevention instead of viewport height */}
      <section 
        className="relative w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-stone-50"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
          {homeSlides.map((slide, idx) => (
              <div 
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'}`}
              >
                  <Link to={slide.link || '/shop'} className="block w-full h-full cursor-pointer">
                      <picture>
                          <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(slide.desktopImage, { width: 1600, quality: 75 })} type="image/webp" />
                          <img 
                              src={getOptimizedImageUrl(slide.mobileImage || slide.desktopImage, { width: 600, quality: 70 })} 
                              alt={`Slide ${idx + 1}`} 
                              width={800}
                              height={600}
                              className="w-full h-full object-cover"
                              loading={idx === 0 ? "eager" : "lazy"}
                              decoding={idx === 0 ? "sync" : "async"}
                              fetchPriority={idx === 0 ? "high" : "auto"}
                          />
                      </picture>
                  </Link>
              </div>
          ))}

          {/* Slider Arrows — hidden on mobile (swipe is sufficient), no backdrop-blur */}
          {homeSlides.length > 1 && (
            <>
              <button onClick={() => setCurrentSlide((prev) => (prev - 1 + homeSlides.length) % homeSlides.length)} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 text-white hidden md:flex items-center justify-center transition-all hover:scale-110 shadow-lg" aria-label="Previous slide">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => setCurrentSlide((prev) => (prev + 1) % homeSlides.length)} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 text-white hidden md:flex items-center justify-center transition-all hover:scale-110 shadow-lg" aria-label="Next slide">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
              {homeSlides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 transition-all duration-500 rounded-full ${idx === currentSlide ? 'bg-white w-10 shadow-md' : 'bg-white/40 w-3 hover:bg-white/70'}`}
                  />
              ))}
          </div>
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="py-12 md:py-16 bg-white border-b border-stone-100">
        <div className="container-custom">
            <Reveal>
              <div className="flex flex-col items-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-stone-900 text-center uppercase tracking-widest">Shop by Category</h2>
                  <div className="w-16 h-0.5 bg-stone-300 mt-4"></div>
              </div>
            </Reveal>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 justify-center gap-4 md:gap-6 pb-4 px-2 md:px-0">
                {dynamicCategories.slice(0, 14).map((category, i) => (
                    <Reveal key={category.id} delay={i * 60}>
                      <Link 
                          to={`/shop?category=${encodeURIComponent(category.label)}`}
                          className="group flex flex-col items-center gap-2"
                      >
                          <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-rose-400 transition-all duration-500 p-1 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                              <div className="w-full h-full rounded-full overflow-hidden">
                                  <img 
                                      src={getOptimizedImageUrl(category.image, { width: 200, quality: 70 })} 
                                      alt={category.label} 
                                      width={160}
                                      height={160}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                      loading="lazy"
                                      decoding="async"
                                  />
                              </div>
                          </div>
                          <span className="font-bold text-[10px] md:text-xs text-center uppercase tracking-widest text-stone-900 group-hover:text-rose-900 transition-colors break-words w-full px-1 mt-1">
                              {category.label}
                          </span>
                      </Link>
                    </Reveal>
                ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-8 text-center">
                  <Link to="/shop" className="group inline-flex items-center gap-2 px-10 py-3 border-2 border-stone-900 text-stone-900 font-bold text-xs tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-all duration-300">
                      View All Ranges
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
            </Reveal>
        </div>
      </section>

      {/* ================= SECONDARY PROMO BANNER ================= */}
      {settings.home_promo_banner_image && (
          <section className="w-full bg-stone-50">
              <Link to={settings.home_promo_banner_link || "/shop"} className="block w-full">
                  <picture className="block w-full">
                      <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(settings.home_promo_banner_image, { width: 1400, quality: 75 })} />
                      <img 
                          src={getOptimizedImageUrl(settings.home_promo_banner_image_mobile || settings.home_promo_banner_image, { width: 600, quality: 70 })} 
                          alt="Promo Banner" 
                          width={800}
                          height={400}
                          className="w-full h-auto md:h-[40vh] md:object-cover"
                          loading="lazy"
                          decoding="async"
                      />
                  </picture>
              </Link>
          </section>
      )}

      {/* ================= NEW ARRIVALS ================= */}
      <section className="py-12 md:py-16 bg-stone-50">
          <div className="container-custom">
               <Reveal>
                 <div className="flex flex-col items-center mb-10">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-blue-900 uppercase tracking-widest text-center">New Arrivals</h2>
                      <div className="w-24 h-1 bg-blue-900 mt-4"></div>
                 </div>
               </Reveal>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                   {newArrivals.map((product, i) => (
                       <Reveal key={product.id} delay={i * 100}>
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
               
               <Reveal delay={200}>
                 <div className="mt-10 text-center">
                      <Link to="/shop" className="group inline-flex items-center gap-2 px-10 py-3 bg-blue-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-blue-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
                          View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </div>
               </Reveal>
          </div>
      </section>

      {/* ================= PREMIUM COLLECTIONS (Masonry) ================= */}
      <section className="py-12 md:py-16 bg-white">
          <div className="container-custom">
              <div className="flex flex-col items-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-blue-900 uppercase tracking-widest text-center">Premium Collections</h2>
                    <div className="w-24 h-1 bg-yellow-400 mt-4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                  {/* Left Tall Image */}
                  <Link to={settings.home_masonry_1_link || "/shop"} className="relative aspect-square md:aspect-[3/4] overflow-hidden group rounded-md shadow-sm block">
                      <picture>
                          <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(settings.home_masonry_1_image, { width: 600, quality: 75 })} />
                          <img 
                              src={getOptimizedImageUrl(settings.home_masonry_1_image_mobile || settings.home_masonry_1_image, { width: 500, quality: 70 })} 
                              alt={settings.home_masonry_1_text} 
                              width={600}
                              height={800}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                              decoding="async"
                          />
                      </picture>

                  </Link>
                  
                  {/* Right Stacked Images */}
                  <div className="grid grid-rows-2 gap-4 md:gap-6">
                      <Link to={settings.home_masonry_2_link || "/shop"} className="relative w-full h-full min-h-[250px] overflow-hidden group rounded-md shadow-sm block">
                          <picture>
                              <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(settings.home_masonry_2_image, { width: 600, quality: 75 })} />
                              <img 
                                  src={getOptimizedImageUrl(settings.home_masonry_2_image_mobile || settings.home_masonry_2_image, { width: 500, quality: 70 })} 
                                  alt={settings.home_masonry_2_text} 
                                  width={600}
                                  height={400}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  loading="lazy"
                                  decoding="async"
                              />
                          </picture>

                      </Link>
                      <Link to={settings.home_masonry_3_link || "/shop"} className="relative w-full h-full min-h-[250px] overflow-hidden group rounded-md shadow-sm block">
                          <picture>
                              <source media="(min-width: 768px)" srcSet={getOptimizedImageUrl(settings.home_masonry_3_image, { width: 600, quality: 75 })} />
                              <img 
                                  src={getOptimizedImageUrl(settings.home_masonry_3_image_mobile || settings.home_masonry_3_image, { width: 500, quality: 70 })} 
                                  alt={settings.home_masonry_3_text} 
                                  width={600}
                                  height={400}
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                  loading="lazy"
                                  decoding="async"
                              />
                          </picture>

                      </Link>
                  </div>
              </div>
          </div>
      </section>

      {/* ================= BESTSELLERS ================= */}
      <section className="py-12 md:py-16 bg-stone-50">
          <div className="container-custom">
               <Reveal>
                 <div className="flex flex-col items-center mb-10">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-blue-900 uppercase tracking-widest text-center">Bestsellers</h2>
                      <div className="w-24 h-1 bg-blue-900 mt-4"></div>
                 </div>
               </Reveal>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                   {bestsellers.map((product, i) => (
                       <Reveal key={product.id} delay={i * 100}>
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
               
               <Reveal delay={200}>
                 <div className="mt-10 text-center">
                      <Link to="/shop" className="group inline-flex items-center gap-2 px-10 py-3 bg-blue-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-blue-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
                          View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                  </div>
               </Reveal>
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
      <section className="py-12 md:py-16 bg-stone-900 text-white">
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

               <div className="flex flex-col items-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white uppercase tracking-widest text-center">Premium Embroidery</h2>
                    <div className="w-24 h-1 bg-yellow-500 mt-4"></div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                   {premiumProducts.map((product, i) => (
                       <Reveal key={product.id} delay={i * 100}>
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

    </div>
  );
};

export default Home;

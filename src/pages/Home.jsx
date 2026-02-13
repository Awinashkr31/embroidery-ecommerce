import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { Star, ArrowRight, Flower, Heart, Scissors, PenTool, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';

const ScrollRevealSection = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
  
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      const currentRef = ref.current;
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, []);
  
    return (
      <section 
        ref={ref} 
        className={`${className} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        {children}
      </section>
    );
};

const Home = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSettings();

  const sliderImages = [
      settings.home_slider_image_1,
      settings.home_slider_image_2,
      settings.home_slider_image_3
  ];

  // Story Images from Settings (or defaults in context)
  const storyImage1 = settings.home_brand_story_image_1;
  const storyImage2 = settings.home_brand_story_image_2;

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px) 
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
       // Swipe Left -> Next Slide
       setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    } 
    if (isRightSwipe) {
       // Swipe Right -> Prev Slide
       setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    }
  };


  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);



  const featuredProducts = useMemo(() => {
    return products.slice(0, 8); 
  }, [products]);

  // Dynamic Categories Logic
  const dynamicCategories = useMemo(() => {
    return categories.map(cat => {
        const product = products.find(p => p.category === cat.label && (p.image || p.images?.length > 0));
        return {
            id: cat.id,
            label: cat.label,
            image: product ? (product.image || product.images[0]) : "https://images.unsplash.com/photo-1616627561839-074385245eb6?q=80&w=600&auto=format&fit=crop"
        };
    });
  }, [categories, products]);

  return (
    <div className="font-body selection:bg-rose-100 selection:text-rose-900">
      <SEO
        title="Home"
        description="Welcome to Sana's Hand Embroidery. Explore handcrafted embroidery art, clothing, and custom designs."
      />

      {/* ================= HERO SLIDER ================= */}
      <section 
        className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-stone-900"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

          {sliderImages.map((img, idx) => (
              <div 
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                  <img 
                    src={getOptimizedImageUrl(img, { width: 1200, quality: 80 })} 
                    alt={`Slide ${idx + 1}`} 
                    className="w-full h-full object-cover opacity-80"
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    decoding={idx === 0 ? "sync" : "async"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                       {idx === 0 && (
                           <div className="text-center text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 px-4">
                               <h1 className="text-5xl md:text-7xl font-heading mb-4 drop-shadow-md">{settings.home_hero_title}</h1>
                               <p className="text-xl md:text-2xl font-light tracking-wide drop-shadow-sm">{settings.home_hero_subtitle}</p>
                           </div>
                       )}
                  </div>
              </div>
          ))}

          {/* Slider Controls */}
          <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all z-10 hidden md:block"
          >
              <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all z-10 hidden md:block"
          >
              <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {sliderImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
                  />
              ))}
          </div>
      </section>

      {/* ================= DYNAMIC CATEGORIES ================= */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
            
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
                <div className="max-w-xl text-center md:text-left w-full md:w-auto">
                    <span className="text-rose-900 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Collections</span>
                    <h2 className="text-3xl md:text-4xl font-heading text-stone-900">Shop by Category</h2>
                </div>
                <Link to="/shop" className="hidden md:flex group items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                    View Full Catalog 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
                
                {dynamicCategories.map((category) => (
                    <Link 
                        key={category.id} 
                        to={`/shop?category=${encodeURIComponent(category.label)}`}
                        className="group flex flex-col items-center gap-2 md:gap-4"
                    >
                        <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-rose-200 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                            <img 
                                src={getOptimizedImageUrl(category.image, { width: 300, quality: 80 })} 
                                alt={category.label} 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                        </div>
                        
                        <div className="flex items-center gap-1 md:gap-2 text-stone-800 group-hover:text-rose-900 transition-colors">
                            <span className="font-heading font-medium text-sm md:text-lg text-center leading-tight">{category.label}</span>
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block" />
                        </div>
                    </Link>
                ))}

            </div>
            
            <div className="text-center mt-8 md:hidden">
                <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors border-b border-stone-300 pb-1">
                    View Full Catalog 
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

        </div>
      </section>

      {/* ================= CURATED ARRIVALS ================= */}
      <ScrollRevealSection className="py-12 md:py-24 bg-[#fdfbf7]">
        <div className="container-custom">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-rose-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-3 block">Fresh from the studio</span>
                <h2 className="text-3xl md:text-5xl font-heading text-stone-900 leading-tight">New Arrivals</h2>
            </div>

            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory gap-4">
                {featuredProducts.map((product, idx) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group min-w-[150px] w-[45vw] sm:w-[280px] flex-shrink-0 snap-center">
                        <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
                            <img 
                                src={getOptimizedImageUrl(product.image, { width: 400, quality: 80 })} 
                                alt={product.name} 
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Actions Overlay */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-stone-900 hover:text-rose-600 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Badges */}
                            {idx < 2 && (
                                <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg shadow-rose-500/20">
                                    New
                                </div>
                            )}
                            {product.discountPercentage > 0 && (
                                <div className="absolute bottom-4 left-4 bg-stone-900 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                                    {product.discountPercentage}% OFF
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-heading font-bold text-stone-900 text-base md:text-lg group-hover:text-rose-900 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-stone-500 text-xs md:text-sm mt-1 capitalize">{product.category}</p>
                                </div>
                                <div className="text-right pl-2">
                                    <p className="font-bold text-stone-900 text-sm md:text-base">₹{product.price.toLocaleString()}</p>
                                    {product.originalPrice > product.price && (
                                        <p className="text-[10px] md:text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

                <div className="text-center mt-10 md:mt-16">
                    <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-rose-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-rose-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        View All Products
                    </Link>
                </div>
        </div>
      </ScrollRevealSection>

      {/* ================= CATEGORY SECTIONS ================= */}
      {categories.map((category) => {
        const categoryProducts = products.filter(p => p.category === category.label).slice(0, 8);
        
        if (categoryProducts.length === 0) return null;

        return (
          <ScrollRevealSection key={category.id} className="py-12 md:py-24 bg-white even:bg-[#fdfbf7]">
            <div className="container-custom">
                
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-heading text-stone-900 leading-tight">{category.label}</h2>
                </div>

                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory gap-4">
                    {categoryProducts.map((product) => (
                        <Link key={product.id} to={`/product/${product.id}`} className="group min-w-[150px] w-[45vw] sm:w-[280px] flex-shrink-0 snap-center">
                            <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-stone-100">
                                <img 
                                    src={getOptimizedImageUrl(product.image, { width: 400, quality: 80 })} 
                                    alt={product.name} 
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Actions Overlay */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-stone-900 hover:text-rose-600 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                {product.discountPercentage > 0 && (
                                    <div className="absolute bottom-4 left-4 bg-stone-900 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                                        {product.discountPercentage}% OFF
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-heading font-bold text-stone-900 text-base md:text-lg group-hover:text-rose-900 transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="text-stone-500 text-xs md:text-sm mt-1 capitalize">{product.category}</p>
                                    </div>
                                    <div className="text-right pl-2">
                                        <p className="font-bold text-stone-900 text-sm md:text-base">₹{product.price.toLocaleString()}</p>
                                        {product.originalPrice > product.price && (
                                            <p className="text-[10px] md:text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-10 md:mt-16">
                    <Link to={`/shop?category=${encodeURIComponent(category.label)}`} className="inline-flex items-center gap-2 px-8 py-3 bg-rose-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-rose-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        View All {category.label}
                    </Link>
                </div>
            </div>
          </ScrollRevealSection>
        );
      })}

      {/* ================= STORY SECTION ================= */}
      <section className="py-16 md:py-24 bg-stone-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-rose-900/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          
          <div className="container-custom grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
              <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                  <div>
                      <span className="text-rose-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 md:mb-4 block">Our Process</span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4 md:mb-6 leading-tight">
                          Every Stitch Tells a <br/><span className="text-rose-400 font-serif italic">Beautiful Story</span>
                      </h2>
                      <p className="text-stone-400 text-base md:text-lg leading-relaxed">
                          We believe in the power of handmade. In a world of fast fashion, we slow down to create meaningful pieces that last a lifetime. Each hoop, each dress, and each design is crafted with patience and precision.
                      </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-stone-800 text-left">
                      <div className="flex gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                              <Scissors className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                              <h4 className="font-bold text-base md:text-lg mb-1">Custom Fit</h4>
                              <p className="text-stone-400 text-xs md:text-sm">Tailored specifically to your measurements and style preferences.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                              <h4 className="font-bold text-base md:text-lg mb-1">Handmade Love</h4>
                              <p className="text-stone-400 text-xs md:text-sm">Crafted by skilled artisans who pour their heart into every stitch.</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="relative mt-8 lg:mt-0">
                  <div className="aspect-square relative z-10">
                     <img 
                        src={getOptimizedImageUrl(storyImage1, { width: 600, quality: 80 })} 
                        alt="Artisan working" 
                        loading="lazy"
                        decoding="async"
                        className="w-1/2 absolute top-0 left-0 rounded-2xl shadow-2xl border-4 border-stone-800 hover:scale-105 transition-transform duration-500 z-20"
                     />
                     <img 
                        src={getOptimizedImageUrl(storyImage2, { width: 600, quality: 80 })} 
                        alt="Finished embroidery" 
                        loading="lazy"
                        decoding="async"
                        className="w-2/3 absolute bottom-0 right-0 rounded-2xl shadow-2xl border-4 border-stone-800 hover:scale-105 transition-transform duration-500 z-10"
                     />
                  </div>
                  {/* Decorative Circle text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-stone-700/50 rounded-full animate-spin-slow pointer-events-none" />
              </div>
          </div>
      </section>

    </div>
  );
};

export default Home;

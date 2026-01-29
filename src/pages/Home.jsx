import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Star, ArrowRight, Flower, Heart, Scissors, PenTool } from 'lucide-react';
import SEO from '../components/SEO';
import { fetchSetting } from '../utils/settingsUtils';

const Home = () => {
  const { products } = useProducts();
  
  // Default Images (Fallbacks)
  const defaultHero = "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=800&auto=format&fit=crop";
  const defaultHoop = "https://images.unsplash.com/photo-1615561021463-569d643806a6?q=80&w=1200&auto=format&fit=crop";
  const defaultBridal = "https://images.unsplash.com/photo-1546167889-0b4b5ff0afd0?q=80&w=800&auto=format&fit=crop";
  const defaultStory1 = "https://images.unsplash.com/photo-1605218427368-35b8dd98ec65?q=80&w=600&auto=format&fit=crop";
  const defaultStory2 = "https://images.unsplash.com/photo-1594913785162-e6785fdd27f2?q=80&w=600&auto=format&fit=crop";

  // State
  const [heroImage, setHeroImage] = useState(defaultHero);
  const [heroTitle, setHeroTitle] = useState("Weaving Stories in Thread");
  const [heroSubtitle, setHeroSubtitle] = useState("Timeless hand embroidery blending tradition with modern aesthetics.");
  
  const [hoopImage, setHoopImage] = useState(defaultHoop);
  const [bridalImage, setBridalImage] = useState(defaultBridal);
  const [storyImage1, setStoryImage1] = useState(defaultStory1);
  const [storyImage2, setStoryImage2] = useState(defaultStory2);

  useEffect(() => {
    const loadSettings = async () => {
        const h_image = await fetchSetting('home_hero_image');
        if (h_image) setHeroImage(h_image);
        
        const h_title = await fetchSetting('home_hero_title');
        if (h_title) setHeroTitle(h_title);
        
        const h_sub = await fetchSetting('home_hero_subtitle');
        if (h_sub) setHeroSubtitle(h_sub);

        // New Dynamic Images
        const hoop = await fetchSetting('home_category_hoop_image');
        if (hoop) setHoopImage(hoop);

        const bridal = await fetchSetting('home_category_bridal_image');
        if (bridal) setBridalImage(bridal);

        const s1 = await fetchSetting('home_brand_story_image_1');
        if (s1) setStoryImage1(s1);

        const s2 = await fetchSetting('home_brand_story_image_2');
        if (s2) setStoryImage2(s2);
    };
    loadSettings();
  }, []);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="font-body overflow-x-clip">
      <SEO
        title="Home"
        description="Welcome to Sana's Hand Embroidery. Explore handcrafted embroidery and mehndi art."
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 lg:py-32 bg-[#fdfbf7] overflow-visible">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-6 animate-in slide-in-from-left-5 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-900/10 bg-white shadow-sm text-rose-900 text-[10px] font-bold tracking-[0.2em] uppercase">
                <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                Handcrafted Perfection
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading text-stone-900 leading-tight">
                {heroTitle}
              </h1>

              <p className="text-lg text-stone-600 max-w-lg">
                {heroSubtitle}
              </p>

              <div className="flex gap-4">
                <Link to="/shop" className="btn-primary">Shop Collection</Link>
                <Link to="/custom-design" className="btn-outline">Custom Order</Link>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-stone-200/50">
                <div>
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-xs uppercase tracking-widest text-stone-500">Handmade</p>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-xs uppercase tracking-widest text-stone-500">Happy Clients</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative min-h-[50vh] flex justify-center lg:justify-end overflow-visible">
              <div className="absolute w-[120%] h-[80%] bg-stone-100 rounded-full blur-3xl opacity-60" />

              <div className="relative w-[320px] sm:w-[420px] aspect-[3/4]">
                <img
                  src={heroImage}
                  alt="Hand embroidery artwork"
                  className="w-full h-full object-cover rounded-[100px_100px_0_0] shadow-2xl"
                  loading="eager"
                />

                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl max-w-[200px] hidden sm:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-rose-50 p-2 rounded-full">
                      <Flower className="w-4 h-4 text-rose-900" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold uppercase">New In</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Spring floral collection now available.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-8 md:py-16 bg-white overflow-visible">
        <div className="container-custom">
          {/* Mobile Categories (Horizontal Scroll) */}
          <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
             <Link to="/shop?category=Hoop Art" className="flex flex-col items-center gap-2 min-w-[80px] snap-center">
               <div className="w-16 h-16 rounded-full p-[2px] border-2 border-rose-900/20">
                 <img src={hoopImage} alt="Hoop Art" className="w-full h-full rounded-full object-cover" />
               </div>
               <span className="text-xs font-medium text-center">Hoop Art</span>
             </Link>
             
             <Link to="/shop?category=Bridal" className="flex flex-col items-center gap-2 min-w-[80px] snap-center">
               <div className="w-16 h-16 rounded-full p-[2px] border-2 border-rose-900/20">
                 <img src={bridalImage} alt="Bridal" className="w-full h-full rounded-full object-cover" />
               </div>
               <span className="text-xs font-medium text-center">Bridal</span>
             </Link>

             <Link to="/custom-design" className="flex flex-col items-center gap-2 min-w-[80px] snap-center">
               <div className="w-16 h-16 rounded-full p-[2px] border-2 border-rose-900/20 bg-stone-50 flex items-center justify-center">
                 <PenTool size={20} className="text-rose-900" />
               </div>
               <span className="text-xs font-medium text-center">Custom</span>
             </Link>

             <Link to="/shop?category=Decor" className="flex flex-col items-center gap-2 min-w-[80px] snap-center">
                <div className="w-16 h-16 rounded-full p-[2px] border-2 border-rose-900/20 bg-stone-50 flex items-center justify-center">
                  <Flower size={20} className="text-rose-900" />
                </div>
                <span className="text-xs font-medium text-center">Decor</span>
             </Link>

             <Link to="/gallery" className="flex flex-col items-center gap-2 min-w-[80px] snap-center">
                <div className="w-16 h-16 rounded-full p-[2px] border-2 border-rose-900/20 bg-stone-50 flex items-center justify-center">
                  <Heart size={20} className="text-rose-900" />
                </div>
                <span className="text-xs font-medium text-center">Gallery</span>
             </Link>
          </div>

          {/* Desktop Categories (Grid) */}
          <div className="hidden md:block text-center mb-12">
            <span className="text-rose-900 text-xs uppercase tracking-[0.2em] font-bold">
              Curated Collections
            </span>
            <h2 className="text-3xl md:text-4xl font-heading text-stone-900 mt-2">
              Explore Our Artistry
            </h2>
          </div>

          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <Link to="/shop?category=Hoop Art" className="md:col-span-2 relative rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-500">
              <img
                src={hoopImage}
                alt="Hoop Art embroidery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-8">
                <h3 className="text-white text-3xl font-heading">Hoop Art</h3>
              </div>
            </Link>

            <div className="flex flex-col gap-6">
              <Link to="/shop?category=Bridal" className="relative rounded-3xl overflow-hidden min-h-[240px] hover:scale-[1.01] transition-transform duration-500">
                <img
                  src={bridalImage}
                  alt="Bridal embroidery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-heading">Bridal</h3>
                </div>
              </Link>

              <Link to="/custom-design" className="rounded-3xl bg-stone-900 text-white flex flex-col items-center justify-center p-8 min-h-[240px] hover:bg-stone-800 transition-colors">
                <PenTool className="w-8 h-8 text-rose-400 mb-4" />
                <h3 className="text-2xl font-heading">Custom Design</h3>
                <p className="text-sm text-stone-400 mt-2">Create something unique</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-8 md:py-16 bg-[#fdfbf7]">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-6 md:mb-8 px-2 md:px-0">
            <h2 className="text-2xl md:text-3xl font-heading">New Arrivals</h2>
            <Link to="/shop" className="text-xs md:text-sm uppercase tracking-wide flex items-center gap-2 text-rose-900 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: 2-Column Grid / Desktop: 4-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 md:px-0">
            {featuredProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block">
                <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden relative shadow-sm border border-stone-100 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* New Badge */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-rose-900 shadow-sm">
                    New
                  </div>
                </div>
                <h3 className="font-heading font-bold text-stone-900 truncate text-sm md:text-base group-hover:text-rose-900 transition-colors">
                  {product.name}
                </h3>
                <p className="text-stone-500 text-sm md:text-base mt-1">₹{product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BRAND STORY ================= */}
      <section className="py-20 bg-stone-900 text-white overflow-visible">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-heading mb-6">
              More Than <span className="italic font-serif text-stone-400">Thread</span>
            </h2>
            <p className="text-stone-400 mb-8">
              Each stitch carries patience, tradition, and love handcrafted in India.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Scissors className="text-rose-400" />
                <p>Tailored to your vision</p>
              </div>
              <div className="flex gap-4">
                <Heart className="text-rose-400" />
                <p>Made with love</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src={storyImage1}
              alt="Embroidery process"
              className="rounded-2xl"
            />
            <img
              src={storyImage2}
              alt="Hand stitching"
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

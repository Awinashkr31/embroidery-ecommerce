import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Star, ArrowRight, Flower, Heart, Scissors, PenTool } from 'lucide-react';
import SEO from '../components/SEO';

const Home = () => {
  const { products } = useProducts();

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

              <h1 className="text-5xl lg:text-7xl font-heading text-stone-900 leading-tight">
                Weaving <br />
                <span className="italic text-rose-900 font-serif">Stories</span> in Thread
              </h1>

              <p className="text-lg text-stone-600 max-w-lg">
                Timeless hand embroidery blending tradition with modern aesthetics.
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
                  src="https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800"
                  alt="Hand embroidery artwork"
                  className="w-full h-full object-contain rounded-[100px_100px_0_0] shadow-2xl"
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
      <section className="py-16 bg-white overflow-visible">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-rose-900 text-xs uppercase tracking-[0.2em] font-bold">
              Curated Collections
            </span>
            <h2 className="text-3xl md:text-4xl font-heading text-stone-900 mt-2">
              Explore Our Artistry
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/shop?category=Hoop Art" className="md:col-span-2 relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1615561021463-569d643806a6?w=1200"
                alt="Hoop Art embroidery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-end p-8">
                <h3 className="text-white text-3xl font-heading">Hoop Art</h3>
              </div>
            </Link>

            <div className="flex flex-col gap-6">
              <Link to="/shop?category=Bridal" className="relative rounded-3xl overflow-hidden min-h-[240px]">
                <img
                  src="https://images.unsplash.com/photo-1546167889-0b4b5ff0afd0?w=800"
                  alt="Bridal embroidery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-heading">Bridal</h3>
                </div>
              </Link>

              <Link to="/custom-design" className="rounded-3xl bg-stone-900 text-white flex flex-col items-center justify-center p-8 min-h-[240px]">
                <PenTool className="w-8 h-8 text-rose-400 mb-4" />
                <h3 className="text-2xl font-heading">Custom Design</h3>
                <p className="text-sm text-stone-400 mt-2">Create something unique</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-16 bg-[#fdfbf7]">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-heading">New Arrivals</h2>
            <Link to="/shop" className="text-sm uppercase tracking-wide flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="block">
                <div className="aspect-[4/5] bg-white rounded-2xl flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-3 font-heading font-bold truncate">{product.name}</h3>
                <p className="text-stone-500">₹{product.price.toLocaleString()}</p>
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
              src="https://images.unsplash.com/photo-1605218427368-35b8dd98ec65?w=600"
              alt="Embroidery process"
              className="rounded-2xl"
            />
            <img
              src="https://images.unsplash.com/photo-1594913785162-e6785fdd27f2?w=600"
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

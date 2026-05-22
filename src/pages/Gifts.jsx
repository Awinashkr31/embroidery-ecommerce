import React, { useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductCard as ProductCardWithVariants } from '../components/ProductCard';
import SEO from '../components/SEO';
import { Gift, Heart, Sparkles, Star, ArrowRight, Truck, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const slugify = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const Gifts = () => {
    const { products, fetchProducts, loading } = useProducts();

    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0);
    }, [fetchProducts]);

    const allFilteredProducts = useMemo(() => {
        let flattened = [];
        products.forEach(prod => {
            const validVariants = prod.variants?.filter(v => v.color && v.images && v.images.length > 0) || [];
            if (validVariants.length > 0) {
                validVariants.forEach(v => {
                    flattened.push({
                        ...prod,
                        uniqueId: `${prod.id}-${slugify(v.color)}`,
                        preselectedVariant: v,
                        price: v.price ? Number(v.price) : prod.price,
                        randomOrder: Math.random(),
                    });
                });
            } else {
                flattened.push({
                    ...prod,
                    uniqueId: prod.id,
                    preselectedVariant: null,
                    randomOrder: Math.random(),
                });
            }
        });
        return flattened.sort((a, b) => a.randomOrder - b.randomOrder);
    }, [products]);

    // Curated Collections
    const trendingGifts = allFilteredProducts.filter(p => 
        p.category?.toLowerCase().includes('bouquet') || 
        p.category?.toLowerCase().includes('crochet') ||
        p.name.toLowerCase().includes('flower')
    ).slice(0, 8); // Showing 8 for slider

    const personalizedGifts = allFilteredProducts.filter(p => 
        p.category?.toLowerCase().includes('hoop') || 
        p.category?.toLowerCase().includes('embroidery')
    ).slice(0, 4);

    const under999 = allFilteredProducts.filter(p => p.price < 999).slice(0, 4);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-[#fdfbf7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d6336c]"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-body selection:bg-rose-100 selection:text-[#d6336c]">
            <SEO 
                title="Unique Handmade Gifts for Girlfriend, Anniversary & Birthdays | Embroidery By Sana"
                description="Shop unique, handmade crochet bouquets & personalized embroidery gifts in India. The perfect romantic gift for your girlfriend, wife, or best friend."
                url="https://www.embroiderybysana.live/gifts"
            />
            
            {/* Hero Section */}
            <div className="pt-20 md:pt-32 pb-8 md:pb-16 bg-[#fffaf3] overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        {/* Mobile Image */}
                        <div className="w-full md:hidden relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg mt-4">
                            <img src="/hero-gift.png" alt="Handmade Crochet Bouquet" className="absolute inset-0 w-full h-full object-cover" />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left px-4 md:px-0">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-stone-200 mb-6 mx-auto md:mx-0 w-fit text-[#d6336c] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> Premium Gifting
                            </div>
                            <h1 className="text-3xl md:text-[56px] leading-[1.15] font-heading font-bold text-stone-900 mb-4 md:mb-6">
                                Give them something that <span className="text-[#d6336c] italic">lasts forever.</span>
                            </h1>
                            <p className="text-stone-600 text-[15px] md:text-base leading-relaxed max-w-lg mx-auto md:mx-0 mb-8">
                                Real flowers wilt. Our handmade crochet bouquets and custom embroidery hoops are aesthetic keepsakes they'll cherish for a lifetime.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <a href="#trending" className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-[#d6336c] hover:bg-rose-700 text-white rounded-full text-[15px] md:text-base font-semibold transition-transform hover:-translate-y-1 shadow-[0_8px_20px_rgba(214,51,108,0.25)] flex justify-center items-center gap-2">
                                    Shop Best Gifts <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                            
                            {/* High Conversion Elements */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-8 pt-6 border-t border-stone-200/60">
                                <div className="flex items-center gap-1.5 text-xs md:text-sm text-stone-600 font-medium">
                                    <Truck className="w-4 h-4 text-[#d6336c]" /> Free Shipping
                                </div>
                                <div className="flex items-center gap-1.5 text-xs md:text-sm text-stone-600 font-medium">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9/5 Reviews
                                </div>
                                <div className="flex items-center gap-1.5 text-xs md:text-sm text-stone-600 font-medium">
                                    <ShieldCheck className="w-4 h-4 text-[#d6336c]" /> Secure Checkout
                                </div>
                            </div>
                        </div>

                        {/* Desktop Image */}
                        <div className="hidden md:block w-full md:w-1/2 relative rounded-[32px] overflow-hidden min-h-[520px] shadow-2xl">
                            <img src="/hero-gift.png" alt="Beautiful crochet bouquet" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                    
                    {/* Category Chips (Mobile: horizontal scroll, Desktop: flex wrap) */}
                    <div className="mt-8 md:mt-12 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-4 px-4 md:px-0 md:flex-wrap md:justify-center">
                        <a href="#trending" className="snap-start shrink-0 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[13px] md:text-sm font-medium text-stone-700 hover:border-[#d6336c] hover:text-[#d6336c] transition-colors shadow-sm">Trending Gifts</a>
                        <a href="#personalized" className="snap-start shrink-0 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[13px] md:text-sm font-medium text-stone-700 hover:border-[#d6336c] hover:text-[#d6336c] transition-colors shadow-sm">Personalized</a>
                        <a href="#budget" className="snap-start shrink-0 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[13px] md:text-sm font-medium text-stone-700 hover:border-[#d6336c] hover:text-[#d6336c] transition-colors shadow-sm">Under ₹999</a>
                        <Link to="/shop" className="snap-start shrink-0 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-[13px] md:text-sm font-medium text-stone-700 hover:border-[#d6336c] hover:text-[#d6336c] transition-colors shadow-sm">View All Gifts</Link>
                    </div>
                </div>
            </div>

            {/* Trending Gifts Section */}
            <section id="trending" className="scroll-mt-24 py-12 md:py-20 bg-white">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 px-4 md:px-0">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-[#d6336c] mb-3">
                                <Heart className="w-5 h-5 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-widest">Most Loved</span>
                            </div>
                            <h2 className="text-[26px] md:text-4xl font-heading font-bold text-stone-900 mb-3">Trending Today</h2>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                                Highly requested aesthetic gifts that are flying off the shelves this week.
                            </p>
                        </div>
                        <Link to="/shop?category=crochet" className="text-[13px] md:text-sm font-bold text-[#d6336c] hover:text-rose-700 uppercase tracking-widest shrink-0 hidden md:flex items-center gap-1 group">
                            Shop All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    {/* Mobile Horizontal Slider / Desktop Grid */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-8 px-4 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
                        {trendingGifts.map(product => (
                            <div key={product.uniqueId} className="snap-start shrink-0 w-[60vw] max-w-[240px] md:w-auto md:max-w-none">
                                <ProductCardWithVariants product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Personalized Gifts Section */}
            <section id="personalized" className="scroll-mt-24 py-12 md:py-20 bg-gradient-to-b from-[#fff7f8] to-[#ffffff]">
                <div className="container-custom px-4 md:px-0">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-[#d6336c] mb-3">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-widest">Custom Made</span>
                            </div>
                            <h2 className="text-[26px] md:text-4xl font-heading font-bold text-stone-900 mb-3">Personalized For You</h2>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                                Capture your most precious memories in thread. Custom hand-embroidery hoops make the perfect anniversary gift.
                            </p>
                        </div>
                        <Link to="/custom-design" className="text-[13px] md:text-sm font-bold text-[#d6336c] hover:text-rose-700 uppercase tracking-widest shrink-0 hidden md:flex items-center gap-1 group">
                            Request Custom Design <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                        {personalizedGifts.map(product => (
                            <ProductCardWithVariants key={product.uniqueId} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Budget Section */}
            <section id="budget" className="scroll-mt-24 py-12 md:py-20 bg-[#fffaf3]">
                <div className="container-custom px-4 md:px-0">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-[#d6336c] mb-3">
                                <Gift className="w-5 h-5 fill-current" />
                                <span className="text-xs font-bold uppercase tracking-widest">Affordable Luxury</span>
                            </div>
                            <h2 className="text-[26px] md:text-4xl font-heading font-bold text-stone-900 mb-3">Gifts Under ₹999</h2>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                                Thoughtful, cute handmade accessories that won't break the bank. Perfect for small surprises.
                            </p>
                        </div>
                        <Link to="/shop" className="text-[13px] md:text-sm font-bold text-[#d6336c] hover:text-rose-700 uppercase tracking-widest shrink-0 hidden md:flex items-center gap-1 group">
                            Shop All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                        {under999.map(product => (
                            <ProductCardWithVariants key={product.uniqueId} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Urgency / Trust Banner */}
            <section className="py-12 bg-white border-t border-stone-100">
                <div className="container-custom text-center">
                    <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2">
                            <Clock className="w-8 h-8 text-[#d6336c]" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-heading font-bold text-stone-900">Don't wait until the last minute!</h3>
                        <p className="text-stone-600 text-sm md:text-base">
                            Our handmade products take time to craft. Order today to ensure timely delivery for your special occasion.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Gifts;

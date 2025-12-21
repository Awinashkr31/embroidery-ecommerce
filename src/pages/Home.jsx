import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { Star, ArrowRight, Flower, Sparkles, ShoppingBag, Scissors } from 'lucide-react';
import SEO from '../components/SEO';

const Home = () => {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { addToast } = useToast();
    
    // Get top 3 featured products
    const featuredProducts = products.slice(0, 3);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements[0].value;
        
        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);
                
            if (error) {
                if (error.code === '23505') { // Unique violation
                    addToast('You are already subscribed!', 'info');
                } else {
                    throw error;
                }
            } else {
                addToast('Thank you for subscribing! We\'ll keep you updated.', 'success');
                e.target.reset();
            }
        } catch (err) {
            console.error('Newsletter error:', err);
            addToast('Failed to subscribe. Please try again.', 'error');
        }
    };

    return (
        <div className="bg-stone-50/50 font-body">
            <SEO 
                title="Home" 
                description="Welcome to Sana's Hand Embroidery. Explore our collection of handcrafted designs and traditional Mehndi art." 
            />
            {/* Hero Section - Magazine Style */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden py-24" data-id="hero-section">
                 {/* Background Elements */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-rose-50/40 -skew-x-12 translate-x-1/4 z-0"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
                        {/* Text Content */}
                        <div className="lg:col-span-5 space-y-10 animate-in slide-in-from-left-8 duration-1000">
                             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-900/10 bg-white shadow-sm text-rose-900 text-xs font-bold tracking-widest uppercase">
                                <Star className="w-3 h-3 fill-current" />
                                Handcrafted Perfection
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-heading font-bold text-stone-900 leading-[1.1] tracking-tight">
                                Weaving <br/>
                                <span className="text-rose-900 italic font-serif pr-4">Stories</span> <br/>
                                in Thread.
                            </h1>
                            
                            <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                                Discover the timeless art of modern hand embroidery suitable for every occasion. Experience the blend of tradition and contemporary fashion.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-5 pt-2">
                                <Link to="/shop" className="group inline-flex items-center justify-center px-8 py-4 bg-stone-900 text-white rounded-full font-bold tracking-wide hover:bg-rose-900 transition-all shadow-xl hover:shadow-rose-900/20 transform hover:-translate-y-1">
                                    Shop Collection
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/custom-design" className="inline-flex items-center justify-center px-8 py-4 bg-white border border-stone-200 text-stone-900 rounded-full font-bold tracking-wide hover:bg-stone-50 transition-colors shadow-sm hover:shadow-md">
                                    Custom Order
                                </Link>
                            </div>
                            
                            <div className="flex items-center gap-12 pt-8 border-t border-stone-200/60">
                                <div>
                                    <p className="text-3xl font-bold text-stone-900 font-heading">500+</p>
                                    <p className="text-sm text-stone-500 font-medium uppercase tracking-wide">Happy Clients</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-stone-900 font-heading">100%</p>
                                    <p className="text-sm text-stone-500 font-medium uppercase tracking-wide">Handmade</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visuals */}
                        <div className="lg:col-span-7 relative pl-4 lg:pl-12">
                            <div className="relative z-10 grid grid-cols-2 gap-6">
                                <div className="space-y-6 pt-16">
                                     <div className="rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 group">
                                        <img 
                                            src="https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=600&h=800&fit=crop" 
                                            alt="Floral Embroidery" 
                                            className="w-full h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 hover:border-rose-100 transition-colors">
                                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-5">
                                            <Flower className="w-6 h-6 text-rose-900" />
                                        </div>
                                        <h3 className="font-heading font-bold text-xl mb-2">Mehndi Art</h3>
                                        <p className="text-stone-500 mb-4 leading-relaxed">Book intricate bridal designs for your special day.</p>
                                        <Link to="/mehndi-booking" className="inline-flex items-center text-xs font-bold text-rose-900 uppercase tracking-wider hover:underline">
                                            Book Now <ArrowRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-rose-900 text-white p-8 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                        <Sparkles className="w-8 h-8 opacity-80 mb-5" />
                                        <h3 className="font-heading font-bold text-2xl mb-3">New Arrival</h3>
                                        <p className="text-rose-100 mb-6 leading-relaxed">Explore our latest summer collection featuring pastel hues.</p>
                                        <Link to="/shop" className="inline-block bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-sm font-bold transition-colors backdrop-blur-sm">
                                            View Collection
                                        </Link>
                                    </div>
                                    <div className="rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 group">
                                        <img 
                                            src="https://images.unsplash.com/photo-1594913785162-e6785fdd27f2?w=600&h=800&fit=crop" 
                                            alt="Hand Embroidery Detail" 
                                            className="w-full h-72 lg:h-96 object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Collection Strip */}
            <section className="py-32 bg-white" data-id="featured-section">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-rose-900 font-bold uppercase tracking-widest text-xs mb-3 block">Curated Excellence</span>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-stone-900 leading-tight">Featured Creations</h2>
                        </div>
                        <Link to="/shop" className="group text-stone-900 font-bold border-b-2 border-stone-200 hover:border-rose-900 pb-1 transition-colors inline-flex items-center text-lg">
                            View All Products
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredProducts.map((product, idx) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer block">
                                <div className="relative overflow-hidden rounded-[2rem] mb-6 bg-stone-100 aspect-[4/5] isolate shadow-sm hover:shadow-2xl transition-all duration-500">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Overlay Action */}
                                    <div className="absolute inset-x-6 bottom-6 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                        <button className="w-full py-4 bg-white/95 backdrop-blur text-stone-900 font-bold text-sm rounded-xl shadow-lg hover:bg-rose-900 hover:text-white transition-colors flex items-center justify-center gap-2">
                                            <ShoppingBag className="w-4 h-4" /> View Details
                                        </button>
                                    </div>
                                    {/* Badge */}
                                    {product.inStock === false && (
                                        <div className="absolute top-6 left-6 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                            Sold Out
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-1 px-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-heading font-bold text-2xl text-stone-900 group-hover:text-rose-900 transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <p className="font-bold text-xl text-stone-900 shrink-0">₹{product.price.toLocaleString()}</p>
                                    </div>
                                    <p className="text-stone-500 font-medium">{product.category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services / Story Section */}
            <section className="py-32 bg-[#FAF7F5] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#881337 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
                
                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative px-8 lg:px-0">
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white rotate-1 hover:rotate-0 transition-transform duration-700">
                                <img 
                                    src="https://images.unsplash.com/photo-1605218427368-35b8dd98ec65?w=800&h=1000&fit=crop" 
                                    alt="Artisan working" 
                                    className="w-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl -z-10 opacity-60"></div>
                            <div className="absolute top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-2xl -z-10 opacity-60"></div>
                        </div>
                        
                        <div className="order-1 lg:order-2 space-y-10">
                             <div>
                                <h2 className="text-5xl font-heading font-bold text-stone-900 mb-8 leading-[1.1]">
                                    More Than Just <br/> <span className="text-rose-900 italic font-serif">Needle & Thread</span>
                                </h2>
                                <p className="text-stone-600 leading-relaxed text-lg text-justify">
                                    We believe that every stitch tells a story. Our handcrafted pieces are made with patience, passion, and precision. Whether it's a custom embroidery hoop meant for a cherished memory or intricate henna designs for your special day, we stick to our roots while embracing modern aesthetics.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-900 transition-colors">
                                        <Scissors className="w-6 h-6 text-rose-900 group-hover:text-white transition-colors" />
                                    </div>
                                    <h4 className="font-heading font-bold text-xl text-stone-900 mb-3">Custom Designs</h4>
                                    <p className="text-stone-500 leading-relaxed">Personalized embroidery tailored tailored to your specific vision and style.</p>
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-900 transition-colors">
                                        <Flower className="w-6 h-6 text-rose-900 group-hover:text-white transition-colors" />
                                    </div>
                                    <h4 className="font-heading font-bold text-xl text-stone-900 mb-3">Bridal Mehndi</h4>
                                    <p className="text-stone-500 leading-relaxed">Traditional and modern henna artistry for weddings and events.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Newsletter */}
            <section className="py-32 bg-stone-900 text-white relative overflow-hidden" data-id="newsletter-section">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-800/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
                
                <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
                    <Star className="w-10 h-10 text-rose-400 mx-auto mb-8 fill-rose-900/20" />
                    <h2 className="text-5xl font-heading font-bold mb-6">Join Our Community</h2>
                    <p className="text-stone-300 mb-12 text-xl font-light leading-relaxed">
                        Subscribe to receive updates on new collections, exclusive workshops, and a daily dose of artistic inspiration directly to your inbox.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleNewsletterSubmit}>
                        <input type="email"
                            placeholder="Your email address"
                            className="flex-1 px-8 py-4 rounded-full text-stone-900 focus:outline-none focus:ring-4 focus:ring-rose-900/30 bg-white placeholder:text-stone-400 font-medium text-lg"
                            required />
                        <button type="submit"
                            className="bg-rose-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-rose-800 transition-colors shadow-2xl hover:shadow-rose-900/50 text-sm">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;

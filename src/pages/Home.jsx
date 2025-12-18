import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Scissors, Flower, Palette } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const Home = () => {
    const { products } = useProducts();
    const { addToCart } = useCart();
    
    // Get top 3 featured products
    const featuredProducts = products.slice(0, 3);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for subscribing! We'll keep you updated.");
        e.target.reset();
    };

    return (
        <div className="bg-[#fdfbf7]">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden" data-id="hero-section">
                <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left space-y-8 z-10" data-id="hero-content">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-rose-900/10 bg-rose-50 text-rose-900 text-sm font-medium tracking-wide mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Authentic Hand Embroidery
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-heading font-bold text-stone-900 leading-[1.1]" data-id="hero-title">
                            Weaving Stories <br/>
                            <span className="text-rose-900 italic">thread by thread</span>
                        </h1>
                        <p className="text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed" data-id="hero-subtitle">
                            Discover the timeless art of handcrafted embroidery and traditional mehndi designs, curated for the modern connoisseur.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4" data-id="hero-cta-buttons">
                            <Link to="/shop" className="btn-primary flex items-center justify-center gap-2" data-id="shop-now-btn">
                                Shop Collection
                            </Link>
                            <Link to="/custom-design" className="btn-outline flex items-center justify-center gap-2" data-id="custom-design-btn">
                                Custom Orders
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image / visual */}
                    <div className="relative z-10 p-4" data-id="hero-image-container">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 transform hover:rotate-0 transition-transform duration-700">
                            <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=900&fit=crop"
                                alt="Beautiful hand embroidered artwork"
                                className="w-full h-[500px] lg:h-[650px] object-cover"
                                data-id="hero-main-image" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute top-10 -left-4 bg-white p-4 rounded-xl shadow-xl transform -rotate-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300 border border-stone-100 max-w-[150px]" data-id="floating-card-1">
                            <div className="bg-rose-50 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                                <Heart className="w-5 h-5 text-rose-900" />
                            </div>
                            <p className="text-xs font-semibold text-stone-900">100% Handcrafted</p>
                            <p className="text-[10px] text-stone-500 mt-1">Made with patience</p>
                        </div>
                    </div>
                    
                    {/* Background blob */}
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-3xl z-0 pointer-events-none"></div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-24 bg-white" data-id="featured-products-section">
                <div className="container-custom">
                    <div className="text-center mb-16 max-w-2xl mx-auto" data-id="featured-header">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-stone-900 mb-6" data-id="featured-title">Signature Collections</h2>
                        <div className="h-1 w-20 bg-rose-900 mx-auto rounded-full mb-6"></div>
                        <p className="text-stone-600" data-id="featured-subtitle">Curated pieces that blend traditional artistry with contemporary aesthetics.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12" data-id="featured-products-grid">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="group" data-id={`featured-product-${product.id}`}>
                                <Link to="/shop" className="block relative overflow-hidden rounded-2xl mb-6 shadow-sm border border-stone-100">
                                    <div className="aspect-[4/5] overflow-hidden bg-stone-100">
                                        <img src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            data-id={`product-${product.id}-image`} />
                                    </div>
                                    {!product.inStock && (
                                        <div className="absolute top-4 right-4 bg-stone-900 text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide uppercase">
                                            Sold Out
                                        </div>
                                    )}
                                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="btn-primary transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Details</span>
                                     </div>
                                </Link>
                                <div className="text-center">
                                    <h3 className="font-heading text-xl font-bold text-stone-900 mb-2 group-hover:text-rose-900 transition-colors" data-id={`product-${product.id}-title`}>{product.name}</h3>
                                    <div className="flex items-center justify-center gap-2 mt-1" data-id={`product-${product.id}-price`}>
                                        <span className="font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <>
                                                <span className="text-sm text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                                <span className="text-xs font-bold text-green-600">{product.discountPercentage}% off</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16" data-id="featured-cta">
                        <Link to="/shop" className="inline-flex items-center text-stone-900 font-medium hover:text-rose-900 transition-colors tracking-wide uppercase text-sm border-b border-stone-300 hover:border-rose-900 pb-1">
                            Explore All Creations
                        </Link>
                    </div>
                </div>
            </section>

            {/* Preview: Services / About */}
            <section className="py-24 bg-[#fcfaf8]" data-id="services-preview-section">
                <div className="container-custom">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Service Cards */}
                        {[
                            { icon: Scissors, title: "Bespoke Embroidery", desc: "Custom designs tailored to your specific vision and style.", link: "/custom-design" },
                            { icon: Flower, title: "Bridal Mehndi", desc: "Intricate henna artistry for weddings and special celebrations.", link: "/mehndi-booking" },
                            { icon: Palette, title: "Artistic Workshops", desc: "Learn the craft of needlework through curated sessions.", link: "/contact" }
                        ].map((service, index) => (
                             <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow text-center group">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <service.icon className="w-8 h-8 text-rose-900" />
                                </div>
                                <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">{service.title}</h3>
                                <p className="text-stone-600 mb-6 text-sm leading-relaxed">{service.desc}</p>
                                <Link to={service.link} className="text-rose-900 text-xs font-bold uppercase tracking-widest hover:underline">Discover More</Link>
                             </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 bg-rose-900 text-white relative overflow-hidden" data-id="newsletter-section">
                 {/* Decorative circles */}
                 <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-800 rounded-full opacity-50"></div>
                 <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-rose-800 rounded-full opacity-50"></div>

                <div className="container-custom relative z-10 text-center">
                    <div className="max-w-2xl mx-auto">
                        <Sparkles className="w-8 h-8 mx-auto mb-6 text-rose-200 opacity-80" />
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6" data-id="newsletter-title">Join Our Community</h2>
                        <p className="text-rose-100 mb-10 text-lg font-light leading-relaxed" data-id="newsletter-subtitle">Be the first to know about new collection launches, exclusive workshops, and seasonal offers.</p>

                        <form className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" data-id="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <input type="email"
                                placeholder="Your email address"
                                className="flex-1 px-6 py-3.5 rounded-full text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white/95 backdrop-blur placeholder:text-stone-400"
                                data-id="newsletter-email-input"
                                required />
                            <button type="submit"
                                className="bg-white text-rose-900 px-8 py-3.5 rounded-full font-bold uppercase tracking-wide text-xs hover:bg-rose-50 transition-colors shadow-lg"
                                data-id="newsletter-submit-btn">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fdfbf7] font-body p-4">
                <SEO title="My Wishlist" description="Your saved items from Enbroidery." />
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white/80 backdrop-blur-md p-8 border border-white rounded-[2rem] shadow-xl">
                        <Heart className="w-16 h-16 text-rose-900 fill-rose-50" />
                    </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-heading font-medium text-stone-900 mb-4 text-center">Your wishlist is empty</h1>
                <p className="text-stone-500 mb-10 text-center max-w-md text-lg">Curate your personal collection of favorites. Items you heart will be saved here.</p>
                <Link to="/shop" className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-rose-900 hover:shadow-xl hover:shadow-rose-900/20 transition-all duration-300 flex items-center gap-2 group">
                    Explore Collection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-body pt-6 md:pt-12 pb-28 lg:pb-24">
            <SEO title="My Wishlist" description="Your saved items from Enbroidery." />
            <div className="container-custom">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-6 md:pb-8 mb-8 md:mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full text-rose-900 text-xs font-bold tracking-widest uppercase mb-4 border border-rose-100">
                            <Heart className="w-3.5 h-3.5 fill-rose-900" />
                            <span>Saved Items</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-medium text-stone-900 tracking-tight">
                            My Wishlist
                        </h1>
                    </div>
                    <div className="text-stone-500 font-medium">
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12">
                    {wishlist.map((product, idx) => {
                        const displayImage = product.images && product.images.length > 0
                            ? product.images[0]
                            : product.image;

                        const stockCount = product.stock_quantity !== undefined
                            ? product.stock_quantity
                            : (product.stock !== undefined ? product.stock : 0);

                        const inStock = stockCount > 0;

                        return (
                            <div 
                                key={product.id || product.wishlistItemId} 
                                className="group relative flex flex-col bg-transparent"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Image Card */}
                                <div className="relative aspect-[2/3] md:aspect-[4/5] rounded-[20px] md:rounded-3xl overflow-hidden bg-stone-100 mb-4 shrink-0 md:group-hover:-translate-y-2 md:group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500">
                                    <Link to={`/product/${product.id}`} className="absolute inset-0 z-0">
                                        <img
                                            src={displayImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    </Link>
                                    
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10 flex flex-col gap-2">
                                        <button
                                            onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                                            className="p-2.5 md:p-3 bg-white/80 backdrop-blur-md border border-white/50 rounded-full text-stone-500 hover:text-rose-600 hover:bg-white hover:shadow-lg transition-all"
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-4 md:h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Desktop Quick Add (Hover on Image) */}
                                    <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product);
                                                removeFromWishlist(product.id);
                                            }}
                                            disabled={!inStock}
                                            className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 backdrop-blur-md border ${
                                                inStock
                                                    ? 'bg-white/90 border-white/50 text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-xl'
                                                    : 'bg-stone-100/90 border-transparent text-stone-400 cursor-not-allowed'
                                            } transition-all duration-300`}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            {inStock ? 'Quick Add' : 'Sold Out'}
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1.5 px-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm md:text-base font-semibold text-stone-900 line-clamp-1 group-hover:text-rose-900 transition-colors">
                                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                                        </h3>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-sm font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Add to Cart (Visible only on mobile) */}
                                <div className="md:hidden mt-3">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                            removeFromWishlist(product.id);
                                        }}
                                        disabled={!inStock}
                                        className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                                            inStock
                                                ? 'bg-stone-900 text-white shadow-md shadow-stone-900/20'
                                                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        {inStock ? 'Add to Cart' : 'Sold Out'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;

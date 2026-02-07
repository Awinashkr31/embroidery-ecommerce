import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-warm-beige/30 font-sofia p-4">
                <div className="bg-rose-gold/10 p-8 rounded-full mb-6">
                    <Heart className="w-12 h-12 text-rose-900" />
                </div>
                <h1 className="text-2xl font-medium text-gray-800 mb-4">Your wishlist is empty</h1>
                <p className="text-gray-600 mb-8">Save items you love to revisit later.</p>
                <Link to="/shop" className="bg-rose-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-900/90 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-warm-beige/30 min-h-screen font-sofia py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-stone-900 mb-6 md:mb-8 flex items-center gap-3">
                    <Heart className="text-rose-900 fill-current w-6 h-6 md:w-8 md:h-8" />
                    My Wishlist
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {wishlist.map(product => {
                        // Helper for Image
                        const displayImage = product.images && product.images.length > 0 
                            ? product.images[0] 
                            : product.image;

                        // Helper for Stock
                        // Check multiple possible fields for stock
                        const stockCount = product.stock_quantity !== undefined 
                            ? product.stock_quantity 
                            : (product.stock !== undefined ? product.stock : 0);
                        
                        const inStock = stockCount > 0;

                        return (
                            <div key={product.id || product.wishlistItemId} className="group relative">
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-3">
                                    <Link to={`/product/${product.id}`}>
                                        <img
                                            src={displayImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeFromWishlist(product.id);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-stone-400 hover:text-rose-600 transition-colors z-10"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    
                                    {/* Quick Add Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                            removeFromWishlist(product.id);
                                        }}
                                        disabled={!inStock}
                                        className={`absolute bottom-2 right-2 left-2 md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 ${
                                            inStock
                                            ? 'bg-white text-stone-900 hover:bg-stone-50'
                                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <ShoppingBag size={14} />
                                        {inStock ? 'Add to Cart' : 'Sold Out'}
                                    </button>
                                </div>
                                
                                {/* Content */}
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 truncate leading-tight mb-0.5">
                                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                                    </h3>
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-sm font-medium text-stone-600">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
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

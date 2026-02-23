import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fdfbf7] font-body p-4">
                <SEO title="My Wishlist" description="Your saved items from Enbroidery." />
                <div className="bg-rose-50 p-8 rounded-full mb-6 animate-in zoom-in-50 duration-500">
                    <Heart className="w-12 h-12 text-rose-900" />
                </div>
                <h1 className="text-2xl font-heading font-bold text-stone-900 mb-3">Your wishlist is empty</h1>
                <p className="text-stone-600 mb-8 text-center max-w-sm">Save items you love to revisit later.</p>
                <Link to="/shop" className="px-8 py-3 bg-rose-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-rose-800 transition-all shadow-md">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen font-body pt-6 md:pt-10 pb-28 lg:pb-12">
            <SEO title="My Wishlist" description="Your saved items from Enbroidery." />
            <div className="container-custom">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-stone-900 mb-6 md:mb-8 flex items-center gap-3">
                    <Heart className="text-rose-900 fill-current w-6 h-6 md:w-7 md:h-7" />
                    My Wishlist
                    <span className="text-lg font-normal text-stone-400">({wishlist.length})</span>
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {wishlist.map(product => {
                        const displayImage = product.images && product.images.length > 0
                            ? product.images[0]
                            : product.image;

                        const stockCount = product.stock_quantity !== undefined
                            ? product.stock_quantity
                            : (product.stock !== undefined ? product.stock : 0);

                        const inStock = stockCount > 0;

                        return (
                            <div key={product.id || product.wishlistItemId} className="group relative flex flex-col">
                                {/* Image */}
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 mb-3">
                                    <Link to={`/product/${product.id}`}>
                                        <img
                                            src={displayImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </Link>
                                    {/* Remove */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-rose-600 transition-colors z-10 shadow-sm"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col gap-1 mb-2">
                                    <h3 className="text-sm font-bold text-stone-900 line-clamp-2 leading-tight">
                                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                                    </h3>
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-sm font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart — always visible (not hover-gated on mobile) */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart(product);
                                        removeFromWishlist(product.id);
                                    }}
                                    disabled={!inStock}
                                    className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                                        inStock
                                            ? 'bg-stone-900 text-white hover:bg-rose-900'
                                            : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag size={13} />
                                    {inStock ? 'Add to Cart' : 'Sold Out'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;

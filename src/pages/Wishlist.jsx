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
                    <Heart className="w-12 h-12 text-deep-rose" />
                </div>
                <h1 className="text-2xl font-medium text-gray-800 mb-4">Your wishlist is empty</h1>
                <p className="text-gray-600 mb-8">Save items you love to revisit later.</p>
                <Link to="/shop" className="bg-deep-rose text-white px-8 py-3 rounded-full font-semibold hover:bg-deep-rose/90 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-warm-beige/30 min-h-screen font-sofia py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-light text-gray-800 mb-8 flex items-center gap-3">
                    <Heart className="text-deep-rose fill-current" />
                    My Wishlist
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-800 mb-1">{product.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-deep-rose font-medium">₹{product.price.toLocaleString()}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                                            <span className="text-xs font-bold text-green-600 border border-green-200 px-1.5 rounded bg-green-50">
                                                {product.discountPercentage}% off
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        removeFromWishlist(product.id);
                                    }}
                                    disabled={!product.inStock}
                                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        product.inStock
                                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {product.inStock ? 'Move to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;

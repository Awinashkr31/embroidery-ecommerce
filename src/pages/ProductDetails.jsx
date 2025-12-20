import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../../config/supabase';
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, Share2, Star, ChevronRight, MessageSquare } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    
    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find(p => p.id === parseInt(id) || p.id === id);
            setProduct(found);
            setLoading(false);
            if (found) fetchReviews(found.id);
        }
    }, [id, products]);

    const fetchReviews = async (productId) => {
        try {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });
            
            if (data) setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const { error } = await supabase.from('reviews').insert([{
                product_id: product.id,
                ...newReview,
                status: 'pending'
            }]);

            if (error) throw error;
            addToast('Review submitted for approval!', 'success');
            setNewReview({ user_name: '', rating: 5, comment: '' });
        } catch (error) {
            console.error('Error submitting review:', error);
            addToast('Failed to submit review', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fdfbf7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fdfbf7] gap-4">
                <h2 className="text-2xl font-bold text-stone-900">Product not found</h2>
                <Link to="/shop" className="text-rose-900 hover:underline">Back to Shop</Link>
            </div>
        );
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-24 pb-20 font-body">
            <div className="container-custom">
                {/* Breadcrumb & Back */}
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-8">
                    <Link to="/shop" className="hover:text-rose-900 transition-colors flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Shop
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-stone-900 font-medium truncate">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 relative group">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            {product.discountPercentage > 0 && (
                                <span className="absolute top-4 left-4 bg-rose-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                    {product.discountPercentage}% OFF
                                </span>
                            )}
                            <button 
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-rose-50 transition-colors"
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-stone-600'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                {product.category}
                            </span>
                            {product.inStock ? (
                                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wide">
                                    In Stock
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-stone-100 text-stone-400 border border-stone-200 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-stone-900 mb-2 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating Summary */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-stone-500 font-medium">({reviews.length} reviews)</span>
                        </div>

                        <div className="flex items-end gap-3 mb-6">
                            <span className="text-3xl font-bold text-rose-900">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xl text-stone-400 line-through mb-1">
                                    ₹{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-stone-600 leading-relaxed mb-6 text-lg">
                            {product.description}
                        </p>

                        {/* Product Specifications */}
                        {product.specifications && (
                            <div className="mb-8 bg-stone-50 p-6 rounded-xl border border-stone-100">
                                <h3 className="font-heading font-bold text-stone-900 mb-3 text-lg">Product Details</h3>
                                <ul className="space-y-2">
                                    {product.specifications.split('\n').map((spec, index) => (
                                        <li key={index} className="flex items-start gap-2 text-stone-600 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-900 mt-1.5 flex-shrink-0"></span>
                                            {spec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={async () => {
                                    const success = await addToCart(product);
                                    if (success) addToast(`Added ${product.name} to cart`, 'success');
                                }}
                                disabled={!product.inStock}
                                className={`flex-1 py-4 px-8 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                                    product.inStock
                                    ? 'bg-stone-900 text-white hover:bg-rose-900 shadow-lg hover:shadow-rose-900/30 hover:-translate-y-0.5'
                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {product.inStock ? 'Add to Cart' : 'Sold Out'}
                            </button>
                            <button className="p-4 rounded-xl border-2 border-stone-200 hover:border-rose-900 hover:text-rose-900 transition-colors text-stone-500">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-stone-100">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-rose-50 rounded-lg text-rose-900">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 text-sm">Free Shipping</h4>
                                    <p className="text-xs text-stone-500">On orders over ₹499</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-rose-50 rounded-lg text-rose-900">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 text-sm">Secure Payment</h4>
                                    <p className="text-xs text-stone-500">100% secure payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-20">
                    <h2 className="text-2xl font-heading font-bold text-stone-900 mb-8 border-b border-stone-100 pb-4">Customer Reviews</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Write Review */}
                        <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm h-fit">
                            <h3 className="text-lg font-bold text-stone-900 mb-4">Write a Review</h3>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newReview.user_name}
                                        onChange={e => setNewReview({...newReview, user_name: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-900 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Your Review</label>
                                    <textarea 
                                        required
                                        value={newReview.comment}
                                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                                        className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-rose-900 outline-none"
                                        rows="4"
                                        placeholder="Tell us what you like regarding this product..."
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submittingReview}
                                    className="w-full py-3 bg-stone-900 text-white rounded-lg font-bold uppercase tracking-wide hover:bg-rose-900 transition-colors disabled:opacity-70"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                    <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                                    <p className="text-stone-500 font-medium">No reviews yet. Be the first to write one!</p>
                                </div>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-900 font-bold">
                                                    {review.user_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-stone-900 text-sm">{review.user_name}</h4>
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-stone-400">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="pt-16 border-t border-stone-100">
                        <h2 className="text-2xl font-heading font-bold text-stone-900 mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <Link key={p.id} to={`/product/${p.id}`} className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-md transition-all">
                                    <div className="aspect-[4/5] overflow-hidden bg-stone-50">
                                        <img 
                                            src={p.image} 
                                            alt={p.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-stone-900 truncate mb-1">{p.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-rose-900 font-bold">₹{p.price.toLocaleString()}</span>
                                            {p.originalPrice && (
                                                <span className="text-xs text-stone-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;

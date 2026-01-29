import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../../config/supabase';
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, Star, Award, Search, Sparkles } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    
    // Clothing Support
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    
    // Image Gallery State
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (products.length > 0) {
            const found = products.find(p => p.id === parseInt(id) || p.id === id);
            setProduct(found);
            setLoading(false);
            if (found) {
                 fetchReviews(found.id);
                 // Initialize selected image
                 setSelectedImage(found.image);
            }
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

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fdfbf7]">
                <div className="w-12 h-12 border-2 border-stone-200 border-t-rose-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fdfbf7] gap-4">
                <Search className="w-12 h-12 text-stone-300" />
                <h2 className="text-2xl font-heading text-stone-900">Product not found</h2>
                <Link to="/shop" className="text-rose-900 hover:text-rose-700 underline underline-offset-4">Return to Collection</Link>
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
        <div className="min-h-screen bg-[#fdfbf7] pt-28 pb-20 font-body selection:bg-rose-100 selection:text-rose-900">
            <div className="container-custom">
                {/* Breadcrumb - Minimal */}
                <div className="mb-8">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-stone-500 hover:text-rose-900 transition-colors text-sm font-medium tracking-wide group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-32">
                    {/* Image Section - Sticky & Elegant */}
                    <div className="relative h-fit lg:sticky lg:top-28 space-y-4">
                        <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden relative shadow-sm group">
                            <img 
                                src={selectedImage || product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            
                            {/* Floating Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-3">
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-stone-600 hover:text-rose-600 group/btn"
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    img && (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === img 
                                                ? 'border-rose-900 shadow-md opacity-100' 
                                                : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section - Clean Typography */}
                    <div className="lg:pt-4">
                        <div className="mb-6 space-y-2">
                             <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-rose-900">
                                <span>{product.category}</span>
                                {product.inStock ? (
                                    <span className="text-green-700 px-2 py-0.5 bg-green-50 rounded-full">In Stock</span>
                                ) : (
                                     <span className="text-stone-400">Sold Out</span>
                                )}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-heading font-medium text-stone-900 leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price & Rating */}
                        <div className="flex flex-col gap-6 mb-10 pb-10 border-b border-stone-200/60">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-medium text-stone-900">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-stone-400 line-through font-light">
                                            ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                        {product.discountPercentage > 0 && (
                                            <span className="text-xl font-bold text-rose-900">
                                                ({product.discountPercentage}% OFF)
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex text-amber-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'}`} />
                                    ))}
                                </div>
                                <a href="#reviews" className="text-sm text-stone-500 hover:text-rose-900 underline underline-offset-4">
                                    Read all {reviews.length} reviews
                                </a>
                            </div>

                             <p className="text-stone-600 leading-loose text-lg font-light">
                                {product.description}
                            </p>
                        </div>

                        {/* Clothing Specific: Size Selector & Details */}
                        {product.clothingInformation && (
                            <div className="mb-10 space-y-6 border-b border-stone-200/60 pb-10">
                                {/* Quick Clothing Specs */}
                                <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                                    {product.clothingInformation.gender && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-full border border-stone-200">
                                            <span className="font-bold text-xs uppercase tracking-wider text-stone-400">For</span>
                                            <span className="font-medium">{product.clothingInformation.gender}</span>
                                        </div>
                                    )}
                                    {product.clothingInformation.fabric && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-full border border-stone-200">
                                            <span className="font-bold text-xs uppercase tracking-wider text-stone-400">Material</span>
                                            <span className="font-medium">{product.clothingInformation.fabric}</span>
                                        </div>
                                    )}
                                    {product.clothingInformation.fitType && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-full border border-stone-200">
                                            <span className="font-bold text-xs uppercase tracking-wider text-stone-400">Fit</span>
                                            <span className="font-medium">{product.clothingInformation.fitType}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Size Selector */}
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Select Size</h3>
                                        <span className={`text-xs font-bold ${sizeError ? 'text-red-500 animate-pulse' : 'text-rose-900'}`}>
                                            {sizeError ? 'Please select a size' : 'Size Guide'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {Object.entries(product.clothingInformation.sizes || {})
                                            .sort((a, b) => {
                                                const order = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, '3XL': 7 };
                                                return (order[a[0]] || 99) - (order[b[0]] || 99);
                                            })
                                            .map(([size, qty]) => {
                                                const isAvailable = qty > 0;
                                                const isSelected = selectedSize === size;
                                                
                                                return (
                                                    <button
                                                        key={size}
                                                        onClick={() => {
                                                            if (isAvailable) {
                                                                setSelectedSize(size);
                                                                setSizeError(false);
                                                            }
                                                        }}
                                                        disabled={!isAvailable}
                                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full border font-bold text-sm flex items-center justify-center transition-all ${
                                                            isSelected 
                                                                ? 'bg-rose-900 border-rose-900 text-white shadow-lg scale-110' 
                                                                : isAvailable 
                                                                    ? 'bg-white border-stone-200 text-stone-900 hover:border-rose-900 hover:text-rose-900' 
                                                                    : 'bg-stone-100 border-stone-100 text-stone-300 cursor-not-allowed line-through'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-4 mb-12">
                            <div className="flex gap-4">
                                <button
                                    onClick={async () => {
                                        if (product.clothingInformation && !selectedSize) {
                                            setSizeError(true);
                                            addToast('Please select a size first', 'error');
                                            return;
                                        }
                                        const success = await addToCart({ ...product, selectedSize });
                                        if (success) addToast(`Added ${product.name} to bag`, 'success');
                                    }}
                                    disabled={!product.inStock}
                                    className={`flex-1 py-4 px-8 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                                        product.inStock
                                        ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20 hover:-translate-y-0.5'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {product.inStock ? 'Add to Bag' : 'Sold Out'}
                                </button>
                                
                                <button 
                                    onClick={async () => {
                                         if(product.inStock) {
                                            if (product.clothingInformation && !selectedSize) {
                                                setSizeError(true);
                                                addToast('Please select a size first', 'error');
                                                return;
                                            }
                                            await addToCart({ ...product, selectedSize });
                                            // Ideally navigate to checkout
                                            navigate('/cart');
                                         }
                                    }}
                                    disabled={!product.inStock}
                                    className="px-8 py-4 rounded-full border border-stone-200 font-bold uppercase tracking-widest text-sm hover:border-rose-900 hover:text-rose-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-stone-200 disabled:hover:text-stone-900"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                         {/* Value Props */}
                         <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
                                <Truck className="w-6 h-6 text-rose-900 shrink-0" />
                                <div>
                                    <h4 className="font-heading font-bold text-stone-900">Complimentary Shipping</h4>
                                    <p className="text-sm text-stone-500 mt-1">On all orders above ₹499</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
                                <Shield className="w-6 h-6 text-rose-900 shrink-0" />
                                <div>
                                    <h4 className="font-heading font-bold text-stone-900">Secure Checkout</h4>
                                    <p className="text-sm text-stone-500 mt-1">Protected by industry standards</p>
                                </div>
                            </div>
                        </div>

                         {/* Specifications */}
                        {product.specifications && (
                            <div className="mb-16">
                                <h3 className="font-heading text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-rose-900" /> details & Care
                                </h3>
                                <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                        {product.specifications.split('\n').map((spec, index) => (
                                            <li key={index} className="flex items-start gap-3 text-stone-600 bg-white p-3 rounded-lg shadow-sm border border-stone-100/50">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-900 mt-2 flex-shrink-0"></span>
                                                <span className="text-sm leading-relaxed">{spec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div id="reviews" className="border-t border-stone-200 pt-12">
                            <h3 className="font-heading text-2xl font-bold text-stone-900 mb-8">Client Reviews</h3>
                            {reviews.length === 0 ? (
                                <p className="text-stone-500 italic">No reviews yet. Be the first to share your thoughts.</p>
                            ) : (
                                <div className="space-y-8">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-rose-900 text-white flex items-center justify-center font-bold text-sm">
                                                        {review.user_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-stone-900">{review.user_name}</h4>
                                                        <span className="text-xs text-stone-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-stone-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-stone-600 leading-relaxed font-light italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-stone-200 pt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-heading font-medium text-stone-900 mb-4">You May Also Admire</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => (
                                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                                    <div className="aspect-[3/4] overflow-hidden bg-stone-100 rounded-lg mb-4">
                                        <img 
                                            src={p.image} 
                                            alt={p.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    <h3 className="text-center font-heading text-lg text-stone-900 group-hover:text-rose-900 transition-colors">{p.name}</h3>
                                    <p className="text-center text-stone-500 mt-1">₹{p.price.toLocaleString()}</p>
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

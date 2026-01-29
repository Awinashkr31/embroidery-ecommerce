import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../../config/supabase';
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, Star, Award, Search, Sparkles, Plus, Minus, ChevronDown, Share2 } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useProducts();
    const { addToCart, cart } = useCart();
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

    // Accordion State
    const [openSection, setOpenSection] = useState('description');

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Check if item is in cart (reactive to size selection for clothing)
    const isInCart = product && cart.some(item => 
        item.id === product.id && 
        (product.clothingInformation ? item.selectedSize === selectedSize : true)
    );

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

                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 xl:gap-24 mb-32">
                    {/* Image Section - Sticky & Elegant */}
                    <div className="relative h-fit lg:sticky lg:top-28 space-y-4 lg:space-y-0 lg:flex lg:gap-6">
                        {/* Desktop Thumbnails (Left Side) */}
                        {product.images && product.images.length > 1 && (
                            <div className="hidden lg:flex flex-col gap-4 w-24 flex-shrink-0 max-h-[70vh] overflow-y-auto no-scrollbar py-1">
                                {product.images.map((img, idx) => (
                                    img && (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                                (selectedImage || product.image) === img 
                                                ? 'border-blue-600 shadow-md ring-2 ring-blue-100' // Using blue as per reference image, slightly adapted
                                                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Main Image Area */}
                        <div className="flex-1 rounded-lg overflow-hidden relative shadow-sm group bg-stone-100 aspect-[4/5]">
                            
                            {/* Desktop: Single Image controlled by state */}
                            <div className="hidden lg:block w-full h-full"> 
                                <img 
                                    src={selectedImage || product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                {/* Detail Magnifier/Action Buttons could go here */}
                                <div className="absolute top-4 right-4 flex flex-col gap-3">
                                    <button 
                                        onClick={() => toggleWishlist(product)}
                                        className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-stone-600 hover:text-rose-600 group/btn"
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile: Swipeable Carousel */}
                            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar">
                                {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, idx) => (
                                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                        <img 
                                            src={img} 
                                            alt={`${product.name} - View ${idx + 1}`} 
                                            className="w-full h-full object-cover" 
                                        />
                                         {/* Floating Action within slide */}
                                        <div className="absolute top-4 right-4">
                                            <button 
                                                onClick={() => toggleWishlist(product)}
                                                className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm"
                                            >
                                                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : 'text-stone-600'}`} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Mobile Dots Indicator */}
                            {product.images && product.images.length > 1 && (
                                <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {product.images.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                // Ideally strictly we'd track scroll index, but for simple dot visual:
                                                'bg-white/80 shadow-sm'
                                                // Real active state would require scroll listener or intersection observer
                                                // For MVP just showing they exist or maybe static
                                            }`} 
                                        ></div>
                                    ))}
                                    {/* Note: React state for active slide is complex without a lib. 
                                        To keep it simple and native allow generic dots or remove if user dislikes. 
                                        Better to just show a "1/N" badge if strict tracking needed.
                                        For now, minimal dots.
                                    */} 
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Details Section - Clean Typography */}
        <div className="lg:pt-4 pl-0 lg:pl-8"> 
                        <div className="mb-8 space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-rose-900 bg-rose-50 px-3 py-1 rounded-sm">
                                    {product.category}
                                </span>
                                <button className="text-stone-400 hover:text-stone-600 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-heading font-medium text-stone-900 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4">
                                <div className="flex text-amber-500 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-stone-500 font-medium">
                                    {reviews.length} Reviews
                                </span>
                            </div>
                        </div>

                        {/* Price Area */}
                        <div className="mb-10 pb-8 border-b border-stone-100">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-3xl font-heading font-medium text-stone-900">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-stone-400 line-through font-light">
                                            ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                        {product.discountPercentage > 0 && (
                                            <span className="text-sm font-bold text-rose-900 bg-rose-50 px-2 py-1 rounded">
                                                SAVE {product.discountPercentage}%
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className="text-stone-500 text-sm">Inclusive of all taxes</p>
                        </div>
                   
                        
                        {/* Clothing Specific: Size Selector & Details */}
                        {product.clothingInformation && (
                            <div className="mb-10 space-y-6">
                                {/* Size Selector */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Select Size</h3>
                                        <button className="text-xs font-medium text-rose-900 underline underline-offset-4 hover:text-rose-700">
                                            Size Guide
                                        </button>
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
                                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-full border transition-all duration-200 flex items-center justify-center font-medium ${
                                                            isSelected 
                                                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg' 
                                                                : isAvailable 
                                                                    ? 'bg-white text-stone-900 border-stone-200 hover:border-stone-900' 
                                                                    : 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed relative overflow-hidden'
                                                        }`}
                                                    >
                                                        {size}
                                                        {!isAvailable && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-full h-[1px] bg-stone-300 rotate-45"></div>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                     {sizeError && (
                                        <p className="text-red-500 text-sm animate-pulse flex items-center gap-1">
                                           <span className="w-1 h-1 bg-red-500 rounded-full"></span> Please select a size
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-4 mb-16">
                            <div className="flex gap-4">
                                <button
                                    onClick={async () => {
                                        if (isInCart) {
                                            navigate('/cart');
                                            return;
                                        }

                                        if (product.clothingInformation && !selectedSize) {
                                            setSizeError(true);
                                            addToast('Please select a size first', 'error');
                                            return;
                                        }
                                        const success = await addToCart({ ...product, selectedSize });
                                        if (success) addToast(`Added ${product.name} to bag`, 'success');
                                    }}
                                    disabled={!product.inStock}
                                    className={`flex-1 py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs lg:text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                                        product.inStock
                                        ? isInCart 
                                            ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/10' 
                                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xl shadow-stone-900/10 hover:-translate-y-0.5'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {product.inStock ? (isInCart ? 'Go to Bag' : 'Add to Bag') : 'Sold Out'}
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
                                            navigate('/cart');
                                         }
                                    }}
                                    disabled={!product.inStock}
                                    className="px-8 py-4 rounded-full border border-stone-200 font-bold uppercase tracking-widest text-xs lg:text-sm hover:border-stone-900 hover:text-stone-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Accordion Details */}
                        <div className="border-t border-stone-200">
                            {/* Description */}
                            <div className="border-b border-stone-200">
                                <button 
                                    onClick={() => toggleSection('description')}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="font-heading font-medium text-lg text-stone-900">Description</span>
                                    {openSection === 'description' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'description' ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-stone-600 leading-relaxed font-light">
                                        {product.description}
                                    </p>
                                    
                                     {product.clothingInformation && (
                                        <div className="mt-6 p-4 bg-stone-50 rounded-lg space-y-2">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {product.clothingInformation.fabric && (
                                                    <div>
                                                        <span className="block text-xs font-bold text-stone-400 uppercase">Material</span>
                                                        <span className="text-stone-800">{product.clothingInformation.fabric}</span>
                                                    </div>
                                                )}
                                                {product.clothingInformation.fitType && (
                                                    <div>
                                                        <span className="block text-xs font-bold text-stone-400 uppercase">Fit</span>
                                                        <span className="text-stone-800">{product.clothingInformation.fitType}</span>
                                                    </div>
                                                )}
                                                {product.clothingInformation.gender && (
                                                    <div>
                                                        <span className="block text-xs font-bold text-stone-400 uppercase">Gender</span>
                                                        <span className="text-stone-800">{product.clothingInformation.gender}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details & Specifications */}
                            {product.specifications && (
                                <div className="border-b border-stone-200">
                                    <button 
                                        onClick={() => toggleSection('details')}
                                        className="w-full py-6 flex items-center justify-between text-left group"
                                    >
                                        <span className="font-heading font-medium text-lg text-stone-900">Details & Specifications</span>
                                        {openSection === 'details' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'details' ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                        <ul className="grid grid-cols-1 gap-y-3">
                                            {product.specifications.split('\n').map((spec, index) => (
                                                <li key={index} className="flex items-start gap-3 text-stone-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 flex-shrink-0"></span>
                                                    <span className="text-sm leading-relaxed">{spec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Shipping & Returns */}
                            <div className="border-b border-stone-200">
                                <button 
                                    onClick={() => toggleSection('shipping')}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="font-heading font-medium text-lg text-stone-900">Shipping & Delivery</span>
                                    {openSection === 'shipping' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'shipping' ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-4 text-sm text-stone-600">
                                        <div className="flex items-start gap-4">
                                            <Truck className="w-5 h-5 text-stone-400 shrink-0" />
                                            <div>
                                                <p className="font-medium text-stone-900">Free Standard Shipping</p>
                                                <p className="mt-1">Enjoy complimentary shipping on all orders above ₹499. Estimated delivery 5-7 business days.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Shield className="w-5 h-5 text-stone-400 shrink-0" />
                                            <div>
                                                <p className="font-medium text-stone-900">Secure Packaging</p>
                                                <p className="mt-1">All items are carefully packaged to ensure they arrive in perfect condition.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews - now cleaner */}
                        <div id="reviews" className="border-t border-stone-200 pt-12 mt-12 mb-32">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-heading text-2xl font-medium text-stone-900">Client Reviews</h3>
                                <div className="text-right">
                                    <div className="text-3xl font-heading font-bold text-stone-900">{averageRating}</div>
                                    <div className="flex text-amber-500 text-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                    <p className="text-stone-500 italic">No reviews yet. Be the first to share your thoughts.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-stone-900">{review.user_name}</h4>
                                                <span className="text-xs text-stone-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-amber-400 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-stone-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-stone-600 leading-relaxed font-light text-sm">"{review.comment}"</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { getProductUrl } from '../utils/urlUtils';

export const ProductCard = React.memo(({ product, toggleWishlist, isInWishlist, priority = false }) => {
    const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
    const { addToast } = useToast();
    const [selectedVariant, setSelectedVariant] = useState(() => {
        if (product.preselectedVariant) return product.preselectedVariant;
        const valid = (product.variants || []).filter(v => v.color && v.images && v.images.length > 0);
        if (valid.length === 1) return valid[0];
        return null;
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const hoverTimerRef = useRef(null);
    
    useEffect(() => {
        if (product.preselectedVariant) {
            setSelectedVariant(product.preselectedVariant);
        } else {
            setSelectedVariant(null);
        }
    }, [product.preselectedVariant]);

    const variants = product.variants || [];
    
    // Only consider variants that have at least one image and a color
    const validVariants = variants.filter(v => v.color && v.images && v.images.length > 0);
    const hasVariants = validVariants.length > 1;

    // Get all images for the current view
    const allImages = useMemo(() => {
        if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
            return selectedVariant.images.filter(Boolean);
        }
        let imgs = [];
        if (product.image) imgs.push(product.image);
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                if (img && !imgs.includes(img)) imgs.push(img);
            });
        }
        return imgs;
    }, [selectedVariant, product.images, product.image]);

    const hasMultipleImages = allImages.length > 1;

    // Reset index when variant changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedVariant]);

    // Auto-advance only on desktop hover (mobile auto-advance removed for INP performance)
    useEffect(() => {
        if (!hasMultipleImages || !isHovering) return;

        hoverTimerRef.current = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }, 1500);

        return () => {
            if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
        };
    }, [isHovering, hasMultipleImages, allImages.length]);

    // Touch handlers for mobile swipe
    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);
    const handleTouchMove = useCallback((e) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);
    const handleTouchEnd = useCallback(() => {
        if (!hasMultipleImages) return;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                // Swipe left → next
                setCurrentImageIndex(prev => (prev + 1) % allImages.length);
            } else {
                // Swipe right → prev
                setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
            }
        }
    }, [hasMultipleImages, allImages.length]);

    // Determine current display price
    const displayPrice = useMemo(() => {
        if (selectedVariant && selectedVariant.price) {
            return Number(selectedVariant.price);
        }
        return Number(product.price);
    }, [selectedVariant, product.price]);

    const discountAmount = useMemo(() => {
        if (!product.originalPrice || product.originalPrice <= displayPrice) return 0;
        return product.originalPrice - displayPrice;
    }, [product.originalPrice, displayPrice]);

    const productUrl = getProductUrl(product);

    const cartItem = useMemo(() => {
        if (!cart) return null;
        return cart.find(item => {
            if (item.id !== product.id) return false;
            const itemColor = item.selectedColor || null;
            const variantColor = selectedVariant?.color || null;
            const itemSize = item.selectedSize || null;
            const variantSize = selectedVariant?.size || null;
            const itemVariantId = item.variantId || null;
            const variantId = selectedVariant?.id || null;
            return itemColor === variantColor && itemSize === variantSize && itemVariantId === variantId;
        });
    }, [cart, product.id, selectedVariant]);

    return (
        <div className="h-full flex flex-col group min-w-[150px] md:min-w-0 relative">
            {/* Image Card Container */}
            <div className="relative mb-3 pt-1">
                <Link 
                    to={productUrl}
                    className="relative aspect-[1/1.15] md:aspect-[2/3] overflow-hidden bg-white rounded-[10px] border border-stone-200 block shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => { setIsHovering(false); setCurrentImageIndex(0); }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Image Stack with Crossfade */}
                    {allImages.map((img, idx) => (
                        <img
                            key={idx}
                            src={getOptimizedImageUrl(img, { width: 500, quality: 75 })}
                            alt={`${product.name} - Handmade Crochet Gift India - View ${idx + 1}`}
                            width={500}
                            height={500}
                            loading={priority && idx === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            style={{
                                transition: 'opacity 500ms ease-in-out',
                                opacity: idx === currentImageIndex ? 1 : 0,
                                zIndex: idx === currentImageIndex ? 2 : 1,
                            }}
                            className={`absolute inset-0 w-full h-full object-cover md:object-contain ${!product.inStock ? 'grayscale opacity-80' : ''}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/logo.png';
                                e.target.className = `absolute inset-0 w-full h-full object-contain p-8 opacity-50 ${!product.inStock ? 'grayscale' : ''}`;
                            }}
                        />
                    ))}

                    {/* Image Dots Indicator */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {allImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    className={`rounded-full transition-all duration-300 ${
                                        idx === currentImageIndex 
                                            ? 'w-3 h-1.5 bg-stone-700' 
                                            : 'w-1.5 h-1.5 bg-stone-300'
                                    }`}
                                    aria-label={`View image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Sold Out Overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 pointer-events-none">
                            <span className="bg-stone-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                                Sold Out
                            </span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-0 left-0 flex flex-col items-start gap-0.5 z-20">
                        {product.homepage_tags?.includes('bestseller') && (
                            <span className="bg-[#ffedd5] text-[#d97706] text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-br-lg rounded-tl-[9px] border-b border-r border-[#ffedd5]">
                                Bestseller
                            </span>
                        )}
                        {product.homepage_tags?.includes('new_arrival') && (
                            <span className="bg-[#e11d48] text-white text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-br-lg rounded-tl-[9px] shadow-sm">
                                New
                            </span>
                        )}
                        {product.homepage_tags?.includes('premium') && (
                            <span className="bg-stone-900 text-yellow-400 text-[9px] md:text-[10px] font-semibold px-2 py-0.5 rounded-br-lg rounded-tl-[9px] shadow-sm">
                                Premium
                            </span>
                        )}
                    </div>
                    
                    {/* Wishlist */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (toggleWishlist) toggleWishlist(product);
                        }}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 backdrop-blur rounded-full text-stone-400 hover:text-[#e11d48] transition-all z-30 flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,0.1)]"
                    >
                        <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isInWishlist && isInWishlist(product.id) ? 'fill-[#e11d48] text-[#e11d48]' : ''}`} />
                    </button>
                </Link>

                {/* ADD Button or Quantity Toggle (Overlapping) */}
                {cartItem ? (
                    <div className="absolute -bottom-3 right-1.5 md:-bottom-3 md:right-1.5 bg-white text-[#e11d48] font-extrabold rounded-[8px] md:rounded-[8px] border-2 border-[#e11d48] shadow-sm z-30 flex items-center justify-between min-w-[75px] md:min-w-[80px] h-[30px] md:h-[32px] overflow-hidden">
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                if (cartItem.quantity > 1) {
                                    updateQuantity(product.id, cartItem.quantity - 1, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                } else {
                                    removeFromCart(product.id, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                }
                            }}
                            className="h-full px-2 hover:bg-rose-50 transition-colors flex items-center justify-center flex-1 disabled:opacity-50"
                            disabled={isAdding}
                        >
                            <Minus className="w-3 h-3 md:w-4 md:h-4 stroke-[3]" />
                        </button>
                        <span className="text-[#e11d48] text-[13px] md:text-[15px] w-6 md:w-8 text-center bg-rose-50 h-full flex items-center justify-center border-x border-[#e11d48]/20">{cartItem.quantity}</span>
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                updateQuantity(product.id, cartItem.quantity + 1, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                            }}
                            className="h-full px-2 hover:bg-rose-50 transition-colors flex items-center justify-center flex-1 disabled:opacity-50"
                            disabled={isAdding || !product.inStock}
                        >
                            <Plus className="w-3 h-3 md:w-4 md:h-4 stroke-[3]" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsAdding(true);
                            const itemToAdd = {
                                ...product,
                                variantId: selectedVariant?.id,
                                selectedColor: selectedVariant?.color,
                                selectedSize: selectedVariant?.size,
                                price: displayPrice
                            };
                            const success = await addToCart(itemToAdd);
                            if (success) addToast('Added to bag!', 'success');
                            setIsAdding(false);
                        }}
                        disabled={!product.inStock || isAdding}
                        className="absolute -bottom-3 right-1.5 md:-bottom-3 md:right-1.5 bg-white text-[#e11d48] font-extrabold text-[13px] md:text-[14px] px-3 md:px-4 rounded-[8px] md:rounded-[8px] border-2 border-[#e11d48] shadow-sm z-30 hover:bg-rose-50 transition-colors tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[75px] md:min-w-[80px] h-[30px] md:h-[32px]"
                    >
                        {isAdding ? (
                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'ADD'
                        )}
                    </button>
                )}
            </div>

            {/* Product Info Below Image */}
            <div className="flex flex-col px-0.5 flex-1 mt-1 md:mt-2">
                {/* Price Box */}
                <div className="flex items-center gap-2">
                    <div className="bg-[#2a873b] text-white font-black text-[18px] md:text-[18px] px-2.5 md:px-3 py-0.5 md:py-1 rounded-[6px] shadow-[0_3px_0_#186326] leading-tight tracking-tight">
                        ₹{displayPrice.toLocaleString('en-IN')}
                    </div>
                    {product.originalPrice && product.originalPrice > displayPrice && (
                        <span className="text-[14px] md:text-[14px] font-medium text-slate-500 line-through decoration-slate-400">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Discount text and dashed line */}
                {product.originalPrice && product.originalPrice > displayPrice && (
                    <div className="flex items-center gap-1.5 w-full mt-2 md:mt-2.5 mb-1.5 md:mb-2">
                        <span className="text-[10px] md:text-[12px] font-bold text-[#2a873b] whitespace-nowrap">
                            ₹{discountAmount.toLocaleString('en-IN')} OFF
                        </span>
                        <div className="flex-1 border-b border-dashed border-stone-300/80 mb-0.5"></div>
                    </div>
                )}
                
                {/* Space if no discount */}
                {(!product.originalPrice || product.originalPrice <= displayPrice) && (
                    <div className="h-2"></div>
                )}

                {/* Product Name */}
                <Link to={productUrl} className="font-body font-bold text-[13px] md:text-[15px] leading-tight md:leading-[1.3] text-stone-900 hover:text-[#e11d48] transition-colors line-clamp-2 pr-1">
                    {product.name}
                </Link>

                {/* Variant Swatches (if any) */}
                {hasVariants && (
                    <div className="flex flex-wrap gap-1 mt-2" onClick={e => e.preventDefault()}>
                        {validVariants.map((variant, idx) => {
                            const isSelected = selectedVariant?.color === variant.color;
                            return (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setSelectedVariant(variant)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedVariant(variant);
                                    }}
                                    className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border transition-all focus:outline-none ${
                                        isSelected ? 'border-stone-900 ring-1 ring-stone-900 ring-offset-[1px] scale-110' : 'border-stone-300 hover:border-stone-400'
                                    }`}
                                    title={variant.color}
                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

export default ProductCard;

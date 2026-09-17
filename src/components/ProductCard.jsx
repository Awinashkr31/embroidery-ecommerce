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

    const baseProductUrl = getProductUrl(product);
    const productUrl = selectedVariant?.color ? `${baseProductUrl}?color=${encodeURIComponent(selectedVariant.color)}` : baseProductUrl;

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
        <div className="h-full flex flex-col group w-full relative bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {/* Image Container */}
            <div className="relative">
                <Link 
                    to={productUrl}
                    className="relative aspect-[4/5] overflow-hidden bg-stone-50 block"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => { setIsHovering(false); setCurrentImageIndex(0); }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Image Stack with Crossfade */}
                    {allImages.map((img, idx) => {
                        const isActive = idx === currentImageIndex;
                        return (
                            <img
                                key={idx}
                                src={getOptimizedImageUrl(img, { width: 400, quality: 80 })}
                                alt={`${product.name} - View ${idx + 1}`}
                                width={400}
                                height={500}
                                loading={priority && idx === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                style={{
                                    transition: 'opacity 300ms ease-in-out',
                                    opacity: isActive ? 1 : 0,
                                    zIndex: isActive ? 2 : 1,
                                }}
                                className={`absolute inset-0 w-full h-full object-cover ${!product.inStock ? 'grayscale opacity-80' : ''}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/logo.png';
                                    e.target.className = `absolute inset-0 w-full h-full object-contain p-8 opacity-50 ${!product.inStock ? 'grayscale' : ''}`;
                                }}
                            />
                        );
                    })}

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
                    <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-20">
                        {product.homepage_tags?.includes('bestseller') && (
                            <span className="bg-[#fff0e1] text-[#c2710c] text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                Bestseller
                            </span>
                        )}
                        {product.homepage_tags?.includes('new_arrival') && (
                            <span className="bg-[#e11d48] text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                New
                            </span>
                        )}
                        {product.homepage_tags?.includes('premium') && (
                            <span className="bg-stone-900 text-yellow-400 text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                Premium
                            </span>
                        )}
                        {product.discountPercentage > 0 && !product.homepage_tags?.includes('bestseller') && !product.homepage_tags?.includes('new_arrival') && (
                            <span className="bg-[#e11d48] text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                                -{product.discountPercentage}% OFF
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
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-stone-400 hover:text-[#e11d48] transition-all z-30 flex items-center justify-center shadow-sm"
                    >
                        <Heart className={`w-4 h-4 ${isInWishlist && isInWishlist(product.id) ? 'fill-[#e11d48] text-[#e11d48]' : ''}`} />
                    </button>
                </Link>
            </div>

            {/* Product Info */}
            <div className="flex flex-col px-2 pt-2.5 pb-3 flex-1">
                {/* Category */}
                {product.category && (
                    <span className="text-[10px] md:text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1 truncate">
                        {product.category}
                    </span>
                )}

                {/* Product Name */}
                <Link to={productUrl} className="font-bold text-[13px] md:text-[14px] leading-tight text-stone-900 hover:text-[#e11d48] transition-colors line-clamp-2 mb-2">
                    {product.name}
                </Link>

                {/* Variant Swatches */}
                {hasVariants && (
                    <div className="flex flex-wrap gap-1.5 mb-2" onClick={e => e.preventDefault()}>
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
                                    className={`w-4 h-4 rounded-full border-2 transition-all focus:outline-none ${
                                        isSelected ? 'border-stone-800 scale-110 ring-1 ring-offset-1 ring-stone-400' : 'border-stone-200 hover:border-stone-400'
                                    }`}
                                    title={variant.color}
                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Price Row */}
                <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-[17px] md:text-[18px] font-extrabold text-stone-900">
                        ₹{displayPrice.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && product.originalPrice > displayPrice && (
                        <span className="text-[12px] md:text-[13px] font-medium text-stone-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Add to Bag Button */}
                {cartItem ? (
                    <div className="w-full bg-white text-[#e11d48] font-bold rounded-lg border-2 border-[#e11d48] flex items-center justify-between h-[36px] overflow-hidden">
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                if (cartItem.quantity > 1) {
                                    updateQuantity(product.id, cartItem.quantity - 1, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                } else {
                                    removeFromCart(product.id, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                }
                            }}
                            className="h-full px-3 hover:bg-rose-50 transition-colors flex items-center justify-center"
                            disabled={isAdding}
                        >
                            <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span className="text-[14px] font-extrabold text-[#e11d48] w-8 text-center">{cartItem.quantity}</span>
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                updateQuantity(product.id, cartItem.quantity + 1, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                            }}
                            className="h-full px-3 hover:bg-rose-50 transition-colors flex items-center justify-center"
                            disabled={isAdding || !product.inStock}
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
                        className="w-full h-[36px] bg-[#e11d48] text-white font-bold text-[12px] md:text-[13px] rounded-full border-2 border-[#e11d48] hover:bg-[#be123c] transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                        {isAdding ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Add to Bag
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
});

export default ProductCard;

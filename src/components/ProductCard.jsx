import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { getProductUrl } from '../utils/urlUtils';
import { getProductPriceDisplay } from '../utils/productSanitizer';

export const ProductCard = React.memo(({ 
    product, 
    toggleWishlist, 
    isInWishlist, 
    priority = false, 
    showAddButton, 
    isHome = false, 
    targetUrl 
}) => {
    const shouldShowAddButton = showAddButton !== undefined ? showAddButton : !isHome;
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
    
    // Consider variants that have a color (with image fallback to product main image)
    const validVariants = variants.filter(v => v.color);
    const hasVariants = validVariants.length > 1;

    // Get all images for the current view
    const allImages = useMemo(() => {
        const validVariantImages = (selectedVariant?.images || []).filter(img => typeof img === 'string' && img.trim().length > 5);
        if (validVariantImages.length > 0) {
            return validVariantImages;
        }
        let imgs = [];
        if (product.image) imgs.push(product.image);
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                if (img && !imgs.includes(img) && img.trim().length > 5) imgs.push(img);
            });
        }
        return imgs.length > 0 ? imgs : ['/logo.png'];
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

    const priceDisplayInfo = useMemo(() => getProductPriceDisplay(product), [product]);

    // Determine current display price
    const displayPrice = useMemo(() => {
        if (selectedVariant && selectedVariant.price) {
            return Number(selectedVariant.price);
        }
        return priceDisplayInfo.price;
    }, [selectedVariant, priceDisplayInfo.price]);

    // Price range for products whose variants genuinely differ in price:
    // Show lowest variant price as "₹X se" (from ₹X)
    const priceRangeDisplay = useMemo(() => {
        if (priceDisplayInfo.isRange) {
            return priceDisplayInfo.text;
        }
        return null;
    }, [priceDisplayInfo]);

    // Problem 6 Honest Badges:
    // "New" = listed within last 30 days only
    const isNew = useMemo(() => {
        if (!product.created_at) return false;
        const createdDate = new Date(product.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
    }, [product.created_at]);

    // "Bestseller" = actually among top-selling / flagged products
    const isBestseller = Boolean(product.homepage_tags?.includes('bestseller') || product.featured);

    // Strike-through MRP & discount only when genuine earlier price (< 35% discount)
    const isGenuineDiscount = Boolean(product.discountPercentage > 0 && product.discountPercentage <= 35);

    const discountAmount = useMemo(() => {
        if (!product.originalPrice || product.originalPrice <= displayPrice) return 0;
        return product.originalPrice - displayPrice;
    }, [product.originalPrice, displayPrice]);

    const baseProductUrl = getProductUrl(product);
    const regularProductUrl = selectedVariant?.color ? `${baseProductUrl}?color=${encodeURIComponent(selectedVariant.color)}` : baseProductUrl;

    // Direct navigation to canonical product page across all views (Home, Shop, Collections)
    const cardLinkUrl = targetUrl || regularProductUrl;

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
                    to={cardLinkUrl}
                    className="relative aspect-[4/5] overflow-hidden bg-stone-50 block"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => { setIsHovering(false); setCurrentImageIndex(0); }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Image Stack with Crossfade (only mount active and adjacent hovered images to optimize DOM) */}
                    {allImages.map((img, idx) => {
                        const isActive = idx === currentImageIndex;
                        const isNextHover = isHovering && idx === ((currentImageIndex + 1) % allImages.length);
                        if (!isActive && !isNextHover) return null;

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
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 pointer-events-none" aria-hidden="true">
                            {allImages.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`rounded-full transition-all duration-300 ${
                                        idx === currentImageIndex 
                                            ? 'w-3 h-1.5 bg-stone-800' 
                                            : 'w-1.5 h-1.5 bg-stone-400'
                                    }`}
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

                    {/* Badges - Honest rules */}
                    <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-20">
                        {isBestseller && (
                            <span className="bg-[#fff0e1] text-[#92400e] text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                Bestseller
                            </span>
                        )}
                        {isNew && !isBestseller && (
                            <span className="bg-[#e11d48] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                New
                            </span>
                        )}
                        {product.homepage_tags?.includes('premium') && (
                            <span className="bg-stone-900 text-yellow-400 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                Premium
                            </span>
                        )}
                        {isGenuineDiscount && !isBestseller && !isNew && (
                            <span className="bg-[#e11d48] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
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
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-stone-500 hover:text-[#e11d48] transition-all z-30 flex items-center justify-center shadow-sm"
                        aria-label={isInWishlist && isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        title={isInWishlist && isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    >
                        <Heart className={`w-4 h-4 ${isInWishlist && isInWishlist(product.id) ? 'fill-[#e11d48] text-[#e11d48]' : ''}`} />
                    </button>
                </Link>
            </div>

            {/* Product Info (Task 1 order: name -> category -> price/MRP/savings -> colour dots -> rating -> stock state) */}
            <div className="flex flex-col px-2 pt-2.5 pb-3 flex-1">
                {/* Product Name */}
                <Link to={cardLinkUrl} className="font-bold text-sm leading-tight text-stone-900 hover:text-rose-900 transition-colors line-clamp-2 min-h-[24px] py-0.5 flex items-center mb-1">
                    {product.name}
                </Link>

                {/* Category */}
                {product.category && (
                    <span className="text-xs font-medium text-stone-500 mb-2 leading-tight">
                        {product.category}
                    </span>
                )}

                {/* Price Row: Selling Price (bold), struck-through MRP (genuine only), discount / Save ₹X (genuine only) */}
                <div className="flex flex-wrap items-baseline gap-1.5 mb-2">
                    {priceRangeDisplay && !selectedVariant ? (
                        <span className="text-lg font-extrabold text-stone-900">
                            {priceRangeDisplay}
                        </span>
                    ) : (
                        <span className="text-lg font-extrabold text-stone-900">
                            ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                    {isGenuineDiscount && product.originalPrice && product.originalPrice > displayPrice && (
                        <span className="text-xs font-medium text-stone-500 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                    {isGenuineDiscount && discountAmount > 0 && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Save ₹{discountAmount.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Variant Swatches (Colour Dots) */}
                {hasVariants && (
                    <div className="flex flex-wrap items-center gap-1 mb-2" onClick={e => e.preventDefault()}>
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
                                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all focus:outline-none p-0.5"
                                    title={variant.color}
                                    aria-label={`Select color ${variant.color}`}
                                >
                                    <span 
                                        className={`w-4 h-4 rounded-full border-2 transition-all block ${
                                            isSelected ? 'border-stone-800 scale-110 ring-1 ring-offset-1 ring-stone-400' : 'border-stone-200 hover:border-stone-400'
                                        }`}
                                        style={{ backgroundColor: variant.color.toLowerCase() }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Rating only when real reviews exist */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-stone-600 mb-2">
                        <span className="text-amber-500">★</span>
                        <span className="font-bold">{product.rating || '5.0'}</span>
                        <span className="text-stone-400">({product.reviews.length})</span>
                    </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Add to Bag Button */}
                {shouldShowAddButton && (
                    cartItem ? (
                        <div className="w-full bg-white text-rose-900 font-bold rounded-full border-2 border-rose-900 flex items-center justify-between h-[36px] overflow-hidden">
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
                            <span className="text-sm font-extrabold text-rose-900 w-8 text-center">{cartItem.quantity}</span>
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
                            className="w-full h-[36px] bg-rose-900 text-white font-bold text-xs md:text-sm rounded-full border-2 border-rose-900 hover:bg-rose-800 transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                            {isAdding ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : !product.inStock ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    Add to Bag
                                </>
                            )}
                        </button>
                    )
                )}
            </div>
        </div>
    );
});

export default ProductCard;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Heart } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

export const ProductCard = React.memo(({ product, toggleWishlist, isInWishlist, priority = false }) => {
    const [selectedVariant, setSelectedVariant] = useState(product.preselectedVariant || null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
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
    const hasVariants = validVariants.length > 0;

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
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
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
    };

    // Determine current display price
    let displayPrice = product.price;
    if (selectedVariant && selectedVariant.price) {
        displayPrice = Number(selectedVariant.price);
    }

    return (
        <div className="h-full flex flex-col">
            {/* Image Card */}
            <div 
                className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden bg-stone-100 mb-3 md:mb-5 rounded-[20px] md:rounded-2xl shrink-0 md:group-hover:-translate-y-1 md:group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] md:transition-all md:duration-500"
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
                        alt={`${product.name} ${idx + 1}`}
                        width={600}
                        height={900}
                        loading={priority && idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        style={{
                            transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: idx === currentImageIndex ? 1 : 0,
                            transform: idx === currentImageIndex ? 'scale(1)' : 'scale(1.06)',
                            zIndex: idx === currentImageIndex ? 2 : 1,
                        }}
                        className={`absolute inset-0 w-full h-full object-cover object-top ${!product.inStock ? 'grayscale opacity-80' : ''}`}
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
                                        ? 'w-4 h-1.5 bg-white shadow-md' 
                                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`View image ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
                
                {/* Sold Out Overlay */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-stone-900/50 rounded-t-xl flex items-center justify-center z-10 pointer-events-none">
                        <span className="bg-white/90 text-stone-900 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 z-20">
                    {product.inStock && product.discountPercentage > 0 && (
                        <span className="bg-emerald-600 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest px-2 py-1 md:px-2.5 md:py-1 rounded shadow-md">
                            {product.discountPercentage}% OFF
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
                    className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/90 md:p-2.5 rounded-full text-stone-500 hover:text-rose-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 duration-500 shadow-sm md:hover:scale-110"
                >
                    <Heart className={`w-4 h-4 md:w-4 md:h-4 ${isInWishlist && isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
            </div>

            {/* Product Info */}
            <div className="text-left flex-1 flex flex-col justify-between min-h-[5rem]">
                <div>
                     <h3 className="font-heading font-medium text-base md:text-lg text-stone-900 group-hover:text-rose-900 transition-colors duration-300 line-clamp-2 leading-snug mb-1.5 pr-2">
                        {product.name}
                    </h3>

                    {/* Variant Swatches */}
                    {hasVariants && (
                        <div className="flex flex-wrap gap-1.5 mb-3 mt-1.5" onClick={e => e.preventDefault()}>
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
                                        className={`w-4 h-4 md:w-5 md:h-5 rounded-full border shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all focus:outline-none ${
                                            isSelected ? 'border-stone-900 ring-1 ring-stone-900 ring-offset-1 scale-110' : 'border-stone-300 hover:border-stone-400'
                                        }`}
                                        title={variant.color}
                                        style={{ backgroundColor: variant.color.toLowerCase() }}
                                        aria-label={`Select ${variant.color} variant`}
                                    >
                                        <span className="sr-only">{variant.color}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm mt-auto">
                    <span className="font-medium text-stone-900">₹{displayPrice.toLocaleString()}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-stone-400 line-through text-[10px] md:text-xs">
                                ₹{product.originalPrice.toLocaleString()}
                            </span>
                            {product.discountPercentage > 0 && (
                                <span className="text-rose-900 text-[10px] md:text-xs font-bold">
                                    ({product.discountPercentage}% OFF)
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ProductCard;

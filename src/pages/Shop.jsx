import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { Package, Heart, Search, ChevronDown, Sparkles, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useSearchParams } from 'react-router-dom';

// Utility helper function extracted outside component to avoid recreation
const slugify = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const ProductCardWithVariants = ({ product, toggleWishlist, isInWishlist }) => {
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
        if (product.images && product.images.length > 0) {
            return product.images.filter(Boolean);
        }
        if (product.image) return [product.image];
        return [];
    }, [selectedVariant, product.images, product.image]);

    const hasMultipleImages = allImages.length > 1;
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Reset index when variant changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedVariant]);

    // IntersectionObserver for mobile auto-advance when card is visible
    useEffect(() => {
        if (!hasMultipleImages || !cardRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.5 }
        );
        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [hasMultipleImages]);

    // Auto-advance: on hover (desktop) OR when visible (mobile)
    useEffect(() => {
        if (!hasMultipleImages) return;
        if (isHovering || isVisible) {
            hoverTimerRef.current = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % allImages.length);
            }, isHovering ? 1500 : 2500);
        }
        return () => {
            if (hoverTimerRef.current) clearInterval(hoverTimerRef.current);
        };
    }, [isHovering, isVisible, hasMultipleImages, allImages.length]);

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
                ref={cardRef}
                className="relative aspect-[2/3] md:aspect-[4/5] overflow-hidden bg-stone-100 mb-3 md:mb-5 rounded-[20px] md:rounded-2xl shrink-0 md:group-hover:-translate-y-1 md:group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] md:transition-all md:duration-500"
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
                        src={getOptimizedImageUrl(img, { width: 600, quality: 80 })}
                        alt={`${product.name} ${idx + 1}`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
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
                        <span className="bg-rose-900 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 md:px-2 md:py-1 rounded-sm shadow-sm">
                            {product.discountPercentage}% OFF
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/90 md:p-2.5 rounded-full text-stone-500 hover:text-rose-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 duration-500 shadow-sm md:hover:scale-110"
                >
                    <Heart className={`w-4 h-4 md:w-4 md:h-4 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
            </div>

            {/* Product Info */}
            <div className="text-left flex-1 flex flex-col justify-between">
                <div>
                     <h3 className="font-heading text-sm md:text-lg text-stone-900 group-hover:text-rose-900 transition-colors duration-300 truncate mb-1">
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
};

const Shop = () => {
    const { products, loading: productsLoading } = useProducts();
    const { categories: contextCategories } = useCategories();
    const [searchParams] = useSearchParams();

    const { toggleWishlist, isInWishlist } = useWishlist();

    
    // Filter States
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState('all');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Handle URL params
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setFilter(categoryParam);
        }
    }, [searchParams]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, sortBy, priceRange, inStockOnly]);

    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileFiltersOpen]);

    const allFilteredProducts = useMemo(() => {
        let flattened = [];
        products.forEach(prod => {
            const validVariants = prod.variants?.filter(v => v.color && v.images && v.images.length > 0) || [];
            if (validVariants.length > 0) {
                validVariants.forEach(v => {
                    flattened.push({
                        ...prod,
                        uniqueId: `${prod.id}-${slugify(v.color)}`,
                        preselectedVariant: v,
                        price: v.price ? Number(v.price) : prod.price,
                        randomOrder: Math.random(),
                    });
                });
            } else {
                flattened.push({
                    ...prod,
                    uniqueId: prod.id,
                    preselectedVariant: null,
                    randomOrder: Math.random(),
                });
            }
        });

        return flattened.filter(product => {
            // Category Filter
            if (filter !== 'all') {
                if (slugify(product.category) !== slugify(filter)) return false;
            }

            // Price Range Filter
            if (priceRange !== 'all') {
                if (priceRange === 'under-99' && product.price >= 99) return false;
                if (priceRange === '99-199' && (product.price < 99 || product.price > 199)) return false;
                if (priceRange === 'above-199' && product.price <= 199) return false;
            }

            // Availability Filter
            if (inStockOnly && !product.inStock) return false;

            return true;
        }).sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'newest': return String(b.id).localeCompare(String(a.id));
                default: 
                    if (filter === 'all') {
                        return a.randomOrder - b.randomOrder;
                    }
                    return (a.featured === b.featured) ? 0 : a.featured ? -1 : 1;
            }
        });
    }, [products, filter, priceRange, inStockOnly, sortBy]);


    const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = isMobile 
        ? allFilteredProducts.slice(0, currentPage * ITEMS_PER_PAGE) 
        : allFilteredProducts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

    const categories = [
        { id: 'all', label: 'All Creations' },
        ...contextCategories
    ];

    const priceRanges = [
        { id: 'all', label: 'All Prices' },
        { id: 'under-99', label: 'Under ₹99' },
        { id: '99-199', label: '₹99 - ₹199' },
        { id: 'above-199', label: 'Above ₹199' },
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-32 font-body selection:bg-rose-100 selection:text-rose-900">
            <div className="container-custom pb-20 pt-20 md:pt-32">

                {/* Mobile Category Circles */}
                <div className="lg:hidden mb-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
                    <div className="flex gap-4">
                        {categories.map(cat => {
                            const isSelected = filter === cat.id;
                            const catImage = cat.id === 'all'
                                ? '/logo.png'
                                : products.find(p => slugify(p.category) === slugify(cat.id))?.image || '/logo.png';
                            return (
                                <button 
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className="flex flex-col items-center gap-2 min-w-[72px] group transition-all duration-300"
                                >
                                    <div className={`
                                        w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 transition-all duration-300
                                        ${isSelected 
                                            ? 'bg-gradient-to-tr from-rose-900 via-rose-600 to-rose-900 shadow-lg shadow-rose-900/30 scale-110' 
                                            : 'bg-stone-200 hover:bg-stone-300'}
                                    `}>
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-white">
                                            <img 
                                                src={cat.id === 'all' ? '/logo.png' : getOptimizedImageUrl(catImage, { width: 100, height: 100 })}
                                                alt={cat.label}
                                                onError={(e) => e.currentTarget.src = '/logo.png'}
                                                className={cat.id === 'all' ? 'w-10 h-10 object-contain' : 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'}
                                            />
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold text-center leading-tight max-w-[72px] ${
                                        isSelected ? 'text-rose-900' : 'text-stone-600'
                                    }`}>
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">


                    {/* Mobile Filters Drawer */}
                    <div 
                        className={`fixed inset-0 z-50 lg:hidden text-left transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    >
                        {/* Backdrop */}
                        <div 
                            className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setIsMobileFiltersOpen(false)} 
                        />
                        
                        {/* Drawer */}
                        <aside 
                            className={`absolute right-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-stone-100 shrink-0">
                                <h3 className="font-heading font-bold text-xl text-stone-900 flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5 text-rose-900" />
                                    Filters
                                </h3>
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-900 transition-colors"
                                >
                                    <span className="text-2xl leading-none">&times;</span>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
                                {/* Categories */}
                                <div>
                                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setFilter(cat.id)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                                                    filter === cat.id
                                                    ? 'bg-rose-900 border-rose-900 text-white shadow-md shadow-rose-900/20'
                                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                                }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Price Range</h3>
                                    <div className="space-y-3">
                                        {priceRanges.map(range => (
                                            <label key={range.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 cursor-pointer group hover:border-stone-200 transition-colors bg-stone-50/50">
                                                <span className={`text-sm font-medium transition-colors ${priceRange === range.id ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-800'}`}>
                                                    {range.label}
                                                </span>
                                                <div className="relative flex items-center justify-center w-5 h-5">
                                                    <input 
                                                        type="radio" 
                                                        name="price-mobile-improved" 
                                                        checked={priceRange === range.id}
                                                        onChange={() => setPriceRange(range.id)}
                                                        className="peer appearance-none w-5 h-5 border-2 border-stone-300 rounded-full checked:border-rose-900 transition-all cursor-pointer"
                                                    />
                                                    <div className="absolute w-2.5 h-2.5 rounded-full bg-rose-900 scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability */}
                                <div>
                                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Availability</h3>
                                    <label className="flex items-center justify-between p-4 rounded-xl border border-stone-100 cursor-pointer group hover:border-stone-200 transition-colors bg-stone-50/50">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium transition-colors ${inStockOnly ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-800'}`}>
                                                In Stock Only
                                            </span>
                                            <span className="text-[10px] text-stone-400 mt-0.5">Show only items ready to ship</span>
                                        </div>
                                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${inStockOnly ? 'bg-rose-900' : 'bg-stone-200'}`}>
                                            <input 
                                                type="checkbox" 
                                                checked={inStockOnly}
                                                onChange={(e) => setInStockOnly(e.target.checked)}
                                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${inStockOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            {/* Footer actions */}
                            <div className="p-5 border-t border-stone-100 bg-white shrink-0 flex gap-3 pb-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] relative z-10">
                                <button
                                    onClick={() => {
                                        setFilter('all');
                                        setPriceRange('all');
                                        setInStockOnly(false);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 active:bg-stone-100 transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="flex-[2] py-3 px-4 rounded-xl bg-rose-900 text-white font-semibold text-sm shadow-lg shadow-rose-900/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Show {allFilteredProducts.length} items
                                </button>
                            </div>
                        </aside>
                    </div>

                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 sticky top-32 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
                        <div className="pb-4 border-b border-stone-100">
                            <h2 className="font-heading font-bold text-xl text-stone-900 tracking-tight">Refine Collection</h2>
                        </div>
                        {/* Categories */}
                        <div>
                            <h3 className="font-heading font-bold text-stone-900 mb-4 text-base uppercase tracking-wider">Categories</h3>
                            <div className="flex flex-col gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilter(cat.id)}
                                        className={`text-left text-sm transition-all duration-300 py-1 flex items-center gap-2 group ${
                                            filter === cat.id
                                            ? 'text-rose-900 font-bold'
                                            : 'text-stone-500 hover:text-stone-900'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full bg-rose-900 transition-all duration-300 ${filter === cat.id ? 'opacity-100' : 'opacity-0 pre-opacity'}`} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-heading font-bold text-stone-900 mb-4 text-base uppercase tracking-wider">Price</h3>
                            <div className="flex flex-col gap-3">
                                {priceRanges.map(range => (
                                    <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input 
                                                type="radio" 
                                                name="price" 
                                                checked={priceRange === range.id}
                                                onChange={() => setPriceRange(range.id)}
                                                className="peer appearance-none w-4 h-4 border border-stone-300 rounded-full checked:border-rose-900 checked:border-4 transition-all"
                                            />
                                        </div>
                                        <span className={`text-sm transition-colors ${priceRange === range.id ? 'text-stone-900 font-medium' : 'text-stone-500 group-hover:text-stone-800'}`}>
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <h3 className="font-heading font-bold text-stone-900 mb-4 text-base uppercase tracking-wider">Availability</h3>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 rounded border-stone-300 text-rose-900 focus:ring-rose-900 cursor-pointer"
                                />
                                <span className={`text-sm transition-colors ${inStockOnly ? 'text-stone-900 font-medium' : 'text-stone-500 group-hover:text-stone-800'}`}>
                                    In Stock Only
                                </span>
                            </label>
                        </div>
                    </aside>

                    {/* Product Grid - with Sticky Header */}
                    <div className="flex-1 w-full relative min-w-0">
                        {/* Desktop Header */}
                        <div className="hidden md:block mb-8">
                            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-stone-900 mb-2">Our Collection</h1>
                            <p className="text-stone-500 text-sm lg:text-base">Discover hand-crafted embroidery pieces tailored for you.</p>
                        </div>

                        {/* Sticky Toolbar: Search, Sort, & Count */}
                        <div className="sticky top-[60px] lg:top-24 z-30 bg-white/80 md:bg-white/90 backdrop-blur-md py-2 md:py-3 mb-3 md:mb-8 border-b border-stone-200/60 shadow-sm md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border md:border-stone-100 flex flex-row justify-between items-center gap-3 md:gap-4 transition-all duration-300 -mx-4 px-4 md:mx-0 md:px-6 md:rounded-2xl">
                             {/* Result Count (Desktop) */}
                            <div className="hidden md:block text-sm font-medium text-stone-500 pl-4">
                                Showing {allFilteredProducts.length} results
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto md:pr-4">
                                {/* Mobile Filters Button */}
                                <button
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    className="flex items-center gap-1.5 py-2 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg md:rounded-full text-sm font-semibold text-stone-700 transition-all flex-shrink-0 lg:hidden"
                                    aria-label="Open filters"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span>Filters</span>
                                    {(filter !== 'all' || priceRange !== 'all' || inStockOnly) && (
                                        <span className="bg-rose-900 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {(filter !== 'all' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0) + (inStockOnly ? 1 : 0)}
                                        </span>
                                    )}
                                </button>

                                {/* Search Removed */}
                                
                                {/* Sort */}
                                <div className="relative group flex-1 md:min-w-[160px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full appearance-none pl-3 pr-8 py-2 bg-stone-100/50 border border-stone-200 rounded-lg md:rounded-full text-sm font-medium text-stone-600 focus:outline-none focus:border-rose-900 focus:bg-white focus:ring-1 focus:ring-rose-900 cursor-pointer hover:border-stone-300 transition-all truncate"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="newest">Newest</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none group-hover:text-stone-900 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {productsLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 opacity-50">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                            </div>
                        ) : allFilteredProducts.length === 0 ? (
                            <div className="text-center py-32">
                                <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-heading text-stone-900 mb-2">No results found</h3>
                                <button 
                                    onClick={() => {setFilter('all'); setPriceRange('all'); setInStockOnly(false);}}
                                    className="text-rose-900 underline underline-offset-4 hover:text-rose-700 text-sm font-medium"
                                >
                                    Reset collection
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14">
                                    {paginatedProducts.map((product) => (
                                        <Link 
                                            key={product.uniqueId} 
                                            to={`/product/${product.id}${product.preselectedVariant ? `?color=${encodeURIComponent(product.preselectedVariant.color)}` : ''}`}
                                            className="group block"
                                            onMouseEnter={() => {
                                                // Optional pre-fetch or highlight
                                            }}
                                        >
                                            <ProductCardWithVariants product={product} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />
                                        </Link>
                                    ))}
                                </div>

                                {/* Load More (Mobile) */}
                                {isMobile && currentPage < totalPages && (
                                    <div className="flex justify-center mt-8 mb-12">
                                        <button 
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className="w-full max-w-xs py-3 rounded-xl bg-rose-900 text-white font-bold shadow-lg shadow-rose-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-rose-800"
                                        >
                                            View More Products
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Pagination (Desktop Only) */}
                                {!isMobile && totalPages > 1 && (
                                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setCurrentPage(curr => Math.max(1, curr - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-stone-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent bg-white"
                                                aria-label="Previous Page"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            {/* Desktop Numbers */}
                                            <div className="flex gap-1">
                                                {Array.from({ length: totalPages }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                                            currentPage === i + 1 
                                                            ? 'bg-rose-900 text-white shadow-lg shadow-rose-900/20 scale-105' 
                                                            : 'text-stone-600 hover:bg-stone-100 bg-white border border-transparent hover:border-stone-200'
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => { setCurrentPage(curr => Math.min(totalPages, curr + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg border border-stone-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent bg-white"
                                                aria-label="Next Page"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;

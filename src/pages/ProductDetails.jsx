import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../../config/supabase';
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, Star, Award, Search, Sparkles, Plus, Minus, ChevronDown, Share2, X } from 'lucide-react';

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
    const [selectedColor, setSelectedColor] = useState(null);
    const [colorError, setColorError] = useState(false);
    
    // Image Gallery State
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    // Accordion State
    const [openSection, setOpenSection] = useState('description');

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Variant Logic Extraction (Moved up for Hooks)
    const variants = product?.variants || [];
    const isVariantSystemActive = variants.length > 0;
    
    // Determine Selected Variant Object
    const selectedVariant = isVariantSystemActive && selectedColor 
       ? variants.find(v => v.color === selectedColor) 
       : null;

    // derived state for Image Update
    useEffect(() => {
        if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
            setSelectedImage(selectedVariant.images[0]);
        }
    }, [selectedColor, selectedVariant]);


    // Check if item is in cart (reactive to size selection for clothing)
    const isInCart = product && cart.some(item => 
        item.id === product.id && 
        (product.clothingInformation 
            ? (item.selectedSize === selectedSize && item.selectedColor === selectedColor) 
            : true)
    );

    // Helpers for Clothing Info
    const info = product?.clothingInformation || {};
    const sizes = info.sizes || {};
    const hasSizes = Object.keys(sizes).length > 0;
    
    const singleSizeKey = Object.keys(sizes).length === 1 && Object.keys(sizes)[0];
    const shouldHideSizeSelector = singleSizeKey === 'NA';
    const shouldAutoSelectSize = singleSizeKey === 'NA' || singleSizeKey === 'Free';

    // Color Logic
    const associatedColors = variants.map(v => v.color).filter(Boolean);
    const legacyColors = info.colors || [];
    const allColors = [...new Set([...associatedColors, ...legacyColors])];
    const availableColors = (allColors.length > 1 && allColors.includes('NA')) 
       ? allColors.filter(c => c !== 'NA') 
       : allColors;

    const hasOnlyNAColor = availableColors.length === 1 && availableColors[0] === 'NA';

    useEffect(() => {
        if (shouldAutoSelectSize && singleSizeKey) {
            setSelectedSize(singleSizeKey);
        }
        if (hasOnlyNAColor) {
            setSelectedColor('NA');
        }
    }, [product, shouldAutoSelectSize, singleSizeKey, hasOnlyNAColor]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (products.length > 0) {
            const found = products.find(p => p.id === parseInt(id) || p.id === id);
            setProduct(found);
            setLoading(false);
            if (found) {
                 fetchReviews(found.id);
                 setSelectedImage(found.image);
                 
                 // SEO Update
                 document.title = found.clothingInformation?.metaTitle || found.name + " | Enbroidery";
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

    // Get products from same category first, then others to ensure variety
    const normalize = (str) => (str || '').toLowerCase().trim();
    const sameCategoryProducts = products.filter(p => normalize(p.category) === normalize(product.category) && p.id !== product.id);
    const otherCategoryProducts = products.filter(p => normalize(p.category) !== normalize(product.category) && p.id !== product.id);
    
    // Combine: prioritized same category, then fill with others. Limit to 20 total.
    const relatedProducts = [...sameCategoryProducts, ...otherCategoryProducts].slice(0, 20);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    // Selection Logic Part 2
     const effectiveSize = selectedSize || (!hasSizes ? 'Standard' : null);
     
     // Variant-Specific Images for Display
     const displayImages = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 && selectedVariant.images[0])
        ? selectedVariant.images
        : (product.images && product.images.length > 0 ? product.images : [product.image]);

     // Price Logic
     const matrixKey = (selectedColor && effectiveSize) ? `${selectedColor}-${effectiveSize}` : null;
     const matrixData = matrixKey && info.variantStock ? info.variantStock[matrixKey] : null;

     let currentPrice = product.price;
     if (matrixData && matrixData.price) {
         currentPrice = parseInt(matrixData.price);
     } else if (selectedVariant && selectedVariant.price) {
         currentPrice = parseInt(selectedVariant.price);
     }

     // Stock Logic
     let currentStock = product.stock;
     
     if (hasSizes && matrixData && matrixData.stock !== undefined) {
          currentStock = parseInt(matrixData.stock);
     } else if (hasSizes && (!matrixData || matrixData.stock === undefined)) {
         if (selectedSize && sizes && sizes[selectedSize] !== undefined) {
             currentStock = sizes[selectedSize];
         } else {
             currentStock = 0; 
         }
     } else if (!hasSizes && selectedVariant && selectedVariant.stock !== undefined) {
         currentStock = parseInt(selectedVariant.stock);
     } else if (!hasSizes && !selectedVariant) {
         currentStock = product.stock;
     }

     const isCurrentVariantInStock = currentStock > 0;
     const isStockAvailable = isCurrentVariantInStock;

    // Validation Helper
    const validateSelection = () => {
        // 1. Check Color
        // Use availableColors instead of info.colors to check if colors are relevant
        if (product.clothingInformation && availableColors.length > 0 && !hasOnlyNAColor && !selectedColor) {
            setColorError(true);
            addToast('Please select a color first', 'error');
            const el = document.getElementById('color-selector');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }

        // 2. Check Size
        if (product.clothingInformation && hasSizes && !shouldHideSizeSelector && !selectedSize) {
            setSizeError(true);
            addToast('Please select a size first', 'error');
            const el = document.getElementById('size-selector');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }

        return true;
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-7 pb-28 lg:pb-20 font-body selection:bg-rose-100 selection:text-rose-900">
            <div className="container-custom">
                {/* Breadcrumb - Minimal */}
                <div className="mb-8 hidden lg:block">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-stone-500 hover:text-rose-900 transition-colors text-sm font-medium tracking-wide group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 lg:gap-12 xl:gap-24 mb-16 lg:mb-32">
                    {/* ... Image Section ... */}
                    <div className="relative h-fit lg:sticky lg:top-28 space-y-4 lg:space-y-0 lg:flex lg:gap-6">
                        {/* Desktop Thumbnails (Left Side) */}
                        {displayImages && displayImages.length > 1 && (
                            <div className="hidden lg:flex flex-col gap-4 w-24 flex-shrink-0 max-h-[70vh] overflow-y-auto no-scrollbar py-1">
                                {displayImages.map((img, idx) => (
                                    img && (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                                (selectedImage || displayImages[0]) === img 
                                                ? 'border-blue-600 shadow-md ring-2 ring-blue-100' 
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
                            <div className="hidden lg:block w-full h-full"> 
                                <img 
                                    src={selectedImage || displayImages[0] || product.image || 'https://via.placeholder.com/500'} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-3">
                                    <button 
                                        onClick={() => toggleWishlist(product)}
                                        className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-stone-600 hover:text-rose-600 group/btn"
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar">
                                {(displayImages.length > 0 ? displayImages : [product.image]).map((img, idx) => (
                                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                        <img 
                                            src={img} 
                                            alt={`${product.name} - View ${idx + 1}`} 
                                            className="w-full h-full object-cover" 
                                        />
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
                            {displayImages && displayImages.length > 1 && (
                                <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {displayImages.map((_, idx) => (
                                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${'bg-white/80 shadow-sm'}`}></div>
                                    ))}
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
                            
                            {info.shortDescription && (
                                <p className="text-stone-500 font-light text-lg">{info.shortDescription}</p>
                            )}

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
                                <span className="text-3xl font-heading font-medium text-stone-900 relative">
                                    <span className="text-sm absolute -top-2 -left-3 text-stone-400 font-sans">₹</span>
                                    {currentPrice.toLocaleString()}
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
                   
                        
                        {/* Selector Section: Color & Size */}
                        {product.clothingInformation && (
                            <div className="mb-10 space-y-6">
                                {/* Color Selector Using availableColors */}
                                {availableColors && availableColors.length > 0 && !hasOnlyNAColor && (
                                    <div className="space-y-4" id="color-selector">
                                        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Select Color</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {availableColors.map((color) => {
                                                const isSelected = selectedColor === color;
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => {
                                                            setSelectedColor(color);
                                                            setColorError(false);
                                                        }}
                                                        className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                                                            isSelected 
                                                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg' 
                                                                : 'bg-white text-stone-900 border-stone-200 hover:border-stone-900'
                                                        }`}
                                                    >
                                                        {color}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {colorError && (
                                            <p className="text-red-500 text-sm animate-pulse flex items-center gap-1">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span> Please select a color
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Size Selector */}
                                {!shouldHideSizeSelector && Object.keys(sizes).length > 0 && (
                                <div className="space-y-4" id="size-selector">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Select Size</h3>
                                        {info.sizeChart && (
                                            <button 
                                                onClick={() => setIsSizeChartOpen(true)}
                                                className="text-xs font-medium text-rose-900 underline underline-offset-4 hover:text-rose-700"
                                            >
                                                Size Guide
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {Object.entries(sizes)
                                            .sort((a, b) => {
                                                const order = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, '3XL': 7, 'Free': 8 };
                                                return (order[a[0]] || 99) - (order[b[0]] || 99);
                                            })
                                            .map(([size, _legacyQty]) => {
                                                // Check Real Stock
                                                let isAvailable = true;
                                                
                                                if (info.variantStock) {
                                                     // If color selected, check specific variant
                                                     if (selectedColor) {
                                                         const vKey = `${selectedColor}-${size}`;
                                                         if (info.variantStock[vKey] && info.variantStock[vKey].stock !== undefined) {
                                                             isAvailable = parseInt(info.variantStock[vKey].stock) > 0;
                                                         }
                                                     }
                                                     // If no color selected yet, keep available unless logic dictates otherwise
                                                } else if (selectedVariant) {
                                                    // Fallback to variant level stock if no matrix
                                                    isAvailable = (selectedVariant.stock || 0) > 0;
                                                } else {
                                                    // Legacy fallback
                                                    isAvailable = _legacyQty > 0;
                                                }

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
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {/* Actions (Desktop) */}
                        <div className="hidden lg:flex flex-col gap-4 mb-16">
                            <div className="flex gap-4">
                                <button
                                    onClick={async () => {
                                        if (isInCart) {
                                            navigate('/cart');
                                            return;
                                        }

                                        if (!validateSelection()) return;
                                        
                                        const success = await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice });
                                        if (success) addToast(`Added ${product.name} to bag`, 'success');
                                    }}
                                    disabled={!isStockAvailable}
                                    className={`flex-1 py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs lg:text-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                                        isStockAvailable
                                        ? isInCart 
                                            ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/10' 
                                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xl shadow-stone-900/10 hover:-translate-y-0.5'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {isStockAvailable ? (isInCart ? 'Go to Bag' : 'Add to Bag') : 'Sold Out'}
                                </button>
                                
                                <button 
                                    onClick={async () => {
                                            if(isStockAvailable) {
                                            if (!validateSelection()) return;
                                            await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice });
                                            navigate('/cart');
                                            }
                                    }}
                                    disabled={!isStockAvailable}
                                    className="px-8 py-4 rounded-full border border-stone-900 font-bold uppercase tracking-widest text-xs lg:text-sm text-stone-900 hover:bg-stone-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
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
                                    <p className="text-stone-600 leading-relaxed font-light mb-4 text-sm md:text-base">
                                        {product.description}
                                    </p>
                                    
                                    {info.keyFeatures && info.keyFeatures.length > 0 && (
                                        <div className="mb-4">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {info.keyFeatures.map((feat, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                                                        <span className="w-1 h-1 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                     {product.clothingInformation && (
                                        <div className="p-4 bg-stone-50 rounded-lg space-y-4 text-sm mt-4">
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                                {info.fabric && (
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Material</span>
                                                        <span className="text-stone-800 font-medium">{info.fabric}</span>
                                                        {info.fabricBlend && <span className="block text-stone-500 text-xs mt-0.5">{info.fabricBlend}</span>}
                                                    </div>
                                                )}
                                                {info.fitType && (
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Fit</span>
                                                        <span className="text-stone-800 font-medium">{info.fitType}</span>
                                                    </div>
                                                )}
                                                {info.lengthType && (
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Length</span>
                                                        <span className="text-stone-800 font-medium">{info.lengthType}</span>
                                                    </div>
                                                )}
                                                {info.countryOfOrigin && (
                                                    <div>
                                                        <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Origin</span>
                                                        <span className="text-stone-800 font-medium">{info.countryOfOrigin}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {info.careInstructions && (
                                                 <div className="pt-3 border-t border-stone-100">
                                                    <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Care</span>
                                                    <p className="text-stone-600 leading-snug">{info.careInstructions}</p>
                                                </div>
                                            )}
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
                                        <span className="font-heading font-medium text-lg text-stone-900">Specifications</span>
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
                                    <span className="font-heading font-medium text-lg text-stone-900">Shipping & Returns</span>
                                    {openSection === 'shipping' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'shipping' ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-4 text-sm text-stone-600">
                                        <div className="flex items-start gap-4">
                                            <Truck className="w-5 h-5 text-stone-400 shrink-0" />
                                            <div>
                                                <p className="font-medium text-stone-900">Shipping</p>
                                                <p className="mt-1">
                                                    {info.shippingCharges > 0 
                                                        ? `Standard shipping charges of ₹${info.shippingCharges} apply.` 
                                                        : 'Enjoy complimentary free shipping on this item.'
                                                    }
                                                    {info.weight && ` Weight: ${info.weight}.`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Shield className="w-5 h-5 text-stone-400 shrink-0" />
                                            <div>
                                                <p className="font-medium text-stone-900">Return Policy</p>
                                                <p className="mt-1">
                                                    {info.returnAvailable 
                                                        ? `${info.returnPeriod || 7}-day easy return policy. Item must be in original condition.` 
                                                        : 'This item is not eligible for returns.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews - now cleaner */}
                        <div id="reviews" className="border-t border-stone-200 pt-8 lg:pt-12 mt-8 lg:mt-12 mb-12 lg:mb-32">
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
                                <div className="text-center py-8 lg:py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
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
                    <div className="border-t border-stone-200 pt-8 lg:pt-16 pb-24">
                        <div className="text-center mb-8 lg:mb-12">
                            <h2 className="text-3xl lg:text-4xl font-heading font-medium text-stone-900 mb-4">You May Also Admire</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-8">
                            {relatedProducts.map(p => {
                                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                                return (
                                    <div key={p.id} className="group relative">
                                        <div className="aspect-[4/5] overflow-hidden bg-stone-100 rounded-2xl mb-3 relative">
                                            <Link to={`/product/${p.id}`}>
                                                <img 
                                                    src={p.image} 
                                                    alt={p.name} 
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            </Link>
                                            
                                            {/* Discount Badge */}
                                            {discount > 0 && (
                                                <div className="absolute top-3 left-3 bg-rose-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                                    {discount}% OFF
                                                </div>
                                            )}

                                            {/* Wishlist Button */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(p);
                                                }}
                                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
                                            </button>
                                        </div>

                                        <Link to={`/product/${p.id}`} className="block space-y-1">
                                            <h3 className="font-heading font-bold text-sm lg:text-base text-stone-900 truncate pr-2 group-hover:text-rose-900 transition-colors">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-2 text-sm">
                                                <span className="font-bold text-stone-900">₹{p.price.toLocaleString()}</span>
                                                {p.originalPrice && (
                                                    <>
                                                        <span className="text-stone-400 line-through text-xs">₹{p.originalPrice.toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-rose-700">({discount}% OFF)</span>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Size Chart Modal */}
            {isSizeChartOpen && info.sizeChart && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSizeChartOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
                         <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-heading font-bold px-2">Size Guide</h3>
                            <button onClick={() => setIsSizeChartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>
                        <img src={info.sizeChart} alt="Size Chart" className="w-full h-auto max-h-[70vh] object-contain" />
                    </div>
                </div>
            )}
            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] lg:hidden z-50 flex gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                    onClick={async () => {
                        if (isInCart) {
                            navigate('/cart');
                            return;
                        }

                        if (!validateSelection()) return;
                        
                        const success = await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice });
                        if (success) addToast(`Added ${product.name} to bag`, 'success');
                    }}
                    disabled={!isStockAvailable}
                    className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
                        isStockAvailable
                        ? isInCart 
                            ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg' 
                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xl'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    {isStockAvailable ? (isInCart ? 'Go to Bag' : 'Add to Bag') : 'Sold Out'}
                </button>
                
                <button 
                    onClick={async () => {
                            if(isStockAvailable) {
                            if (!validateSelection()) return;
                            await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice });
                            navigate('/cart');
                            }
                    }}
                    disabled={!isStockAvailable}
                    className="flex-1 py-3 rounded-xl border border-stone-900 font-bold uppercase tracking-widest text-xs text-stone-900 hover:bg-stone-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;

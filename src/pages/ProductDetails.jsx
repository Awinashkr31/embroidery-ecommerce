import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../../config/supabase';
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, Star, Award, Search, Sparkles, Plus, Minus, ChevronDown, Share2, X, Loader, Calendar, CheckCircle2, Package, Gift, ShoppingCart } from 'lucide-react';
import SEO from '../components/SEO';
import { PincodeChecker } from '../components/PincodeChecker';
import { extractProductIdFromSlug, getProductUrl, slugify } from '../../src/utils/urlUtils';

const ProductDetails = () => {
    const { slug } = useParams();
    const id = extractProductIdFromSlug(slug);
    const { products, fetchProducts } = useProducts();
    
    // Fetch products explicitly since context no longer auto-fetches on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    const { addToCart, updateQuantity, removeFromCart, cart, FREE_DELIVERY_THRESHOLD, isGiftWrapped, setIsGiftWrapped, cartCount } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    
    // Clothing Support
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const [searchParams] = useSearchParams();
    const initialColor = searchParams.get('color');
    const [selectedColor, setSelectedColor] = useState(initialColor || null);
    const [colorError, setColorError] = useState(false);
    
    // Image Gallery State
    const [selectedImage, setSelectedImage] = useState(null);
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

    // Accordion State
    const [openSection, setOpenSection] = useState(null);

    // Variant Sheet State (Mobile)
    const [isVariantSheetOpen, setIsVariantSheetOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // 'add' or 'buy'

    // ML Recommendation State
    const [recommendedIds, setRecommendedIds] = useState([]);
    const [youMayAlsoLikeProducts, setYouMayAlsoLikeProducts] = useState([]);

    
    // Gift Packaging State
    const [giftNote, setGiftNote] = useState('');
    const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);
    
    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', name: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.comment.trim() || !reviewForm.name.trim()) return;
        setSubmittingReview(true);
        try {
            const { error } = await supabase.from('reviews').insert([{
                product_id: product.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
                user_name: reviewForm.name.trim(),
                status: 'pending'
            }]);
            if (error) throw error;
            addToast("Review submitted and awaiting approval!", "success");
            setReviewModalOpen(false);
            setReviewForm({ rating: 5, comment: '', name: '' });
            fetchReviews(product.id);
        } catch (error) {
            console.error("Error submitting review:", error);
            addToast("Failed to submit review", "error");
        } finally {
            setSubmittingReview(false);
        }
    };
    
    useEffect(() => {
        if (!product) return;
        setRecommendedIds([]);
        // Fetch ML recommendations
        const apiUrl = import.meta.env.VITE_ML_API_URL || 'https://embroidery-ml-api.onrender.com';
        fetch(`${apiUrl}/api/recommendations/${product.id}`)
            .then(res => {
                if(!res.ok) throw new Error("API not found");
                return res.json();
            })
            .then(data => {
                if(data.recommendations) {
                    setRecommendedIds(data.recommendations);
                }
            })
            .catch(() => {
                console.log("ML Recommendations offline, falling back to basic recommendations");
            });
    }, [product]);

    useEffect(() => {
        if (products && products.length > 0 && product) {
            setYouMayAlsoLikeProducts([...products]
                .filter(p => p.id !== product.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 8));
        }
    }, [products, product]);

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


    // Find the exact item in cart
    const cartItem = useMemo(() => {
        if (!product || !cart) return null;
        return cart.find(item => 
            item.id === product.id && 
            (product.clothingInformation 
                ? (item.selectedSize === selectedSize && item.selectedColor === selectedColor) 
                : true)
        );
    }, [cart, product, selectedSize, selectedColor]);

    const isInCart = !!cartItem;

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
        } else if (!selectedColor && availableColors.length === 1) {
            // Auto-select the first available color by default if it's the only one
            setSelectedColor(availableColors[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id, shouldAutoSelectSize, singleSizeKey, hasOnlyNAColor, availableColors.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (products.length > 0) {
            let found = null;
            if (id) {
                found = products.find(p => p.id === parseInt(id) || p.id === id);
            }
            if (!found && slug) {
                found = products.find(p => 
                    (p.clothing_information?.slug === slug) || 
                    (slugify(p.name) === slug) ||
                    (p.id === slug) // fallback in case the URL just passed an ID directly
                );
            }
            setProduct(found);
            setLoading(false);
            if (found) {
                 fetchReviews(found.id);
                 setSelectedImage(found.image);
                 
                 // SEO Update
                 document.title = found.clothingInformation?.metaTitle || found.name + " | Enbroidery";
            }
        }
    }, [id, slug, products]);

    const fetchReviews = async (productId) => {
        try {
            const { data } = await supabase
                .from('reviews')
                .select('id, user_name, rating, comment, image_url, created_at')
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
            <div className="min-h-screen bg-[#fdfbf7] pt-8 lg:pt-20">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">
                        {/* Image Skeleton */}
                        <div className="lg:col-span-5 aspect-[4/5] bg-stone-100 rounded-2xl animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                        
                        {/* Content Skeleton */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="h-6 w-24 bg-stone-100 rounded-full animate-pulse"></div>
                            <div className="h-12 w-3/4 bg-stone-100 rounded-xl animate-pulse"></div>
                            <div className="h-4 w-1/2 bg-stone-100 rounded-md animate-pulse"></div>
                            <div className="pt-8 space-y-4">
                                <div className="h-16 w-40 bg-stone-100 rounded-xl animate-pulse"></div>
                                <div className="h-4 w-full bg-stone-100 rounded-md animate-pulse"></div>
                                <div className="h-4 w-5/6 bg-stone-100 rounded-md animate-pulse"></div>
                            </div>
                            <div className="pt-10 flex gap-4">
                                <div className="h-14 flex-1 bg-stone-100 rounded-2xl animate-pulse"></div>
                                <div className="h-14 w-40 bg-stone-100 rounded-2xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
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

    

    // Smart Recommendation Engine
    const normalize = (str) => (str || '').toLowerCase().trim();
    const getSmartRecommendations = (currentProduct, allProducts) => {
        const keywords = [
            'pink', 'blue', 'yellow', 'red', 'green', 'white', 'black', 'purple', 
            'sunflower', 'daisy', 'rose', 'heart', 'star', 'butterfly', 'bow', 'floral', 'aesthetic'
        ];
        
        const extractKeywords = (p) => {
            const text = `${p.name} ${p.description || ''}`.toLowerCase();
            return keywords.filter(kw => text.includes(kw));
        };

        const currentKeywords = extractKeywords(currentProduct);

        let scoredProducts = allProducts
            .filter(p => p.id !== currentProduct.id)
            .map(p => {
                let score = 0;
                // Category match
                if (normalize(p.category) === normalize(currentProduct.category)) score += 2;
                
                // Keyword match
                const pKeywords = extractKeywords(p);
                const sharedKeywords = currentKeywords.filter(kw => pKeywords.includes(kw));
                score += sharedKeywords.length * 5; // Heavy weight for shared themes/colors
                
                return { product: p, score };
            });

        // Sort by score (descending)
        scoredProducts.sort((a, b) => b.score - a.score);
        return scoredProducts.map(sp => sp.product);
    };

    // Final Derived Recommendations
    let relatedProducts = [];
    if(recommendedIds.length > 0) {
        relatedProducts = recommendedIds.map(recId => products.find(p => p.id === recId)).filter(Boolean);
        // If ML didn't return enough, backfill with smart recommendations
        if (relatedProducts.length < 4) {
            const smartRecs = getSmartRecommendations(product, products);
            const remaining = smartRecs.filter(p => !relatedProducts.find(rp => rp.id === p.id));
            relatedProducts = [...relatedProducts, ...remaining].slice(0, 4);
        }
    } else {
        relatedProducts = getSmartRecommendations(product, products).slice(0, 4);
    }



    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    // Selection Logic Part 2
     const effectiveSize = selectedSize || (!hasSizes ? 'Standard' : null);
     
     // Variant-Specific Images for Display
     const displayImages = (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 && selectedVariant.images[0])
        ? selectedVariant.images
        : (() => {
            let imgs = [];
            if (product.image) imgs.push(product.image);
            if (product.images && product.images.length > 0) {
                product.images.forEach(img => {
                    if (img && !imgs.includes(img)) imgs.push(img);
                });
            }
            return imgs.length > 0 ? imgs : ['https://via.placeholder.com/500'];
        })();

     // Price Logic
     const matrixKey = (selectedColor && effectiveSize) ? `${selectedColor}-${effectiveSize}` : null;
     const matrixData = matrixKey && info.variantStock ? info.variantStock[matrixKey] : null;

     let currentPrice = product.price;
     if (matrixData && matrixData.price) {
         currentPrice = Number(matrixData.price);
     } else if (selectedVariant && selectedVariant.price) {
         currentPrice = Number(selectedVariant.price);
     }

     // Stock Logic
     let currentStock = product.stock;
     
     if (hasSizes && matrixData && matrixData.stock !== undefined) {
          currentStock = Number(matrixData.stock);
     } else if (hasSizes && (!matrixData || matrixData.stock === undefined)) {
         if (selectedSize && sizes && sizes[selectedSize] !== undefined) {
             currentStock = sizes[selectedSize];
         } else {
             currentStock = 0; 
         }
     } else if (!hasSizes && selectedVariant && selectedVariant.stock !== undefined) {
         currentStock = Number(selectedVariant.stock);
     } else if (!hasSizes && !selectedVariant) {
         currentStock = product.stock;
     }

     const isCurrentVariantInStock = currentStock > 0;
     const isStockAvailable = isCurrentVariantInStock;

    // Validation Helper
    const validateSelection = (actionType) => {
        const isMobile = window.innerWidth < 1024;
        
        // 1. Check Color
        // Use availableColors instead of info.colors to check if colors are relevant
        if (product.clothingInformation && availableColors.length > 0 && !hasOnlyNAColor && !selectedColor) {
            setColorError(true);
            if (isMobile) {
                setPendingAction(actionType);
                setIsVariantSheetOpen(true);
            } else {
                addToast('Please select a color first', 'error');
                const el = document.getElementById('color-selector');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }

        // 2. Check Size
        if (product.clothingInformation && hasSizes && !shouldHideSizeSelector && !selectedSize) {
            setSizeError(true);
            if (isMobile) {
                setPendingAction(actionType);
                setIsVariantSheetOpen(true);
            } else {
                addToast('Please select a size first', 'error');
                const el = document.getElementById('size-selector');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }

        return true;
    };

    // Schema Construction
    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images ? product.images : [product.image],
        "description": info.longDescription || info.shortDescription || product.description,
        "sku": String(product.id),
        "mpn": String(product.id),
        "url": window.location.href,
        "brand": {
            "@type": "Brand",
            "name": "Crochet Wali"
        },
        "category": product.category,
        "material": "Premium Yarn",
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": currentPrice,
            "availability": isStockAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "IN",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 5,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": currentPrice >= (FREE_DELIVERY_THRESHOLD || 999) ? 0 : 50,
                    "currency": "INR"
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "IN"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 3,
                        "unitCode": "d"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 3,
                        "maxValue": 7,
                        "unitCode": "d"
                    }
                }
            }
        }
    };

    if (reviews.length > 0) {
        productSchema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": averageRating,
            "reviewCount": reviews.length
        };
        productSchema.review = reviews.slice(0, 5).map(review => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating
            },
            "author": {
                "@type": "Person",
                "name": review.userName || "Customer"
            },
            "reviewBody": review.comment
        }));
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.embroiderybysana.live"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://www.embroiderybysana.live/shop"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.name,
                "item": window.location.href
            }
        ]
    };

    const pageSchema = [productSchema, breadcrumbSchema];

    // Build FAQ Schema based on product
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the material of ${product.name}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `This ${product.category?.toLowerCase() || 'item'} is handmade using premium, durable materials by Crochet Wali.`
                }
            },
            {
                "@type": "Question",
                "name": "How long does shipping take for this item?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Standard delivery takes approximately 4-7 days depending on your location in India. Custom handmade pieces may require an extra 1-3 days for crafting."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a return policy?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! We offer a 5-day return window from the date of delivery. If the item arrives damaged, we will replace it free of charge."
                }
            }
        ]
    };
    pageSchema.push(faqSchema);
    if (info.faqs && info.faqs.length > 0) {
        pageSchema.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": info.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        });
    }

    const renderColorSelector = () => {
        if (!product.clothingInformation || !availableColors || availableColors.length <= 1 || hasOnlyNAColor) return null;
        return (
            <div className="space-y-4" id="color-selector">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-stone-900">Selected Color:</h3>
                    {selectedColor && <span className="text-sm text-stone-600 capitalize">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => {
                        const isSelected = selectedColor === color;
                        const variantForColor = product.variants?.find(v => v.color === color);
                        const colorImage = variantForColor?.images?.[0] || product.image;
                        return (
                            <button
                                key={color}
                                onClick={() => {
                                    setSelectedColor(color);
                                    setColorError(false);
                                }}
                                className={`p-1 rounded-2xl border-2 transition-all duration-300 ${
                                    isSelected 
                                        ? 'border-stone-900 shadow-sm' 
                                        : 'border-stone-200 hover:border-stone-400'
                                }`}
                            >
                                <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-stone-100">
                                    <img src={colorImage} alt={color} className="w-full h-full object-cover" />
                                </div>
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
        );
    };


    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-2 md:pt-8 pb-24 lg:pb-20 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title={product.name} 
                description={info.shortDescription || product.description?.substring(0, 150)} 
                schema={pageSchema} 
                image={product.image} 
                url={window.location.href} 
            />
            <div className="container-custom">
                {/* Breadcrumb */}
                <div className="hidden md:block mb-6 md:mb-10">
                    <div className="flex items-center gap-2 text-sm text-stone-400">
                        <Link to="/" className="hover:text-rose-900 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-rose-900 transition-colors">Shop</Link>
                        <span>/</span>
                        <span className="text-stone-700 font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 xl:gap-16 mb-12 lg:mb-28">
                    {/* Image Section */}
                    <div className="lg:col-span-5 relative h-fit lg:sticky lg:top-28 space-y-4 lg:space-y-0 lg:flex lg:gap-4 xl:max-w-lg">
                        {/* Desktop Thumbnails (Left Side) */}
                        {displayImages && displayImages.length > 1 && (
                            <div className="hidden lg:flex flex-col gap-2.5 w-[72px] flex-shrink-0 max-h-[75vh] overflow-y-auto no-scrollbar py-1">
                                {displayImages.map((img, idx) => (
                                    img && (
                                        <button 
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            className={`aspect-[2/3] lg:aspect-[4/5] rounded-[18px] overflow-hidden border-2 transition-all duration-300 ${
                                                (selectedImage || displayImages[0]) === img 
                                                ? 'border-stone-900 shadow-sm ring-2 ring-stone-900/10' 
                                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-stone-200'
                                            }`}
                                        >
                                            <img src={img} alt={`${product.name} - View ${idx + 1}`} className="w-full h-full object-cover object-top" width="800" height="800" />
                                        </button>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Main Image Area */}
                        <div className="flex-1 rounded-[24px] overflow-hidden relative shadow-md group bg-white aspect-[2/3] lg:aspect-[4/5]">
                            <div className="hidden lg:block w-full h-full relative overflow-hidden"> 
                                <AnimatePresence mode="wait">
                                    <motion.img 
                                        key={selectedImage || displayImages[0] || product.image}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        src={selectedImage || displayImages[0] || product.image || 'https://via.placeholder.com/500'} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover object-top" 
                                    />
                                </AnimatePresence>
                                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleWishlist(product)}
                                        className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-stone-600 hover:text-rose-600 group/btn"
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                    </motion.button>
                                </div>
                            </div>
                            <div 
                                className="lg:hidden flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar relative"
                                onScroll={(e) => {
                                    const scrollPos = e.target.scrollLeft;
                                    const width = e.target.clientWidth;
                                    const index = Math.round(scrollPos / width);
                                    if (index !== mobileActiveIndex) setMobileActiveIndex(index);
                                }}
                            >
                                {displayImages.map((img, idx) => (
                                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                        <img 
                                            src={img} 
                                            alt={`${product.name} - View ${idx + 1}`} 
                                            className="w-full h-full object-cover object-top" 
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Mobile Image Overlay Elements */}
                            <div className="lg:hidden absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm"
                                >
                                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : 'text-stone-600'}`} />
                                </button>
                                {displayImages && displayImages.length > 1 && (
                                    <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-[10px] font-bold text-stone-700 tracking-widest mt-1">
                                        {mobileActiveIndex + 1}/{displayImages.length}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile-only Color Selector and Gift Packaging */}
                        <div className="block lg:hidden mt-4 space-y-4">
                            {renderColorSelector()}

                        </div>
                    </div>


                    {/* Details Section - Premium Typography */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7 lg:pt-4 min-w-0 font-body-alt"
                    > 
                        <div className="mb-4 space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="inline-flex items-center text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={async () => {
                                            const shareData = {
                                                title: product.name,
                                                text: `Check out ${product.name} on Embroidery By Sana`,
                                                url: window.location.href,
                                            };
                                            if (navigator.share) {
                                                try { await navigator.share(shareData); } catch { /* user cancelled */ }
                                            } else {
                                                await navigator.clipboard.writeText(window.location.href);
                                                addToast('Link copied to clipboard!', 'success');
                                            }
                                        }}
                                        className="flex items-center gap-1.5 text-stone-400 hover:text-stone-900 transition-colors text-xs font-medium bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/60"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span className="hidden lg:inline">Share</span>
                                    </button>
                                </div>
                             </div>

                            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-black leading-snug break-words">
                                {product.name}
                            </h1>
                            
                            {info.shortDescription && (
                                <p className="hidden lg:block text-stone-500 text-base leading-relaxed font-light">{info.shortDescription}</p>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'fill-stone-900 text-stone-900' : 'text-stone-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-stone-900">{averageRating}</span>
                                <span className="text-stone-300 px-1">·</span>
                                <a href="#reviews" className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors">
                                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                </a>
                            </div>
                        </div>

                        {/* Price Area */}
                        <div className="mb-4 pb-4 border-b border-stone-100 font-body-alt">
                            <div className="flex flex-col gap-1.5 mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2.5 bg-emerald-800 text-white px-3 py-1.5 rounded shadow-[0_2px_4px_rgba(6,78,59,0.3)] w-fit">
                                        <span className="text-3xl lg:text-4xl font-heading font-semibold tracking-tight">
                                            <span className="text-lg lg:text-xl font-sans mr-0.5">₹</span>{currentPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {product.originalPrice && product.originalPrice > currentPrice && (
                                        <span className="text-lg lg:text-xl font-medium text-stone-400 line-through">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                                {product.originalPrice && product.originalPrice > currentPrice && (
                                    <div className="text-sm font-bold text-emerald-700 ml-1">
                                        Save ₹{(product.originalPrice - currentPrice).toLocaleString('en-IN')}
                                    </div>
                                )}
                            </div>
                            <p className="text-stone-400 text-[11px] mb-5 uppercase tracking-wider font-medium ml-1">Inclusive of all taxes</p>
                            
                            {/* CRO Low Stock Scarcity Indicator */}
                            {currentStock > 0 && currentStock <= 5 && (
                                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 bg-rose-50/80 px-4 py-2.5 rounded-xl border border-rose-100/60 w-fit mb-5">
                                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                                    <span>Only {currentStock} left in stock - order soon!</span>
                                </div>
                            )}
                            
                            {/* Mobile-optimized Delivery Box */}
                            <div className="mb-4 w-full">
                                <PincodeChecker />
                            </div>
                            
                            {/* Urgency Badge */}
                            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 w-full mb-6">
                                <span className="text-base animate-pulse">🔥</span>
                                <span>{product.id ? (product.id.charCodeAt(0) % 15) + 5 : 12} people bought this recently</span>
                            </div>
                        </div>
                   
                        
                        {/* Selector Section: Color & Size */}
                        {product.clothingInformation && (
                            <div className="mb-6 space-y-5">
                                {/* Desktop-only Color Selector Using availableColors */}
                                {availableColors && availableColors.length > 0 && !hasOnlyNAColor && (
                                    <div className="hidden lg:block mb-4">
                                        {renderColorSelector()}
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
                                                             isAvailable = Number(info.variantStock[vKey].stock) > 0;
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
                                                        className={`min-w-[4rem] px-4 py-2.5 rounded-full border transition-all duration-300 flex items-center justify-center font-bold text-sm ${
                                                            isSelected 
                                                                ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-4 ring-stone-900/10' 
                                                                : isAvailable 
                                                                    ? 'bg-white text-stone-600 border-stone-200 hover:border-stone-900 hover:text-stone-900 hover:shadow-sm' 
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



                        {/* Trust strip — desktop only */}
                        <div className="hidden lg:grid grid-cols-4 gap-2 mb-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <Award className="w-5 h-5 text-stone-700 shrink-0" />
                                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Handmade</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <Truck className="w-5 h-5 text-stone-700 shrink-0" />
                                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Pan India</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <div className="w-5 h-5 flex items-center justify-center font-bold text-stone-700 text-xs border-2 border-stone-700 rounded-full shrink-0">₹</div>
                                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">COD Available</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <Shield className="w-5 h-5 text-stone-700 shrink-0" />
                                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">Secure</span>
                            </div>
                        </div>

                        {/* Actions (Desktop & Mobile In-flow) */}
                        <div className="flex flex-col gap-3 mb-6">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    if (isInCart) {
                                        navigate('/cart');
                                        return;
                                    }

                                    if (!validateSelection('add')) return;
                                    
                                    await addToCart({ 
                                        ...product, 
                                        selectedSize, 
                                        selectedColor, 
                                        price: currentPrice, 
                                        variantId: selectedVariant?.id,
                                        giftNote: isGiftWrapped ? giftNote : null
                                    });
                                }}
                                disabled={!isStockAvailable}
                                className={`hidden lg:flex w-full h-[52px] rounded-[14px] font-bold uppercase tracking-widest text-sm transition-all duration-300 items-center justify-center gap-2 ${
                                    isStockAvailable
                                    ? isInCart 
                                        ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md ring-4 ring-emerald-900/10' 
                                        : 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg hover:shadow-xl hover:shadow-stone-900/15 ring-4 ring-stone-900/5'
                                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                }`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                {isStockAvailable ? (isInCart ? 'Go to Cart' : 'Add to Cart') : 'Sold Out'}
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                        if(isStockAvailable) {
                                        if (!validateSelection('buy')) return;
                                        await addToCart({ 
                                            ...product, 
                                            selectedSize, 
                                            selectedColor, 
                                            price: currentPrice, 
                                            variantId: selectedVariant?.id,
                                            giftNote: isGiftWrapped ? giftNote : null 
                                        });
                                        navigate('/cart');
                                        }
                                }}
                                disabled={!isStockAvailable}
                                className="hidden lg:flex w-full h-[52px] bg-gradient-to-r from-rose-900 to-pink-700 text-white font-bold uppercase tracking-widest text-sm rounded-[14px] hover:shadow-lg hover:shadow-rose-900/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed items-center justify-center gap-2"
                            >
                                Buy At ₹{currentPrice.toLocaleString()}
                            </motion.button>
                            
                            {/* CRO Estimated Delivery */}
                            <div className="hidden lg:flex items-center justify-center gap-2 text-stone-500 mt-2 mb-2">
                                <Package className="w-4 h-4 text-stone-400" />
                                <span className="text-xs font-medium tracking-wide">Estimated Delivery: <span className="font-bold text-stone-700">4-7 Days</span></span>
                            </div>


                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="flex items-center gap-2.5 p-3 bg-white rounded-[14px] border border-stone-100 shadow-sm text-stone-600">
                                    <Award className="w-4 h-4 text-rose-700 shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Handmade<br/>in India</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3 bg-white rounded-[14px] border border-stone-100 shadow-sm text-stone-600">
                                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure<br/>Payments</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3 bg-white rounded-[14px] border border-stone-100 shadow-sm text-stone-600">
                                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Fast<br/>Delivery</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3 bg-white rounded-[14px] border border-stone-100 shadow-sm text-stone-600">
                                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Premium<br/>Quality</span>
                                </div>
                            </div>
                            
                            {/* CRO Estimated Delivery (Mobile) */}
                            <div className="flex lg:hidden items-center justify-center gap-2 text-stone-500 mt-4 mb-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                <Package className="w-4 h-4 text-stone-400" />
                                <span className="text-xs font-medium tracking-wide">Estimated Delivery: <span className="font-bold text-stone-700">4-7 Days</span></span>
                            </div>
                        </div>

                        {/* Why Handmade Strip */}
                        <div className="flex items-center gap-3 p-3.5 bg-[#f5f2eb] rounded-xl border border-stone-200/50 mb-6 lg:mb-8">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 text-base">
                                🇮🇳
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-stone-900 leading-tight">Handmade with love in India</h4>
                                <p className="text-[11px] text-stone-500 leading-snug line-clamp-2 mt-0.5">
                                    Crafted with premium materials. Because it's not mass-produced, each piece is uniquely yours.
                                </p>
                            </div>
                        </div>
                        
                        {/* Perfect For Section */}
                        {(info.perfectFor || !info.perfectFor) && (
                            <div className="mb-6 lg:mb-8 block">
                                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Perfect For</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(info.perfectFor ? info.perfectFor.split(',') : ["Birthday Gifts", "Best Friend Gifts", "Room Décor", "Bag Charms", "Car Accessories"]).map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-600 shadow-sm cursor-default hover:bg-stone-50 transition-colors">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order Timeline */}
                        <div className="mb-8 lg:mb-12 block p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
                            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-4 text-center">Order Journey</h4>
                            <div className="flex items-center justify-between text-center relative max-w-sm mx-auto">
                                <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-300 -z-0"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-sm"><ShoppingBag className="w-3.5 h-3.5" /></div>
                                    <span className="text-[10px] font-bold text-stone-800">Order Placed</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center border-2 border-stone-300"><Star className="w-3.5 h-3.5" /></div>
                                    <span className="text-[10px] font-bold text-stone-800">Handmade</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center border-2 border-stone-300"><Truck className="w-3.5 h-3.5" /></div>
                                    <span className="text-[10px] font-bold text-stone-800">Shipped</span>
                                </div>
                                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                    <div className="w-8 h-8 rounded-full bg-stone-50 text-stone-900 flex items-center justify-center border-2 border-stone-300"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                                    <span className="text-[10px] font-bold text-stone-800">Delivered</span>
                                </div>
                            </div>
                        </div>

                        {/* Customization Available Badge */}
                        {availableColors && availableColors.length > 1 && (
                            <div className="mb-6 lg:mb-8 flex items-center justify-between p-4 bg-gradient-to-r from-stone-50 to-rose-50/30 rounded-xl border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-rose-500">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-stone-900">Custom Colors Available</h4>
                                        <p className="text-xs text-stone-500 mt-0.5">Mix and match to your liking.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                {/* Frequently Bought Together Bundle */}
                {relatedProducts.length > 0 && (
                            <div className="border-t border-stone-100 pt-6 lg:pt-12 pb-6 lg:pb-8 font-body-alt">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-widest mb-2">
                                            <Sparkles className="w-3 h-3" />
                                            Bundle & Save
                                        </div>
                                        <h2 className="text-2xl font-heading font-bold text-stone-900">Complete the look ✨</h2>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-stone-50 to-rose-50/20 rounded-2xl border border-stone-100 p-5 shadow-sm">
                                    <div className="flex items-center gap-3 overflow-x-auto pb-5 hide-scrollbar snap-x -mx-1 px-1">
                                        {/* Current Product */}
                                        <div className="shrink-0 flex flex-col gap-2 w-28 snap-start">
                                            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-stone-200 bg-white relative">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-stone-900 truncate">This Item</div>
                                                <div className="text-[10px] text-stone-500 font-medium">₹{currentPrice.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <Plus className="w-5 h-5 text-stone-300 shrink-0" />
                                        
                                        {/* Related Product */}
                                        <div className="shrink-0 flex flex-col gap-2 w-28 snap-start">
                                            <Link to={getProductUrl(relatedProducts[0])} className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-stone-200 block hover:border-rose-300 transition-colors bg-white group relative">
                                                <img src={relatedProducts[0].image} alt={relatedProducts[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm text-stone-800">Add-on</div>
                                            </Link>
                                            <div>
                                                <Link to={getProductUrl(relatedProducts[0])} className="text-xs font-bold text-stone-900 truncate hover:text-rose-900 transition-colors block">{relatedProducts[0].name}</Link>
                                                <div className="text-[10px] text-stone-500 font-medium">₹{relatedProducts[0].price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        
                                        <Plus className="w-5 h-5 text-stone-300 shrink-0" />
                                        
                                        {/* Premium Gift Packaging */}
                                        <div className="shrink-0 flex flex-col gap-2 w-28 snap-start">
                                            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-rose-200 bg-rose-50 flex flex-col items-center justify-center p-3 text-center relative">
                                                <span className="text-3xl mb-1">🎁</span>
                                                <span className="text-[10px] font-bold text-rose-900 leading-tight">Gift Ready Wrap</span>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-stone-900 truncate">Add-on</div>
                                                <div className="text-[10px] text-stone-500 font-medium">₹29</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-stone-200">
                                        <div className="flex items-end justify-between mb-4">
                                            <div>
                                                <div className="text-xs text-stone-500 font-medium mb-1">Total Bundle Price</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-heading font-bold text-stone-900">
                                                        ₹{(currentPrice + relatedProducts[0].price + 29 - 49).toLocaleString()}
                                                    </span>
                                                    <span className="text-sm text-stone-400 line-through">
                                                        ₹{(currentPrice + relatedProducts[0].price + 29).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                                Save ₹49
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={async () => {
                                                if (!validateSelection('add')) return;
                                                
                                                let relatedSize = null;
                                                let relatedColor = null;
                                                const relatedInfo = relatedProducts[0].clothingInformation;
                                                if (relatedInfo?.sizes && Object.keys(relatedInfo.sizes).length > 0) {
                                                    relatedSize = Object.keys(relatedInfo.sizes)[0];
                                                    if (relatedInfo.sizes['Free']) relatedSize = 'Free';
                                                    else if (relatedInfo.sizes['Standard']) relatedSize = 'Standard';
                                                }
                                                
                                                if (relatedProducts[0].variants && relatedProducts[0].variants.length > 0) {
                                                    relatedColor = relatedProducts[0].variants[0].color;
                                                } else if (relatedInfo?.colors && relatedInfo.colors.length > 0) {
                                                    relatedColor = relatedInfo.colors[0];
                                                }

                                                const relatedVariantId = relatedProducts[0].variants && relatedProducts[0].variants.length > 0 
                                                    ? relatedProducts[0].variants[0].id 
                                                    : null;

                                                await addToCart({ 
                                                    ...product, 
                                                    selectedSize: selectedSize || null, 
                                                    selectedColor, 
                                                    price: currentPrice, 
                                                    variantId: selectedVariant?.id, 
                                                    giftPackaging: true, 
                                                    giftNote: giftNote || 'Bundle Gift'
                                                });
                                                
                                                await addToCart({ 
                                                    ...relatedProducts[0], 
                                                    selectedSize: relatedSize,
                                                    selectedColor: relatedColor,
                                                    variantId: relatedVariantId,
                                                    price: relatedProducts[0].price 
                                                });
                                                
                                                navigate('/cart');
                                            }}
                                            className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl text-sm hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Add Bundle To Cart
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'description' ? 'max-h-[2000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <div className="text-stone-600 leading-[1.8] font-light mb-6 text-sm md:text-base space-y-3">
                                        {(info.long_description || product.description).split('\n').map((line, i) => {
                                            const trimmed = line.trim();
                                            if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                                                return (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1.5" />
                                                        <span className="text-stone-700">{trimmed.replace(/^[-•]\s*/, '')}</span>
                                                    </div>
                                                );
                                            }
                                            return trimmed ? <p key={i}>{trimmed}</p> : null;
                                        })}
                                    </div>
                                    
                                    {info.keyFeatures && info.keyFeatures.length > 0 && (
                                        <div className="mb-4">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {info.keyFeatures.map((feat, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700 leading-relaxed font-light">
                                                        <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
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

                            {/* FAQ Block */}
                            <div className="border-b border-stone-200" itemScope itemType="https://schema.org/FAQPage">
                                <button 
                                    onClick={() => toggleSection('faq')}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="font-heading font-medium text-lg text-stone-900">Frequently Asked Questions</span>
                                    {openSection === 'faq' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'faq' ? 'max-h-[2000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <div className="space-y-4">
                                        <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                                            <h4 itemProp="name" className="font-heading font-medium text-stone-900 text-sm">How long will my order take to arrive?</h4>
                                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                                <p itemProp="text" className="text-stone-600 text-sm mt-1">Since all items are handcrafted and made-to-order, please allow 1-3 days for processing. Standard shipping across India takes an additional 3-7 business days.</p>
                                            </div>
                                        </div>
                                        <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                                            <h4 itemProp="name" className="font-heading font-medium text-stone-900 text-sm">Can I request custom colors?</h4>
                                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                                <p itemProp="text" className="text-stone-600 text-sm mt-1">Yes! Many of our crochet accessories can be customized. Feel free to contact us via WhatsApp or Email after placing your order to discuss color modifications.</p>
                                            </div>
                                        </div>
                                        <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                                            <h4 itemProp="name" className="font-heading font-medium text-stone-900 text-sm">How do I care for my crochet items?</h4>
                                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                                <p itemProp="text" className="text-stone-600 text-sm mt-1">For optimal longevity, hand wash gently in cold water with mild detergent and lay flat to dry. Do not wring or machine wash, as this may distort the shape of the yarn.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Care Instructions */}
                            <div className="border-b border-stone-200">
                                <button 
                                    onClick={() => toggleSection('care')}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="font-heading font-medium text-lg text-stone-900">Care Instructions</span>
                                    {openSection === 'care' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'care' ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <ul className="space-y-3 text-sm text-stone-600">
                                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 flex-shrink-0"></span> Gently hand wash in cold water with mild detergent.</li>
                                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 flex-shrink-0"></span> Do not wring or twist. Press gently to remove excess water.</li>
                                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 flex-shrink-0"></span> Lay flat to air dry to maintain the original shape.</li>
                                        <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2 flex-shrink-0"></span> Keep away from direct harsh sunlight for prolonged periods to prevent fading.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Gift Ideas */}
                            <div className="border-b border-stone-200">
                                <button 
                                    onClick={() => toggleSection('gift')}
                                    className="w-full py-6 flex items-center justify-between text-left group"
                                >
                                    <span className="font-heading font-medium text-lg text-stone-900">Gifting Ideas</span>
                                    {openSection === 'gift' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900 transition-colors" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'gift' ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-sm text-stone-600 mb-3">This handmade item makes a perfect, thoughtful gift for:</p>
                                    <ul className="space-y-2 text-sm text-stone-600">
                                        <li className="flex items-center gap-2"><Gift className="w-4 h-4 text-rose-400" /> Anniversaries & Valentine's Day</li>
                                        <li className="flex items-center gap-2"><Gift className="w-4 h-4 text-rose-400" /> Birthdays for friends or partners</li>
                                        <li className="flex items-center gap-2"><Gift className="w-4 h-4 text-rose-400" /> Wedding return gifts</li>
                                        <li className="flex items-center gap-2"><Gift className="w-4 h-4 text-rose-400" /> Housewarming presents</li>
                                    </ul>
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

                        {/* Reviews */}
                        <div id="reviews" className="border-t border-stone-100 pt-8 lg:pt-12 mt-8 lg:mt-12 mb-12 lg:mb-24">
                            {/* Reviews Header */}
                            <div className="flex flex-col gap-6 mb-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-heading text-2xl font-semibold text-stone-900">Customer Reviews</h3>
                                        <p className="text-stone-500 text-sm mt-1">{reviews.length} verified purchase{reviews.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <button 
                                        onClick={() => setReviewModalOpen(true)}
                                        className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors whitespace-nowrap flex-shrink-0"
                                    >
                                        Write a Review
                                    </button>
                                </div>
                                
                                {/* Rating Summary Bar */}
                                {reviews.length > 0 && (
                                    <div className="flex items-center gap-5 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                        <div className="text-center">
                                            <div className="text-3xl font-heading font-bold text-stone-900 leading-none">{averageRating}</div>
                                            <div className="flex text-amber-400 mt-1.5 justify-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={`head-star-${i}`} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-stone-400 mt-1 font-medium">out of 5</p>
                                        </div>
                                        <div className="w-px h-12 bg-stone-200"></div>
                                        <div className="flex-1 space-y-1.5">
                                            {[5, 4, 3, 2, 1].map(star => {
                                                const count = reviews.filter(r => r.rating === star).length;
                                                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-2">
                                                        <span className="text-xs text-stone-500 w-4 text-right font-medium">{star}</span>
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                                                        <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] text-stone-400 w-5 font-medium">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 bg-rose-50/50 rounded-2xl border border-rose-100 shadow-sm font-body-alt">
                                    <div className="flex justify-center mb-4">
                                        <div className="flex -space-x-3">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-bold text-stone-500`}>
                                                    U{i}
                                                </div>
                                            ))}
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-800 shadow-sm">
                                                +50
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-stone-900 font-heading font-medium text-xl mb-1">Loved by handmade gift buyers</p>
                                    <p className="text-stone-500 text-sm font-light mb-5">Join our community of happy customers 💖</p>
                                    <button 
                                        onClick={() => setReviewModalOpen(true)}
                                        className="text-sm font-bold text-rose-900 underline underline-offset-4 hover:text-rose-700 transition-colors"
                                    >
                                        Share your experience
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.slice(0, visibleReviewsCount).map(review => (
                                        <div key={review.id} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shrink-0 ring-2 ring-rose-50">
                                                        <span className="text-rose-800 font-bold text-sm">
                                                            {review.user_name?.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-bold text-stone-900 text-sm truncate">{review.user_name}</h4>
                                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">Verified</span>
                                                        </div>
                                                        <span className="text-xs text-stone-400">{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-400 flex-shrink-0 ml-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-stone-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-stone-600 leading-relaxed text-sm pl-[52px]">{review.comment}</p>
                                            {review.image_url && (
                                                <a href={review.image_url} target="_blank" rel="noopener noreferrer" className="mt-3 ml-[52px] inline-block w-20 h-20 rounded-lg overflow-hidden border border-stone-200 hover:border-rose-300 transition-colors">
                                                    <img src={review.image_url} alt={`${product.name} customer review`} className="w-full h-full object-cover" width="400" height="400" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                    {reviews.length > visibleReviewsCount && (
                                        <div className="flex justify-center mt-6">
                                            <button 
                                                onClick={() => setVisibleReviewsCount(prev => prev + 4)}
                                                className="px-6 py-2.5 text-sm font-bold text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                                            >
                                                Show More Reviews
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-stone-100 pt-12 lg:pt-16 pb-24 overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 lg:mb-12 px-4 lg:px-0">
                            <div className="flex-1 h-px bg-stone-200" />
                            <h2 className="text-xl lg:text-2xl font-heading font-semibold text-stone-900 text-center whitespace-nowrap">🌸 Complete The Gift</h2>
                            <div className="flex-1 h-px bg-stone-200" />
                        </div>
                        <motion.div 
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            className="flex overflow-x-auto snap-x hide-scrollbar gap-4 px-4 lg:px-0 lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 lg:gap-6 xl:gap-8 3xl:gap-10 pb-6"
                        >
                            {relatedProducts.map(p => {
                                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                                return (
                                    <motion.div 
                                        key={p.id} 
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        className="group relative shrink-0 w-[42vw] sm:w-[30vw] lg:w-auto snap-start"
                                    >
                                        <div className="aspect-[2/3] overflow-hidden bg-stone-50 rounded-2xl mb-3 relative">
                                            <Link to={getProductUrl(p)}>
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
                                                <div className="absolute top-3 left-3 bg-rose-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                                                    {discount}% OFF
                                                </div>
                                            )}

                                            {/* Wishlist Button */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(p);
                                                }}
                                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
                                            </button>
                                        </div>

                                        <Link to={getProductUrl(p)} className="block space-y-1 px-1">
                                            <h3 className="font-heading font-bold text-sm text-stone-900 truncate group-hover:text-rose-900 transition-colors">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-1.5 text-sm">
                                                <span className="font-bold text-stone-900">₹{p.price.toLocaleString()}</span>
                                                {p.originalPrice && (
                                                    <>
                                                        <span className="text-stone-400 line-through text-xs">₹{p.originalPrice.toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-rose-700">({discount}% OFF)</span>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                )}

                {/* You May Also Like Section */}
                {youMayAlsoLikeProducts.length > 0 && (
                    <div className="border-t border-stone-100 pt-12 lg:pt-16 pb-24 overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 lg:mb-12 px-4 lg:px-0">
                            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-stone-900 text-left whitespace-nowrap">You may also like</h2>
                        </div>
                        <motion.div 
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-4 px-4 lg:px-0 lg:gap-6 xl:gap-8 3xl:gap-10 pb-6"
                        >
                            {youMayAlsoLikeProducts.map(p => {
                                const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                                return (
                                    <motion.div 
                                        key={p.id} 
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        className="group relative w-full"
                                    >
                                        <div className="aspect-[2/3] overflow-hidden bg-stone-50 rounded-2xl mb-3 relative">
                                            <Link to={getProductUrl(p)}>
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
                                                <div className="absolute top-3 left-3 bg-rose-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                                                    {discount}% OFF
                                                </div>
                                            )}

                                            {/* Wishlist Button */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(p);
                                                }}
                                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
                                            </button>
                                        </div>

                                        <Link to={getProductUrl(p)} className="block space-y-1 px-1">
                                            <h3 className="font-heading font-bold text-sm text-stone-900 truncate group-hover:text-rose-900 transition-colors">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-1.5 text-sm">
                                                <span className="font-bold text-stone-900">₹{p.price.toLocaleString()}</span>
                                                {p.originalPrice && (
                                                    <>
                                                        <span className="text-stone-400 line-through text-xs">₹{p.originalPrice.toLocaleString()}</span>
                                                        <span className="text-[10px] font-bold text-rose-700">({discount}% OFF)</span>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
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

            {/* Write a Review Modal */}
            {reviewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submittingReview && setReviewModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-heading font-bold text-xl text-stone-900">Write a Review</h3>
                            <button onClick={() => !submittingReview && setReviewModalOpen(false)} className="p-2 -mr-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-900">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm(s => ({ ...s, rating: star }))}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Your Name</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 bg-stone-50 focus:bg-white transition-colors"
                                    placeholder="Enter your name"
                                    value={reviewForm.name}
                                    onChange={(e) => setReviewForm(s => ({ ...s, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">Your Review</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 bg-stone-50 focus:bg-white transition-colors resize-none"
                                    placeholder="Share your experience with this product..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(s => ({ ...s, comment: e.target.value }))}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submittingReview || !reviewForm.name.trim() || !reviewForm.comment.trim()}
                                className="w-full py-3 bg-rose-900 text-white rounded-lg font-medium hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submittingReview ? <Loader className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Variant Selection Sheet */}
            {isVariantSheetOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity lg:hidden" 
                        onClick={() => setIsVariantSheetOpen(false)} 
                    />
                    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl transform transition-transform animate-in slide-in-from-bottom duration-300 lg:hidden max-h-[85vh] overflow-y-auto">
                        <button 
                            onClick={() => setIsVariantSheetOpen(false)} 
                            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 bg-stone-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-4 mb-6 mt-2">
                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone-50 shrink-0">
                                <img src={selectedImage || displayImages[0] || product.image} alt={product.name} className="w-full h-full object-cover" width="800" height="800" />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-stone-900 text-lg line-clamp-1">{product.name}</h3>
                                <div className="text-rose-900 font-bold mt-1">₹{currentPrice.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            {/* Color Selection inside Sheet */}
                            {availableColors && availableColors.length > 0 && !hasOnlyNAColor && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-sm font-bold text-stone-900">Selected Color:</h4>
                                            {selectedColor && <span className="text-sm text-stone-600 capitalize">{selectedColor}</span>}
                                        </div>
                                        {colorError && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {availableColors.map((color) => {
                                            const variantForColor = product.variants?.find(v => v.color === color);
                                            const colorImage = variantForColor?.images?.[0] || product.image;
                                            return (
                                            <button
                                                key={color}
                                                onClick={() => { setSelectedColor(color); setColorError(false); }}
                                                className={`p-1 rounded-2xl border-2 transition-all duration-300 ${
                                                    selectedColor === color 
                                                        ? 'border-stone-900 shadow-sm' 
                                                        : 'border-stone-200 hover:border-stone-400'
                                                }`}
                                            >
                                                <div className="w-14 h-16 rounded-xl overflow-hidden bg-stone-100">
                                                    <img src={colorImage} alt={color} className="w-full h-full object-cover" />
                                                </div>
                                            </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection inside Sheet */}
                            {!shouldHideSizeSelector && Object.keys(sizes).length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Size</h4>
                                        {sizeError && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {Object.entries(sizes)
                                            .sort((a, b) => {
                                                const order = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, '3XL': 7, 'Free': 8 };
                                                return (order[a[0]] || 99) - (order[b[0]] || 99);
                                            })
                                            .map(([size, _legacyQty]) => {
                                                let isAvailable = true;
                                                if (info.variantStock) {
                                                     if (selectedColor) {
                                                         const vKey = `${selectedColor}-${size}`;
                                                         if (info.variantStock[vKey] && info.variantStock[vKey].stock !== undefined) {
                                                             isAvailable = Number(info.variantStock[vKey].stock) > 0;
                                                         }
                                                     }
                                                } else if (selectedVariant) {
                                                    isAvailable = (selectedVariant.stock || 0) > 0;
                                                } else {
                                                    isAvailable = _legacyQty > 0;
                                                }

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
                                                        className={`w-12 h-12 rounded-xl border text-sm transition-all flex items-center justify-center font-medium ${
                                                            selectedSize === size 
                                                                ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
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
                                </div>
                            )}

                        </div>

                        <button
                            onClick={async () => {
                                // Final check inside the sheet
                                if ((availableColors.length > 0 && !hasOnlyNAColor && !selectedColor) || 
                                    (hasSizes && !shouldHideSizeSelector && !selectedSize)) {
                                    if (!selectedColor) setColorError(true);
                                    if (!selectedSize) setSizeError(true);
                                    return;
                                }
                                
                                setIsVariantSheetOpen(false);
                                
                                if (pendingAction === 'add') {
                                    await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice, variantId: selectedVariant?.id });
                                } else if (pendingAction === 'buy') {
                                    await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice, variantId: selectedVariant?.id });
                                    navigate('/cart');
                                }
                            }}
                            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold text-sm tracking-wide shadow-md hover:bg-black transition-colors"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </>
            )}

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-100 p-3 lg:hidden z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                    <Link 
                        to="/cart" 
                        className={`relative flex-shrink-0 flex items-center justify-center rounded-[12px] border border-stone-200 bg-white shadow-sm transition-all h-[52px] ${isInCart ? 'px-4' : 'w-[52px]'}`}
                    >
                        <ShoppingCart className="w-5 h-5 text-stone-900 stroke-[2.5]" />
                        {isInCart && (
                            <span className="ml-2 font-bold text-sm text-[#1a365d] whitespace-nowrap">View Cart</span>
                        )}
                        {cartCount > 0 && (
                            <span className={`absolute -top-1.5 -right-1.5 bg-[#e11d48] text-white text-[10px] font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-sm`}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    
                    {isInCart ? (
                        <div className="flex-1 h-[52px] bg-[#e11d48] rounded-[12px] flex items-center justify-between px-2 shadow-md">
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (cartItem.quantity > 1) {
                                        updateQuantity(cartItem.id, cartItem.quantity - 1, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                    } else {
                                        removeFromCart(cartItem.id, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                    }
                                }}
                                className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition-colors active:scale-95"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-white text-base">{cartItem.quantity}</span>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    updateQuantity(cartItem.id, cartItem.quantity + 1, cartItem.selectedSize, cartItem.selectedColor, cartItem.variantId);
                                }}
                                className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition-colors active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                if (!validateSelection('add')) return;
                                await addToCart({ ...product, selectedSize, selectedColor, price: currentPrice, variantId: selectedVariant?.id });
                            }}
                            disabled={!isStockAvailable}
                            className={`flex-1 h-[52px] rounded-[12px] font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${
                                isStockAvailable
                                ? 'bg-[#e11d48] text-white shadow-md active:scale-[0.98]'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                        >
                            {isStockAvailable ? 'Add to Cart' : 'Sold Out'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../config/supabase';
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, Star, Award, Search, Sparkles, Plus, Minus, ChevronDown, Share2, X, Loader, Calendar, CheckCircle2, Package, Gift, ShoppingCart } from 'lucide-react';
import SEO from '../components/SEO';
import { PincodeChecker } from '../components/PincodeChecker';
import { extractProductIdFromSlug, getProductUrl, slugify } from '../utils/urlUtils';
import { 
    FREE_SHIPPING_THRESHOLD, 
    SHIPPING_CHARGE_BELOW_THRESHOLD, 
    DISPATCH_DAYS, 
    DELIVERY_DAYS, 
    EXPRESS_OPTION, 
    SHIPPING_SUMMARY 
} from '../constants/shippingConfig';
import { getDuplicateRedirect, getGenuineDiscount, normalizeCategory, getProductPriceDisplay } from '../utils/productSanitizer';

const getIntentDetails = (productName, category) => {
    const pName = (productName || '').toLowerCase();
    const cat = (category || '').toLowerCase();
    
    if (pName.includes('gajra') || pName.includes('parandi')) {
        return {
            occasion: "Weddings, Haldi, Mehendi, Sangeet & Festive Dressing",
            bestFor: "Brides, Bridesmaids, Saree & Ethnic Styling",
            keepsake: "Forever Keepsake • Fragrance-sprayable & Non-wilting"
        };
    }
    if (pName.includes('clip') || pName.includes('claw') || pName.includes('band') || cat.includes('accessories')) {
        return {
            occasion: "Daily Styling, College, Work & Casual Outings",
            bestFor: "Girls, Teens, Sisters, Aesthetic Accessory Lovers",
            keepsake: "100% Hand-Knitted Yarn • Snag-free & Gentle on Hair"
        };
    }
    if (pName.includes('bouquet') || pName.includes('rose') || pName.includes('tulip') || pName.includes('flower') || pName.includes('pot') || cat.includes('bouquet') || cat.includes('flower')) {
        return {
            occasion: "Anniversaries, Birthdays, Valentine's & Everlasting Keepsakes",
            bestFor: "Girlfriend, Wife, Best Friend, Desk & Room Decor",
            keepsake: "Eternal Bloom • 100% Milk Cotton Yarn, Never Wilts"
        };
    }
    if (pName.includes('keychain') || pName.includes('charm') || cat.includes('keychain')) {
        return {
            occasion: "Surprise Gifts, Birthday Favors & Daily Keepsakes",
            bestFor: "Besties, Bag Charm Lovers, Car Key Decor",
            keepsake: "Durable Hand-Stitched Amigurumi"
        };
    }
    return {
        occasion: "Birthdays, Special Anniversaries & Festive Gifting",
        bestFor: "Loved Ones, Handmade Art Enthusiasts",
        keepsake: "100% Artisanal Craft • Made with Premium Yarn in India"
    };
};

const ProductDetails = () => {
    const { slug } = useParams();
    const id = extractProductIdFromSlug(slug);
    const { products, fetchProducts, fetchSingleProduct } = useProducts();
    
    // Fetch products in background (cached via SWR)
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
    const [searchParams, setSearchParams] = useSearchParams();
    const initialColor = searchParams.get('color');
    const [selectedColor, setSelectedColor] = useState(initialColor || null);
    const [colorError, setColorError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    
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

    // Helpers for Clothing Info
    const info = product?.clothingInformation || product?.clothing_information || {};
    const sizes = info.sizes || {};
    const hasSizes = Object.keys(sizes).length > 0;
    
    const singleSizeKey = Object.keys(sizes).length === 1 && Object.keys(sizes)[0];
    const shouldHideSizeSelector = singleSizeKey === 'NA';
    const shouldAutoSelectSize = singleSizeKey === 'NA' || singleSizeKey === 'Free';

    // Variant Logic Extraction
    const variants = product?.variants || [];
    const isVariantSystemActive = variants.length > 0;

    // Color Logic
    const associatedColors = variants.map(v => v.color).filter(Boolean);
    const legacyColors = info.colors || [];
    const allColors = [...new Set([...associatedColors, ...legacyColors])];
    const availableColors = (allColors.length > 1 && allColors.includes('NA')) 
       ? allColors.filter(c => c !== 'NA') 
       : allColors;

    const hasOnlyNAColor = availableColors.length === 1 && availableColors[0] === 'NA';

    // Synchronize initial color from ?color= query param or default to first variant
    useEffect(() => {
        if (shouldAutoSelectSize && singleSizeKey) {
            setSelectedSize(singleSizeKey);
        }
        if (hasOnlyNAColor) {
            setSelectedColor('NA');
        } else if (availableColors.length > 0) {
            const urlColor = searchParams.get('color');
            if (urlColor) {
                const matched = availableColors.find(c => c.toLowerCase() === urlColor.toLowerCase());
                if (matched) {
                    if (selectedColor !== matched) setSelectedColor(matched);
                    return;
                }
            }
            if (!selectedColor || !availableColors.some(c => c.toLowerCase() === selectedColor.toLowerCase())) {
                setSelectedColor(availableColors[0]);
            }
        }
    }, [product?.id, shouldAutoSelectSize, singleSizeKey, hasOnlyNAColor, availableColors, searchParams, selectedColor]);

    // Determine Selected Variant Object (case-insensitive color matching)
    const selectedVariant = isVariantSystemActive && selectedColor 
       ? variants.find(v => (v.color || '').toLowerCase() === selectedColor.toLowerCase()) || variants[0]
       : (variants.length > 0 ? variants[0] : null);

    // Derived state for Image Update
    useEffect(() => {
        const validVariantImages = (selectedVariant?.images || []).filter(img => typeof img === 'string' && img.trim().length > 5);
        if (validVariantImages.length > 0) {
            setSelectedImage(validVariantImages[0]);
        } else if (product?.image) {
            setSelectedImage(product.image);
        }
    }, [selectedColor, selectedVariant, product]);


    // Find the exact item in cart
    const cartItem = useMemo(() => {
        if (!product || !cart) return null;
        return cart.find(item => 
            item.id === product.id && 
            (item.selectedColor === selectedColor || !selectedColor) &&
            (item.selectedSize === selectedSize || !selectedSize)
        );
    }, [cart, product, selectedSize, selectedColor]);

    const isInCart = !!cartItem;

    // Related category products (Task 2: exactly 4 products from same category)
    const relatedCategoryProducts = useMemo(() => {
        if (!products || !product) return [];
        const normCat = normalizeCategory(product.category);
        const sameCat = products.filter(p => p.id !== product.id && normalizeCategory(p.category) === normCat);
        if (sameCat.length >= 4) return sameCat.slice(0, 4);
        const other = products.filter(p => p.id !== product.id && normalizeCategory(p.category) !== normCat);
        return [...sameCat, ...other].slice(0, 4);
    }, [products, product]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Check for duplicate product redirect (e.g. duplicate parandi -> canonical parandi)
        if (slug) {
            const dupRedirect = getDuplicateRedirect(slug);
            if (dupRedirect) {
                navigate(dupRedirect, { replace: true });
                return;
            }
        }

        if (products && products.length > 0) {
            let found = null;
            
            // 1. Match by extracted ID (UUID)
            if (id) {
                found = products.find(p => p.id === id || String(p.id) === String(id));
            }
            
            // 2. Match by exact slug or exact name slug or direct ID
            if (!found && slug) {
                const targetSlug = slug.toLowerCase().trim();
                found = products.find(p => 
                    (p.clothing_information?.slug && p.clothing_information.slug.toLowerCase() === targetSlug) ||
                    (slugify(p.name) === targetSlug) ||
                    (p.id === targetSlug)
                );
            }

            // 3. Match if slug contains UUID anywhere
            if (!found && slug) {
                const uuidMatch = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
                if (uuidMatch) {
                    const extractedUuid = uuidMatch[1];
                    found = products.find(p => p.id === extractedUuid);
                }
            }

            // 4. Match prefix / slugify fallback
            if (!found && slug) {
                const targetSlug = slug.toLowerCase().trim();
                found = products.find(p => {
                    const pSlug = slugify(p.name);
                    return pSlug && (targetSlug.startsWith(pSlug) || pSlug.startsWith(targetSlug));
                });
            }

            // 5. Keyword fallback: e.g. "crochet-keychain" -> match a product whose name contains those keywords
            if (!found && slug) {
                const cleanKeywords = slug.replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase().split(' ').filter(Boolean);
                if (cleanKeywords.length > 0) {
                    found = products.find(p => {
                        const pName = p.name.toLowerCase();
                        return cleanKeywords.every(kw => pName.includes(kw));
                    }) || products.find(p => {
                        const pName = p.name.toLowerCase();
                        return cleanKeywords.some(kw => pName.includes(kw));
                    });
                }
            }

            setProduct(found);
            setLoading(false);
            if (found) {
                 fetchReviews(found.id);
                 setSelectedImage(found.image);

                 // Enforce canonical /product/<slug>-<uuid> URL format via client-side replace
                 const canonicalSlug = `${slugify(found.name)}-${found.id}`;
                 if (slug !== canonicalSlug) {
                     navigate(`/product/${canonicalSlug}${window.location.search}`, { replace: true });
                 }
            }
        } else if (id || slug) {
            // Fast-path for direct link landings: fetch single product directly
            fetchSingleProduct(id || slug).then(single => {
                if (single) {
                    setProduct(single);
                    setLoading(false);
                    fetchReviews(single.id);
                    setSelectedImage(single.image);

                    const canonicalSlug = `${slugify(single.name)}-${single.id}`;
                    if (slug !== canonicalSlug) {
                        navigate(`/product/${canonicalSlug}${window.location.search}`, { replace: true });
                    }
                }
            });
        }
    }, [id, slug, products, fetchSingleProduct, navigate]);

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
     const validVariantImages = (selectedVariant?.images || []).filter(img => typeof img === 'string' && img.trim().length > 5);
     const rawDisplayImages = validVariantImages.length > 0
        ? validVariantImages
        : (() => {
            let imgs = [];
            if (product.image) imgs.push(product.image);
            if (product.images && product.images.length > 0) {
                product.images.forEach(img => {
                    if (img && !imgs.includes(img) && img.trim().length > 5) imgs.push(img);
                });
            }
            return imgs.length > 0 ? imgs : ['https://via.placeholder.com/500'];
        })();

     const displayImages = rawDisplayImages.filter(img => typeof img === 'string' && img.trim().length > 5);

     // Price Logic
     const matrixKey = (selectedColor && effectiveSize) ? `${selectedColor}-${effectiveSize}` : null;
     const matrixData = matrixKey && info.variantStock ? info.variantStock[matrixKey] : null;

     let currentPrice = Number(product.price) || 0;
     if (matrixData && matrixData.price) {
         currentPrice = Number(matrixData.price);
     } else if (selectedVariant && selectedVariant.price) {
         currentPrice = Number(selectedVariant.price);
     }

     const genuineDiscount = getGenuineDiscount(currentPrice, product.originalPrice);

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
        
        // 1. Check Color (works even when clothingInformation is null)
        if (availableColors.length > 1 && !hasOnlyNAColor && !selectedColor) {
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
        "url": `https://www.crochetwali.in/product/${slugify(product.name)}-${product.id}`,
        "brand": {
            "@type": "Brand",
            "name": "Crochet Wali"
        },
        "category": product.category,
        "material": "Premium Yarn",
        "offers": {
            "@type": "Offer",
            "url": `https://www.crochetwali.in/product/${slugify(product.name)}-${product.id}`,
            "priceCurrency": "INR",
            "price": currentPrice,
            "availability": isStockAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            ...(product.created_at ? { "validFrom": new Date(product.created_at).toISOString().split('T')[0] } : {}),
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
                    "value": currentPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE_BELOW_THRESHOLD,
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
                "item": "https://www.crochetwali.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://www.crochetwali.in/shop"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.name,
                "item": `https://www.crochetwali.in/product/${slugify(product.name)}-${product.id}`
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

    const handleColorChange = (color) => {
        setSelectedColor(color);
        setColorError(false);
        const v = variants.find(item => (item.color || '').toLowerCase() === color.toLowerCase());
        const vImgs = (v?.images || []).filter(img => typeof img === 'string' && img.trim().length > 5);
        if (vImgs.length > 0) {
            setSelectedImage(vImgs[0]);
        } else if (product?.image) {
            setSelectedImage(product.image);
        }
        const newParams = new URLSearchParams(window.location.search);
        newParams.set('color', color);
        navigate(`?${newParams.toString()}`, { replace: true });
    };

    const renderColorSelector = () => {
        if (!availableColors || availableColors.length <= 1 || hasOnlyNAColor) return null;
        return (
            <div className="space-y-3 mb-6" id="color-selector" role="group" aria-labelledby="color-label">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900" id="color-label">Selected Color:</span>
                    {selectedColor && <span className="text-sm font-semibold text-rose-900 capitalize">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((color) => {
                        const isSelected = selectedColor?.toLowerCase() === color.toLowerCase();
                        const variantForColor = variants.find(v => (v.color || '').toLowerCase() === color.toLowerCase());
                        const validColorImages = (variantForColor?.images || []).filter(img => typeof img === 'string' && img.trim().length > 5);
                        const colorImage = (validColorImages.length > 0 ? validColorImages[0] : null) || product.image;
                        const isColorInStock = variantForColor ? (variantForColor.stock === undefined || Number(variantForColor.stock) > 0) : true;
                        return (
                            <button
                                key={color}
                                type="button"
                                onClick={() => handleColorChange(color)}
                                aria-label={`Select color ${color}`}
                                className={`p-1.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                                    isSelected 
                                        ? 'border-stone-900 bg-stone-50 shadow-sm ring-2 ring-stone-900/10' 
                                        : isColorInStock 
                                            ? 'border-stone-200 bg-white hover:border-stone-400' 
                                            : 'border-stone-200 bg-stone-100 opacity-60'
                                }`}
                            >
                                <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-stone-100 relative">
                                    <img 
                                        src={colorImage} 
                                        alt={color} 
                                        aria-hidden="true" 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                            if (product?.image && e.target.src !== product.image) {
                                                e.target.src = product.image;
                                            }
                                        }}
                                    />
                                    {!isColorInStock && (
                                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                            <span className="text-[9px] font-bold text-stone-600 bg-white px-1 py-0.5 rounded shadow-xs">Out of Stock</span>
                                        </div>
                                    )}
                                </div>
                                <span className={`block text-xs text-center font-semibold capitalize leading-none pb-0.5 ${
                                    isSelected ? 'text-stone-900 font-bold' : 'text-stone-600'
                                }`}>
                                    {color}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {colorError && (
                    <p className="text-red-500 text-sm animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Please select a color
                    </p>
                )}
            </div>
        );
    };

    const adminSeoTitle = (info?.metaTitle || product?.clothing_information?.metaTitle || product?.clothingInformation?.metaTitle || '').trim();
    const productTitle = adminSeoTitle || `${product.name} (Handmade) - ₹${currentPrice} | Crochet Wali`;

    return (
        <div className="min-h-screen bg-[#fdfbf7] pt-2 md:pt-8 pb-24 lg:pb-20 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title={productTitle} 
                exactTitle={true}
                description={info.shortDescription ? `Buy ${product.name} online at ₹${currentPrice} in India. ${info.shortDescription} 100% handcrafted with premium yarn. Delivery fee calculated on checkout.` : `Buy 100% handmade ${product.name} online at ₹${currentPrice} in India. Handcrafted with premium yarn, perfect aesthetic keepsake gift with fast doorstep delivery.`} 
                schema={pageSchema} 
                image={selectedImage || displayImages[0] || product.image} 
                url={`https://www.crochetwali.in/product/${slugify(product.name)}-${product.id}`} 
            />
            <div className="container-custom">
                {/* Breadcrumb: Home / Category / Product name */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                        <Link to="/" className="hover:text-rose-900 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to={`/shop?category=${encodeURIComponent(slugify(product.category))}`} className="hover:text-rose-900 transition-colors">{product.category}</Link>
                        <span>/</span>
                        <span className="text-stone-900 font-medium truncate max-w-[280px]">{product.name}</span>
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
                                            className={`aspect-[2/3] lg:aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                                (selectedImage || displayImages[0]) === img 
                                                ? 'border-stone-900 shadow-sm ring-2 ring-stone-900/10' 
                                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-stone-200'
                                            }`}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${product.name} - View ${idx + 1}`} 
                                                className="w-full h-full object-cover object-top" 
                                                width="800" 
                                                height="800" 
                                                onError={(e) => {
                                                    if (product?.image && e.target.src !== product.image) {
                                                        e.target.src = product.image;
                                                    }
                                                }}
                                            />
                                        </button>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Main Image Area */}
                        <div className="flex-1 rounded-2xl overflow-hidden relative shadow-md group bg-white aspect-[2/3] lg:aspect-[4/5]">
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
                                        onError={(e) => {
                                            if (product?.image && e.target.src !== product.image) {
                                                e.target.src = product.image;
                                            }
                                        }}
                                    />
                                </AnimatePresence>
                                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleWishlist(product)}
                                        aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                                        title={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                                        className="p-3 bg-white/90 backdrop-blur rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-stone-600 hover:text-rose-600 group/btn"
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                    </motion.button>
                                </div>
                            </div>
                            <div 
                                tabIndex={0}
                                role="region"
                                aria-label={`${product.name} image gallery`}
                                className="lg:hidden flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar relative focus:outline-none focus:ring-2 focus:ring-stone-400"
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
                                            onError={(e) => {
                                                if (product?.image && e.target.src !== product.image) {
                                                    e.target.src = product.image;
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Mobile Image Overlay Elements */}
                            <div className="lg:hidden absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                                    title={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
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

                    </div>


                    {/* Details Section - Premium Typography */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7 lg:pt-4 min-w-0 font-body-alt"
                    >
                        {/* 1. Product Name (Title Case) */}
                        <div className="flex items-start justify-between gap-4 mb-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-stone-900 leading-snug break-words">
                                {product.name}
                            </h1>
                            <button
                                onClick={async () => {
                                    const shareData = {
                                        title: product.name,
                                        text: `Check out ${product.name} on Crochet Wali`,
                                        url: `https://www.crochetwali.in/product/${slugify(product.name)}-${product.id}`,
                                    };
                                    if (navigator.share) {
                                        try { await navigator.share(shareData); } catch { /* user cancelled */ }
                                    } else {
                                        await navigator.clipboard.writeText(`https://www.crochetwali.in/product/${slugify(product.name)}-${product.id}`);
                                        addToast('Link copied to clipboard!', 'success');
                                    }
                                }}
                                aria-label="Share product"
                                title="Share product"
                                className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors text-xs font-medium bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/60 shrink-0 mt-1"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Share</span>
                            </button>
                        </div>

                        {/* 2. Category */}
                        <div className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 mb-2">
                            {product.category}
                        </div>

                        {/* 3. Rating only when real reviews exist */}
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-stone-900">{averageRating}</span>
                                <span className="text-stone-400 select-none">·</span>
                                <a href="#reviews" className="text-sm text-stone-600 underline underline-offset-4 hover:text-stone-900 transition-colors">
                                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                </a>
                            </div>
                        )}

                        {/* 4. Price Block */}
                        <div className="mb-6 pb-6 border-b border-stone-200/80">
                            <div className="flex flex-wrap items-baseline gap-3 mb-1.5">
                                <span className="text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                                    ₹{currentPrice.toLocaleString('en-IN')}
                                </span>
                                {genuineDiscount.isGenuine && genuineDiscount.originalPrice && (
                                    <span className="text-lg lg:text-xl font-medium text-stone-500 line-through">
                                        ₹{genuineDiscount.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                                {genuineDiscount.isGenuine && (
                                    <span className="text-xs md:text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                        Save ₹{genuineDiscount.savingAmount.toLocaleString('en-IN')} ({genuineDiscount.discountPercentage}% OFF)
                                    </span>
                                )}
                            </div>
                            <p className="text-stone-500 text-xs mb-3 font-medium">Inclusive of all taxes</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="inline-flex items-center gap-2 text-xs font-medium text-stone-700 bg-stone-100/90 px-3 py-1.5 rounded-full border border-stone-200/60 w-fit">
                                    <Truck className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                                    <span>Delivery fee calculated on checkout</span>
                                </div>
                                <span className="text-xs text-stone-600 font-medium">
                                    Free delivery on orders over ₹{FREE_SHIPPING_THRESHOLD}, ₹{SHIPPING_CHARGE_BELOW_THRESHOLD} delivery charge below ₹{FREE_SHIPPING_THRESHOLD}.
                                </span>
                            </div>
                            {currentStock > 0 && currentStock <= 5 && (
                                <div className="flex items-center gap-2 text-xs font-bold text-rose-850 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200/80 w-fit mt-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                                    <span className="text-rose-900">Only {currentStock} left in stock - order soon!</span>
                                </div>
                            )}
                        </div>

                        {/* 5. Variant Selector: colour swatches for every variant */}
                        {renderColorSelector()}

                        {/* Size Selector (when applicable) */}
                        {!shouldHideSizeSelector && Object.keys(sizes).length > 0 && (
                            <div className="space-y-3 mb-6" id="size-selector">
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
                                <div className="flex flex-wrap gap-2.5">
                                    {Object.entries(sizes)
                                        .sort((a, b) => {
                                            const order = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, '3XL': 7, 'Free': 8 };
                                            return (order[a[0]] || 99) - (order[b[0]] || 99);
                                        })
                                        .map(([size, _legacyQty]) => {
                                            let isAvailable = true;
                                            if (info.variantStock && selectedColor) {
                                                const vKey = `${selectedColor}-${size}`;
                                                if (info.variantStock[vKey] && info.variantStock[vKey].stock !== undefined) {
                                                    isAvailable = Number(info.variantStock[vKey].stock) > 0;
                                                }
                                            } else if (selectedVariant) {
                                                isAvailable = (selectedVariant.stock || 0) > 0;
                                            } else {
                                                isAvailable = _legacyQty > 0;
                                            }
                                            const isSelected = selectedSize === size;
                                            return (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            setSelectedSize(size);
                                                            setSizeError(false);
                                                        }
                                                    }}
                                                    disabled={!isAvailable}
                                                    className={`min-w-[3.5rem] px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                                                        isSelected
                                                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                                            : isAvailable
                                                                ? 'bg-white text-stone-700 border-stone-200 hover:border-stone-900'
                                                                : 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                </div>
                                {sizeError && (
                                    <p className="text-red-500 text-sm animate-pulse flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Please select a size
                                    </p>
                                )}
                            </div>
                        )}

                        {/* 6. Quantity, ADD TO CART, BUY NOW (desktop only; mobile has sticky bottom action bar) */}
                        <div className="hidden lg:block space-y-3 mb-6">
                            <div className="flex items-center gap-3">
                                {/* Quantity Counter */}
                                <div className="flex items-center border border-stone-200 rounded-xl bg-white h-[52px] px-2 shadow-xs">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={!isStockAvailable || quantity <= 1}
                                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-9 text-center font-bold text-stone-900 text-sm">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => Math.min(currentStock || 99, q + 1))}
                                        disabled={!isStockAvailable || (currentStock && quantity >= currentStock)}
                                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* ADD TO CART */}
                                <motion.button
                                    whileHover={{ scale: isStockAvailable ? 1.01 : 1 }}
                                    whileTap={{ scale: isStockAvailable ? 0.98 : 1 }}
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
                                            quantity,
                                            variantId: selectedVariant?.id,
                                            giftNote: isGiftWrapped ? giftNote : null
                                        });
                                        addToast('Added to bag!', 'success');
                                    }}
                                    disabled={!isStockAvailable}
                                    className={`flex-1 h-[52px] rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                        isStockAvailable
                                        ? isInCart 
                                            ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md ring-4 ring-emerald-900/10' 
                                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-md ring-4 ring-stone-900/5'
                                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {isStockAvailable ? (isInCart ? 'Go to Cart' : 'Add to Cart') : 'Out of Stock'}
                                </motion.button>
                            </div>

                            {/* BUY NOW */}
                            <motion.button 
                                whileHover={{ scale: isStockAvailable ? 1.01 : 1 }}
                                whileTap={{ scale: isStockAvailable ? 0.98 : 1 }}
                                onClick={async () => {
                                    if (isStockAvailable) {
                                        if (!validateSelection('buy')) return;
                                        await addToCart({ 
                                            ...product, 
                                            selectedSize, 
                                            selectedColor, 
                                            price: currentPrice, 
                                            quantity,
                                            variantId: selectedVariant?.id,
                                            giftNote: isGiftWrapped ? giftNote : null 
                                        });
                                        navigate('/cart');
                                    }
                                }}
                                disabled={!isStockAvailable}
                                className="w-full h-[52px] bg-gradient-to-r from-rose-900 to-pink-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:shadow-lg hover:shadow-rose-900/20 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isStockAvailable ? `Buy Now • ₹${(currentPrice * quantity).toLocaleString('en-IN')}` : 'Out of Stock'}
                            </motion.button>
                        </div>

                        {/* 7. Delivery Box: Pincode Checker + Timeline + ₹99 Min Order */}
                        <div className="mb-6 p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-rose-900" />
                                Delivery & Availability
                            </div>
                            <PincodeChecker />
                            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                                <div className="flex items-start gap-2 text-stone-700">
                                    <Truck className="w-4 h-4 text-rose-900 shrink-0 mt-0.5" />
                                    <span>Free delivery on orders over ₹{FREE_SHIPPING_THRESHOLD}, ₹{SHIPPING_CHARGE_BELOW_THRESHOLD} delivery charge below ₹{FREE_SHIPPING_THRESHOLD}.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Package className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                                    <span><strong>Timeline:</strong> 2–4 days crafting + 4–7 business days shipping</span>
                                </div>
                                {currentPrice < 99 && (
                                    <div className="flex items-center gap-2 text-stone-500">
                                        <span className="font-bold text-stone-700">Note:</span> Minimum order value is ₹99.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 8. Details: Short Description, Detailed Description, Perfect For, Key Features, Material, Care Instructions, Made in India */}
                        <div className="space-y-4 mb-6">
                            {/* Short Description */}
                            {info.shortDescription && (
                                <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200/60 text-stone-700 text-sm leading-relaxed">
                                    {info.shortDescription}
                                </div>
                            )}

                            {/* Detailed Description */}
                            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                                <button 
                                    type="button"
                                    onClick={() => toggleSection('description')}
                                    className="w-full p-4 flex items-center justify-between text-left group"
                                >
                                    <span className="font-heading font-medium text-base text-stone-900">Detailed Description</span>
                                    {openSection === 'description' ? <Minus className="w-4 h-4 text-rose-900" /> : <Plus className="w-4 h-4 text-stone-400 group-hover:text-rose-900" />}
                                </button>
                                {openSection === 'description' && (
                                    <div className="p-4 pt-0 text-stone-600 text-sm leading-relaxed border-t border-stone-100 space-y-2">
                                        {(info.long_description || info.longDescription || product.description || '').split('\n').map((line, i) => {
                                            const trimmed = line.trim();
                                            if (!trimmed) return null;
                                            if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                                                return (
                                                    <div key={i} className="flex items-start gap-2.5 my-1.5">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                        <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                                                    </div>
                                                );
                                            }
                                            return <p key={i}>{trimmed}</p>;
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Perfect For */}
                            <div className="p-4 bg-white border border-stone-200 rounded-xl">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2.5 flex items-center gap-1.5">
                                    <Gift className="w-3.5 h-3.5 text-rose-800" />
                                    Perfect For
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {(info.perfectFor ? info.perfectFor.split(',') : ["Birthday Gifts", "Best Friend Gifts", "Room Décor", "Bag Charms", "Anniversaries"]).map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Key Features */}
                            {info.keyFeatures && info.keyFeatures.length > 0 && (
                                <div className="p-4 bg-white border border-stone-200 rounded-xl">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2.5 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                        Key Features
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
                                        {info.keyFeatures.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-700 mt-1.5 shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Material & Care Instructions & Made in India */}
                            <div className="p-4 bg-[#fbf9f5] border border-stone-200/80 rounded-xl space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="block font-bold uppercase tracking-wider text-stone-500 text-[10px]">Material</span>
                                        <span className="font-semibold text-stone-900">{info.fabric || '100% Milk Cotton Yarn / Premium Thread'}</span>
                                        {info.fabricBlend && <span className="block text-stone-500 text-[11px]">{info.fabricBlend}</span>}
                                    </div>
                                    <div>
                                        <span className="block font-bold uppercase tracking-wider text-stone-500 text-[10px]">Origin</span>
                                        <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                                            <span>🇮🇳</span> Made in India (Handcrafted)
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-stone-200/60">
                                    <span className="block font-bold uppercase tracking-wider text-stone-500 text-[10px] mb-1">Care Instructions</span>
                                    <p className="text-xs text-stone-600 leading-relaxed">
                                        {info.careInstructions || 'Gently spot clean or hand wash in cold water with mild detergent. Do not wring or twist. Lay flat to air dry to preserve yarn shape.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 9. Return policy exactly as set for that product */}
                        <div className="mb-8 p-4 bg-white border border-stone-200 rounded-xl shadow-xs">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                <div className="text-xs space-y-0.5">
                                    <span className="font-bold uppercase tracking-wider text-stone-900 block">Return Policy</span>
                                    <p className="text-stone-600">
                                        {info.returnAvailable === false
                                            ? 'This product is not eligible for returns due to its custom handcrafted nature.'
                                            : `${info.returnPeriod || 7}-day easy return policy. Item must be in original condition.`}
                                    </p>
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
                                            <p className="text-[10px] text-stone-600 mt-1 font-semibold">out of 5</p>
                                        </div>
                                        <div className="w-px h-12 bg-stone-200"></div>
                                        <div className="flex-1 space-y-1.5">
                                            {[5, 4, 3, 2, 1].map(star => {
                                                const count = reviews.filter(r => r.rating === star).length;
                                                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-2">
                                                        <span className="text-xs text-stone-700 w-4 text-right font-medium">{star}</span>
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                                                        <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] text-stone-700 w-5 font-semibold">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 bg-rose-50/50 rounded-2xl border border-rose-100 shadow-sm">
                                    <div className="flex justify-center mb-4">
                                        <div className="flex -space-x-3">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-300 overflow-hidden shadow-sm flex items-center justify-center text-xs font-bold text-stone-800" aria-hidden="true">
                                                    U{i}
                                                </div>
                                            ))}
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-200 flex items-center justify-center text-xs font-bold text-rose-900 shadow-sm" aria-hidden="true">
                                                +50
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-stone-900 font-heading font-medium text-xl mb-1">Loved by handmade gift buyers</p>
                                    <p className="text-stone-700 text-sm font-normal mb-5">Join our community of happy customers 💖</p>
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
                                                    <div className="w-10 h-10 rounded-full bg-rose-100/80 flex items-center justify-center shrink-0 ring-2 ring-rose-50">
                                                        <span className="text-rose-900 font-bold text-sm" aria-hidden="true">
                                                            {review.user_name?.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-bold text-stone-900 text-sm truncate">{review.user_name}</h4>
                                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">Verified</span>
                                                        </div>
                                                        <span className="text-xs text-stone-600 font-medium">{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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

                {/* 10. Related products: 4 products from the same category */}
                {relatedCategoryProducts.length > 0 && (
                    <div className="border-t border-stone-100 pt-12 lg:pt-16 pb-24 overflow-hidden">
                        <div className="flex items-center gap-4 mb-8 lg:mb-12 px-4 lg:px-0">
                            <div className="flex-1 h-px bg-stone-200" />
                            <h2 className="text-xl lg:text-2xl font-heading font-semibold text-stone-900 text-center whitespace-nowrap">🌸 Related Products</h2>
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
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-0 lg:gap-6 pb-6"
                        >
                            {relatedCategoryProducts.map(p => {
                                const priceInfo = getProductPriceDisplay(p);
                                const genuine = getGenuineDiscount(priceInfo.price, p.originalPrice);
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
                                            
                                            {/* Genuine Discount Badge */}
                                            {genuine.isGenuine && (
                                                <div className="absolute top-3 left-3 bg-rose-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                                                    {genuine.discountPercentage}% OFF
                                                </div>
                                            )}

                                            {/* Wishlist Button */}
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(p);
                                                }}
                                                aria-label={isInWishlist(p.id) ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                                                title={isInWishlist(p.id) ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-rose-600 text-rose-600' : 'text-stone-500'}`} />
                                            </button>
                                        </div>

                                        <Link to={getProductUrl(p)} className="block space-y-1 px-1">
                                            <h3 className="font-heading font-bold text-sm text-stone-900 line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-rose-900 transition-colors">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-1.5 text-sm">
                                                <span className="font-bold text-stone-900">{priceInfo.text}</span>
                                                {genuine.isGenuine && (
                                                    <>
                                                        <span className="text-stone-600 line-through text-xs">
                                                            <span className="sr-only">Original price: </span>₹{genuine.originalPrice.toLocaleString('en-IN')}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-rose-800">({genuine.discountPercentage}% OFF)</span>
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
                        aria-label={cartCount > 0 ? `Shopping cart with ${cartCount} items` : "Shopping cart"}
                        title="Shopping cart"
                        className={`relative flex-shrink-0 flex items-center justify-center rounded-xl border border-stone-200 bg-white shadow-sm transition-all h-[52px] ${isInCart ? 'px-4' : 'w-[52px]'}`}
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
                        <div className="flex-1 h-[52px] bg-[#e11d48] rounded-xl flex items-center justify-between px-2 shadow-md">
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
                            className={`flex-1 h-[52px] rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${
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

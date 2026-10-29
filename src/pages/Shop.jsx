import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { Package, Heart, Search, ChevronDown, Sparkles, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useSearchParams } from 'react-router-dom';

// Utility helper function extracted outside component to avoid recreation
const slugify = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

import { ProductCard as ProductCardWithVariants } from '../components/ProductCard';
import { getProductUrl } from '../utils/urlUtils';
import SEO from '../components/SEO';
import { getCategorySeoData } from '../utils/categorySeo';

const Shop = () => {
    const { products, loading: productsLoading, fetchProducts } = useProducts();

    // Fetch products explicitly since context no longer auto-fetches on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    const { categories: contextCategories } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlSearchQuery = useMemo(() => {
        return (searchParams.get('search') || searchParams.get('q') || '').trim();
    }, [searchParams]);

    const [searchInput, setSearchInput] = useState(urlSearchQuery);
    const searchTimeoutRef = useRef(null);

    // Keep searchInput in sync when URL query changes (e.g. from homepage search box or navigation)
    useEffect(() => {
        setSearchInput(urlSearchQuery);
    }, [urlSearchQuery]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    const handleSearchChange = (val) => {
        setSearchInput(val);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const trimmed = val.trim();
            if (trimmed) {
                params.set('search', trimmed);
                params.delete('q');
            } else {
                params.delete('search');
                params.delete('q');
            }
            params.delete('page');
            setSearchParams(params, { replace: true });
        }, 250);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            const params = new URLSearchParams(searchParams);
            const trimmed = searchInput.trim();
            if (trimmed) {
                params.set('search', trimmed);
                params.delete('q');
            } else {
                params.delete('search');
                params.delete('q');
            }
            params.delete('page');
            setSearchParams(params, { replace: true });
        }
    };

    const handleClearSearch = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setSearchInput('');
        const params = new URLSearchParams(searchParams);
        params.delete('search');
        params.delete('q');
        params.delete('page');
        setSearchParams(params, { replace: true });
    };

    const handleResetAll = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setSearchInput('');
        setSelectedCategories([]);
        setPriceRange('all');
        setInStockOnly(false);
        setIsSaleOnly(false);
        setSortBy('featured');
        setSearchParams(new URLSearchParams(), { replace: true });
    };

    const { toggleWishlist, isInWishlist } = useWishlist();

    
    // Filter States
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const isCategorySelected = useCallback((catId, catLabel) => {
        if (catId === 'all') return selectedCategories.length === 0;
        return selectedCategories.some(c => 
            c === catId || 
            slugify(c) === slugify(catId) || 
            (catLabel && slugify(c) === slugify(catLabel))
        );
    }, [selectedCategories]);

    const toggleCategory = (catId) => {
        const params = new URLSearchParams(searchParams);
        params.delete('page');
        if (catId === 'all') {
            setSelectedCategories([]);
            params.delete('category');
            setSearchParams(params, { replace: true });
            return;
        }
        // At a time select one circle: replace the array instead of appending
        const alreadySelected = selectedCategories.some(c => c === catId || slugify(c) === slugify(catId));
        if (alreadySelected) {
            setSelectedCategories([]);
            params.delete('category');
        } else {
            setSelectedCategories([catId]);
            params.set('category', slugify(catId));
        }
        setSearchParams(params, { replace: true });
    };
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState('all');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [isSaleOnly, setIsSaleOnly] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
    
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
        const targetProductParam = searchParams.get('product') || searchParams.get('productId');

        if (categoryParam && categoryParam !== 'all') {
            const sParam = slugify(categoryParam);
            const cleanParam = sParam.replace(/-+/g, '-');
            const paramSingular = cleanParam.replace(/s$/, '');

            const matched = contextCategories.find(c => {
                const sId = slugify(c.id);
                const sLabel = slugify(c.label);
                const cleanId = sId.replace(/-+/g, '-');
                const cleanLabel = sLabel.replace(/-+/g, '-');
                return sId === sParam ||
                    sLabel === sParam ||
                    cleanId === cleanParam ||
                    cleanLabel === cleanParam ||
                    cleanLabel.includes(paramSingular) ||
                    cleanId.includes(paramSingular) ||
                    cleanParam.includes(cleanId.replace(/s$/, '')) ||
                    cleanParam.includes(cleanLabel.replace(/s$/, ''));
            });
            setSelectedCategories([matched ? matched.id : categoryParam]);
        } else if (targetProductParam && products.length > 0) {
            const prod = products.find(p => 
                String(p.id) === String(targetProductParam) || 
                p.slug === targetProductParam
            );
            if (prod && prod.category) {
                const matched = contextCategories.find(c => 
                    slugify(c.id) === slugify(prod.category) || 
                    slugify(c.label) === slugify(prod.category)
                );
                setSelectedCategories([matched ? matched.id : prod.category]);
            }
        }

        const maxPriceParam = searchParams.get('maxPrice');
        if (maxPriceParam) {
            setPriceRange(`under-${maxPriceParam}`);
        }

        const saleParam = searchParams.get('sale');
        if (saleParam === 'true') {
            setIsSaleOnly(true);
        }
    }, [searchParams, contextCategories, products]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, sortBy, priceRange, inStockOnly, isSaleOnly, urlSearchQuery]);

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
        // Problem 2 Fix: One card per product, not one card per colour variant
        const targetProductParam = searchParams.get('product') || searchParams.get('productId');
        const searchQuery = urlSearchQuery.toLowerCase();

        const uniqueProducts = products.map(prod => {
            let preselectedVariant = null;
            if (targetProductParam && (String(prod.id) === String(targetProductParam) || prod.slug === targetProductParam)) {
                if (targetColorParam && prod.variants) {
                    preselectedVariant = prod.variants.find(v => slugify(v.color) === slugify(targetColorParam)) || null;
                }
            }
            return {
                ...prod,
                uniqueId: String(prod.id),
                preselectedVariant,
                price: Number(prod.price),
            };
        });

        // Pre-calculate selected category slugs
        const selectedSlugs = new Set();
        if (selectedCategories.length > 0) {
            selectedCategories.forEach(catId => {
                selectedSlugs.add(slugify(catId));
                selectedSlugs.add(slugify(catId).replace(/-+/g, '-'));
                const catObj = contextCategories.find(c => c.id === catId || slugify(c.label) === slugify(catId));
                if (catObj) {
                    selectedSlugs.add(slugify(catObj.id));
                    selectedSlugs.add(slugify(catObj.label));
                    selectedSlugs.add(slugify(catObj.id).replace(/-+/g, '-'));
                    selectedSlugs.add(slugify(catObj.label).replace(/-+/g, '-'));
                }
            });
        }

        const isTarget = (item) => {
            if (!targetProductParam) return false;
            const matchesId = String(item.id) === String(targetProductParam);
            const matchesSlug = item.slug && String(item.slug).toLowerCase() === String(targetProductParam).toLowerCase();
            const matchesUnique = String(item.uniqueId).toLowerCase() === String(targetProductParam).toLowerCase();
            return matchesId || matchesSlug || matchesUnique;
        };

        return uniqueProducts.filter(product => {
            // Problem 1 Fix: REAL category filtering
            if (selectedCategories.length > 0) {
                const prodCat = product.category || '';
                const prodCatSlug = slugify(prodCat);
                const cleanProdCatSlug = prodCatSlug.replace(/-+/g, '-');
                const matchesCategory = selectedSlugs.has(prodCatSlug) || 
                    selectedSlugs.has(cleanProdCatSlug) ||
                    selectedCategories.some(catId => {
                        const sCatId = slugify(catId);
                        const cleanCatId = sCatId.replace(/-+/g, '-');
                        return catId === prodCat || 
                            sCatId === prodCatSlug || 
                            cleanCatId === cleanProdCatSlug;
                    });
                if (!matchesCategory) return false;
            }

            // Price Range Filter
            if (priceRange !== 'all') {
                if (priceRange === 'under-199' && product.price >= 199) return false;
                if (priceRange === 'under-499' && product.price >= 499) return false;
                if (priceRange === 'above-499' && product.price <= 499) return false;
            }

            // Availability & Sale Filters
            if (inStockOnly && !product.inStock) return false;
            if (isSaleOnly && (!product.originalPrice || product.price >= product.originalPrice)) return false;

            // Search Query Filter: match product names (case-insensitive, partial matches allowed)
            if (searchQuery) {
                const pName = (product.name || '').toLowerCase();
                const words = searchQuery.split(/\s+/).filter(Boolean);
                const matchesSearch = pName.includes(searchQuery) || (words.length > 1 && words.every(w => pName.includes(w)));
                if (!matchesSearch) return false;
            }

            return true;
        }).sort((a, b) => {
            // Target product clicked on card appears at the VERY top
            const aTarget = isTarget(a);
            const bTarget = isTarget(b);
            if (aTarget && !bTarget) return -1;
            if (!aTarget && bTarget) return 1;

            switch (sortBy) {
                case 'price-low': return (a.price - b.price) || String(a.uniqueId).localeCompare(String(b.uniqueId));
                case 'price-high': return (b.price - a.price) || String(a.uniqueId).localeCompare(String(b.uniqueId));
                case 'newest': return (new Date(b.created_at || 0) - new Date(a.created_at || 0)) || String(b.uniqueId).localeCompare(String(a.uniqueId));
                default: 
                    if (a.featured !== b.featured) {
                        return a.featured ? -1 : 1;
                    }
                    return String(a.uniqueId).localeCompare(String(b.uniqueId));
            }
        });
    }, [products, selectedCategories, contextCategories, priceRange, inStockOnly, isSaleOnly, sortBy, urlSearchQuery, searchParams]);


    const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = isMobile 
        ? allFilteredProducts.slice(0, currentPage * ITEMS_PER_PAGE) 
        : allFilteredProducts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );

    const loaderRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setCurrentPage((prev) => {
                if (prev < totalPages) return prev + 1;
                return prev;
            });
        }
    }, [totalPages]);

    useEffect(() => {
        if (!isMobile) return;
        const option = {
            root: null,
            rootMargin: "200px", // Trigger slightly before reaching the bottom
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loaderRef.current) observer.observe(loaderRef.current);
        
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [handleObserver, isMobile]);

    const categories = useMemo(() => {
        const list = [{ id: 'all', label: 'All Creations' }];
        const seen = new Set();
        seen.add('all');

        (contextCategories || []).forEach(cat => {
            const slug = slugify(cat.label || cat.id);
            if (!seen.has(slug)) {
                seen.add(slug);
                list.push(cat);
            }
        });

        // Ensure every category used by any product is in the filter list (e.g. Home Decor)
        (products || []).forEach(p => {
            if (p.category) {
                const slug = slugify(p.category);
                if (!seen.has(slug)) {
                    seen.add(slug);
                    list.push({ id: slug, label: p.category });
                }
            }
        });

        return list;
    }, [contextCategories, products]);

    const priceRanges = [
        { id: 'all', label: 'All Prices' },
        { id: 'under-199', label: 'Under ₹199' },
        { id: 'under-499', label: 'Under ₹499' },
        { id: 'above-499', label: 'Above ₹499' },
    ];

    const pageSchema = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": selectedCategories.length > 0 ? `${selectedCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')} | Crochet Wali` : "Shop All Handmade Crochet Gifts | Crochet Wali",
            "description": "Browse our complete catalog of Handmade Crochet Gifts, customized embroidery hoops, and aesthetic accessories. Find the perfect customized handmade gift in India.",
            "url": "https://www.crochetwali.in/shop"
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": allFilteredProducts.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://www.crochetwali.in/product/${product.id}`
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Are all products listed here handmade?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, every single product listed on our shop is meticulously handcrafted by skilled artisans. We specialize in crochet and embroidery, ensuring high quality and a personal touch in every order."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How long does shipping take for crochet gifts?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Because our products are made-to-order to guarantee perfection, please allow 2-4 days for crafting. Standard shipping across India usually takes an additional 4-7 business days."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do you take bulk orders for wedding return gifts?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, we take bulk orders for weddings, baby showers, and corporate events. Our crochet keychains and mini flower bouquets are very popular as return gifts. Please contact us via the Custom Design page for bulk pricing."
                    }
                }
            ]
        }
    ];

    const getPaginationUrl = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        if (pageNumber > 1) {
            params.set('page', pageNumber);
        } else {
            params.delete('page');
        }
        const qs = params.toString();
        return `https://www.crochetwali.in/shop${qs ? `?${qs}` : ''}`;
    };

    const prevUrl = currentPage > 1 ? getPaginationUrl(currentPage - 1) : null;
    const nextUrl = currentPage < totalPages ? getPaginationUrl(currentPage + 1) : null;
    const activeCategoryParam = searchParams.get('category');
    const activeCategoryId = (selectedCategories.length === 1 
        ? selectedCategories[0] 
        : (activeCategoryParam && activeCategoryParam !== 'all' ? activeCategoryParam : null));

    const activeCategoryMeta = useMemo(() => {
        return getCategorySeoData(activeCategoryId, contextCategories);
    }, [activeCategoryId, contextCategories]);

    const categoryCanonicalUrl = useMemo(() => {
        if (activeCategoryMeta) {
            const rawParam = searchParams.get('category') || activeCategoryMeta.slug;
            return `https://www.crochetwali.in/shop?category=${encodeURIComponent(rawParam)}`;
        }
        return 'https://www.crochetwali.in/shop';
    }, [activeCategoryMeta, searchParams]);

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-32 font-body selection:bg-rose-100 selection:text-rose-900">
            <SEO 
                title={activeCategoryMeta ? activeCategoryMeta.title : "Shop All Handmade Crochet Gifts | Crochet Wali"} 
                description={activeCategoryMeta ? activeCategoryMeta.metaDescription : "Shop Crochet Wali's complete collection of handmade crochet gifts — forever flower bouquets, gajra, hair clips, keychains, parandi, claw clips, and personalized gift boxes. 100% handmade in India. Buy crochet gifts online."}
                keywords={activeCategoryMeta ? `${activeCategoryMeta.label.toLowerCase()}, crochet ${activeCategoryMeta.label.toLowerCase()}, buy crochet gifts online, crochet wali collection` : "crochet wali shop, buy crochet gifts online, crochet wali collection, handmade crochet gifts india, crochet flower bouquet, crochet hair clips, crochet keychain, crochet gajra"}
                url={categoryCanonicalUrl}
                schema={pageSchema} 
            >
                {prevUrl && <link rel="prev" href={prevUrl} />}
                {nextUrl && <link rel="next" href={nextUrl} />}
            </SEO>
            <div className="container-custom pb-20 pt-4 md:pt-8">
                
                {/* AEO Semantic Heading for AI context */}
                <h1 className="sr-only">
                    {activeCategoryMeta ? activeCategoryMeta.h1 : "Crochet Wali Shop – Buy Handmade Crochet Gifts, Flower Bouquets, Gajra & Hair Accessories Online India"}
                </h1>

                {/* Mobile Search Bar */}
                <div className="md:hidden mb-4">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                        <input 
                            type="text"
                            placeholder="Search in collection..."
                            value={searchInput}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full pl-9 pr-9 py-2.5 bg-white border border-stone-200 rounded-full text-sm text-stone-900 placeholder:text-stone-400 font-medium shadow-sm focus:outline-none focus:border-rose-900 focus:ring-1 focus:ring-rose-900 transition-all"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    {urlSearchQuery && (
                        <div className="flex items-center justify-between text-xs text-stone-500 mt-2 px-1">
                            <span>Showing <strong className="text-stone-800">{allFilteredProducts.length}</strong> results for <strong className="text-stone-800">"{urlSearchQuery}"</strong></span>
                            <button 
                                onClick={handleClearSearch}
                                className="text-rose-900 font-semibold underline underline-offset-2 hover:text-rose-700"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Category Header */}
                {activeCategoryMeta && (
                    <div className="lg:hidden mb-4 px-1">
                        <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">{activeCategoryMeta.h1}</h2>
                        <p className="text-stone-600 text-xs leading-relaxed">{activeCategoryMeta.intro}</p>
                    </div>
                )}

                {/* Mobile Category Circles */}
                <div className="lg:hidden mb-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
                    <div className="flex gap-2">
                        {categories.map(cat => {
                            const isSelected = isCategorySelected(cat.id, cat.label);
                            let catImage = '/logo.png';
                            if (cat.id !== 'all') {
                                const catSlug = slugify(cat.id);
                                const catLabelSlug = slugify(cat.label);
                                const prod = products.find(p => {
                                    const pSlug = slugify(p.category);
                                    return (pSlug === catSlug || pSlug === catLabelSlug) && (p.image || (p.images && p.images.length) || (p.variants && p.variants.some(v => v.images?.length)));
                                });
                                if (prod) {
                                    catImage = prod.image || (prod.images && prod.images[0]) || (prod.variants && prod.variants.find(v => v.images?.length)?.images[0]) || '/logo.png';
                                }
                            }
                            return (
                                <button 
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className="flex flex-col items-center gap-1.5 min-w-[17vw] max-w-[64px] shrink-0 group transition-all duration-300"
                                >
                                    <div className={`
                                        w-[15vw] h-[15vw] max-w-[56px] max-h-[56px] md:w-20 md:h-20 rounded-full p-0.5 transition-all duration-300
                                        ${isSelected 
                                            ? 'bg-gradient-to-tr from-rose-900 via-rose-600 to-rose-900 shadow-lg shadow-rose-900/30 scale-110' 
                                            : 'bg-stone-200 hover:bg-stone-300'}
                                    `}>
                                        <div className="w-full h-full rounded-full border-2 border-[#fdfbf7] overflow-hidden bg-white shadow-inner">
                                            {cat.id === 'all' ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-700">
                                                    <span className="font-bold text-[10px] md:text-[13px] tracking-wider">ALL</span>
                                                </div>
                                            ) : (
                                                <img 
                                                    src={getOptimizedImageUrl(catImage, { width: 100, quality: 70 })} 
                                                    alt={cat.label} 
                                                    loading="lazy" 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-[9px] md:text-xs font-bold text-center leading-tight transition-colors duration-300 px-1
                                        ${isSelected ? 'text-rose-900' : 'text-stone-600 group-hover:text-stone-900'}
                                    `}>
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
                        className={`fixed inset-0 z-[100] lg:hidden text-left transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    >
                        {/* Backdrop */}
                        <div 
                            className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setIsMobileFiltersOpen(false)} 
                        />
                        
                        {/* Bottom Sheet Drawer */}
                        <aside 
                            className={`absolute left-0 right-0 bottom-0 max-h-[90vh] rounded-t-3xl bg-white shadow-2xl flex flex-col transition-transform duration-400 ease-out ${isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'}`}
                        >
                            {/* Drag Handle */}
                            <div className="w-full flex justify-center pt-4 pb-2 shrink-0">
                                <div className="w-12 h-1.5 bg-stone-200 rounded-full"></div>
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 pb-4 border-b border-stone-100 shrink-0">
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
                                        {categories.map(cat => {
                                            const isSelected = isCategorySelected(cat.id, cat.label);
                                            const cleanName = cat.label.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
                                            const categoryProduct = products.find(p => (p.category === cat.id || p.category === cat.label) && p.image && !p.image.includes('unsplash'));
                                            const categoryImage = categoryProduct?.image || `/category-images/${cleanName}.webp`;

                                            return (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[13px] font-semibold transition-all duration-300 border ${
                                                    isSelected
                                                    ? 'bg-rose-900 border-rose-900 text-white shadow-md shadow-rose-900/20'
                                                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                                                }`}
                                            >
                                                {cat.id !== 'all' && (
                                                    <img src={getOptimizedImageUrl(categoryImage, 40)} alt={cat.label} className="w-5 h-5 rounded-full object-cover shadow-sm" />
                                                )}
                                                {cat.label}
                                            </button>
                                        )})}
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
                                    <div className="flex flex-col gap-3">
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
                                        
                                        <label className="flex items-center justify-between p-4 rounded-xl border border-stone-100 cursor-pointer group hover:border-stone-200 transition-colors bg-stone-50/50">
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium transition-colors ${isSaleOnly ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-800'}`}>
                                                    Sale Items
                                                </span>
                                                <span className="text-[10px] text-stone-400 mt-0.5">Show discounted items</span>
                                            </div>
                                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isSaleOnly ? 'bg-rose-900' : 'bg-stone-200'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSaleOnly}
                                                    onChange={(e) => setIsSaleOnly(e.target.checked)}
                                                    className="absolute w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isSaleOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer actions */}
                            <div className="p-5 border-t border-stone-100 bg-white shrink-0 flex gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] relative z-10">
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setPriceRange('all');
                                        setInStockOnly(false);
                                        setIsSaleOnly(false);
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
                                {categories.map(cat => {
                                    const isSelected = isCategorySelected(cat.id, cat.label);
                                    const cleanName = cat.label.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
                                    const categoryProduct = products.find(p => (p.category === cat.id || p.category === cat.label) && p.image && !p.image.includes('unsplash'));
                                    const categoryImage = categoryProduct?.image || `/category-images/${cleanName}.webp`;

                                    return (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`text-left text-[13px] font-medium transition-all duration-300 py-2 px-3 rounded-xl flex items-center gap-2.5 group ${
                                            isSelected
                                            ? 'text-rose-900 font-bold bg-rose-50'
                                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                                        }`}
                                    >
                                        {cat.id !== 'all' && (
                                            <img src={getOptimizedImageUrl(categoryImage, 40)} alt={cat.label} className={`w-6 h-6 rounded-full object-cover transition-transform ${isSelected ? 'scale-110 shadow-sm' : ''}`} />
                                        )}
                                        {cat.label}
                                    </button>
                                )})}
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
                            <div className="flex flex-col gap-3">
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
                                
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={isSaleOnly}
                                        onChange={(e) => setIsSaleOnly(e.target.checked)}
                                        className="w-4 h-4 rounded border-stone-300 text-rose-900 focus:ring-rose-900 cursor-pointer"
                                    />
                                    <span className={`text-sm transition-colors ${isSaleOnly ? 'text-stone-900 font-medium' : 'text-stone-500 group-hover:text-stone-800'}`}>
                                        Sale Items
                                    </span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid - with Sticky Header */}
                    <div className="flex-1 w-full relative min-w-0">
                        {/* Desktop Header */}
                        <div className="hidden md:block mb-8">
                            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-stone-900 mb-2">
                                {activeCategoryMeta ? activeCategoryMeta.h1 : "Handmade Crochet Gifts & Crochet Collection"}
                            </h2>
                            <p className="text-stone-500 text-sm lg:text-base mb-2">
                                {activeCategoryMeta ? activeCategoryMeta.subheading : "Discover hand-crafted embroidery pieces tailored for you."}
                            </p>
                            <p className="text-stone-600 text-sm max-w-3xl leading-relaxed">
                                {activeCategoryMeta ? activeCategoryMeta.intro : "Explore our extensive range of personalized handmade gifts, from intricate embroidery hoops to eternal crochet flower bouquets. Every piece is meticulously crafted with love, making them perfect for anniversaries, birthdays, or as unique aesthetic additions to your home."}
                            </p>
                        </div>

                        {/* Sticky Toolbar: Search, Sort, & Count */}
                        <div className="sticky top-[60px] lg:top-24 z-30 bg-white/80 md:bg-white/90 backdrop-blur-md py-2 md:py-3 mb-3 md:mb-8 border-b border-stone-200/60 shadow-sm md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border md:border-stone-100 hidden md:flex flex-row justify-between items-center gap-3 md:gap-4 transition-all duration-300 -mx-4 px-4 md:mx-0 md:px-6 md:rounded-2xl">
                             {/* Result Count (Desktop) */}
                            <div className="hidden md:block text-sm font-medium text-stone-500 pl-4 whitespace-nowrap">
                                {urlSearchQuery ? (
                                    <span>Showing <strong className="text-stone-900">{allFilteredProducts.length}</strong> results for <strong className="text-stone-900">"{urlSearchQuery}"</strong></span>
                                ) : (
                                    <span>Showing {allFilteredProducts.length} results</span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto md:pr-4 flex-1 justify-end">
                                {/* Mobile Filters Button */}
                                <button
                                    onClick={() => setIsMobileFiltersOpen(true)}
                                    className="flex items-center gap-1.5 py-2 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg md:rounded-full text-sm font-semibold text-stone-700 transition-all flex-shrink-0 lg:hidden"
                                    aria-label="Open filters"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span>Filters</span>
                                    {(selectedCategories.length > 0 || priceRange !== 'all' || inStockOnly || isSaleOnly) && (
                                        <span className="bg-rose-900 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {(selectedCategories.length > 0 ? 1 : 0) + (priceRange !== 'all' ? 1 : 0) + (inStockOnly ? 1 : 0) + (isSaleOnly ? 1 : 0)}
                                        </span>
                                    )}
                                </button>

                                {/* Search Input on Desktop */}
                                <div className="relative w-56 lg:w-72 group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-rose-900 transition-colors pointer-events-none" />
                                    <input 
                                        type="text"
                                        placeholder="Search in collection..."
                                        value={searchInput}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        className="w-full pl-9 pr-8 py-2 bg-stone-100/70 border border-stone-200 rounded-lg md:rounded-full text-sm text-stone-900 placeholder:text-stone-400 font-medium focus:outline-none focus:border-rose-900 focus:bg-white focus:ring-1 focus:ring-rose-900 transition-all hover:border-stone-300"
                                    />
                                    {searchInput && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            aria-label="Clear search"
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                
                                {/* Sort */}
                                <div className="relative group min-w-[150px]">
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
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14 xl:gap-x-10 xl:gap-y-16 3xl:gap-x-12 3xl:gap-y-20">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[2/3] md:aspect-[4/5] bg-stone-200 rounded-2xl mb-4" />
                                        <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-stone-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : allFilteredProducts.length === 0 ? (
                            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-100 shadow-sm my-6 animate-fade-in">
                                <div className="w-14 h-14 bg-rose-50 text-rose-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-7 h-7 text-rose-900" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-stone-900 mb-2">No matching products found</h3>
                                <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                                    {urlSearchQuery 
                                        ? `We couldn't find any products matching "${urlSearchQuery}". Try checking your spelling or clearing filters.`
                                        : `No products match the selected filters. Try broadening your criteria.`}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {urlSearchQuery && (
                                        <button 
                                            onClick={handleClearSearch}
                                            className="px-5 py-2.5 bg-rose-900 text-white rounded-full text-sm font-semibold hover:bg-rose-800 transition-colors shadow-sm"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleResetAll}
                                        className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-full text-sm font-semibold hover:bg-stone-200 transition-colors"
                                    >
                                        View Full Collection
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 4xl:grid-cols-7 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-14 xl:gap-x-10 xl:gap-y-16 3xl:gap-x-12 3xl:gap-y-20 animate-fade-in">
                                    {paginatedProducts.map((product) => (
                                        <div key={product.uniqueId} className="animate-fade-up">
                                            <ProductCardWithVariants product={product} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />
                                        </div>
                                    ))}
                                </div>

                                {/* Infinite Scroll Loader (Mobile) */}
                                {isMobile && currentPage < totalPages && (
                                    <div ref={loaderRef} className="flex justify-center mt-8 mb-12 py-4">
                                        <div className="w-8 h-8 border-4 border-rose-900/20 border-t-rose-900 rounded-full animate-spin"></div>
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

            {/* SEO / AEO FAQ Section */}
            <div className="mt-16 pb-24 max-w-4xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-stone-900 mb-8 text-center">Shop Handmade Crochet Gifts - FAQ</h2>
                <div className="space-y-6">
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-2">Are all products listed here handmade?</h3>
                        <p className="text-stone-600">Yes, every single product listed on our shop is meticulously handcrafted by skilled artisans. We specialize in crochet and embroidery, ensuring high quality and a personal touch in every order.</p>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-2">How long does shipping take for crochet gifts?</h3>
                        <p className="text-stone-600">Because our products are made-to-order to guarantee perfection, please allow 2-4 days for crafting. Standard shipping across India usually takes an additional 4-7 business days.</p>
                    </div>
                    <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-2">Do you take bulk orders for wedding return gifts?</h3>
                        <p className="text-stone-600">Yes, we take bulk orders for weddings, baby showers, and corporate events. Our crochet keychains and mini flower bouquets are very popular as return gifts. Please contact us via the Custom Design page for bulk pricing.</p>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Action Bar (Filters & Sort) */}
            <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden flex items-center bg-white/95 backdrop-blur-xl border border-stone-200 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                {/* Filters Button */}
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 h-12 text-stone-800 font-bold text-[14px] active:bg-stone-50 transition-colors rounded-l-full"
                >
                    <SlidersHorizontal size={16} className="text-stone-500" />
                    Filters
                    {(selectedCategories.length > 0 || priceRange !== 'all' || inStockOnly || isSaleOnly) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    )}
                </button>

                {/* Vertical Divider */}
                <div className="w-[1px] h-6 bg-stone-200 shrink-0"></div>

                {/* Sort Dropdown */}
                <div className="flex-1 relative">
                    <button
                        onClick={() => setIsMobileSortOpen(!isMobileSortOpen)}
                        className="w-full h-12 flex items-center justify-center gap-2 text-[14px] font-bold text-stone-800 active:bg-stone-50 transition-colors rounded-r-full px-2"
                    >
                        <span className="truncate max-w-[120px]">
                            {sortBy === 'featured' ? 'Sort by' : 
                             sortBy === 'newest' ? 'Newest' :
                             sortBy === 'price-low' ? 'Low to High' : 'High to Low'}
                        </span>
                        <ChevronDown size={16} className={`text-stone-400 transition-transform ${isMobileSortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Custom Dropdown Menu */}
                    {isMobileSortOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsMobileSortOpen(false)}
                            />
                            <div className="absolute bottom-[calc(100%+0.5rem)] right-0 w-48 bg-white border border-stone-200 rounded-2xl p-1.5 shadow-xl z-50 animate-in slide-in-from-bottom-2 fade-in">
                                {[
                                    { value: 'featured', label: 'Sort by' },
                                    { value: 'newest', label: 'Newest Arrivals' },
                                    { value: 'price-low', label: 'Price: Low to High' },
                                    { value: 'price-high', label: 'Price: High to Low' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortBy(option.value);
                                            setIsMobileSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                                            sortBy === option.value 
                                            ? 'bg-rose-50 text-rose-700 font-bold' 
                                            : 'text-stone-700 hover:bg-stone-50'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;

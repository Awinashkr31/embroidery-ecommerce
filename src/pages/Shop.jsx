import React, { useState, useEffect } from 'react';
import { Package, Heart, Search, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Shop = () => {
    const { products, loading: productsLoading } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    
    // Filter States
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState('all');
    const [inStockOnly, setInStockOnly] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, sortBy, searchQuery, priceRange, inStockOnly]);

    // Filter Logic
    const allFilteredProducts = products.filter(product => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes(query) || 
                                  product.description.toLowerCase().includes(query) ||
                                  product.category.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Category Filter
        if (filter !== 'all' && product.category !== filter) return false;

        // Price Range Filter
        if (priceRange !== 'all') {
            if (priceRange === 'under-1000' && product.price >= 1000) return false;
            if (priceRange === '1000-5000' && (product.price < 1000 || product.price > 5000)) return false;
            if (priceRange === 'above-5000' && product.price <= 5000) return false;
        }

        // Availability Filter
        if (inStockOnly && !product.inStock) return false;

        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'newest': return b.id - a.id;
            default: return (a.featured === b.featured) ? 0 : a.featured ? -1 : 1;
        }
    });

    const totalPages = Math.ceil(allFilteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = allFilteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const categories = [
        { id: 'all', label: 'All Creations' },
        { id: 'Home Decor', label: 'Home Decor' },
        { id: 'Accessories', label: 'Accessories' },
        { id: 'Art', label: 'Art' },
        { id: 'Gifts', label: 'Gifts' }
    ];

    const priceRanges = [
        { id: 'all', label: 'All Prices' },
        { id: 'under-1000', label: 'Under ₹1,000' },
        { id: '1000-5000', label: '₹1,000 - ₹5,000' },
        { id: 'above-5000', label: 'Above ₹5,000' },
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-32 font-body selection:bg-rose-100 selection:text-rose-900">
            {/* Elegant Hero Section */}
            <div className="pt-32 pb-12 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-rose-900/5 rounded-[100%] blur-3xl pointer-events-none" />
                
                <div className="container-custom text-center relative z-10">
                    <span className="text-rose-900 text-xs font-bold tracking-[0.2em] uppercase mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Handcrafted with Love
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-medium text-stone-900 mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        The Collection
                    </h1>
                </div>
            </div>

            <div className="container-custom pb-20">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Sidebar - Desktop */}
                    <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
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
                    <div className="flex-1 w-full relative">
                        {/* Sticky Toolbar: Search, Sort, & Count */}
                        <div className="sticky top-20 lg:top-24 z-20 bg-white/95 backdrop-blur-md py-4 mb-8 border-y border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300">
                             {/* Result Count (Desktop) */}
                            <div className="hidden md:block text-sm font-medium text-stone-500 pl-4">
                                Showing {allFilteredProducts.length} results
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto pr-4">
                                {/* Search */}
                                <div className="relative flex-1 md:w-64 group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-rose-900 transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-sm focus:border-rose-900 focus:bg-white focus:ring-1 focus:ring-rose-900 focus:outline-none transition-all placeholder:text-stone-400 font-medium hover:border-stone-300"
                                    />
                                </div>
                                
                                {/* Sort */}
                                <div className="relative group min-w-[160px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full appearance-none pl-4 pr-10 py-2 bg-stone-50 border border-stone-200 rounded-full text-sm font-medium text-stone-600 focus:outline-none focus:border-rose-900 focus:bg-white focus:ring-1 focus:ring-rose-900 cursor-pointer hover:border-stone-300 transition-all"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="newest">Newest</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none group-hover:text-stone-900 transition-colors" />
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
                                    onClick={() => {setFilter('all'); setSearchQuery('');}}
                                    className="text-rose-900 underline underline-offset-4 hover:text-rose-700 text-sm font-medium"
                                >
                                    Reset collection
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                                    {paginatedProducts.map((product) => (
                                        <Link 
                                            key={product.id} 
                                            to={`/product/${product.id}`}
                                            className="group block"
                                        >
                                            {/* Image Card */}
                                            <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-5">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${!product.inStock ? 'grayscale opacity-80' : ''}`}
                                                />
                                                
                                                {/* Minimal Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-1">
                                                    {!product.inStock && (
                                                        <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                                                            Sold Out
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Wishlist */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleWishlist(product);
                                                    }}
                                                    className="absolute top-3 right-3 p-2 bg-white/90 text-stone-500 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                                >
                                                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                                </button>

                                                {/* Add to Cart Overlay */}
                                                {product.inStock && (
                                                    <button 
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            await addToCart(product);
                                                            addToast("Added to bag", "success");
                                                        }}
                                                        className="absolute inset-x-0 bottom-0 py-3 bg-white/95 text-stone-900 text-xs font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 hover:bg-stone-900 hover:text-white"
                                                    >
                                                        <Package className="w-3 h-3" /> Add to Bag
                                                    </button>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="text-center space-y-1">
                                                <h3 className="font-heading text-lg text-stone-900 group-hover:text-rose-900 transition-colors duration-300">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-center gap-2 text-sm">
                                                    <span className="font-medium text-stone-900">₹{product.price.toLocaleString()}</span>
                                                    {product.originalPrice && (
                                                        <>
                                                            <span className="text-stone-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
                                                            {product.discountPercentage > 0 && (
                                                                <span className="text-rose-900 text-xs font-bold">
                                                                    ({product.discountPercentage}% OFF)
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-20">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentPage(i + 1);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    currentPage === i + 1 
                                                    ? 'bg-rose-900 w-6' 
                                                    : 'bg-stone-300 hover:bg-stone-400'
                                                }`}
                                                aria-label={`Page ${i + 1}`}
                                            />
                                        ))}
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

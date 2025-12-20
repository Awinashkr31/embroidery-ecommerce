import React, { useState, useEffect } from 'react';
import { Package, Heart, Search, Filter, ArrowRight, Grid, List } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Shop = () => {
    const { products, loading: productsLoading } = useProducts();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToast } = useToast();
    const navigate = useNavigate();
    
    // Filter States
    const [filter, setFilter] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, priceRange, sortBy, searchQuery]);

    // Filter Logic
    const allFilteredProducts = products.filter(product => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes(query) || 
                                  product.description.toLowerCase().includes(query) ||
                                  product.category.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        if (filter !== 'all' && product.category !== filter) return false;

        if (priceRange !== 'all') {
            const [min, max] = priceRange.includes('+')
                ? [parseInt(priceRange), Infinity]
                : priceRange.split('-').map(Number);
            if (product.price < min || product.price > max) return false;
        }

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
        { id: 'all', label: 'All Collection' },
        { id: 'Home Decor', label: 'Home Decor' },
        { id: 'Accessories', label: 'Accessories' },
        { id: 'Art', label: 'Art' },
        { id: 'Gifts', label: 'Gifts' }
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-32 font-body">
            {/* Header / Hero */}
            <div className="pt-32 pb-16 bg-white border-b border-stone-100">
                <div className="container-custom">
                    <h1 className="text-4xl lg:text-6xl font-heading font-bold text-stone-900 mb-6">
                        Curated Collection
                    </h1>
                     <p className="text-stone-500 max-w-2xl text-xl leading-relaxed">
                        Explore our handcrafted embroidery pieces, each made with passion, precision, and a touch of modern elegance.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-[80px] z-30 bg-white/90 backdrop-blur-xl border-b border-stone-200/60 shadow-sm transition-all duration-300">
                <div className="container-custom py-5">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                        {/* Categories */}
                        <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300 ${
                                        filter === cat.id
                                        ? 'bg-rose-900 text-white shadow-lg shadow-rose-900/20 transform scale-105'
                                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Search & Sort */}
                        <div className="flex gap-4 w-full lg:w-auto">
                             <div className="relative flex-1 lg:w-72">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input 
                                    type="text"
                                    placeholder="Search creations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3 bg-stone-50 border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-rose-900 focus:ring-4 focus:ring-rose-900/10 outline-none transition-all placeholder:text-stone-400"
                                />
                            </div>
                            
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-bold text-stone-700 cursor-pointer hover:border-rose-900 focus:ring-0 outline-none shadow-sm"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="container-custom py-16">
                {productsLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                         <div className="w-16 h-16 border-4 border-stone-200 border-t-rose-900 rounded-full animate-spin mb-6"></div>
                         <p className="text-stone-500 font-medium text-lg">Curating your collection...</p>
                    </div>
                ) : allFilteredProducts.length === 0 ? (
                    <div className="text-center py-40 bg-white rounded-[2rem] border border-stone-100 shadow-sm mx-auto max-w-2xl">
                        <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search className="w-10 h-10 text-stone-400" />
                        </div>
                        <h3 className="text-3xl font-heading font-bold text-stone-900 mb-4">No matches found</h3>
                        <p className="text-stone-500 mb-8 text-lg">We couldn't find any products matching your current filters.</p>
                        <button 
                            onClick={() => {setFilter('all'); setSearchQuery(''); setPriceRange('all');}}
                            className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-900 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Grid Adjustment: Start with 1 col, 2 at small, 3 at large, 4 at XL to prevent giant cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            {paginatedProducts.map((product, index) => (
                                <div 
                                    key={product.id} 
                                    className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Image Card */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-stone-100 mb-6 isolate shadow-sm group-hover:shadow-xl transition-all duration-500">
                                        <Link to={`/product/${product.id}`} className="block w-full h-full"> 
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 ${!product.inStock ? 'grayscale opacity-75' : ''}`}
                                            />
                                        </Link>

                                        {/* Status Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                                            {product.featured && (
                                                <span className="bg-white/95 backdrop-blur text-stone-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                                    Featured
                                                </span>
                                            )}
                                            {!product.inStock && (
                                                <span className="bg-stone-900/95 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                                    Sold Out
                                                </span>
                                            )}
                                            {product.discountPercentage > 0 && (
                                                <span className="bg-rose-900/95 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                                    -{product.discountPercentage}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Wishlist Button */}
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(product);
                                            }}
                                            className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all z-20 group/btn"
                                            title="Add to Wishlist"
                                        >
                                            <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'text-rose-600 fill-current' : 'text-stone-400 group-hover/btn:text-rose-900'}`} />
                                        </button>

                                        {/* Quick Add Overlay */}
                                        <div className="absolute inset-x-6 bottom-6 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <button 
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    const success = await addToCart(product);
                                                    if (success) addToast(`Added ${product.name} to cart`, 'success');
                                                }}
                                                disabled={!product.inStock}
                                                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-colors flex items-center justify-center gap-2 transform active:scale-95 ${
                                                    product.inStock 
                                                    ? 'bg-white/95 text-stone-900 hover:bg-stone-900 hover:text-white' 
                                                    : 'bg-stone-100/90 text-stone-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {product.inStock ? (
                                                    <>
                                                        <Package className="w-4 h-4" /> Add to Cart
                                                    </>
                                                ) : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-2 px-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="font-heading font-bold text-xl text-stone-900 leading-tight group-hover:text-rose-900 transition-colors">
                                                <Link to={`/product/${product.id}`}>
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <span className="shrink-0 font-bold text-lg text-stone-900">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-stone-500 font-medium">{product.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-3 mt-20">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-8 py-3 rounded-full border border-stone-200 text-stone-600 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentPage(i + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                                                currentPage === i + 1
                                                ? 'bg-stone-900 text-white shadow-stone-900/20 scale-110'
                                                : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-8 py-3 rounded-full border border-stone-200 text-stone-600 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Shop;

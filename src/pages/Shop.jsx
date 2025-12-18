import React, { useState, useEffect } from 'react';
import { Package, Heart, Search, Filter } from 'lucide-react';
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
    const [filter, setFilter] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;
    // const [isLoading, setIsLoading] = useState(true); // Removed fake loading

    // Initial load simulation - REMOVED
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, priceRange, sortBy, searchQuery]);

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
        { id: 'all', label: 'All Products' },
        { id: 'Home Decor', label: 'Home Decor' },
        { id: 'Accessories', label: 'Accessories' },
        { id: 'Art', label: 'Art' },
        { id: 'Gifts', label: 'Gifts' }
    ];

    return (
        <div className="bg-[#fdfbf7] min-h-screen pb-20">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-rose-50/50">
                <div className="container-custom text-center">
                    <h1 className="text-4xl lg:text-6xl font-heading font-bold text-stone-900 mb-6">
                        Curated <span className="text-rose-900">Collections</span>
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Discover unique embroidered jewelry, home decor, and accessories made with traditional techniques and modern style
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-[72px] lg:top-[88px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="container-custom py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64 order-first md:order-last">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-full text-sm text-stone-700 focus:ring-2 focus:ring-rose-900 outline-none transition-all placeholder:text-stone-400"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center flex-1">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all duration-300 ${filter === cat.id
                                    ? 'bg-rose-900 text-white shadow-md'
                                    : 'bg-gray-50 text-stone-600 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 justify-center">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-50 border-0 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-700 focus:ring-2 focus:ring-rose-900 cursor-pointer shrink-0"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>

                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="bg-gray-50 border-0 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-700 focus:ring-2 focus:ring-rose-900 cursor-pointer shrink-0"
                        >
                            <option value="all">All Prices</option>
                            <option value="0-1000">Under ₹1,000</option>
                            <option value="1000-2000">₹1,000 - ₹2,000</option>
                            <option value="2000-5000">₹2,000 - ₹5,000</option>
                            <option value="5000+">₹5,000+</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="container-custom py-12">
                {productsLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900 mx-auto"></div>
                        <p className="text-stone-500 mt-4 animate-pulse">Curating products...</p>
                    </div>
                ) : allFilteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 p-8">
                        <Package className="w-16 h-16 mx-auto text-stone-300 mb-4" />
                        <h3 className="text-xl font-heading font-medium text-stone-900 mb-2">No products found</h3>
                        <p className="text-stone-500">Try adjusting your filters to see more results</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                            {paginatedProducts.map((product, index) => (
                                <div 
                                    key={product.id} 
                                    className="group card-premium flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-[4/5] bg-stone-50 block cursor-pointer">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!product.inStock ? 'opacity-75 grayscale' : ''}`}
                                        />
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start pointer-events-none">
                                            {product.featured && (
                                                <span className="bg-rose-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                                    Featured
                                                </span>
                                            )}
                                            {!product.inStock && (
                                                <span className="bg-stone-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Quick Actions */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                                             <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleWishlist(product);
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-rose-50 transition-colors z-20"
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-stone-600'}`} />
                                            </button>
                                        </div>
                                    </Link>

                                    <div className="p-5 flex flex-col flex-1">
                                        <Link to={`/product/${product.id}`} className="block">
                                            <h3 className="text-lg font-heading font-bold text-stone-900 group-hover:text-rose-900 transition-colors line-clamp-1 mb-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-stone-500 line-clamp-2 mb-4 min-h-[40px]">{product.description}</p>
                                        </Link>
                                        
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xl font-bold text-stone-900 leading-none">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-stone-400 line-through leading-none">
                                                        ₹{product.originalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                                {product.discountPercentage > 0 && (
                                                    <span className="text-xs font-bold text-green-600 leading-none pt-0.5">
                                                        {product.discountPercentage}% off
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    addToCart(product);
                                                    addToast(`Added ${product.name} to cart`, 'success', {
                                                        label: 'Go to Cart',
                                                        onClick: () => navigate('/cart')
                                                    });
                                                }}
                                                disabled={!product.inStock}
                                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all shadow-sm ${
                                                    !product.inStock 
                                                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                                    : 'bg-stone-900 text-white hover:bg-rose-900 hover:shadow-md'
                                                }`}
                                            >
                                                {!product.inStock ? 'Sold Out' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(prev - 1, 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors font-bold text-sm"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(i + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                                            currentPage === i + 1
                                            ? 'bg-rose-900 text-white shadow-md'
                                            : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors font-bold text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Shop;


import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart,
  ShoppingBag,
  Search,
  ChevronDown,
  Package,
  MapPin,
  ArrowLeft,
  Sparkles,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { GlobalPincodeHeader } from './GlobalPincodeHeader';

const Navbar = React.memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  const { cartCount, FREE_DELIVERY_THRESHOLD } = useCart();
  const { currentUser, logout, openLoginSheet } = useAuth();
  const { addToast } = useToast();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          setIsSearchOpen(false);
          navigate('/shop');
      }
  };

  // Focus Search Input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click Outside Handlers
  useEffect(() => {
    function handleClickOutside(event) {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
          setIsUserMenuOpen(false);
        }
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
          // Prevent closing if clicking the toggle button itself
          if (!event.target.closest('#mobile-search-button')) {
            setIsSearchOpen(false);
          }
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll Effect
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
          setScrollDirection('up');
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };



  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gifts', path: '/gifts' },
    { name: 'Custom Design', path: '/custom-design' },

    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  const isHomePage = location.pathname === '/';

  const getPageTitle = (pathname) => {
      if (pathname.startsWith('/shop')) return 'Shop';
      if (pathname.startsWith('/product')) return 'Product Details';
      if (pathname.startsWith('/cart')) return 'Bag';
      if (pathname.startsWith('/wishlist')) return 'Wishlist';
      if (pathname.startsWith('/profile')) return 'Profile';
      if (pathname.startsWith('/login')) return 'Login';
      if (pathname.startsWith('/custom-design')) return 'Custom Design';

      if (pathname.startsWith('/about')) return 'About';
      if (pathname.startsWith('/support')) return 'Support';
      return 'Crochet Wali By Sana';
  };

  if (location.pathname === '/checkout') {
      return null;
  }

  return (
    <>
    <header className={`sticky top-0 w-full z-50 flex flex-col transition-transform duration-300 ease-in-out ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'} ${location.pathname === '/cart' ? 'hidden lg:flex' : ''}`}>
      {/* CRO Announcement Bar */}
      <div className="w-full bg-[#6e132b] text-white py-1.5 md:py-2 px-4 flex items-center justify-center gap-2 overflow-hidden relative group">
          <Truck className="w-4 h-4 md:w-5 md:h-5 shrink-0 group-hover:animate-bounce" />
          <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase">
              Free Shipping on orders over <span className="text-rose-200">₹{FREE_DELIVERY_THRESHOLD || 999}</span>!
          </p>
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-rose-300 absolute right-4 md:right-8 animate-pulse" />
      </div>
      <nav
        className={`w-full relative z-20 transition-all duration-500 ease-in-out min-h-[56px] md:min-h-[72px]
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-[12px] border-b border-stone-100 shadow-lg shadow-black/5 py-2 px-2 md:px-12 lg:px-20'
            : 'bg-white/80 backdrop-blur-[12px] py-3 px-2 md:px-12 lg:px-20'
          }`}
      >
      <div className="container-custom">
        <div className="flex items-center justify-between relative">

          {/* 1. Left: Mobile Layout changes based on page */}
          <div className="flex items-center gap-2 lg:flex-1">
            {/* Desktop Logo (Always visible on lg) */}
            <Link to="/" className="hidden lg:flex flex-col group" aria-label="Home">
                <picture>
                  <img src="/logo.png" alt="Crochet Wali" className="h-16 lg:h-20 w-auto object-contain drop-shadow-sm hover:drop-shadow-md transition-all hover:scale-105" width={180} height={80} />
                </picture>
            </Link>

            {/* Mobile Header Logic */}
            {isHomePage ? (
                <>
                    <button
                        type="button"
                        className="p-1.5 -ml-1.5 text-stone-800 hover:text-rose-900 transition-colors rounded-full lg:hidden z-10"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu-container"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col group lg:hidden z-0" aria-label="Home">
                        <picture>
                          <img src="/logo.png" alt="Crochet Wali" className="h-14 w-auto object-contain mt-1 drop-shadow-sm" width={120} height={56} />
                        </picture>
                    </Link>
                </>
            ) : (
                <div className="flex items-center gap-1 lg:hidden z-10">
                    <button
                        type="button"
                        className="p-2 -ml-2 text-stone-800 hover:text-rose-900 active:scale-90 transition-all rounded-full hover:bg-stone-100"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex shrink-0 z-0">
                        <picture>
                          <img src="/logo.png" alt="Crochet Wali" className="h-12 w-auto object-contain mt-1 drop-shadow-sm" width={100} height={48} />
                        </picture>
                    </Link>
                </div>
            )}
          </div>



          {/* 3. Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-2 shrink-0">
             {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                    <Link 
                      to={link.path} 
                      className={`relative block text-[10px] xl:text-xs font-bold tracking-widest uppercase transition-all duration-300 px-2 xl:px-4 py-2 rounded-full whitespace-nowrap ${
                        isActive(link.path) 
                          ? 'text-rose-900' 
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      {link.name}
                      {/* Underline indicator for active link */}
                      <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-rose-900 rounded-full transition-all duration-300 ${
                        isActive(link.path) ? 'w-4' : 'w-0 group-hover:w-3 group-hover:bg-stone-400'
                      }`} />
                    </Link>

                    {/* Mega Menu for Shop */}
                    {link.name === 'Shop' && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white shadow-2xl rounded-2xl p-6 hidden group-hover:grid grid-cols-3 gap-6 border border-stone-100 opacity-0 group-hover:opacity-100 transition-opacity z-50 mt-1">
                            <div>
                                <h4 className="font-heading font-bold text-stone-900 mb-3 text-[11px] tracking-widest uppercase border-b border-stone-100 pb-2">By Category</h4>
                                <ul className="space-y-2">
                                    <li><Link to="/shop?category=crochet" className="text-sm text-stone-600 hover:text-[#d6336c] transition-colors">Crochet Bouquets</Link></li>
                                    <li><Link to="/shop?category=embroidery" className="text-sm text-stone-600 hover:text-[#d6336c] transition-colors">Embroidery Hoops</Link></li>
                                    <li><Link to="/shop?category=accessories" className="text-sm text-stone-600 hover:text-[#d6336c] transition-colors">Accessories</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-stone-900 mb-3 text-[11px] tracking-widest uppercase border-b border-stone-100 pb-2">By Occasion</h4>
                                <ul className="space-y-2">
                                    <li><Link to="/gifts#anniversary" className="text-sm text-stone-600 hover:text-[#d6336c] transition-colors">Anniversary</Link></li>
                                    <li><Link to="/gifts#girlfriend" className="text-sm text-stone-600 hover:text-[#d6336c] transition-colors">For Her</Link></li>
                                    <li><Link to="/gifts#budget" className="text-sm text-stone-600 hover:text-[#d6336c] transition-colors">Under ₹999</Link></li>
                                </ul>
                            </div>
                            <div className="bg-[#fffaf3] p-4 rounded-xl flex flex-col items-center justify-center text-center">
                                <Sparkles className="w-5 h-5 text-[#d6336c] mb-2" />
                                <h4 className="font-heading font-bold text-stone-900 text-sm mb-1">New Arrivals</h4>
                                <p className="text-[11px] text-stone-500 mb-3">Discover the latest handcrafted creations.</p>
                                <Link to="/shop" className="text-[10px] font-bold text-white bg-[#d6336c] px-4 py-2 rounded-full uppercase tracking-wider hover:scale-105 transition-transform">Shop Now</Link>
                            </div>
                        </div>
                    )}
                </div>
              ))}
          </div>

          {/* 4. Right: Icons & Actions */}
          <div className="flex items-center gap-0 sm:gap-2">
            <div className="hidden lg:block w-[400px] xl:w-[500px] mr-6">
              <GlobalPincodeHeader />
            </div>

            {/* Mobile Search Icon */}
            <button 
                id="mobile-search-button"
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="p-1.5 md:p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 lg:hidden animate-fade-in" 
                aria-label="Search"
            >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

             {/* Wishlist */}
            <Link 
                to="/wishlist" 
                onClick={(e) => {
                    if (!currentUser) {
                        e.preventDefault();
                        openLoginSheet();
                    }
                }}
                className="p-1.5 md:p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100" 
                aria-label="Wishlist"
            >
               <Heart className="w-5 h-5" />
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative p-1.5 md:p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 group" aria-label="Cart">
              <ShoppingBag className={`w-5 h-5 group-hover:scale-110 transition-transform ${cartCount > 0 ? 'animate-cart-bounce' : ''}`} key={cartCount} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 bg-rose-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg border-2 border-white animate-badge-pop" key={`badge-${cartCount}`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth / User Menu */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              {currentUser ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 pl-2 focus:outline-none group"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-rose-900 transition-all p-0.5">
                     {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center rounded-full text-stone-500">
                            <User className="w-4 h-4" />
                        </div>
                      )}
                  </div>
                </button>
              ) : (
                <Link to="/login" className="ml-2 btn-primary !px-6 !py-2 !text-xs whitespace-nowrap border-2 border-rose-900 hover:border-rose-800">
                  Login / Sign Up
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all duration-300 border border-stone-100">
                  <div className="px-5 py-4 border-b border-stone-50 bg-stone-50/30">
                    <p className="text-sm font-bold text-stone-900 truncate font-heading">{currentUser.displayName || 'User'}</p>
                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                        to="/profile"
                        className="flex items-center w-full px-5 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-50 hover:text-rose-900 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                    >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                    </Link>
                    <Link
                        to="/profile#orders"
                        className="flex items-center w-full px-5 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-50 hover:text-rose-900 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                    >
                        <Package className="w-4 h-4 mr-3" />
                        My Orders
                    </Link>
                    <Link
                        to="/profile#addresses"
                        className="flex items-center w-full px-5 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-50 hover:text-rose-900 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                    >
                        <MapPin className="w-4 h-4 mr-3" />
                        Addresses
                    </Link>

                  </div>
                  <div className="border-t border-stone-50 py-2">
                     <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar (Bottom Row) - Hidden by default, shown on search icon click */}
        <div ref={searchContainerRef} className={`lg:hidden transition-all duration-300 overflow-hidden ${isSearchOpen ? 'max-h-20 opacity-100 mt-2 mb-1' : 'max-h-0 opacity-0 m-0'}`}>
            <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for brands and products" 
                    className="w-full bg-white border border-stone-200 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium text-stone-700 focus:outline-none focus:border-stone-300 shadow-sm transition-all placeholder:text-stone-400"
                />
            </form>
        </div>
      </div>
    </nav>
    </header>

    {/* Mobile Side Drawer */}
    <div id="mobile-menu-container" className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className={`absolute top-0 left-0 w-[80%] max-w-[300px] h-full bg-white shadow-2xl transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <Link to="/" className="flex flex-col" onClick={() => setIsMobileMenuOpen(false)}>
                        <picture>
                          <img src="/logo.png" alt="Crochet Wali" className="h-16 w-auto object-contain" width={160} height={64} />
                        </picture>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-500 hover:text-rose-900 rounded-full hover:bg-stone-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-1 flex-1 px-2">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 text-base font-body font-medium transition-all py-3 px-4 ${
                                isActive(link.path) 
                                    ? 'text-rose-900 font-semibold bg-rose-50/50 rounded-r-full border-l-4 border-rose-900' 
                                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-r-full border-l-4 border-transparent'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="border-t border-stone-100 pt-6 px-4 pb-4">
                     {currentUser ? (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 overflow-hidden">
                                     {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                                      ) : (
                                        <User className="w-5 h-5" />
                                      )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-stone-900 truncate">{currentUser.displayName || 'User'}</p>
                                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Link to="/profile" className="block text-sm font-medium text-stone-600 hover:text-rose-900 py-2">Account Settings</Link>
                                <button onClick={handleLogout} className="block w-full text-left text-sm font-medium text-stone-400 hover:text-red-600 py-2 transition-colors">Sign Out</button>
                            </div>
                        </>
                     ) : (
                            <Link to="/login" className="col-span-2 btn-primary flex items-center justify-center !px-0 text-xs py-2.5">Login / Sign Up</Link>
                     )}
                </div>
            </div>
        </div>
    </div>


    </>
  );
});

export default Navbar;

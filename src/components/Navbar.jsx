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
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = React.memo(() => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);

  const { cartCount } = useCart();
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    { name: 'Custom Design', path: '/custom-design' },
    { name: 'Mehndi', path: '/mehndi-booking' },
    { name: 'Gallery', path: '/gallery' },
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
      if (pathname.startsWith('/mehndi-booking')) return 'Mehndi';
      if (pathname.startsWith('/gallery')) return 'Gallery';
      if (pathname.startsWith('/about')) return 'About';
      if (pathname.startsWith('/support')) return 'Support';
      return 'Enbroidery By Sana';
  };

  return (
    <>
    <header className="sticky top-0 w-full z-50 flex flex-col transition-all duration-500 ease-in-out">
      <nav
        className={`w-full relative z-20 transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'bg-white/98 backdrop-blur-2xl border-b border-stone-100 shadow-lg shadow-black/5 py-2 px-2 md:px-12 lg:px-20'
            : 'bg-white/50 backdrop-blur-sm py-3 px-2 md:px-12 lg:px-20'
          }`}
      >
      <div className="container-custom">
        <div className="flex items-center justify-between relative">

          {/* 1. Left: Mobile Layout changes based on page */}
          <div className="flex items-center gap-2 lg:w-1/4">
            {/* Desktop Logo (Always visible on lg) */}
            <Link to="/" className="hidden lg:flex flex-col group" aria-label="Home">
                <img src="/logo.png" alt="Enbroidery By Sana" className="h-14 w-auto object-contain" />
            </Link>

            {/* Mobile Header Logic */}
            {isHomePage ? (
                <>
                    <button
                        type="button"
                        className="p-1.5 -ml-1.5 text-stone-800 hover:text-rose-900 transition-colors rounded-full lg:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link to="/" className="flex flex-col group lg:hidden" aria-label="Home">
                        <img src="/logo.png" alt="Enbroidery By Sana" className="h-10 w-auto object-contain" />
                    </Link>
                </>
            ) : (
                <div className="flex items-center gap-1 lg:hidden">
                    <button
                        type="button"
                        className="p-2 -ml-2 text-stone-800 hover:text-rose-900 active:scale-90 transition-all rounded-full hover:bg-stone-100"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <Link to="/" className="flex shrink-0">
                        <img src="/logo.png" alt="Enbroidery By Sana" className="h-9 w-auto object-contain" />
                    </Link>
                </div>
            )}
          </div>



          {/* 3. Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-2 lg:w-2/4">
             {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`relative text-xs font-bold tracking-widest uppercase transition-all duration-300 px-4 py-2 rounded-full whitespace-nowrap group ${
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
              ))}
          </div>

          {/* 4. Right: Icons & Actions */}
          <div className="flex items-center justify-end space-x-2 lg:space-x-4 lg:w-1/4">

            {/* Mobile Search Icon */}
            <button 
                id="mobile-search-button"
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 lg:hidden animate-fade-in" 
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
                className="p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100" 
                aria-label="Wishlist"
            >
               <Heart className="w-5 h-5" />
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 group" aria-label="Cart">
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
    <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
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
                        <img src="/logo.png" alt="Enbroidery By Sana" className="h-16 w-auto object-contain" />
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

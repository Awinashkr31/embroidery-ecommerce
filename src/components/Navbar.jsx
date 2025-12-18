import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const userMenuRef = useRef(null);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

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
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-white py-4'
      }`}
      data-id="main-navbar"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0" data-id="navbar-logo">
            <Link to="/" className="flex flex-col">
              <span className="font-heading text-xl lg:text-2xl font-bold text-stone-900 leading-tight">
                Hand Embroidery
              </span>
              <span className="text-xs uppercase tracking-widest text-[#881337] font-medium">
                by Sana
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                    isActive(link.path) 
                      ? 'text-[#881337]' 
                      : 'text-stone-600 hover:text-[#881337]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-5">
            {/* Wishlist */}
            <Link to="/wishlist" className="hidden md:block text-stone-600 hover:text-[#881337] transition-colors">
               <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-stone-600 hover:text-[#881337] transition-colors" data-id="cart-button">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#881337] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              {currentUser ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-full border border-stone-200" />
                  ) : (
                    <div className="p-1 rounded-full border border-stone-200 hover:border-[#881337] transition-colors">
                      <User className="w-5 h-5 text-stone-600" />
                    </div>
                  )}
                </button>
              ) : (
                <Link to="/login" className="btn-primary py-2 px-5 text-xs">
                  Login
                </Link>
              )}

              {/* Dropdown */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-medium text-stone-900 truncate">{currentUser.displayName || 'User'}</p>
                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center w-full px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <User className="w-4 h-4 mr-2.5 text-stone-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              <button
                type="button"
                className="p-1 text-stone-800 hover:text-[#881337] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[60px] bg-white border-t border-gray-100 shadow-lg p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className="block text-base font-medium text-stone-800 hover:text-[#881337] py-2 border-b border-gray-50 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between">
                {currentUser ? (
                   <div className="flex items-center gap-3">
                     <span className="text-sm font-medium text-stone-900">Hi, {currentUser.displayName || 'User'}</span>
                     <button onClick={handleLogout} className="text-xs text-red-600 font-medium border px-2 py-1 rounded">Sign Out</button>
                   </div>
                ) : (
                  <Link to="/login" className="btn-primary w-full text-center py-3">Login / Signup</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


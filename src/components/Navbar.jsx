import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart,
  ShoppingBag,
  Bell,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const userMenuRef = useRef(null);
  const location = useLocation();

  // Fetch Notifications
  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', currentUser.email)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_email=eq.${currentUser.email}` 
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Mark as Read
  const handleMarkRead = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  // Delete Notification
  // Delete Notification
  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation(); // Prevent triggering mark read
    
    try {
        // Use RPC to ensure safe deletion regardless of RLS quirks
        const { data, error } = await supabase.rpc('delete_notification', { notification_id: id });
        
        if (error) throw error;
        
        // If data is false, it means nothing was deleted (mismatch or not found)
        if (data === false) {
             console.warn("Notification delete failed: Permission denied or not found");
             // We could throw here, but let's just show error.
             throw new Error("Could not delete notification.");
        }
        
        // Optimistic Update
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => Math.max(0, prev - (notifications.find(n => n.id === id && !n.is_read) ? 1 : 0)));
        addToast('Notification deleted', 'success');
        
    } catch (err) {
        console.error("Error deleting notification:", err);
        addToast("Failed to delete notification", 'error');
    }
  };

  // Close notif menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
            setIsNotifOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

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
    { name: 'Support', path: '/support' },
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
            {/* Notifications */}
            {currentUser && (
                <div className="relative hidden md:block" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative text-stone-600 hover:text-[#881337] transition-colors p-1"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all duration-200 z-50 overflow-hidden">
                            <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-stone-50">
                                <h3 className="font-bold text-sm text-stone-900">Notifications</h3>
                                <span className="text-xs text-stone-500">{unreadCount} unread</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                            className={`px-4 py-3 border-b border-gray-50 hover:bg-stone-50 cursor-pointer transition-colors ${!notif.is_read ? 'bg-orange-50/50' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h4 className={`text-sm flex-1 ${!notif.is_read ? 'font-bold text-stone-900' : 'font-medium text-stone-600'}`}>{notif.title}</h4>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#881337]"></span>}
                                                    <button 
                                                        onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                        className="text-stone-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-stone-500 line-clamp-2 mr-6">{notif.message}</p>
                                            <span className="text-[10px] text-stone-400 mt-1 block">{new Date(notif.created_at).toLocaleDateString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-stone-500 text-sm">
                                        No notifications yet
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

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


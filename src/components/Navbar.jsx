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
  Search,
  ChevronDown,
  Package,
  MapPin
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
  const userMenuRef = useRef(null);

  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
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
        addToast(`New Notification: ${payload.new.title}`, 'info');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Mark as Read
  const handleMarkRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  // Delete Notification
  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
        const { error } = await supabase.from('notifications').delete().eq('id', id);
        if (error) throw error;
        
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => Math.max(0, prev - (notifications.find(n => n.id === id && !n.is_read) ? 1 : 0)));
        addToast('Notification deleted', 'success');
    } catch (err) {
        console.error("Error deleting notification:", err);
        addToast("Failed to delete notification", 'error');
    }
  };

  // Click Outside Handlers
  useEffect(() => {
    function handleClickOutside(event) {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
            setIsNotifOpen(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
          setIsUserMenuOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef, userMenuRef]);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <nav
  className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out
    ${isScrolled
      ? 'bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm py-2 px-6 md:px-12 lg:px-20'
      : 'bg-white/50 backdrop-blur-sm py-3 px-6 md:px-12 lg:px-20'
    }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          
          {/* 1. Left: Mobile Menu Trigger (hidden on desktop) */}
          <div className="lg:hidden">
            <button
              type="button"
              className="p-2 text-stone-800 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Left: Logo (Desktop: Center/Left balanced) */}
           <div className="flex-shrink-0 flex items-center gap-2 lg:w-1/4">
            <Link to="/" className="flex flex-col group">
              <img src="/logo.png" alt="Enbroidery By Sana" className="h-12 md:h-14 w-auto object-contain" />
            </Link>
          </div>

          {/* 3. Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-8 lg:w-2/4">
             {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`relative text-xs font-bold tracking-widest uppercase transition-all duration-300 px-4 py-1.5 rounded-full whitespace-nowrap ${
                    isActive(link.path) 
                      ? 'bg-rose-900 text-white shadow-sm' 
                      : 'text-stone-600 hover:text-rose-900 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          {/* 4. Right: Icons & Actions */}
          <div className="flex items-center justify-end space-x-2 lg:space-x-4 lg:w-1/4">
             
             {/* Wishlist */}
            <Link to="/wishlist" className="p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 hidden sm:block">
               <Heart className="w-5 h-5" />
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100 group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0.5 bg-rose-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

             {/* Notifications */}
             {currentUser && (
                <div className="relative hidden md:block" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2 text-stone-600 hover:text-rose-900 transition-colors rounded-full hover:bg-stone-100"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[8px] font-bold rounded-full h-2.5 w-2.5 animate-pulse"></span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all duration-300 z-50 overflow-hidden border border-stone-100">
                           <div className="px-5 py-3 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                                <h3 className="font-heading font-bold text-sm text-stone-900">Notifications</h3>
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] rounded-full font-bold">{unreadCount} New</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                            className={`px-5 py-3 border-b border-stone-50 hover:bg-stone-50 cursor-pointer transition-colors ${!notif.is_read ? 'bg-orange-50/30' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1 gap-2">
                                                <h4 className={`text-xs flex-1 ${!notif.is_read ? 'font-bold text-stone-900' : 'font-medium text-stone-600'}`}>{notif.title}</h4>
                                                <button 
                                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                    className="text-stone-300 hover:text-rose-600 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-stone-400 text-xs">
                                        No recent notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                <Link to="/login" className="ml-2 btn-primary !px-6 !py-2 !text-xs">
                  Login
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
      </div>
    </nav>

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

                <div className="space-y-6 flex-1">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`block text-xl font-heading font-medium transition-colors ${
                                isActive(link.path) ? 'text-rose-900 pl-4 border-l-2 border-rose-900' : 'text-stone-600 hover:text-rose-900'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="border-t border-stone-100 pt-6 space-y-4">
                     {currentUser ? (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-stone-900">{currentUser.displayName || 'User'}</p>
                                    <p className="text-xs text-stone-500 truncate w-32">{currentUser.email}</p>
                                </div>
                            </div>
                            <Link to="/profile" className="block text-sm font-medium text-stone-600 hover:text-rose-900 py-2">Account Settings</Link>
                            <button onClick={handleLogout} className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700 py-2">Sign Out</button>
                        </>
                     ) : (
                         <div className="grid grid-cols-2 gap-4">
                            <Link to="/login" className="btn-primary flex items-center justify-center !px-0 text-xs">Login</Link>
                            <Link to="/register" className="btn-outline flex items-center justify-center !px-0 text-xs">Sign Up</Link>
                         </div>
                     )}
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default Navbar;

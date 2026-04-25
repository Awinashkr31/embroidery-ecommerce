import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';
import { useAdminPushNotifications } from '../../hooks/useAdminPushNotifications';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  User,
  Tag,
  Mail,
  ShoppingBag,
  Star,
  Settings,
  Calendar,
  Bell,
  Palette,
  Image as ImageIcon,
  ChevronRight,
  ExternalLink,
  Download,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/sadmin/dashboard' },
  { icon: ShoppingBag,     label: 'Product Listing', path: '/sadmin/products' },
  { icon: ShoppingCart,    label: 'Orders',          path: '/sadmin/orders' },
  { icon: User,            label: 'Users',           path: '/sadmin/users' },
  { icon: Palette,         label: 'Design Requests', path: '/sadmin/design-requests' },
  { icon: Star,            label: 'Reviews',         path: '/sadmin/reviews' },
  { icon: Mail,            label: 'Support',         path: '/sadmin/messages' },
  { icon: Calendar,        label: 'Bookings',        path: '/sadmin/bookings' },
  { icon: ImageIcon,       label: 'Gallery',         path: '/sadmin/gallery' },
  { icon: Tag,             label: 'Coupons',         path: '/sadmin/coupons' },
  { icon: Bell,            label: 'Notifications',   path: '/sadmin/notifications' },
  { icon: Settings,        label: 'Settings',        path: '/sadmin/settings' },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useAdminPushNotifications(); // Request and handle push notifications

  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (running as PWA)
    const mqStandalone = window.matchMedia('(display-mode: standalone)');
    setIsStandalone(mqStandalone.matches || window.navigator.standalone === true);
    
    const onChange = (e) => setIsStandalone(e.matches);
    mqStandalone.addEventListener?.('change', onChange);
    return () => mqStandalone.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    // Hide button after install
    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener('appinstalled', onInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };


  // Derive current page label from path
  const currentPage = menuItems.find(m => location.pathname.startsWith(m.path))?.label ?? 'Admin';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // session might already be gone
    } finally {
      localStorage.removeItem('adminLoggedIn');
      navigate('/sadmin/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-stone-900 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Logo area */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
          <img src="/logo.png" alt="Enbroidery" className="h-9 w-auto object-contain brightness-0 invert opacity-90" />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-heading font-bold text-sm tracking-wide">Enbroidery</span>
            <span className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">Admin</span>
          </div>
          {/* Close on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-rose-900 text-white shadow-lg shadow-rose-900/30'
                    : 'text-stone-400 hover:bg-white/8 hover:text-white'}
                `}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? 'text-rose-200' : 'text-stone-500 group-hover:text-white'}`} strokeWidth={2} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-300 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: admin info + logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-2 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-rose-900/60 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-rose-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.email?.split('@')[0] ?? 'Admin'}
              </p>
              <p className="text-[10px] text-stone-500 truncate">{currentUser?.email ?? ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {loggingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="h-16 bg-white border-b border-stone-100 shadow-sm flex items-center justify-between px-4 lg:px-8 shrink-0">
          {/* Hamburger (mobile) */}
          <button
            className="p-2 -ml-2 lg:hidden text-stone-600 hover:text-rose-900 hover:bg-stone-50 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2 min-w-0 flex-1 px-2">
            <h1 className="text-lg font-heading font-bold text-stone-900 hidden lg:block truncate">{currentPage}</h1>
            {/* Breadcrumb pill on mobile */}
            <span className="lg:hidden text-sm font-bold text-stone-900 truncate">{currentPage}</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {deferredPrompt && !isStandalone && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 transition-colors px-2 sm:px-3 py-1.5 rounded-lg border border-rose-200 shrink-0 animate-pulse hover:animate-none"
                title="Install App"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-rose-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-50 border border-stone-200 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              View Site
            </Link>
            <div className="w-8 h-8 rounded-full bg-rose-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

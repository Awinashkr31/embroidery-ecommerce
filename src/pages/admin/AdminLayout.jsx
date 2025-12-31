import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
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
  LayoutTemplate
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth check is now handled by ProtectedRoute wrapper

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        // 1. Attempt to Clear Supabase Session
        await supabase.auth.signOut();
      } catch (error) {
        console.warn("Logout error (session might be missing):", error);
      } finally {
        // 2. ALWAYS Clear Local Keys
        localStorage.removeItem('adminLoggedIn');
        
        // 3. Redirect
        navigate('/sadmin/login');
      }
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/sadmin/dashboard' },
    { icon: ShoppingBag, label: 'Products', path: '/sadmin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/sadmin/orders' },
    { icon: User, label: 'User Analytics', path: '/sadmin/users' },
    { icon: Palette, label: 'Design Requests', path: '/sadmin/design-requests' },
    { icon: Star, label: 'Reviews', path: '/sadmin/reviews' },
    { icon: Mail, label: 'Support Messages', path: '/sadmin/messages' },
    { icon: Calendar, label: 'Mehndi Bookings', path: '/sadmin/bookings' },
    { icon: ImageIcon, label: 'Gallery', path: '/sadmin/gallery' },
    { icon: Tag, label: 'Coupons', path: '/sadmin/coupons' },
    { icon: Bell, label: 'Notifications', path: '/sadmin/notifications' },
  { icon: Settings, label: 'Settings', path: '/sadmin/settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex font-body">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <Link to="/" className="text-xl font-medium text-gray-800">
            Admin <span className="text-deep-rose">Panel</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-deep-rose/10 text-deep-rose font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-deep-rose'}
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-8"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
          <button 
            className="p-2 -ml-2 lg:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="ml-auto flex items-center space-x-4">
             <Link to="/" target="_blank" className="text-sm text-gray-600 hover:text-deep-rose">
                View Site
             </Link>
             <div className="w-8 h-8 rounded-full bg-deep-rose/10 flex items-center justify-center text-deep-rose">
                <User size={18} />
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

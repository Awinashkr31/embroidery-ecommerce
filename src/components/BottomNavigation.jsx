import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BottomNavigation = () => {
  const { cart } = useCart();
  const location = useLocation();
  const cartItemCount = cart.length;

  // Hide on Cart and Checkout pages to prevent overlap with sticky buttons
  if (['/cart', '/checkout'].includes(location.pathname)) {
    return null;
  }

  // Myntra-like styling: 
  // - Clean white background
  // - Subtle top shadow
  // - Active state: Brand Color + Bold text
  // - Inactive state: Gray + Normal text
  // - No background bubbles

  const navItemClass = ({ isActive }) => 
    `flex flex-col items-center justify-center gap-1 p-1 w-full transition-colors duration-200 ${
      isActive ? 'text-rose-900' : 'text-gray-500 hover:text-gray-900'
    }`;

  const iconSize = 24;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-between items-end px-2 py-2.5 h-[60px]">
        {/* Home */}
        <NavLink to="/" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Home size={iconSize} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "fill-rose-900/10" : ""} />
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>Home</span>
            </>
          )}
        </NavLink>

        {/* Shop (Categories) */}
        <NavLink to="/shop" className={navItemClass}>
          {({ isActive }) => (
            <>
              <LayoutGrid size={iconSize} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "fill-rose-900/10" : ""} />
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>Shop</span>
            </>
          )}
        </NavLink>

        {/* Cart - With Badge */}
        <NavLink to="/cart" className={navItemClass}>
          {({ isActive }) => (
            <div className="relative flex flex-col items-center">
              <div className="relative">
                  <ShoppingBag size={iconSize} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "fill-rose-900/10" : ""} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
              </div>
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>Bag</span>
            </div>
          )}
        </NavLink>

        {/* Wishlist */}
        <NavLink to="/wishlist" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Heart size={iconSize} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "fill-rose-900/10" : ""} />
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>Saved</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink to="/profile" className={navItemClass}>
          {({ isActive }) => (
            <>
              <User size={iconSize} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "fill-rose-900/10" : ""} />
              <span className={`text-[10px] tracking-wide mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;

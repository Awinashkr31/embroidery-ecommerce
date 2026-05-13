import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, Scissors, User, LayoutGrid, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';



const BottomNavigation = () => {
  const { cart } = useCart();
  const { currentUser, openLoginSheet } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const cartItemCount = cart.length;

  if (
    ['/checkout', '/mehndi-booking', '/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname) ||
    location.pathname.startsWith('/product/') ||
    (location.pathname === '/cart' && cart.length > 0)
  ) {
    return null;
  }

  const navItems = [
    { to: '/',             label: 'Home',     Icon: Home,        end: true,  id: 'home' },
    { to: '/categories',   label: 'Category', Icon: LayoutGrid,  end: false, id: 'category' },
    { to: '/new-arrivals', label: 'New',      Icon: Sparkles,    end: false, id: 'new' },
    { to: '/custom-design',label: 'Custom',   Icon: Scissors,    end: false, id: 'custom' },
    { to: '/profile',      label: 'Profile',  Icon: User,        end: false, id: 'profile' },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-16">
          {navItems.map(({ to, label, Icon: IconComponent, end, badge, id }) => {
            const isProfile = id === 'profile';
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

            const handleClick = (e) => {
              if (isProfile) {
                e.preventDefault();
                if (currentUser) {
                  navigate('/profile');
                } else {
                  openLoginSheet();
                }
              }
            };

            return (
              <NavLink
                key={id}
                to={to}
                end={end}
                onClick={handleClick}
                className="flex-1"
              >
                {() => (
                  <div className="relative flex flex-col items-center justify-center gap-1 h-full px-1 transition-all duration-150 active:scale-95">

                    {/* Top active bar */}
                    {isActive && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-rose-900 rounded-b-full" />
                    )}

                    {/* Icon wrapper */}
                    <div className={`relative flex items-center justify-center w-11 h-7 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-rose-900/10' : ''
                    }`}>
                      <IconComponent
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-colors duration-200 ${
                          isActive ? 'text-rose-900' : 'text-stone-500'
                        }`}
                      />

                      {/* Badge */}
                      {badge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-rose-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-white leading-none animate-badge-pop" key={`bnav-badge-${badge}`}>
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </div>

                    {/* Label — ALWAYS visible with strong contrast */}
                    <span className={`text-[10px] font-semibold leading-none select-none ${
                      isActive ? 'text-rose-900' : 'text-stone-600'
                    }`}>
                      {label}
                    </span>

                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

    </>
  );
};

export default BottomNavigation;

import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Store, Sparkles, Gift, User, LayoutGrid } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNavigation = () => {
  const { cart } = useCart();
  const { currentUser, openLoginSheet } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.replace(/\/$/, '') || '/';

  if (
    ['/checkout', '/login', '/register', '/forgot-password', '/reset-password', '/shop'].includes(path) ||
    location.pathname.startsWith('/product/') ||
    (location.pathname === '/cart' && cart.length > 0)
  ) {
    return null;
  }

  const navItems = [
    { to: '/',             label: 'Home',     Icon: Home,        end: true,  id: 'home' },
    { to: '/shop',         label: 'Shop',     Icon: Store,       end: false, id: 'shop' },
    { to: '/categories',   label: 'Category', Icon: LayoutGrid,  end: false, id: 'category' },
    { to: '/new-arrivals', label: 'New',      Icon: Sparkles,    end: false, id: 'new' },
    { to: '/custom-design',label: 'Custom',   Icon: Gift,        end: false, id: 'custom' },
  ];

  return (
    <div className="fixed bottom-2 left-4 right-4 z-50 md:hidden flex items-end justify-center pb-[env(safe-area-inset-bottom)] pointer-events-none">
      {/* Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="pointer-events-auto bg-[#faf8f5] border border-stone-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-full rounded-full overflow-hidden flex-shrink-0"
      >
        <div className="flex items-stretch h-[50px] px-1.5">
          {navItems.map((item) => {
            const isProfile = item.id === 'profile';
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

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

            const IconComp = item.Icon;

            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.end}
                onClick={handleClick}
                className="flex-1 min-w-0"
                aria-label={item.label}
              >
                <div className="relative flex flex-col items-center justify-center gap-0.5 h-full px-0 transition-all duration-150 active:scale-95">
                  {/* Icon wrapper */}
                  <div className={`relative flex items-center justify-center w-10 h-6 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-rose-900/10' : ''
                  }`}>
                    {isProfile && currentUser ? (
                      <div className={`w-[20px] h-[20px] rounded-full overflow-hidden flex items-center justify-center ${isActive ? 'ring-2 ring-rose-900 ring-offset-1 ring-offset-white' : 'border border-stone-300'}`}>
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-rose-900 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                            {currentUser.displayName ? currentUser.displayName.charAt(0) : <User size={13} />}
                          </div>
                        )}
                      </div>
                    ) : (
                      <IconComp
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-colors duration-300 ${
                          isActive ? 'text-rose-900' : 'text-stone-500'
                        }`}
                      />
                    )}

                    {/* Badge */}
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-1 bg-rose-900 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-white leading-none animate-badge-pop" key={`bnav-badge-${item.badge}`}>
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label — ALWAYS visible with strong contrast */}
                  <span className={`text-[10px] font-bold leading-none select-none transition-colors duration-300 ${
                    isActive ? 'text-rose-900' : 'text-stone-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNavigation;

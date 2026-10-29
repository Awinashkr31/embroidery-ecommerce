import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, Palette, User, LayoutGrid, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';



const BottomNavigation = () => {
  const { cart } = useCart();
  const { currentUser, openLoginSheet } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { isInstallable, promptInstall } = usePWAInstall();
  // Persistent state so we don't repeat the animation on route changes or re-renders
  const [hasAnimated, setHasAnimated] = useState(false);

  const isHome = location.pathname === '/';

  // Animation trigger for Home Page ONLY
  React.useEffect(() => {
    // If not installable or not on Home, don't show the button
    if (!isInstallable || !isHome) {
      setHasAnimated(false);
      return;
    }
    
    // Start large every time we visit Home
    setHasAnimated(false);
    
    // Animate to compact after delay
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1000); // 1000ms delay for the large -> compact transition
    
    return () => clearTimeout(timer);
  }, [location.pathname, isInstallable, isHome]);

  // isShrunk means we are on Home page, in the "compact" phase and we have a button to show
  const isShrunk = isHome && hasAnimated && isInstallable;

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (!success) {
      // Fallback for iOS or unsupported browsers where promptInstall returns false
      const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());
      if (isIos) {
        addToast("To install, tap the Share icon below and select 'Add to Home Screen'.", "info");
      } else {
        addToast("You can install this app from your browser menu.", "info");
      }
    }
  };
  
  const cartItemCount = cart.length;

  if (
    ['/checkout', '/login', '/register', '/forgot-password', '/reset-password', '/shop'].includes(location.pathname) ||
    location.pathname.startsWith('/product/') ||
    (location.pathname === '/cart' && cart.length > 0)
  ) {
    return null;
  }

  const navItems = [
    { to: '/',             label: 'Home',     Icon: Home,        end: true,  id: 'home' },
    { to: '/categories',   label: 'Category', Icon: LayoutGrid,  end: false, id: 'category' },
    { to: '/new-arrivals', label: 'New',      Icon: Sparkles,    end: false, id: 'new' },
    { to: '/custom-design',label: 'Custom',   Icon: Palette,     end: false, id: 'custom' },
  ];

  return (
    <>
      <div className="fixed bottom-2 left-4 right-4 z-50 md:hidden flex items-end justify-between pb-[env(safe-area-inset-bottom)] pointer-events-none">
        
        {/* Navigation Bar */}
        <nav
          aria-label="Mobile navigation"
          className={`pointer-events-auto bg-[#faf8f5] border border-stone-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex-shrink-0 ${
            isShrunk ? 'w-[calc(100%-64px)] rounded-[1.5rem]' : 'w-full rounded-[2rem]'
          }`}
        >
        <div className={`flex items-stretch transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isShrunk ? 'h-14 px-0.5' : 'h-16 px-2'
        }`}>
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
                className="flex-1 min-w-0"
                aria-label={label}
              >
                {() => (
                  <div className="relative flex flex-col items-center justify-center gap-0.5 h-full px-0 transition-all duration-150 active:scale-95">

                    {/* Icon wrapper */}
                    <div className={`relative flex items-center justify-center w-[2.75rem] h-[1.75rem] rounded-2xl transition-all duration-300 ${
                      isActive ? 'bg-rose-900/10' : ''
                    }`}>
                      {isProfile && currentUser ? (
                          <div className={`w-[22px] h-[22px] rounded-full overflow-hidden flex items-center justify-center ${isActive ? 'ring-2 ring-rose-900 ring-offset-1 ring-offset-white' : 'border border-stone-300'}`}>
                              {currentUser.photoURL ? (
                                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full bg-rose-900 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                                      {currentUser.displayName ? currentUser.displayName.charAt(0) : <User size={14} />}
                                  </div>
                              )}
                          </div>
                      ) : (
                          <IconComponent
                            size={20}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={`transition-colors duration-300 ${
                              isActive ? 'text-rose-900' : 'text-stone-500'
                            }`}
                          />
                      )}

                      {/* Badge */}
                      {badge > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-rose-900 text-white text-[10px] font-black flex items-center justify-center rounded-full border border-white leading-none animate-badge-pop" key={`bnav-badge-${badge}`}>
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </div>

                    {/* Label — ALWAYS visible with strong contrast */}
                    <span className={`text-[10px] font-bold leading-none select-none transition-colors duration-300 ${
                      isActive ? 'text-rose-900' : 'text-stone-500'
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

        {/* PWA Install Button Container - Only rendered on Home Page */}
        {isHome && (
        <div className={`pointer-events-auto flex items-end justify-end transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden origin-bottom-right ${
          isShrunk ? 'w-[56px] opacity-100 scale-100 translate-y-0 translate-x-0' : 'w-0 opacity-0 scale-50 translate-y-4 translate-x-4'
        }`}>
          <button
            onClick={handleInstallClick}
            className="w-[56px] h-[56px] rounded-full bg-rose-900 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-900/20 shrink-0 hover:bg-rose-950 active:scale-90 transition-all duration-300"
          >
            <Download size={20} className="drop-shadow-sm" />
            <span className="text-[10px] font-bold leading-none tracking-wide">Get App</span>
          </button>
        </div>
        )}
      </div>

    </>
  );
};

export default BottomNavigation;

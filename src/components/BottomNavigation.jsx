import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, Scissors, User, LayoutGrid, X } from 'lucide-react';
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

  // Animation trigger for Home Page
  React.useEffect(() => {
    // If not installable, just mark as animated so it starts compact
    if (!isInstallable) {
      setHasAnimated(true);
      return;
    }
    
    if (location.pathname === '/') {
      // Start large every time we visit Home
      setHasAnimated(false);
      
      // Animate to compact after delay
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 1000); // 1000ms delay for the large -> compact transition
      
      return () => clearTimeout(timer);
    } else {
      // On other pages, stay compact
      setHasAnimated(true);
    }
  }, [location.pathname, isInstallable]);

  // isShrunk means we are in the "compact" phase and we have a button to show
  const isShrunk = hasAnimated && isInstallable;

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
    { to: '/custom-design',label: 'Custom',   Icon: Scissors,    end: false, id: 'custom' },
    { to: '/profile',      label: 'Profile',  Icon: User,        end: false, id: 'profile' },
  ];

  return (
    <>
      <div className="fixed bottom-2 left-4 right-4 z-50 md:hidden flex items-end justify-between pb-[env(safe-area-inset-bottom)] pointer-events-none">
        
        {/* Navigation Bar */}
        <nav
          className={`pointer-events-auto bg-surface-cream/95 backdrop-blur-xl border border-border-warm shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex-shrink-0 ${
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
                      isActive ? 'bg-primary/10' : ''
                    }`}>
                      {isProfile && currentUser ? (
                          <div className={`w-[22px] h-[22px] rounded-full overflow-hidden flex items-center justify-center ${isActive ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface' : 'border border-outline'}`}>
                              {currentUser.photoURL ? (
                                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold uppercase">
                                      {currentUser.displayName ? currentUser.displayName.charAt(0) : <User size={14} />}
                                  </div>
                              )}
                          </div>
                      ) : (
                          <IconComponent
                            size={20}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={`transition-colors duration-300 ${
                              isActive ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                          />
                      )}

                      {/* Badge */}
                      {badge > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-error text-on-error text-[9px] font-black flex items-center justify-center rounded-full border border-surface leading-none animate-badge-pop" key={`bnav-badge-${badge}`}>
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </div>

                    {/* Label — ALWAYS visible with strong contrast */}
                    <span className={`text-[9px] md:text-[10px] font-bold leading-none select-none transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-on-surface-variant'
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

        {/* PWA Install Button Container - Always rendered, animates in/out */}
        <div className={`pointer-events-auto flex items-end justify-end transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden origin-bottom-right ${
          isShrunk ? 'w-[56px] opacity-100 scale-100 translate-y-0 translate-x-0' : 'w-0 opacity-0 scale-50 translate-y-4 translate-x-4'
        }`}>
          <button
            onClick={handleInstallClick}
            className="w-[56px] h-[56px] rounded-2xl bg-gradient-to-br from-rose-700 to-rose-900 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-900/20 shrink-0 hover:from-rose-800 hover:to-rose-950 active:scale-90 transition-all duration-300"
          >
            <Download size={20} className="drop-shadow-sm" />
            <span className="text-[10px] font-bold leading-none tracking-wide">Get App</span>
          </button>
        </div>
      </div>

    </>
  );
};

export default BottomNavigation;

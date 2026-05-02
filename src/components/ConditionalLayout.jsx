import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  
  const distractionFreeRoutes = [
    '/checkout',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/order-confirmation'
  ];

  // Check if current path exact matches any of the distraction-free routes
  const isDistractionFree = distractionFreeRoutes.some(route => location.pathname === route);

  return (
    <>
      {/* Simple CSS fade instead of framer-motion AnimatePresence (INP fix) */}
      <div className="animate-fade-in" key={location.pathname}>
        {children}
      </div>
      
      {!isDistractionFree && (
        <div className={(location.pathname === '/cart' || location.pathname === '/shop' || location.pathname.startsWith('/product/')) ? 'hidden md:block' : ''}>
          <Footer />
        </div>
      )}
      {!isDistractionFree && <BottomNavigation />}
    </>
  );
};

export default ConditionalLayout;


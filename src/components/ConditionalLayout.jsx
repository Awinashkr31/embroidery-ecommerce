import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './AnimatedPage';

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
      <AnimatePresence mode="wait">
        <AnimatedPage key={location.pathname}>
          {children}
        </AnimatedPage>
      </AnimatePresence>
      
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

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
  // (Using simple include for now as these are top-level routes mostly)
  const isDistractionFree = distractionFreeRoutes.some(route => location.pathname === route);

  return (
    <>
      {children}
      {!isDistractionFree && (
        <div className={(location.pathname === '/cart' || location.pathname.startsWith('/product/')) ? 'hidden md:block' : ''}>
          <Footer />
        </div>
      )}
      {!isDistractionFree && <BottomNavigation />}
    </>
  );
};

export default ConditionalLayout;

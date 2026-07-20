
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'

import Footer from './components/Footer'
import BottomNavigation from './components/BottomNavigation'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import { SettingsProvider } from './context/SettingsContext'
import { CategoryProvider } from './context/CategoryContext'
import { AdminProvider } from './context/AdminContext'
import { PincodeProvider } from './context/PincodeContext'

// Lazy Load Page Components for Performance
const LoginSignup = lazy(() => import('./pages/LoginSignup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
// const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';


const About = lazy(() => import('./pages/About'));
const Shop = lazy(() => import('./pages/Shop'));
const Categories = lazy(() => import('./pages/Categories'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const Collection = lazy(() => import('./pages/Collection'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/Blog/BlogPost'));
const Gifts = lazy(() => import('./pages/Gifts'));
const LandingPage = lazy(() => import('./pages/LandingPage'));


const CustomDesign = lazy(() => import('./pages/CustomDesign'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderFailed = lazy(() => import('./pages/OrderFailed'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Admin Components
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminRegister = lazy(() => import('./pages/admin/AdminRegister'));
const AdminForgotPassword = lazy(() => import('./pages/admin/AdminForgotPassword'));
const AdminUpdatePassword = lazy(() => import('./pages/admin/AdminUpdatePassword'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminNDRManager = lazy(() => import('./pages/admin/NDRManager'));
const AdminBulkShipments = lazy(() => import('./pages/admin/BulkShipments'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));
const AdminDesignRequests = lazy(() => import('./pages/admin/AdminDesignRequests'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

import ProtectedRoute from './components/admin/ProtectedRoute'
import ConditionalLayout from './components/ConditionalLayout'
const LoginBottomSheet = lazy(() => import('./components/LoginBottomSheet'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

// Defer non-critical utilities
import ScrollToTop from './components/ScrollToTop';
const VercelAnalytics = lazy(() => {
  return new Promise(resolve => {
    // Load Vercel analytics after main content renders
    requestIdleCallback?.(() => resolve(import('@vercel/analytics/react'))) 
      || setTimeout(() => resolve(import('@vercel/analytics/react')), 3000);
  }).then(mod => ({ default: () => <mod.Analytics /> }));
});
const VercelSpeedInsights = lazy(() => {
  return new Promise(resolve => {
    requestIdleCallback?.(() => resolve(import('@vercel/speed-insights/react')))
      || setTimeout(() => resolve(import('@vercel/speed-insights/react')), 3000);
  }).then(mod => ({ default: () => <mod.SpeedInsights /> }));
});

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <WishlistProvider>
      <SettingsProvider>
      <CategoryProvider>
      <CartProvider>
      <ProductProvider>
      <PincodeProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={null}><VercelSpeedInsights /></Suspense>
          <Suspense fallback={null}><VercelAnalytics /></Suspense>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin Routes — wrapped in AdminProvider */}
              <Route element={<AdminProvider><Outlet /></AdminProvider>}>
                <Route path="/sadmin/login" element={<AdminLogin />} />
                <Route path="/sadmin/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/sadmin/update-password" element={<AdminUpdatePassword />} />
                
                {/* Protected Admin Routes — registration requires existing admin auth */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/sadmin/register" element={<AdminRegister />} />
                  <Route path="/sadmin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/sadmin/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="returns-ndr" element={<AdminNDRManager />} />
                    <Route path="bulk-shipments" element={<AdminBulkShipments />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="design-requests" element={<AdminDesignRequests />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>
              </Route>

              {/* Public Routes — all wrapped in the shared layout */}
              <Route element={
                <div className="flex flex-col min-h-screen pb-16 md:pb-0 relative">
                  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-white focus:text-rose-900 focus:font-bold focus:shadow-xl top-0 left-0">Skip to content</a>
                  <Navbar />
                  <Suspense fallback={null}><ChatWidget /></Suspense>
                  <Suspense fallback={null}><LoginBottomSheet /></Suspense>
                  <main id="main-content" className="flex-grow focus:outline-none" tabIndex="-1">
                    <ConditionalLayout>
                      <Suspense fallback={<PageLoader />}>
                        <Outlet />
                      </Suspense>
                    </ConditionalLayout>
                  </main>
                </div>
              }>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/collections/:slug" element={<Collection />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/crochet-wali" element={<LandingPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/custom-design" element={<CustomDesign />} />
                <Route path="/support" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Navigate to="/login" replace />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-failed" element={<OrderFailed />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </PincodeProvider>
      </ProductProvider>
      </CartProvider>
      </CategoryProvider>
      </SettingsProvider>
      </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

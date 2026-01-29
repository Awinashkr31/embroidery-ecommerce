console.log('[DEBUG] 4. App File Executing');
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

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

// Lazy Load Page Components for Performance
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Shop = lazy(() => import('./pages/Shop'));

const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CustomDesign = lazy(() => import('./pages/CustomDesign'));
const MehndiBooking = lazy(() => import('./pages/MehndiBooking'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Admin Components
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminRegister = lazy(() => import('./pages/admin/AdminRegister'));
const AdminForgotPassword = lazy(() => import('./pages/admin/AdminForgotPassword'));
const AdminUpdatePassword = lazy(() => import('./pages/admin/AdminUpdatePassword'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const Reviews = lazy(() => import('./pages/admin/Reviews'));
const AdminDesignRequests = lazy(() => import('./pages/admin/AdminDesignRequests'));
const AdminBookings = lazy(() => import('./pages/admin/Bookings'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));

import ProtectedRoute from './components/admin/ProtectedRoute'

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
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/sadmin/login" element={<AdminLogin />} />
              <Route path="/sadmin/register" element={<AdminRegister />} />
              <Route path="/sadmin/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/sadmin/update-password" element={<AdminUpdatePassword />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/sadmin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/sadmin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="design-requests" element={<AdminDesignRequests />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Public Routes */}
              <Route path="*" element={
                <div className="flex flex-col min-h-screen pb-16 md:pb-0">
                  <Navbar />
                  <main className="flex-grow pt-20">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/shop" element={<Shop />} />

                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/custom-design" element={<CustomDesign />} />
                        <Route path="/mehndi-booking" element={<MehndiBooking />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/support" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <BottomNavigation />
                </div>
              } />
            </Routes>
          </Suspense>
        </Router>
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

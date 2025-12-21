import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'

import Register from './pages/Register'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import OrderSuccess from './pages/OrderSuccess'

// Page Components
import Home from './pages/Home'
import About from './pages/About'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import CustomDesign from './pages/CustomDesign'
import MehndiBooking from './pages/MehndiBooking'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

// Admin Components
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProductManager from './pages/admin/ProductManager'
import AdminOrders from './pages/admin/Orders'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminMessages from './pages/admin/Messages'
import AdminUsers from './pages/admin/Users'
import AdminNotifications from './pages/admin/AdminNotifications'
import Reviews from './pages/admin/Reviews'
import AdminDesignRequests from './pages/admin/AdminDesignRequests'
import AdminBookings from './pages/admin/Bookings'
import Settings from './pages/admin/Settings'

import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <WishlistProvider>
      <CartProvider>
      <ProductProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
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
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Public Routes */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-20">
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

                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </ProductProvider>
      </CartProvider>
      </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
